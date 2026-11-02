"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { useKeycloakAuth } from "@/components/auth-provider";
import { useApi } from "@/lib/api";
import { Sparkles, Send, Ticket } from "lucide-react";

interface Preview {
  eventName: string; eventSlug: string; sessionName: string; startsAtUtc: string;
  sessionId: string; ticketTypeId: string; ticketName: string; quantity: number;
  seatIds: string[]; seats: string[]; unitPrice: number; totalAmount: number; currency: string;
  holdDurationMinutes: number; confirmBeforeUtc: string;
}
interface Proposal { confirmationToken: string; preview: Preview }
interface Reply { message: string; conversationToken: string; fallback: boolean; proposals: Proposal[] }

export default function AssistantPage() {
  const auth = useKeycloakAuth();
  // A new subject mounts a fresh chat. Tokens and messages never persist across accounts.
  return <AssistantChat key={String(auth.tokenParsed?.sub ?? "anonymous")} />;
}

function AssistantChat() {
  const auth = useKeycloakAuth();
  const api = useApi();
  const [message, setMessage] = useState("");
  const [turns, setTurns] = useState<Array<{ role: string; text: string }>>([]);
  const [conversationToken, setConversationToken] = useState<string>();
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [checkout, setCheckout] = useState<string>();
  const [now, setNow] = useState(Date.now());
  const pending = useRef<AbortController | null>(null);
  const locked = useRef(false);
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => { clearInterval(timer); pending.current?.abort(); };
  }, []);

  async function send(e: FormEvent) {
    e.preventDefault();
    if (!message.trim() || locked.current) return;
    locked.current = true;
    setBusy(true); setError(""); setProposals([]);
    const text = message.trim();
    setMessage(""); setTurns(t => [...t, { role: "Bạn", text }]);
    const controller = new AbortController(); pending.current = controller;
    try {
      const reply = await api<Reply>("/api/v1/assistant/messages", {
        method: "POST", signal: controller.signal, body: JSON.stringify({ message: text, conversationToken }),
      });
      setConversationToken(reply.conversationToken);
      setProposals(reply.proposals);
      setTurns(t => [...t, { role: reply.fallback ? "TixFlow · AI tạm không khả dụng" : "TixFlow Assistant", text: reply.message }]);
    } catch (cause) {
      if (!controller.signal.aborted) setError(cause instanceof Error ? cause.message : "Không thể gửi tin nhắn.");
    } finally { locked.current = false; setBusy(false); }
  }

  async function confirm(proposal: Proposal) {
    if (locked.current) return;
    locked.current = true;
    setBusy(true); setError("");
    const controller = new AbortController(); pending.current = controller;
    try {
      const result = await api<{ data: { id: string; expiresAtUtc: string } }>("/api/v1/assistant/confirm-hold", {
        method: "POST", signal: controller.signal,
        body: JSON.stringify({ confirmationToken: proposal.confirmationToken, confirmed: true }),
      });
      const p = proposal.preview;
      const query = new URLSearchParams({ event: p.eventSlug, sessionId: p.sessionId,
        ticket: p.ticketTypeId, quantity: String(p.quantity), seats: p.seatIds.join(","), holdId: result.data.id });
      setCheckout(`/checkout?${query}`);
      setProposals([]);
      setTurns(t => [...t, { role: "TixFlow", text: `Đã giữ vé đến ${new Date(result.data.expiresAtUtc).toLocaleString("vi-VN")}. Hãy tiếp tục sang thanh toán.` }]);
    } catch (cause) {
      if (!controller.signal.aborted) setError(cause instanceof Error ? cause.message : "Chưa xác nhận được kết quả. Hãy thử lại cùng yêu cầu.");
    } finally { locked.current = false; setBusy(false); }
  }

  const money = (value: number, currency: string) => new Intl.NumberFormat("vi-VN", { style: "currency", currency }).format(value);
  return <main className="min-h-screen bg-[#FDFCFD] py-10">
    <div className="container max-w-3xl space-y-6">
      <div className="flex items-center gap-3"><Sparkles className="text-[#ef5360]" /><h1 className="text-3xl font-bold">Trợ lý đặt vé</h1></div>
      <p className="text-gray-600">Tìm sự kiện, kiểm tra vé và chuẩn bị lựa chọn. Bạn sẽ xem giá và xác nhận trước khi giữ vé.</p>
      <Link href="/events" className="inline-block text-[#d53f50] underline">Tìm và đặt vé tại trang Sự kiện</Link>
      {!auth.authenticated ? <button className="block rounded-xl bg-[#ef5360] px-5 py-3 text-white" disabled={!auth.ready}
        onClick={() => void auth.login("/assistant")}>Đăng nhập để trò chuyện</button>
      : !auth.roles.includes("Customer") ? <p role="alert">Trợ lý đặt vé dành cho tài khoản Customer.</p> : <>
        <p className="text-sm text-gray-500">Nội dung bạn gửi và dữ liệu sự kiện liên quan được chuyển tới OpenAI để trả lời. Không gửi mật khẩu hoặc thông tin thanh toán.</p>
        <div role="log" aria-live="polite" className="space-y-4">
          {turns.length === 0 && <div className="rounded-2xl border bg-white p-6 text-gray-600">Bạn muốn tham gia sự kiện nào? Hãy cho mình biết tên, địa điểm hoặc ngày bạn muốn đi.</div>}
          {turns.map((t, i) => <div key={i} className={`rounded-2xl p-4 ${t.role === "Bạn" ? "bg-rose-50" : "border bg-white"}`}>
            <p className="mb-2 text-sm font-semibold">{t.role}</p><p className="whitespace-pre-wrap break-words">{t.text}</p>
          </div>)}
        </div>
        {proposals.map(proposal => { const p = proposal.preview; const expired = now >= Date.parse(p.confirmBeforeUtc); return <section
          key={proposal.confirmationToken} className="space-y-3 rounded-2xl border border-rose-200 bg-white p-6" aria-label="Xác nhận giữ vé">
          <h2 className="flex items-center gap-2 text-xl font-semibold"><Ticket />Kiểm tra lựa chọn</h2>
          <p className="font-semibold">{p.eventName}</p>
          <p>{p.sessionName} · {new Date(p.startsAtUtc).toLocaleString("vi-VN")}</p>
          <p>{p.ticketName} · {p.quantity} vé × {money(p.unitPrice, p.currency)}</p>
          {p.seats.length > 0 && <p>Ghế: {p.seats.join(", ")}</p>}
          <p className="text-lg font-bold">Tổng: {money(p.totalAmount, p.currency)}</p>
          <p>Giữ trong {p.holdDurationMinutes} phút kể từ lúc xác nhận thành công.</p>
          <p className="text-sm text-gray-500">Xác nhận trước {new Date(p.confirmBeforeUtc).toLocaleTimeString("vi-VN")}. Tồn vé có thể thay đổi.</p>
          <button disabled={busy || expired} onClick={() => void confirm(proposal)} className="rounded-xl bg-[#ef5360] px-5 py-3 font-semibold text-white disabled:opacity-50">
            {expired ? "Bản xác nhận đã hết hạn — hãy chọn lại" : "Xác nhận giữ vé"}</button>
          <button disabled={busy} className="ml-4 underline" onClick={() => setProposals([])}>Bỏ lựa chọn</button>
        </section>; })}
        {checkout && <Link className="inline-block rounded-xl bg-[#ef5360] px-5 py-3 font-semibold text-white" href={checkout}>Tiếp tục thanh toán</Link>}
        {error && <p role="alert" className="text-red-700">{error}</p>}
        <form onSubmit={send} className="flex gap-3">
          <label className="sr-only" htmlFor="assistant-message">Tin nhắn</label>
          <textarea id="assistant-message" required maxLength={2000} value={message} onChange={e => setMessage(e.target.value)}
            placeholder="Ví dụ: Tìm sự kiện âm nhạc tại TP.HCM" rows={2} disabled={busy} className="min-w-0 flex-1 rounded-xl border p-3" />
          <button disabled={busy || !message.trim()} className="rounded-xl bg-[#ef5360] px-5 text-white disabled:opacity-50" aria-label="Gửi tin nhắn"><Send size={20} /></button>
        </form>
        {busy && <p role="status" className="text-sm text-gray-500">Đang xử lý…</p>}
        <button className="text-sm underline" disabled={busy} onClick={() => { setTurns([]); setConversationToken(undefined); setProposals([]); setError(""); }}>Cuộc trò chuyện mới</button>
      </>}
    </div>
  </main>;
}
