"use client";

import { useEffect, useState, type FormEvent } from "react";
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
} from "lucide-react";
import type { Event, TicketType } from "@/lib/mock/events";
import { useKeycloakAuth } from "@/components/auth-provider";
import { useApi } from "@/lib/api";

type Payment = "card" | "bank" | "wallet";

interface CheckoutViewProps {
  event: Event;
  ticket: TicketType;
  quantity: number;
  sessionId?: string;
  ticketId?: string;
  inventoryMode?: "GeneralAdmission" | "ReservedSeating";
  seatIds?: string[];
}

const money = new Intl.NumberFormat("en-US");

export function CheckoutView({
  event,
  ticket,
  quantity,
  sessionId,
  ticketId = ticket.id,
  inventoryMode = ticket.inventoryMode ?? "GeneralAdmission",
  seatIds = [],
}: CheckoutViewProps) {
  const router = useRouter();
  const auth = useKeycloakAuth();
  const api = useApi();
  const [payment, setPayment] = useState<Payment>("card");
  const [mockOutcome, setMockOutcome] = useState<"Succeeded" | "Failed" | "Timeout">("Succeeded");
  const [submitting, setSubmitting] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string>();
  const [serverTotal, setServerTotal] = useState<number>();

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

  const safeQuantity = quantity > 0 ? quantity : 1;
  const subtotal = ticket.price * safeQuantity;
  const serviceFee = subtotal > 0 ? 0 : 0;
  const total = subtotal + serviceFee;
  const displayedTotal = serverTotal ?? total;

  async function completeOrder(formEvent: FormEvent<HTMLFormElement>) {
    formEvent.preventDefault();
    if (!auth.authenticated) {
      await auth.login(window.location.href);
      return;
    }
    if (!sessionId || !/^[0-9a-f-]{36}$/i.test(sessionId) || !/^[0-9a-f-]{36}$/i.test(ticketId)) {
      setCheckoutError("Session or ticket ID is missing. Please start checkout from a valid ticket selection.");
      return;
    }
    setSubmitting(true);
    setCheckoutError(undefined);
    try {
      const holdStorageKey = `tixflow-hold-idempotency-${sessionId}-${ticketId}-${safeQuantity}-${seatIds.join("-")}`;
      const holdKey = sessionStorage.getItem(holdStorageKey) ?? crypto.randomUUID();
      sessionStorage.setItem(holdStorageKey, holdKey);
      const holdResult = await api<{ data: { id: string; version: number; totalAmount: number; expiresAtUtc: string } }>(
        "/api/v1/holds",
        { method: "POST", headers: { "Idempotency-Key": holdKey }, body: JSON.stringify({
          eventSessionId: sessionId,
          items: [{ ticketTypeId: ticketId, inventoryMode, quantity: safeQuantity, ...(seatIds.length ? { seatIds } : {}) }],
        }) },
      );
      const hold = holdResult.data;
      setServerTotal(hold.totalAmount);
      const orderKey = sessionStorage.getItem(`tixflow-order-key-${hold.id}`) ?? crypto.randomUUID();
      sessionStorage.setItem(`tixflow-order-key-${hold.id}`, orderKey);
      const orderResult = await api<{ data: { id: string; version: number; totalAmount: number } }>(
        `/api/v1/holds/${hold.id}/checkout`,
        { method: "POST", headers: { "Idempotency-Key": orderKey, "X-Expected-Version": String(hold.version) } },
      );
      const order = orderResult.data;
      const paymentKey = sessionStorage.getItem(`tixflow-payment-key-${order.id}`) ?? crypto.randomUUID();
      sessionStorage.setItem(`tixflow-payment-key-${order.id}`, paymentKey);
      const paymentResult = await api<{ data: { id: string } }>(
        `/api/v1/orders/${order.id}/payments/mock`,
        { method: "POST", headers: { "Idempotency-Key": paymentKey, "X-Expected-Version": String(order.version) },
          body: JSON.stringify({ outcome: mockOutcome }) },
      );
      for (let attempt = 0; attempt < 30; attempt++) {
        const current = await api<{ data: { status: string; failureReason?: string } }>(`/api/v1/payments/${paymentResult.data.id}`);
        if (current.data.status !== "Pending") {
          if (current.data.status !== "Succeeded") {
            sessionStorage.removeItem(`tixflow-payment-key-${order.id}`);
            throw new Error(current.data.failureReason ?? "Payment was not successful.");
          }
          router.push(`/checkout/success?event=${event.slug}&orderId=${order.id}`);
          return;
        }
        await new Promise((resolve) => window.setTimeout(resolve, 300));
      }
      router.push(`/checkout/success?event=${event.slug}&orderId=${order.id}`);
    } catch (cause) {
      setCheckoutError(cause instanceof Error ? cause.message : "Unable to complete payment.");
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
          <span className="font-semibold text-[#2B212B]">Checkout</span>
        </nav>

        {/* Header with Countdown Timer */}
        <div className="mb-6 flex flex-col justify-between gap-4 rounded-2xl border border-red-100 bg-[#FFEFF0]/60 p-4 sm:flex-row sm:items-center sm:p-5">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-[#2B212B] sm:text-2xl">
              Complete Order &amp; Payment
            </h1>
            <p className="mt-0.5 text-xs text-gray-600">
              Please enter your details and complete payment before your reservation expires.
            </p>
          </div>
          <div className="flex items-center gap-2 self-start rounded-full bg-white px-4 py-2 shadow-2xs sm:self-center">
            <Clock size={16} className="text-[#ef5360] animate-pulse" />
            <span className="text-xs text-gray-500">Time remaining:</span>
            <span className="font-mono text-sm font-bold text-[#ef5360]">{timeFormatted} min</span>
          </div>
        </div>

        {/* Main Checkout Form */}
        <form onSubmit={completeOrder} className="grid gap-8 lg:grid-cols-[1fr_360px]">
          {checkoutError && (
            <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700 lg:col-span-2">
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
                <h2 className="text-base font-bold text-[#2B212B]">Attendee Information</h2>
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

            {/* 2. Payment Method */}
            <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-2xs sm:p-6">
              <div className="mb-4 flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#ef5360] text-xs font-bold text-white">
                  2
                </span>
                <h2 className="text-base font-bold text-[#2B212B]">Select Payment Method</h2>
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
                    name: "e-Wallet (MoMo, ZaloPay, TrueMoney)",
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
                        <span className="mt-0.5 block text-[11px] text-gray-500">{pm.desc}</span>
                      </div>
                      {isSelected && (
                        <CheckCircle2 size={18} className="fill-[#ef5360] text-white shrink-0" />
                      )}
                    </label>
                  );
                })}
              </div>

              <label className="mt-4 block text-xs font-semibold text-gray-700">
                Payment Simulation (Sandbox)
                <select
                  value={mockOutcome}
                  onChange={(event) => setMockOutcome(event.target.value as typeof mockOutcome)}
                  className="mt-1.5 block w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs"
                >
                  <option value="Succeeded">Payment Succeeded</option>
                  <option value="Failed">Payment Declined</option>
                  <option value="Timeout">Timeout, can retry</option>
                </select>
              </label>

              <div className="mt-4 flex items-center gap-2 rounded-xl bg-gray-50 p-3 text-[11px] text-gray-500">
                <LockKeyhole size={14} className="text-gray-400 shrink-0" />
                <span>
                  Mock Sandbox — no actual charges are incurred. Digital tickets will be issued in your account upon order completion.
                </span>
              </div>
            </section>
          </div>

          {/* Right Sticky Order Summary */}
          <aside className="h-fit space-y-4 lg:sticky lg:top-24">
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
              <h3 className="text-base font-bold text-[#2B212B]">Order Summary</h3>

              {/* Event Card preview */}
              <div className="mt-4 flex gap-3 border-b border-gray-100 pb-4">
                <img
                  src={event.thumbnailImage}
                  alt={event.title}
                  className="h-16 w-24 shrink-0 rounded-lg object-cover"
                />
                <div className="min-w-0 flex-1">
                  <h4 className="line-clamp-2 text-xs font-bold text-[#2B212B] sm:text-sm">
                    {event.title}
                  </h4>
                  <div className="mt-1 flex items-center gap-1 text-[11px] text-gray-500">
                    <Ticket size={12} className="text-[#ef5360]" />
                    <span>
                      {ticket.name} × {safeQuantity}
                    </span>
                  </div>
                </div>
              </div>

              {/* Price Details */}
              <div className="space-y-2.5 py-4 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span>Tickets ({safeQuantity} ticket{safeQuantity === 1 ? "" : "s"})</span>
                  <span>{money.format(subtotal)} VND</span>
                </div>
                <div className="flex justify-between">
                  <span>Service Fee</span>
                  <span>{money.format(serviceFee)} VND</span>
                </div>
              </div>

              {/* Grand Total */}
              <div className="flex items-baseline justify-between border-t border-gray-200 pt-4">
                <span className="text-sm font-bold text-[#2B212B]">Total Amount</span>
                <div className="text-right">
                  <span className="text-xl font-black text-[#ef5360]">
                    {money.format(displayedTotal)} VND
                  </span>
                  <span className="block text-[10px] text-gray-400">VAT included</span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-[#ef5360] py-3.5 text-xs font-bold text-white shadow-md transition-all hover:bg-[#ec3746] hover:shadow-lg active:scale-98 sm:text-sm"
              >
                <LockKeyhole size={16} />
                <span>
                  {submitting ? "Processing…" : `Confirm & Pay · ${money.format(displayedTotal)} VND`}
                </span>
              </button>

              <p className="mt-4 text-center text-[11px] text-gray-400">
                By confirming, you agree to TixFlow Terms of Service and Event Admission Rules.
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
