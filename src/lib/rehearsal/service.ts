import { z } from "zod";
import { randomUUID } from "node:crypto";
import { AdmissionError, type AdmissionStore } from "./admission";
import {
  startSchema,
  makeRequestSchema,
  requestContext,
  validateFeedback,
  envelopeSchema,
  type Feedback,
} from "./contract";
import { policyBoundary } from "./contract";
import { configurationHash, seal, unseal, checkOriginal, mac } from "./seals";
import { rehearsalVersions } from "./registry";
export type SimulatedTransport = (
  context: ReturnType<typeof requestContext>,
) => Promise<unknown>;
export const simulatedFeedback: SimulatedTransport = async (context) => ({
  decision: "coach",
  notes: [
    {
      criterion: "focus",
      type: "suggestion",
      comment:
        context.goalId === "G02"
          ? "Name the information you want to understand in one question."
          : "Ask about what is known and what is missing from the example.",
      factIds: [],
    },
  ],
  rewrite:
    "What does this fictional example tell us, and what information is still missing?",
  followUps: ["Which parts of this example could I ask about?"],
});
export type RehearsalProfile = {
  configuration: string;
  versions: string;
  notice: string;
  provider: string;
  model: string;
  decode: (
    raw: unknown,
    current: string,
  ) => { feedback: Feedback; usage: unknown };
};
const simulatedProfile: RehearsalProfile = {
  configuration: configurationHash,
  versions: JSON.stringify(rehearsalVersions),
  notice: rehearsalVersions.notice,
  provider: "simulation",
  model: "authored-fixture-1",
  decode: (raw, current) => ({
    feedback: validateFeedback(raw, current),
    usage: { input: 0, output: 0 },
  }),
};
// Shared admission, receipts and lifecycle logic. No provider import or runtime flag.
export class RehearsalCore {
  constructor(
    readonly store: AdmissionStore,
    private secret: string,
    private transport: SimulatedTransport = simulatedFeedback,
    private now = () => Date.now(),
    private profile: RehearsalProfile = simulatedProfile,
  ) {}
  async start(raw: unknown, client: string) {
    const v = startSchema
        .extend({ versions: z.literal(this.profile.versions) })
        .parse(raw),
      rehearsalId = randomUUID(),
      expires = await this.store.start(rehearsalId, v.goalId, client);
    return {
      rehearsalId,
      expires,
      configuration: this.profile.configuration,
      ticket: seal(this.secret, {
        kind: "ticket",
        caseId: "V01",
        rehearsalId,
        goalId: v.goalId,
        configuration: this.profile.configuration,
        expires,
      }),
    };
  }
  async execute(raw: unknown, client: string) {
    const v = makeRequestSchema(this.profile.notice).parse(raw),
      ticket = unseal(
        this.secret,
        v.ticket,
        "ticket",
        this.now(),
        this.profile.configuration,
      );
    if (ticket.rehearsalId !== v.rehearsalId || ticket.goalId !== v.goalId)
      throw new AdmissionError("ineligible");
    if (v.round === 2) {
      const receipt = unseal(
        this.secret,
        v.receipt!,
        "receipt",
        this.now(),
        this.profile.configuration,
      );
      if (
        receipt.rehearsalId !== v.rehearsalId ||
        receipt.goalId !== v.goalId ||
        !checkOriginal(this.secret, v.original!, receipt)
      )
        throw new AdmissionError("invalid_receipt");
    }
    if (policyBoundary(v.current)) {
      await this.store.close(v.rehearsalId);
      throw new AdmissionError("rehearsal_closed");
    }
    const context = requestContext(v);
    if (Buffer.byteLength(JSON.stringify(context)) > 16384)
      throw new AdmissionError("too_large");
    await this.store.admit(v.rehearsalId, v.round, v.requestId, client);
    let feedback: Feedback;
    let usage: unknown;
    try {
      let timer: ReturnType<typeof setTimeout> | undefined;
      const deadline = new Promise<never>((_, reject) => {
        timer = setTimeout(
          () => reject(new Error("provider_unavailable")),
          15000,
        );
      });
      let rawOutput: unknown;
      try {
        rawOutput = await Promise.race([this.transport(context), deadline]);
      } finally {
        clearTimeout(timer);
      }
      if (Buffer.byteLength(JSON.stringify(rawOutput)) > 32768)
        throw new Error("too_large");
      ({ feedback, usage } = this.profile.decode(rawOutput, v.current));
    } catch {
      await this.store.settle(v.rehearsalId, v.requestId, "uncertain");
      throw new AdmissionError("reconciliation_required");
    }
    await this.store.settle(
      v.rehearsalId,
      v.requestId,
      feedback.decision === "coach" ? "success" : "refusal",
    );
    const receipt =
      v.round === 1 && feedback.decision === "coach"
        ? seal(this.secret, {
            ...ticket,
            kind: "receipt",
            requestId: v.requestId,
            originalMac: mac(this.secret, "original", v.current),
          })
        : undefined;
    return {
      requestId: v.requestId,
      rehearsalId: v.rehearsalId,
      caseId: "V01",
      goalId: v.goalId,
      round: v.round,
      revision: v.revision,
      versions: this.profile.versions,
      configuration: this.profile.configuration,
      provider: this.profile.provider,
      model: this.profile.model,
      generatedAt: new Date(this.now()).toISOString(),
      usage,
      feedback,
      ...(receipt ? { receipt } : {}),
    };
  }
}

export class RehearsalService extends RehearsalCore {
  async feedback(raw: unknown, client: string) {
    return envelopeSchema.parse(await this.execute(raw, client));
  }
}
