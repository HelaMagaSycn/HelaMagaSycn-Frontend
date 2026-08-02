"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight, BadgeCheck, CheckCircle2, MailCheck, ShieldCheck, UserPlus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { api, ApiError } from "@/lib/api";

const schema = z.object({
  nic: z.string().trim().regex(/^(?:\d{9}[VvXx]|\d{12})$/, "Enter a valid old or new Sri Lankan NIC"),
  email: z.email("Enter a valid email address"),
  fullName: z.string().trim().min(3, "Enter your full name").max(120),
});
type FormData = z.infer<typeof schema>;

export default function RegisterPage() {
  const [submittedEmail, setSubmittedEmail] = useState<string>();
  const [serverError, setServerError] = useState<string>();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({ resolver: zodResolver(schema) });
  const submit = async (data: FormData) => {
    setServerError(undefined);
    try { const response = await api.register(data); setSubmittedEmail(response.email); }
    catch (error) { setServerError(error instanceof ApiError ? error.message : "Registration could not be completed."); }
  };

  return <main className="auth-page"><div className="auth-shell"><section className="auth-story"><Link href="/" className="back-link light"><ArrowLeft size={16}/>Back to journeys</Link><div><span className="eyebrow light"><UserPlus size={15}/> Passenger membership</span><h1>One account.<br/>Every journey.</h1><p>Save your passenger details, book reserved seats, and receive live confirmation updates.</p><ul><li><BadgeCheck/>Book and manage tickets</li><li><MailCheck/>Receive booking notifications</li><li><ShieldCheck/>Identity protected by Keycloak</li></ul></div><small>Your NIC is used only for passenger verification.</small></section>
    <section className="auth-form-panel">{submittedEmail ? <div className="activation-success"><span><CheckCircle2/></span><small>Registration received</small><h2>Check your email</h2><p>We sent an activation link to <strong>{submittedEmail}</strong>. Open it to verify your email and choose a password, then sign in.</p><div className="activation-steps"><div><i>1</i><span><strong>Open the email</strong><small>Use the latest HelaMaga message</small></span></div><div><i>2</i><span><strong>Activate your account</strong><small>Verify and choose a password</small></span></div><div><i>3</i><span><strong>Start booking</strong><small>Your profile is already prepared</small></span></div></div><Link className="button button-primary button-block" href="/login">Continue to sign in <ArrowRight size={17}/></Link><a className="dev-mail-link" href="http://localhost:8025" target="_blank" rel="noreferrer">Local demo: open Mailpit inbox</a></div> : <><div className="auth-form-heading"><span className="eyebrow">Create your account</span><h2>Tell us who’s travelling</h2><p>Only the essentials. You’ll set a password securely from the activation email.</p></div><form className="auth-form" onSubmit={handleSubmit(submit)} noValidate>
      <label>Full name<input {...register("fullName")} autoComplete="name" placeholder="e.g. Sasan Dilantha" aria-invalid={Boolean(errors.fullName)}/>{errors.fullName&&<small className="field-error">{errors.fullName.message}</small>}</label>
      <label>NIC number<input {...register("nic")} autoComplete="off" placeholder="200012345678 or 123456789V" aria-invalid={Boolean(errors.nic)}/>{errors.nic&&<small className="field-error">{errors.nic.message}</small>}</label>
      <label>Email address<input {...register("email")} type="email" autoComplete="email" placeholder="you@example.com" aria-invalid={Boolean(errors.email)}/>{errors.email&&<small className="field-error">{errors.email.message}</small>}</label>
      {serverError&&<div className="form-alert">{serverError}</div>}
      <button className="button button-primary button-block" disabled={isSubmitting}>{isSubmitting?"Creating account…":"Create account"}<ArrowRight size={17}/></button>
      <p className="form-consent">By continuing, you agree to the passenger terms and privacy policy.</p>
    </form><div className="auth-switch">Already registered? <Link href="/login">Sign in</Link></div></>}</section></div></main>;
}
