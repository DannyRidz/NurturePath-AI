import { Results } from "@/components/journey";
import { TesterAvailability } from "@/components/tester-availability";
import { PublicCoach } from "@/components/coach";
export const metadata = { title: "Your next step" };
export default function Page() {
  return (
    <>
      <Results />
      {process.env.NURTUREPATH_STATIC_PREVIEW !== "1" && <PublicCoach />}
      {process.env.NURTUREPATH_STATIC_PREVIEW !== "1" && <TesterAvailability />}
    </>
  );
}
