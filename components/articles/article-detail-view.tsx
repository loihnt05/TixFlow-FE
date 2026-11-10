"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Check,
  Heart,
  Mail,
  Megaphone,
  QrCode,
  Search,
  Share2,
  Sparkles,
  Ticket,
  Users,
  BarChart3,
  ShieldCheck,
  X,
} from "lucide-react";
import { OrganizerOnly } from "@/components/organizer-only";
import { BlogTopBar } from "./blog-top-bar";
import { BlogNavHeader } from "./blog-nav-header";
import { BlogFooter } from "./blog-footer";
import {
  blogSidebarCategories,
  formatArticleDate,
  getArticlesByEditorialSection,
  getFeaturedArticles,
  type Article,
} from "@/lib/mock/articles";

interface ArticleDetailViewProps {
  article: Article;
  related: Article[];
}

export function ArticleDetailView({ article, related }: ArticleDetailViewProps) {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(article.likes ?? 0);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  const hotArticles = useMemo(() => getFeaturedArticles(6), []);
  const editorsPickPreviews = useMemo(
    () => getArticlesByEditorialSection("Editors' Picks", 4),
    []
  );

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleToggleLike = () => {
    setLiked((prev) => {
      const next = !prev;
      setLikeCount((count) => (next ? count + 1 : Math.max(0, count - 1)));
      return next;
    });
  };

  const handleSelectCategory = (category: string) => {
    if (category === "all") {
      router.push("/blog");
    } else {
      router.push(`/blog?category=${encodeURIComponent(category)}`);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/blog?q=${encodeURIComponent(searchQuery.trim())}`);
    }
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

  const shareUrl =
    typeof window !== "undefined"
      ? window.location.href
      : `https://blog.tixflow.app/blog/${article.slug}`;
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(article.title);

  return (
    <div className="min-h-screen bg-white text-[#191919]">
      {/* 1. Top Dark 'TRENDING NOW' Ticker Bar (matches blog.zipeventapp.com) */}
      <BlogTopBar hotArticles={hotArticles} />

      {/* 2. Sticky Editorial Navigation Bar */}
      <BlogNavHeader
        categories={["all", ...blogSidebarCategories]}
        editorsPickPreviews={editorsPickPreviews}
        onSelectCategory={handleSelectCategory}
        onOpenSearch={toggleSearchDrawer}
      />

      {/* Optional Slide-Down Search Bar */}
      {searchOpen && (
        <form
          onSubmit={handleSearchSubmit}
          className="border-b border-gray-100 bg-[#FAF9FB] py-3.5"
        >
          <div className="container max-w-[1160px] flex items-center gap-3">
            <Search size={17} className="text-[#ef5360] shrink-0" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Type keywords and press Enter to search articles..."
              className="flex-1 bg-transparent text-sm font-normal text-[#191919] placeholder:text-gray-400 outline-none"
            />
            <button
              type="button"
              onClick={() => setSearchOpen(false)}
              aria-label="Close search"
              className="grid h-7 w-7 place-items-center rounded-full text-gray-400 hover:bg-gray-200/70 hover:text-gray-700"
            >
              <X size={15} />
            </button>
          </div>
        </form>
      )}

      {/* 3. Main Single-Magazine Container */}
      <div className="container max-w-[1160px] pt-7 pb-16 sm:pt-10">
        {/* Post Top Header (.single-magazine .post-top) */}
        <div className="post-top mb-7 border-b border-gray-100 pb-6">
          <Link
            href={`/blog?category=${encodeURIComponent(article.category)}`}
            className="inline-block rounded-[2px] bg-[#e31e24] px-2.5 py-1 text-[10.5px] font-semibold uppercase tracking-wider text-white transition-opacity hover:opacity-90"
          >
            {article.category}
          </Link>

          <h1 className="mt-3.5 text-2xl font-bold leading-[1.32] tracking-tight text-[#191919] sm:text-3xl md:text-[34px]">
            {article.title}
          </h1>

          {/* Post Meta Left + Post Share B Right */}
          <div className="mt-4 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div className="flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-wider text-gray-400">
              <span>
                By{" "}
                <Link
                  href={`/blog?q=${encodeURIComponent(article.author.name)}`}
                  className="font-semibold text-[#ef5360] hover:underline"
                >
                  {article.author.name}
                </Link>
              </span>
              <span className="inline-block h-[1px] w-2.5 bg-gray-300" />
              <time dateTime={article.publishedAt}>
                {formatArticleDate(article.publishedAt)}
              </time>
              <span className="inline-block h-[1px] w-2.5 bg-gray-300" />
              <span>{article.readMinutes} Mins Read</span>
            </div>

            {/* Top Rectangular Share Buttons (.post-share-b matching Zipevent) */}
            <div className="flex flex-wrap items-center gap-1.5">
              <a
                href={`https://www.facebook.com/sharer.php?u=${encodedUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                title="Share on Facebook"
                className="inline-flex h-10 items-center justify-center gap-2 rounded-[2px] bg-[#3b5998] px-4 text-xs font-medium text-white transition-opacity hover:opacity-90 sm:w-[120px]"
              >
                <span className="font-bold">f</span>
                <span>Facebook</span>
              </a>

              <a
                href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
                target="_blank"
                rel="noopener noreferrer"
                title="Share on Twitter"
                className="inline-flex h-10 items-center justify-center gap-2 rounded-[2px] bg-[#1da1f2] px-4 text-xs font-medium text-white transition-opacity hover:opacity-90 sm:w-[120px]"
              >
                <span className="font-bold">𝕏</span>
                <span>Twitter</span>
              </a>

              <a
                href={`https://social-plugins.line.me/lineit/share?url=${encodedUrl}&text=${encodedTitle}`}
                target="_blank"
                rel="noopener noreferrer"
                title="Share on LINE"
                className="inline-flex h-10 w-[50px] items-center justify-center rounded-[2px] bg-[#06c755] text-[12px] font-bold tracking-tight text-white transition-opacity hover:opacity-90"
              >
                LINE
              </a>

              <a
                href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                title="Share on LinkedIn"
                className="inline-flex h-10 w-10 items-center justify-center rounded-[2px] bg-[#0077b5] text-xs font-bold text-white transition-opacity hover:opacity-90"
              >
                in
              </a>

              <a
                href={`mailto:?subject=${encodedTitle}&body=${encodedUrl}`}
                title="Share via Email"
                className="inline-flex h-10 w-10 items-center justify-center rounded-[2px] bg-[#222222] text-white transition-opacity hover:opacity-90"
              >
                <Mail size={14} />
              </a>

              <button
                type="button"
                onClick={handleCopyLink}
                title="Copy article link"
                aria-label="Copy article link"
                className="inline-flex h-10 w-10 items-center justify-center rounded-[2px] border border-gray-200 bg-gray-50 text-gray-700 transition-colors hover:border-[#ef5360] hover:text-[#ef5360]"
              >
                {copied ? (
                  <Check size={14} className="text-emerald-600" />
                ) : (
                  <Share2 size={14} />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* 4. Focused Editorial Column (.col-8.main-content) */}
        <article className="mx-auto max-w-[780px]">
          {/* Featured Image (1170x612 / 1.91:1 uncropped ratio) */}
          <header className="mb-8">
            <div className="overflow-hidden bg-gray-100">
              <img
                src={article.coverImage}
                alt={article.title}
                className="h-auto w-full object-cover"
              />
            </div>
          </header>

          {/* Body Content + Sticky Floating Left Share Rail */}
          <div className="relative">
            {/* Desktop Sticky Floating Share Rail (.post-share-float) */}
            <aside
              aria-label="Share article"
              className="hidden xl:flex flex-col items-center gap-2 absolute -left-20 top-0 h-full"
            >
              <div className="sticky top-28 flex flex-col items-center gap-2">
                <span className="mb-1 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                  Share
                </span>
                <a
                  href={`https://www.facebook.com/sharer.php?u=${encodedUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Share on Facebook"
                  className="grid h-9 w-9 place-items-center rounded-full border border-gray-200 bg-white text-xs font-bold text-[#3b5998] shadow-2xs transition-transform hover:scale-105"
                >
                  f
                </a>
                <a
                  href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Share on X"
                  className="grid h-9 w-9 place-items-center rounded-full border border-gray-200 bg-white text-xs font-bold text-[#1da1f2] shadow-2xs transition-transform hover:scale-105"
                >
                  𝕏
                </a>
                <a
                  href={`https://social-plugins.line.me/lineit/share?url=${encodedUrl}&text=${encodedTitle}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Share on LINE"
                  className="grid h-9 w-9 place-items-center rounded-full border border-gray-200 bg-white text-[9px] font-extrabold text-[#06c755] shadow-2xs transition-transform hover:scale-105"
                >
                  LINE
                </a>
                <a
                  href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Share on LinkedIn"
                  className="grid h-9 w-9 place-items-center rounded-full border border-gray-200 bg-white text-xs font-bold text-[#0077b5] shadow-2xs transition-transform hover:scale-105"
                >
                  in
                </a>
                <a
                  href={`mailto:?subject=${encodedTitle}&body=${encodedUrl}`}
                  aria-label="Share via Email"
                  className="grid h-9 w-9 place-items-center rounded-full border border-gray-200 bg-white text-gray-600 shadow-2xs transition-transform hover:scale-105"
                >
                  <Mail size={13} />
                </a>
              </div>
            </aside>

            {/* Entry Content (.entry-content) */}
            <div className="entry-content space-y-6 text-[15.5px] sm:text-base leading-[1.85] text-[#222222]">
              {article.body.map((block, idx) => {
                switch (block.type) {
                  case "p":
                    return (
                      <p
                        key={idx}
                        className={
                          block.align === "center"
                            ? "text-center font-medium text-[#191919]"
                            : ""
                        }
                      >
                        {block.highlightLead && (
                          <>
                            <strong className="font-bold text-[#9b51e0]">
                              {block.highlightLead}
                            </strong>{" "}
                          </>
                        )}
                        {block.text}
                      </p>
                    );

                  case "cta_button":
                    return (
                      <div key={idx} className="my-7 space-y-5 text-center">
                        <p className="font-bold tracking-widest text-gray-700 select-none">
                          .・。.・゜✭・.・✫・゜・。.
                        </p>
                        <div>
                          <Link
                            href={block.href}
                            className="inline-block rounded-full bg-[#9b51e0] px-7 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#843bc7] hover:shadow-md"
                          >
                            {block.label}
                          </Link>
                        </div>
                        <p className="text-gray-700 select-none">│</p>
                      </div>
                    );

                  case "event_spot":
                    return (
                      <section key={idx} className="pt-2">
                        <h2 className="text-center text-xl sm:text-2xl font-bold tracking-tight text-[#191919]">
                          {block.number}. {block.title}
                        </h2>

                        <p className="mt-3 text-center text-[14.5px] leading-relaxed text-[#222222]">
                          <strong className="font-bold">Open:</strong>{" "}
                          {block.open}
                          <br />
                          <strong className="font-bold">Location:</strong>{" "}
                          {block.location}
                          <br />
                          <strong className="font-bold">More info:</strong>{" "}
                          <Link
                            href={block.moreInfoUrl}
                            className="font-medium text-[#ef5360] underline transition-colors hover:text-[#c82333]"
                          >
                            {block.moreInfoLabel}
                          </Link>
                        </p>

                        <p className="mt-4 text-[15.5px] sm:text-base leading-[1.85] text-[#222222]">
                          {block.description}
                        </p>

                        {block.image && (
                          <figure className="my-6 mx-auto max-w-[640px] overflow-hidden bg-gray-100">
                            <img
                              src={block.image}
                              alt={`${block.number}. ${block.title}`}
                              loading="lazy"
                              className="h-auto w-full object-cover"
                            />
                          </figure>
                        )}

                        {block.separatorStyle === "line" ? (
                          <div className="my-7 space-y-4">
                            <hr className="border-t-2 border-[#191919]" />
                            <p className="text-center text-[#191919] select-none">
                              │
                            </p>
                          </div>
                        ) : (
                          <div
                            aria-hidden="true"
                            className="my-7 pl-[1.5em] text-center font-serif text-2xl tracking-[1.5em] text-gray-700 select-none"
                          >
                            ···
                          </div>
                        )}
                      </section>
                    );

                  case "h2":
                    return (
                      <h2
                        key={idx}
                        className={`pt-4 text-xl sm:text-2xl font-bold tracking-tight text-[#191919] ${
                          block.align === "center" ? "text-center" : ""
                        }`}
                      >
                        {block.text}
                      </h2>
                    );

                  case "list":
                    return (
                      <ul
                        key={idx}
                        className="my-4 list-disc space-y-2 pl-6 marker:text-[#ef5360]"
                      >
                        {block.items.map((item, itemIdx) => (
                          <li key={itemIdx} className="pl-1">
                            {item}
                          </li>
                        ))}
                      </ul>
                    );

                  case "quote":
                    return (
                      <blockquote
                        key={idx}
                        className="my-6 rounded-r-xl border-l-4 border-[#ef5360] bg-[#FFF9F9] p-5 italic text-gray-800"
                      >
                        <p className="text-base font-medium sm:text-lg">
                          &ldquo;{block.text}&rdquo;
                        </p>
                        {block.cite && (
                          <cite className="mt-2 block text-xs font-bold uppercase tracking-wider text-[#ef5360] not-italic">
                            — {block.cite}
                          </cite>
                        )}
                      </blockquote>
                    );

                  case "image":
                    return (
                      <figure
                        key={idx}
                        className="my-7 overflow-hidden bg-gray-100"
                      >
                        <img
                          src={block.src}
                          alt={block.caption || ""}
                          loading="lazy"
                          className="w-full object-cover"
                        />
                        {block.caption && (
                          <figcaption className="p-3 text-center text-xs text-gray-500">
                            {block.caption}
                          </figcaption>
                        )}
                      </figure>
                    );

                  default:
                    return null;
                }
              })}

              {/* 5. Zipevent End-of-Post Full-Service Event Solutions Callout */}
              <div className="pt-4">
                <hr className="border-t-2 border-[#191919]" />
                <p className="my-4 text-center text-[#191919] select-none">│</p>

                <h3 className="text-center text-lg sm:text-xl font-bold leading-snug text-[#191919]">
                  ✦ 6 Full-Service Event Solutions for Organizers ✦
                  <br />
                  We understand everything about{" "}
                  <em className="font-extrabold text-[#8c1d97] not-italic">
                    Events
                  </em>{" "}
                  — Let us help you!
                </h3>

                {/* Visual 6-Service Banner matching Zipevent's tagline banner */}
                <div className="my-6 overflow-hidden rounded-2xl bg-gradient-to-r from-[#2B193D] via-[#4A1E4E] to-[#ef5360] p-6 sm:p-7 text-white shadow-md">
                  <div className="text-center">
                    <span className="inline-block rounded-full bg-white/15 px-3 py-0.5 text-[10px] font-bold uppercase tracking-widest text-white">
                      TixFlow Event Tech Ecosystem
                    </span>
                    <p className="mt-1.5 text-sm sm:text-base font-semibold text-white/95">
                      End-to-End Ticketing, Smart Registration &amp; Live Event
                      Marketing
                    </p>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {[
                      { icon: Ticket, label: "Online Ticketing" },
                      { icon: QrCode, label: "QR & Kiosk Check-In" },
                      { icon: Users, label: "Visitor Registration" },
                      { icon: BarChart3, label: "Real-Time Analytics" },
                      { icon: Megaphone, label: "Event PR & Media" },
                      { icon: ShieldCheck, label: "Ticket Protection" },
                    ].map((service) => {
                      const Icon = service.icon;
                      return (
                        <div
                          key={service.label}
                          className="flex items-center gap-2.5 rounded-xl bg-white/12 px-3.5 py-2.5 backdrop-blur-xs"
                        >
                          <Icon size={16} className="shrink-0 text-[#ffb8c0]" />
                          <span className="text-xs font-semibold text-white">
                            {service.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <p className="text-center text-sm leading-relaxed text-[#222222]">
                  <strong>
                    Interested in{" "}
                    <Link
                      href="/events"
                      className="text-[#ef5360] underline hover:text-[#c82333]"
                    >
                      Full-Service Event Solutions
                    </Link>
                    ? Contact us!
                  </strong>
                  <br />
                  <strong>E-mail:</strong> sales@tixflow.app /{" "}
                  <strong>Call:</strong> 02 038 5150 /{" "}
                  <strong>Inbox FB:</strong> TixFlow
                  <br />
                  <strong>Website:</strong>{" "}
                  <Link
                    href="/events"
                    className="text-[#ef5360] underline hover:text-[#c82333]"
                  >
                    https://www.tixflow.app
                  </Link>
                </p>

                <div
                  aria-hidden="true"
                  className="my-7 pl-[1.5em] text-center font-serif text-2xl tracking-[1.5em] text-gray-700 select-none"
                >
                  ···
                </div>

                {/* Follow us social links list (matches bottom of Zipevent articles) */}
                <div>
                  <p className="text-[15px] leading-relaxed text-[#222222]">
                    <strong className="font-bold">
                      Follow us for more interesting content!
                    </strong>
                    <br />
                    Stay updated with the latest concerts, art exhibitions, and
                    weekend guides on TixFlow across our official social
                    channels below:
                  </p>
                  <ul className="mt-3 list-disc space-y-1.5 pl-6 text-sm text-[#222222] marker:text-[#ef5360]">
                    <li>
                      Line: @TixFlow —{" "}
                      <a
                        href="https://line.me"
                        target="_blank"
                        rel="noreferrer noopener"
                        className="font-medium text-[#ef5360] underline"
                      >
                        @TixFlow
                      </a>
                    </li>
                    <li>
                      Website:{" "}
                      <Link
                        href="/"
                        className="font-medium text-[#ef5360] underline"
                      >
                        www.tixflow.app
                      </Link>
                    </li>
                    <li>
                      Instagram:{" "}
                      <a
                        href="https://instagram.com"
                        target="_blank"
                        rel="noreferrer noopener"
                        className="font-medium text-[#ef5360] underline"
                      >
                        @TixFlow
                      </a>
                    </li>
                    <li>
                      Facebook:{" "}
                      <a
                        href="https://facebook.com"
                        target="_blank"
                        rel="noreferrer noopener"
                        className="font-medium text-[#ef5360] underline"
                      >
                        @TixFlow
                      </a>
                    </li>
                    <li>
                      Twitter / X:{" "}
                      <a
                        href="https://x.com"
                        target="_blank"
                        rel="noreferrer noopener"
                        className="font-medium text-[#ef5360] underline"
                      >
                        @TixFlowApp
                      </a>
                    </li>
                    <li>
                      TikTok:{" "}
                      <a
                        href="https://tiktok.com"
                        target="_blank"
                        rel="noreferrer noopener"
                        className="font-medium text-[#ef5360] underline"
                      >
                        @TixFlowApp
                      </a>
                    </li>
                    <li>
                      YouTube:{" "}
                      <a
                        href="https://youtube.com"
                        target="_blank"
                        rel="noreferrer noopener"
                        className="font-medium text-[#ef5360] underline"
                      >
                        TixFlow Official
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* 6. Post Footer (.the-post-foot): Tags & Centered Share Pill */}
          <div className="the-post-foot mt-10 border-t border-gray-200 pt-6">
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
              {/* Tag pills */}
              <div className="flex flex-wrap items-center gap-1.5">
                {article.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/blog?q=${encodeURIComponent(tag)}`}
                    className="rounded-[3px] bg-[#f0f0f0] px-3 py-1 text-xs font-normal text-[#505050] transition-colors hover:bg-[#e31e24] hover:text-white"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>

              {/* Rounded Share & Like Pill (.post-share-icons) */}
              <div className="inline-flex items-center gap-3 rounded-full border border-gray-200 px-4 py-1.5 text-xs text-gray-500">
                <button
                  type="button"
                  onClick={handleToggleLike}
                  className={`inline-flex items-center gap-1 border-r border-gray-200 pr-3 font-medium transition-colors ${
                    liked
                      ? "text-[#e31e24]"
                      : "text-gray-500 hover:text-[#e31e24]"
                  }`}
                >
                  <Heart
                    size={13}
                    className={liked ? "fill-[#e31e24] text-[#e31e24]" : ""}
                  />
                  <span>{likeCount}</span>
                </button>
                <a
                  href={`https://www.facebook.com/sharer.php?u=${encodedUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold hover:text-[#3b5998]"
                  title="Facebook"
                >
                  f
                </a>
                <a
                  href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold hover:text-[#1da1f2]"
                  title="Twitter"
                >
                  𝕏
                </a>
                <a
                  href={`https://social-plugins.line.me/lineit/share?url=${encodedUrl}&text=${encodedTitle}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[9px] font-extrabold text-[#06c755] hover:opacity-80"
                  title="LINE"
                >
                  LINE
                </a>
                <a
                  href={`mailto:?subject=${encodedTitle}&body=${encodedUrl}`}
                  className="hover:text-[#191919]"
                  title="Email"
                >
                  <Mail size={12} />
                </a>
                <a
                  href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold hover:text-[#0077b5]"
                  title="LinkedIn"
                >
                  in
                </a>
              </div>
            </div>
          </div>

          {/* 7. Author Box (.author-box-b) */}
          <div className="author-box-b mt-8 flex flex-col items-center gap-5 border border-gray-200/90 bg-[#FAFAFA] p-6 text-center sm:flex-row sm:items-start sm:text-left">
            <img
              src={article.author.avatar}
              alt={article.author.name}
              className="h-20 w-20 shrink-0 rounded-full object-cover ring-2 ring-white shadow-xs"
            />
            <div className="min-w-0 flex-1">
              <Link
                href={`/blog?q=${encodeURIComponent(article.author.name)}`}
                className="text-base font-bold text-[#191919] hover:text-[#ef5360]"
              >
                {article.author.name}
              </Link>
              <div className="mt-0.5 text-xs font-medium text-[#ef5360]">
                {article.author.role}
              </div>
              <p className="mt-2 text-xs leading-relaxed text-gray-500">
                Curating live concerts, contemporary art exhibitions, and
                practical event technology guides across Southeast Asia on
                TixFlow.
              </p>
            </div>
          </div>

          {/* 8. Related Posts Grid (.related-posts.grid-3: 6 posts in 2x3 grid) */}
          {related.length > 0 && (
            <section className="related-posts mt-12">
              <div className="relative mb-6 border-b border-gray-200 pb-2.5">
                <h4 className="text-[13.5px] font-semibold uppercase tracking-wider text-[#191919]">
                  Related Posts
                </h4>
                <span className="absolute -bottom-[1px] left-0 h-[2px] w-24 bg-[#ef5360]" />
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
                {related.slice(0, 6).map((rel) => (
                  <article key={rel.id} className="group">
                    <Link href={`/blog/${rel.slug}`} className="block">
                      <div className="relative aspect-[1.91/1] w-full overflow-hidden bg-gray-100">
                        <img
                          src={rel.coverImage}
                          alt={rel.title}
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                        />
                      </div>

                      <h3 className="mt-3 line-clamp-2 text-[14px] font-semibold leading-snug text-[#191919] transition-colors group-hover:text-[#ef5360]">
                        {rel.title}
                      </h3>

                      <time
                        dateTime={rel.publishedAt}
                        className="mt-1.5 block text-[10.5px] uppercase tracking-wider text-gray-400"
                      >
                        {formatArticleDate(rel.publishedAt)}
                      </time>
                    </Link>
                  </article>
                ))}
              </div>
            </section>
          )}

          {/* 9. Comments Closed Notice (matches Zipevent .comments-area) */}
          <div className="mt-10 border-t border-gray-100 pt-6">
            <p className="text-xs italic text-gray-400">Comments are closed.</p>
          </div>

          {/* Optional Organizer Workspace Quick Action (only visible for Organizer accounts) */}
          <OrganizerOnly>
            <div className="mt-10 rounded-2xl bg-gradient-to-r from-[#2B212B] to-[#402C3E] p-6 sm:p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-5 shadow-lg">
              <div>
                <div className="inline-flex items-center gap-1.5 rounded-full bg-[#ef5360]/20 px-3 py-0.5 text-[11px] font-bold uppercase tracking-wider text-[#ff808c] mb-1.5">
                  <Sparkles size={12} />
                  <span>Organizer Studio</span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold tracking-tight">
                  Ready to Launch Your Next Event on TixFlow?
                </h3>
                <p className="mt-1 text-xs text-gray-300 max-w-md">
                  Configure ticket tiers, interactive seat maps, and QR check-in
                  lanes from your Organizer Workspace.
                </p>
              </div>
              <Link
                href="/organizer/events/create"
                className="shrink-0 rounded-full bg-[#ef5360] px-5 py-2.5 text-xs font-bold text-white shadow-sm transition-colors hover:bg-[#ec3746]"
              >
                Create Event
              </Link>
            </div>
          </OrganizerOnly>
        </article>
      </div>

      {/* 10. Classic Dark 3-Column Magazine Footer */}
      <BlogFooter />
    </div>
  );
}
