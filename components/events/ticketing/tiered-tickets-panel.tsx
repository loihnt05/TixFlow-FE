"use client";

import Link from "next/link";
import { useState } from "react";
import { Check, ChevronDown, ChevronUp, Info, Minus, Plus, Tag, X } from "lucide-react";
import type { Event, PromoCodeRule, TicketType } from "@/lib/mock/events";
import {
  AcceptedPaymentsBlock,
  formatTicketMoney,
  stepBundleQuantity,
} from "./format-utils";

interface TieredTicketsLeftProps {
  event: Event;
  quantities: Record<string, number>;
  onChangeQuantity: (ticket: TicketType, nextQty: number) => void;
  appliedPromo: PromoCodeRule | null;
  onApplyPromo: (rule: PromoCodeRule | null) => void;
}

export function TieredTicketsLeftPanel({
  event,
  quantities,
  onChangeQuantity,
  appliedPromo,
  onApplyPromo,
}: TieredTicketsLeftProps) {
  const [promoInput, setPromoInput] = useState(appliedPromo?.code ?? "");
  const [promoFeedback, setPromoFeedback] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const [openPhases, setOpenPhases] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    (event.ticketPhases ?? []).forEach((phase, index) => {
      init[phase.id] = phase.defaultOpen ?? index === 0;
    });
    return init;
  });

  const currency = event.currency ?? event.ticketTypes[0]?.currency ?? "VND";
  const showPromoBox = Boolean(
    event.enablePromoCode || (event.promoCodes && event.promoCodes.length > 0)
  );
  const phaseHeaderStyle = event.theme?.phaseHeaderStyle ?? "dark";

  function handlePromoSubmit(e: React.FormEvent) {
    e.preventDefault();
    const cleaned = promoInput.trim().toUpperCase();
    if (!cleaned) {
      onApplyPromo(null);
      setPromoFeedback(null);
      return;
    }
    const rules = event.promoCodes ?? [];
    const matched = rules.find((r) => r.code.toUpperCase() === cleaned);
    if (matched) {
      onApplyPromo(matched);
      setPromoFeedback({
        type: "success",
        text: "Code applied successfully. See the updates below.",
      });
    } else {
      const sampleCodes = rules.map((r) => r.code).join(", ");
      setPromoFeedback({
        type: "error",
        text: sampleCodes
          ? `Invalid promotional code. Available demo codes: ${sampleCodes}`
          : "Invalid or expired promotional code.",
      });
    }
  }

  function clearPromo() {
    setPromoInput("");
    onApplyPromo(null);
    setPromoFeedback(null);
  }

  function togglePhase(phaseId: string) {
    setOpenPhases((prev) => ({ ...prev, [phaseId]: !prev[phaseId] }));
  }

  const renderTicketRow = (ticket: TicketType, groupedInPhase: boolean) => {
    const available = ticket.availableQuantity ?? ticket.quantity - ticket.sold;
    const minOrder = ticket.minPerOrder ?? 1;
    const maxAllowed = Math.min(ticket.maxPerOrder || 10, Math.max(0, available));
    const qty = quantities[ticket.id] ?? 0;

    const isNotStarted = ticket.status === "not_started";
    const isEnded = ticket.status === "ended";
    const isSoldOut =
      !isNotStarted && !isEnded && (ticket.status === "sold_out" || available < minOrder);
    const unavailable = isNotStarted || isEnded || isSoldOut || event.status === "sold_out";

    return (
      <div
        key={ticket.id}
        className={
          groupedInPhase
            ? "p-5 transition-colors sm:p-6"
            : `rounded-xl border p-5 transition-all sm:p-6 ${
                qty > 0
                  ? "border-[var(--ev-primary)] bg-white"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`
        }
      >
        {/* Top Row: Ticket Name on left | Price + Stepper / Status Pill on right */}
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div className="min-w-0">
            <h3 className="text-base font-bold text-[#2B212B] sm:text-[16.5px]">
              {ticket.name}
            </h3>
            {minOrder > 1 && !unavailable && (
              <span className="mt-0.5 inline-block text-[11px] font-semibold text-[var(--ev-primary)]">
                Bundle: {minOrder}–{ticket.maxPerOrder} tickets per order
              </span>
            )}
          </div>

          <div className="flex items-center justify-between gap-4 sm:justify-end">
            <span className="text-sm font-bold text-[var(--ev-primary)] sm:text-[15.5px]">
              {formatTicketMoney(ticket.price, ticket.currency || currency)}
            </span>

            {unavailable ? (
              <span className="inline-flex h-9 items-center rounded-full bg-gray-100 px-4 text-xs font-semibold text-gray-500">
                {isNotStarted ? "Coming Soon" : isEnded ? "Sale Ended" : "Sold Out"}
              </span>
            ) : (
              <div className="inline-flex items-center gap-1.5">
                <button
                  type="button"
                  aria-label={`Decrease ${ticket.name}`}
                  disabled={qty <= 0}
                  onClick={() =>
                    onChangeQuantity(
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

                <span
                  aria-live="polite"
                  className="grid h-9 min-w-[46px] place-items-center rounded-md bg-[#F6F6F6] px-2 text-sm font-bold text-[var(--ev-primary)]"
                >
                  {qty}
                </span>

                <button
                  type="button"
                  aria-label={`Increase ${ticket.name}`}
                  disabled={qty >= maxAllowed}
                  onClick={() =>
                    onChangeQuantity(
                      ticket,
                      stepBundleQuantity(qty, 1, minOrder, maxAllowed)
                    )
                  }
                  className="grid h-9 w-9 place-items-center rounded-md bg-[var(--ev-primary)] text-[var(--ev-btn-text)] transition-opacity hover:opacity-90 disabled:opacity-40"
                >
                  <Plus size={15} strokeWidth={2.5} />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Multi-line Description */}
        {ticket.description && (
          <p className="mt-3 whitespace-pre-line text-xs leading-relaxed text-gray-600 sm:text-[13.5px]">
            {ticket.description}
          </p>
        )}

        {/* Green Checkmark Benefits */}
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

        {/* Sale End / Available On Timestamp */}
        <div className="mt-4 text-xs text-gray-500 sm:text-[13px]">
          <strong className="font-bold text-[#2B212B]">
            {isNotStarted ? "Available on :" : "Until :"}
          </strong>{" "}
          <span>
            {isNotStarted
              ? ticket.saleStartLabel ?? "04 Nov 2026 00:00"
              : ticket.saleEndLabel ?? "03 Nov 2026 23:59"}
          </span>
        </div>
      </div>
    );
  };

  const validPhaseIds = new Set((event.ticketPhases ?? []).map((p) => p.id));
  const hasPhases = Boolean(
    event.ticketPhases &&
      event.ticketPhases.length > 0 &&
      event.ticketTypes.some((t) => t.phaseId && validPhaseIds.has(t.phaseId))
  );

  return (
    <div id="panel-register" className="scroll-mt-32 space-y-5">
      {/* Zipevent Promo Code Panel (#promo-input) */}
      {showPromoBox && (
        <div
          id="promo-input"
          className="rounded-xl border border-gray-200/80 bg-white px-5 py-4 shadow-xs sm:px-7 sm:py-4.5"
        >
          <form
            onSubmit={handlePromoSubmit}
            className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center"
          >
            <label
              htmlFor="zipevent-promo-field"
              className="text-xs font-medium text-[#2B212B] sm:text-[13.5px]"
            >
              If you have a promotional code, please enter it here.
            </label>

            <div className="flex items-center rounded-full border border-[var(--ev-primary)] bg-white py-1 pl-4 pr-1 sm:w-[295px]">
              <input
                id="zipevent-promo-field"
                type="text"
                value={promoInput}
                onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                placeholder="PROMO CODE"
                className="min-w-0 flex-1 bg-transparent text-xs font-semibold uppercase tracking-wide text-[#2B212B] outline-none placeholder:font-normal placeholder:text-gray-400"
              />
              {appliedPromo ? (
                <button
                  type="button"
                  onClick={clearPromo}
                  aria-label="Remove promo code"
                  className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3.5 py-1.5 text-xs font-bold text-gray-700 hover:bg-gray-200"
                >
                  <X size={12} />
                  <span>Clear</span>
                </button>
              ) : (
                <button
                  type="submit"
                  className="rounded-full bg-[var(--ev-primary)] px-4 py-1.5 text-xs font-bold text-[var(--ev-btn-text)] transition-opacity hover:opacity-90"
                >
                  Apply
                </button>
              )}
            </div>
          </form>

          {promoFeedback && (
            <div
              className={`mt-2.5 flex items-center gap-1.5 text-xs font-medium ${
                promoFeedback.type === "success"
                  ? "text-emerald-600"
                  : "text-[var(--ev-primary)]"
              }`}
            >
              <Tag size={13} />
              <span>{promoFeedback.text}</span>
            </div>
          )}
        </div>
      )}

      {/* Main Tickets Panel */}
      <section className="rounded-xl border border-gray-200/80 bg-white p-5 shadow-xs sm:p-8">
        <h2 className="mb-6 text-center text-xl font-bold text-[#2B212B] sm:text-[22px]">
          Tickets
        </h2>

        {hasPhases ? (
          <div className="space-y-4">
            {event.ticketPhases!.map((phase) => {
              const phaseTickets = event.ticketTypes.filter(
                (t) => t.phaseId === phase.id
              );
              if (phaseTickets.length === 0) return null;
              const isOpen = openPhases[phase.id] ?? true;

              const headerButtonClasses =
                phaseHeaderStyle === "outline"
                  ? `flex w-full items-center justify-between border border-[var(--ev-primary)] bg-white px-5 py-3.5 text-left text-sm font-bold text-[var(--ev-primary)] transition-colors hover:bg-[var(--ev-soft)] sm:text-[15.5px] ${
                      isOpen ? "rounded-t-xl" : "rounded-xl"
                    }`
                  : phaseHeaderStyle === "brand"
                    ? `flex w-full items-center justify-between bg-[var(--ev-primary)] px-5 py-3.5 text-left text-sm font-bold text-[var(--ev-btn-text)] transition-opacity hover:opacity-95 sm:text-[15.5px] ${
                        isOpen ? "rounded-t-xl" : "rounded-xl"
                      }`
                    : `flex w-full items-center justify-between bg-[#080808] px-5 py-3.5 text-left text-sm font-bold text-white transition-colors hover:bg-[#1a1a1a] sm:text-[15.5px] ${
                        isOpen ? "rounded-t-xl" : "rounded-xl"
                      }`;

              const bodyBorderClasses =
                phaseHeaderStyle === "outline"
                  ? "divide-y divide-gray-100 rounded-b-xl border border-t-0 border-[var(--ev-primary)] bg-white"
                  : "divide-y divide-gray-100 rounded-b-xl border border-t-0 border-gray-200 bg-white";

              return (
                <div key={phase.id} className="overflow-hidden rounded-xl">
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => togglePhase(phase.id)}
                    className={headerButtonClasses}
                  >
                    <span>{phase.name}</span>
                    {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </button>

                  {isOpen && (
                    <div className={bodyBorderClasses}>
                      {phaseTickets.map((ticket) => renderTicketRow(ticket, true))}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Render any unphased tickets below if mixed */}
            {event.ticketTypes
              .filter((t) => !t.phaseId || !validPhaseIds.has(t.phaseId))
              .map((ticket) => renderTicketRow(ticket, false))}
          </div>
        ) : (
          <div className="space-y-4">
            {event.ticketTypes.map((ticket) => renderTicketRow(ticket, false))}
          </div>
        )}
      </section>
    </div>
  );
}

interface TieredOrderSummaryProps {
  event: Event;
  quantities: Record<string, number>;
  appliedPromo: PromoCodeRule | null;
  checkoutHref: string;
  totalTickets: number;
  subtotal: number;
  discountAmount: number;
  grandTotal: number;
}

export function TieredOrderSummaryCard({
  event,
  quantities,
  appliedPromo,
  checkoutHref,
  totalTickets,
  discountAmount,
  grandTotal: netAfterPromo,
}: TieredOrderSummaryProps) {
  const currency = event.currency ?? event.ticketTypes[0]?.currency ?? "VND";
  const canBuy = totalTickets > 0 && event.status !== "sold_out";

  // VAT calculation supporting BOTH inclusive VAT (ECONOMICFORUM2026, Secret Sauce)
  // AND exclusive VAT added on top (JAMBOX x Asia Pillars, Mission To The Moon)!
  const vatRate = event.vatRate ?? 0;
  const vatIncluded = event.vatIncluded !== false;
  const showVatBreakdown = vatRate > 0 && netAfterPromo > 0;

  const excludedVat = showVatBreakdown
    ? vatIncluded
      ? netAfterPromo / (1 + vatRate)
      : netAfterPromo
    : netAfterPromo;

  const vatAmount = showVatBreakdown
    ? vatIncluded
      ? netAfterPromo - excludedVat
      : netAfterPromo * vatRate
    : 0;

  const finalPayableTotal = showVatBreakdown && !vatIncluded
    ? netAfterPromo + vatAmount
    : netAfterPromo;

  return (
    <div className="rounded-xl border border-gray-200/80 bg-white p-5 shadow-xs sm:p-6">
      {/* Header: Order (i) */}
      <div className="flex items-center gap-1.5">
        <h3 className="text-lg font-bold text-[#2B212B]">Order</h3>
        <span
          title="Ticket prices and order summary"
          className="inline-flex text-gray-500"
        >
          <Info size={15} />
        </span>
      </div>

      {/* Selected Ticket Line Items */}
      <div className="mt-4 border-b border-gray-100 pb-4">
        <div className="text-xs font-bold text-[var(--ev-primary)]">Ticket</div>

        {totalTickets === 0 ? (
          <div className="mt-2 flex items-center justify-between text-xs text-gray-400">
            <span>---</span>
            <span>---</span>
          </div>
        ) : (
          <div className="mt-2 space-y-2">
            {event.ticketTypes.map((t) => {
              const qty = quantities[t.id] ?? 0;
              if (qty <= 0) return null;
              return (
                <div
                  key={t.id}
                  className="flex items-start justify-between gap-2 text-[13px] text-[#2B212B]"
                >
                  <span>
                    {qty} x {t.name}
                  </span>
                  <span className="shrink-0 font-medium">
                    {formatTicketMoney(t.price * qty, t.currency || currency, {
                      zeroAsNumber: true,
                    })}
                  </span>
                </div>
              );
            })}

            {appliedPromo && discountAmount > 0 && (
              <div className="flex items-center justify-between gap-2 pt-1 text-xs font-semibold text-emerald-600">
                <span>Promo ({appliedPromo.code})</span>
                <span>
                  -{formatTicketMoney(discountAmount, currency, { zeroAsNumber: true })}
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* VAT (7%) Breakdown — Supports both Inclusive & Exclusive Zipevent VAT */}
      {showVatBreakdown && (
        <div className="space-y-1.5 border-b border-gray-100 py-3.5 text-[12.5px]">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-[var(--ev-primary)]">Excluded Vat</span>
            <span className="text-[#2B212B]">
              {formatTicketMoney(excludedVat, currency, { zeroAsNumber: true })}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-semibold text-[var(--ev-primary)]">
              VAT ({Math.round(vatRate * 100)}%)
            </span>
            <span className="text-[#2B212B]">
              {formatTicketMoney(vatAmount, currency, { zeroAsNumber: true })}
            </span>
          </div>
        </div>
      )}

      {/* Grand Total Soft Highlight Box */}
      <div className="mt-4 flex items-center justify-between rounded-lg bg-[var(--ev-soft)] px-4 py-3 text-sm font-bold text-[var(--ev-primary)]">
        <span>Grand Total</span>
        <span>{formatTicketMoney(finalPayableTotal, currency, { zeroAsNumber: true })}</span>
      </div>

      {/* Primary Pill CTA: Buy Ticket */}
      <Link
        href={checkoutHref}
        aria-disabled={!canBuy}
        className={`mt-4 flex h-11 w-full items-center justify-center rounded-full text-sm font-bold transition-all ${
          canBuy
            ? "bg-[var(--ev-primary)] text-[var(--ev-btn-text)] shadow-sm hover:opacity-92 active:scale-[0.99]"
            : "pointer-events-none bg-[var(--ev-primary)] text-[var(--ev-btn-text)] opacity-75"
        }`}
      >
        {event.status === "sold_out" ? "Sold Out" : "Buy Ticket"}
      </Link>

      {/* Accepted Payments Badges */}
      <AcceptedPaymentsBlock />
    </div>
  );
}
