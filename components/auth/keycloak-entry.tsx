"use client";

import Link from "next/link";
import { Ticket } from "lucide-react";
import { useKeycloakAuth } from "@/components/auth-provider";

export function KeycloakEntry({ mode }: { mode: "login" | "register" }) {
  const auth = useKeycloakAuth();
  const registering = mode === "register";
  return <main className="page-shell container flex min-h-[68vh] items-center justify-center py-10">
    <section className="w-full max-w-[440px] rounded-3xl border border-slate-100 bg-white p-6 shadow-[0_18px_60px_#20252d0d] sm:p-9">
      <Link href="/" className="brand-mark"><span className="brand-symbol"><Ticket size={18} /></span><span>TixFlow</span></Link>
      <p className="eyebrow mt-8">TixFlow account</p>
      <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900">
        {registering ? "Create account" : "Sign in"}
      </h1>
      <p className="mt-2 text-sm leading-6 text-slate-500">
        Your sign-in credentials are securely managed by Keycloak.
      </p>
      {auth.error && <p className="notice error mt-5" role="alert">{auth.error}</p>}
      <button className="button-primary mt-6 w-full" type="button"
        onClick={() => void (registering ? auth.register("/account") : auth.login("/account"))}>
        {registering ? "Continue to sign up" : "Continue to sign in"}
      </button>
      <p className="mt-5 text-center text-xs text-slate-500">
        {registering ? <>Already have an account? <Link className="font-bold text-[#e7653c]" href="/login">Sign in</Link></>
          : <>Don&apos;t have an account? <Link className="font-bold text-[#e7653c]" href="/register">Sign up</Link></>}
      </p>
    </section>
  </main>;
}
