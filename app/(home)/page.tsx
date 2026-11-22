import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { FloatingSearch } from "@/components/home/floating-search";
import { HeroCarousel } from "@/components/home/hero-carousel";
import { TrendingCarousel } from "@/components/home/trending-carousel";
import { PartnerSection } from "@/components/home/partner-section";
import { CategoriesSection } from "@/components/home/categories-section";
import { BlogSection } from "@/components/home/blog-section";
import {
  ResaleMarketplaceSection,
  ForOrganizerBannerSection,
} from "@/components/home/zipevent-banners";
import { EventGrid } from "@/components/events/event-grid";
import { getHomeEvents } from "@/lib/mock-api/events";

export default async function HomePage() {
  const ticketEvents = await getHomeEvents(15);
  const featuredEvents = ticketEvents.slice(0, 7);
  const popularEvents = ticketEvents.slice(7, 15);

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
            Explore Events
          </h2>
          <p className="mt-1 max-w-xl text-xs font-normal text-[#8E8E8E] sm:text-sm">
            Discover concerts, festivals, exhibitions, and events happening soon
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

      {/* 6. Official Ticket Resale Marketplace — Zipevent Pastel Banner Section */}
      <ResaleMarketplaceSection />

      {/* 7. Articles & Blog Section */}
      <BlogSection />

      {/* 8. Event Categories Section */}
      <CategoriesSection />

      {/* 9. For Organizer All-in-One Pastel 4-Pillar Banner Section */}
      <ForOrganizerBannerSection />
    </main>
  );
}
