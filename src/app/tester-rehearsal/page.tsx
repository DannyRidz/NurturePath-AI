import { Suspense } from "react";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { TesterEntry } from "@/components/tester-entry";
import { liveVersions, liveHash } from "@/lib/rehearsal/gemini";
import "@/components/tester-rehearsal.css";
async function EnabledTester() {
  await connection();
  if (
    process.env.REHEARSAL_TESTERS_ENABLED !== "1" ||
    process.env.NURTUREPATH_STATIC_PREVIEW
  )
    notFound();
  return <TesterEntry versions={liveVersions} configuration={liveHash} />;
}
export default function Page() {
  return (
    <Suspense
      fallback={
        <section className="page narrow">
          <h1 tabIndex={-1}>Loading prototype rehearsal</h1>
        </section>
      }
    >
      <EnabledTester />
    </Suspense>
  );
}
