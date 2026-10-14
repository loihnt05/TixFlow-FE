import { Suspense } from "react";
import { SuccessView } from "@/components/checkout/success-view";
import { getEventBySlug } from "@/lib/mock-api/events";

interface SuccessPageProps {
  searchParams: Promise<{
    event?: string;
    orderId?: string;
  }>;
}

export default async function CheckoutSuccessPage({ searchParams }: SuccessPageProps) {
  const params = await searchParams;
  const event = typeof params?.event === "string" ? await getEventBySlug(params.event) : undefined;
  return (
    <Suspense fallback={<main className="container py-20 text-center">Loading your ticket details…</main>}>
      <SuccessView event={event} orderId={params.orderId} />
    </Suspense>
  );
}
