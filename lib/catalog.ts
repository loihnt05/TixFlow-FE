import type { Event, EventCategory } from "@/lib/mock/events";

export interface PublicOrganizerDto {
  id: string;
  name: string;
  slug: string;
  description: string;
  eventCount: number;
}

export interface PublicVenueDto {
  id: string;
  name: string;
  addressLine: string;
  ward?: string;
  district?: string;
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

const fallbackImage = "https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=1200&q=80";

export function toPublicEvent(item: PublicEventDto): Event {
  const session = item.sessions[0];
  const start = session?.startsAtUtc ?? item.saleStartsAtUtc ?? item.createdAtUtc;
  const end = session?.endsAtUtc ?? start;
  const tickets = session?.ticketTypes ?? [];
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
      id: item.organizer.id,
      name: item.organizer.name,
      slug: item.organizer.slug,
      avatar: null,
      description: item.organizer.description,
      website: null,
      socialLinks: {},
      verified: false,
      eventCount: item.organizer.eventCount,
      followerCount: 0,
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
    ticketTypes: tickets.length > 0 ? tickets.map((ticket) => ({
      id: ticket.id,
      eventId: item.id,
      name: ticket.name,
      description: ticket.description,
      price: ticket.price,
      currency: ticket.currency,
      quantity: ticket.totalQuantity,
      sold: ticket.totalQuantity - ticket.availableQuantity,
      maxPerOrder: ticket.maxPerOrder,
      saleStart: ticket.saleStartsAtUtc ?? item.saleStartsAtUtc ?? item.createdAtUtc,
      saleEnd: ticket.saleEndsAtUtc ?? item.saleEndsAtUtc ?? start,
      status: ticket.availableQuantity <= 0 ? "sold_out" : "available",
      benefits: [],
      inventoryMode: ticket.inventoryMode,
      availableQuantity: ticket.availableQuantity,
      seats: ticket.seats,
    })) : [{
      id: `${item.id}-pending-inventory`, eventId: item.id, name: "General Admission",
      description: "Ticket inventory will be available soon", price: 0, currency: "VND",
      quantity: 0, sold: 0, maxPerOrder: 0,
      saleStart: item.saleStartsAtUtc ?? item.createdAtUtc,
      saleEnd: item.saleEndsAtUtc ?? start, status: "not_started", benefits: [],
    }],
    tags: [item.category],
    featured: false,
    viewCount: 0,
    createdAt: item.createdAtUtc,
    updatedAt: item.updatedAtUtc,
  };
}

function timeInVietnam(value: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Ho_Chi_Minh", hour: "2-digit", minute: "2-digit", hourCycle: "h23",
  }).format(new Date(value));
}

export function toManagedEvent(item: ManagedEventDto): ManagedEvent {
  const session = item.sessions[0];
  const start = session?.startsAtUtc ?? item.saleStartsAtUtc ?? item.createdAtUtc;
  const end = session?.endsAtUtc ?? start;
  const status = item.status.toLowerCase() as Event["status"];
  const venue = item.venue;
  const tickets = session?.ticketTypes ?? [];
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
      capacity: 0,
      isOnline: false,
    },
    startDate: start,
    endDate: end,
    startTime: new Date(start).toISOString().slice(11, 16),
    endTime: new Date(end).toISOString().slice(11, 16),
    timezone: venue?.timeZone ?? "Asia/Ho_Chi_Minh",
    status,
    ticketTypes: tickets.length > 0 ? tickets.map((ticket) => ({
      id: ticket.id, eventId: item.id, name: ticket.name, description: "",
      price: ticket.price, currency: ticket.currency, quantity: ticket.capacity,
      sold: ticket.capacity - ticket.availableQuantity, maxPerOrder: ticket.maxPerOrder,
      saleStart: item.saleStartsAtUtc ?? start, saleEnd: item.saleEndsAtUtc ?? start,
      status: ticket.availableQuantity <= 0 ? "sold_out" : "available", benefits: [],
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
