import { mockEvents } from "@/lib/mock/events";
import { mockUsers } from "@/lib/mock/users";

export interface MockAttendee { id: string; name: string; email: string; ticket: string; order: string; status: "Confirmed" | "Pending"; checkedIn: boolean; eventSlug: string }

export const mockAttendees: MockAttendee[] = Array.from({ length: 120 }, (_, index) => {
  const user = mockUsers[index % mockUsers.length];
  const event = mockEvents[index % mockEvents.length];
  return { id: `att-${String(index + 1).padStart(3, "0")}`, name: user.name, email: `guest${index + 1}@example.com`, ticket: index % 5 === 0 ? "VIP" : "General Admission", order: `ZF-${String(20261000 + index).padStart(8, "0")}`, status: index % 14 === 0 ? "Pending" : "Confirmed", checkedIn: index % 4 === 0, eventSlug: event.slug };
});
