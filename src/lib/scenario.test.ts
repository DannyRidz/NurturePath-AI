import { describe, expect, it } from "vitest";
import {
  getResult,
  learningExample,
  getScenario,
  choiceDestinations,
} from "./scenario";

describe("V01 authored contract", () => {
  it("AC-05 returns the specified general education result with traceable limits", () => {
    expect(getResult(learningExample)).toMatchObject({
      status: "education",
      nextStepId: "STEP-EDUCATION",
      reasonIds: ["LIMIT-NO-SUPPORTED-TRIGGER"],
      contentIds: ["CARD-LIMITS"],
      unknownIds: [],
    });
  });
  it("AC-07 preserves the exact limitations in the authored next step", () => {
    expect(getResult(learningExample).nextStep).toBe(
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
    expect(() => getResult(input)).toThrow();
  });
});

describe("AC-04/05/06 finite simulation table", () => {
  it.each([
    ["V01", "STEP-EDUCATION", ["LIMIT-NO-SUPPORTED-TRIGGER"], []],
    ["V02", "STEP-EDUCATION", ["EDU-LIFESTYLE"], []],
    ["V03", "STEP-EDUCATION", ["EDU-MEDICATION"], []],
    ["V04", "STEP-DISCUSS", ["DISC-CURRENT"], []],
    ["V05", "STEP-DISCUSS", ["DISC-HISTORY"], []],
    ["V06", "STEP-DISCUSS", ["DISC-DIFFICULTY"], []],
    ["V07", "STEP-CLARIFY", ["UNC-SAFETY"], ["Q01"]],
    ["V08", "STEP-URGENT", ["URG-PAIN"], []],
    ["V09", "STEP-DISCUSS", ["DISC-CURRENT", "DISC-HISTORY"], []],
    [
      "V10",
      "STEP-EDUCATION",
      ["LIMIT-NO-SUPPORTED-TRIGGER"],
      ["Q03", "Q04", "Q05"],
    ],
    ["V11", "STEP-DISCUSS", ["DISC-DIFFICULTY"], []],
    ["V12", "STEP-DISCUSS", ["DISC-DIFFICULTY"], ["Q07"]],
  ] as const)(
    "%s preserves exact action, ordered reasons and missingness",
    (id, nextStepId, reasonIds, unknownIds) => {
      const result = getResult(getScenario(id));
      expect(result).toMatchObject({ nextStepId, reasonIds, unknownIds });
      expect(result.contentIds).toContain("CARD-LIMITS");
    },
  );
  it.each(["V07", "V08"] as const)("%s never evaluates lower fields", (id) => {
    const v = getScenario(id);
    expect(Object.values(v.canonicalAnswers).slice(1)).toEqual(
      Array(6).fill("notReached"),
    );
    expect(() =>
      getResult({
        ...v,
        canonicalAnswers: { ...v.canonicalAnswers, Q03: "yes" },
      }),
    ).toThrow();
  });
  it("rejects invented permutations even with valid enums", () => {
    const v = getScenario("V09");
    expect(() =>
      getResult({
        ...v,
        canonicalAnswers: { ...v.canonicalAnswers, Q05: "yes" },
      }),
    ).toThrow();
  });
  it("choice destinations match the named table and never accept unsupported choices", () => {
    expect(choiceDestinations.Q01).toEqual({
      yes: "V08",
      no: "V01",
      unknown: "V07",
    });
    expect(choiceDestinations.Q04.declined).toBe("V10");
    expect(choiceDestinations.Q03.declined).toBeUndefined();
    expect(choiceDestinations.Q07).toEqual({
      under12: "V11",
      atLeast12: "V06",
      unknown: "V12",
    });
  });
});
