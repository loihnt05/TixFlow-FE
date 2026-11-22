"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import type { Event } from "@/lib/mock/events";

const CURATED_POSTER_BACKGROUNDS = [
  "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?auto=format&fit=crop&w=900&q=82",
  "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=900&q=82",
  "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=900&q=82",
  "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?auto=format&fit=crop&w=900&q=82",
  "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=900&q=82",
];

const POSTER_ACCENTS = [
  { badgeBg: "bg-[#00E5FF]/20 text-[#76F7FF] border-[#00E5FF]/40", highlight: "#76F7FF" },
  { badgeBg: "bg-[#FF6B8B]/25 text-[#FFB4C4] border-[#FF6B8B]/40", highlight: "#FFB4C4" },
  { badgeBg: "bg-[#38BDF8]/25 text-[#BAE6FD] border-[#38BDF8]/40", highlight: "#BAE6FD" },
  { badgeBg: "bg-[#F59E0B]/25 text-[#FDE68A] border-[#F59E0B]/40", highlight: "#FDE68A" },
  { badgeBg: "bg-[#A855F7]/25 text-[#E9D5FF] border-[#A855F7]/40", highlight: "#E9D5FF" },
];

const shortDateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  timeZone: "Asia/Ho_Chi_Minh",
});

function formatPosterDate(event: Event): string {
  if (event.dateRangeLabel) return event.dateRangeLabel.toUpperCase();
  const parsed = new Date(event.startDate);
  if (Number.isNaN(parsed.getTime())) return "UPCOMING 2026";
  return shortDateFormatter.format(parsed).toUpperCase();
}

function resolvePosterBackground(event: Event, index: number): string {
  const raw = event.thumbnailImage || event.coverImage || "";
  if (raw && !raw.startsWith("data:image/svg+xml")) {
    return raw;
  }
  return CURATED_POSTER_BACKGROUNDS[index % CURATED_POSTER_BACKGROUNDS.length];
}

function buildRankSvgFallback(rank: number): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 75" width="45" height="75">
    <defs>
      <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="1" dy="2" stdDeviation="2" flood-color="#000000" flood-opacity="0.55"/>
      </filter>
    </defs>
    <g filter="url(#shadow)">
      <text x="4" y="66" font-family="Prompt, Arial, sans-serif" font-size="68" font-weight="800" fill="none" stroke="#ffffff" stroke-width="5" stroke-linejoin="round">${rank}</text>
      <text x="4" y="66" font-family="Prompt, Arial, sans-serif" font-size="68" font-weight="800" fill="none" stroke="#000000" stroke-opacity="0.45" stroke-width="2" stroke-linejoin="round">${rank}</text>
    </g>
  </svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

export function TrendingCarousel({ events }: { events: Event[] }) {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [noFadeLeft, setNoFadeLeft] = useState(true);
  const [noFadeRight, setNoFadeRight] = useState(true);

  // Zipevent displays top 5 trending events ranked 1–5
  const trendingEvents = events.slice(0, 5);

  const updateScrollFades = useCallback(() => {
    const el = sliderRef.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    if (maxScroll <= 4) {
      setNoFadeLeft(true);
      setNoFadeRight(true);
      return;
    }
    setNoFadeLeft(el.scrollLeft <= 4);
    setNoFadeRight(el.scrollLeft >= maxScroll - 4);
  }, []);

  useEffect(() => {
    updateScrollFades();
    window.addEventListener("resize", updateScrollFades);
    return () => window.removeEventListener("resize", updateScrollFades);
  }, [updateScrollFades, trendingEvents.length]);

  const scrollLeft = () => {
    sliderRef.current?.scrollBy({ left: -256, behavior: "smooth" });
  };

  const scrollRight = () => {
    sliderRef.current?.scrollBy({ left: 256, behavior: "smooth" });
  };

  if (trendingEvents.length === 0) return null;

  const containerClasses = [
    "container-banner-trending",
    noFadeLeft ? "no-fade-left" : "",
    noFadeRight ? "no-fade-right" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <section className="bg-trending">
      <div className="trending-section container mx-auto">
        <h3 className="text-white mb-2 md:mb-6 font-bold text-center text-[20px] sm:text-[24.5px] leading-[1.2]">
          Trending events
        </h3>

        <div className="container-scroll-trending p-0">
          <button
            type="button"
            onClick={scrollLeft}
            aria-label="Scroll left"
            className="scroll-button left"
          >
            <ChevronLeft size={22} className="mx-auto" />
          </button>

          <div
            id="trendingContainer"
            ref={sliderRef}
            onScroll={updateScrollFades}
            className={containerClasses}
          >
            {trendingEvents.map((event, index) => {
              const rank = index + 1;
              const rankBadgeUrl = `https://cdnali.zipeventapp.com/images/web/event/trending${rank}.png`;
              const rankFallback = buildRankSvgFallback(rank);
              const posterSrc = resolvePosterBackground(event, index);
              const accent = POSTER_ACCENTS[index % POSTER_ACCENTS.length];
              const dateText = formatPosterDate(event);
              const venueLabel = event.venue.isOnline
                ? "ONLINE EVENT"
                : (event.venue.name || event.venue.city || "BANGKOK").toUpperCase();
              const categoryLabel = (event.zipeventCategory || event.category || "LIVE EVENT").toUpperCase();

              return (
                <div key={event.id} className="event-wrapper">
                  <Link
                    href={`/e/${event.slug}`}
                    title={event.title}
                    aria-label={event.title}
                    className="block relative w-full h-full"
                  >
                    <img
                      src={rankBadgeUrl}
                      className="number-card"
                      width={41}
                      height={75}
                      alt="Number-Trending"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        const target = e.currentTarget;
                        if (target.src !== rankFallback) {
                          target.src = rankFallback;
                        }
                      }}
                    />

                    <picture className="trending-picture relative overflow-hidden rounded-[4px]">
                      <img
                        src={posterSrc}
                        alt={event.title}
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          const target = e.currentTarget;
                          const fallback =
                            event.thumbnailImage ||
                            CURATED_POSTER_BACKGROUNDS[index % CURATED_POSTER_BACKGROUNDS.length];
                          if (target.src !== fallback) target.src = fallback;
                        }}
                        className="event-card"
                      />

                      {/* Key-Art Poster Lighting Overlay so poster typography is crisp and authentic */}
                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 rounded-[4px]"
                        style={{
                          background:
                            "linear-gradient(180deg, rgba(10,12,22,0.82) 0%, rgba(10,12,22,0.38) 34%, rgba(10,12,22,0.48) 64%, rgba(10,12,22,0.92) 100%)",
                        }}
                      />

                      {/* Top Poster Key-Art Header (Date & Category Strip) */}
                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-x-3 top-3 z-[1] flex items-center justify-between gap-1.5 border-b border-white/15 pb-2 text-left"
                      >
                        <span
                          className="truncate text-[9.5px] font-bold tracking-wider"
                          style={{ color: accent.highlight }}
                        >
                          {dateText}
                        </span>
                        <span
                          className={`shrink-0 rounded-xs border px-1.5 py-0.5 text-[8.5px] font-bold uppercase tracking-wider ${accent.badgeBg}`}
                        >
                          {categoryLabel}
                        </span>
                      </span>

                      {/* Center/Upper Poster Display Title Lockup */}
                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-x-3.5 top-12 z-[1] flex flex-col items-start text-left"
                      >
                        <span className="line-clamp-3 text-[15px] font-extrabold uppercase leading-[1.18] tracking-tight text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.75)]">
                          {event.title}
                        </span>
                      </span>

                      {/* Bottom-Right Poster Venue Credit (offset right of the 45px rank numeral) */}
                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute bottom-2.5 left-[52px] right-2.5 z-[1] flex flex-col items-start text-left"
                      >
                        <span className="flex w-full items-center gap-1 text-[9.5px] font-semibold uppercase tracking-wide text-white/90">
                          <MapPin size={10} className="shrink-0" style={{ color: accent.highlight }} />
                          <span className="truncate">{venueLabel}</span>
                        </span>
                        <span className="mt-0.5 truncate w-full text-[8.5px] font-medium text-white/60">
                          {event.organizer.name}
                        </span>
                      </span>
                    </picture>
                  </Link>
                </div>
              );
            })}
          </div>

          <button
            type="button"
            onClick={scrollRight}
            aria-label="Scroll right"
            className="scroll-button right"
          >
            <ChevronRight size={22} className="mx-auto" />
          </button>
        </div>
      </div>
    </section>
  );
}
