"use client";

import { useCallback } from "react";
import { type AuthContextProps, useAuth } from "react-oidc-context";
import type { User } from "oidc-client-ts";

// Refresh before a request rather than risking expiry while it is in flight.
const minimumTokenLifetimeSeconds = 60;
let pendingRenewal: Promise<User | null> | undefined;

export class ApiError extends Error {
  constructor(public readonly status: number, message: string) { super(message); }
}

function usableAccessToken(user: User | null | undefined): string | undefined {
  if (!user?.access_token || user.expired || (user.expires_in ?? 0) <= minimumTokenLifetimeSeconds)
    return undefined;
  return user.access_token;
}

export async function renewAccessToken(auth: Pick<AuthContextProps, "signinSilent">): Promise<string | undefined> {
  // Several mounted components can make API calls together. Reuse one refresh-token
  // grant so Keycloak's refresh-token rotation cannot make concurrent calls race.
  pendingRenewal ??= auth.signinSilent().finally(() => { pendingRenewal = undefined; });
  return usableAccessToken(await pendingRenewal);
}

export function useApi() {
  const auth = useAuth();
  const getAccessToken = useCallback(async (forceRenewal = false): Promise<string> => {
    if (!forceRenewal) {
      const currentToken = usableAccessToken(auth.user);
      if (currentToken) return currentToken;
    }

    try {
      const renewedToken = await renewAccessToken(auth);
      if (renewedToken) return renewedToken;
    } catch {
      // The API error below intentionally does not expose OIDC provider details.
    }

    throw new ApiError(401, "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
  }, [auth]);

  return useCallback(async <T,>(path: string, signal?: AbortSignal): Promise<T> => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) throw new Error("Chưa cấu hình địa chỉ API.");
    if (!path.startsWith("/api/v1/")) throw new Error("Đường dẫn API không hợp lệ.");

    const request = (token: string) => fetch(`${apiUrl.replace(/\/$/, "")}${path}`, {
      headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      credentials: "omit", cache: "no-store", redirect: "error", signal
    });

    let response = await request(await getAccessToken());
    // A sleeping/background tab can miss the proactive renewal timer. Refresh once
    // and retry only this idempotent GET-based client request path before reporting 401.
    if (response.status === 401 && !signal?.aborted)
      response = await request(await getAccessToken(true));

    if (!response.ok) {
      const messages: Record<number, string> = {
        401: "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.",
        403: "Tài khoản không có quyền truy cập hoặc đã bị vô hiệu hóa.",
        409: "Email này trùng với hồ sơ hiện có. Liên hệ quản trị viên để liên kết tài khoản.",
        422: "Tài khoản chưa có đủ thông tin email. Hãy cập nhật hồ sơ trong Keycloak."
      };
      throw new ApiError(response.status, messages[response.status] ?? "Không thể tải dữ liệu. Vui lòng thử lại.");
    }
    return response.json() as Promise<T>;
  }, [getAccessToken]);
}

export interface CurrentUser { id: string; sub: string; email: string; name: string; roles: string[] }
