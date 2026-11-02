"use client";

import { useEffect } from "react";
import { ErrorState } from "@/components/states/error-state";

export default function RouteError({ error, retry }: { error: unknown; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const digest = error instanceof Error ? (error as Error & { digest?: string }).digest : undefined;

  return (
    <main className="container">
      <ErrorState
        title="We hit a snag"
        message="Something unexpected happened while loading this page. You can try again or head back to the home page."
        digest={digest}
        onRetry={retry}
      />
    </main>
  );
}
