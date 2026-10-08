import { mockEvents, type Event, type EventCategory, type EventFilters, type PaginatedEvents } from "@/lib/mock/events";

export async function getEvents(filters: EventFilters = {}): Promise<PaginatedEvents> {
  const query = filters.query?.trim().toLocaleLowerCase();
  let events = mockEvents.filter((event) => {
    if (event.status !== "published" && event.status !== "sold_out") return false;
    if (query && !`${event.title} ${event.shortDescription} ${event.venue.city} ${event.organizer.name}`.toLocaleLowerCase().includes(query)) return false;
    if (filters.category && event.category !== filters.category) return false;
    if (filters.city && event.venue.city !== filters.city) return false;
    if (filters.dateFrom && event.startDate < filters.dateFrom) return false;
    if (filters.dateTo && event.startDate.slice(0, 10) > filters.dateTo) return false;
    const price = Math.min(...event.ticketTypes.map((ticket) => ticket.price));
    if (filters.priceMin !== undefined && price < filters.priceMin) return false;
    if (filters.priceMax !== undefined && price > filters.priceMax) return false;
    return true;
  });

  switch (filters.sortBy) {
    case "date_desc": events = [...events].sort((a, b) => b.startDate.localeCompare(a.startDate)); break;
    case "price_asc": events = [...events].sort((a, b) => minPrice(a) - minPrice(b)); break;
    case "price_desc": events = [...events].sort((a, b) => minPrice(b) - minPrice(a)); break;
    case "popularity": events = [...events].sort((a, b) => b.viewCount - a.viewCount); break;
    case "newest": events = [...events].sort((a, b) => b.createdAt.localeCompare(a.createdAt)); break;
    default: events = [...events].sort((a, b) => a.startDate.localeCompare(b.startDate));
  }

  const page = Math.max(1, filters.page ?? 1);
  const limit = Math.max(1, filters.limit ?? 12);
  const total = events.length;
  return { events: events.slice((page - 1) * limit, page * limit), total, page, limit, totalPages: Math.max(1, Math.ceil(total / limit)) };
}

const minPrice = (event: Event) => Math.min(...event.ticketTypes.map((ticket) => ticket.price));

export async function getEventBySlug(slug: string): Promise<Event | undefined> {
  return mockEvents.find((event) => event.slug === slug);
}

export async function getFeaturedEvents(): Promise<Event[]> {
  return mockEvents.filter((event) => event.featured).slice(0, 8);
}

export async function getPopularEvents(): Promise<Event[]> {
  return [...mockEvents].sort((a, b) => b.viewCount - a.viewCount).slice(0, 8);
}

export async function getRelatedEvents(event: Event, limit = 4): Promise<Event[]> {
  return mockEvents.filter((candidate) => candidate.id !== event.id && candidate.category === event.category).slice(0, limit);
}

export async function getEventsByCategory(category: EventCategory, limit = 8): Promise<Event[]> {
  return mockEvents.filter((event) => event.category === category).slice(0, limit);
}
