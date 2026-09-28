"use client";

import { useEffect, useState } from "react";
import { useApi, type CurrentUser } from "@/lib/api";

export function CurrentUserProfile() {
  const api = useApi();
  const [user, setUser] = useState<CurrentUser>();
  const [error, setError] = useState<string>();
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    setError(undefined);
    setUser(undefined);
    api<CurrentUser>("/api/v1/users/me", controller.signal).then(setUser).catch(cause => {
      if (!controller.signal.aborted) setError(cause instanceof Error ? cause.message : "Không thể tải hồ sơ.");
    });
    return () => controller.abort();
  }, [api, attempt]);
  if (error) return <div className="notice error" role="alert"><p>{error}</p>
    <button type="button" onClick={() => setAttempt(value => value + 1)}>Thử lại</button></div>;
  if (!user) return <p role="status" className="notice">Đang tải hồ sơ…</p>;
  return <article className="profile-card">
    <p className="eyebrow">TÀI KHOẢN TIXFLOW</p>
    <h1 className="page-title">{user.name}</h1>
    <dl><dt>Email</dt><dd>{user.email}</dd><dt>Vai trò</dt><dd>{user.roles.join(", ") || "Chưa được cấp vai trò"}</dd>
      <dt>Mã khách hàng</dt><dd>{user.id}</dd></dl>
  </article>;
}
