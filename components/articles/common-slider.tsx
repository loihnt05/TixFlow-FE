"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Flame,
  Calendar,
  Clock,
  ArrowRight,
} from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperCore } from "swiper";
import { Keyboard, A11y } from "swiper/modules";
import "swiper/css";
import { formatArticleDate, type Article } from "@/lib/mock/articles";

interface CommonSliderProps {
  articles: Article[];
  title?: string;
  subtitle?: string;
}

export function CommonSlider({
  articles,
  title = "Trending Stories & Editor's Picks",
  subtitle = "Handpicked festival highlights, lifestyle guides, and cultural moments",
}: CommonSliderProps) {
  const [mounted, setMounted] = useState(false);
  const swiperRef = useRef<SwiperCore | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!articles || articles.length === 0) return null;

  return (
    <section
      className="common-slider ts-common-slider relative w-full py-10 sm:py-12"
      aria-label="Common Carousel Articles Slider"
    >
      <div className="container">
        {/* Section Header with Navigation Controls */}
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <div className="mb-1.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#ef5360]">
              <Flame size={14} />
              <span>Trending Highlights</span>
            </div>
            <h2 className="text-xl font-bold tracking-tight text-[#2B212B] sm:text-2xl md:text-3xl">
              {title}
            </h2>
            <p className="mt-1 text-xs text-[#8E8E8E] sm:text-sm">
              {subtitle}
            </p>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              type="button"
              onClick={() => swiperRef.current?.slidePrev()}
              aria-label="Previous trending slide"
              className="grid h-9 w-9 sm:h-10 sm:w-10 place-items-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-2xs transition-all hover:border-[#ef5360] hover:text-[#ef5360] hover:shadow-xs active:scale-95"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={() => swiperRef.current?.slideNext()}
              aria-label="Next trending slide"
              className="grid h-9 w-9 sm:h-10 sm:w-10 place-items-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-2xs transition-all hover:border-[#ef5360] hover:text-[#ef5360] hover:shadow-xs active:scale-95"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Multi-card Carousel */}
        {mounted ? (
          <Swiper
            modules={[Keyboard, A11y]}
            slidesPerView={1.15}
            spaceBetween={16}
            breakpoints={{
              540: { slidesPerView: 2.15, spaceBetween: 16 },
              768: { slidesPerView: 3, spaceBetween: 18 },
              1024: { slidesPerView: 4, spaceBetween: 20 },
            }}
            keyboard={{ enabled: true }}
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
            }}
            className="w-full !overflow-visible"
          >
            {articles.map((article) => (
              <SwiperSlide key={article.id}>
                <Link
                  href={`/articles/${article.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-2xs transition-all duration-300 hover:-translate-y-1 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#ef5360]"
                >
                  {/* Card Image */}
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

                  {/* Card Body */}
                  <div className="flex flex-1 flex-col justify-between p-4 sm:p-5">
                    <div>
                      <div className="mb-2 flex items-center gap-2 text-[11px] text-[#8E8E8E]">
                        <span className="flex items-center gap-1">
                          <Calendar size={12} className="text-[#ef5360]" />
                          <span>{formatArticleDate(article.publishedAt)}</span>
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock size={12} className="text-[#ef5360]" />
                          <span>{article.readMinutes}m</span>
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
                        <span className="truncate text-[11px] font-medium text-gray-700">
                          {article.author.name}
                        </span>
                      </div>

                      <span className="inline-flex items-center gap-1 text-xs font-bold text-[#ef5360] group-hover:translate-x-1 transition-transform shrink-0">
                        <span>Read</span>
                        <ArrowRight size={13} />
                      </span>
                    </div>
                  </div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {articles.slice(0, 4).map((a) => (
              <div
                key={a.id}
                className="aspect-[16/12] rounded-2xl bg-gray-100 animate-pulse"
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
