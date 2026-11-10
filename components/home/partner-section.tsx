"use client";

import { useMemo } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import type { Event, Organizer } from "@/lib/mock/events";

interface PartnerPreset {
  slug: string;
  name: string;
  categoryLabel: string;
  avatar: string;
  verified: boolean;
  defaultEventCount: number;
  defaultFollowerCount: number;
  searchQuery: string;
}

interface MinimalPartner extends Organizer {
  categoryLabel: string;
  searchQuery: string;
}

const DEFAULT_PARTNERS: PartnerPreset[] = [
  {
    slug: "tixflow-live",
    name: "TixFlow Live",
    categoryLabel: "Concerts & Live Shows",
    avatar:
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=240&q=80",
    verified: true,
    defaultEventCount: 18,
    defaultFollowerCount: 48500,
    searchQuery: "TixFlow Live",
  },
  {
    slug: "techvn",
    name: "TechVN Community",
    categoryLabel: "Technology & AI",
    avatar:
      "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=240&q=80",
    verified: true,
    defaultEventCount: 27,
    defaultFollowerCount: 34200,
    searchQuery: "TechVN",
  },
  {
    slug: "startup-vietnam",
    name: "Startup Vietnam Network",
    categoryLabel: "Business & Startup",
    avatar:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=240&q=80",
    verified: true,
    defaultEventCount: 21,
    defaultFollowerCount: 29400,
    searchQuery: "Startup Vietnam",
  },
  {
    slug: "music-connect",
    name: "Music Connect Asia",
    categoryLabel: "Indie & Festivals",
    avatar:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=240&q=80",
    verified: true,
    defaultEventCount: 15,
    defaultFollowerCount: 42800,
    searchQuery: "Music Connect",
  },
  {
    slug: "design-hub-vn",
    name: "Design & Creative Hub VN",
    categoryLabel: "Design & Education",
    avatar:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=240&q=80",
    verified: true,
    defaultEventCount: 19,
    defaultFollowerCount: 19600,
    searchQuery: "Design",
  },
  {
    slug: "saigon-artisan-culture",
    name: "Saigon Artisan & Culture",
    categoryLabel: "Food & Culture",
    avatar:
      "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=240&q=80",
    verified: true,
    defaultEventCount: 14,
    defaultFollowerCount: 24100,
    searchQuery: "Coffee",
  },
];

function formatCompactCount(value: number): string {
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1).replace(/\.0$/, "")}K`;
  }
  return String(value);
}

export function PartnerSection({ events }: { events: Event[] }) {
  const partners = useMemo<MinimalPartner[]>(() => {
    const eventsBySlug = new Map<string, Event[]>();
    for (const ev of events) {
      const slug = (ev.organizer.slug || ev.organizer.name).trim().toLowerCase();
      const list = eventsBySlug.get(slug) ?? [];
      list.push(ev);
      eventsBySlug.set(slug, list);
    }

    const result: MinimalPartner[] = DEFAULT_PARTNERS.map((preset) => {
      const matchedEvents = eventsBySlug.get(preset.slug) ?? [];
      const backendOrg = matchedEvents[0]?.organizer;
      const hasDedicatedOrg =
        backendOrg && backendOrg.slug.toLowerCase() === preset.slug;

      return {
        id: hasDedicatedOrg ? backendOrg.id : `partner-${preset.slug}`,
        slug: preset.slug,
        name: hasDedicatedOrg ? backendOrg.name : preset.name,
        description: hasDedicatedOrg ? backendOrg.description : preset.categoryLabel,
        avatar: (hasDedicatedOrg && backendOrg.avatar) || preset.avatar,
        website: hasDedicatedOrg ? (backendOrg.website ?? null) : null,
        socialLinks: hasDedicatedOrg ? backendOrg.socialLinks : {},
        verified:
          hasDedicatedOrg && backendOrg.verified ? true : preset.verified,
        eventCount: Math.max(
          hasDedicatedOrg ? backendOrg.eventCount : 0,
          preset.defaultEventCount,
          matchedEvents.length
        ),
        followerCount:
          hasDedicatedOrg && backendOrg.followerCount > 0
            ? backendOrg.followerCount
            : preset.defaultFollowerCount,
        categoryLabel: preset.categoryLabel,
        searchQuery:
          hasDedicatedOrg && matchedEvents.length < events.length
            ? backendOrg.name
            : preset.searchQuery,
      };
    });

    const presetSlugs = new Set(DEFAULT_PARTNERS.map((p) => p.slug));
    for (const [slug, orgEvents] of eventsBySlug.entries()) {
      if (presetSlugs.has(slug)) continue;
      const org = orgEvents[0].organizer;
      result.push({
        ...org,
        avatar:
          org.avatar ||
          "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=240&q=80",
        verified: org.verified || true,
        eventCount: Math.max(org.eventCount || 0, orgEvents.length),
        followerCount: org.followerCount || 5200,
        categoryLabel: orgEvents[0].category || "Official Organizer",
        searchQuery: org.name,
      });
    }

    return result.slice(0, 6);
  }, [events]);

  return (
    <section className="container py-10 sm:py-14">
      <div className="mb-6 flex flex-col justify-between gap-2 sm:mb-8 sm:flex-row sm:items-end">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-[#2B212B] sm:text-2xl md:text-[26px]">
            Partner Organizers
          </h2>
          <p className="mt-1 text-xs font-normal text-[#6B7280] sm:text-sm">
            Follow trusted event creators and discover their latest experiences
          </p>
        </div>

        <Link
          href="/events"
          className="group inline-flex items-center gap-1.5 text-xs font-semibold text-[#ef5360] hover:text-[#d83a48] sm:text-sm"
        >
          <span>View All</span>
          <ArrowRight
            size={15}
            className="transition-transform duration-200 group-hover:translate-x-0.5"
          />
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6">
        {partners.map((partner) => (
          <Link
            key={partner.id}
            href={`/events?q=${encodeURIComponent(partner.searchQuery)}`}
            className="group flex flex-col items-center rounded-2xl border border-gray-200/75 bg-white p-4 text-center shadow-2xs transition-all duration-200 hover:-translate-y-0.5 hover:border-[#ef5360]/30 hover:shadow-md"
          >
            {/* Avatar + Verified Badge */}
            <div className="relative mb-3">
              <div className="h-16 w-16 overflow-hidden rounded-full border-2 border-gray-100 bg-gray-50 transition-transform duration-200 group-hover:scale-105 sm:h-[72px] sm:w-[72px]">
                <img
                  src={
                    partner.avatar ||
                    "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=240&q=80"
                  }
                  alt={partner.name}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
              {partner.verified && (
                <span
                  title="Verified Organizer"
                  className="absolute -right-0.5 -bottom-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-white shadow-2xs"
                >
                  <CheckCircle2
                    size={15}
                    className="fill-[#ef5360] text-white"
                  />
                </span>
              )}
            </div>

            {/* Name */}
            <h3 className="line-clamp-1 w-full text-xs font-semibold text-[#2B212B] transition-colors group-hover:text-[#ef5360] sm:text-[13.5px]">
              {partner.name}
            </h3>

            {/* Category Subtitle */}
            <p className="mt-0.5 line-clamp-1 w-full text-[11px] text-gray-400">
              {partner.categoryLabel}
            </p>

            {/* Stats */}
            <p className="mt-1.5 text-[11px] font-medium text-gray-500">
              {partner.eventCount} Events · {formatCompactCount(partner.followerCount)}
            </p>

            {/* Minimal Pill */}
            <span className="mt-3 w-full rounded-full bg-[#F7F8FA] py-1.5 text-[11.5px] font-medium text-gray-600 transition-colors group-hover:bg-[#ef5360] group-hover:text-white">
              View Events
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
