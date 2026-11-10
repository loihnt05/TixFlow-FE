"use client";

import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";
import {
  Heart,
  LayoutDashboard,
  Loader2,
  LogOut,
  MapPin,
  QrCode,
  Settings,
  Ticket,
  UserRound,
  X,
} from "lucide-react";
import { useKeycloakAuth } from "@/components/auth-provider";
import { AccountProvider, useAccount } from "@/components/account/account-context";

const menu = [
  { key: "profile", segment: null, label: "Profile", href: "/account", Icon: UserRound },
  { key: "tickets", segment: "tickets", label: "My Tickets", href: "/account/tickets", Icon: Ticket },
  { key: "orders", segment: "orders", label: "Order History", href: "/account/orders", Icon: LayoutDashboard },
  { key: "favorites", segment: "favorites", label: "Saved Events", href: "/account/favorites", Icon: Heart },
  { key: "settings", segment: "settings", label: "Settings", href: "/account/settings", Icon: Settings },
] as const;

function AccountShellInner({ children }: { children: React.ReactNode }) {
  const auth = useKeycloakAuth();
  const segment = useSelectedLayoutSegment();
  const {
    name,
    email,
    localUserId,
    profileRole,
    accountStatus,
    createdAtUtc,
    isCustomer,
    tickets,
    ticketsLoading,
    orders,
    ordersLoading,
    favoriteEvents,
    selectedTicket,
    ticketQr,
    qrLoading,
    qrError,
    closeTicketQr,
  } = useAccount();

  const visibleMenu = menu.filter(
    (item) => isCustomer || item.key === "profile" || item.key === "settings",
  );

  const activeTicketCount = tickets.filter((ticket) => ticket.status !== "cancelled").length;

  const badgeCountFor = (key: (typeof menu)[number]["key"]): number | undefined => {
    if (!isCustomer) return undefined;
    if (key === "tickets" && !ticketsLoading) return activeTicketCount;
    if (key === "orders" && !ordersLoading) return orders.length;
    if (key === "favorites") return favoriteEvents.length;
    return undefined;
  };

  const memberSubtitle = createdAtUtc
    ? `Member since ${new Date(createdAtUtc).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      })}`
    : localUserId
      ? `Synced PostgreSQL profile • ${profileRole || "Member"}`
      : "Synchronizing account profile…";

  return (
    <main className="ambient-page min-h-screen pb-20 pt-8 sm:pt-10">
      <div className="container max-w-6xl">
        {/* Persistent Top Header Card */}
        <div className="mb-8 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-[#ef5360] to-[#f8a846] text-2xl font-bold text-white shadow-md">
                {(name.trim().charAt(0) || "U").toUpperCase()}
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="truncate text-xl font-bold text-[#2B212B] sm:text-2xl">
                    {name || "Account"}
                  </h1>
                  <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-600">
                    {accountStatus === "Active" ? "Verified Account" : accountStatus}
                  </span>
                  {profileRole && (
                    <span className="rounded-full bg-[#FFEFF0] px-2.5 py-0.5 text-[10px] font-bold text-[#ef5360]">
                      {profileRole}
                    </span>
                  )}
                </div>
                <p className="mt-0.5 truncate text-xs text-gray-500">{email}</p>
                <p className="mt-1 text-[11px] text-[#8E8E8E]">{memberSubtitle}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {isCustomer && (
                <Link
                  href="/events"
                  className="rounded-full border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-gray-700 transition-colors hover:border-[#ef5360] hover:text-[#ef5360]"
                >
                  Discover Events
                </Link>
              )}
              {profileRole === "Organizer" && (
                <Link
                  href="/organizer"
                  className="rounded-full border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-gray-700 transition-colors hover:border-[#ef5360] hover:text-[#ef5360]"
                >
                  Organizer Console
                </Link>
              )}
              {profileRole === "Admin" && (
                <Link
                  href="/admin"
                  className="rounded-full border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-gray-700 transition-colors hover:border-[#ef5360] hover:text-[#ef5360]"
                >
                  Admin Console
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Persistent Shell Grid + Right Outlet */}
        <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
          {/* Persistent Left Sidebar Navigation */}
          <aside className="h-fit space-y-1">
            <nav
              aria-label="Account sections"
              className="rounded-2xl border border-gray-100 bg-white p-2 shadow-2xs"
            >
              {visibleMenu.map((item) => {
                const Icon = item.Icon;
                const isActive = segment === item.segment;
                const badgeCount = badgeCountFor(item.key);
                return (
                  <Link
                    key={item.key}
                    href={item.href}
                    scroll={false}
                    aria-current={isActive ? "page" : undefined}
                    className={`flex items-center justify-between gap-2 rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-colors ${
                      isActive
                        ? "bg-[#FFEFF0] text-[#ef5360]"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <Icon size={16} />
                      <span>{item.label}</span>
                    </span>
                    {badgeCount !== undefined && (
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          isActive
                            ? "bg-[#ef5360]/15 text-[#ef5360]"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {badgeCount}
                      </span>
                    )}
                  </Link>
                );
              })}

              <div className="my-1.5 border-t border-gray-100" />

              <button
                type="button"
                onClick={() => {
                  void auth.logout();
                }}
                className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-gray-500 transition-colors hover:bg-red-50 hover:text-red-600"
              >
                <LogOut size={16} />
                <span>Log Out</span>
              </button>
            </nav>
          </aside>

          {/* Outlet Container — only inner route segment swaps here */}
          <section className="min-w-0 rounded-2xl border border-gray-100 bg-white p-6 shadow-2xs sm:p-8">
            {children}
          </section>
        </div>
      </div>

      {/* e-Ticket QR Code Modal */}
      {selectedTicket && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-2xs"
          onClick={closeTicketQr}
        >
          <div
            className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-200"
            onClick={(event) => event.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-100 bg-[#FFEFF0]/40 px-6 py-4">
              <div className="flex items-center gap-2">
                <Ticket size={18} className="text-[#ef5360]" />
                <span className="text-xs font-bold text-[#ef5360]">
                  TixFlow Digital Ticket
                </span>
              </div>
              <button
                type="button"
                onClick={closeTicketQr}
                aria-label="Close ticket modal"
                className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Ticket Body */}
            <div className="p-6 text-center">
              <h3 className="text-base font-bold text-[#2B212B]">
                {selectedTicket.eventTitle}
              </h3>
              <p className="mt-1 flex flex-wrap items-center justify-center gap-1.5 text-xs text-gray-500">
                {selectedTicket.venue && (
                  <span className="inline-flex items-center gap-1">
                    <MapPin size={12} className="text-[#ef5360]" />
                    {selectedTicket.venue}
                  </span>
                )}
                <span>•</span>
                <span>{selectedTicket.ticketType}</span>
                {selectedTicket.seatLabel && (
                  <>
                    <span>•</span>
                    <span className="font-semibold text-[#2B212B]">
                      Seat {selectedTicket.seatLabel}
                    </span>
                  </>
                )}
              </p>

              {/* QR Code Container */}
              <div className="mx-auto my-5 flex min-h-52 w-56 flex-col items-center justify-center rounded-2xl border-2 border-gray-100 bg-white p-4 shadow-xs">
                {qrLoading ? (
                  <div className="flex flex-col items-center gap-2 text-xs text-gray-400">
                    <Loader2 size={24} className="animate-spin text-[#ef5360]" />
                    <span>Loading encrypted QR…</span>
                  </div>
                ) : qrError ? (
                  <div className="space-y-1.5 px-2 text-center">
                    <QrCode size={28} className="mx-auto text-gray-300" />
                    <p className="text-xs font-semibold text-rose-600">{qrError}</p>
                  </div>
                ) : ticketQr?.id === selectedTicket.id ? (
                  <img
                    src={ticketQr.image}
                    alt="Ticket QR code"
                    width={148}
                    height={148}
                  />
                ) : null}
                <span className="mt-2 break-all font-mono text-[10px] text-gray-400">
                  {selectedTicket.ticketCode}
                </span>
              </div>

              <div className="rounded-xl bg-gray-50 p-3 text-xs text-gray-600">
                {selectedTicket.checkedIn
                  ? "This ticket has already been scanned at check-in."
                  : "Present this e-ticket to the staff at the entrance for check-in scanning."}
              </div>

              <button
                type="button"
                onClick={closeTicketQr}
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

export function AccountShell({ children }: { children: React.ReactNode }) {
  return (
    <AccountProvider>
      <AccountShellInner>{children}</AccountShellInner>
    </AccountProvider>
  );
}
