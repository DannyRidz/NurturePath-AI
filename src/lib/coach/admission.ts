import { createHmac } from "node:crypto";
import { isIP } from "node:net";
import { z } from "zod";

// One primary-side operation. Reservations persist across deployments and errors.
// The operator initializes the budget; a request must never recreate missing state.
export const admissionScript = `
local state = redis.call('HMGET', KEYS[1], 'enabled', 'fingerprint', 'maxAttempts', 'maxCents', 'attempts', 'reservedCents')
if not state[1] or not state[2] then return {-2, 0, 0} end
if state[1] == 'pending' then return {-4, 0, 0} end
if state[1] ~= '1' then return {-1, 0, 0} end
local maxAttempts, maxCents = tonumber(state[3]), tonumber(state[4])
local attempts, cents = tonumber(state[5]), tonumber(state[6])
if state[2] ~= ARGV[1] or not maxAttempts or not maxCents or not attempts or not cents then return {-2, 0, 0} end
if maxAttempts ~= tonumber(ARGV[2]) or maxCents ~= tonumber(ARGV[3]) or attempts < 0 or cents < 0 or attempts ~= math.floor(attempts) or cents ~= attempts then return {-2, 0, 0} end
if attempts >= maxAttempts or cents + 1 > maxCents then return {0, attempts, cents} end
local now = tonumber(redis.call('TIME')[1])
if math.floor(now / 86400) ~= tonumber(ARGV[4]) then return {-2, 0, 0} end
local minute = math.floor(now / 60)
local rate = redis.call('HMGET', KEYS[2], 'minute', 'count')
local count = 0
if (rate[1] and not tonumber(rate[1])) or (rate[1] and not rate[2]) or (rate[2] and not rate[1]) then return {-2, 0, 0} end
if rate[1] and tonumber(rate[1]) == minute then
  count = tonumber(rate[2])
  if not count or count < 0 or count ~= math.floor(count) then return {-2, 0, 0} end
end
if count >= 10 then return {-3, attempts, cents} end
redis.call('HSET', KEYS[1], 'attempts', attempts + 1, 'reservedCents', cents + 1, 'enabled', 'pending')
redis.call('HSET', KEYS[2], 'minute', minute, 'count', count + 1)
redis.call('EXPIREAT', KEYS[2], (minute + 1) * 60 + 60)
return {1, attempts + 1, cents + 1}
`;

const configuration = z.object({
  url: z.url().refine(value => {
    const u = new URL(value);
    return u.protocol === "https:" && u.hostname.endsWith(".upstash.io") &&
      !u.username && !u.password && !u.search && !u.hash && u.pathname === "/" && !u.port;
  }),
  token: z.string().min(20),
  hmacSecret: z.string().min(32),
  releaseId: z.string().regex(/^[a-z0-9][a-z0-9-]{0,63}$/),
  fingerprint: z.string().regex(/^[a-f0-9]{64}$/),
  maxAttempts: z.number().int().positive().max(100_000),
  maxCents: z.number().int().positive().max(100_000),
}).strict();

export type AdmissionConfig = z.infer<typeof configuration>;
export type Admission =
  | { status: "admitted"; attempts: number; reservedCents: number }
  | { status: "exhausted" | "disabled" | "rate_limited" | "busy" | "unavailable" };

export function normalizeClientIp(value: string | null): string | null {
  if (!value || value.includes(",") || value.includes("%") || value.trim() !== value || !isIP(value)) return null;
  if (isIP(value) === 4) return value;
  const normalized = new URL(`http://[${value}]/`).hostname.slice(1, -1);
  const mapped = normalized.match(/^::ffff:([a-f0-9]+):([a-f0-9]+)$/);
  if (mapped) {
    const a = parseInt(mapped[1], 16), b = parseInt(mapped[2], 16);
    return `${a >> 8}.${a & 255}.${b >> 8}.${b & 255}`;
  }
  return normalized;
}

export async function admitPublicCoach(
  input: AdmissionConfig,
  clientIp: string | null,
  transport: typeof fetch = fetch,
  now = Date.now(),
): Promise<Admission> {
  const parsed = configuration.safeParse(input), ip = normalizeClientIp(clientIp);
  if (!parsed.success || !ip || !Number.isFinite(now)) return { status: "unavailable" };
  const config = parsed.data, day = Math.floor(now / 86_400_000);
  const pseudonym = createHmac("sha256", config.hmacSecret).update(`${day}\n${ip}`).digest("hex");
  const prefix = `{nurturepath-coach}:${config.releaseId}`;
  const command = ["EVAL", admissionScript, "2", `${prefix}:budget`, `${prefix}:ip:${pseudonym}`,
    config.fingerprint, String(config.maxAttempts), String(config.maxCents), String(day)];
  try {
    const raw = await redisCommand(config, command, transport);
    const envelope = z.object({ result: z.tuple([z.number().int(), z.number().int().nonnegative(), z.number().int().nonnegative()]) }).strict()
      .parse(raw);
    const [code, attempts, reservedCents] = envelope.result;
    if (code === 1 && attempts >= 1 && attempts <= config.maxAttempts && reservedCents === attempts && reservedCents <= config.maxCents)
      return { status: "admitted", attempts, reservedCents };
    if (code === 0) return { status: "exhausted" };
    if (code === -1) return { status: "disabled" };
    if (code === -4) return { status: "busy" };
    if (code === -3) return { status: "rate_limited" };
    return { status: "unavailable" };
  } catch {
    // A lost response may already have consumed a reservation. Never retry it.
    return { status: "unavailable" };
  }
}

export async function redisCommand(config: Pick<AdmissionConfig, "url" | "token">, command: (string | number)[], transport: typeof fetch = fetch): Promise<unknown> {
  const controller = new AbortController();
  let timer: ReturnType<typeof setTimeout> | undefined;
  let reader: ReadableStreamDefaultReader<Uint8Array> | undefined;
  const deadline = new Promise<never>((_, reject) => {
    timer = setTimeout(() => { controller.abort(); reject(new Error("deadline")); }, 2_000);
  });
  try {
    const response = await Promise.race([transport(config.url, {
      method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${config.token}` },
      body: JSON.stringify(command), redirect: "error", cache: "no-store", signal: controller.signal,
    }), deadline]);
    if (!response.ok || !response.headers.get("content-type")?.startsWith("application/json")) throw new Error("store_unavailable");
    reader = response.body?.getReader();
    if (!reader) throw new Error("store_unavailable");
    const chunks: Uint8Array[] = []; let bytes = 0;
    while (true) {
      const chunk = await Promise.race([reader.read(), deadline]);
      if (chunk.done) break;
      bytes += chunk.value.byteLength;
      if (bytes > 4096) throw new Error("store_unavailable");
      chunks.push(chunk.value);
    }
    return JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } finally {
    clearTimeout(timer); controller.abort();
    void reader?.cancel().catch(() => {});
  }
}

const settlementScript = `
local state = redis.call('HMGET', KEYS[1], 'enabled', 'fingerprint', 'attempts')
if state[1] ~= 'pending' or state[2] ~= ARGV[1] or state[3] ~= ARGV[2] then return 0 end
redis.call('HSET', KEYS[1], 'enabled', ARGV[3])
return 1
`;
export async function settlePublicCoach(config: AdmissionConfig, attempt: number, success: boolean, transport: typeof fetch = fetch) {
  const parsed = configuration.parse(config);
  const raw = await redisCommand(parsed, ["EVAL", settlementScript, "1", `{nurturepath-coach}:${parsed.releaseId}:budget`, parsed.fingerprint, String(attempt), success ? "1" : "0"], transport);
  return z.object({ result: z.literal(1) }).strict().safeParse(raw).success;
}
