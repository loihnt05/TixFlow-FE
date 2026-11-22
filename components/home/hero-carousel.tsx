"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Calendar, MapPin } from "lucide-react";
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
  "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1600&q=82";

const CURATED_WIDE_HERO_BACKGROUNDS = [
  "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1600&q=82",
  "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=1600&q=82",
  "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1600&q=82",
  "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=1600&q=82",
  "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1600&q=82",
  "https://images.unsplash.com/photo-1518998053901-5348d3961a04?auto=format&fit=crop&w=1600&q=82",
  "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1600&q=82",
];

function resolveHeroBannerImage(event: Event, index: number): { src: string; isGeneratedKeyArt: boolean } {
  const raw = event.coverImage || event.thumbnailImage || "";
  if (raw && !raw.startsWith("data:image/svg+xml")) {
    return { src: raw, isGeneratedKeyArt: false };
  }
  return {
    src: CURATED_WIDE_HERO_BACKGROUNDS[index % CURATED_WIDE_HERO_BACKGROUNDS.length],
    isGeneratedKeyArt: true,
  };
}

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
    <section className="featured-event relative w-full overflow-hidden pt-2 pb-4 sm:pt-3 sm:pb-6">
      <div className="container-recommend-event relative mx-auto w-full max-w-[1900px] overflow-hidden">
        {/* Zipevent 150px white side fade gradients over peeking neighbor cards */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-0 top-0 bottom-0 z-20 w-10 sm:w-24 lg:w-[150px]"
          style={{
            background: "linear-gradient(to right, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 100%)",
          }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-0 top-0 bottom-0 z-20 w-10 sm:w-24 lg:w-[150px]"
          style={{
            background: "linear-gradient(to left, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 100%)",
          }}
        />

        {/* Center-Mode Carousel Viewport — 850px active card, 0.85 scale & 0.5 opacity peeking neighbors */}
        <div className="featured-hero-carousel relative w-full">
          {mounted ? (
            <Swiper
              modules={[Autoplay, Keyboard, A11y]}
              centeredSlides={true}
              slidesPerView="auto"
              spaceBetween={0}
              loop={heroEvents.length >= 3}
              speed={380}
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
                  `${dateFormatter.format(new Date(event.startDate))}${
                    event.ctaLabel === "View Event" ? "" : ` · ${event.startTime}`
                  }`;
                const { src: bannerSrc } = resolveHeroBannerImage(event, idx);
                const categoryTag = (event.zipeventCategory || event.category || "LIVE EVENT").toUpperCase();
                const venueName = event.venue.isOnline ? "Online Event" : event.venue.name;

                return (
                  <SwiperSlide
                    key={`${event.id}-${idx}`}
                    style={{ width: "min(88vw, 850px)" }}
                    className="!w-[min(88vw,850px)] shrink-0"
                  >
                    {({ isActive }) => (
                      <div
                        className={`recommend-slide-card group relative w-full transition-all duration-300 ease-out ${
                          isActive
                            ? "z-10 scale-100 opacity-100"
                            : "z-0 scale-[0.85] opacity-50 cursor-pointer"
                        }`}
                      >
                        <div className="rounded-[8px] border border-[#dddddd] bg-white p-[4px] shadow-[0_3px_6px_#00000029]">
                          <Link
                            href={`/e/${event.slug}`}
                            className={`block w-full ${!isActive ? "pointer-events-none" : ""}`}
                            tabIndex={isActive ? 0 : -1}
                          >
                            {/* Wide Zipevent Hero Banner (850 x 315 -> ~2.7:1 aspect ratio) */}
                            <div className="relative aspect-[16/9] sm:aspect-[850/315] w-full overflow-hidden rounded-t-[8px] bg-gray-100">
                              <img
                                src={bannerSrc}
                                alt={event.title}
                                referrerPolicy="no-referrer"
                                onError={(e) => {
                                  const target = e.currentTarget;
                                  const fallback = event.fallbackImage || defaultHeroFallback;
                                  if (target.src !== fallback) target.src = fallback;
                                }}
                                className="h-full w-full object-cover"
                              />

                              {/* Subtle editorial banner overlay with event key-art headline */}
                              <div
                                aria-hidden="true"
                                className="pointer-events-none absolute inset-0"
                                style={{
                                  background:
                                    "linear-gradient(90deg, rgba(12,14,24,0.82) 0%, rgba(12,14,24,0.45) 54%, rgba(12,14,24,0.18) 100%)",
                                }}
                              />

                              <div
                                aria-hidden="true"
                                className="pointer-events-none absolute inset-y-0 left-0 flex max-w-[78%] flex-col justify-center px-5 sm:px-9 text-left"
                              >
                                <span className="mb-2 inline-flex w-fit items-center gap-1.5 rounded-full border border-white/25 bg-white/15 px-3 py-0.5 text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-white backdrop-blur-xs">
                                  {categoryTag}
                                </span>
                                <span className="line-clamp-2 text-lg sm:text-2xl md:text-[28px] font-extrabold leading-[1.15] tracking-tight text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.65)]">
                                  {event.title}
                                </span>
                                <span className="mt-2.5 truncate text-xs sm:text-[13px] font-medium text-white/85 drop-shadow-xs">
                                  {dateLabel} · {venueName}
                                </span>
                              </div>

                              {/* Zipevent authentic white "Ticket" pill at bottom-right of banner image */}
                              <div className="absolute bottom-3 right-3.5 z-10">
                                <span className="inline-flex items-center justify-center rounded-[5px] bg-white px-4 py-1 text-[11.5px] font-medium text-[#333333] shadow-[0_2px_6px_rgba(0,0,0,0.2)]">
                                  Ticket
                                </span>
                              </div>
                            </div>

                            {/* Zipevent 3-Row Stacked Caption (.caption) */}
                            <div className="rounded-b-[8px] bg-white px-[15px] pt-[10px] pb-[11px] text-left">
                              <div className="mb-1 truncate text-[15px] sm:text-[16px] font-bold text-[#2B212B] transition-colors duration-200 group-hover:text-[#ef5360]">
                                <strong>{event.title}</strong>
                              </div>

                              <div className="space-y-1 text-[13px] font-normal leading-[1.35] text-[#4A4A4A]">
                                <div className="flex items-center gap-2 truncate">
                                  <Calendar size={16} className="shrink-0 text-[#ef5360]" />
                                  <span className="truncate">{dateLabel}</span>
                                </div>

                                <div className="flex items-center gap-2 truncate">
                                  <MapPin size={16} className="shrink-0 text-[#ef5360]" />
                                  <span className="truncate">{venueName}</span>
                                </div>
                              </div>
                            </div>
                          </Link>
                        </div>
                      </div>
                    )}
                  </SwiperSlide>
                );
              })}
            </Swiper>
          ) : (
            <div className="flex items-center justify-center py-2">
              <div className="w-[min(88vw,850px)] rounded-[8px] border border-[#dddddd] bg-white p-[4px] shadow-[0_3px_6px_#00000029]">
                <div className="aspect-[16/9] sm:aspect-[850/315] w-full overflow-hidden rounded-t-[8px] bg-gray-100">
                  <img
                    src={resolveHeroBannerImage(heroEvents[0], 0).src}
                    alt={heroEvents[0]?.title}
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="rounded-b-[8px] bg-white px-[15px] py-[10px]">
                  <div className="truncate text-[16px] font-bold text-[#2B212B]">
                    {heroEvents[0]?.title}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Zipevent Circular Hollow/Filled Pagination Dots (.slick-dots) */}
        <ul className="mt-3.5 flex justify-center items-center gap-2.5 list-none p-0 m-0" role="tablist">
          {heroEvents.map((_, idx) => {
            const active = idx === activeIndex;
            return (
              <li key={idx} className="inline-flex items-center justify-center">
                <button
                  type="button"
                  onClick={() => swiperRef.current?.slideToLoop(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                  aria-selected={active}
                  role="tab"
                  className="group/dot flex h-5 w-5 items-center justify-center focus:outline-none"
                >
                  <span
                    className={`block h-[9px] w-[9px] rounded-full border-2 border-[#ef5360] transition-all duration-200 ${
                      active
                        ? "bg-[#ef5360]"
                        : "bg-transparent group-hover/dot:bg-[#ef5360]/25"
                    }`}
                  />
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
