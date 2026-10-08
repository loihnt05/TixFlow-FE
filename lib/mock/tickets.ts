import { mockEvents } from "@/lib/mock/events";
import { mockUsers } from "@/lib/mock/users";

export interface MockTicket { id: string; eventSlug: string; eventTitle: string; eventDate: string; venue: string; ticketType: string; orderId: string; ownerId: string; status: "upcoming" | "past" | "cancelled"; checkedIn: boolean }

export const mockTickets: MockTicket[] = Array.from({ length: 60 }, (_, index) => {
  const event = mockEvents[index % mockEvents.length];
  const orderId = `ZF-${String(2026000 + index).padStart(7, "0")}`;
  return { id: `tk-${String(index + 1).padStart(3, "0")}`, eventSlug: event.slug, eventTitle: event.title, eventDate: event.startDate, venue: event.venue.name, ticketType: index % 5 === 0 ? "VIP" : "General Admission", orderId, ownerId: mockUsers[index % mockUsers.length].id, status: index % 11 === 0 ? "past" : index % 19 === 0 ? "cancelled" : "upcoming", checkedIn: index % 7 === 0 };
});
