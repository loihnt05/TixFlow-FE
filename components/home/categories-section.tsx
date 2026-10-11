"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronUp, ArrowRight, Compass } from "lucide-react";
import type { EventCategory } from "@/lib/mock/events";

interface CategoryTile {
  name: string;
  nameEn: string;
  value: EventCategory;
  image: string;
  eventCount: number;
}

const categoryTiles: CategoryTile[] = [
  {
    name: "Music",
    nameEn: "Concerts & Live Shows",
    value: "music",
    image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80",
    eventCount: 42,
  },
  {
    name: "Fashion",
    nameEn: "Style & Runway",
    value: "art",
    image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=600&q=80",
    eventCount: 18,
  },
  {
    name: "Nightlife",
    nameEn: "Parties & Clubs",
    value: "entertainment",
    image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=600&q=80",
    eventCount: 27,
  },
  {
    name: "Business",
    nameEn: "Conference & Expo",
    value: "business",
    image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=600&q=80",
    eventCount: 35,
  },
  {
    name: "Technology",
    nameEn: "AI, Web3 & Tech",
    value: "technology",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
    eventCount: 29,
  },
  {
    name: "Sports",
    nameEn: "Fitness & Marathon",
    value: "entertainment",
    image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=600&q=80",
    eventCount: 22,
  },
  {
    name: "Food & Drink",
    nameEn: "Culinary & Coffee",
    value: "food",
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80",
    eventCount: 31,
  },
  {
    name: "Art & Design",
    nameEn: "Exhibitions & Galleries",
    value: "art",
    image: "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?auto=format&fit=crop&w=600&q=80",
    eventCount: 26,
  },
  {
    name: "Education",
    nameEn: "Seminars & Talks",
    value: "education",
    image: "https://images.unsplash.com/photo-1524178871053-8a632f6f5a7b?auto=format&fit=crop&w=600&q=80",
    eventCount: 19,
  },
  {
    name: "Workshop",
    nameEn: "Hands-on & Craft",
    value: "workshop",
    image: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=600&q=80",
    eventCount: 24,
  },
  {
    name: "Health & Beauty",
    nameEn: "Wellness & Care",
    value: "health",
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=600&q=80",
    eventCount: 15,
  },
  {
    name: "Community",
    nameEn: "Social & Gatherings",
    value: "community",
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=600&q=80",
    eventCount: 21,
  },
  {
    name: "Shopping & Fairs",
    nameEn: "Pop-up & Markets",
    value: "business",
    image: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=600&q=80",
    eventCount: 17,
  },
  {
    name: "Travel & Adventure",
    nameEn: "Trips & Outdoors",
    value: "community",
    image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=600&q=80",
    eventCount: 14,
  },
  {
    name: "Gaming & Esports",
    nameEn: "Tournaments & Comic",
    value: "entertainment",
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80",
    eventCount: 12,
  },
  {
    name: "Networking",
    nameEn: "Meetups & Career",
    value: "networking",
    image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=600&q=80",
    eventCount: 16,
  },
  {
    name: "Festival",
    nameEn: "Cultural & Celebrations",
    value: "entertainment",
    image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=600&q=80",
    eventCount: 20,
  },
  {
    name: "Photography",
    nameEn: "Photowalk & Visuals",
    value: "art",
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=600&q=80",
    eventCount: 11,
  },
];

export function CategoriesSection() {
  const [expanded, setExpanded] = useState(false);

  // Show 12 initially (2 rows of 6 on desktop), or all 18 when expanded
  const visibleCategories = expanded ? categoryTiles : categoryTiles.slice(0, 12);

  return (
    <section className="container py-12 sm:py-16">
      {/* Section Header */}
      <div className="mb-6 flex flex-col justify-between gap-4 sm:mb-8 sm:flex-row sm:items-end">
        <div>
          <div className="mb-1.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#ef5360]">
            <Compass size={14} />
            <span>Explore More Events</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-[#2B212B] sm:text-2xl md:text-[26px]">
            หมวดหมู่อีเวนต์ยอดนิยม
          </h2>
          <p className="mt-1 text-xs text-[#8E8E8E] sm:text-sm">
            เลือกสำรวจอีเวนต์ตามประเภทที่คุณสนใจ มีให้เลือกหลากหลายกว่า 18 หมวดหมู่
          </p>
        </div>

        <Link
          href="/events"
          className="group inline-flex items-center gap-1.5 text-xs font-semibold text-[#ef5360] transition-colors hover:text-[#ec3746] sm:text-sm"
        >
          <span>ดูอีเวนต์ทั้งหมด</span>
          <ArrowRight
            size={16}
            className="transition-transform duration-200 group-hover:translate-x-1"
          />
        </Link>
      </div>

      {/* Uniform Category Tile Grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-6">
        {visibleCategories.map((cat, idx) => (
          <Link
            key={`${cat.name}-${idx}`}
            href={`/events?category=${cat.value}`}
            className="category-card group relative block aspect-[16/11] w-full overflow-hidden rounded-xl sm:rounded-2xl bg-gray-900 shadow-2xs transition-all duration-300 hover:-translate-y-1 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#ef5360]"
          >
            {/* Category Image with Object Fit Cover and Subtle Hover Zoom */}
            <img
              src={cat.image}
              alt={cat.name}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-105"
            />

            {/* Dark Gradient Overlay: strongest at bottom, fading upwards */}
            <div
              className="pointer-events-none absolute inset-0 transition-opacity duration-300 group-hover:opacity-90"
              style={{
                background:
                  "linear-gradient(to top, rgba(0, 0, 0, 0.72) 0%, rgba(0, 0, 0, 0.22) 55%, transparent 100%)",
              }}
            />

            {/* Subtle Hover Darkening Layer */}
            <div className="pointer-events-none absolute inset-0 bg-black/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

            {/* Category Name positioned at Bottom-Left */}
            <div className="absolute bottom-3 left-3 sm:bottom-3.5 sm:left-3.5 z-10 flex flex-col pr-2">
              <span className="text-sm sm:text-[15px] font-semibold text-white drop-shadow-sm transition-colors group-hover:text-[#ffeaec]">
                {cat.name}
              </span>
              <span className="text-[10px] sm:text-[11px] font-normal text-white/70">
                {cat.eventCount} อีเวนต์
              </span>
            </div>
          </Link>
        ))}
      </div>

      {/* Expand / Collapse Button */}
      {categoryTiles.length > 12 && (
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-6 py-2.5 text-xs font-semibold text-gray-700 shadow-2xs transition-all duration-200 hover:border-[#ef5360] hover:text-[#ef5360] hover:shadow-sm active:scale-95 sm:text-sm"
          >
            {expanded ? (
              <>
                <span>ย่อหมวดหมู่</span>
                <ChevronUp size={16} />
              </>
            ) : (
              <>
                <span>ดูหมวดหมู่ทั้งหมด ({categoryTiles.length})</span>
                <ChevronDown size={16} />
              </>
            )}
          </button>
        </div>
      )}
    </section>
  );
}
