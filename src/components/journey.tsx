"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { useSession } from "./session-provider";
import { hasActiveSession } from "@/lib/session";
import {
  durationAnswer,
  getLearningResult,
  learningExample,
  questionGroups,
  sources,
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
  const [selected, setSelected] = useState(false);
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
          dispatch({ type: "select" });
          router.push("/consent");
        }}
      >
        <fieldset>
          <legend>Available in this first demonstration</legend>
          <label className={`choice ${selected ? "selected" : ""}`}>
            <input
              type="radio"
              name="example"
              required
              checked={selected}
              onChange={() => setSelected(true)}
            />
            <span>
              <strong>General learning</strong>
              <span>
                A person exploring reproductive health information, with no
                current concern described in the example.
              </span>
            </span>
          </label>
        </fieldset>
        <p className="muted">
          One authored example is available. Other variations are not included
          yet. Your age scope confirmation comes after the session notice.
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
              router.push("/assessment");
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
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    heading.current?.focus();
  }, [state.section]);
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
          Fixed fictional answers. You are viewing the general learning example,
          not entering your own history.
        </p>
        <dl className="answer-list">
          {group.questions.map((q) => (
            <div key={q.id}>
              <dt>{q.question}</dt>
              <dd>
                {q.answer}
                <span className="answer-label">Authored example answer</span>
              </dd>
            </div>
          ))}
        </dl>
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

export function AnswerSummary() {
  return (
    <dl className="summary-list">
      {[...questionGroups.flatMap((g) => [...g.questions]), durationAnswer].map(
        (q) => (
          <div key={q.id}>
            <dt>{q.question}</dt>
            <dd>{q.answer}</dd>
          </div>
        ),
      )}
    </dl>
  );
}

export function Review() {
  const { dispatch } = useSession();
  const router = useRouter();
  return (
    <Guard>
      <section className="page narrow">
        <div className="section-top">
          <p className="eyebrow">Section 5 of 5: Review</p>
          <ClearButton />
        </div>
        <h1 tabIndex={-1}>The example, in full.</h1>
        <p className="lead">
          These answers belong to the fictional general learning example. They
          cannot be changed individually in this version.
        </p>
        <AnswerSummary />
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
  const result = getLearningResult(learningExample);
  return (
    <Guard>
      <section className="page result-page">
        <div className="section-top">
          <p className="eyebrow">General learning / Fictional example</p>
          <ClearButton />
        </div>
        <h1 tabIndex={-1}>Your next step.</h1>
        <p className="review-status">
          Unvalidated simulation. Not reviewed by a clinician.
        </p>
        <div className="result-sheet">
          <section className="result-row">
            <span className="row-number" aria-hidden="true">
              01
            </span>
            <div>
              <h2>What the example describes</h2>
              <p>
                A person seeking general reproductive health information. No
                current concern or relevant history is described, and no
                additional lifestyle information is requested.
              </p>
            </div>
          </section>
          <section className="result-row">
            <span className="row-number" aria-hidden="true">
              02
            </span>
            <div>
              <h2>Why this guidance appears</h2>
              <p>{result.reason}</p>
              <p>
                No applicable answer is marked unknown in this example. Missing
                or unknown information in other cases must not be treated as
                “no.”
              </p>
            </div>
          </section>
          <section className="result-row next-step">
            <span className="row-number" aria-hidden="true">
              03
            </span>
            <div>
              <h2>Read, then prepare your questions</h2>
              <p>{result.nextStep}</p>
            </div>
          </section>
        </div>
        <section className="support-section">
          <h2>A starting point for a conversation</h2>
          <p>
            Consider which information you would like a qualified professional
            to explain. This demonstration cannot choose tests, treatment, a
            care service or appointment timing for you.
          </p>
          <Link className="text-link" href="/assessment/review">
            Review the fictional answers
          </Link>
        </section>
        <section className="support-section">
          <h2>Sources and limits</h2>
          <p>
            The next step is authored demonstration wording, not a validated
            clinical rule. WHO provides general background on fertility care;
            its fact sheet does not approve this tool.
          </p>
          <p>
            <a href={sources[0].url}>
              {sources[0].organization}: {sources[0].title}
            </a>
            <br />
            <span className="muted">
              {sources[0].date}. Content and rule version: sim-1.
            </span>
          </p>
          <Link className="text-link" href="/sources">
            View source details and limitations
          </Link>
        </section>
        <SafetyNote />
        <div className="actions">
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
