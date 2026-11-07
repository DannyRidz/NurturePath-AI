"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { publicNoticeVersion, geminiModel, publicDraftShape, type PublicDraft } from "@/lib/coach/contract";
import { useSession } from "./session-provider";
import { hasActiveSession } from "@/lib/session";

function CoachPanel() {
  const [open, setOpen] = useState(false), [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "draft" | "unavailable">("idle");
  const [draft, setDraft] = useState<PublicDraft | null>(null);
  const revision = useRef(0), active = useRef<{ id: string; controller: AbortController } | null>(null);
  const pathname = usePathname(), trigger = useRef<HTMLButtonElement>(null);
  const discard = useCallback(() => {
    revision.current++; active.current?.controller.abort(); active.current = null;
    setDraft(null); setStatus("idle"); setConsent(false);
  }, []);
  useEffect(() => () => { revision.current++; active.current?.controller.abort(); active.current = null; }, []);
  useEffect(() => { if (pathname !== "/results") { revision.current++; active.current?.controller.abort(); active.current = null; } }, [pathname]);
  useEffect(() => {
    const invalidate = () => { discard(); setOpen(false); };
    const visibility = () => { if (document.visibilityState === "hidden") invalidate(); };
    window.addEventListener("nurturepath:hide", invalidate);
    document.addEventListener("visibilitychange", visibility);
    return () => { window.removeEventListener("nurturepath:hide", invalidate); document.removeEventListener("visibilitychange", visibility); };
  }, [discard]);
  async function requestDraft() {
    if (!consent || active.current) return;
    const id = crypto.randomUUID(), current = revision.current, controller = new AbortController();
    active.current = { id, controller }; setStatus("loading"); setDraft(null);
    const timeout = setTimeout(() => controller.abort(), 26_000);
    try {
      const response = await fetch("/api/coach", {
        method: "POST", headers: { "Content-Type": "application/json" }, cache: "no-store", signal: controller.signal,
        body: JSON.stringify({ variantId: "V01", catalogVersion: "sim-1", rulesVersion: "sim-1", contentVersion: "sim-1", noticeVersion: publicNoticeVersion, consent: true, requestId: id }),
      });
      if (!response.ok) throw new Error("unavailable");
      const parsed = publicDraftShape.parse(await response.json());
      if (parsed.requestId !== id) throw new Error("wrong_request");
      if (revision.current === current && active.current?.id === id) { setDraft(parsed); setStatus("draft"); }
    } catch { if (revision.current === current && active.current?.id === id) setStatus("unavailable"); }
    finally { clearTimeout(timeout); if (active.current?.id === id) active.current = null; }
  }
  return <section className="page narrow coach-panel" aria-labelledby="coach-title">
    <p className="eyebrow">V01 / Optional Gemini coach</p>
    <h2 id="coach-title">Prepare for a conversation</h2>
    <p>Gemini can draft a summary and three discussion questions from this fixed fictional example. It does not assess your health. The authored guidance above stays unchanged.</p>
    {!open ? <div className="actions"><button ref={trigger} className="button" onClick={() => setOpen(true)}>Help me prepare for a conversation</button></div> : <>
      <form onSubmit={e => { e.preventDefault(); void requestDraft(); }}>
        <p className="notice">With your agreement, this coach sends all seven fixed V01 answers to Google Gemini ({geminiModel}) under paid service terms. Google does not use paid prompts and responses to improve its products, but can retain them for abuse detection and legal requirements. This is not zero retention. Clearing or cancelling cannot recall a sent request. No personal answers, names or history are accepted. Drafts stay out of the report.</p>
        <label><input type="checkbox" checked={consent} onChange={e => { if (!e.target.checked) discard(); else setConsent(true); }} /> I agree to send this fixed fictional example to Google for this draft.</label>
        <div className="actions">
          <button className="button" disabled={!consent || status === "loading"} type="submit">{status === "loading" ? "Preparing Gemini draft…" : "Request Gemini draft"}</button>
          <button className="quiet-button" type="button" onClick={() => { discard(); setOpen(false); requestAnimationFrame(() => trigger.current?.focus()); }}>Dismiss coach</button>
        </div>
      </form>
      <div role="status" aria-live="polite" aria-label="Coach status">
        {status === "loading" && <p>Waiting for Gemini. Your authored guidance remains available.</p>}
        {status === "unavailable" && <p className="notice">The Gemini coach is unavailable. It may be busy, paused or out of allowance. Your authored guidance and report still work. A sent request may still use credits.</p>}
      </div>
      {draft && <article className="draft" aria-label="AI conversation draft">
        <h3>AI draft from Gemini, review before use</h3>
        <p>Fixed fictional example. Not reviewed by a clinician.</p>
        <p>{draft.summary}</p><ol>{draft.questions.map(q => <li key={q}>{q}</li>)}</ol>
        <p className="muted">Source: {draft.model}. This draft is excluded from printing and the authored report.</p>
      </article>}
    </>}
  </section>;
}
export function PublicCoach() {
  const { state } = useSession();
  const pathname = usePathname();
  return pathname === "/results" && hasActiveSession(state) && state.variantId === "V01" ? <CoachPanel key={state.viewRevision} /> : null;
}
