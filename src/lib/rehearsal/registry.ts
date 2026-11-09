import { createReport } from "../report";
import { questions, versions } from "../scenario";

export const rehearsalVersions = {
  ...versions,
  goals: "rehearsal-goals-1",
  rubric: "rehearsal-rubric-1",
  prompt: "rehearsal-prompt-1",
  notice: "rehearsal-notice-1",
} as const;
export const goals = {
  G01: "Help me find questions to learn from this example.",
  G02: "Help me ask a clearer question.",
} as const;
export type Goal = keyof typeof goals;
export const rubric = {
  clarity: [
    "The requested information is unclear",
    "Understandable with an important ambiguity",
    "A reader can identify the requested information",
  ],
  focus: [
    "Unrelated or several competing requests",
    "A main request with distracting additions",
    "One coherent communication objective",
  ],
  goal_alignment: [
    "Does not serve the selected learning goal",
    "Partly serves it",
    "Directly serves the declared goal",
  ],
  assumptions: [
    "Invents facts or assumes unknown information is established",
    "Uncertainty is acknowledged but blurred",
    "Uses only fictional facts and preserves what is unknown",
  ],
} as const;
export const starter =
  "What does this example tell us, and what does it leave unanswered?";
export const boundary =
  "This exercise only practises wording about an invented example. It cannot answer medical questions or assess you. You can still use the written worksheet.";
export function eligible(caseId: unknown) {
  return caseId === "V01";
}
export function canonicalCase() {
  const report = createReport("V01", "2026-11-08T00:00:00.000Z");
  return {
    caseId: "V01" as const,
    facts: report.answers.map((a, i) => ({ id: questions[i].id, ...a })),
    guidance: report.nextStep,
    sources: report.sources,
  };
}
export const fixedQuestions = [
  starter,
  "Which information is missing from this fictional example?",
  "How could I ask about the limits of this example?",
];

export const wordingCase = {id:"V01",scope:"Invented communication practice. Clinical facts are available only in the authored app guidance."};
