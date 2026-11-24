"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { useKeycloakAuth } from "@/components/auth-provider";
import { ApiError, useApi } from "@/lib/api";
import { useWaitingRoom } from "@/lib/waiting-room";
import { WaitingRoomPanel } from "@/components/checkout/waiting-room-panel";
import {
  Sparkles,
  Send,
  Ticket,
  ShieldCheck,
  Clock,
  RotateCcw,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Lock,
  Calendar,
  MapPin,
  Bot,
  User,
  Compass,
  Zap,
  HelpCircle,
  ChevronRight,
} from "lucide-react";

interface Preview {
  eventId: string;
  eventName: string;
  eventSlug: string;
  sessionName: string;
  startsAtUtc: string;
  sessionId: string;
  ticketTypeId: string;
  ticketName: string;
  quantity: number;
  seatIds: string[];
  seats: string[];
  unitPrice: number;
  totalAmount: number;
  currency: string;
  holdDurationMinutes: number;
  confirmBeforeUtc: string;
}

interface Proposal {
  confirmationToken: string;
  preview: Preview;
}

interface Reply {
  message: string;
  conversationToken: string;
  fallback: boolean;
  proposals: Proposal[];
  toolsUsed?: string[];
}

interface Turn {
  role: string;
  text: string;
  timestamp: string;
  isUser: boolean;
  isFallback?: boolean;
  toolsUsed?: string[];
}

const SUGGESTED_PROMPTS = [
  {
    label: "Sự kiện âm nhạc TP.HCM",
    prompt: "Tìm các sự kiện âm nhạc và concert sắp diễn ra tại TP.HCM",
    category: "Music",
  },
  {
    label: "Hội nghị AI & Công nghệ",
    prompt: "Gợi ý các hội nghị về AI, dữ liệu và công nghệ sắp tới",
    category: "Tech",
  },
  {
    label: "Sự kiện tại Bangkok",
    prompt: "Tìm các sự kiện triển lãm và fanmeeting nổi bật tại Bangkok",
    category: "Featured",
  },
  {
    label: "Sự kiện miễn phí",
    prompt: "Có sự kiện hoặc meetup nào đăng ký miễn phí trong tháng này không?",
    category: "Free",
  },
  {
    label: "Kiểm tra vé & giá vé",
    prompt: "Kiểm tra các hạng vé và tình trạng chỗ trống của Vietnam Future Forum 2026",
    category: "Tickets",
  },
  {
    label: "Chuẩn bị giữ 2 vé",
    prompt: "Giúp mình chuẩn bị giữ 2 vé cho sự kiện Saigon Indie Music Weekend",
    category: "Booking",
  },
];

const WORKFLOW_STEPS = [
  {
    step: "01",
    title: "Tra cứu & Gợi ý thông minh",
    description:
      "Hỏi bằng ngôn ngữ tự nhiên theo tên sự kiện, nghệ sĩ, thành phố, thể loại hoặc khung thời gian bạn rảnh.",
  },
  {
    step: "02",
    title: "Kiểm tra tồn vé thời gian thực",
    description:
      "Trợ lý truy vấn trực tiếp danh mục sự kiện, suất diễn, hạng vé và ghế trống hiện có trên hệ thống.",
  },
  {
    step: "03",
    title: "Xác nhận giữ vé minh bạch",
    description:
      "Xem trước bảng báo giá chi tiết và bấm xác nhận thủ công để khóa vé tạm thời trước khi sang trang thanh toán.",
  },
];

function formatTimeRemaining(confirmBeforeUtc: string, nowMs: number): string {
  const diffSec = Math.max(0, Math.floor((Date.parse(confirmBeforeUtc) - nowMs) / 1000));
  const mins = Math.floor(diffSec / 60);
  const secs = diffSec % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

export default function AssistantPage() {
  const auth = useKeycloakAuth();
  // A new subject mounts a fresh chat. Tokens and messages never persist across accounts.
  return <AssistantChat key={String(auth.tokenParsed?.sub ?? "anonymous")} />;
}

function AssistantChat() {
  const auth = useKeycloakAuth();
  const api = useApi();
  const [message, setMessage] = useState("");
  const [turns, setTurns] = useState<Turn[]>([]);
  const [conversationToken, setConversationToken] = useState<string>();
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [attemptedConfirmations, setAttemptedConfirmations] = useState<string[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string>();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [checkout, setCheckout] = useState<string>();
  const waitingRoom = useWaitingRoom(activeSessionId, Boolean(activeSessionId) && !checkout);
  const [now, setNow] = useState(Date.now());
  const pending = useRef<AbortController | null>(null);
  const locked = useRef(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => {
      clearInterval(timer);
      pending.current?.abort();
    };
  }, []);

  useEffect(() => {
    if (turns.length > 0 || proposals.length > 0 || busy) {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [turns.length, proposals.length, busy]);

  async function submitMessage(rawText: string) {
    const text = rawText.trim();
    if (!text || locked.current) return;
    locked.current = true;
    setBusy(true);
    setError("");
    setProposals([]);
    setAttemptedConfirmations([]);
    setActiveSessionId(undefined);
    setMessage("");

    const timeLabel = new Date().toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });

    setTurns((t) => [
      ...t,
      {
        role: "Bạn",
        text,
        timestamp: timeLabel,
        isUser: true,
      },
    ]);

    const controller = new AbortController();
    pending.current = controller;
    try {
      const reply = await api<Reply>("/api/v1/assistant/messages", {
        method: "POST",
        signal: controller.signal,
        body: JSON.stringify({ message: text, conversationToken }),
      });
      setConversationToken(reply.conversationToken);
      setProposals(reply.proposals);
      setActiveSessionId(reply.proposals[0]?.preview.sessionId);
      setTurns((t) => [
        ...t,
        {
          role: reply.fallback ? "TixFlow · AI tạm không khả dụng" : "TixFlow Assistant",
          text: reply.message,
          timestamp: new Date().toLocaleTimeString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
          }),
          isUser: false,
          isFallback: reply.fallback,
          toolsUsed: reply.toolsUsed,
        },
      ]);
    } catch (cause) {
      if (!controller.signal.aborted) {
        setError(cause instanceof Error ? cause.message : "Không thể gửi tin nhắn.");
      }
    } finally {
      locked.current = false;
      setBusy(false);
    }
  }

  async function send(e: FormEvent) {
    e.preventDefault();
    await submitMessage(message);
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (message.trim() && !busy) {
        void submitMessage(message);
      }
    }
  }

  async function confirm(proposal: Proposal) {
    if (activeSessionId !== proposal.preview.sessionId) {
      setActiveSessionId(proposal.preview.sessionId);
      return;
    }
    const alreadyAttempted = attemptedConfirmations.includes(proposal.confirmationToken);
    if (!alreadyAttempted && (!(["direct", "admitted"].includes(waitingRoom.phase)) ||
      (waitingRoom.phase === "admitted" && (!waitingRoom.admissionToken ||
        (waitingRoom.expiresAtUnixMs ?? 0) <= Date.now() + 3000)))) {
      setError("Hãy chờ đến lượt rồi xác nhận đề xuất còn hiệu lực.");
      return;
    }
    if (locked.current) return;
    locked.current = true;
    setBusy(true);
    setError("");
    const controller = new AbortController();
    pending.current = controller;
    setAttemptedConfirmations((current) => [...current, proposal.confirmationToken]);
    try {
      const result = await api<{ data: { id: string; expiresAtUtc: string } }>(
        "/api/v1/assistant/confirm-hold",
        {
          method: "POST",
          signal: controller.signal,
          body: JSON.stringify({
            confirmationToken: proposal.confirmationToken,
            confirmed: true,
            ...(waitingRoom.phase === "admitted" ? { admissionToken: waitingRoom.admissionToken } : {}),
          }),
        }
      );
      const p = proposal.preview;
      const query = new URLSearchParams({
        event: p.eventSlug,
        sessionId: p.sessionId,
        ticket: p.ticketTypeId,
        quantity: String(p.quantity),
        seats: p.seatIds.join(","),
        holdId: result.data.id,
      });
      setCheckout(`/checkout?${query}`);
      setProposals([]);
      setTurns((t) => [
        ...t,
        {
          role: "TixFlow",
          text: `Đã giữ vé đến ${new Date(result.data.expiresAtUtc).toLocaleString("vi-VN")}. Hãy tiếp tục sang thanh toán.`,
          timestamp: new Date().toLocaleTimeString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
          }),
          isUser: false,
        },
      ]);
    } catch (cause) {
      if (cause instanceof ApiError && ["WAITING_ROOM_REQUIRED", "ADMISSION_INVALID", "ADMISSION_EXPIRED",
        "ADMISSION_INTENT_CONFLICT"].includes(cause.code ?? "")) {
        setAttemptedConfirmations((current) => current.filter((token) => token !== proposal.confirmationToken));
        waitingRoom.retry();
      }
      if (!controller.signal.aborted) {
        setError(
          cause instanceof Error
            ? cause.message
            : "Chưa xác nhận được kết quả. Hãy thử lại cùng yêu cầu."
        );
      }
    } finally {
      locked.current = false;
      setBusy(false);
    }
  }

  async function refreshProposal(proposal: Proposal) {
    if (locked.current) return;
    locked.current = true;
    setBusy(true);
    setError("");
    try {
      const p = proposal.preview;
      const fresh = await api<Proposal>("/api/v1/assistant/prepare-hold", {
        method: "POST",
        body: JSON.stringify({ eventId: p.eventId, sessionId: p.sessionId,
          ticketTypeId: p.ticketTypeId, quantity: p.quantity, seatIds: p.seatIds }),
      });
      setProposals((current) => current.map((item) => item === proposal ? fresh : item));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Không thể làm mới đề xuất.");
    } finally {
      locked.current = false;
      setBusy(false);
    }
  }

  function resetConversation() {
    setTurns([]);
    setConversationToken(undefined);
    setProposals([]);
    setError("");
    setCheckout(undefined);
  }

  const money = (value: number, currency: string) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency }).format(value);

  const isCustomer = auth.authenticated && auth.roles.includes("Customer");

  return (
    <main className="ambient-page min-h-screen pb-16">
      {/* 1. Hero Header Banner with Zipevent Coral-Amber Signature Aesthetic */}
      <section className="relative overflow-hidden border-b border-[#f3d5ce]/70 bg-gradient-to-r from-[#fff3f4] via-[#fff8f5] to-[#fff4eb] pt-8 pb-8 sm:pt-10 sm:pb-10">
        {/* Ambient Decorative Radial Glows */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-[#ef5360]/12 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-0 top-0 h-64 w-96 rounded-full bg-[#f8a846]/12 blur-3xl"
        />

        <div className="container relative z-10">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
            <div className="max-w-2xl">
              <div className="mb-3 inline-flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#ef5360] px-3.5 py-1 text-[11px] font-bold uppercase tracking-wider text-white shadow-xs">
                  <Sparkles size={13} />
                  <span>TixFlow AI Concierge</span>
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#ef5360]/25 bg-white/90 px-3 py-1 text-[11px] font-semibold text-[#2B212B] shadow-2xs">
                  <ShieldCheck size={13} className="text-emerald-600" />
                  <span>Xác nhận giữ vé 2 bước an toàn</span>
                </span>
              </div>

              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-extrabold tracking-tight text-[#2B212B] sm:text-3xl md:text-[34px]">
                  Trợ lý đặt vé
                </h1>
              </div>

              <p className="mt-2 text-xs sm:text-sm md:text-[15px] leading-relaxed text-[#4A4A4A]">
                Tìm sự kiện, kiểm tra vé và chuẩn bị lựa chọn. Bạn sẽ xem giá và xác nhận trước khi
                giữ vé.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/events"
                className="inline-flex items-center gap-2 rounded-full border border-[#ef5360] bg-white px-5 py-2.5 text-xs sm:text-sm font-semibold text-[#d53f50] shadow-2xs transition-all duration-200 hover:bg-[#ef5360] hover:text-white hover:shadow-md"
              >
                <Compass size={16} />
                <span>Tìm và đặt vé tại trang Sự kiện</span>
                <ArrowRight size={15} />
              </Link>

              {isCustomer && turns.length > 0 && (
                <button
                  type="button"
                  disabled={busy}
                  onClick={resetConversation}
                  className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2.5 text-xs sm:text-sm font-semibold text-gray-700 shadow-2xs transition-all hover:border-[#ef5360] hover:text-[#ef5360] disabled:opacity-50"
                >
                  <RotateCcw size={15} />
                  <span>Cuộc trò chuyện mới</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 2. Main 2-Column Concierge Studio */}
      <section className="container mt-7 sm:mt-9">
        <div className="grid grid-cols-1 items-start gap-7 lg:grid-cols-12">
          {/* LEFT / MAIN STUDIO COLUMN (8 cols) */}
          <div className="lg:col-span-8">
            {!auth.authenticated ? (
              /* UNAUTHENTICATED SHOWCASE & SIGN-IN CARD */
              <div className="overflow-hidden rounded-3xl border border-gray-200/90 bg-white shadow-[0_12px_36px_-8px_rgba(17,15,28,0.08)]">
                {/* Top Preview Header Bar */}
                <div className="flex items-center justify-between border-b border-gray-100 bg-gradient-to-r from-[#2B212B] via-[#382738] to-[#2B212B] px-6 py-4 text-white">
                  <div className="flex items-center gap-3">
                    <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-[#ef5360] to-[#f8a846] text-white shadow-sm">
                      <Bot size={19} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold tracking-tight">
                          TixFlow Booking Assistant
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-semibold text-emerald-300">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                          Online
                        </span>
                      </div>
                      <p className="text-[11px] text-white/70">
                        Hỗ trợ tra cứu lịch diễn, kiểm tra ghế trống &amp; giữ vé tức thì
                      </p>
                    </div>
                  </div>
                  <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-medium text-white/90">
                    <Lock size={12} className="text-[#ff858f]" />
                    Customer Protected
                  </span>
                </div>

                <div className="p-6 sm:p-8">
                  {/* Interactive Demo Conversation Preview */}
                  <div className="rounded-2xl border border-gray-100 bg-[#FAF9FC] p-4 sm:p-5 space-y-4">
                    <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                      <span>Mô phỏng trải nghiệm đặt vé cùng AI</span>
                      <span>Tự động kiểm tra tồn kho</span>
                    </div>

                    {/* Sample User Message */}
                    <div className="flex justify-end">
                      <div className="max-w-md rounded-2xl rounded-tr-xs bg-gradient-to-r from-[#ef5360] to-[#f26659] px-4 py-3 text-xs sm:text-[13.5px] font-medium text-white shadow-xs">
                        &ldquo;Tìm giúp mình sự kiện âm nhạc cuối tuần này tại TP.HCM và chuẩn bị 2
                        vé Standard.&rdquo;
                      </div>
                    </div>

                    {/* Sample Assistant Reply + Ticket Preview */}
                    <div className="flex items-start gap-3">
                      <div className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-[#FFEFF0] text-[#ef5360]">
                        <Sparkles size={16} />
                      </div>
                      <div className="min-w-0 flex-1 space-y-3">
                        <div className="rounded-2xl rounded-tl-xs border border-gray-200/80 bg-white p-3.5 text-xs sm:text-[13px] leading-relaxed text-[#2B212B] shadow-2xs">
                          Mình tìm thấy <strong>Saigon Indie Music Weekend</strong> tại{" "}
                          <strong>Saigon Riverside Center</strong>. Hạng vé{" "}
                          <strong>General Admission</strong> hiện còn vé. Mình đã chuẩn bị phiếu giữ
                          2 vé bên dưới để bạn kiểm tra và xác nhận:
                        </div>

                        {/* Mini Mock Ticket Voucher */}
                        <div className="flex flex-col justify-between gap-3 rounded-xl border border-[#ffd2d6] bg-gradient-to-r from-[#fff7f8] to-white p-3.5 sm:flex-row sm:items-center">
                          <div className="flex items-center gap-3">
                            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-[#ef5360] text-white">
                              <Ticket size={18} />
                            </div>
                            <div>
                              <div className="text-xs font-bold text-[#2B212B]">
                                Saigon Indie Music Weekend · 2 vé General Admission
                              </div>
                              <div className="text-[11px] text-gray-500">
                                Tổng tạm tính: <strong className="text-[#ef5360]">700.000 ₫</strong>{" "}
                                · Giữ chỗ trong 10 phút sau khi xác nhận
                              </div>
                            </div>
                          </div>
                          <span className="inline-flex w-fit items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 border border-emerald-200">
                            <CheckCircle2 size={12} />
                            Sẵn sàng xác nhận
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Sign-In Call-To-Action Box */}
                  <div className="mt-6 flex flex-col items-center rounded-2xl border border-[#ffd6da] bg-gradient-to-b from-[#fff5f6] to-white p-6 text-center">
                    <div className="mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-[#ef5360]/10 text-[#ef5360]">
                      <Lock size={22} />
                    </div>
                    <h2 className="text-lg sm:text-xl font-bold text-[#2B212B]">
                      Đăng nhập tài khoản để bắt đầu trò chuyện
                    </h2>
                    <p className="mt-1.5 max-w-md text-xs sm:text-sm text-gray-600">
                      Phiên trò chuyện và mã xác nhận giữ vé được bảo mật riêng cho từng tài khoản
                      Customer trên TixFlow.
                    </p>

                    <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
                      <button
                        type="button"
                        disabled={!auth.ready}
                        onClick={() => void auth.login("/assistant")}
                        className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#ef5360] to-[#f46b55] px-7 py-3 text-sm font-bold text-white shadow-[0_8px_22px_rgba(239,83,96,0.34)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(239,83,96,0.42)] active:scale-95 disabled:opacity-50"
                      >
                        <Sparkles size={17} />
                        <span>Đăng nhập để trò chuyện</span>
                      </button>

                      <Link
                        href="/events"
                        className="inline-flex items-center justify-center gap-1.5 rounded-full border border-gray-200 bg-white px-5 py-3 text-xs sm:text-sm font-semibold text-gray-700 transition-colors hover:border-[#ef5360] hover:text-[#ef5360]"
                      >
                        <span>Xem danh sách sự kiện</span>
                        <ChevronRight size={15} />
                      </Link>
                    </div>
                  </div>

                  {/* Sample Prompt Chips Preview */}
                  <div className="mt-6">
                    <p className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-400">
                      Các yêu cầu phổ biến bạn có thể hỏi ngay sau khi đăng nhập
                    </p>
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                      {SUGGESTED_PROMPTS.slice(0, 4).map((item) => (
                        <button
                          key={item.label}
                          type="button"
                          disabled={!auth.ready}
                          onClick={() => void auth.login("/assistant")}
                          className="group flex items-center justify-between gap-2 rounded-xl border border-gray-200/80 bg-white px-3.5 py-2.5 text-left text-xs text-gray-700 transition-all hover:border-[#ef5360]/50 hover:bg-[#fff8f8]"
                        >
                          <span className="truncate font-medium group-hover:text-[#ef5360]">
                            &ldquo;{item.prompt}&rdquo;
                          </span>
                          <ChevronRight
                            size={14}
                            className="shrink-0 text-gray-400 group-hover:text-[#ef5360]"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : !auth.roles.includes("Customer") ? (
              /* NON-CUSTOMER ROLE NOTICE CARD */
              <div className="overflow-hidden rounded-3xl border border-amber-200 bg-white p-7 sm:p-9 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-amber-100 text-amber-700">
                    <AlertCircle size={24} />
                  </div>
                  <div className="space-y-2">
                    <span className="inline-flex items-center rounded-full bg-amber-100 px-3 py-0.5 text-xs font-bold text-amber-800">
                      Giới hạn quyền truy cập
                    </span>
                    <p role="alert" className="text-lg font-bold text-[#2B212B]">
                      Trợ lý đặt vé dành cho tài khoản Customer.
                    </p>
                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                      Tài khoản hiện tại của bạn đang đăng nhập với vai trò quản trị / nhà tổ chức.
                      Để sử dụng trợ lý giữ vé và thanh toán, vui lòng chuyển sang tài khoản khách
                      hàng (Customer) hoặc duyệt trực tiếp danh mục sự kiện.
                    </p>
                    <div className="pt-3 flex flex-wrap gap-3">
                      <Link
                        href="/events"
                        className="inline-flex items-center gap-2 rounded-full bg-[#ef5360] px-5 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-xs hover:bg-[#ec3746]"
                      >
                        <span>Khám phá Sự kiện</span>
                        <ArrowRight size={15} />
                      </Link>
                      <Link
                        href="/organizer"
                        className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-5 py-2.5 text-xs sm:text-sm font-semibold text-gray-700 hover:border-[#ef5360] hover:text-[#ef5360]"
                      >
                        <span>Về trang Organizer</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* AUTHENTICATED CUSTOMER AI CHAT WORKSPACE */
              <div className="flex flex-col overflow-hidden rounded-3xl border border-gray-200/90 bg-white shadow-[0_14px_40px_-10px_rgba(17,15,28,0.09)]">
                {/* Workspace Top Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 bg-gradient-to-r from-[#2B212B] via-[#382738] to-[#2B212B] px-5 py-3.5 text-white sm:px-6">
                  <div className="flex items-center gap-3">
                    <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-[#ef5360] to-[#f8a846] text-white shadow-sm">
                      <Bot size={19} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold">TixFlow AI Booking Concierge</span>
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-semibold text-emerald-300">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          Sẵn sàng
                        </span>
                      </div>
                      <p className="text-[11px] text-white/70">
                        Phiên bảo mật theo tài khoản · Không tự động trừ tiền
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    disabled={busy}
                    onClick={resetConversation}
                    className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 text-xs font-medium text-white transition-colors hover:bg-white/20 disabled:opacity-50"
                  >
                    <RotateCcw size={13} />
                    <span>Cuộc trò chuyện mới</span>
                  </button>
                </div>

                {/* Privacy & Safety Notice Strip */}
                <div className="flex items-center gap-2.5 border-b border-rose-100 bg-[#FFF8F8] px-5 py-2.5 text-xs text-gray-600 sm:px-6">
                  <ShieldCheck size={15} className="shrink-0 text-[#ef5360]" />
                  <p>
                    Nội dung bạn gửi và dữ liệu sự kiện liên quan được chuyển tới OpenAI để trả
                    lời. Không gửi mật khẩu hoặc thông tin thanh toán.
                  </p>
                </div>

                {/* Chat Log Stream */}
                <div
                  role="log"
                  aria-live="polite"
                  className="max-h-[540px] min-h-[380px] overflow-y-auto bg-[#FAF9FC] p-5 sm:p-6 space-y-5"
                >
                  {turns.length === 0 && (
                    <div className="space-y-5">
                      {/* Welcome Greeting Bubble */}
                      <div className="flex items-start gap-3.5">
                        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-[#ef5360] to-[#f8a846] text-white shadow-xs">
                          <Sparkles size={17} />
                        </div>
                        <div className="flex-1 rounded-2xl rounded-tl-xs border border-gray-200/80 bg-white p-5 shadow-2xs">
                          <div className="mb-1 flex items-center gap-2">
                            <span className="text-xs font-bold text-[#ef5360]">
                              TixFlow Assistant
                            </span>
                            <span className="text-[11px] text-gray-400">Trợ lý đặt vé AI</span>
                          </div>
                          <p className="text-sm leading-relaxed text-[#2B212B]">
                            Bạn muốn tham gia sự kiện nào? Hãy cho mình biết tên, địa điểm hoặc
                            ngày bạn muốn đi.
                          </p>
                        </div>
                      </div>

                      {/* Quick Starter Prompt Grid */}
                      <div className="pl-0 sm:pl-12">
                        <p className="mb-2.5 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                          Gợi ý câu hỏi nhanh — bấm để gửi ngay
                        </p>
                        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                          {SUGGESTED_PROMPTS.map((item) => (
                            <button
                              key={item.label}
                              type="button"
                              disabled={busy}
                              onClick={() => void submitMessage(item.prompt)}
                              className="group flex flex-col justify-between rounded-2xl border border-gray-200/85 bg-white p-3.5 text-left shadow-2xs transition-all duration-200 hover:-translate-y-0.5 hover:border-[#ef5360]/50 hover:shadow-md disabled:opacity-50"
                            >
                              <div className="flex items-center justify-between gap-2">
                                <span className="inline-flex items-center rounded-full bg-[#FFEFF0] px-2.5 py-0.5 text-[10px] font-bold text-[#ef5360]">
                                  {item.category}
                                </span>
                                <ArrowRight
                                  size={13}
                                  className="text-gray-300 transition-transform group-hover:translate-x-0.5 group-hover:text-[#ef5360]"
                                />
                              </div>
                              <p className="mt-2 text-xs font-semibold text-[#2B212B] group-hover:text-[#ef5360]">
                                {item.label}
                              </p>
                              <p className="mt-0.5 line-clamp-1 text-[11px] text-gray-500">
                                {item.prompt}
                              </p>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {turns.map((t, i) => (
                    <div
                      key={i}
                      className={`flex items-start gap-3 ${
                        t.isUser ? "flex-row-reverse" : "flex-row"
                      }`}
                    >
                      {/* Avatar */}
                      <div
                        className={`grid h-8 w-8 shrink-0 place-items-center rounded-xl text-white shadow-2xs ${
                          t.isUser
                            ? "bg-[#2B212B]"
                            : t.isFallback
                              ? "bg-amber-500"
                              : "bg-gradient-to-br from-[#ef5360] to-[#f8a846]"
                        }`}
                      >
                        {t.isUser ? <User size={15} /> : <Sparkles size={15} />}
                      </div>

                      {/* Message Bubble */}
                      <div
                        className={`max-w-[85%] rounded-2xl p-4 shadow-2xs ${
                          t.isUser
                            ? "rounded-tr-xs bg-gradient-to-r from-[#ef5360] to-[#f26457] text-white"
                            : t.isFallback
                              ? "rounded-tl-xs border border-amber-200 bg-amber-50/70 text-[#2B212B]"
                              : "rounded-tl-xs border border-gray-200/85 bg-white text-[#2B212B]"
                        }`}
                      >
                        <div className="mb-1.5 flex items-center justify-between gap-4">
                          <p
                            className={`text-xs font-bold ${
                              t.isUser
                                ? "text-white/95"
                                : t.isFallback
                                  ? "text-amber-800"
                                  : "text-[#ef5360]"
                            }`}
                          >
                            {t.role}
                          </p>
                          <span
                            className={`text-[10px] ${
                              t.isUser ? "text-white/75" : "text-gray-400"
                            }`}
                          >
                            {t.timestamp}
                          </span>
                        </div>

                        <p className="whitespace-pre-wrap break-words text-xs sm:text-[13.5px] leading-relaxed">
                          {t.text}
                        </p>

                        {t.toolsUsed && t.toolsUsed.length > 0 && (
                          <div className="mt-2.5 flex flex-wrap items-center gap-1.5 border-t border-gray-100 pt-2">
                            <span className="text-[10px] font-medium text-gray-400">
                              Đã tra cứu:
                            </span>
                            {t.toolsUsed.map((tool, idx) => (
                              <span
                                key={`${tool}-${idx}`}
                                className="rounded-md bg-gray-100 px-2 py-0.5 text-[10px] font-semibold text-gray-600"
                              >
                                {tool}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  {busy && (
                    <div className="flex items-center gap-3">
                      <div className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-[#ef5360] to-[#f8a846] text-white">
                        <Sparkles size={15} className="animate-spin" />
                      </div>
                      <div className="inline-flex items-center gap-2.5 rounded-2xl rounded-tl-xs border border-gray-200 bg-white px-4 py-3 shadow-2xs">
                        <span className="flex gap-1">
                          <span className="h-1.5 w-1.5 rounded-full bg-[#ef5360] animate-bounce" />
                          <span className="h-1.5 w-1.5 rounded-full bg-[#ef5360] animate-bounce [animation-delay:150ms]" />
                          <span className="h-1.5 w-1.5 rounded-full bg-[#ef5360] animate-bounce [animation-delay:300ms]" />
                        </span>
                        <p role="status" className="text-xs font-medium text-gray-600">
                          Đang xử lý…
                        </p>
                      </div>
                    </div>
                  )}

                  <div ref={chatEndRef} />
                </div>

                {/* Proposal / Hold Confirmation Boarding-Pass Cards */}
                {proposals.length > 0 && (
                  <div className="border-t border-rose-100 bg-gradient-to-b from-[#fff5f6] to-white p-5 sm:p-6 space-y-4">
                    <WaitingRoomPanel {...waitingRoom} />
                    {proposals.map((proposal) => {
                      const p = proposal.preview;
                      const expired = now >= Date.parse(p.confirmBeforeUtc);
                      const selected = activeSessionId === p.sessionId;
                      const ready = selected && ["direct", "admitted"].includes(waitingRoom.phase);
                      const canRetry = attemptedConfirmations.includes(proposal.confirmationToken);
                      const countdown = formatTimeRemaining(p.confirmBeforeUtc, now);

                      return (
                        <section
                          key={proposal.confirmationToken}
                          aria-label="Xác nhận giữ vé"
                          className="relative overflow-hidden rounded-2xl border-2 border-[#ef5360]/35 bg-white shadow-[0_10px_28px_rgba(239,83,96,0.12)]"
                        >
                          {/* Ticket Header Strip */}
                          <div className="flex flex-wrap items-center justify-between gap-2 bg-gradient-to-r from-[#ef5360] to-[#f46b55] px-5 py-3 text-white">
                            <h2 className="flex items-center gap-2 text-sm sm:text-base font-bold">
                              <Ticket size={18} />
                              <span>Kiểm tra lựa chọn</span>
                            </h2>

                            <div className="inline-flex items-center gap-1.5 rounded-full bg-black/20 px-3 py-1 text-xs font-semibold">
                              <Clock size={13} />
                              <span>
                                {expired ? "Đã hết hạn" : `Còn ${countdown} để xác nhận`}
                              </span>
                            </div>
                          </div>

                          {/* Ticket Body */}
                          <div className="p-5 space-y-4">
                            <div className="flex flex-col justify-between gap-4 border-b border-dashed border-gray-200 pb-4 sm:flex-row sm:items-center">
                              <div>
                                <p className="text-base sm:text-lg font-extrabold text-[#2B212B]">
                                  {p.eventName}
                                </p>
                                <p className="mt-1 flex items-center gap-1.5 text-xs sm:text-sm text-gray-600">
                                  <Calendar size={14} className="text-[#ef5360] shrink-0" />
                                  <span>
                                    {p.sessionName} ·{" "}
                                    {new Date(p.startsAtUtc).toLocaleString("vi-VN")}
                                  </span>
                                </p>
                              </div>

                              <div className="rounded-xl bg-[#FFF5F6] px-4 py-2.5 text-left sm:text-right border border-[#ffd6da]">
                                <span className="text-[11px] font-medium text-gray-500">
                                  Tổng thanh toán tạm tính
                                </span>
                                <p className="text-lg font-extrabold text-[#ef5360]">
                                  Tổng: {money(p.totalAmount, p.currency)}
                                </p>
                              </div>
                            </div>

                            {/* Ticket Breakdown Grid */}
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 text-xs sm:text-sm">
                              <div className="rounded-xl bg-gray-50 p-3">
                                <span className="text-[11px] font-semibold uppercase text-gray-400">
                                  Hạng vé &amp; Số lượng
                                </span>
                                <p className="mt-0.5 font-semibold text-[#2B212B]">
                                  {p.ticketName} · {p.quantity} vé ×{" "}
                                  {money(p.unitPrice, p.currency)}
                                </p>
                              </div>

                              <div className="rounded-xl bg-gray-50 p-3">
                                <span className="text-[11px] font-semibold uppercase text-gray-400">
                                  Thời gian giữ chỗ
                                </span>
                                <p className="mt-0.5 font-semibold text-[#2B212B]">
                                  Giữ trong {p.holdDurationMinutes} phút kể từ lúc xác nhận thành
                                  công.
                                </p>
                              </div>
                            </div>

                            {p.seats.length > 0 && (
                              <div className="rounded-xl border border-gray-200 bg-gray-50/70 p-3 text-xs sm:text-sm">
                                <p className="font-semibold text-[#2B212B]">
                                  Ghế: {p.seats.join(", ")}
                                </p>
                              </div>
                            )}

                            <p className="text-xs text-gray-500">
                              Xác nhận trước{" "}
                              {new Date(p.confirmBeforeUtc).toLocaleTimeString("vi-VN")}. Tồn vé có
                              thể thay đổi.
                            </p>

                            {/* Actions */}
                            <div className="flex flex-wrap items-center gap-3 pt-1">
                              <button
                                type="button"
                                disabled={busy || (selected && (expired || (!ready && !canRetry)))}
                                onClick={() => void confirm(proposal)}
                                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#ef5360] px-6 py-2.5 text-xs sm:text-sm font-bold text-white shadow-[0_6px_18px_rgba(239,83,96,0.3)] transition-all hover:bg-[#ec3746] disabled:opacity-50"
                              >
                                <CheckCircle2 size={16} />
                                <span>
                                  {!selected ? "Chọn suất diễn này" : expired
                                    ? "Bản xác nhận đã hết hạn — hãy chọn lại"
                                    : canRetry && !ready ? "Kiểm tra lại kết quả" : ready ? "Xác nhận giữ vé" : "Đang chờ lượt"}
                                </span>
                              </button>

                              {selected && expired && ready && (
                                <button type="button" disabled={busy}
                                  onClick={() => void refreshProposal(proposal)}
                                  className="rounded-full border border-[#ef5360] bg-white px-5 py-2.5 text-xs font-semibold text-[#ef5360]">
                                  Làm mới đề xuất
                                </button>
                              )}

                              <button
                                type="button"
                                disabled={busy}
                                onClick={() => setProposals([])}
                                className="rounded-full border border-gray-200 bg-white px-5 py-2.5 text-xs sm:text-sm font-semibold text-gray-600 transition-colors hover:border-gray-300 hover:bg-gray-50"
                              >
                                Bỏ lựa chọn
                              </button>
                            </div>
                          </div>
                        </section>
                      );
                    })}
                  </div>
                )}

                {/* Checkout Hold Confirmed Banner */}
                {checkout && (
                  <div className="border-t border-emerald-200 bg-emerald-50/90 px-5 py-4 sm:px-6">
                    <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                      <div className="flex items-center gap-3">
                        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-emerald-600 text-white">
                          <CheckCircle2 size={18} />
                        </div>
                        <div>
                          <p className="text-xs sm:text-sm font-bold text-emerald-950">
                            Vé của bạn đã được giữ thành công!
                          </p>
                          <p className="text-[11px] text-emerald-700">
                            Hoàn tất thanh toán trước khi hết thời gian giữ vé.
                          </p>
                        </div>
                      </div>

                      <Link
                        href={checkout}
                        className="inline-flex items-center justify-center gap-2 rounded-full bg-[#ef5360] px-6 py-2.5 text-xs sm:text-sm font-bold text-white shadow-sm transition-all hover:bg-[#ec3746]"
                      >
                        <span>Tiếp tục thanh toán</span>
                        <ArrowRight size={15} />
                      </Link>
                    </div>
                  </div>
                )}

                {/* Error Alert Banner */}
                {error && (
                  <div className="border-t border-red-200 bg-red-50 px-5 py-3 sm:px-6">
                    <div className="flex items-center gap-2.5 text-xs sm:text-sm font-medium text-red-700">
                      <AlertCircle size={16} className="shrink-0" />
                      <p role="alert">{error}</p>
                    </div>
                  </div>
                )}

                {/* Message Composer Form */}
                <form
                  onSubmit={send}
                  className="border-t border-gray-200/80 bg-white p-4 sm:p-5"
                >
                  <label className="sr-only" htmlFor="assistant-message">
                    Tin nhắn
                  </label>
                  <div className="flex items-end gap-3 rounded-2xl border border-gray-200 bg-[#FAF9FC] p-2.5 transition-all focus-within:border-[#ef5360] focus-within:bg-white focus-within:shadow-[0_0_0_3px_rgba(239,83,96,0.12)]">
                    <textarea
                      id="assistant-message"
                      required
                      maxLength={2000}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Ví dụ: Tìm sự kiện âm nhạc tại TP.HCM hoặc kiểm tra giá vé..."
                      rows={2}
                      disabled={busy}
                      className="min-w-0 flex-1 resize-none border-none bg-transparent px-2 py-1 text-xs sm:text-sm text-[#2B212B] placeholder:text-gray-400 focus:outline-none"
                    />

                    <button
                      type="submit"
                      disabled={busy || !message.trim()}
                      aria-label="Gửi tin nhắn"
                      className="inline-flex h-10 w-10 sm:h-11 sm:w-auto sm:px-5 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#ef5360] text-xs sm:text-sm font-bold text-white shadow-[0_4px_12px_rgba(239,83,96,0.28)] transition-all hover:bg-[#ec3746] disabled:opacity-45"
                    >
                      <Send size={17} />
                      <span className="hidden sm:inline">Gửi</span>
                    </button>
                  </div>

                  <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 px-1 text-[11px] text-gray-400">
                    <span>Nhấn Enter để gửi · Shift + Enter để xuống dòng</span>
                    <span>{message.length} / 2000 ký tự</span>
                  </div>
                </form>
              </div>
            )}
          </div>

          {/* RIGHT SIDEBAR COLUMN (4 cols) — Workflow, Guardrails & Quick Discovery */}
          <aside className="space-y-5 lg:col-span-4">
            {/* Card 1: 3-Step Booking Workflow */}
            <div className="rounded-3xl border border-gray-200/85 bg-white p-6 shadow-[0_4px_20px_rgba(17,15,28,0.05)]">
              <div className="mb-4 flex items-center gap-2.5">
                <span className="grid h-8 w-8 place-items-center rounded-xl bg-[#FFEFF0] text-[#ef5360]">
                  <Zap size={16} />
                </span>
                <div>
                  <h2 className="text-sm font-bold text-[#2B212B]">Quy trình đặt vé thông minh</h2>
                  <p className="text-[11px] text-gray-500">Nhanh chóng, chính xác &amp; minh bạch</p>
                </div>
              </div>

              <div className="space-y-4">
                {WORKFLOW_STEPS.map((item) => (
                  <div
                    key={item.step}
                    className="flex items-start gap-3 rounded-2xl border border-gray-100 bg-[#FAF9FC] p-3.5"
                  >
                    <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#ef5360] text-[11px] font-extrabold text-white">
                      {item.step}
                    </span>
                    <div>
                      <h3 className="text-xs font-bold text-[#2B212B]">{item.title}</h3>
                      <p className="mt-1 text-[11.5px] leading-relaxed text-gray-600">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Card 2: Security & Human-in-the-Loop Guarantee */}
            <div className="rounded-3xl border border-[#f3d5ce] bg-gradient-to-br from-[#fff5f6] via-white to-[#fff9f2] p-6 shadow-2xs">
              <div className="mb-3.5 flex items-center gap-2.5">
                <span className="grid h-8 w-8 place-items-center rounded-xl bg-emerald-100 text-emerald-700">
                  <ShieldCheck size={17} />
                </span>
                <div>
                  <h2 className="text-sm font-bold text-[#2B212B]">Bảo mật &amp; Kiểm soát</h2>
                  <p className="text-[11px] text-gray-500">Chuẩn an toàn giao dịch TixFlow</p>
                </div>
              </div>

              <ul className="space-y-2.5 text-xs text-gray-600">
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={14} className="mt-0.5 shrink-0 text-emerald-600" />
                  <span>
                    <strong>Không tự động giữ vé:</strong> AI chỉ tra cứu và lập bảng tạm tính; vé
                    chỉ được khóa khi bạn nhấn nút xác nhận.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={14} className="mt-0.5 shrink-0 text-emerald-600" />
                  <span>
                    <strong>Chống tạo đơn trùng:</strong> Mỗi đề xuất giữ vé được gắn chữ ký số
                    (Idempotency Nonce) gắn riêng với tài khoản của bạn.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={14} className="mt-0.5 shrink-0 text-emerald-600" />
                  <span>
                    <strong>Bảo vệ giá vé:</strong> Nếu giá vé thay đổi trước lúc xác nhận, hệ thống
                    sẽ cảnh báo ngay thay vì tự động trừ tiền.
                  </span>
                </li>
              </ul>
            </div>

            {/* Card 3: Quick Event Category Shortcuts */}
            <div className="rounded-3xl border border-gray-200/85 bg-white p-6 shadow-2xs">
              <div className="mb-3.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <HelpCircle size={15} className="text-[#ef5360]" />
                  <h2 className="text-sm font-bold text-[#2B212B]">Danh mục sự kiện nổi bật</h2>
                </div>
                <Link
                  href="/events"
                  className="text-xs font-semibold text-[#ef5360] hover:underline"
                >
                  Tất cả
                </Link>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: "Music & Concerts", href: "/events?category=music", icon: "♫" },
                  { label: "IT & Tech", href: "/events?category=technology", icon: "⌘" },
                  { label: "Art & Design", href: "/events?category=art", icon: "✿" },
                  { label: "Business", href: "/events?category=business", icon: "▥" },
                  { label: "Entertainment", href: "/events?category=entertainment", icon: "◎" },
                  { label: "Food & Drink", href: "/events?category=food", icon: "◒" },
                ].map((cat) => (
                  <Link
                    key={cat.label}
                    href={cat.href}
                    className="flex items-center gap-2 rounded-xl border border-gray-100 bg-[#FAF9FC] px-3 py-2 text-xs font-medium text-gray-700 transition-all hover:border-[#ef5360]/40 hover:bg-[#FFF5F6] hover:text-[#ef5360]"
                  >
                    <span className="text-[#ef5360]">{cat.icon}</span>
                    <span className="truncate">{cat.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
