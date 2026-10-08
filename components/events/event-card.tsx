"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CalendarDays, Heart, MapPin } from "lucide-react";
import type { Event } from "@/lib/mock/events";
import { eventCategories } from "@/lib/mock/events";

const dateFormatter = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Ho_Chi_Minh" });
const moneyFormatter = new Intl.NumberFormat("en-US");

export function EventCard({ event, compact = false }: { event: Event; compact?: boolean }) {
  const [favorite, setFavorite] = useState(false);
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("zipevent-favorites") ?? "[]") as string[];
    setFavorite(saved.includes(event.slug));
  }, [event.slug]);
  function toggleFavorite() {
    const saved = new Set<string>(JSON.parse(localStorage.getItem("zipevent-favorites") ?? "[]") as string[]);
    if (saved.has(event.slug)) saved.delete(event.slug); else saved.add(event.slug);
    localStorage.setItem("zipevent-favorites", JSON.stringify([...saved]));
    setFavorite(saved.has(event.slug));
  }
  const category = eventCategories.find((item) => item.value === event.category)?.label ?? "Event";
  const price = Math.min(...event.ticketTypes.map((ticket) => ticket.price));
  return (
    <article className="event-card">
      <div className="event-image">
        <Link href={`/events/${event.slug}`} aria-label={`View ${event.title}`}><img src={event.thumbnailImage} alt={`${event.title} event`} loading="lazy" /></Link>
        <button type="button" onClick={toggleFavorite} aria-pressed={favorite} aria-label={favorite ? "Remove from favorites" : "Add to favorites"} className={`absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white/95 shadow-sm transition-colors ${favorite ? "text-rose-500" : "text-slate-600 hover:text-rose-500"}`}><Heart size={17} fill={favorite ? "currentColor" : "none"} /></button>
        <span className="absolute bottom-3 left-3 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-bold text-slate-700 shadow-sm">{category}</span>
        {event.status === "sold_out" && <span className="absolute right-3 top-3 rounded-full bg-slate-900/85 px-2.5 py-1 text-[10px] font-bold text-white">Sold out</span>}
      </div>
      <div className="event-card-body">
        {!compact && <span className="event-category">{category}</span>}
        <Link href={`/events/${event.slug}`} className="event-title hover:text-[#e76238]">{event.title}</Link>
        <div className="event-meta"><CalendarDays size={14} className="shrink-0 text-[#e87953]" /><span>{dateFormatter.format(new Date(event.startDate))} · {event.startTime}</span></div>
        <div className="event-meta"><MapPin size={14} className="shrink-0 text-[#e87953]" /><span className="truncate">{event.venue.isOnline ? "Online event" : `${event.venue.name}, ${event.venue.city}`}</span></div>
        <div className="event-card-bottom">
          <span className="event-price">{price === 0 ? "Free" : `From ${moneyFormatter.format(price)} VND`}</span>
          <span className="event-organizer">{event.organizer.name}</span>
        </div>
      </div>
    </article>
  );
}
