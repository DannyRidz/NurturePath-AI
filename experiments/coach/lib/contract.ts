import { z } from "zod";
export const noticeVersion = "coach-mock-notice-1";
export const requestShape = z.object({
  variantId: z.string(), catalogVersion: z.string(), rulesVersion: z.string(),
  contentVersion: z.string(), noticeVersion: z.string(), consent: z.boolean(),
  requestId: z.uuid(),
}).strict();
const plain = (max: number) => z.string().trim().min(1).refine(v => Array.from(v).length <= max)
  .refine(v => !/[<>]|https?:|www\.|\[[^\]]*\]\(/i.test(v));
export const outputShape = z.object({ summary: plain(600), questions: z.tuple([plain(180), plain(180), plain(180)]) }).strict()
  .refine(v => new Set(v.questions.map(q => q.trim().toLowerCase())).size === 3);
export const responseShape = z.object({
  status: z.literal("draft"), requestId: z.uuid(), variantId: z.literal("V01"),
  catalogVersion: z.literal("sim-1"), rulesVersion: z.literal("sim-1"), contentVersion: z.literal("sim-1"),
  noticeVersion: z.literal(noticeVersion), promptVersion: z.literal("coach-mock-1"),
  provider: z.literal("simulated"), model: z.literal("authored-fixture-1"), generatedAt: z.iso.datetime(),
  summary: plain(600), questions: z.tuple([plain(180), plain(180), plain(180)]),
}).strict().refine(v => outputShape.safeParse({summary:v.summary, questions:v.questions}).success);
export type Draft = z.infer<typeof responseShape>;
