import type { Event, EventCategory } from "@/lib/mock/events";

export interface PublicOrganizerDto {
  id: string;
  name: string;
  slug: string;
  description: string;
  eventCount: number;
  avatarUrl?: string | null;
  websiteUrl?: string | null;
  isVerified?: boolean;
  followerCount?: number;
}

export interface PublicVenueDto {
  id: string;
  name: string;
  addressLine: string;
  ward?: string | null;
  district?: string | null;
  city: string;
  countryCode: string;
  timeZone: string;
}

export interface PublicTicketTypeDto {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  inventoryMode: "GeneralAdmission" | "ReservedSeating";
  totalQuantity: number;
  heldQuantity: number;
  soldQuantity: number;
  availableQuantity: number;
  version: number;
  updatedAtUtc: string;
  maxPerOrder: number;
  saleStartsAtUtc?: string;
  saleEndsAtUtc?: string;
  seats: Array<{
    id: string;
    section: string;
    rowLabel: string;
    seatNumber: string;
    isAccessible: boolean;
    status: "Available" | "Held" | "Sold" | "Unavailable";
  }>;
}

export interface PublicSessionDto {
  id: string;
  name: string;
  startsAtUtc: string;
  endsAtUtc: string;
  status: string;
  ticketTypes: PublicTicketTypeDto[];
}

export interface PublicEventDto {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  imageUrl?: string;
  status: string;
  saleStartsAtUtc?: string;
  saleEndsAtUtc?: string;
  publishedAtUtc?: string;
  createdAtUtc: string;
  updatedAtUtc: string;
  organizer: PublicOrganizerDto;
  venue?: PublicVenueDto;
  sessions: PublicSessionDto[];
}

export interface PublicEventPageDto {
  events: PublicEventDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface OrganizerProfile {
  id: string;
  ownerUserId: string;
  name: string;
  slug: string;
  description: string;
  contactEmail: string;
}

export interface ManagedVenue {
  id: string;
  organizerId: string;
  name: string;
  addressLine: string;
  ward?: string;
  district?: string;
  city: string;
  countryCode: string;
  timeZone: string;
}

export interface ManagedSession {
  id: string;
  eventId: string;
  name: string;
  startsAtUtc: string;
  endsAtUtc: string;
  status: string;
  version: number;
  ticketTypes: ManagedTicketSummary[];
}

export interface ManagedTicketSummary {
  id: string;
  name: string;
  code: string;
  price: number;
  currency: string;
  inventoryMode: "GeneralAdmission" | "ReservedSeating";
  capacity: number;
  availableQuantity: number;
  maxPerOrder: number;
  version: number;
}

export interface ManagedTicketType {
  id: string;
  eventSessionId: string;
  name: string;
  code: string;
  description?: string;
  price: number;
  currency: string;
  inventoryMode: "GeneralAdmission" | "ReservedSeating";
  capacity: number;
  maxPerOrder: number;
  saleStartsAtUtc?: string;
  saleEndsAtUtc?: string;
  version: number;
  inventory: {
    totalQuantity: number;
    heldQuantity: number;
    soldQuantity: number;
    availableQuantity: number;
    version: number;
    updatedAtUtc: string;
  };
}

export interface ManagedEventDto {
  id: string;
  organizerId: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  imageUrl?: string;
  status: string;
  saleStartsAtUtc?: string;
  saleEndsAtUtc?: string;
  publishedAtUtc?: string;
  version: number;
  createdAtUtc: string;
  updatedAtUtc: string;
  organizer?: OrganizerProfile;
  venue?: ManagedVenue;
  sessions: ManagedSession[];
}

export interface ManagedEvent extends Event {
  version: number;
  venueId?: string;
  sessionIds: string[];
}

export interface ManagedOrderDto {
  id: string;
  orderNumber: string;
  eventId: string;
  eventSlug: string;
  eventTitle: string;
  eventSessionId: string;
  sessionName: string;
  sessionStartsAtUtc: string;
  buyerUserId: string;
  buyerName: string;
  buyerEmail: string;
  buyerPhone?: string | null;
  quantity: number;
  ticketSummary: string;
  totalAmount: number;
  currency: string;
  status: "PendingPayment" | "Paid" | "Cancelled" | "Expired" | "Refunded" | string;
  createdAtUtc: string;
  updatedAtUtc: string;
}

export interface ManagedAttendeeDto {
  ticketId: string;
  ticketCode: string;
  orderId: string;
  orderNumber: string;
  orderStatus: string;
  eventId: string;
  eventSlug: string;
  eventTitle: string;
  eventSessionId: string;
  sessionName: string;
  sessionStartsAtUtc: string;
  sessionEndsAtUtc: string;
  attendeeUserId: string;
  attendeeName: string;
  attendeeEmail: string;
  attendeePhone?: string | null;
  ticketTypeName: string;
  unitPrice: number;
  currency: string;
  seatLabel?: string | null;
  status: "Issued" | "Used" | "Cancelled" | "Refunded" | string;
  issuedAtUtc: string;
  checkedInAtUtc?: string | null;
}

export interface DailySalesPointDto {
  date: string;
  label: string;
  paidRevenue: number;
  ticketsSold: number;
  paidOrdersCount: number;
  cancelledOrdersCount: number;
}

export interface EventSalesSummaryDto {
  eventId: string;
  eventSlug: string;
  eventTitle: string;
  status: string;
  ticketsSold: number;
  capacity: number;
  paidRevenue: number;
  paidOrdersCount: number;
  cancelledOrdersCount: number;
  issuedTicketsCount: number;
  checkedInCount: number;
}

export interface ManagedAnalyticsDto {
  timeZone: string;
  currency: string;
  days: number;
  windowStartLocalDate: string;
  windowEndLocalDate: string;
  policyNote: string;
  totalPaidRevenue: number;
  totalTicketsSold: number;
  totalPaidOrdersCount: number;
  totalIssuedTicketsCount: number;
  totalCheckedInCount: number;
  pendingOrdersCount: number;
  cancelledOrdersCount: number;
  expiredOrdersCount: number;
  refundedOrdersCount: number;
  excludedOrdersAmount: number;
  windowPaidRevenue: number;
  windowTicketsSold: number;
  windowPaidOrdersCount: number;
  dailySeries: DailySalesPointDto[];
  eventBreakdown: EventSalesSummaryDto[];
}

export interface ManagedUserDto {
  id: string;
  email: string;
  displayName: string;
  phoneNumber?: string | null;
  role: string;
  status: string;
  createdAtUtc: string;
}

export const VIETNAM_TIME_ZONE = "Asia/Ho_Chi_Minh";

export function formatVndCurrency(amount: number, currency = "VND"): string {
  const safeAmount = Number.isFinite(amount) ? Math.round(amount) : 0;
  if (currency.trim().toUpperCase() === "VND") {
    return `${safeAmount.toLocaleString("vi-VN")} ₫`;
  }
  return `${safeAmount.toLocaleString("en-US")} ${currency}`;
}

export function formatVietnamDate(value: string | Date): string {
  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: VIETNAM_TIME_ZONE,
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

export function formatVietnamDateTime(value: string | Date): string {
  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: VIETNAM_TIME_ZONE,
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).format(date);
}

export function resolveTicketSaleStatus(
  availableQuantity: number,
  saleStart?: string,
  saleEnd?: string,
): Event["ticketTypes"][number]["status"] {
  const now = Date.now();
  if (saleStart) {
    const startMs = Date.parse(saleStart);
    if (!Number.isNaN(startMs) && now < startMs) return "not_started";
  }
  if (saleEnd) {
    const endMs = Date.parse(saleEnd);
    if (!Number.isNaN(endMs) && now > endMs) return "ended";
  }
  return availableQuantity <= 0 ? "sold_out" : "available";
}

const fallbackImage = "https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=1200&q=80";

export function toPublicEvent(item: PublicEventDto): Event {
  const session = item.sessions[0];
  const start = session?.startsAtUtc ?? item.saleStartsAtUtc ?? item.createdAtUtc;
  const end = session?.endsAtUtc ?? start;
  const tickets = session?.ticketTypes ?? [];
  const mappedTickets: Event["ticketTypes"] = tickets.length > 0 ? tickets.map((ticket) => {
    const saleStart = ticket.saleStartsAtUtc ?? item.saleStartsAtUtc ?? item.createdAtUtc;
    const saleEnd = ticket.saleEndsAtUtc ?? item.saleEndsAtUtc ?? start;
    return {
      id: ticket.id,
      eventId: item.id,
      name: ticket.name,
      description: ticket.description,
      price: ticket.price,
      currency: ticket.currency,
      quantity: ticket.totalQuantity,
      sold: ticket.totalQuantity - ticket.availableQuantity,
      minPerOrder: 1,
      maxPerOrder: ticket.maxPerOrder,
      saleStart,
      saleEnd,
      status: resolveTicketSaleStatus(ticket.availableQuantity, saleStart, saleEnd),
      benefits: [],
      inventoryMode: ticket.inventoryMode,
      availableQuantity: ticket.availableQuantity,
      seats: ticket.seats,
    };
  }) : [{
    id: `${item.id}-pending-inventory`, eventId: item.id, name: "General Admission",
    description: "Ticket inventory will be available soon", price: 0, currency: "VND",
    quantity: 0, sold: 0, minPerOrder: 1, maxPerOrder: 0,
    saleStart: item.saleStartsAtUtc ?? item.createdAtUtc,
    saleEnd: item.saleEndsAtUtc ?? start, status: "not_started" as const, benefits: [],
  }];

  const hasReservedSeating = mappedTickets.some((t) => t.inventoryMode === "ReservedSeating");
  const allFree = tickets.length > 0 && mappedTickets.every((t) => t.price === 0);
  const ticketingMode: Event["ticketingMode"] = hasReservedSeating
    ? "seating"
    : allFree
      ? "registration"
      : "tiered";

  const rounds: Event["rounds"] =
    item.sessions.length > 0
      ? item.sessions.map((s) => ({
          id: s.id,
          sessionId: s.id,
          date: dateInVietnamIso(s.startsAtUtc),
          startTime: timeInVietnam(s.startsAtUtc),
          endTime: timeInVietnam(s.endsAtUtc),
          title: s.name || item.name,
        }))
      : undefined;

  return {
    id: item.id,
    slug: item.slug,
    title: item.name,
    description: item.description,
    shortDescription: item.description,
    coverImage: item.imageUrl ?? fallbackImage,
    thumbnailImage: item.imageUrl ?? fallbackImage,
    category: item.category.toLowerCase() as EventCategory,
    ticketingMode,
    currency: mappedTickets[0]?.currency ?? "VND",
    enablePromoCode: ticketingMode === "tiered",
    rounds: hasReservedSeating || item.sessions.length > 1 ? rounds : undefined,
    organizer: {
      id: item.organizer.id,
      name: item.organizer.name,
      slug: item.organizer.slug,
      avatar: item.organizer.avatarUrl ?? null,
      description: item.organizer.description,
      website: item.organizer.websiteUrl ?? null,
      socialLinks: item.organizer.websiteUrl ? { website: item.organizer.websiteUrl } : {},
      verified: Boolean(item.organizer.isVerified),
      eventCount: item.organizer.eventCount,
      followerCount: item.organizer.followerCount ?? 0,
    },
    venue: {
      name: item.venue?.name ?? "Online Event",
      address: [item.venue?.addressLine, item.venue?.ward, item.venue?.district].filter(Boolean).join(", "),
      city: item.venue?.city ?? "Online",
      country: item.venue?.countryCode ?? "VN",
      latitude: 0,
      longitude: 0,
      capacity: tickets.reduce((sum, ticket) => sum + ticket.totalQuantity, 0),
      isOnline: !item.venue,
    },
    startDate: start,
    endDate: end,
    startTime: timeInVietnam(start),
    endTime: timeInVietnam(end),
    timezone: item.venue?.timeZone ?? "Asia/Ho_Chi_Minh",
    status: item.status.toLowerCase() as Event["status"],
    ticketTypes: mappedTickets,
    tags: [item.category],
    featured: false,
    viewCount: 0,
    createdAt: item.createdAtUtc,
    updatedAt: item.updatedAtUtc,
  };
}

export function dateInVietnamIso(value: string | Date): string {
  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: VIETNAM_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

export function timeInVietnam(value: string | Date): string {
  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: VIETNAM_TIME_ZONE, hour: "2-digit", minute: "2-digit", hourCycle: "h23",
  }).format(date);
}

export function toManagedEvent(item: ManagedEventDto): ManagedEvent {
  const session = item.sessions[0];
  const start = session?.startsAtUtc ?? item.saleStartsAtUtc ?? item.createdAtUtc;
  const end = session?.endsAtUtc ?? start;
  const status = item.status.toLowerCase() as Event["status"];
  const venue = item.venue;
  const tickets = item.sessions.flatMap((s) => s.ticketTypes ?? []);
  return {
    id: item.id,
    slug: item.slug,
    title: item.name,
    description: item.description,
    shortDescription: item.description,
    coverImage: item.imageUrl ?? fallbackImage,
    thumbnailImage: item.imageUrl ?? fallbackImage,
    category: item.category.toLowerCase() as EventCategory,
    organizer: {
      id: item.organizer?.id ?? item.organizerId,
      name: item.organizer?.name ?? "Organizer",
      slug: item.organizer?.slug ?? "organizer",
      avatar: null,
      description: item.organizer?.description ?? "",
      website: null,
      socialLinks: {},
      verified: false,
      eventCount: 0,
      followerCount: 0,
    },
    venue: {
      name: venue?.name ?? "Venue not set",
      address: venue?.addressLine ?? "",
      city: venue?.city ?? "",
      country: venue?.countryCode ?? "VN",
      latitude: 0,
      longitude: 0,
      capacity: tickets.reduce((sum, ticket) => sum + ticket.capacity, 0),
      isOnline: false,
    },
    startDate: start,
    endDate: end,
    startTime: timeInVietnam(start),
    endTime: timeInVietnam(end),
    timezone: venue?.timeZone ?? VIETNAM_TIME_ZONE,
    status,
    currency: tickets[0]?.currency ?? "VND",
    ticketTypes: tickets.length > 0 ? tickets.map((ticket) => ({
      id: ticket.id, eventId: item.id, name: ticket.name, description: "",
      price: ticket.price, currency: ticket.currency, quantity: ticket.capacity,
      sold: ticket.capacity - ticket.availableQuantity, maxPerOrder: ticket.maxPerOrder,
      saleStart: item.saleStartsAtUtc ?? start, saleEnd: item.saleEndsAtUtc ?? start,
      status: resolveTicketSaleStatus(ticket.availableQuantity, item.saleStartsAtUtc, item.saleEndsAtUtc), benefits: [],
      inventoryMode: ticket.inventoryMode, availableQuantity: ticket.availableQuantity,
    })) : [{
      id: `${item.id}-pending-inventory`, eventId: item.id, name: "General Admission",
      description: "Ticket inventory is not configured yet", price: 0, currency: "VND",
      quantity: 0, sold: 0, maxPerOrder: 0, saleStart: item.saleStartsAtUtc ?? start,
      saleEnd: item.saleEndsAtUtc ?? start, status: "not_started", benefits: [],
    }],
    tags: [item.category],
    featured: false,
    viewCount: 0,
    createdAt: item.createdAtUtc,
    updatedAt: item.updatedAtUtc,
    version: item.version,
    venueId: venue?.id,
    sessionIds: item.sessions.map((candidate) => candidate.id),
  };
}
