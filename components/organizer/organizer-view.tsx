"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  BarChart3,
  CalendarDays,
  CheckCircle2,
  CircleDollarSign,
  Clock,
  Download,
  Info,
  LayoutDashboard,
  Plus,
  QrCode,
  RefreshCw,
  Search,
  Settings,
  Ticket,
  Users,
} from "lucide-react";
import { ApiError, useApi } from "@/lib/api";
import { ErrorState } from "@/components/states/error-state";
import { TableSkeleton } from "@/components/states/skeletons";
import { Skeleton } from "@/components/ui/skeleton";
import {
  formatVietnamDate,
  formatVietnamDateTime,
  formatVndCurrency,
  toManagedEvent,
  VIETNAM_TIME_ZONE,
  type DailySalesPointDto,
  type EventSalesSummaryDto,
  type ManagedAnalyticsDto,
  type ManagedAttendeeDto,
  type ManagedEvent,
  type ManagedEventDto,
  type ManagedOrderDto,
  type ManagedSession,
  type OrganizerProfile,
} from "@/lib/catalog";

const nav = [
  { key: "overview", title: "Overview", href: "/organizer", Icon: LayoutDashboard },
  { key: "events", title: "Events", href: "/organizer/events", Icon: CalendarDays },
  { key: "orders", title: "Orders", href: "/organizer/orders", Icon: Ticket },
  { key: "attendees", title: "Attendees", href: "/organizer/attendees", Icon: Users },
  { key: "analytics", title: "Analytics", href: "/organizer/analytics", Icon: BarChart3 },
  { key: "settings", title: "Settings", href: "/organizer/settings", Icon: Settings },
];

const RANGE_OPTIONS: { label: string; days: number }[] = [
  { label: "7 ngày", days: 7 },
  { label: "14 ngày", days: 14 },
  { label: "30 ngày", days: 30 },
  { label: "90 ngày", days: 90 },
  { label: "365 ngày", days: 365 },
];

interface CheckInFeedback {
  type: "success" | "error" | "warning";
  code?: string;
  message: string;
}

export function OrganizerView({
  section = "overview",
  eventSlug,
}: {
  section?: string;
  eventSlug?: string;
}) {
  const api = useApi();
  const [events, setEvents] = useState<ManagedEvent[]>([]);
  const [rawEvents, setRawEvents] = useState<ManagedEventDto[]>([]);
  const [orders, setOrders] = useState<ManagedOrderDto[]>([]);
  const [attendees, setAttendees] = useState<ManagedAttendeeDto[]>([]);
  const [analytics, setAnalytics] = useState<ManagedAnalyticsDto | null>(null);
  const [profile, setProfile] = useState<OrganizerProfile>();
  const [profileName, setProfileName] = useState("");
  const [profileEmail, setProfileEmail] = useState("");
  const [profileDescription, setProfileDescription] = useState("");
  const [profileSavedMessage, setProfileSavedMessage] = useState<string>();

  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);

  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [orderStatusFilter, setOrderStatusFilter] = useState("all");
  const [attendeeSearch, setAttendeeSearch] = useState("");
  const [selectedEventFilter, setSelectedEventFilter] = useState<string>(eventSlug ?? "all");
  const [rangeDays, setRangeDays] = useState<number>(14);

  // Check-in states (APP-22)
  const [pendingTicketIds, setPendingTicketIds] = useState<string[]>([]);
  const [checkInFeedback, setCheckInFeedback] = useState<CheckInFeedback | null>(null);
  const [manualSessionId, setManualSessionId] = useState<string>("");
  const [manualCodeOrQr, setManualCodeOrQr] = useState<string>("");
  const [manualReason, setManualReason] = useState<string>("Xác thực check-in tại cổng sự kiện");
  const [bypassWindow, setBypassWindow] = useState<boolean>(false);
  const [manualSubmitting, setManualSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (eventSlug) {
      setSelectedEventFilter(eventSlug);
    }
  }, [eventSlug]);

  const effectiveEventFilter = eventSlug ?? (selectedEventFilter !== "all" ? selectedEventFilter : undefined);

  const loadWorkspaceData = useCallback(
    async (signal?: AbortSignal) => {
      const eventParam = effectiveEventFilter
        ? `eventSlug=${encodeURIComponent(effectiveEventFilter)}`
        : "";
      const ordersUrl = eventParam
        ? `/api/v1/management/orders?${eventParam}`
        : "/api/v1/management/orders";
      const attendeesUrl = eventParam
        ? `/api/v1/management/attendees?${eventParam}`
        : "/api/v1/management/attendees";
      const analyticsUrl = `/api/v1/management/analytics?days=${rangeDays}${
        eventParam ? `&${eventParam}` : ""
      }`;

      const [eventData, orderData, attendeeData, analyticsData] = await Promise.all([
        api<ManagedEventDto[]>("/api/v1/management/events", signal),
        api<ManagedOrderDto[]>(ordersUrl, signal),
        api<ManagedAttendeeDto[]>(attendeesUrl, signal),
        api<ManagedAnalyticsDto>(analyticsUrl, signal),
      ]);

      setRawEvents(eventData);
      setEvents(eventData.map(toManagedEvent));
      setOrders(orderData);
      setAttendees(attendeeData);
      setAnalytics(analyticsData);

      // Default session for manual check-in
      const allSessions = eventData.flatMap((ev) =>
        ev.sessions.map((s) => ({ ...s, eventTitle: ev.name, eventSlug: ev.slug })),
      );
      if (allSessions.length > 0 && !manualSessionId) {
        const matchingEventSession = effectiveEventFilter
          ? allSessions.find(
              (s) =>
                s.eventSlug.toLowerCase() === effectiveEventFilter.toLowerCase() ||
                s.eventId.toLowerCase() === effectiveEventFilter.toLowerCase(),
            )
          : allSessions[0];
        if (matchingEventSession) {
          setManualSessionId(matchingEventSession.id);
        }
      }
    },
    [api, effectiveEventFilter, manualSessionId, rangeDays],
  );

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(undefined);

    void loadWorkspaceData(controller.signal)
      .catch((cause) => {
        if (!controller.signal.aborted) setError(messageOf(cause));
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    void api<OrganizerProfile>("/api/v1/management/organizers/me", controller.signal)
      .then((item) => {
        setProfile(item);
        setProfileName(item.name);
        setProfileEmail(item.contactEmail);
        setProfileDescription(item.description);
      })
      .catch((cause) => {
        if (!(cause instanceof ApiError && cause.status === 404) && !controller.signal.aborted) {
          setError(messageOf(cause));
        }
      });

    return () => controller.abort();
  }, [api, loadWorkspaceData, reloadKey]);

  const activeEvent = useMemo(() => {
    if (!effectiveEventFilter) return undefined;
    const norm = effectiveEventFilter.toLowerCase();
    return events.find(
      (ev) => ev.slug.toLowerCase() === norm || ev.id.toLowerCase() === norm,
    );
  }, [effectiveEventFilter, events]);

  const allSessions = useMemo(
    () =>
      rawEvents.flatMap((ev) =>
        ev.sessions.map((session) => ({
          id: session.id,
          eventId: ev.id,
          eventSlug: ev.slug,
          eventTitle: ev.name,
          sessionName: session.name,
          startsAtUtc: session.startsAtUtc,
          endsAtUtc: session.endsAtUtc,
        })),
      ),
    [rawEvents],
  );

  const performCheckIn = useCallback(
    async (params: {
      ticketId?: string;
      eventSessionId: string;
      ticketCode?: string;
      qrToken?: string;
      reason: string;
      bypassWindow: boolean;
    }) => {
      const trackingId = params.ticketId ?? params.ticketCode ?? params.qrToken ?? "manual";
      setPendingTicketIds((prev) => (prev.includes(trackingId) ? prev : [...prev, trackingId]));
      setCheckInFeedback(null);

      try {
        const idempotencyKey =
          typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
            ? crypto.randomUUID()
            : `checkin-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

        const payload: Record<string, unknown> = {
          eventSessionId: params.eventSessionId,
          reason: params.reason.trim() || "Organizer dashboard check-in",
          bypassWindow: params.bypassWindow,
        };
        if (params.qrToken) {
          payload.qrToken = params.qrToken.trim();
        } else if (params.ticketCode) {
          payload.ticketCode = params.ticketCode.trim().toUpperCase();
        }

        const result = await api<{
          data: { ticketId: string; status: string; checkedInAtUtc: string };
        }>("/api/v1/check-ins", {
          method: "POST",
          headers: {
            "Idempotency-Key": idempotencyKey,
          },
          body: JSON.stringify(payload),
        });

        const checkedInAt = result.data.checkedInAtUtc;
        const checkedTicketId = result.data.ticketId;

        setAttendees((current) =>
          current.map((item) =>
            item.ticketId === checkedTicketId
              ? { ...item, status: "Used", checkedInAtUtc: checkedInAt }
              : item,
          ),
        );

        setCheckInFeedback({
          type: "success",
          message: `Check-in thành công vé ${params.ticketCode ?? checkedTicketId} lúc ${formatVietnamDateTime(
            checkedInAt,
          )} (${VIETNAM_TIME_ZONE}). Đã lưu vào cơ sở dữ liệu.`,
        });

        await loadWorkspaceData();
      } catch (cause) {
        if (cause instanceof ApiError) {
          const code = cause.code ?? `HTTP_${cause.status}`;
          if (code === "TICKET_ALREADY_USED") {
            setCheckInFeedback({
              type: "warning",
              code,
              message:
                "Vé này đã được check-in trước đó (TICKET_ALREADY_USED). Hệ thống từ chối check-in trùng lặp.",
            });
          } else if (code === "CHECK_IN_WINDOW_CLOSED") {
            setCheckInFeedback({
              type: "error",
              code,
              message:
                "Ngoài khung giờ check-in của phiên sự kiện (CHECK_IN_WINDOW_CLOSED: chỉ mở từ 60 phút trước giờ bắt đầu đến khi kết thúc phiên). Nếu đang chạy demo/kiểm thử sớm, hãy bật tùy chọn 'Cho phép check-in ngoài khung giờ phiên' bên dưới.",
            });
          } else if (code === "TICKET_INVALID") {
            setCheckInFeedback({
              type: "error",
              code,
              message:
                "Vé không hợp lệ để check-in (TICKET_INVALID: đơn hàng chưa Paid, vé đã hủy hoặc sự kiện chưa Published).",
            });
          } else if (code === "REASON_REQUIRED") {
            setCheckInFeedback({
              type: "error",
              code,
              message: "Vui lòng nhập lý do check-in thủ công (REASON_REQUIRED).",
            });
          } else {
            setCheckInFeedback({
              type: "error",
              code,
              message: `${cause.message} (${code})`,
            });
          }
        } else {
          setCheckInFeedback({
            type: "error",
            message: messageOf(cause),
          });
        }
      } finally {
        setPendingTicketIds((prev) => prev.filter((id) => id !== trackingId));
      }
    },
    [api, loadWorkspaceData],
  );

  const ready = !loading && !error;
  const activeTitle = eventSlug
    ? activeEvent
      ? `Attendees · ${activeEvent.title}`
      : `Event attendees (${eventSlug})`
    : nav.find((item) => item.key === section)?.title ?? "Overview";

  const filteredEvents = useMemo(
    () =>
      events.filter(
        (event) =>
          event.title.toLowerCase().includes(query.toLowerCase()) &&
          (status === "all" || event.status === status),
      ),
    [events, query, status],
  );

  const filteredOrders = useMemo(
    () =>
      orders.filter((order) => {
        if (orderStatusFilter !== "all" && order.status.toLowerCase() !== orderStatusFilter.toLowerCase()) {
          return false;
        }
        if (!query.trim()) return true;
        const q = query.trim().toLowerCase();
        return (
          order.orderNumber.toLowerCase().includes(q) ||
          order.eventTitle.toLowerCase().includes(q) ||
          order.buyerName.toLowerCase().includes(q) ||
          order.buyerEmail.toLowerCase().includes(q)
        );
      }),
    [orders, orderStatusFilter, query],
  );

  const filteredAttendees = useMemo(
    () =>
      attendees.filter((item) => {
        if (!attendeeSearch.trim()) return true;
        const q = attendeeSearch.trim().toLowerCase();
        return (
          item.attendeeName.toLowerCase().includes(q) ||
          item.attendeeEmail.toLowerCase().includes(q) ||
          item.ticketCode.toLowerCase().includes(q) ||
          item.orderNumber.toLowerCase().includes(q) ||
          item.eventTitle.toLowerCase().includes(q)
        );
      }),
    [attendees, attendeeSearch],
  );

  const eventBreakdownMap = useMemo(() => {
    const map = new Map<string, EventSalesSummaryDto>();
    for (const item of analytics?.eventBreakdown ?? []) {
      map.set(item.eventId, item);
    }
    return map;
  }, [analytics]);

  const paidRevenue = analytics?.totalPaidRevenue ?? 0;
  const paidTicketsSold = analytics?.totalTicketsSold ?? 0;
  const paidOrdersCount = analytics?.totalPaidOrdersCount ?? 0;
  const checkedInCount = analytics?.totalCheckedInCount ?? 0;
  const issuedTicketsCount = analytics?.totalIssuedTicketsCount ?? 0;

  const stats = [
    {
      title: "Sự kiện quản lý",
      value: String(events.length),
      delta: `${events.filter((e) => e.status === "published").length} Published · ${
        events.filter((e) => e.status === "draft").length
      } Draft`,
      Icon: CalendarDays,
    },
    {
      title: "Vé đã bán (Paid)",
      value: paidTicketsSold.toLocaleString("vi-VN"),
      delta: `${paidOrdersCount.toLocaleString("vi-VN")} đơn Paid hợp lệ`,
      Icon: Ticket,
    },
    {
      title: "Doanh thu thực (Paid)",
      value: formatVndCurrency(paidRevenue),
      delta: `Loại trừ ${
        (analytics?.cancelledOrdersCount ?? 0) +
        (analytics?.expiredOrdersCount ?? 0) +
        (analytics?.refundedOrdersCount ?? 0)
      } đơn hủy/hết hạn`,
      Icon: CircleDollarSign,
    },
    {
      title: "Khách đã Check-in",
      value: `${checkedInCount.toLocaleString("vi-VN")} / ${issuedTicketsCount.toLocaleString("vi-VN")}`,
      delta: "Vé trạng thái Used / Tổng vé đã phát",
      Icon: Users,
    },
  ];

  return (
    <main className="page-shell bg-[#f8f9fb]">
      <div className="container grid gap-6 py-6 lg:grid-cols-[230px_1fr] lg:py-8">
        <aside className="h-fit rounded-2xl border border-slate-100 bg-white p-3">
          <Link href="/organizer" className="mb-4 flex items-center gap-3 rounded-xl p-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-slate-900 text-white">
              <BarChart3 size={19} />
            </span>
            <span>
              <span className="block text-sm font-extrabold">Organizer</span>
              <span className="mt-1 block text-[10px] text-slate-500">
                {profile?.name ?? "Workspace"}
              </span>
            </span>
          </Link>
          <Link href="/organizer/events/create" className="button-primary mb-4 w-full">
            <Plus size={15} />
            Create event
          </Link>
          <nav className="space-y-1" aria-label="Organizer navigation">
            {nav.map(({ key, title, href, Icon }) => (
              <Link
                key={key}
                href={href}
                aria-current={section === key && !eventSlug ? "page" : undefined}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold ${
                  section === key && !eventSlug
                    ? "bg-orange-50 text-[#df623b]"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <Icon size={16} />
                {title}
              </Link>
            ))}
          </nav>
        </aside>

        <section className="min-w-0">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="eyebrow">Organizer workspace · {VIETNAM_TIME_ZONE} (GMT+7)</p>
              <h1 className="mt-1 text-2xl font-extrabold tracking-tight">{activeTitle}</h1>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
              <span>
                {new Intl.DateTimeFormat("vi-VN", {
                  timeZone: VIETNAM_TIME_ZONE,
                  dateStyle: "full",
                }).format(new Date())}
              </span>
              <button
                type="button"
                onClick={() => setReloadKey((k) => k + 1)}
                className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                <RefreshCw size={13} />
                Làm mới
              </button>
            </div>
          </div>

          {!loading && !profile && section !== "settings" && (
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-amber-200 bg-amber-50/80 p-4 text-xs text-amber-900">
              <div className="flex items-center gap-2.5">
                <AlertCircle size={16} className="shrink-0 text-amber-600" />
                <span>
                  Tài khoản Organizer của bạn chưa khởi tạo hồ sơ Nhà tổ chức. Hãy tạo hồ sơ trong mục Settings trước khi tạo sự kiện mới.
                </span>
              </div>
              <Link href="/organizer/settings" className="font-bold text-[#e7653c] underline">
                Thiết lập hồ sơ →
              </Link>
            </div>
          )}

          {error && (
            <div className="mb-5">
              <ErrorState
                compact
                title="Không thể tải dữ liệu quản trị"
                message={error}
                homeHref="/organizer"
                homeLabel="Về trang tổng quan"
                onRetry={() => {
                  setError(undefined);
                  setReloadKey((key) => key + 1);
                }}
              />
            </div>
          )}

          {loading && !error && <OrganizerContentSkeleton />}

          {ready && section === "overview" && (
            <>
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {stats.map(({ title, value, delta, Icon }) => (
                  <div key={title} className="rounded-2xl border border-slate-100 bg-white p-4">
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                      <span>{title}</span>
                      <Icon size={16} className="text-[#e7653c]" />
                    </div>
                    <div className="mt-3 text-2xl font-extrabold tracking-tight">{value}</div>
                    <div className="mt-1 text-[11px] text-emerald-700">{delta}</div>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex flex-wrap items-start gap-2.5 rounded-2xl border border-slate-200/80 bg-white px-4 py-3 text-xs text-slate-600">
                <Info size={15} className="mt-0.5 shrink-0 text-[#e7653c]" />
                <div>
                  <span className="font-bold text-slate-800">Quy tắc tổng hợp dữ liệu (DB Aggregation): </span>
                  {analytics?.policyNote ??
                    "Chỉ tính đơn hàng trạng thái Paid. Các đơn PendingPayment, Cancelled, Expired, Refunded được tách riêng."}{" "}
                  Khung thời gian nhóm theo múi giờ <code className="rounded bg-slate-100 px-1.5 py-0.5 text-[11px]">{analytics?.timeZone ?? VIETNAM_TIME_ZONE}</code> (GMT+7).
                </div>
              </div>

              <div className="mt-5 grid gap-5 xl:grid-cols-[1.5fr_1fr]">
                <section className="rounded-2xl border border-slate-100 bg-white p-5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <h2 className="text-sm font-extrabold">
                        Biểu đồ bán vé & doanh thu (Paid)
                      </h2>
                      <p className="mt-1 text-[11px] text-slate-500">
                        Từ {analytics?.windowStartLocalDate} đến {analytics?.windowEndLocalDate} ({VIETNAM_TIME_ZONE}) ·{" "}
                        {analytics?.windowTicketsSold ?? 0} vé · {formatVndCurrency(analytics?.windowPaidRevenue ?? 0)}
                      </p>
                    </div>
                    <select
                      aria-label="Chọn khoảng thời gian"
                      value={rangeDays}
                      onChange={(e) => setRangeDays(Number(e.target.value))}
                      className="h-8 rounded-full border border-slate-200 bg-white px-3 text-[11px] font-semibold text-slate-700"
                    >
                      {RANGE_OPTIONS.map((opt) => (
                        <option key={opt.days} value={opt.days}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <SalesChart series={analytics?.dailySeries ?? []} />
                </section>

                <section className="rounded-2xl border border-slate-100 bg-white p-5">
                  <div className="flex items-center justify-between">
                    <h2 className="text-sm font-extrabold">Đơn hàng gần đây</h2>
                    <span className="text-[11px] text-slate-400">{orders.length} đơn</span>
                  </div>
                  <div className="mt-4 space-y-3.5">
                    {orders.slice(0, 6).map((order) => (
                      <div key={order.id} className="flex items-center justify-between gap-3 border-b border-slate-50 pb-2.5 last:border-b-0 last:pb-0">
                        <div className="min-w-0">
                          <div className="truncate text-xs font-bold text-slate-900">
                            {order.eventTitle}
                          </div>
                          <div className="mt-0.5 text-[11px] text-slate-500">
                            <span className="font-mono font-semibold">{order.orderNumber}</span> · {order.buyerName} ({order.quantity} vé)
                          </div>
                        </div>
                        <div className="shrink-0 text-right">
                          <div className="text-xs font-bold text-slate-900">
                            {formatVndCurrency(order.totalAmount, order.currency)}
                          </div>
                          <div className="mt-0.5">
                            <OrderStatusBadge status={order.status} />
                          </div>
                        </div>
                      </div>
                    ))}
                    {orders.length === 0 && (
                      <p className="py-8 text-center text-xs text-slate-400">
                        Chưa có đơn hàng nào phát sinh cho sự kiện của bạn.
                      </p>
                    )}
                  </div>
                  <Link
                    href="/organizer/orders"
                    className="mt-4 inline-block text-xs font-bold text-[#e7653c]"
                  >
                    Xem tất cả đơn hàng →
                  </Link>
                </section>
              </div>

              <section className="mt-5 rounded-2xl border border-slate-100 bg-white p-5">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h2 className="text-sm font-extrabold">Sự kiện của bạn</h2>
                    <p className="mt-1 text-[11px] text-slate-500">
                      Số vé bán và doanh thu bên dưới được tổng hợp trực tiếp từ các đơn hàng Paid trong DB
                    </p>
                  </div>
                  <Link href="/organizer/events" className="text-xs font-bold text-[#e7653c]">
                    Quản lý sự kiện →
                  </Link>
                </div>
                <EventRows
                  events={events.slice(0, 6)}
                  breakdownMap={eventBreakdownMap}
                />
              </section>
            </>
          )}

          {ready && section === "events" && (
            <section className="rounded-2xl border border-slate-100 bg-white p-5">
              <div className="mb-5 flex flex-wrap gap-3">
                <label className="header-search flex-1 !bg-white">
                  <Search size={16} className="text-slate-400" />
                  <input
                    aria-label="Search events"
                    placeholder="Tìm sự kiện theo tên..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="h-11 rounded-full border border-slate-200 bg-white px-4 text-xs"
                >
                  <option value="all">Tất cả trạng thái</option>
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="completed">Completed</option>
                </select>
                <Link href="/organizer/events/create" className="button-primary !px-4">
                  <Plus size={14} />
                  Create event
                </Link>
              </div>
              <EventRows
                events={filteredEvents}
                breakdownMap={eventBreakdownMap}
                actions
                onAction={async (action, event) => {
                  setError(undefined);
                  try {
                    if (action === "delete") {
                      if (!window.confirm(`Delete “${event.title}”?`)) return;
                      await api<void>(
                        `/api/v1/management/events/${event.id}?version=${event.version}`,
                        { method: "DELETE" },
                      );
                    } else if (action === "publish") {
                      await api<ManagedEventDto>(
                        `/api/v1/management/events/${event.id}/publish`,
                        {
                          method: "POST",
                          body: JSON.stringify({ version: event.version }),
                        },
                      );
                    } else if (action === "cancel") {
                      if (!window.confirm(`Cancel “${event.title}”?`)) return;
                      await api<ManagedEventDto>(
                        `/api/v1/management/events/${event.id}/cancellations`,
                        {
                          method: "POST",
                          body: JSON.stringify({
                            version: event.version,
                            reason: "Cancelled from organizer dashboard",
                          }),
                        },
                      );
                    } else {
                      const copy = await api<ManagedEventDto>("/api/v1/management/events", {
                        method: "POST",
                        body: JSON.stringify({
                          name: `${event.title} (Copy)`,
                          description: event.description,
                          category: event.category,
                          venueId: event.venueId,
                          saleStartsAtUtc: new Date().toISOString(),
                          saleEndsAtUtc: event.startDate,
                        }),
                      });
                      await api<ManagedSession>(
                        `/api/v1/management/events/${copy.id}/sessions`,
                        {
                          method: "POST",
                          body: JSON.stringify({
                            name: "Main session",
                            startsAtUtc: event.startDate,
                            endsAtUtc: event.endDate,
                          }),
                        },
                      );
                    }
                    await loadWorkspaceData();
                  } catch (cause) {
                    setError(messageOf(cause));
                  }
                }}
              />
            </section>
          )}

          {ready && section === "orders" && (
            <section className="rounded-2xl border border-slate-100 bg-white p-5">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-1 flex-wrap items-center gap-3">
                  <label className="header-search min-w-[220px] flex-1 !bg-white">
                    <Search size={16} className="text-slate-400" />
                    <input
                      aria-label="Tìm kiếm đơn hàng"
                      placeholder="Tìm mã đơn, tên khách, email, sự kiện..."
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                    />
                  </label>
                  <select
                    aria-label="Lọc theo sự kiện"
                    value={selectedEventFilter}
                    onChange={(e) => setSelectedEventFilter(e.target.value)}
                    className="h-10 rounded-full border border-slate-200 bg-white px-4 text-xs"
                  >
                    <option value="all">Tất cả sự kiện ({events.length})</option>
                    {events.map((ev) => (
                      <option key={ev.id} value={ev.slug}>
                        {ev.title}
                      </option>
                    ))}
                  </select>
                  <select
                    aria-label="Lọc trạng thái đơn hàng"
                    value={orderStatusFilter}
                    onChange={(e) => setOrderStatusFilter(e.target.value)}
                    className="h-10 rounded-full border border-slate-200 bg-white px-4 text-xs"
                  >
                    <option value="all">Mọi trạng thái ({orders.length})</option>
                    <option value="Paid">Paid (Đã thanh toán)</option>
                    <option value="PendingPayment">PendingPayment (Chờ thanh toán)</option>
                    <option value="Expired">Expired (Hết hạn)</option>
                    <option value="Cancelled">Cancelled (Đã hủy)</option>
                    <option value="Refunded">Refunded (Hoàn tiền)</option>
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[780px] text-left text-xs">
                  <thead className="text-[10px] uppercase tracking-wider text-slate-400">
                    <tr>
                      {[
                        "Mã đơn",
                        "Sự kiện / Phiên",
                        "Khách hàng",
                        "Ngày tạo (GMT+7)",
                        "Số lượng / Loại vé",
                        "Tổng tiền",
                        "Trạng thái",
                      ].map((cell) => (
                        <th key={cell} className="pb-3 pr-3">
                          {cell}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((order) => (
                      <tr key={order.id} className="border-t border-slate-100">
                        <td className="py-3.5 pr-3 font-mono font-bold text-slate-900">
                          {order.orderNumber}
                        </td>
                        <td className="py-3.5 pr-3">
                          <Link
                            href={`/organizer/events/${order.eventSlug}/attendees`}
                            className="font-bold text-slate-900 hover:text-[#e7653c]"
                          >
                            {order.eventTitle}
                          </Link>
                          <div className="mt-0.5 text-[11px] text-slate-400">
                            {order.sessionName} · {formatVietnamDate(order.sessionStartsAtUtc)}
                          </div>
                        </td>
                        <td className="py-3.5 pr-3">
                          <div className="font-semibold text-slate-800">{order.buyerName}</div>
                          <div className="text-[11px] text-slate-500">{order.buyerEmail}</div>
                        </td>
                        <td className="py-3.5 pr-3 text-slate-500">
                          {formatVietnamDateTime(order.createdAtUtc)}
                        </td>
                        <td className="py-3.5 pr-3">
                          <span className="font-bold">{order.quantity} vé</span>
                          <div className="text-[11px] text-slate-500">{order.ticketSummary}</div>
                        </td>
                        <td className="py-3.5 pr-3 font-bold text-slate-900">
                          {formatVndCurrency(order.totalAmount, order.currency)}
                        </td>
                        <td className="py-3.5">
                          <OrderStatusBadge status={order.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredOrders.length === 0 && (
                  <p className="py-10 text-center text-sm text-slate-500">
                    Không có đơn hàng nào khớp bộ lọc hiện tại.
                  </p>
                )}
              </div>
            </section>
          )}

          {ready && section === "attendees" && (
            <div className="space-y-5">
              {eventSlug && (
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4">
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-wider text-[#e7653c]">
                      Danh sách người tham dự theo sự kiện
                    </div>
                    <div className="mt-1 text-base font-extrabold text-slate-900">
                      {activeEvent ? activeEvent.title : eventSlug}
                    </div>
                    {activeEvent && (
                      <div className="mt-0.5 text-xs text-slate-500">
                        {activeEvent.venue.name} ({activeEvent.venue.city}) · Khởi chiếu:{" "}
                        {formatVietnamDateTime(activeEvent.startDate)} ({VIETNAM_TIME_ZONE})
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Link
                      href="/organizer/attendees"
                      className="rounded-full border border-slate-200 px-3.5 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50"
                    >
                      Xem tất cả sự kiện
                    </Link>
                    {activeEvent && (
                      <Link
                        href={`/events/${activeEvent.slug}`}
                        className="rounded-full bg-slate-900 px-3.5 py-1.5 text-xs font-bold text-white"
                      >
                        Trang công khai →
                      </Link>
                    )}
                  </div>
                </div>
              )}

              {/* Manual / Scanner Check-in Form (APP-22) */}
              <section className="rounded-2xl border border-slate-100 bg-white p-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="grid h-9 w-9 place-items-center rounded-xl bg-orange-50 text-[#e7653c]">
                      <QrCode size={18} />
                    </span>
                    <div>
                      <h2 className="text-sm font-extrabold text-slate-900">
                        Trạm Check-in Vé & QR (Thời gian thực qua API)
                      </h2>
                      <p className="text-[11px] text-slate-500">
                        Gửi trực tiếp tới <code className="rounded bg-slate-100 px-1 py-0.5">POST /api/v1/check-ins</code> kèm{" "}
                        <code className="rounded bg-slate-100 px-1 py-0.5">Idempotency-Key</code> và lưu Audit Log.
                      </p>
                    </div>
                  </div>
                </div>

                <form
                  className="mt-4 grid gap-3 md:grid-cols-[1.2fr_1.2fr_1fr_auto]"
                  onSubmit={async (e) => {
                    e.preventDefault();
                    if (!manualSessionId) {
                      setCheckInFeedback({
                        type: "error",
                        message: "Vui lòng chọn phiên sự kiện (Session) cần check-in.",
                      });
                      return;
                    }
                    const rawInput = manualCodeOrQr.trim();
                    if (!rawInput) {
                      setCheckInFeedback({
                        type: "error",
                        message: "Vui lòng nhập Mã vé (Ticket Code) hoặc chuỗi QR Token (tf1_...).",
                      });
                      return;
                    }
                    setManualSubmitting(true);
                    try {
                      const isQrToken = rawInput.startsWith("tf1_");
                      await performCheckIn({
                        eventSessionId: manualSessionId,
                        qrToken: isQrToken ? rawInput : undefined,
                        ticketCode: isQrToken ? undefined : rawInput,
                        reason: manualReason,
                        bypassWindow,
                      });
                      setManualCodeOrQr("");
                    } finally {
                      setManualSubmitting(false);
                    }
                  }}
                >
                  <label className="text-xs font-semibold text-slate-700">
                    Phiên sự kiện (Session)
                    <select
                      value={manualSessionId}
                      onChange={(e) => setManualSessionId(e.target.value)}
                      className="mt-1.5 h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs font-normal"
                    >
                      <option value="">-- Chọn phiên sự kiện --</option>
                      {allSessions.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.eventTitle} — {s.sessionName} ({formatVietnamDateTime(s.startsAtUtc)})
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="text-xs font-semibold text-slate-700">
                    Mã vé (Ticket Code) hoặc QR Token
                    <input
                      value={manualCodeOrQr}
                      onChange={(e) => setManualCodeOrQr(e.target.value)}
                      placeholder="VD: TF-... hoặc tf1_..."
                      className="mt-1.5 h-10 w-full rounded-xl border border-slate-200 px-3 font-mono text-xs font-normal"
                    />
                  </label>

                  <label className="text-xs font-semibold text-slate-700">
                    Ghi chú / Lý do xác thực
                    <input
                      value={manualReason}
                      onChange={(e) => setManualReason(e.target.value)}
                      placeholder="Lý do check-in..."
                      className="mt-1.5 h-10 w-full rounded-xl border border-slate-200 px-3 text-xs font-normal"
                    />
                  </label>

                  <div className="flex items-end">
                    <button
                      type="submit"
                      disabled={manualSubmitting}
                      className="button-primary !h-10 !px-5 !text-xs disabled:opacity-60"
                    >
                      {manualSubmitting ? "Đang xác thực..." : "Check-in ngay"}
                    </button>
                  </div>
                </form>

                <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3 text-xs text-slate-600">
                  <label className="inline-flex cursor-pointer items-center gap-2">
                    <input
                      type="checkbox"
                      checked={bypassWindow}
                      onChange={(e) => setBypassWindow(e.target.checked)}
                      className="h-4 w-4 rounded border-slate-300 accent-[#e7653c]"
                    />
                    <span>
                      Cho phép check-in thủ công ngoài khung giờ phiên (<code className="text-[11px]">-60 phút → kết thúc</code>) để phục vụ demo / hỗ trợ khách sớm
                    </span>
                  </label>
                </div>

                {checkInFeedback && (
                  <div
                    role="status"
                    className={`mt-3 flex items-start gap-2.5 rounded-xl border p-3 text-xs ${
                      checkInFeedback.type === "success"
                        ? "border-emerald-200 bg-emerald-50 text-emerald-900"
                        : checkInFeedback.type === "warning"
                          ? "border-amber-200 bg-amber-50 text-amber-900"
                          : "border-rose-200 bg-rose-50 text-rose-900"
                    }`}
                  >
                    {checkInFeedback.type === "success" ? (
                      <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-emerald-600" />
                    ) : (
                      <AlertCircle size={16} className="mt-0.5 shrink-0 text-current" />
                    )}
                    <div className="flex-1">
                      {checkInFeedback.code && (
                        <span className="mr-2 rounded bg-white/80 px-1.5 py-0.5 font-mono text-[10px] font-bold">
                          {checkInFeedback.code}
                        </span>
                      )}
                      <span>{checkInFeedback.message}</span>
                    </div>
                  </div>
                )}
              </section>

              {/* Attendees Table */}
              <section className="rounded-2xl border border-slate-100 bg-white p-5">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-1 flex-wrap items-center gap-3">
                    <label className="header-search min-w-[220px] flex-1 !bg-white">
                      <Search size={16} className="text-slate-400" />
                      <input
                        aria-label="Tìm người tham dự"
                        placeholder="Tìm theo tên, email, mã vé, mã đơn..."
                        value={attendeeSearch}
                        onChange={(e) => setAttendeeSearch(e.target.value)}
                      />
                    </label>
                    {!eventSlug && (
                      <select
                        aria-label="Lọc người tham dự theo sự kiện"
                        value={selectedEventFilter}
                        onChange={(e) => setSelectedEventFilter(e.target.value)}
                        className="h-10 rounded-full border border-slate-200 bg-white px-4 text-xs"
                      >
                        <option value="all">Tất cả sự kiện ({events.length})</option>
                        {events.map((ev) => (
                          <option key={ev.id} value={ev.slug}>
                            {ev.title}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => downloadAttendees(filteredAttendees)}
                    className="button-outline !min-h-9 !px-3"
                  >
                    <Download size={14} />
                    Export CSV ({filteredAttendees.length})
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full min-w-[820px] text-left text-xs">
                    <thead className="text-[10px] uppercase tracking-wider text-slate-400">
                      <tr>
                        {[
                          "Người tham dự",
                          "Sự kiện / Phiên",
                          "Mã vé / Loại vé",
                          "Mã đơn",
                          "Trạng thái vé",
                          "Check-in (DB)",
                        ].map((cell) => (
                          <th key={cell} className="pb-3 pr-3">
                            {cell}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredAttendees.map((attendee) => {
                        const isPending = pendingTicketIds.includes(attendee.ticketId);
                        const isUsed = attendee.status === "Used" || Boolean(attendee.checkedInAtUtc);
                        const canCheckIn =
                          attendee.status === "Issued" && attendee.orderStatus === "Paid";

                        return (
                          <tr key={attendee.ticketId} className="border-t border-slate-100">
                            <td className="py-3.5 pr-3">
                              <div className="font-bold text-slate-900">{attendee.attendeeName}</div>
                              <div className="text-[11px] text-slate-500">
                                {attendee.attendeeEmail}
                                {attendee.attendeePhone ? ` · ${attendee.attendeePhone}` : ""}
                              </div>
                            </td>
                            <td className="py-3.5 pr-3">
                              <div className="font-semibold text-slate-800">{attendee.eventTitle}</div>
                              <div className="text-[11px] text-slate-400">
                                {attendee.sessionName} · {formatVietnamDateTime(attendee.sessionStartsAtUtc)}
                              </div>
                            </td>
                            <td className="py-3.5 pr-3">
                              <span className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[11px] font-bold text-slate-900">
                                {attendee.ticketCode}
                              </span>
                              <div className="mt-1 text-[11px] text-slate-500">
                                {attendee.ticketTypeName}
                                {attendee.seatLabel ? ` · Ghế ${attendee.seatLabel}` : ""} ·{" "}
                                {formatVndCurrency(attendee.unitPrice, attendee.currency)}
                              </div>
                            </td>
                            <td className="py-3.5 pr-3">
                              <div className="font-mono font-semibold text-slate-800">
                                {attendee.orderNumber}
                              </div>
                              <div className="mt-0.5">
                                <OrderStatusBadge status={attendee.orderStatus} />
                              </div>
                            </td>
                            <td className="py-3.5 pr-3">
                              <TicketStatusBadge status={attendee.status} />
                            </td>
                            <td className="py-3.5">
                              {isUsed ? (
                                <div className="flex flex-col items-start gap-1">
                                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700">
                                    <CheckCircle2 size={12} />
                                    Đã check-in
                                  </span>
                                  {attendee.checkedInAtUtc && (
                                    <span className="text-[10px] text-slate-400">
                                      {formatVietnamDateTime(attendee.checkedInAtUtc)}
                                    </span>
                                  )}
                                  <button
                                    type="button"
                                    disabled={isPending}
                                    onClick={() =>
                                      void performCheckIn({
                                        ticketId: attendee.ticketId,
                                        eventSessionId: attendee.eventSessionId,
                                        ticketCode: attendee.ticketCode,
                                        reason: manualReason || "Kiểm tra chống quét lặp",
                                        bypassWindow,
                                      })
                                    }
                                    className="text-[10px] font-semibold text-slate-400 underline hover:text-slate-600 disabled:opacity-50"
                                  >
                                    {isPending ? "Đang gửi..." : "Kiểm thử quét lặp"}
                                  </button>
                                </div>
                              ) : canCheckIn ? (
                                <button
                                  type="button"
                                  disabled={isPending}
                                  onClick={() =>
                                    void performCheckIn({
                                      ticketId: attendee.ticketId,
                                      eventSessionId: attendee.eventSessionId,
                                      ticketCode: attendee.ticketCode,
                                      reason: manualReason || "Organizer dashboard check-in",
                                      bypassWindow,
                                    })
                                  }
                                  className="rounded-full bg-[#e7653c] px-3 py-1.5 text-[11px] font-bold text-white shadow-sm transition hover:bg-[#d5562e] disabled:opacity-50"
                                >
                                  {isPending ? "Đang xử lý..." : "Check in"}
                                </button>
                              ) : (
                                <span className="text-[11px] text-slate-400">Không khả dụng</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  {filteredAttendees.length === 0 && (
                    <p className="py-10 text-center text-sm text-slate-500">
                      Chưa có vé/người tham dự nào được phát hành cho bộ lọc này.
                    </p>
                  )}
                </div>
              </section>
            </div>
          )}

          {ready && section === "analytics" && (
            <>
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap gap-2">
                  {RANGE_OPTIONS.map((item) => (
                    <button
                      key={item.days}
                      type="button"
                      onClick={() => setRangeDays(item.days)}
                      className={`rounded-full px-4 py-2 text-xs font-bold ${
                        rangeDays === item.days
                          ? "bg-slate-900 text-white"
                          : "border border-slate-200 bg-white text-slate-600"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
                <select
                  aria-label="Lọc báo cáo theo sự kiện"
                  value={selectedEventFilter}
                  onChange={(e) => setSelectedEventFilter(e.target.value)}
                  className="h-10 rounded-full border border-slate-200 bg-white px-4 text-xs font-semibold"
                >
                  <option value="all">Tất cả sự kiện của bạn ({events.length})</option>
                  {events.map((ev) => (
                    <option key={ev.id} value={ev.slug}>
                      {ev.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-5 rounded-2xl border border-slate-200 bg-white p-4 text-xs text-slate-600">
                <div className="font-bold text-slate-900">
                  Định nghĩa chỉ số báo cáo (APP-23 · Nguồn PostgreSQL):
                </div>
                <ul className="mt-1.5 list-disc space-y-1 pl-4">
                  <li>
                    <strong>Doanh thu & Vé đã bán:</strong> Chỉ tính trên các đơn hàng có trạng thái{" "}
                    <code className="rounded bg-emerald-50 px-1.5 py-0.5 font-bold text-emerald-700">Paid</code>.
                  </li>
                  <li>
                    <strong>Múi giờ (Timezone):</strong> Toàn bộ biểu đồ theo ngày sử dụng múi giờ{" "}
                    <code className="rounded bg-slate-100 px-1.5 py-0.5 font-bold">
                      {analytics?.timeZone ?? VIETNAM_TIME_ZONE}
                    </code>{" "}
                    (GMT+7, từ {analytics?.windowStartLocalDate} đến {analytics?.windowEndLocalDate}).
                  </li>
                  <li>
                    <strong>Xử lý đơn hủy / hết hạn / chờ thanh toán:</strong> Đơn{" "}
                    <code className="rounded bg-rose-50 px-1 py-0.5 text-rose-700">
                      Cancelled ({analytics?.cancelledOrdersCount ?? 0})
                    </code>
                    ,{" "}
                    <code className="rounded bg-slate-100 px-1 py-0.5 text-slate-700">
                      Expired ({analytics?.expiredOrdersCount ?? 0})
                    </code>
                    ,{" "}
                    <code className="rounded bg-amber-50 px-1 py-0.5 text-amber-700">
                      Refunded ({analytics?.refundedOrdersCount ?? 0})
                    </code>{" "}
                    (tổng giá trị loại trừ:{" "}
                    <strong>{formatVndCurrency(analytics?.excludedOrdersAmount ?? 0)}</strong>) và{" "}
                    <code className="rounded bg-blue-50 px-1 py-0.5 text-blue-700">
                      PendingPayment ({analytics?.pendingOrdersCount ?? 0})
                    </code>{" "}
                    không được cộng vào doanh thu thực nhận.
                  </li>
                </ul>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {[
                  {
                    label: "Tổng vé đã bán (Paid)",
                    value: paidTicketsSold.toLocaleString("vi-VN"),
                    sub: `Trong ${rangeDays} ngày qua: ${(
                      analytics?.windowTicketsSold ?? 0
                    ).toLocaleString("vi-VN")} vé`,
                  },
                  {
                    label: "Tổng doanh thu (Paid)",
                    value: formatVndCurrency(paidRevenue),
                    sub: `Trong ${rangeDays} ngày qua: ${formatVndCurrency(
                      analytics?.windowPaidRevenue ?? 0,
                    )}`,
                  },
                  {
                    label: "Đơn hàng thành công (Paid)",
                    value: paidOrdersCount.toLocaleString("vi-VN"),
                    sub: `Đơn hủy/hết hạn đã loại trừ: ${
                      (analytics?.cancelledOrdersCount ?? 0) +
                      (analytics?.expiredOrdersCount ?? 0) +
                      (analytics?.refundedOrdersCount ?? 0)
                    }`,
                  },
                  {
                    label: "Khách đã Check-in / Phát vé",
                    value: `${checkedInCount.toLocaleString("vi-VN")} / ${issuedTicketsCount.toLocaleString("vi-VN")}`,
                    sub: "Tổng hợp từ bảng tickets (Used / Issued)",
                  },
                ].map(({ label, value, sub }) => (
                  <div key={label} className="rounded-2xl border border-slate-100 bg-white p-4">
                    <span className="text-xs font-semibold text-slate-500">{label}</span>
                    <div className="mt-2 text-2xl font-extrabold text-slate-900">{value}</div>
                    <div className="mt-1 text-[11px] text-slate-500">{sub}</div>
                  </div>
                ))}
              </div>

              <div className="mt-5 rounded-2xl border border-slate-100 bg-white p-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h2 className="text-sm font-extrabold">
                      Doanh thu & Số vé bán theo ngày ({analytics?.windowStartLocalDate} →{" "}
                      {analytics?.windowEndLocalDate})
                    </h2>
                    <p className="mt-0.5 text-[11px] text-slate-500">
                      Múi giờ {analytics?.timeZone ?? VIETNAM_TIME_ZONE} · Chỉ tính đơn hàng Paid
                    </p>
                  </div>
                </div>
                <SalesChart series={analytics?.dailySeries ?? []} />
              </div>

              <div className="mt-5 rounded-2xl border border-slate-100 bg-white p-5">
                <h2 className="mb-4 text-sm font-extrabold">
                  Chi tiết doanh thu & vé theo từng sự kiện
                </h2>
                <EventRows events={events} breakdownMap={eventBreakdownMap} />
              </div>
            </>
          )}

          {ready && section === "settings" && (
            <section className="rounded-2xl border border-slate-100 bg-white p-5">
              <h2 className="text-sm font-extrabold">Hồ sơ Nhà tổ chức (Organizer Profile)</h2>
              <p className="mt-1 text-xs text-slate-500">
                Thông tin này được hiển thị trên trang chi tiết sự kiện và danh sách đối tác.
              </p>
              {profileSavedMessage && (
                <p className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-xs font-semibold text-emerald-800">
                  {profileSavedMessage}
                </p>
              )}
              <div className="mt-5 grid max-w-xl gap-4 sm:grid-cols-2">
                <label className="text-xs font-bold">
                  Tên đơn vị tổ chức
                  <input
                    value={profileName}
                    onChange={(event) => setProfileName(event.target.value)}
                    className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm font-normal"
                  />
                </label>
                <label className="text-xs font-bold">
                  Email liên hệ
                  <input
                    type="email"
                    value={profileEmail}
                    onChange={(event) => setProfileEmail(event.target.value)}
                    className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm font-normal"
                  />
                </label>
                <label className="text-xs font-bold sm:col-span-2">
                  Giới thiệu
                  <input
                    value={profileDescription}
                    onChange={(event) => setProfileDescription(event.target.value)}
                    className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm font-normal"
                  />
                </label>
              </div>
              <button
                type="button"
                className="button-primary mt-5"
                onClick={async () => {
                  setError(undefined);
                  setProfileSavedMessage(undefined);
                  try {
                    const saved = await api<OrganizerProfile>("/api/v1/management/organizers/me", {
                      method: profile ? "PUT" : "POST",
                      body: JSON.stringify({
                        name: profileName,
                        description: profileDescription,
                        contactEmail: profileEmail,
                      }),
                    });
                    setProfile(saved);
                    setProfileSavedMessage("Đã lưu hồ sơ Nhà tổ chức thành công.");
                  } catch (cause) {
                    setError(messageOf(cause));
                  }
                }}
              >
                Lưu hồ sơ
              </button>
            </section>
          )}
        </section>
      </div>
    </main>
  );
}

function OrderStatusBadge({ status }: { status: string }) {
  const normalized = status.toLowerCase();
  if (normalized === "paid") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700">
        Paid
      </span>
    );
  }
  if (normalized === "pendingpayment") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-[10px] font-bold text-amber-700">
        <Clock size={11} />
        Pending
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-0.5 text-[10px] font-bold text-rose-700">
      {status}
    </span>
  );
}

function TicketStatusBadge({ status }: { status: string }) {
  const normalized = status.toLowerCase();
  if (normalized === "used") {
    return (
      <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700">
        Used
      </span>
    );
  }
  if (normalized === "issued") {
    return (
      <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-[10px] font-bold text-blue-700">
        Issued
      </span>
    );
  }
  return (
    <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold text-slate-600">
      {status}
    </span>
  );
}

function OrganizerContentSkeleton() {
  return (
    <div role="status" aria-busy="true" className="space-y-5">
      <span className="sr-only">Loading organizer data</span>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <div
            key={index}
            className="space-y-3 rounded-2xl border border-slate-100 bg-white p-4"
          >
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-7 w-28" />
            <Skeleton className="h-3 w-32" />
          </div>
        ))}
      </div>
      <div className="rounded-2xl border border-slate-100 bg-white p-5">
        <TableSkeleton rows={5} columns={5} />
      </div>
    </div>
  );
}

function SalesChart({ series }: { series: DailySalesPointDto[] }) {
  const points = series.slice(-30);
  const maxRevenue = Math.max(...points.map((p) => p.paidRevenue), 0);
  const maxTickets = Math.max(...points.map((p) => p.ticketsSold), 0);

  if (points.length === 0) {
    return (
      <div className="mt-6 flex h-44 items-center justify-center rounded-xl border border-dashed border-slate-200 text-xs text-slate-400">
        Không có dữ liệu chuỗi thời gian trong khoảng đã chọn.
      </div>
    );
  }

  return (
    <div className="mt-6">
      <div className="flex h-44 items-end gap-1.5 border-b border-l border-slate-100 px-2 pt-4">
        {points.map((point) => {
          const ratio =
            maxRevenue > 0
              ? (point.paidRevenue / maxRevenue) * 100
              : maxTickets > 0
                ? (point.ticketsSold / maxTickets) * 100
                : 0;
          const barHeight = point.ticketsSold > 0 || point.paidRevenue > 0 ? Math.max(12, ratio) : 4;
          return (
            <div
              key={point.date}
              title={`${point.date}: ${point.ticketsSold} vé Paid · ${formatVndCurrency(
                point.paidRevenue,
              )} (${point.paidOrdersCount} đơn Paid, ${point.cancelledOrdersCount} đơn hủy/hết hạn)`}
              className="group relative flex h-full flex-1 flex-col items-center justify-end"
            >
              <div
                className={`w-full rounded-t-md transition-colors ${
                  point.ticketsSold > 0 || point.paidRevenue > 0
                    ? "bg-[#f36b3f] group-hover:bg-[#d95327]"
                    : "bg-slate-100 group-hover:bg-slate-200"
                }`}
                style={{ height: `${barHeight}%` }}
              />
            </div>
          );
        })}
      </div>
      <div className="mt-2 flex justify-between px-2 text-[10px] text-slate-400">
        <span>{points[0]?.label}</span>
        {points.length > 2 && <span>{points[Math.floor(points.length / 2)]?.label}</span>}
        <span>{points[points.length - 1]?.label}</span>
      </div>
    </div>
  );
}

function EventRows({
  events,
  breakdownMap,
  actions = false,
  onAction,
}: {
  events: ManagedEvent[];
  breakdownMap: Map<string, EventSalesSummaryDto>;
  actions?: boolean;
  onAction?: (
    action: "publish" | "cancel" | "duplicate" | "delete",
    event: ManagedEvent,
  ) => void;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[720px] text-left text-xs">
        <thead className="text-[10px] uppercase tracking-wider text-slate-400">
          <tr>
            {[
              "Sự kiện",
              "Trạng thái",
              "Ngày diễn ra (GMT+7)",
              "Vé đã bán (Paid / Sức chứa)",
              "Doanh thu (Paid)",
              "Người tham dự",
              ...(actions ? ["Thao tác"] : []),
            ].map((head) => (
              <th key={head} className="pb-3 pr-3">
                {head}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {events.map((event) => {
            const summary = breakdownMap.get(event.id);
            const paidTickets = summary?.ticketsSold ?? 0;
            const capacity =
              summary?.capacity ??
              event.ticketTypes.reduce((sum, t) => sum + (t.quantity || 0), 0);
            const paidRevenue = summary?.paidRevenue ?? 0;
            const checkedIn = summary?.checkedInCount ?? 0;
            const issued = summary?.issuedTicketsCount ?? 0;

            return (
              <tr key={event.id} className="border-t border-slate-100">
                <td className="py-3.5 pr-3">
                  <Link
                    href={`/events/${event.slug}`}
                    className="font-bold text-slate-900 hover:text-[#e7653c]"
                  >
                    {event.title}
                  </Link>
                  <div className="mt-0.5 text-[10px] text-slate-400">{event.venue.city}</div>
                </td>
                <td className="py-3.5 pr-3">
                  <span
                    className={`rounded-full px-2.5 py-1 text-[10px] font-bold capitalize ${
                      event.status === "published"
                        ? "bg-emerald-50 text-emerald-700"
                        : event.status === "draft"
                          ? "bg-amber-50 text-amber-700"
                          : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {event.status.replace("_", " ")}
                  </span>
                </td>
                <td className="py-3.5 pr-3 text-slate-500">
                  {formatVietnamDateTime(event.startDate)}
                </td>
                <td className="py-3.5 pr-3">
                  <span className="font-bold text-slate-900">
                    {paidTickets.toLocaleString("vi-VN")}
                  </span>{" "}
                  <span className="text-slate-400">
                    / {capacity.toLocaleString("vi-VN")}
                  </span>
                </td>
                <td className="py-3.5 pr-3 font-bold text-slate-900">
                  {formatVndCurrency(paidRevenue)}
                </td>
                <td className="py-3.5 pr-3">
                  <Link
                    href={`/organizer/events/${event.slug}/attendees`}
                    className="inline-flex items-center gap-1 font-semibold text-[#e7653c] hover:underline"
                  >
                    Check-in ({checkedIn}/{issued}) →
                  </Link>
                </td>
                {actions && (
                  <td className="py-3.5">
                    <div className="flex flex-wrap gap-x-3 gap-y-1">
                      <Link href={`/events/${event.slug}`} className="text-slate-500 hover:text-slate-900">
                        View
                      </Link>
                      {event.status === "draft" && (
                        <Link
                          href={`/organizer/events/${event.id}/edit`}
                          className="font-bold text-[#e7653c]"
                        >
                          Edit
                        </Link>
                      )}
                      <button
                        type="button"
                        onClick={() => onAction?.("duplicate", event)}
                        className="text-slate-500 hover:text-slate-900"
                      >
                        Duplicate
                      </button>
                      {event.status === "draft" && (
                        <button
                          type="button"
                          onClick={() => onAction?.("publish", event)}
                          className="font-bold text-emerald-700 hover:underline"
                        >
                          Publish
                        </button>
                      )}
                      {event.status === "published" && (
                        <button
                          type="button"
                          onClick={() => onAction?.("cancel", event)}
                          className="text-amber-700 hover:underline"
                        >
                          Cancel
                        </button>
                      )}
                      {event.status === "draft" && (
                        <button
                          type="button"
                          onClick={() => onAction?.("delete", event)}
                          className="text-rose-600 hover:underline"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
      {events.length === 0 && (
        <p className="py-10 text-center text-sm text-slate-500">
          Không có sự kiện nào khớp bộ lọc.
        </p>
      )}
    </div>
  );
}

function downloadAttendees(attendees: ManagedAttendeeDto[]) {
  const rows = [
    [
      "TicketCode",
      "AttendeeName",
      "AttendeeEmail",
      "AttendeePhone",
      "EventTitle",
      "SessionName",
      "TicketType",
      "SeatLabel",
      "OrderNumber",
      "OrderStatus",
      "TicketStatus",
      "CheckedInAtUtc",
    ],
    ...attendees.map((item) => [
      item.ticketCode,
      item.attendeeName,
      item.attendeeEmail,
      item.attendeePhone ?? "",
      item.eventTitle,
      item.sessionName,
      item.ticketTypeName,
      item.seatLabel ?? "",
      item.orderNumber,
      item.orderStatus,
      item.status,
      item.checkedInAtUtc ? formatVietnamDateTime(item.checkedInAtUtc) : "",
    ]),
  ];
  const blob = new Blob(
    [
      rows
        .map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(","))
        .join("\n"),
    ],
    { type: "text/csv;charset=utf-8" },
  );
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "tixflow-attendees.csv";
  link.click();
  URL.revokeObjectURL(link.href);
}

function messageOf(cause: unknown) {
  return cause instanceof Error ? cause.message : "Unable to complete the request.";
}
