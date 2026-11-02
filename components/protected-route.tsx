"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LockKeyhole, ShieldAlert } from "lucide-react";
import { useKeycloakAuth } from "@/components/auth-provider";
import { ErrorState } from "@/components/states/error-state";
import { NotFoundView } from "@/components/states/not-found-view";
import { AuthLoadingSkeleton } from "@/components/states/skeletons";
import type { Role } from "@/lib/auth";

interface ProtectedRouteProps {
  children: React.ReactNode;
  roles?: Role[];
  /**
   * When true, visitors who are signed out or lack one of `roles` get a plain "Page not found"
   * instead of a sign-in / access-denied prompt, so the area looks like it does not exist.
   */
  notFoundWhenDenied?: boolean;
}

export function ProtectedRoute({ children, roles = [], notFoundWhenDenied = false }: ProtectedRouteProps) {
  const auth = useKeycloakAuth();
  const pathname = usePathname();
  const hasRequiredRole = !roles.length || roles.some(role => auth.roles.includes(role));

  if (!auth.ready) return <AuthLoadingSkeleton />;

  if (notFoundWhenDenied && (!auth.authenticated || !hasRequiredRole)) return <NotFoundView />;

  if (auth.error) return (
    <main className="container">
      <ErrorState
        title="We couldn't verify your session"
        message={auth.error}
        onRetry={() => window.location.reload()}
      />
    </main>
  );

  if (!auth.authenticated) return (
    <main className="container flex min-h-[55vh] items-center justify-center py-12">
      <section className="w-full max-w-md rounded-3xl border border-slate-100 bg-white p-8 text-center shadow-[0_18px_60px_#20252d0d]">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[#FFEFF0] text-[#ef5360]"><LockKeyhole size={24} /></span>
        <h1 className="mt-5 text-xl font-extrabold tracking-tight text-[#2B212B]">Please sign in</h1>
        <p className="mt-2 text-sm text-gray-500">Sign in to continue with your TixFlow account.</p>
        <button type="button" className="button-primary mt-6 w-full" onClick={() => void auth.login(pathname)}>Sign in</button>
      </section>
    </main>
  );

  if (!hasRequiredRole) return (
    <main className="container flex min-h-[55vh] items-center justify-center py-12">
      <section role="alert" className="w-full max-w-md rounded-3xl border border-slate-100 bg-white p-8 text-center shadow-[0_18px_60px_#20252d0d]">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[#FFEFF0] text-[#ef5360]"><ShieldAlert size={24} /></span>
        <h1 className="mt-5 text-xl font-extrabold tracking-tight text-[#2B212B]">Access denied</h1>
        <p className="mt-2 text-sm text-gray-500">Your account does not have the role required for this page.</p>
        <Link href="/account" className="button-outline mt-6 w-full">Back to account</Link>
      </section>
    </main>
  );

  return <>{children}</>;
}
