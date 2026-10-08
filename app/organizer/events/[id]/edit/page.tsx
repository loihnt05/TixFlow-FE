import { notFound } from "next/navigation";
import { EventForm } from "@/components/organizer/event-form";
import { getOrganizerEvents } from "@/lib/mock-api/organizers";
export default async function EditEventPage({ params }: PageProps<"/organizer/events/[id]/edit">) {
  const { id } = await params;
  const events = await getOrganizerEvents();
  const event = events.find((item) => item.id === id || item.slug === id);
  if (!event) notFound();
  return <main className="page-shell container max-w-4xl py-8"><EventForm event={event} /></main>;
}
