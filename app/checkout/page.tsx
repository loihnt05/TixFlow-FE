import { notFound } from "next/navigation";
import { CheckoutView } from "@/components/checkout/checkout-view";
import { getEventBySlug } from "@/lib/mock-api/events";
import { apiBaseUrl } from "@/lib/public-config";

interface CheckoutPageProps {
  searchParams: Promise<{
    event?: string;
    ticket?: string;
    quantity?: string;
    sessionId?: string;
    seats?: string;
  }>;
}

export default async function CheckoutPage({ searchParams }: CheckoutPageProps) {
  const params = await searchParams;
  if (typeof params?.event !== "string") notFound();
  const event = await getEventBySlug(params.event);
  if (!event) notFound();
  const ticket = typeof params.ticket === "string" ? params.ticket : event.ticketTypes[0]?.id;
  const quantity = typeof params.quantity === "string" ? Number.parseInt(params.quantity, 10) : 1;
  let sessionId = params.sessionId;
  let ticketId = ticket;
  let inventoryMode: "GeneralAdmission" | "ReservedSeating" = "GeneralAdmission";
  const seatIds = typeof params.seats === "string" ? params.seats.split(",").filter(Boolean) : [];
  const baseUrl = apiBaseUrl();
  if (baseUrl) {
    try {
      const response = await fetch(`${baseUrl}/api/v1/events/${encodeURIComponent(event.slug)}`, { cache: "no-store" });
      if (response.ok) {
        const backend = await response.json() as {
          sessions?: Array<{ id: string; ticketTypes?: Array<{ id: string; name: string; inventoryMode: string }> }>;
        };
        const session = backend.sessions?.[0];
        const backendTicket = session?.ticketTypes?.find((item) => item.id === ticket)
          ?? session?.ticketTypes?.find((item) => item.name.toLowerCase() === event.ticketTypes.find((candidate) => candidate.id === ticket)?.name.toLowerCase())
          ?? session?.ticketTypes?.[0];
        sessionId ??= session?.id;
        ticketId = backendTicket?.id ?? ticket;
        inventoryMode = backendTicket?.inventoryMode === "ReservedSeating" ? "ReservedSeating" : "GeneralAdmission";
      }
    } catch {
      // Keep the page usable; submit will explain that a backend session is required.
    }
  }
  const selectedTicket = event.ticketTypes.find((t) => t.id === ticket) ?? event.ticketTypes[0];
  if (!selectedTicket) notFound();

  return (
    <CheckoutView
      event={event}
      ticket={selectedTicket}
      ticketId={ticketId}
      quantity={Number.isFinite(quantity) ? quantity : 1}
      sessionId={sessionId}
      inventoryMode={inventoryMode}
      seatIds={seatIds}
    />
  );
}
