"use client";
import Link from "next/link";
import { useSession } from "@/components/session-provider";
import { hasActiveSession } from "@/lib/session";
import { Practice } from "../practice";
export default function Page() {
  const { state } = useSession();
  return hasActiveSession(state) && state.variantId === "V01" ? (
    <Practice key={state.viewRevision} />
  ) : (
    <section className="page narrow">
      <h1 tabIndex={-1}>Start with the fictional journey</h1>
      <p>Rehearsal is available only after the eligible V01 written result.</p>
      <Link className="button" href="/">
        Return to the written journey
      </Link>
    </section>
  );
}
