import { notFound } from "next/navigation";
import { EventDetailView } from "@/components/events/event-detail-view";
import { getEventBySlug, getRelatedEvents } from "@/lib/mock-api/events";

interface ZipeventAliasPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ZipeventAliasPage({ params }: ZipeventAliasPageProps) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  if (!event) notFound();
  const related = await getRelatedEvents(event, 5);
  return <EventDetailView event={event} related={related} />;
}
