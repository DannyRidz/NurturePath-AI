import { createHash } from "node:crypto";
import { z } from "zod";
import { geminiModel, outputShape, usageShape, publicNoticeVersion } from "./contract";
import { coachInstruction, createCoachFacts, promptVersion, providerOutputSchema, publicPromptVersion, publicCoachInstruction } from "./prompt";
import { publicCanonicalSummary } from "./facts";

export function geminiRequestBody() {
  return JSON.stringify({
    systemInstruction:{parts:[{text:coachInstruction}]},
    contents:[{role:"user",parts:[{text:JSON.stringify(createCoachFacts())}]}],
    generationConfig:{candidateCount:1,temperature:0,maxOutputTokens:1024,
      thinkingConfig:{thinkingLevel:"MINIMAL"},responseMimeType:"application/json",responseJsonSchema:providerOutputSchema},
  });
}
export function publicGeminiRequestBody() {
  const requiredSummary = publicCanonicalSummary();
  return JSON.stringify({
    systemInstruction: {parts:[{text:publicCoachInstruction}]},
    contents: [{role:"user",parts:[{text:JSON.stringify({...createCoachFacts(),requiredSummary})}]}],
    generationConfig: {candidateCount:1,temperature:0,maxOutputTokens:1024,
      thinkingConfig:{thinkingLevel:"MINIMAL"},responseMimeType:"application/json",
      responseJsonSchema:{...providerOutputSchema,properties:{...providerOutputSchema.properties,summary:{type:"string",enum:[requiredSummary]}}}},
  });
}
export function configurationHash(noticeVersion = publicNoticeVersion) {
  const isPublic = noticeVersion === publicNoticeVersion;
  return createHash("sha256").update(`${geminiModel}\n${noticeVersion}\n${isPublic?publicPromptVersion:promptVersion}\n${isPublic?publicGeminiRequestBody():geminiRequestBody()}`).digest("hex");
}
export class GeminiFailure extends Error {
  constructor(public readonly code:"provider_failure"|"invalid_output"|"deadline") { super(code); }
}

// Transport injection is for deterministic unit tests only. The runtime always uses native fetch.
export async function generateGemini(key:string, evidence:{maxInputTokens:number}, transport:typeof fetch=fetch) {
  return generate(key,evidence,transport,false);
}
export async function generatePublicGemini(key:string, evidence:{maxInputTokens:number}, transport:typeof fetch=fetch) {
  return generate(key,evidence,transport,true);
}
async function generate(key:string,evidence:{maxInputTokens:number},transport:typeof fetch,boundedSummary:boolean) {
  const controller=new AbortController();
  const start=Date.now();
  let timer:ReturnType<typeof setTimeout>|undefined;
  const deadline=new Promise<never>((_,reject)=>{timer=setTimeout(()=>{controller.abort();reject(new GeminiFailure("deadline"));},15000);});
  let reader:ReadableStreamDefaultReader<Uint8Array>|undefined;
  try {
    const response=await Promise.race([transport(`https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent`,{
      method:"POST",headers:{"content-type":"application/json","x-goog-api-key":key},
      body:boundedSummary?publicGeminiRequestBody():geminiRequestBody(),signal:controller.signal,redirect:"error",cache:"no-store",
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
    if(boundedSummary && output.summary!==publicCanonicalSummary())throw new GeminiFailure("invalid_output");
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
