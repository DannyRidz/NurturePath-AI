"use client";
import { useRouter } from "next/navigation";
import { useSession } from "@/components/session-provider";
export default function Start() { const {dispatch}=useSession(); const router=useRouter(); return <section className="page narrow"><p className="eyebrow">V01 / Fictional example</p><h1 tabIndex={-1}>General learning</h1><p>This local experiment enables only the fixed general learning example. You cannot enter personal information.</p><div className="actions"><button className="button" onClick={()=>{dispatch({type:"select",variantId:"V01"});router.push("/consent");}}>Choose V01</button></div></section>; }
