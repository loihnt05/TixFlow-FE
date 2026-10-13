import { EventForm } from "@/components/organizer/event-form";
export default async function EditEventPage({ params }: PageProps<"/organizer/events/[id]/edit">) {
  const { id } = await params;
  return <main className="page-shell container max-w-4xl py-8"><EventForm eventId={id} /></main>;
}
