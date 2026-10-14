"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Calendar,
  Clock,
  ArrowRight,
  Award,
} from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperCore } from "swiper";
import { Keyboard, A11y } from "swiper/modules";
import "swiper/css";
import { formatArticleDate, type Article } from "@/lib/mock/articles";

interface ClassicSliderProps {
  articles: Article[];
  title?: string;
  subtitle?: string;
}

export function ClassicSlider({
  articles,
  title = "Organizer Playbooks & Masterclasses",
  subtitle = "Field-tested operational blueprints, marketing tactics, and ticketing masterclasses",
}: ClassicSliderProps) {
  const [mounted, setMounted] = useState(false);
  const swiperRef = useRef<SwiperCore | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!articles || articles.length === 0) return null;

  return (
    <section
      className="classic-slider ts-classic-slider relative w-full py-10 sm:py-14 bg-gradient-to-b from-[#FFFDFD] via-white to-[#FDFCFD] border-y border-gray-100"
      aria-label="Classic Editorial Articles Slider"
    >
      <div className="container">
        {/* Section Header */}
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <div className="mb-1.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#ef5360]">
              <BookOpen size={14} />
              <span>Classic Playbooks</span>
            </div>
            <h2 className="text-xl font-extrabold tracking-tight text-[#2B212B] sm:text-2xl md:text-3xl">
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
              aria-label="Previous classic slide"
              className="grid h-9 w-9 sm:h-10 sm:w-10 place-items-center rounded-full border border-gray-300 bg-white text-gray-700 shadow-2xs transition-all hover:border-[#ef5360] hover:text-[#ef5360] hover:shadow-xs active:scale-95"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={() => swiperRef.current?.slideNext()}
              aria-label="Next classic slide"
              className="grid h-9 w-9 sm:h-10 sm:w-10 place-items-center rounded-full border border-gray-300 bg-white text-gray-700 shadow-2xs transition-all hover:border-[#ef5360] hover:text-[#ef5360] hover:shadow-xs active:scale-95"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Classic Slider Carousel */}
        {mounted ? (
          <Swiper
            modules={[Keyboard, A11y]}
            slidesPerView={1.1}
            spaceBetween={18}
            breakpoints={{
              640: { slidesPerView: 2, spaceBetween: 20 },
              1024: { slidesPerView: 3, spaceBetween: 24 },
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
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border-2 border-gray-200/90 bg-white shadow-xs transition-all duration-300 hover:border-[#ef5360] hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[#ef5360]"
                >
                  {/* Classic Card Header / Thumbnail */}
                  <div className="relative aspect-[16/9] w-full overflow-hidden bg-gray-100">
                    <img
                      src={article.coverImage}
                      alt={article.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    />
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full bg-white/90 backdrop-blur-md px-3 py-0.5 text-[11px] font-bold text-[#ef5360] shadow-xs">
                      <Award size={12} />
                      <span>{article.category}</span>
                    </div>
                  </div>

                  {/* Classic Card Body */}
                  <div className="flex flex-1 flex-col justify-between p-6">
                    <div>
                      {/* Tags */}
                      <div className="mb-2.5 flex flex-wrap gap-1.5">
                        {article.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="rounded-md bg-gray-100 px-2 py-0.5 text-[10px] font-semibold text-gray-600 uppercase tracking-wider"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>

                      <h3 className="line-clamp-2 text-base sm:text-lg font-bold tracking-tight text-[#2B212B] transition-colors group-hover:text-[#ef5360]">
                        {article.title}
                      </h3>

                      <p className="mt-2.5 line-clamp-3 text-xs leading-relaxed text-gray-600">
                        {article.excerpt}
                      </p>
                    </div>

                    <div className="mt-6 border-t border-gray-100 pt-4">
                      {/* Author & Read Time */}
                      <div className="flex items-center justify-between mb-3 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar size={12} className="text-[#ef5360]" />
                          <span>{formatArticleDate(article.publishedAt)}</span>
                        </span>
                        <span className="flex items-center gap-1 font-medium">
                          <Clock size={12} className="text-[#ef5360]" />
                          <span>{article.readMinutes} min read</span>
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5 truncate pr-2">
                          <img
                            src={article.author.avatar}
                            alt={article.author.name}
                            className="h-7 w-7 rounded-full object-cover ring-1 ring-gray-200"
                          />
                          <div className="truncate">
                            <div className="truncate text-xs font-bold text-gray-900">
                              {article.author.name}
                            </div>
                            <div className="text-[10px] text-gray-400">
                              {article.author.role}
                            </div>
                          </div>
                        </div>

                        <span className="inline-flex items-center gap-1 text-xs font-bold text-[#ef5360] group-hover:translate-x-1 transition-transform shrink-0">
                          <span>Read</span>
                          <ArrowRight size={14} />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {articles.slice(0, 3).map((a) => (
              <div
                key={a.id}
                className="aspect-[16/11] rounded-2xl bg-gray-100 animate-pulse"
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
