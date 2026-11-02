"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Calendar, Clock, BookOpen } from "lucide-react";
import { getArticles, formatArticleDate, type ArticleTab } from "@/lib/mock/articles";

export function BlogSection() {
  const [activeTab, setActiveTab] = useState<ArticleTab>("latest");

  const filtered = getArticles(activeTab);
  const featuredArticle = filtered[0];
  const sideArticles = filtered.slice(1, 4);

  return (
    <section className="ambient-section-soft w-full border-y border-gray-200/60 py-12 sm:py-16">
      <div className="container">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <div className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#ef5360]">
              <BookOpen size={14} />
              <span>Latest Articles</span>
            </div>
            <h2 className="text-xl font-semibold tracking-tight text-[#2B212B] sm:text-2xl">
              Stories &amp; Event Insights
            </h2>
            <p className="mt-1 text-xs font-normal text-[#8E8E8E] sm:text-sm">
              Discover industry trends, festival guides, and best practices for organizers
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1 rounded-full bg-white p-1 border border-gray-200/90 shadow-sm">
              <button
                type="button"
                onClick={() => setActiveTab("latest")}
                className={`rounded-full px-4 py-1.5 text-xs font-medium transition-all duration-200 ${
                  activeTab === "latest"
                    ? "bg-[#ef5360] text-white shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Latest Stories
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("organizer")}
                className={`rounded-full px-4 py-1.5 text-xs font-medium transition-all duration-200 ${
                  activeTab === "organizer"
                    ? "bg-[#ef5360] text-white shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Organizer Guides
              </button>
            </div>

            <Link
              href="/blog"
              className="group hidden sm:inline-flex items-center gap-1 text-xs font-medium text-[#ef5360] transition-colors hover:text-[#ec3746] sm:text-sm"
            >
              <span>View All</span>
              <ArrowRight
                size={15}
                className="transition-transform duration-200 group-hover:translate-x-1"
              />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8 items-stretch">
          {featuredArticle && (
            <div className="lg:col-span-7 flex">
              <Link
                href={`/articles/${featuredArticle.slug}`}
                className="group relative flex w-full flex-col overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-[0_2px_14px_rgba(17,15,28,0.06)] transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-lg"
              >
                <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden bg-gray-100">
                  <img
                    src={featuredArticle.coverImage}
                    alt={featuredArticle.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]"
                  />
                  <div className="absolute left-3.5 top-3.5 rounded-full bg-[#ef5360] px-3 py-1 text-[11px] font-medium text-white shadow-sm">
                    {featuredArticle.category}
                  </div>
                </div>

                <div className="flex flex-1 flex-col justify-between p-5 sm:p-6 bg-white">
                  <div>
                    <h3 className="text-base sm:text-xl font-semibold tracking-tight text-[#2B212B] transition-colors duration-200 group-hover:text-[#ef5360] line-clamp-2">
                      {featuredArticle.title}
                    </h3>

                    <div className="mt-3 flex items-center gap-2.5 text-xs font-normal text-gray-500">
                      <img
                        src={featuredArticle.author.avatar}
                        alt={featuredArticle.author.name}
                        className="h-6 w-6 rounded-full object-cover ring-1 ring-gray-200"
                      />
                      <span className="font-medium text-gray-800">{featuredArticle.author.name}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Calendar size={12} className="text-[#ef5360]" />
                        {formatArticleDate(featuredArticle.publishedAt)}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock size={12} className="text-[#ef5360]" />
                        {featuredArticle.readMinutes} min read
                      </span>
                    </div>

                    <p className="mt-3 line-clamp-2 text-xs sm:text-sm font-normal leading-relaxed text-[#6B7280]">
                      {featuredArticle.excerpt}
                    </p>
                  </div>

                  <div className="mt-4 flex items-center gap-1.5 text-xs sm:text-sm font-medium text-[#ef5360] group-hover:text-[#ec3746]">
                    <span>Read Full Story</span>
                    <ArrowRight
                      size={14}
                      className="transition-transform duration-200 group-hover:translate-x-1"
                    />
                  </div>
                </div>
              </Link>
            </div>
          )}

          <div className="flex flex-col justify-between gap-4 lg:col-span-5">
            {sideArticles.map((article) => (
              <Link
                key={article.id}
                href={`/articles/${article.slug}`}
                className="group relative flex h-full items-center gap-3.5 sm:gap-4 overflow-hidden rounded-xl border border-gray-200/80 bg-white p-3.5 sm:p-4 shadow-[0_2px_10px_rgba(17,15,28,0.05)] transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="relative aspect-[4/3] w-28 sm:w-36 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                  <img
                    src={article.coverImage}
                    alt={article.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]"
                  />
                </div>

                <div className="flex min-w-0 flex-1 flex-col justify-between py-0.5">
                  <div>
                    <span className="inline-block rounded-full bg-[#FFEFF0] px-2.5 py-0.5 text-[10px] font-medium text-[#ef5360]">
                      {article.category}
                    </span>

                    <h4 className="mt-1.5 line-clamp-2 text-xs sm:text-sm font-semibold text-[#2B212B] transition-colors duration-200 group-hover:text-[#ef5360] leading-snug">
                      {article.title}
                    </h4>
                  </div>

                  <div className="mt-2 flex items-center gap-2 text-[11px] font-normal text-[#8E8E8E]">
                    <span className="truncate font-medium text-gray-600">{article.author.name}</span>
                    <span>•</span>
                    <span>{formatArticleDate(article.publishedAt)}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-6 flex justify-center sm:hidden">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[#ef5360] hover:text-[#ec3746]"
          >
            <span>View All Articles</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}
