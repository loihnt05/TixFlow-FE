"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Calendar, MapPin, Heart, Ticket } from "lucide-react";
import type { Event } from "@/lib/mock/events";
import { eventCategories } from "@/lib/mock/events";

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "Asia/Ho_Chi_Minh",
});

const moneyFormatter = new Intl.NumberFormat("en-US");

export function EventCard({
  event,
  compact = false,
  showButton = true,
}: {
  event: Event;
  compact?: boolean;
  showButton?: boolean;
}) {
  const [favorite, setFavorite] = useState(false);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("zipevent-favorites") ?? "[]") as string[];
    setFavorite(saved.includes(event.slug));
  }, [event.slug]);

  function toggleFavorite(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    const saved = new Set<string>(JSON.parse(localStorage.getItem("zipevent-favorites") ?? "[]") as string[]);
    if (saved.has(event.slug)) saved.delete(event.slug);
    else saved.add(event.slug);
    localStorage.setItem("zipevent-favorites", JSON.stringify([...saved]));
    setFavorite(saved.has(event.slug));
  }

  const category = eventCategories.find((item) => item.value === event.category)?.label ?? "Event";
  const lowestPrice = Math.min(...event.ticketTypes.map((ticket) => ticket.price));
  const isFree = lowestPrice === 0;
  const isSoldOut = event.status === "sold_out";

  const buttonText = isSoldOut ? "Sold Out" : isFree ? "Free Register" : "Get Ticket";

  return (
    <article className="event-card-item h-full">
      <div className="event-container flex flex-col justify-between">
        <Link href={`/events/${event.slug}`} className="block group">
          {/* Poster Image */}
          <div className="event-image-poster relative">
            <img
              src={event.thumbnailImage}
              alt={event.title}
              loading="lazy"
              className="w-full h-full object-cover"
            />

            {/* Favorite button */}
            <button
              type="button"
              onClick={toggleFavorite}
              aria-pressed={favorite}
              aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
              className={`absolute right-2.5 top-2.5 grid h-8 w-8 place-items-center rounded-full bg-white/90 backdrop-blur-sm shadow-sm transition-all hover:scale-110 ${
                favorite ? "text-[#ef5360]" : "text-gray-500 hover:text-[#ef5360]"
              }`}
            >
              <Heart size={16} fill={favorite ? "currentColor" : "none"} strokeWidth={2} />
            </button>

            {/* Category / Sold Out Badge */}
            <div className="absolute bottom-2 left-2 flex items-center gap-1.5">
              <span className="rounded-full bg-black/60 backdrop-blur-sm px-2.5 py-0.5 text-[10px] font-semibold text-white">
                {category}
              </span>
              {isSoldOut && (
                <span className="rounded-full bg-[#ef5360] px-2.5 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider">
                  Sold Out
                </span>
              )}
            </div>
          </div>

          {/* Caption / Content Area */}
          <div className="caption">
            <h3 className="event-card-title" title={event.title}>
              {event.title}
            </h3>

            {/* Date */}
            <div className="event-card-meta">
              <Calendar size={13} className="shrink-0 text-[#ef5360]" />
              <span className="truncate">
                {dateFormatter.format(new Date(event.startDate))} · {event.startTime}
              </span>
            </div>

            {/* Venue */}
            <div className="event-card-meta">
              <MapPin size={13} className="shrink-0 text-[#ef5360]" />
              <span className="truncate">
                {event.venue.isOnline ? "Online Event" : `${event.venue.name}`}
              </span>
            </div>

            {/* Price tag */}
            <div className="mt-2 text-xs font-bold text-gray-800">
              {isFree ? (
                <span className="text-emerald-600">Free</span>
              ) : (
                <span>From {moneyFormatter.format(lowestPrice)} VND</span>
              )}
            </div>
          </div>
        </Link>

        {/* Action Button */}
        {showButton && (
          <div className="px-3 pb-3 pt-0">
            <Link
              href={`/events/${event.slug}`}
              className={`btn-event-type ${isSoldOut ? "!bg-gray-400 cursor-not-allowed" : ""}`}
            >
              {buttonText}
            </Link>
          </div>
        )}
      </div>
    </article>
  );
}
