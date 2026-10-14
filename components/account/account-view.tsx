"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Ticket,
  Heart,
  Settings,
  LogOut,
  CalendarDays,
  MapPin,
  QrCode,
  X,
  UserRound,
  LayoutDashboard,
} from "lucide-react";
import type { Event } from "@/lib/mock/events";
import {
  type AccountTicket,
  type TicketDto,
  type TicketQrDto,
  mapTicket,
} from "@/lib/tickets";
import { getEvents } from "@/lib/mock-api/events";
import { useKeycloakAuth } from "@/components/auth-provider";
import { useApi, type CurrentUser } from "@/lib/api";

const menu = [
  { key: "profile", label: "Profile", href: "/account", Icon: UserRound },
  { key: "tickets", label: "My Tickets", href: "/account/tickets", Icon: Ticket },
  { key: "orders", label: "Order History", href: "/account/orders", Icon: LayoutDashboard },
  { key: "favorites", label: "Saved Events", href: "/account/favorites", Icon: Heart },
  { key: "settings", label: "Settings", href: "/account/settings", Icon: Settings },
];

const money = new Intl.NumberFormat("en-US");
type AccountOrder = {
  id: string; orderNumber: string; status: string; totalAmount: number; currency: string;
  createdAtUtc: string; eventName: string; items: Array<{ quantity: number; ticketTypeNameSnapshot: string }>;
};

export function AccountView({ section = "profile" }: { section?: string }) {
  const auth = useKeycloakAuth();
  const api = useApi();
  const [name, setName] = useState(String(auth.tokenParsed?.name ?? auth.tokenParsed?.preferred_username ?? ""));
  const [email, setEmail] = useState(String(auth.tokenParsed?.email ?? ""));
  const [localUserId, setLocalUserId] = useState("");
  const [profileRole, setProfileRole] = useState<string>(auth.roles[0] ?? "");
  const [profileError, setProfileError] = useState<string>();
  const [tickets, setTickets] = useState<AccountTicket[]>([]);
  const [orders, setOrders] = useState<AccountOrder[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [saved, setSaved] = useState<string[]>([]);
  const [ticketFilter, setTicketFilter] = useState<"all" | "upcoming" | "past">("all");
  const [selectedTicket, setSelectedTicket] = useState<AccountTicket | null>(null);
  const [ticketQr, setTicketQr] = useState<{ id: string; image: string } | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const isCustomer = profileRole === "Customer" || auth.roles.includes("Customer");
  const visibleMenu = menu.filter((item) => isCustomer || item.key === "profile" || item.key === "settings");

  useEffect(() => {
    const controller = new AbortController();
    setProfileError(undefined);
    void api<CurrentUser>("/api/v1/users/me", controller.signal).then((user) => {
      if (!controller.signal.aborted) {
        setName(user.name);
        setEmail(user.email);
        setLocalUserId(user.id);
        setProfileRole(user.roles[0] ?? "");
      }
    }).catch((cause) => {
      if (!controller.signal.aborted)
        setProfileError(cause instanceof Error ? cause.message : "Unable to load profile.");
    });
    if (isCustomer) {
      const refreshTickets = async () => {
        try {
          const result = await api<{ data: TicketDto[] }>("/api/v1/tickets", controller.signal);
          if (!controller.signal.aborted) {
            const mapped = result.data.map(mapTicket);
            setTickets(mapped);
            setSelectedTicket((current) => current ? mapped.find((ticket) => ticket.id === current.id) ?? null : null);
          }
        } catch (cause) {
          if (!controller.signal.aborted) setProfileError(cause instanceof Error ? cause.message : "Unable to load tickets.");
        }
      };
      void refreshTickets();
      const ticketTimer = window.setInterval(() => { if (document.visibilityState === "visible") void refreshTickets(); }, 5000);
      controller.signal.addEventListener("abort", () => window.clearInterval(ticketTimer), { once: true });
      void api<{ data: AccountOrder[] }>("/api/v1/orders", controller.signal)
        .then((result) => { if (!controller.signal.aborted) setOrders(result.data); })
        .catch((cause) => {
          if (!controller.signal.aborted) setProfileError(cause instanceof Error ? cause.message : "Unable to load order history.");
        });
      void getEvents({ limit: 100 }).then((result) => setEvents(result.events));
      setSaved(
        JSON.parse(
          localStorage.getItem("tixflow-favorites") ||
            localStorage.getItem("zipevent-favorites") ||
            "[]"
        ) as string[]
      );
    }
    return () => controller.abort();
  }, [api, isCustomer]);

  const selectedTicketId = selectedTicket?.id;
  useEffect(() => {
    setTicketQr(null);
    if (!selectedTicketId) return;
    const controller = new AbortController();
    void api<{ data: TicketQrDto }>(`/api/v1/tickets/${selectedTicketId}/qr`, controller.signal)
      .then((result) => { if (!controller.signal.aborted) setTicketQr({ id: selectedTicketId, image: result.data.qrImageDataUrl }); })
      .catch((cause) => {
        if (!controller.signal.aborted) setProfileError(cause instanceof Error ? cause.message : "Unable to load QR code.");
      });
    return () => controller.abort();
  }, [api, selectedTicketId]);

  const favoriteEvents = events.filter((event) => saved.includes(event.slug));
  const activeMenuItem = visibleMenu.find((item) => item.key === section) ?? visibleMenu[0];

  const filteredTickets = tickets.filter((t) => {
    if (t.status === "cancelled") return false;
    if (ticketFilter === "upcoming") return t.status === "upcoming";
    if (ticketFilter === "past") return t.status === "past";
    return true;
  });

  const handleSaveProfile = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  return (
    <main className="min-h-screen bg-[#FDFCFD] pb-20 pt-8 sm:pt-10">
      <div className="container max-w-6xl">
        {/* Top Header Card */}
        <div className="mb-8 rounded-2xl border border-gray-100 bg-white p-6 shadow-2xs">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-linear-to-tr from-[#ef5360] to-[#f8a846] text-2xl font-black text-white shadow-md">
                {name.charAt(0) || "U"}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold text-[#2B212B] sm:text-2xl">{name || "User"}</h1>
                  <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-600">
                    Verified Account
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-gray-500">{email}</p>
                <p className="mt-1 text-[11px] text-[#8E8E8E]">
                  TixFlow member since Oct 2026
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {isCustomer && (
                <Link
                  href="/events"
                  className="rounded-full border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-gray-700 hover:border-[#ef5360] hover:text-[#ef5360]"
                >
                  Discover Events
                </Link>
              )}
              {profileRole === "Organizer" && (
                <Link
                  href="/organizer"
                  className="rounded-full border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-gray-700 hover:border-[#ef5360] hover:text-[#ef5360]"
                >
                  Organizer Console
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Layout Grid */}
        <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
          {/* Left Sidebar Menu */}
          <aside className="h-fit space-y-1">
            <div className="rounded-2xl border border-gray-100 bg-white p-2 shadow-2xs">
              {visibleMenu.map((item) => {
                const Icon = item.Icon;
                const isActive = item.key === section;
                return (
                  <Link
                    key={item.key}
                    href={item.href}
                    className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all ${
                      isActive
                        ? "bg-[#FFEFF0] text-[#ef5360]"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <Icon size={16} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}

              <div className="my-1.5 border-t border-gray-100" />

              <button
                type="button"
                onClick={() => {
                  void auth.logout();
                }}
                className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors"
              >
                <LogOut size={16} />
                <span>Log Out</span>
              </button>
            </div>
          </aside>

          {/* Right Main Content */}
          <section className="min-w-0 rounded-2xl border border-gray-100 bg-white p-6 shadow-2xs sm:p-8">
            {profileError && (
              <p className="mb-4 rounded-xl bg-rose-50 p-3 text-xs text-rose-700" role="alert">
                {profileError}
              </p>
            )}
            <div className="border-b border-gray-100 pb-4">
              <h2 className="text-lg font-bold text-[#2B212B] sm:text-xl">
                {activeMenuItem.label}
              </h2>
              <p className="mt-0.5 text-xs text-[#8E8E8E]">
                Manage your personal profile and event tickets on TixFlow
              </p>
            </div>

            {/* SECTION 1: PROFILE */}
            {section === "profile" && (
              <div className="mt-6 max-w-xl space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-gray-700">
                      Full Name
                    </label>
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="mt-1.5 h-11 w-full rounded-xl border border-gray-200 bg-white px-3.5 text-xs text-[#2B212B] outline-none focus:border-[#ef5360]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700">
                      Email Address (Read-only)
                    </label>
                    <input
                      value={email}
                      readOnly
                      className="mt-1.5 h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 text-xs text-gray-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700">
                      Account Role
                    </label>
                    <input
                      value={profileRole}
                      readOnly
                      className="mt-1.5 h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 text-xs text-gray-500"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-gray-700">
                      Internal User ID
                    </label>
                    <input
                      value={localUserId}
                      readOnly
                      className="mt-1.5 h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 font-mono text-xs text-gray-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700">
                      Phone Number
                    </label>
                    <input
                      defaultValue="+84 912 345 678"
                      className="mt-1.5 h-11 w-full rounded-xl border border-gray-200 bg-white px-3.5 text-xs text-[#2B212B] outline-none focus:border-[#ef5360]"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleSaveProfile}
                    className="inline-flex items-center gap-2 rounded-full bg-[#ef5360] px-6 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#ec3746] active:scale-95"
                  >
                    <span>Save Changes</span>
                  </button>
                  {saveSuccess && (
                    <span className="ml-3 text-xs font-semibold text-emerald-600">
                      ✓ Profile updated successfully
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* SECTION 2: TICKETS */}
            {section === "tickets" && (
              <div className="mt-6 space-y-6">
                {/* Filter Tabs */}
                <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
                  {[
                    { id: "all", label: "All Tickets" },
                    { id: "upcoming", label: "Upcoming" },
                    { id: "past", label: "Past Events" },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setTicketFilter(tab.id as "all" | "upcoming" | "past")}
                      className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
                        ticketFilter === tab.id
                          ? "bg-[#ef5360] text-white shadow-2xs"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Ticket Cards */}
                {filteredTickets.length > 0 ? (
                  <div className="space-y-4">
                    {filteredTickets.map((t) => (
                      <div
                        key={t.id}
                        className="flex flex-col justify-between gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-2xs transition-all hover:border-[#ef5360]/30 hover:shadow-xs sm:flex-row sm:items-center"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span
                              className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                                t.status === "upcoming"
                                  ? "bg-emerald-50 text-emerald-600"
                                  : "bg-gray-100 text-gray-600"
                              }`}
                            >
                              {t.status === "upcoming" ? "Upcoming" : "Past"}
                            </span>
                            <span className="text-[11px] font-bold text-gray-400">
                              Order #{t.orderId}
                            </span>
                          </div>

                          <Link
                            href={`/events/${t.eventSlug}`}
                            className="mt-2 block text-base font-bold text-[#2B212B] transition-colors hover:text-[#ef5360]"
                          >
                            {t.eventTitle}
                          </Link>

                          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <CalendarDays size={13} className="text-[#ef5360]" />
                              {new Date(t.eventDate).toLocaleDateString("en-US", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin size={13} className="text-[#ef5360]" />
                              {t.venue}
                            </span>
                            <span className="flex items-center gap-1">
                              <Ticket size={13} className="text-[#ef5360]" />
                              {t.ticketType}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 border-t border-gray-50 pt-3 sm:border-0 sm:pt-0">
                          <button
                            onClick={() => setSelectedTicket(t)}
                            className="inline-flex items-center gap-1.5 rounded-full bg-[#ef5360] px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#ec3746] active:scale-95"
                          >
                            <QrCode size={14} />
                            <span>View e-Ticket</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-2xl border border-dashed border-gray-200 py-12 text-center text-xs text-gray-500">
                    No tickets found in this section
                  </div>
                )}
              </div>
            )}

            {/* SECTION 3: ORDERS */}
            {section === "orders" && (
              <div className="mt-6 overflow-x-auto">
                <table className="w-full min-w-[600px] text-left text-xs">
                  <thead className="border-b border-gray-100 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                    <tr>
                      <th className="pb-3">Order Number</th>
                      <th className="pb-3">Event Name</th>
                      <th className="pb-3">Date</th>
                      <th className="pb-3">Total</th>
                      <th className="pb-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {orders.map((o) => (
                      <tr key={o.id} className="hover:bg-gray-50/50">
                        <td className="py-3.5 font-bold font-mono text-[#2B212B]">{o.id}</td>
                        <td className="py-3.5 font-semibold text-gray-800">
                          {o.eventName}
                        </td>
                        <td className="py-3.5 text-gray-500">
                          {new Date(o.createdAtUtc).toLocaleDateString("en-US", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </td>
                        <td className="py-3.5 font-bold text-[#ef5360]">
                          {money.format(o.totalAmount)} {o.currency}
                        </td>
                        <td className="py-3.5">
                          <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-600">
                            {o.status === "Paid" ? "Paid" : o.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* SECTION 4: FAVORITES */}
            {section === "favorites" && (
              <div className="mt-6">
                {favoriteEvents.length > 0 ? (
                  <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3">
                    {favoriteEvents.map((fe) => (
                      <div key={fe.id}>
                        <Link
                          href={`/events/${fe.slug}`}
                          className="group block overflow-hidden rounded-xl border border-gray-100 bg-white shadow-2xs hover:border-[#ef5360]/30 hover:shadow-xs"
                        >
                          <div className="aspect-16/9 w-full overflow-hidden bg-gray-100">
                            <img
                              src={fe.coverImage}
                              alt={fe.title}
                              className="h-full w-full object-cover transition-transform group-hover:scale-105"
                            />
                          </div>
                          <div className="p-3">
                            <span className="text-[10px] font-semibold text-[#ef5360]">
                              {fe.category}
                            </span>
                            <h4 className="line-clamp-2 text-xs font-bold text-[#2B212B] group-hover:text-[#ef5360]">
                              {fe.title}
                            </h4>
                          </div>
                        </Link>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-2xl border border-dashed border-gray-200 py-12 text-center text-xs text-gray-500">
                    No saved events yet. Click the heart icon on any event to bookmark it for later.
                  </div>
                )}
              </div>
            )}

            {/* SECTION 5: SETTINGS */}
            {section === "settings" && (
              <div className="mt-6 max-w-xl space-y-4 divide-y divide-gray-100">
                {[
                  {
                    title: "Event Alerts",
                    desc: "Receive reminders and updates before your registered events.",
                  },
                  {
                    title: "Personalized Recommendations",
                    desc: "Get curated event picks and concerts matching your interests.",
                  },
                  {
                    title: "Newsletter & Special Offers",
                    desc: "Stay informed with Early Bird discounts and exclusive promotions.",
                  },
                ].map((s, idx) => (
                  <label
                    key={idx}
                    className="flex cursor-pointer items-center justify-between gap-4 pt-4"
                  >
                    <div>
                      <span className="block text-xs font-bold text-[#2B212B]">{s.title}</span>
                      <span className="mt-0.5 block text-[11px] text-gray-500">{s.desc}</span>
                    </div>
                    <input
                      type="checkbox"
                      defaultChecked
                      className="h-4 w-4 rounded accent-[#ef5360]"
                    />
                  </label>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>

      {/* e-Ticket QR Code Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-2xs">
          <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-100 bg-[#FFEFF0]/40 px-6 py-4">
              <div className="flex items-center gap-2">
                <Ticket size={18} className="text-[#ef5360]" />
                <span className="text-xs font-bold text-[#ef5360]">
                  TixFlow Digital Ticket
                </span>
              </div>
              <button
                onClick={() => setSelectedTicket(null)}
                className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Ticket Body */}
            <div className="p-6 text-center">
              <h3 className="text-base font-bold text-[#2B212B]">{selectedTicket.eventTitle}</h3>
              <p className="mt-1 text-xs text-gray-500">
                {selectedTicket.venue} • {selectedTicket.ticketType}
              </p>

              {/* QR Code Container */}
              <div className="mx-auto my-5 flex h-48 w-48 flex-col items-center justify-center rounded-2xl border-2 border-gray-100 bg-white p-3 shadow-xs">
                {ticketQr?.id === selectedTicket.id && (
                  <img src={ticketQr.image} alt="Ticket QR code" width={144} height={144} />
                )}
                <span className="mt-2 text-[10px] font-mono text-gray-400">
                  {selectedTicket.ticketCode}
                </span>
              </div>

              <div className="rounded-xl bg-gray-50 p-3 text-xs text-gray-600">
                Present this e-ticket to the staff at the entrance for check-in scanning.
              </div>

              <button
                type="button"
                onClick={() => setSelectedTicket(null)}
                className="mt-5 w-full rounded-full bg-[#ef5360] py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#ec3746]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
