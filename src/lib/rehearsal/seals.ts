import { createHmac, timingSafeEqual, createHash } from "node:crypto";
import { z } from "zod";
import { normalizeClientIp } from "../coach/admission";
import { feedbackSchema, promptInstructions } from "./contract";
import { canonicalCase, goals, rubric, rehearsalVersions } from "./registry";
export const configurationHash = createHash("sha256")
  .update(
    JSON.stringify({
      case: canonicalCase(),
      goals,
      rubric,
      rehearsalVersions,
      model: "authored-fixture-1",
      mode: "simulation",
      schema: z.toJSONSchema(feedbackSchema),
      instructions: promptInstructions,
      settings: {
        candidateCount: 1,
        temperature: 0,
        thinking: "MINIMAL",
        maxOutputTokens: 1536,
      },
    }),
  )
  .digest("hex");
const payloadSchema = (configuration: string) =>
  z
    .object({
      kind: z.enum(["ticket", "receipt"]),
      caseId: z.literal("V01"),
      rehearsalId: z.uuid(),
      goalId: z.enum(["G01", "G02"]),
      configuration: z.literal(configuration),
      expires: z.number().int().positive(),
      requestId: z.uuid().optional(),
      originalMac: z
        .string()
        .regex(/^[a-f0-9]{64}$/)
        .optional(),
    })
    .strict();
export type Seal = z.infer<ReturnType<typeof payloadSchema>>;
export function mac(secret: string, domain: string, value: string) {
  if (secret.length < 32) throw new Error("configuration_required");
  return createHmac("sha256", secret)
    .update(`rehearsal:${domain}\n${value}`)
    .digest("hex");
}
export function seal(secret: string, payload: Seal) {
  const body = Buffer.from(
    JSON.stringify(payloadSchema(payload.configuration).parse(payload)),
  ).toString("base64url");
  return `${body}.${mac(secret, payload.kind, body)}`;
}
export function unseal(
  secret: string,
  token: string,
  kind: Seal["kind"],
  now: number,
  expectedConfiguration = configurationHash,
): Seal {
  const [body, signature, ...rest] = token.split(".");
  if (rest.length || !body || !/^[a-f0-9]{64}$/.test(signature ?? ""))
    throw new Error("invalid_signature");
  const expected = Buffer.from(mac(secret, kind, body), "hex"),
    actual = Buffer.from(signature, "hex");
  if (!timingSafeEqual(expected, actual)) throw new Error("invalid_signature");
  const value = payloadSchema(expectedConfiguration).parse(
    JSON.parse(Buffer.from(body, "base64url").toString()),
  );
  if (value.kind !== kind || value.expires <= now)
    throw new Error("rehearsal_expired");
  if (kind === "receipt" && (!value.requestId || !value.originalMac))
    throw new Error("invalid_receipt");
  return value;
}
export function checkOriginal(secret: string, original: string, receipt: Seal) {
  const expected = Buffer.from(mac(secret, "original", original), "hex"),
    actual = Buffer.from(receipt.originalMac ?? "", "hex");
  return actual.length === expected.length && timingSafeEqual(expected, actual);
}

export function clientPseudonym(secret: string, ip: string, now: number) {
  const normalized = normalizeClientIp(ip);
  if (!normalized || !Number.isFinite(now)) throw new Error("invalid_client");
  return mac(secret, "client", `${Math.floor(now / 86400000)}\n${normalized}`);
}
