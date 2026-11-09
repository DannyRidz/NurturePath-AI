import { describe, it, expect, vi } from "vitest";
import {
  handleTester,
  testerConfig,
  type TesterConfig,
} from "./tester-service";
import { MemoryAdmission } from "./admission";
import { liveHash, liveVersions, model } from "./gemini";
const config: TesterConfig = {
  enabled: true,
  production: true,
  origin: "https://nurturepath-demo.vercel.app",
  secret: "s".repeat(64),
  key: "test-key".repeat(4),
  redisUrl: "https://example.upstash.io",
  redisToken: "test-only",
  reviewedHash: liveHash,
};
function request(
  patch: Record<string, string> = {},
  body: unknown = {
    requestId: crypto.randomUUID(),
    caseId: "V01",
    goalId: "G02",
    versions: JSON.stringify(liveVersions),
    adult: true,
    acknowledged: true,
  },
) {
  return new Request(config.origin + "/api/tester-rehearsal/start", {
    method: "POST",
    headers: {
      host: "nurturepath-demo.vercel.app",
      origin: config.origin,
      "content-type": "application/json",
      "x-vercel-ip-country": "BN",
      "x-vercel-forwarded-for": "203.0.113.7",
      ...patch,
    },
    body: JSON.stringify(body),
  });
}
describe("hosted tester boundary", () => {
  it("denies disabled, wrong origin, access, region and client before store or provider", async () => {
    const store = vi.fn(),
      provider = vi.fn();
    for (const r of [
      request({ origin: "https://other.example" }),
      request({ host: "other.example" }),
      request({ "x-vercel-ip-country": "CN" }),
      request({ "x-vercel-ip-country": "" }),
      request({ "x-vercel-forwarded-for": "a,b" }),
    ])
      expect(
        (await handleTester(r, "start", config, { store, provider })).status,
      ).toBe(403);
    expect(
      (
        await handleTester(
          request(),
          "start",
          { ...config, enabled: false },
          { store, provider },
        )
      ).status,
    ).toBe(503);
    expect(
      (
        await handleTester(
          request(),
          "start",
          { ...config, reviewedHash: "wrong" },
          { store, provider },
        )
      ).status,
    ).toBe(503);
    expect(store).not.toHaveBeenCalled();
    expect(provider).not.toHaveBeenCalled();
  });
  it("creates a bound session with pseudonymous client and no practice or credential data in store command", async () => {
    let args: unknown[] = [];
    const store = vi.fn(async (_url, init) => {
      args = JSON.parse(String(init?.body));
      return Response.json({ result: ["ok", String(Date.now() + 1800000)] });
    });
    const provider = vi.fn();
    const response = await handleTester(request(), "start", config, {
      store,
      provider,
    });
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.configuration).toBe(liveHash);
    expect(body.ticket).toBeTruthy();
    const serialized = JSON.stringify(args);
    expect(serialized).toContain("gemini-testers-1");
    expect(serialized).not.toContain("203.0.113.7");
    expect(serialized).not.toContain(config.key!);
    expect(provider).not.toHaveBeenCalled();
    expect(response.headers.get("cache-control")).toBe("private, no-store");
  });
  it("rejects ineligible case and extra fields before admission", async () => {
    const store = vi.fn();
    const response = await handleTester(
      request(
        {},
        {
          requestId: crypto.randomUUID(),
          caseId: "V07",
          goalId: "G02",
          versions: JSON.stringify(liveVersions),
          adult: true,
          acknowledged: true,
          extra: true,
        },
      ),
      "start",
      config,
      { store },
    );
    expect(response.status).toBe(400);
    expect(store).not.toHaveBeenCalled();
  });
  it("orchestrates two real handler rounds through admission, provider validation and settlement", async () => {
    const memory = new MemoryAdmission();
    const store = vi.fn(async (_url, init) => {
      const args = JSON.parse(String(init?.body));
      const op = args[7],
        id = args[9],
        requestId = args[10],
        round = Number(args[11]),
        goal = args[12],
        client = String(args[5]).split(":").at(-1)!;
      try {
        let expiry = Date.now() + 1800000;
        if (op === "start") expiry = await memory.start(id, goal, client);
        else if (op === "admit")
          await memory.admit(id, round, requestId, client);
        else if (op === "close") await memory.close(id);
        else await memory.settle(id, requestId, op);
        return Response.json({ result: ["ok", String(expiry)] });
      } catch (error) {
        return Response.json({ result: [(error as Error).message] });
      }
    });
    const provider = vi.fn(async (_url, init) => {
      const sent = JSON.parse(String(init?.body));
      expect(sent.contents[0].parts[0].text).not.toContain("testosterone");
      return Response.json({
        modelVersion: model,
        candidates: [
          {
            finishReason: "STOP",
            content: {
              role: "model",
              parts: [
                {
                  text: JSON.stringify({
                    decision: "coach",
                    notes: [
                      {
                        criterion: "clarity",
                        type: "suggestion",
                        comment:
                          "Name the missing information you want to ask about.",
                        factIds: [],
                      },
                    ],
                    rewrite:
                      "Which information is missing from this fictional example?",
                    followUps: [],
                  }),
                },
              ],
            },
          },
        ],
        usageMetadata: {
          promptTokenCount: 100,
          candidatesTokenCount: 60,
          totalTokenCount: 160,
        },
      });
    });
    const deps = { store, provider };
    const start = await (
      await handleTester(request(), "start", config, deps)
    ).json();
    const firstBody = {
      requestId: crypto.randomUUID(),
      rehearsalId: start.rehearsalId,
      ticket: start.ticket,
      caseId: "V01",
      goalId: "G02",
      round: 1,
      revision: 0,
      consent: true,
      notice: liveVersions.notice,
      current: "How could I ask this question clearly?",
    };
    const firstResponse = await handleTester(
      request({}, firstBody),
      "feedback",
      config,
      deps,
    );
    expect(firstResponse.status).toBe(200);
    const first = await firstResponse.json();
    expect(first.receipt).toBeTruthy();
    const secondBody = {
      ...firstBody,
      requestId: crypto.randomUUID(),
      round: 2,
      revision: 1,
      original: firstBody.current,
      receipt: first.receipt,
      current: "Which information is missing from this fictional example?",
    };
    const secondResponse = await handleTester(
      request({}, secondBody),
      "feedback",
      config,
      deps,
    );
    expect(secondResponse.status).toBe(200);
    expect(provider).toHaveBeenCalledTimes(2);
    expect(memory.attempts).toBe(2);
    expect(memory.reservedCents).toBe(4);
    expect(memory.pending).toBeNull();
    expect(
      (
        await handleTester(
          request({}, { ...secondBody, requestId: crypto.randomUUID() }),
          "feedback",
          config,
          deps,
        )
      ).status,
    ).toBe(409);
    expect(provider).toHaveBeenCalledTimes(2);
  });
  it("requires a strong parent and derives a stable separate signing key", () => {
    expect(testerConfig({}).secret).toBeUndefined();
    expect(
      testerConfig({ COACH_LIMITER_HMAC_SECRET: "x" }).secret,
    ).toBeUndefined();
    const parent = "p".repeat(64);
    const child = testerConfig({ COACH_LIMITER_HMAC_SECRET: parent }).secret;
    expect(child).toHaveLength(64);
    expect(child).not.toBe(parent);
    expect(testerConfig({ COACH_LIMITER_HMAC_SECRET: parent }).secret).toBe(
      child,
    );
    expect(
      testerConfig({ COACH_LIMITER_HMAC_SECRET: "q".repeat(64) }).secret,
    ).not.toBe(child);
  });

  it("rejects missing adult and scope acknowledgments and withdrawn provider consent before admission", async () => {
    const store = vi.fn(),
      provider = vi.fn();
    for (const field of ["adult", "acknowledged"]) {
      const body = {
        requestId: crypto.randomUUID(),
        caseId: "V01",
        goalId: "G02",
        versions: JSON.stringify(liveVersions),
        adult: true,
        acknowledged: true,
        [field]: false,
      };
      expect(
        (
          await handleTester(request({}, body), "start", config, {
            store,
            provider,
          })
        ).status,
      ).toBe(400);
    }
    const body = {
      requestId: crypto.randomUUID(),
      rehearsalId: crypto.randomUUID(),
      ticket: "invalid",
      caseId: "V01",
      goalId: "G02",
      round: 1,
      revision: 0,
      consent: false,
      notice: liveVersions.notice,
      current: "Which information is missing?",
    };
    expect(
      (
        await handleTester(request({}, body), "feedback", config, {
          store,
          provider,
        })
      ).status,
    ).toBe(400);
    expect(store).not.toHaveBeenCalled();
    expect(provider).not.toHaveBeenCalled();
  });
});
