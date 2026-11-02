"use client";

import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Clock,
  ShieldCheck,
  CreditCard,
  Building2,
  Wallet,
  LockKeyhole,
  CheckCircle2,
  ChevronRight,
  Ticket,
  Calendar,
  MapPin,
  Tag,
} from "lucide-react";
import type { Event, TicketType } from "@/lib/mock/events";
import { useKeycloakAuth } from "@/components/auth-provider";
import { useApi } from "@/lib/api";
import { formatTicketMoney } from "@/components/events/ticketing/format-utils";

type Payment = "card" | "bank" | "wallet";

interface CheckoutViewProps {
  event: Event;
  ticket: TicketType;
  quantity: number;
  sessionId?: string;
  ticketId?: string;
  inventoryMode?: "GeneralAdmission" | "ReservedSeating";
  seatIds?: string[];
  existingHoldId?: string;
  rawItems?: string;
  promoCode?: string;
  roundLabel?: string;
  zoneLabel?: string;
  seatLabels?: string[];
  addonsLabel?: string;
}

export function CheckoutView({
  event,
  ticket,
  quantity,
  sessionId,
  ticketId = ticket.id,
  inventoryMode = ticket.inventoryMode ?? "GeneralAdmission",
  seatIds = [],
  existingHoldId,
  rawItems,
  promoCode,
  roundLabel,
  zoneLabel,
  seatLabels,
  addonsLabel,
}: CheckoutViewProps) {
  const router = useRouter();
  const auth = useKeycloakAuth();
  const api = useApi();
  const [payment, setPayment] = useState<Payment>("card");
  const [mockOutcome, setMockOutcome] = useState<"Succeeded" | "Failed" | "Timeout">("Succeeded");
  const [submitting, setSubmitting] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string>();
  const [serverTotal, setServerTotal] = useState<number>();
  const [holdReady, setHoldReady] = useState(!existingHoldId);
  const apiRef = useRef(api);
  apiRef.current = api;

  const currency = event.currency ?? ticket.currency ?? "VND";

  // Parse multi-item cart lines (from Zipevent tiered/phase cart) or fallback to single ticket
  const cartLines = useMemo(() => {
    if (rawItems) {
      const parsed = rawItems
        .split(",")
        .map((pair) => {
          const [id, qtyStr] = pair.split(":");
          const found = event.ticketTypes.find((t) => t.id === id);
          const q = Number.parseInt(qtyStr ?? "0", 10);
          if (!found || !Number.isFinite(q) || q <= 0) return null;
          return { ticket: found, quantity: q };
        })
        .filter((item): item is { ticket: TicketType; quantity: number } => Boolean(item));
      if (parsed.length > 0) return parsed;
    }
    const safeQ = quantity > 0 ? quantity : 1;
    return [{ ticket, quantity: safeQ }];
  }, [rawItems, event.ticketTypes, ticket, quantity]);

  const appliedPromoRule = useMemo(() => {
    if (!promoCode) return null;
    return (
      event.promoCodes?.find(
        (rule) => rule.code.toUpperCase() === promoCode.trim().toUpperCase()
      ) ?? null
    );
  }, [promoCode, event.promoCodes]);

  useEffect(() => {
    if (!existingHoldId || !auth.authenticated) return;
    const controller = new AbortController();
    setHoldReady(false);
    void apiRef
      .current<{
        data: {
          eventSessionId: string;
          status: string;
          totalAmount: number;
          expiresAtUtc: string;
          items: Array<{ ticketTypeId: string; quantity: number; seatIds: string[] }>;
        };
      }>(`/api/v1/holds/${encodeURIComponent(existingHoldId)}`, controller.signal)
      .then(({ data }) => {
        const item = data.items[0];
        if (
          data.status !== "Active" ||
          data.eventSessionId !== sessionId ||
          data.items.length !== 1 ||
          item.ticketTypeId !== ticketId ||
          item.quantity !== quantity ||
          [...item.seatIds].sort().join() !== [...seatIds].sort().join()
        )
          throw new Error(
            "Hold không khớp lựa chọn hoặc không còn hiệu lực. Vui lòng chọn lại vé."
          );
        const remaining = Math.max(
          0,
          Math.floor((Date.parse(data.expiresAtUtc) - Date.now()) / 1000)
        );
        if (!remaining) throw new Error("Hold đã hết hạn. Vui lòng chọn lại vé.");
        setServerTotal(data.totalAmount);
        setTimeLeft(remaining);
        setHoldReady(true);
      })
      .catch((cause) => {
        if (!controller.signal.aborted)
          setCheckoutError(
            cause instanceof Error ? cause.message : "Không đọc được hold."
          );
      });
    return () => controller.abort();
  }, [
    existingHoldId,
    auth.authenticated,
    auth.tokenParsed?.sub,
    sessionId,
    ticketId,
    quantity,
    seatIds.join(","),
  ]);

  const [timeLeft, setTimeLeft] = useState(600);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeFormatted = `${minutes}:${seconds.toString().padStart(2, "0")}`;

  const safeQuantity = cartLines.reduce((sum, l) => sum + l.quantity, 0);
  const subtotal = cartLines.reduce(
    (sum, line) => sum + line.ticket.price * line.quantity,
    0
  );
  const discountAmount = appliedPromoRule
    ? appliedPromoRule.discountType === "percent"
      ? Math.min(subtotal, (subtotal * appliedPromoRule.amount) / 100)
      : Math.min(subtotal, appliedPromoRule.amount)
    : 0;
  const netAfterDiscount = Math.max(0, subtotal - discountAmount);
  const vatRate = event.vatRate ?? 0;
  const isVatExclusive = vatRate > 0 && event.vatIncluded === false;
  const exclusiveVatAmount = isVatExclusive
    ? Math.round(netAfterDiscount * vatRate * 100) / 100
    : 0;
  const total = netAfterDiscount + exclusiveVatAmount;
  const displayedTotal = serverTotal ?? total;
  const isFreeRegistration = displayedTotal === 0;

  async function completeOrder(formEvent: FormEvent<HTMLFormElement>) {
    formEvent.preventDefault();
    if (existingHoldId && (!holdReady || timeLeft <= 0)) return;
    if (!auth.authenticated) {
      await auth.login(window.location.href);
      return;
    }

    const formData = new FormData(formEvent.currentTarget);
    const attendeeName = String(formData.get("name") || "Guest User");
    const attendeeEmail = String(formData.get("email") || "");

    const hasBackendUuid =
      Boolean(sessionId) &&
      /^[0-9a-f-]{36}$/i.test(sessionId ?? "") &&
      /^[0-9a-f-]{36}$/i.test(ticketId);

    // Showcase / Mock Event Demo Completion (when event is seeded showcase without backend UUID)
    if (!hasBackendUuid && event.id.startsWith("event-")) {
      const demoOrder = {
        id: `TF-${Date.now().toString().slice(-8)}`,
        eventSlug: event.slug,
        eventTitle: event.title,
        ticket: cartLines.map((l) => `${l.ticket.name}`).join(", "),
        quantity: safeQuantity,
        name: attendeeName,
        email: attendeeEmail,
        total: displayedTotal,
        createdAt: new Date().toISOString(),
      };
      localStorage.setItem("tixflow-last-order", JSON.stringify(demoOrder));
      router.push(`/checkout/success?event=${encodeURIComponent(event.slug)}`);
      return;
    }

    if (!hasBackendUuid || !sessionId) {
      setCheckoutError(
        "Session or ticket ID is missing. Please start checkout from a valid ticket selection."
      );
      return;
    }

    setSubmitting(true);
    setCheckoutError(undefined);
    try {
      const holdStorageKey = `tixflow-hold-idempotency-${sessionId}-${ticketId}-${safeQuantity}-${seatIds.join(
        "-"
      )}`;
      const holdKey = sessionStorage.getItem(holdStorageKey) ?? crypto.randomUUID();
      sessionStorage.setItem(holdStorageKey, holdKey);
      const holdResult = existingHoldId
        ? await api<{
            data: { id: string; version: number; totalAmount: number; expiresAtUtc: string };
          }>(`/api/v1/holds/${encodeURIComponent(existingHoldId)}`)
        : await api<{
            data: { id: string; version: number; totalAmount: number; expiresAtUtc: string };
          }>("/api/v1/holds", {
            method: "POST",
            headers: { "Idempotency-Key": holdKey },
            body: JSON.stringify({
              eventSessionId: sessionId,
              items: [
                {
                  ticketTypeId: ticketId,
                  inventoryMode,
                  quantity: quantity > 0 ? quantity : 1,
                  ...(seatIds.length ? { seatIds } : {}),
                },
              ],
            }),
          });
      const hold = holdResult.data;
      setServerTotal(hold.totalAmount);
      const orderKey =
        sessionStorage.getItem(`tixflow-order-key-${hold.id}`) ?? crypto.randomUUID();
      sessionStorage.setItem(`tixflow-order-key-${hold.id}`, orderKey);
      const orderResult = await api<{
        data: { id: string; version: number; totalAmount: number };
      }>(`/api/v1/holds/${hold.id}/checkout`, {
        method: "POST",
        headers: {
          "Idempotency-Key": orderKey,
          "X-Expected-Version": String(hold.version),
        },
      });
      const order = orderResult.data;
      const paymentKey =
        sessionStorage.getItem(`tixflow-payment-key-${order.id}`) ?? crypto.randomUUID();
      sessionStorage.setItem(`tixflow-payment-key-${order.id}`, paymentKey);
      const paymentResult = await api<{ data: { id: string } }>(
        `/api/v1/orders/${order.id}/payments/mock`,
        {
          method: "POST",
          headers: {
            "Idempotency-Key": paymentKey,
            "X-Expected-Version": String(order.version),
          },
          body: JSON.stringify({ outcome: mockOutcome }),
        }
      );
      for (let attempt = 0; attempt < 30; attempt++) {
        const current = await api<{
          data: { status: string; failureReason?: string };
        }>(`/api/v1/payments/${paymentResult.data.id}`);
        if (current.data.status !== "Pending") {
          if (current.data.status !== "Succeeded") {
            sessionStorage.removeItem(`tixflow-payment-key-${order.id}`);
            throw new Error(
              current.data.failureReason ?? "Payment was not successful."
            );
          }
          router.push(
            `/checkout/success?event=${encodeURIComponent(event.slug)}&orderId=${order.id}`
          );
          return;
        }
        await new Promise((resolve) => window.setTimeout(resolve, 300));
      }
      router.push(
        `/checkout/success?event=${encodeURIComponent(event.slug)}&orderId=${order.id}`
      );
    } catch (cause) {
      setCheckoutError(
        cause instanceof Error ? cause.message : "Unable to complete payment."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#FDFCFD] pb-20 pt-6 sm:pt-8">
      <div className="container max-w-5xl">
        {/* Breadcrumb */}
        <nav className="mb-4 flex items-center gap-1.5 text-xs text-gray-500">
          <Link href="/" className="hover:text-[#ef5360]">
            Home
          </Link>
          <ChevronRight size={13} />
          <Link href={`/events/${event.slug}`} className="hover:text-[#ef5360]">
            {event.title}
          </Link>
          <ChevronRight size={13} />
          <span className="font-semibold text-[#2B212B]">
            {isFreeRegistration ? "Registration" : "Checkout"}
          </span>
        </nav>

        {/* Header with Countdown Timer */}
        <div className="mb-6 flex flex-col justify-between gap-4 rounded-2xl border border-red-100 bg-[#FFEFF0]/60 p-4 sm:flex-row sm:items-center sm:p-5">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-[#2B212B] sm:text-2xl">
              {isFreeRegistration
                ? "Complete Event Registration"
                : "Complete Order & Payment"}
            </h1>
            <p className="mt-0.5 text-xs text-gray-600">
              {isFreeRegistration
                ? "Confirm attendee details below to receive your instant QR registration pass."
                : "Please enter your details and complete payment before your reservation expires."}
            </p>
          </div>
          <div className="flex items-center gap-2 self-start rounded-full bg-white px-4 py-2 shadow-2xs sm:self-center">
            <Clock size={16} className="animate-pulse text-[#ef5360]" />
            <span className="text-xs text-gray-500">Time remaining:</span>
            <span className="font-mono text-sm font-bold text-[#ef5360]">
              {timeFormatted} min
            </span>
          </div>
        </div>

        {/* Main Checkout Form */}
        <form onSubmit={completeOrder} className="grid gap-8 lg:grid-cols-[1fr_360px]">
          {checkoutError && (
            <p
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700 lg:col-span-2"
            >
              {checkoutError}
            </p>
          )}

          {/* Left Form: Attendee Info & Payment */}
          <div className="space-y-6">
            {/* 1. Attendee Information */}
            <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-2xs sm:p-6">
              <div className="mb-4 flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#ef5360] text-xs font-bold text-white">
                  1
                </span>
                <h2 className="text-base font-bold text-[#2B212B]">
                  Attendee Information
                </h2>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-700">
                    Full Name *
                  </label>
                  <input
                    required
                    name="name"
                    defaultValue="Nguyen Van Minh"
                    placeholder="Enter attendee full name"
                    className="mt-1.5 h-11 w-full rounded-xl border border-gray-200 bg-white px-3.5 text-xs text-[#2B212B] outline-none transition-colors focus:border-[#ef5360] focus:ring-2 focus:ring-[#ef5360]/20 sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700">
                    Email Address *
                  </label>
                  <input
                    required
                    type="email"
                    name="email"
                    defaultValue="minh.nguyen@example.com"
                    placeholder="you@example.com"
                    className="mt-1.5 h-11 w-full rounded-xl border border-gray-200 bg-white px-3.5 text-xs text-[#2B212B] outline-none transition-colors focus:border-[#ef5360] focus:ring-2 focus:ring-[#ef5360]/20 sm:text-sm"
                  />
                  <span className="mt-1 block text-[10px] text-gray-400">
                    e-Tickets and receipts will be delivered to this email.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700">
                    Phone Number *
                  </label>
                  <input
                    required
                    type="tel"
                    name="phone"
                    defaultValue="+84 912 345 678"
                    placeholder="+84 9xx xxx xxx"
                    className="mt-1.5 h-11 w-full rounded-xl border border-gray-200 bg-white px-3.5 text-xs text-[#2B212B] outline-none transition-colors focus:border-[#ef5360] focus:ring-2 focus:ring-[#ef5360]/20 sm:text-sm"
                  />
                </div>
              </div>
            </section>

            {/* 2. Payment Method (shown for paid orders or backend hold orders) */}
            {!isFreeRegistration || Boolean(sessionId) ? (
              <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-2xs sm:p-6">
                <div className="mb-4 flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#ef5360] text-xs font-bold text-white">
                    2
                  </span>
                  <h2 className="text-base font-bold text-[#2B212B]">
                    Select Payment Method
                  </h2>
                </div>

                <div className="space-y-3">
                  {[
                    {
                      id: "card",
                      name: "Credit / Debit Card",
                      desc: "Visa, Mastercard, JCB (No extra processing fees)",
                      icon: CreditCard,
                    },
                    {
                      id: "bank",
                      name: "Bank Transfer / PromptPay / QR Code",
                      desc: "Scan QR code with any major banking app",
                      icon: Building2,
                    },
                    {
                      id: "wallet",
                      name: "e-Wallet (MoMo, ZaloPay, TrueMoney, WeChat Pay, Alipay)",
                      desc: "Pay conveniently via your mobile wallet",
                      icon: Wallet,
                    },
                  ].map((pm) => {
                    const Icon = pm.icon;
                    const isSelected = payment === pm.id;
                    return (
                      <label
                        key={pm.id}
                        className={`flex cursor-pointer items-center gap-3.5 rounded-xl border p-4 transition-all ${
                          isSelected
                            ? "border-[#ef5360] bg-[#FFEFF0]/40 ring-1 ring-[#ef5360]/30"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <input
                          type="radio"
                          name="payment"
                          value={pm.id}
                          checked={isSelected}
                          onChange={() => setPayment(pm.id as Payment)}
                          className="accent-[#ef5360]"
                        />
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-700">
                          <Icon size={20} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <span className="block text-xs font-bold text-[#2B212B] sm:text-sm">
                            {pm.name}
                          </span>
                          <span className="mt-0.5 block text-[11px] text-gray-500">
                            {pm.desc}
                          </span>
                        </div>
                        {isSelected && (
                          <CheckCircle2
                            size={18}
                            className="shrink-0 fill-[#ef5360] text-white"
                          />
                        )}
                      </label>
                    );
                  })}
                </div>

                <label className="mt-4 block text-xs font-semibold text-gray-700">
                  Payment Simulation (Sandbox)
                  <select
                    value={mockOutcome}
                    onChange={(event) =>
                      setMockOutcome(event.target.value as typeof mockOutcome)
                    }
                    className="mt-1.5 block w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs"
                  >
                    <option value="Succeeded">Payment Succeeded</option>
                    <option value="Failed">Payment Declined</option>
                    <option value="Timeout">Timeout, can retry</option>
                  </select>
                </label>

                <div className="mt-4 flex items-center gap-2 rounded-xl bg-gray-50 p-3 text-[11px] text-gray-500">
                  <LockKeyhole size={14} className="shrink-0 text-gray-400" />
                  <span>
                    Mock Sandbox — no actual charges are incurred. Digital tickets will
                    be issued in your account upon order completion.
                  </span>
                </div>
              </section>
            ) : (
              <section className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-5 text-xs text-emerald-800">
                <div className="flex items-center gap-2 font-bold">
                  <CheckCircle2 size={16} className="text-emerald-600" />
                  <span>Free Event Registration — No Payment Required</span>
                </div>
                <p className="mt-1 text-emerald-700/90">
                  Click Confirm Registration to receive your instant QR entry badge.
                </p>
              </section>
            )}
          </div>

          {/* Right Sticky Order Summary */}
          <aside className="h-fit space-y-4 lg:sticky lg:top-24">
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
              <h3 className="text-base font-bold text-[#2B212B]">
                {isFreeRegistration ? "Registration" : "Order Summary"}
              </h3>

              {/* Event Card preview */}
              <div className="mt-4 flex gap-3 border-b border-gray-100 pb-4">
                <img
                  src={event.thumbnailImage}
                  alt={event.title}
                  className="h-20 w-16 shrink-0 rounded-lg object-cover"
                />
                <div className="min-w-0 flex-1">
                  <h4 className="line-clamp-2 text-xs font-bold text-[#2B212B] sm:text-sm">
                    {event.title}
                  </h4>
                  {roundLabel && (
                    <div className="mt-1 flex items-center gap-1 text-[11px] text-gray-500">
                      <Calendar size={11} className="text-[#ef5360]" />
                      <span>{roundLabel}</span>
                    </div>
                  )}
                  {zoneLabel && (
                    <div className="mt-0.5 flex items-center gap-1 text-[11px] text-gray-500">
                      <MapPin size={11} className="text-[#ef5360]" />
                      <span>
                        Zone {zoneLabel}
                        {seatLabels && seatLabels.length > 0
                          ? ` (${seatLabels.join(", ")})`
                          : ""}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Selected Line Items */}
              <div className="space-y-2 border-b border-gray-100 py-4 text-xs text-gray-700">
                {cartLines.map((line) => (
                  <div
                    key={line.ticket.id}
                    className="flex items-start justify-between gap-2"
                  >
                    <span className="flex items-center gap-1.5">
                      <Ticket size={12} className="shrink-0 text-[#ef5360]" />
                      <span>
                        {line.quantity} × {line.ticket.name}
                      </span>
                    </span>
                    <span className="shrink-0 font-semibold">
                      {line.ticket.price === 0
                        ? "FREE"
                        : formatTicketMoney(
                            line.ticket.price * line.quantity,
                            currency,
                            { zeroAsNumber: true }
                          )}
                    </span>
                  </div>
                ))}

                {addonsLabel && (
                  <div className="pl-4 text-[11px] text-gray-500">+ {addonsLabel}</div>
                )}

                {appliedPromoRule && discountAmount > 0 && (
                  <div className="flex items-center justify-between pt-1 font-semibold text-emerald-600">
                    <span className="inline-flex items-center gap-1">
                      <Tag size={12} />
                      Promo ({appliedPromoRule.code})
                    </span>
                    <span>
                      -{formatTicketMoney(discountAmount, currency, { zeroAsNumber: true })}
                    </span>
                  </div>
                )}

                {isVatExclusive && exclusiveVatAmount > 0 && (
                  <div className="flex items-center justify-between pt-1 text-gray-500">
                    <span>VAT ({Math.round(vatRate * 100)}%)</span>
                    <span>
                      {formatTicketMoney(exclusiveVatAmount, currency, { zeroAsNumber: true })}
                    </span>
                  </div>
                )}
              </div>

              {/* Grand Total */}
              <div className="mt-4 flex items-center justify-between rounded-xl bg-[#FFF0F1] px-4 py-3">
                <span className="text-sm font-bold text-[#ef5360]">Grand Total</span>
                <span className="text-base font-black text-[#ef5360]">
                  {isFreeRegistration
                    ? "FREE"
                    : formatTicketMoney(displayedTotal, currency, {
                        zeroAsNumber: true,
                      })}
                </span>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={
                  submitting || (Boolean(existingHoldId) && (!holdReady || timeLeft <= 0))
                }
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-[#ef5360] py-3.5 text-xs font-bold text-white shadow-md transition-all hover:bg-[#ec3746] hover:shadow-lg active:scale-98 sm:text-sm"
              >
                <LockKeyhole size={16} />
                <span>
                  {submitting
                    ? "Processing…"
                    : isFreeRegistration
                      ? "Confirm Registration"
                      : `Confirm & Pay · ${formatTicketMoney(displayedTotal, currency, {
                          zeroAsNumber: true,
                        })}`}
                </span>
              </button>

              <p className="mt-4 text-center text-[11px] text-gray-400">
                By confirming, you agree to TixFlow Terms of Service and Event Admission
                Rules.
              </p>
            </div>

            <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-2xs">
              <div className="flex items-center gap-2 text-xs font-semibold text-gray-700">
                <ShieldCheck size={16} className="text-emerald-500" />
                <span>Security Guarantee</span>
              </div>
              <p className="mt-1 text-[11px] text-gray-500">
                All transactions are encrypted with 256-bit bank-grade SSL security.
              </p>
            </div>
          </aside>
        </form>
      </div>
    </main>
  );
}
