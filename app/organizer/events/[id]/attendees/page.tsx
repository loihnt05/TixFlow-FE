import { notFound } from "next/navigation";
import { OrganizerView } from "@/components/organizer/organizer-view";
import { getOrganizerEvents } from "@/lib/mock-api/organizers";
export default async function EventAttendeesPage({ params }: PageProps<"/organizer/events/[id]/attendees">) {
  const { id } = await params;
  const events = await getOrganizerEvents();
  const event = events.find((item) => item.id === id || item.slug === id);
  if (!event) notFound();
  return <OrganizerView section="attendees" eventSlug={event.slug} />;
}
