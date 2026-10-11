"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Check,
  Download,
  Ticket,
  Calendar,
  MapPin,
  QrCode,
  Share2,
  ChevronRight,
  ArrowRight,
} from "lucide-react";
import type { Event } from "@/lib/mock/events";

interface SavedOrder {
  id: string;
  eventSlug: string;
  eventTitle: string;
  ticket: string;
  quantity: number;
  name: string;
  email: string;
  total: number;
  createdAt: string;
}

const money = new Intl.NumberFormat("vi-VN");

export function SuccessView({ event }: { event?: Event }) {
  const [order, setOrder] = useState<SavedOrder | null>(null);

  useEffect(() => {
    const value =
      localStorage.getItem("tixflow-last-order") ||
      localStorage.getItem("zipevent-last-order");
    if (value) {
      try {
        setOrder(JSON.parse(value) as SavedOrder);
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const eventHref = event ? `/events/${event.slug}` : "/events";

  return (
    <main className="min-h-screen bg-[#FDFCFD] pb-20 pt-8 sm:pt-12">
      <div className="container max-w-xl">
        {/* Success Card */}
        <div className="rounded-3xl border border-gray-100 bg-white p-6 text-center shadow-lg sm:p-8">
          {/* Green Check Circle */}
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
            <Check size={32} />
          </div>

          <div className="mt-4">
            <span className="rounded-full bg-emerald-100/70 px-3 py-1 text-xs font-bold text-emerald-700">
              สั่งซื้อเสร็จสมบูรณ์
            </span>
          </div>

          <h1 className="mt-3 text-2xl font-bold tracking-tight text-[#2B212B] sm:text-3xl">
            คุณได้บัตรเรียบร้อยแล้ว!
          </h1>
          <p className="mt-1 text-xs text-gray-500 sm:text-sm">
            ระบบได้จัดส่ง e-Ticket และใบเสร็จยืนยันไปยังอีเมลของคุณแล้ว
          </p>

          {/* Digital Ticket Pass Card with Zipevent Tear Line */}
          <div className="relative mx-auto mt-7 overflow-hidden rounded-2xl border border-gray-200 bg-linear-to-b from-gray-50/80 to-white text-left shadow-xs">
            {/* Ticket Header */}
            <div className="border-b border-gray-100 bg-white p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-md bg-[#ef5360] text-xs font-black text-white">
                    T
                  </div>
                  <span className="text-xs font-bold tracking-tight text-[#2B212B]">
                    TixFlow <span className="text-[#ef5360]">e-Ticket</span>
                  </span>
                </div>
                <span className="rounded-full bg-[#FFEFF0] px-2.5 py-0.5 text-[10px] font-bold text-[#ef5360]">
                  ยืนยันแล้ว
                </span>
              </div>

              <h2 className="mt-3 text-base font-bold text-[#2B212B] sm:text-lg">
                {order?.eventTitle ?? event?.title ?? "Vietnam Future Forum 2026"}
              </h2>

              <div className="mt-2 space-y-1 text-xs text-gray-600">
                <div className="flex items-center gap-1.5">
                  <Calendar size={13} className="text-[#ef5360]" />
                  <span>
                    {event ? new Date(event.startDate).toLocaleDateString("th-TH") : "15 ต.ค. 2026"}{" "}
                    (10:00 - 18:00)
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin size={13} className="text-[#ef5360]" />
                  <span>
                    {event?.venue?.name ?? "Thiskyhall Sala"}, {event?.venue?.city ?? "Ho Chi Minh City"}
                  </span>
                </div>
              </div>
            </div>

            {/* Tear Line / Notches */}
            <div className="relative flex items-center justify-between px-2 py-1">
              <div className="h-4 w-4 -ml-4 rounded-full bg-[#FDFCFD] border-r border-gray-200" />
              <div className="flex-1 border-b-2 border-dashed border-gray-200 mx-2" />
              <div className="h-4 w-4 -mr-4 rounded-full bg-[#FDFCFD] border-l border-gray-200" />
            </div>

            {/* Ticket Attendee Details & QR code */}
            <div className="p-5">
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-gray-400">หมายเลขคำสั่งซื้อ</span>
                  <div className="mt-0.5 font-bold font-mono text-[#2B212B]">
                    {order?.id ?? "TF-20261011"}
                  </div>
                </div>
                <div>
                  <span className="text-gray-400">ผู้ถือบัตร</span>
                  <div className="mt-0.5 font-bold text-[#2B212B]">{order?.name ?? "Guest User"}</div>
                </div>
                <div>
                  <span className="text-gray-400">ประเภทบัตร</span>
                  <div className="mt-0.5 font-bold text-[#2B212B]">
                    {order?.ticket ?? "General Admission"} ({order?.quantity ?? 1} ใบ)
                  </div>
                </div>
                <div>
                  <span className="text-gray-400">ยอดชำระ</span>
                  <div className="mt-0.5 font-bold text-[#ef5360]">
                    {order?.total ? `${money.format(order.total)} VND` : "ฟรี"}
                  </div>
                </div>
              </div>

              {/* QR Code Block */}
              <div className="mt-5 flex flex-col items-center justify-center rounded-xl bg-gray-50 p-4 text-center">
                <div className="grid h-24 w-24 place-items-center rounded-lg border-2 border-white bg-white p-2 shadow-xs">
                  {/* Decorative QR Pattern */}
                  <span className="grid grid-cols-6 gap-0.5">
                    {Array.from({ length: 36 }, (_, idx) => (
                      <i
                        key={idx}
                        className={`h-2.5 w-2.5 rounded-2xs ${
                          (idx * 7 + 3) % 4 < 2 || idx % 5 === 0
                            ? "bg-[#2B212B]"
                            : "bg-transparent"
                        }`}
                      />
                    ))}
                  </span>
                </div>
                <span className="mt-2 text-[10px] text-gray-500 font-mono">
                  แสดง QR Code นี้เพื่อ Check-in ณ จุดลงทะเบียนเข้างาน
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-gray-200 bg-white px-5 py-2.5 text-xs font-semibold text-gray-700 shadow-2xs hover:bg-gray-50 active:scale-95 sm:text-sm"
            >
              <Download size={15} />
              <span>ดาวน์โหลด / พิมพ์ตั๋ว</span>
            </button>
            <Link
              href="/account/tickets"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#ef5360] px-6 py-2.5 text-xs font-bold text-white shadow-md hover:bg-[#ec3746] active:scale-95 sm:text-sm"
            >
              <Ticket size={15} />
              <span>ดูตั๋วทั้งหมดในระบบ</span>
            </Link>
          </div>

          <div className="mt-5">
            <Link
              href={eventHref}
              className="inline-flex items-center gap-1 text-xs font-semibold text-gray-500 hover:text-[#ef5360]"
            >
              <span>กลับสู่หน้ารายละเอียดอีเวนต์</span>
              <ChevronRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
