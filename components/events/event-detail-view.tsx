"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import {
  CalendarDays,
  Clock3,
  MapPin,
  Heart,
  Share2,
  Check,
  CheckCircle2,
  Ticket,
  Minus,
  Plus,
  ShieldCheck,
  ExternalLink,
  ChevronRight,
  Info,
  Calendar,
  Sparkles,
  Users,
} from "lucide-react";
import type { Event, TicketType } from "@/lib/mock/events";
import { EventCard } from "./event-card";

const money = new Intl.NumberFormat("vi-VN");
const dateFormatter = new Intl.DateTimeFormat("th-TH", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "Asia/Ho_Chi_Minh",
});

export function EventDetailView({
  event,
  related,
}: {
  event: Event;
  related: Event[];
}) {
  // Ticket quantities state (supports multiple ticket types)
  const [quantities, setQuantities] = useState<Record<string, number>>(() => {
    const init: Record<string, number> = {};
    event.ticketTypes.forEach((t) => {
      init[t.id] = 0;
    });
    return init;
  });

  const [favorite, setFavorite] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"info" | "tickets" | "organizer" | "location">("info");

  const ticketSectionRef = useRef<HTMLDivElement>(null);

  // Load favorite state
  useEffect(() => {
    const saved = new Set<string>(
      JSON.parse(localStorage.getItem("tixflow-favorites") ?? "[]") as string[]
    );
    setFavorite(saved.has(event.slug));
  }, [event.slug]);

  function toggleFavorite() {
    const saved = new Set<string>(
      JSON.parse(localStorage.getItem("tixflow-favorites") ?? "[]") as string[]
    );
    if (saved.has(event.slug)) saved.delete(event.slug);
    else saved.add(event.slug);
    localStorage.setItem("tixflow-favorites", JSON.stringify([...saved]));
    setFavorite(saved.has(event.slug));
  }

  async function shareEvent() {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  const updateQuantity = (ticketId: string, delta: number, maxAllowed: number) => {
    setQuantities((prev) => {
      const current = prev[ticketId] || 0;
      const next = Math.max(0, Math.min(maxAllowed, current + delta));
      return { ...prev, [ticketId]: next };
    });
  };

  // Calculations
  const totalTickets = Object.values(quantities).reduce((a, b) => a + b, 0);
  const subtotal = event.ticketTypes.reduce((sum, t) => {
    return sum + t.price * (quantities[t.id] || 0);
  }, 0);
  const serviceFee = subtotal > 0 ? Math.round(subtotal * 0.05) : 0; // 5% platform fee
  const grandTotal = subtotal + serviceFee;

  // Selected ticket for checkout URL
  const selectedTicketEntry = Object.entries(quantities).find(([_, qty]) => qty > 0);
  const checkoutHref = selectedTicketEntry
    ? `/checkout?event=${event.slug}&ticket=${selectedTicketEntry[0]}&quantity=${selectedTicketEntry[1]}`
    : `/checkout?event=${event.slug}&ticket=${event.ticketTypes[0]?.id}&quantity=1`;

  const scrollToTickets = () => {
    ticketSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main className="min-h-screen bg-[#FDFCFD] pb-24">
      {/* 1. Zipevent Signature Hero Cover Header with Blurred Backdrop */}
      <div className="relative overflow-hidden bg-[#1f1a23] text-white">
        {/* Blurred Background Banner */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30 blur-2xl scale-110"
          style={{ backgroundImage: `url(${event.coverImage})` }}
        />
        <div className="absolute inset-0 bg-linear-to-t from-[#1f1a23] via-[#1f1a23]/80 to-black/60" />

        <div className="container relative z-10 py-8 sm:py-12">
          {/* Breadcrumb */}
          <nav className="mb-6 flex items-center gap-1.5 text-xs text-gray-300">
            <Link href="/" className="hover:text-white">
              หน้าแรก
            </Link>
            <ChevronRight size={13} />
            <Link href="/events" className="hover:text-white">
              อีเวนต์ทั้งหมด
            </Link>
            <ChevronRight size={13} />
            <span className="line-clamp-1 text-white">{event.title}</span>
          </nav>

          {/* Banner Layout: Left High-Res Poster + Right Metadata */}
          <div className="flex flex-col gap-6 md:flex-row md:items-center lg:gap-10">
            {/* Poster Card */}
            <div className="relative aspect-16/9 w-full shrink-0 overflow-hidden rounded-2xl border-2 border-white/10 shadow-2xl md:w-[380px] lg:w-[440px]">
              <img
                src={event.coverImage}
                alt={event.title}
                className="h-full w-full object-cover"
              />
              <div className="absolute left-3 top-3 rounded-full bg-[#ef5360] px-3 py-1 text-xs font-bold text-white shadow-md">
                {event.category}
              </div>
            </div>

            {/* Info Column */}
            <div className="flex flex-1 flex-col justify-center">
              <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
                {event.title}
              </h1>

              <div className="mt-4 space-y-2.5 text-xs text-gray-200 sm:text-sm">
                <div className="flex items-center gap-2.5">
                  <CalendarDays size={18} className="shrink-0 text-[#ef5360]" />
                  <span>{dateFormatter.format(new Date(event.startDate))}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Clock3 size={18} className="shrink-0 text-[#ef5360]" />
                  <span>
                    {event.startTime} - {event.endTime} น. (ICT)
                  </span>
                </div>
                <div className="flex items-center gap-2.5">
                  <MapPin size={18} className="shrink-0 text-[#ef5360]" />
                  <span>
                    {event.venue.isOnline
                      ? "ออนไลน์ผ่าน Live Stream"
                      : `${event.venue.name}, ${event.venue.city}`}
                  </span>
                </div>
              </div>

              {/* Action Buttons in Header */}
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <button
                  onClick={scrollToTickets}
                  className="rounded-full bg-[#ef5360] px-6 py-2.5 text-xs font-bold text-white shadow-md transition-all hover:bg-[#ec3746] hover:shadow-lg active:scale-95 sm:text-sm"
                >
                  {event.status === "sold_out" ? "บัตรหมดแล้ว" : "ซื้อบัตร / ซื้อตั๋ว"}
                </button>
                <button
                  onClick={toggleFavorite}
                  className={`flex items-center gap-1.5 rounded-full border px-4 py-2.5 text-xs font-semibold backdrop-blur-xs transition-colors sm:text-sm ${
                    favorite
                      ? "border-red-400 bg-red-500/20 text-red-300"
                      : "border-white/20 bg-white/10 text-white hover:bg-white/20"
                  }`}
                >
                  <Heart size={16} fill={favorite ? "currentColor" : "none"} />
                  <span>{favorite ? "บันทึกแล้ว" : "บันทึก"}</span>
                </button>
                <button
                  onClick={shareEvent}
                  className="flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-4 py-2.5 text-xs font-semibold text-white backdrop-blur-xs transition-colors hover:bg-white/20 sm:text-sm"
                >
                  {copied ? <Check size={16} className="text-green-400" /> : <Share2 size={16} />}
                  <span>{copied ? "คัดลอกลิงก์แล้ว!" : "แชร์"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Sticky Sub-navigation Bar */}
      <div className="sticky top-16 z-20 border-b border-gray-200 bg-white shadow-2xs">
        <div className="container flex items-center justify-between overflow-x-auto py-1">
          <div className="flex items-center gap-6 text-xs font-bold text-gray-600 sm:text-sm">
            <button
              onClick={() => setActiveTab("info")}
              className={`py-3 transition-colors ${
                activeTab === "info"
                  ? "border-b-2 border-[#ef5360] text-[#ef5360]"
                  : "hover:text-[#ef5360]"
              }`}
            >
              ข้อมูลอีเวนต์
            </button>
            <button
              onClick={() => {
                setActiveTab("tickets");
                scrollToTickets();
              }}
              className={`py-3 transition-colors ${
                activeTab === "tickets"
                  ? "border-b-2 border-[#ef5360] text-[#ef5360]"
                  : "hover:text-[#ef5360]"
              }`}
            >
              บัตรและการจอง
            </button>
            <button
              onClick={() => setActiveTab("location")}
              className={`py-3 transition-colors ${
                activeTab === "location"
                  ? "border-b-2 border-[#ef5360] text-[#ef5360]"
                  : "hover:text-[#ef5360]"
              }`}
            >
              สถานที่จัดงาน
            </button>
            <button
              onClick={() => setActiveTab("organizer")}
              className={`py-3 transition-colors ${
                activeTab === "organizer"
                  ? "border-b-2 border-[#ef5360] text-[#ef5360]"
                  : "hover:text-[#ef5360]"
              }`}
            >
              ผู้จัดงาน
            </button>
          </div>

          <div className="hidden items-center gap-4 py-2 md:flex">
            <span className="text-xs text-gray-500">
              ราคาเริ่มต้น:{" "}
              <strong className="text-sm font-bold text-[#ef5360]">
                {event.ticketTypes[0]?.price === 0
                  ? "ฟรี"
                  : `${money.format(event.ticketTypes[0]?.price || 0)} VND`}
              </strong>
            </span>
            <button
              onClick={scrollToTickets}
              className="rounded-full bg-[#ef5360] px-5 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-[#ec3746]"
            >
              ซื้อบัตร
            </button>
          </div>
        </div>
      </div>

      {/* 3. Main Detail Content: Left Column (Details + Tickets) & Right Column (Sticky Summary) */}
      <div className="container mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
        {/* Left Column */}
        <div className="min-w-0 space-y-8">
          {/* Ticket Selection Area */}
          <div ref={ticketSectionRef} className="scroll-mt-32">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-lg font-bold text-[#2B212B] sm:text-xl">
                <Ticket size={20} className="text-[#ef5360]" />
                <span>เลือกรอบและประเภทบัตร</span>
              </h2>
              <span className="text-xs text-gray-500">
                เหลือทั้งหมด{" "}
                {event.ticketTypes.reduce((acc, t) => acc + (t.quantity - t.sold), 0)} ที่นั่ง
              </span>
            </div>

            <div className="space-y-3.5">
              {event.ticketTypes.map((ticketItem) => {
                const max = Math.min(
                  ticketItem.maxPerOrder,
                  ticketItem.quantity - ticketItem.sold
                );
                const currentQty = quantities[ticketItem.id] || 0;
                const isSoldOut = ticketItem.quantity <= ticketItem.sold;

                return (
                  <div
                    key={ticketItem.id}
                    className={`rounded-2xl border bg-white p-5 shadow-2xs transition-all ${
                      currentQty > 0
                        ? "border-[#ef5360] ring-1 ring-[#ef5360]/20"
                        : "border-gray-100 hover:border-gray-200"
                    } ${isSoldOut ? "opacity-60" : ""}`}
                  >
                    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-bold text-[#2B212B]">
                            {ticketItem.name}
                          </h3>
                          {isSoldOut ? (
                            <span className="rounded-full bg-gray-200 px-2.5 py-0.5 text-[10px] font-bold text-gray-600">
                              บัตรหมด
                            </span>
                          ) : (
                            <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-600">
                              เปิดจำหน่าย
                            </span>
                          )}
                        </div>

                        <p className="mt-1 text-xs text-gray-600">
                          {ticketItem.description}
                        </p>

                        {/* Benefits list */}
                        {ticketItem.benefits && ticketItem.benefits.length > 0 && (
                          <div className="mt-2.5 flex flex-wrap gap-2 text-[11px] text-gray-500">
                            {ticketItem.benefits.map((b, i) => (
                              <span key={i} className="flex items-center gap-1">
                                <Check size={12} className="text-[#ef5360]" />
                                {b}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Price and Counter */}
                      <div className="flex items-center justify-between gap-6 border-t border-gray-50 pt-3 sm:border-0 sm:pt-0">
                        <div className="text-left sm:text-right">
                          <div className="text-lg font-bold text-[#ef5360]">
                            {ticketItem.price === 0
                              ? "ฟรี"
                              : `${money.format(ticketItem.price)} VND`}
                          </div>
                          <span className="text-[10px] text-gray-400">
                            สูงสุด {ticketItem.maxPerOrder} ใบ/ออเดอร์
                          </span>
                        </div>

                        {/* Quantity Counter */}
                        <div className="flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50/50 p-1">
                          <button
                            type="button"
                            disabled={isSoldOut || currentQty <= 0}
                            onClick={() => updateQuantity(ticketItem.id, -1, max)}
                            className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-gray-600 shadow-2xs transition-colors hover:bg-gray-100 disabled:opacity-40"
                          >
                            <Minus size={13} />
                          </button>
                          <span className="w-6 text-center text-xs font-bold text-[#2B212B]">
                            {currentQty}
                          </span>
                          <button
                            type="button"
                            disabled={isSoldOut || currentQty >= max}
                            onClick={() => updateQuantity(ticketItem.id, 1, max)}
                            className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-gray-600 shadow-2xs transition-colors hover:bg-gray-100 disabled:opacity-40"
                          >
                            <Plus size={13} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* About Event / Rich Description */}
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-2xs">
            <h2 className="mb-4 text-lg font-bold text-[#2B212B] sm:text-xl">
              รายละเอียดอีเวนต์ (About This Event)
            </h2>
            <div className="prose prose-sm max-w-none text-xs leading-relaxed text-gray-700 sm:text-sm">
              <p className="whitespace-pre-line">{event.description}</p>
            </div>

            {/* Highlights Grid */}
            <div className="mt-8 border-t border-gray-100 pt-6">
              <h3 className="mb-4 text-sm font-bold text-[#2B212B]">
                สิ่งที่คุณจะได้รับจากงานนี้
              </h3>
              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  {
                    num: "01",
                    title: "พบปะคอมมูนิตี้",
                    desc: "สร้างคอนเนกชันกับเพื่อนร่วมวงการและผู้นำความคิด",
                  },
                  {
                    num: "02",
                    title: "ความรู้จากผู้เชี่ยวชาญ",
                    desc: "เนื้อหาเจาะลึกที่นำไปปรับใช้ได้จริงในงานของคุณ",
                  },
                  {
                    num: "03",
                    title: "ของที่ระลึก & e-Certificate",
                    desc: "เอกสารสรุปเนื้อหาและสิทธิพิเศษเฉพาะผู้เข้าร่วม",
                  },
                ].map((item) => (
                  <div
                    key={item.num}
                    className="rounded-xl border border-gray-100 bg-gray-50/50 p-4"
                  >
                    <div className="text-xs font-bold text-[#ef5360]">{item.num}</div>
                    <div className="mt-1 text-sm font-bold text-[#2B212B]">{item.title}</div>
                    <div className="mt-1 text-xs text-gray-500">{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Location & Map Section */}
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-2xs">
            <h2 className="mb-4 text-lg font-bold text-[#2B212B] sm:text-xl">
              สถานที่จัดงาน (Location)
            </h2>
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50 text-[#ef5360]">
                <MapPin size={20} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#2B212B]">
                  {event.venue.isOnline ? "กิจกรรมออนไลน์" : event.venue.name}
                </h3>
                <p className="mt-0.5 text-xs text-gray-600">{event.venue.address}</p>
                <p className="mt-0.5 text-xs text-gray-500">
                  {event.venue.city}, {event.venue.country}
                </p>
              </div>
            </div>

            {/* Map Preview Box */}
            <div className="mt-4 flex h-48 w-full items-center justify-center rounded-xl border border-gray-200 bg-gray-100 text-center">
              <div>
                <MapPin size={28} className="mx-auto text-[#ef5360]" />
                <span className="mt-2 block text-xs font-semibold text-gray-600">
                  {event.venue.name} ({event.venue.city})
                </span>
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(
                    event.venue.name + " " + event.venue.city
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-[#ef5360] hover:underline"
                >
                  <span>เปิดดูใน Google Maps</span>
                  <ExternalLink size={12} />
                </a>
              </div>
            </div>
          </div>

          {/* Organizer Card */}
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-2xs">
            <h2 className="mb-4 text-lg font-bold text-[#2B212B] sm:text-xl">
              ข้อมูลผู้จัดงาน (Organized by)
            </h2>
            <div className="flex items-center gap-4">
              <div className="relative h-16 w-16 overflow-hidden rounded-full border border-gray-200">
                <img
                  src={
                    event.organizer.avatar ||
                    "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=200&h=200&fit=crop"
                  }
                  alt={event.organizer.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-base font-bold text-[#2B212B]">
                    {event.organizer.name}
                  </h3>
                  {event.organizer.verified && (
                    <CheckCircle2 size={16} className="fill-[#ef5360] text-white" />
                  )}
                </div>
                <p className="mt-0.5 line-clamp-2 text-xs text-gray-600">
                  {event.organizer.description}
                </p>
                <div className="mt-2 flex items-center gap-3 text-[11px] text-gray-500">
                  <span className="flex items-center gap-1">
                    <Calendar size={12} /> {event.organizer.eventCount} อีเวนต์
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Users size={12} /> {event.organizer.followerCount} ผู้ติดตาม
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sticky Order Summary Panel (.panel-booking-sum) */}
        <aside className="h-fit space-y-4 lg:sticky lg:top-32">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="border-b border-gray-100 pb-4">
              <h3 className="text-base font-bold text-[#2B212B]">สรุปคำสั่งซื้อ</h3>
              <p className="mt-0.5 text-xs text-gray-500">{event.title}</p>
            </div>

            {/* Selected Tickets Breakdown */}
            <div className="py-4 space-y-2.5">
              {totalTickets === 0 ? (
                <div className="py-6 text-center text-xs text-gray-400">
                  ยังไม่ได้เลือกจำนวนบัตร
                  <br />
                  <span className="text-[11px] text-gray-400">
                    กรุณากดเลือกจำนวนบัตรด้านซ้าย
                  </span>
                </div>
              ) : (
                event.ticketTypes.map((t) => {
                  const qty = quantities[t.id] || 0;
                  if (qty === 0) return null;
                  return (
                    <div
                      key={t.id}
                      className="flex items-center justify-between text-xs text-gray-700"
                    >
                      <span>
                        {t.name} x {qty}
                      </span>
                      <span className="font-semibold">
                        {t.price === 0 ? "ฟรี" : `${money.format(t.price * qty)} VND`}
                      </span>
                    </div>
                  );
                })
              )}
            </div>

            {/* Financial Details */}
            <div className="space-y-2 border-t border-gray-100 py-3.5 text-xs text-gray-600">
              <div className="flex justify-between">
                <span>ยอดรวมบัตร (Subtotal)</span>
                <span>{money.format(subtotal)} VND</span>
              </div>
              <div className="flex justify-between">
                <span>ค่าธรรมเนียมแพลตฟอร์ม</span>
                <span>{money.format(serviceFee)} VND</span>
              </div>
            </div>

            {/* Total Price */}
            <div className="flex items-baseline justify-between border-t border-gray-200 pt-4">
              <span className="text-sm font-bold text-[#2B212B]">ยอดชำระสุทธิ</span>
              <div className="text-right">
                <span className="text-xl font-black text-[#ef5360]">
                  {money.format(grandTotal)} VND
                </span>
                <span className="block text-[10px] text-gray-400">รวม VAT แล้ว</span>
              </div>
            </div>

            {/* Buy / Checkout CTA Button */}
            <Link
              href={checkoutHref}
              aria-disabled={totalTickets === 0 || event.status === "sold_out"}
              className={`mt-5 flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-xs font-bold text-white shadow-md transition-all sm:text-sm ${
                totalTickets === 0 || event.status === "sold_out"
                  ? "pointer-events-none bg-gray-300 opacity-60"
                  : "bg-[#ef5360] hover:bg-[#ec3746] hover:shadow-lg active:scale-98"
              }`}
            >
              <Ticket size={17} />
              <span>
                {event.status === "sold_out" ? "บัตรจำหน่ายหมดแล้ว" : "ดำเนินการชำระเงิน"}
              </span>
            </Link>

            {/* Guarantees */}
            <div className="mt-4 flex items-center justify-center gap-2 text-[11px] text-gray-500">
              <ShieldCheck size={14} className="text-emerald-500" />
              <span>ชำระเงินปลอดภัย 100% ผ่าน TixFlow</span>
            </div>
          </div>
        </aside>
      </div>

      {/* 4. Related Events Section */}
      {related.length > 0 && (
        <section className="container mt-16 pt-8 border-t border-gray-100">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-[#2B212B]">
                อีเวนต์ที่คุณอาจสนใจ
              </h2>
              <p className="mt-1 text-xs text-[#8E8E8E]">
                อีเวนต์อื่นๆ ในหมวดหมู่ {event.category}
              </p>
            </div>
            <Link
              href={`/events?category=${event.category}`}
              className="text-xs font-semibold text-[#ef5360] hover:underline"
            >
              ดูทั้งหมด
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
            {related.slice(0, 4).map((relEvent) => (
              <EventCard key={relEvent.id} event={relEvent} />
            ))}
          </div>
        </section>
      )}

      {/* 5. Mobile Sticky Bottom Action Bar */}
      {totalTickets > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-gray-200 bg-white/95 px-4 py-3 backdrop-blur-md shadow-lg lg:hidden">
          <div className="container flex items-center justify-between gap-4 !px-0">
            <div>
              <div className="text-[11px] text-gray-500">
                เลือกแล้ว {totalTickets} ใบ
              </div>
              <div className="text-base font-black text-[#ef5360]">
                {money.format(grandTotal)} VND
              </div>
            </div>
            <Link
              href={checkoutHref}
              className="inline-flex items-center gap-2 rounded-full bg-[#ef5360] px-6 py-2.5 text-xs font-bold text-white shadow-md hover:bg-[#ec3746]"
            >
              <span>ชำระเงิน</span>
              <Ticket size={14} />
            </Link>
          </div>
        </div>
      )}
    </main>
  );
}
