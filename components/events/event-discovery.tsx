"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Search,
  SlidersHorizontal,
  X,
  ChevronUp,
  ChevronDown,
  RotateCcw,
  Check,
  Calendar,
} from "lucide-react";
import {
  zipeventSidebarCategories,
  eventCategories,
  type Event,
} from "@/lib/mock/events";
import { EventCard } from "./event-card";

const PAGE_SIZE = 12; // 3 rows × 4 columns matching zipeventapp.com/event/allevent

const dateOptions = [
  { label: "Show all", value: "all" },
  { label: "Today", value: "today" },
  { label: "Tomorrow", value: "tomorrow" },
  { label: "This Week", value: "this_week" },
  { label: "This Month", value: "this_month" },
] as const;

const countryOptions = ["Thailand", "Vietnam"] as const;
const venueTypeOptions = ["Offline", "Online", "Hybrid"] as const;

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
  const [dateRange, setDateRange] = useState<string>("all");
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [selectedVenueTypes, setSelectedVenueTypes] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(() => {
    if (!initialCategory) return [];
    const matched = zipeventSidebarCategories.find(
      (c) =>
        c.label.toLowerCase() === initialCategory.toLowerCase() ||
        c.mappedCategories[0] === initialCategory.toLowerCase(),
    );
    return matched ? [matched.label] : [];
  });
  const [legacyCategoryParam, setLegacyCategoryParam] = useState<string>(() => {
    if (!initialCategory) return "";
    const isKnownSlug = eventCategories.some((c) => c.value === initialCategory.toLowerCase());
    return isKnownSlug ? initialCategory.toLowerCase() : "";
  });

  const [page, setPage] = useState(1);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Collapsible sidebar card states (all open by default like Zipevent)
  const [openSections, setOpenSections] = useState({
    date: true,
    country: true,
    venue: true,
    category: true,
  });

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  const toggleSection = (key: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleItem = (list: string[], value: string, setter: (next: string[]) => void) => {
    setter(list.includes(value) ? list.filter((item) => item !== value) : [...list, value]);
    setLegacyCategoryParam("");
    setPage(1);
  };

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (query.trim()) count++;
    if (dateRange !== "all") count++;
    count += selectedCountries.length;
    count += selectedVenueTypes.length;
    count += selectedCategories.length;
    if (legacyCategoryParam && selectedCategories.length === 0) count++;
    return count;
  }, [
    query,
    dateRange,
    selectedCountries,
    selectedVenueTypes,
    selectedCategories,
    legacyCategoryParam,
  ]);

  const clearAllFilters = () => {
    setQuery("");
    setDateRange("all");
    setSelectedCountries([]);
    setSelectedVenueTypes([]);
    setSelectedCategories([]);
    setLegacyCategoryParam("");
    setPage(1);
  };

  const filteredEvents = useMemo(() => {
    const q = query.trim().toLowerCase();
    // Reference date aligned with 2026 event schedule
    const refDate = new Date("2026-10-14T00:00:00Z");

    return events.filter((event) => {
      if (
        q &&
        !`${event.title} ${event.shortDescription} ${event.venue.name} ${event.venue.city} ${event.venue.country} ${event.organizer.name}`
          .toLowerCase()
          .includes(q)
      ) {
        return false;
      }

      // Country filter
      if (selectedCountries.length > 0) {
        const countryNorm =
          event.venue.country.toUpperCase() === "VN"
            ? "Vietnam"
            : event.venue.country.toUpperCase() === "TH"
              ? "Thailand"
              : event.venue.country;
        if (!selectedCountries.some((c) => c.toLowerCase() === countryNorm.toLowerCase())) {
          return false;
        }
      }

      // Venue Type filter
      if (selectedVenueTypes.length > 0) {
        const vType = event.venueType ?? (event.venue.isOnline ? "Online" : "Offline");
        if (!selectedVenueTypes.includes(vType)) {
          return false;
        }
      }

      // Category filter
      if (selectedCategories.length > 0) {
        const matchesZipLabel =
          event.zipeventCategory && selectedCategories.includes(event.zipeventCategory);
        const matchesMapped = selectedCategories.some((label) => {
          const def = zipeventSidebarCategories.find((item) => item.label === label);
          return def ? def.mappedCategories.includes(event.category) : false;
        });
        if (!matchesZipLabel && !matchesMapped) {
          return false;
        }
      } else if (legacyCategoryParam) {
        if (event.category !== legacyCategoryParam) return false;
      }

      // Date Range filter
      if (dateRange !== "all") {
        const start = new Date(event.startDate);
        const end = new Date(event.endDate);
        const dayMs = 86_400_000;
        const diffStart = (start.getTime() - refDate.getTime()) / dayMs;
        const isOngoing = start <= refDate && end >= refDate;

        if (dateRange === "today" && !(isOngoing || (diffStart >= 0 && diffStart <= 1.5))) {
          return false;
        }
        if (dateRange === "tomorrow" && !(isOngoing || (diffStart >= 0.5 && diffStart <= 2.5))) {
          return false;
        }
        if (dateRange === "this_week" && !(isOngoing || (diffStart >= 0 && diffStart <= 7))) {
          return false;
        }
        if (dateRange === "this_month" && !(isOngoing || (diffStart >= 0 && diffStart <= 31))) {
          return false;
        }
      }

      return true;
    });
  }, [
    events,
    query,
    selectedCountries,
    selectedVenueTypes,
    selectedCategories,
    legacyCategoryParam,
    dateRange,
  ]);

  const totalPages = Math.max(1, Math.ceil(filteredEvents.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pagedEvents = filteredEvents.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  const renderFilterCards = () => (
    <div className="space-y-3.5">
      {/* 1. Search Events Card */}
      <div className="rounded-xl border border-gray-200/90 bg-white p-4 shadow-[0_1px_6px_rgba(0,0,0,0.03)]">
        <label
          htmlFor="allevent-search-input"
          className="mb-2.5 block text-[13.5px] font-semibold text-[#2B212B]"
        >
          Search Events
        </label>
        <div className="relative flex items-center">
          <input
            id="allevent-search-input"
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Search events"
            className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-3.5 pr-9 text-[13px] font-normal text-[#2B212B] outline-none transition-colors placeholder:text-gray-400 focus:border-[#ef5360]"
          />
          {query ? (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setPage(1);
              }}
              aria-label="Clear search"
              className="absolute right-2.5 text-gray-400 hover:text-[#ef5360]"
            >
              <X size={16} />
            </button>
          ) : (
            <Search
              size={17}
              className="pointer-events-none absolute right-3 text-[#ef5360]"
              strokeWidth={2}
            />
          )}
        </div>
      </div>

      {/* 2. Select Date Card */}
      <div className="rounded-xl border border-gray-200/90 bg-white p-4 shadow-[0_1px_6px_rgba(0,0,0,0.03)]">
        <button
          type="button"
          onClick={() => toggleSection("date")}
          className="flex w-full items-center justify-between text-left"
        >
          <span className="text-[13.5px] font-semibold text-[#2B212B]">Select Date</span>
          {openSections.date ? (
            <ChevronUp size={16} className="text-gray-500" />
          ) : (
            <ChevronDown size={16} className="text-gray-500" />
          )}
        </button>

        {openSections.date && (
          <div className="mt-3.5 space-y-2.5">
            {dateOptions.map((option) => {
              const active = dateRange === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    setDateRange(option.value);
                    setPage(1);
                  }}
                  className="flex w-full items-center gap-3 py-0.5 text-left text-[13px] font-normal text-[#3A3A3A] transition-colors hover:text-[#ef5360]"
                >
                  <span
                    className={`grid h-[18px] w-[18px] shrink-0 place-items-center rounded-full border transition-all ${
                      active
                        ? "border-[#ef5360] bg-[#ef5360]"
                        : "border-gray-300 bg-white"
                    }`}
                  >
                    {active && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
                  </span>
                  <span className={active ? "font-medium text-[#2B212B]" : ""}>
                    {option.label}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* 3. Select Country Card */}
      <div className="rounded-xl border border-gray-200/90 bg-white p-4 shadow-[0_1px_6px_rgba(0,0,0,0.03)]">
        <button
          type="button"
          onClick={() => toggleSection("country")}
          className="flex w-full items-center justify-between text-left"
        >
          <span className="text-[13.5px] font-semibold text-[#2B212B]">Select Country</span>
          {openSections.country ? (
            <ChevronUp size={16} className="text-gray-500" />
          ) : (
            <ChevronDown size={16} className="text-gray-500" />
          )}
        </button>

        {openSections.country && (
          <div className="mt-3.5 space-y-2.5">
            {countryOptions.map((country) => {
              const checked = selectedCountries.includes(country);
              return (
                <button
                  key={country}
                  type="button"
                  onClick={() =>
                    toggleItem(selectedCountries, country, setSelectedCountries)
                  }
                  className="flex w-full items-center gap-3 py-0.5 text-left text-[13px] font-normal text-[#3A3A3A] transition-colors hover:text-[#ef5360]"
                >
                  <span
                    className={`grid h-[18px] w-[18px] shrink-0 place-items-center rounded-[5px] border transition-all ${
                      checked
                        ? "border-[#ef5360] bg-[#ef5360] text-white"
                        : "border-gray-300 bg-white"
                    }`}
                  >
                    {checked && <Check size={12} strokeWidth={3} />}
                  </span>
                  <span className={checked ? "font-medium text-[#2B212B]" : ""}>{country}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* 4. Venue Type Card */}
      <div className="rounded-xl border border-gray-200/90 bg-white p-4 shadow-[0_1px_6px_rgba(0,0,0,0.03)]">
        <button
          type="button"
          onClick={() => toggleSection("venue")}
          className="flex w-full items-center justify-between text-left"
        >
          <span className="text-[13.5px] font-semibold text-[#2B212B]">Venue Type</span>
          {openSections.venue ? (
            <ChevronUp size={16} className="text-gray-500" />
          ) : (
            <ChevronDown size={16} className="text-gray-500" />
          )}
        </button>

        {openSections.venue && (
          <div className="mt-3.5 space-y-2.5">
            {venueTypeOptions.map((vType) => {
              const checked = selectedVenueTypes.includes(vType);
              return (
                <button
                  key={vType}
                  type="button"
                  onClick={() =>
                    toggleItem(selectedVenueTypes, vType, setSelectedVenueTypes)
                  }
                  className="flex w-full items-center gap-3 py-0.5 text-left text-[13px] font-normal text-[#3A3A3A] transition-colors hover:text-[#ef5360]"
                >
                  <span
                    className={`grid h-[18px] w-[18px] shrink-0 place-items-center rounded-[5px] border transition-all ${
                      checked
                        ? "border-[#ef5360] bg-[#ef5360] text-white"
                        : "border-gray-300 bg-white"
                    }`}
                  >
                    {checked && <Check size={12} strokeWidth={3} />}
                  </span>
                  <span className={checked ? "font-medium text-[#2B212B]" : ""}>{vType}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* 5. Category Card with Authentic Zipevent Icons */}
      <div className="rounded-xl border border-gray-200/90 bg-white p-4 shadow-[0_1px_6px_rgba(0,0,0,0.03)]">
        <button
          type="button"
          onClick={() => toggleSection("category")}
          className="flex w-full items-center justify-between text-left"
        >
          <span className="text-[13.5px] font-semibold text-[#2B212B]">Category</span>
          {openSections.category ? (
            <ChevronUp size={16} className="text-gray-500" />
          ) : (
            <ChevronDown size={16} className="text-gray-500" />
          )}
        </button>

        {openSections.category && (
          <div className="mt-3.5 space-y-2.5">
            {zipeventSidebarCategories.map((cat) => {
              const checked = selectedCategories.includes(cat.label);
              return (
                <button
                  key={cat.label}
                  type="button"
                  onClick={() =>
                    toggleItem(selectedCategories, cat.label, setSelectedCategories)
                  }
                  className="flex w-full items-center gap-2.5 py-0.5 text-left text-[13px] font-normal text-[#3A3A3A] transition-colors hover:text-[#ef5360]"
                >
                  <span
                    className={`grid h-[18px] w-[18px] shrink-0 place-items-center rounded-[5px] border transition-all ${
                      checked
                        ? "border-[#ef5360] bg-[#ef5360] text-white"
                        : "border-gray-300 bg-white"
                    }`}
                  >
                    {checked && <Check size={12} strokeWidth={3} />}
                  </span>
                  <img
                    src={cat.iconUrl}
                    alt=""
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                    className="h-5 w-5 shrink-0 object-contain"
                  />
                  <span className={`truncate ${checked ? "font-medium text-[#2B212B]" : ""}`}>
                    {cat.label}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="ambient-page min-h-screen pb-20 pt-6 sm:pt-8">
      <div className="container">
        {/* Zipevent 2-Column All Events Layout */}
        <div className="grid items-start gap-6 lg:grid-cols-[276px_1fr] xl:gap-7">
          {/* Desktop Left Sidebar */}
          <aside className="hidden lg:block">{renderFilterCards()}</aside>

          {/* Right Main Content Column */}
          <div>
            {/* Heading Row aligned cleanly with top of sidebar */}
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <h1 className="text-[22px] sm:text-[25px] font-semibold tracking-tight text-[#333333]">
                  All Events
                </h1>
                {activeFilterCount > 0 && (
                  <button
                    type="button"
                    onClick={clearAllFilters}
                    className="inline-flex items-center gap-1 rounded-full bg-[#FFEFF0] px-3 py-1 text-xs font-medium text-[#ef5360] transition-colors hover:bg-[#ffd8dc]"
                  >
                    <RotateCcw size={12} />
                    <span>Clear filters ({activeFilterCount})</span>
                  </button>
                )}
              </div>

              {/* Mobile Filter Trigger Button */}
              <button
                type="button"
                onClick={() => setMobileFilterOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-xs font-medium text-[#2B212B] shadow-sm transition-colors hover:border-[#ef5360] hover:text-[#ef5360] lg:hidden"
              >
                <SlidersHorizontal size={15} className="text-[#ef5360]" />
                <span>Filters</span>
                {activeFilterCount > 0 && (
                  <span className="grid h-4 min-w-4 place-items-center rounded-full bg-[#ef5360] px-1 text-[10px] font-medium text-white">
                    {activeFilterCount}
                  </span>
                )}
              </button>
            </div>

            {/* 4-Column Portrait Event Card Grid */}
            {pagedEvents.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white px-6 py-16 text-center shadow-sm">
                <div className="grid h-14 w-14 place-items-center rounded-full bg-[#FFEFF0] text-[#ef5360]">
                  <Calendar size={26} />
                </div>
                <h2 className="mt-4 text-base font-semibold text-[#2B212B]">
                  No matching events found
                </h2>
                <p className="mt-1 max-w-sm text-xs font-normal text-gray-500">
                  Try clearing one of your sidebar filters or searching with a broader keyword.
                </p>
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-[#ef5360] px-6 py-2.5 text-xs font-medium text-white shadow-sm hover:bg-[#ec3746]"
                >
                  <RotateCcw size={13} />
                  <span>Show All Events</span>
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4 sm:gap-5">
                  {pagedEvents.map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>

                {/* Zipevent Rounded-Square Pagination */}
                {totalPages > 1 && (
                  <nav
                    aria-label="Pagination"
                    className="mt-10 flex flex-wrap items-center justify-center gap-1.5"
                  >
                    <button
                      type="button"
                      disabled={currentPage === 1}
                      onClick={() => {
                        setPage((p) => Math.max(1, p - 1));
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="h-9 rounded-md border border-gray-200 bg-white px-3.5 text-xs font-normal text-gray-600 transition-colors hover:border-[#ef5360] hover:text-[#ef5360] disabled:cursor-not-allowed disabled:opacity-45"
                    >
                      Prev
                    </button>

                    {Array.from({ length: totalPages }, (_, index) => index + 1).map((num) => {
                      const active = num === currentPage;
                      return (
                        <button
                          key={num}
                          type="button"
                          onClick={() => {
                            setPage(num);
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }}
                          className={`h-9 min-w-9 rounded-md px-3 text-xs font-medium transition-colors ${
                            active
                              ? "bg-[#ef5360] text-white shadow-sm"
                              : "border border-gray-200 bg-white text-gray-600 hover:border-[#ef5360] hover:text-[#ef5360]"
                          }`}
                        >
                          {num}
                        </button>
                      );
                    })}

                    <button
                      type="button"
                      disabled={currentPage === totalPages}
                      onClick={() => {
                        setPage((p) => Math.min(totalPages, p + 1));
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="h-9 rounded-md border border-gray-200 bg-white px-3.5 text-xs font-normal text-gray-600 transition-colors hover:border-[#ef5360] hover:text-[#ef5360] disabled:cursor-not-allowed disabled:opacity-45"
                    >
                      Next
                    </button>
                  </nav>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Slide-Over Filter Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-black/45 backdrop-blur-xs"
            onClick={() => setMobileFilterOpen(false)}
          />
          <div className="relative ml-auto flex h-full w-full max-w-xs flex-col bg-[#F7F8FA] shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3.5">
              <span className="text-sm font-semibold text-[#2B212B]">Filter Events</span>
              <button
                type="button"
                onClick={() => setMobileFilterOpen(false)}
                aria-label="Close filters"
                className="grid h-8 w-8 place-items-center rounded-full text-gray-500 hover:bg-gray-100"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-3.5">{renderFilterCards()}</div>

            <div className="flex items-center gap-2.5 border-t border-gray-200 bg-white p-3.5">
              <button
                type="button"
                onClick={clearAllFilters}
                className="flex-1 rounded-full border border-gray-200 py-2.5 text-xs font-medium text-gray-600 hover:bg-gray-50"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={() => setMobileFilterOpen(false)}
                className="flex-1 rounded-full bg-[#ef5360] py-2.5 text-xs font-medium text-white shadow-sm hover:bg-[#ec3746]"
              >
                Show ({filteredEvents.length})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
