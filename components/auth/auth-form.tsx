"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { ArrowLeft, Mail, Ticket } from "lucide-react";
import { login, register } from "@/lib/mock-api/users";

type Mode = "login" | "register" | "forgot";
export function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const isRegister = mode === "register";
  const isForgot = mode === "forgot";
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = String(data.get("email"));
    if (isForgot) { setMessage(`If ${email} is registered, a reset link is on its way. (Mock flow)`); return; }
    if (isRegister) await register(String(data.get("name")), email, String(data.get("phone")));
    else await login(email, String(data.get("password")));
    router.push("/account");
    router.refresh();
  }
  return <main className="page-shell container flex min-h-[68vh] items-center justify-center py-10"><div className="w-full max-w-[440px] rounded-3xl border border-slate-100 bg-white p-6 shadow-[0_18px_60px_#20252d0d] sm:p-9"><Link href="/" className="brand-mark"><span className="brand-symbol"><Ticket size={18} /></span><span>zipevent</span></Link><p className="eyebrow mt-8">Welcome to Zipevent</p><h1 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900">{isForgot ? "Reset your password" : isRegister ? "Create your account" : "Log in to your account"}</h1><p className="mt-2 text-sm leading-6 text-slate-500">{isForgot ? "Enter your email and we’ll send you a reset link." : "Keep your tickets and favourite events all in one place."}</p><form onSubmit={submit} className="mt-6 space-y-4">{isRegister && <label className="block text-xs font-bold text-slate-600">Full name<input required name="name" autoComplete="name" className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm font-normal" placeholder="Your name" /></label>}<label className="block text-xs font-bold text-slate-600">Email address<input required type="email" name="email" autoComplete="email" className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm font-normal" placeholder="you@example.com" /></label>{isRegister && <label className="block text-xs font-bold text-slate-600">Phone number<input required type="tel" name="phone" autoComplete="tel" className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm font-normal" placeholder="+84" /></label>}{!isForgot && <label className="block text-xs font-bold text-slate-600">Password<input required type="password" name="password" autoComplete={isRegister ? "new-password" : "current-password"} minLength={6} className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm font-normal" placeholder="At least 6 characters" /></label>}{message && <p role="status" className="rounded-xl bg-emerald-50 p-3 text-xs text-emerald-700">{message}</p>}<button className="button-primary w-full" type="submit">{isForgot ? <><Mail size={16} />Send reset link</> : isRegister ? "Create account" : "Log in"}</button></form><div className="mt-5 text-center text-xs text-slate-500">{isForgot ? <Link className="inline-flex items-center gap-1 font-bold text-slate-700" href="/login"><ArrowLeft size={14} />Back to log in</Link> : isRegister ? <>Already have an account? <Link className="font-bold text-[#e7653c]" href="/login">Log in</Link></> : <>New to Zipevent? <Link className="font-bold text-[#e7653c]" href="/register">Create account</Link><div className="mt-3"><Link href="/forgot-password" className="font-semibold text-slate-500 hover:text-[#e7653c]">Forgot password?</Link></div></>}</div><p className="mt-6 text-center text-[10px] leading-5 text-slate-400">Mock account only. You can use any email and password for this prototype.</p></div></main>;
}
