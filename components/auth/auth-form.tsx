"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { ArrowLeft, Mail, Ticket } from "lucide-react";

export function AuthForm() {
  const [message, setMessage] = useState("");
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const email = String(new FormData(event.currentTarget).get("email"));
    setMessage(`Nếu ${email} đã đăng ký, hướng dẫn đặt lại mật khẩu sẽ được gửi. (Luồng mô phỏng)`);
  }

  return <main className="page-shell container flex min-h-[68vh] items-center justify-center py-10">
    <section className="w-full max-w-[440px] rounded-3xl border border-slate-100 bg-white p-6 shadow-[0_18px_60px_#20252d0d] sm:p-9">
      <Link href="/" className="brand-mark"><span className="brand-symbol"><Ticket size={18} /></span><span>TixFlow</span></Link>
      <p className="eyebrow mt-8">Tài khoản TixFlow</p>
      <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900">Đặt lại mật khẩu</h1>
      <p className="mt-2 text-sm leading-6 text-slate-500">Nhập email để nhận hướng dẫn.</p>
      <form onSubmit={submit} className="mt-6 space-y-4">
        <label className="block text-xs font-bold text-slate-600">Email
          <input required type="email" name="email" autoComplete="email" className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm font-normal" placeholder="you@example.com" />
        </label>
        {message && <p role="status" className="rounded-xl bg-emerald-50 p-3 text-xs text-emerald-700">{message}</p>}
        <button className="button-primary w-full" type="submit"><Mail size={16} />Gửi hướng dẫn</button>
      </form>
      <div className="mt-5 text-center text-xs text-slate-500">
        <Link className="inline-flex items-center gap-1 font-bold text-slate-700" href="/login"><ArrowLeft size={14} />Quay lại đăng nhập</Link>
      </div>
      <p className="mt-6 text-center text-[10px] leading-5 text-slate-400">Khôi phục mật khẩu qua Keycloak sẽ được tích hợp ở công việc tiếp theo.</p>
    </section>
  </main>;
}
