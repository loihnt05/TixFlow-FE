"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "react-oidc-context";
import { rolesOf } from "@/lib/auth";

export function SignInButton({ returnTo }: { returnTo?: string }) {
  const auth = useAuth();
  const pathname = usePathname();
  return <button type="button" disabled={auth.isLoading || !!auth.activeNavigator}
    onClick={() => void auth.signinRedirect({ state: { returnTo: returnTo ?? pathname } })}>
    Đăng nhập / Đăng ký
  </button>;
}

export function AuthError() {
  const auth = useAuth();
  if (!auth.error) return null;
  return <div role="alert" className="notice error">
    <p>Không thể hoàn tất đăng nhập: {auth.error.message}</p>
    <SignInButton returnTo="/account" />
  </div>;
}

export function SiteHeader() {
  const auth = useAuth();
  const roles = rolesOf(auth.user);
  return <header className="site-header">
    <nav aria-label="Điều hướng chính">
      <Link href="/" className="brand">TixFlow</Link>
      <div className="nav-links">
        {auth.isLoading || auth.activeNavigator ? <span role="status">Đang xác thực…</span> :
          auth.isAuthenticated ? <>
            <Link href="/account">{auth.user?.profile.name ?? auth.user?.profile.email ?? "Tài khoản"}</Link>
            {roles.map(role => <Link key={role} href={`/${role.toLowerCase()}`}>{role}</Link>)}
            <button type="button" className="secondary" onClick={() => void auth.signoutRedirect()}>Đăng xuất</button>
          </> : <SignInButton returnTo="/account" />}
      </div>
    </nav>
    <AuthError />
  </header>;
}
