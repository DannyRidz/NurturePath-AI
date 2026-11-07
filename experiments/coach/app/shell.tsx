"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { SessionProvider } from "@/components/session-provider";
import { CoachDisclosure, CoachEnvironment, useCoachMode } from "./environment";
import type { CoachMode } from "../lib/contract";
function Shell({children}:{children:React.ReactNode}) {
  const mode=useCoachMode();
  const [hidden,setHidden]=useState(false);
  const pathname=usePathname();
  const hide=useRef<HTMLButtonElement>(null);
  const resume=useRef<HTMLButtonElement>(null);
  useEffect(()=>{
    document.querySelector<HTMLElement>("main h1")?.focus();
  },[pathname,hidden]);
  useEffect(()=>{if(hidden)resume.current?.focus();},[hidden]);
  return <><aside className="experiment-banner" aria-label="Local experiment status">{mode==="mock"?"Local simulation only. No AI provider connected. No spending.":"Local Gemini experiment. Requests require verified activation and use paid credits. Fictional V01 only."}</aside><header className="site-header"><Link className="wordmark" href="/">NurturePath / Local</Link><button className="quiet-button" ref={hide} onClick={()=>setHidden(true)}>Hide screen</button></header>{hidden?<section className="page narrow" aria-label="Screen hidden"><h1 tabIndex={-1}>Screen hidden</h1><p>Hiding discards the coach draft. Your authored session remains open.</p><button ref={resume} className="button" onClick={()=>{setHidden(false);requestAnimationFrame(()=>hide.current?.focus());}}>Resume</button></section>:<main id="main" data-route={pathname}>{children}</main>}<footer className="site-footer"><p>{mode==="mock"?"Simulated coach. Authored fixtures, not generated AI.":"Gemini drafts require review. Authored guidance determines every next step."}</p><Link href="/privacy">Privacy and limits</Link></footer></>;
}
export function ExperimentFrame({children,mode,disclosure}:{children:React.ReactNode;mode:CoachMode;disclosure:string}) { return <CoachEnvironment.Provider value={mode}><CoachDisclosure.Provider value={disclosure}><SessionProvider><Shell>{children}</Shell></SessionProvider></CoachDisclosure.Provider></CoachEnvironment.Provider>; }
