"use client";

import Keycloak, { type KeycloakTokenParsed } from "keycloak-js";
import { usePathname, useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { rolesOf, safeReturnTo, type Role } from "@/lib/auth";
import { keycloakPublicConfig } from "@/lib/public-config";

const returnToKey = "tixflow.auth.returnTo";
const defaultReturnTo = "/account";

interface AuthSnapshot {
  ready: boolean;
  authenticated: boolean;
  tokenParsed?: KeycloakTokenParsed;
  error?: string;
}

interface KeycloakAuthContextValue extends AuthSnapshot {
  roles: Role[];
  login(returnTo?: string): Promise<void>;
  register(returnTo?: string): Promise<void>;
  logout(): Promise<void>;
  getAccessToken(forceRefresh?: boolean): Promise<string>;
}

const KeycloakAuthContext = createContext<KeycloakAuthContextValue | undefined>(undefined);

let keycloak: Keycloak | undefined;
let initialization: Promise<boolean> | undefined;
let renewal: Promise<boolean> | undefined;

function currentLocation(): string {
  return `${window.location.pathname}${window.location.search}${window.location.hash}`;
}

function rememberReturnTo(value: string): void {
  window.sessionStorage.setItem(returnToKey, safeReturnTo(value));
}

function consumeReturnTo(): string {
  const value = safeReturnTo(window.sessionStorage.getItem(returnToKey), defaultReturnTo);
  window.sessionStorage.removeItem(returnToKey);
  return value;
}

export function AppAuthProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [snapshot, setSnapshot] = useState<AuthSnapshot>({ ready: false, authenticated: false });

  const syncSnapshot = useCallback((error?: string) => {
    setSnapshot({
      ready: true,
      authenticated: keycloak?.authenticated === true,
      tokenParsed: keycloak?.tokenParsed,
      error,
    });
  }, []);

  useEffect(() => {
    let disposed = false;
    try {
      const config = keycloakPublicConfig();
      keycloak ??= new Keycloak({ url: config.url, realm: config.realm, clientId: config.clientId });

      const update = () => { if (!disposed) syncSnapshot(); };
      keycloak.onAuthSuccess = update;
      keycloak.onAuthRefreshSuccess = update;
      keycloak.onAuthLogout = update;
      keycloak.onAuthError = () => { if (!disposed) syncSnapshot("Unable to complete sign-in."); };
      keycloak.onAuthRefreshError = () => {
        keycloak?.clearToken();
        if (!disposed) syncSnapshot("Your session has expired.");
      };
      keycloak.onTokenExpired = () => {
        if (!keycloak?.authenticated) return;
        renewal ??= keycloak.updateToken(30).finally(() => { renewal = undefined; });
        void renewal.then(() => {
          if (!disposed) syncSnapshot();
        }).catch(() => {
          keycloak?.clearToken();
          if (!disposed) syncSnapshot("Your session has expired.");
        });
      };

      if (pathname !== "/auth/callback") rememberReturnTo(currentLocation());
      initialization ??= keycloak.init({
        onLoad: "check-sso",
        flow: "standard",
        pkceMethod: "S256",
        responseMode: "fragment",
        redirectUri: config.redirectUri,
        checkLoginIframe: false,
        scope: "openid profile email",
      });

      void initialization.then(() => {
        if (disposed) return;
        syncSnapshot();
        if (window.location.pathname === "/auth/callback") router.replace(consumeReturnTo());
      }).catch(() => {
        if (!disposed) syncSnapshot("Unable to connect to the authentication service.");
      });
    } catch (cause) {
      if (!disposed) {
        setSnapshot({
          ready: true,
          authenticated: false,
          error: cause instanceof Error ? cause.message : "Unable to initialize authentication.",
        });
      }
    }
    return () => { disposed = true; };
  }, [pathname, router, syncSnapshot]);

  const login = useCallback(async (returnTo = defaultReturnTo) => {
    const config = keycloakPublicConfig();
    rememberReturnTo(returnTo);
    await keycloak?.login({ redirectUri: config.redirectUri });
  }, []);

  const register = useCallback(async (returnTo = defaultReturnTo) => {
    const config = keycloakPublicConfig();
    rememberReturnTo(returnTo);
    await keycloak?.register({ redirectUri: config.redirectUri });
  }, []);

  const logout = useCallback(async () => {
    const config = keycloakPublicConfig();
    await keycloak?.logout({ redirectUri: config.postLogoutRedirectUri });
  }, []);

  const getAccessToken = useCallback(async (forceRefresh = false) => {
    if (!keycloak?.authenticated || !keycloak.token) throw new Error("AUTHENTICATION_REQUIRED");
    renewal ??= keycloak.updateToken(forceRefresh ? -1 : 30).finally(() => { renewal = undefined; });
    await renewal;
    if (!keycloak.authenticated || !keycloak.token) throw new Error("AUTHENTICATION_REQUIRED");
    return keycloak.token;
  }, []);

  const value = useMemo<KeycloakAuthContextValue>(() => ({
    ...snapshot,
    roles: rolesOf(snapshot.tokenParsed),
    login,
    register,
    logout,
    getAccessToken,
  }), [getAccessToken, login, logout, register, snapshot]);

  if (!snapshot.ready) return <main><p role="status" className="notice">Checking authentication session…</p></main>;
  return <KeycloakAuthContext.Provider value={value}>{children}</KeycloakAuthContext.Provider>;
}

export function useKeycloakAuth(): KeycloakAuthContextValue {
  const context = useContext(KeycloakAuthContext);
  if (!context) throw new Error("useKeycloakAuth must be used inside AppAuthProvider.");
  return context;
}
