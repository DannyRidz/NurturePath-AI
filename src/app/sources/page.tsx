import Link from "next/link";
import { sources } from "@/lib/scenario";
export const metadata = { title: "Sources and limitations" };
export default function Page() {
  return (
    <article className="page narrow">
      <p className="eyebrow">Evidence, in context</p>
      <h1 tabIndex={-1}>Sources and limitations.</h1>
      <p className="lead">
        These sources support general information. They do not validate the
        app’s navigation or replace a local clinical pathway.
      </p>
      <div className="source-list">
        {sources.map((source) => (
          <section key={source.id}>
            <p className="eyebrow">{source.organization}</p>
            <h2>
              <a href={source.url}>{source.title}</a>
            </h2>
            <p className="muted">{source.date}</p>
            <p>{source.note}</p>
          </section>
        ))}
      </div>
      <section className="notice">
        <h2>Actual review status</h2>
        <p>
          The example and its explanation are authored simulation content,
          version sim-1. Clinical approval and source reuse review are
          outstanding. Software tests check implementation, not clinical
          accuracy.
        </p>
      </section>
      <div className="actions">
        <Link className="button" href="/start">
          Explore the fictional example
        </Link>
        <Link className="text-link" href="/">
          Return home
        </Link>
      </div>
    </article>
  );
}
