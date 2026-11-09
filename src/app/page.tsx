import Link from "next/link";

export default function Home() {
  return (
    <div className="landing">
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">For adults aged 18 and over</p>
          <h1 tabIndex={-1}>
            Learn about male
            <br />
            reproductive health.
          </h1>
          <p className="lead">
            Explore male reproductive health through twelve fictional examples.
            Read the guidance, prepare conversation questions and preview a
            report. Each example uses invented details, not your health history.
          </p>
          <p>
            For learning and conversation preparation. This app is not approved
            for medical care. It cannot assess your health, diagnose a condition
            or replace a health professional.
          </p>
          <div className="actions">
            <Link className="button" href="/start">
              Explore a fictional example <span aria-hidden="true">→</span>
            </Link>
          </div>
          <Link className="text-link" href="/privacy">
            Read about privacy and limits
          </Link>
        </div>
        <aside className="hero-sheet" aria-labelledby="sheet-title">
          <p className="eyebrow">How it works</p>
          <h2 id="sheet-title">
            Follow an example,
            <br />
            step by step.
          </h2>
          <ol className="preview-steps">
            <li>
              <span>01</span>
              <div>
                <strong>Choose an example</strong>
                <p>
                  Start with General learning to try Gemini, or choose another
                  situation.
                </p>
              </div>
            </li>
            <li>
              <span>02</span>
              <div>
                <strong>Read the answers and guidance</strong>
                <p>See why the guidance appears and where it comes from.</p>
              </div>
            </li>
            <li>
              <span>03</span>
              <div>
                <strong>Prepare questions and view the report</strong>
                <p>
                  Try optional Gemini questions in General learning. Preview or
                  print the written report in any example.
                </p>
              </div>
            </li>
          </ol>
          <p className="sheet-footnote">
            To try Gemini in <strong>General learning</strong>, select{" "}
            <strong>Help me prepare for a conversation</strong> after the
            guidance. Review the Google notice and choose whether to request
            three AI questions.
          </p>
        </aside>
      </section>
      <section className="landing-details">
        <h2>
          Optional AI questions.
          <br />
          Your choice.
        </h2>
        <div>
          <p>
            General learning is the only example with optional Gemini questions.
            With your separate agreement, Google receives its fictional answers
            and Gemini writes three questions to help you prepare for a
            conversation. The summary and guidance are already written. The live
            rehearsal prototype also lets adults practise their own fictional
            wording, with a separate preview and Google agreement.
          </p>
          <p>
            You can skip Gemini and still use the guidance and report. Gemini
            may be unavailable if it is paused or its request allowance runs out.
            AI questions do not appear in the report.
          </p>
          <p>
            No account or personal health form is needed. You can hide the
            screen or finish and clear at any time. This app does not book
            appointments.
          </p>
          <Link className="text-link" href="/sources">
            Read the supporting sources
          </Link>
        </div>
      </section>
    </div>
  );
}
