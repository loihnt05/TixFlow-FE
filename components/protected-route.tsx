"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "react-oidc-context";
import { rolesOf, type Role } from "@/lib/auth";
import { renewAccessToken } from "@/lib/api";
import { SignInButton } from "./auth-controls";

export function ProtectedRoute({ children, roles = [] }: { children: React.ReactNode; roles?: Role[] }) {
  const auth = useAuth();
  const expiredToken = auth.user?.expired ? auth.user.access_token : undefined;
  const [failedRenewalFor, setFailedRenewalFor] = useState<string>();

  useEffect(() => {
    if (!expiredToken || failedRenewalFor === expiredToken) return;
    let cancelled = false;
    void renewAccessToken(auth).then(token => {
      if (!cancelled && !token) setFailedRenewalFor(expiredToken);
    }).catch(() => {
      if (!cancelled) setFailedRenewalFor(expiredToken);
    });
    return () => { cancelled = true; };
  }, [auth, expiredToken, failedRenewalFor]);

  if (auth.isLoading || auth.activeNavigator) return <p role="status" className="notice">Đang xác thực…</p>;
  if (auth.error) return <p className="notice">Hãy thử đăng nhập lại bằng nút phía trên.</p>;
  if (expiredToken && failedRenewalFor !== expiredToken) return <p role="status" className="notice">Đang khôi phục phiên đăng nhập…</p>;
  if (!auth.isAuthenticated || auth.user?.expired) return <section className="notice">
    <h1 className="page-title">Vui lòng đăng nhập</h1>
    <p>Đăng nhập để tiếp tục với tài khoản TixFlow của bạn.</p>
    <SignInButton />
  </section>;
  if (roles.length && !roles.some(role => rolesOf(auth.user).includes(role))) return <section className="notice" role="alert">
    <h1 className="page-title">Không có quyền truy cập</h1>
    <p>Tài khoản của bạn không có vai trò cần thiết cho trang này.</p>
    <Link href="/account">Về tài khoản</Link>
  </section>;
  return <>{children}</>;
}
