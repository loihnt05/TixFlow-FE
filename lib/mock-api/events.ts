import { apiBaseUrl } from "@/lib/public-config";
import { toPublicEvent, type PublicEventDto, type PublicEventPageDto } from "@/lib/catalog";
import type { Event, EventCategory, EventFilters, PaginatedEvents } from "@/lib/mock/events";

async function publicApi<T>(path: string): Promise<T> {
  const baseUrl = apiBaseUrl();
  if (!baseUrl) throw new Error("Chưa cấu hình NEXT_PUBLIC_API_URL.");
  const response = await fetch(`${baseUrl}${path}`, {
    headers: { Accept: "application/json" },
    cache: "no-store",
  });
  if (!response.ok) {
    if (response.status === 404) throw new EventNotFoundError();
    throw new Error(`Không thể tải danh sách sự kiện (${response.status}).`);
  }
  return response.json() as Promise<T>;
}

export async function getEvents(filters: EventFilters = {}): Promise<PaginatedEvents> {
  const params = new URLSearchParams();
  if (filters.query) params.set("q", filters.query);
  if (filters.category) params.set("category", filters.category);
  if (filters.city) params.set("location", filters.city);
  if (filters.dateFrom) params.set("dateFrom", filters.dateFrom);
  if (filters.dateTo) params.set("dateTo", filters.dateTo);
  if (filters.status) params.set("status", filters.status);
  if (filters.sortBy) params.set("sortBy", filters.sortBy);
  params.set("page", String(filters.page ?? 1));
  params.set("limit", String(filters.limit ?? 12));

  const result = await publicApi<PublicEventPageDto>(`/api/v1/events?${params}`);
  return { ...result, events: result.events.map(toPublicEvent) };
}

export async function getEventBySlug(slug: string): Promise<Event | undefined> {
  try {
    return toPublicEvent(await publicApi<PublicEventDto>(`/api/v1/events/${encodeURIComponent(slug)}`));
  } catch (cause) {
    if (cause instanceof EventNotFoundError) return undefined;
    throw cause;
  }
}

export async function getFeaturedEvents(): Promise<Event[]> {
  return (await getEvents({ limit: 8, sortBy: "date_asc" })).events;
}

export async function getPopularEvents(): Promise<Event[]> {
  return (await getEvents({ limit: 8, sortBy: "newest" })).events;
}

export async function getRelatedEvents(event: Event, limit = 4): Promise<Event[]> {
  const result = await getEvents({ category: event.category, limit: Math.min(limit + 1, 100) });
  return result.events.filter((candidate) => candidate.id !== event.id).slice(0, limit);
}

export async function getEventsByCategory(category: EventCategory, limit = 8): Promise<Event[]> {
  return (await getEvents({ category, limit })).events;
}

class EventNotFoundError extends Error {}
