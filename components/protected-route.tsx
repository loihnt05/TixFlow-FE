"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useKeycloakAuth } from "@/components/auth-provider";
import type { Role } from "@/lib/auth";

export function ProtectedRoute({ children, roles = [] }: { children: React.ReactNode; roles?: Role[] }) {
  const auth = useKeycloakAuth();
  const pathname = usePathname();
  if (!auth.ready) return <p role="status" className="notice">Đang xác thực…</p>;
  if (auth.error) return <p className="notice" role="alert">{auth.error}</p>;
  if (!auth.authenticated) return <section className="notice">
    <h1 className="page-title">Vui lòng đăng nhập</h1>
    <p>Đăng nhập để tiếp tục với tài khoản TixFlow của bạn.</p>
    <button type="button" onClick={() => void auth.login(pathname)}>Đăng nhập</button>
  </section>;
  if (roles.length && !roles.some(role => auth.roles.includes(role))) return <section className="notice" role="alert">
    <h1 className="page-title">Không có quyền truy cập</h1>
    <p>Tài khoản của bạn không có vai trò cần thiết cho trang này.</p>
    <Link href="/account">Về tài khoản</Link>
  </section>;
  return <>{children}</>;
}
