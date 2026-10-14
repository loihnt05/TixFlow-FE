"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  ChevronDown,
  Compass,
  Menu,
  X,
  BookOpen,
  Award,
  Layers,
} from "lucide-react";

interface BlogNavHeaderProps {
  categories: string[];
  onSelectCategory?: (category: string) => void;
  onOpenSearch?: () => void;
}

export function BlogNavHeader({
  categories,
  onSelectCategory,
  onOpenSearch,
}: BlogNavHeaderProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-100 bg-white/95 shadow-[0_2px_12px_rgba(0,0,0,0.03)] backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between gap-4">
        {/* Left: Brand Logo */}
        <div className="flex items-center gap-3">
          <Link href="/articles" className="flex items-center gap-2 group">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#ef5360] text-white shadow-md">
              <Compass size={18} />
            </span>
            <div className="flex flex-col">
              <span className="text-lg font-black tracking-tight text-[#2B212B]">
                Tix<span className="text-[#ef5360]">Flow</span>
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 -mt-1">
                Editorial &amp; Blog
              </span>
            </div>
          </Link>
        </div>

        {/* Center: Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          <Link
            href="/"
            className="rounded-lg px-3 py-2 text-sm font-semibold text-gray-700 transition-colors hover:text-[#ef5360] hover:bg-gray-50"
          >
            Home
          </Link>

          <a
            href="#editors-picks"
            className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold text-gray-700 transition-colors hover:text-[#ef5360] hover:bg-gray-50"
          >
            <Award size={14} className="text-[#ef5360]" />
            <span>Editors&apos; Picks</span>
          </a>

          {/* Category Dropdown Menu */}
          <div
            className="relative"
            onMouseEnter={() => setDropdownOpen(true)}
            onMouseLeave={() => setDropdownOpen(false)}
          >
            <button
              type="button"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              aria-expanded={dropdownOpen}
              className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-semibold text-gray-700 transition-colors hover:text-[#ef5360] hover:bg-gray-50"
            >
              <span>Category</span>
              <ChevronDown
                size={14}
                className={`transition-transform duration-200 ${
                  dropdownOpen ? "rotate-180 text-[#ef5360]" : ""
                }`}
              />
            </button>

            {dropdownOpen && (
              <div className="absolute left-0 top-full mt-1 w-56 rounded-2xl border border-gray-100 bg-white p-2 shadow-xl animate-in fade-in slide-in-from-top-2 duration-150 z-50">
                <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                  Browse by Category
                </div>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => {
                      onSelectCategory?.(cat);
                      setDropdownOpen(false);
                      const el = document.getElementById("all-stories");
                      el?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-medium text-gray-700 transition-colors hover:bg-[#FFEFF0] hover:text-[#ef5360] text-left"
                  >
                    <span>{cat === "all" ? "All Categories" : cat}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <a
            href="#playbooks"
            className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold text-gray-700 transition-colors hover:text-[#ef5360] hover:bg-gray-50"
          >
            <BookOpen size={14} className="text-[#ef5360]" />
            <span>Reviews &amp; Guides</span>
          </a>

          <a
            href="#all-stories"
            className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold text-gray-700 transition-colors hover:text-[#ef5360] hover:bg-gray-50"
          >
            <Layers size={14} className="text-[#ef5360]" />
            <span>All Stories</span>
          </a>
        </nav>

        {/* Right: Search Icon Button & Mobile Menu Toggle */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenSearch}
            aria-label="Search articles"
            className="flex h-10 w-10 items-center justify-center rounded-full text-gray-600 transition-colors hover:bg-[#FFEFF0] hover:text-[#ef5360]"
            title="Search articles"
          >
            <Search size={18} />
          </button>

          {/* Mobile hamburger menu toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="flex h-10 w-10 md:hidden items-center justify-center rounded-full text-gray-600 hover:bg-gray-100"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="border-t border-gray-100 bg-white px-5 py-4 shadow-lg md:hidden animate-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col space-y-2">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-sm font-semibold text-gray-800 hover:text-[#ef5360]"
            >
              Home
            </Link>
            <a
              href="#editors-picks"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-sm font-semibold text-gray-800 hover:text-[#ef5360]"
            >
              Editors&apos; Picks
            </a>
            <div className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-gray-400">
              Categories
            </div>
            <div className="grid grid-cols-2 gap-1 px-3">
              {categories.slice(0, 8).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    onSelectCategory?.(cat);
                    setMobileMenuOpen(false);
                    const el = document.getElementById("all-stories");
                    el?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="text-left text-xs text-gray-600 py-1.5 hover:text-[#ef5360]"
                >
                  • {cat === "all" ? "All Categories" : cat}
                </button>
              ))}
            </div>
            <a
              href="#playbooks"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-sm font-semibold text-gray-800 hover:text-[#ef5360]"
            >
              Reviews &amp; Guides
            </a>
            <a
              href="#all-stories"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-sm font-semibold text-gray-800 hover:text-[#ef5360]"
            >
              All Stories
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
