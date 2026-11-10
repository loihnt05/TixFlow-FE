"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  BarChart3,
  Building2,
  CalendarDays,
  CheckCircle2,
  CircleDollarSign,
  Edit3,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  Ticket,
  Trash2,
  Users,
} from "lucide-react";
import { ProtectedRoute } from "@/components/protected-route";
import { ErrorState } from "@/components/states/error-state";
import { TableSkeleton } from "@/components/states/skeletons";
import { ApiError, useApi } from "@/lib/api";
import {
  formatVietnamDateTime,
  formatVndCurrency,
  toManagedEvent,
  VIETNAM_TIME_ZONE,
  type EventSalesSummaryDto,
  type ManagedAnalyticsDto,
  type ManagedAttendeeDto,
  type ManagedEvent,
  type ManagedEventDto,
  type ManagedOrderDto,
  type ManagedUserDto,
  type OrganizerProfile,
} from "@/lib/catalog";

type AdminTab = "overview" | "organizers" | "events" | "orders" | "attendees" | "users";

const TABS: { key: AdminTab; label: string; Icon: typeof BarChart3 }[] = [
  { key: "overview", label: "Tổng quan toàn sàn", Icon: BarChart3 },
  { key: "organizers", label: "Nhà tổ chức (Organizers)", Icon: Building2 },
  { key: "events", label: "Kiểm duyệt Sự kiện", Icon: CalendarDays },
  { key: "orders", label: "Đơn hàng toàn sàn", Icon: Ticket },
  { key: "attendees", label: "Vé & Check-in", Icon: ShieldCheck },
  { key: "users", label: "Tài khoản (Users)", Icon: Users },
];

export function AdminDashboardView() {
  const api = useApi();
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");
  const [organizers, setOrganizers] = useState<OrganizerProfile[]>([]);
  const [events, setEvents] = useState<ManagedEvent[]>([]);
  const [orders, setOrders] = useState<ManagedOrderDto[]>([]);
  const [attendees, setAttendees] = useState<ManagedAttendeeDto[]>([]);
  const [users, setUsers] = useState<ManagedUserDto[]>([]);
  const [analytics, setAnalytics] = useState<ManagedAnalyticsDto | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();
  const [notice, setNotice] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [eventStatusFilter, setEventStatusFilter] = useState("all");
  const [orderStatusFilter, setOrderStatusFilter] = useState("all");

  // Organizer Create / Edit form
  const [editingOrganizerId, setEditingOrganizerId] = useState<string | null>(null);
  const [orgOwnerUserId, setOrgOwnerUserId] = useState("");
  const [orgName, setOrgName] = useState("");
  const [orgSlug, setOrgSlug] = useState("");
  const [orgEmail, setOrgEmail] = useState("");
  const [orgDescription, setOrgDescription] = useState("");
  const [savingOrganizer, setSavingOrganizer] = useState(false);

  // Admin Check-in states
  const [pendingTicketIds, setPendingTicketIds] = useState<string[]>([]);
  const [bypassWindow, setBypassWindow] = useState<boolean>(false);

  const loadAll = useCallback(
    async (signal?: AbortSignal) => {
      const [orgData, eventData, orderData, attendeeData, analyticsData, userData] =
        await Promise.all([
          api<OrganizerProfile[]>("/api/v1/management/organizers", signal),
          api<ManagedEventDto[]>("/api/v1/management/events", signal),
          api<ManagedOrderDto[]>("/api/v1/management/orders", signal),
          api<ManagedAttendeeDto[]>("/api/v1/management/attendees", signal),
          api<ManagedAnalyticsDto>("/api/v1/management/analytics?days=14", signal),
          api<ManagedUserDto[]>("/api/v1/management/users", signal),
        ]);

      setOrganizers(orgData);
      setEvents(eventData.map(toManagedEvent));
      setOrders(orderData);
      setAttendees(attendeeData);
      setAnalytics(analyticsData);
      setUsers(userData);
    },
    [api],
  );

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(undefined);

    void loadAll(controller.signal)
      .catch((cause) => {
        if (!controller.signal.aborted) {
          setError(cause instanceof Error ? cause.message : "Không thể tải dữ liệu quản trị.");
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, [loadAll, reloadKey]);

  const organizerUsersWithoutProfile = useMemo(() => {
    const ownedUserIds = new Set(organizers.map((o) => o.ownerUserId));
    return users.filter(
      (u) => u.role.toLowerCase() === "organizer" && !ownedUserIds.has(u.id),
    );
  }, [organizers, users]);

  const eventBreakdownMap = useMemo(() => {
    const map = new Map<string, EventSalesSummaryDto>();
    for (const item of analytics?.eventBreakdown ?? []) {
      map.set(item.eventId, item);
    }
    return map;
  }, [analytics]);

  const filteredEvents = useMemo(
    () =>
      events.filter((ev) => {
        if (eventStatusFilter !== "all" && ev.status !== eventStatusFilter) return false;
        if (!searchQuery.trim()) return true;
        const q = searchQuery.trim().toLowerCase();
        return (
          ev.title.toLowerCase().includes(q) ||
          ev.slug.toLowerCase().includes(q) ||
          ev.organizer.name.toLowerCase().includes(q)
        );
      }),
    [events, eventStatusFilter, searchQuery],
  );

  const filteredOrders = useMemo(
    () =>
      orders.filter((ord) => {
        if (
          orderStatusFilter !== "all" &&
          ord.status.toLowerCase() !== orderStatusFilter.toLowerCase()
        ) {
          return false;
        }
        if (!searchQuery.trim()) return true;
        const q = searchQuery.trim().toLowerCase();
        return (
          ord.orderNumber.toLowerCase().includes(q) ||
          ord.eventTitle.toLowerCase().includes(q) ||
          ord.buyerName.toLowerCase().includes(q) ||
          ord.buyerEmail.toLowerCase().includes(q)
        );
      }),
    [orders, orderStatusFilter, searchQuery],
  );

  const filteredAttendees = useMemo(
    () =>
      attendees.filter((att) => {
        if (!searchQuery.trim()) return true;
        const q = searchQuery.trim().toLowerCase();
        return (
          att.ticketCode.toLowerCase().includes(q) ||
          att.attendeeName.toLowerCase().includes(q) ||
          att.attendeeEmail.toLowerCase().includes(q) ||
          att.eventTitle.toLowerCase().includes(q) ||
          att.orderNumber.toLowerCase().includes(q)
        );
      }),
    [attendees, searchQuery],
  );

  const handleSaveOrganizer = async (e: React.FormEvent) => {
    e.preventDefault();
    setNotice(null);
    setSavingOrganizer(true);

    try {
      if (editingOrganizerId) {
        await api<OrganizerProfile>(`/api/v1/management/organizers/${editingOrganizerId}`, {
          method: "PUT",
          body: JSON.stringify({
            name: orgName.trim(),
            slug: orgSlug.trim() || undefined,
            description: orgDescription.trim(),
            contactEmail: orgEmail.trim(),
          }),
        });
        setNotice({ type: "success", text: `Đã cập nhật Nhà tổ chức "${orgName}".` });
      } else {
        if (!orgOwnerUserId.trim()) {
          setNotice({
            type: "error",
            text: "Vui lòng chọn hoặc nhập User ID có vai trò Organizer.",
          });
          setSavingOrganizer(false);
          return;
        }
        await api<OrganizerProfile>("/api/v1/management/organizers", {
          method: "POST",
          body: JSON.stringify({
            ownerUserId: orgOwnerUserId.trim(),
            profile: {
              name: orgName.trim(),
              slug: orgSlug.trim() || undefined,
              description: orgDescription.trim(),
              contactEmail: orgEmail.trim(),
            },
          }),
        });
        setNotice({ type: "success", text: `Đã tạo hồ sơ Nhà tổ chức "${orgName}".` });
      }

      setEditingOrganizerId(null);
      setOrgOwnerUserId("");
      setOrgName("");
      setOrgSlug("");
      setOrgEmail("");
      setOrgDescription("");
      await loadAll();
    } catch (cause) {
      setNotice({
        type: "error",
        text: cause instanceof Error ? cause.message : "Không thể lưu hồ sơ Nhà tổ chức.",
      });
    } finally {
      setSavingOrganizer(false);
    }
  };

  const handleDeleteOrganizer = async (org: OrganizerProfile) => {
    if (!window.confirm(`Xóa hồ sơ Nhà tổ chức "${org.name}"?`)) return;
    setNotice(null);
    try {
      await api<void>(`/api/v1/management/organizers/${org.id}`, { method: "DELETE" });
      setNotice({ type: "success", text: `Đã xóa Nhà tổ chức "${org.name}".` });
      await loadAll();
    } catch (cause) {
      setNotice({
        type: "error",
        text: cause instanceof Error ? cause.message : "Không thể xóa Nhà tổ chức.",
      });
    }
  };

  const handleEventLifecycle = async (
    action: "publish" | "cancel" | "complete" | "delete",
    ev: ManagedEvent,
  ) => {
    setNotice(null);
    try {
      if (action === "publish") {
        await api<ManagedEventDto>(`/api/v1/management/events/${ev.id}/publish`, {
          method: "POST",
          body: JSON.stringify({ version: ev.version }),
        });
        setNotice({ type: "success", text: `Đã duyệt & xuất bản sự kiện "${ev.title}".` });
      } else if (action === "cancel") {
        const reason = window.prompt(
          `Nhập lý do hủy sự kiện "${ev.title}":`,
          "Hủy bởi Quản trị viên hệ thống (Admin)",
        );
        if (!reason) return;
        await api<ManagedEventDto>(`/api/v1/management/events/${ev.id}/cancellations`, {
          method: "POST",
          body: JSON.stringify({ version: ev.version, reason }),
        });
        setNotice({ type: "success", text: `Đã chuyển sự kiện "${ev.title}" sang Cancelled.` });
      } else if (action === "complete") {
        await api<ManagedEventDto>(`/api/v1/management/events/${ev.id}/complete`, {
          method: "POST",
          body: JSON.stringify({ version: ev.version }),
        });
        setNotice({ type: "success", text: `Đã đánh dấu hoàn tất sự kiện "${ev.title}".` });
      } else if (action === "delete") {
        if (!window.confirm(`Xóa sự kiện nháp "${ev.title}"?`)) return;
        await api<void>(`/api/v1/management/events/${ev.id}?version=${ev.version}`, {
          method: "DELETE",
        });
        setNotice({ type: "success", text: `Đã xóa sự kiện "${ev.title}".` });
      }
      await loadAll();
    } catch (cause) {
      setNotice({
        type: "error",
        text: cause instanceof Error ? cause.message : "Thao tác sự kiện thất bại.",
      });
    }
  };

  const handleAdminCheckIn = async (attendee: ManagedAttendeeDto) => {
    setPendingTicketIds((prev) => [...prev, attendee.ticketId]);
    setNotice(null);
    try {
      const idempotencyKey =
        typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
          ? crypto.randomUUID()
          : `admin-checkin-${Date.now()}`;
      await api(`/api/v1/check-ins`, {
        method: "POST",
        headers: { "Idempotency-Key": idempotencyKey },
        body: JSON.stringify({
          eventSessionId: attendee.eventSessionId,
          ticketCode: attendee.ticketCode,
          reason: "Admin support verification",
          bypassWindow,
        }),
      });
      setNotice({
        type: "success",
        text: `Đã check-in vé ${attendee.ticketCode} (${attendee.attendeeName}).`,
      });
      await loadAll();
    } catch (cause) {
      if (cause instanceof ApiError && cause.code === "TICKET_ALREADY_USED") {
        setNotice({
          type: "error",
          text: `Vé ${attendee.ticketCode} đã được sử dụng trước đó (TICKET_ALREADY_USED).`,
        });
      } else if (cause instanceof ApiError && cause.code === "CHECK_IN_WINDOW_CLOSED") {
        setNotice({
          type: "error",
          text: "Ngoài khung giờ phiên sự kiện (CHECK_IN_WINDOW_CLOSED). Hãy bật 'Cho phép check-in ngoài khung giờ phiên' để hỗ trợ kiểm thử.",
        });
      } else {
        setNotice({
          type: "error",
          text: cause instanceof Error ? cause.message : "Check-in thất bại.",
        });
      }
    } finally {
      setPendingTicketIds((prev) => prev.filter((id) => id !== attendee.ticketId));
    }
  };

  return (
    <ProtectedRoute roles={["Admin"]}>
      <main className="page-shell bg-[#f8f9fb]">
        <div className="container grid gap-6 py-6 lg:grid-cols-[240px_1fr] lg:py-8">
          <aside className="h-fit rounded-2xl border border-slate-100 bg-white p-3">
            <div className="mb-4 flex items-center gap-3 rounded-xl p-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-slate-900 text-white">
                <ShieldCheck size={19} />
              </span>
              <span>
                <span className="block text-sm font-extrabold">TixFlow Admin</span>
                <span className="mt-0.5 block text-[10px] text-slate-500">
                  System Administration
                </span>
              </span>
            </div>
            <nav className="space-y-1" aria-label="Admin navigation">
              {TABS.map(({ key, label, Icon }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => {
                    setActiveTab(key);
                    setNotice(null);
                  }}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-xs font-bold transition ${
                    activeTab === key
                      ? "bg-orange-50 text-[#df623b]"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <Icon size={16} />
                  {label}
                </button>
              ))}
            </nav>
          </aside>

          <section className="min-w-0">
            <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="eyebrow">Quản trị hệ thống · {VIETNAM_TIME_ZONE} (GMT+7)</p>
                <h1 className="mt-1 text-2xl font-extrabold tracking-tight">
                  {TABS.find((t) => t.key === activeTab)?.label}
                </h1>
              </div>
              <button
                type="button"
                onClick={() => setReloadKey((k) => k + 1)}
                className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                <RefreshCw size={13} />
                Đồng bộ dữ liệu DB
              </button>
            </div>

            {notice && (
              <div
                role="status"
                className={`mb-5 flex items-center gap-2.5 rounded-2xl border p-4 text-xs font-semibold ${
                  notice.type === "success"
                    ? "border-emerald-200 bg-emerald-50 text-emerald-900"
                    : "border-rose-200 bg-rose-50 text-rose-900"
                }`}
              >
                {notice.type === "success" ? (
                  <CheckCircle2 size={16} className="shrink-0 text-emerald-600" />
                ) : (
                  <AlertCircle size={16} className="shrink-0 text-rose-600" />
                )}
                <span>{notice.text}</span>
              </div>
            )}

            {error && (
              <div className="mb-5">
                <ErrorState
                  compact
                  title="Không thể tải dữ liệu Admin"
                  message={error}
                  homeHref="/"
                  homeLabel="Về trang chủ"
                  onRetry={() => setReloadKey((k) => k + 1)}
                />
              </div>
            )}

            {loading && !error && (
              <div className="rounded-2xl border border-slate-100 bg-white p-5">
                <TableSkeleton rows={6} columns={5} />
              </div>
            )}

            {!loading && !error && activeTab === "overview" && (
              <div className="space-y-5">
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                  {[
                    {
                      title: "Nhà tổ chức & Tài khoản",
                      value: `${organizers.length} Organizers`,
                      sub: `${users.length} tài khoản đã đồng bộ Keycloak`,
                      Icon: Building2,
                    },
                    {
                      title: "Sự kiện toàn sàn",
                      value: String(events.length),
                      sub: `${
                        events.filter((e) => e.status === "published").length
                      } Published · ${events.filter((e) => e.status === "draft").length} Draft · ${
                        events.filter((e) => e.status === "cancelled").length
                      } Cancelled`,
                      Icon: CalendarDays,
                    },
                    {
                      title: "Doanh thu toàn sàn (Paid)",
                      value: formatVndCurrency(analytics?.totalPaidRevenue ?? 0),
                      sub: `${analytics?.totalPaidOrdersCount ?? 0} đơn Paid · Loại trừ ${
                        (analytics?.cancelledOrdersCount ?? 0) +
                        (analytics?.expiredOrdersCount ?? 0) +
                        (analytics?.refundedOrdersCount ?? 0)
                      } đơn hủy/hết hạn`,
                      Icon: CircleDollarSign,
                    },
                    {
                      title: "Vé đã phát & Check-in",
                      value: `${analytics?.totalCheckedInCount ?? 0} / ${
                        analytics?.totalIssuedTicketsCount ?? 0
                      }`,
                      sub: `${analytics?.totalTicketsSold ?? 0} vé thuộc đơn Paid`,
                      Icon: Ticket,
                    },
                  ].map(({ title, value, sub, Icon }) => (
                    <div
                      key={title}
                      className="rounded-2xl border border-slate-100 bg-white p-4"
                    >
                      <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                        <span>{title}</span>
                        <Icon size={16} className="text-[#e7653c]" />
                      </div>
                      <div className="mt-3 text-2xl font-extrabold tracking-tight">{value}</div>
                      <div className="mt-1 text-[11px] text-slate-500">{sub}</div>
                    </div>
                  ))}
                </div>

                <div className="grid gap-5 lg:grid-cols-2">
                  <section className="rounded-2xl border border-slate-100 bg-white p-5">
                    <div className="flex items-center justify-between">
                      <h2 className="text-sm font-extrabold">Nhà tổ chức trên hệ thống</h2>
                      <button
                        type="button"
                        onClick={() => setActiveTab("organizers")}
                        className="text-xs font-bold text-[#e7653c]"
                      >
                        Quản lý Organizers →
                      </button>
                    </div>
                    <div className="mt-4 space-y-3">
                      {organizers.slice(0, 6).map((org) => (
                        <div
                          key={org.id}
                          className="flex items-center justify-between border-b border-slate-50 pb-2.5 text-xs last:border-b-0 last:pb-0"
                        >
                          <div>
                            <div className="font-bold text-slate-900">{org.name}</div>
                            <div className="text-[11px] text-slate-500">
                              {org.contactEmail} · <span className="font-mono">{org.slug}</span>
                            </div>
                          </div>
                          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-700">
                            {events.filter((e) => e.organizer.id === org.id).length} sự kiện
                          </span>
                        </div>
                      ))}
                    </div>
                  </section>

                  <section className="rounded-2xl border border-slate-100 bg-white p-5">
                    <div className="flex items-center justify-between">
                      <h2 className="text-sm font-extrabold">Đơn hàng mới nhất toàn sàn</h2>
                      <button
                        type="button"
                        onClick={() => setActiveTab("orders")}
                        className="text-xs font-bold text-[#e7653c]"
                      >
                        Xem tất cả ({orders.length}) →
                      </button>
                    </div>
                    <div className="mt-4 space-y-3">
                      {orders.slice(0, 6).map((ord) => (
                        <div
                          key={ord.id}
                          className="flex items-center justify-between border-b border-slate-50 pb-2.5 text-xs last:border-b-0 last:pb-0"
                        >
                          <div className="min-w-0">
                            <div className="truncate font-bold text-slate-900">
                              {ord.orderNumber} · {ord.eventTitle}
                            </div>
                            <div className="text-[11px] text-slate-500">
                              {ord.buyerName} ({ord.buyerEmail})
                            </div>
                          </div>
                          <div className="shrink-0 text-right">
                            <div className="font-bold text-slate-900">
                              {formatVndCurrency(ord.totalAmount, ord.currency)}
                            </div>
                            <span
                              className={`text-[10px] font-bold ${
                                ord.status === "Paid" ? "text-emerald-600" : "text-slate-500"
                              }`}
                            >
                              {ord.status}
                            </span>
                          </div>
                        </div>
                      ))}
                      {orders.length === 0 && (
                        <p className="py-6 text-center text-xs text-slate-400">
                          Chưa có đơn hàng nào trong hệ thống.
                        </p>
                      )}
                    </div>
                  </section>
                </div>
              </div>
            )}

            {!loading && !error && activeTab === "organizers" && (
              <div className="space-y-5">
                <section className="rounded-2xl border border-slate-100 bg-white p-5">
                  <h2 className="text-sm font-extrabold">
                    {editingOrganizerId
                      ? "Cập nhật hồ sơ Nhà tổ chức"
                      : "Thêm hồ sơ Nhà tổ chức mới (Admin API)"}
                  </h2>
                  <p className="mt-1 text-xs text-slate-500">
                    Gắn hồ sơ Nhà tổ chức với tài khoản người dùng có role <code className="rounded bg-slate-100 px-1">Organizer</code>.
                  </p>
                  <form
                    onSubmit={handleSaveOrganizer}
                    className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
                  >
                    {!editingOrganizerId && (
                      <label className="text-xs font-bold">
                        Tài khoản chủ sở hữu (Organizer User)
                        {organizerUsersWithoutProfile.length > 0 ? (
                          <select
                            value={orgOwnerUserId}
                            onChange={(e) => {
                              setOrgOwnerUserId(e.target.value);
                              const u = users.find((x) => x.id === e.target.value);
                              if (u && !orgEmail) setOrgEmail(u.email);
                              if (u && !orgName) setOrgName(u.displayName);
                            }}
                            className="mt-1.5 h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs font-normal"
                          >
                            <option value="">-- Chọn tài khoản Organizer --</option>
                            {organizerUsersWithoutProfile.map((u) => (
                              <option key={u.id} value={u.id}>
                                {u.displayName} ({u.email})
                              </option>
                            ))}
                          </select>
                        ) : (
                          <input
                            value={orgOwnerUserId}
                            onChange={(e) => setOrgOwnerUserId(e.target.value)}
                            placeholder="UUID của Organizer User"
                            className="mt-1.5 h-10 w-full rounded-xl border border-slate-200 px-3 font-mono text-xs font-normal"
                          />
                        )}
                      </label>
                    )}

                    <label className="text-xs font-bold">
                      Tên Nhà tổ chức
                      <input
                        required
                        value={orgName}
                        onChange={(e) => setOrgName(e.target.value)}
                        placeholder="VD: Saigon Live Production"
                        className="mt-1.5 h-10 w-full rounded-xl border border-slate-200 px-3 text-xs font-normal"
                      />
                    </label>

                    <label className="text-xs font-bold">
                      Slug (tùy chọn)
                      <input
                        value={orgSlug}
                        onChange={(e) => setOrgSlug(e.target.value)}
                        placeholder="saigon-live-production"
                        className="mt-1.5 h-10 w-full rounded-xl border border-slate-200 px-3 font-mono text-xs font-normal"
                      />
                    </label>

                    <label className="text-xs font-bold">
                      Email liên hệ
                      <input
                        required
                        type="email"
                        value={orgEmail}
                        onChange={(e) => setOrgEmail(e.target.value)}
                        placeholder="contact@organizer.vn"
                        className="mt-1.5 h-10 w-full rounded-xl border border-slate-200 px-3 text-xs font-normal"
                      />
                    </label>

                    <label className="text-xs font-bold sm:col-span-2">
                      Mô tả giới thiệu
                      <input
                        value={orgDescription}
                        onChange={(e) => setOrgDescription(e.target.value)}
                        placeholder="Mô tả lĩnh vực hoạt động của nhà tổ chức..."
                        className="mt-1.5 h-10 w-full rounded-xl border border-slate-200 px-3 text-xs font-normal"
                      />
                    </label>

                    <div className="flex items-end gap-2 sm:col-span-2 lg:col-span-3">
                      <button
                        type="submit"
                        disabled={savingOrganizer}
                        className="button-primary !h-10 !px-5 !text-xs"
                      >
                        <Plus size={14} />
                        {savingOrganizer
                          ? "Đang lưu..."
                          : editingOrganizerId
                            ? "Lưu cập nhật"
                            : "Tạo Nhà tổ chức"}
                      </button>
                      {editingOrganizerId && (
                        <button
                          type="button"
                          onClick={() => {
                            setEditingOrganizerId(null);
                            setOrgName("");
                            setOrgSlug("");
                            setOrgEmail("");
                            setOrgDescription("");
                          }}
                          className="button-outline !h-10 !px-4 !text-xs"
                        >
                          Hủy
                        </button>
                      )}
                    </div>
                  </form>
                </section>

                <section className="rounded-2xl border border-slate-100 bg-white p-5">
                  <h2 className="mb-4 text-sm font-extrabold">
                    Danh sách Nhà tổ chức ({organizers.length})
                  </h2>
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[740px] text-left text-xs">
                      <thead className="text-[10px] uppercase tracking-wider text-slate-400">
                        <tr>
                          {[
                            "Tên đơn vị",
                            "Slug",
                            "Email liên hệ",
                            "Owner User ID",
                            "Số sự kiện",
                            "Thao tác",
                          ].map((h) => (
                            <th key={h} className="pb-3 pr-3">
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {organizers.map((org) => {
                          const evCount = events.filter((e) => e.organizer.id === org.id).length;
                          return (
                            <tr key={org.id} className="border-t border-slate-100">
                              <td className="py-3.5 pr-3">
                                <div className="font-bold text-slate-900">{org.name}</div>
                                <div className="line-clamp-1 max-w-xs text-[11px] text-slate-400">
                                  {org.description}
                                </div>
                              </td>
                              <td className="py-3.5 pr-3 font-mono text-[11px] text-slate-600">
                                {org.slug}
                              </td>
                              <td className="py-3.5 pr-3 text-slate-600">{org.contactEmail}</td>
                              <td className="py-3.5 pr-3 font-mono text-[11px] text-slate-400">
                                {org.ownerUserId}
                              </td>
                              <td className="py-3.5 pr-3 font-bold text-slate-800">{evCount}</td>
                              <td className="py-3.5">
                                <div className="flex items-center gap-3">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setEditingOrganizerId(org.id);
                                      setOrgName(org.name);
                                      setOrgSlug(org.slug);
                                      setOrgEmail(org.contactEmail);
                                      setOrgDescription(org.description);
                                    }}
                                    className="inline-flex items-center gap-1 font-semibold text-[#e7653c] hover:underline"
                                  >
                                    <Edit3 size={13} />
                                    Sửa
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => void handleDeleteOrganizer(org)}
                                    className="inline-flex items-center gap-1 font-semibold text-rose-600 hover:underline"
                                  >
                                    <Trash2 size={13} />
                                    Xóa
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </section>
              </div>
            )}

            {!loading && !error && activeTab === "events" && (
              <section className="rounded-2xl border border-slate-100 bg-white p-5">
                <div className="mb-4 flex flex-wrap gap-3">
                  <label className="header-search flex-1 !bg-white">
                    <Search size={16} className="text-slate-400" />
                    <input
                      aria-label="Tìm sự kiện toàn sàn"
                      placeholder="Tìm theo tên sự kiện, slug, nhà tổ chức..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </label>
                  <select
                    aria-label="Lọc trạng thái sự kiện"
                    value={eventStatusFilter}
                    onChange={(e) => setEventStatusFilter(e.target.value)}
                    className="h-10 rounded-full border border-slate-200 bg-white px-4 text-xs"
                  >
                    <option value="all">Tất cả trạng thái ({events.length})</option>
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full min-w-[780px] text-left text-xs">
                    <thead className="text-[10px] uppercase tracking-wider text-slate-400">
                      <tr>
                        {[
                          "Sự kiện",
                          "Nhà tổ chức",
                          "Trạng thái",
                          "Ngày diễn ra (GMT+7)",
                          "Vé Paid / Sức chứa",
                          "Doanh thu Paid",
                          "Thao tác quản trị",
                        ].map((h) => (
                          <th key={h} className="pb-3 pr-3">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredEvents.map((ev) => {
                        const summary = eventBreakdownMap.get(ev.id);
                        return (
                          <tr key={ev.id} className="border-t border-slate-100">
                            <td className="py-3.5 pr-3">
                              <Link
                                href={`/events/${ev.slug}`}
                                className="font-bold text-slate-900 hover:text-[#e7653c]"
                              >
                                {ev.title}
                              </Link>
                              <div className="font-mono text-[10px] text-slate-400">{ev.slug}</div>
                            </td>
                            <td className="py-3.5 pr-3 font-medium text-slate-700">
                              {ev.organizer.name}
                            </td>
                            <td className="py-3.5 pr-3">
                              <span
                                className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold capitalize ${
                                  ev.status === "published"
                                    ? "bg-emerald-50 text-emerald-700"
                                    : ev.status === "draft"
                                      ? "bg-amber-50 text-amber-700"
                                      : "bg-slate-100 text-slate-600"
                                }`}
                              >
                                {ev.status}
                              </span>
                            </td>
                            <td className="py-3.5 pr-3 text-slate-500">
                              {formatVietnamDateTime(ev.startDate)}
                            </td>
                            <td className="py-3.5 pr-3">
                              <span className="font-bold">
                                {(summary?.ticketsSold ?? 0).toLocaleString("vi-VN")}
                              </span>{" "}
                              / {(summary?.capacity ?? 0).toLocaleString("vi-VN")}
                            </td>
                            <td className="py-3.5 pr-3 font-bold text-slate-900">
                              {formatVndCurrency(summary?.paidRevenue ?? 0)}
                            </td>
                            <td className="py-3.5">
                              <div className="flex flex-wrap gap-2">
                                {ev.status === "draft" && (
                                  <button
                                    type="button"
                                    onClick={() => void handleEventLifecycle("publish", ev)}
                                    className="font-bold text-emerald-700 hover:underline"
                                  >
                                    Publish
                                  </button>
                                )}
                                {ev.status === "published" && (
                                  <>
                                    <button
                                      type="button"
                                      onClick={() => void handleEventLifecycle("cancel", ev)}
                                      className="font-bold text-amber-700 hover:underline"
                                    >
                                      Cancel
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => void handleEventLifecycle("complete", ev)}
                                      className="font-bold text-blue-700 hover:underline"
                                    >
                                      Complete
                                    </button>
                                  </>
                                )}
                                {ev.status === "draft" && (
                                  <button
                                    type="button"
                                    onClick={() => void handleEventLifecycle("delete", ev)}
                                    className="font-bold text-rose-600 hover:underline"
                                  >
                                    Delete
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </section>
            )}

            {!loading && !error && activeTab === "orders" && (
              <section className="rounded-2xl border border-slate-100 bg-white p-5">
                <div className="mb-4 flex flex-wrap gap-3">
                  <label className="header-search flex-1 !bg-white">
                    <Search size={16} className="text-slate-400" />
                    <input
                      aria-label="Tìm đơn hàng toàn sàn"
                      placeholder="Tìm mã đơn, tên khách, email, sự kiện..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </label>
                  <select
                    aria-label="Lọc trạng thái đơn hàng"
                    value={orderStatusFilter}
                    onChange={(e) => setOrderStatusFilter(e.target.value)}
                    className="h-10 rounded-full border border-slate-200 bg-white px-4 text-xs"
                  >
                    <option value="all">Tất cả trạng thái ({orders.length})</option>
                    <option value="Paid">Paid</option>
                    <option value="PendingPayment">PendingPayment</option>
                    <option value="Expired">Expired</option>
                    <option value="Cancelled">Cancelled</option>
                    <option value="Refunded">Refunded</option>
                  </select>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full min-w-[760px] text-left text-xs">
                    <thead className="text-[10px] uppercase tracking-wider text-slate-400">
                      <tr>
                        {[
                          "Mã đơn",
                          "Sự kiện / Phiên",
                          "Khách hàng",
                          "Thời gian tạo (GMT+7)",
                          "Số lượng",
                          "Tổng tiền",
                          "Trạng thái",
                        ].map((h) => (
                          <th key={h} className="pb-3 pr-3">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredOrders.map((ord) => (
                        <tr key={ord.id} className="border-t border-slate-100">
                          <td className="py-3.5 pr-3 font-mono font-bold text-slate-900">
                            {ord.orderNumber}
                          </td>
                          <td className="py-3.5 pr-3">
                            <div className="font-bold text-slate-900">{ord.eventTitle}</div>
                            <div className="text-[11px] text-slate-400">{ord.sessionName}</div>
                          </td>
                          <td className="py-3.5 pr-3">
                            <div className="font-semibold text-slate-800">{ord.buyerName}</div>
                            <div className="text-[11px] text-slate-500">{ord.buyerEmail}</div>
                          </td>
                          <td className="py-3.5 pr-3 text-slate-500">
                            {formatVietnamDateTime(ord.createdAtUtc)}
                          </td>
                          <td className="py-3.5 pr-3">
                            <span className="font-bold">{ord.quantity} vé</span>
                            <div className="text-[11px] text-slate-500">{ord.ticketSummary}</div>
                          </td>
                          <td className="py-3.5 pr-3 font-bold text-slate-900">
                            {formatVndCurrency(ord.totalAmount, ord.currency)}
                          </td>
                          <td className="py-3.5">
                            <span
                              className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                                ord.status === "Paid"
                                  ? "bg-emerald-50 text-emerald-700"
                                  : ord.status === "PendingPayment"
                                    ? "bg-amber-50 text-amber-700"
                                    : "bg-rose-50 text-rose-700"
                              }`}
                            >
                              {ord.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {filteredOrders.length === 0 && (
                    <p className="py-10 text-center text-sm text-slate-500">
                      Không tìm thấy đơn hàng nào.
                    </p>
                  )}
                </div>
              </section>
            )}

            {!loading && !error && activeTab === "attendees" && (
              <section className="rounded-2xl border border-slate-100 bg-white p-5">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                  <label className="header-search flex-1 !bg-white">
                    <Search size={16} className="text-slate-400" />
                    <input
                      aria-label="Tìm vé và người tham dự"
                      placeholder="Tìm theo mã vé, tên khách, email, sự kiện..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </label>
                  <label className="inline-flex cursor-pointer items-center gap-2 text-xs text-slate-600">
                    <input
                      type="checkbox"
                      checked={bypassWindow}
                      onChange={(e) => setBypassWindow(e.target.checked)}
                      className="h-4 w-4 rounded border-slate-300 accent-[#e7653c]"
                    />
                    <span>Cho phép check-in ngoài khung giờ phiên (Demo / Admin Override)</span>
                  </label>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full min-w-[780px] text-left text-xs">
                    <thead className="text-[10px] uppercase tracking-wider text-slate-400">
                      <tr>
                        {[
                          "Mã vé",
                          "Người tham dự",
                          "Sự kiện / Phiên",
                          "Loại vé / Ghế",
                          "Trạng thái",
                          "Check-in (DB)",
                        ].map((h) => (
                          <th key={h} className="pb-3 pr-3">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredAttendees.map((att) => {
                        const isPending = pendingTicketIds.includes(att.ticketId);
                        const isUsed = att.status === "Used" || Boolean(att.checkedInAtUtc);
                        return (
                          <tr key={att.ticketId} className="border-t border-slate-100">
                            <td className="py-3.5 pr-3 font-mono font-bold text-slate-900">
                              {att.ticketCode}
                            </td>
                            <td className="py-3.5 pr-3">
                              <div className="font-bold text-slate-900">{att.attendeeName}</div>
                              <div className="text-[11px] text-slate-500">{att.attendeeEmail}</div>
                            </td>
                            <td className="py-3.5 pr-3">
                              <div className="font-semibold text-slate-800">{att.eventTitle}</div>
                              <div className="text-[11px] text-slate-400">{att.sessionName}</div>
                            </td>
                            <td className="py-3.5 pr-3">
                              {att.ticketTypeName}
                              {att.seatLabel ? ` · Ghế ${att.seatLabel}` : ""}
                            </td>
                            <td className="py-3.5 pr-3">
                              <span
                                className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                                  isUsed
                                    ? "bg-emerald-50 text-emerald-700"
                                    : "bg-blue-50 text-blue-700"
                                }`}
                              >
                                {att.status}
                              </span>
                            </td>
                            <td className="py-3.5">
                              {isUsed ? (
                                <span className="text-[11px] font-semibold text-emerald-700">
                                  Đã check-in{" "}
                                  {att.checkedInAtUtc
                                    ? `(${formatVietnamDateTime(att.checkedInAtUtc)})`
                                    : ""}
                                </span>
                              ) : (
                                <button
                                  type="button"
                                  disabled={isPending}
                                  onClick={() => void handleAdminCheckIn(att)}
                                  className="rounded-full bg-[#e7653c] px-3 py-1 text-[11px] font-bold text-white hover:bg-[#d5562e] disabled:opacity-50"
                                >
                                  {isPending ? "Đang xử lý..." : "Check in"}
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  {filteredAttendees.length === 0 && (
                    <p className="py-10 text-center text-sm text-slate-500">
                      Chưa có vé nào được phát hành trên hệ thống.
                    </p>
                  )}
                </div>
              </section>
            )}

            {!loading && !error && activeTab === "users" && (
              <section className="rounded-2xl border border-slate-100 bg-white p-5">
                <h2 className="mb-4 text-sm font-extrabold">
                  Tài khoản người dùng trong DB ({users.length})
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[720px] text-left text-xs">
                    <thead className="text-[10px] uppercase tracking-wider text-slate-400">
                      <tr>
                        {[
                          "Tên hiển thị",
                          "Email",
                          "Số điện thoại",
                          "Vai trò (Role)",
                          "Trạng thái",
                          "Ngày tạo (GMT+7)",
                          "User ID",
                        ].map((h) => (
                          <th key={h} className="pb-3 pr-3">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((u) => (
                        <tr key={u.id} className="border-t border-slate-100">
                          <td className="py-3.5 pr-3 font-bold text-slate-900">{u.displayName}</td>
                          <td className="py-3.5 pr-3 text-slate-600">{u.email}</td>
                          <td className="py-3.5 pr-3 text-slate-500">{u.phoneNumber ?? "—"}</td>
                          <td className="py-3.5 pr-3">
                            <span
                              className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                                u.role === "Admin"
                                  ? "bg-purple-50 text-purple-700"
                                  : u.role === "Organizer"
                                    ? "bg-orange-50 text-[#e7653c]"
                                    : "bg-slate-100 text-slate-700"
                              }`}
                            >
                              {u.role}
                            </span>
                          </td>
                          <td className="py-3.5 pr-3">
                            <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700">
                              {u.status}
                            </span>
                          </td>
                          <td className="py-3.5 pr-3 text-slate-500">
                            {formatVietnamDateTime(u.createdAtUtc)}
                          </td>
                          <td className="py-3.5 font-mono text-[11px] text-slate-400">{u.id}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}
          </section>
        </div>
      </main>
    </ProtectedRoute>
  );
}
