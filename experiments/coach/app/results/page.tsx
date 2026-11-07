"use client";
import { usePathname } from "next/navigation";
import { Results } from "@/components/journey";
import { useSession } from "@/components/session-provider";
import { hasActiveSession } from "@/lib/session";
import { Coach } from "../coach";
export default function Page() { const {state}=useSession(); const pathname=usePathname(); return <><Results />{pathname === "/results" && hasActiveSession(state) && state.variantId === "V01" && <Coach key={state.viewRevision} />}</>; }
