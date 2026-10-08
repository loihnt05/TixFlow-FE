import { Suspense } from "react";
import { SuccessView } from "@/components/checkout/success-view";
import { getEventBySlug } from "@/lib/mock-api/events";

export default async function CheckoutSuccessPage({ searchParams }: PageProps<"/checkout/success">) {
  const params = await searchParams;
  const event = typeof params.event === "string" ? await getEventBySlug(params.event) : undefined;
  return <Suspense fallback={<main className="container py-20 text-center">Loading your ticket…</main>}><SuccessView event={event} /></Suspense>;
}
