"use client";

import { useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, TrendingUp } from "lucide-react";
import type { Event } from "@/lib/mock/events";

const defaultPosterFallback =
  "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=900&q=82";

export function TrendingCarousel({ events }: { events: Event[] }) {
  const sliderRef = useRef<HTMLDivElement>(null);
  const trendingEvents = events.slice(0, 8);

  const scrollLeft = () => {
    sliderRef.current?.scrollBy({ left: -260, behavior: "smooth" });
  };

  const scrollRight = () => {
    sliderRef.current?.scrollBy({ left: 260, behavior: "smooth" });
  };

  return (
    <section className="bg-trending my-6">
      <div className="container relative">
        {/* Title */}
        <div className="flex items-center justify-between mb-4 md:mb-6">
          <div className="flex items-center gap-2.5">
            <TrendingUp size={22} className="text-white" />
            <h2 className="text-xl md:text-2xl font-semibold text-white tracking-tight">
              Trending Events
            </h2>
          </div>
          <Link
            href="/events"
            className="text-xs font-medium text-white/95 hover:text-white underline underline-offset-4"
          >
            View all
          </Link>
        </div>

        {/* Carousel Container */}
        <div className="relative group/carousel">
          <button
            type="button"
            onClick={scrollLeft}
            aria-label="Scroll left"
            className="absolute -left-2 sm:-left-3 top-1/2 -translate-y-1/2 z-10 grid h-10 w-10 place-items-center rounded-full bg-white/95 text-gray-800 shadow-lg hover:bg-white hover:text-[#ef5360] transition-all hover:scale-105 active:scale-95"
          >
            <ChevronLeft size={20} />
          </button>

          <button
            type="button"
            onClick={scrollRight}
            aria-label="Scroll right"
            className="absolute -right-2 sm:-right-3 top-1/2 -translate-y-1/2 z-10 grid h-10 w-10 place-items-center rounded-full bg-white/95 text-gray-800 shadow-lg hover:bg-white hover:text-[#ef5360] transition-all hover:scale-105 active:scale-95"
          >
            <ChevronRight size={20} />
          </button>

          <div
            ref={sliderRef}
            className="trending-slider flex gap-5 overflow-x-auto pb-4 pt-1 px-1 scroll-smooth"
          >
            {trendingEvents.map((event, index) => (
              <div key={event.id} className="trending-card-item group">
                <Link href={`/e/${event.slug}`} className="block relative aspect-[4/5] w-full">
                  <img
                    src={event.thumbnailImage}
                    alt={event.title}
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      const target = e.currentTarget;
                      const fallback = event.fallbackImage || event.coverImage || defaultPosterFallback;
                      if (target.src !== fallback) target.src = fallback;
                    }}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none" />

                  <div className="absolute inset-x-3 bottom-3 z-10 flex items-end gap-2.5 text-white">
                    <span className="shrink-0 font-extrabold italic text-[46px] leading-[0.82] tracking-tighter text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.65)] select-none">
                      {index + 1}
                    </span>
                    <div className="min-w-0 flex-1 pb-0.5">
                      <h3 className="text-xs font-medium leading-snug line-clamp-2 drop-shadow-sm group-hover:text-[#ffd6da] transition-colors">
                        {event.title}
                      </h3>
                      <p className="text-[10.5px] font-normal text-white/75 truncate mt-0.5">
                        {event.venue.isOnline ? "Online Event" : event.venue.name}
                      </p>
                    </div>
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
