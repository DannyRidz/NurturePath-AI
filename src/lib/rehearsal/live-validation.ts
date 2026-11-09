import { z } from "zod";
import type { Feedback } from "./contract";
export const usageSchema = z
  .object({
    inputTokens: z.number().int().nonnegative().max(16384),
    outputTokens: z.number().int().nonnegative(),
    thinkingTokens: z.number().int().nonnegative(),
    totalTokens: z.number().int().nonnegative(),
    durationMs: z.number().nonnegative(),
    estimatedUsd: z.number().nonnegative().max(0.02),
  })
  .strict()
  .refine(
    (u) =>
      u.outputTokens + u.thinkingTokens <= 1536 &&
      u.totalTokens === u.inputTokens + u.outputTokens + u.thinkingTokens,
  );
export function validateCommunicationContent(
  feedback: Feedback,
  current: string,
) {
  if (feedback.decision === "out_of_scope") return feedback;
  const source = current.toLowerCase(),
    strings = [
      feedback.rewrite,
      ...feedback.followUps,
      ...feedback.notes.map((n) => n.comment),
    ];
  const topics = [
    /\btesticul\w*/gi,
    /\btesticl\w*/gi,
    /\breproductiv\w*/gi,
    /\bfertil\w*/gi,
    /\bconceiv\w*/gi,
    /\btestosteron\w*/gi,
    /\bsteroid\w*/gi,
    /\bsymptom\w*/gi,
    /\bduration\b/gi,
    /\blifestyle\b/gi,
    /\bclinical history\b/gi,
  ];
  for (const text of strings)
    for (const pattern of topics)
      for (const match of text.matchAll(pattern))
        if (!source.includes(match[0].toLowerCase()))
          throw new Error("unsupported_topic");
  if (feedback.notes.some((n) => n.factIds.some((id) => !current.includes(id))))
    throw new Error("unsupported_fact_reference");
  return feedback;
}
