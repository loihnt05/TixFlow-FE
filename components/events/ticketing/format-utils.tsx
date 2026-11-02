"use client";

import { Info } from "lucide-react";
import type { Event } from "@/lib/mock/events";

const twoDecimalFormatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const integerFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 0,
});

export function formatTicketMoney(
  amount: number,
  currency = "VND",
  options?: { uppercaseFree?: boolean; zeroAsNumber?: boolean }
): string {
  const curr = currency.toUpperCase();
  if (amount <= 0 && !options?.zeroAsNumber) {
    return options?.uppercaseFree ? "FREE" : "Free";
  }
  if (curr === "THB" || curr === "USD" || curr === "SGD") {
    return `${twoDecimalFormatter.format(Math.max(0, amount))} ${curr}`;
  }
  return `${integerFormatter.format(Math.round(Math.max(0, amount)))} ${curr}`;
}

export function stepBundleQuantity(
  currentQty: number,
  delta: 1 | -1,
  minPerOrder = 1,
  maxAllowed = 10
): number {
  const safeMin = Math.max(1, minPerOrder);
  if (maxAllowed < safeMin) return 0;

  if (delta > 0) {
    if (currentQty === 0) return safeMin;
    return Math.min(maxAllowed, currentQty + 1);
  }
  if (currentQty <= safeMin) return 0;
  return Math.max(0, currentQty - 1);
}

export function buildGoogleCalendarUrl(event: Event): string {
  const fmt = (iso: string) =>
    new Date(iso)
      .toISOString()
      .replace(/[-:]/g, "")
      .replace(/\.\d{3}/, "");
  const start = fmt(event.startDate);
  const end = fmt(event.endDate || event.startDate);
  const location = event.venue.isOnline
    ? "Online Event"
    : `${event.venue.name}, ${event.venue.address}, ${event.venue.city}`;
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title,
    dates: `${start}/${end}`,
    details: event.shortDescription,
    location,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function downloadEventIcs(event: Event): void {
  const fmt = (iso: string) =>
    new Date(iso)
      .toISOString()
      .replace(/[-:]/g, "")
      .replace(/\.\d{3}/, "");
  const location = event.venue.isOnline
    ? "Online Event"
    : `${event.venue.name}, ${event.venue.city}`;
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//TixFlow//Zipevent Calendar//EN",
    "BEGIN:VEVENT",
    `UID:${event.id}@tixflow`,
    `DTSTAMP:${fmt(new Date().toISOString())}`,
    `DTSTART:${fmt(event.startDate)}`,
    `DTEND:${fmt(event.endDate || event.startDate)}`,
    `SUMMARY:${event.title.replace(/[,;\\]/g, " ")}`,
    `DESCRIPTION:${event.shortDescription.replace(/\n/g, " ")}`,
    `LOCATION:${location.replace(/[,;\\]/g, " ")}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${event.slug}.ics`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/** Zipevent's signature 2-stub colorful ticket icon inside Hero CTA button */
export function ZipeventTicketIcon() {
  return (
    <svg
      width="19"
      height="15"
      viewBox="0 0 22 17"
      fill="none"
      aria-hidden="true"
      className="shrink-0"
    >
      <rect
        x="1"
        y="2"
        width="16"
        height="11"
        rx="2"
        fill="#FFFFFF"
        stroke="#2B212B"
        strokeWidth="1.2"
      />
      <rect x="2.2" y="3.2" width="5.5" height="8.6" rx="1" fill="#EF5360" />
      <rect x="9" y="4.2" width="6.2" height="1.6" rx="0.8" fill="#3B82F6" />
      <rect x="9" y="7" width="4.5" height="1.5" rx="0.75" fill="#94A3B8" />
      <line
        x1="8.2"
        y1="2.5"
        x2="8.2"
        y2="12.5"
        stroke="#2B212B"
        strokeWidth="1"
        strokeDasharray="1.5 1.5"
      />
    </svg>
  );
}

/** Authentic 2-row Zipevent Accepted Payments Strip */
export function AcceptedPaymentsBlock() {
  return (
    <div className="mt-5 border-t border-gray-100 pt-4">
      <div className="mb-3 flex items-center justify-center gap-1.5 text-[13.5px] font-bold text-[#2B212B]">
        <span>Accepted payments</span>
        <span
          title="QR Payment, Credit/Debit Cards, Mobile Banking & Counter Service supported"
          className="inline-flex text-gray-500"
        >
          <Info size={14} />
        </span>
      </div>

      {/* Row 1: QR Payment, PromptPay, Cards & Mobile Banking Circles */}
      <div className="flex flex-wrap items-center justify-center gap-1.5">
        <span className="inline-flex h-[20px] items-center rounded-[3px] bg-[#113F67] px-1.5 text-[8px] font-extrabold tracking-tight text-white">
          THAI QR
        </span>
        <span className="inline-flex h-[20px] items-center rounded-[3px] border border-[#1A4B8C]/40 bg-white px-1.5 text-[8px] font-extrabold text-[#1A4B8C]">
          PromptPay
        </span>
        <span className="inline-flex h-[20px] items-center px-1 text-[11px] font-black italic tracking-tighter text-[#1A1F71]">
          VISA
        </span>
        <span className="inline-flex h-[20px] items-center px-0.5" title="Mastercard">
          <i className="h-3.5 w-3.5 rounded-full bg-[#EB001B]" />
          <i className="-ml-1.5 h-3.5 w-3.5 rounded-full bg-[#F79E1B]/90" />
        </span>
        <span className="inline-flex h-[18px] items-center rounded-[3px] bg-[#0066B2] px-1 text-[8px] font-extrabold text-white">
          JCB
        </span>
        <span className="inline-flex h-[18px] items-center rounded-[3px] bg-[#2E77BC] px-1 text-[7.5px] font-extrabold text-white">
          AMEX
        </span>
        <span className="inline-flex h-[18px] items-center rounded-[3px] bg-[#007B84] px-1 text-[7.5px] font-bold text-white">
          UnionPay
        </span>
        <span
          className="grid h-[18px] w-[18px] place-items-center rounded-full bg-[#138F2D] text-[8px] font-black text-white"
          title="K PLUS"
        >
          K+
        </span>
        <span
          className="grid h-[18px] w-[18px] place-items-center rounded-full bg-[#4E2A84] text-[8px] font-black text-white"
          title="SCB EASY"
        >
          S
        </span>
        <span
          className="grid h-[18px] w-[18px] place-items-center rounded-full bg-[#1E4598] text-[8px] font-black text-white"
          title="Bangkok Bank"
        >
          B
        </span>
      </div>

      {/* Row 2: Regional Banks, Wallets & Retail Counters */}
      <div className="mt-1.5 flex flex-wrap items-center justify-center gap-1.5">
        <span
          className="grid h-[18px] w-[18px] place-items-center rounded-full bg-[#00A5E5] text-[8px] font-black text-white"
          title="Krungthai NEXT"
        >
          KT
        </span>
        <span
          className="grid h-[18px] w-[18px] place-items-center rounded-full bg-[#FEC43B] text-[8px] font-black text-[#4A3800]"
          title="Krungsri"
        >
          KS
        </span>
        <span
          className="grid h-[18px] w-[18px] place-items-center rounded-full bg-[#0050F0] text-[7.5px] font-black text-white"
          title="ttb touch"
        >
          ttb
        </span>
        <span className="inline-flex h-[18px] items-center rounded-[3px] border border-orange-200 bg-[#FFF7ED] px-1.5 text-[8px] font-extrabold text-[#EA580C]">
          true money
        </span>
        <span className="inline-flex h-[18px] items-center rounded-[3px] border border-pink-200 bg-[#FDF2F8] px-1.5 text-[8px] font-extrabold text-[#A50064]">
          MoMo
        </span>
        <span className="inline-flex h-[18px] items-center rounded-[3px] bg-[#008060] px-1.5 text-[8px] font-extrabold text-white">
          7-ELEVEN
        </span>
        <span className="inline-flex h-[18px] items-center rounded-[3px] bg-[#00B2A9] px-1.5 text-[8px] font-extrabold text-white">
          Lotus&apos;s
        </span>
        <span className="inline-flex h-[18px] items-center rounded-[3px] border border-emerald-200 bg-white px-1.5 text-[8px] font-extrabold text-[#16A34A]">
          Big C
        </span>
      </div>
    </div>
  );
}
