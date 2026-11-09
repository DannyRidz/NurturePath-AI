import { Suspense } from "react";
import { connection } from "next/server";
import { TesterLink } from "./tester-link";
async function Availability() {
  await connection();
  return process.env.REHEARSAL_TESTERS_ENABLED === "1" ? <TesterLink /> : null;
}
export function TesterAvailability() {
  return (
    <Suspense fallback={null}>
      <Availability />
    </Suspense>
  );
}
