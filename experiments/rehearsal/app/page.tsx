import Link from "next/link";
export default function Home() {
  return (
    <section className="page narrow">
      <p className="eyebrow">Local experiment / V01</p>
      <h1 tabIndex={-1}>Conversation preparation, one fictional example.</h1>
      <p>
        This workspace tests a coach using simulated responses. No AI provider
        is connected. It does not assess your health.
      </p>
      <p>
        The public demonstration is unchanged. Drafts stay out of the complete
        authored report.
      </p>
      <div className="actions">
        <Link className="button" href="/start">
          Start the local example
        </Link>
      </div>
    </section>
  );
}
