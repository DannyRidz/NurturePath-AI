"use client";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { noticeVersion, responseShape, type Draft } from "../lib/contract";
export function Coach() {
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
      const response=await fetch("/api/coach",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${token}`},cache:"no-store",signal:controller.signal,body:JSON.stringify({variantId:"V01",catalogVersion:"sim-1",rulesVersion:"sim-1",contentVersion:"sim-1",noticeVersion,consent:true,requestId:id})});
      if(!response.ok)throw new Error("unavailable");
      const parsed=responseShape.parse(await response.json());
      if(parsed.requestId!==id)throw new Error("wrong_request");
      if(revision.current===current && active.current?.id===id){setDraft(parsed);setStatus("draft");}
    } catch { if(revision.current===current && active.current?.id===id)setStatus("unavailable"); }
    finally {clearTimeout(timeout);if(active.current?.id===id)active.current=null;}
  }
  return <section className="page narrow coach-panel" aria-labelledby="coach-title"><p className="eyebrow">V01 / Optional local experiment</p><h2 id="coach-title">Prepare for a conversation</h2><p>The authored next step above stays unchanged. This coach uses a fixed simulated response, not AI.</p>{!open?<div className="actions"><button ref={trigger} className="button" onClick={()=>setOpen(true)}>Help me prepare for a conversation</button></div>:<>
    <form onSubmit={e=>{e.preventDefault();void requestDraft();}}>
      <p className="notice">This simulation sends only the fixed fictional V01 identifier and versions to your local server. Nothing is sent to Google or another AI provider. Drafts are temporary and stay out of the report.</p>
      <label>Local experiment token<input type="password" value={token} autoComplete="off" spellCheck={false} onChange={e=>{if(status!=="loading")setToken(e.target.value);}} disabled={status==="loading"}/></label>
      <label><input type="checkbox" checked={consent} onChange={e=>{if(!e.target.checked)discard();else setConsent(true);}}/> I agree to send this fixed fictional example to the local simulation.</label>
      <div className="actions"><button className="button" disabled={!consent || !/^[a-f0-9]{64}$/i.test(token) || status==="loading"} type="submit">{status==="loading"?"Preparing simulated draft…":"Request simulated draft"}</button><button className="quiet-button" type="button" onClick={()=>{discard();setOpen(false);requestAnimationFrame(()=>trigger.current?.focus());}}>Dismiss coach</button></div>
    </form>
    <div role="status" aria-live="polite" aria-label="Coach status">{status==="loading"&&<p>Preparing the local fixture. Your authored guidance remains available.</p>}{status==="unavailable"&&<p className="notice">The simulated coach is unavailable. Check local setup or allowance. Your authored guidance and report still work. No AI provider was contacted.</p>}</div>
    {draft&&<article className="draft" aria-label="Simulated conversation draft"><h3>Simulated draft, not generated AI</h3><p>Fixed fictional example. Not reviewed by a clinician.</p><p>{draft.summary}</p><ol>{draft.questions.map(q=><li key={q}>{q}</li>)}</ol><p className="muted">Source: authored-fixture-1. This draft is excluded from printing and the authored report.</p></article>}
  </>}</section>;
}
