import { describe, expect, it } from "vitest";
import { getLearningResult, learningExample } from "./scenario";

describe("V01 authored contract", () => {
  it("AC-05 returns the specified general education result with traceable limits", () => {
    expect(getLearningResult(learningExample)).toMatchObject({
      status: "education",
      nextStepId: "STEP-EDUCATION",
      reasonIds: ["LIMIT-NO-SUPPORTED-TRIGGER"],
      contentIds: ["CARD-LIMITS"],
      unknownIds: [],
    });
  });
  it("AC-07 preserves the exact limitations in the authored next step", () => {
    expect(getLearningResult(learningExample).nextStep).toBe(
      "Read the relevant information and consider what you would like to ask a qualified health professional. These example answers cannot confirm reproductive health or rule out a problem.",
    );
  });
  it.each([
    { ...learningExample, variantId: "V08" },
    { ...learningExample, catalogVersion: "old" },
    {
      ...learningExample,
      canonicalAnswers: { ...learningExample.canonicalAnswers, Q01: "unknown" },
    },
    {
      ...learningExample,
      canonicalAnswers: { ...learningExample.canonicalAnswers, Q07: "under12" },
    },
    { ...learningExample, personalNote: "synthetic canary" },
    { variantId: "V01" },
    null,
  ])("AC-04 rejects altered, stale, incomplete or extra input: %j", (input) => {
    expect(() => getLearningResult(input)).toThrow();
  });
});
