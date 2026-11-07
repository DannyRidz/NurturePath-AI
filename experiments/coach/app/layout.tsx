import type { Metadata } from "next";
import "../../../src/app/globals.css";
import "./experiment.css";
import { ExperimentFrame } from "./shell";
export const metadata: Metadata = { title: "NurturePath | Local coach simulation", robots: { index: false, follow: false } };
export default function Layout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body><ExperimentFrame>{children}</ExperimentFrame></body></html>;
}
