"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Calendar, MapPin, Heart } from "lucide-react";
import type { Event } from "@/lib/mock/events";

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "Asia/Ho_Chi_Minh",
});

const defaultPosterFallback =
  "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=900&q=82";

export function EventCard({
  event,
  showButton = true,
}: {
  event: Event;
  compact?: boolean;
  showButton?: boolean;
}) {
  const [favorite, setFavorite] = useState(false);
  const [imgSrc, setImgSrc] = useState(event.thumbnailImage);

  useEffect(() => {
    setImgSrc(event.thumbnailImage);
  }, [event.thumbnailImage]);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("tixflow-favorites") ?? "[]") as string[];
      setFavorite(saved.includes(event.slug));
    } catch {
      setFavorite(false);
    }
  }, [event.slug]);

  function toggleFavorite(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    const saved = new Set<string>(
      JSON.parse(localStorage.getItem("tixflow-favorites") ?? "[]") as string[],
    );
    if (saved.has(event.slug)) saved.delete(event.slug);
    else saved.add(event.slug);
    localStorage.setItem("tixflow-favorites", JSON.stringify([...saved]));
    setFavorite(saved.has(event.slug));
  }

  const lowestPrice = Math.min(...event.ticketTypes.map((ticket) => ticket.price));
  const isFree = lowestPrice === 0;
  const isSoldOut = event.status === "sold_out";

  const buttonText = isSoldOut
    ? "Sold Out"
    : event.ctaLabel ?? (isFree ? "Free Register" : "Get Ticket");

  const formattedDate =
    event.dateRangeLabel ?? dateFormatter.format(new Date(event.startDate));

  return (
    <article className="event-card-item h-full">
      <div className="event-container group">
        <Link href={`/e/${event.slug}`} className="block">
          {/* Portrait 4:5 Poster Image — Flush to Top & Sides like Zipevent */}
          <div className="event-image-poster relative">
            <img
              src={imgSrc}
              alt={event.title}
              loading="lazy"
              referrerPolicy="no-referrer"
              onError={() => {
                const next = event.fallbackImage || event.coverImage || defaultPosterFallback;
                if (imgSrc !== next) setImgSrc(next);
              }}
              className="h-full w-full object-cover"
            />

            {/* Subtle Favorite Trigger (visible on hover or when saved, keeping poster clean) */}
            <button
              type="button"
              onClick={toggleFavorite}
              aria-pressed={favorite}
              aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
              className={`absolute right-2.5 top-2.5 grid h-8 w-8 place-items-center rounded-full bg-white/90 backdrop-blur-sm shadow-sm transition-all duration-200 hover:scale-105 ${
                favorite
                  ? "opacity-100 text-[#ef5360]"
                  : "opacity-0 group-hover:opacity-100 text-gray-500 hover:text-[#ef5360]"
              }`}
            >
              <Heart size={15} fill={favorite ? "currentColor" : "none"} strokeWidth={1.9} />
            </button>

            {isSoldOut && (
              <div className="absolute inset-x-0 bottom-0 bg-black/65 py-1 text-center text-[11px] font-medium uppercase tracking-wider text-white">
                Sold Out
              </div>
            )}
          </div>

          {/* Clean Zipevent Caption Area */}
          <div className="caption">
            <h3 className="event-card-title" title={event.title}>
              {event.title}
            </h3>

            {/* Date Range */}
            <div className="event-card-meta">
              <Calendar size={13} className="shrink-0 text-[#ef5360]" strokeWidth={1.8} />
              <span className="truncate">{formattedDate}</span>
            </div>

            {/* Venue */}
            <div className="event-card-meta">
              <MapPin size={13} className="shrink-0 text-[#ef5360]" strokeWidth={1.8} />
              <span className="truncate">
                {event.venue.isOnline ? "Online Event" : event.venue.name}
              </span>
            </div>
          </div>
        </Link>

        {/* Full-Width Coral Pill Button */}
        {showButton && (
          <div className="px-3 pb-3 pt-0.5">
            <Link
              href={`/e/${event.slug}`}
              className={`btn-event-type ${
                isSoldOut
                  ? "!bg-gray-400 cursor-not-allowed"
                  : buttonText === "Rerun"
                    ? "!bg-[#ef5360]"
                    : ""
              }`}
            >
              {buttonText}
            </Link>
          </div>
        )}
      </div>
    </article>
  );
}
