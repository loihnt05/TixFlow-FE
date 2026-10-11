import type { KeycloakTokenParsed } from "keycloak-js";

export const applicationRoles = ["Admin", "Organizer", "Customer"] as const;
export type Role = (typeof applicationRoles)[number];

export function rolesOf(token: KeycloakTokenParsed | null | undefined): Role[] {
  const roles = token?.roles;
  return Array.isArray(roles)
    ? applicationRoles.filter(role => roles.includes(role))
    : [];
}

export function safeReturnTo(value: unknown, fallback = "/account"): string {
  if (typeof value !== "string" || !value.startsWith("/") || value.startsWith("//")) return fallback;
  const url = new URL(value, window.location.origin);
  if (url.origin !== window.location.origin || url.pathname.startsWith("/auth/")) return fallback;
  return `${url.pathname}${url.search}${url.hash}`;
}
