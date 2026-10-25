import { z } from "zod";

export const versions = {
  catalog: "sim-1",
  rules: "sim-1",
  content: "sim-1",
  notice: "notice-1",
} as const;
export const variantIds = [
  "V01",
  "V02",
  "V03",
  "V04",
  "V05",
  "V06",
  "V07",
  "V08",
  "V09",
  "V10",
  "V11",
  "V12",
] as const;
export type VariantId = (typeof variantIds)[number];
export type QuestionId = "Q01" | "Q02" | "Q03" | "Q04" | "Q05" | "Q06" | "Q07";
const answerSchema = z
  .object({
    Q01: z.enum(["yes", "no", "unknown"]),
    Q02: z.enum([
      "learning",
      "preparing",
      "difficulty",
      "unsure",
      "notReached",
    ]),
    Q03: z.enum(["yes", "no", "unknown", "declined", "notReached"]),
    Q04: z.enum(["yes", "no", "unknown", "declined", "notReached"]),
    Q05: z.enum(["yes", "no", "unknown", "declined", "notReached"]),
    Q06: z.enum(["yes", "no", "notReached"]),
    Q07: z.enum([
      "under12",
      "atLeast12",
      "unknown",
      "declined",
      "notApplicable",
      "notReached",
    ]),
  })
  .strict();
export type Answers = z.infer<typeof answerSchema>;
const base: Answers = {
  Q01: "no",
  Q02: "learning",
  Q03: "no",
  Q04: "no",
  Q05: "no",
  Q06: "no",
  Q07: "notApplicable",
};
const stopped = {
  Q02: "notReached",
  Q03: "notReached",
  Q04: "notReached",
  Q05: "notReached",
  Q06: "notReached",
  Q07: "notReached",
} as const;
function example(
  variantId: VariantId,
  label: string,
  changes: Partial<Answers>,
) {
  return {
    variantId,
    catalogVersion: versions.catalog,
    label,
    canonicalAnswers: answerSchema.parse({ ...base, ...changes }),
  };
}
// Exact fictional rows from docs/11-clinical-safety.md, sim-1.
export const catalog = [
  example("V01", "General learning", {}),
  example("V02", "Lifestyle information", { Q06: "yes" }),
  example("V03", "Testosterone or steroid topic", { Q05: "yes" }),
  example("V04", "Current concern", { Q02: "preparing", Q03: "yes" }),
  example("V05", "Relevant history", { Q02: "preparing", Q04: "yes" }),
  example("V06", "Difficulty conceiving, at least 12 months", {
    Q02: "difficulty",
    Q07: "atLeast12",
  }),
  example("V07", "Safety information unknown", { Q01: "unknown", ...stopped }),
  example("V08", "Sudden severe pain", { Q01: "yes", ...stopped }),
  example("V09", "Current concern and relevant history", {
    Q02: "preparing",
    Q03: "yes",
    Q04: "yes",
  }),
  example("V10", "Uncertain and declined information", {
    Q02: "unsure",
    Q03: "unknown",
    Q04: "declined",
    Q05: "unknown",
  }),
  example("V11", "Difficulty conceiving, under 12 months", {
    Q02: "difficulty",
    Q07: "under12",
  }),
  example("V12", "Difficulty conceiving, duration unknown", {
    Q02: "difficulty",
    Q07: "unknown",
  }),
] as const;
export type Scenario = (typeof catalog)[number];
export function getScenario(id: VariantId): Scenario {
  return catalog.find((v) => v.variantId === id)!;
}
export const learningExample = getScenario("V01");
const scenarioSchema = z
  .object({
    variantId: z.enum(variantIds),
    catalogVersion: z.literal("sim-1"),
    label: z.string(),
    canonicalAnswers: answerSchema,
  })
  .strict()
  .superRefine((v, ctx) => {
    const canonical = getScenario(v.variantId);
    if (
      v.label !== canonical.label ||
      (Object.keys(canonical.canonicalAnswers) as QuestionId[]).some(
        (k) => v.canonicalAnswers[k] !== canonical.canonicalAnswers[k],
      )
    )
      ctx.addIssue({
        code: "custom",
        message: "Changed fictional catalog row",
      });
  });
export const questions: { id: QuestionId; question: string }[] = [
  {
    id: "Q01",
    question:
      "Does this fictional person have sudden, severe pain in a testicle now?",
  },
  { id: "Q02", question: "What would this fictional person like help with?" },
  {
    id: "Q03",
    question:
      "Is there a current testicular change or other concern in this example?",
  },
  {
    id: "Q04",
    question:
      "Have they been told by a clinician about a relevant condition or treatment?",
  },
  {
    id: "Q05",
    question: "Does this example include testosterone or anabolic steroid use?",
  },
  {
    id: "Q06",
    question: "Would they like lifestyle and reproductive health information?",
  },
  {
    id: "Q07",
    question:
      "If the example concerns difficulty conceiving, what duration is provided?",
  },
];
export const questionGroups = [
  {
    title: "Immediate concerns",
    explanation:
      "The example starts with immediate concerns. A negative answer cannot rule out every emergency.",
    ids: ["Q01"],
  },
  {
    title: "Purpose",
    explanation:
      "Explore the purpose and duration recorded in this fictional example.",
    ids: ["Q02", "Q07"],
  },
  {
    title: "History",
    explanation:
      "These are authored example facts. They are not questions about your own health.",
    ids: ["Q03", "Q04", "Q05"],
  },
  {
    title: "Lifestyle context",
    explanation: "Wanting information is not evidence of lifestyle risk.",
    ids: ["Q06"],
  },
] as const;
export const answerLabels: Record<string, string> = {
  yes: "Yes",
  no: "No",
  unknown: "Unknown",
  declined: "Declined",
  notReached: "Not reached, safety information stops this example",
  notApplicable: "Not applicable to this purpose",
  learning: "General learning",
  preparing: "Preparing for a discussion",
  difficulty: "Difficulty conceiving",
  unsure: "Unsure",
  under12: "Under 12 months",
  atLeast12: "At least 12 months",
};
export function answerLabel(id: QuestionId, answers: Answers) {
  return id === "Q07" && answers.Q02 === "learning"
    ? "Not applicable to this general learning example"
    : answerLabels[answers[id]];
}
export const choiceDestinations: Record<
  QuestionId,
  Partial<Record<string, VariantId>>
> = {
  Q01: { yes: "V08", unknown: "V07", no: "V01" },
  Q02: { learning: "V01", preparing: "V04", difficulty: "V06", unsure: "V10" },
  Q03: { yes: "V04", no: "V01", unknown: "V10" },
  Q04: { yes: "V05", no: "V01", declined: "V10" },
  Q05: { yes: "V03", no: "V01", unknown: "V10" },
  Q06: { yes: "V02", no: "V01" },
  Q07: { under12: "V11", atLeast12: "V06", unknown: "V12" },
};
export const choiceValues: Record<QuestionId, string[]> = {
  Q01: ["yes", "no", "unknown"],
  Q02: ["learning", "preparing", "difficulty", "unsure"],
  Q03: ["yes", "no", "unknown", "declined"],
  Q04: ["yes", "no", "unknown", "declined"],
  Q05: ["yes", "no", "unknown", "declined"],
  Q06: ["yes", "no"],
  Q07: ["under12", "atLeast12", "unknown", "declined"],
};
export const steps = {
  "STEP-URGENT":
    "Seek urgent medical help now. Sudden severe testicular pain needs urgent assessment. This demonstration cannot contact emergency services or assess your condition.",
  "STEP-CLARIFY":
    "This example does not contain enough information. Choose another fictional variation if you want to explore a different answer. This demonstration cannot assess a real symptom.",
  "STEP-DISCUSS":
    "In this fictional example, prepare to discuss the concern with a qualified health professional. This unvalidated demonstration cannot decide the right care service or appointment timing for a real person.",
  "STEP-EDUCATION":
    "Read the relevant information and consider what you would like to ask a qualified health professional. These example answers cannot confirm reproductive health or rule out a problem.",
} as const;
export const reasonText: Record<string, string> = {
  "URG-PAIN":
    "Sudden severe pain is recorded in the fictional safety answer. The example stops here.",
  "UNC-SAFETY":
    "The critical safety answer is unknown. Remaining questions are not reached, and unknown is never treated as no.",
  "DISC-CURRENT": "A current concern is recorded in this fictional example.",
  "DISC-HISTORY":
    "Relevant clinician diagnosed history or treatment is recorded in this fictional example.",
  "DISC-DIFFICULTY":
    "Difficulty conceiving is recorded. Duration does not change this discussion action or establish when a real person should seek care.",
  "EDU-MEDICATION":
    "This example includes the testosterone or steroid topic. Discuss use with a qualified professional or prescriber. This demonstration gives no stop, start or taper instructions.",
  "EDU-LIFESTYLE":
    "This example requests general lifestyle information. It does not calculate individual risk or promise improvement.",
  "LIMIT-NO-SUPPORTED-TRIGGER":
    "No supported concern is represented in this fixed example. That is a limitation of the example, not a finding about a real person.",
};
export function getResult(input: unknown) {
  const v = scenarioSchema.parse(input);
  const a = v.canonicalAnswers;
  const reasonIds: string[] = [];
  const contentIds = ["CARD-LIMITS"];
  let status:
    | "urgent"
    | "insufficientInformation"
    | "assessmentDiscussion"
    | "education" = "education";
  let nextStepId: keyof typeof steps = "STEP-EDUCATION";
  if (a.Q01 === "yes") {
    status = "urgent";
    nextStepId = "STEP-URGENT";
    reasonIds.push("URG-PAIN");
    contentIds.unshift("CARD-URGENT");
  } else if (a.Q01 === "unknown") {
    status = "insufficientInformation";
    nextStepId = "STEP-CLARIFY";
    reasonIds.push("UNC-SAFETY");
  } else {
    if (a.Q03 === "yes") reasonIds.push("DISC-CURRENT");
    if (a.Q04 === "yes") reasonIds.push("DISC-HISTORY");
    if (a.Q02 === "difficulty") reasonIds.push("DISC-DIFFICULTY");
    if (reasonIds.length) {
      status = "assessmentDiscussion";
      nextStepId = "STEP-DISCUSS";
      contentIds.unshift("CARD-DISCUSSION");
    }
    if (a.Q05 === "yes") {
      reasonIds.push("EDU-MEDICATION");
      contentIds.push("CARD-MEDICATION");
    }
    if (a.Q06 === "yes") {
      reasonIds.push("EDU-LIFESTYLE");
      contentIds.push("CARD-LIFESTYLE");
    }
    if (!reasonIds.length) reasonIds.push("LIMIT-NO-SUPPORTED-TRIGGER");
  }
  const unknownIds = (Object.keys(a) as QuestionId[]).filter(
    (k) => a[k] === "unknown" || a[k] === "declined",
  );
  return {
    ruleVersion: versions.rules,
    status,
    reasonIds,
    contentIds,
    unknownIds,
    nextStepId,
    nextStep: steps[nextStepId],
  };
}
export const sources = [
  {
    id: "C5",
    title: "Infertility",
    organization: "World Health Organization",
    date: "28 November 2025",
    url: "https://www.who.int/news-room/fact-sheets/detail/infertility",
    note: "General background on fertility care and access. This source does not validate this demonstration or determine an individual’s reproductive health.",
  },
  {
    id: "C6",
    title: "Testicle lumps and swellings",
    organization: "NHS",
    date: "Last reviewed 18 July 2023; checked 24 October 2026",
    url: "https://www.nhs.uk/symptoms/testicle-lumps-and-swellings/",
    note: "The immediate action section supports urgent help for sudden, severe testicular pain. UK service details are not a local care pathway. The page’s stated review due date has passed.",
  },
] as const;
