import type { Event } from "@/lib/mock/events";
import { EventCard } from "./event-card";

export function EventGrid({ events, compact = false }: { events: Event[]; compact?: boolean }) {
  return <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">{events.map((event) => <EventCard key={event.id} event={event} compact={compact} />)}</div>;
}
