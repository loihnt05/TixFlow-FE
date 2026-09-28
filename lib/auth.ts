import type { User } from "oidc-client-ts";

export const applicationRoles = ["Admin", "Organizer", "Customer"] as const;
export type Role = (typeof applicationRoles)[number];

export function rolesOf(user: User | null | undefined): Role[] {
  const roles = user?.profile.roles;
  return Array.isArray(roles)
    ? applicationRoles.filter(role => roles.includes(role))
    : [];
}

export function safeReturnTo(value: unknown): string {
  if (typeof value !== "string" || !value.startsWith("/") || value.startsWith("//")) return "/account";
  const url = new URL(value, window.location.origin);
  if (url.origin !== window.location.origin || url.pathname.startsWith("/auth/")) return "/account";
  return `${url.pathname}${url.search}${url.hash}`;
}
