import type { Metadata } from "next";
import "../../../src/app/globals.css";
import "./rehearsal.css";
import { Frame } from "./shell";
export const metadata: Metadata = {
  title: "NurturePath | Local rehearsal simulation",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";
export default function Layout({ children }: { children: React.ReactNode }) {
  if (process.env.VERCEL || process.env.REHEARSAL_LOCAL_SIMULATION !== "1")
    return (
      <html lang="en">
        <body>
          <main>
            <h1>Local rehearsal unavailable</h1>
            <p>This workspace is local simulation only.</p>
          </main>
        </body>
      </html>
    );
  return (
    <html lang="en">
      <body>
        <Frame>{children}</Frame>
      </body>
    </html>
  );
}
