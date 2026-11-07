import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { randomBytes, randomUUID } from "node:crypto";
import { handleCoach, type Config } from "./service";
import { noticeVersion, outputShape, responseShape } from "./contract";
let directory:string, config:Config;
const input=()=>({variantId:"V01",catalogVersion:"sim-1",rulesVersion:"sim-1",contentVersion:"sim-1",noticeVersion,consent:true,requestId:randomUUID()});
function request(body:unknown=input(),headers:Record<string,string>={}) { return new Request("http://127.0.0.1:3000/api/coach",{method:"POST",headers:{host:"127.0.0.1:3000",origin:"http://127.0.0.1:3000","content-type":"application/json",authorization:`Bearer ${config.token}`,...headers},body:typeof body==="string"?body:JSON.stringify(body)}); }
beforeEach(async()=>{directory=await mkdtemp(join(tmpdir(),"coach-unit-"));config={enabled:true,hosted:false,token:randomBytes(32).toString("hex"),ledgerPath:directory,experimentId:"unit"};await writeFile(join(directory,"ledger.json"),JSON.stringify({experimentId:"unit",attempts:0,reservedCents:0}));});
afterEach(async()=>{await rm(directory,{recursive:true,force:true});});
const attempts=async()=>JSON.parse(await readFile(join(directory,"ledger.json"),"utf8")).attempts;
describe("local simulation boundary",()=>{
 it("derives all seven answers, labels simulation, reserves before response and disables caching",async()=>{const body=input();const response=await handleCoach(request(body),config);expect(response.status).toBe(200);expect(response.headers.get("cache-control")).toBe("private, no-store");const draft=responseShape.parse(await response.json());expect(draft.requestId).toBe(body.requestId);expect(draft.summary).toContain("No");expect(draft.questions).toHaveLength(3);expect(draft.provider).toBe("simulated");expect(await attempts()).toBe(1);});
 it.each(["V02","V07","V08","V09","V10","V12"])("denies %s before admission",async variantId=>{expect((await handleCoach(request({...input(),variantId}),config)).status).toBe(403);expect(await attempts()).toBe(0);});
 it.each<Record<string,string>>([{authorization:"bad"},{origin:"http://evil.test"},{origin:""},{host:"localhost:3000"}])("denies bad local access %o",async headers=>{expect((await handleCoach(request(input(),headers),config)).status).toBe(403);expect(await attempts()).toBe(0);});
 it("fails closed for disabled and hosted configurations",async()=>{for(const c of [{...config,enabled:false},{...config,hosted:true},{...config,token:undefined}])expect((await handleCoach(request(),c)).status).toBeGreaterThanOrEqual(403);expect(await attempts()).toBe(0);});
 it.each([{consent:false},{catalogVersion:"old"},{noticeVersion:"old"},{answers:{}},{prompt:"personal text"}])("rejects invalid/stale input %o",async patch=>{expect((await handleCoach(request({...input(),...patch}),config)).status).toBeGreaterThanOrEqual(400);expect(await attempts()).toBe(0);});
 it("bounds bytes and rejects malformed JSON",async()=>{expect((await handleCoach(request("x".repeat(1025)),config)).status).toBe(413);expect((await handleCoach(request("{"),config)).status).toBe(400);expect(await attempts()).toBe(0);});
 it("fails closed on a missing or corrupt ledger",async()=>{await writeFile(join(directory,"ledger.json"),"{}");expect((await handleCoach(request(),config)).status).toBe(503);await rm(join(directory,"ledger.json"));expect((await handleCoach(request(),config)).status).toBe(503);});
 it("keeps exhaustion stable without retaining a request lock",async()=>{await writeFile(join(directory,"ledger.json"),JSON.stringify({experimentId:"unit",attempts:60,reservedCents:60}));for(let i=0;i<2;i++)expect((await handleCoach(request(),config)).status).toBe(429);expect(await attempts()).toBe(60);});
 it("admits one concurrent attempt and never refunds",async()=>{const responses=await Promise.all([handleCoach(request(),config),handleCoach(request(),config)]);expect(responses.map(r=>r.status).sort()).toEqual([200,429]);expect(await attempts()).toBe(1);});
 it("rejects wrong experiment and mismatched counter totals",async()=>{await writeFile(join(directory,"ledger.json"),JSON.stringify({experimentId:"other",attempts:1,reservedCents:0}));expect((await handleCoach(request(),config)).status).toBe(503);});
});
it.each([
 {summary:"<script>x</script>",questions:["a","b","c"]},
 {summary:"x",questions:["a","a","c"]},
 {summary:"x",questions:["a","b"]},
 {summary:"x",questions:["a","b","https://example.com"]},
 {summary:"x".repeat(601),questions:["a","b","c"]},
 {summary:"x",questions:["a","b","c"],diagnosis:"no"},
])("rejects invalid output shape %o",value=>{expect(outputShape.safeParse(value).success).toBe(false);});

it("times out a stalled request body without reserving an attempt",async()=>{
 vi.useFakeTimers();
 try {
  const body=new ReadableStream<Uint8Array>({start(){}});
  const req=new Request("http://127.0.0.1:3000/api/coach",{method:"POST",headers:{host:"127.0.0.1:3000",origin:"http://127.0.0.1:3000","content-type":"application/json",authorization:`Bearer ${config.token}`},body,duplex:"half"} as RequestInit);
  const pending=handleCoach(req,config);await vi.advanceTimersByTimeAsync(15001);expect((await pending).status).toBe(504);expect(await attempts()).toBe(0);
 } finally {vi.useRealTimers();}
});

it("never resets an existing ledger during explicit initialization",async()=>{
 const before=await readFile(join(directory,"ledger.json"),"utf8");
 const process=spawnSync("node",["scripts/coach-local.mjs","init"],{env:{...globalThis.process.env,COACH_LEDGER_PATH:directory,COACH_EXPERIMENT_ID:"unit"},encoding:"utf8"});
 expect(process.status).not.toBe(0);expect(await readFile(join(directory,"ledger.json"),"utf8")).toBe(before);
});
it("refuses a second runner and fails closed on a stale request lock",async()=>{
 await writeFile(join(directory,"runner.lock"),"");
 const process=spawnSync("node",["scripts/coach-local.mjs","start"],{env:{...globalThis.process.env,COACH_LEDGER_PATH:directory,COACH_EXPERIMENT_ID:"unit",COACH_EXPERIMENT_TOKEN:config.token},encoding:"utf8",timeout:2000});
 expect(process.status).not.toBe(0);await writeFile(join(directory,"request.lock"),"");
 expect((await handleCoach(request(),config)).status).toBe(429);expect(await attempts()).toBe(0);
});
