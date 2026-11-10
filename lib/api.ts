"use client";

import { useCallback } from "react";
import { useKeycloakAuth } from "@/components/auth-provider";
import { apiBaseUrl } from "@/lib/public-config";

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly code?: string,
    public readonly retryable: boolean = false,
    public readonly retryAfter?: number,
    public readonly errors?: Record<string, string[]>,
    public readonly rawProblem?: unknown
  ) {
    super(message);
    this.name = "ApiError";
  }
}

interface ProblemPayload {
  type?: string;
  title?: string;
  status?: number;
  detail?: string;
  message?: string;
  code?: string;
  retryable?: boolean;
  errors?: Record<string, string[]>;
}

export function useApi() {
  const auth = useKeycloakAuth();
  return useCallback(async <T,>(path: string, optionsOrSignal?: RequestInit | AbortSignal): Promise<T> => {
    const baseUrl = apiBaseUrl();
    if (!baseUrl) throw new Error("API base URL is not configured.");
    if (!path.startsWith("/api/v1/")) throw new Error("Invalid API path.");
    const options = optionsOrSignal instanceof AbortSignal ? { signal: optionsOrSignal } : (optionsOrSignal ?? {});

    // Provide default 15s timeout if caller did not provide a custom signal
    let signal = options.signal;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    if (!signal && typeof AbortController !== "undefined") {
      const controller = new AbortController();
      timeoutId = setTimeout(() => controller.abort(new DOMException("The operation timed out.", "TimeoutError")), 15000);
      signal = controller.signal;
    }

    const request = async (forceRefresh = false) => {
      let token: string;
      try {
        token = await auth.getAccessToken(forceRefresh);
      } catch {
        throw new ApiError(401, "Your session has expired. Please sign in again.", "SESSION_EXPIRED");
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
        if (signal?.aborted) {
          const isTimeout = (cause as Error)?.name === "TimeoutError" || signal.reason?.name === "TimeoutError";
          if (isTimeout) {
            throw new ApiError(0, "Unable to connect to the API (request timed out). Please try again.", "TIMEOUT", true);
          }
          throw cause;
        }
        throw new ApiError(0, "Unable to connect to the API. Please try again.", "NETWORK_ERROR", true);
      }
    };

    let response: Response;
    try {
      response = await request();
      if (response.status === 401 && !signal?.aborted) response = await request(true);
    } finally {
      if (timeoutId) clearTimeout(timeoutId);
    }

    if (!response.ok) {
      const problem = await response.json().catch(() => undefined) as ProblemPayload | undefined;
      const retryAfterHeader = response.headers.get("Retry-After");
      const retryAfter = retryAfterHeader ? Number.parseInt(retryAfterHeader, 10) : undefined;

      let validationMessage: string | undefined;
      if (problem?.errors && typeof problem.errors === "object") {
        const errorEntries = Object.entries(problem.errors);
        if (errorEntries.length > 0) {
          validationMessage = errorEntries
            .map(([field, msgs]) => `${field}: ${Array.isArray(msgs) ? msgs.join(", ") : msgs}`)
            .join("; ");
        }
      }

      const defaultMessages: Record<number, string> = {
        400: "Invalid request. Please check your data.",
        401: "Your session has expired. Please sign in again.",
        403: "Access forbidden or your account has been disabled.",
        404: "The requested resource was not found.",
        409: "A conflict occurred with the current resource state. Please refresh or try again.",
        422: "The submitted data is invalid. Please check the highlighted fields.",
        429: "Too many requests. Please wait a moment before trying again.",
        500: "A server error occurred. Please try again later.",
      };

      let message = problem?.detail ?? problem?.message ?? validationMessage;
      if (!message) {
        if (response.status === 409 && (problem?.code === "PROFILE_EMAIL_CONFLICT" || problem?.title === "Local profile conflict")) {
          message = "This email conflicts with an existing profile. Please contact an administrator.";
        } else {
          message = defaultMessages[response.status] ?? "Failed to load data. Please try again.";
        }
      }

      const code = problem?.code ?? problem?.title ?? (response.status === 401 ? "UNAUTHORIZED" : undefined);
      const retryable = problem?.retryable ?? (response.status === 409 && code === "REQUEST_IN_PROGRESS") ?? response.status >= 500;

      throw new ApiError(
        response.status,
        message,
        code,
        retryable,
        Number.isFinite(retryAfter) ? retryAfter : undefined,
        problem?.errors,
        problem
      );
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
  phoneNumber?: string | null;
  status?: string;
  createdAtUtc?: string;
}
