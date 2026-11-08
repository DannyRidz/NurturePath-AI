import { describe, it, expect, vi } from "vitest";
import { randomUUID } from "node:crypto";
import { MemoryAdmission } from "./admission";
import { RehearsalService, simulatedFeedback } from "./service";
import { canonicalCase, rehearsalVersions } from "./registry";
import {
  inputProblem,
  normalizeQuestion,
  validateFeedback,
  validateEnvelope,
} from "./contract";
import { configurationHash, unseal, seal } from "./seals";
import { comparisonOrders, evaluationManifest } from "./fixtures";
import { initial, reducer, type RehearsalState } from "./state";
const secret = "a".repeat(64);
const start = (goalId = "G01") => ({
  requestId: randomUUID(),
  caseId: "V01",
  goalId,
  versions: JSON.stringify(rehearsalVersions),
  adult: true,
  acknowledged: true,
});
async function setup(transport = simulatedFeedback) {
  let now = Date.now();
  const store = new MemoryAdmission(() => now),
    service = new RehearsalService(store, secret, transport, () => now);
  const session = await service.start(start(), "client");
  const req = {
    requestId: randomUUID(),
    caseId: "V01" as const,
    goalId: "G01" as const,
    round: 1 as const,
    revision: 0,
    rehearsalId: session.rehearsalId,
    ticket: session.ticket,
    consent: true as const,
    notice: rehearsalVersions.notice,
    current: "What could I ask?",
  };
  return {
    store,
    service,
    session,
    req,
    advance: () => {
      now += 1800001;
    },
  };
}
describe("P0 registries and frozen comparison", () => {
  it("preserves seven facts, sixty slots and balanced task orders", () => {
    expect(canonicalCase().facts).toHaveLength(7);
    expect(evaluationManifest).toHaveLength(30);
    expect(evaluationManifest.flatMap((x) => x.slots)).toHaveLength(60);
    for (const c of ["A", "B", "C"])
      for (const t of ["T1", "T2", "T3"])
        expect(
          comparisonOrders.filter(
            (row) => row.tasks[row.conditions.indexOf(c)] === t,
          ),
        ).toHaveLength(4);
  });
});
describe("P2 sealed service and admission", () => {
  it("admits two deliberate rounds, binds original, rejects replay and third attempt", async () => {
    const { service, store, req } = await setup();
    const first = await service.feedback(req, "client");
    expect(validateEnvelope(first, req, configurationHash)).toEqual(first);
    expect(first.receipt).toBeTruthy();
    await expect(service.feedback(req, "client")).rejects.toThrow(
      "duplicate_request",
    );
    const round2 = {
      ...req,
      round: 2,
      requestId: randomUUID(),
      current: "What is missing?",
      original: req.current,
      receipt: first.receipt,
    };
    await expect(
      service.feedback({ ...round2, original: "Changed original?" }, "client"),
    ).rejects.toThrow("invalid_receipt");
    const second = await service.feedback(round2, "client");
    expect(second.round).toBe(2);
    await expect(
      service.feedback({ ...round2, requestId: randomUUID() }, "client"),
    ).rejects.toThrow("stale_round");
    expect(store.attempts).toBe(2);
    expect(store.reservedCents).toBe(4);
    expect(JSON.stringify([...store.sessions.values()])).not.toContain(
      req.current,
    );
  });
  it("rejects forged tickets, expiry, versions, case and unknown fields before dispatch", async () => {
    const transport = vi.fn(simulatedFeedback);
    const { service, store, req, advance } = await setup(transport);
    for (const bad of [
      { ...req, ticket: req.ticket + "x" },
      { ...req, caseId: "V08" },
      { ...req, notice: "old" },
      { ...req, extra: true },
      { ...req, current: "a".repeat(401) },
    ])
      await expect(service.feedback(bad, "client")).rejects.toThrow();
    advance();
    await expect(service.feedback(req, "client")).rejects.toThrow(
      "rehearsal_expired",
    );
    expect(store.attempts).toBe(0);
    expect(transport).not.toHaveBeenCalled();
  });
  it("refusal closes without receipt, policy boundary never dispatches", async () => {
    const { service, store, req } = await setup(async () => ({
      decision: "out_of_scope",
      notes: [],
    }));
    const response = await service.feedback(req, "client");
    expect(response.receipt).toBeUndefined();
    await expect(
      service.feedback({ ...req, requestId: randomUUID() }, "client"),
    ).rejects.toThrow("rehearsal_closed");
    expect(store.attempts).toBe(1);
    const x = await setup();
    await expect(
      x.service.feedback({ ...x.req, current: "Diagnose me?" }, "client"),
    ).rejects.toThrow("rehearsal_closed");
    expect(x.store.attempts).toBe(0);
    await expect(x.service.feedback(x.req, "client")).rejects.toThrow(
      "rehearsal_closed",
    );
  });
  it("serializes concurrent requests and never reopens shutdown on late success", async () => {
    let release!: (v: unknown) => void;
    const pending = new Promise<unknown>((r) => (release = r));
    const x = await setup(() => pending);
    const first = x.service.feedback(x.req, "client");
    await vi.waitFor(() => expect(x.store.pending).toBe(x.req.requestId));
    const other = await x.service.start(start(), "other");
    await expect(
      x.service.feedback(
        { ...x.req, ...other, requestId: randomUUID() },
        "other",
      ),
    ).rejects.toThrow();
    x.store.enabled = false;
    release(await simulatedFeedback({ goalId: "G01" } as never));
    await first;
    expect(x.store.enabled).toBe(false);
    expect(x.store.attempts).toBe(1);
  });
  it("retains reservation and pauses on invalid output or transport uncertainty", async () => {
    for (const transport of [
      async () => ({
        decision: "coach",
        notes: [],
        rewrite: "You should take medication?",
        followUps: [],
      }),
      async () => {
        throw new Error("private failure");
      },
    ]) {
      const x = await setup(transport);
      await expect(x.service.feedback(x.req, "client")).rejects.toThrow(
        "reconciliation_required",
      );
      expect(x.store.attempts).toBe(1);
      expect(x.store.reservedCents).toBe(2);
      expect(x.store.enabled).toBe(false);
      expect(x.store.pending).toBeTruthy();
    }
  });
  it("checks strict output, quotations, facts and current identity independently", async () => {
    const x = await setup();
    const good = await x.service.feedback(x.req, "client");
    expect(() =>
      validateEnvelope({ ...good, revision: 4 }, x.req, configurationHash),
    ).toThrow();
    expect(() =>
      validateEnvelope(
        { ...good, provider: "gemini" },
        x.req,
        configurationHash,
      ),
    ).toThrow();
    for (const output of [
      {
        decision: "coach",
        notes: [
          {
            criterion: "focus",
            type: "strength",
            comment: "Specific wording",
            quote: "fabricated",
            factIds: [],
          },
        ],
        rewrite: "Which facts?",
        followUps: [],
      },
      {
        decision: "coach",
        notes: [],
        rewrite: "Which facts?",
        followUps: [],
        extra: 1,
      },
      {
        decision: "coach",
        notes: [
          {
            criterion: "focus",
            type: "strength",
            comment: "Specific wording",
            factIds: ["Q99"],
          },
        ],
        rewrite: "Which facts?",
        followUps: [],
      },
    ])
      expect(() => validateFeedback(output, "What?")).toThrow();
  });
  it("enforces finite starts, rates and exhaustion without refund", async () => {
    const store = new MemoryAdmission(() => 1000, 1, 2);
    for (let i = 0; i < 5; i++) await store.start(`id${i}`, "G01", "client");
    await expect(store.start("more", "G01", "client")).rejects.toThrow(
      "rate_limited",
    );
    await store.admit("id0", 1, "r1", "client");
    await store.settle("id0", "r1", "refusal");
    await expect(store.admit("id1", 1, "r2", "client")).rejects.toThrow(
      "exhausted",
    );
    expect(store.reservedCents).toBe(2);
  });
  it("domain separates signed capabilities", async () => {
    const x = await setup();
    const payload = unseal(secret, x.req.ticket, "ticket", Date.now());
    expect(() => unseal(secret, x.req.ticket, "receipt", Date.now())).toThrow();
    expect(() =>
      unseal(
        secret,
        seal(secret, { ...payload, goalId: "G02" }),
        "ticket",
        payload.expires + 1,
      ),
    ).toThrow();
  });
});
it("normalizes visibly and bounds Unicode, identifiers and markup", () => {
  expect(normalizeQuestion(" e\u0301? ")).toBe("é?");
  for (const value of [
    "",
    "a".repeat(401),
    "x\u0000",
    "<b>x</b>",
    "person@example.invalid",
    "123 456 7890",
    "https://example.invalid",
    "\ud800",
  ])
    expect(inputProblem(value)).not.toBeNull();
  expect(inputProblem("What about 123 facts?")).toBeNull();
  expect(inputProblem("😀".repeat(400))).toBeNull();
});
it("clearing and revision reject late feedback; selections start empty", async () => {
  const x = await setup();
  const value = await x.service.feedback(x.req, "client");
  let s: RehearsalState = {
    ...initial,
    text: x.req.current,
    rehearsalId: x.req.rehearsalId,
    pending: x.req.requestId,
  };
  s = reducer(s, { type: "feedback", value });
  expect(s.records).toHaveLength(1);
  expect(s.selected).toEqual([]);
  const reset = reducer(s, { type: "reset" });
  expect(reducer(reset, { type: "feedback", value })).toEqual(reset);
  const edit = reducer(
    { ...s, pending: x.req.requestId },
    { type: "edit", text: "Different?" },
  );
  expect(reducer(edit, { type: "feedback", value })).toEqual(edit);
});

it("preserves written and simulated origins through local edits and closes policy boundaries", () => {
  let s = reducer(initial, {
    type: "edit",
    text: "A written question?",
    origin: "Written starter",
  });
  expect(s.textOrigin).toBe("Written starter");
  s = reducer(s, {
    type: "edit",
    text: "A suggestion?",
    origin: "Simulated suggestion",
  });
  s = reducer(s, { type: "edit", text: "My edited suggestion?" });
  expect(s.textOrigin).toBe("Edited by you from a simulated suggestion");
  s = reducer(s, { type: "boundary", message: "Use the worksheet" });
  expect(s.closed).toBe(true);
  expect(s.records).toEqual([]);
  expect(s.selected).toEqual([]);
});

it("rejects slow and lost Redis acknowledgements without returning admission", async () => {
  const { RedisAdmission } = await import("./admission");
  const lost = new RedisAdmission(
    async () => {
      throw new Error("lost acknowledgement");
    },
    configurationHash,
    "simulation-lost",
  );
  await expect(lost.start(randomUUID(), "G01", "a".repeat(64))).rejects.toThrow(
    "reconciliation_required",
  );
  vi.useFakeTimers();
  try {
    const slow = new RedisAdmission(
      () => new Promise(() => {}),
      configurationHash,
      "simulation-slow",
    );
    const outcome = slow
      .start(randomUUID(), "G01", "a".repeat(64))
      .catch((e) => e);
    await vi.advanceTimersByTimeAsync(4001);
    expect((await outcome).message).toBe("reconciliation_required");
  } finally {
    vi.useRealTimers();
  }
});
it("a delayed simulated transport times out and retains its reservation", async () => {
  const x = await setup(() => new Promise(() => {}));
  vi.useFakeTimers();
  try {
    const outcome = x.service.feedback(x.req, "client").catch((e) => e);
    await vi.advanceTimersByTimeAsync(15001);
    expect((await outcome).message).toBe("reconciliation_required");
    expect(x.store.attempts).toBe(1);
    expect(x.store.enabled).toBe(false);
  } finally {
    vi.useRealTimers();
  }
});

it("labels edited written worksheet questions as user wording without losing suggestion provenance", () => {
  let state = reducer(initial, {
    type: "add",
    question: {
      id: "written",
      text: "Which facts are missing?",
      origin: "Written starter",
    },
  });
  expect(
    reducer(state, {
      type: "editQuestion",
      id: "written",
      text: "Which facts are missing?",
    }).questions[0].origin,
  ).toBe("Written starter");
  state = reducer(state, {
    type: "editQuestion",
    id: "written",
    text: "What does this example leave unanswered?",
  });
  expect(state.questions[0].origin).toBe("User wording");
  state = reducer(state, {
    type: "add",
    question: {
      id: "simulated",
      text: "Which parts could I ask about?",
      origin: "Simulated suggestion",
    },
  });
  state = reducer(state, {
    type: "editQuestion",
    id: "simulated",
    text: "Which missing parts could I ask about?",
  });
  expect(state.questions[1].origin).toBe(
    "Edited by you from a simulated suggestion",
  );
});
