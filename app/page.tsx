import Link from "next/link";
import { ArrowRight, Sparkles, PlusCircle, CheckCircle, ShieldCheck, BarChart3 } from "lucide-react";
import { FloatingSearch } from "@/components/home/floating-search";
import { HeroCarousel } from "@/components/home/hero-carousel";
import { TrendingCarousel } from "@/components/home/trending-carousel";
import { PartnerSection } from "@/components/home/partner-section";
import { CategoriesSection } from "@/components/home/categories-section";
import { BlogSection } from "@/components/home/blog-section";
import { EventGrid } from "@/components/events/event-grid";
import { getFeaturedEvents, getPopularEvents, getEvents } from "@/lib/mock-api/events";

export default async function HomePage() {
  const [featuredEvents, popularEvents, allEventsResponse] = await Promise.all([
    getFeaturedEvents(),
    getPopularEvents(),
    getEvents({ limit: 10 }),
  ]);

  const ticketEvents = allEventsResponse.events;

  return (
    <main className="min-h-screen bg-[#FDFCFD] pb-16">
      {/* 1. Floating Global Search Bar (Zipevent Signature Sticky/Hero Search) */}
      <FloatingSearch />

      {/* 2. Hero Featured Carousel (Zipevent Signature 3D Multi-Slide Carousel) */}
      <HeroCarousel events={featuredEvents} />

      {/* 3. Trending Carousel with .bg-trending signature gradient and rank numbers */}
      <TrendingCarousel events={popularEvents} />

      {/* 4. Partner Organizers Section */}
      <PartnerSection />

      {/* 5. Register & Tickets (All / Ticketed Events) */}
      <section className="container py-10 sm:py-14">
        <div className="mb-6 flex items-end justify-between sm:mb-8">
          <div>
            <div className="mb-1.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#ef5360]">
              <Sparkles size={14} />
              <span>Recommended for You</span>
            </div>
            <h2 className="text-xl font-bold tracking-tight text-[#2B212B] sm:text-2xl md:text-[26px]">
              Registration &amp; Tickets
            </h2>
            <p className="mt-1 text-xs text-[#8E8E8E] sm:text-sm">
              Book advance tickets for top-rated events you don&apos;t want to miss
            </p>
          </div>
          <Link
            href="/events"
            className="group flex items-center gap-1.5 text-xs font-semibold text-[#ef5360] transition-colors hover:text-[#ec3746] sm:text-sm"
          >
            <span>View All</span>
            <ArrowRight
              size={16}
              className="transition-transform duration-200 group-hover:translate-x-1"
            />
          </Link>
        </div>

        {/* 5-Column Responsive Event Grid */}
        <EventGrid events={ticketEvents} />

        {/* View More Center Button */}
        <div className="mt-10 flex justify-center sm:mt-12">
          <Link
            href="/events"
            className="inline-flex items-center gap-2 rounded-full border-2 border-[#ef5360] bg-white px-8 py-2.5 text-xs font-bold text-[#ef5360] shadow-xs transition-all duration-200 hover:bg-[#ef5360] hover:text-white hover:shadow-md active:scale-95 sm:text-sm"
          >
            <span>Explore All Events</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* 6. High Impact Organizer CTA Banner (Zipevent Style) */}
      <section className="container py-8 sm:py-12">
        <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-[#241f28] via-[#322332] to-[#201c24] px-6 py-10 text-white shadow-lg sm:px-12 sm:py-14">
          {/* Subtle Decorative Background Circles */}
          <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[#ef5360]/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 right-1/3 h-64 w-64 rounded-full bg-orange-500/15 blur-3xl" />

          <div className="relative z-10 flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
            <div className="max-w-2xl">
              <span className="inline-block rounded-full bg-[#ef5360]/20 px-3.5 py-1 text-[11px] font-bold uppercase tracking-wider text-[#ff808c]">
                For Event Organizers
              </span>
              <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
                Create Your Event with <span className="text-[#ef5360]">TixFlow</span>
              </h2>
              <p className="mt-2 text-xs leading-relaxed text-gray-300 sm:text-sm">
                End-to-end event management and ticketing platform. Fast, secure, with real-time analytics and seamless attendee check-in.
              </p>

              {/* Feature Badges */}
              <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-gray-300 sm:text-sm">
                <div className="flex items-center gap-1.5">
                  <CheckCircle size={16} className="text-[#ef5360]" />
                  <span>Launch ticket sales in 5 minutes</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck size={16} className="text-[#ef5360]" />
                  <span>100% Secure Payments</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <BarChart3 size={16} className="text-[#ef5360]" />
                  <span>Real-time Analytics Dashboard</span>
                </div>
              </div>
            </div>

            <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
              <Link
                href="/organizer/events/create"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#ef5360] px-7 py-3 text-xs font-bold text-white shadow-md transition-all duration-200 hover:bg-[#ec3746] hover:shadow-lg active:scale-95 sm:text-sm"
              >
                <PlusCircle size={18} />
                <span>Create Event Now</span>
              </Link>
              <Link
                href="/articles"
                className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/10 px-6 py-3 text-xs font-semibold text-white backdrop-blur-xs transition-colors hover:bg-white/20 sm:text-sm"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Articles & Blog Section */}
      <BlogSection />

      {/* 8. Event Categories Section */}
      <CategoriesSection />
    </main>
  );
}
