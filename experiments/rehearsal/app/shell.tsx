"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { SessionProvider } from "@/components/session-provider";
export function Frame({ children }: { children: React.ReactNode }) {
  const [hidden, setHidden] = useState(false);
  const pathname = usePathname();
  useEffect(() => {
    document.querySelector<HTMLElement>("main h1")?.focus();
  }, [pathname, hidden]);
  return (
    <SessionProvider>
      <aside aria-label="Local simulation status" className="simulation-banner">
        Local simulation. Authored feedback, no Gemini connection or spending.
      </aside>
      <header className="site-header">
        <Link
          className="wordmark"
          href="/"
          onNavigate={() => window.dispatchEvent(new Event("rehearsal-clear"))}
        >
          NurturePath / Local
        </Link>
        <button
          className="quiet-button"
          onClick={() => {
            window.dispatchEvent(new Event("rehearsal-clear"));
            setHidden(true);
          }}
        >
          Hide screen
        </button>
      </header>
      <main>
        {hidden ? (
          <section className="page narrow">
            <h1 tabIndex={-1}>Screen hidden</h1>
            <p>
              Practice content has been discarded. The written session remains
              available.
            </p>
            <button className="button" onClick={() => setHidden(false)}>
              Resume
            </button>
          </section>
        ) : (
          children
        )}
      </main>
      <footer className="site-footer">
        <p>
          Fictional communication practice. No medical assessment or measured
          learning benefit.
        </p>
        <Link
          href="/privacy"
          onNavigate={() => window.dispatchEvent(new Event("rehearsal-clear"))}
        >
          Written journey privacy
        </Link>
      </footer>
    </SessionProvider>
  );
}
