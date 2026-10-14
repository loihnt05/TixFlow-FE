"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useKeycloakAuth } from "@/components/auth-provider";

export function SignInButton({ returnTo }: { returnTo?: string }) {
  const auth = useKeycloakAuth();
  const pathname = usePathname();
  return <button type="button" disabled={!auth.ready}
    onClick={() => void auth.login(returnTo ?? pathname)}>
    Sign in / Sign up
  </button>;
}

export function AuthError() {
  const auth = useKeycloakAuth();
  if (!auth.error) return null;
  return <div role="alert" className="notice error">
    <p>{auth.error}</p>
    <SignInButton returnTo="/account" />
  </div>;
}

export function SiteHeader() {
  const auth = useKeycloakAuth();
  const displayName = String(auth.tokenParsed?.name ?? auth.tokenParsed?.preferred_username ?? "Account");
  return <header className="site-header">
    <nav aria-label="Main navigation">
      <Link href="/" className="brand">TixFlow</Link>
      <div className="nav-links">
        {auth.authenticated ? <>
          <Link href="/account">{displayName}</Link>
          <button type="button" className="secondary" onClick={() => void auth.logout()}>Sign out</button>
        </> : <SignInButton returnTo="/account" />}
      </div>
    </nav>
    <AuthError />
  </header>;
}
