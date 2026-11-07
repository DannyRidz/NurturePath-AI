import { spawn, execFile } from "node:child_process";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { promisify } from "node:util";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { admitPublicCoach, redisCommand, settlePublicCoach, type AdmissionConfig } from "./admission";
const execute = promisify(execFile);
const server = process.env.REDIS_SERVER_BIN, cli = process.env.REDIS_CLI_BIN;
describe.skipIf(!server || !cli)("real Redis atomic admission", () => {
  let directory: string, socket: string, child: ReturnType<typeof spawn>;
  async function command(args: (string | number)[]) {
    const { stdout } = await execute(cli!, ["-s", socket, "--json", ...args.map(String)]);
    return JSON.parse(stdout);
  }
  const transport: typeof fetch = async (_url, options) => Response.json({ result: await command(JSON.parse(String(options?.body))) });
  const config = (suffix: string): AdmissionConfig => ({ url: "https://synthetic.upstash.io/", token: "synthetic-store-token-only", hmacSecret: "synthetic-hmac-secret-for-tests-only", releaseId: `test-${suffix}`, fingerprint: "a".repeat(64), maxAttempts: 60, maxCents: 100 });
  const key = (c: AdmissionConfig) => `{nurturepath-coach}:${c.releaseId}:budget`;
  const init = (c: AdmissionConfig, attempts = 0) => command(["HSET", key(c), "enabled", "1", "fingerprint", c.fingerprint, "maxAttempts", 60, "maxCents", 100, "attempts", attempts, "reservedCents", attempts]);
  beforeAll(async () => {
    directory = await mkdtemp(join(tmpdir(), "np-redis-")); socket = join(directory, "redis.sock");
    child = spawn(server!, ["--port", "0", "--unixsocket", socket, "--save", "", "--appendonly", "no", "--dir", directory], { stdio: "ignore" });
    for (let i = 0; i < 100; i++) {
      try { if (await command(["PING"]) === "PONG") return; } catch { /* server starting */ }
      await new Promise(resolve => setTimeout(resolve, 20));
    }
    throw new Error("Local Redis did not start");
  });
  afterAll(async () => {
    if (child) { const exited = new Promise(resolve => child.once("exit", resolve)); child.kill("SIGTERM"); await exited; }
    if (directory) await rm(directory, { recursive: true, force: true });
  });
  it("admits exactly one of twenty concurrent requests and preserves the counter", async () => {
    const c = config("concurrency"); await init(c);
    const outcomes = await Promise.all(Array.from({ length: 20 }, () => admitPublicCoach(c, "192.0.2.1", transport)));
    expect(outcomes.filter(o => o.status === "admitted")).toHaveLength(1);
    expect(outcomes.filter(o => o.status === "busy")).toHaveLength(19);
    expect(await command(["HMGET", key(c), "attempts", "reservedCents", "enabled"])).toEqual(["1", "1", "pending"]);
    expect(await settlePublicCoach(c, 1, true, transport)).toBe(true);
    expect((await admitPublicCoach({ ...c }, "192.0.2.2", transport)).status).toBe("admitted");
  });
  it("never exceeds the lifetime allowance across instances", async () => {
    const c = config("budget"); await init(c, 59);
    const first = await admitPublicCoach(c, "192.0.2.1", transport); expect(first.status).toBe("admitted");
    await settlePublicCoach(c, 60, true, transport);
    const outcomes = await Promise.all(Array.from({ length: 20 }, (_, i) => admitPublicCoach(c, `192.0.2.${i + 1}`, transport)));
    expect(outcomes.every(o => o.status === "exhausted")).toBe(true);
    expect(await command(["HMGET", key(c), "attempts", "reservedCents"])).toEqual(["60", "60"]);
  });
  it("preserves operator shutdown even when the pending attempt succeeds", async () => {
    const c = config("shutdown"); await init(c); await admitPublicCoach(c, "192.0.2.1", transport);
    await command(["HSET", key(c), "enabled", "0"]);
    expect(await settlePublicCoach(c, 1, true, transport)).toBe(false);
    expect((await admitPublicCoach(c, "192.0.2.2", transport)).status).toBe("disabled");
    expect(await command(["HGET", key(c), "attempts"])).toBe("1");
  });
  it("pauses on failure, and a missing or corrupt ledger cannot reset itself", async () => {
    const c = config("failure");
    expect((await admitPublicCoach(c, "192.0.2.1", transport)).status).toBe("unavailable");
    await init(c); await admitPublicCoach(c, "192.0.2.1", transport); await settlePublicCoach(c, 1, false, transport);
    expect((await admitPublicCoach(c, "192.0.2.1", transport)).status).toBe("disabled");
    await command(["HSET", key(c), "enabled", "1", "reservedCents", "0"]);
    expect((await admitPublicCoach(c, "192.0.2.1", transport)).status).toBe("unavailable");
    expect(await command(["HGET", key(c), "attempts"])).toBe("1");
  });
  it("enforces ten admissions in the Redis minute and expires only rate metadata", async () => {
    const c = config("rate"); await init(c);
    for (let n = 1; n <= 10; n++) {
      expect((await admitPublicCoach(c, "192.0.2.1", transport)).status).toBe("admitted");
      expect(await settlePublicCoach(c, n, true, transport)).toBe(true);
    }
    expect((await admitPublicCoach(c, "192.0.2.1", transport)).status).toBe("rate_limited");
    const keys: string[] = await command(["KEYS", `{nurturepath-coach}:${c.releaseId}:ip:*`]);
    expect(keys).toHaveLength(1); expect(keys[0]).not.toContain("192.0.2.1");
    expect(await command(["TTL", keys[0]])).toBeGreaterThan(0);
    expect(await command(["TTL", key(c)])).toBe(-1);
  });
  it("rejects mismatched frozen configuration without mutation", async () => {
    const c = config("fingerprint"); await init(c);
    expect((await admitPublicCoach({ ...c, fingerprint: "b".repeat(64) }, "192.0.2.1", transport)).status).toBe("unavailable");
    expect(await command(["HGET", key(c), "attempts"])).toBe("0");
    expect(await redisCommand(c, ["PING"], transport)).toEqual({ result: "PONG" });
  });
});
