"use client";

import { useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, TrendingUp } from "lucide-react";
import type { Event } from "@/lib/mock/events";

export function TrendingCarousel({ events }: { events: Event[] }) {
  const sliderRef = useRef<HTMLDivElement>(null);
  const trendingEvents = events.slice(0, 8);

  const scrollLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: -260, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: 260, behavior: "smooth" });
    }
  };

  return (
    <section className="bg-trending my-8">
      <div className="container relative">
        {/* Title */}
        <div className="flex items-center justify-between mb-4 md:mb-6">
          <div className="flex items-center gap-2.5">
            <TrendingUp size={24} className="text-white" />
            <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Trending Events
            </h2>
          </div>
          <Link
            href="/events?sort=popular"
            className="text-xs font-bold text-white/90 hover:text-white underline underline-offset-4"
          >
            View all
          </Link>
        </div>

        {/* Carousel Container */}
        <div className="relative group/carousel">
          {/* Left Arrow */}
          <button
            type="button"
            onClick={scrollLeft}
            aria-label="Scroll left"
            className="absolute -left-3 top-1/2 -translate-y-1/2 z-10 grid h-10 w-10 place-items-center rounded-full bg-white/95 text-gray-800 shadow-lg hover:bg-white hover:text-[#ef5360] transition-all hover:scale-110 active:scale-95 disabled:opacity-30"
          >
            <ChevronLeft size={22} />
          </button>

          {/* Right Arrow */}
          <button
            type="button"
            onClick={scrollRight}
            aria-label="Scroll right"
            className="absolute -right-3 top-1/2 -translate-y-1/2 z-10 grid h-10 w-10 place-items-center rounded-full bg-white/95 text-gray-800 shadow-lg hover:bg-white hover:text-[#ef5360] transition-all hover:scale-110 active:scale-95 disabled:opacity-30"
          >
            <ChevronRight size={22} />
          </button>

          {/* Slider */}
          <div
            ref={sliderRef}
            className="trending-slider flex gap-5 overflow-x-auto pb-4 pt-1 px-1 scroll-smooth"
          >
            {trendingEvents.map((event, index) => (
              <div key={event.id} className="trending-card-item group">
                <Link href={`/events/${event.slug}`} className="block relative aspect-[3/4] w-full">
                  {/* Event Poster Image */}
                  <img
                    src={event.thumbnailImage}
                    alt={event.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />

                  {/* Dark gradient overlay for title legibility & rank number */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none" />

                  {/* Rank Number (Zipevent Signature: 1, 2, 3...) */}
                  <div className="number-card">
                    {index + 1}
                  </div>

                  {/* Event title & venue overlay */}
                  <div className="absolute bottom-3 left-12 right-2.5 z-10 text-white">
                    <h3 className="text-xs font-bold leading-snug line-clamp-2 drop-shadow-sm group-hover:text-[#ffb9b9] transition-colors">
                      {event.title}
                    </h3>
                    <p className="text-[10px] text-gray-300 truncate mt-0.5">
                      {event.venue.city || event.venue.name}
                    </p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
