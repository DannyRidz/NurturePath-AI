import { describe, expect, it, vi } from "vitest";
import { admitPublicCoach, normalizeClientIp, type AdmissionConfig } from "./admission";

const config: AdmissionConfig = {
  url: "https://synthetic.upstash.io/", token: "synthetic-test-token-only", hmacSecret: "synthetic-test-secret-for-hmac-only",
  releaseId: "synthetic-release-1", fingerprint: "a".repeat(64), maxAttempts: 60, maxCents: 100,
};
const response = (result: unknown) => Response.json({ result });
const transport = (result: unknown) => vi.fn<typeof fetch>(async () => response(result));

describe("public shared admission transport", () => {
  it("admits only a confirmed consistent reservation and sends no raw IP", async () => {
    const send = transport([1, 2, 2]);
    expect(await admitPublicCoach(config, "192.0.2.1", send, 1_800_000_000_000)).toEqual({ status: "admitted", attempts: 2, reservedCents: 2 });
    expect(send).toHaveBeenCalledTimes(1);
    const [url, options] = send.mock.calls[0];
    expect(url).toBe(config.url);
    expect(options).toMatchObject({ method: "POST", redirect: "error", cache: "no-store" });
    const command = JSON.parse(options!.body as string);
    expect(command.slice(0, 1)).toEqual(["EVAL"]);
    expect(command[3]).toBe("{nurturepath-coach}:synthetic-release-1:budget");
    expect(command[4]).toMatch(/:ip:[a-f0-9]{64}$/);
    expect(options!.body).not.toContain("192.0.2.1");
    expect(options!.body).not.toContain(config.hmacSecret);
    expect(options!.body).not.toContain(config.token);
  });
  it.each([[0, "exhausted"], [-1, "disabled"], [-2, "unavailable"], [-3, "rate_limited"], [7, "unavailable"]])("maps rejection %s without retry", async (code, status) => {
    const send = transport([code, 0, 0]);
    expect(await admitPublicCoach(config, "192.0.2.1", send)).toEqual({ status });
    expect(send).toHaveBeenCalledTimes(1);
  });
  it.each([[1, 61, 61], [1, 0, 0], [1, 2, 1], [1, -1, -1], [1, 1.5, 1.5], [1], null].map(result => [result]))("rejects corrupt results %j", async result => {
    expect(await admitPublicCoach(config, "192.0.2.1", transport(result))).toEqual({ status: "unavailable" });
  });
  it.each([null, "", "192.0.2.1, 192.0.2.2", " 192.0.2.1", "garbage", "fe80::1%en0"]) ("rejects absent or ambiguous metadata %s before the store", async ip => {
    const send = transport([1, 1, 1]);
    expect(await admitPublicCoach(config, ip, send)).toEqual({ status: "unavailable" });
    expect(send).not.toHaveBeenCalled();
  });
  it("normalizes IPv6 and mapped IPv4 so equivalent forms share a counter", () => {
    expect(normalizeClientIp("2001:0db8:0000::1")).toBe("2001:db8::1");
    expect(normalizeClientIp("::ffff:192.0.2.1")).toBe("192.0.2.1");
  });
  it("rotates daily pseudonyms while keeping the lifetime budget key", async () => {
    const send = transport([1, 1, 1]);
    await admitPublicCoach(config, "192.0.2.1", send, 1_800_000_000_000);
    await admitPublicCoach(config, "192.0.2.1", send, 1_800_086_400_000);
    const bodies = send.mock.calls.map(([, options]) => JSON.parse(options!.body as string));
    expect(bodies[0][3]).toBe(bodies[1][3]);
    expect(bodies[0][4]).not.toBe(bodies[1][4]);
  });
  it.each(["http://synthetic.upstash.io/", "https://synthetic.upstash.io.evil.test/", "https://synthetic.upstash.io/?token=x", "https://synthetic.upstash.io/command"]) ("rejects unsafe store URLs %s", async url => {
    const send = transport([1, 1, 1]);
    expect(await admitPublicCoach({ ...config, url }, "192.0.2.1", send)).toEqual({ status: "unavailable" });
    expect(send).not.toHaveBeenCalled();
  });
  it("never retries after an uncertain reservation", async () => {
    const send = vi.fn<typeof fetch>(async () => { throw new Error("lost response after commit"); });
    expect(await admitPublicCoach(config, "192.0.2.1", send)).toEqual({ status: "unavailable" });
    expect(send).toHaveBeenCalledTimes(1);
  });
  it("bounds the whole response deadline even if transport ignores AbortSignal", async () => {
    vi.useFakeTimers();
    try {
      const send = vi.fn<typeof fetch>(() => new Promise(() => {}));
      const pending = admitPublicCoach(config, "192.0.2.1", send);
      await vi.advanceTimersByTimeAsync(2_001);
      expect(await pending).toEqual({ status: "unavailable" });
      expect(send).toHaveBeenCalledTimes(1);
    } finally { vi.useRealTimers(); }
  });
  it("rejects oversized and service error envelopes", async () => {
    for (const value of [{ result: [1, 1, 1], extra: "x".repeat(5000) }, { error: "unavailable" }]) {
      const send = vi.fn<typeof fetch>(async () => Response.json(value));
      expect(await admitPublicCoach(config, "192.0.2.1", send)).toEqual({ status: "unavailable" });
    }
  });
});
