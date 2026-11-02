import { Skeleton } from "@/components/ui/skeleton";

/**
 * Reusable loading skeletons that mirror the real page layouts so the page does not
 * jump when content arrives. They are used by the route-level `loading.tsx` files and
 * by client components that fetch data after mount.
 */

function Loading({ label = "Loading…", children, className }: { label?: string; children: React.ReactNode; className?: string }) {
  return (
    <div role="status" aria-busy="true" aria-live="polite" className={className}>
      <span className="sr-only">{label}</span>
      {children}
    </div>
  );
}

export function EventCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-lg border border-gray-200/80 bg-white shadow-sm">
      <Skeleton className="aspect-[4/5] w-full rounded-none" />
      <div className="space-y-2.5 p-3">
        <Skeleton className="h-4 w-11/12" />
        <Skeleton className="h-3 w-2/3" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="mt-2.5 h-[34px] w-full rounded-full" />
      </div>
    </div>
  );
}

export function EventGridSkeleton({ count = 10 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5">
      {Array.from({ length: count }, (_, index) => <EventCardSkeleton key={index} />)}
    </div>
  );
}

export function ArticleCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white">
      <Skeleton className="aspect-[16/10] w-full rounded-none" />
      <div className="space-y-3 p-4 sm:p-5">
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-4 w-11/12" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-full" />
        <div className="flex items-center gap-2 border-t border-gray-100 pt-3">
          <Skeleton className="h-5 w-5 rounded-full" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
    </div>
  );
}

export function ArticleGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: count }, (_, index) => <ArticleCardSkeleton key={index} />)}
    </div>
  );
}

function SectionHeadingSkeleton() {
  return (
    <div className="mb-6 space-y-2.5">
      <Skeleton className="h-3 w-32" />
      <Skeleton className="h-7 w-64 max-w-full" />
      <Skeleton className="h-3 w-80 max-w-full" />
    </div>
  );
}

export function HomeSkeleton() {
  return (
    <Loading label="Loading home page" className="min-h-screen overflow-x-clip bg-[#FDFCFD] pb-16">
      <div className="container pt-6">
        <Skeleton className="mx-auto h-[50px] max-w-[680px] rounded-lg" />
      </div>
      <div className="container mt-6">
        <Skeleton className="aspect-[16/7] w-full rounded-2xl" />
      </div>
      <div className="my-8 bg-gradient-to-r from-[#f6a5b2]/60 via-[#ef5360]/50 to-[#f8a846]/50 py-10">
        <div className="container">
          <Skeleton className="mb-5 h-8 w-56 bg-white/50" />
          <div className="flex gap-5 overflow-hidden">
            {Array.from({ length: 6 }, (_, index) => (
              <Skeleton key={index} className="aspect-[3/4] w-[200px] shrink-0 rounded-md bg-white/50 md:w-[220px]" />
            ))}
          </div>
        </div>
      </div>
      <section className="container py-8">
        <SectionHeadingSkeleton />
        <EventGridSkeleton count={10} />
      </section>
    </Loading>
  );
}

export function EventsListSkeleton() {
  return (
    <Loading label="Loading events" className="ambient-page min-h-screen py-6 sm:py-8">
      <div className="container grid items-start gap-6 lg:grid-cols-[276px_1fr] xl:gap-7">
        <aside className="hidden space-y-3.5 lg:block">
          <Skeleton className="h-24 w-full rounded-xl bg-white" />
          <Skeleton className="h-48 w-full rounded-xl bg-white" />
          <Skeleton className="h-28 w-full rounded-xl bg-white" />
          <Skeleton className="h-32 w-full rounded-xl bg-white" />
          <Skeleton className="h-72 w-full rounded-xl bg-white" />
        </aside>
        <div>
          <Skeleton className="mb-5 h-8 w-40" />
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4 sm:gap-5">
            {Array.from({ length: 12 }, (_, index) => (
              <EventCardSkeleton key={index} />
            ))}
          </div>
        </div>
      </div>
    </Loading>
  );
}

export function EventDetailSkeleton() {
  return (
    <Loading label="Loading event" className="container py-6 sm:py-8">
      <Skeleton className="aspect-[16/7] w-full rounded-2xl" />
      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          <Skeleton className="h-8 w-3/4 max-w-full" />
          <div className="flex flex-wrap gap-3">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-4 w-32" />
          </div>
          <div className="space-y-2.5 pt-4">
            {[100, 95, 90, 98, 70].map((width, index) => <Skeleton key={index} className="h-3.5" style={{ width: `${width}%` }} />)}
          </div>
        </div>
        <div className="h-fit space-y-4 rounded-2xl border border-gray-200 bg-white p-5">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-20 w-full rounded-xl" />
          <Skeleton className="h-20 w-full rounded-xl" />
          <Skeleton className="h-11 w-full rounded-full" />
        </div>
      </div>
    </Loading>
  );
}

export function ArticlesListSkeleton() {
  return (
    <Loading label="Loading articles" className="min-h-screen overflow-x-clip bg-white pb-24">
      <Skeleton className="h-9 w-full rounded-none bg-gray-900" />
      <div className="container flex h-[74px] items-center justify-between">
        <Skeleton className="h-9 w-32 rounded-full" />
        <div className="hidden gap-5 md:flex">
          {Array.from({ length: 5 }, (_, i) => (
            <Skeleton key={i} className="h-4 w-20" />
          ))}
        </div>
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
      <Skeleton className="h-[250px] sm:h-[340px] lg:h-[400px] w-full rounded-none" />
      <section className="container max-w-[1160px] mt-10">
        <Skeleton className="mb-6 h-5 w-36" />
        <div className="grid grid-cols-1 gap-7 lg:grid-cols-12">
          <div className="space-y-3 lg:col-span-6">
            <Skeleton className="aspect-[16/9] w-full rounded-none" />
            <Skeleton className="h-6 w-11/12" />
            <Skeleton className="h-3 w-1/2" />
            <Skeleton className="h-12 w-full" />
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:col-span-6">
            {Array.from({ length: 4 }, (_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="aspect-[16/9] w-full rounded-none" />
                <Skeleton className="h-4 w-11/12" />
                <Skeleton className="h-3 w-24" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </Loading>
  );
}

export function ArticleDetailSkeleton() {
  return (
    <Loading label="Loading article" className="container max-w-3xl py-8 sm:py-12">
      <Skeleton className="h-5 w-28 rounded-full" />
      <Skeleton className="mt-4 h-9 w-full" />
      <Skeleton className="mt-2 h-9 w-2/3" />
      <div className="mt-5 flex items-center gap-3">
        <Skeleton className="h-9 w-9 rounded-full" />
        <Skeleton className="h-3.5 w-40" />
      </div>
      <Skeleton className="mt-8 aspect-[16/9] w-full rounded-2xl" />
      <div className="mt-8 space-y-3">
        {[100, 96, 99, 92, 100, 84, 97, 60].map((width, index) => <Skeleton key={index} className="h-3.5" style={{ width: `${width}%` }} />)}
      </div>
    </Loading>
  );
}

export function TableSkeleton({ rows = 5, columns = 5 }: { rows?: number; columns?: number }) {
  return (
    <Loading label="Loading data">
      <div className="space-y-3">
        <div className="flex gap-4">
          {Array.from({ length: columns }, (_, index) => <Skeleton key={index} className="h-3 flex-1" />)}
        </div>
        {Array.from({ length: rows }, (_, row) => (
          <div key={row} className="flex gap-4 border-t border-slate-100 pt-3">
            {Array.from({ length: columns }, (_, column) => <Skeleton key={column} className="h-5 flex-1" />)}
          </div>
        ))}
      </div>
    </Loading>
  );
}

export function DashboardSkeleton({ withSidebar = true }: { withSidebar?: boolean }) {
  return (
    <Loading label="Loading dashboard" className="bg-[#f8f9fb]">
      <div className={`container grid gap-6 py-6 lg:py-8 ${withSidebar ? "lg:grid-cols-[230px_1fr]" : ""}`}>
        {withSidebar && (
          <aside className="hidden h-fit space-y-3 rounded-2xl border border-slate-100 bg-white p-3 lg:block">
            <Skeleton className="h-14 w-full rounded-xl" />
            <Skeleton className="h-10 w-full rounded-full" />
            {Array.from({ length: 6 }, (_, index) => <Skeleton key={index} className="h-10 w-full rounded-xl" />)}
          </aside>
        )}
        <div className="min-w-0 space-y-5">
          <div className="space-y-2">
            <Skeleton className="h-3 w-32" />
            <Skeleton className="h-8 w-56" />
          </div>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }, (_, index) => (
              <div key={index} className="space-y-3 rounded-2xl border border-slate-100 bg-white p-4">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-7 w-28" />
                <Skeleton className="h-3 w-32" />
              </div>
            ))}
          </div>
          <div className="rounded-2xl border border-slate-100 bg-white p-5">
            <TableSkeleton rows={5} columns={5} />
          </div>
        </div>
      </div>
    </Loading>
  );
}

export function FormPageSkeleton() {
  return (
    <Loading label="Loading form" className="container max-w-4xl py-8">
      <div className="space-y-5 rounded-2xl border border-slate-100 bg-white p-5 sm:p-7">
        <div className="space-y-2">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-7 w-48" />
        </div>
        {Array.from({ length: 4 }, (_, index) => (
          <div key={index} className="space-y-2">
            <Skeleton className="h-3 w-28" />
            <Skeleton className="h-11 w-full rounded-xl" />
          </div>
        ))}
        <Skeleton className="h-11 w-36 rounded-full" />
      </div>
    </Loading>
  );
}

export function ProfileSkeleton() {
  return (
    <Loading label="Loading profile" className="container py-8">
      <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
        <div className="h-fit space-y-2 rounded-2xl border border-gray-100 bg-white p-2">
          {Array.from({ length: 5 }, (_, index) => <Skeleton key={index} className="h-10 w-full rounded-xl" />)}
        </div>
        <div className="space-y-4 rounded-2xl border border-gray-100 bg-white p-6">
          <div className="flex items-center gap-4">
            <Skeleton className="h-16 w-16 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-5 w-44" />
              <Skeleton className="h-3 w-56" />
            </div>
          </div>
          {Array.from({ length: 3 }, (_, index) => <Skeleton key={index} className="h-11 w-full rounded-xl" />)}
        </div>
      </div>
    </Loading>
  );
}

/** Generic fallback used by the root `loading.tsx` for any route without a tailored skeleton. */
export function PageSkeleton() {
  return (
    <Loading label="Loading page" className="container min-h-[60vh] py-10">
      <div className="space-y-3">
        <Skeleton className="h-3 w-28" />
        <Skeleton className="h-8 w-72 max-w-full" />
        <Skeleton className="h-3.5 w-96 max-w-full" />
      </div>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }, (_, index) => <Skeleton key={index} className="h-40 w-full rounded-2xl" />)}
      </div>
    </Loading>
  );
}

/** Compact inline status used while the authentication session is being resolved. */
export function AuthLoadingSkeleton() {
  return (
    <Loading label="Checking your session" className="container py-10">
      <div className="mx-auto w-full max-w-xl space-y-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-xs">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-3.5 w-full" />
        <Skeleton className="h-3.5 w-4/5" />
        <Skeleton className="h-10 w-32 rounded-full" />
      </div>
    </Loading>
  );
}
