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
    <section className="w-full bg-[#F6F7F9] border-y border-gray-200/60 py-12 sm:py-16">
      <div className="container">
        {/* Section Header with Tabs */}
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <div className="mb-1.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#ef5360]">
              <BookOpen size={14} />
              <span>Latest Articles</span>
            </div>
            <h2 className="text-xl font-bold tracking-tight text-[#2B212B] sm:text-2xl md:text-[26px]">
              Stories &amp; Event Insights
            </h2>
            <p className="mt-1 text-xs text-[#8E8E8E] sm:text-sm">
              Discover industry trends, festival guides, and best practices for organizers
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Tab Toggle */}
            <div className="flex items-center gap-1.5 rounded-full bg-white p-1 border border-gray-200 shadow-2xs">
              <button
                type="button"
                onClick={() => setActiveTab("latest")}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all duration-200 ${
                  activeTab === "latest"
                    ? "bg-[#ef5360] text-white shadow-xs"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Latest Stories
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("organizer")}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all duration-200 ${
                  activeTab === "organizer"
                    ? "bg-[#ef5360] text-white shadow-xs"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Organizer Guides
              </button>
            </div>

            {/* View All Link */}
            <Link
              href="/articles"
              className="group hidden sm:inline-flex items-center gap-1 text-xs font-semibold text-[#ef5360] transition-colors hover:text-[#ec3746] sm:text-sm"
            >
              <span>View All</span>
              <ArrowRight
                size={16}
                className="transition-transform duration-200 group-hover:translate-x-1"
              />
            </Link>
          </div>
        </div>

        {/* Asymmetrical Grid: Left Featured (7 cols) + Right 3 Articles (5 cols) */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8 items-stretch">
          {/* 1. Featured Article Card (Left) */}
          {featuredArticle && (
            <div className="lg:col-span-7 flex">
              <Link
                href={`/articles/${featuredArticle.slug}`}
                className="group relative flex w-full flex-col overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-xs transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#ef5360]"
              >
                {/* 1. Article Image with Cover & Subtle Zoom */}
                <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden bg-gray-100">
                  <img
                    src={featuredArticle.coverImage}
                    alt={featuredArticle.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]"
                  />
                  {/* Category Pill Tag */}
                  <div className="absolute left-3.5 top-3.5 sm:left-4 sm:top-4 rounded-full bg-[#ef5360] px-3.5 py-1 text-xs font-semibold text-white shadow-sm">
                    {featuredArticle.category}
                  </div>
                </div>

                {/* Content Container */}
                <div className="flex flex-1 flex-col justify-between p-5 sm:p-6 md:p-7 bg-white">
                  <div>
                    {/* 2. Article Title */}
                    <h3 className="text-base sm:text-xl md:text-2xl font-bold tracking-tight text-[#2B212B] transition-colors duration-200 group-hover:text-[#ef5360] line-clamp-2">
                      {featuredArticle.title}
                    </h3>

                    {/* 3. Author Info */}
                    <div className="mt-3.5 flex items-center gap-2.5">
                      <img
                        src={featuredArticle.author.avatar}
                        alt={featuredArticle.author.name}
                        className="h-7 w-7 rounded-full object-cover ring-1 ring-gray-200"
                      />
                      <div className="flex items-center gap-2 text-xs">
                        <span className="font-semibold text-gray-900 group-hover:text-[#ef5360] transition-colors">
                          {featuredArticle.author.name}
                        </span>
                        <span className="text-gray-400">•</span>
                        <span className="text-gray-500">{featuredArticle.author.role}</span>
                      </div>
                    </div>

                    {/* 4. Date & Metadata */}
                    <div className="mt-2.5 flex items-center gap-3 text-xs text-[#8E8E8E]">
                      <span className="flex items-center gap-1.5">
                        <Calendar size={13} className="text-[#ef5360]" />
                        <span>{formatArticleDate(featuredArticle.publishedAt)}</span>
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1.5">
                        <Clock size={13} className="text-[#ef5360]" />
                        <span>{featuredArticle.readMinutes} min read</span>
                      </span>
                    </div>

                    {/* 5. Supporting Information (Excerpt) */}
                    <p className="mt-3.5 line-clamp-2 text-xs sm:text-sm leading-relaxed text-[#6B7280]">
                      {featuredArticle.excerpt}
                    </p>
                  </div>

                  {/* Read More Link */}
                  <div className="mt-5 flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#ef5360] group-hover:text-[#ec3746]">
                    <span>Read Full Story</span>
                    <ArrowRight
                      size={15}
                      className="transition-transform duration-200 group-hover:translate-x-1"
                    />
                  </div>
                </div>
              </Link>
            </div>
          )}

          {/* 2. Three Smaller Article Cards (Right, Stacked Vertically) */}
          <div className="flex flex-col justify-between gap-4 lg:col-span-5">
            {sideArticles.map((article) => (
              <Link
                key={article.id}
                href={`/articles/${article.slug}`}
                className="group relative flex h-full items-center gap-3.5 sm:gap-4 overflow-hidden rounded-xl border border-gray-200/80 bg-white p-3.5 sm:p-4 shadow-xs transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#ef5360]"
              >
                {/* 1. Article Image Thumbnail */}
                <div className="relative aspect-[4/3] w-28 sm:w-36 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                  <img
                    src={article.coverImage}
                    alt={article.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]"
                  />
                </div>

                {/* Content Area */}
                <div className="flex min-w-0 flex-1 flex-col justify-between py-0.5">
                  <div>
                    {/* Supporting Category Badge */}
                    <span className="inline-block rounded-full bg-[#FFEFF0] px-2.5 py-0.5 text-[10px] font-semibold text-[#ef5360]">
                      {article.category}
                    </span>

                    {/* 2. Article Title */}
                    <h4 className="mt-1.5 line-clamp-2 text-xs sm:text-sm font-bold text-[#2B212B] transition-colors duration-200 group-hover:text-[#ef5360] leading-snug">
                      {article.title}
                    </h4>
                  </div>

                  <div className="mt-2.5 flex flex-col gap-1">
                    {/* 3. Author */}
                    <div className="flex items-center gap-1.5 text-[11px] text-gray-700">
                      <img
                        src={article.author.avatar}
                        alt={article.author.name}
                        className="h-4 w-4 rounded-full object-cover ring-1 ring-gray-200"
                      />
                      <span className="font-medium truncate group-hover:text-[#ef5360] transition-colors">
                        {article.author.name}
                      </span>
                    </div>

                    {/* 4. Date & Metadata */}
                    <div className="flex items-center gap-2 text-[11px] text-[#8E8E8E]">
                      <span>{formatArticleDate(article.publishedAt)}</span>
                      <span>•</span>
                      <span>{article.readMinutes} min read</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Mobile View All Link */}
        <div className="mt-6 flex justify-center sm:hidden">
          <Link
            href="/articles"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#ef5360] hover:text-[#ec3746]"
          >
            <span>View All Articles</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}
