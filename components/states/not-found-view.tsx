import Link from "next/link";
import { Compass, Home } from "lucide-react";

/**
 * Standard 404 UI. Rendered by `app/not-found.tsx` and also by guarded areas
 * (e.g. the organizer workspace) so unauthorized visitors can't tell the page exists.
 */
export function NotFoundView() {
  return (
    <main className="container flex min-h-[65vh] flex-col items-center justify-center py-16 text-center">
      <p className="bg-gradient-to-r from-[#f6a5b2] via-[#ef5360] to-[#f8a846] bg-clip-text text-7xl font-black tracking-tight text-transparent sm:text-8xl">
        404
      </p>
      <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-[#2B212B] sm:text-3xl">Page not found</h1>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-gray-500">
        The page you are looking for doesn&apos;t exist, has been moved, or you don&apos;t have access to it.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link href="/" className="button-primary !min-h-10 !px-5 !text-xs">
          <Home size={14} />
          Back to home
        </Link>
        <Link href="/events" className="button-outline !min-h-10 !px-5 !text-xs">
          <Compass size={14} />
          Discover events
        </Link>
      </div>
    </main>
  );
}
