import { notFound } from "next/navigation";
import { OrganizerView } from "@/components/organizer/organizer-view";

const sections = ["events", "orders", "attendees", "analytics", "settings"];
export default async function OrganizerSectionPage({ params }: PageProps<"/organizer/[section]">) {
  const { section } = await params;
  if (!sections.includes(section)) notFound();
  return <OrganizerView section={section} />;
}
