"use client";

import "./globals.css";

/** Last-resort boundary: replaces the root layout, so it must render its own <html>/<body>. */
export default function GlobalError({ retry }: { error: unknown; retry: () => void }) {
  return (
    <html lang="en">
      <body>
        <main className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
          <p className="text-6xl font-black text-[#ef5360]">Oops</p>
          <h1 className="mt-3 text-2xl font-extrabold text-[#2B212B]">TixFlow ran into a problem</h1>
          <p className="mt-2 max-w-md text-sm text-gray-500">
            An unexpected error occurred. Please try again — if it keeps happening, come back in a few minutes.
          </p>
          <button type="button" onClick={() => retry()} className="button-primary mt-6">
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}
