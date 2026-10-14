"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  Search,
  Calendar,
  Clock,
  ArrowRight,
  BookOpen,
  Filter,
  Layers,
} from "lucide-react";
import { BlogTopBar } from "./blog-top-bar";
import { BlogNavHeader } from "./blog-nav-header";
import { MainSlider } from "./main-slider";
import { EditorsPicksSection } from "./editors-picks-section";
import { CommonSlider } from "./common-slider";
import { ClassicSlider } from "./classic-slider";
import {
  getArticles,
  getFeaturedArticles,
  getTrendingArticles,
  getOrganizerArticles,
  formatArticleDate,
  type Article,
  type ArticleTab,
} from "@/lib/mock/articles";

interface ArticlesListViewProps {
  initialTab?: string;
  initialCategory?: string;
  initialQuery?: string;
}

export function ArticlesListView({
  initialTab,
  initialCategory,
  initialQuery = "",
}: ArticlesListViewProps) {
  const allArticles = useMemo(() => getArticles(), []);
  const featuredArticles = useMemo(() => getFeaturedArticles(5), []);
  const editorsPicks = useMemo(() => allArticles.slice(0, 8), [allArticles]);
  const trendingArticles = useMemo(() => getTrendingArticles(8), []);
  const organizerArticles = useMemo(() => getOrganizerArticles(6), []);

  const [selectedTab, setSelectedTab] = useState<"all" | ArticleTab>(
    initialTab === "organizer" || initialTab === "latest" ? initialTab : "all"
  );
  const [selectedCategory, setSelectedCategory] = useState<string>(
    initialCategory || "all"
  );
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  const categories = useMemo(() => {
    const set = new Set<string>();
    allArticles.forEach((a) => set.add(a.category));
    return ["all", ...Array.from(set)];
  }, [allArticles]);

  const filteredArticles = useMemo(() => {
    return allArticles.filter((article) => {
      if (selectedTab !== "all" && article.tab !== selectedTab) return false;
      if (
        selectedCategory !== "all" &&
        article.category.toLowerCase() !== selectedCategory.toLowerCase()
      ) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = article.title.toLowerCase().includes(q);
        const matchesExcerpt = article.excerpt.toLowerCase().includes(q);
        const matchesAuthor = article.author.name.toLowerCase().includes(q);
        const matchesTag = article.tags.some((t) => t.toLowerCase().includes(q));
        if (!matchesTitle && !matchesExcerpt && !matchesAuthor && !matchesTag)
          return false;
      }
      return true;
    });
  }, [allArticles, selectedTab, selectedCategory, searchQuery]);

  const handleOpenSearch = () => {
    const el = document.getElementById("search-input-area");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 300);
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#2B212B] pb-24">
      {/* 1. TOP BAR: 'TRENDING NOW' Badge & Social Icons */}
      <BlogTopBar hotArticles={featuredArticles} />

      {/* 2. MAIN HEADER (Sticky Navigation): Logo, Menus with Dropdown & Search Icon */}
      <BlogNavHeader
        categories={categories}
        onSelectCategory={(cat) => setSelectedCategory(cat)}
        onOpenSearch={handleOpenSearch}
      />

      {/* 3. HERO SECTION: Center-Mode Wide Banner Slider with Peeking Edge Banners */}
      <section className="bg-gradient-to-b from-[#FFFDFD] via-white to-[#FDFCFD] pt-4 pb-8 sm:pt-6 sm:pb-12">
        <MainSlider articles={featuredArticles} />
      </section>

      {/* 4. SECTION 'EDITORS' PICKS': CSS Grid (3-4 cols on Desktop, 1 on Mobile), 16:9 Cards & Hover Zoom */}
      <EditorsPicksSection
        articles={editorsPicks}
        onViewAll={() => {
          setSelectedTab("all");
          setSelectedCategory("all");
          setSearchQuery("");
        }}
      />

      {/* 5. COMMON-SLIDER: Multi-card Trending Carousel */}
      <div className="border-t border-gray-100 bg-[#FAF9FB]/50">
        <CommonSlider
          articles={trendingArticles}
          title="Trending Highlights &amp; Culture"
          subtitle="Top festivals, exhibitions, culinary stories, and weekend guides"
        />
      </div>

      {/* 6. CLASSIC-SLIDER: Classic Editorial Playbooks */}
      <div id="playbooks">
        <ClassicSlider
          articles={organizerArticles}
          title="Organizer Playbooks &amp; Masterclasses"
          subtitle="Field-tested strategies for ticketing, check-in operations, marketing, and scaling live events"
        />
      </div>

      {/* 7. ALL ARTICLES SEARCH & DIRECTORY */}
      <section
        id="all-stories"
        className="container mt-12 sm:mt-16 pt-10 border-t border-gray-200/80"
      >
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#ef5360] mb-1.5">
            <Layers size={14} />
            <span>Complete Archive</span>
          </div>
          <h2 className="text-2xl font-black tracking-tight text-[#2B212B] sm:text-3xl">
            Explore All Stories &amp; Guides
          </h2>
          <p className="mt-1 text-xs text-gray-500 sm:text-sm">
            Search our comprehensive event catalog by keywords, category, or audience
          </p>

          {/* Search Bar */}
          <div id="search-input-area" className="mt-6 max-w-xl">
            <div className="relative flex items-center rounded-2xl border border-gray-200 bg-white shadow-xs focus-within:border-[#ef5360] focus-within:ring-2 focus-within:ring-[#ef5360]/20">
              <Search size={18} className="ml-4 text-gray-400 shrink-0" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search articles by title, keyword, or author..."
                className="w-full bg-transparent px-3.5 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="mr-3 text-xs font-semibold text-gray-400 hover:text-gray-700"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Tabs & Category Filters */}
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 pt-2">
            <div className="flex items-center gap-1.5 rounded-full bg-white p-1 border border-gray-200 shadow-2xs">
              <button
                type="button"
                onClick={() => setSelectedTab("all")}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all duration-200 ${
                  selectedTab === "all"
                    ? "bg-[#ef5360] text-white shadow-xs"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                All Stories ({allArticles.length})
              </button>
              <button
                type="button"
                onClick={() => setSelectedTab("latest")}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all duration-200 ${
                  selectedTab === "latest"
                    ? "bg-[#ef5360] text-white shadow-xs"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Latest Guides
              </button>
              <button
                type="button"
                onClick={() => setSelectedTab("organizer")}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all duration-200 ${
                  selectedTab === "organizer"
                    ? "bg-[#ef5360] text-white shadow-xs"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Organizer Playbooks
              </button>
            </div>

            {/* Category pills */}
            <div className="flex flex-wrap items-center gap-1.5">
              <Filter size={13} className="text-gray-400 mr-1" />
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                    selectedCategory === cat
                      ? "bg-[#2B212B] text-white"
                      : "bg-white text-gray-600 border border-gray-200 hover:border-gray-300"
                  }`}
                >
                  {cat === "all" ? "All Categories" : cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Filtered Articles Grid */}
        {filteredArticles.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center">
            <BookOpen size={36} className="mx-auto text-gray-300" />
            <h3 className="mt-4 text-base font-bold text-gray-800">
              No articles match your search
            </h3>
            <p className="mt-1 text-xs text-gray-500">
              Try adjusting your keywords, switching tabs, or resetting filters.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setSelectedTab("all");
                setSelectedCategory("all");
              }}
              className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-[#ef5360] px-5 py-2 text-xs font-bold text-white hover:bg-[#ec3746]"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {filteredArticles.map((article) => (
              <ArticleGridCard key={article.id} article={article} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function ArticleGridCard({ article }: { article: Article }) {
  return (
    <Link
      href={`/articles/${article.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-2xs transition-all duration-300 hover:-translate-y-1 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#ef5360]"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-gray-100">
        <img
          src={article.coverImage}
          alt={article.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-105"
        />
        <div className="absolute left-3 top-3 rounded-full bg-[#ef5360] px-2.5 py-0.5 text-[11px] font-semibold text-white shadow-xs">
          {article.category}
        </div>
      </div>

      <div className="flex flex-1 flex-col justify-between p-4 sm:p-5">
        <div>
          <div className="flex items-center gap-2 text-[11px] text-[#8E8E8E] mb-2">
            <span className="flex items-center gap-1">
              <Calendar size={12} className="text-[#ef5360]" />
              <span>{formatArticleDate(article.publishedAt)}</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock size={12} className="text-[#ef5360]" />
              <span>{article.readMinutes} min read</span>
            </span>
          </div>

          <h3 className="line-clamp-2 text-sm sm:text-base font-bold text-[#2B212B] transition-colors group-hover:text-[#ef5360]">
            {article.title}
          </h3>

          <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-gray-500">
            {article.excerpt}
          </p>
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
          <div className="flex items-center gap-2 truncate pr-2">
            <img
              src={article.author.avatar}
              alt={article.author.name}
              className="h-5 w-5 rounded-full object-cover ring-1 ring-gray-200"
            />
            <span className="truncate text-xs font-medium text-gray-700">
              {article.author.name}
            </span>
          </div>

          <span className="inline-flex items-center gap-1 text-xs font-bold text-[#ef5360] group-hover:translate-x-1 transition-transform">
            <span>Read</span>
            <ArrowRight size={13} />
          </span>
        </div>
      </div>
    </Link>
  );
}
