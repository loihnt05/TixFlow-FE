import { notFound } from "next/navigation";
import { CheckoutView } from "@/components/checkout/checkout-view";
import { getEventBySlug } from "@/lib/mock-api/events";

export default async function CheckoutPage({ searchParams }: PageProps<"/checkout">) {
  const params = await searchParams;
  if (typeof params.event !== "string") notFound();
  const event = await getEventBySlug(params.event);
  if (!event) notFound();
  const ticket = typeof params.ticket === "string" ? params.ticket : event.ticketTypes[0].id;
  const quantity = typeof params.quantity === "string" ? Number.parseInt(params.quantity, 10) : 1;
  return <CheckoutView event={event} ticketId={ticket} quantity={Number.isFinite(quantity) ? quantity : 1} />;
}
