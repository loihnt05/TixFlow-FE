"use client";

import { useCallback } from "react";
import { useKeycloakAuth } from "@/components/auth-provider";
import { apiBaseUrl } from "@/lib/public-config";

export class ApiError extends Error {
  constructor(public readonly status: number, message: string) { super(message); }
}

export function useApi() {
  const auth = useKeycloakAuth();
  return useCallback(async <T,>(path: string, optionsOrSignal?: RequestInit | AbortSignal): Promise<T> => {
    const baseUrl = apiBaseUrl();
    if (!baseUrl) throw new Error("API base URL is not configured.");
    if (!path.startsWith("/api/v1/")) throw new Error("Invalid API path.");
    const options = optionsOrSignal instanceof AbortSignal ? { signal: optionsOrSignal } : (optionsOrSignal ?? {});
    const signal = options.signal ?? undefined;

    const request = async (forceRefresh = false) => {
      let token: string;
      try {
        token = await auth.getAccessToken(forceRefresh);
      } catch {
        throw new ApiError(401, "Your session has expired. Please sign in again.");
      }
      try {
        return await fetch(`${baseUrl}${path}`, {
          ...options,
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            ...(options.body ? { "Content-Type": "application/json" } : {}),
            ...options.headers,
          },
          credentials: "omit",
          cache: "no-store",
          redirect: "error",
          signal,
        });
      } catch (cause) {
        if (signal?.aborted) throw cause;
        throw new ApiError(0, "Unable to connect to the API. Please try again.");
      }
    };

    let response = await request();
    if (response.status === 401 && !signal?.aborted) response = await request(true);

    if (!response.ok) {
      const problem = await response.json().catch(() => undefined) as { detail?: string } | undefined;
      const messages: Record<number, string> = {
        401: "Your session has expired. Please sign in again.",
        403: "Access forbidden or your account has been disabled.",
        409: "This email conflicts with an existing profile. Please contact an administrator.",
      };
      throw new ApiError(response.status, problem?.detail ?? messages[response.status] ?? "Failed to load data. Please try again.");
    }
    if (response.status === 204) return undefined as T;
    return response.json() as Promise<T>;
  }, [auth]);
}

export interface CurrentUser {
  id: string;
  sub: string;
  email: string;
  name: string;
  roles: string[];
}
