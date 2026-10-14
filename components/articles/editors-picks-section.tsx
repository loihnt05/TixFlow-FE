"use client";

import Link from "next/link";
import { ArrowRight, Calendar, Clock, Award } from "lucide-react";
import { formatArticleDate, type Article } from "@/lib/mock/articles";

interface EditorsPicksSectionProps {
  articles: Article[];
  onViewAll?: () => void;
}

export function EditorsPicksSection({
  articles,
  onViewAll,
}: EditorsPicksSectionProps) {
  if (!articles || articles.length === 0) return null;

  return (
    <section
      id="editors-picks"
      className="editors-picks-section py-12 sm:py-16 bg-white"
      aria-label="Editors' Picks"
    >
      <div className="container">
        {/* Section Header with Decorative Underline and 'VIEW ALL' */}
        <div className="mb-8 flex items-end justify-between border-b border-gray-200/80 pb-3.5">
          <div className="relative">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#ef5360] mb-1">
              <Award size={14} />
              <span>Handpicked Collection</span>
            </div>
            <h2 className="text-xl sm:text-2xl md:text-[26px] font-black tracking-wider text-[#2B212B] uppercase">
              Editors&apos; Picks
            </h2>
            {/* Thin Decorative Underline Accent */}
            <div className="absolute -bottom-3.5 left-0 h-[2.5px] w-24 bg-[#ef5360] rounded-full" />
          </div>

          <a
            href="#all-stories"
            onClick={onViewAll}
            className="group inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold uppercase tracking-wider text-[#ef5360] transition-colors hover:text-[#ec3746]"
          >
            <span>View All</span>
            <ArrowRight
              size={15}
              className="transition-transform duration-200 group-hover:translate-x-1"
            />
          </a>
        </div>

        {/* CSS Grid Layout: 3 to 4 columns on Desktop, 1 column on Mobile */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {articles.map((article) => (
            <Link
              key={article.id}
              href={`/articles/${article.slug}`}
              className="article-card group flex flex-col focus:outline-none focus:ring-2 focus:ring-[#ef5360] rounded-xl"
            >
              {/* Thumbnail: 16:9 ratio, subtle rounded corners, overflow-hidden */}
              <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl bg-gray-100 shadow-2xs">
                <img
                  src={article.coverImage}
                  alt={article.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-105"
                />

                {/* Category Pill Tag */}
                <div className="absolute left-2.5 top-2.5 rounded-full bg-white/90 backdrop-blur-md px-2.5 py-0.5 text-[10px] font-bold text-[#ef5360] shadow-xs">
                  {article.category}
                </div>
              </div>

              {/* Title & Metadata below the thumbnail */}
              <div className="flex flex-1 flex-col justify-between pt-3.5">
                <div>
                  <h3 className="line-clamp-2 text-base font-bold text-[#2B212B] transition-colors duration-200 group-hover:text-[#ef5360] leading-snug">
                    {article.title}
                  </h3>

                  <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-gray-500">
                    {article.excerpt}
                  </p>
                </div>

                {/* Metadata: Date in light gray, read time at bottom */}
                <div className="mt-3.5 flex items-center gap-2 text-[11px] text-gray-400">
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
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
