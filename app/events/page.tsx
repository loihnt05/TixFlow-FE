import { EventDiscovery } from "@/components/events/event-discovery";
import { getDiscoveryEvents } from "@/lib/mock-api/events";

interface EventsPageProps {
  searchParams: Promise<{
    q?: string;
    category?: string;
    city?: string;
    sort?: string;
  }>;
}

export default async function EventsPage({ searchParams }: EventsPageProps) {
  const [params, events] = await Promise.all([searchParams, getDiscoveryEvents()]);

  return (
    <main>
      <EventDiscovery
        events={events}
        initialQuery={params?.q || ""}
        initialCategory={params?.category || ""}
      />
    </main>
  );
}
