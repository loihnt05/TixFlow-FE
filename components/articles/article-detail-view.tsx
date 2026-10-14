"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Calendar,
  Clock,
  ArrowLeft,
  Share2,
  Check,
  Sparkles,
  ChevronRight,
  BookOpen,
  ArrowRight,
} from "lucide-react";
import { formatArticleDate, type Article } from "@/lib/mock/articles";

interface ArticleDetailViewProps {
  article: Article;
  related: Article[];
}

export function ArticleDetailView({ article, related }: ArticleDetailViewProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <article className="min-h-screen bg-[#FDFCFD] pb-24">
      {/* Top Breadcrumb & Navigation */}
      <div className="border-b border-gray-200/70 bg-white">
        <div className="container py-4 flex items-center justify-between text-xs">
          <nav className="flex items-center gap-2 text-gray-500 truncate" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-[#ef5360] transition-colors">
              Home
            </Link>
            <ChevronRight size={13} className="shrink-0" />
            <Link href="/articles" className="hover:text-[#ef5360] transition-colors">
              Articles
            </Link>
            <ChevronRight size={13} className="shrink-0" />
            <span className="font-semibold text-gray-900 truncate">{article.title}</span>
          </nav>

          <Link
            href="/articles"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#ef5360] hover:text-[#ec3746] shrink-0 ml-4"
          >
            <ArrowLeft size={14} />
            <span>All Articles</span>
          </Link>
        </div>
      </div>

      {/* Article Header */}
      <header className="container pt-10 pb-8 max-w-4xl">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="rounded-full bg-[#ef5360] px-3.5 py-1 text-xs font-bold text-white shadow-xs">
            {article.category}
          </span>
          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
            {article.tab === "organizer" ? "Organizer Playbook" : "Story"}
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[42px] font-extrabold tracking-tight text-[#2B212B] leading-tight">
          {article.title}
        </h1>

        <p className="mt-4 text-base sm:text-lg leading-relaxed text-gray-600 font-normal">
          {article.excerpt}
        </p>

        {/* Author & Meta Bar */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-y border-gray-100 py-4">
          <div className="flex items-center gap-3">
            <img
              src={article.author.avatar}
              alt={article.author.name}
              className="h-11 w-11 rounded-full object-cover ring-2 ring-gray-100"
            />
            <div>
              <div className="text-sm font-bold text-gray-900">{article.author.name}</div>
              <div className="text-xs text-gray-500">{article.author.role}</div>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span className="flex items-center gap-1.5">
              <Calendar size={14} className="text-[#ef5360]" />
              <span>{formatArticleDate(article.publishedAt)}</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Clock size={14} className="text-[#ef5360]" />
              <span>{article.readMinutes} min read</span>
            </span>

            {/* Share buttons */}
            <div className="ml-2 flex items-center gap-1.5 border-l border-gray-200 pl-3">
              <button
                type="button"
                onClick={handleCopyLink}
                aria-label="Copy article link"
                className="grid h-8 w-8 place-items-center rounded-full bg-gray-100 text-gray-600 hover:bg-[#ef5360] hover:text-white transition-colors"
                title="Copy link"
              >
                {copied ? <Check size={14} className="text-emerald-500" /> : <Share2 size={14} />}
              </button>
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Share on X / Twitter"
                className="grid h-8 w-8 place-items-center rounded-full bg-gray-100 text-xs font-bold text-gray-700 hover:bg-black hover:text-white transition-colors"
                title="Share on X"
              >
                𝕏
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Share on Facebook"
                className="grid h-8 w-8 place-items-center rounded-full bg-gray-100 text-xs font-bold text-gray-700 hover:bg-blue-600 hover:text-white transition-colors"
                title="Share on Facebook"
              >
                f
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Share on LinkedIn"
                className="grid h-8 w-8 place-items-center rounded-full bg-gray-100 text-xs font-bold text-gray-700 hover:bg-sky-700 hover:text-white transition-colors"
                title="Share on LinkedIn"
              >
                in
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Featured Cover Image */}
      <div className="container max-w-4xl mb-10">
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-3xl bg-gray-100 shadow-md">
          <img
            src={article.coverImage}
            alt={article.title}
            className="h-full w-full object-cover"
          />
        </div>
      </div>

      {/* Body Content */}
      <main className="container max-w-3xl">
        <div className="space-y-6 text-gray-800 text-[15px] sm:text-base leading-relaxed">
          {article.body.map((block, idx) => {
            switch (block.type) {
              case "h2":
                return (
                  <h2
                    key={idx}
                    className="pt-4 text-xl sm:text-2xl font-bold tracking-tight text-[#2B212B]"
                  >
                    {block.text}
                  </h2>
                );
              case "p":
                return <p key={idx}>{block.text}</p>;
              case "list":
                return (
                  <ul key={idx} className="my-4 space-y-2 pl-5 list-disc marker:text-[#ef5360]">
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
                    className="my-6 border-l-4 border-[#ef5360] bg-[#FFF9F9] p-5 rounded-r-2xl italic text-gray-800"
                  >
                    <p className="font-medium text-base sm:text-lg">&ldquo;{block.text}&rdquo;</p>
                    {block.cite && (
                      <cite className="mt-2 block not-italic text-xs font-bold uppercase tracking-wider text-[#ef5360]">
                        — {block.cite}
                      </cite>
                    )}
                  </blockquote>
                );
              case "image":
                return (
                  <figure key={idx} className="my-8 overflow-hidden rounded-2xl bg-gray-100">
                    <img src={block.src} alt={block.caption || ""} className="w-full object-cover" />
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
        </div>

        {/* Tags */}
        <div className="mt-10 border-t border-gray-200/80 pt-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400 mr-2">Tags:</span>
            {article.tags.map((tag) => (
              <Link
                key={tag}
                href={`/articles?q=${encodeURIComponent(tag)}`}
                className="rounded-full bg-gray-100 px-3.5 py-1 text-xs font-medium text-gray-700 hover:bg-[#FFEFF0] hover:text-[#ef5360] transition-colors"
              >
                #{tag}
              </Link>
            ))}
          </div>
        </div>

        {/* Author Bio Box */}
        <div className="mt-8 rounded-2xl border border-gray-200 bg-linear-to-r from-gray-50 to-white p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <img
            src={article.author.avatar}
            alt={article.author.name}
            className="h-14 w-14 rounded-full object-cover ring-2 ring-gray-200 shrink-0"
          />
          <div className="min-w-0 flex-1">
            <div className="text-xs font-bold uppercase tracking-wider text-[#ef5360]">
              Written by
            </div>
            <h3 className="text-base font-bold text-gray-900 mt-0.5">{article.author.name}</h3>
            <p className="text-xs text-gray-500 mt-1">
              {article.author.role} at TixFlow. Passionate about live events, attendee experience, and modern ticketing tech.
            </p>
          </div>
        </div>
      </main>

      {/* Related Articles Section */}
      {related.length > 0 && (
        <section className="container max-w-6xl mt-16 pt-12 border-t border-gray-200">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <div className="mb-1 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#ef5360]">
                <BookOpen size={14} />
                <span>Keep Reading</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#2B212B]">
                Related Articles &amp; Guides
              </h2>
            </div>
            <Link
              href="/articles"
              className="inline-flex items-center gap-1 text-xs font-bold text-[#ef5360] hover:underline sm:text-sm"
            >
              <span>View All</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {related.map((rel) => (
              <Link
                key={rel.id}
                href={`/articles/${rel.slug}`}
                className="group flex flex-col overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-2xs transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-gray-100">
                  <img
                    src={rel.coverImage}
                    alt={rel.title}
                    className="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-105"
                  />
                  <div className="absolute left-3 top-3 rounded-full bg-[#ef5360] px-3 py-0.5 text-[11px] font-semibold text-white shadow-xs">
                    {rel.category}
                  </div>
                </div>

                <div className="flex flex-1 flex-col justify-between p-5">
                  <div>
                    <div className="flex items-center gap-2 text-[11px] text-[#8E8E8E] mb-2">
                      <span>{formatArticleDate(rel.publishedAt)}</span>
                      <span>•</span>
                      <span>{rel.readMinutes} min read</span>
                    </div>

                    <h3 className="line-clamp-2 text-sm font-bold text-[#2B212B] transition-colors group-hover:text-[#ef5360]">
                      {rel.title}
                    </h3>
                  </div>

                  <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-[#ef5360] group-hover:translate-x-1 transition-transform">
                    <span>Read Story</span>
                    <ArrowRight size={13} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Organizer Call to Action Banner */}
      <section className="container max-w-4xl mt-16">
        <div className="rounded-3xl bg-linear-to-r from-[#2B212B] to-[#402C3E] p-8 sm:p-10 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-[#ef5360]/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#ff808c] mb-2">
              <Sparkles size={13} />
              <span>Are You an Organizer?</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight">
              Publish Your Next Event on TixFlow
            </h3>
            <p className="mt-1.5 text-xs sm:text-sm text-gray-300 max-w-lg">
              Set up ticket tiers, customize seat maps, and launch online registration in minutes with zero setup fees.
            </p>
          </div>
          <Link
            href="/organizer/events/create"
            className="inline-flex items-center justify-center rounded-full bg-[#ef5360] px-6 py-3 text-xs font-bold text-white shadow-md hover:bg-[#ec3746] hover:scale-105 active:scale-95 transition-all shrink-0"
          >
            Create Event
          </Link>
        </div>
      </section>
    </article>
  );
}
