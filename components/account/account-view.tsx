"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CalendarDays, Heart, LayoutDashboard, LogOut, Settings, Ticket, UserRound } from "lucide-react";
import { EventGrid } from "@/components/events/event-grid";
import { mockUsers } from "@/lib/mock/users";
import type { MockTicket } from "@/lib/mock/tickets";
import type { MockOrder } from "@/lib/mock/orders";
import type { Event } from "@/lib/mock/events";
import { getMyTickets } from "@/lib/mock-api/tickets";
import { getOrders } from "@/lib/mock-api/orders";
import { getEvents } from "@/lib/mock-api/events";
import { getCurrentUser, logout } from "@/lib/mock-api/users";

const menu = [{ key: "profile", label: "Profile", href: "/account", Icon: UserRound }, { key: "tickets", label: "My tickets", href: "/account/tickets", Icon: Ticket }, { key: "orders", label: "Orders", href: "/account/orders", Icon: LayoutDashboard }, { key: "favorites", label: "Favorites", href: "/account/favorites", Icon: Heart }, { key: "settings", label: "Settings", href: "/account/settings", Icon: Settings }];
const money = new Intl.NumberFormat("en-US");

export function AccountView({ section = "profile" }: { section?: string }) {
  const [name, setName] = useState(mockUsers[0].name);
  const [email, setEmail] = useState(mockUsers[0].email);
  const [tickets, setTickets] = useState<MockTicket[]>([]);
  const [orders, setOrders] = useState<MockOrder[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [saved, setSaved] = useState<string[]>([]);
  useEffect(() => {
    void getCurrentUser().then((user) => { if (user) { setName(user.name); setEmail(user.email); } });
    void getMyTickets().then(setTickets);
    void getOrders("user-001").then(setOrders);
    void getEvents({ limit: 100 }).then((result) => setEvents(result.events));
    setSaved(JSON.parse(localStorage.getItem("zipevent-favorites") ?? "[]") as string[]);
  }, []);
  const favoriteEvents = events.filter((event) => saved.includes(event.slug));
  const title = menu.find((item) => item.key === section)?.label ?? "Profile";

  return <main className="page-shell container pb-16 pt-9"><div className="mb-7"><p className="eyebrow">Your space</p><h1 className="mt-2 text-3xl font-extrabold tracking-tight">My account</h1></div><div className="grid gap-6 lg:grid-cols-[230px_1fr]">
    <aside className="h-fit rounded-2xl border border-slate-100 bg-white p-3"><div className="mb-3 rounded-xl bg-[#fff5f0] p-4"><div className="grid h-10 w-10 place-items-center rounded-full bg-[#f36b3f] font-extrabold text-white">{name.slice(0,1)}</div><div className="mt-3 text-sm font-extrabold">{name}</div><div className="mt-1 truncate text-[11px] text-slate-500">{email}</div></div><nav aria-label="Account navigation" className="space-y-1">{menu.map(({ key, label, href, Icon }) => <Link key={key} href={href} aria-current={section === key ? "page" : undefined} className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold ${section === key ? "bg-orange-50 text-[#df623b]" : "text-slate-600 hover:bg-slate-50"}`}><Icon size={16} />{label}</Link>)}<button onClick={() => { void logout().then(() => window.location.assign("/")); }} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"><LogOut size={16} />Log out</button></nav></aside>
    <section className="min-w-0 rounded-2xl border border-slate-100 bg-white p-5 sm:p-7"><div className="border-b border-slate-100 pb-4"><h2 className="text-xl font-extrabold">{title}</h2><p className="mt-1 text-xs text-slate-500">Manage your details and event activity.</p></div>
      {section === "profile" && <div className="mt-6 max-w-xl"><div className="grid gap-4 sm:grid-cols-2"><label className="text-xs font-bold text-slate-600">Full name<input className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm font-normal" value={name} onChange={(event) => setName(event.target.value)} /></label><label className="text-xs font-bold text-slate-600">Email address<input className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-normal" value={email} readOnly /></label><label className="text-xs font-bold text-slate-600">Phone number<input className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm font-normal" defaultValue="+84 912 345 678" /></label></div><button type="button" className="button-primary mt-5" onClick={() => window.localStorage.setItem("zipevent-user", JSON.stringify({ ...mockUsers[0], name, email }))}>Save changes</button></div>}
      {section === "tickets" && <div className="mt-5 space-y-3">{tickets.filter((ticket) => ticket.status !== "cancelled").map((ticket) => <article key={ticket.id} className="flex flex-col justify-between gap-4 rounded-xl border border-slate-100 p-4 sm:flex-row sm:items-center"><div><span className={`event-category ${ticket.status === "past" ? "!bg-slate-100 !text-slate-500" : ""}`}>{ticket.status}</span><Link href={`/events/${ticket.eventSlug}`} className="mt-2 block font-bold text-slate-800 hover:text-[#e7653c]">{ticket.eventTitle}</Link><div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500"><span className="inline-flex items-center gap-1"><CalendarDays size={13} />{new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" }).format(new Date(ticket.eventDate))}</span><span>{ticket.ticketType}</span><span>Order {ticket.orderId}</span></div></div><Link href={`/events/${ticket.eventSlug}`} className="button-outline !min-h-9 !px-4">View ticket</Link></article>)}{tickets.length === 0 && <Empty text="No tickets yet. Your event tickets will show here." />}</div>}
      {section === "orders" && <div className="mt-5 overflow-x-auto"><table className="w-full min-w-[620px] text-left text-xs"><thead className="text-[10px] uppercase tracking-wider text-slate-400"><tr><th className="pb-3">Order</th><th className="pb-3">Event</th><th className="pb-3">Date</th><th className="pb-3">Amount</th><th className="pb-3">Status</th></tr></thead><tbody>{orders.map((order) => <tr key={order.id} className="border-t border-slate-100"><td className="py-4 font-bold">{order.id}</td><td className="py-4"><Link className="font-semibold hover:text-[#e7653c]" href={`/events/${order.eventSlug}`}>{order.eventTitle}</Link></td><td className="py-4 text-slate-500">{new Date(order.date).toLocaleDateString("en-GB")}</td><td className="py-4 font-bold">{money.format(order.amount)} VND</td><td className="py-4"><span className="rounded-full bg-emerald-50 px-2.5 py-1 text-emerald-700">{order.status}</span></td></tr>)}</tbody></table></div>}
      {section === "favorites" && (favoriteEvents.length ? <div className="mt-5"><EventGrid events={favoriteEvents} /></div> : <div className="mt-5"><Empty text="Save an event you love and it will appear here." /><Link href="/events" className="button-primary mt-4">Discover events</Link></div>)}
      {section === "settings" && <div className="mt-5 max-w-xl divide-y divide-slate-100">{[["Event updates", "Receive updates about events you book."], ["Recommendations", "Get event suggestions based on your interests."], ["Product news", "Hear about new features and Zipevent news."]].map(([heading, detail]) => <label key={heading} className="flex items-center justify-between gap-4 py-4"><span><span className="block text-sm font-bold">{heading}</span><span className="mt-1 block text-xs text-slate-500">{detail}</span></span><input type="checkbox" defaultChecked className="h-4 w-4 accent-[#f36b3f]" /></label>)}</div>}
    </section>
  </div></main>;
}

function Empty({ text }: { text: string }) { return <div className="rounded-2xl border border-dashed border-slate-300 px-5 py-12 text-center text-sm text-slate-500">{text}</div>; }
