"use client";

import { useCallback } from "react";
import { useAuth } from "react-oidc-context";

export class ApiError extends Error {
  constructor(public readonly status: number, message: string) { super(message); }
}

export function useApi() {
  const auth = useAuth();
  const token = auth.user?.access_token;
  const expired = auth.user?.expired;
  return useCallback(async <T,>(path: string, signal?: AbortSignal): Promise<T> => {
    if (!token || expired) throw new ApiError(401, "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) throw new Error("Chưa cấu hình địa chỉ API.");
    if (!path.startsWith("/api/v1/")) throw new Error("Đường dẫn API không hợp lệ.");
    const response = await fetch(`${apiUrl.replace(/\/$/, "")}${path}`, {
      headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      credentials: "omit", cache: "no-store", redirect: "error", signal
    });
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
  }, [token, expired]);
}

export interface CurrentUser { id: string; sub: string; email: string; name: string; roles: string[] }
