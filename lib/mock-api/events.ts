import { apiBaseUrl } from "@/lib/public-config";
import { toPublicEvent, type PublicEventDto, type PublicEventPageDto } from "@/lib/catalog";
import {
  mockEvents,
  type Event,
  type EventCategory,
  type EventFilters,
  type EventTheme,
  type PaginatedEvents,
} from "@/lib/mock/events";

const SLUG_ALIASES: Record<string, string> = {
  "the-secret-sauce-summit-2026": "the-secret-sauce-summit-2026-the-age-of-builders",
  "jambox-asia-pillars-music-connection-09": "jamboxxmusicconnection-09",
  "police-in-love-official-showcase": "police-in-love-md",
  "sala-saneha-naza": "naza-documentary-screening",
};

function defaultCategoryTheme(category: EventCategory): EventTheme {
  switch (category) {
    case "technology":
      return {
        mode: "dark",
        pageBgColor: "#0B1120",
        primaryColor: "#EE3B00",
        primaryHover: "#D43300",
        buttonTextColor: "#FFFFFF",
        softBgColor: "#FFF1EC",
        phaseHeaderStyle: "brand",
      };
    case "art":
      return {
        mode: "light",
        pageBgColor: "#EBF8FF",
        primaryColor: "#0284C7",
        primaryHover: "#0369A1",
        buttonTextColor: "#FFFFFF",
        softBgColor: "#E0F2FE",
        phaseHeaderStyle: "brand",
      };
    case "food":
      return {
        mode: "light",
        pageBgColor: "#FBF7F2",
        primaryColor: "#C2410C",
        primaryHover: "#9A3412",
        buttonTextColor: "#FFFFFF",
        softBgColor: "#FFEDD5",
        phaseHeaderStyle: "brand",
      };
    case "education":
    case "workshop":
      return {
        mode: "light",
        pageBgColor: "#F0F9FF",
        primaryColor: "#0284C7",
        primaryHover: "#0369A1",
        buttonTextColor: "#FFFFFF",
        softBgColor: "#E0F2FE",
        phaseHeaderStyle: "outline",
      };
    default:
      return {
        mode: "light",
        pageBgColor: "#F6F6F6",
        primaryColor: "#EF5360",
        primaryHover: "#EC3746",
        buttonTextColor: "#FFFFFF",
        softBgColor: "#FFEFF0",
        phaseHeaderStyle: "dark",
      };
  }
}

async function publicApi<T>(path: string): Promise<T> {
  const baseUrl = apiBaseUrl();
  if (!baseUrl) throw new BackendUnavailableError("NEXT_PUBLIC_API_URL is not configured.");
  let response: Response;
  try {
    response = await fetch(`${baseUrl}${path}`, {
      headers: { Accept: "application/json" },
      cache: "no-store",
      signal: AbortSignal.timeout(4000),
    });
  } catch (cause) {
    throw new BackendUnavailableError(cause instanceof Error ? cause.message : "Backend unreachable");
  }
  if (!response.ok) {
    if (response.status === 404) throw new EventNotFoundError();
    throw new Error(`Failed to load event list (${response.status}).`);
  }
  return response.json() as Promise<T>;
}

function normalizeCountryLabel(codeOrName: string): string {
  const v = codeOrName.trim().toUpperCase();
  if (v === "VN" || v === "VIETNAM" || v === "VIET NAM") return "Vietnam";
  if (v === "TH" || v === "THAILAND") return "Thailand";
  return codeOrName;
}

function enrichBackendEvent(
  backendEvent: Event,
  seedMatch?: Event,
  hasBackendImage = true,
): Event {
  const firstPhaseId = seedMatch?.ticketPhases?.[0]?.id;
  const enrichedLiveTickets = backendEvent.ticketTypes.map((ticket, index) => {
    const seedTicket = seedMatch?.ticketTypes[index] ?? seedMatch?.ticketTypes[0];
    return {
      ...ticket,
      phaseId: ticket.phaseId ?? firstPhaseId,
      saleEndLabel: ticket.saleEndLabel ?? seedTicket?.saleEndLabel ?? "Limited Offer",
      benefits:
        ticket.benefits.length > 0
          ? ticket.benefits
          : seedTicket?.benefits ?? ["Instant QR e-Ticket", "Official entry access"],
      addons:
        ticket.addons ??
        (ticket.price === 0 ? seedTicket?.addons : undefined),
    };
  });

  const previewUpcomingTickets =
    seedMatch?.ticketPhases && seedMatch.ticketTypes.some((t) => t.status === "not_started")
      ? seedMatch.ticketTypes
          .filter((t) => t.status === "not_started")
          .map((t) => ({
            ...t,
            currency: backendEvent.currency ?? t.currency,
          }))
      : [];

  const liveTicketIds = new Set(enrichedLiveTickets.map((t) => t.id));
  const compatibleSeedZones =
    seedMatch?.zones && seedMatch.zones.every((z) => liveTicketIds.has(z.ticketTypeId))
      ? seedMatch.zones
      : undefined;

  return {
    ...backendEvent,
    coverImage: hasBackendImage
      ? backendEvent.coverImage
      : seedMatch?.coverImage ?? backendEvent.coverImage,
    thumbnailImage: hasBackendImage
      ? backendEvent.thumbnailImage
      : seedMatch?.thumbnailImage ?? backendEvent.thumbnailImage,
    organizer: {
      ...backendEvent.organizer,
      avatar: backendEvent.organizer.avatar ?? seedMatch?.organizer.avatar ?? null,
      verified: backendEvent.organizer.verified || Boolean(seedMatch?.organizer.verified ?? true),
    },
    venue: {
      ...backendEvent.venue,
      country: normalizeCountryLabel(backendEvent.venue.country),
    },
    tags:
      seedMatch?.tags && seedMatch.tags.length > backendEvent.tags.length
        ? seedMatch.tags
        : backendEvent.tags,
    venueType: seedMatch?.venueType ?? (backendEvent.venue.isOnline ? "Online" : "Offline"),
    zipeventCategory: seedMatch?.zipeventCategory ?? backendEvent.zipeventCategory,
    dateRangeLabel: seedMatch?.dateRangeLabel ?? backendEvent.dateRangeLabel,
    fallbackImage: seedMatch?.fallbackImage ?? backendEvent.coverImage,
    ticketingMode: backendEvent.ticketingMode ?? seedMatch?.ticketingMode,
    registrationStyle: seedMatch?.registrationStyle ?? backendEvent.registrationStyle,
    requirePromoToUnlock: seedMatch?.requirePromoToUnlock ?? backendEvent.requirePromoToUnlock,
    roundBookingType: backendEvent.roundBookingType ?? seedMatch?.roundBookingType,
    defaultSelectedTicketId: backendEvent.defaultSelectedTicketId,
    showcaseBadge: seedMatch?.showcaseBadge ?? backendEvent.showcaseBadge,
    theme: seedMatch?.theme ?? backendEvent.theme ?? defaultCategoryTheme(backendEvent.category),
    currency: backendEvent.currency ?? seedMatch?.currency,
    vatRate: seedMatch?.vatRate ?? backendEvent.vatRate ?? (backendEvent.ticketingMode === "tiered" ? 0.08 : undefined),
    vatIncluded: seedMatch?.vatIncluded ?? backendEvent.vatIncluded ?? true,
    enablePromoCode: seedMatch?.enablePromoCode ?? backendEvent.enablePromoCode,
    promoCodes: seedMatch?.promoCodes ?? backendEvent.promoCodes ?? [
      { code: "TIXFLOW10", discountType: "percent", amount: 10, label: "10% Member Discount" },
    ],
    ticketPhases: seedMatch?.ticketPhases ?? backendEvent.ticketPhases,
    ticketTypes: [...enrichedLiveTickets, ...previewUpcomingTickets],
    rounds: backendEvent.rounds ?? seedMatch?.rounds,
    zones: backendEvent.zones ?? compatibleSeedZones,
    zoneMapImage: seedMatch?.zoneMapImage ?? backendEvent.zoneMapImage,
    resaleEnabled: seedMatch?.resaleEnabled ?? backendEvent.resaleEnabled,
    resaleListings: seedMatch?.resaleListings ?? backendEvent.resaleListings,
    infoBanners: seedMatch?.infoBanners ?? backendEvent.infoBanners,
    admissionPolicy: seedMatch?.admissionPolicy ?? backendEvent.admissionPolicy ?? {
      bullets: [
        "Present your QR e-Ticket on mobile or printed pass at the venue check-in gate.",
        "Doors open 45 minutes prior to the scheduled start time.",
      ],
      updatedAt: "Oct 2026",
    },
  };
}

function filterAndPaginate(list: Event[], filters: EventFilters): PaginatedEvents {
  let filtered = [...list];

  if (filters.query) {
    const q = filters.query.trim().toLowerCase();
    filtered = filtered.filter((event) =>
      `${event.title} ${event.shortDescription} ${event.venue.name} ${event.venue.city} ${event.organizer.name}`
        .toLowerCase()
        .includes(q),
    );
  }

  if (filters.category) {
    filtered = filtered.filter((event) => event.category === filters.category);
  }

  if (filters.city) {
    const c = filters.city.trim().toLowerCase();
    filtered = filtered.filter(
      (event) =>
        event.venue.city.toLowerCase().includes(c) ||
        event.venue.country.toLowerCase().includes(c),
    );
  }

  if (filters.status) {
    filtered = filtered.filter((event) => event.status === filters.status);
  }

  if (filters.sortBy === "date_asc") {
    filtered.sort((a, b) => a.startDate.localeCompare(b.startDate));
  } else if (filters.sortBy === "date_desc") {
    filtered.sort((a, b) => b.startDate.localeCompare(a.startDate));
  } else if (filters.sortBy === "popularity") {
    filtered.sort((a, b) => b.viewCount - a.viewCount);
  } else if (filters.sortBy === "price_asc") {
    filtered.sort(
      (a, b) =>
        Math.min(...a.ticketTypes.map((t) => t.price)) -
        Math.min(...b.ticketTypes.map((t) => t.price)),
    );
  } else if (filters.sortBy === "price_desc") {
    filtered.sort(
      (a, b) =>
        Math.min(...b.ticketTypes.map((t) => t.price)) -
        Math.min(...a.ticketTypes.map((t) => t.price)),
    );
  }

  const page = Math.max(1, filters.page ?? 1);
  const limit = Math.max(1, filters.limit ?? 12);
  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const events = filtered.slice((page - 1) * limit, page * limit);

  return { events, total, page, limit, totalPages };
}

async function loadCombinedCatalog(): Promise<Event[]> {
  const seedBySlug = new Map(mockEvents.map((event) => [event.slug.toLowerCase(), event]));
  let backendEvents: Event[] = [];

  try {
    const result = await publicApi<PublicEventPageDto>("/api/v1/events?page=1&limit=100");
    if (result && Array.isArray(result.events)) {
      backendEvents = result.events.map((dto) => {
        const mapped = toPublicEvent(dto);
        return enrichBackendEvent(
          mapped,
          seedBySlug.get(mapped.slug.toLowerCase()),
          Boolean(dto.imageUrl),
        );
      });
    }
  } catch (cause) {
    if (!(cause instanceof BackendUnavailableError)) {
      // Fall back cleanly to seeded showcase events if backend API is down or older
      backendEvents = [];
    }
  }

  const backendBySlug = new Map(backendEvents.map((event) => [event.slug.toLowerCase(), event]));

  // Keep curated Zipevent showcase ordering first (replacing matching slugs with live backend records for real checkout),
  // followed by any additional organizer-published events from the backend database.
  const combined: Event[] = mockEvents.map((seed) => backendBySlug.get(seed.slug.toLowerCase()) ?? seed);
  const seenSlugs = new Set(mockEvents.map((seed) => seed.slug.toLowerCase()));

  for (const backendEvent of backendEvents) {
    if (!seenSlugs.has(backendEvent.slug.toLowerCase())) {
      combined.push(backendEvent);
      seenSlugs.add(backendEvent.slug.toLowerCase());
    }
  }

  return combined;
}

export async function getEvents(filters: EventFilters = {}): Promise<PaginatedEvents> {
  const catalog = await loadCombinedCatalog();
  return filterAndPaginate(catalog, filters);
}

export async function getEventBySlug(slug: string): Promise<Event | undefined> {
  const rawLower = slug.trim().toLowerCase();
  const normalized = SLUG_ALIASES[rawLower] ?? rawLower;
  const seedMatch = mockEvents.find((event) => event.slug.toLowerCase() === normalized);
  try {
    const backendDto = await publicApi<PublicEventDto>(`/api/v1/events/${encodeURIComponent(slug)}`);
    return enrichBackendEvent(
      toPublicEvent(backendDto),
      seedMatch,
      Boolean(backendDto.imageUrl),
    );
  } catch (cause) {
    if (cause instanceof EventNotFoundError || cause instanceof BackendUnavailableError) {
      return seedMatch;
    }
    return seedMatch;
  }
}

export async function getFeaturedEvents(): Promise<Event[]> {
  const catalog = await loadCombinedCatalog();
  // Prioritize flagship Zipevent format showcases + wide hero banners
  const heroSlugs = [
    "economicforum2026",
    "beyond-journeys-end-exhibition",
    "work-life-festival-2026",
    "police-in-love-final-episode",
    "kjw-wonederland-bkk",
    "the-secret-sauce-summit-2026-the-age-of-builders",
    "jamboxxmusicconnection-09",
    "creator-affiliate-commerce-fest-2026",
  ];
  const bySlug = new Map(catalog.map((e) => [e.slug.toLowerCase(), e]));
  const curated = heroSlugs.map((s) => bySlug.get(s)).filter((e): e is Event => Boolean(e));
  return curated.length > 0 ? curated : catalog.slice(0, 8);
}

export async function getPopularEvents(): Promise<Event[]> {
  const catalog = await loadCombinedCatalog();
  return catalog.slice(0, 10);
}

export async function getRelatedEvents(event: Event, limit = 5): Promise<Event[]> {
  const catalog = await loadCombinedCatalog();
  const sameCategory = catalog.filter(
    (candidate) => candidate.slug !== event.slug && candidate.category === event.category,
  );
  if (sameCategory.length >= limit) return sameCategory.slice(0, limit);
  const others = catalog.filter(
    (candidate) => candidate.slug !== event.slug && candidate.category !== event.category,
  );
  return [...sameCategory, ...others].slice(0, limit);
}

export async function getEventsByCategory(category: EventCategory, limit = 8): Promise<Event[]> {
  return (await getEvents({ category, limit })).events;
}

class EventNotFoundError extends Error {}
class BackendUnavailableError extends Error {}
