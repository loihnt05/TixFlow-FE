"use client";

import { useEffect, useState } from "react";
import { useApi, type CurrentUser } from "@/lib/api";
import { ErrorState } from "@/components/states/error-state";
import { ProfileSkeleton } from "@/components/states/skeletons";

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
  if (error) return <ErrorState compact title="We couldn't load your profile" message={error} onRetry={() => setAttempt(value => value + 1)} />;
  if (!user) return <ProfileSkeleton />;
  return <article className="profile-card">
    <p className="eyebrow">TIXFLOW ACCOUNT</p>
    <h1 className="page-title">{user.name}</h1>
    <dl><dt>Email</dt><dd>{user.email}</dd><dt>Roles</dt><dd>{user.roles.join(", ") || "No roles assigned"}</dd>
      <dt>Customer ID</dt><dd>{user.id}</dd></dl>
  </article>;
}
