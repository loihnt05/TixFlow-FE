"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Armchair,
  CalendarDays,
  CheckCircle2,
  Compass,
  ExternalLink,
  HeartOff,
  MapPin,
  QrCode,
  RefreshCw,
  ShieldAlert,
  ShoppingBag,
  Ticket,
} from "lucide-react";
import {
  useAccount,
  type AccountPreferences,
} from "@/components/account/account-context";
import { Skeleton } from "@/components/ui/skeleton";
import { TableSkeleton } from "@/components/states/skeletons";

const money = new Intl.NumberFormat("en-US");

function SectionHeader({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 border-b border-gray-100 pb-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="text-lg font-bold text-[#2B212B] sm:text-xl">{title}</h2>
        <p className="mt-0.5 text-xs text-[#8E8E8E]">{description}</p>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

function orderStatusBadgeClass(status: string): string {
  switch (status) {
    case "Paid":
      return "bg-emerald-50 text-emerald-700";
    case "PendingPayment":
      return "bg-amber-50 text-amber-700";
    case "Refunded":
      return "bg-sky-50 text-sky-700";
    case "Cancelled":
    case "Expired":
      return "bg-gray-100 text-gray-600";
    default:
      return "bg-slate-100 text-slate-700";
  }
}

function formatOrderStatus(status: string): string {
  if (status === "PendingPayment") return "Pending Payment";
  return status;
}

export function CustomerSectionGuard({ children }: { children: React.ReactNode }) {
  const { isCustomer, profileLoading } = useAccount();

  if (profileLoading && !isCustomer) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-6 w-44" />
        <Skeleton className="h-24 w-full rounded-2xl" />
      </div>
    );
  }

  if (!isCustomer) {
    return (
      <div role="alert" className="py-10 text-center">
        <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[#FFEFF0] text-[#ef5360]">
          <ShieldAlert size={22} />
        </span>
        <h2 className="mt-4 text-base font-bold text-[#2B212B]">Access denied</h2>
        <p className="mt-1 text-xs text-gray-500">
          Your account role does not include customer tickets or order history.
        </p>
        <Link
          href="/account"
          scroll={false}
          className="mt-5 inline-flex items-center rounded-full border border-gray-200 px-5 py-2 text-xs font-bold text-gray-700 hover:border-[#ef5360] hover:text-[#ef5360]"
        >
          Back to profile
        </Link>
      </div>
    );
  }

  return <>{children}</>;
}

export function AccountProfileSection() {
  const {
    name,
    email,
    localUserId,
    oidcSubject,
    profileRole,
    accountStatus,
    profileLoading,
    profileError,
    syncingProfile,
    syncSuccess,
    keycloakAccountUrl,
    syncProfile,
  } = useAccount();

  return (
    <div>
      <SectionHeader
        title="Profile"
        description="Synchronized account details between Keycloak SSO and the TixFlow PostgreSQL database"
        action={
          <button
            type="button"
            onClick={() => void syncProfile()}
            disabled={syncingProfile}
            className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-gray-700 transition-colors hover:border-[#ef5360] hover:text-[#ef5360] disabled:opacity-60"
          >
            <RefreshCw size={13} className={syncingProfile ? "animate-spin" : ""} />
            <span>{syncingProfile ? "Syncing…" : "Sync Profile"}</span>
          </button>
        }
      />

      {profileError && (
        <div
          role="alert"
          className="mt-4 flex flex-wrap items-center justify-between gap-2 rounded-xl bg-rose-50 p-3 text-xs text-rose-700"
        >
          <span>{profileError}</span>
          <button
            type="button"
            onClick={() => void syncProfile()}
            className="font-bold underline hover:no-underline"
          >
            Retry
          </button>
        </div>
      )}

      <div className="mt-6 max-w-2xl space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-gray-700">
              Display Name
            </label>
            {profileLoading && !name ? (
              <Skeleton className="mt-1.5 h-11 w-full rounded-xl" />
            ) : (
              <input
                value={name}
                readOnly
                className="mt-1.5 h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 text-xs font-medium text-[#2B212B]"
              />
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700">
              Email Address
            </label>
            {profileLoading && !email ? (
              <Skeleton className="mt-1.5 h-11 w-full rounded-xl" />
            ) : (
              <input
                value={email}
                readOnly
                className="mt-1.5 h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 text-xs text-gray-600"
              />
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700">
                Account Role
              </label>
              <input
                value={profileRole || "—"}
                readOnly
                className="mt-1.5 h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 text-xs font-semibold text-gray-700"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700">
                DB Status
              </label>
              <input
                value={accountStatus}
                readOnly
                className="mt-1.5 h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 text-xs font-semibold text-emerald-700"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700">
              Internal User ID (PostgreSQL)
            </label>
            {profileLoading && !localUserId ? (
              <Skeleton className="mt-1.5 h-11 w-full rounded-xl" />
            ) : (
              <input
                value={localUserId || "—"}
                readOnly
                className="mt-1.5 h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 font-mono text-[11px] text-gray-500"
              />
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700">
              Identity Subject (Keycloak OIDC)
            </label>
            {profileLoading && !oidcSubject ? (
              <Skeleton className="mt-1.5 h-11 w-full rounded-xl" />
            ) : (
              <input
                value={oidcSubject || "—"}
                readOnly
                className="mt-1.5 h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 font-mono text-[11px] text-gray-500"
              />
            )}
          </div>
        </div>

        <div className="rounded-xl border border-gray-100 bg-gray-50/70 p-4 text-xs text-gray-600">
          Your name, email, and credentials are managed by <strong>Keycloak Single Sign-On</strong> and
          automatically synchronized to TixFlow&apos;s PostgreSQL <code className="rounded bg-white px-1 py-0.5 text-[11px]">users</code> table whenever you sign in or sync.
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-1">
          {keycloakAccountUrl && (
            <a
              href={keycloakAccountUrl}
              className="inline-flex items-center gap-2 rounded-full bg-[#ef5360] px-6 py-2.5 text-xs font-bold text-white shadow-xs transition-all hover:bg-[#ec3746] active:scale-95"
            >
              <span>Edit Identity in Keycloak</span>
              <ExternalLink size={14} />
            </a>
          )}
          {syncSuccess && (
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600">
              <CheckCircle2 size={14} />
              <span>Synchronized with database</span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export function AccountTicketsSection() {
  const {
    tickets,
    ticketsLoading,
    ticketsError,
    ordersById,
    refreshTickets,
    openTicketQr,
  } = useAccount();
  const [ticketFilter, setTicketFilter] = useState<"all" | "upcoming" | "past">("all");

  const validTickets = tickets.filter((ticket) => ticket.status !== "cancelled");
  const upcomingCount = validTickets.filter((ticket) => ticket.status === "upcoming").length;
  const pastCount = validTickets.filter((ticket) => ticket.status === "past").length;

  const filteredTickets = validTickets.filter((ticket) => {
    if (ticketFilter === "upcoming") return ticket.status === "upcoming";
    if (ticketFilter === "past") return ticket.status === "past";
    return true;
  });

  return (
    <div>
      <SectionHeader
        title="My Tickets"
        description="Access your issued digital tickets and encrypted check-in QR codes"
        action={
          <button
            type="button"
            onClick={() => void refreshTickets()}
            disabled={ticketsLoading}
            className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-gray-700 transition-colors hover:border-[#ef5360] hover:text-[#ef5360] disabled:opacity-60"
          >
            <RefreshCw size={13} className={ticketsLoading ? "animate-spin" : ""} />
            <span>Refresh</span>
          </button>
        }
      />

      {ticketsError && (
        <p className="mt-4 rounded-xl bg-rose-50 p-3 text-xs text-rose-700" role="alert">
          {ticketsError}
        </p>
      )}

      <div className="mt-6 space-y-6">
        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-gray-100 pb-3">
          {[
            { id: "all", label: `All Tickets (${validTickets.length})` },
            { id: "upcoming", label: `Upcoming (${upcomingCount})` },
            { id: "past", label: `Past Events (${pastCount})` },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setTicketFilter(tab.id as "all" | "upcoming" | "past")}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
                ticketFilter === tab.id
                  ? "bg-[#ef5360] text-white shadow-2xs"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Loading / Ticket Cards / Empty State */}
        {ticketsLoading && tickets.length === 0 ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }, (_, idx) => (
              <Skeleton key={idx} className="h-28 w-full rounded-2xl" />
            ))}
          </div>
        ) : filteredTickets.length > 0 ? (
          <div className="space-y-4">
            {filteredTickets.map((ticket) => {
              const orderLabel =
                ordersById.get(ticket.orderId)?.orderNumber ??
                ticket.orderNumber ??
                ticket.orderId.slice(0, 8).toUpperCase();

              return (
                <div
                  key={ticket.id}
                  className="flex flex-col justify-between gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-2xs transition-all hover:border-[#ef5360]/30 hover:shadow-xs sm:flex-row sm:items-center"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                          ticket.status === "upcoming"
                            ? "bg-emerald-50 text-emerald-600"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {ticket.status === "upcoming" ? "Upcoming" : "Past"}
                      </span>
                      {ticket.checkedIn && (
                        <span className="rounded-full bg-sky-50 px-2.5 py-0.5 text-[10px] font-bold text-sky-700">
                          Checked in
                        </span>
                      )}
                      <span className="font-mono text-[11px] font-bold text-gray-400">
                        Order #{orderLabel}
                      </span>
                    </div>

                    <Link
                      href={`/events/${ticket.eventSlug}`}
                      className="mt-2 block text-base font-bold text-[#2B212B] transition-colors hover:text-[#ef5360]"
                    >
                      {ticket.eventTitle}
                    </Link>

                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <CalendarDays size={13} className="text-[#ef5360]" />
                        {new Date(ticket.eventDate).toLocaleDateString("en-GB", {
                          timeZone: "Asia/Ho_Chi_Minh",
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                      {ticket.venue && (
                        <span className="flex items-center gap-1">
                          <MapPin size={13} className="text-[#ef5360]" />
                          {ticket.venue}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Ticket size={13} className="text-[#ef5360]" />
                        {ticket.ticketType}
                      </span>
                      {ticket.seatLabel && (
                        <span className="flex items-center gap-1 font-semibold text-[#2B212B]">
                          <Armchair size={13} className="text-[#ef5360]" />
                          Seat {ticket.seatLabel}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 border-t border-gray-50 pt-3 sm:border-0 sm:pt-0">
                    <button
                      type="button"
                      onClick={() => openTicketQr(ticket)}
                      className="inline-flex items-center gap-1.5 rounded-full bg-[#ef5360] px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#ec3746] active:scale-95"
                    >
                      <QrCode size={14} />
                      <span>View e-Ticket</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-gray-200 px-6 py-12 text-center">
            <span className="mx-auto grid h-11 w-11 place-items-center rounded-full bg-[#FFEFF0] text-[#ef5360]">
              <Ticket size={20} />
            </span>
            <p className="mt-3 text-sm font-bold text-[#2B212B]">
              {validTickets.length === 0 ? "No tickets issued yet" : "No tickets in this filter"}
            </p>
            <p className="mx-auto mt-1 max-w-md text-xs text-gray-500">
              {validTickets.length === 0
                ? "Database seed initializes event catalog inventory only. Book an event and complete mock payment to issue real encrypted QR e-tickets to your account."
                : "Switch to another tab above to see the rest of your tickets."}
            </p>
            {validTickets.length === 0 && (
              <Link
                href="/events"
                className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-[#ef5360] px-5 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#ec3746]"
              >
                <Compass size={14} />
                <span>Browse Events</span>
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export function AccountOrdersSection() {
  const { orders, ordersLoading, ordersError, refreshOrders } = useAccount();

  return (
    <div>
      <SectionHeader
        title="Order History"
        description="Track your ticket orders, quantities, and payment settlement status"
        action={
          <button
            type="button"
            onClick={() => void refreshOrders()}
            disabled={ordersLoading}
            className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-gray-700 transition-colors hover:border-[#ef5360] hover:text-[#ef5360] disabled:opacity-60"
          >
            <RefreshCw size={13} className={ordersLoading ? "animate-spin" : ""} />
            <span>Refresh</span>
          </button>
        }
      />

      {ordersError && (
        <p className="mt-4 rounded-xl bg-rose-50 p-3 text-xs text-rose-700" role="alert">
          {ordersError}
        </p>
      )}

      <div className="mt-6">
        {ordersLoading && orders.length === 0 ? (
          <TableSkeleton rows={4} columns={5} />
        ) : orders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-xs">
              <thead className="border-b border-gray-100 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                <tr>
                  <th className="pb-3 pr-4">Order Number</th>
                  <th className="pb-3 pr-4">Event &amp; Items</th>
                  <th className="pb-3 pr-4">Date</th>
                  <th className="pb-3 pr-4">Total</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50/60">
                    <td className="py-3.5 pr-4 font-mono font-bold text-[#2B212B]">
                      {order.orderNumber || order.id}
                    </td>
                    <td className="py-3.5 pr-4">
                      <div className="font-semibold text-gray-800">{order.eventName}</div>
                      <div className="mt-0.5 text-[11px] text-gray-500">
                        {order.eventSessionName ? `${order.eventSessionName} • ` : ""}
                        {order.items?.length > 0
                          ? order.items
                              .map((item) => `${item.quantity}× ${item.ticketTypeNameSnapshot}`)
                              .join(", ")
                          : "Ticket order"}
                      </div>
                    </td>
                    <td className="py-3.5 pr-4 whitespace-nowrap text-gray-500">
                      {new Date(order.createdAtUtc).toLocaleDateString("en-GB", {
                        timeZone: "Asia/Ho_Chi_Minh",
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="py-3.5 pr-4 whitespace-nowrap font-bold text-[#ef5360]">
                      {money.format(order.totalAmount)} {order.currency}
                    </td>
                    <td className="py-3.5 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${orderStatusBadgeClass(
                            order.status,
                          )}`}
                        >
                          {formatOrderStatus(order.status)}
                        </span>
                        {order.status === "Paid" && (
                          <Link
                            href="/account/tickets"
                            scroll={false}
                            className="text-[11px] font-semibold text-[#ef5360] hover:underline"
                          >
                            Tickets →
                          </Link>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-gray-200 px-6 py-12 text-center">
            <span className="mx-auto grid h-11 w-11 place-items-center rounded-full bg-[#FFEFF0] text-[#ef5360]">
              <ShoppingBag size={20} />
            </span>
            <p className="mt-3 text-sm font-bold text-[#2B212B]">No orders yet</p>
            <p className="mx-auto mt-1 max-w-md text-xs text-gray-500">
              You haven&apos;t placed any ticket orders under this account yet. Pick a seeded event to test hold, checkout, and payment settlement.
            </p>
            <Link
              href="/events"
              className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-[#ef5360] px-5 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#ec3746]"
            >
              <Compass size={14} />
              <span>Discover Events</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export function AccountFavoritesSection() {
  const { favoriteEvents, eventsLoading, removeFavorite } = useAccount();

  return (
    <div>
      <SectionHeader
        title="Saved Events"
        description="Events you bookmarked on this browser for quick access"
      />

      <div className="mt-6">
        {eventsLoading && favoriteEvents.length === 0 ? (
          <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3">
            {Array.from({ length: 3 }, (_, idx) => (
              <Skeleton key={idx} className="aspect-[4/3] w-full rounded-xl" />
            ))}
          </div>
        ) : favoriteEvents.length > 0 ? (
          <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3">
            {favoriteEvents.map((event) => (
              <div
                key={event.id}
                className="group relative overflow-hidden rounded-xl border border-gray-100 bg-white shadow-2xs transition-all hover:border-[#ef5360]/30 hover:shadow-xs"
              >
                <Link href={`/events/${event.slug}`} className="block">
                  <div className="aspect-[16/9] w-full overflow-hidden bg-gray-100">
                    <img
                      src={event.coverImage}
                      alt={event.title}
                      className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                  <div className="p-3">
                    <span className="text-[10px] font-semibold uppercase tracking-wide text-[#ef5360]">
                      {event.category}
                    </span>
                    <h3 className="mt-0.5 line-clamp-2 text-xs font-bold text-[#2B212B] group-hover:text-[#ef5360]">
                      {event.title}
                    </h3>
                  </div>
                </Link>
                <button
                  type="button"
                  onClick={() => removeFavorite(event.slug)}
                  aria-label={`Remove ${event.title} from saved events`}
                  title="Remove from saved events"
                  className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full bg-white/90 text-gray-600 shadow-xs backdrop-blur-2xs transition-colors hover:bg-rose-50 hover:text-[#ef5360]"
                >
                  <HeartOff size={13} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-gray-200 px-6 py-12 text-center">
            <span className="mx-auto grid h-11 w-11 place-items-center rounded-full bg-[#FFEFF0] text-[#ef5360]">
              <HeartOff size={20} />
            </span>
            <p className="mt-3 text-sm font-bold text-[#2B212B]">No saved events yet</p>
            <p className="mx-auto mt-1 max-w-md text-xs text-gray-500">
              Click the heart icon on any event card or event detail page to bookmark it for later.
            </p>
            <Link
              href="/events"
              className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-[#ef5360] px-5 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#ec3746]"
            >
              <Compass size={14} />
              <span>Explore Events</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

const preferenceItems: Array<{
  key: keyof AccountPreferences;
  title: string;
  desc: string;
}> = [
  {
    key: "eventAlerts",
    title: "Event Alerts",
    desc: "Receive reminders and schedule updates before your registered events.",
  },
  {
    key: "personalizedRecommendations",
    title: "Personalized Recommendations",
    desc: "Get curated event picks and concerts matching your interests.",
  },
  {
    key: "newsletterOffers",
    title: "Newsletter & Special Offers",
    desc: "Stay informed with Early Bird discounts and exclusive promotions.",
  },
];

export function AccountSettingsSection() {
  const { preferences, preferencesSaved, updatePreference } = useAccount();

  return (
    <div>
      <SectionHeader
        title="Settings"
        description="Manage notification preferences stored for your account on this device"
        action={
          preferencesSaved ? (
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600">
              <CheckCircle2 size={14} />
              <span>Saved</span>
            </span>
          ) : undefined
        }
      />

      <div className="mt-4 max-w-xl divide-y divide-gray-100">
        {preferenceItems.map((item) => (
          <label
            key={item.key}
            className="flex cursor-pointer items-center justify-between gap-4 py-4"
          >
            <div>
              <span className="block text-xs font-bold text-[#2B212B]">{item.title}</span>
              <span className="mt-0.5 block text-[11px] text-gray-500">{item.desc}</span>
            </div>
            <input
              type="checkbox"
              checked={preferences[item.key]}
              onChange={(event) => updatePreference(item.key, event.target.checked)}
              className="h-4 w-4 rounded accent-[#ef5360]"
            />
          </label>
        ))}
      </div>
    </div>
  );
}
