"use client";

import { useEffect, useState } from "react";
import { ProtectedRoute } from "./protected-route";
import { ErrorState } from "@/components/states/error-state";
import { Skeleton } from "@/components/ui/skeleton";
import { useApi } from "@/lib/api";
import type { Role } from "@/lib/auth";

function RoleAccess({ role }: { role: Role }) {
  const api = useApi();
  const [result, setResult] = useState<{ allowed?: boolean; error?: string }>({});
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    setResult({});
    api<{ allowed: boolean }>(`/api/v1/users/access/${role.toLowerCase()}`, controller.signal)
      .then(setResult).catch(cause => {
        if (!controller.signal.aborted) setResult({ error: cause instanceof Error ? cause.message : "Unable to verify access." });
      });
    return () => controller.abort();
  }, [api, role, attempt]);
  if (result.error) return <ErrorState compact title="We couldn't verify your access" message={result.error} onRetry={() => setAttempt(value => value + 1)} />;
  return <article className="profile-card"><h1 className="page-title">{role}</h1>
    {result.allowed
      ? <p className="mt-3 text-sm text-gray-600">Access confirmed. Business features will be added here.</p>
      : <div role="status" aria-busy="true" className="mt-4 space-y-2.5"><span className="sr-only">Checking access…</span><Skeleton className="h-3.5 w-3/4" /><Skeleton className="h-3.5 w-1/2" /></div>}
  </article>;
}

export function RolePage({ role }: { role: Role }) {
  return <main className="container py-8"><ProtectedRoute roles={[role]}><RoleAccess role={role} /></ProtectedRoute></main>;
}
