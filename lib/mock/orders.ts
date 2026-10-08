import { mockEvents } from "@/lib/mock/events";
import { mockUsers } from "@/lib/mock/users";

export interface MockOrder { id: string; eventSlug: string; eventTitle: string; date: string; amount: number; paymentStatus: "Paid" | "Pending" | "Refunded"; status: "Confirmed" | "Pending" | "Cancelled"; userId: string; quantity: number }

export const mockOrders: MockOrder[] = Array.from({ length: 24 }, (_, index) => {
  const event = mockEvents[index % mockEvents.length];
  const ticket = event.ticketTypes[0];
  return { id: `ZF-${String(20261000 + index).padStart(8, "0")}`, eventSlug: event.slug, eventTitle: event.title, date: new Date(Date.UTC(2026, 8, (index % 27) + 1)).toISOString(), amount: ticket.price * ((index % 3) + 1), paymentStatus: index % 13 === 0 ? "Pending" : index % 17 === 0 ? "Refunded" : "Paid", status: index % 15 === 0 ? "Cancelled" : index % 13 === 0 ? "Pending" : "Confirmed", userId: mockUsers[index % mockUsers.length].id, quantity: (index % 3) + 1 };
});
