import { notFound } from "next/navigation";
import { EventDetailView } from "@/components/events/event-detail-view";
import { getEventBySlug, getRelatedEvents } from "@/lib/mock-api/events";

interface EventPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function EventPage({ params }: EventPageProps) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  if (!event) notFound();
  const related = await getRelatedEvents(event);
  return <EventDetailView event={event} related={related} />;
}
