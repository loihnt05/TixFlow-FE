export interface TicketDto {
  id: string;
  ticketCode: string;
  orderId: string;
  ownerId: string;
  eventSlug: string;
  eventTitle: string;
  eventDate: string;
  eventEndsAtUtc: string;
  venue: string;
  ticketType: string;
  status: "Issued" | "Used" | "Cancelled" | "Refunded";
  checkedInAtUtc: string | null;
  seatLabel: string | null;
}

export interface TicketQrDto { qrToken: string; qrImageDataUrl: string }

export type AccountTicket = Omit<TicketDto, "status"> & {
  status: "upcoming" | "past" | "cancelled";
  checkedIn: boolean;
};

export function mapTicket(ticket: TicketDto): AccountTicket {
  return {
    ...ticket,
    status: ticket.status === "Cancelled" || ticket.status === "Refunded" ? "cancelled"
      : Date.parse(ticket.eventEndsAtUtc) < Date.now() ? "past" : "upcoming",
    checkedIn: ticket.status === "Used",
  };
}
