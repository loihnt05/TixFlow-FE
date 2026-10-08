import { EventDiscovery } from "@/components/events/event-discovery";
import { getEvents } from "@/lib/mock-api/events";

export default async function EventsPage({ searchParams }: PageProps<"/events">) {
  const [params, result] = await Promise.all([searchParams, getEvents({ limit: 100 })]);
  return <main className="page-shell"><EventDiscovery events={result.events} initialQuery={typeof params.q === "string" ? params.q : ""} initialCategory={typeof params.category === "string" ? params.category : ""} /></main>;
}
