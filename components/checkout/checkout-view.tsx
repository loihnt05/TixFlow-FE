"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Check, CreditCard, LockKeyhole, Wallet } from "lucide-react";
import type { Event } from "@/lib/mock/events";

const money = new Intl.NumberFormat("en-US");
type Payment = "card" | "bank" | "wallet";

export function CheckoutView({ event, ticketId, quantity }: { event: Event; ticketId: string; quantity: number }) {
  const router = useRouter();
  const [payment, setPayment] = useState<Payment>("card");
  const ticket = event.ticketTypes.find((item) => item.id === ticketId) ?? event.ticketTypes[0];
  const safeQuantity = Math.max(1, Math.min(quantity || 1, ticket.maxPerOrder));
  const subtotal = ticket.price * safeQuantity;
  const fee = Math.round(subtotal * 0.03);

  function completeOrder(formEvent: FormEvent<HTMLFormElement>) {
    formEvent.preventDefault();
    const form = new FormData(formEvent.currentTarget);
    const order = { id: `ZP-${Date.now().toString().slice(-8)}`, eventSlug: event.slug, eventTitle: event.title, ticket: ticket.name, quantity: safeQuantity, name: String(form.get("name")), email: String(form.get("email")), phone: String(form.get("phone")), total: subtotal + fee, payment, createdAt: new Date().toISOString() };
    localStorage.setItem("zipevent-last-order", JSON.stringify(order));
    router.push(`/checkout/success?event=${event.slug}`);
  }

  return <main className="page-shell container pb-16 pt-8"><div className="mx-auto max-w-5xl"><p className="eyebrow">Almost there</p><h1 className="mt-2 text-3xl font-extrabold tracking-tight">Complete your booking</h1><p className="mt-2 text-sm text-slate-500">Your tickets will be ready as soon as you place your order.</p>
    <form onSubmit={completeOrder} className="mt-8 grid gap-7 lg:grid-cols-[1fr_360px]">
      <div className="space-y-6">
        <section className="rounded-2xl border border-slate-200 p-5 sm:p-6"><h2 className="text-lg font-extrabold">Your information</h2><div className="mt-5 grid gap-4 sm:grid-cols-2"><label className="text-xs font-bold text-slate-600 sm:col-span-2">Full name<input required name="name" autoComplete="name" className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm font-normal" placeholder="Enter your full name" /></label><label className="text-xs font-bold text-slate-600">Email address<input required type="email" name="email" autoComplete="email" className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm font-normal" placeholder="you@example.com" /></label><label className="text-xs font-bold text-slate-600">Phone number<input required type="tel" name="phone" autoComplete="tel" className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm font-normal" placeholder="+84" /></label></div></section>
        <section className="rounded-2xl border border-slate-200 p-5 sm:p-6"><h2 className="text-lg font-extrabold">Payment method</h2><div className="mt-4 space-y-2">{([{ id: "card", name: "Credit or debit card", detail: "Visa, Mastercard, JCB", Icon: CreditCard }, { id: "bank", name: "Bank transfer", detail: "Local bank transfer", Icon: LockKeyhole }, { id: "wallet", name: "E-wallet", detail: "MoMo, ZaloPay, VNPay", Icon: Wallet }] as const).map(({ id, name, detail, Icon }) => <label key={id} className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 ${payment === id ? "border-[#f36b3f] bg-orange-50/40" : "border-slate-200"}`}><input type="radio" name="payment" value={id} checked={payment === id} onChange={() => setPayment(id)} className="accent-[#f36b3f]" /><Icon size={18} className="text-slate-500" /><span className="flex-1"><span className="block text-sm font-bold text-slate-800">{name}</span><span className="mt-1 block text-xs text-slate-500">{detail}</span></span>{payment === id && <Check size={17} className="text-[#e7653c]" />}</label>)}</div><p className="mt-4 flex items-center gap-2 text-[11px] text-slate-400"><LockKeyhole size={13} /> Mock checkout — no payment will be processed.</p></section>
      </div>
      <aside className="h-fit rounded-2xl border border-slate-200 p-5 lg:sticky lg:top-24"><h2 className="text-lg font-extrabold">Order summary</h2><div className="mt-4 flex gap-3"><img src={event.thumbnailImage} alt="" className="h-[72px] w-[100px] rounded-lg object-cover" /><div><div className="text-sm font-extrabold leading-5">{event.title}</div><div className="mt-1 text-xs text-slate-500">{ticket.name} × {safeQuantity}</div></div></div><div className="mt-5 space-y-3 border-t border-slate-100 pt-4 text-sm"><div className="flex justify-between"><span className="text-slate-500">Tickets</span><span>{money.format(subtotal)} VND</span></div><div className="flex justify-between"><span className="text-slate-500">Service fee</span><span>{money.format(fee)} VND</span></div><div className="flex justify-between border-t border-slate-100 pt-3 font-extrabold"><span>Total</span><span>{money.format(subtotal + fee)} VND</span></div></div><button type="submit" className="button-primary mt-5 w-full">Place order · {money.format(subtotal + fee)} VND</button><p className="mt-3 text-center text-[10px] leading-5 text-slate-400">By placing your order you agree to the event terms and Zipevent policies.</p><Link href={`/events/${event.slug}`} className="mt-4 block text-center text-xs font-semibold text-slate-500 hover:text-slate-800">Back to event</Link></aside>
    </form>
  </div></main>;
}
