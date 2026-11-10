"use client";

import Link from "next/link";
import { Ticket, ArrowUp } from "lucide-react";
import {
  blogSidebarCategories,
  formatArticleDate,
  getArticles,
} from "@/lib/mock/articles";

export function BlogFooter() {
  const latestPosts = getArticles().slice(0, 3);

  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <footer className="main-footer bg-[#191919] text-white">
      {/* Upper 3-Column Magazine Footer (matches blog.zipeventapp.com) */}
      <div className="container max-w-[1160px] py-12 sm:py-14">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          {/* Column 1: ABOUT */}
          <div>
            <div className="relative mb-6 border-b border-white/15 pb-2.5">
              <h5 className="text-xs font-bold uppercase tracking-widest text-white">
                ABOUT
              </h5>
              <span className="absolute -bottom-[1px] left-0 h-[2px] w-14 bg-[#ef5360]" />
            </div>

            <Link href="/blog" className="inline-flex items-center gap-2.5">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-tr from-[#ef5360] to-[#ff8c66] text-white shadow-sm">
                <Ticket size={19} strokeWidth={2.2} />
              </span>
              <span className="text-2xl font-normal tracking-tight text-white">
                tix<span className="font-semibold text-[#ef5360]">flow</span>
              </span>
            </Link>

            <div className="mt-4 space-y-1.5 text-xs leading-relaxed text-gray-300">
              <p>
                Have questions, press inquiries, or event partnership ideas? Reach
                out to our editorial &amp; organizer support team:
              </p>
              <p className="pt-1">
                <span className="text-gray-400">Email :</span>{" "}
                <a
                  href="mailto:support@tixflow.app"
                  className="text-white hover:text-[#ef5360]"
                >
                  support@tixflow.app
                </a>
              </p>
              <p>
                <span className="text-gray-400">Call center :</span> 02 038 5150
              </p>
              <p>
                <span className="text-gray-400">Mon – Fri :</span> 10.00 – 18.00
              </p>
            </div>

            <div className="mt-5 flex items-center gap-2">
              {[
                { label: "Facebook", text: "f", href: "https://facebook.com" },
                { label: "X (Twitter)", text: "𝕏", href: "https://x.com" },
                { label: "Instagram", text: "IG", href: "https://instagram.com" },
                { label: "YouTube", text: "▶", href: "https://youtube.com" },
                { label: "LinkedIn", text: "in", href: "https://linkedin.com" },
                { label: "TikTok", text: "♪", href: "https://tiktok.com" },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="grid h-8 w-8 place-items-center rounded-full bg-white/10 text-xs font-semibold text-white transition-colors hover:bg-[#ef5360]"
                >
                  {social.text}
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: LATEST POSTS */}
          <div>
            <div className="relative mb-6 border-b border-white/15 pb-2.5">
              <h5 className="text-xs font-bold uppercase tracking-widest text-white">
                LATEST POSTS
              </h5>
              <span className="absolute -bottom-[1px] left-0 h-[2px] w-14 bg-[#ef5360]" />
            </div>

            <ul className="space-y-4">
              {latestPosts.map((post) => (
                <li key={post.id} className="flex items-start gap-3.5">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="group relative aspect-[1.91/1] w-[108px] shrink-0 overflow-hidden bg-black/40"
                  >
                    <img
                      src={post.coverImage}
                      alt={post.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </Link>
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="line-clamp-2 text-xs font-medium leading-snug text-gray-100 transition-colors hover:text-[#ef5360]"
                    >
                      {post.title}
                    </Link>
                    <time className="mt-1 block text-[10px] uppercase tracking-wider text-gray-400">
                      {formatArticleDate(post.publishedAt)}
                    </time>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: CATEGORIES TAG CLOUD */}
          <div>
            <div className="relative mb-6 border-b border-white/15 pb-2.5">
              <h5 className="text-xs font-bold uppercase tracking-widest text-white">
                CATEGORIES
              </h5>
              <span className="absolute -bottom-[1px] left-0 h-[2px] w-14 bg-[#ef5360]" />
            </div>

            <div className="flex flex-wrap gap-2">
              {blogSidebarCategories.map((category) => (
                <Link
                  key={category}
                  href={`/blog?category=${encodeURIComponent(category)}`}
                  className="rounded-[3px] bg-[#2a2a2a] px-3 py-1.5 text-xs text-gray-200 transition-colors hover:bg-[#e31e24] hover:text-white"
                >
                  {category}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Lower Footer Bar (#2b212b matching zipevent_styles.css line 48) */}
      <div className="bg-[#2b212b] py-4 text-xs text-white/75">
        <div className="container max-w-[1160px] flex flex-col items-center justify-between gap-3 sm:flex-row">
          <p>© {new Date().getFullYear()} TixFlow Blog — Inspiration Everywhere.</p>
          <button
            type="button"
            onClick={scrollToTop}
            className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-white/80 transition-colors hover:text-white"
          >
            <span>Top</span>
            <ArrowUp size={13} />
          </button>
        </div>
      </div>
    </footer>
  );
}
