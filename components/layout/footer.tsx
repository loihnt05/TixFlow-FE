import Link from "next/link";
import { ArrowUpRight, Mail } from "lucide-react";

const columns = [
  { title: "Zipevent", links: [["About us", "/about"], ["Join our team", "/careers"], ["Latest stories", "/blog"]] },
  { title: "Discover", links: [["All events", "/events"], ["Online events", "/events?type=online"], ["Free events", "/events?price=free"], ["Categories", "/events"]] },
  { title: "For organizers", links: [["Create an event", "/organizer/events/create"], ["Organizer dashboard", "/organizer"], ["Attendee management", "/organizer/attendees"], ["Analytics", "/organizer/analytics"]] },
  { title: "Need help?", links: [["Help center", "/help"], ["Contact us", "/contact"], ["Terms of use", "/terms"], ["Privacy policy", "/privacy"]] },
];

export function Footer() {
  return (
    <footer className="site-footer" role="contentinfo">
      <div className="container py-10 sm:py-14">
        <div className="grid gap-9 sm:grid-cols-2 lg:grid-cols-[1.5fr_repeat(4,1fr)]">
          <div>
            <Link href="/" className="brand-mark"><span className="brand-symbol"><span className="text-sm">z</span></span><span>zipevent</span></Link>
            <p className="mt-4 max-w-xs text-xs leading-6 text-slate-500">Discover experiences, meet your community, and find inspiration everywhere.</p>
            <a className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-[#e7653c]" href="mailto:support@zipeventapp.com"><Mail size={14} /> support@zipeventapp.com</a>
          </div>
          {columns.map((column) => <nav key={column.title} aria-label={column.title}><h2 className="text-xs font-extrabold text-slate-800">{column.title}</h2>{column.links.map(([label, href]) => <Link key={label} href={href} className="footer-link">{label}</Link>)}</nav>)}
        </div>
        <div className="mt-10 flex flex-col justify-between gap-3 border-t border-slate-200 pt-5 text-[11px] text-slate-400 sm:flex-row sm:items-center"><span>© {new Date().getFullYear()} Zipevent. All rights reserved.</span><span className="inline-flex items-center gap-1">Inspiration everywhere <ArrowUpRight size={12} /></span></div>
      </div>
    </footer>
  );
}
