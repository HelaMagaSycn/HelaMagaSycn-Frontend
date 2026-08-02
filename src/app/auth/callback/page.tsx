"use client";

import { CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getUserManager } from "@/lib/auth";
import { useAuth } from "@/providers/auth-provider";

export default function AuthCallbackPage() {
  const router = useRouter();
  const { refresh } = useAuth();
  const [error, setError] = useState<string>();
  useEffect(() => { void (async () => { try { await getUserManager()?.signinRedirectCallback(); await refresh(); const target = sessionStorage.getItem("helamaga:return-to") ?? "/bookings"; sessionStorage.removeItem("helamaga:return-to"); router.replace(target); } catch { setError("We could not complete sign in. Please try again."); } })(); }, [refresh, router]);
  return <main className="centered-page"><div className="loading-card"><span><CheckCircle2/></span><h1>{error??"Signing you in"}</h1><p>{error?"Return to the sign-in page to restart the secure session.":"Your secure passenger session is almost ready."}</p>{error?<button className="button button-primary" onClick={()=>router.replace("/login")}>Try again</button>:<div className="loading-bar"/>}</div></main>;
}
