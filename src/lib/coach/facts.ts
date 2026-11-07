import { createReport } from "../report";

export function publicCanonicalSummary() {
  const report = createReport("V01", "2026-11-06T00:00:00.000Z");
  const a = report.answers;
  return `Fixed fictional example. Purpose: ${report.purpose}. Sudden severe pain: ${a[0].answer}. Current concern: ${a[2].answer}. Relevant clinician history: ${a[3].answer}. Testosterone or steroid use: ${a[4].answer}. Lifestyle information requested: ${a[5].answer}. Difficulty conceiving duration: ${a[6].answer}.`;
}
