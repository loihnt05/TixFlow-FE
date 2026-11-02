"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Article } from "@/lib/mock/articles";

interface BlogTopBarProps {
  hotArticles?: Article[];
}

export function BlogTopBar({ hotArticles = [] }: BlogTopBarProps) {
  const [currentIdx, setCurrentIdx] = useState(0);

  useEffect(() => {
    if (hotArticles.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % hotArticles.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [hotArticles.length]);

  const activeArticle = hotArticles[currentIdx] || hotArticles[0];

  return (
    <div className="w-full bg-[#111111] text-white text-xs">
      <div className="container flex h-9 items-center justify-between gap-4">
        {/* Left: Zipevent Red 'TRENDING NOW' Rectangle + Cycling Headline */}
        <div className="flex min-w-0 items-center gap-3 overflow-hidden">
          <span className="shrink-0 bg-[#e5192b] px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white">
            TRENDING NOW
          </span>

          {activeArticle && (
            <Link
              href={`/articles/${activeArticle.slug}`}
              className="truncate text-[12px] font-normal text-white/90 transition-colors hover:text-[#ff858f]"
            >
              {activeArticle.title}
            </Link>
          )}
        </div>

        {/* Right: Clean Minimalist Social Icons */}
        <div className="hidden sm:flex items-center gap-3.5 shrink-0 text-white/90">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
            className="text-[12px] font-semibold transition-colors hover:text-[#ef5360]"
          >
            f
          </a>
          <a
            href="https://x.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="X"
            className="text-[12px] font-semibold transition-colors hover:text-[#ef5360]"
          >
            𝕏
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="text-[11px] font-medium transition-colors hover:text-[#ef5360]"
          >
            IG
          </a>
          <a
            href="https://tiktok.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="TikTok"
            className="text-[12px] font-medium transition-colors hover:text-[#ef5360]"
          >
            ♪
          </a>
          <a
            href="https://youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="YouTube"
            className="text-[11px] font-medium transition-colors hover:text-[#ef5360]"
          >
            ▶
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="text-[11.5px] font-semibold transition-colors hover:text-[#ef5360]"
          >
            in
          </a>
        </div>
      </div>
    </div>
  );
}
