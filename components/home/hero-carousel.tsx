"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Calendar, MapPin, Ticket } from "lucide-react";
import type { Event } from "@/lib/mock/events";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperCore } from "swiper";
import { Autoplay, Keyboard, A11y } from "swiper/modules";
import "swiper/css";

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "Asia/Ho_Chi_Minh",
});

const defaultHeroFallback =
  "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1400&q=82";

export function HeroCarousel({ events }: { events: Event[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [mounted, setMounted] = useState(false);
  const swiperRef = useRef<SwiperCore | null>(null);

  const heroEvents = events.slice(0, 7);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (heroEvents.length === 0) return null;

  return (
    <section className="relative w-full overflow-hidden py-5 sm:py-8">
      <div className="relative w-full overflow-hidden">
        {/* Soft ambient side fades */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 z-20 w-12 sm:w-24 bg-gradient-to-r from-[#fcfbfd]/90 via-[#fcfbfd]/40 to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 z-20 w-12 sm:w-24 bg-gradient-to-l from-[#fcfbfd]/90 via-[#fcfbfd]/40 to-transparent" />

        {/* Previous Navigation Button */}
        <button
          type="button"
          onClick={() => swiperRef.current?.slidePrev()}
          aria-label="Previous slide"
          className="absolute left-3 sm:left-[6vw] lg:left-[12vw] top-1/2 -translate-y-1/2 z-30 grid h-10 w-10 sm:h-11 sm:w-11 place-items-center rounded-full bg-white/95 text-[#2B212B] shadow-[0_4px_16px_rgba(0,0,0,0.12)] border border-gray-100 transition-all duration-200 hover:scale-105 hover:text-[#ef5360] active:scale-95"
        >
          <ChevronLeft size={22} />
        </button>

        {/* Next Navigation Button */}
        <button
          type="button"
          onClick={() => swiperRef.current?.slideNext()}
          aria-label="Next slide"
          className="absolute right-3 sm:right-[6vw] lg:right-[12vw] top-1/2 -translate-y-1/2 z-30 grid h-10 w-10 sm:h-11 sm:w-11 place-items-center rounded-full bg-white/95 text-[#2B212B] shadow-[0_4px_16px_rgba(0,0,0,0.12)] border border-gray-100 transition-all duration-200 hover:scale-105 hover:text-[#ef5360] active:scale-95"
        >
          <ChevronRight size={22} />
        </button>

        {/* Center-Mode Carousel Viewport */}
        <div className="featured-hero-carousel relative w-full">
          {mounted ? (
            <Swiper
              modules={[Autoplay, Keyboard, A11y]}
              centeredSlides={true}
              slidesPerView="auto"
              spaceBetween={0}
              loop={heroEvents.length >= 3}
              speed={420}
              slideToClickedSlide={true}
              grabCursor={true}
              keyboard={{ enabled: true }}
              autoplay={{
                delay: 5000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }}
              onSwiper={(swiper) => {
                swiperRef.current = swiper;
              }}
              onSlideChange={(swiper) => {
                setActiveIndex(swiper.realIndex);
              }}
              className="w-full !overflow-visible"
            >
              {heroEvents.map((event, idx) => {
                const dateLabel =
                  event.dateRangeLabel ??
                  `${dateFormatter.format(new Date(event.startDate))} · ${event.startTime}`;

                return (
                  <SwiperSlide key={`${event.id}-${idx}`}>
                    {({ isActive }) => (
                      <div className="featured-event-card group relative">
                        <Link
                          href={`/e/${event.slug}`}
                          className={`block w-full ${!isActive ? "pointer-events-none" : ""}`}
                          tabIndex={isActive ? 0 : -1}
                        >
                          {/* Wide Zipevent Hero Banner */}
                          <div className="relative aspect-[16/9] sm:aspect-[2.5/1] w-full overflow-hidden bg-gray-100">
                            <img
                              src={event.coverImage || event.thumbnailImage}
                              alt={event.title}
                              referrerPolicy="no-referrer"
                              onError={(e) => {
                                const target = e.currentTarget;
                                const fallback = event.fallbackImage || defaultHeroFallback;
                                if (target.src !== fallback) target.src = fallback;
                              }}
                              className={`h-full w-full object-cover transition-transform duration-500 ease-out ${
                                isActive ? "group-hover:scale-[1.02]" : ""
                              }`}
                            />

                            {/* Clean Zipevent "Ticket" pill at bottom-right */}
                            <div className="absolute bottom-3 right-3 sm:bottom-3.5 sm:right-3.5 z-10">
                              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#ef5360] px-3.5 py-1 text-xs font-medium text-white shadow-sm">
                                <Ticket size={13} />
                                <span>Ticket</span>
                              </span>
                            </div>
                          </div>

                          {/* Clean Zipevent Hero Caption */}
                          <div className="p-4 sm:px-6 sm:py-4.5 bg-white">
                            <h2 className="text-base sm:text-lg md:text-[19px] font-semibold tracking-tight text-[#2B212B] transition-colors duration-200 group-hover:text-[#ef5360] truncate">
                              {event.title}
                            </h2>

                            <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1 text-xs sm:text-[13px] font-normal text-gray-500">
                              <div className="flex items-center gap-1.5">
                                <Calendar size={14} className="text-[#ef5360] shrink-0" />
                                <span>{dateLabel}</span>
                              </div>

                              <div className="flex items-center gap-1.5">
                                <MapPin size={14} className="text-[#ef5360] shrink-0" />
                                <span className="truncate max-w-[220px] sm:max-w-[340px]">
                                  {event.venue.isOnline ? "Online Event" : event.venue.name}
                                </span>
                              </div>
                            </div>
                          </div>
                        </Link>

                        <div className="card-washout-veil" />
                      </div>
                    )}
                  </SwiperSlide>
                );
              })}
            </Swiper>
          ) : (
            <div className="flex items-center justify-center py-2">
              <div className="w-[min(54vw,860px)] rounded-2xl bg-white shadow-[0_14px_38px_-4px_rgba(0,0,0,0.14)] overflow-hidden">
                <div className="aspect-[16/9] sm:aspect-[2.5/1] w-full bg-gray-100">
                  <img
                    src={heroEvents[0]?.coverImage || heroEvents[0]?.thumbnailImage}
                    alt={heroEvents[0]?.title}
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="p-5 bg-white">
                  <h2 className="text-lg font-semibold text-[#2B212B] truncate">
                    {heroEvents[0]?.title}
                  </h2>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Pagination Dots */}
        <div className="mt-5 flex justify-center items-center gap-2">
          {heroEvents.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => swiperRef.current?.slideToLoop(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`transition-all duration-300 ease-out focus:outline-none ${
                idx === activeIndex
                  ? "h-2 w-7 rounded-full bg-[#ef5360]"
                  : "h-2 w-2 rounded-full bg-gray-300 hover:bg-gray-400"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
