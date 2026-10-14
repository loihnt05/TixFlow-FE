"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useKeycloakAuth } from "@/components/auth-provider";
import type { Role } from "@/lib/auth";

export function ProtectedRoute({ children, roles = [] }: { children: React.ReactNode; roles?: Role[] }) {
  const auth = useKeycloakAuth();
  const pathname = usePathname();
  if (!auth.ready) return <p role="status" className="notice">Authenticating…</p>;
  if (auth.error) return <p className="notice" role="alert">{auth.error}</p>;
  if (!auth.authenticated) return <section className="notice">
    <h1 className="page-title">Please sign in</h1>
    <p>Sign in to continue with your TixFlow account.</p>
    <button type="button" onClick={() => void auth.login(pathname)}>Sign in</button>
  </section>;
  if (roles.length && !roles.some(role => auth.roles.includes(role))) return <section className="notice" role="alert">
    <h1 className="page-title">Access denied</h1>
    <p>Your account does not have the role required for this page.</p>
    <Link href="/account">Back to account</Link>
  </section>;
  return <>{children}</>;
}
