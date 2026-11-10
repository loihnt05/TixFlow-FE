import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  PlusCircle,
  ShieldCheck,
  BarChart3,
  Zap,
  QrCode,
  Ticket,
  CheckCircle2,
} from "lucide-react";
import { FloatingSearch } from "@/components/home/floating-search";
import { HeroCarousel } from "@/components/home/hero-carousel";
import { TrendingCarousel } from "@/components/home/trending-carousel";
import { PartnerSection } from "@/components/home/partner-section";
import { CategoriesSection } from "@/components/home/categories-section";
import { BlogSection } from "@/components/home/blog-section";
import { EventGrid } from "@/components/events/event-grid";
import { OrganizerOnly } from "@/components/organizer-only";
import { getFeaturedEvents, getPopularEvents, getEvents } from "@/lib/mock-api/events";

export default async function HomePage() {
  const [featuredEvents, popularEvents, allEventsResponse] = await Promise.all([
    getFeaturedEvents(),
    getPopularEvents(),
    getEvents({ limit: 15 }),
  ]);

  const ticketEvents = allEventsResponse.events;

  return (
    <main className="ambient-page min-h-screen pb-16">
      {/* 1. Floating Global Search Bar */}
      <FloatingSearch events={ticketEvents} />

      {/* 2. Hero Featured Carousel */}
      <HeroCarousel events={featuredEvents} />

      {/* 3. Trending Events with Zipevent Coral-Amber Gradient & Rank Numbers */}
      <TrendingCarousel events={popularEvents} />

      {/* 4. Partner Organizers Section */}
      <PartnerSection events={ticketEvents} />

      {/* 5. Register & Tickets — Zipevent 5-Column Portrait Card Grid */}
      <section className="container py-10 sm:py-14">
        <div className="mb-7 flex flex-col items-center text-center sm:mb-9">
          <div className="mb-1.5 inline-flex items-center gap-1.5 rounded-full bg-[#FFEFF0] px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-[#ef5360]">
            <Sparkles size={13} />
            <span>Curated Lineup</span>
          </div>
          <h2 className="text-xl font-semibold tracking-tight text-[#333333] sm:text-2xl md:text-[26px]">
            Register &amp; Tickets
          </h2>
          <p className="mt-1 max-w-xl text-xs font-normal text-[#8E8E8E] sm:text-sm">
            Films, concerts, digital art museums, and live conferences open for booking now
          </p>
        </div>

        {/* 5-Column Portrait 4:5 Event Grid */}
        <EventGrid events={ticketEvents} />

        {/* View More Center Button */}
        <div className="mt-10 flex justify-center sm:mt-12">
          <Link
            href="/events"
            className="inline-flex items-center gap-2 rounded-full border border-[#ef5360] bg-white px-8 py-2.5 text-xs font-medium text-[#ef5360] shadow-sm transition-all duration-200 hover:bg-[#ef5360] hover:text-white hover:shadow-md active:scale-95 sm:text-sm"
          >
            <span>See All Events</span>
            <ArrowRight size={15} />
          </Link>
        </div>
      </section>

      {/* 6. Redesigned For Event Organizers Showcase Section */}
      <section className="container py-8 sm:py-12">
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#1C1624] via-[#2A1B2E] to-[#171320] px-6 py-10 text-white shadow-[0_24px_60px_-15px_rgba(28,22,36,0.45)] sm:px-10 sm:py-12 lg:px-14 lg:py-14">
          {/* Ambient Luminous Glows & Subtle Architectural Grid */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.5) 1px, transparent 1px)",
              backgroundSize: "36px 36px",
            }}
          />
          <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-[#ef5360]/25 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 left-1/4 h-72 w-72 rounded-full bg-[#f8a846]/15 blur-3xl" />

          <div className="relative z-10 grid items-center gap-10 lg:grid-cols-12 lg:gap-12">
            {/* Left Copy & Feature Chips */}
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#ff808c]/30 bg-[#ef5360]/15 px-3.5 py-1 text-[11px] font-medium uppercase tracking-widest text-[#ff9aa4]">
                <Sparkles size={13} className="text-[#ff808c]" />
                <span>For Event Organizers</span>
              </div>

              <h2 className="mt-4 text-2xl font-semibold leading-tight tracking-tight text-white sm:text-3xl lg:text-[36px]">
                Create Your Event with{" "}
                <span className="bg-gradient-to-r from-[#ff6b78] via-[#ff858f] to-[#ffb27d] bg-clip-text text-transparent">
                  TixFlow
                </span>
              </h2>

              <p className="mt-3 max-w-xl text-xs font-normal leading-relaxed text-white/75 sm:text-[14.5px]">
                End-to-end event management and ticketing platform. Fast, secure, with real-time
                analytics and seamless attendee check-in.
              </p>

              {/* Structured Glass Feature Chips */}
              <div className="mt-6 grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                <div className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.06] px-3.5 py-2.5 backdrop-blur-sm">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[#ef5360]/20 text-[#ff858f]">
                    <Zap size={15} />
                  </span>
                  <span className="text-xs font-normal leading-snug text-white/90">
                    Launch ticket sales in 5 minutes
                  </span>
                </div>

                <div className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.06] px-3.5 py-2.5 backdrop-blur-sm">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-emerald-500/20 text-emerald-300">
                    <ShieldCheck size={15} />
                  </span>
                  <span className="text-xs font-normal leading-snug text-white/90">
                    100% Secure Payments
                  </span>
                </div>

                <div className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.06] px-3.5 py-2.5 backdrop-blur-sm">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-amber-500/20 text-amber-300">
                    <BarChart3 size={15} />
                  </span>
                  <span className="text-xs font-normal leading-snug text-white/90">
                    Real-time Analytics &amp; Check-in
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-7 flex flex-wrap items-center gap-3">
                <OrganizerOnly>
                  <Link
                    href="/organizer/events/create"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-[#ef5360] px-6 py-3 text-xs font-medium text-white shadow-[0_8px_24px_rgba(239,83,96,0.38)] transition-all duration-200 hover:bg-[#ec3746] hover:-translate-y-0.5 sm:text-sm"
                  >
                    <PlusCircle size={17} />
                    <span>Create Event Now</span>
                  </Link>
                </OrganizerOnly>

                <Link
                  href="/blog?tab=organizer"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-6 py-3 text-xs font-medium text-white backdrop-blur-sm transition-all hover:bg-white/20 sm:text-sm"
                >
                  <span>Explore Organizer Guides</span>
                  <ArrowRight size={15} />
                </Link>
              </div>
            </div>

            {/* Right Visual Studio Preview Card */}
            <div className="lg:col-span-5">
              <div className="rounded-2xl border border-white/15 bg-white/[0.07] p-5 shadow-2xl backdrop-blur-md">
                <div className="flex items-center justify-between border-b border-white/10 pb-3.5">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                    <span className="text-xs font-medium text-white/90">
                      TixFlow Live Studio
                    </span>
                  </div>
                  <span className="rounded-full bg-[#ef5360]/25 px-2.5 py-0.5 text-[10.5px] font-medium text-[#ff9aa4]">
                    On Sale
                  </span>
                </div>

                {/* Live Capacity Progress */}
                <div className="mt-4 rounded-xl bg-black/25 p-4 border border-white/5">
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs font-normal text-white/65">Tickets Sold</span>
                    <span className="text-xs font-medium text-emerald-300">+18% today</span>
                  </div>
                  <div className="mt-1 flex items-baseline gap-2">
                    <span className="text-2xl font-semibold tracking-tight text-white">2,840</span>
                    <span className="text-xs font-normal text-white/50">/ 3,000 capacity</span>
                  </div>
                  <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-white/10">
                    <div className="h-full w-[94%] rounded-full bg-gradient-to-r from-[#ef5360] to-[#ffa07a]" />
                  </div>
                </div>

                {/* Mini Operational Cards */}
                <div className="mt-3 grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-white/10 bg-white/[0.05] p-3">
                    <div className="flex items-center gap-1.5 text-xs font-medium text-white/90">
                      <QrCode size={14} className="text-[#ff858f]" />
                      <span>Smart Gate</span>
                    </div>
                    <p className="mt-1 text-[11px] font-normal text-white/60">
                      0.4s QR &amp; RFID check-in sync
                    </p>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-white/[0.05] p-3">
                    <div className="flex items-center gap-1.5 text-xs font-medium text-white/90">
                      <Ticket size={14} className="text-[#ffb27d]" />
                      <span>Multi-Tier</span>
                    </div>
                    <p className="mt-1 text-[11px] font-normal text-white/60">
                      GA, VIP &amp; seat-map holds
                    </p>
                  </div>
                </div>

                <div className="mt-3.5 flex items-center justify-between pt-1 text-[11px] font-normal text-white/60">
                  <span className="inline-flex items-center gap-1 text-emerald-300">
                    <CheckCircle2 size={13} />
                    Verified Payout Protection
                  </span>
                  <span>Zero setup fee</span>
                </div>
              </div>
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
