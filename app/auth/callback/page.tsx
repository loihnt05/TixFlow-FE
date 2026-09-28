"use client";

import Link from "next/link";
import { useAuth } from "react-oidc-context";

export default function CallbackPage() {
  const auth = useAuth();
  return <main><section className="notice">
    {auth.error ? <p>Đăng nhập chưa hoàn tất. Vui lòng thử lại bằng nút phía trên.</p>
      : auth.isLoading ? <p role="status">Đang hoàn tất đăng nhập…</p>
      : <Link href="/account">Tiếp tục đến tài khoản</Link>}
  </section></main>;
}
