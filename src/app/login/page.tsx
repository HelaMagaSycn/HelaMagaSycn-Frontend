"use client";

import { ArrowRight, KeyRound, LockKeyhole, ShieldCheck, TicketCheck } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { useAuth } from "@/providers/auth-provider";

function LoginPanel() {
  const params = useSearchParams();
  const { signIn, isLoading } = useAuth();
  const returnTo = params.get("returnTo") ?? "/bookings";
  const activated = params.get("activated") === "true";

  return <main className="auth-page">
    <div className="auth-shell login-shell">
      <section className="auth-story">
        <div>
          <span className="eyebrow light"><TicketCheck size={15} /> Welcome back</span>
          <h1>Your tickets,<br />right where you left them.</h1>
          <p>Sign in to book a seat, follow payment status, and keep every journey together.</p>
          <ul><li><ShieldCheck />Secure identity service</li><li><LockKeyhole />Authorization-code protection</li></ul>
        </div>
      </section>
      <section className="auth-form-panel">
        <div className="auth-form-heading">
          <span className="auth-round-icon"><KeyRound /></span>
          <span className="eyebrow">Passenger sign in</span>
          <h2>Continue securely</h2>
          <p>You’ll sign in through HelaMaga Identity. Your password is never handled by this application.</p>
        </div>
        {activated && <div className="form-alert success" role="status">Your account is active. You can sign in now.</div>}
        <button className="button button-primary button-block auth-login-button" disabled={isLoading} onClick={() => void signIn(returnTo)}>
          Continue to sign in <ArrowRight size={18} />
        </button>
        <div className="security-callout"><ShieldCheck /><span><strong>Protected session</strong><small>OpenID Connect with PKCE and automatic token renewal</small></span></div>
        <div className="auth-switch">New to HelaMaga? <Link href="/register">Create account</Link></div>
      </section>
    </div>
  </main>;
}

export default function LoginPage() {
  return <Suspense><LoginPanel /></Suspense>;
}
