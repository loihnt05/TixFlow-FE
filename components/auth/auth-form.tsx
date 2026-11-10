"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { ArrowLeft, Info, KeyRound, LogIn, Ticket } from "lucide-react";
import { useKeycloakAuth } from "@/components/auth-provider";

export function AuthForm() {
  const auth = useKeycloakAuth();
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleResetViaKeycloak(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    try {
      await auth.resetPassword(email, "/account");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="page-shell container flex min-h-[72vh] items-center justify-center py-10">
      <section className="w-full max-w-[460px] rounded-3xl border border-slate-100 bg-white p-6 shadow-[0_18px_60px_#20252d0d] sm:p-9">
        <Link href="/" className="brand-mark">
          <span className="brand-symbol">
            <Ticket size={18} />
          </span>
          <span>TixFlow</span>
        </Link>

        <p className="eyebrow mt-8">Keycloak Identity · Realm tixflow</p>
        <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900">
          Khôi phục / Đặt lại mật khẩu
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          Thông tin xác thực của TixFlow được quản lý tập trung qua máy chủ OIDC{" "}
          <strong>Keycloak</strong> (không lưu hoặc đặt lại mật khẩu cục bộ trên ứng dụng).
        </p>

        {auth.error && (
          <p className="notice error mt-4" role="alert">
            {auth.error}
          </p>
        )}

        <form onSubmit={handleResetViaKeycloak} className="mt-6 space-y-4">
          <label className="block text-xs font-bold text-slate-600">
            Email tài khoản (Gợi ý đăng nhập Keycloak)
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm font-normal"
              placeholder="customer-a@example.test"
            />
          </label>

          <button
            className="button-primary w-full"
            type="submit"
            disabled={submitting}
          >
            <KeyRound size={16} />
            {submitting
              ? "Đang chuyển hướng tới Keycloak..."
              : "Đặt lại mật khẩu qua Keycloak (UPDATE_PASSWORD)"}
          </button>

          <button
            type="button"
            onClick={() => void auth.login("/account")}
            className="button-outline w-full"
          >
            <LogIn size={15} />
            Mở trang Đăng nhập Keycloak (Chọn &ldquo;Forgot Password?&rdquo;)
          </button>
        </form>

        <div className="mt-5 rounded-2xl border border-amber-200/80 bg-amber-50/70 p-3.5 text-[11px] leading-5 text-amber-950">
          <div className="flex items-center gap-1.5 font-bold text-amber-900">
            <Info size={14} className="shrink-0 text-amber-600" />
            <span>Ghi chú phạm vi nghiệm thu &amp; Demo (APP-26)</span>
          </div>
          <p className="mt-1 text-amber-900/90">
            Realm <code className="rounded bg-white/80 px-1 font-mono">tixflow</code> đã bật{" "}
            <code className="rounded bg-white/80 px-1 font-mono">resetPasswordAllowed: true</code>.
            Trong môi trường Docker local mặc định chưa gắn SMTP relay bên ngoài, để kiểm chứng gửi
            email khôi phục mật khẩu cần bật SMTP test (ví dụ Mailpit/MailHog trong{" "}
            <em>Keycloak Realm Settings → Email</em>), hoặc quản trị viên có thể cấp lại mật khẩu
            trực tiếp trong Keycloak Console.
          </p>
        </div>

        <div className="mt-5 text-center text-xs text-slate-500">
          <Link
            className="inline-flex items-center gap-1 font-bold text-slate-700 hover:text-[#e7653c]"
            href="/login"
          >
            <ArrowLeft size={14} />
            Quay lại trang đăng nhập
          </Link>
        </div>
      </section>
    </main>
  );
}
