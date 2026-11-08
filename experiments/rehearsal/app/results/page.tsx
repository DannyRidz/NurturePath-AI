"use client";
import Link from "next/link";
import { Results } from "@/components/journey";
import { useSession } from "@/components/session-provider";
import { hasActiveSession } from "@/lib/session";
import { eligible } from "@/lib/rehearsal/registry";
export default function Page() {
  const { state } = useSession();
  return (
    <>
      <Results />
      {hasActiveSession(state) && eligible(state.variantId) && (
        <section className="page narrow rehearsal-entry">
          <p className="eyebrow">Optional local exercise</p>
          <h2>Practise a question for a health conversation</h2>
          <p>
            Use invented V01 facts to practise wording. Feedback is written
            simulation, not AI.
          </p>
          <Link className="button" href="/rehearsal">
            Start local rehearsal
          </Link>
        </section>
      )}
    </>
  );
}
