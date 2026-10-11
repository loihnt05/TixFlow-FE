"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Calendar, MapPin, Sparkles, ArrowRight } from "lucide-react";
import type { Event } from "@/lib/mock/events";
import { eventCategories } from "@/lib/mock/events";
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

const moneyFormatter = new Intl.NumberFormat("en-US");

export function HeroCarousel({ events }: { events: Event[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [mounted, setMounted] = useState(false);
  const swiperRef = useRef<SwiperCore | null>(null);

  // Take up to 7 featured events for smooth looping
  const heroEvents = events.slice(0, 7);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (heroEvents.length === 0) return null;

  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-b from-[#FDFCFD] via-[#F8F7F9] to-[#FDFCFD] py-6 sm:py-10">
      {/* Full-bleed Carousel Container (extending wider than standard containers) */}
      <div className="relative w-full overflow-hidden">
        {/* Subtle Edge Vignette Fades */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 z-25 w-16 sm:w-28 bg-gradient-to-r from-white/90 via-white/50 to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 z-25 w-16 sm:w-28 bg-gradient-to-l from-white/90 via-white/50 to-transparent" />

        {/* Previous Navigation Button — Positioned over the side slide area */}
        <button
          type="button"
          onClick={() => swiperRef.current?.slidePrev()}
          aria-label="Previous slide"
          className="absolute left-3 sm:left-[6vw] lg:left-[11vw] top-1/2 -translate-y-1/2 z-30 grid h-11 w-11 sm:h-12 sm:w-12 place-items-center rounded-full bg-white text-[#2B212B] shadow-[0_4px_16px_rgba(0,0,0,0.12)] border border-gray-100 transition-all duration-200 hover:scale-[1.04] hover:shadow-[0_6px_22px_rgba(0,0,0,0.18)] hover:text-[#ef5360] active:scale-[0.97] focus:outline-none focus:ring-2 focus:ring-[#ef5360]"
        >
          <ChevronLeft size={24} />
        </button>

        {/* Next Navigation Button — Positioned over the side slide area */}
        <button
          type="button"
          onClick={() => swiperRef.current?.slideNext()}
          aria-label="Next slide"
          className="absolute right-3 sm:right-[6vw] lg:right-[11vw] top-1/2 -translate-y-1/2 z-30 grid h-11 w-11 sm:h-12 sm:w-12 place-items-center rounded-full bg-white text-[#2B212B] shadow-[0_4px_16px_rgba(0,0,0,0.12)] border border-gray-100 transition-all duration-200 hover:scale-[1.04] hover:shadow-[0_6px_22px_rgba(0,0,0,0.18)] hover:text-[#ef5360] active:scale-[0.97] focus:outline-none focus:ring-2 focus:ring-[#ef5360]"
        >
          <ChevronRight size={24} />
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
                const categoryObj = eventCategories.find((c) => c.value === event.category);
                const categoryName = categoryObj?.label ?? "Event";
                const lowestPrice = Math.min(...event.ticketTypes.map((t) => t.price));
                const isFree = lowestPrice === 0;

                return (
                  <SwiperSlide key={`${event.id}-${idx}`}>
                    {({ isActive }) => (
                      <div className="featured-event-card group relative">
                        <Link
                          href={`/events/${event.slug}`}
                          className={`block w-full ${!isActive ? "pointer-events-none" : ""}`}
                          tabIndex={isActive ? 0 : -1}
                        >
                          {/* Event Image Banner */}
                          <div className="relative aspect-[16/9] sm:aspect-[2.1/1] w-full overflow-hidden bg-gray-100">
                            <img
                              src={event.coverImage || event.thumbnailImage}
                              alt={event.title}
                              className={`h-full w-full object-cover transition-transform duration-500 ease-out ${
                                isActive ? "group-hover:scale-[1.02]" : ""
                              }`}
                            />

                            {/* Top Badges */}
                            <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10 flex items-center gap-2">
                              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#ef5360] px-3 py-1 text-xs font-bold text-white shadow-sm">
                                <Sparkles size={13} />
                                <span>Featured</span>
                              </span>
                              <span className="rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-white backdrop-blur-md">
                                {categoryName}
                              </span>
                            </div>

                            {/* Bottom-right Price / Registration Badge */}
                            <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 z-10">
                              <span className="rounded-full bg-white/95 px-3.5 py-1 text-xs font-bold text-[#2B212B] shadow-md backdrop-blur-sm">
                                {isFree ? "Free Register" : `From ${moneyFormatter.format(lowestPrice)} VND`}
                              </span>
                            </div>

                            {/* Subtle dark gradient overlay at bottom of image for text clarity */}
                            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/40 to-transparent" />
                          </div>

                          {/* Complete Event Details & Caption Area */}
                          <div className="p-4 sm:p-5 md:p-6 bg-white">
                            <div className="flex flex-col gap-2.5 sm:gap-3">
                              {/* Event Title */}
                              <h2 className="text-base sm:text-xl md:text-[22px] font-bold tracking-tight text-[#2B212B] transition-colors duration-200 group-hover:text-[#ef5360] line-clamp-1 sm:line-clamp-2 leading-snug">
                                {event.title}
                              </h2>

                              {/* Metadata & CTA Row */}
                              <div className="flex flex-wrap items-center justify-between gap-y-2 text-xs sm:text-sm text-[#8E8E8E]">
                                <div className="flex flex-wrap items-center gap-x-4 sm:gap-x-6 gap-y-1">
                                  {/* Date & Time */}
                                  <div className="flex items-center gap-1.5 text-gray-700">
                                    <Calendar size={15} className="text-[#ef5360] shrink-0" />
                                    <span className="font-medium">
                                      {dateFormatter.format(new Date(event.startDate))} · {event.startTime}
                                    </span>
                                  </div>

                                  {/* Venue / Location */}
                                  <div className="flex items-center gap-1.5 text-gray-600">
                                    <MapPin size={15} className="text-[#ef5360] shrink-0" />
                                    <span className="truncate max-w-[200px] sm:max-w-[300px]">
                                      {event.venue.isOnline ? "Online Event" : event.venue.name}
                                    </span>
                                  </div>
                                </div>

                                {/* Prominent CTA Button */}
                                <div className="mt-1 sm:mt-0 flex items-center">
                                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#ef5360] px-5 py-2 sm:px-6 sm:py-2.5 text-xs sm:text-sm font-bold text-white shadow-xs transition-all duration-200 hover:bg-[#ec3746] hover:shadow-md hover:scale-105 active:scale-95">
                                    <span>ซื้อบัตร</span>
                                    <ArrowRight size={14} />
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Link>

                        {/* Inactive White Washout Veil (fade to 0 on active card) */}
                        <div className="card-washout-veil" />
                      </div>
                    )}
                  </SwiperSlide>
                );
              })}
            </Swiper>
          ) : (
            /* Server-side Pre-hydration Fallback (Exact dimensions match to prevent layout shift) */
            <div className="flex items-center justify-center py-2">
              <div className="w-[min(54vw,860px)] rounded-2xl bg-white shadow-[0_14px_38px_-4px_rgba(0,0,0,0.16)] overflow-hidden">
                <div className="aspect-[16/9] sm:aspect-[2.1/1] w-full bg-gray-100">
                  <img
                    src={heroEvents[0]?.coverImage || heroEvents[0]?.thumbnailImage}
                    alt={heroEvents[0]?.title}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="p-5 bg-white">
                  <h2 className="text-xl font-bold text-[#2B212B] truncate">{heroEvents[0]?.title}</h2>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Compact Pagination Indicator */}
        <div className="mt-7 flex justify-center items-center gap-2">
          {heroEvents.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => swiperRef.current?.slideToLoop(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`transition-all duration-300 ease-out focus:outline-none ${
                idx === activeIndex
                  ? "h-2 w-7 sm:w-8 rounded-full bg-[#ef5360]"
                  : "h-2 w-2 rounded-full bg-gray-300 hover:bg-gray-400"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
