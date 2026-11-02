"use client";

import { useKeycloakAuth } from "@/components/auth-provider";

/** Renders `children` only for signed-in accounts that hold the Organizer role. */
export function OrganizerOnly({ children }: { children: React.ReactNode }) {
  const auth = useKeycloakAuth();
  return auth.ready && auth.authenticated && auth.roles.includes("Organizer") ? <>{children}</> : null;
}
