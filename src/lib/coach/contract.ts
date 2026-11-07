import { z } from "zod";
import { publicCanonicalSummary } from "./facts";
export const geminiModel = "gemini-3.1-flash-lite";
export const publicNoticeVersion = "coach-public-notice-2";
export const requestShape = z.object({
  variantId: z.string(), catalogVersion: z.string(), rulesVersion: z.string(),
  contentVersion: z.string(), noticeVersion: z.string(), consent: z.boolean(), requestId: z.uuid(),
}).strict();
const plain = (max: number) => z.string().trim().min(1).refine(v => Array.from(v).length <= max)
  .refine(v => !/[<>]|https?:|www\.|\[[^\]]*\]\(/i.test(v));
export const outputShape = z.object({ summary: plain(600), questions: z.tuple([plain(180), plain(180), plain(180)]) }).strict()
  .refine(v => new Set(v.questions.map(q => q.trim().toLowerCase())).size === 3);
export const usageShape = z.object({
  inputTokens: z.number().int().nonnegative(), outputTokens: z.number().int().nonnegative(),
  thinkingTokens: z.number().int().nonnegative(), totalTokens: z.number().int().nonnegative(), durationMs: z.number().int().nonnegative(),
}).strict();
export const publicDraftShape = z.object({
  status: z.literal("draft"), requestId: z.uuid(), variantId: z.literal("V01"),
  catalogVersion: z.literal("sim-1"), rulesVersion: z.literal("sim-1"), contentVersion: z.literal("sim-1"),
  generatedAt: z.iso.datetime(), noticeVersion: z.literal(publicNoticeVersion),
  promptVersion: z.literal("coach-gemini-prompt-2"), provider: z.literal("google"), model: z.literal(geminiModel),
  summary: z.literal(publicCanonicalSummary()), questions: z.tuple([z.string(), z.string(), z.string()]), usage: usageShape,
}).strict().refine(v => outputShape.safeParse(v && {summary:v.summary, questions:v.questions}).success);
export type PublicDraft = z.infer<typeof publicDraftShape>;
