import { OrganizerView } from "@/components/organizer/organizer-view";

export default async function EventAttendeesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <OrganizerView section="attendees" eventSlug={id} />;
}
