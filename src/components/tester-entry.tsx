"use client";
import Link from "next/link";
import { useSession } from "./session-provider";
import { hasActiveSession } from "@/lib/session";
import { TesterPractice } from "./tester-practice";
export function TesterEntry(props: {
  versions: Record<string, string>;
  configuration: string;
}) {
  const { state } = useSession();
  return hasActiveSession(state) && state.variantId === "V01" ? (
    <TesterPractice key={state.viewRevision} {...props} />
  ) : (
    <section className="page narrow">
      <h1 tabIndex={-1}>Start with the fictional journey</h1>
      <p>
        Choose General learning, finish the written result, then return to this
        tester link.
      </p>
      <Link className="button" href="/">
        Open fictional examples
      </Link>
    </section>
  );
}
