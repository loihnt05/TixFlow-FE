import type { Metadata } from "next";
import { ArticlesListView } from "@/components/articles/articles-list-view";

export const metadata: Metadata = {
  title: "Articles & Event Insights — TixFlow",
  description: "Read curated festival guides, exhibition roundups, and practical ticketing playbooks for event organizers.",
};

interface ArticlesPageProps {
  searchParams: Promise<{
    tab?: string;
    category?: string;
    q?: string;
  }>;
}

export default async function ArticlesPage({ searchParams }: ArticlesPageProps) {
  const params = await searchParams;

  return (
    <main>
      <ArticlesListView
        initialTab={params?.tab}
        initialCategory={params?.category}
        initialQuery={params?.q}
      />
    </main>
  );
}
