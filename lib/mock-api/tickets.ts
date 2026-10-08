import { mockTickets } from "@/lib/mock/tickets";
export async function getMyTickets(userId = "user-001") { return mockTickets.filter((ticket) => ticket.ownerId === userId); }
export async function getTicketById(id: string) { return mockTickets.find((ticket) => ticket.id === id); }
