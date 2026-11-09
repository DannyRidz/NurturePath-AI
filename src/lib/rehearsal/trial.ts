// Frozen synthetic fixture execution. This module provides no HTTP or free-text surface.
import { createHash, randomUUID } from "node:crypto";
import { z } from "zod";
import {
  evaluationManifest,
  qualificationManifest,
  fixtureVersion,
} from "./fixtures";
import {
  GeminiRehearsalService,
  liveHash,
  liveVersions,
  validateLiveEnvelope,
  liveEnvelopeSchema,
  type LiveEnvelope,
} from "./gemini";
import { validateFeedback } from "./contract";
import { AdmissionError, type AdmissionStore } from "./admission";
export const releaseId = "gemini-local-1";
export const budgetKey = `{nurturepath-rehearsal}:${releaseId}:budget`;
export const maxAttempts = 150,
  maxCents = 300;
export const fixtureHash = createHash("sha256")
  .update(
    JSON.stringify({
      fixtureVersion,
      evaluationManifest,
      qualificationManifest,
    }),
  )
  .digest("hex");
export const activationSchema = z
  .object({
    approval: z.literal("user-local-P3-2026-11-08"),
    configuration: z.literal(liveHash),
    fixtures: z.literal(fixtureHash),
    reviewedAt: z.iso.datetime(),
    expiresAt: z.iso.datetime(),
    paidPrepaidAccount: z.literal(true),
    creditAvailable: z.literal(true),
    autoReloadOff: z.literal(true),
    syntheticCommunicationOnly: z.literal(true),
    termsReviewed: z.literal(true),
    costRisk: z.literal("estimated-reservations-not-invoice-cap"),
    maxAttempts: z.literal(150),
    maxCents: z.literal(300),
  })
  .strict()
  .refine(
    (v) =>
      Date.parse(v.reviewedAt) <= Date.now() &&
      Date.parse(v.expiresAt) > Date.now() &&
      Date.parse(v.expiresAt) - Date.parse(v.reviewedAt) <= 7 * 86400000,
  );
export type SlotRecord = {
  fixtureId: string;
  slot: number;
  expected: number;
  status: number | null;
  outcome: string;
  dispatched: boolean;
  receiptIssued?: boolean;
  providerDurationMs?: number | null;
  result?: Omit<LiveEnvelope, "receipt">;
  code?: string;
};
export type Phase = "smoke" | "qualification" | "evaluation";
export function phaseManifest(phase: Phase) {
  if (phase === "evaluation")
    return evaluationManifest.map((row) => ({
      id: row.id,
      goalId: row.goalId,
      slots: row.slots.map((s) => ({
        round: s.round,
        current: s.input,
        http: s.http,
        expectation: s.expectation,
        dispatch: s.dispatch,
        receipt: s.receipt,
      })),
    }));
  return qualificationManifest
    .slice(0, phase === "smoke" ? 2 : 10)
    .map((row) => ({
      id: row.id,
      goalId: row.goalId,
      slots: [
        {
          round: 1,
          current: row.original,
          http: 200,
          expectation: "coach",
          dispatch: true,
          receipt: true,
        },
        {
          round: 2,
          current: row.revision,
          http: 200,
          expectation: "coach",
          dispatch: true,
          receipt: false,
        },
      ],
    }));
}
function statusFor(e: unknown) {
  if (e instanceof z.ZodError) return { status: 400, code: "invalid_request" };
  if (e instanceof AdmissionError) {
    const c = e.code;
    return {
      status: [
        "rehearsal_closed",
        "stale_round",
        "duplicate_request",
        "invalid_receipt",
      ].includes(c)
        ? 409
        : c === "rehearsal_expired"
          ? 410
          : ["busy", "exhausted", "rate_limited", "session_limit"].includes(c)
            ? 429
            : 503,
      code: c,
    };
  }
  return { status: 503, code: "unavailable" };
}
export async function runPhase(
  phase: Phase,
  service: GeminiRehearsalService,
  client: () => string,
  options: {
    beforeSlot: () => Promise<void>;
    afterSlot: (record: SlotRecord) => Promise<void>;
    wasDispatched: () => boolean;
    resetObservation: () => void;
    stopRequired: () => Promise<boolean>;
  },
) {
  const records: SlotRecord[] = [];
  let stopped = false;
  for (const fixture of phaseManifest(phase)) {
    let session:
        Awaited<ReturnType<GeminiRehearsalService["start"]>> | undefined,
      first: LiveEnvelope | undefined;
    for (const [i, slot] of fixture.slots.entries()) {
      const record: SlotRecord = {
        fixtureId: fixture.id,
        slot: i + 1,
        expected: slot.http,
        status: null,
        outcome: "uncompleted",
        dispatched: false,
      };
      options.resetObservation();
      if (stopped) {
        record.outcome = "uncompleted_after_stop";
        records.push(record);
        await options.afterSlot(record);
        continue;
      }
      try {
        await options.beforeSlot();
        session ??= await service.start(
          {
            requestId: randomUUID(),
            caseId: "V01",
            goalId: fixture.goalId,
            versions: JSON.stringify(liveVersions),
            adult: true,
            acknowledged: true,
          },
          client(),
        );
        // Never fabricate a round-two receipt after a boundary or failed first round.
        const round = slot.round === 2 && !first?.receipt ? 1 : slot.round;
        const request = {
          requestId: randomUUID(),
          rehearsalId: session.rehearsalId,
          ticket: session.ticket,
          caseId: "V01",
          goalId: fixture.goalId,
          round,
          revision: i,
          notice: liveVersions.notice,
          consent: true,
          current: slot.current,
          ...(round === 2
            ? { original: fixture.slots[0].current, receipt: first!.receipt }
            : {}),
        };
        const value = await service.feedback(request, client());
        validateLiveEnvelope(value, request);
        record.status = 200;
        record.receiptIssued = !!value.receipt;
        const { receipt: unused, ...artifact } = value;
        void unused;
        record.result = artifact;
        if (i === 0) first = value;
        const decision = value.feedback.decision;
        record.outcome =
          slot.http === 200 &&
          slot.expectation === decision &&
          slot.dispatch === options.wasDispatched() &&
          slot.receipt === !!value.receipt
            ? "expected"
            : "unexpected";
      } catch (e) {
        const failure = statusFor(e);
        record.status = failure.status;
        record.code = failure.code;
        record.outcome =
          record.status === slot.http && !options.wasDispatched()
            ? "expected"
            : "unexpected";
      }
      record.dispatched = options.wasDispatched();
      records.push(record);
      await options.afterSlot(record);
      try {
        if (await options.stopRequired()) stopped = true;
      } catch {
        stopped = true;
      }
    }
  }
  return summarize(records);
}
export function summarize(records: SlotRecord[]) {
  const invoked = records.filter((r) => r.dispatched),
    coached = records.filter((r) => r.result?.feedback.decision === "coach"),
    durations = invoked
      .flatMap((r) =>
        r.providerDurationMs != null
          ? [r.providerDurationMs]
          : r.result
            ? [r.result.usage.durationMs]
            : [],
      )
      .sort((a, b) => a - b);
  return {
    slots: records.length,
    expected: records.filter((r) => r.outcome === "expected").length,
    preAdmissionBlocks: records.filter(
      (r) => r.status !== null && !r.dispatched && r.status !== 200,
    ).length,
    terminalDenials: records.filter((r) => r.slot === 2 && r.status === 409)
      .length,
    unexpected: records.filter((r) => r.outcome === "unexpected").length,
    uncompleted: records.filter((r) => r.status === null).length,
    providerAttempts: invoked.length,
    validProviderResults: invoked.filter((r) => r.result).length,
    coachedOutputs: coached.length,
    goals: [...new Set(coached.map((r) => r.result!.goalId))],
    rounds: [...new Set(coached.map((r) => r.result!.round))],
    durationN: durations.length,
    p50Ms: durations.length
      ? durations[Math.ceil(durations.length * 0.5) - 1]
      : null,
    p95Ms: durations.length
      ? durations[Math.ceil(durations.length * 0.95) - 1]
      : null,
    observedEstimatedUsd: invoked.reduce(
      (n, r) => n + (r.result?.usage.estimatedUsd ?? 0),
      0,
    ),
    unknownUsageAttempts: invoked.filter((r) => !r.result).length,
    humanRubricReview: "pending",
    qualified: false,
  };
}
export function newTrialService(
  store: AdmissionStore,
  secret: string,
  key: string,
  transport: typeof fetch,
) {
  return new GeminiRehearsalService(store, secret, key, transport);
}

// Validate the complete frozen prerequisite at review time AND before any next phase.
export function validatePhaseForReview(
  phase: "smoke" | "qualification",
  rawRecords: unknown,
  rawSummary: unknown,
) {
  const manifest = phaseManifest(phase).flatMap((row) =>
    row.slots.map((slot, i) => ({
      id: row.id,
      goal: row.goalId,
      slot: i + 1,
      ...slot,
    })),
  );
  const recordSchema = z.object({
    fixtureId: z.string(),
    slot: z.number().int(),
    expected: z.number().int(),
    status: z.number().int(),
    outcome: z.literal("expected"),
    dispatched: z.literal(true),
    receiptIssued: z.boolean(),
    configuration: z.literal(liveHash),
    fixtures: z.literal(fixtureHash),
    result: liveEnvelopeSchema.omit({ receipt: true }),
  });
  const records = z
      .array(recordSchema)
      .length(manifest.length)
      .parse(rawRecords),
    ids = new Set<string>();
  for (const [i, record] of records.entries()) {
    const expected = manifest[i];
    if (
      record.fixtureId !== expected.id ||
      record.slot !== expected.slot ||
      record.expected !== 200 ||
      record.status !== 200 ||
      record.result.goalId !== expected.goal ||
      record.result.round !== expected.round ||
      record.result.feedback.decision !== "coach" ||
      record.receiptIssued !== expected.receipt ||
      ids.has(record.result.requestId)
    )
      throw new Error("incomplete_prerequisite");
    validateFeedback(record.result.feedback, expected.current);
    ids.add(record.result.requestId);
  }
  const summary = z
    .object({
      phase: z.literal(phase),
      configuration: z.literal(liveHash),
      fixtures: z.literal(fixtureHash),
      slots: z.literal(manifest.length),
      expected: z.literal(manifest.length),
      unexpected: z.literal(0),
      uncompleted: z.literal(0),
      providerAttempts: z.literal(manifest.length),
      validProviderResults: z.literal(manifest.length),
      coachedOutputs: z.literal(manifest.length),
      before: z.object({
        attempts: z.number().int().nonnegative(),
        reservedCents: z.number().int().nonnegative(),
      }),
      after: z.object({
        enabled: z.literal(true),
        pending: z.null(),
        attempts: z.number().int().nonnegative().max(150),
        reservedCents: z.number().int().nonnegative().max(300),
      }),
    })
    .parse(rawSummary);
  if (
    summary.after.attempts - summary.before.attempts !== manifest.length ||
    summary.after.reservedCents !== summary.after.attempts * 2 ||
    summary.before.reservedCents !== summary.before.attempts * 2
  )
    throw new Error("invalid_prerequisite_counters");
  return { records, summary };
}
