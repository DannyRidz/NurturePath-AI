import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { randomBytes, randomUUID } from "node:crypto";
import { configurationHash, generateGemini, readActivation, type Activation } from "./gemini";
import { handleCoach, type Config } from "./service";
import { geminiModel, geminiNoticeVersion, responseShape } from "./contract";

let directory:string, evidence:Activation, config:Config;
const output={summary:"This fictional example describes general learning. No sudden severe pain or current concern is reported. Relevant clinician history and testosterone or steroid use are No. Lifestyle information is not requested. Difficulty conceiving duration is not applicable.",questions:["What information would help describe the learning goal?","How can I organize my questions for a conversation?","Which reliable educational resources could we discuss?"]};
const envelope=()=>({modelVersion:geminiModel,candidates:[{finishReason:"STOP",content:{role:"model",parts:[{text:JSON.stringify(output)}]}}],usageMetadata:{promptTokenCount:700,candidatesTokenCount:100,thoughtsTokenCount:5,totalTokenCount:805}});
const transport=()=>vi.fn<typeof fetch>().mockResolvedValue(Response.json(envelope()));
function request(patch:Record<string,unknown>={}){return new Request("http://127.0.0.1:3000/api/coach",{method:"POST",headers:{host:"127.0.0.1:3000",origin:"http://127.0.0.1:3000","content-type":"application/json",authorization:`Bearer ${config.token}`},body:JSON.stringify({variantId:"V01",catalogVersion:"sim-1",rulesVersion:"sim-1",contentVersion:"sim-1",noticeVersion:geminiNoticeVersion,consent:true,requestId:randomUUID(),...patch})});}
const counters=async()=>JSON.parse(await readFile(join(directory,"ledger.json"),"utf8"));
beforeEach(async()=>{
 directory=await mkdtemp(join(tmpdir(),"gemini-test-"));
 evidence={version:"gemini-activation-1",model:geminiModel,configurationHash:configurationHash(),experimentId:"test",reviewedAt:new Date(Date.now()-1000).toISOString(),expiresAt:new Date(Date.now()+3600000).toISOString(),approvalReference:"SYNTHETIC TEST ONLY",reviewer:"unit fixture",paidAccountVerified:true,regionAccessVerified:true,intendedUseReviewed:true,termsReference:"synthetic",retentionDisclosure:"synthetic",inputBoundEvidence:"synthetic",outputBoundEvidence:"synthetic",maxInputTokens:16384,maxGeneratedTokens:1024,inputUsdPerMillion:0.25,outputUsdPerMillion:1.5,maxAttempts:60,maxReservedCents:100,reserveCentsPerAttempt:1};
 config={mode:"gemini",enabled:true,hosted:false,ci:false,token:randomBytes(32).toString("hex"),apiKey:"synthetic-not-a-provider-key",ledgerPath:directory,activationPath:join(directory,"activation.json"),experimentId:"test"};
 await writeFile(config.activationPath!,JSON.stringify(evidence));
 await writeFile(join(directory,"ledger.json"),JSON.stringify({experimentId:"test",attempts:0,reservedCents:0}));
});
afterEach(async()=>{vi.useRealTimers();await rm(directory,{recursive:true,force:true});});

describe("CO-02/05/08 Gemini transport",()=>{
 it("sends only canonical facts, bounds generation, keeps the key out of URL/body and returns real provenance",async()=>{
  const fake=transport();
  const response=await handleCoach(request(),config,async(url,init)=>{
   expect((await counters()).attempts).toBe(1);
   return fake(url,init);
  });
  expect(response.status).toBe(200);const draft=responseShape.parse(await response.json());
  expect(draft.provider).toBe("google");expect(draft.model).toBe(geminiModel);
  const [url,init]=fake.mock.calls[0];expect(String(url)).not.toContain(config.apiKey!);
  expect(String(init?.body)).not.toContain(config.apiKey!);
  const sent=JSON.parse(String(init?.body));expect(JSON.parse(sent.contents[0].parts[0].text).answers).toHaveLength(7);
  expect(sent.generationConfig.maxOutputTokens).toBe(1024);expect(sent.generationConfig.candidateCount).toBe(1);
  expect(sent).not.toHaveProperty("tools");expect(sent).not.toHaveProperty("cachedContent");
  expect(init?.redirect).toBe("error");expect(fake).toHaveBeenCalledTimes(1);
  expect(await counters()).toEqual({experimentId:"test",attempts:1,reservedCents:1});
  expect(response.headers.get("cache-control")).toBe("private, no-store");
 });
 it.each(["refusal","truncated","wrong model","extra output","advice","missing usage","token violation","markup"])("rejects %s, counts the attempt and never retries",async failure=>{
  const body=envelope();
  if(failure==="refusal")body.candidates=[];
  if(failure==="truncated")body.candidates[0].finishReason="MAX_TOKENS";
  if(failure==="wrong model")body.modelVersion="other";
  if(failure==="extra output")body.candidates[0].content.parts[0].text=JSON.stringify({...output,extra:"x"});
  if(failure==="advice")body.candidates[0].content.parts[0].text=JSON.stringify({...output,summary:"Fictional: you should take medication."});
  if(failure==="markup")body.candidates[0].content.parts[0].text=JSON.stringify({...output,summary:"Fictional <b>example</b>"});
  if(failure==="missing usage")delete (body as Partial<typeof body>).usageMetadata;
  if(failure==="token violation")body.usageMetadata.candidatesTokenCount=2000;
  const fake=vi.fn<typeof fetch>().mockResolvedValue(Response.json(body));
  expect((await handleCoach(request(),config,fake)).status).toBe(503);
  expect(fake).toHaveBeenCalledTimes(1);expect((await counters()).attempts).toBe(1);
 });
 it("bounds a streamed body without trusting Content-Length",async()=>{
  const fake=vi.fn<typeof fetch>().mockResolvedValue(new Response(new ReadableStream({start(c){c.enqueue(new Uint8Array(16385));c.close();}}),{headers:{"content-type":"application/json","content-length":"1"}}));
  await expect(generateGemini(config.apiKey!,evidence,fake)).rejects.toMatchObject({code:"invalid_output"});expect(fake).toHaveBeenCalledTimes(1);
 });
 it("times out the whole provider read even if the body stalls or transport ignores abort",async()=>{
  vi.useFakeTimers();
  const fake=vi.fn<typeof fetch>().mockResolvedValue(new Response(new ReadableStream({start(){}}),{headers:{"content-type":"application/json"}}));
  const pending=expect(generateGemini(config.apiKey!,evidence,fake)).rejects.toMatchObject({code:"deadline"});
  await vi.advanceTimersByTimeAsync(15001);await pending;expect(fake).toHaveBeenCalledTimes(1);
  const never=vi.fn<typeof fetch>().mockImplementation(()=>new Promise(()=>{}));
  const hanging=expect(generateGemini(config.apiKey!,evidence,never)).rejects.toMatchObject({code:"deadline"});
  await vi.advanceTimersByTimeAsync(15001);await hanging;
 });
 it("does not echo provider errors or secrets",async()=>{
  const fake=vi.fn<typeof fetch>().mockResolvedValue(new Response(config.apiKey,{status:429}));
  const response=await handleCoach(request(),config,fake), body=await response.text();
  expect(response.status).toBe(503);expect(body).not.toContain(config.apiKey!);expect(fake).toHaveBeenCalledTimes(1);
 });
});

describe("CO-04/06/08 activation and accounting",()=>{
 it.each(["expired","changed prompt","wrong experiment","unreviewed account","unqualified input","changed prices"])("denies %s before reservation or network",async change=>{
  const invalid:Record<string,unknown>={...evidence};
  if(change==="expired")invalid.expiresAt=new Date(Date.now()-1).toISOString();
  if(change==="changed prompt")invalid.configurationHash="0".repeat(64);
  if(change==="wrong experiment")invalid.experimentId="other";
  if(change==="unreviewed account")invalid.paidAccountVerified=false;
  if(change==="unqualified input")invalid.maxInputTokens=100000;
  if(change==="changed prices")invalid.outputUsdPerMillion=100;
  await writeFile(config.activationPath!,JSON.stringify(invalid));const fake=transport();
  expect((await handleCoach(request(),config,fake)).status).toBe(503);expect(fake).not.toHaveBeenCalled();expect((await counters()).attempts).toBe(0);
 });
 it.each([{hosted:true},{ci:true},{enabled:false},{apiKey:undefined},{activationPath:undefined}])("denies disabled runtime %o",async patch=>{
  const fake=transport();expect((await handleCoach(request(),{...config,...patch},fake)).status).toBe(503);expect(fake).not.toHaveBeenCalled();expect((await counters()).attempts).toBe(0);
 });
 it.each([{variantId:"V07"},{variantId:"V08"},{variantId:"V02"},{consent:false},{noticeVersion:"coach-mock-notice-1"},{answers:{}}])("denies ineligible or stale input %o",async patch=>{
  const fake=transport();expect((await handleCoach(request(patch),config,fake)).status).toBeGreaterThanOrEqual(400);expect(fake).not.toHaveBeenCalled();expect((await counters()).attempts).toBe(0);
 });
 it("deleting evidence is a kill switch for the next request",async()=>{
  const fake=transport();expect((await handleCoach(request(),config,fake)).status).toBe(200);
  await rm(config.activationPath!);expect((await handleCoach(request(),config,fake)).status).toBe(503);expect(fake).toHaveBeenCalledTimes(1);
 });
 it("rejects future reviews and overly long activation windows",async()=>{
  for(const patch of [{reviewedAt:new Date(Date.now()+100000).toISOString()},{expiresAt:new Date(Date.now()+8*86400000).toISOString()}]){
   await writeFile(config.activationPath!,JSON.stringify({...evidence,...patch}));await expect(readActivation(config.activationPath,"test")).rejects.toThrow();
  }
 });
 it("holds one admission across delayed provider completion",async()=>{
  let release!:(r:Response)=>void, arrived!:()=>void;
  const seen=new Promise<void>(r=>arrived=r);
  const fake=vi.fn<typeof fetch>().mockImplementation(()=>{arrived();return new Promise(r=>release=r);});
  const first=handleCoach(request(),config,fake);await seen;
  expect((await handleCoach(request(),config,fake)).status).toBe(429);
  release(Response.json(envelope()));expect((await first).status).toBe(200);expect(fake).toHaveBeenCalledTimes(1);
 });
 it("never admits attempt 61",async()=>{
  await writeFile(join(directory,"ledger.json"),JSON.stringify({experimentId:"test",attempts:60,reservedCents:60}));
  const fake=transport();expect((await handleCoach(request(),config,fake)).status).toBe(429);expect(fake).not.toHaveBeenCalled();
 });
});
