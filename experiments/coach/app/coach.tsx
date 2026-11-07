"use client";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { noticeVersion, geminiNoticeVersion, geminiModel, responseShape, type Draft } from "../lib/contract";
import { useCoachDisclosure, useCoachMode } from "./environment";
export function Coach() {
  const mode=useCoachMode(), real=mode==="gemini", currentNotice=real?geminiNoticeVersion:noticeVersion;
  const disclosure=useCoachDisclosure();
  const [open,setOpen]=useState(false),[consent,setConsent]=useState(false),[token,setToken]=useState("");
  const [status,setStatus]=useState<"idle"|"loading"|"draft"|"unavailable">("idle");
  const [draft,setDraft]=useState<Draft|null>(null);
  const revision=useRef(0),active=useRef<{id:string;controller:AbortController}|null>(null);
  const pathname=usePathname();
  const trigger=useRef<HTMLButtonElement>(null);
  function discard(){revision.current++;active.current?.controller.abort();active.current=null;setDraft(null);setStatus("idle");setConsent(false);setToken("");}
  useEffect(()=>()=>{revision.current++;active.current?.controller.abort();active.current=null;},[]);
  // Cached route components must never accept a completion after leaving results.
  useEffect(()=>{if(pathname!=="/results"){revision.current++;active.current?.controller.abort();active.current=null;}},[pathname]);
  async function requestDraft(){
    if(!consent || active.current)return;
    const id=crypto.randomUUID(), current=revision.current, controller=new AbortController();
    active.current={id,controller};setStatus("loading");setDraft(null);
    const timeout=setTimeout(()=>controller.abort(),18000);
    try {
      const response=await fetch("/api/coach",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${token}`},cache:"no-store",signal:controller.signal,body:JSON.stringify({variantId:"V01",catalogVersion:"sim-1",rulesVersion:"sim-1",contentVersion:"sim-1",noticeVersion:currentNotice,consent:true,requestId:id})});
      if(!response.ok)throw new Error("unavailable");
      const parsed=responseShape.parse(await response.json());
      if(parsed.requestId!==id || parsed.noticeVersion!==currentNotice || parsed.provider!==(real?"google":"simulated"))throw new Error("wrong_request");
      if(revision.current===current && active.current?.id===id){setDraft(parsed);setStatus("draft");}
    } catch { if(revision.current===current && active.current?.id===id)setStatus("unavailable"); }
    finally {clearTimeout(timeout);if(active.current?.id===id)active.current=null;}
  }
  return <section className="page narrow coach-panel" aria-labelledby="coach-title"><p className="eyebrow">V01 / Optional local experiment</p><h2 id="coach-title">Prepare for a conversation</h2><p>The authored next step above stays unchanged. {real?"Gemini drafts a summary and three questions from this fixed fictional example. It does not assess your health.":"This coach uses a fixed simulated response, not AI."}</p>{!open?<div className="actions"><button ref={trigger} className="button" onClick={()=>setOpen(true)}>Help me prepare for a conversation</button></div>:<>
    <form onSubmit={e=>{e.preventDefault();void requestDraft();}}>
      <p className="notice">{real?`This optional experiment sends all seven canonical V01 answers to Google Gemini (${geminiModel}) under the paid account terms. Google does not use paid prompts and responses to improve its products, but retains them for a limited period for abuse detection and legal requirements. This is not zero retention. Clearing removes the draft here, but cannot recall a sent request or prevent billing. No names, personal answers or conversation history are accepted. Drafts stay out of the report.`:"This simulation sends only the fixed fictional V01 identifier and versions to your local server. Nothing is sent to Google or another AI provider. Drafts are temporary and stay out of the report."}</p>
      {real&&<p className="notice">{disclosure}</p>}
      <label>Local experiment token<input type="password" value={token} autoComplete="off" spellCheck={false} onChange={e=>{if(status!=="loading")setToken(e.target.value);}} disabled={status==="loading"}/></label>
      <label><input type="checkbox" checked={consent} onChange={e=>{if(!e.target.checked)discard();else setConsent(true);}}/> {real?"I agree to send this fixed fictional example to Google for this draft.":"I agree to send this fixed fictional example to the local simulation."}</label>
      <div className="actions"><button className="button" disabled={!consent || !/^[a-f0-9]{64}$/i.test(token) || status==="loading"} type="submit">{status==="loading"?(real?"Preparing Gemini draft…":"Preparing simulated draft…"):(real?"Request Gemini draft":"Request simulated draft")}</button><button className="quiet-button" type="button" onClick={()=>{discard();setOpen(false);requestAnimationFrame(()=>trigger.current?.focus());}}>Dismiss coach</button></div>
    </form>
    <div role="status" aria-live="polite" aria-label="Coach status">{status==="loading"&&<p>{real?"Waiting for Gemini. Your authored guidance remains available.":"Preparing the local fixture. Your authored guidance remains available."}</p>}{status==="unavailable"&&<p className="notice">{real?"The Gemini coach is unavailable. Check activation, local setup or allowance. Your authored guidance and report still work. A sent request may still use credits.":"The simulated coach is unavailable. Check local setup or allowance. Your authored guidance and report still work. No AI provider was contacted."}</p>}</div>
    {draft&&<article className="draft" aria-label={real?"AI conversation draft":"Simulated conversation draft"}><h3>{real?"AI draft from Gemini, review before use":"Simulated draft, not generated AI"}</h3><p>Fixed fictional example. Not reviewed by a clinician.</p><p>{draft.summary}</p><ol>{draft.questions.map(q=><li key={q}>{q}</li>)}</ol><p className="muted">Source: {draft.model}. This draft is excluded from printing and the authored report.</p>{draft.provider==="google"&&<p className="muted">Input tokens: {draft.usage.inputTokens}. Output tokens: {draft.usage.outputTokens}. Thinking tokens: {draft.usage.thinkingTokens}. Request time: {draft.usage.durationMs} ms. These are usage measures, not a settled provider charge.</p>}</article>}
  </>}</section>;
}
