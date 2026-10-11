"use client";

import { useKeycloakAuth } from "@/components/auth-provider";

export default function CallbackPage() {
  const auth = useKeycloakAuth();
  if (auth.error) return <main><p role="alert" className="notice error">{auth.error}</p></main>;
  return <main><p role="status" className="notice">Đang hoàn tất đăng nhập…</p></main>;
}
