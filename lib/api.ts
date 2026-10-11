"use client";

import { useCallback } from "react";
import { useKeycloakAuth } from "@/components/auth-provider";
import { apiBaseUrl } from "@/lib/public-config";

export class ApiError extends Error {
  constructor(public readonly status: number, message: string) { super(message); }
}

export function useApi() {
  const auth = useKeycloakAuth();
  return useCallback(async <T,>(path: string, signal?: AbortSignal): Promise<T> => {
    const baseUrl = apiBaseUrl();
    if (!baseUrl) throw new Error("Chưa cấu hình địa chỉ API.");
    if (!path.startsWith("/api/v1/")) throw new Error("Đường dẫn API không hợp lệ.");

    const request = async (forceRefresh = false) => {
      let token: string;
      try {
        token = await auth.getAccessToken(forceRefresh);
      } catch {
        throw new ApiError(401, "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
      }
      try {
        return await fetch(`${baseUrl}${path}`, {
          headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
          credentials: "omit",
          cache: "no-store",
          redirect: "error",
          signal,
        });
      } catch (cause) {
        if (signal?.aborted) throw cause;
        throw new ApiError(0, "Không thể kết nối tới API. Vui lòng thử lại.");
      }
    };

    let response = await request();
    if (response.status === 401 && !signal?.aborted) response = await request(true);

    if (!response.ok) {
      const messages: Record<number, string> = {
        401: "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.",
        403: "Tài khoản không có quyền truy cập hoặc đã bị vô hiệu hóa.",
        409: "Email này trùng với hồ sơ hiện có. Liên hệ quản trị viên để xử lý tài khoản.",
      };
      throw new ApiError(response.status, messages[response.status] ?? "Không thể tải dữ liệu. Vui lòng thử lại.");
    }
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
