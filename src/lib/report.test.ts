import { describe, expect, it } from "vitest";
import { createReport, reportDisclosure } from "./report";
import {
  catalog,
  getResult,
  questions,
  answerLabel,
  reasonText,
} from "./scenario";

const time = "2026-10-25T08:00:00.000Z";
describe("AC-10 complete fictional report", () => {
  it.each(catalog)(
    "$variantId preserves every canonical answer, reason and next step",
    (example) => {
      const report = createReport(example.variantId, time);
      const result = getResult(example);
      expect(report.answers).toEqual(
        questions.map((q) => ({
          question: q.question,
          answer: answerLabel(q.id, example.canonicalAnswers),
        })),
      );
      expect(report.answers).toHaveLength(7);
      expect(report.reasons).toEqual(
        result.reasonIds.map((id) => reasonText[id]),
      );
      expect(report.nextStep).toBe(result.nextStep);
      expect(report.generatedAt).toBe(time);
      expect(report.reviewStatus).toBe(
        "Unvalidated simulation. Not reviewed by a clinician.",
      );
      expect(report.sources.map((s) => s.organization)).toEqual([
        "World Health Organization",
        "NHS",
      ]);
      expect(JSON.stringify(report)).not.toMatch(
        /"V\d{2}"|"Q\d{2}"|variantId|modelId|sourceIds/,
      );
    },
  );
  it("AC-10 warns about complete disclosure, without offering omission", () => {
    expect(reportDisclosure).toBe(
      "This report includes every displayed example answer and reason. Review the full preview before saving or sharing.",
    );
  });
  it("AC-04/14 rejects arbitrary identifiers, payloads and invalid timestamps", () => {
    for (const id of [
      "V99",
      "v01",
      null,
      { variantId: "V01", personalAnswer: "synthetic" },
    ])
      expect(() => createReport(id, time)).toThrow();
    expect(() => createReport("V01", "not-a-date")).toThrow();
  });
});
