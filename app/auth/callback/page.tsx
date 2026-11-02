"use client";

import { useKeycloakAuth } from "@/components/auth-provider";
import { ErrorState } from "@/components/states/error-state";
import { AuthLoadingSkeleton } from "@/components/states/skeletons";

export default function CallbackPage() {
  const auth = useKeycloakAuth();
  if (auth.error) return (
    <main className="container">
      <ErrorState
        title="Sign-in failed"
        message={auth.error}
        homeHref="/login"
        homeLabel="Back to sign in"
        onRetry={() => window.location.assign("/login")}
      />
    </main>
  );
  return <main><AuthLoadingSkeleton /></main>;
}
