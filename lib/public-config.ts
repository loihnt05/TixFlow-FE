function httpUrl(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  if (!trimmed) return undefined;

  try {
    const url = new URL(trimmed);
    if (url.protocol !== "http:" && url.protocol !== "https:") return undefined;
    return url.toString();
  } catch {
    return undefined;
  }
}

export function apiBaseUrl(): string | undefined {
  return httpUrl(process.env.NEXT_PUBLIC_API_URL)?.replace(/\/$/, "");
}

export interface KeycloakPublicConfig {
  url: string;
  realm: string;
  clientId: string;
  redirectUri: string;
  postLogoutRedirectUri: string;
}

export function keycloakPublicConfig(): KeycloakPublicConfig {
  const authority = httpUrl(process.env.NEXT_PUBLIC_OIDC_AUTHORITY)?.replace(/\/$/, "");
  const clientId = process.env.NEXT_PUBLIC_OIDC_CLIENT_ID?.trim();
  const redirectUri = httpUrl(process.env.NEXT_PUBLIC_OIDC_REDIRECT_URI);
  const postLogoutRedirectUri = httpUrl(process.env.NEXT_PUBLIC_OIDC_POST_LOGOUT_REDIRECT_URI);
  if (!authority || !clientId || !redirectUri || !postLogoutRedirectUri)
    throw new Error("Missing Keycloak configuration. Set up .env.local per README and restart the application.");

  const authorityUrl = new URL(authority);
  const match = authorityUrl.pathname.match(/^(.*)\/realms\/([^/]+)$/);
  if (!match) throw new Error("NEXT_PUBLIC_OIDC_AUTHORITY must end with /realms/{realm}.");
  authorityUrl.pathname = match[1] || "/";
  authorityUrl.search = "";
  authorityUrl.hash = "";

  return {
    url: authorityUrl.toString().replace(/\/$/, ""),
    realm: decodeURIComponent(match[2]),
    clientId,
    redirectUri,
    postLogoutRedirectUri,
  };
}
