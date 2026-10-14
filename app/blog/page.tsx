import type { Metadata } from "next";
import { ArticlesListView } from "@/components/articles/articles-list-view";

export const metadata: Metadata = {
  title: "Blog & Event Insights — TixFlow",
  description: "Read curated festival guides, exhibition roundups, and practical ticketing playbooks for event organizers.",
};

interface BlogPageProps {
  searchParams: Promise<{
    tab?: string;
    category?: string;
    q?: string;
  }>;
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
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
