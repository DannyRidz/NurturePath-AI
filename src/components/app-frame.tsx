"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { flushSync } from "react-dom";
import { SessionProvider, useSession } from "./session-provider";

function Frame({ children }: { children: ReactNode }) {
  const { dispatch } = useSession();
  const [hidden, setHidden] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const hiddenAt = useRef<number | null>(null);
  const resume = useRef<HTMLButtonElement>(null);
  const hideButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    // Next.js can retain inactive pages. Focus the visible page, not cached DOM.
    const heading = [...document.querySelectorAll<HTMLElement>("main h1")].find(
      (element) => element.getClientRects().length > 0,
    );
    heading?.focus();
  }, [pathname]);

  useEffect(() => {
    if (hidden) resume.current?.focus();
  }, [hidden]);

  useEffect(() => {
    const visibility = () => {
      if (document.visibilityState === "hidden") hiddenAt.current = Date.now();
      else if (
        hiddenAt.current !== null &&
        Date.now() - hiddenAt.current >= 120_000
      )
        setHidden(true);
    };
    const restore = (event: PageTransitionEvent) => {
      if (event.persisted) {
        // A restored document must not paint the previous session first.
        flushSync(() => dispatch({ type: "clear" }));
        router.replace("/finished");
      }
    };
    document.addEventListener("visibilitychange", visibility);
    window.addEventListener("pageshow", restore);
    return () => {
      document.removeEventListener("visibilitychange", visibility);
      window.removeEventListener("pageshow", restore);
    };
  }, [dispatch, router]);

  const clear = () => {
    dispatch({ type: "clear" });
    setHidden(false);
    router.replace("/finished");
  };

  return (
    <>
      <div
        inert={hidden}
        aria-hidden={hidden || undefined}
        className={hidden ? "concealed" : undefined}
      >
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <header className="site-header">
          <Link href="/" className="wordmark" aria-label="NurturePath home">
            NurturePath<span className="wordmark-mark">/</span>
          </Link>
          <div className="header-actions">
            <span className="demo-label">Fictional demonstration</span>
            <button
              className="quiet-button"
              ref={hideButton}
              onClick={() => setHidden(true)}
            >
              Hide screen
            </button>
          </div>
        </header>
        <main id="main">{children}</main>
        <footer className="site-footer">
          <p>Authored simulation. No runtime AI. No clinical validation.</p>
          <nav aria-label="Information">
            <Link href="/privacy">Privacy and limits</Link>
            <Link href="/sources">Sources</Link>
          </nav>
        </footer>
      </div>
      {hidden && (
        <div
          className="privacy-screen"
          role="dialog"
          aria-modal="true"
          aria-labelledby="hidden-title"
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              setHidden(false);
              requestAnimationFrame(() => hideButton.current?.focus());
            }
            if (event.key === "Tab") {
              const buttons =
                event.currentTarget.querySelectorAll<HTMLButtonElement>(
                  "button",
                );
              if (event.shiftKey && document.activeElement === buttons[0]) {
                event.preventDefault();
                buttons[1].focus();
              } else if (
                !event.shiftKey &&
                document.activeElement === buttons[1]
              ) {
                event.preventDefault();
                buttons[0].focus();
              }
            }
          }}
        >
          <div>
            <p className="eyebrow">Screen hidden</p>
            <h1 id="hidden-title">Take your time.</h1>
            <p>
              Your session is still open in this tab. Hiding is not deletion.
            </p>
            <div className="actions">
              <button
                ref={resume}
                className="button"
                onClick={() => {
                  setHidden(false);
                  requestAnimationFrame(() => hideButton.current?.focus());
                }}
              >
                Resume
              </button>
              <button className="button secondary" onClick={clear}>
                Finish and clear
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export function AppFrame({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <Frame>{children}</Frame>
    </SessionProvider>
  );
}
