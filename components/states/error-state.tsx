import Link from "next/link";
import { AlertTriangle, RotateCw } from "lucide-react";

interface ErrorStateProps {
  title?: string;
  message?: string;
  /** Shown when provided; wire it to `retry()` (error boundaries) or a refetch handler. */
  onRetry?: () => void;
  homeHref?: string;
  homeLabel?: string;
  /** Smaller variant for inline sections inside a page. */
  compact?: boolean;
  digest?: string;
}

/** Friendly, consistent error UI used by error boundaries and failed client-side requests. */
export function ErrorState({
  title = "Something went wrong",
  message = "We couldn't load this content. Please try again in a moment.",
  onRetry,
  homeHref = "/",
  homeLabel = "Back to home",
  compact = false,
  digest,
}: ErrorStateProps) {
  return (
    <section
      role="alert"
      className={`mx-auto flex w-full max-w-lg flex-col items-center text-center ${compact ? "rounded-2xl border border-rose-100 bg-rose-50/60 px-6 py-8" : "min-h-[55vh] justify-center px-4 py-16"}`}
    >
      <span className="grid h-14 w-14 place-items-center rounded-full bg-[#FFEFF0] text-[#ef5360]">
        <AlertTriangle size={26} />
      </span>
      <h2 className="mt-5 text-xl font-extrabold tracking-tight text-[#2B212B]">{title}</h2>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-gray-500 [overflow-wrap:anywhere]">{message}</p>
      {digest && <p className="mt-2 text-[11px] text-gray-400">Reference: {digest}</p>}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        {onRetry && (
          <button type="button" onClick={onRetry} className="button-primary !min-h-10 !px-5 !text-xs">
            <RotateCw size={14} />
            Try again
          </button>
        )}
        <Link href={homeHref} className="button-outline !min-h-10 !px-5 !text-xs">
          {homeLabel}
        </Link>
      </div>
    </section>
  );
}
