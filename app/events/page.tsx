import { EventDiscovery } from "@/components/events/event-discovery";
import { getEvents } from "@/lib/mock-api/events";

interface EventsPageProps {
  searchParams: Promise<{
    q?: string;
    category?: string;
    city?: string;
    sort?: string;
  }>;
}

export default async function EventsPage({ searchParams }: EventsPageProps) {
  const [params, result] = await Promise.all([searchParams, getEvents({ limit: 100 })]);

  return (
    <main>
      <EventDiscovery
        events={result.events}
        initialQuery={params?.q || ""}
        initialCategory={params?.category || ""}
      />
    </main>
  );
}
