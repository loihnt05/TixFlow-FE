"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthProvider } from "react-oidc-context";
import { InMemoryWebStorage, UserManager, WebStorageStateStore } from "oidc-client-ts";
import { safeReturnTo } from "@/lib/auth";

export function AppAuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [manager, setManager] = useState<UserManager>();
  const [error, setError] = useState<string>();

  useEffect(() => {
    try {
      const authority = process.env.NEXT_PUBLIC_OIDC_AUTHORITY;
      const clientId = process.env.NEXT_PUBLIC_OIDC_CLIENT_ID;
      const redirectUri = process.env.NEXT_PUBLIC_OIDC_REDIRECT_URI;
      const logoutUri = process.env.NEXT_PUBLIC_OIDC_POST_LOGOUT_REDIRECT_URI;
      if (!authority || !clientId || !redirectUri || !logoutUri) {
        throw new Error("Thiếu cấu hình đăng nhập. Tạo .env.local theo README và khởi động lại ứng dụng.");
      }
      const userManager = new UserManager({
        authority,
        client_id: clientId,
        redirect_uri: redirectUri,
        post_logout_redirect_uri: logoutUri,
        response_type: "code",
        scope: "openid profile email",
        // oidc-client-ts uses S256 PKCE by default; never disable it.
        disablePKCE: false,
        userStore: new WebStorageStateStore({ store: new InMemoryWebStorage() }),
        // Only short-lived request state/nonce/PKCE verifier survive the hosted login redirect.
        // Access, refresh and ID tokens remain exclusively in userStore (memory).
        stateStore: new WebStorageStateStore({ store: window.sessionStorage }),
        automaticSilentRenew: true,
        monitorSession: false,
        loadUserInfo: false
      });
      setManager(userManager);
      return () => userManager.stopSilentRenew();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Không thể khởi tạo đăng nhập.");
    }
  }, []);

  if (error) return <main><p role="alert" className="notice error">{error}</p></main>;
  if (!manager) return <main><p role="status" className="notice">Đang tải TixFlow…</p></main>;

  return (
    <AuthProvider userManager={manager} onSigninCallback={user => {
      const state = user?.state as { returnTo?: unknown } | undefined;
      // Remove the authorization code/state from the address bar after validation.
      const destination = safeReturnTo(state?.returnTo);
      window.history.replaceState({}, document.title, destination);
      router.replace(destination);
    }}>
      {children}
    </AuthProvider>
  );
}
