"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperCore } from "swiper";
import { Autoplay, Keyboard, A11y } from "swiper/modules";
import "swiper/css";
import type { Article } from "@/lib/mock/articles";

export interface BlogBannerSliderProps {
  articles: Article[];
}

export function MainSlider({ articles }: BlogBannerSliderProps) {
  const [mounted, setMounted] = useState(false);
  const swiperRef = useRef<SwiperCore | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!articles || articles.length === 0) return null;

  return (
    <section
      className="main-slider blog-banner-slider relative w-full overflow-hidden bg-white"
      aria-label="Featured Blog Stories"
    >
      <div className="relative w-full overflow-hidden">
        {/* Square Outlined Previous Button on Peeking Seam (matches blog.zipeventapp.com) */}
        <button
          type="button"
          onClick={() => swiperRef.current?.slidePrev()}
          aria-label="Previous story"
          className="absolute left-3 sm:left-[12vw] lg:left-[20.5vw] top-1/2 -translate-y-1/2 z-30 grid h-9 w-9 place-items-center border border-white/75 bg-black/25 text-white backdrop-blur-xs transition-colors hover:border-[#ef5360] hover:bg-[#ef5360]"
        >
          <ChevronLeft size={18} strokeWidth={1.8} />
        </button>

        {/* Square Outlined Next Button on Peeking Seam */}
        <button
          type="button"
          onClick={() => swiperRef.current?.slideNext()}
          aria-label="Next story"
          className="absolute right-3 sm:right-[12vw] lg:right-[20.5vw] top-1/2 -translate-y-1/2 z-30 grid h-9 w-9 place-items-center border border-white/75 bg-black/25 text-white backdrop-blur-xs transition-colors hover:border-[#ef5360] hover:bg-[#ef5360]"
        >
          <ChevronRight size={18} strokeWidth={1.8} />
        </button>

        {mounted ? (
          <Swiper
            modules={[Autoplay, Keyboard, A11y]}
            centeredSlides={true}
            slidesPerView="auto"
            spaceBetween={6}
            loop={articles.length >= 3}
            speed={500}
            slideToClickedSlide={true}
            grabCursor={true}
            keyboard={{ enabled: true }}
            autoplay={{
              delay: 5200,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
            }}
            className="w-full !overflow-visible"
          >
            {articles.map((article, idx) => (
              <SwiperSlide key={`${article.id}-${idx}`}>
                {({ isActive }) => (
                  <div className="blog-banner-card group relative">
                    <div className="banner-washout-veil" />

                    <Link
                      href={`/blog/${article.slug}`}
                      className={`block w-full ${!isActive ? "pointer-events-none" : ""}`}
                      tabIndex={isActive ? 0 : -1}
                    >
                      <div className="relative h-[250px] sm:h-[340px] lg:h-[400px] w-full overflow-hidden bg-gray-900">
                        <img
                          src={article.coverImage}
                          alt={article.title}
                          className={`h-full w-full object-cover transition-transform duration-700 ease-out ${
                            isActive ? "group-hover:scale-[1.03]" : ""
                          }`}
                        />

                        {/* Bottom Dark Editorial Gradient */}
                        <div
                          className="pointer-events-none absolute inset-0"
                          style={{
                            background:
                              "linear-gradient(to top, rgba(12, 12, 16, 0.88) 0%, rgba(12, 12, 16, 0.42) 48%, rgba(0, 0, 0, 0.08) 100%)",
                          }}
                        />

                        {/* Active Slide Bottom Caption & Outlined 'READ MORE' */}
                        <div className="blog-banner-caption absolute inset-x-0 bottom-0 z-10 flex flex-col justify-between gap-4 p-5 sm:flex-row sm:items-end sm:p-7">
                          <div className="max-w-xl">
                            <span className="inline-block rounded-[3px] bg-white px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#191919]">
                              {article.category}
                            </span>

                            <h2 className="mt-2.5 line-clamp-2 text-base sm:text-xl lg:text-[22px] font-semibold leading-snug text-white transition-colors group-hover:text-[#ffd6da]">
                              {article.title}
                            </h2>

                            <p className="mt-1.5 hidden sm:line-clamp-1 text-xs font-normal text-white/80">
                              {article.excerpt}
                            </p>
                          </div>

                          <span className="shrink-0 self-start sm:self-auto border border-white/85 px-4 py-1.5 text-[10.5px] font-medium uppercase tracking-widest text-white transition-colors group-hover:bg-white group-hover:text-[#191919]">
                            READ MORE
                          </span>
                        </div>
                      </div>
                    </Link>
                  </div>
                )}
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <div className="mx-auto h-[250px] sm:h-[340px] lg:h-[400px] w-full bg-gray-100 animate-pulse" />
        )}
      </div>
    </section>
  );
}
