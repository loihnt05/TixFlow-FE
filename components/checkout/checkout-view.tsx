"use client";

import Link from "next/link";
import { useState, useEffect, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  CreditCard,
  LockKeyhole,
  Wallet,
  Building2,
  Clock,
  ShieldCheck,
  ChevronRight,
  Ticket,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import type { Event } from "@/lib/mock/events";

const money = new Intl.NumberFormat("vi-VN");
type Payment = "card" | "bank" | "wallet";

export function CheckoutView({
  event,
  ticketId,
  quantity,
}: {
  event: Event;
  ticketId: string;
  quantity: number;
}) {
  const router = useRouter();
  const [payment, setPayment] = useState<Payment>("card");
  const [timeLeft, setTimeLeft] = useState(900); // 15:00 countdown timer

  // Find ticket
  const ticket = event.ticketTypes.find((item) => item.id === ticketId) ?? event.ticketTypes[0];
  const safeQuantity = Math.max(1, Math.min(quantity || 1, ticket.maxPerOrder));
  const subtotal = ticket.price * safeQuantity;
  const serviceFee = subtotal > 0 ? Math.round(subtotal * 0.05) : 0;
  const grandTotal = subtotal + serviceFee;

  // Countdown timer
  useEffect(() => {
    if (timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeFormatted = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  function completeOrder(formEvent: FormEvent<HTMLFormElement>) {
    formEvent.preventDefault();
    const form = new FormData(formEvent.currentTarget);
    const orderId = `TF-${Date.now().toString().slice(-8)}`;
    const order = {
      id: orderId,
      eventSlug: event.slug,
      eventTitle: event.title,
      ticket: ticket.name,
      quantity: safeQuantity,
      name: String(form.get("name")),
      email: String(form.get("email")),
      phone: String(form.get("phone")),
      total: grandTotal,
      payment,
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem("tixflow-last-order", JSON.stringify(order));
    localStorage.setItem("zipevent-last-order", JSON.stringify(order)); // backward compat
    router.push(`/checkout/success?event=${event.slug}`);
  }

  return (
    <main className="min-h-screen bg-[#FDFCFD] pb-20 pt-6 sm:pt-8">
      <div className="container max-w-5xl">
        {/* Breadcrumb */}
        <nav className="mb-4 flex items-center gap-1.5 text-xs text-gray-500">
          <Link href="/" className="hover:text-[#ef5360]">
            หน้าแรก
          </Link>
          <ChevronRight size={13} />
          <Link href={`/events/${event.slug}`} className="hover:text-[#ef5360]">
            {event.title}
          </Link>
          <ChevronRight size={13} />
          <span className="font-semibold text-[#2B212B]">ชำระเงิน</span>
        </nav>

        {/* Header with Countdown Timer */}
        <div className="mb-6 flex flex-col justify-between gap-4 rounded-2xl border border-red-100 bg-[#FFEFF0]/60 p-4 sm:flex-row sm:items-center sm:p-5">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-[#2B212B] sm:text-2xl">
              ดำเนินการสั่งซื้อและชำระเงิน
            </h1>
            <p className="mt-0.5 text-xs text-gray-600">
              กรุณากรอกข้อมูลและยืนยันการชำระเงินภายในเวลาที่กำหนด
            </p>
          </div>
          <div className="flex items-center gap-2 self-start rounded-full bg-white px-4 py-2 shadow-2xs sm:self-center">
            <Clock size={16} className="text-[#ef5360] animate-pulse" />
            <span className="text-xs text-gray-500">เวลาที่เหลือ:</span>
            <span className="font-mono text-sm font-bold text-[#ef5360]">{timeFormatted} นาที</span>
          </div>
        </div>

        {/* Main Checkout Form */}
        <form onSubmit={completeOrder} className="grid gap-8 lg:grid-cols-[1fr_360px]">
          {/* Left Form: Attendee Info & Payment */}
          <div className="space-y-6">
            {/* 1. Attendee Information */}
            <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-2xs sm:p-6">
              <div className="mb-4 flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#ef5360] text-xs font-bold text-white">
                  1
                </span>
                <h2 className="text-base font-bold text-[#2B212B]">ข้อมูลผู้สั่งซื้อ / ผู้รับบัตร</h2>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-700">
                    ชื่อ - นามสกุล (Full Name) *
                  </label>
                  <input
                    required
                    name="name"
                    defaultValue="Nguyen Van Minh"
                    placeholder="ระบุชื่อจริงและนามสกุล"
                    className="mt-1.5 h-11 w-full rounded-xl border border-gray-200 bg-white px-3.5 text-xs text-[#2B212B] outline-none transition-colors focus:border-[#ef5360] focus:ring-2 focus:ring-[#ef5360]/20 sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700">
                    อีเมล (Email) *
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
                    e-Ticket และใบเสร็จจะถูกจัดส่งไปยังอีเมลนี้
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700">
                    เบอร์โทรศัพท์ (Phone Number) *
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
                <h2 className="text-base font-bold text-[#2B212B]">เลือกวิธีการชำระเงิน</h2>
              </div>

              <div className="space-y-3">
                {[
                  {
                    id: "card",
                    name: "บัตรเครดิต / บัตรเดบิต",
                    desc: "Visa, Mastercard, JCB (ไม่มีค่าธรรมเนียมรูดบัตร)",
                    icon: CreditCard,
                  },
                  {
                    id: "bank",
                    name: "โอนผ่านธนาคาร / PromptPay / QR Code",
                    desc: "สแกน QR จ่ายสะดวก ทุกธนาคาร",
                    icon: Building2,
                  },
                  {
                    id: "wallet",
                    name: "e-Wallet (MoMo, ZaloPay, TrueMoney)",
                    desc: "ชำระผ่านแอปกระเป๋าเงินออนไลน์",
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

              <div className="mt-4 flex items-center gap-2 rounded-xl bg-gray-50 p-3 text-[11px] text-gray-500">
                <LockKeyhole size={14} className="text-gray-400 shrink-0" />
                <span>
                  โหมดจำลองคำสั่งซื้อ (Mock Sandbox) — ระบบจะทำการออกตั๋วทันทีโดยไม่ตัดเงินจริง
                </span>
              </div>
            </section>
          </div>

          {/* Right Sticky Order Summary */}
          <aside className="h-fit space-y-4 lg:sticky lg:top-24">
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
              <h3 className="text-base font-bold text-[#2B212B]">สรุปรายการสั่งซื้อ</h3>

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
                  <span>ราคาบัตร ({safeQuantity} ใบ)</span>
                  <span>{money.format(subtotal)} VND</span>
                </div>
                <div className="flex justify-between">
                  <span>ค่าธรรมเนียมบริการ</span>
                  <span>{money.format(serviceFee)} VND</span>
                </div>
              </div>

              {/* Grand Total */}
              <div className="flex items-baseline justify-between border-t border-gray-200 pt-4">
                <span className="text-sm font-bold text-[#2B212B]">ยอดชำระสุทธิ</span>
                <div className="text-right">
                  <span className="text-xl font-black text-[#ef5360]">
                    {money.format(grandTotal)} VND
                  </span>
                  <span className="block text-[10px] text-gray-400">รวมภาษีมูลค่าเพิ่มแล้ว</span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-[#ef5360] py-3.5 text-xs font-bold text-white shadow-md transition-all hover:bg-[#ec3746] hover:shadow-lg active:scale-98 sm:text-sm"
              >
                <LockKeyhole size={16} />
                <span>ยืนยันการสั่งซื้อ · {money.format(grandTotal)} VND</span>
              </button>

              <p className="mt-4 text-center text-[11px] text-gray-400">
                เมื่อคลิกยืนยัน แสดงว่าคุณยอมรับเงื่อนไขและข้อกำหนดการใช้งานของ TixFlow
              </p>
            </div>

            <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-2xs">
              <div className="flex items-center gap-2 text-xs font-semibold text-gray-700">
                <ShieldCheck size={16} className="text-emerald-500" />
                <span>การรับประกันความปลอดภัย</span>
              </div>
              <p className="mt-1 text-[11px] text-gray-500">
                ข้อมูลของคุณได้รับการเข้ารหัส SSL มาตรฐานสากล รับประกันความปลอดภัยสูงสุด
              </p>
            </div>
          </aside>
        </form>
      </div>
    </main>
  );
}
