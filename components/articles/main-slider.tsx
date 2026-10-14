"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Clock,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperCore } from "swiper";
import { Autoplay, Keyboard, A11y } from "swiper/modules";
import "swiper/css";
import { formatArticleDate, type Article } from "@/lib/mock/articles";

export interface BlogBannerSliderProps {
  articles: Article[];
}

export function MainSlider({ articles }: BlogBannerSliderProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [mounted, setMounted] = useState(false);
  const swiperRef = useRef<SwiperCore | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!articles || articles.length === 0) return null;

  return (
    <section
      className="main-slider blog-banner-slider relative w-full overflow-hidden py-4 sm:py-6"
      aria-label="Featured Wide Banners Carousel"
    >
      <div className="relative w-full overflow-hidden">
        {/* Edge Vignette Fades (smooth fade toward viewport edges) */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 z-30 w-12 sm:w-24 md:w-32 bg-gradient-to-r from-[#FDFCFD] via-[#FDFCFD]/60 to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 z-30 w-12 sm:w-24 md:w-32 bg-gradient-to-l from-[#FDFCFD] via-[#FDFCFD]/60 to-transparent" />

        {/* Left Arrow Button */}
        <button
          type="button"
          onClick={() => swiperRef.current?.slidePrev()}
          aria-label="Previous banner"
          className="absolute left-2 sm:left-[3vw] lg:left-[5vw] top-1/2 -translate-y-1/2 z-35 grid h-10 w-10 sm:h-12 sm:w-12 place-items-center rounded-full bg-white text-[#2B212B] shadow-[0_4px_18px_rgba(0,0,0,0.15)] border border-gray-100 transition-all duration-200 hover:scale-105 hover:text-[#ef5360] hover:shadow-[0_6px_22px_rgba(239,83,96,0.22)] active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#ef5360]"
        >
          <ChevronLeft size={22} />
        </button>

        {/* Right Arrow Button */}
        <button
          type="button"
          onClick={() => swiperRef.current?.slideNext()}
          aria-label="Next banner"
          className="absolute right-2 sm:right-[3vw] lg:right-[5vw] top-1/2 -translate-y-1/2 z-35 grid h-10 w-10 sm:h-12 sm:w-12 place-items-center rounded-full bg-white text-[#2B212B] shadow-[0_4px_18px_rgba(0,0,0,0.15)] border border-gray-100 transition-all duration-200 hover:scale-105 hover:text-[#ef5360] hover:shadow-[0_6px_22px_rgba(239,83,96,0.22)] active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#ef5360]"
        >
          <ChevronRight size={22} />
        </button>

        {/* Center-Mode Carousel Viewport */}
        {mounted ? (
          <Swiper
            modules={[Autoplay, Keyboard, A11y]}
            centeredSlides={true}
            slidesPerView="auto"
            spaceBetween={0}
            loop={articles.length >= 3}
            speed={550}
            slideToClickedSlide={true}
            grabCursor={true}
            keyboard={{ enabled: true }}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
            }}
            onSlideChange={(swiper) => {
              setActiveIndex(swiper.realIndex);
            }}
            className="w-full !overflow-visible"
          >
            {articles.map((article, idx) => (
              <SwiperSlide key={`${article.id}-${idx}`}>
                {({ isActive }) => (
                  <div className="blog-banner-card group relative">
                    {/* Dark Washout Veil on inactive/peeking side banners */}
                    <div className="banner-washout-veil" />

                    <Link
                      href={`/articles/${article.slug}`}
                      className={`block w-full focus:outline-none ${
                        !isActive ? "pointer-events-none" : ""
                      }`}
                      tabIndex={isActive ? 0 : -1}
                    >
                      {/* Wide Banner Image */}
                      <div className="relative aspect-[16/10] sm:aspect-[2.1/1] md:aspect-[2.35/1] w-full overflow-hidden bg-gray-950">
                        <img
                          src={article.coverImage}
                          alt={article.title}
                          className={`h-full w-full object-cover transition-transform duration-700 ease-out ${
                            isActive ? "group-hover:scale-[1.03]" : ""
                          }`}
                        />

                        {/* Multi-stop cinematic gradient overlay for text readability */}
                        <div
                          className="pointer-events-none absolute inset-0"
                          style={{
                            background:
                              "linear-gradient(to top, rgba(16, 10, 20, 0.95) 0%, rgba(16, 10, 20, 0.62) 42%, rgba(16, 10, 20, 0.15) 75%, rgba(0, 0, 0, 0.25) 100%)",
                          }}
                        />

                        {/* Top Badges (Category & Featured indicator) */}
                        <div className="absolute top-3 left-3 sm:top-5 sm:left-5 z-10 flex flex-wrap items-center gap-2">
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#ef5360] px-3 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-md">
                            <Sparkles size={12} />
                            <span>Featured Story</span>
                          </span>
                          <span className="rounded-full bg-black/50 backdrop-blur-md px-3 py-1 text-xs font-semibold text-white/90 border border-white/10">
                            {article.category}
                          </span>
                          <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-black/40 backdrop-blur-md px-3 py-1 text-xs text-white/80 border border-white/10">
                            <Calendar size={12} className="text-[#ef5360]" />
                            <span>{formatArticleDate(article.publishedAt)}</span>
                            <span>•</span>
                            <Clock size={12} className="text-[#ef5360]" />
                            <span>{article.readMinutes} min read</span>
                          </span>
                        </div>

                        {/* Banner Content Overlays (positioned at bottom) */}
                        <div className="absolute inset-x-0 bottom-0 z-10 p-5 sm:p-7 md:p-9 lg:p-10 flex flex-col justify-end">
                          <h2 className="text-lg sm:text-2xl md:text-3xl lg:text-[32px] font-extrabold text-white tracking-tight leading-snug line-clamp-2 max-w-4xl transition-colors duration-200 group-hover:text-[#ffb9b9]">
                            {article.title}
                          </h2>

                          <p className="mt-2 text-xs sm:text-sm text-gray-200 line-clamp-2 max-w-2xl leading-relaxed">
                            {article.excerpt}
                          </p>

                          {/* Footer Row: Author & 'Read More' CTA Button */}
                          <div className="mt-4 sm:mt-5 flex items-center justify-between gap-4 border-t border-white/15 pt-3.5 sm:pt-4">
                            <div className="flex items-center gap-2.5 sm:gap-3">
                              <img
                                src={article.author.avatar}
                                alt={article.author.name}
                                className="h-7 w-7 sm:h-9 sm:w-9 rounded-full object-cover ring-2 ring-white/40"
                              />
                              <div>
                                <div className="text-xs sm:text-sm font-bold text-white">
                                  {article.author.name}
                                </div>
                                <div className="text-[10px] sm:text-[11px] text-gray-300">
                                  {article.author.role}
                                </div>
                              </div>
                            </div>

                            {/* 'Read More' Button with hover effect */}
                            <div className="inline-flex items-center gap-2 rounded-full bg-[#ef5360] px-4 py-2 sm:px-5 sm:py-2.5 text-xs sm:text-sm font-bold text-white shadow-lg transition-all duration-300 group-hover:bg-[#ec3746] group-hover:gap-3 group-hover:shadow-[0_4px_20px_rgba(239,83,96,0.4)]">
                              <span>Read More</span>
                              <ArrowRight size={15} className="transition-transform duration-200 group-hover:translate-x-0.5" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                )}
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <div className="mx-auto w-[72vw] aspect-[2.2/1] rounded-3xl bg-gray-900 animate-pulse" />
        )}

        {/* Bottom Slide Indicators */}
        {articles.length > 1 && (
          <div className="mt-5 flex items-center justify-center gap-3">
            <span className="text-xs font-mono font-bold text-gray-400">
              {String(activeIndex + 1).padStart(2, "0")} / {String(articles.length).padStart(2, "0")}
            </span>
            <div className="flex items-center gap-1.5">
              {articles.map((item, idx) => (
                <button
                  key={`dot-${item.id}`}
                  type="button"
                  aria-label={`Go to banner ${idx + 1}`}
                  onClick={() => swiperRef.current?.slideToLoop(idx)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    activeIndex === idx
                      ? "w-7 bg-[#ef5360]"
                      : "w-2 bg-gray-300 hover:bg-gray-400"
                  }`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

// Named alias so either BlogBannerSlider or MainSlider can be imported
export const BlogBannerSlider = MainSlider;
