"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CalendarDays, Check, Clock3, Heart, MapPin, Minus, Plus, Share2, Ticket } from "lucide-react";
import type { Event } from "@/lib/mock/events";
import { EventGrid } from "./event-grid";

const money = new Intl.NumberFormat("en-US");
const date = new Intl.DateTimeFormat("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Ho_Chi_Minh" });

export function EventDetailView({ event, related }: { event: Event; related: Event[] }) {
  const [quantity, setQuantity] = useState(0);
  const [favorite, setFavorite] = useState(false);
  const [copied, setCopied] = useState(false);
  const ticket = event.ticketTypes[0];
  const max = Math.min(ticket.maxPerOrder, ticket.quantity - ticket.sold);
  const total = ticket.price * quantity;

  useEffect(() => {
    const saved = new Set<string>(JSON.parse(localStorage.getItem("zipevent-favorites") ?? "[]") as string[]);
    setFavorite(saved.has(event.slug));
  }, [event.slug]);

  function toggleFavorite() {
    const saved = new Set<string>(JSON.parse(localStorage.getItem("zipevent-favorites") ?? "[]") as string[]);
    if (saved.has(event.slug)) saved.delete(event.slug); else saved.add(event.slug);
    localStorage.setItem("zipevent-favorites", JSON.stringify([...saved]));
    setFavorite(saved.has(event.slug));
  }

  async function shareEvent() {
    await navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  const checkoutHref = `/checkout?event=${event.slug}&ticket=${ticket.id}&quantity=${quantity}`;
  return (
    <main className="page-shell pb-20">
      <div className="container pt-5 text-xs text-slate-400"><Link href="/events" className="hover:text-[#e7653c]">Events</Link><span className="mx-2">/</span><span className="text-slate-600">{event.title}</span></div>
      <div className="container mt-5 overflow-hidden rounded-2xl bg-slate-100"><img src={event.coverImage} alt={`${event.title} cover`} className="h-[240px] w-full object-cover sm:h-[360px] lg:h-[440px]" /></div>
      <div className="container mt-7 grid gap-9 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div><span className="event-category">{event.category}</span><h1 className="mt-3 text-3xl font-extrabold leading-tight tracking-[-.04em] text-slate-900 sm:text-[40px]">{event.title}</h1><p className="mt-2 text-sm text-slate-500">Organized by <span className="font-bold text-slate-700">{event.organizer.name}</span></p></div>
            <div className="flex gap-2"><button type="button" onClick={toggleFavorite} className={`button-outline !h-10 !min-h-10 !px-3 ${favorite ? "!border-rose-200 !text-rose-500" : ""}`} aria-label={favorite ? "Remove from favorites" : "Add to favorites"}><Heart size={17} fill={favorite ? "currentColor" : "none"} /></button><button type="button" onClick={shareEvent} className="button-outline !h-10 !min-h-10 !px-3" aria-label="Share event">{copied ? <Check size={17} /> : <Share2 size={17} />}{copied && <span className="text-xs">Copied</span>}</button></div>
          </div>

          <div className="mt-7 grid gap-3 rounded-2xl border border-slate-100 bg-[#fcfcfc] p-4 sm:grid-cols-2 sm:p-5">
            <div className="flex gap-3"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-orange-50 text-[#e87953]"><CalendarDays size={19} /></span><div><div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Date</div><div className="mt-1 text-sm font-bold text-slate-800">{date.format(new Date(event.startDate))}</div></div></div>
            <div className="flex gap-3"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-orange-50 text-[#e87953]"><Clock3 size={19} /></span><div><div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Time</div><div className="mt-1 text-sm font-bold text-slate-800">{event.startTime} – {event.endTime} (UTC+7)</div></div></div>
            <div className="flex gap-3 sm:col-span-2"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-orange-50 text-[#e87953]"><MapPin size={19} /></span><div><div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Location</div><div className="mt-1 text-sm font-bold text-slate-800">{event.venue.isOnline ? "Online event" : event.venue.name}</div><div className="mt-1 text-xs text-slate-500">{event.venue.address}{!event.venue.isOnline && `, ${event.venue.city}`}</div></div></div>
          </div>

          <section className="mt-9"><h2 className="text-xl font-extrabold text-slate-900">About this event</h2><p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-600">{event.description}</p></section>
          <section className="mt-9"><h2 className="text-xl font-extrabold text-slate-900">What to expect</h2><div className="mt-4 grid gap-3 sm:grid-cols-3">{["Meet the community", "Learn from practitioners", "Take home new ideas"].map((item, index) => <div key={item} className="rounded-xl border border-slate-100 p-4"><div className="text-xs font-extrabold text-[#e7653c]">0{index + 1}</div><div className="mt-2 text-sm font-bold text-slate-800">{item}</div><p className="mt-1 text-xs leading-5 text-slate-500">A welcoming experience designed to make your time worthwhile.</p></div>)}</div></section>
          <section className="mt-9"><h2 className="text-xl font-extrabold text-slate-900">Venue</h2><div className="mt-4 flex min-h-40 items-center justify-center rounded-2xl border border-slate-100 bg-[#f7f8fa] text-sm text-slate-500"><MapPin size={18} className="mr-2 text-[#e7653c]" />{event.venue.isOnline ? "This event takes place online" : `${event.venue.name} · ${event.venue.city}`}</div></section>
        </div>

        <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_12px_36px_#20252d0b] lg:sticky lg:top-24">
          <div className="flex items-center justify-between"><h2 className="text-lg font-extrabold text-slate-900">Tickets</h2><span className="text-xs text-slate-500">{ticket.quantity - ticket.sold} left</span></div>
          <div className="mt-4 rounded-xl border border-slate-100 p-4"><div className="flex items-start justify-between gap-3"><div><div className="text-sm font-extrabold text-slate-800">{ticket.name}</div><p className="mt-1 text-xs text-slate-500">{ticket.description}</p></div><div className="shrink-0 text-right text-sm font-extrabold text-slate-900">{ticket.price === 0 ? "Free" : `${money.format(ticket.price)} VND`}</div></div>
            <div className="mt-4 flex items-center justify-between"><span className="text-xs font-semibold text-slate-500">Quantity</span><div className="flex items-center gap-3"><button type="button" aria-label="Decrease quantity" disabled={quantity <= 0} onClick={() => setQuantity((value) => Math.max(0, value - 1))} className="grid h-8 w-8 place-items-center rounded-full border border-slate-200 disabled:opacity-40"><Minus size={14} /></button><span className="min-w-4 text-center text-sm font-bold tabular-nums">{quantity}</span><button type="button" aria-label="Increase quantity" disabled={quantity >= max} onClick={() => setQuantity((value) => Math.min(max, value + 1))} className="grid h-8 w-8 place-items-center rounded-full border border-slate-200 disabled:opacity-40"><Plus size={14} /></button></div></div>
          </div>
          <div className="mt-4 flex justify-between border-t border-slate-100 pt-4 text-sm"><span className="text-slate-500">Subtotal</span><strong className="text-slate-900">{money.format(total)} VND</strong></div>
          <Link aria-disabled={quantity === 0 || event.status === "sold_out"} className={`button-primary mt-4 w-full ${quantity === 0 || event.status === "sold_out" ? "pointer-events-none opacity-50" : ""}`} href={checkoutHref}>{event.status === "sold_out" ? "Sold out" : "Continue to checkout"}</Link>
          <p className="mt-3 text-center text-[11px] text-slate-400">Secure your place in just a few steps.</p>
        </aside>
      </div>
      {related.length > 0 && <section className="container mt-14"><div className="mb-5"><h2 className="section-title">You might also like</h2></div><EventGrid events={related} compact /></section>}
      {quantity > 0 && <div className="fixed inset-x-0 bottom-0 z-20 border-t border-slate-200 bg-white p-3 shadow-[0_-8px_30px_#20252d10] lg:hidden"><div className="container flex items-center justify-between gap-4 !px-0"><div><div className="text-[11px] text-slate-500">{quantity} ticket{quantity > 1 ? "s" : ""}</div><div className="text-sm font-extrabold">{money.format(total)} VND</div></div><Link href={checkoutHref} className="button-primary">Continue <Ticket size={15} /></Link></div></div>}
    </main>
  );
}
