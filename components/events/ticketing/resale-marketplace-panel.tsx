"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  BadgeCheck,
  Calendar,
  Clock,
  Lock,
  MapPin,
  ShieldCheck,
  Sparkles,
  Ticket,
} from "lucide-react";
import type { Event, ResaleListing } from "@/lib/mock/events";
import { formatTicketMoney } from "./format-utils";

export function ResaleMarketplacePanel({ event }: { event: Event }) {
  const [dateFilter, setDateFilter] = useState("all");
  const [roundFilter, setRoundFilter] = useState("all");
  const [zoneFilter, setZoneFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [sortBy, setSortBy] = useState<"latest" | "price_asc" | "price_desc">("latest");
  const [sellerInfoOpen, setSellerInfoOpen] = useState(false);

  const listings: ResaleListing[] = useMemo(() => {
    if (event.resaleListings && event.resaleListings.length > 0) {
      return event.resaleListings;
    }
    const baseTicket = event.ticketTypes[0];
    const currency = event.currency ?? baseTicket?.currency ?? "VND";
    return [
      {
        id: `${event.id}-resale-1`,
        roundId: event.rounds?.[0]?.id ?? "main",
        dateLabel: event.dateRangeLabel ?? "Upcoming Show",
        roundLabel: `${event.startTime} - ${event.endTime}`,
        zoneId: event.zones?.[0]?.id ?? "A1",
        ticketTypeName: baseTicket?.name ?? "VIP Seated",
        seatLabel: "A-08",
        originalPrice: baseTicket?.price ?? 500000,
        resalePrice: baseTicket?.price ?? 500000,
        currency,
        sellerCode: "Verified Fan #5021",
        verified: true,
        listedAt: "3 hours ago",
      },
    ];
  }, [event]);

  const uniqueDates = Array.from(new Set(listings.map((l) => l.dateLabel)));
  const uniqueRounds = Array.from(new Set(listings.map((l) => l.roundLabel)));
  const uniqueZones = Array.from(new Set(listings.map((l) => l.zoneId)));
  const uniqueTypes = Array.from(new Set(listings.map((l) => l.ticketTypeName)));

  const filtered = useMemo(() => {
    const result = listings.filter((item) => {
      if (dateFilter !== "all" && item.dateLabel !== dateFilter) return false;
      if (roundFilter !== "all" && item.roundLabel !== roundFilter) return false;
      if (zoneFilter !== "all" && item.zoneId !== zoneFilter) return false;
      if (typeFilter !== "all" && item.ticketTypeName !== typeFilter) return false;
      return true;
    });
    if (sortBy === "price_asc") {
      result.sort((a, b) => a.resalePrice - b.resalePrice);
    } else if (sortBy === "price_desc") {
      result.sort((a, b) => b.resalePrice - a.resalePrice);
    }
    return result;
  }, [listings, dateFilter, roundFilter, zoneFilter, typeFilter, sortBy]);

  return (
    <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
      {/* Left Promo Sidebar Card (matches Zipevent Marketplace Seller Profile Promo) */}
      <aside className="rounded-2xl border border-gray-200/80 bg-gradient-to-b from-[#F5F3FF] via-white to-[#FFFBEB] p-6 text-center shadow-xs">
        <div className="mx-auto grid h-24 w-24 place-items-center rounded-3xl bg-white shadow-md">
          <div className="relative">
            <Ticket size={46} className="rotate-[-12deg] text-[#8B5CF6]" />
            <Sparkles
              size={20}
              className="absolute -right-2 -top-2 text-[var(--ev-primary)]"
            />
          </div>
        </div>

        <h3 className="mt-5 text-base font-extrabold text-[#2B212B]">
          Official P2P Ticket Resale
        </h3>
        <p className="mt-2 text-xs leading-relaxed text-gray-600">
          100% verified ticket ownership. When purchased, the seller&apos;s old QR code is
          voided immediately and a brand-new official QR e-Ticket is issued to your
          account.
        </p>

        <div className="mt-5 space-y-2 rounded-xl bg-white/90 p-3.5 text-left text-[11.5px] text-gray-600 shadow-2xs">
          <div className="flex items-center gap-2">
            <ShieldCheck size={15} className="shrink-0 text-emerald-500" />
            <span>Price-capped fair fan-to-fan resale</span>
          </div>
          <div className="flex items-center gap-2">
            <BadgeCheck size={15} className="shrink-0 text-emerald-500" />
            <span>Automatic QR re-issuance by TixFlow</span>
          </div>
          <div className="flex items-center gap-2">
            <Lock size={15} className="shrink-0 text-emerald-500" />
            <span>Escrow-protected payout after check-in</span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setSellerInfoOpen((v) => !v)}
          className="mt-5 inline-flex h-10 w-full items-center justify-center rounded-full bg-[var(--ev-primary)] px-4 text-xs font-bold text-[var(--ev-btn-text)] shadow-xs transition-opacity hover:opacity-90"
        >
          Sell My Ticket on Marketplace
        </button>

        {sellerInfoOpen && (
          <p className="mt-3 rounded-xl border border-amber-200 bg-amber-50 p-3 text-[11px] text-amber-800">
            To list an existing ticket for resale, open{" "}
            <Link href="/account/tickets" className="font-bold underline">
              My Tickets
            </Link>{" "}
            and select <strong>List on P2P Resale</strong>.
          </p>
        )}
      </aside>

      {/* Right Main TICKET RESALE Card */}
      <section className="rounded-2xl border border-gray-200/80 bg-white p-6 shadow-xs sm:p-8">
        <h2 className="text-lg font-extrabold tracking-tight text-[#2B212B] sm:text-xl">
          TICKET RESALE
        </h2>

        {/* Filter & Sort Controls matching police-marketplace.png */}
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <label className="block">
            <span className="mb-1 block text-xs font-semibold text-gray-600">Date</span>
            <div className="relative flex h-10 items-center rounded-lg border border-gray-200 bg-white px-3">
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full appearance-none bg-transparent pr-5 text-xs font-medium text-[#2B212B] outline-none"
              >
                <option value="all">All Date</option>
                {uniqueDates.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
              <Calendar
                size={14}
                className="pointer-events-none shrink-0 text-[var(--ev-primary)]"
              />
            </div>
          </label>

          <label className="block">
            <span className="mb-1 block text-xs font-semibold text-gray-600">Round</span>
            <div className="relative flex h-10 items-center rounded-lg border border-gray-200 bg-white px-3">
              <select
                value={roundFilter}
                onChange={(e) => setRoundFilter(e.target.value)}
                className="w-full appearance-none bg-transparent pr-5 text-xs font-medium text-[#2B212B] outline-none"
              >
                <option value="all">All Round</option>
                {uniqueRounds.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
              <Clock
                size={14}
                className="pointer-events-none shrink-0 text-[var(--ev-primary)]"
              />
            </div>
          </label>

          <label className="block">
            <span className="mb-1 block text-xs font-semibold text-gray-600">Zone</span>
            <div className="relative flex h-10 items-center rounded-lg border border-gray-200 bg-white px-3">
              <select
                value={zoneFilter}
                onChange={(e) => setZoneFilter(e.target.value)}
                className="w-full appearance-none bg-transparent pr-5 text-xs font-medium text-[#2B212B] outline-none"
              >
                <option value="all">All Zone</option>
                {uniqueZones.map((z) => (
                  <option key={z} value={z}>
                    Zone {z}
                  </option>
                ))}
              </select>
              <MapPin
                size={14}
                className="pointer-events-none shrink-0 text-[var(--ev-primary)]"
              />
            </div>
          </label>

          <label className="block">
            <span className="mb-1 block text-xs font-semibold text-gray-600">Sort by</span>
            <div className="relative flex h-10 items-center rounded-lg border border-gray-200 bg-white px-3">
              <select
                value={sortBy}
                onChange={(e) =>
                  setSortBy(e.target.value as "latest" | "price_asc" | "price_desc")
                }
                className="w-full bg-transparent text-xs font-medium text-[#2B212B] outline-none"
              >
                <option value="latest">Latest</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </div>
          </label>

          <label className="block sm:col-span-2 lg:col-span-2">
            <span className="mb-1 block text-xs font-semibold text-gray-600">
              Ticket type
            </span>
            <div className="relative flex h-10 items-center rounded-lg border border-gray-200 bg-white px-3">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full bg-transparent text-xs font-medium text-[#2B212B] outline-none"
              >
                <option value="all">All Ticket Type</option>
                {uniqueTypes.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </label>
        </div>

        {/* Listings Table / Cards */}
        <div className="mt-6 space-y-3">
          {filtered.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-200 py-12 text-center text-sm text-gray-500">
              No verified resale tickets match your current filters.
            </div>
          ) : (
            filtered.map((item) => {
              const matchingTicket =
                event.ticketTypes.find((t) =>
                  t.name.toLowerCase().includes(item.zoneId.charAt(0).toLowerCase())
                ) ?? event.ticketTypes[0];
              const buyHref = `/checkout?event=${encodeURIComponent(
                event.slug
              )}&ticket=${encodeURIComponent(
                matchingTicket?.id ?? "resale"
              )}&quantity=1&zone=${encodeURIComponent(
                item.zoneId
              )}&seatLabels=${encodeURIComponent(item.seatLabel)}&round=${encodeURIComponent(
                `${item.dateLabel} · ${item.roundLabel}`
              )}`;

              return (
                <div
                  key={item.id}
                  className="flex flex-col justify-between gap-4 rounded-xl border border-gray-200 p-4 transition-all hover:border-[var(--ev-primary)] sm:flex-row sm:items-center"
                >
                  <div className="flex items-start gap-3.5">
                    <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-[#111111] text-xs font-extrabold text-[var(--ev-primary)]">
                      {item.zoneId}
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-bold text-[#2B212B]">
                          Zone {item.zoneId} · Seat {item.seatLabel}
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10.5px] font-bold text-emerald-700">
                          <BadgeCheck size={12} />
                          Verified QR
                        </span>
                      </div>
                      <div className="mt-1 text-xs text-gray-500">
                        {item.ticketTypeName} · {item.dateLabel} ({item.roundLabel})
                      </div>
                      <div className="mt-0.5 text-[11px] text-gray-400">
                        Listed by {item.sellerCode} · {item.listedAt}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-4 border-t border-gray-100 pt-3 sm:border-0 sm:pt-0">
                    <div className="text-left sm:text-right">
                      <div className="text-base font-extrabold text-[#2B212B]">
                        {formatTicketMoney(item.resalePrice, item.currency)}
                      </div>
                      {item.resalePrice < item.originalPrice && (
                        <div className="text-[11px] text-emerald-600">
                          Face value: {formatTicketMoney(item.originalPrice, item.currency)}
                        </div>
                      )}
                    </div>

                    <Link
                      href={buyHref}
                      className="inline-flex h-9 items-center justify-center rounded-full bg-[var(--ev-primary)] px-5 text-xs font-bold text-[var(--ev-btn-text)] shadow-xs transition-opacity hover:opacity-90"
                    >
                      Buy Ticket
                    </Link>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>
    </div>
  );
}
