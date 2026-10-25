"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { useSession } from "./session-provider";
import { hasActiveSession } from "@/lib/session";
import {
  answerLabel,
  answerLabels,
  catalog,
  choiceDestinations,
  choiceValues,
  getResult,
  getScenario,
  questions,
  questionGroups,
  reasonText,
  sources,
  type QuestionId,
  type VariantId,
} from "@/lib/scenario";

export function Guard({
  children,
  selectedOnly = false,
}: {
  children: ReactNode;
  selectedOnly?: boolean;
}) {
  const { state } = useSession();
  if (!(selectedOnly ? state.variantId : hasActiveSession(state)))
    return (
      <section className="page narrow">
        <p className="eyebrow">A fresh start</p>
        <h1 tabIndex={-1}>No assessment is open.</h1>
        <p>
          Progress lives only in this tab’s memory. Reloading starts fresh, and
          a cleared session cannot be restored with Back.
        </p>
        <Link className="button" href="/start">
          Start a fictional example
        </Link>
      </section>
    );
  return children;
}

export function ClearButton() {
  const { dispatch } = useSession();
  const router = useRouter();
  return (
    <button
      className="quiet-button"
      onClick={() => {
        dispatch({ type: "clear" });
        router.replace("/finished");
      }}
    >
      Finish and clear
    </button>
  );
}

export function SafetyNote() {
  return (
    <aside className="safety-note">
      <h2>For a real urgent concern</h2>
      <p>
        Sudden, severe testicular pain needs urgent medical help. This
        demonstration cannot assess symptoms or contact emergency services.
      </p>
      <a href={sources[1].url}>NHS information on urgent symptoms</a>
    </aside>
  );
}

export function StartExample() {
  const { state, dispatch } = useSession();
  const router = useRouter();
  const [selected, setSelected] = useState<VariantId | null>(null);
  return (
    <section className="page narrow">
      <p className="eyebrow">01 / Choose an example</p>
      <h1 tabIndex={-1}>Explore a fictional situation.</h1>
      <p className="lead">
        Read a fixed example, see how the guidance is explained, then clear the
        session. Please do not use your own health details.
      </p>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          if (!selected) return;
          dispatch({ type: "select", variantId: selected });
          router.push("/consent");
        }}
      >
        <fieldset>
          <legend>Choose a complete fictional example</legend>
          {catalog.map((example) => (
            <label
              key={example.variantId}
              className={`choice ${selected === example.variantId ? "selected" : ""}`}
            >
              <input
                type="radio"
                name="example"
                required
                checked={selected === example.variantId}
                onChange={() => setSelected(example.variantId)}
              />
              <span>
                <strong>{example.label}</strong>
                <span>
                  Authored fictional example. Not a description of your health.
                </span>
              </span>
            </label>
          ))}
        </fieldset>
        <p className="muted">
          Twelve authored examples are available. Your age scope confirmation
          comes after the session notice.
        </p>
        {state.consent && (
          <p className="notice">
            Continuing starts a new example and asks for consent again.
          </p>
        )}
        <div className="actions">
          <button className="button" disabled={!selected}>
            Continue
          </button>
          <Link className="text-link" href="/">
            Back
          </Link>
        </div>
      </form>
    </section>
  );
}

export function Consent() {
  const { state, dispatch } = useSession();
  const router = useRouter();
  const [accepted, setAccepted] = useState(false);
  const [adult, setAdult] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const hasConsent = state.consent !== null;
  useEffect(() => {
    if (hasConsent) heading.current?.focus();
  }, [hasConsent]);
  const leave = () => {
    dispatch({ type: "clear" });
    router.replace("/sources");
  };
  return (
    <Guard selectedOnly>
      <section className="page narrow">
        <p className="eyebrow">02 / Your choice</p>
        <h1 tabIndex={-1}>Before you explore.</h1>
        <div className="sheet">
          <div className="sheet-row">
            <h2>What happens here</h2>
            <p>
              You view authored fictional answers and guidance. There is no
              personal health intake, account, diagnosis or clinician on call.
            </p>
          </div>
          <div className="sheet-row">
            <h2>Where the session lives</h2>
            <p>
              Your choice and consent stay in this tab’s memory. Reloading or
              Finish and clear resets them. Visits still reach the web host;
              browser history and host logs are not erased by clearing.
            </p>
          </div>
          <div className="sheet-row">
            <h2>About AI</h2>
            <p>
              This version uses authored guidance. It makes no external AI
              request.
            </p>
          </div>
        </div>
        {!hasConsent ? (
          <form
            onSubmit={(event) => {
              event.preventDefault();
              dispatch({
                type: "consent",
                acceptedAt: new Date().toISOString(),
              });
            }}
          >
            <label className="check-row">
              <input
                type="checkbox"
                required
                checked={accepted}
                onChange={(event) => setAccepted(event.target.checked)}
              />
              <span>
                I understand this fictional demonstration and agree to this
                session.
              </span>
            </label>
            <div className="actions">
              <button className="button" disabled={!accepted}>
                Accept session notice
              </button>
              <button type="button" className="quiet-button" onClick={leave}>
                Decline and view sources
              </button>
            </div>
          </form>
        ) : (
          <form
            onSubmit={(event) => {
              event.preventDefault();
              dispatch({ type: "adult" });
              router.push(
                getScenario(state.variantId!).canonicalAnswers.Q01 === "no"
                  ? "/assessment"
                  : "/results",
              );
            }}
          >
            <h2 ref={heading} tabIndex={-1}>
              Adult scope
            </h2>
            <p>
              This demonstration is intended for adults. No date of birth is
              collected.
            </p>
            <label className="check-row">
              <input
                type="checkbox"
                required
                checked={adult}
                onChange={(event) => setAdult(event.target.checked)}
              />
              <span>
                I am 18 or older and understand this is a fictional example.
              </span>
            </label>
            <div className="actions">
              <button className="button" disabled={!adult}>
                Explore the example
              </button>
              <button type="button" className="quiet-button" onClick={leave}>
                Leave and view sources
              </button>
            </div>
          </form>
        )}
        <Link className="text-link" href="/privacy">
          Read privacy and limits
        </Link>
      </section>
    </Guard>
  );
}

export function Assessment() {
  const { state, dispatch } = useSession();
  const router = useRouter();
  const group = questionGroups[state.section];
  const example = getScenario(state.variantId ?? "V01");
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    heading.current?.focus();
  }, [state.section]);
  if (hasActiveSession(state) && example.canonicalAnswers.Q01 !== "no")
    return <Results />;
  return (
    <Guard>
      <section className="page narrow">
        <div className="section-top">
          <p className="eyebrow">
            Section {state.section + 1} of 5: {group.title}
          </p>
          <ClearButton />
        </div>
        <h1 tabIndex={-1} ref={heading}>
          {group.title}
        </h1>
        <p className="lead">{group.explanation}</p>
        <p className="notice">
          Fixed fictional answers. You are viewing {example.label}, not entering
          your own history.
        </p>
        <dl className="answer-list">
          {questions
            .filter((q) => (group.ids as readonly string[]).includes(q.id))
            .map((q) => (
              <div key={q.id}>
                <dt>{q.question}</dt>
                <dd>
                  {answerLabel(q.id, example.canonicalAnswers)}
                  <span className="answer-label">Authored example answer</span>
                </dd>
              </div>
            ))}
        </dl>
        <VariationControls ids={group.ids} />
        <div className="actions">
          <button
            className="button"
            onClick={() =>
              state.section === 3
                ? router.push("/assessment/review")
                : dispatch({ type: "section", section: state.section + 1 })
            }
          >
            {state.section === 3 ? "Review answers" : "Next section"}
          </button>
          <button
            className="quiet-button"
            onClick={() =>
              state.section === 0
                ? router.push("/consent")
                : dispatch({ type: "section", section: state.section - 1 })
            }
          >
            Back
          </button>
        </div>
        <SafetyNote />
      </section>
    </Guard>
  );
}

export function VariationControls({ ids }: { ids?: readonly QuestionId[] }) {
  const controlId = useId();
  const { state, dispatch } = useSession();
  const router = useRouter();
  const example = getScenario(state.variantId ?? "V01");
  const [selected, setSelected] = useState<VariantId>(example.variantId);
  const heading = useRef<HTMLParagraphElement>(null);
  useEffect(() => {
    if (state.announcement) heading.current?.focus();
  }, [state.viewRevision, state.announcement]);
  function replace(id: VariantId) {
    const next = getScenario(id);
    dispatch({ type: "switch", variantId: id });
    if (next.canonicalAnswers.Q01 !== "no") router.replace("/results");
  }
  return (
    <section className="variation-panel">
      <h2>Explore another fictional variation</h2>
      <p>
        Every choice below replaces the whole example, including answers on
        other sections. No personal answers are collected.
      </p>
      <p role="status" tabIndex={-1} ref={heading}>
        {state.announcement}
      </p>
      {ids ? (
        ids.map((id) => (
          <fieldset
            key={id}
            disabled={
              id === "Q07" && example.canonicalAnswers.Q02 !== "difficulty"
            }
          >
            <legend>{questions.find((q) => q.id === id)!.question}</legend>
            {choiceValues[id].map((value) => {
              const dest = choiceDestinations[id][value];
              return (
                <button
                  type="button"
                  className="variation-choice"
                  key={value}
                  disabled={!dest}
                  onClick={() => dest && replace(dest)}
                >
                  {answerLabels[value]}
                  {dest
                    ? `, load ${getScenario(dest).label}`
                    : ", this variation is not included in this demonstration"}
                </button>
              );
            })}
            {id === "Q07" && example.canonicalAnswers.Q02 !== "difficulty" && (
              <p className="muted">
                Duration choices apply only to difficulty conceiving examples.
              </p>
            )}
          </fieldset>
        ))
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            replace(selected);
          }}
        >
          <label htmlFor={controlId}>Complete fictional example</label>
          <select
            id={controlId}
            value={selected}
            onChange={(e) => setSelected(e.target.value as VariantId)}
          >
            {catalog.map((v) => (
              <option key={v.variantId} value={v.variantId}>
                {v.label}
              </option>
            ))}
          </select>
          <button className="button" type="submit">
            Replace whole example
          </button>
        </form>
      )}
    </section>
  );
}

export function AnswerSummary() {
  const { state } = useSession();
  const example = getScenario(state.variantId ?? "V01");
  return (
    <dl className="summary-list">
      {questions.map((q) => (
        <div key={q.id}>
          <dt>{q.question}</dt>
          <dd>{answerLabel(q.id, example.canonicalAnswers)}</dd>
        </div>
      ))}
    </dl>
  );
}

export function Review() {
  const { state, dispatch } = useSession();
  const router = useRouter();
  if (
    hasActiveSession(state) &&
    getScenario(state.variantId!).canonicalAnswers.Q01 !== "no"
  )
    return <Results />;
  return (
    <Guard>
      <section className="page narrow">
        <div className="section-top">
          <p className="eyebrow">Section 5 of 5: Review</p>
          <ClearButton />
        </div>
        <h1 tabIndex={-1}>The example, in full.</h1>
        <p className="lead">
          These answers belong to {getScenario(state.variantId ?? "V01").label}.
          Inspect the answers or replace the whole fictional example.
        </p>
        <AnswerSummary />
        <VariationControls key={state.variantId} />
        <div className="actions">
          <Link className="button" href="/results">
            Get guidance
          </Link>
          <button
            className="quiet-button"
            onClick={() => {
              dispatch({ type: "section", section: 0 });
              router.push("/assessment");
            }}
          >
            Inspect the example
          </button>
        </div>
      </section>
    </Guard>
  );
}

export function Results() {
  const { state } = useSession();
  const example = getScenario(state.variantId ?? "V01");
  const result = getResult(example);
  const stopped =
    result.status === "urgent" || result.status === "insufficientInformation";
  const resultHeading = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    if (stopped && resultHeading.current?.getClientRects().length)
      resultHeading.current.focus();
  }, [state.viewRevision, stopped]);
  const titles = {
    "STEP-URGENT": "Seek urgent medical help now.",
    "STEP-CLARIFY": "This example needs safety information.",
    "STEP-DISCUSS": "Prepare for a professional discussion",
    "STEP-EDUCATION": "Read, then prepare your questions",
  };
  return (
    <Guard>
      <section
        className={`page result-page ${result.status === "urgent" ? "urgent-result" : ""}`}
      >
        <div className="section-top">
          <p className="eyebrow">{example.label} / Fictional example</p>
          <ClearButton />
        </div>
        <h1 tabIndex={-1} ref={resultHeading}>
          {stopped ? titles[result.nextStepId] : "Your next step."}
        </h1>
        <p className="review-status">
          Unvalidated simulation. Not reviewed by a clinician.
        </p>
        <section className="next-step">
          <h2>{titles[result.nextStepId]}</h2>
          <p>{result.nextStep}</p>
        </section>
        <section className="support-section">
          <h2>Why this guidance appears</h2>
          {result.reasonIds.map((id) => (
            <p key={id}>{reasonText[id]}</p>
          ))}
          {result.unknownIds.length ? (
            <section aria-label="Unknown or declined information">
              <h3>Unknown or declined information</h3>
              <dl className="summary-list">
                {questions
                  .filter((q) => result.unknownIds.includes(q.id))
                  .map((q) => (
                    <div key={q.id}>
                      <dt>{q.question}</dt>
                      <dd>{answerLabel(q.id, example.canonicalAnswers)}</dd>
                    </div>
                  ))}
              </dl>
              <p>This information is not treated as no.</p>
            </section>
          ) : (
            <p>
              No applicable answer is marked unknown or declined in this
              example.
            </p>
          )}
          <p>
            These example answers cannot confirm reproductive health or rule out
            a problem. This is not a comprehensive symptom assessment.
          </p>
        </section>
        {stopped ? (
          <>
            <SafetyNote />
            <p className="notice">
              No further example questions are required. No clinician is on
              call, no alert is sent, and the app cannot verify that care was
              obtained.
            </p>
          </>
        ) : (
          <section className="support-section">
            <h2>What the example describes</h2>
            <AnswerSummary />
            <Link className="text-link" href="/assessment/review">
              Review the fictional answers
            </Link>
          </section>
        )}
        <section className="support-section">
          <h2>Sources and limits</h2>
          <p>
            The next step is authored demonstration wording, not a validated
            clinical rule. Content and rule version: sim-1.
          </p>
          {(stopped ? [sources[1]] : [sources[0]]).map((source) => (
            <p key={source.id}>
              <a href={source.url}>
                {source.organization}: {source.title}
              </a>
              <br />
              <span className="muted">
                {source.date}. {source.note}
              </span>
            </p>
          ))}
          {result.contentIds.includes("CARD-DISCUSSION") && (
            <p>
              Discussion actions follow the proposed simulation table. Exact
              guideline section verification and clinical approval remain
              outstanding; no care service or timing is inferred from a broad
              guideline link.
            </p>
          )}
          <Link className="text-link" href="/sources">
            View source details and limitations
          </Link>
        </section>
        <VariationControls key={state.variantId} />
        {!stopped && <SafetyNote />}
        <div className="actions">
          <Link className="button" href="/report">
            Preview complete report
          </Link>
          <ClearButton />
          <Link className="text-link" href="/privacy">
            What clearing does
          </Link>
        </div>
      </section>
    </Guard>
  );
}

export function Finished() {
  const { state } = useSession();
  return (
    <section className="page narrow">
      <p className="eyebrow">Session control</p>
      <h1 tabIndex={-1}>
        {state.cleared
          ? "Your session has been cleared."
          : "No session is open."}
      </h1>
      <p className="lead">
        The example choice, consent and progress are no longer held in this
        app’s session.
      </p>
      <p>
        Clearing does not erase browser history, host logs or any copies you may
        have saved. This version sends nothing to an AI provider.
      </p>
      <div className="actions">
        <Link className="button" href="/start">
          Start again
        </Link>
        <Link className="text-link" href="/sources">
          Read the sources
        </Link>
      </div>
    </section>
  );
}
