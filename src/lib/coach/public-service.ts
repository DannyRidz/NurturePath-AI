import { z } from "zod";
import { admitPublicCoach, settlePublicCoach, type AdmissionConfig } from "./admission";
import { configurationHash, publicGeminiRequestBody, generatePublicGemini, GeminiFailure } from "./gemini";
import { geminiModel, publicDraftShape, publicNoticeVersion, requestShape } from "./contract";

export const publicOrigin = "https://nurturepath-demo.vercel.app";
export const publicReleaseId = "gemini-public-1";
export type PublicConfig = { enabled: boolean; production: boolean; apiKey?: string; reviewedHash?: string; costAcknowledgement?: string; store?: AdmissionConfig };
export function publicConfig(env: Record<string, string | undefined> = process.env): PublicConfig {
  return {
    enabled: env.AI_COACH_ENABLED === "1" && env.NURTUREPATH_STATIC_PREVIEW !== "1" && !env.CI,
    production: env.VERCEL === "1" && env.VERCEL_ENV === "production",
    apiKey: env.GEMINI_API_KEY, reviewedHash: env.COACH_REVIEWED_CONFIG_HASH,
    costAcknowledgement: env.COACH_COST_RISK_ACK,
    store: {
      url: env.COACH_KV_REST_API_URL ?? env.UPSTASH_REDIS_REST_URL ?? "", token: env.COACH_KV_REST_API_TOKEN ?? env.UPSTASH_REDIS_REST_TOKEN ?? "",
      hmacSecret: env.COACH_LIMITER_HMAC_SECRET ?? "", releaseId: publicReleaseId,
      fingerprint: configurationHash(), maxAttempts: 60, maxCents: 100,
    },
  };
}
const headers = { "Cache-Control": "private, no-store", "X-Content-Type-Options": "nosniff" };
function unavailable(status: number, code: string, requestId?: string) {
  return Response.json({ status: "unavailable", code, ...(requestId ? { requestId } : {}) }, { status, headers });
}
export async function handlePublicCoach(request: Request, config: PublicConfig, dependencies: { provider?: typeof fetch; store?: typeof fetch } = {}) {
  if (!config.enabled || !config.production) return unavailable(503, "disabled");
  if (request.method !== "POST") return unavailable(405, "method_not_allowed");
  if (request.headers.get("origin") !== publicOrigin || new URL(request.url).origin !== publicOrigin) return unavailable(403, "origin_required");
  if (request.headers.get("content-type")?.split(";")[0].trim() !== "application/json") return unavailable(400, "json_required");
  const reader = request.body?.getReader();
  if (!reader) return unavailable(400, "invalid_request");
  const chunks: Uint8Array[] = []; let bytes = 0;
  let timer: ReturnType<typeof setTimeout> | undefined;
  const deadline = new Promise<never>((_, reject) => { timer = setTimeout(() => reject(new Error("deadline")), 2_000); });
  let input;
  try {
    while (true) {
      const chunk = await Promise.race([reader.read(), deadline]);
      if (chunk.done) break;
      bytes += chunk.value.byteLength;
      if (bytes > 1024) return unavailable(413, "too_large");
      chunks.push(chunk.value);
    }
    input = requestShape.parse(JSON.parse(Buffer.concat(chunks).toString("utf8")));
  } catch { return unavailable(400, "invalid_request"); }
  finally { clearTimeout(timer); void reader.cancel().catch(() => {}); }
  const id = input.requestId;
  if (!input.consent || input.variantId !== "V01") return unavailable(403, "ineligible", id);
  if ([input.catalogVersion, input.rulesVersion, input.contentVersion].some(v => v !== "sim-1") || input.noticeVersion !== publicNoticeVersion) return unavailable(409, "stale_version", id);
  if (!config.apiKey || config.apiKey.length < 20 || config.reviewedHash !== configurationHash() ||
      config.costAcknowledgement !== "estimated-reservations-not-invoice-cap" || !config.store ||
      config.store.releaseId !== publicReleaseId || config.store.fingerprint !== configurationHash() ||
      config.store.maxAttempts !== 60 || config.store.maxCents !== 100 || Buffer.byteLength(publicGeminiRequestBody()) > 8192) return unavailable(503, "configuration_required", id);
  // Trust this header only behind the direct Vercel production origin checked above.
  const admission = await admitPublicCoach(config.store, request.headers.get("x-vercel-forwarded-for"), dependencies.store);
  if (admission.status !== "admitted") return unavailable(["exhausted", "rate_limited", "busy"].includes(admission.status) ? 429 : 503, admission.status, id);
  let success = false;
  try {
    const { output, usage } = await generatePublicGemini(config.apiKey, { maxInputTokens: 16384 }, dependencies.provider);
    // Usage is observed after billing. This is an estimate check, never an invoice cap.
    const estimate = (usage.inputTokens * 0.25 + (usage.outputTokens + usage.thinkingTokens) * 1.5) / 1e6;
    if (estimate >= 0.01) throw new Error("usage_review_required");
    const body = publicDraftShape.parse({ status: "draft", requestId: id, variantId: "V01", catalogVersion: "sim-1", rulesVersion: "sim-1", contentVersion: "sim-1", noticeVersion: publicNoticeVersion, promptVersion: "coach-gemini-prompt-2", provider: "google", model: geminiModel, generatedAt: new Date().toISOString(), ...output, usage });
    success = await settlePublicCoach(config.store, admission.attempts, true, dependencies.store);
    if (!success) return unavailable(503, "reconciliation_required", id);
    return Response.json(body, { headers });
  } catch (failure) {
    return unavailable(failure instanceof GeminiFailure && failure.code === "deadline" ? 504 : 503, "provider_unavailable", id);
  } finally {
    if (!success) {
      // Unknown usage, invalid output or a crash must not silently reopen dispatch.
      // A failed write leaves pending state, which also prevents new admissions.
      try { await settlePublicCoach(config.store, admission.attempts, false, dependencies.store); } catch { /* fail closed */ }
    }
  }
}

// Use only for presenting availability. Endpoint admission remains authoritative.
export function publicCoachConfigured(config = publicConfig()) {
  return config.enabled && config.production && config.apiKey && config.apiKey.length >= 20 &&
    config.reviewedHash === configurationHash() && config.costAcknowledgement === "estimated-reservations-not-invoice-cap" &&
    z.string().url().safeParse(config.store?.url).success && !!config.store?.token && !!config.store?.hmacSecret;
}
