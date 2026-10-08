"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { ArrowRight, ChevronDown, LogOut, Menu, Search, Ticket, UserRound, X } from "lucide-react";
import { logout, getCurrentUser } from "@/lib/mock-api/users";
import type { MockUser } from "@/lib/mock/users";

const navItems = [
  { label: "Discover events", href: "/events" },
  { label: "For organizers", href: "/organizer" },
];

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [user, setUser] = useState<MockUser | null>(null);

  useEffect(() => {
    const refreshUser = () => { void getCurrentUser().then(setUser); };
    refreshUser();
    window.addEventListener("zipevent-auth-change", refreshUser);
    return () => window.removeEventListener("zipevent-auth-change", refreshUser);
  }, []);

  function search(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    router.push(`/events${params.size ? `?${params}` : ""}`);
    setMenuOpen(false);
  }

  return (
    <header className="site-header">
      <div className="container flex h-[76px] items-center gap-8">
        <Link href="/" aria-label="Zipevent home" className="brand-mark shrink-0">
          <span className="brand-symbol"><Ticket size={19} strokeWidth={2.6} /></span>
          <span>zipevent</span>
        </Link>

        <form onSubmit={search} className="header-search hidden flex-1 md:flex" role="search">
          <Search size={18} className="text-slate-400" aria-hidden="true" />
          <input aria-label="Search events" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search events, experiences, and more" />
          <button type="submit" aria-label="Submit search"><ArrowRight size={17} /></button>
        </form>

        <nav className="ml-auto hidden items-center gap-7 lg:flex" aria-label="Main navigation">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className={`nav-link ${pathname.startsWith(item.href) ? "active" : ""}`}>
              {item.label}{item.href === "/organizer" && <ChevronDown size={14} />}
            </Link>
          ))}
          {user ? <div className="flex items-center gap-3"><Link href="/account" className="inline-flex items-center gap-2 text-xs font-bold text-slate-700"><span className="grid h-8 w-8 place-items-center rounded-full bg-orange-100 text-[#df623b]">{user.name.slice(0, 1)}</span>{user.name.split(" ")[0]}</Link><button type="button" aria-label="Log out" onClick={() => { void logout().then(() => setUser(null)); }} className="rounded-full p-2 text-slate-500 hover:bg-slate-100"><LogOut size={16} /></button></div> : <><Link href="/login" className="nav-login">Log in</Link><Link href="/register" className="button-primary !px-5 !py-2.5">Create account</Link></>}
        </nav>

        <button type="button" className="ml-auto rounded-full p-2 hover:bg-slate-100 lg:hidden" aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}>
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {menuOpen && (
        <div className="border-t border-slate-100 bg-white p-4 lg:hidden">
          <form onSubmit={search} className="header-search mb-4" role="search">
            <Search size={18} className="text-slate-400" aria-hidden="true" />
            <input aria-label="Search events" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search events" />
            <button type="submit" aria-label="Submit search"><ArrowRight size={17} /></button>
          </form>
          <nav className="flex flex-col gap-1" aria-label="Mobile navigation">
            {navItems.map((item) => <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)} className="rounded-xl px-3 py-3 text-sm font-semibold hover:bg-slate-50">{item.label}</Link>)}
            {user ? <><Link href="/account" onClick={() => setMenuOpen(false)} className="rounded-xl px-3 py-3 text-sm font-semibold hover:bg-slate-50"><UserRound className="mr-2 inline" size={16} />My account</Link><button type="button" onClick={() => { void logout().then(() => setUser(null)); setMenuOpen(false); }} className="rounded-xl px-3 py-3 text-left text-sm font-semibold hover:bg-slate-50"><LogOut className="mr-2 inline" size={16} />Log out</button></> : <><Link href="/login" onClick={() => setMenuOpen(false)} className="rounded-xl px-3 py-3 text-sm font-semibold hover:bg-slate-50">Log in</Link><Link href="/register" onClick={() => setMenuOpen(false)} className="button-primary mt-2">Create account</Link></>}
          </nav>
        </div>
      )}
    </header>
  );
}
