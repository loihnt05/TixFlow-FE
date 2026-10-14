"use client";

import { useEffect, useState } from "react";
import { ProtectedRoute } from "./protected-route";
import { useApi } from "@/lib/api";
import type { Role } from "@/lib/auth";

function RoleAccess({ role }: { role: Role }) {
  const api = useApi();
  const [result, setResult] = useState<{ allowed?: boolean; error?: string }>({});
  useEffect(() => {
    const controller = new AbortController();
    setResult({});
    api<{ allowed: boolean }>(`/api/v1/users/access/${role.toLowerCase()}`, controller.signal)
      .then(setResult).catch(cause => {
        if (!controller.signal.aborted) setResult({ error: cause instanceof Error ? cause.message : "Unable to verify access." });
      });
    return () => controller.abort();
  }, [api, role]);
  return <article className="profile-card"><h1 className="page-title">{role}</h1>
    {result.error ? <p role="alert">{result.error}</p> : result.allowed
      ? <p>Access confirmed. Business features will be added here.</p>
      : <p role="status">Checking access…</p>}
  </article>;
}

export function RolePage({ role }: { role: Role }) {
  return <main><ProtectedRoute roles={[role]}><RoleAccess role={role} /></ProtectedRoute></main>;
}
