"use client";
import Link from "next/link";
import { useEffect, useReducer, useRef, useState } from "react";
import {
  canonicalCase,
  goals,
  rehearsalVersions,
  starter,
  fixedQuestions,
  boundary,
  type Goal,
} from "@/lib/rehearsal/registry";
import {
  codePoints,
  inputProblem,
  normalizeQuestion,
  policyBoundary,
  validateEnvelope,
  type FeedbackRequest,
} from "@/lib/rehearsal/contract";
import { initial, reducer, type Question } from "@/lib/rehearsal/state";
const facts = canonicalCase();
export function Practice() {
  const [s, dispatch] = useReducer(reducer, initial);
  const [token, setToken] = useState("");
  const [busy, setBusy] = useState(false);
  const active = useRef<AbortController | null>(null),
    epoch = useRef(0),
    state = useRef(s);
  const printAllowed = useRef(false);
  useEffect(() => {
    state.current = s;
  }, [s]);
  function cancel() {
    epoch.current++;
    active.current?.abort();
    active.current = null;
    setBusy(false);
    printAllowed.current = false;
    document.body.removeAttribute("data-rehearsal-print");
  }
  function clear(hidden = false, goal?: Goal) {
    cancel();
    setToken("");
    dispatch({ type: "reset", hidden, goal });
  }
  useEffect(() => {
    const discard = () => {
      epoch.current++;
      active.current?.abort();
      active.current = null;
      setBusy(false);
      setToken("");
      dispatch({ type: "reset", hidden: true });
      document.body.removeAttribute("data-rehearsal-print");
    };
    const visibility = () => {
      if (document.visibilityState !== "visible") discard();
    };
    const beforePrint = () => {
      if (
        !printAllowed.current ||
        document.visibilityState !== "visible" ||
        !state.current.sheet ||
        !state.current.selected.length
      )
        document.body.removeAttribute("data-rehearsal-print");
    };
    const afterPrint = () => {
      printAllowed.current = false;
      document.body.removeAttribute("data-rehearsal-print");
    };
    document.addEventListener("visibilitychange", visibility);
    window.addEventListener("pagehide", discard);
    window.addEventListener("popstate", discard);
    window.addEventListener("rehearsal-clear", discard);
    window.addEventListener("beforeprint", beforePrint);
    window.addEventListener("afterprint", afterPrint);
    return () => {
      active.current?.abort();
      dispatch({ type: "reset" });
      setToken("");
      document.body.removeAttribute("data-rehearsal-print");
      document.removeEventListener("visibilitychange", visibility);
      window.removeEventListener("pagehide", discard);
      window.removeEventListener("popstate", discard);
      window.removeEventListener("rehearsal-clear", discard);
      window.removeEventListener("beforeprint", beforePrint);
      window.removeEventListener("afterprint", afterPrint);
    };
  }, []);
  async function send() {
    if (active.current || s.closed || s.records.length >= 2) return;
    const problem = inputProblem(s.text);
    if (problem) {
      dispatch({
        type: "error",
        message:
          "Use 1 to 400 plain text characters without identifiers, links or markup.",
      });
      return;
    }
    if (policyBoundary(s.text)) {
      cancel();
      dispatch({ type: "boundary", message: boundary });
      return;
    }
    if (!s.adult || !s.acknowledged || !s.accepted) {
      dispatch({
        type: "error",
        message:
          "Review the fictional scope and separate simulation agreement first.",
      });
      return;
    }
    const controller = new AbortController();
    active.current = controller;
    setBusy(true);
    const version = epoch.current;
    let admitted = false;
    const timer = setTimeout(() => controller.abort(), 26000);
    const post = async (path: string, body: unknown) => {
      const response = await fetch(`/api/rehearsal/${path}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-rehearsal-token": token,
        },
        body: JSON.stringify(body),
        signal: controller.signal,
        cache: "no-store",
      });
      const value = await response.json();
      if (!response.ok)
        throw new Error(
          "Simulation unavailable. You can keep editing and use the written worksheet.",
        );
      return value;
    };
    try {
      const session = s.ticket
        ? {
            ticket: s.ticket,
            rehearsalId: s.rehearsalId,
            configuration: s.configuration,
          }
        : await post("start", {
            requestId: crypto.randomUUID(),
            caseId: "V01",
            goalId: s.goal,
            versions: JSON.stringify(rehearsalVersions),
            adult: true,
            acknowledged: true,
          });
      if (version !== epoch.current) return;
      dispatch({ type: "session", ...session, revision: s.revision });
      const request: FeedbackRequest = {
        requestId: crypto.randomUUID(),
        rehearsalId: session.rehearsalId,
        ticket: session.ticket,
        caseId: "V01",
        goalId: s.goal,
        round: s.records.length === 0 ? 1 : 2,
        revision: s.revision,
        consent: true,
        notice: rehearsalVersions.notice,
        current: s.text,
        ...(s.records.length
          ? { original: s.original, receipt: s.receipt }
          : {}),
      };
      dispatch({ type: "pending", id: request.requestId });
      admitted = true;
      const value = await post("feedback", request);
      if (version !== epoch.current) return;
      dispatch({
        type: "feedback",
        value: validateEnvelope(value, request, session.configuration),
      });
    } catch {
      if (version === epoch.current)
        dispatch({
          type: "error",
          message:
            "Simulation unavailable. No Gemini was contacted. Use the written worksheet or explicitly start again.",
          closed: admitted,
        });
    } finally {
      clearTimeout(timer);
      if (version === epoch.current) {
        active.current = null;
        setBusy(false);
      }
    }
  }
  function edit(text: string, origin?: Question["origin"]) {
    const pending = !!active.current;
    cancel();
    dispatch({ type: "edit", text, origin });
    if (pending)
      dispatch({
        type: "error",
        message:
          "Pending feedback was discarded. Use the worksheet or start a fresh rehearsal.",
        closed: true,
      });
  }
  function add(text: string, origin: Question["origin"]) {
    if (inputProblem(text) || policyBoundary(text)) {
      dispatch({
        type: "error",
        message:
          "Use a plain question about the fictional example, without personal details.",
      });
      return;
    }
    dispatch({
      type: "add",
      question: { id: crypto.randomUUID(), text, origin },
    });
  }
  const selected = s.selected
    .map((id) => s.questions.find((q) => q.id === id)!)
    .filter(Boolean);
  const validSelected =
    selected.length > 0 &&
    selected.every((q) => !inputProblem(q.text) && !policyBoundary(q.text));
  if (s.hidden)
    return (
      <section className="page narrow">
        <h1 tabIndex={-1}>Practice cleared</h1>
        <p>
          Switching away or hiding removes the question, feedback and sheet.
        </p>
        <button className="button" onClick={() => clear()}>
          Start a fresh rehearsal
        </button>
        <Link href="/results" onNavigate={() => clear()}>
          Back to written result
        </Link>
      </section>
    );
  return (
    <div className="page rehearsal-page">
      <div className="practice-controls">
        <Link href="/results" onNavigate={() => clear()}>
          Back to written result
        </Link>
        <button className="quiet-button" onClick={() => clear()}>
          Clear rehearsal
        </button>
        <button className="quiet-button" onClick={() => clear(true)}>
          Dismiss rehearsal
        </button>
      </div>
      <p className="eyebrow">V01 / General learning / Local simulation</p>
      <h1 tabIndex={-1}>Practise your question.</h1>
      <p className="lede">
        An invented example, your wording, and a question plan you choose.
        Written feedback simulates a coach. No text reaches Google.
      </p>
      <p className="notice">
        Use only this fictional example. Do not enter names, contact details,
        real symptoms or test results. Switching tabs, hiding or leaving clears
        practice. This is not a medical assessment.
      </p>
      <div role="status" aria-live="polite">
        {busy
          ? "Preparing simulated feedback…"
          : s.error ||
            (s.records.length === 2
              ? "Two simulated attempts complete. You can keep editing your questions here."
              : "")}
      </div>
      {!s.sheet ? (
        <>
          <section className="practice-stage">
            <div className="stage-number">01</div>
            <div>
              <h2>Choose your learning goal</h2>
              <fieldset>
                <legend>What would you like to practise?</legend>
                {Object.entries(goals).map(([id, label]) => (
                  <label className="choice" key={id}>
                    <input
                      type="radio"
                      name="goal"
                      value={id}
                      checked={s.goal === id}
                      onChange={() => clear(false, id as Goal)}
                    />
                    {label}
                  </label>
                ))}
              </fieldset>
              <details>
                <summary>
                  All seven fictional facts and written guidance
                </summary>
                <dl>
                  {facts.facts.map((f) => (
                    <div key={f.id}>
                      <dt>{f.question}</dt>
                      <dd>{f.answer}</dd>
                    </div>
                  ))}
                </dl>
                <p>{facts.guidance}</p>
              </details>
              <label className="choice">
                <input
                  type="checkbox"
                  checked={s.adult}
                  onChange={(e) =>
                    dispatch({
                      type: "check",
                      key: "adult",
                      value: e.target.checked,
                    })
                  }
                />
                I am an adult practising with an invented example.
              </label>
              <label className="choice">
                <input
                  type="checkbox"
                  checked={s.acknowledged}
                  onChange={(e) =>
                    dispatch({
                      type: "check",
                      key: "acknowledged",
                      value: e.target.checked,
                    })
                  }
                />
                I understand this exercise does not assess me or answer clinical
                questions.
              </label>
            </div>
          </section>
          <section className="practice-stage">
            <div className="stage-number">02</div>
            <div>
              <h2>
                {s.original
                  ? "Revise your question"
                  : "Write a practice question"}
              </h2>
              {s.original && (
                <div className="comparison">
                  <div>
                    <h3>Original wording</h3>
                    <p>{s.original}</p>
                  </div>
                  <div>
                    <h3>Current revision</h3>
                    <p>{s.text}</p>
                  </div>
                </div>
              )}
              <label htmlFor="practice-question">Practice question</label>
              <textarea
                id="practice-question"
                value={s.text}
                maxLength={800}
                rows={4}
                autoComplete="off"
                data-lpignore="true"
                data-1p-ignore="true"
                aria-describedby="count"
                onChange={(e) => edit(e.target.value)}
              />
              <p id="count">{codePoints(s.text)} / 400 characters</p>
              <button
                className="quiet-button"
                onClick={() => edit(starter, "Written starter")}
              >
                Use written starter
              </button>
              <p className="small">Written starter: {starter}</p>
              <details>
                <summary>Exact simulated request preview</summary>
                <p>Goal: {goals[s.goal]}</p>
                <ul>
                  {facts.facts.map((f) => (
                    <li key={f.id}>
                      {f.question} {f.answer}
                    </li>
                  ))}
                </ul>
                <p>Written guidance: {facts.guidance}</p>
                {s.original && <p>Original: {s.original}</p>}
                <p>
                  Current text: <span className="preserve">{s.text}</span>
                </p>
                <p>
                  No Google transmission is enabled. A later Gemini service
                  would require its own notice and approval.
                </p>
              </details>
              <button
                className="quiet-button"
                disabled={normalizeQuestion(s.text) === s.text}
                onClick={() => edit(normalizeQuestion(s.text))}
              >
                Normalize spacing before preview
              </button>
              <label className="choice">
                <input
                  type="checkbox"
                  checked={s.accepted}
                  onChange={(e) => {
                    if (!e.target.checked) {
                      cancel();
                      setToken("");
                    }
                    dispatch({
                      type: "check",
                      key: "accepted",
                      value: e.target.checked,
                    });
                  }}
                />
                I agree to send this fictional practice text to the local
                simulator only.
              </label>
              <label htmlFor="local-token">Local operator access token</label>
              <input
                id="local-token"
                type="password"
                value={token}
                autoComplete="off"
                onChange={(e) => setToken(e.target.value)}
              />
              <p className="small">
                Use your local launcher token. Never enter a Gemini key.
              </p>
              {!s.closed && s.records.length < 2 ? (
                <button
                  className="button"
                  disabled={
                    busy ||
                    !s.accepted ||
                    !s.adult ||
                    !s.acknowledged ||
                    !!inputProblem(s.text) ||
                    !token
                  }
                  onClick={send}
                >
                  {s.records.length
                    ? "Request second simulated feedback"
                    : "Request simulated feedback"}
                </button>
              ) : (
                <p>
                  You can keep editing your questions here. No further feedback
                  request is available.
                </p>
              )}
              <button
                className="quiet-button"
                onClick={() => add(s.text, s.textOrigin)}
              >
                Add my wording to the question choices
              </button>
            </div>
          </section>
          <section className="practice-stage">
            <div className="stage-number">03</div>
            <div>
              <h2>Review feedback and revise</h2>
              <p>
                Authored simulation, not generated AI. Suggestions require your
                review.
              </p>
              {s.records.length === 0 ? (
                <p>
                  No feedback yet. The written worksheet below is available
                  without agreement or a request.
                </p>
              ) : (
                s.records.map((record) => (
                  <article className="feedback-record" key={record.requestId}>
                    <h3>Simulated round {record.round}</h3>
                    {record.feedback.decision === "coach" && (
                      <>
                        <h4>What is clear already</h4>
                        {record.feedback.notes
                          .filter((n) => n.type === "strength")
                          .map((n, i) => (
                            <p key={i}>{n.comment}</p>
                          ))}
                        {!record.feedback.notes.some(
                          (n) => n.type === "strength",
                        ) && (
                          <p>
                            This written fixture does not assess what is already
                            clear.
                          </p>
                        )}
                        <h4>One thing you could make clearer</h4>
                        {record.feedback.notes
                          .filter((n) => n.type === "suggestion")
                          .map((n, i) => (
                            <p key={i}>{n.comment}</p>
                          ))}
                        <h4>A suggested way to ask</h4>
                        <p>{record.feedback.rewrite}</p>
                        <button
                          className="quiet-button"
                          onClick={() =>
                            edit(
                              record.feedback.decision === "coach"
                                ? record.feedback.rewrite
                                : "",
                              "Simulated suggestion",
                            )
                          }
                        >
                          Try this wording locally
                        </button>
                      </>
                    )}
                    <p className="small">
                      Authored fixture 1. Zero model tokens.{" "}
                      {record.generatedAt}
                    </p>
                  </article>
                ))
              )}
            </div>
          </section>
          <section className="practice-stage">
            <div className="stage-number">04</div>
            <div>
              <h2>Choose your question plan</h2>
              <p>
                Choose up to three. Nothing is selected automatically. Editing
                here sends no request.
              </p>
              <details>
                <summary>Written worksheet questions</summary>
                {fixedQuestions.map((q) => (
                  <div key={q}>
                    <p>{q}</p>
                    <button
                      className="quiet-button"
                      onClick={() => add(q, "Written starter")}
                    >
                      Add written question
                    </button>
                  </div>
                ))}
              </details>
              {s.questions.length === 0 && (
                <p>
                  Your choices will appear here when you add wording or review
                  simulated suggestions.
                </p>
              )}
              {s.questions.map((q, i) => (
                <div className="question-choice" key={q.id}>
                  <label className="choice">
                    <input
                      type="checkbox"
                      checked={s.selected.includes(q.id)}
                      disabled={
                        !s.selected.includes(q.id) && s.selected.length >= 3
                      }
                      onChange={() => dispatch({ type: "select", id: q.id })}
                    />
                    Include question {i + 1}
                  </label>
                  <label htmlFor={q.id}>Question {i + 1} wording</label>
                  <textarea
                    id={q.id}
                    value={q.text}
                    rows={2}
                    onChange={(e) =>
                      dispatch({
                        type: "editQuestion",
                        id: q.id,
                        text: e.target.value,
                      })
                    }
                  />
                  <p className="small">{q.origin}</p>
                </div>
              ))}
              <h3>Selected order ({selected.length}/3)</h3>
              <ol>
                {selected.map((q, i) => (
                  <li key={q.id}>
                    <p>{q.text}</p>
                    <button
                      className="quiet-button"
                      disabled={i === 0}
                      onClick={() =>
                        dispatch({ type: "move", id: q.id, direction: -1 })
                      }
                    >
                      Move question {i + 1} up
                    </button>
                    <button
                      className="quiet-button"
                      disabled={i === selected.length - 1}
                      onClick={() =>
                        dispatch({ type: "move", id: q.id, direction: 1 })
                      }
                    >
                      Move question {i + 1} down
                    </button>
                  </li>
                ))}
              </ol>
              <label className="choice">
                <input
                  type="checkbox"
                  checked={s.includeFacts}
                  onChange={(e) =>
                    dispatch({
                      type: "check",
                      key: "includeFacts",
                      value: e.target.checked,
                    })
                  }
                />
                Include all seven fixed fictional facts
              </label>
              <label className="choice">
                <input
                  type="checkbox"
                  checked={s.includeComparison}
                  onChange={(e) =>
                    dispatch({
                      type: "check",
                      key: "includeComparison",
                      value: e.target.checked,
                    })
                  }
                />
                Include original and current wording comparison
              </label>
              <button
                className="button"
                disabled={!validSelected || busy}
                onClick={() => dispatch({ type: "sheet", value: true })}
              >
                Preview preparation sheet
              </button>
            </div>
          </section>
        </>
      ) : (
        <>
          <div className="practice-controls">
            <button
              className="button"
              onClick={() => {
                if (!validSelected || document.visibilityState !== "visible")
                  return;
                printAllowed.current = true;
                document.body.setAttribute("data-rehearsal-print", "1");
                window.print();
              }}
            >
              Print preparation sheet
            </button>
            <button
              className="quiet-button"
              onClick={() => {
                cancel();
                dispatch({ type: "sheet", value: false });
              }}
            >
              Cancel preview
            </button>
          </div>
          <p className="notice">
            Print is local and explicit. Saved or spooled copies cannot be
            recalled by Clear. Native dialog checks remain manual.
          </p>
          <article className="preparation-sheet">
            <h2>Fictional conversation preparation</h2>
            <p>V01, General learning</p>
            <p>Learning goal: {goals[s.goal]}</p>
            <ol>
              {selected.map((q) => (
                <li key={q.id}>
                  <p>{q.text}</p>
                  <p className="small">{q.origin}</p>
                </li>
              ))}
            </ol>
            {s.includeComparison && (
              <section>
                <h3>Wording comparison</h3>
                <p>Original: {s.original || s.text}</p>
                <p>Current: {s.text}</p>
              </section>
            )}
            {s.includeFacts && (
              <section>
                <h3>Fixed fictional facts</h3>
                <dl>
                  {facts.facts.map((f) => (
                    <div key={f.id}>
                      <dt>{f.question}</dt>
                      <dd>{f.answer}</dd>
                    </div>
                  ))}
                </dl>
              </section>
            )}
            <p>
              Communication practice only. Authored simulation, no model called.
              No clinical review or learning benefit established.
            </p>
            <p className="small">
              {s.records.length
                ? "Model: none. authored-fixture-1."
                : "Written worksheet only. Model: none."}{" "}
              {rehearsalVersions.goals} / {rehearsalVersions.rubric} /{" "}
              {rehearsalVersions.notice}
            </p>
            {s.records.length > 0 && (
              <p className="small">
                Simulation configuration: {s.configuration}
              </p>
            )}
            <h3>Written source links</h3>
            <ul>
              {facts.sources.map((source) => (
                <li key={source.url}>
                  <a href={source.url}>{source.title}</a> ({source.organization}
                  ). {source.note}
                </li>
              ))}
            </ul>
          </article>
        </>
      )}
    </div>
  );
}
