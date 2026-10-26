import Link from "next/link";
export const metadata = { title: "Privacy and limits" };
export default function Page() {
  return (
    <article className="page narrow prose">
      <p className="eyebrow">Before you begin</p>
      <h1 tabIndex={-1}>Privacy and limits.</h1>
      <p className="lead">
        This is a fictional demonstration, not a place to enter personal health
        information.
      </p>
      <h2>What stays in memory</h2>
      <p>
        The app holds your example choice, consent time, adult scope
        confirmation and progress in this tab’s memory. It does not save these
        in cookies, local storage or a database. A reload starts a fresh
        session.
      </p>
      <h2>What clearing means</h2>
      <p>
        Finish and clear removes the app’s session state. Back cannot restore
        it. Clearing does not sign you out of the preview host or erase browser
        history, host access logs or copies you saved elsewhere. Hiding the
        screen only masks it; Resume makes it visible again.
      </p>
      <h2>What reaches other services</h2>
      <p>
        Opening the site sends ordinary web requests to its host. This version
        makes no analytics, remote font or AI provider request and does not
        create patient accounts. Following a source link opens an external
        website with its own privacy practices.
      </p>
      <h2>Access to this demonstration</h2>
      <p>
        The public demonstration opens without an OpenAI or hosting account.
        The web host still processes ordinary access requests and may retain
        security and access logs. These are separate from the fictional session
        held in this app. No personal health information should be entered here.
      </p>
      <h2>What this demonstration cannot do</h2>
      <p>
        It cannot diagnose, estimate fertility, rule out a problem, recommend
        treatment, choose a local care pathway or contact a clinician. No
        clinician has approved the demonstration. Source links are not
        endorsements.
      </p>
      <h2>If you need real help</h2>
      <p>
        Ask a qualified health professional about a real concern. For sudden,
        severe testicular pain, seek urgent medical help. Do not use the example
        to decide whether your own symptoms are safe.
      </p>
      <div className="actions">
        <Link className="button" href="/start">
          Explore a fictional example
        </Link>
        <Link className="text-link" href="/sources">
          Read the sources
        </Link>
      </div>
    </article>
  );
}
