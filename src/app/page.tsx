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
            Choose a made-up example, read its answers and guidance, and see a
            report you can print. You do not enter your own health details.
          </p>
          <p>
            This demo has not been checked for use in medical care. It cannot
            assess your health, diagnose a condition or replace a health
            professional.
          </p>
          <div className="actions">
            <Link className="button" href="/start">
              Explore a made-up example <span aria-hidden="true">→</span>
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
                <p>Pick one of twelve made-up situations.</p>
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
                <strong>View the report</strong>
                <p>Print or save a copy if you want, then finish and clear.</p>
              </div>
            </li>
          </ol>
          <p className="sheet-footnote">
            Want to try Gemini? Choose <strong>General learning</strong>. After
            its guidance, look for <strong>Help me prepare for a conversation</strong>.
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
            With your separate agreement, Google receives its made-up answers
            and Gemini writes three questions to help you prepare for a
            conversation. The summary and guidance are already written.
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
