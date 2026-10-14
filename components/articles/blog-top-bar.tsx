"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Sparkles, ChevronRight } from "lucide-react";
import type { Article } from "@/lib/mock/articles";

interface BlogTopBarProps {
  hotArticles?: Article[];
}

export function BlogTopBar({ hotArticles = [] }: BlogTopBarProps) {
  const [currentIdx, setCurrentIdx] = useState(0);

  // Cycle through trending headlines every 4.5 seconds
  useEffect(() => {
    if (hotArticles.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % hotArticles.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [hotArticles.length]);

  const activeArticle = hotArticles[currentIdx] || hotArticles[0];

  return (
    <div className="w-full bg-[#2B212B] text-white border-b border-black/20 text-xs">
      <div className="container flex h-10 items-center justify-between gap-4">
        {/* Left: 'TRENDING NOW' Badge & Headline */}
        <div className="flex items-center gap-3 overflow-hidden">
          <span className="inline-flex items-center gap-1.5 shrink-0 rounded-xs bg-[#ef5360] px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-white shadow-xs">
            <Sparkles size={11} />
            <span>Trending Now</span>
          </span>

          {activeArticle && (
            <Link
              href={`/articles/${activeArticle.slug}`}
              className="truncate text-xs text-gray-200 transition-colors hover:text-[#ffb9b9] flex items-center gap-1.5 font-medium"
            >
              <span className="truncate">{activeArticle.title}</span>
              <ChevronRight size={13} className="shrink-0 text-[#ef5360]" />
            </Link>
          )}
        </div>

        {/* Right: Social Media Icons */}
        <div className="hidden sm:flex items-center gap-3 shrink-0 text-gray-300">
          <span className="text-[11px] font-medium text-gray-400">Follow us:</span>
          <div className="flex items-center gap-2">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="grid h-6 w-6 place-items-center rounded-full bg-white/10 text-xs font-bold text-white transition-all hover:bg-[#ef5360] hover:scale-110"
              title="Facebook"
            >
              f
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="grid h-6 w-6 place-items-center rounded-full bg-white/10 text-xs font-bold text-white transition-all hover:bg-[#ef5360] hover:scale-110"
              title="Instagram"
            >
              in
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="X / Twitter"
              className="grid h-6 w-6 place-items-center rounded-full bg-white/10 text-xs font-bold text-white transition-all hover:bg-[#ef5360] hover:scale-110"
              title="X"
            >
              𝕏
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
              className="grid h-6 w-6 place-items-center rounded-full bg-white/10 text-xs font-bold text-white transition-all hover:bg-[#ef5360] hover:scale-110"
              title="YouTube"
            >
              ▶
            </a>
            <a
              href="https://tiktok.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok"
              className="grid h-6 w-6 place-items-center rounded-full bg-white/10 text-xs font-bold text-white transition-all hover:bg-[#ef5360] hover:scale-110"
              title="TikTok"
            >
              ♪
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="grid h-6 w-6 place-items-center rounded-full bg-white/10 text-xs font-bold text-white transition-all hover:bg-[#ef5360] hover:scale-110"
              title="LinkedIn"
            >
              li
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
