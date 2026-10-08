import { mockOrganizers } from "@/lib/mock/organizers";
import { mockEvents, type Event } from "@/lib/mock/events";
export async function getOrganizerEvents(): Promise<Event[]> {
  if (typeof window === "undefined") return mockEvents;
  const saved = JSON.parse(localStorage.getItem("zipevent-organizer-events") ?? "[]") as Event[];
  const savedById = new Map(saved.map((event) => [event.id, event]));
  return [...mockEvents.map((event) => savedById.get(event.id) ?? event), ...saved.filter((event) => !mockEvents.some((fixture) => fixture.id === event.id))];
}
export async function getOrganizerProfile() { return mockOrganizers[0]; }
