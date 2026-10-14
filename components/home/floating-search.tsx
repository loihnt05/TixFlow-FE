"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search, X, Clock, ArrowRight } from "lucide-react";
import type { Event } from "@/lib/mock/events";
import { eventCategories } from "@/lib/mock/events";

export function FloatingSearch({ events = [] }: { events?: Event[] }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const [recentSearches, setRecentSearches] = useState<string[]>([
    "Concert",
    "Tech Summit",
    "Art Exhibition",
    "Workshop",
  ]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (keyword?: string) => {
    const term = (keyword ?? query).trim();
    if (!term) return;

    if (!recentSearches.includes(term)) {
      setRecentSearches((prev) => [term, ...prev.slice(0, 4)]);
    }
    setIsOpen(false);
    router.push(`/events?q=${encodeURIComponent(term)}`);
  };

  const filteredEvents = query.trim()
    ? events
        .filter((e) =>
          `${e.title} ${e.category} ${e.venue.name} ${e.venue.city}`
            .toLowerCase()
            .includes(query.toLowerCase())
        )
        .slice(0, 5)
    : [];

  return (
    <div ref={containerRef} className="home-search-container w-full px-4 pt-6 pb-2">
      <div className="home-search-bar relative">
        <Search size={20} className="text-[#ef5360] shrink-0 mr-3" />
        <input
          type="text"
          value={query}
          onFocus={() => setIsOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleSearchSubmit();
            }
          }}
          placeholder="Search events, concerts, exhibitions, and venues..."
          aria-label="Search events"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            className="p-1 rounded-full text-gray-400 hover:text-gray-600 mr-2"
          >
            <X size={16} />
          </button>
        )}
        <button
          type="button"
          onClick={() => handleSearchSubmit()}
          className="h-8 px-4 rounded-full bg-[#ef5360] hover:bg-[#ec3746] text-white text-xs font-bold transition-all shadow-sm shrink-0"
        >
          Search
        </button>
      </div>

      {/* Expandable Dropdown */}
      {isOpen && (
        <div className="search-dropdown">
          {/* Live Event Results if query typed */}
          {query.trim().length > 0 && (
            <div className="p-3 border-b border-gray-100">
              <div className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">
                Matching Events ({filteredEvents.length})
              </div>
              {filteredEvents.length > 0 ? (
                <div className="space-y-1.5">
                  {filteredEvents.map((event) => (
                    <Link
                      key={event.id}
                      href={`/events/${event.slug}`}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors group"
                    >
                      <img
                        src={event.thumbnailImage}
                        alt=""
                        className="h-10 w-14 rounded object-cover shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold text-gray-800 truncate group-hover:text-[#ef5360]">
                          {event.title}
                        </div>
                        <div className="text-[11px] text-gray-400 truncate">
                          {event.venue.name} · {event.startDate.slice(0, 10)}
                        </div>
                      </div>
                      <ArrowRight size={14} className="text-gray-300 group-hover:text-[#ef5360] shrink-0" />
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="py-3 text-center text-xs text-gray-400">
                  No matching events found for &quot;{query}&quot;
                </div>
              )}
            </div>
          )}

          {/* Recent Searches */}
          <div className="p-3 border-b border-gray-100">
            <div className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider flex items-center gap-1.5">
              <Clock size={13} className="text-[#ef5360]" />
              <span>Recent Searches</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {recentSearches.map((term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => {
                    setQuery(term);
                    handleSearchSubmit(term);
                  }}
                  className="px-2.5 py-1 rounded-full bg-gray-100 hover:bg-[#FFEFF0] hover:text-[#ef5360] text-xs text-gray-600 transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>

          {/* Categories Grid list */}
          <div className="p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Popular Categories
              </span>
              <Link
                href="/events"
                onClick={() => setIsOpen(false)}
                className="text-xs font-bold text-[#ef5360] hover:underline"
              >
                View all
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 max-h-48 overflow-y-auto">
              {eventCategories.slice(0, 12).map((cat) => (
                <Link
                  key={`${cat.value}-${cat.label}`}
                  href={`/events?category=${cat.value}`}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs text-gray-700 hover:bg-[#FFEFF0] hover:text-[#ef5360] transition-colors"
                >
                  <span className="text-sm shrink-0">{cat.icon}</span>
                  <span className="truncate">{cat.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
