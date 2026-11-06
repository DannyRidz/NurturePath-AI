import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { isAbsolute } from "node:path";
import { z } from "zod";
import { geminiModel, geminiNoticeVersion, outputShape, usageShape } from "./contract";
import { coachInstruction, createCoachFacts, promptVersion, providerOutputSchema } from "./prompt";

export function geminiRequestBody() {
  return JSON.stringify({
    systemInstruction:{parts:[{text:coachInstruction}]},
    contents:[{role:"user",parts:[{text:JSON.stringify(createCoachFacts())}]}],
    generationConfig:{candidateCount:1,temperature:0,maxOutputTokens:1024,
      thinkingConfig:{thinkingLevel:"MINIMAL"},responseMimeType:"application/json",responseJsonSchema:providerOutputSchema},
  });
}
export function configurationHash() {
  return createHash("sha256").update(`${geminiModel}\n${geminiNoticeVersion}\n${promptVersion}\n${geminiRequestBody()}`).digest("hex");
}
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

export class GeminiFailure extends Error {
  constructor(public readonly code:"provider_failure"|"invalid_output"|"deadline") { super(code); }
}

// Transport injection is for deterministic unit tests only. The runtime always uses native fetch.
export async function generateGemini(key:string, evidence:Activation, transport:typeof fetch=fetch) {
  const controller=new AbortController();
  const start=Date.now();
  let timer:ReturnType<typeof setTimeout>|undefined;
  const deadline=new Promise<never>((_,reject)=>{timer=setTimeout(()=>{controller.abort();reject(new GeminiFailure("deadline"));},15000);});
  let reader:ReadableStreamDefaultReader<Uint8Array>|undefined;
  try {
    const response=await Promise.race([transport(`https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent`,{
      method:"POST",headers:{"content-type":"application/json","x-goog-api-key":key},
      body:geminiRequestBody(),signal:controller.signal,redirect:"error",cache:"no-store",
    }),deadline]);
    if(!response.ok || !response.headers.get("content-type")?.startsWith("application/json"))throw new GeminiFailure("provider_failure");
    reader=response.body?.getReader();
    if(!reader)throw new GeminiFailure("invalid_output");
    const chunks:Uint8Array[]=[];let bytes=0;
    while(true){
      const chunk=await Promise.race([reader.read(),deadline]);
      if(chunk.done)break;
      bytes+=chunk.value.byteLength;
      if(bytes>16384)throw new GeminiFailure("invalid_output");
      chunks.push(chunk.value);
    }
    const raw=JSON.parse(Buffer.concat(chunks).toString("utf8"));
    const envelope=z.object({
      modelVersion:z.literal(geminiModel),
      promptFeedback:z.object({blockReason:z.string().optional()}).optional(),
      candidates:z.array(z.object({finishReason:z.literal("STOP"),content:z.object({
        role:z.literal("model"),parts:z.array(z.object({text:z.string(),thought:z.boolean().optional(),thoughtSignature:z.string().optional()}).strict()).length(1),
      })})).length(1),
      usageMetadata:z.object({promptTokenCount:z.number().int().nonnegative(),candidatesTokenCount:z.number().int().nonnegative(),thoughtsTokenCount:z.number().int().nonnegative().optional(),totalTokenCount:z.number().int().nonnegative()}),
    }).parse(raw);
    if(envelope.promptFeedback?.blockReason || envelope.candidates[0].content.parts[0].thought)throw new GeminiFailure("invalid_output");
    const u=envelope.usageMetadata, thinking=u.thoughtsTokenCount??0;
    if(u.promptTokenCount>evidence.maxInputTokens || u.candidatesTokenCount+thinking>1024 || u.totalTokenCount!==u.promptTokenCount+u.candidatesTokenCount+thinking)throw new GeminiFailure("invalid_output");
    const output=outputShape.parse(JSON.parse(envelope.candidates[0].content.parts[0].text));
    // These are only obvious exclusions. Every successful trial draft still needs manual semantic review.
    const text=[output.summary,...output.questions].join(" ");
    if(!/fictional/i.test(output.summary) || /\b(diagnos\w*|infertil\w*|prescrib\w*|treatment|take medication|you should|you must|book an appointment|seek urgent)\b/i.test(text))throw new GeminiFailure("invalid_output");
    return {output,usage:usageShape.parse({inputTokens:u.promptTokenCount,outputTokens:u.candidatesTokenCount,thinkingTokens:thinking,totalTokens:u.totalTokenCount,durationMs:Date.now()-start})};
  } catch(failure) {
    if(failure instanceof GeminiFailure)throw failure;
    throw new GeminiFailure(controller.signal.aborted?"deadline":"invalid_output");
  } finally {
    clearTimeout(timer);controller.abort();
    void reader?.cancel().catch(()=>{});
  }
}
