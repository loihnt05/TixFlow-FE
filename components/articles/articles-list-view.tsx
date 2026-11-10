"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  Search,
  X,
  Heart,
  Mail,
  ChevronRight,
  RotateCcw,
  Megaphone,
  QrCode,
  Ticket,
  BarChart3,
  Plus,
} from "lucide-react";
import { BlogTopBar } from "./blog-top-bar";
import { BlogNavHeader } from "./blog-nav-header";
import { MainSlider } from "./main-slider";
import { EditorsPicksSection } from "./editors-picks-section";
import { BlogFooter } from "./blog-footer";
import {
  getArticles,
  getFeaturedArticles,
  getArticlesByEditorialSection,
  blogSidebarCategories,
  formatArticleDate,
  type Article,
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
  const heroArticles = useMemo(() => getFeaturedArticles(5), []);
  const editorsPicks = useMemo(
    () => getArticlesByEditorialSection("Editors' Picks", 5),
    [],
  );
  const whatsOnArticles = useMemo(
    () => getArticlesByEditorialSection("What's On", 3),
    [],
  );
  const videoArticles = useMemo(
    () => getArticlesByEditorialSection("Videos", 3),
    [],
  );
  const artEntArticles = useMemo(
    () => getArticlesByEditorialSection("Art & Entertainment", 3),
    [],
  );
  const itGadgetArticles = useMemo(
    () => getArticlesByEditorialSection("IT & Gadget", 3),
    [],
  );
  const eventNewsArticles = useMemo(
    () => getArticlesByEditorialSection("Event News", 3),
    [],
  );
  const foodTravelArticles = useMemo(
    () => getArticlesByEditorialSection("Food & Travel", 3),
    [],
  );
  const guidelineArticles = useMemo(
    () => getArticlesByEditorialSection("Event Guidelines", 4),
    [],
  );
  const healthBeautyArticles = useMemo(
    () => getArticlesByEditorialSection("Health & Beauty", 3),
    [],
  );
  const lifestyleArticles = useMemo(
    () => getArticlesByEditorialSection("Lifestyles", 3),
    [],
  );

  const [selectedCategory, setSelectedCategory] = useState<string>(() => {
    if (initialCategory) return initialCategory;
    if (initialTab === "organizer") return "Event Guidelines";
    return "all";
  });
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [searchOpen, setSearchOpen] = useState(Boolean(initialQuery));
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const filterAnchorRef = useRef<HTMLDivElement | null>(null);

  const isFiltered =
    selectedCategory !== "all" || searchQuery.trim().length > 0;

  const filteredArticles = useMemo(() => {
    return allArticles.filter((article) => {
      if (selectedCategory !== "all") {
        const target = selectedCategory.toLowerCase();
        const catMatch = article.category.toLowerCase() === target;
        const secMatch = article.editorialSection?.toLowerCase() === target;
        const organizerMatch =
          target === "event guidelines" && article.tab === "organizer";
        if (!catMatch && !secMatch && !organizerMatch) {
          return false;
        }
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const text = `${article.title} ${article.excerpt} ${article.author.name} ${article.category} ${article.tags.join(" ")}`.toLowerCase();
        if (!text.includes(q)) return false;
      }
      return true;
    });
  }, [allArticles, selectedCategory, searchQuery]);

  const selectCategoryAndScroll = (category: string) => {
    setSelectedCategory(category);
    setTimeout(() => {
      filterAnchorRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 60);
  };

  const toggleSearchDrawer = () => {
    setSearchOpen((prev) => {
      const next = !prev;
      if (next) {
        setTimeout(() => searchInputRef.current?.focus(), 80);
      }
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-white text-[#191919]">
      {/* 1. Slim Black 'TRENDING NOW' Ticker Bar */}
      <BlogTopBar hotArticles={heroArticles} />

      {/* 2. White Centered Editorial Navigation Bar */}
      <BlogNavHeader
        categories={["all", ...blogSidebarCategories]}
        editorsPickPreviews={editorsPicks}
        onSelectCategory={selectCategoryAndScroll}
        onOpenSearch={toggleSearchDrawer}
      />

      {/* Optional Slide-Down Search Bar */}
      {searchOpen && (
        <div className="border-b border-gray-100 bg-[#FAF9FB] py-3.5">
          <div className="container max-w-[1160px] flex items-center gap-3">
            <Search size={17} className="text-[#ef5360] shrink-0" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Type keywords to search stories, guides, or authors..."
              className="flex-1 bg-transparent text-sm font-normal text-[#191919] placeholder:text-gray-400 outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="text-xs font-medium text-gray-400 hover:text-gray-700"
              >
                Clear
              </button>
            )}
            <button
              type="button"
              onClick={() => setSearchOpen(false)}
              aria-label="Close search"
              className="grid h-7 w-7 place-items-center rounded-full text-gray-400 hover:bg-gray-200/70 hover:text-gray-700"
            >
              <X size={15} />
            </button>
          </div>
        </div>
      )}

      {/* 3. Full-Bleed 3-Panel Editorial Banner Slider */}
      <MainSlider articles={heroArticles} />

      {/* Instant Filter / Search Results Panel when user picks a category or searches */}
      <div ref={filterAnchorRef}>
        {isFiltered && (
          <section className="border-b border-gray-100 bg-[#FAF8FA] py-10">
            <div className="container max-w-[1160px]">
              <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 pb-3">
                <div className="relative">
                  <h2 className="text-sm font-semibold uppercase tracking-wider text-[#191919]">
                    {selectedCategory !== "all"
                      ? `CATEGORY: ${selectedCategory}`
                      : `SEARCH RESULTS`}
                    {searchQuery.trim() ? ` — "${searchQuery.trim()}"` : ""} (
                    {filteredArticles.length})
                  </h2>
                  <span className="absolute -bottom-[13px] left-0 h-[2px] w-28 bg-[#ef5360]" />
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory("all");
                    setSearchQuery("");
                  }}
                  className="inline-flex items-center gap-1.5 rounded-full bg-white border border-gray-200 px-3.5 py-1 text-xs font-medium text-[#ef5360] shadow-sm hover:border-[#ef5360]"
                >
                  <RotateCcw size={12} />
                  <span>Back to Full Magazine</span>
                </button>
              </div>

              {filteredArticles.length === 0 ? (
                <div className="rounded-xl border border-dashed border-gray-200 bg-white py-12 text-center">
                  <p className="text-sm font-medium text-gray-700">
                    No stories matched your filter.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCategory("all");
                      setSearchQuery("");
                    }}
                    className="mt-3 rounded-full bg-[#ef5360] px-5 py-2 text-xs font-medium text-white hover:bg-[#ec3746]"
                  >
                    Show All Stories
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-7 md:grid-cols-3">
                  {filteredArticles.map((article) => (
                    <ZipeventEditorialCard key={article.id} article={article} />
                  ))}
                </div>
              )}
            </div>
          </section>
        )}
      </div>

      {/* 4. EDITORS' PICKS (Asymmetrical 1 + 2x2 Magazine Grid) */}
      <EditorsPicksSection
        articles={editorsPicks}
        onViewAll={() => selectCategoryAndScroll("Editors' Picks")}
      />

      {/* 5. Full-Width 3-Column Section: WHAT'S ON & CULTURE */}
      <section className="py-6 sm:py-8">
        <div className="container max-w-[1160px]">
          <MagazineSectionHeader
            title="WHAT'S ON & CULTURE"
            onViewAll={() => selectCategoryAndScroll("Event Explore")}
          />
          <div className="grid grid-cols-1 gap-7 md:grid-cols-3">
            {whatsOnArticles.map((article) => (
              <ZipeventEditorialCard key={article.id} article={article} />
            ))}
          </div>
        </div>
      </section>

      {/* 6. Full-Width 3-Column Section: VIDEOS */}
      <section className="py-6 sm:py-8">
        <div className="container max-w-[1160px]">
          <MagazineSectionHeader
            title="VIDEOS"
            onViewAll={() => selectCategoryAndScroll("Videos")}
          />
          <div className="grid grid-cols-1 gap-7 md:grid-cols-3">
            {videoArticles.map((article) => (
              <ZipeventEditorialCard key={article.id} article={article} />
            ))}
          </div>
        </div>
      </section>

      {/* 7. Quick Discovery Box (matching Zipevent's soft gray 3-row chevron box) */}
      <div className="container max-w-[1160px] my-6">
        <div className="overflow-hidden rounded-xl border border-gray-200/80 bg-[#F4F6F9]">
          <div className="border-b border-gray-200/70 px-5 py-3 text-xs font-semibold text-[#191919]">
            Explore More on TixFlow
          </div>
          <div className="divide-y divide-gray-200/70 bg-white">
            <Link
              href="/events"
              className="flex items-center justify-between px-5 py-3 text-xs font-normal text-gray-600 transition-colors hover:bg-gray-50 hover:text-[#ef5360]"
            >
              <span>Discover Upcoming Events &amp; Exhibitions</span>
              <ChevronRight size={15} className="text-gray-400" />
            </Link>
            <Link
              href="/events?category=music"
              className="flex items-center justify-between px-5 py-3 text-xs font-normal text-gray-600 transition-colors hover:bg-gray-50 hover:text-[#ef5360]"
            >
              <span>Book Live Concerts, Musicals &amp; Fanmeetings</span>
              <ChevronRight size={15} className="text-gray-400" />
            </Link>
            <Link
              href="/events?category=entertainment"
              className="flex items-center justify-between px-5 py-3 text-xs font-normal text-gray-600 transition-colors hover:bg-gray-50 hover:text-[#ef5360]"
            >
              <span>Browse Arthouse Cinema &amp; Film Screenings</span>
              <ChevronRight size={15} className="text-gray-400" />
            </Link>
          </div>
        </div>
      </div>

      {/* 8. Lower 2-Column Editorial Feed + Sticky Right Sidebar */}
      <div className="container max-w-[1160px] pt-6">
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[1fr_310px]">
          {/* Left Main Editorial Feed */}
          <div className="space-y-12 min-w-0">
            {/* ART & ENTERTAINMENT */}
            <section id="art-entertainment">
              <MagazineSectionHeader
                title="ART & ENTERTAINMENT"
                onViewAll={() => selectCategoryAndScroll("Art & Entertainment")}
              />
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                {artEntArticles.map((article) => (
                  <ZipeventEditorialCard
                    key={article.id}
                    article={article}
                    compact
                  />
                ))}
              </div>
            </section>

            {/* IT & GADGET */}
            <section>
              <MagazineSectionHeader
                title="IT & GADGET"
                onViewAll={() => selectCategoryAndScroll("IT & Gadget")}
              />
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                {itGadgetArticles.map((article) => (
                  <ZipeventEditorialCard
                    key={article.id}
                    article={article}
                    compact
                  />
                ))}
              </div>
            </section>

            {/* EVENT NEWS */}
            <section>
              <MagazineSectionHeader
                title="EVENT NEWS"
                onViewAll={() => selectCategoryAndScroll("Event News")}
              />
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                {eventNewsArticles.map((article) => (
                  <ZipeventEditorialCard
                    key={article.id}
                    article={article}
                    compact
                  />
                ))}
              </div>
            </section>

            {/* FOOD & TRAVEL */}
            <section>
              <MagazineSectionHeader
                title="FOOD & TRAVEL"
                onViewAll={() => selectCategoryAndScroll("Food & Travel")}
              />
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                {foodTravelArticles.map((article) => (
                  <ZipeventEditorialCard
                    key={article.id}
                    article={article}
                    compact
                  />
                ))}
              </div>
            </section>

            {/* EVENT GUIDELINES — Horizontal List Layout matching blog.zipeventapp.com */}
            <section id="event-guidelines">
              <MagazineSectionHeader
                title="EVENT GUIDELINES"
                onViewAll={() => selectCategoryAndScroll("Event Guidelines")}
              />
              <div className="space-y-6">
                {guidelineArticles.map((article) => (
                  <ZipeventHorizontalCard key={article.id} article={article} />
                ))}
              </div>
            </section>

            {/* HEALTH & BEAUTY */}
            <section>
              <MagazineSectionHeader
                title="HEALTH & BEAUTY"
                onViewAll={() => selectCategoryAndScroll("Health & Beauty")}
              />
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                {healthBeautyArticles.map((article) => (
                  <ZipeventEditorialCard
                    key={article.id}
                    article={article}
                    compact
                  />
                ))}
              </div>
            </section>

            {/* LIFESTYLES */}
            <section>
              <MagazineSectionHeader
                title="LIFESTYLES"
                onViewAll={() => selectCategoryAndScroll("Lifestyles")}
              />
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                {lifestyleArticles.map((article) => (
                  <ZipeventEditorialCard
                    key={article.id}
                    article={article}
                    compact
                  />
                ))}
              </div>
            </section>
          </div>

          {/* Right Sticky Sidebar matching blog.zipeventapp.com */}
          <aside className="space-y-8 lg:sticky lg:top-24">
            {/* Widget 1: Advertise / Content Marketing Card */}
            <div>
              <SidebarWidgetHeader title="ADVERTISE WITH US" />
              <div className="rounded-xl border border-[#F5E1DA] bg-gradient-to-b from-[#FFF6F2] via-[#FFF9F6] to-[#FFF2EC] p-6 text-center">
                <div className="text-[11px] font-medium uppercase tracking-widest text-[#ef5360]">
                  TixFlow Media Studio
                </div>
                <h3 className="mt-1 text-base font-semibold tracking-tight text-[#2B212B]">
                  CONTENT MARKETING
                </h3>
                <p className="mt-1 text-xs font-normal text-gray-500">
                  Promote concerts, exhibitions &amp; brand activations across SEA
                </p>

                <div className="mt-5 grid grid-cols-2 gap-3 text-center">
                  <div className="rounded-lg bg-white/90 p-3 shadow-xs">
                    <Megaphone size={18} className="mx-auto text-[#ef5360]" />
                    <div className="mt-1.5 text-[10px] font-medium uppercase text-[#2B212B]">
                      Featured Story
                    </div>
                  </div>
                  <div className="rounded-lg bg-white/90 p-3 shadow-xs">
                    <Ticket size={18} className="mx-auto text-[#ef5360]" />
                    <div className="mt-1.5 text-[10px] font-medium uppercase text-[#2B212B]">
                      Ticket Push
                    </div>
                  </div>
                </div>

                <div className="mt-5 rounded-full bg-[#2B212B] px-4 py-2 text-[11px] font-medium text-white">
                  media@tixflow.app
                </div>
              </div>
            </div>

            {/* Widget 2: What is TixFlow? */}
            <div>
              <SidebarWidgetHeader title="WHAT IS TIXFLOW?" />
              <p className="text-xs font-normal leading-relaxed text-gray-500">
                TixFlow connects curious audiences with concerts, arthouse films,
                immersive art museums, and conferences — powered by instant QR
                ticketing and real-time venue check-in.
              </p>
            </div>

            {/* Widget 3: Our Services & Solutions */}
            <div>
              <SidebarWidgetHeader title="OUR SERVICES & SOLUTIONS" />
              <div className="overflow-hidden rounded-xl bg-gradient-to-b from-[#3A242B] via-[#532E38] to-[#2B1D24] p-6 text-white shadow-md">
                <div className="text-center">
                  <h4 className="text-xs font-semibold uppercase tracking-widest text-white">
                    OUR SERVICES &amp; SOLUTIONS
                  </h4>
                  <p className="mt-1 text-[11px] font-normal text-white/70">
                    End-to-end event technology by TixFlow
                  </p>
                </div>

                <div className="mt-5 space-y-3">
                  <div className="flex items-center gap-3 rounded-lg bg-white/10 px-3.5 py-2.5 backdrop-blur-xs">
                    <Ticket size={16} className="shrink-0 text-[#ff858f]" />
                    <div className="text-xs font-normal text-white/95">
                      Registration &amp; Ticket-Selling System
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-lg bg-white/10 px-3.5 py-2.5 backdrop-blur-xs">
                    <QrCode size={16} className="shrink-0 text-[#ffb27d]" />
                    <div className="text-xs font-normal text-white/95">
                      On-Site QR &amp; Smart Gate Check-In
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-lg bg-white/10 px-3.5 py-2.5 backdrop-blur-xs">
                    <BarChart3 size={16} className="shrink-0 text-emerald-300" />
                    <div className="text-xs font-normal text-white/95">
                      Live Sales &amp; Audience Analytics
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Widget 4: Quick Tag Links */}
            <div className="overflow-hidden rounded-xl border border-gray-200/80 bg-[#F4F6F9]">
              <div className="border-b border-gray-200/70 px-4 py-2.5 text-xs font-semibold text-[#191919]">
                Popular Event Tags
              </div>
              <div className="divide-y divide-gray-200/70 bg-white">
                <Link
                  href="/events?category=music"
                  className="flex items-center justify-between px-4 py-2.5 text-xs font-normal text-gray-600 hover:bg-gray-50 hover:text-[#ef5360]"
                >
                  <span>CONCERT</span>
                  <ChevronRight size={14} className="text-gray-400" />
                </Link>
                <Link
                  href="/events?category=art"
                  className="flex items-center justify-between px-4 py-2.5 text-xs font-normal text-gray-600 hover:bg-gray-50 hover:text-[#ef5360]"
                >
                  <span>EXHIBITION</span>
                  <ChevronRight size={14} className="text-gray-400" />
                </Link>
                <Link
                  href="/events?category=entertainment"
                  className="flex items-center justify-between px-4 py-2.5 text-xs font-normal text-gray-600 hover:bg-gray-50 hover:text-[#ef5360]"
                >
                  <span>CINEMA &amp; FILM</span>
                  <ChevronRight size={14} className="text-gray-400" />
                </Link>
              </div>
            </div>

            {/* Widget 5: CATEGORIES List matching blog.zipeventapp.com */}
            <div>
              <div className="mb-3 border border-gray-200 py-2 text-center text-[11px] font-semibold uppercase tracking-widest text-[#191919]">
                CATEGORIES
              </div>
              <ul className="divide-y divide-gray-100">
                {blogSidebarCategories.map((cat) => {
                  const active =
                    selectedCategory.toLowerCase() === cat.toLowerCase();
                  return (
                    <li key={cat}>
                      <button
                        type="button"
                        onClick={() => selectCategoryAndScroll(cat)}
                        className={`flex w-full items-center gap-2.5 py-2.5 text-left text-xs transition-colors hover:text-[#ef5360] ${
                          active
                            ? "font-semibold text-[#ef5360]"
                            : "font-normal text-gray-600"
                        }`}
                      >
                        <Plus size={11} className="text-[#ef5360] shrink-0" />
                        <span>{cat}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </aside>
        </div>
      </div>

      {/* 9. Classic Dark 3-Column Magazine Footer */}
      <div className="mt-20">
        <BlogFooter />
      </div>
    </div>
  );
}

function MagazineSectionHeader({
  title,
  onViewAll,
}: {
  title: string;
  onViewAll?: () => void;
}) {
  return (
    <div className="relative mb-6 flex items-center justify-between border-b border-gray-200 pb-2.5">
      <h2 className="text-[13.5px] font-semibold uppercase tracking-wider text-[#191919]">
        {title}
      </h2>
      <span className="absolute -bottom-[1px] left-0 h-[2px] w-24 bg-[#ef5360]" />

      {onViewAll && (
        <button
          type="button"
          onClick={onViewAll}
          className="text-[10.5px] font-normal uppercase tracking-widest text-gray-400 transition-colors hover:text-[#ef5360]"
        >
          VIEW ALL
        </button>
      )}
    </div>
  );
}

function SidebarWidgetHeader({ title }: { title: string }) {
  return (
    <div className="relative mb-4 border-b border-gray-200 pb-2">
      <h3 className="text-[12px] font-semibold uppercase tracking-wider text-[#191919]">
        {title}
      </h3>
      <span className="absolute -bottom-[1px] left-0 h-[2px] w-16 bg-[#ef5360]" />
    </div>
  );
}

function ZipeventShareBar({ likes = 0 }: { likes?: number }) {
  return (
    <div className="mt-3.5 flex items-center justify-center gap-2.5 rounded-full border border-gray-100 px-3 py-1.5 text-[10.5px] text-gray-400">
      <span className="inline-flex items-center gap-1 pr-2 border-r border-gray-200 text-gray-500">
        <Heart size={11} className="text-gray-400" />
        <span>{likes}</span>
      </span>
      <span className="font-semibold hover:text-[#191919]">f</span>
      <span className="font-semibold hover:text-[#191919]">𝕏</span>
      <span className="text-[9.5px] font-semibold hover:text-[#191919]">LINE</span>
      <span className="font-semibold hover:text-[#191919]">in</span>
      <Mail size={11} className="hover:text-[#191919]" />
    </div>
  );
}

function ZipeventEditorialCard({
  article,
  compact = false,
}: {
  article: Article;
  compact?: boolean;
}) {
  return (
    <article className="flex flex-col justify-between">
      <Link href={`/blog/${article.slug}`} className="group block">
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-gray-100">
          <img
            src={article.coverImage}
            alt={article.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
          <span className="absolute bottom-0 left-0 bg-[#191919]/90 px-2 py-0.5 text-[9.5px] font-medium uppercase tracking-wider text-white">
            {article.category}
          </span>
        </div>

        <h3
          className={`mt-3 line-clamp-2 font-semibold leading-snug text-[#191919] transition-colors group-hover:text-[#ef5360] ${
            compact ? "text-[14px]" : "text-[15px]"
          }`}
        >
          {article.title}
        </h3>

        <div className="mt-2 flex flex-wrap items-center gap-1 text-[10px] uppercase tracking-wider text-gray-400">
          <span>BY</span>
          <span className="font-medium text-[#ef5360]">
            {article.author.name}
          </span>
          <span>•</span>
          <span>{formatArticleDate(article.publishedAt)}</span>
          <span>•</span>
          <span>{article.readMinutes} MINS READ</span>
        </div>
      </Link>

      <ZipeventShareBar likes={article.likes ?? 0} />
    </article>
  );
}

function ZipeventHorizontalCard({ article }: { article: Article }) {
  return (
    <article className="grid grid-cols-1 gap-4 border-b border-gray-100 pb-6 sm:grid-cols-[230px_1fr] sm:gap-6">
      <Link
        href={`/blog/${article.slug}`}
        className="group relative aspect-[16/10] w-full overflow-hidden bg-gray-100 block"
      >
        <img
          src={article.coverImage}
          alt={article.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />
      </Link>

      <div className="flex flex-col justify-between">
        <Link href={`/blog/${article.slug}`} className="group block">
          <h3 className="line-clamp-2 text-[15.5px] font-semibold leading-snug text-[#191919] transition-colors group-hover:text-[#ef5360]">
            {article.title}
          </h3>

          <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[10px] uppercase tracking-wider text-gray-400">
            <span>BY</span>
            <span className="font-medium text-[#ef5360]">
              {article.author.name}
            </span>
            <span>•</span>
            <span>{formatArticleDate(article.publishedAt)}</span>
            <span>•</span>
            <span>{article.readMinutes} MINS READ</span>
          </div>
        </Link>

        <div className="self-start">
          <ZipeventShareBar likes={article.likes ?? 0} />
        </div>
      </div>
    </article>
  );
}
