import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { EventGrid } from "@/components/events/event-grid";
import { eventCategories } from "@/lib/mock/events";
import { getFeaturedEvents, getPopularEvents } from "@/lib/mock-api/events";

export default async function HomePage() {
  const [featuredEvents, popularEvents] = await Promise.all([getFeaturedEvents(), getPopularEvents()]);
  const categories = eventCategories;
  return (
    <main className="page-shell">
      <section className="container pt-7 sm:pt-9">
        <div className="relative overflow-hidden rounded-[24px] bg-[#fff1e9] px-6 py-8 sm:px-10 sm:py-10 lg:px-14">
          <div className="relative z-10 max-w-[570px]">
            <p className="eyebrow mb-3 flex items-center gap-2"><Sparkles size={14} /> Inspiration everywhere</p>
            <h1 className="max-w-[520px] text-balance text-[32px] font-extrabold leading-[1.08] tracking-[-.05em] text-[#272a31] sm:text-[44px]">Find your next <span className="text-[#ed7046]">great experience.</span></h1>
            <p className="mt-3 max-w-[430px] text-sm leading-6 text-[#747782] sm:text-[15px]">Discover concerts, ideas, communities, and moments worth making time for.</p>
            <Link href="/events" className="button-primary mt-6">Explore all events <ArrowRight size={16} /></Link>
          </div>
          <div className="pointer-events-none absolute -right-8 -top-20 hidden h-[360px] w-[460px] rotate-[-8deg] rounded-[42px] bg-[#ffd9c8] lg:block" />
          <div className="pointer-events-none absolute right-16 top-9 hidden h-[250px] w-[320px] overflow-hidden rounded-[26px] border-[8px] border-white shadow-xl lg:block">
            <img className="h-full w-full object-cover" src="https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=900&q=85" alt="People enjoying a live event" />
          </div>
          <div className="pointer-events-none absolute bottom-7 right-[360px] hidden rounded-xl bg-white px-4 py-3 shadow-lg lg:block"><div className="text-[10px] font-bold uppercase tracking-widest text-[#ed7046]">This weekend</div><div className="mt-1 text-sm font-bold text-slate-800">Make a little room for fun</div></div>
        </div>
      </section>

      <section className="container pt-10 sm:pt-12">
        <div className="mb-5 flex items-end justify-between gap-4"><div><h2 className="section-title">Explore by category</h2><p className="section-subtitle">A little something for every kind of curious.</p></div><Link href="/events" className="hidden items-center gap-1 text-xs font-bold text-[#e7653c] sm:flex">View all <ArrowRight size={14} /></Link></div>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 sm:gap-3 md:grid-cols-6 lg:grid-cols-12">
          {categories.map((category, index) => <Link key={`${category.label}-${index}`} href={`/events?category=${category.value}`} className="category-chip !min-w-0 !gap-2 !px-2 !py-3">
            <span className="category-icon !h-9 !w-9 !rounded-xl text-base">{category.icon}</span><span className="line-clamp-1 max-w-full text-center text-[10px] sm:text-[11px]">{category.label}</span>
          </Link>)}
        </div>
      </section>

      <section className="container pt-12 sm:pt-16">
        <div className="mb-5 flex items-end justify-between gap-4"><div><p className="eyebrow mb-2">Picked for you</p><h2 className="section-title">Trending events</h2><p className="section-subtitle">The experiences everyone is talking about.</p></div><Link href="/events?sort=popular" className="inline-flex shrink-0 items-center gap-1 text-xs font-bold text-[#e7653c]">See more <ArrowRight size={14} /></Link></div>
        <EventGrid events={popularEvents.slice(0, 4)} />
      </section>

      <section className="container pt-12 sm:pt-16">
        <div className="mb-5 flex items-end justify-between gap-4"><div><p className="eyebrow mb-2">Made to be shared</p><h2 className="section-title">Explore our partners&apos; events</h2><p className="section-subtitle">Find something new from event makers we love.</p></div><Link href="/events" className="inline-flex shrink-0 items-center gap-1 text-xs font-bold text-[#e7653c]">View all <ArrowRight size={14} /></Link></div>
        <EventGrid events={featuredEvents.slice(0, 4)} compact />
      </section>

      <section className="container pt-12 sm:pt-16">
        <div className="mb-5 flex items-end justify-between gap-4"><div><p className="eyebrow mb-2">Save your spot</p><h2 className="section-title">Register &amp; tickets</h2><p className="section-subtitle">Plan ahead for the moments you don&apos;t want to miss.</p></div><Link href="/events" className="inline-flex shrink-0 items-center gap-1 text-xs font-bold text-[#e7653c]">See more <ArrowRight size={14} /></Link></div>
        <EventGrid events={featuredEvents.slice(4, 8)} />
      </section>

      <section className="container pt-12 sm:pt-16">
        <div className="flex flex-col justify-between gap-6 rounded-[22px] bg-[#242b36] px-6 py-8 text-white sm:flex-row sm:items-center sm:px-10">
          <div><p className="text-[10px] font-extrabold uppercase tracking-[.18em] text-[#ffad8e]">For organizers</p><h2 className="mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl">Bring your next event to life.</h2><p className="mt-2 max-w-lg text-sm leading-6 text-slate-300">Create memorable experiences and keep your event moving with Zipevent.</p></div>
          <Link href="/organizer/events/create" className="button-primary shrink-0 self-start !bg-white !text-[#353a43] hover:!bg-orange-50 sm:self-center">Create an event <ArrowRight size={16} /></Link>
        </div>
      </section>
    </main>
  );
}
