import { randomUUID } from "node:crypto";
import { describe, expect, it, vi } from "vitest";
import { configurationHash } from "./gemini";
import { geminiModel, publicNoticeVersion } from "./contract";
import { handlePublicCoach, publicConfig, publicOrigin, publicReleaseId, type PublicConfig } from "./public-service";

const config: PublicConfig = {
  enabled: true, production: true, apiKey: "synthetic-provider-test-key-only", reviewedHash: configurationHash(),
  costAcknowledgement: "estimated-reservations-not-invoice-cap",
  store: { url: "https://synthetic.upstash.io/", token: "synthetic-store-token-only", hmacSecret: "synthetic-hmac-secret-for-tests-only", releaseId: publicReleaseId, fingerprint: configurationHash(), maxAttempts: 60, maxCents: 100 },
};
const valid = () => ({ variantId: "V01", catalogVersion: "sim-1", rulesVersion: "sim-1", contentVersion: "sim-1", noticeVersion: publicNoticeVersion, consent: true, requestId: randomUUID() });
function request(patch = {}, headers = {}) {
  return new Request(`${publicOrigin}/api/coach`, { method: "POST", headers: { origin: publicOrigin, "content-type": "application/json", "x-vercel-forwarded-for": "192.0.2.1", ...headers }, body: JSON.stringify({ ...valid(), ...patch }) });
}
function fixtures() {
  const store = vi.fn<typeof fetch>(async (_url, options) => {
    const command = JSON.parse(String(options?.body));
    if (command[2] === "2") { return Response.json({ result: [1, 1, 1] }); }
    return Response.json({ result: 1 });
  });
  const provider = vi.fn<typeof fetch>(async (_url, options) => {
    expect(store).toHaveBeenCalled();
    expect(String(options?.body)).not.toContain(config.apiKey!);
    return Response.json({ modelVersion: geminiModel, candidates: [{ finishReason: "STOP", content: { role: "model", parts: [{ text: JSON.stringify({ summary: "This fixed fictional example concerns general learning.", questions: ["What would I like to learn?", "How can I organize questions?", "Which resources could we discuss?"] }) }] } }], usageMetadata: { promptTokenCount: 700, candidatesTokenCount: 100, thoughtsTokenCount: 5, totalTokenCount: 805 } });
  });
  return { store, provider };
}
describe("public Gemini boundary", () => {
  it("reserves before the only provider call and settles before returning a draft", async () => {
    const deps = fixtures(), req = request(), id = (await req.clone().json()).requestId;
    const response = await handlePublicCoach(req, config, deps);
    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({ requestId: id, noticeVersion: publicNoticeVersion, provider: "google", model: geminiModel });
    expect(deps.provider).toHaveBeenCalledTimes(1); expect(deps.store).toHaveBeenCalledTimes(2);
    expect(response.headers.get("cache-control")).toBe("private, no-store");
  });
  it.each(["V02", "V07", "V08", "V12", "other"])("denies %s before the store or provider", async variantId => {
    const deps = fixtures(); expect((await handlePublicCoach(request({ variantId }), config, deps)).status).toBe(403);
    expect(deps.store).not.toHaveBeenCalled(); expect(deps.provider).not.toHaveBeenCalled();
  });
  it.each([{ consent: false }, { noticeVersion: "stale" }, { answers: "real health details must never reach a provider" }, { prompt: "user supplied prompt" }, { requestId: "bad" }])("rejects consent, stale versions and arbitrary personal payloads %j", async patch => {
    const deps = fixtures(); expect((await handlePublicCoach(request(patch), config, deps)).status).not.toBe(200);
    expect(deps.store).not.toHaveBeenCalled(); expect(deps.provider).not.toHaveBeenCalled();
  });
  it.each([{ enabled: false }, { production: false }, { apiKey: "" }, { reviewedHash: "stale" }, { costAcknowledgement: "" }, { store: undefined }])("denies incomplete activation %j", async patch => {
    const deps = fixtures(); expect((await handlePublicCoach(request(), { ...config, ...patch }, deps)).status).toBe(503);
    expect(deps.store).not.toHaveBeenCalled(); expect(deps.provider).not.toHaveBeenCalled();
  });
  it.each(["https://evil.example", "null", "http://127.0.0.1:3000"])("rejects origin %s", async origin => {
    const deps = fixtures(); expect((await handlePublicCoach(request({}, { origin }), config, deps)).status).toBe(403);
    expect(deps.store).not.toHaveBeenCalled(); expect(deps.provider).not.toHaveBeenCalled();
  });
  it("rejects an oversized body before admission", async () => {
    const deps = fixtures(); expect((await handlePublicCoach(request({ extra: "x".repeat(1025) }), config, deps)).status).toBe(413);
    expect(deps.store).not.toHaveBeenCalled(); expect(deps.provider).not.toHaveBeenCalled();
  });
  it.each([0, -1, -2, -3, -4])("does not dispatch when the store denies %s", async code => {
    const deps = fixtures(); deps.store.mockImplementation(async () => Response.json({ result: [code, 0, 0] }));
    expect((await handlePublicCoach(request(), config, deps)).status).toBe(code === 0 || code === -3 || code === -4 ? 429 : 503);
    expect(deps.provider).not.toHaveBeenCalled();
  });
  it("pauses the shared release on unknown provider usage without refund or retry", async () => {
    const deps = fixtures(); deps.provider.mockImplementation(async () => { throw new Error("network"); });
    expect((await handlePublicCoach(request(), config, deps)).status).toBe(503);
    expect(deps.provider).toHaveBeenCalledTimes(1);
    const settlement = JSON.parse(String(deps.store.mock.calls[1][1]?.body));
    expect(settlement.at(-1)).toBe("0");
  });
  it("does not return a draft when settlement is uncertain", async () => {
    const deps = fixtures(); deps.store.mockImplementationOnce(async () => Response.json({ result: [1, 1, 1] })).mockImplementation(async () => Response.json({ result: 0 }));
    const response = await handlePublicCoach(request(), config, deps);
    expect(response.status).toBe(503); expect(await response.json()).toMatchObject({ code: "reconciliation_required" });
    expect(deps.provider).toHaveBeenCalledTimes(1);
  });
  it("always disables actual dispatch in CI, preview and exports", () => {
    const env = { AI_COACH_ENABLED: "1", VERCEL: "1", VERCEL_ENV: "production" };
    expect(publicConfig({ ...env, CI: "true" }).enabled).toBe(false);
    expect(publicConfig({ ...env, NURTUREPATH_STATIC_PREVIEW: "1" }).enabled).toBe(false);
    expect(publicConfig({ ...env, VERCEL_ENV: "preview" }).production).toBe(false);
    expect(publicConfig({ ...env, VERCEL: "" }).production).toBe(false);
  });
});
