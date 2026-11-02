"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  Info,
  Lock,
  Minus,
  Plus,
  Shield,
  X,
} from "lucide-react";
import type { Event, EventRound, EventZone, TicketType } from "@/lib/mock/events";
import { AcceptedPaymentsBlock, formatTicketMoney, stepBundleQuantity } from "./format-utils";

export interface SelectedZoneSeat {
  key: string; // e.g. "A2:A-06"
  zoneId: string;
  zoneName: string;
  seatLabel: string;
  seatId?: string;
  ticketTypeId: string;
  price: number;
  currency: string;
}

interface SeatingRoundsPanelProps {
  event: Event;
  step: "round" | "seats";
  onStepChange: (next: "round" | "seats") => void;
  selectedRound: EventRound;
  onSelectRound: (round: EventRound) => void;
  activeZoneId: string;
  onSelectZone: (zoneId: string) => void;
  selectedSeats: SelectedZoneSeat[];
  onToggleSeat: (seat: SelectedZoneSeat, maxPerOrder: number) => void;
  quantities?: Record<string, number>;
  onChangeQuantity?: (ticket: TicketType, nextQty: number) => void;
  onOpenMarketplace?: () => void;
  checkoutHref: string;
}

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function formatShortDate(isoDate: string): string {
  const [y, m, d] = isoDate.split("-").map(Number);
  if (!y || !m || !d) return isoDate;
  const dt = new Date(Date.UTC(y, m - 1, d));
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(dt);
}

export function buildEffectiveRounds(event: Event): EventRound[] {
  if (event.rounds && event.rounds.length > 0) return event.rounds;
  const fallbackDate = event.startDate.slice(0, 10);
  return [
    {
      id: `${event.id}-default-round`,
      date: fallbackDate,
      startTime: event.startTime,
      endTime: event.endTime,
      title: event.title,
    },
  ];
}

export function buildEffectiveZones(event: Event): EventZone[] {
  if (event.zones && event.zones.length > 0) return event.zones;

  // Build zones dynamically from ReservedSeating or ticketTypes for backend/custom events
  const currency = event.currency ?? event.ticketTypes[0]?.currency ?? "VND";
  const palette = ["#F5C400", "#ef5360", "#60A5FA", "#34D399"];
  return event.ticketTypes.map((t, index) => ({
    id: `Z${index + 1}`,
    name: t.name,
    tierLabel: t.name,
    price: t.price,
    currency: t.currency || currency,
    color: palette[index % palette.length],
    ticketTypeId: t.id,
    rows: ["A", "B", "C", "D"],
    seatsPerRow: 8,
    soldSeats: ["A-3", "B-5"],
    heldSeats: ["A-4"],
    benefits: t.benefits,
  }));
}

export function SeatingRoundsLeftPanel({
  event,
  step,
  onStepChange,
  selectedRound,
  onSelectRound,
  activeZoneId,
  onSelectZone,
  selectedSeats,
  onToggleSeat,
  quantities = {},
  onChangeQuantity,
  onOpenMarketplace,
}: Omit<SeatingRoundsPanelProps, "checkoutHref">) {
  const rounds = useMemo(() => buildEffectiveRounds(event), [event]);
  const zones = useMemo(() => buildEffectiveZones(event), [event]);
  const isTimeslotTicketsMode = event.roundBookingType === "tickets";
  const currency = event.currency ?? event.ticketTypes[0]?.currency ?? "VND";

  const initialParts = selectedRound.date.split("-").map(Number);
  const [viewYear, setViewYear] = useState(initialParts[0] || 2026);
  const [viewMonth, setViewMonth] = useState((initialParts[1] || 11) - 1); // 0-indexed

  const eventDatesSet = useMemo(() => new Set(rounds.map((r) => r.date)), [rounds]);
  const selectedDate = selectedRound.date;
  const roundsOnSelectedDate = useMemo(
    () => rounds.filter((r) => r.date === selectedDate),
    [rounds, selectedDate]
  );

  // Build 6-week (42 cell) calendar matrix matching Zipevent's inline calendar
  const calendarCells = useMemo(() => {
    const firstDayWeek = new Date(Date.UTC(viewYear, viewMonth, 1)).getUTCDay();
    const daysInMonth = new Date(Date.UTC(viewYear, viewMonth + 1, 0)).getUTCDate();
    const daysInPrevMonth = new Date(Date.UTC(viewYear, viewMonth, 0)).getUTCDate();

    const cells: Array<{
      day: number;
      iso: string;
      inCurrentMonth: boolean;
    }> = [];

    for (let i = firstDayWeek - 1; i >= 0; i--) {
      const d = daysInPrevMonth - i;
      const pm = viewMonth === 0 ? 11 : viewMonth - 1;
      const py = viewMonth === 0 ? viewYear - 1 : viewYear;
      cells.push({
        day: d,
        iso: `${py}-${String(pm + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`,
        inCurrentMonth: false,
      });
    }

    for (let d = 1; d <= daysInMonth; d++) {
      cells.push({
        day: d,
        iso: `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(d).padStart(
          2,
          "0"
        )}`,
        inCurrentMonth: true,
      });
    }

    let nextDay = 1;
    while (cells.length < 42) {
      const nm = viewMonth === 11 ? 0 : viewMonth + 1;
      const ny = viewMonth === 11 ? viewYear + 1 : viewYear;
      cells.push({
        day: nextDay,
        iso: `${ny}-${String(nm + 1).padStart(2, "0")}-${String(nextDay).padStart(
          2,
          "0"
        )}`,
        inCurrentMonth: false,
      });
      nextDay++;
    }
    return cells;
  }, [viewYear, viewMonth]);

  function shiftMonth(delta: -1 | 1) {
    const next = new Date(Date.UTC(viewYear, viewMonth + delta, 1));
    setViewYear(next.getUTCFullYear());
    setViewMonth(next.getUTCMonth());
  }

  function handleDateClick(iso: string) {
    const firstRound = rounds.find((r) => r.date === iso);
    if (firstRound) {
      onSelectRound(firstRound);
    }
  }

  const activeZone = zones.find((z) => z.id === activeZoneId) ?? zones[0];
  const hasClassicArenaLayout = useMemo(() => {
    const ids = new Set(zones.map((z) => z.id));
    return ids.has("A1") && ids.has("A6") && ids.has("B1") && ids.has("C1");
  }, [zones]);

  const maxSeatsAllowed = useMemo(() => {
    const ticket = event.ticketTypes.find((t) => t.id === activeZone?.ticketTypeId);
    return ticket?.maxPerOrder ?? 4;
  }, [event.ticketTypes, activeZone]);

  // Check if backend provided explicit seat objects for this ticket
  const backendSeatsForZone = useMemo(() => {
    const ticket = event.ticketTypes.find((t) => t.id === activeZone?.ticketTypeId);
    if (ticket?.seats && ticket.seats.length > 0) {
      return ticket.seats;
    }
    return null;
  }, [event.ticketTypes, activeZone]);

  const renderZoneButton = (zone: EventZone, extraClass = "") => {
    const isActive = activeZone?.id === zone.id;
    const selectedCountInZone = selectedSeats.filter((s) => s.zoneId === zone.id).length;
    return (
      <button
        key={zone.id}
        type="button"
        onClick={() => onSelectZone(zone.id)}
        style={{
          backgroundColor: isActive ? zone.color : `${zone.color}28`,
          borderColor: zone.color,
        }}
        className={`relative flex flex-col items-center justify-center rounded-xl border-2 px-2 py-3 text-center transition-all hover:scale-[1.02] ${
          isActive
            ? "text-[#111111] shadow-md ring-2 ring-[#111111]/30 ring-offset-2"
            : "text-[#2B212B]"
        } ${extraClass}`}
      >
        <span className="text-xs font-extrabold sm:text-sm">{zone.id}</span>
        <span className="mt-0.5 text-[10px] font-semibold opacity-80">
          {formatTicketMoney(zone.price, zone.currency)}
        </span>
        {selectedCountInZone > 0 && (
          <span className="absolute -right-1.5 -top-1.5 grid h-5 w-5 place-items-center rounded-full bg-[#111111] text-[10px] font-bold text-white">
            {selectedCountInZone}
          </span>
        )}
      </button>
    );
  };

  return (
    <div id="panel-register" className="scroll-mt-32 space-y-5">
      {step === "round" ? (
        /* STEP 1: Authentic Zipevent Select Date + Select Round Card */
        <section className="rounded-xl border border-gray-200/80 bg-white p-6 shadow-xs sm:p-8">
          <div className="grid gap-8 md:grid-cols-2">
            {/* Left: Select Date Inline Calendar */}
            <div>
              <h2 className="mb-6 text-center text-xl font-bold text-[#2B212B] sm:text-[22px]">
                Select Date
              </h2>

              <div className="mx-auto max-w-[300px]">
                {/* Month Header */}
                <div className="mb-4 flex items-center justify-between px-2">
                  <button
                    type="button"
                    aria-label="Previous month"
                    onClick={() => shiftMonth(-1)}
                    className="grid h-7 w-7 place-items-center rounded-full text-gray-600 hover:bg-gray-100"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <span className="text-xs font-bold text-[#2B212B] sm:text-sm">
                    {MONTH_NAMES[viewMonth]} {viewYear}
                  </span>
                  <button
                    type="button"
                    aria-label="Next month"
                    onClick={() => shiftMonth(1)}
                    className="grid h-7 w-7 place-items-center rounded-full text-gray-600 hover:bg-gray-100"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>

                {/* Weekday Headers */}
                <div className="grid grid-cols-7 text-center text-xs font-bold text-[#2B212B]">
                  {WEEKDAYS.map((day) => (
                    <span key={day} className="py-1.5">
                      {day}
                    </span>
                  ))}
                </div>

                {/* Days Matrix */}
                <div className="mt-1 grid grid-cols-7 gap-y-1.5 text-center text-xs">
                  {calendarCells.map((cell) => {
                    const isEventDate = eventDatesSet.has(cell.iso);
                    const isSelected = cell.iso === selectedDate;

                    return (
                      <div key={cell.iso} className="flex items-center justify-center">
                        <button
                          type="button"
                          disabled={!isEventDate}
                          onClick={() => handleDateClick(cell.iso)}
                          className={`grid h-8 w-8 place-items-center rounded-full text-xs transition-all ${
                            isSelected
                              ? "bg-[var(--ev-primary)] font-bold text-white shadow-xs"
                              : isEventDate
                                ? "bg-[#FAC8CE] font-bold text-[#7A2029] hover:opacity-90"
                                : cell.inCurrentMonth
                                  ? "cursor-default text-gray-600"
                                  : "cursor-default text-gray-400/70"
                          }`}
                        >
                          {cell.day}
                        </button>
                      </div>
                    );
                  })}
                </div>

                {/* Calendar Legend */}
                <div className="mt-6 flex items-center justify-center gap-6 text-xs text-gray-600">
                  <span className="inline-flex items-center gap-2">
                    <i className="h-3.5 w-3.5 rounded-full bg-[var(--ev-primary)]" />
                    <span>Selected Date</span>
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <i className="h-3.5 w-3.5 rounded-full bg-[#FAC8CE]" />
                    <span>Event Date</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Select Round Cards */}
            <div>
              <h2 className="mb-6 text-center text-xl font-bold text-[#2B212B] sm:text-[22px]">
                Select Round
              </h2>

              <div className="space-y-3">
                {roundsOnSelectedDate.map((round) => {
                  const active = round.id === selectedRound.id;
                  return (
                    <button
                      key={round.id}
                      type="button"
                      onClick={() => onSelectRound(round)}
                      className={`flex w-full items-start gap-3 rounded-lg border px-4 py-3.5 text-left transition-all ${
                        active
                          ? "border-[var(--ev-primary)] bg-[var(--ev-soft)]"
                          : "border-gray-200 bg-white hover:border-gray-300"
                      }`}
                    >
                      <span
                        className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full ${
                          active
                            ? "bg-[var(--ev-primary)] text-white"
                            : "bg-gray-200 text-gray-600"
                        }`}
                      >
                        <Clock size={12} strokeWidth={2.5} />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div
                          className={`text-xs font-semibold leading-snug sm:text-[13.5px] ${
                            active ? "text-[var(--ev-primary)]" : "text-[#2B212B]"
                          }`}
                        >
                          {round.title}
                        </div>
                        <div className="mt-1 text-[11.5px] text-gray-500">
                          {round.startTime} - {round.endTime}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      ) : isTimeslotTicketsMode ? (
        /* STEP 2B: Cinema / Exhibition Screening Time-Slot Ticket Stepper (e.g. Sala Saneha Films) */
        <section className="rounded-xl border border-gray-200/80 bg-white p-5 shadow-xs sm:p-8">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-4">
            <button
              type="button"
              onClick={() => onStepChange("round")}
              className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 px-3.5 py-1.5 text-xs font-bold text-[#2B212B] transition-colors hover:border-[var(--ev-primary)] hover:text-[var(--ev-primary)]"
            >
              <ArrowLeft size={14} />
              <span>Change Date / Round</span>
            </button>

            <div className="text-xs font-semibold text-gray-600">
              Show Time:{" "}
              <strong className="text-[#2B212B]">
                {formatShortDate(selectedRound.date)} · {selectedRound.startTime} -{" "}
                {selectedRound.endTime}
              </strong>
            </div>
          </div>

          <h2 className="mb-6 text-center text-xl font-bold text-[#2B212B] sm:text-[22px]">
            Select Ticket
          </h2>

          <div className="space-y-4">
            {event.ticketTypes.map((ticket) => {
              const available = ticket.availableQuantity ?? ticket.quantity - ticket.sold;
              const minOrder = ticket.minPerOrder ?? 1;
              const maxAllowed = Math.min(ticket.maxPerOrder || 6, Math.max(0, available));
              const qty = quantities[ticket.id] ?? 0;

              return (
                <div
                  key={ticket.id}
                  className={`rounded-xl border p-5 transition-all sm:p-6 ${
                    qty > 0
                      ? "border-[var(--ev-primary)] bg-white"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <h3 className="text-base font-bold text-[#2B212B] sm:text-[16.5px]">
                        {ticket.name}
                      </h3>
                      {ticket.description && (
                        <p className="mt-1 text-xs text-gray-500">{ticket.description}</p>
                      )}
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="text-sm font-bold text-[var(--ev-primary)] sm:text-[15.5px]">
                        {formatTicketMoney(ticket.price, ticket.currency || currency)}
                      </span>

                      <div className="inline-flex items-center gap-1.5">
                        <button
                          type="button"
                          aria-label={`Decrease ${ticket.name}`}
                          disabled={qty <= 0}
                          onClick={() =>
                            onChangeQuantity?.(
                              ticket,
                              stepBundleQuantity(qty, -1, minOrder, maxAllowed)
                            )
                          }
                          className={`grid h-9 w-9 place-items-center rounded-md transition-colors ${
                            qty > 0
                              ? "bg-[var(--ev-primary)] text-[var(--ev-btn-text)] hover:opacity-90"
                              : "cursor-not-allowed bg-[#F3F4F6] text-gray-500"
                          }`}
                        >
                          <Minus size={15} strokeWidth={2.5} />
                        </button>

                        <span className="grid h-9 min-w-[46px] place-items-center rounded-md bg-[#F6F6F6] px-2 text-sm font-bold text-[var(--ev-primary)]">
                          {qty}
                        </span>

                        <button
                          type="button"
                          aria-label={`Increase ${ticket.name}`}
                          disabled={qty >= maxAllowed}
                          onClick={() =>
                            onChangeQuantity?.(
                              ticket,
                              stepBundleQuantity(qty, 1, minOrder, maxAllowed)
                            )
                          }
                          className="grid h-9 w-9 place-items-center rounded-md bg-[var(--ev-primary)] text-[var(--ev-btn-text)] transition-opacity hover:opacity-90 disabled:opacity-40"
                        >
                          <Plus size={15} strokeWidth={2.5} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {ticket.benefits && ticket.benefits.length > 0 && (
                    <ul className="mt-3 space-y-1.5">
                      {ticket.benefits.map((benefit, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-2 text-xs text-gray-600 sm:text-[13px]"
                        >
                          <span className="mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-[4px] bg-emerald-500 text-white">
                            <Check size={11} strokeWidth={3} />
                          </span>
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      ) : (
        /* STEP 2A: Interactive Zone Arena Floorplan & Seat Selection */
        <section className="rounded-xl border border-gray-200/80 bg-white p-5 shadow-xs sm:p-8">
          {/* Step Navigation Header */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-4">
            <button
              type="button"
              onClick={() => onStepChange("round")}
              className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 px-3.5 py-1.5 text-xs font-bold text-[#2B212B] transition-colors hover:border-[var(--ev-primary)] hover:text-[var(--ev-primary)]"
            >
              <ArrowLeft size={14} />
              <span>Change Date / Round</span>
            </button>

            <div className="text-xs font-semibold text-gray-600">
              Show Time:{" "}
              <strong className="text-[#2B212B]">
                {formatShortDate(selectedRound.date)} · {selectedRound.startTime} -{" "}
                {selectedRound.endTime}
              </strong>
            </div>
          </div>

          <h2 className="text-center text-xl font-bold text-[#2B212B] sm:text-[22px]">
            Select Zone &amp; Seat
          </h2>
          <p className="mt-1 text-center text-xs text-gray-500">
            Click a zone on the arena map below, then pick up to {maxSeatsAllowed} seats
          </p>

          {/* Interactive Arena Stage & Zone Map */}
          <div className="mt-6 rounded-2xl border border-gray-200 bg-[#141417] p-4 text-white sm:p-6">
            {/* Stage Banner + Extended Catwalk */}
            <div className="mx-auto max-w-md text-center">
              <div className="rounded-t-2xl bg-gradient-to-r from-zinc-700 via-zinc-500 to-zinc-700 py-2.5 text-xs font-black tracking-[0.28em] text-white shadow-inner">
                MAIN STAGE
              </div>
              <div className="mx-auto h-5 w-24 rounded-b-lg bg-zinc-600/80 text-[9px] font-bold leading-5 tracking-widest text-zinc-200">
                WALKWAY
              </div>
            </div>

            {hasClassicArenaLayout ? (
              <div className="mt-5 space-y-3">
                {/* Row A: A1 A2 A3 | Walkway | A4 A5 A6 */}
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
                  {["A1", "A2", "A3", "A4", "A5", "A6"].map((id) => {
                    const z = zones.find((item) => item.id === id);
                    return z ? renderZoneButton(z, "!bg-opacity-95 text-white") : null;
                  })}
                </div>

                {/* Row B: B1 | FOH Booth | B2 */}
                <div className="grid grid-cols-3 items-stretch gap-2">
                  {zones.find((z) => z.id === "B1") &&
                    renderZoneButton(zones.find((z) => z.id === "B1")!, "text-white")}
                  <div className="flex items-center justify-center rounded-xl border border-dashed border-zinc-600 bg-zinc-800/80 px-2 py-3 text-[11px] font-bold tracking-wider text-zinc-400">
                    FOH CONTROL
                  </div>
                  {zones.find((z) => z.id === "B2") &&
                    renderZoneButton(zones.find((z) => z.id === "B2")!, "text-white")}
                </div>

                {/* Row C: C1 C2 C3 C4 C5 */}
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
                  {["C1", "C2", "C3", "C4", "C5"].map((id) => {
                    const z = zones.find((item) => item.id === id);
                    return z ? renderZoneButton(z, "text-white") : null;
                  })}
                </div>
              </div>
            ) : (
              <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {zones.map((z) => renderZoneButton(z, "text-white"))}
              </div>
            )}
          </div>

          {/* Seat Picker Grid for Active Zone */}
          {activeZone && (
            <div className="mt-6 rounded-2xl border border-gray-200 bg-gray-50/70 p-4 sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-200 pb-3.5">
                <div className="flex items-center gap-2.5">
                  <span
                    style={{ backgroundColor: activeZone.color }}
                    className="inline-flex h-7 items-center rounded-lg px-2.5 text-xs font-extrabold text-[#111111]"
                  >
                    {activeZone.name}
                  </span>
                  <span className="text-xs font-bold text-[#2B212B] sm:text-sm">
                    {activeZone.tierLabel}
                  </span>
                </div>
                <span className="text-xs font-bold text-[var(--ev-primary)] sm:text-sm">
                  {formatTicketMoney(activeZone.price, activeZone.currency)} / seat
                </span>
              </div>

              {/* Seat Legend */}
              <div className="mt-3.5 flex flex-wrap items-center justify-center gap-4 text-[11px] font-medium text-gray-600">
                <span className="inline-flex items-center gap-1.5">
                  <i className="h-3.5 w-3.5 rounded border border-emerald-400 bg-white" />
                  Available
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <i className="h-3.5 w-3.5 rounded bg-[var(--ev-primary)]" />
                  Selected
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <i className="h-3.5 w-3.5 rounded bg-amber-200" />
                  Held
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <i className="h-3.5 w-3.5 rounded bg-gray-300" />
                  Sold
                </span>
              </div>

              {/* Seat Matrix */}
              <div className="mt-5 overflow-x-auto pb-2">
                {backendSeatsForZone ? (
                  <div className="grid min-w-[320px] grid-cols-6 gap-2 sm:grid-cols-8">
                    {backendSeatsForZone.map((s) => {
                      const label = `${s.rowLabel}-${s.seatNumber}`;
                      const key = `${activeZone.id}:${label}`;
                      const isSelected = selectedSeats.some((item) => item.key === key);
                      const isAvailable = s.status === "Available";
                      const isHeld = s.status === "Held";

                      return (
                        <button
                          key={s.id}
                          type="button"
                          disabled={!isAvailable}
                          onClick={() =>
                            onToggleSeat(
                              {
                                key,
                                zoneId: activeZone.id,
                                zoneName: activeZone.name,
                                seatLabel: label,
                                seatId: s.id,
                                ticketTypeId: activeZone.ticketTypeId,
                                price: activeZone.price,
                                currency: activeZone.currency,
                              },
                              maxSeatsAllowed
                            )
                          }
                          className={`h-8 rounded-md border text-[11px] font-bold transition-all ${
                            isSelected
                              ? "border-[var(--ev-primary)] bg-[var(--ev-primary)] text-white shadow-xs"
                              : isAvailable
                                ? "border-emerald-300 bg-white text-[#2B212B] hover:border-[var(--ev-primary)]"
                                : isHeld
                                  ? "cursor-not-allowed border-amber-200 bg-amber-100 text-amber-700"
                                  : "cursor-not-allowed border-gray-200 bg-gray-200 text-gray-400"
                          }`}
                        >
                          {label}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="mx-auto min-w-[420px] max-w-xl space-y-2">
                    {activeZone.rows.map((row) => (
                      <div key={row} className="flex items-center justify-center gap-1.5">
                        <span className="w-5 text-right text-[11px] font-bold text-gray-500">
                          {row}
                        </span>
                        <div className="flex flex-1 justify-center gap-1.5">
                          {Array.from({ length: activeZone.seatsPerRow }, (_, idx) => {
                            const num = idx + 1;
                            const rawCode = `${row}-${num}`;
                            const displayLabel = `${row}-${String(num).padStart(2, "0")}`;
                            const key = `${activeZone.id}:${displayLabel}`;
                            const isSold = activeZone.soldSeats?.includes(rawCode);
                            const isHeld = activeZone.heldSeats?.includes(rawCode);
                            const isSelected = selectedSeats.some((s) => s.key === key);
                            const disabled = Boolean(isSold || isHeld);

                            return (
                              <button
                                key={key}
                                type="button"
                                disabled={disabled}
                                aria-label={`Zone ${activeZone.id} Seat ${displayLabel}`}
                                onClick={() =>
                                  onToggleSeat(
                                    {
                                      key,
                                      zoneId: activeZone.id,
                                      zoneName: activeZone.name,
                                      seatLabel: displayLabel,
                                      ticketTypeId: activeZone.ticketTypeId,
                                      price: activeZone.price,
                                      currency: activeZone.currency,
                                    },
                                    maxSeatsAllowed
                                  )
                                }
                                className={`h-8 w-9 rounded-md border text-[10px] font-bold transition-all ${
                                  isSelected
                                    ? "scale-105 border-[var(--ev-primary)] bg-[var(--ev-primary)] text-white shadow-xs"
                                    : isSold
                                      ? "cursor-not-allowed border-gray-200 bg-gray-200 text-gray-400 line-through"
                                      : isHeld
                                        ? "cursor-not-allowed border-amber-200 bg-amber-100 text-amber-700"
                                        : "border-emerald-300 bg-white text-[#2B212B] hover:border-[var(--ev-primary)] hover:bg-amber-50/40"
                                }`}
                              >
                                {displayLabel}
                              </button>
                            );
                          })}
                        </div>
                        <span className="w-5 text-left text-[11px] font-bold text-gray-500">
                          {row}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </section>
      )}

      {/* Official P2P Ticket Resale Banner Card (#event-marketplace-panel) */}
      {event.resaleEnabled && (
        <section
          id="event-marketplace-panel"
          className="rounded-xl border border-gray-200/80 bg-white px-6 py-7 text-center shadow-xs sm:px-10"
        >
          <div className="flex items-center justify-center gap-3 text-[var(--ev-primary)]">
            <Shield size={22} strokeWidth={2} />
            <BadgeCheck size={22} strokeWidth={2} />
            <Lock size={22} strokeWidth={2} />
          </div>

          <h3 className="mt-3 text-lg font-extrabold text-[#2B212B] sm:text-xl">
            Looking for more tickets?
          </h3>
          <p className="mx-auto mt-1.5 max-w-xl text-xs text-gray-600 sm:text-[13.5px]">
            Explore our Official P2P Marketplace. Secure, convenient, and 100% verified
            ticket transfers guaranteed.
          </p>

          <button
            type="button"
            onClick={onOpenMarketplace}
            className="mt-5 inline-flex h-11 min-w-[230px] items-center justify-center gap-2 rounded-full bg-[var(--ev-primary)] px-7 text-sm font-bold text-[var(--ev-btn-text)] shadow-xs transition-opacity hover:opacity-90"
          >
            <span>Go to Marketplace</span>
            <ArrowRight size={16} />
          </button>
        </section>
      )}
    </div>
  );
}

export function SeatingOrderSummaryCard({
  event,
  step,
  onStepChange,
  selectedRound,
  selectedSeats,
  onRemoveSeat,
  quantities = {},
  checkoutHref,
}: {
  event: Event;
  step: "round" | "seats";
  onStepChange: (next: "round" | "seats") => void;
  selectedRound: EventRound;
  selectedSeats: SelectedZoneSeat[];
  onRemoveSeat: (key: string) => void;
  quantities?: Record<string, number>;
  checkoutHref: string;
}) {
  const currency = event.currency ?? event.ticketTypes[0]?.currency ?? "VND";
  const isTimeslotTicketsMode = event.roundBookingType === "tickets";

  const timeslotCount = event.ticketTypes.reduce(
    (sum, t) => sum + (quantities[t.id] ?? 0),
    0
  );
  const timeslotTotal = event.ticketTypes.reduce(
    (sum, t) => sum + t.price * (quantities[t.id] ?? 0),
    0
  );

  const itemCount = isTimeslotTicketsMode ? timeslotCount : selectedSeats.length;
  const grandTotal = isTimeslotTicketsMode
    ? timeslotTotal
    : selectedSeats.reduce((sum, s) => sum + s.price, 0);

  return (
    <div className="rounded-xl border border-gray-200/80 bg-white p-5 shadow-xs sm:p-6">
      {/* Header: Order (i) */}
      <div className="flex items-center gap-1.5">
        <h3 className="text-lg font-bold text-[#2B212B]">Order</h3>
        <span
          title="Select show round, zone, and tickets"
          className="inline-flex text-gray-500"
        >
          <Info size={15} />
        </span>
      </div>

      {/* Show Time Block */}
      <div className="mt-4">
        <div className="text-xs font-bold text-[var(--ev-primary)]">Show Time</div>
        <p className="mt-1 text-[13px] leading-relaxed text-[#2B212B]">
          {formatShortDate(selectedRound.date)} | {selectedRound.title}
        </p>
      </div>

      {step === "round" ? (
        <button
          type="button"
          disabled={event.status === "sold_out"}
          onClick={() => onStepChange("seats")}
          className="mt-6 flex h-11 w-full items-center justify-center rounded-full bg-[var(--ev-primary)] text-sm font-bold text-[var(--ev-btn-text)] shadow-xs transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {event.status === "sold_out" ? "Sold Out" : "Next"}
        </button>
      ) : (
        <>
          <div className="mt-4 border-t border-gray-100 pt-4">
            <div className="text-xs font-bold text-[var(--ev-primary)]">
              {isTimeslotTicketsMode
                ? `Selected Ticket (${itemCount})`
                : `Selected Seat (${selectedSeats.length})`}
            </div>

            {isTimeslotTicketsMode ? (
              itemCount === 0 ? (
                <div className="mt-2 flex items-center justify-between text-xs text-gray-400">
                  <span>---</span>
                  <span>---</span>
                </div>
              ) : (
                <div className="mt-2.5 space-y-2">
                  {event.ticketTypes.map((t) => {
                    const q = quantities[t.id] ?? 0;
                    if (q <= 0) return null;
                    return (
                      <div
                        key={t.id}
                        className="flex items-start justify-between gap-2 text-[13px] text-[#2B212B]"
                      >
                        <span>
                          {q} x {t.name}
                        </span>
                        <span className="shrink-0 font-medium">
                          {formatTicketMoney(t.price * q, t.currency || currency, {
                            zeroAsNumber: true,
                          })}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )
            ) : selectedSeats.length === 0 ? (
              <p className="mt-2 text-xs text-gray-400">
                Click an available seat on the map to add it to your order.
              </p>
            ) : (
              <div className="mt-2.5 space-y-2">
                {selectedSeats.map((s) => (
                  <div
                    key={s.key}
                    className="flex items-center justify-between gap-2 rounded-lg bg-gray-50 px-3 py-2 text-xs text-[#2B212B]"
                  >
                    <div>
                      <span className="font-bold">Zone {s.zoneId}</span> · Seat{" "}
                      <span className="font-bold">{s.seatLabel}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">
                        {formatTicketMoney(s.price, s.currency, { zeroAsNumber: true })}
                      </span>
                      <button
                        type="button"
                        onClick={() => onRemoveSeat(s.key)}
                        aria-label={`Remove seat ${s.seatLabel}`}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <X size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-4 flex items-center justify-between rounded-lg bg-[var(--ev-soft)] px-4 py-3 text-sm font-bold text-[var(--ev-primary)]">
            <span>Grand Total</span>
            <span>{formatTicketMoney(grandTotal, currency, { zeroAsNumber: true })}</span>
          </div>

          <Link
            href={checkoutHref}
            aria-disabled={itemCount === 0 || event.status === "sold_out"}
            className={`mt-4 flex h-11 w-full items-center justify-center rounded-full text-sm font-bold transition-all ${
              itemCount > 0 && event.status !== "sold_out"
                ? "bg-[var(--ev-primary)] text-[var(--ev-btn-text)] shadow-sm hover:opacity-92"
                : "pointer-events-none bg-[var(--ev-primary)] text-[var(--ev-btn-text)] opacity-75"
            }`}
          >
            Buy Ticket
          </Link>

          <AcceptedPaymentsBlock />
        </>
      )}
    </div>
  );
}
