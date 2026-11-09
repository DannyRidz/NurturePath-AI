import { createHash } from "node:crypto";
import { spawn, execFile } from "node:child_process";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { promisify } from "node:util";
import { beforeAll, afterAll, describe, it, expect } from "vitest";
import {
  RedisAdmission,
  initializeLocalRehearsalScript,
  rebindLocalRehearsalScript,
  reconcileLocalRehearsalScript,
  initializeTesterScript,
  enableTesterScript,
} from "./admission";
const hash = (v: string) => createHash("sha256").update(v).digest("hex");
const execute = promisify(execFile),
  server = process.env.REDIS_SERVER_BIN,
  cli = process.env.REDIS_CLI_BIN;
describe.skipIf(!server || !cli)("rehearsal Redis atomic operations", () => {
  let directory: string, socket: string, child: ReturnType<typeof spawn>;
  async function command(args: (string | number)[]) {
    const { stdout } = await execute(cli!, [
      "-s",
      socket,
      "--json",
      ...args.map(String),
    ]);
    return JSON.parse(stdout);
  }
  beforeAll(async () => {
    directory = await mkdtemp(join(tmpdir(), "np-rehearsal-"));
    socket = join(directory, "redis.sock");
    child = spawn(
      server!,
      [
        "--port",
        "0",
        "--unixsocket",
        socket,
        "--save",
        "",
        "--appendonly",
        "no",
        "--dir",
        directory,
      ],
      { stdio: "ignore" },
    );
    for (let i = 0; i < 100; i++) {
      try {
        if ((await command(["PING"])) === "PONG") return;
      } catch {}
      await new Promise((r) => setTimeout(r, 20));
    }
    throw new Error("Redis did not start");
  });
  afterAll(async () => {
    if (child && child.exitCode === null) {
      const exited = new Promise((r) => child.once("exit", r));
      child.kill("SIGTERM");
      await exited;
    }
    if (directory) await rm(directory, { recursive: true, force: true });
  });
  async function setup(name: string, maxAttempts = 150) {
    const release = `simulation-${name}`,
      prefix = `{nurturepath-rehearsal}:${release}`,
      config = "a".repeat(64);
    await command([
      "HSET",
      `${prefix}:budget`,
      "configuration",
      config,
      "enabled",
      1,
      "attempts",
      0,
      "reservedCents",
      0,
      "maxAttempts",
      maxAttempts,
      "maxCents",
      maxAttempts * 2,
      "issued",
      0,
    ]);
    return { store: new RedisAdmission(command, config, release), prefix };
  }
  it("concurrent sessions share one active slot and consume both counters atomically", async () => {
    const { store, prefix } = await setup("concurrent");
    const expires = await store.start("s1", "G01", hash("hashed-client"));
    await store.start("s2", "G02", hash("other"));
    const results = await Promise.allSettled(
      Array.from({ length: 20 }, (_, i) =>
        store.admit(i % 2 ? "s1" : "s2", 1, `r${i}`, hash("hashed-client")),
      ),
    );
    expect(results.filter((r) => r.status === "fulfilled")).toHaveLength(1);
    expect(await command(["HGET", `${prefix}:budget`, "attempts"])).toBe("1");
    expect(await command(["HGET", `${prefix}:budget`, "reservedCents"])).toBe(
      "2",
    );
    expect(expires).toBeGreaterThan(Date.now());
    expect(await command(["TTL", `${prefix}:budget`])).toBe(-1);
    expect(await command(["TTL", `${prefix}:session:s1`])).toBeGreaterThan(
      1700,
    );
  });
  it("two rounds, duplicate IDs, refusal, limits, expiry and shutdown retain reservations", async () => {
    const { store, prefix } = await setup("rounds", 3);
    await store.start("s", "G01", hash("hash"));
    await store.admit("s", 1, "r1", hash("hash"));
    await store.settle("s", "r1", "success");
    await expect(store.admit("s", 2, "r1", hash("hash"))).rejects.toThrow(
      "duplicate_request",
    );
    await store.admit("s", 2, "r2", hash("hash"));
    await command(["HSET", `${prefix}:budget`, "enabled", 0]);
    await store.settle("s", "r2", "success");
    expect(await command(["HGET", `${prefix}:budget`, "enabled"])).toBe("0");
    await command(["HSET", `${prefix}:budget`, "enabled", 1]);
    await expect(store.admit("s", 3, "r3", hash("hash"))).rejects.toThrow(
      "stale_round",
    );
    await store.start("s2", "G01", hash("hash"));
    await store.admit("s2", 1, "r3", hash("hash"));
    await store.settle("s2", "r3", "refusal");
    await expect(store.admit("s2", 1, "r4", hash("hash"))).rejects.toThrow(
      "rehearsal_closed",
    );
    await store.start("s3", "G01", hash("hash"));
    await expect(store.admit("s3", 1, "r5", hash("hash"))).rejects.toThrow(
      "exhausted",
    );
    await command(["DEL", `${prefix}:session:s3`]);
    await expect(store.admit("s3", 1, "r6", hash("hash"))).rejects.toThrow(
      "rehearsal_expired",
    );
    expect(await command(["HGET", `${prefix}:budget`, "reservedCents"])).toBe(
      "6",
    );
  });
  it("corrupt or missing store and uncertain settlement fail closed", async () => {
    const { store, prefix } = await setup("corrupt");
    await store.start("s", "G01", hash("hash"));
    await store.admit("s", 1, "r", hash("hash"));
    await store.settle("s", "r", "uncertain");
    expect(await command(["HGET", `${prefix}:budget`, "pending"])).toBe("r");
    await expect(store.start("s2", "G01", hash("hash"))).rejects.toThrow(
      "disabled",
    );
    await command([
      "HSET",
      `${prefix}:budget`,
      "enabled",
      1,
      "reservedCents",
      0,
    ]);
    await expect(store.start("s3", "G01", hash("hash"))).rejects.toThrow(
      "configuration_required",
    );
    await command(["DEL", `${prefix}:budget`]);
    await expect(store.start("s4", "G01", hash("hash"))).rejects.toThrow(
      "configuration_required",
    );
  });
  it("finite creation rate, ten feedbacks per minute, metadata only and no coach namespace", async () => {
    const { store, prefix } = await setup("rates");
    for (let i = 0; i < 5; i++)
      await store.start(`s${i}`, "G01", hash("same-hash"));
    await expect(
      store.start("extra", "G01", hash("same-hash")),
    ).rejects.toThrow("rate_limited");
    for (let i = 0; i < 5; i++) {
      for (let j = 1; j <= 2; j++) {
        await store.admit(`s${i}`, j, `r${i}-${j}`, hash("same-hash"));
        await store.settle(`s${i}`, `r${i}-${j}`, "success");
      }
    }
    await store.start("s5", "G01", hash("other-hash"));
    await expect(
      store.admit("s5", 1, "extra", hash("same-hash")),
    ).rejects.toThrow("rate_limited");
    const keys = await command(["KEYS", "*"]);
    expect(keys.some((k: string) => k.includes("nurturepath-coach"))).toBe(
      false,
    );
    expect(
      await command(["TTL", `${prefix}:feedback:${hash("same-hash")}`]),
    ).toBeGreaterThan(0);
    const metadata = await command(["HGETALL", `${prefix}:session:s0`]);
    expect(Object.keys(metadata).sort()).toEqual([
      "attempts",
      "closed",
      "configuration",
      "expires",
      "goal",
      "id",
      "last",
      "successful",
    ]);
  });
  it("creates the local allowance only once and never resets existing totals", async () => {
    const key = "{nurturepath-rehearsal}:gemini-local-1:budget";
    expect(
      await command([
        "EVAL",
        initializeLocalRehearsalScript,
        1,
        key,
        "a".repeat(64),
      ]),
    ).toBe(1);
    await command(["HSET", key, "attempts", 4, "reservedCents", 8]);
    expect(
      await command([
        "EVAL",
        initializeLocalRehearsalScript,
        1,
        key,
        "b".repeat(64),
      ]),
    ).toBe(0);
    expect(
      await command([
        "HMGET",
        key,
        "configuration",
        "attempts",
        "reservedCents",
        "maxAttempts",
        "maxCents",
      ]),
    ).toEqual(["a".repeat(64), "4", "8", "150", "300"]);
  });
  it("rebinds only a quiescent exact state and preserves counters and shutdown", async () => {
    const { prefix } = await setup("rebind");
    const key = `${prefix}:budget`;
    await command(["HSET", key, "attempts", 4, "reservedCents", 8]);
    const before = await command(["HGETALL", key]);
    expect(
      await command([
        "EVAL",
        rebindLocalRehearsalScript,
        1,
        key,
        "a".repeat(64),
        "b".repeat(64),
        4,
        8,
      ]),
    ).toBe(1);
    expect(await command(["HGETALL", key])).toEqual({
      ...before,
      configuration: "b".repeat(64),
    });
    expect(
      await command([
        "EVAL",
        rebindLocalRehearsalScript,
        1,
        key,
        "b".repeat(64),
        "c".repeat(64),
        3,
        6,
      ]),
    ).toBe(0);
    await command(["HSET", key, "enabled", 0]);
    expect(
      await command([
        "EVAL",
        rebindLocalRehearsalScript,
        1,
        key,
        "b".repeat(64),
        "c".repeat(64),
        4,
        8,
      ]),
    ).toBe(0);
    await command(["HSET", key, "enabled", 1, "pending", "request-in-flight"]);
    expect(
      await command([
        "EVAL",
        rebindLocalRehearsalScript,
        1,
        key,
        "b".repeat(64),
        "c".repeat(64),
        4,
        8,
      ]),
    ).toBe(0);
  });
  it("reconciles only the reviewed pending state without refund or replay", async () => {
    const { prefix } = await setup("reconcile");
    const key = `${prefix}:budget`;
    await command([
      "HSET",
      key,
      "enabled",
      0,
      "pending",
      "reviewed-request",
      "attempts",
      37,
      "reservedCents",
      74,
    ]);
    const args = [
      "EVAL",
      reconcileLocalRehearsalScript,
      1,
      key,
      "a".repeat(64),
      "b".repeat(64),
      37,
      74,
      "reviewed-request",
    ];
    expect(await command([...args.slice(0, -1), "wrong-request"])).toBe(0);
    expect(await command(args)).toBe(1);
    expect(
      await command([
        "HMGET",
        key,
        "attempts",
        "reservedCents",
        "enabled",
        "pending",
        "configuration",
      ]),
    ).toEqual(["37", "74", "1", null, "b".repeat(64)]);
    expect(await command(args)).toBe(0);
  });
  it("meters the prepaid tester release beyond old caps while preserving shutdown and session limits", async () => {
    const key = "{nurturepath-rehearsal}:gemini-testers-1:budget";
    const config = "a".repeat(64);
    await command([
      "HSET",
      key,
      "configuration",
      config,
      "enabled",
      1,
      "attempts",
      500,
      "reservedCents",
      1000,
      "issued",
      500,
      "billingMode",
      "prepaid",
    ]);
    const store = new RedisAdmission(command, config, "gemini-testers-1");
    const client = hash("prepaid-client");
    await store.start("prepaid-session", "G01", client);
    await store.admit("prepaid-session", 1, "prepaid-request", client);
    expect(
      await command([
        "TTL",
        "{nurturepath-rehearsal}:gemini-testers-1:seen:prepaid-request",
      ]),
    ).toBeGreaterThan(1700);
    expect(
      await command([
        "EXISTS",
        "{nurturepath-rehearsal}:gemini-testers-1:seen",
      ]),
    ).toBe(0);
    await expect(
      store.admit("prepaid-session", 1, "another", client),
    ).rejects.toThrow();
    await command(["HSET", key, "enabled", 0]);
    await store.settle("prepaid-session", "prepaid-request", "success");
    expect(
      await command(["HMGET", key, "attempts", "reservedCents", "enabled"]),
    ).toEqual(["501", "1002", "0"]);
    await expect(store.start("blocked-session", "G01", client)).rejects.toThrow(
      "disabled",
    );
  });
  it("initializes tester metadata once and enables only reconciled matching state", async () => {
    const key = "tester-init-metadata";
    const config = "a".repeat(64);
    const init = ["EVAL", initializeTesterScript, 1, key, config];
    const enable = ["EVAL", enableTesterScript, 1, key, config];
    expect(await command(init)).toBe(1);
    expect(await command(["HGET", key, "enabled"])).toBe("0");
    await command([
      "HSET",
      key,
      "attempts",
      511,
      "reservedCents",
      1022,
      "pending",
      "unsettled",
    ]);
    expect(await command(enable)).toBe(0);
    await command(["HDEL", key, "pending"]);
    expect(await command([...enable.slice(0, -1), "b".repeat(64)])).toBe(0);
    expect(await command(enable)).toBe(1);
    expect(await command(init)).toBe(0);
    expect(await command(["HMGET", key, "attempts", "reservedCents"])).toEqual([
      "511",
      "1022",
    ]);
  });
});
