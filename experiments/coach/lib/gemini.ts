import { readFile } from "node:fs/promises";
import { isAbsolute } from "node:path";
import { z } from "zod";
import { geminiModel, geminiNoticeVersion } from "./contract";

export { geminiRequestBody, generateGemini, GeminiFailure } from "../../../src/lib/coach/gemini";
import { geminiRequestBody, configurationHash as sharedConfigurationHash } from "../../../src/lib/coach/gemini";
export function configurationHash() { return sharedConfigurationHash(geminiNoticeVersion); }
const evidenceShape = z.object({
  version:z.literal("gemini-activation-1"), model:z.literal(geminiModel), configurationHash:z.string().regex(/^[a-f0-9]{64}$/),
  experimentId:z.string().min(1), reviewedAt:z.iso.datetime(), expiresAt:z.iso.datetime(),
  approvalReference:z.string().min(1).max(500), reviewer:z.string().min(1).max(100),
  paidAccountVerified:z.literal(true), regionAccessVerified:z.literal(true), intendedUseReviewed:z.literal(true),
  termsReference:z.string().min(1).max(1000), retentionDisclosure:z.string().min(1).max(2000),
  inputBoundEvidence:z.string().min(1).max(2000), outputBoundEvidence:z.string().min(1).max(2000),
  maxInputTokens:z.number().int().positive().max(16384), maxGeneratedTokens:z.literal(1024),
  inputUsdPerMillion:z.literal(0.25), outputUsdPerMillion:z.literal(1.5),
  maxAttempts:z.literal(60), maxReservedCents:z.literal(100), reserveCentsPerAttempt:z.literal(1),
}).strict();
export type Activation = z.infer<typeof evidenceShape>;
export async function readActivation(path:string|undefined, experimentId:string|undefined, now=Date.now()) {
  if(!path || !isAbsolute(path) || !experimentId)throw new Error("activation_required");
  // Keep this small and operator supplied. Never create an assertion of account approval automatically.
  const raw=await readFile(path,"utf8");
  if(Buffer.byteLength(raw)>8192)throw new Error("activation_required");
  const evidence=evidenceShape.parse(JSON.parse(raw));
  const reviewed=Date.parse(evidence.reviewedAt), expires=Date.parse(evidence.expiresAt);
  if(evidence.experimentId!==experimentId || evidence.configurationHash!==configurationHash() || reviewed>now || expires<=now || expires-reviewed>7*86400000 || now-reviewed>7*86400000)throw new Error("activation_required");
  const ceiling=(evidence.maxInputTokens*evidence.inputUsdPerMillion+1024*evidence.outputUsdPerMillion)/1e6;
  if(ceiling>=0.01 || Buffer.byteLength(geminiRequestBody())>8192)throw new Error("unqualified_cost");
  return evidence;
}
