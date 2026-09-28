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
        if (!controller.signal.aborted) setResult({ error: cause instanceof Error ? cause.message : "Không thể xác thực quyền truy cập." });
      });
    return () => controller.abort();
  }, [api, role]);
  return <article className="profile-card"><h1 className="page-title">{role}</h1>
    {result.error ? <p role="alert">{result.error}</p> : result.allowed
      ? <p>Quyền truy cập đã được xác nhận. Các chức năng nghiệp vụ sẽ được bổ sung tại đây.</p>
      : <p role="status">Đang kiểm tra quyền truy cập…</p>}
  </article>;
}

export function RolePage({ role }: { role: Role }) {
  return <main><ProtectedRoute roles={[role]}><RoleAccess role={role} /></ProtectedRoute></main>;
}
