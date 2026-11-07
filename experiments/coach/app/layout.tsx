import type { Metadata } from "next";
import "../../../src/app/globals.css";
import "./experiment.css";
import { ExperimentFrame } from "./shell";
import { readActivation } from "../lib/gemini";
export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "NurturePath | Local coach experiment", robots: { index: false, follow: false } };
export default async function Layout({ children }: { children: React.ReactNode }) {
  const mode=process.env.COACH_ADAPTER==="gemini"?"gemini":"mock";
  let disclosure="Account processing review is incomplete. Gemini requests remain disabled.";
  if(mode==="gemini"){
    try{disclosure=(await readActivation(process.env.COACH_ACTIVATION_PATH,process.env.COACH_EXPERIMENT_ID)).retentionDisclosure;}catch{/* No activation evidence is a normal unavailable state. */}
  }
  return <html lang="en"><body><ExperimentFrame mode={mode} disclosure={disclosure}>{children}</ExperimentFrame></body></html>;
}
