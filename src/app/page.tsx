import Link from "next/link";

export default function Home() {
  return (
    <div className="landing">
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Reproductive health information</p>
          <h1 tabIndex={-1}>
            A clearer place
            <br />
            to begin.
          </h1>
          <p className="lead">
            Explore how a fictional situation connects to information, questions
            and a possible next step.
          </p>
          <p>
            This is an unvalidated research demonstration. It cannot assess your
            health, diagnose a condition or replace a qualified professional.
          </p>
          <div className="actions">
            <Link className="button" href="/start">
              Start fictional assessment <span aria-hidden="true">→</span>
            </Link>
          </div>
          <Link className="text-link" href="/privacy">
            Understand privacy and limits
          </Link>
        </div>
        <aside className="hero-sheet" aria-labelledby="sheet-title">
          <p className="eyebrow">An example, not an assessment of you</p>
          <h2 id="sheet-title">
            From context
            <br />
            to a next step.
          </h2>
          <ol className="preview-steps">
            <li>
              <span>01</span>
              <div>
                <strong>Explore the example</strong>
                <p>Read fixed fictional answers.</p>
              </div>
            </li>
            <li>
              <span>02</span>
              <div>
                <strong>Understand the explanation</strong>
                <p>See the reason, sources and limits.</p>
              </div>
            </li>
            <li>
              <span>03</span>
              <div>
                <strong>Finish on your terms</strong>
                <p>Clear the session when you leave.</p>
              </div>
            </li>
          </ol>
          <p className="sheet-footnote">
            Twelve authored fictional examples are available to explore.
          </p>
        </aside>
      </section>
      <section className="landing-details">
        <h2>
          Space to understand.
          <br />
          No personal health form.
        </h2>
        <div>
          <p>
            No account. No health details to type. You choose when to begin and
            can hide or clear the session at any point.
          </p>
          <p>
            Guidance is authored. You can preview a complete fictional report
            and choose whether to print or save it. Runtime AI and appointment
            booking are not included in this version.
          </p>
          <Link className="text-link" href="/sources">
            Read the supporting sources
          </Link>
        </div>
      </section>
    </div>
  );
}
