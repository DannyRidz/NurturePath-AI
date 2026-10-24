"use client";
import Link from "next/link";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <section className="page narrow">
      <h1 tabIndex={-1}>This page could not open.</h1>
      <p>You can retry. Reloading the tab starts a fresh session.</p>
      <div className="actions">
        <button className="button" onClick={reset}>
          Try again
        </button>
        <Link href="/" className="text-link">
          Return home
        </Link>
      </div>
    </section>
  );
}
