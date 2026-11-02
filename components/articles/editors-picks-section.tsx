"use client";

import Link from "next/link";
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

  const mainPick = articles[0];
  const sidePicks = articles.slice(1, 5);

  return (
    <section
      id="editors-picks"
      className="pt-10 pb-8 sm:pt-12 sm:pb-10"
      aria-label="Editors' Picks"
    >
      <div className="container max-w-[1160px]">
        {/* Zipevent Magazine Section Header Bar */}
        <div className="relative mb-6 flex items-center justify-between border-b border-gray-200 pb-2.5">
          <h2 className="text-[13.5px] font-semibold uppercase tracking-wider text-[#191919]">
            EDITORS&apos; PICKS
          </h2>
          <span className="absolute -bottom-[1px] left-0 h-[2px] w-28 bg-[#ef5360]" />

          <button
            type="button"
            onClick={onViewAll}
            className="text-[10.5px] font-normal uppercase tracking-widest text-gray-400 transition-colors hover:text-[#ef5360]"
          >
            VIEW ALL
          </button>
        </div>

        {/* Asymmetrical 1 + 2x2 Magazine Grid matching blog.zipeventapp.com */}
        <div className="grid grid-cols-1 gap-7 lg:grid-cols-12">
          {/* Left: Large Featured Editor's Pick */}
          {mainPick && (
            <article className="lg:col-span-6">
              <Link href={`/articles/${mainPick.slug}`} className="group block">
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-gray-100">
                  <img
                    src={mainPick.coverImage}
                    alt={mainPick.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  />
                  <span className="absolute bottom-0 left-0 bg-[#191919]/90 px-2.5 py-1 text-[9.5px] font-medium uppercase tracking-wider text-white">
                    {mainPick.category}
                  </span>
                </div>

                <h3 className="mt-3.5 text-lg sm:text-[19px] font-semibold leading-snug text-[#191919] transition-colors group-hover:text-[#ef5360]">
                  {mainPick.title}
                </h3>

                <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[10.5px] uppercase tracking-wider text-gray-400">
                  <span>BY</span>
                  <span className="font-medium text-[#ef5360]">
                    {mainPick.author.name}
                  </span>
                  <span>•</span>
                  <span>{formatArticleDate(mainPick.publishedAt)}</span>
                  <span>•</span>
                  <span>{mainPick.readMinutes} MINS READ</span>
                </div>

                <p className="mt-2.5 line-clamp-3 text-[13px] font-normal leading-relaxed text-gray-500">
                  {mainPick.excerpt}
                </p>
              </Link>
            </article>
          )}

          {/* Right: 2x2 Compact Editorial Grid */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:col-span-6">
            {sidePicks.map((item) => (
              <article key={item.id}>
                <Link href={`/articles/${item.slug}`} className="group block">
                  <div className="relative aspect-[16/9] w-full overflow-hidden bg-gray-100">
                    <img
                      src={item.coverImage}
                      alt={item.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    />
                  </div>

                  <h4 className="mt-2.5 line-clamp-2 text-[13.5px] font-semibold leading-snug text-[#191919] transition-colors group-hover:text-[#ef5360]">
                    {item.title}
                  </h4>

                  <div className="mt-1.5 text-[10px] font-normal uppercase tracking-wider text-gray-400">
                    {formatArticleDate(item.publishedAt)}
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
