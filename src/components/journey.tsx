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
        app cannot assess symptoms or contact emergency services.
      </p>
      <a href={sources[1].url}>NHS information on urgent symptoms</a>
    </aside>
  );
}

export function StartExample() {
  const { state } = useSession();
  return <StartExampleFlow key={state.cleared ? "cleared" : "open"} />;
}

function StartExampleFlow() {
  const { state, dispatch } = useSession();
  const router = useRouter();
  const [selected, setSelected] = useState<VariantId | null>(null);
  return (
    <section className="page narrow">
      <p className="eyebrow">01 / Choose an example</p>
      <h1 tabIndex={-1}>Choose a fictional example.</h1>
      <p className="lead">
        Each example uses invented details. You will read its answers, see
        guidance and view a report.
        Please do not use your own health details.
      </p>
      <p className="notice">
        Not sure where to start? Choose <strong>General learning</strong> to try
        optional Gemini questions after the guidance. The other examples do not
        include Gemini questions.
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
          <legend>Which example would you like to explore?</legend>
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
                  Fictional example. These are not your health details.
                </span>
              </span>
            </label>
          ))}
        </fieldset>
        <p className="muted">
          There are twelve examples. Next, read how the app works and confirm
          that you are 18 or older.
        </p>
        {state.consent && (
          <p className="notice">
            Continuing starts a new example. You will be asked to agree again.
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
  const { state } = useSession();
  return (
    <ConsentFlow
      key={state.consent?.acceptedAt ?? state.variantId ?? "fresh"}
    />
  );
}

function ConsentFlow() {
  const { state, dispatch } = useSession();
  const router = useRouter();
  const [accepted, setAccepted] = useState(false);
  const [adult, setAdult] = useState(false);
  const [resultConsent, setResultConsent] = useState<string | null>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const hasConsent = state.consent !== null;
  useEffect(() => {
    if (hasConsent) heading.current?.focus();
  }, [hasConsent]);
  const leave = () => {
    dispatch({ type: "clear" });
    router.replace("/sources");
  };
  // Keep accepted sessions local: safety interruptions must not wait for a route fetch.
  if (hasActiveSession(state) && resultConsent === state.consent?.acceptedAt)
    return <Results />;
  return (
    <Guard selectedOnly>
      <section className="page narrow">
        <p className="eyebrow">02 / Your choice</p>
        <h1 tabIndex={-1}>Before you explore.</h1>
        <div className="sheet">
          <div className="sheet-row">
            <h2>What happens here</h2>
            <p>
              You read a fictional example with answers and guidance already
              written for it. You do not enter personal health details. This app
              cannot diagnose a condition, and no health professional is on call.
            </p>
          </div>
          <div className="sheet-row">
            <h2>What happens when you leave</h2>
            <p>
              Your progress stays in this browser tab. Reloading the page or
              choosing Finish and clear starts over. Clearing does not erase
              your browser history or the website host’s records of your visit.
            </p>
          </div>
          <div className="sheet-row">
            <h2>Gemini is a separate choice</h2>
            <p>
              Only General learning offers optional Gemini questions, when
              available. After the guidance, you can choose whether to send its
              fictional answers to Google. You will be asked to agree separately.
              Agreeing here does not send anything to Gemini. The live rehearsal
              prototype has its own agreement and sends the practice wording you
              preview. Its clinical fact catalog stays in the written guidance.
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
                I understand this is a fictional example and agree to continue.
              </span>
            </label>
            <div className="actions">
              <button className="button" disabled={!accepted}>
                Agree and continue
              </button>
              <button type="button" className="quiet-button" onClick={leave}>
                Leave and view sources
              </button>
            </div>
          </form>
        ) : (
          <form
            onSubmit={(event) => {
              event.preventDefault();
              dispatch({ type: "adult" });
              if (getScenario(state.variantId!).canonicalAnswers.Q01 === "no")
                router.push("/assessment");
              else setResultConsent(state.consent!.acceptedAt);
            }}
          >
            <h2 ref={heading} tabIndex={-1}>
              For adults only
            </h2>
            <p>
              This app is for people aged 18 and over. We do not ask for your
              date of birth. Next, you will see the example’s answers and
              guidance.
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
  const example = getScenario(state.variantId ?? "V01");
  const [selected, setSelected] = useState<VariantId>(example.variantId);
  const heading = useRef<HTMLParagraphElement>(null);
  useEffect(() => {
    if (state.announcement) heading.current?.focus();
  }, [state.viewRevision, state.announcement]);
  function replace(id: VariantId) {
    dispatch({ type: "switch", variantId: id });
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
                    : ", this variation is not included in this app"}
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
          Fictional example. Not clinically validated or reviewed by a clinician.
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
            The next step is written for this fictional example, not a validated
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
              Discussion actions follow the written example rules. Exact
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
        have saved. If you requested a Gemini draft, clearing cannot recall the
        request or erase records held by Google.
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
