import { describe, it, expect, vi } from "vitest";
import { randomUUID } from "node:crypto";
import {
  generateRehearsal,
  model,
  liveHash,
  liveVersions,
  liveRequest,
  GeminiRehearsalService,
  validateLiveEnvelope,
  validateCommunicationContent,
} from "./gemini";
import { MemoryAdmission } from "./admission";
import { qualificationManifest } from "./fixtures";
import { requestContext, validateEnvelope } from "./contract";
import { runPhase, activationSchema, fixtureHash } from "./trial";
const row = qualificationManifest[0],
  context = requestContext({
    goalId: row.goalId as "G02",
    current: row.original,
    round: 1,
  });
function response(patch: Record<string, unknown> = {}) {
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
                    criterion: "focus",
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
      thoughtsTokenCount: 0,
      totalTokenCount: 160,
    },
    ...patch,
  });
}
async function setup(transport: typeof fetch = async () => response()) {
  const store = new MemoryAdmission(),
    service = new GeminiRehearsalService(
      store,
      "s".repeat(64),
      "synthetic-test-key",
      transport,
    ),
    session = await service.start(
      {
        requestId: randomUUID(),
        caseId: "V01",
        goalId: row.goalId,
        versions: JSON.stringify(liveVersions),
        adult: true,
        acknowledged: true,
      },
      "client",
    );
  return {
    store,
    service,
    request: {
      requestId: randomUUID(),
      rehearsalId: session.rehearsalId,
      ticket: session.ticket,
      caseId: "V01",
      goalId: row.goalId,
      round: 1,
      revision: 0,
      notice: liveVersions.notice,
      consent: true,
      current: row.original,
    },
  };
}
describe("P3 Gemini fixture transport", () => {
  it("sends only reviewed synthetic context with fixed settings and bounded provenance", async () => {
    let sent = "";
    const result = await generateRehearsal(
      "synthetic-key",
      context,
      async (url, init) => {
        expect(String(url)).toBe(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
        );
        expect(init?.redirect).toBe("error");
        sent = String(init?.body);
        return response();
      },
    );
    const body = JSON.parse(sent);
    expect(Buffer.byteLength(sent)).toBeLessThan(16384);
    expect(body.generationConfig.maxOutputTokens).toBe(1536);
    expect(body.generationConfig.thinkingConfig.thinkingLevel).toBe("MINIMAL");
    const data = JSON.parse(body.contents[0].parts[0].text);
    expect(data.case.facts).toHaveLength(7);
    expect(data.data.current).toBe(row.original);
    expect(data.goal.id).toBe(row.goalId);
    expect(result.usage.totalTokens).toBe(160);
    expect(sent).not.toContain("synthetic-key");
  });
  it("rejects inferred health topics and numbered fact references while accepting neutral coaching", () => {
    const neutral = {
      decision: "coach" as const,
      notes: [
        {
          criterion: "focus" as const,
          type: "suggestion" as const,
          comment: "Choose the aspect you want to ask about.",
          factIds: [],
        },
      ],
      rewrite: "What does this fictional example leave unanswered?",
      followUps: [],
    };
    expect(validateCommunicationContent(neutral, row.original)).toEqual(
      neutral,
    );
    for (const rewrite of [
      "How could I ask about the duration of difficulty conceiving?",
      "What clinical history is missing?",
      "What lifestyle information is missing?",
    ])
      expect(() =>
        validateCommunicationContent({ ...neutral, rewrite }, row.original),
      ).toThrow("unsupported_topic");
    expect(() =>
      validateCommunicationContent(
        { ...neutral, notes: [{ ...neutral.notes[0], factIds: ["Q07"] }] },
        "How could I ask about fictional information 7?",
      ),
    ).toThrow("unsupported_fact_reference");
  });
  it("retains the reservation and pauses when the provider infers an unsupported health topic", async () => {
    const raw = await response().json();
    const feedback = JSON.parse(raw.candidates[0].content.parts[0].text);
    feedback.rewrite =
      "How could I ask about duration of difficulty conceiving?";
    raw.candidates[0].content.parts[0].text = JSON.stringify(feedback);
    const x = await setup(async () => Response.json(raw));
    await expect(x.service.feedback(x.request, "client")).rejects.toThrow(
      "reconciliation_required",
    );
    expect(x.store.attempts).toBe(1);
    expect(x.store.reservedCents).toBe(2);
    expect(x.store.enabled).toBe(false);
  });
  it("rejects arbitrary text before transport", async () => {
    const transport = vi.fn(async () => response());
    await expect(
      generateRehearsal(
        "key",
        requestContext({
          goalId: "G01",
          round: 1,
          current: "An unregistered question?",
        }),
        transport,
      ),
    ).rejects.toThrow();
    expect(transport).not.toHaveBeenCalled();
    expect(() =>
      liveRequest(
        requestContext({
          goalId: "G02",
          round: 2,
          current: row.revision,
          original: "Altered original?",
        }),
      ),
    ).toThrow("unregistered_synthetic_fixture");
  });
  it("keeps real envelopes separate from simulation and binds both rounds to original", async () => {
    const x = await setup();
    const first = await x.service.feedback(x.request, "client");
    expect(first.provider).toBe("google-gemini");
    expect(first.configuration).toBe(liveHash);
    validateLiveEnvelope(first, x.request);
    expect(() =>
      validateEnvelope(first, x.request as never, liveHash),
    ).toThrow();
    const second = {
      ...x.request,
      round: 2,
      requestId: randomUUID(),
      current: row.revision,
      original: row.original,
      receipt: first.receipt,
    };
    expect((await x.service.feedback(second, "client")).round).toBe(2);
    await expect(
      x.service.feedback({ ...second, requestId: randomUUID() }, "client"),
    ).rejects.toThrow("stale_round");
    expect(x.store.attempts).toBe(2);
  });
  it("pauses admissions and retains reservations on malformed output or missing usage", async () => {
    for (const raw of [
      { usageMetadata: undefined },
      { modelVersion: "wrong-model" },
      {
        usageMetadata: {
          promptTokenCount: 100,
          candidatesTokenCount: 2000,
          totalTokenCount: 2100,
        },
      },
      { candidates: [{ finishReason: "MAX_TOKENS" }] },
    ]) {
      const x = await setup(async () => response(raw));
      await expect(x.service.feedback(x.request, "client")).rejects.toThrow(
        "reconciliation_required",
      );
      expect(x.store.attempts).toBe(1);
      expect(x.store.reservedCents).toBe(2);
      expect(x.store.enabled).toBe(false);
    }
  });
  it("has a total deadline including response reads and a 32KiB cap", async () => {
    await expect(
      generateRehearsal(
        "key",
        context,
        async () =>
          new Response("x".repeat(32769), {
            headers: { "content-type": "application/json" },
          }),
      ),
    ).rejects.toThrow();
    vi.useFakeTimers();
    try {
      const result = generateRehearsal(
        "key",
        context,
        async () =>
          new Response(new ReadableStream(), {
            headers: { "content-type": "application/json" },
          }),
      ).catch((e) => e);
      await vi.advanceTimersByTimeAsync(15001);
      expect((await result).code).toBe("deadline");
    } finally {
      vi.useRealTimers();
    }
  });
  it("refusal is terminal and cannot issue a receipt", async () => {
    const x = await setup(async () =>
      response({
        candidates: [
          {
            finishReason: "STOP",
            content: {
              role: "model",
              parts: [{ text: '{"decision":"out_of_scope","notes":[]}' }],
            },
          },
        ],
      }),
    );
    const result = await x.service.feedback(x.request, "client");
    expect(result.receipt).toBeUndefined();
    await expect(
      x.service.feedback({ ...x.request, requestId: randomUUID() }, "client"),
    ).rejects.toThrow("rehearsal_closed");
    expect(x.store.attempts).toBe(1);
  });
});
it("executes all sixty frozen slots through actual service logic without fabricated receipts or real calls", async () => {
  let clock = Date.now(),
    dispatched = false;
  const store = new MemoryAdmission(() => clock),
    service = new GeminiRehearsalService(
      store,
      "s".repeat(64),
      "synthetic-key",
      async () => {
        dispatched = true;
        return response();
      },
    );
  const records: unknown[] = [];
  const summary = await runPhase("evaluation", service, () => "client", {
    beforeSlot: async () => {
      clock += 6500;
    },
    afterSlot: async (r) => {
      records.push(r);
    },
    wasDispatched: () => dispatched,
    resetObservation: () => {
      dispatched = false;
    },
    stopRequired: async () => !store.enabled || !!store.pending,
  });
  expect(summary.slots).toBe(60);
  expect(summary.expected).toBe(60);
  expect(summary.providerAttempts).toBeGreaterThanOrEqual(24);
  expect(summary.qualified).toBe(false);
  expect(summary.humanRubricReview).toBe("pending");
  expect(summary.providerAttempts).toBe(store.attempts);
  expect(summary.goals).toHaveLength(2);
  expect(summary.rounds).toEqual([1, 2]);
});
it("retains dependent uncompleted slots after uncertain provider failure in the denominator", async () => {
  let dispatched = false;
  const store = new MemoryAdmission(),
    service = new GeminiRehearsalService(
      store,
      "s".repeat(64),
      "synthetic-key",
      async () => {
        dispatched = true;
        throw new Error("unknown usage");
      },
    );
  const summary = await runPhase("evaluation", service, () => "client", {
    beforeSlot: async () => {},
    afterSlot: async () => {},
    wasDispatched: () => dispatched,
    resetObservation: () => {
      dispatched = false;
    },
    stopRequired: async () => !store.enabled,
  });
  expect(summary.slots).toBe(60);
  expect(summary.providerAttempts).toBe(1);
  expect(summary.uncompleted).toBe(59);
  expect(summary.expected).toBe(0);
  expect(store.reservedCents).toBe(2);
});
it("activation binds the approved lifetime allowance, fresh review, exact configuration and fixtures", () => {
  const packet = {
    approval: "user-local-P3-2026-11-08",
    configuration: liveHash,
    fixtures: fixtureHash,
    reviewedAt: new Date(Date.now() - 1000).toISOString(),
    expiresAt: new Date(Date.now() + 86400000).toISOString(),
    paidPrepaidAccount: true,
    creditAvailable: true,
    autoReloadOff: true,
    syntheticCommunicationOnly: true,
    termsReviewed: true,
    costRisk: "estimated-reservations-not-invoice-cap",
    maxAttempts: 150,
    maxCents: 300,
  };
  expect(activationSchema.safeParse(packet).success).toBe(true);
  for (const patch of [
    { maxAttempts: 151 },
    { configuration: "a".repeat(64) },
    { fixtures: "b".repeat(64) },
    { expiresAt: new Date(Date.now() - 1).toISOString() },
    { paidPrepaidAccount: false },
  ])
    expect(activationSchema.safeParse({ ...packet, ...patch }).success).toBe(
      false,
    );
});

it("requires the entire exact reviewed phase and matching successful counter summary", async () => {
  const { validatePhaseForReview } = await import("./trial");
  for (const phase of ["smoke", "qualification"] as const) {
    let now = Date.now(),
      dispatched = false;
    const store = new MemoryAdmission(() => now),
      service = new GeminiRehearsalService(
        store,
        "s".repeat(64),
        "synthetic-key",
        async () => {
          dispatched = true;
          return response();
        },
      );
    const records: Record<string, unknown>[] = [];
    const summary = await runPhase(phase, service, () => "client", {
      beforeSlot: async () => {
        now += 6500;
      },
      afterSlot: async (record) => {
        records.push({
          ...record,
          configuration: liveHash,
          fixtures: fixtureHash,
        });
      },
      wasDispatched: () => dispatched,
      resetObservation: () => {
        dispatched = false;
      },
      stopRequired: async () => false,
    });
    const complete = {
      phase,
      configuration: liveHash,
      fixtures: fixtureHash,
      before: { attempts: 0, reservedCents: 0 },
      after: {
        enabled: true,
        pending: null,
        attempts: store.attempts,
        reservedCents: store.reservedCents,
      },
      ...summary,
    };
    expect(() =>
      validatePhaseForReview(phase, records, complete),
    ).not.toThrow();
    for (const bad of [
      records.slice(0, 1),
      records.slice(0, -1),
      [records[0], records[0], ...records.slice(2)],
      [{ ...records[0], slot: 9 }, ...records.slice(1)],
      [{ ...records[0], receiptIssued: false }, ...records.slice(1)],
    ])
      expect(() => validatePhaseForReview(phase, bad, complete)).toThrow();
    expect(() => validatePhaseForReview(phase, records, undefined)).toThrow();
    expect(() =>
      validatePhaseForReview(phase, records, {
        ...complete,
        after: { ...complete.after, attempts: store.attempts + 1 },
      }),
    ).toThrow();
  }
});
