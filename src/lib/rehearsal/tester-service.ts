import { createHmac } from "node:crypto";
import { isIP } from "node:net";
import { RedisAdmission, AdmissionError } from "./admission";
import { RehearsalCore } from "./service";
import {
  generateTesterRehearsal,
  liveProfile,
  liveHash,
  liveEnvelopeSchema,
} from "./gemini";
import { supportedRegions } from "./regions";
export const testerRelease = "gemini-testers-1";
export type TesterConfig = {
  enabled: boolean;
  production: boolean;
  origin: string;
  key?: string;
  secret?: string;
  redisUrl?: string;
  redisToken?: string;
  reviewedHash?: string;
};
export function testerConfig(
  env: Record<string, string | undefined> = process.env,
): TesterConfig {
  return {
    enabled:
      env.REHEARSAL_TESTERS_ENABLED === "1" &&
      !env.CI &&
      !env.NURTUREPATH_STATIC_PREVIEW,
    production: env.VERCEL === "1" && env.VERCEL_ENV === "production",
    origin: "https://nurturepath-demo.vercel.app",
    key: env.GEMINI_API_KEY,
    secret:
      env.COACH_LIMITER_HMAC_SECRET &&
      env.COACH_LIMITER_HMAC_SECRET.length >= 32
        ? createHmac("sha256", env.COACH_LIMITER_HMAC_SECRET)
            .update("nurturepath-tester-signing-1")
            .digest("hex")
        : undefined,
    redisUrl: env.COACH_KV_REST_API_URL ?? env.UPSTASH_REDIS_REST_URL,
    redisToken: env.COACH_KV_REST_API_TOKEN ?? env.UPSTASH_REDIS_REST_TOKEN,
    reviewedHash: env.REHEARSAL_TESTER_CONFIG_HASH,
  };
}
const headers = {
  "Cache-Control": "private, no-store",
  "Referrer-Policy": "no-referrer",
  "X-Content-Type-Options": "nosniff",
};
export async function handleTester(
  request: Request,
  kind: "start" | "feedback",
  config: TesterConfig,
  dependencies: { store?: typeof fetch; provider?: typeof fetch } = {},
) {
  const error = (code: string, status: number) =>
    Response.json({ error: code }, { status, headers });
  if (!config.enabled || !config.production) return error("disabled", 503);
  const url = new URL(request.url);
  if (
    url.origin !== config.origin ||
    request.headers.get("origin") !== config.origin ||
    request.headers.get("host") !== new URL(config.origin).host
  )
    return error("origin_required", 403);
  if (
    !config.secret ||
    config.secret.length < 32 ||
    !config.key ||
    config.key.length < 20 ||
    config.reviewedHash !== liveHash ||
    !config.redisUrl ||
    !config.redisToken
  )
    return error("configuration_required", 503);
  if (!supportedRegions.has(request.headers.get("x-vercel-ip-country") ?? ""))
    return error("unsupported_region", 403);
  const ip = request.headers.get("x-vercel-forwarded-for") ?? "";
  if (!isIP(ip)) return error("client_required", 403);
  if (!request.headers.get("content-type")?.startsWith("application/json"))
    return error("invalid_request", 400);
  const redis = new URL(config.redisUrl);
  if (
    redis.protocol !== "https:" ||
    !redis.hostname.endsWith(".upstash.io") ||
    redis.username ||
    redis.password ||
    redis.search ||
    redis.hash ||
    redis.pathname !== "/" ||
    redis.port
  )
    return error("configuration_required", 503);
  const client = createHmac("sha256", config.secret)
    .update(new Date().toISOString().slice(0, 10))
    .update("\0")
    .update(ip)
    .digest("hex");
  const command = async (args: (string | number)[]) => {
    const response = await (dependencies.store ?? fetch)(redis, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.redisToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(args),
      cache: "no-store",
      redirect: "error",
      signal: AbortSignal.timeout(3500),
    });
    if (!response.ok) throw new Error("store_unavailable");
    const body = await response.json();
    if (body.error) throw new Error("store_unavailable");
    return body.result;
  };
  const service = new RehearsalCore(
    new RedisAdmission(command, liveHash, testerRelease),
    config.secret,
    (ctx) => generateTesterRehearsal(config.key!, ctx, dependencies.provider),
    () => Date.now(),
    liveProfile,
  );
  let bytes = 0;
  const chunks: Uint8Array[] = [];
  const reader = request.body?.getReader();
  if (!reader) return error("invalid_request", 400);
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      if (bytes > (kind === "start" ? 1024 : 8192)) {
        await reader.cancel();
        return error("too_large", 413);
      }
      chunks.push(value);
    }
    const body = JSON.parse(
      new TextDecoder("utf-8", { fatal: true }).decode(Buffer.concat(chunks)),
    );
    const value =
      kind === "start"
        ? await service.start(body, client)
        : liveEnvelopeSchema.parse(await service.execute(body, client));
    return Response.json(value, { headers });
  } catch (e) {
    const code = e instanceof AdmissionError ? e.code : "invalid_request";
    return error(
      code,
      ["rate_limited", "busy", "session_limit", "exhausted"].includes(code)
        ? 429
        : ["stale_round", "rehearsal_closed", "duplicate_request"].includes(
              code,
            )
          ? 409
          : code === "rehearsal_expired"
            ? 410
            : [
                  "reconciliation_required",
                  "configuration_required",
                  "disabled",
                ].includes(code)
              ? 503
              : 400,
    );
  } finally {
    reader.releaseLock();
  }
}
