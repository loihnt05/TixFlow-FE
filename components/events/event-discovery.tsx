"use client";

import { useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import type { Event, EventCategory } from "@/lib/mock/events";
import { eventCategories } from "@/lib/mock/events";
import { EventGrid } from "./event-grid";

const pageSize = 9;

export function EventDiscovery({ events, initialQuery = "", initialCategory = "" }: { events: Event[]; initialQuery?: string; initialCategory?: string }) {
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState(initialCategory);
  const [city, setCity] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [price, setPrice] = useState("");
  const [sort, setSort] = useState("date_asc");
  const [page, setPage] = useState(1);
  const cities = [...new Set(events.map((event) => event.venue.city))];
  const filtered = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase();
    const result = events.filter((event) => {
      if (normalized && !`${event.title} ${event.shortDescription} ${event.venue.city} ${event.organizer.name}`.toLocaleLowerCase().includes(normalized)) return false;
      if (category && event.category !== category) return false;
      if (city && event.venue.city !== city) return false;
      if (eventDate && event.startDate.slice(0, 10) < eventDate) return false;
      const min = Math.min(...event.ticketTypes.map((ticket) => ticket.price));
      if (price === "free" && min !== 0) return false;
      if (price === "paid" && min === 0) return false;
      return true;
    });
    if (sort === "popular") result.sort((a, b) => b.viewCount - a.viewCount);
    if (sort === "date_asc") result.sort((a, b) => a.startDate.localeCompare(b.startDate));
    if (sort === "date_desc") result.sort((a, b) => b.startDate.localeCompare(a.startDate));
    if (sort === "price_asc") result.sort((a, b) => Math.min(...a.ticketTypes.map((ticket) => ticket.price)) - Math.min(...b.ticketTypes.map((ticket) => ticket.price)));
    return result;
  }, [events, query, category, city, eventDate, price, sort]);
  const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const visible = filtered.slice((page - 1) * pageSize, page * pageSize);
  const resetPage = () => setPage(1);

  return (
    <div className="container pb-14 pt-8 sm:pt-10">
      <div className="mb-7"><p className="eyebrow mb-2">Inspiration everywhere</p><h1 className="text-3xl font-extrabold tracking-[-.04em] text-[#252a32] sm:text-4xl">Discover events</h1><p className="section-subtitle">Find the experiences, people, and ideas you want to spend time with.</p></div>
      <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-slate-100 bg-[#fcfcfc] p-3 sm:flex-row sm:items-center">
        <label className="header-search flex-1 !bg-white"><Search size={17} className="text-slate-400" /><input aria-label="Search events" placeholder="Search events, venues, organizers" value={query} onChange={(event) => { setQuery(event.target.value); resetPage(); }} /></label>
        <div className="flex items-center gap-2 text-xs font-bold text-slate-500"><SlidersHorizontal size={15} /> Filter &amp; sort</div>
        <select aria-label="Sort events" className="h-11 rounded-full border border-slate-200 bg-white px-4 text-sm" value={sort} onChange={(event) => { setSort(event.target.value); resetPage(); }}><option value="date_asc">Upcoming</option><option value="popular">Most popular</option><option value="date_desc">Date: latest</option><option value="price_asc">Price: low to high</option></select>
      </div>
      <div className="grid gap-7 lg:grid-cols-[220px_1fr]">
        <aside className="hidden lg:block">
          <h2 className="text-sm font-extrabold text-slate-800">Filters</h2>
          <label className="mt-5 block text-xs font-bold text-slate-600">Category<select className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 font-normal" value={category} onChange={(event) => { setCategory(event.target.value); resetPage(); }}><option value="">All categories</option>{[...new Map(eventCategories.map((item) => [item.value, item])).values()].map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select></label>
          <label className="mt-4 block text-xs font-bold text-slate-600">Location<select className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 font-normal" value={city} onChange={(event) => { setCity(event.target.value); resetPage(); }}><option value="">All locations</option>{cities.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
          <label className="mt-4 block text-xs font-bold text-slate-600">From date<input type="date" className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 font-normal" value={eventDate} onChange={(event) => { setEventDate(event.target.value); resetPage(); }} /></label>
          <label className="mt-4 block text-xs font-bold text-slate-600">Price<select className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 font-normal" value={price} onChange={(event) => { setPrice(event.target.value); resetPage(); }}><option value="">Any price</option><option value="free">Free events</option><option value="paid">Paid events</option></select></label>
          <button className="mt-5 text-xs font-bold text-[#e7653c]" type="button" onClick={() => { setQuery(""); setCategory(""); setCity(""); setEventDate(""); setPrice(""); setSort("date_asc"); resetPage(); }}>Clear all filters</button>
        </aside>
        <div>
          <div className="mb-4 grid grid-cols-2 gap-2 lg:hidden">
            <select aria-label="Filter by category" className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm" value={category} onChange={(event) => { setCategory(event.target.value); resetPage(); }}><option value="">All categories</option>{[...new Map(eventCategories.map((item) => [item.value, item])).values()].map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select>
            <select aria-label="Filter by location" className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm" value={city} onChange={(event) => { setCity(event.target.value); resetPage(); }}><option value="">All locations</option>{cities.map((item) => <option key={item} value={item}>{item}</option>)}</select>
            <input aria-label="Filter from date" type="date" className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm" value={eventDate} onChange={(event) => { setEventDate(event.target.value); resetPage(); }} />
            <select aria-label="Filter by price" className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm" value={price} onChange={(event) => { setPrice(event.target.value); resetPage(); }}><option value="">Any price</option><option value="free">Free</option><option value="paid">Paid</option></select>
            <select aria-label="Sort events" className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm" value={sort} onChange={(event) => { setSort(event.target.value); resetPage(); }}><option value="date_asc">Upcoming</option><option value="popular">Popular</option><option value="date_desc">Latest</option><option value="price_asc">Price low to high</option></select>
          </div>
          <div className="mb-4 flex items-center justify-between"><p className="text-xs text-slate-500"><strong className="text-slate-800">{filtered.length}</strong> events to explore</p></div>
          {visible.length ? <EventGrid events={visible} /> : <div className="rounded-2xl border border-dashed border-slate-300 px-5 py-16 text-center"><div className="text-lg font-bold text-slate-800">No events found</div><p className="mt-2 text-sm text-slate-500">Try changing your search or filters.</p></div>}
          {pages > 1 && <nav className="mt-8 flex items-center justify-center gap-2" aria-label="Event pages">{Array.from({ length: pages }, (_, index) => index + 1).map((number) => <button key={number} type="button" onClick={() => setPage(number)} aria-current={page === number ? "page" : undefined} className={`h-10 min-w-10 rounded-full px-3 text-sm font-bold ${page === number ? "bg-[#f36b3f] text-white" : "border border-slate-200 text-slate-600 hover:bg-slate-50"}`}>{number}</button>)}</nav>}
        </div>
      </div>
    </div>
  );
}
