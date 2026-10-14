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
      if (!controller.signal.aborted) setError(cause instanceof Error ? cause.message : "Unable to load profile.");
    });
    return () => controller.abort();
  }, [api, attempt]);
  if (error) return <div className="notice error" role="alert"><p>{error}</p>
    <button type="button" onClick={() => setAttempt(value => value + 1)}>Try again</button></div>;
  if (!user) return <p role="status" className="notice">Loading profile…</p>;
  return <article className="profile-card">
    <p className="eyebrow">TIXFLOW ACCOUNT</p>
    <h1 className="page-title">{user.name}</h1>
    <dl><dt>Email</dt><dd>{user.email}</dd><dt>Roles</dt><dd>{user.roles.join(", ") || "No roles assigned"}</dd>
      <dt>Customer ID</dt><dd>{user.id}</dd></dl>
  </article>;
}
