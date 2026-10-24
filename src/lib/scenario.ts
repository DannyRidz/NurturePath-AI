import { z } from "zod";

export const versions = {
  catalog: "sim-1",
  rules: "sim-1",
  content: "sim-1",
  notice: "notice-1",
} as const;

// The first slice exposes V01 only. Other authored variants arrive in slice 2.
const scenarioSchema = z
  .object({
    variantId: z.literal("V01"),
    catalogVersion: z.literal("sim-1"),
    canonicalAnswers: z
      .object({
        Q01: z.literal("no"),
        Q02: z.literal("learning"),
        Q03: z.literal("no"),
        Q04: z.literal("no"),
        Q05: z.literal("no"),
        Q06: z.literal("no"),
        Q07: z.literal("notApplicable"),
      })
      .strict(),
  })
  .strict();

export const learningExample = scenarioSchema.parse({
  variantId: "V01",
  catalogVersion: versions.catalog,
  canonicalAnswers: {
    Q01: "no",
    Q02: "learning",
    Q03: "no",
    Q04: "no",
    Q05: "no",
    Q06: "no",
    Q07: "notApplicable",
  },
});

export const questionGroups = [
  {
    title: "Immediate concerns",
    explanation:
      "The example starts with immediate concerns. A negative answer cannot rule out every emergency.",
    questions: [
      {
        id: "Q01",
        question:
          "Does this fictional person have sudden, severe pain in a testicle now?",
        answer: "No",
      },
    ],
  },
  {
    title: "Purpose",
    explanation:
      "This person is exploring general information, rather than asking for an assessment.",
    questions: [
      {
        id: "Q02",
        question: "What would this fictional person like help with?",
        answer: "General learning",
      },
    ],
  },
  {
    title: "History",
    explanation:
      "These are authored example facts. They are not questions about your own health.",
    questions: [
      {
        id: "Q03",
        question:
          "Is there a current testicular change or other concern in this example?",
        answer: "No",
      },
      {
        id: "Q04",
        question:
          "Have they been told by a clinician about a relevant condition or treatment?",
        answer: "No",
      },
      {
        id: "Q05",
        question:
          "Does this example include testosterone or anabolic steroid use?",
        answer: "No",
      },
    ],
  },
  {
    title: "Lifestyle context",
    explanation:
      "This example does not request additional lifestyle information. No lifestyle risk is inferred.",
    questions: [
      {
        id: "Q06",
        question:
          "Would they like lifestyle and reproductive health information?",
        answer: "No",
      },
    ],
  },
] as const;

export const durationAnswer = {
  id: "Q07",
  question:
    "If the example concerns difficulty conceiving, what duration is provided?",
  answer: "Not applicable to this general learning example",
} as const;

export function getLearningResult(input: unknown) {
  scenarioSchema.parse(input);
  return {
    ruleVersion: versions.rules,
    status: "education" as const,
    reasonIds: ["LIMIT-NO-SUPPORTED-TRIGGER"],
    contentIds: ["CARD-LIMITS"],
    unknownIds: [],
    nextStepId: "STEP-EDUCATION" as const,
    nextStep:
      "Read the relevant information and consider what you would like to ask a qualified health professional. These example answers cannot confirm reproductive health or rule out a problem.",
    reason:
      "No supported concern is represented in this fixed example. That is a limitation of the example, not a finding about a real person.",
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
