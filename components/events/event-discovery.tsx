"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Search,
  SlidersHorizontal,
  X,
  ChevronRight,
  ChevronDown,
  Calendar,
  MapPin,
  Tag,
  DollarSign,
  RotateCcw,
  Check,
} from "lucide-react";
import type { Event, EventCategory } from "@/lib/mock/events";
import { eventCategories } from "@/lib/mock/events";
import { EventCard } from "./event-card";

const pageSize = 15; // 3 rows of 5 on desktop

const dateQuickFilters = [
  { label: "All", value: "all" },
  { label: "Today", value: "today" },
  { label: "This Week", value: "this_week" },
  { label: "This Month", value: "this_month" },
];

export function EventDiscovery({
  events,
  initialQuery = "",
  initialCategory = "",
}: {
  events: Event[];
  initialQuery?: string;
  initialCategory?: string;
}) {
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState(initialCategory);
  const [dateRange, setDateRange] = useState("all");
  const [city, setCity] = useState("");
  const [format, setFormat] = useState("all"); // all, onsite, online
  const [priceType, setPriceType] = useState("all"); // all, free, paid
  const [sort, setSort] = useState("date_asc");
  const [page, setPage] = useState(1);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Available cities
  const cities = useMemo(() => {
    return [...new Set(events.map((e) => e.venue.city).filter(Boolean))];
  }, [events]);

  // Count active filters
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (category) count++;
    if (city) count++;
    if (dateRange !== "all") count++;
    if (format !== "all") count++;
    if (priceType !== "all") count++;
    return count;
  }, [category, city, dateRange, format, priceType]);

  const clearAllFilters = () => {
    setQuery("");
    setCategory("");
    setDateRange("all");
    setCity("");
    setFormat("all");
    setPriceType("all");
    setSort("date_asc");
    setPage(1);
  };

  // Filtered & sorted events
  const filteredEvents = useMemo(() => {
    const q = query.trim().toLowerCase();
    const now = new Date("2026-10-11T00:00:00Z"); // fixed reference date matching mock data

    const list = events.filter((event) => {
      // Query filter
      if (
        q &&
        !`${event.title} ${event.shortDescription} ${event.venue.name} ${event.venue.city} ${event.organizer.name}`
          .toLowerCase()
          .includes(q)
      ) {
        return false;
      }

      // Category filter
      if (category && event.category !== category) return false;

      // City filter
      if (city && event.venue.city !== city) return false;

      // Format filter
      if (format === "online" && !event.venue.isOnline) return false;
      if (format === "onsite" && event.venue.isOnline) return false;

      // Price filter
      const minP = Math.min(...event.ticketTypes.map((t) => t.price));
      if (priceType === "free" && minP !== 0) return false;
      if (priceType === "paid" && minP === 0) return false;

      // Date range filter
      if (dateRange !== "all") {
        const eventDate = new Date(event.startDate);
        const diffDays = (eventDate.getTime() - now.getTime()) / (1000 * 3600 * 24);
        if (dateRange === "today" && (diffDays < 0 || diffDays > 1)) return false;
        if (dateRange === "this_week" && (diffDays < 0 || diffDays > 7)) return false;
        if (dateRange === "this_month" && (diffDays < 0 || diffDays > 30)) return false;
      }

      return true;
    });

    // Sorting
    if (sort === "date_asc") {
      list.sort((a, b) => a.startDate.localeCompare(b.startDate));
    } else if (sort === "date_desc") {
      list.sort((a, b) => b.startDate.localeCompare(a.startDate));
    } else if (sort === "popular") {
      list.sort((a, b) => b.viewCount - a.viewCount);
    } else if (sort === "price_asc") {
      list.sort(
        (a, b) =>
          Math.min(...a.ticketTypes.map((t) => t.price)) -
          Math.min(...b.ticketTypes.map((t) => t.price))
      );
    } else if (sort === "price_desc") {
      list.sort(
        (a, b) =>
          Math.min(...b.ticketTypes.map((t) => t.price)) -
          Math.min(...a.ticketTypes.map((t) => t.price))
      );
    }

    return list;
  }, [events, query, category, city, format, priceType, dateRange, sort]);

  const totalPages = Math.max(1, Math.ceil(filteredEvents.length / pageSize));
  const pagedEvents = filteredEvents.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="min-h-screen bg-[#FDFCFD] pb-16">
      {/* Top Breadcrumb & Heading Bar */}
      <div className="border-b border-gray-100 bg-white">
        <div className="container py-4 sm:py-6">
          <nav className="mb-2 flex items-center gap-1.5 text-xs text-[#8E8E8E]">
            <Link href="/" className="hover:text-[#ef5360]">
              Home
            </Link>
            <ChevronRight size={13} />
            <span className="font-medium text-[#2B212B]">All Events</span>
          </nav>
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl font-bold tracking-tight text-[#2B212B] sm:text-2xl md:text-3xl">
                All Events
              </h1>
              <span className="rounded-full bg-[#FFEFF0] px-2.5 py-0.5 text-xs font-bold text-[#ef5360]">
                {filteredEvents.length}
              </span>
            </div>

            {/* Quick Date Pills for Tablet/Desktop */}
            <div className="hidden items-center gap-1.5 sm:flex">
              {dateQuickFilters.map((df) => (
                <button
                  key={df.value}
                  onClick={() => {
                    setDateRange(df.value);
                    setPage(1);
                  }}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
                    dateRange === df.value
                      ? "bg-[#ef5360] text-white shadow-2xs"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {df.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="container pt-6 sm:pt-8">
        {/* Top Controls: Search Input + Mobile Filter Button + Sort Select */}
        <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-gray-100 bg-white p-3 shadow-2xs sm:flex-row sm:items-center">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Search events, venues, or organizers..."
              className="w-full rounded-xl bg-gray-50 py-2.5 pl-10 pr-9 text-xs text-[#2B212B] outline-none transition-colors placeholder:text-[#8E8E8E] focus:bg-white focus:ring-2 focus:ring-[#ef5360]/20 sm:text-sm"
            />
            {query && (
              <button
                onClick={() => {
                  setQuery("");
                  setPage(1);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={15} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Mobile Filter Trigger Button */}
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="relative flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-[#2B212B] transition-colors hover:border-[#ef5360] hover:text-[#ef5360] lg:hidden"
            >
              <SlidersHorizontal size={15} />
              <span>Filters</span>
              {activeFilterCount > 0 && (
                <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-[#ef5360] px-1 text-[10px] font-bold text-white">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {/* Sort Select */}
            <div className="relative flex-1 sm:w-48 sm:flex-none">
              <select
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value);
                  setPage(1);
                }}
                aria-label="Sort events"
                className="w-full appearance-none rounded-xl border border-gray-200 bg-white py-2.5 pl-3 pr-8 text-xs font-semibold text-[#2B212B] outline-none transition-colors hover:border-gray-300 focus:border-[#ef5360] sm:text-sm"
              >
                <option value="date_asc">Date: Soonest</option>
                <option value="popular">Most Popular</option>
                <option value="date_desc">Date: Latest</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
              <ChevronDown
                size={14}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
            </div>
          </div>
        </div>

        {/* Layout: Left Sidebar Filters + Right Event Grid */}
        <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
          {/* Desktop Left Sidebar Filters */}
          <aside className="hidden space-y-6 lg:block">
            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-2xs">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal size={16} className="text-[#ef5360]" />
                  <h2 className="text-sm font-bold text-[#2B212B]">Filters</h2>
                </div>
                {activeFilterCount > 0 && (
                  <button
                    onClick={clearAllFilters}
                    className="flex items-center gap-1 text-[11px] font-semibold text-[#ef5360] hover:underline"
                  >
                    <RotateCcw size={12} />
                    <span>Reset</span>
                  </button>
                )}
              </div>

              {/* 1. Event Format */}
              <div className="border-b border-gray-100 py-4">
                <h3 className="mb-2.5 text-xs font-bold text-[#2B212B]">Event Format</h3>
                <div className="space-y-1.5">
                  {[
                    { id: "all", label: "All" },
                    { id: "onsite", label: "On-site" },
                    { id: "online", label: "Online" },
                  ].map((item) => (
                    <label
                      key={item.id}
                      className="flex cursor-pointer items-center justify-between rounded-lg px-2 py-1.5 text-xs text-gray-700 transition-colors hover:bg-gray-50"
                    >
                      <span>{item.label}</span>
                      <input
                        type="radio"
                        name="format"
                        checked={format === item.id}
                        onChange={() => {
                          setFormat(item.id);
                          setPage(1);
                        }}
                        className="accent-[#ef5360]"
                      />
                    </label>
                  ))}
                </div>
              </div>

              {/* 2. Price Range */}
              <div className="border-b border-gray-100 py-4">
                <h3 className="mb-2.5 text-xs font-bold text-[#2B212B]">Price</h3>
                <div className="space-y-1.5">
                  {[
                    { id: "all", label: "All" },
                    { id: "free", label: "Free" },
                    { id: "paid", label: "Paid" },
                  ].map((item) => (
                    <label
                      key={item.id}
                      className="flex cursor-pointer items-center justify-between rounded-lg px-2 py-1.5 text-xs text-gray-700 transition-colors hover:bg-gray-50"
                    >
                      <span>{item.label}</span>
                      <input
                        type="radio"
                        name="priceType"
                        checked={priceType === item.id}
                        onChange={() => {
                          setPriceType(item.id);
                          setPage(1);
                        }}
                        className="accent-[#ef5360]"
                      />
                    </label>
                  ))}
                </div>
              </div>

              {/* 3. Location / City */}
              <div className="border-b border-gray-100 py-4">
                <h3 className="mb-2.5 text-xs font-bold text-[#2B212B]">City / Location</h3>
                <select
                  value={city}
                  onChange={(e) => {
                    setCity(e.target.value);
                    setPage(1);
                  }}
                  className="w-full rounded-xl border border-gray-200 bg-white p-2 text-xs text-gray-700 outline-none focus:border-[#ef5360]"
                >
                  <option value="">All Locations ({cities.length})</option>
                  {cities.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* 4. Category Checkboxes */}
              <div className="pt-4">
                <h3 className="mb-2.5 text-xs font-bold text-[#2B212B]">Category</h3>
                <div className="max-h-60 space-y-1 overflow-y-auto pr-1">
                  <label
                    className={`flex cursor-pointer items-center justify-between rounded-lg px-2 py-1.5 text-xs transition-colors ${
                      category === ""
                        ? "bg-[#FFEFF0] font-bold text-[#ef5360]"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <span>All Categories</span>
                    <input
                      type="radio"
                      name="category"
                      checked={category === ""}
                      onChange={() => {
                        setCategory("");
                        setPage(1);
                      }}
                      className="accent-[#ef5360]"
                    />
                  </label>
                  {eventCategories.map((cat, idx) => (
                    <label
                      key={`${cat.value}-${idx}`}
                      className={`flex cursor-pointer items-center justify-between rounded-lg px-2 py-1.5 text-xs transition-colors ${
                        category === cat.value
                          ? "bg-[#FFEFF0] font-bold text-[#ef5360]"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <span className="flex items-center gap-1.5 truncate">
                        <span>{cat.icon}</span>
                        <span className="truncate">{cat.label}</span>
                      </span>
                      <input
                        type="radio"
                        name="category"
                        checked={category === cat.value}
                        onChange={() => {
                          setCategory(cat.value);
                          setPage(1);
                        }}
                        className="accent-[#ef5360]"
                      />
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Right Events Grid & Results */}
          <div className="min-w-0">
            {/* Active Filter Badges */}
            {activeFilterCount > 0 && (
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <span className="text-xs text-[#8E8E8E]">Active filters:</span>
                {category && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#FFEFF0] px-3 py-1 text-xs font-semibold text-[#ef5360]">
                    Category: {category}
                    <button onClick={() => setCategory("")}>
                      <X size={12} />
                    </button>
                  </span>
                )}
                {city && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#FFEFF0] px-3 py-1 text-xs font-semibold text-[#ef5360]">
                    City: {city}
                    <button onClick={() => setCity("")}>
                      <X size={12} />
                    </button>
                  </span>
                )}
                {format !== "all" && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#FFEFF0] px-3 py-1 text-xs font-semibold text-[#ef5360]">
                    Format: {format}
                    <button onClick={() => setFormat("all")}>
                      <X size={12} />
                    </button>
                  </span>
                )}
                {priceType !== "all" && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#FFEFF0] px-3 py-1 text-xs font-semibold text-[#ef5360]">
                    Price: {priceType === "free" ? "Free" : "Paid"}
                    <button onClick={() => setPriceType("all")}>
                      <X size={12} />
                    </button>
                  </span>
                )}
                {dateRange !== "all" && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#FFEFF0] px-3 py-1 text-xs font-semibold text-[#ef5360]">
                    Date:{" "}
                    {dateQuickFilters.find((d) => d.value === dateRange)?.label}
                    <button onClick={() => setDateRange("all")}>
                      <X size={12} />
                    </button>
                  </span>
                )}
                <button
                  onClick={clearAllFilters}
                  className="text-xs font-semibold text-gray-500 hover:text-[#ef5360]"
                >
                  Clear All
                </button>
              </div>
            )}

            {/* Grid of Events */}
            {pagedEvents.length > 0 ? (
              <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 sm:gap-4 xl:grid-cols-4 2xl:grid-cols-5">
                {pagedEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            ) : (
              /* Empty State */
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white py-16 text-center shadow-2xs">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-[#ef5360]">
                  <Search size={28} />
                </div>
                <h3 className="mt-4 text-base font-bold text-[#2B212B]">
                  No events found
                </h3>
                <p className="mt-1 max-w-sm text-xs text-[#8E8E8E]">
                  Try a different search or reset the filters to discover more events.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-[#ef5360] px-6 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#ec3746]"
                >
                  <RotateCcw size={14} />
                  <span>Clear All Filters</span>
                </button>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-10 flex items-center justify-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-xs font-semibold text-gray-600 transition-colors hover:border-[#ef5360] hover:text-[#ef5360] disabled:opacity-40"
                >
                  ‹
                </button>
                {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((num) => (
                  <button
                    key={num}
                    onClick={() => setPage(num)}
                    className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold transition-all ${
                      page === num
                        ? "bg-[#ef5360] text-white shadow-2xs"
                        : "border border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    {num}
                  </button>
                ))}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-xs font-semibold text-gray-600 transition-colors hover:border-[#ef5360] hover:text-[#ef5360] disabled:opacity-40"
                >
                  ›
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer / Modal */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex items-end bg-black/50 backdrop-blur-2xs lg:hidden">
          <div
            className="w-full max-h-[85vh] overflow-y-auto rounded-t-3xl bg-white p-6 shadow-2xl animate-in slide-in-from-bottom duration-300"
          >
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div className="flex items-center gap-2">
                <SlidersHorizontal size={18} className="text-[#ef5360]" />
                <h3 className="text-base font-bold text-[#2B212B]">Event Filters</h3>
              </div>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            {/* Mobile Filters Content */}
            <div className="space-y-5 py-4">
              {/* Date */}
              <div>
                <h4 className="mb-2 text-xs font-bold text-[#2B212B]">Date</h4>
                <div className="grid grid-cols-2 gap-2">
                  {dateQuickFilters.map((df) => (
                    <button
                      key={df.value}
                      onClick={() => setDateRange(df.value)}
                      className={`rounded-xl py-2 text-xs font-semibold transition-all ${
                        dateRange === df.value
                          ? "bg-[#ef5360] text-white"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {df.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Format */}
              <div>
                <h4 className="mb-2 text-xs font-bold text-[#2B212B]">Format</h4>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "all", label: "All" },
                    { id: "onsite", label: "On-site" },
                    { id: "online", label: "Online" },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setFormat(item.id)}
                      className={`rounded-xl py-2 text-xs font-semibold ${
                        format === item.id
                          ? "bg-[#ef5360] text-white"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div>
                <h4 className="mb-2 text-xs font-bold text-[#2B212B]">Price</h4>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "all", label: "All" },
                    { id: "free", label: "Free" },
                    { id: "paid", label: "Paid" },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setPriceType(item.id)}
                      className={`rounded-xl py-2 text-xs font-semibold ${
                        priceType === item.id
                          ? "bg-[#ef5360] text-white"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Location */}
              <div>
                <h4 className="mb-2 text-xs font-bold text-[#2B212B]">Location</h4>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-white p-2.5 text-xs text-gray-700"
                >
                  <option value="">All Locations ({cities.length})</option>
                  {cities.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* Category */}
              <div>
                <h4 className="mb-2 text-xs font-bold text-[#2B212B]">Category</h4>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-white p-2.5 text-xs text-gray-700"
                >
                  <option value="">All Categories ({eventCategories.length})</option>
                  {eventCategories.map((cat, idx) => (
                    <option key={`${cat.value}-${idx}`} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Drawer Actions */}
            <div className="flex gap-3 border-t border-gray-100 pt-4">
              <button
                onClick={clearAllFilters}
                className="flex-1 rounded-full border border-gray-200 py-3 text-xs font-semibold text-gray-700 hover:bg-gray-50"
              >
                Clear Filters
              </button>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="flex-1 rounded-full bg-[#ef5360] py-3 text-xs font-bold text-white shadow-xs hover:bg-[#ec3746]"
              >
                Show Results ({filteredEvents.length})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
