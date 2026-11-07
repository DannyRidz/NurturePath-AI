import { timingSafeEqual } from "node:crypto";
import { open, readFile, rename, unlink } from "node:fs/promises";
import { join, isAbsolute } from "node:path";
import { z } from "zod";
import { createReport } from "../../../src/lib/report";
import { noticeVersion, outputShape, requestShape, responseShape } from "./contract";
const ledgerShape = z.object({ experimentId: z.string().min(1), attempts: z.number().int().min(0).max(60), reservedCents: z.number().int().min(0).max(100) }).strict();
export type Config = { enabled: boolean; token?: string; ledgerPath?: string; experimentId?: string; hosted: boolean };
const headers = { "Cache-Control": "private, no-store" };
function error(status: number, code: string, requestId?: string) {
  return Response.json({status:"unavailable",code,...(requestId ? {requestId} : {})},{status,headers});
}
function equalToken(actual: string, expected?: string) {
  if (!expected || !/^[a-f0-9]{64}$/i.test(expected)) return false;
  const a=Buffer.from(actual), b=Buffer.from(`Bearer ${expected}`);
  return a.length === b.length && timingSafeEqual(a,b);
}
async function reserve(config: Config) {
  if (!config.ledgerPath || !isAbsolute(config.ledgerPath) || !config.experimentId) throw new Error("configuration");
  const lockPath=join(config.ledgerPath,"request.lock");
  let lock;
  try { lock=await open(lockPath,"wx",0o600); } catch { return "busy"; }
  try {
    const path=join(config.ledgerPath,"ledger.json");
    const ledger=ledgerShape.parse(JSON.parse(await readFile(path,"utf8")));
    if (ledger.experimentId!==config.experimentId || ledger.reservedCents!==ledger.attempts) throw new Error("ledger");
    if (ledger.attempts>=60 || ledger.reservedCents>=100) { await lock.close(); await unlink(lockPath); return "exhausted"; }
    await lock.writeFile(JSON.stringify({...ledger,attempts:ledger.attempts+1,reservedCents:ledger.reservedCents+1}));
    await lock.sync();
    // Keep the lock for the entire simulated attempt; commit the counter first.
    const temporary=join(config.ledgerPath,"ledger.next");
    const next=await open(temporary,"w",0o600);
    try { await next.writeFile(JSON.stringify({...ledger,attempts:ledger.attempts+1,reservedCents:ledger.reservedCents+1})); await next.sync(); } finally { await next.close(); }
    await rename(temporary,path);
    return {release:async()=>{await lock.close();await unlink(lockPath);}};
  } catch { await lock.close(); await unlink(lockPath); throw new Error("ledger"); }
}
export async function handleCoach(request: Request, config: Config) {
  if (!config.enabled || config.hosted) return error(503,"disabled");
  if (request.headers.get("host")!=="127.0.0.1:3000" || request.headers.get("origin")!=="http://127.0.0.1:3000" || !equalToken(request.headers.get("authorization")??"",config.token)) return error(403,"local_access_required");
  if (request.headers.get("content-type")?.split(";")[0].trim()!=="application/json") return error(400,"json_required");
  // Read incrementally so an omitted or forged Content-Length cannot bypass the bound.
  const reader=request.body?.getReader();
  if (!reader) return error(400,"invalid_request");
  const chunks: Uint8Array[]=[];let size=0;
  let timer: ReturnType<typeof setTimeout> | undefined;
  const deadline = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error("deadline")), 15_000);
  });
  try {
    while (true) {
      const {done,value} = await Promise.race([reader.read(), deadline]);
      if (done) break;
      size += value.length;
      if (size > 1024) { void reader.cancel().catch(() => {}); return error(413,"too_large"); }
      chunks.push(value);
    }
  } catch (failure) {
    void reader.cancel().catch(() => {});
    return error(failure instanceof Error && failure.message === "deadline" ? 504 : 400,"invalid_request");
  } finally { clearTimeout(timer); }
  let input;
  try { input=requestShape.parse(JSON.parse(Buffer.concat(chunks).toString("utf8"))); } catch { return error(400,"invalid_request"); }
  const id=input.requestId;
  if (!input.consent || input.variantId!=="V01") return error(403,"ineligible",id);
  if ([input.catalogVersion,input.rulesVersion,input.contentVersion].some(v=>v!=="sim-1") || input.noticeVersion!==noticeVersion) return error(409,"stale_version",id);
  let reservation;
  try { reservation=await reserve(config); } catch { return error(503,"ledger_unavailable",id); }
  if (typeof reservation==="string") return error(429,reservation,id);
  try {
    // This is deliberately an authored fixture. There is no provider adapter or network dispatch.
    const report=createReport("V01",new Date().toISOString());
    const output=outputShape.parse({
      summary: `Fictional purpose: ${report.purpose}. Sudden severe pain: ${report.answers[0].answer}. Current concern: ${report.answers[2].answer}. Relevant clinician history: ${report.answers[3].answer}. Testosterone or steroid use: ${report.answers[4].answer}. Lifestyle information requested: ${report.answers[5].answer}. Difficulty conceiving duration: ${report.answers[6].answer}.`,
      questions:["What information would be useful to bring to a conversation about reproductive health?","How can I describe what I would like to learn?","Which reliable educational resources could we discuss?"],
    });
    return Response.json(responseShape.parse({status:"draft",requestId:id,variantId:"V01",catalogVersion:"sim-1",rulesVersion:"sim-1",contentVersion:"sim-1",noticeVersion,promptVersion:"coach-mock-1",provider:"simulated",model:"authored-fixture-1",generatedAt:report.generatedAt,...output}),{headers});
  } catch { return error(503,"invalid_simulation",id); }
  finally { await reservation.release(); }
}
