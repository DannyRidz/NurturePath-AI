"use client";
import Link from "next/link";
import { useSession } from "./session-provider";
export function TesterLink() {
  const { state } = useSession();
  return state.variantId === "V01" ? (
    <section className="page narrow">
      <h2>Prototype question rehearsal</h2>
      <p>
        Adult prototype testers can practise fictional wording with Gemini after
        reviewing the fictional scope and Google processing notice.
      </p>
      <Link className="button" href="/tester-rehearsal">
        Practise with Gemini
      </Link>
    </section>
  ) : null;
}
