"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  ChevronDown,
  Globe,
  LogOut,
  Menu,
  PlusCircle,
  Search,
  Sparkles,
  Ticket,
  User,
  X,
  Calendar,
  Layers,
  Compass,
  FileText,
  ShoppingBag,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";
import { useKeycloakAuth } from "@/components/auth-provider";
import { eventCategories } from "@/lib/mock/events";

interface LanguageOption {
  code: string;
  name: string;
  flag: string;
}

const languages: LanguageOption[] = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "th", name: "ไทย", flag: "🇹🇭" },
  { code: "vi", name: "Tiếng Việt", flag: "🇻🇳" },
];

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const auth = useKeycloakAuth();

  const [menuOpen, setMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [eventsDropdownOpen, setEventsDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState<LanguageOption>(languages[0]);
  const [mobileSearch, setMobileSearch] = useState("");
  const user = auth.authenticated ? {
    name: String(auth.tokenParsed?.name ?? auth.tokenParsed?.preferred_username ?? "Tài khoản"),
    email: String(auth.tokenParsed?.email ?? ""),
  } : null;
  const isCustomer = auth.roles.includes("Customer");
  const isOrganizer = auth.roles.includes("Organizer");
  const isAdmin = auth.roles.includes("Admin");

  const langRef = useRef<HTMLDivElement>(null);
  const eventsRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  // Handle clicking outside dropdowns
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setLangDropdownOpen(false);
      }
      if (eventsRef.current && !eventsRef.current.contains(event.target as Node)) {
        setEventsDropdownOpen(false);
      }
      if (userRef.current && !userRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Prevent scroll when mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const handleMobileSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (mobileSearch.trim()) {
      router.push(`/events?q=${encodeURIComponent(mobileSearch.trim())}`);
      setMenuOpen(false);
    }
  };

  return (
    <>
      <header className="site-navbar">
        <div className="container flex h-full items-center justify-between gap-4">
          {/* Left: Brand Logo & Main Nav */}
          <div className="flex items-center gap-7">
            <Link href="/" aria-label="TixFlow home" className="brand-mark group">
              <span className="brand-symbol group-hover:scale-105 transition-transform">
                <Ticket size={18} strokeWidth={2.4} />
              </span>
              <span className="flex items-center tracking-tight">
                <span className="font-extrabold text-[#2B212B]">Tix</span>
                <span className="font-extrabold text-[#ef5360]">Flow</span>
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden items-center gap-1 md:flex" aria-label="Main navigation">
              {/* Events with dropdown */}
              <div className="relative" ref={eventsRef}>
                <button
                  type="button"
                  onClick={() => setEventsDropdownOpen((prev) => !prev)}
                  className={`nav-link flex items-center gap-1.5 ${
                    pathname.startsWith("/events") ? "text-[#ef5360] font-bold" : "text-[#4A4A4A]"
                  }`}
                  aria-expanded={eventsDropdownOpen}
                >
                  <span>Events</span>
                  <ChevronDown
                    size={14}
                    className={`transition-transform duration-200 ${eventsDropdownOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {eventsDropdownOpen && (
                  <div className="absolute left-0 top-full mt-1.5 w-72 rounded-xl border border-gray-100 bg-white p-2.5 shadow-xl shadow-black/10 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-3 py-2 border-b border-gray-100">
                      <Link
                        href="/events"
                        onClick={() => setEventsDropdownOpen(false)}
                        className="flex items-center justify-between text-xs font-bold text-[#ef5360] hover:underline"
                      >
                        <span>View All Events</span>
                        <Compass size={14} />
                      </Link>
                    </div>
                    <div className="py-1 max-h-80 overflow-y-auto">
                      <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                        Categories
                      </div>
                      {eventCategories.slice(0, 10).map((cat) => (
                        <Link
                          key={cat.value}
                          href={`/events?category=${cat.value}`}
                          onClick={() => setEventsDropdownOpen(false)}
                          className="flex items-center justify-between px-3 py-2 rounded-lg text-sm text-[#4A4A4A] hover:bg-[#FFEFF0] hover:text-[#ef5360] transition-colors"
                        >
                          <span className="flex items-center gap-2">
                            <span className="text-sm">{cat.icon}</span>
                            <span>{cat.label}</span>
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <Link
                href="/events?section=articles"
                className={`nav-link ${pathname === "/events?section=articles" ? "text-[#ef5360] font-bold" : "text-[#4A4A4A]"}`}
              >
                Articles
              </Link>

              <Link
                href="/events?filter=store"
                className="nav-link text-[#4A4A4A]"
              >
                Store
              </Link>

              {(isOrganizer || (!auth.authenticated && auth.ready)) && (
                <Link
                  href="/organizer"
                  className={`nav-link ${pathname.startsWith("/organizer") ? "text-[#ef5360] font-bold" : "text-[#4A4A4A]"}`}
                >
                  For Organizers
                </Link>
              )}
              {isAdmin && (
                <Link
                  href="/admin"
                  className={`nav-link ${pathname.startsWith("/admin") ? "text-[#ef5360] font-bold" : "text-[#4A4A4A]"}`}
                >
                  Admin
                </Link>
              )}
            </nav>
          </div>

          {/* Right: Actions, Language & Auth */}
          <div className="flex items-center gap-3">
            {/* Organizer Call-to-action button */}
            {isOrganizer && (
              <Link
                href="/organizer/events/create"
                className="container-for-organizer hidden sm:inline-flex"
              >
                <PlusCircle size={15} />
                <span>Create Event</span>
              </Link>
            )}

            {/* Vertical divider */}
            <div className="hidden sm:block h-6 w-px bg-gray-200" />

            {/* Language Selector */}
            <div className="relative" ref={langRef}>
              <button
                type="button"
                onClick={() => setLangDropdownOpen((prev) => !prev)}
                className="flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
                aria-expanded={langDropdownOpen}
                aria-label="Select Language"
              >
                <span className="text-sm">{selectedLang.flag}</span>
                <span className="hidden md:inline">{selectedLang.name}</span>
                <ChevronDown
                  size={12}
                  className={`text-gray-400 transition-transform ${langDropdownOpen ? "rotate-180" : ""}`}
                />
              </button>

              {langDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-36 rounded-xl border border-gray-100 bg-white py-1.5 shadow-lg z-50 animate-in fade-in duration-150">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      type="button"
                      onClick={() => {
                        setSelectedLang(lang);
                        setLangDropdownOpen(false);
                      }}
                      className={`flex w-full items-center justify-between px-3.5 py-2 text-left text-xs font-medium transition-colors ${
                        selectedLang.code === lang.code
                          ? "bg-[#FFEFF0] font-bold text-[#ef5360]"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span>{lang.flag}</span>
                        <span>{lang.name}</span>
                      </span>
                      {selectedLang.code === lang.code && <span className="text-[#ef5360]">✓</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* User Profile / Log In */}
            {user ? (
              <div className="relative" ref={userRef}>
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen((prev) => !prev)}
                  className="flex items-center gap-2 rounded-full p-1 pl-2 hover:bg-gray-100 transition-colors"
                  aria-expanded={userDropdownOpen}
                >
                  <span className="grid h-7 w-7 place-items-center rounded-full bg-[#FFEFF0] text-xs font-bold text-[#ef5360]">
                    {user.name.slice(0, 1)}
                  </span>
                  <span className="hidden lg:inline text-xs font-bold text-gray-700 max-w-[100px] truncate">
                    {user.name.split(" ")[0]}
                  </span>
                  <ChevronDown size={12} className="text-gray-400 hidden lg:block" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-52 rounded-xl border border-gray-100 bg-white p-2 shadow-xl z-50 animate-in fade-in duration-150">
                    <div className="px-3 py-2 border-b border-gray-100 mb-1">
                      <div className="text-xs font-bold text-gray-800">{user.name}</div>
                      <div className="text-[11px] text-gray-400 truncate">{user.email}</div>
                    </div>
                    <Link
                      href="/account"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-50"
                    >
                      <User size={15} />
                      <span>My Profile</span>
                    </Link>
                    {isCustomer && <>
                      <Link
                        href="/account/tickets"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-50"
                      >
                        <Ticket size={15} />
                        <span>My Tickets</span>
                      </Link>
                      <Link
                        href="/account/orders"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-50"
                      >
                        <Layers size={15} />
                        <span>My Orders</span>
                      </Link>
                    </>}
                    {isOrganizer && (
                      <Link
                        href="/organizer"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-50"
                      >
                        <Layers size={15} />
                        <span>Organizer Dashboard</span>
                      </Link>
                    )}
                    {isAdmin && (
                      <Link
                        href="/admin"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-50"
                      >
                        <ShieldCheck size={15} />
                        <span>Admin Dashboard</span>
                      </Link>
                    )}
                    <div className="my-1 border-t border-gray-100" />
                    <button
                      type="button"
                      onClick={() => {
                        void auth.logout();
                        setUserDropdownOpen(false);
                      }}
                      className="flex w-full items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50"
                    >
                      <LogOut size={15} />
                      <span>Log Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="flex items-center gap-1.5 text-xs font-bold text-gray-700 hover:text-[#ef5360] transition-colors px-2 py-1.5"
                >
                  <User size={16} />
                  <span>Log in</span>
                </Link>
                <Link
                  href="/register"
                  className="btn-event-type hidden md:inline-flex !w-auto !h-8 !px-4 !my-0 !text-xs"
                >
                  Sign up
                </Link>
              </div>
            )}

            {/* Mobile Menu Hamburger */}
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              className="grid h-9 w-9 place-items-center rounded-lg text-gray-600 hover:bg-gray-100 md:hidden transition-colors"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
            onClick={() => setMenuOpen(false)}
          />

          {/* Drawer content */}
          <div className="fixed inset-y-0 right-0 w-[85%] max-w-sm bg-white shadow-2xl flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-250">
            <div className="p-5">
              {/* Header inside drawer */}
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <Link href="/" onClick={() => setMenuOpen(false)} className="brand-mark">
                  <span className="brand-symbol">
                    <Ticket size={16} />
                  </span>
                  <span className="text-lg">
                    <span className="font-extrabold text-[#2B212B]">Tix</span>
                    <span className="font-extrabold text-[#ef5360]">Flow</span>
                  </span>
                </Link>
                <button
                  type="button"
                  onClick={() => setMenuOpen(false)}
                  className="p-1 rounded-full text-gray-500 hover:bg-gray-100"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Mobile Search Input */}
              <form onSubmit={handleMobileSearch} className="mt-4">
                <div className="relative">
                  <input
                    type="text"
                    value={mobileSearch}
                    onChange={(e) => setMobileSearch(e.target.value)}
                    placeholder="Search events, venues..."
                    className="w-full h-10 pl-9 pr-4 text-xs rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:border-[#ef5360] focus:outline-none"
                  />
                  <Search size={15} className="absolute left-3 top-3 text-gray-400" />
                </div>
              </form>

              {/* Mobile Navigation Links */}
              <nav className="mt-5 space-y-1">
                <Link
                  href="/events"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-gray-700 hover:bg-[#FFEFF0] hover:text-[#ef5360]"
                >
                  <Compass size={18} className="text-[#ef5360]" />
                  <span>Discover Events</span>
                </Link>

                <Link
                  href="/events?section=articles"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-gray-700 hover:bg-[#FFEFF0] hover:text-[#ef5360]"
                >
                  <FileText size={18} className="text-[#ef5360]" />
                  <span>Articles & News</span>
                </Link>

                <Link
                  href="/events?filter=store"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-gray-700 hover:bg-[#FFEFF0] hover:text-[#ef5360]"
                >
                  <ShoppingBag size={18} className="text-[#ef5360]" />
                  <span>TixStore</span>
                </Link>

                {(isOrganizer || (!auth.authenticated && auth.ready)) && (
                  <Link
                    href="/organizer"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-gray-700 hover:bg-[#FFEFF0] hover:text-[#ef5360]"
                  >
                    <Layers size={18} className="text-[#ef5360]" />
                    <span>For Organizers</span>
                  </Link>
                )}
                {isAdmin && (
                  <Link
                    href="/admin"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-gray-700 hover:bg-[#FFEFF0] hover:text-[#ef5360]"
                  >
                    <ShieldCheck size={18} className="text-[#ef5360]" />
                    <span>Admin Dashboard</span>
                  </Link>
                )}

                <div className="pt-2 pb-1 border-t border-gray-100 my-2">
                  <div className="px-3 text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                    Featured Categories
                  </div>
                  {eventCategories.slice(0, 6).map((c) => (
                    <Link
                      key={c.value}
                      href={`/events?category=${c.value}`}
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-gray-600 hover:text-[#ef5360]"
                    >
                      <span>{c.icon}</span>
                      <span>{c.label}</span>
                    </Link>
                  ))}
                </div>
              </nav>
            </div>

            {/* Bottom of drawer: Organizer CTA & Account */}
            <div className="p-5 border-t border-gray-100 bg-gray-50/60">
              {isOrganizer && (
                <Link
                  href="/organizer/events/create"
                  onClick={() => setMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-full bg-[#ef5360] text-white font-bold text-xs shadow-md mb-3 hover:bg-[#ec3746]"
                >
                  <PlusCircle size={15} />
                  <span>Create an Event</span>
                </Link>
              )}

              {user ? (
                <div className="space-y-1">
                  <Link
                    href="/account"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold text-gray-700 hover:bg-white"
                  >
                    <User size={15} />
                    <span>My Account</span>
                  </Link>
                  {isCustomer && <>
                    <Link
                      href="/account/tickets"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold text-gray-700 hover:bg-white"
                    >
                      <Ticket size={15} />
                      <span>My Tickets</span>
                    </Link>
                    <Link
                      href="/account/orders"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold text-gray-700 hover:bg-white"
                    >
                      <Layers size={15} />
                      <span>My Orders</span>
                    </Link>
                  </>}
                  {isOrganizer && (
                    <Link
                      href="/organizer"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold text-gray-700 hover:bg-white"
                    >
                      <Layers size={15} />
                      <span>Organizer Dashboard</span>
                    </Link>
                  )}
                  {isAdmin && (
                    <Link
                      href="/admin"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold text-gray-700 hover:bg-white"
                    >
                      <ShieldCheck size={15} />
                      <span>Admin Dashboard</span>
                    </Link>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      void auth.logout();
                      setMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold text-rose-600 hover:bg-rose-50 text-left"
                  >
                    <LogOut size={15} />
                    <span>Log Out</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href="/login"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center justify-center py-2 rounded-lg border border-gray-300 bg-white text-xs font-bold text-gray-700"
                  >
                    Log In
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center justify-center py-2 rounded-lg bg-[#ef5360] text-xs font-bold text-white"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
