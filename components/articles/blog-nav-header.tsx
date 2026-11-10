"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, ChevronDown, Ticket, Menu, X } from "lucide-react";
import { OrganizerOnly } from "@/components/organizer-only";
import { formatArticleDate, type Article } from "@/lib/mock/articles";

interface BlogNavHeaderProps {
  categories: string[];
  editorsPickPreviews?: Article[];
  onSelectCategory?: (category: string) => void;
  onOpenSearch?: () => void;
}

export function BlogNavHeader({
  categories,
  editorsPickPreviews = [],
  onSelectCategory,
  onOpenSearch,
}: BlogNavHeaderProps) {
  const [openMenu, setOpenMenu] = useState<
    null | "picks" | "category" | "guidelines" | "reviews"
  >(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const visibleCategories = categories.filter((c) => c !== "all");

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-200/80 bg-white shadow-[0_1px_8px_rgba(0,0,0,0.03)]">
      <div className="container relative flex h-[74px] items-center justify-between gap-4">
        {/* Left: Zipevent-inspired Brand Logo */}
        <Link href="/blog" className="flex items-center gap-2.5 group shrink-0">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-tr from-[#ef5360] to-[#ff8c66] text-white shadow-sm transition-transform group-hover:scale-105">
            <Ticket size={18} strokeWidth={2.2} />
          </span>
          <span className="text-[23px] font-normal tracking-tight text-[#2B212B]">
            tix<span className="font-semibold text-[#ef5360]">flow</span>
          </span>
        </Link>

        {/* Center: Uppercase Editorial Navigation matching blog.zipeventapp.com */}
        <nav
          className="hidden md:flex items-center gap-5 lg:gap-7"
          aria-label="Blog navigation"
        >
          <Link
            href="/"
            className="py-2 text-[12px] font-semibold uppercase tracking-wider text-[#191919] transition-colors hover:text-[#ef5360]"
          >
            HOME
          </Link>

          <Link
            href="/events"
            className="py-2 text-[12px] font-semibold uppercase tracking-wider text-[#191919] transition-colors hover:text-[#ef5360]"
          >
            EVENTS
          </Link>

          {/* EDITORS' PICKS Mega Preview Dropdown */}
          <div
            className="static"
            onMouseEnter={() => setOpenMenu("picks")}
            onMouseLeave={() => setOpenMenu(null)}
          >
            <a
              href="#editors-picks"
              onClick={() => setOpenMenu(null)}
              className="flex items-center gap-1 py-6 text-[12px] font-semibold uppercase tracking-wider text-[#191919] transition-colors hover:text-[#ef5360]"
            >
              <span>EDITORS&apos; PICKS</span>
              <ChevronDown size={13} className="text-gray-400" />
            </a>

            {openMenu === "picks" && editorsPickPreviews.length > 0 && (
              <div className="absolute inset-x-0 top-full border-t border-gray-100 bg-white p-6 shadow-xl z-50">
                <div className="grid grid-cols-4 gap-5">
                  {editorsPickPreviews.slice(0, 4).map((post) => (
                    <Link
                      key={post.id}
                      href={`/blog/${post.slug}`}
                      onClick={() => setOpenMenu(null)}
                      className="group block"
                    >
                      <div className="aspect-[16/10] w-full overflow-hidden bg-gray-100">
                        <img
                          src={post.coverImage}
                          alt={post.title}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                      <h4 className="mt-2.5 line-clamp-2 text-xs font-medium leading-snug text-[#191919] group-hover:text-[#ef5360]">
                        {post.title}
                      </h4>
                      <span className="mt-1 block text-[10px] uppercase tracking-wider text-gray-400">
                        {formatArticleDate(post.publishedAt)}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* CATEGORY Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setOpenMenu("category")}
            onMouseLeave={() => setOpenMenu(null)}
          >
            <button
              type="button"
              onClick={() => setOpenMenu(openMenu === "category" ? null : "category")}
              className="flex items-center gap-1 py-6 text-[12px] font-semibold uppercase tracking-wider text-[#191919] transition-colors hover:text-[#ef5360]"
            >
              <span>CATEGORY</span>
              <ChevronDown size={13} className="text-gray-400" />
            </button>

            {openMenu === "category" && (
              <div className="absolute left-0 top-full w-56 border border-gray-100 bg-white py-2 shadow-xl z-50">
                <button
                  type="button"
                  onClick={() => {
                    onSelectCategory?.("all");
                    setOpenMenu(null);
                  }}
                  className="block w-full px-4 py-2 text-left text-xs font-medium text-gray-700 hover:bg-[#FFEFF0] hover:text-[#ef5360]"
                >
                  All Categories
                </button>
                {visibleCategories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => {
                      onSelectCategory?.(cat);
                      setOpenMenu(null);
                    }}
                    className="block w-full px-4 py-2 text-left text-xs font-normal text-gray-700 hover:bg-[#FFEFF0] hover:text-[#ef5360]"
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* EVENT GUIDELINES Dropdown (Editorial Playbooks; Organizer Studio link gated strictly by OrganizerOnly) */}
          <div
            className="relative"
            onMouseEnter={() => setOpenMenu("guidelines")}
            onMouseLeave={() => setOpenMenu(null)}
          >
            <a
              href="#event-guidelines"
              onClick={() => setOpenMenu(null)}
              className="flex items-center gap-1 py-6 text-[12px] font-semibold uppercase tracking-wider text-[#191919] transition-colors hover:text-[#ef5360]"
            >
              <span>EVENT GUIDELINES</span>
              <ChevronDown size={13} className="text-gray-400" />
            </a>

            {openMenu === "guidelines" && (
              <div className="absolute left-0 top-full w-56 border border-gray-100 bg-white py-2 shadow-xl z-50">
                <button
                  type="button"
                  onClick={() => {
                    onSelectCategory?.("Event Guidelines");
                    setOpenMenu(null);
                  }}
                  className="block w-full px-4 py-2 text-left text-xs font-normal text-gray-700 hover:bg-[#FFEFF0] hover:text-[#ef5360]"
                >
                  Ticketing &amp; Registration Guides
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onSelectCategory?.("Event News");
                    setOpenMenu(null);
                  }}
                  className="block w-full px-4 py-2 text-left text-xs font-normal text-gray-700 hover:bg-[#FFEFF0] hover:text-[#ef5360]"
                >
                  Event Marketing &amp; PR
                </button>
                <OrganizerOnly>
                  <Link
                    href="/organizer"
                    onClick={() => setOpenMenu(null)}
                    className="block w-full border-t border-gray-100 px-4 py-2 text-left text-xs font-medium text-[#ef5360] hover:bg-[#FFEFF0]"
                  >
                    Organizer Workspace →
                  </Link>
                </OrganizerOnly>
              </div>
            )}
          </div>

          {/* REVIEWS Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setOpenMenu("reviews")}
            onMouseLeave={() => setOpenMenu(null)}
          >
            <a
              href="#art-entertainment"
              onClick={() => setOpenMenu(null)}
              className="flex items-center gap-1 py-6 text-[12px] font-semibold uppercase tracking-wider text-[#191919] transition-colors hover:text-[#ef5360]"
            >
              <span>REVIEWS</span>
              <ChevronDown size={13} className="text-gray-400" />
            </a>

            {openMenu === "reviews" && (
              <div className="absolute left-0 top-full w-52 border border-gray-100 bg-white py-2 shadow-xl z-50">
                <button
                  type="button"
                  onClick={() => {
                    onSelectCategory?.("Art & Entertainment");
                    setOpenMenu(null);
                  }}
                  className="block w-full px-4 py-2 text-left text-xs font-normal text-gray-700 hover:bg-[#FFEFF0] hover:text-[#ef5360]"
                >
                  Concerts &amp; Cinema Reviews
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onSelectCategory?.("Food & Travel");
                    setOpenMenu(null);
                  }}
                  className="block w-full px-4 py-2 text-left text-xs font-normal text-gray-700 hover:bg-[#FFEFF0] hover:text-[#ef5360]"
                >
                  Cafes &amp; Exhibition Hopping
                </button>
              </div>
            )}
          </div>
        </nav>

        {/* Right: Search Trigger & Mobile Menu */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={onOpenSearch}
            aria-label="Search blog"
            className="grid h-9 w-9 place-items-center rounded-full text-[#191919] transition-colors hover:bg-gray-100 hover:text-[#ef5360]"
          >
            <Search size={17} strokeWidth={2} />
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle blog menu"
            className="grid h-9 w-9 place-items-center rounded-full text-[#191919] hover:bg-gray-100 md:hidden"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="border-t border-gray-100 bg-white px-4 py-4 shadow-lg md:hidden">
          <div className="flex flex-col space-y-1 text-xs font-semibold uppercase tracking-wider text-[#191919]">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-lg px-3 py-2.5 hover:bg-gray-50 hover:text-[#ef5360]"
            >
              HOME
            </Link>
            <Link
              href="/events"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-lg px-3 py-2.5 hover:bg-gray-50 hover:text-[#ef5360]"
            >
              ALL EVENTS
            </Link>
            <a
              href="#editors-picks"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-lg px-3 py-2.5 hover:bg-gray-50 hover:text-[#ef5360]"
            >
              EDITORS&apos; PICKS
            </a>
            <a
              href="#event-guidelines"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-lg px-3 py-2.5 hover:bg-gray-50 hover:text-[#ef5360]"
            >
              EVENT GUIDELINES
            </a>
            <div className="border-t border-gray-100 pt-2 mt-2">
              <div className="px-3 py-1 text-[10px] font-medium text-gray-400">
                CATEGORIES
              </div>
              <div className="flex flex-wrap gap-1.5 px-3 pt-1.5">
                {visibleCategories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => {
                      onSelectCategory?.(cat);
                      setMobileMenuOpen(false);
                    }}
                    className="rounded-full border border-gray-200 px-2.5 py-1 text-[11px] font-normal normal-case tracking-normal text-gray-600 hover:border-[#ef5360] hover:text-[#ef5360]"
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
