import { apiBaseUrl } from "@/lib/public-config";
import { toPublicEvent, type PublicEventDto, type PublicEventPageDto } from "@/lib/catalog";
import {
  type Event,
  type EventCategory,
  type EventFilters,
  type PaginatedEvents,
} from "@/lib/mock/events";

const SLUG_ALIASES: Record<string, string> = {
  "the-secret-sauce-summit-2026": "the-secret-sauce-summit-2026-the-age-of-builders",
  "jambox-asia-pillars-music-connection-09": "jamboxxmusicconnection-09",
  "police-in-love-official-showcase": "police-in-love-md",
  "sala-saneha-naza": "naza-documentary-screening",
};

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
  const baseUrl = apiBaseUrl();
  if (!baseUrl) throw new BackendUnavailableError("NEXT_PUBLIC_API_URL is not configured.");

  const result = await publicApi<PublicEventPageDto>("/api/v1/events?page=1&limit=100");
  if (!result || !Array.isArray(result.events)) {
    return [];
  }

  return result.events.map(toPublicEvent);
}

export async function getEvents(filters: EventFilters = {}): Promise<PaginatedEvents> {
  const catalog = await loadCombinedCatalog();
  return filterAndPaginate(catalog, filters);
}

export async function getEventBySlug(slug: string): Promise<Event | undefined> {
  const rawLower = slug.trim().toLowerCase();
  const normalized = SLUG_ALIASES[rawLower] ?? rawLower;
  const baseUrl = apiBaseUrl();
  if (!baseUrl) throw new BackendUnavailableError("NEXT_PUBLIC_API_URL is not configured.");

  try {
    const backendDto = await publicApi<PublicEventDto>(`/api/v1/events/${encodeURIComponent(normalized)}`);
    return toPublicEvent(backendDto);
  } catch (cause) {
    if (cause instanceof EventNotFoundError) {
      return undefined;
    }
    // Network failures, timeouts, and server errors must bubble up to route error boundary
    throw cause;
  }
}

export async function getFeaturedEvents(): Promise<Event[]> {
  const catalog = await loadCombinedCatalog();
  return catalog.slice(0, 8);
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
