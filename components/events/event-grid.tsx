import type { Event } from "@/lib/mock/events";
import { EventCard } from "./event-card";

export function EventGrid({
  events,
  compact = false,
  showButton = true,
}: {
  events: Event[];
  compact?: boolean;
  showButton?: boolean;
}) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-4">
      {events.map((event) => (
        <EventCard key={event.id} event={event} compact={compact} showButton={showButton} />
      ))}
    </div>
  );
}
