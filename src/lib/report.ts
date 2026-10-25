import { z } from "zod";
import {
  answerLabel,
  getResult,
  getScenario,
  questions,
  reasonText,
  sources,
  variantIds,
  versions,
} from "./scenario";

export const reportDisclosure =
  "This report includes every displayed example answer and reason. Review the full preview before saving or sharing.";
export const reportReviewStatus =
  "Unvalidated simulation. Not reviewed by a clinician.";

// Report data always comes from the complete canonical case, never a subset of answers.
export function createReport(variantId: unknown, generatedAt: string) {
  const example = getScenario(z.enum(variantIds).parse(variantId));
  const date = z.iso.datetime().parse(generatedAt);
  const result = getResult(example);
  return {
    generatedAt: date,
    reportVersion: "report-1",
    catalogVersion: versions.catalog,
    ruleVersion: result.ruleVersion,
    contentVersion: versions.content,
    purpose: answerLabel("Q02", example.canonicalAnswers),
    reviewStatus: reportReviewStatus,
    nextStep: result.nextStep,
    answers: questions.map((q) => ({
      question: q.question,
      answer: answerLabel(q.id, example.canonicalAnswers),
    })),
    reasons: result.reasonIds.map((id) => reasonText[id]),
    hasUnknownInformation: result.unknownIds.length > 0,
    discussionSourcePending: result.contentIds.includes("CARD-DISCUSSION"),
    // Include the generic urgent source in every complete report.
    sources: sources.map(({ title, organization, date, url, note }) => ({
      title,
      organization,
      date,
      url,
      note,
    })),
  };
}
