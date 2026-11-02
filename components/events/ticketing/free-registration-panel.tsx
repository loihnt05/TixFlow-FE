"use client";

import Link from "next/link";
import { useState } from "react";
import { Check, Info, KeyRound, Minus, Plus, Sparkles, Tag, X } from "lucide-react";
import type { Event, PromoCodeRule, TicketType } from "@/lib/mock/events";
import { formatTicketMoney, stepBundleQuantity } from "./format-utils";

interface FreeRegistrationPanelProps {
  event: Event;
  quantities: Record<string, number>;
  selectedAddons: Record<string, string[]>;
  onChangeQuantity: (ticket: TicketType, nextQty: number) => void;
  onSelectSingleTicket?: (ticket: TicketType) => void;
  onToggleAddon: (ticketId: string, addonId: string) => void;
  appliedPromo: PromoCodeRule | null;
  onApplyPromo: (rule: PromoCodeRule | null) => void;
  checkoutHref: string;
  totalTickets: number;
}

export function FreeRegistrationLeftPanel({
  event,
  quantities,
  selectedAddons,
  onChangeQuantity,
  onSelectSingleTicket,
  onToggleAddon,
  appliedPromo,
  onApplyPromo,
}: Pick<
  FreeRegistrationPanelProps,
  | "event"
  | "quantities"
  | "selectedAddons"
  | "onChangeQuantity"
  | "onSelectSingleTicket"
  | "onToggleAddon"
  | "appliedPromo"
  | "onApplyPromo"
>) {
  const [promoInput, setPromoInput] = useState(appliedPromo?.code ?? "");
  const [promoFeedback, setPromoFeedback] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const isRadioMode = event.registrationStyle === "radio";
  const requiresPromo = Boolean(event.requirePromoToUnlock);
  const showPromoBox = Boolean(
    requiresPromo || event.enablePromoCode || (event.promoCodes && event.promoCodes.length > 0)
  );
  const isLockedByPromo = requiresPromo && !appliedPromo;

  function applyCodeValue(raw: string) {
    const cleaned = raw.trim().toUpperCase();
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
        text: "Invite / promotional code verified! Tickets unlocked below.",
      });
      // Automatically select 1 ticket if unlocked and none selected yet
      const firstAvail = event.ticketTypes.find((t) => t.status === "available");
      if (firstAvail && (quantities[firstAvail.id] ?? 0) === 0) {
        onChangeQuantity(firstAvail, 1);
      }
    } else {
      const sampleCodes = rules.map((r) => r.code).join(", ");
      setPromoFeedback({
        type: "error",
        text: sampleCodes
          ? `Invalid code. Try demo code: ${sampleCodes}`
          : "Invalid or expired promotional code.",
      });
    }
  }

  function handlePromoSubmit(e: React.FormEvent) {
    e.preventDefault();
    applyCodeValue(promoInput);
  }

  function clearPromo() {
    setPromoInput("");
    onApplyPromo(null);
    setPromoFeedback(null);
  }

  return (
    <div id="panel-register" className="scroll-mt-32 space-y-5">
      {/* Optional Zipevent Promo Code Input Bar (e.g. Suki Teenoi x Coke Fest 2026) */}
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
              htmlFor="zipevent-reg-promo-field"
              className="text-xs font-medium text-[#2B212B] sm:text-[13.5px]"
            >
              If you have a promotional code, please enter it here.
            </label>

            <div className="flex items-center rounded-full border border-[var(--ev-primary)] bg-white py-1 pl-4 pr-1 sm:w-[295px]">
              <input
                id="zipevent-reg-promo-field"
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
                promoFeedback.type === "success" ? "text-emerald-600" : "text-[var(--ev-primary)]"
              }`}
            >
              <Tag size={13} />
              <span>{promoFeedback.text}</span>
            </div>
          )}
        </div>
      )}

      {/* Main Tickets Panel */}
      <section className="rounded-xl border border-gray-200/80 bg-white p-6 shadow-xs sm:p-8">
        <h2 className="mb-6 text-center text-xl font-bold text-[#2B212B] sm:text-[22px]">
          Tickets
        </h2>

        {isLockedByPromo ? (
          /* Authentic Zipevent Promo-Code-Locked Gate (e.g. Suki Teenoi x Coke Fest 2026) */
          <div className="py-8 text-center">
            <p className="text-sm font-medium text-[#2B212B] sm:text-[15.5px]">
              This event requires a <strong className="font-extrabold">PROMO CODE</strong> to
              register/get ticket.
            </p>
            {event.promoCodes && event.promoCodes.length > 0 && (
              <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                <span className="inline-flex items-center gap-1 text-xs text-gray-400">
                  <KeyRound size={12} />
                  <span>Demo code:</span>
                </span>
                {event.promoCodes.map((rule) => (
                  <button
                    key={rule.code}
                    type="button"
                    onClick={() => {
                      setPromoInput(rule.code);
                      applyCodeValue(rule.code);
                    }}
                    className="rounded-full border border-dashed border-[var(--ev-primary)] bg-[var(--ev-soft)] px-3 py-1 text-xs font-bold text-[var(--ev-primary)] transition-transform hover:scale-105"
                  >
                    {rule.code}
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {event.ticketTypes.map((ticket) => {
              const available = ticket.availableQuantity ?? ticket.quantity - ticket.sold;
              const maxAllowed = Math.min(ticket.maxPerOrder || 4, Math.max(0, available));
              const minOrder = ticket.minPerOrder ?? 1;
              const qty = quantities[ticket.id] ?? 0;
              const isSoldOut = ticket.status === "sold_out" || available <= 0;
              const isEnded = ticket.status === "ended";
              const isNotStarted = ticket.status === "not_started";
              const disabled = isSoldOut || isEnded || isNotStarted || event.status === "sold_out";
              const chosenAddons = selectedAddons[ticket.id] ?? [];

              if (isRadioMode) {
                /* Authentic Zipevent Radio-Button Single-Track Registration (Creator Affiliate Fest 2026) */
                const selected = qty > 0;
                return (
                  <div
                    key={ticket.id}
                    onClick={() => {
                      if (!disabled && onSelectSingleTicket) {
                        onSelectSingleTicket(ticket);
                      }
                    }}
                    role="radio"
                    aria-checked={selected}
                    tabIndex={disabled ? -1 : 0}
                    onKeyDown={(e) => {
                      if ((e.key === "Enter" || e.key === " ") && !disabled && onSelectSingleTicket) {
                        e.preventDefault();
                        onSelectSingleTicket(ticket);
                      }
                    }}
                    className={`cursor-pointer rounded-xl border p-5 transition-all sm:p-6 ${
                      selected
                        ? "border-[var(--ev-primary)] bg-white"
                        : "border-gray-200 bg-white hover:border-gray-300"
                    } ${disabled ? "cursor-not-allowed opacity-60" : ""}`}
                  >
                    <div className="flex items-start gap-3.5">
                      {/* Zipevent Coral Radio Circle */}
                      <span
                        className={`mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full border-2 transition-colors ${
                          selected
                            ? "border-[var(--ev-primary)]"
                            : "border-gray-300"
                        }`}
                      >
                        {selected && (
                          <span className="h-2.5 w-2.5 rounded-full bg-[var(--ev-primary)]" />
                        )}
                      </span>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <h3 className="text-base font-bold text-[#2B212B] sm:text-[16.5px]">
                            {ticket.name}
                          </h3>
                          {disabled && (
                            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-500">
                              {isNotStarted ? "Coming Soon" : isEnded ? "Ended" : "Full"}
                            </span>
                          )}
                        </div>

                        <div className="mt-0.5 text-sm font-bold text-[var(--ev-primary)]">
                          Free
                        </div>

                        {ticket.description && (
                          <p className="mt-2.5 whitespace-pre-line text-xs leading-relaxed text-gray-600 sm:text-[13.5px]">
                            {ticket.description}
                          </p>
                        )}

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

                        <div className="mt-4 text-xs text-gray-500 sm:text-[13px]">
                          <strong className="font-bold text-[#2B212B]">Until :</strong>{" "}
                          <span>{ticket.saleEndLabel ?? "07 Nov 2026 18:00"}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={ticket.id}
                  className={`rounded-xl border p-5 transition-all sm:p-6 ${
                    qty > 0
                      ? "border-[var(--ev-primary)] bg-white"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  {/* Top Row: Name on left | Free + Zipevent Square Stepper on right */}
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <h3 className="text-base font-bold text-[#2B212B] sm:text-[17px]">
                      {ticket.name}
                    </h3>

                    <div className="flex items-center gap-4">
                      <span className="text-sm font-bold text-[var(--ev-primary)] sm:text-[15px]">
                        Free
                      </span>

                      {disabled ? (
                        <span className="rounded-full bg-gray-100 px-3.5 py-1.5 text-xs font-semibold text-gray-500">
                          {isNotStarted ? "Coming Soon" : isEnded ? "Sale Ended" : "Full"}
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
                                : "cursor-not-allowed bg-[#F3F4F6] text-gray-500 opacity-70"
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

                  {/* Ticket Description */}
                  {ticket.description && (
                    <p className="mt-3 whitespace-pre-line text-xs leading-relaxed text-gray-600 sm:text-[13.5px]">
                      {ticket.description}
                    </p>
                  )}

                  {/* Optional Checkmark Benefits */}
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

                  {/* Optional Free Workshop / Stage Add-ons */}
                  {qty > 0 && ticket.addons && ticket.addons.length > 0 && (
                    <div className="mt-4 rounded-xl border border-gray-100 bg-gray-50/80 p-3.5">
                      <div className="mb-2 flex items-center gap-1.5 text-xs font-bold text-[#2B212B]">
                        <Sparkles size={13} className="text-[var(--ev-primary)]" />
                        <span>Optional Workshop &amp; Clinic Reservation (Free Add-on)</span>
                      </div>
                      <div className="space-y-2">
                        {ticket.addons.map((addon) => {
                          const checked = chosenAddons.includes(addon.id);
                          return (
                            <label
                              key={addon.id}
                              onClick={(e) => e.stopPropagation()}
                              className={`flex cursor-pointer items-center justify-between gap-3 rounded-lg border px-3 py-2 text-xs transition-colors ${
                                checked
                                  ? "border-[var(--ev-primary)] bg-white"
                                  : "border-gray-200 bg-white/70 hover:border-gray-300"
                              }`}
                            >
                              <div className="flex items-center gap-2.5">
                                <input
                                  type="checkbox"
                                  checked={checked}
                                  onChange={() => onToggleAddon(ticket.id, addon.id)}
                                  className="h-4 w-4 rounded accent-[#ef5360]"
                                />
                                <div>
                                  <div className="font-semibold text-[#2B212B]">{addon.name}</div>
                                  <div className="text-[11px] text-gray-500">
                                    {addon.timeLabel} · {addon.stage} ({addon.spotsLeft} spots left)
                                  </div>
                                </div>
                              </div>
                              <span className="shrink-0 font-bold text-[var(--ev-primary)]">
                                FREE
                              </span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Until Timestamp */}
                  <div className="mt-4 text-xs text-gray-500 sm:text-[13px]">
                    <strong className="font-bold text-[#2B212B]">
                      {isNotStarted ? "Available on :" : "Until :"}
                    </strong>{" "}
                    <span>
                      {isNotStarted
                        ? ticket.saleStartLabel ?? "Coming Soon"
                        : ticket.saleEndLabel ?? "14 Nov 2026 19:00"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

export function FreeRegistrationSummaryCard({
  event,
  quantities,
  selectedAddons,
  appliedPromo,
  checkoutHref,
  totalTickets,
}: Pick<
  FreeRegistrationPanelProps,
  | "event"
  | "quantities"
  | "selectedAddons"
  | "appliedPromo"
  | "checkoutHref"
  | "totalTickets"
>) {
  const isLockedByPromo = Boolean(event.requirePromoToUnlock) && !appliedPromo;
  const canRegister = !isLockedByPromo && totalTickets > 0 && event.status !== "sold_out";
  const currency = event.currency ?? event.ticketTypes[0]?.currency ?? "THB";

  return (
    <div className="rounded-xl border border-gray-200/80 bg-white p-5 shadow-xs sm:p-6">
      {/* Header: Registration (i) */}
      <div className="flex items-center gap-1.5">
        <h3 className="text-lg font-bold text-[#2B212B]">Registration</h3>
        <span
          title="Free digital e-Ticket registration with instant QR confirmation"
          className="inline-flex text-gray-500"
        >
          <Info size={15} />
        </span>
      </div>

      {/* Selected Free Ticket Rows */}
      <div className="mt-4 border-b border-gray-100 pb-4">
        <div className="text-xs font-bold text-[var(--ev-primary)]">Ticket</div>

        {isLockedByPromo || totalTickets === 0 ? (
          <div className="mt-2 flex items-center justify-between text-xs text-gray-400">
            <span>---</span>
            <span>---</span>
          </div>
        ) : (
          <div className="mt-2 space-y-2">
            {event.ticketTypes.map((ticket) => {
              const qty = quantities[ticket.id] ?? 0;
              if (qty <= 0) return null;
              const addons = (selectedAddons[ticket.id] ?? [])
                .map((id) => ticket.addons?.find((a) => a.id === id))
                .filter(Boolean);

              return (
                <div key={ticket.id} className="space-y-1.5">
                  <div className="flex items-start justify-between gap-2 text-[13px] text-[#2B212B]">
                    <span>
                      {qty} x {ticket.name}
                    </span>
                    <span className="shrink-0 font-semibold">FREE</span>
                  </div>
                  {addons.map((addon) =>
                    addon ? (
                      <div
                        key={addon.id}
                        className="flex items-start justify-between gap-2 pl-3 text-[11.5px] text-gray-500"
                      >
                        <span>+ {addon.name}</span>
                        <span className="shrink-0 font-medium">FREE</span>
                      </div>
                    ) : null
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Grand Total Soft Highlight Box */}
      <div className="mt-4 flex items-center justify-between rounded-lg bg-[var(--ev-soft)] px-4 py-3 text-sm font-bold text-[var(--ev-primary)]">
        <span>Grand Total</span>
        <span>
          {isLockedByPromo || totalTickets === 0
            ? formatTicketMoney(0, currency, { zeroAsNumber: true })
            : "FREE"}
        </span>
      </div>

      {/* Primary Pill CTA: Register */}
      <Link
        href={checkoutHref}
        aria-disabled={!canRegister}
        className={`mt-4 flex h-11 w-full items-center justify-center rounded-full text-sm font-bold transition-all ${
          canRegister
            ? "bg-[var(--ev-primary)] text-[var(--ev-btn-text)] shadow-sm hover:opacity-92 active:scale-[0.99]"
            : "pointer-events-none bg-[var(--ev-primary)] text-[var(--ev-btn-text)] opacity-75"
        }`}
      >
        {event.status === "sold_out" ? "Registration Closed" : "Register"}
      </Link>
    </div>
  );
}
