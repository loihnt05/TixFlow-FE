import { mockOrganizers } from "@/lib/mock/organizers";

export type TicketingMode = "registration" | "tiered" | "seating" | "showcase";

export interface EventTheme {
  mode?: "light" | "dark";
  primaryColor?: string;
  primaryHover?: string;
  buttonTextColor?: string;
  softBgColor?: string;
  pageBgColor?: string;
  pageBgImage?: string;
  phaseHeaderStyle?: "dark" | "brand" | "outline";
}

export interface TicketPhase {
  id: string;
  name: string;
  defaultOpen?: boolean;
}

export interface PromoCodeRule {
  code: string;
  discountType: "percent" | "fixed";
  amount: number;
  label?: string;
}

export interface EventRound {
  id: string;
  date: string; // YYYY-MM-DD
  startTime: string;
  endTime: string;
  title: string;
  sessionId?: string;
}

export interface EventZone {
  id: string;
  name: string;
  tierLabel: string;
  price: number;
  currency: string;
  color: string;
  ticketTypeId: string;
  rows: string[];
  seatsPerRow: number;
  soldSeats?: string[];
  heldSeats?: string[];
  benefits?: string[];
}

export interface ResaleListing {
  id: string;
  roundId: string;
  dateLabel: string;
  roundLabel: string;
  zoneId: string;
  ticketTypeName: string;
  seatLabel: string;
  originalPrice: number;
  resalePrice: number;
  currency: string;
  sellerCode: string;
  verified: boolean;
  listedAt: string;
}

export interface TicketAddon {
  id: string;
  name: string;
  timeLabel: string;
  stage: string;
  price: number;
  spotsLeft: number;
}

export interface EventAdmissionPolicy {
  bullets: string[];
  updatedAt: string;
  policyImageUrl?: string;
}

export interface Event {
  id: string;
  slug: string;
  title: string;
  description: string;
  shortDescription: string;
  coverImage: string;
  thumbnailImage: string;
  fallbackImage?: string;
  category: EventCategory;
  zipeventCategory?: string;
  venueType?: "Offline" | "Online" | "Hybrid";
  dateRangeLabel?: string;
  ctaLabel?: "Get Ticket" | "View Event" | "Rerun" | "Free Register" | "Register" | "Sold Out";
  organizer: Organizer;
  venue: Venue;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  timezone: string;
  status: EventStatus;
  ticketTypes: TicketType[];
  tags: string[];
  featured: boolean;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
  // Authentic Zipevent Event & Ticketing Format Configurations
  ticketingMode?: TicketingMode;
  theme?: EventTheme;
  currency?: string;
  vatRate?: number;
  vatIncluded?: boolean;
  enablePromoCode?: boolean;
  promoCodes?: PromoCodeRule[];
  registrationStyle?: "stepper" | "radio";
  requirePromoToUnlock?: boolean;
  roundBookingType?: "seats" | "tickets";
  defaultSelectedTicketId?: string;
  showcaseBadge?: string;
  ticketPhases?: TicketPhase[];
  rounds?: EventRound[];
  zones?: EventZone[];
  zoneMapImage?: string;
  resaleEnabled?: boolean;
  resaleListings?: ResaleListing[];
  admissionPolicy?: EventAdmissionPolicy;
  infoBanners?: string[];
}

export type EventCategory =
  | "technology"
  | "business"
  | "music"
  | "education"
  | "workshop"
  | "conference"
  | "networking"
  | "entertainment"
  | "community"
  | "health"
  | "art"
  | "food";

export type EventStatus = "draft" | "published" | "cancelled" | "completed" | "sold_out";

export interface Organizer {
  id: string;
  name: string;
  slug: string;
  avatar: string | null;
  description: string;
  website: string | null;
  socialLinks: SocialLinks;
  verified: boolean;
  eventCount: number;
  followerCount: number;
}

export interface SocialLinks {
  website?: string;
  facebook?: string;
  twitter?: string;
  instagram?: string;
  linkedin?: string;
  youtube?: string;
  github?: string;
  behance?: string;
  telegram?: string;
  discord?: string;
}

export interface Venue {
  name: string;
  address: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  capacity: number;
  isOnline: boolean;
  onlineUrl?: string;
}

export interface TicketType {
  id: string;
  eventId: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  quantity: number;
  sold: number;
  minPerOrder?: number;
  maxPerOrder: number;
  saleStart: string;
  saleEnd: string;
  saleStartLabel?: string;
  saleEndLabel?: string;
  phaseId?: string;
  addons?: TicketAddon[];
  status: TicketStatus;
  benefits: string[];
  inventoryMode?: "GeneralAdmission" | "ReservedSeating";
  availableQuantity?: number;
  seats?: SeatAvailability[];
}

export interface SeatAvailability {
  id: string;
  section: string;
  rowLabel: string;
  seatNumber: string;
  isAccessible: boolean;
  status: "Available" | "Held" | "Sold" | "Unavailable";
}

export type TicketStatus = "available" | "sold_out" | "ended" | "not_started";

export interface EventFilters {
  query?: string;
  category?: EventCategory;
  city?: string;
  dateFrom?: string;
  dateTo?: string;
  priceMin?: number;
  priceMax?: number;
  status?: EventStatus;
  sortBy?: EventSortBy;
  page?: number;
  limit?: number;
}

export type EventSortBy = "date_asc" | "date_desc" | "price_asc" | "price_desc" | "popularity" | "newest";

export interface PaginatedEvents {
  events: Event[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const eventCategories: { value: EventCategory; label: string; icon: string }[] = [
  { value: "music", label: "Music & Concerts", icon: "♫" },
  { value: "entertainment", label: "Films & Live Shows", icon: "◎" },
  { value: "art", label: "Art & Design", icon: "✿" },
  { value: "technology", label: "IT & Tech", icon: "⌘" },
  { value: "business", label: "Business & Seminars", icon: "▥" },
  { value: "conference", label: "Conferences & Summits", icon: "◇" },
  { value: "education", label: "Education & Talks", icon: "▤" },
  { value: "food", label: "Food & Drink", icon: "◒" },
  { value: "workshop", label: "Workshops & Craft", icon: "✦" },
  { value: "networking", label: "Networking & Career", icon: "↗" },
  { value: "community", label: "Community & Culture", icon: "♡" },
  { value: "health", label: "Health & Beauty", icon: "✚" },
];

export interface ZipeventSidebarCategory {
  label: string;
  mappedCategories: EventCategory[];
  iconUrl: string;
}

export const zipeventSidebarCategories: ZipeventSidebarCategory[] = [
  {
    label: "Music & Performance",
    mappedCategories: ["music"],
    iconUrl: "https://cdnali.zipeventapp.com/images/event_categories/p/199E25B6-A939-4B8F-A7C5-6F77245754A1.png",
  },
  {
    label: "Nightlife",
    mappedCategories: ["entertainment"],
    iconUrl: "https://cdnali.zipeventapp.com/images/event_categories/p/4E345D41-D32C-4E12-B00C-398EFA405AB6.png",
  },
  {
    label: "Art & Design",
    mappedCategories: ["art"],
    iconUrl: "https://cdnali.zipeventapp.com/images/event_categories/p/02F03C4E-5A66-476A-9051-27B719DAB80A.png",
  },
  {
    label: "Festival",
    mappedCategories: ["entertainment", "music"],
    iconUrl: "https://cdnali.zipeventapp.com/images/event_categories/p/6494D9B7-F707-4AEC-989B-29B46ABA30C6.png",
  },
  {
    label: "Cartoon & Gaming",
    mappedCategories: ["entertainment"],
    iconUrl: "https://cdnali.zipeventapp.com/images/event_categories/p/894572C7-A091-46EA-9511-6130570BA197.png",
  },
  {
    label: "IT & Tech",
    mappedCategories: ["technology"],
    iconUrl: "https://cdnali.zipeventapp.com/images/event_categories/p/EED828E1-AA64-46AB-A86D-CA4B23033799.png",
  },
  {
    label: "Business",
    mappedCategories: ["business", "conference"],
    iconUrl: "https://cdnali.zipeventapp.com/images/event_categories/p/DE67B02A-6EC2-415D-ABC7-9A33F26CCC12.png",
  },
  {
    label: "Money & Wealth",
    mappedCategories: ["business"],
    iconUrl: "https://cdnali.zipeventapp.com/images/event_categories/p/3BF89E27-3D8E-4280-8DD8-F199B0CEEDB2.png",
  },
  {
    label: "Self-Improvement",
    mappedCategories: ["education", "workshop"],
    iconUrl: "https://cdnali.zipeventapp.com/images/event_categories/p/184BEBDD-D496-4475-A108-B47AD1D89040.png",
  },
  {
    label: "Education",
    mappedCategories: ["education"],
    iconUrl: "https://cdnali.zipeventapp.com/images/event_categories/p/3D092FD1-08BC-40F5-9B76-433235245DBA.png",
  },
  {
    label: "Health & Beauty",
    mappedCategories: ["health"],
    iconUrl: "https://cdnali.zipeventapp.com/images/event_categories/p/294C8298-69E7-4512-9FAA-D5065E886EBD.png",
  },
  {
    label: "Food & Drink",
    mappedCategories: ["food"],
    iconUrl: "https://cdnali.zipeventapp.com/images/event_categories/p/A4E3AC0A-FBC1-47E4-AD2B-4F99CCAAD099.png",
  },
  {
    label: "Fashion",
    mappedCategories: ["art"],
    iconUrl: "https://cdnali.zipeventapp.com/images/event_categories/p/FD75DC3D-CA9E-4890-A896-821A9F5429AF.png",
  },
  {
    label: "Shopping",
    mappedCategories: ["community"],
    iconUrl: "https://cdnali.zipeventapp.com/images/event_categories/p/F334948C-8AE5-4E2A-B477-B676534958D9.png",
  },
  {
    label: "Travel",
    mappedCategories: ["community"],
    iconUrl: "https://cdnali.zipeventapp.com/images/event_categories/p/FF7F23F2-0FD0-43BF-AD98-4F210565CD50.png",
  },
  {
    label: "Sports & Leisure",
    mappedCategories: ["health", "entertainment"],
    iconUrl: "https://cdnali.zipeventapp.com/images/event_categories/p/543DBFD1-D4B6-469D-A228-30D44DA7EE48.png",
  },
  {
    label: "Home & Decor",
    mappedCategories: ["workshop", "art"],
    iconUrl: "https://cdnali.zipeventapp.com/images/event_categories/p/01D125AC-6B45-40EC-9F38-9913BF533961.png",
  },
  {
    label: "Job & Career",
    mappedCategories: ["networking"],
    iconUrl: "https://cdnali.zipeventapp.com/images/event_categories/p/67A36172-A38A-4F44-9C7A-F47408433116.png",
  },
  {
    label: "Book",
    mappedCategories: ["education"],
    iconUrl: "https://cdnali.zipeventapp.com/images/event_categories/p/CA645666-7B01-41BD-89C8-A3E8ABF5AB8A.png",
  },
  {
    label: "Social Causes",
    mappedCategories: ["community"],
    iconUrl: "https://cdnali.zipeventapp.com/images/event_categories/p/A571C613-94C4-4F8B-B549-1EADD758E687.png",
  },
];

const unsplash = (id: string, w = 960) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=82`;

interface EventSeed {
  slug?: string;
  title: string;
  category: EventCategory;
  zipeventCategory: string;
  venueType: "Offline" | "Online" | "Hybrid";
  shortDescription: string;
  venue: Venue;
  posterUrl: string;
  coverUrl: string;
  fallbackId: string;
  dateRangeLabel: string;
  startIso: string;
  endIso: string;
  startTime: string;
  endTime: string;
  price: number;
  ctaLabel?: Event["ctaLabel"];
  featured?: boolean;
}

const eventSeeds: EventSeed[] = [
  // Row 1 — Exact 5 iconic cards matching Zipevent Register & Tickets reference
  {
    slug: "fahlanna-art-museum",
    title: "Fahlanna Art Museum",
    category: "art",
    zipeventCategory: "Art & Design",
    venueType: "Offline",
    shortDescription:
      "Northern Thailand's landmark contemporary heritage museum celebrating Lanna textile craft, sculpture, and living performance art.",
    venue: {
      name: "FAM Fahlanna Art Museum",
      address: "Nimmanhaemin Rd, Suthep",
      city: "Chiang Mai",
      country: "Thailand",
      latitude: 18.796,
      longitude: 98.968,
      capacity: 600,
      isOnline: false,
    },
    posterUrl:
      "https://cdnali.zipeventapp.com/images/events/5D839D0E-DF53-494A-9791-0917A7CB07F2/30B95D7E-65F6-4D3B-892C-E360EF275AD0.jpg.webp",
    coverUrl: unsplash("photo-1547891654-e66ed7ebb968", 1400),
    fallbackId: "photo-1547891654-e66ed7ebb968",
    dateRangeLabel: "10 Oct 2025 - 31 Oct 2028",
    startIso: "2026-10-12T10:00:00Z",
    endIso: "2028-10-31T18:00:00Z",
    startTime: "10:00",
    endTime: "19:00",
    price: 250000,
    ctaLabel: "Get Ticket",
    featured: true,
  },
  {
    slug: "the-lighthouse-sala-saneha",
    title: "The Lighthouse",
    category: "entertainment",
    zipeventCategory: "Festival",
    venueType: "Offline",
    shortDescription:
      "Special 35mm-inspired cinema screening of Robert Eggers' hypnotic black-and-white psychological masterpiece starring Willem Dafoe and Robert Pattinson.",
    venue: {
      name: "Sala Saneha",
      address: "268 Phra Athit Rd, Phra Nakhon",
      city: "Bangkok",
      country: "Thailand",
      latitude: 13.763,
      longitude: 100.495,
      capacity: 140,
      isOnline: false,
    },
    posterUrl:
      "https://cdnali.zipeventapp.com/images/events/74FCCD13-7E0F-4673-A146-39830A5262AD/5E05581E-54BF-4D46-A1F6-BBBA5574C388.jpg.webp",
    coverUrl: unsplash("photo-1489599849927-2ee91cede3ba", 1400),
    fallbackId: "photo-1489599849927-2ee91cede3ba",
    dateRangeLabel: "1 - 31 Oct 2026",
    startIso: "2026-10-14T19:00:00Z",
    endIso: "2026-10-31T22:00:00Z",
    startTime: "19:30",
    endTime: "21:45",
    price: 180000,
    ctaLabel: "Get Ticket",
  },
  {
    slug: "space-time-cube-plus",
    title: "Space & Time Cube+",
    category: "art",
    zipeventCategory: "Art & Design",
    venueType: "Offline",
    shortDescription:
      "Thailand's first immersive 720-degree holographic and naked-eye 3D digital art museum across 27 themed cosmic rooms.",
    venue: {
      name: "Seacon Bangkae",
      address: "607 Phetkasem Rd,Phasi Charoen",
      city: "Bangkok",
      country: "Thailand",
      latitude: 13.712,
      longitude: 100.434,
      capacity: 850,
      isOnline: false,
    },
    posterUrl:
      "https://cdnali.zipeventapp.com/images/events/46286ED9-2BA5-4526-B1E2-AF0760186611/C83C9E83-5784-440F-B177-CFF2F2BEF154.jpg.webp",
    coverUrl: unsplash("photo-1518709268805-4e9042af9f23", 1400),
    fallbackId: "photo-1518709268805-4e9042af9f23",
    dateRangeLabel: "1 Mar 2025 - 28 Feb 2027",
    startIso: "2026-10-11T10:30:00Z",
    endIso: "2027-02-28T20:00:00Z",
    startTime: "10:30",
    endTime: "21:00",
    price: 390000,
    ctaLabel: "Get Ticket",
    featured: true,
  },
  {
    slug: "naza-documentary-screening",
    title: "NAZA",
    category: "entertainment",
    zipeventCategory: "Festival",
    venueType: "Offline",
    shortDescription:
      "Independent cinema showcase from the acclaimed international documentary selection, followed by an intimate curator Q&A session.",
    venue: {
      name: "Sala Saneha",
      address: "268 Phra Athit Rd, Phra Nakhon",
      city: "Bangkok",
      country: "Thailand",
      latitude: 13.763,
      longitude: 100.495,
      capacity: 120,
      isOnline: false,
    },
    posterUrl:
      "https://cdnali.zipeventapp.com/images/events/03135A55-B472-4D04-BFCC-BA29938ED919/214BBF7A-5ECC-42D6-861A-91C959CE2832.jpg.webp",
    coverUrl: unsplash("photo-1517604931442-7e0c8ed2963c", 1400),
    fallbackId: "photo-1517604931442-7e0c8ed2963c",
    dateRangeLabel: "1 - 31 Oct 2026",
    startIso: "2026-10-15T18:30:00Z",
    endIso: "2026-10-31T21:30:00Z",
    startTime: "18:30",
    endTime: "21:00",
    price: 180000,
    ctaLabel: "Get Ticket",
  },
  {
    slug: "teenage-sex-and-death-at-camp-miasma",
    title: "Teenage Sex and Death at Camp Miasma",
    category: "entertainment",
    zipeventCategory: "Nightlife",
    venueType: "Offline",
    shortDescription:
      "Jane Schoenbrun's neon-drenched midnight cult slasher fever dream starring Hannah Einbinder and Gillian Anderson.",
    venue: {
      name: "Sala Saneha",
      address: "268 Phra Athit Rd, Phra Nakhon",
      city: "Bangkok",
      country: "Thailand",
      latitude: 13.763,
      longitude: 100.495,
      capacity: 140,
      isOnline: false,
    },
    posterUrl:
      "https://cdnali.zipeventapp.com/images/events/3954FC40-D676-4941-8EF1-BA62B84497FB/094E6C10-A993-4C48-B7D6-2B08A7AD7B63.jpg.webp",
    coverUrl: unsplash("photo-1536440136628-849c177e76a1", 1400),
    fallbackId: "photo-1536440136628-849c177e76a1",
    dateRangeLabel: "1 - 31 Oct 2026",
    startIso: "2026-10-16T20:00:00Z",
    endIso: "2026-10-31T23:00:00Z",
    startTime: "20:00",
    endTime: "22:15",
    price: 190000,
    ctaLabel: "Get Ticket",
  },

  // Row 2 — Iconic Films, Concerts, Fanmeetings & Exhibitions from Zipevent
  {
    slug: "the-shining-4k-screening",
    title: "The Shining",
    category: "entertainment",
    zipeventCategory: "Nightlife",
    venueType: "Offline",
    shortDescription:
      "Stanley Kubrick's legendary Overlook Hotel psychological horror classic presented in remastered 4K theatrical projection.",
    venue: {
      name: "Sala Saneha",
      address: "268 Phra Athit Rd, Phra Nakhon",
      city: "Bangkok",
      country: "Thailand",
      latitude: 13.763,
      longitude: 100.495,
      capacity: 140,
      isOnline: false,
    },
    posterUrl:
      "https://cdnali.zipeventapp.com/images/events/03C62FEA-9052-4A87-ADE4-78CFE73D1988/E0792AE8-B3E0-450B-8D08-B00D53B9FACF.jpg.webp",
    coverUrl: unsplash("photo-1478720568477-152d9b164e26", 1400),
    fallbackId: "photo-1478720568477-152d9b164e26",
    dateRangeLabel: "1 - 31 Oct 2026",
    startIso: "2026-10-18T19:00:00Z",
    endIso: "2026-10-31T22:00:00Z",
    startTime: "19:00",
    endTime: "21:30",
    price: 180000,
    ctaLabel: "Get Ticket",
  },
  {
    slug: "after-hours-cinema-club",
    title: "After Hours",
    category: "entertainment",
    zipeventCategory: "Nightlife",
    venueType: "Offline",
    shortDescription:
      "Martin Scorsese's electric SoHo dark-comedy odyssey screened in a boutique cinema setting with vinyl lounge prelude.",
    venue: {
      name: "Sala Saneha",
      address: "268 Phra Athit Rd, Phra Nakhon",
      city: "Bangkok",
      country: "Thailand",
      latitude: 13.763,
      longitude: 100.495,
      capacity: 140,
      isOnline: false,
    },
    posterUrl:
      "https://cdnali.zipeventapp.com/images/events/2D238DB5-3A08-4A7D-8D12-63130A88F072/C349C925-3758-40DA-9755-6DDB78C1A198.jpg.webp",
    coverUrl: unsplash("photo-1514306191717-452ec28c7814", 1400),
    fallbackId: "photo-1514306191717-452ec28c7814",
    dateRangeLabel: "1 - 31 Oct 2026",
    startIso: "2026-10-19T20:00:00Z",
    endIso: "2026-10-31T23:00:00Z",
    startTime: "20:00",
    endTime: "22:00",
    price: 180000,
    ctaLabel: "Get Ticket",
  },
  {
    slug: "cave-fantasy-immersive-art",
    title: "Cave Fantasy",
    category: "art",
    zipeventCategory: "Art & Design",
    venueType: "Offline",
    shortDescription:
      "Step inside an infinite mirrored lantern cavern and interactive light-sound installation in the heart of Bangkok.",
    venue: {
      name: "MBK CENTER",
      address: "444 Phayathai Rd, Pathum Wan",
      city: "Bangkok",
      country: "Thailand",
      latitude: 13.744,
      longitude: 100.53,
      capacity: 500,
      isOnline: false,
    },
    posterUrl:
      "https://cdnali.zipeventapp.com/images/events/AC86ED1B-8B6F-4AE0-B508-B01345379DF0/61B856BA-970C-4A1B-B326-8E21EEEEE338.jpg.webp",
    coverUrl: unsplash("photo-1513364776144-60967b0f800f", 1400),
    fallbackId: "photo-1513364776144-60967b0f800f",
    dateRangeLabel: "1 Feb 2026 - 1 Feb 2027",
    startIso: "2026-10-11T11:00:00Z",
    endIso: "2027-02-01T21:00:00Z",
    startTime: "11:00",
    endTime: "21:00",
    price: 320000,
    ctaLabel: "Get Ticket",
  },
  {
    slug: "sangsom-presents-volume-phase-8",
    title: "SANGSOM PRESENTS VOLUME PHASE 8",
    category: "music",
    zipeventCategory: "Music & Performance",
    venueType: "Offline",
    shortDescription:
      "Multi-stage alternative rock, synth-pop, and underground live concert marathon featuring top regional headliners.",
    venue: {
      name: "The Street Hall Ratchada",
      address: "139 Ratchadaphisek Rd, Din Daeng",
      city: "Bangkok",
      country: "Thailand",
      latitude: 13.769,
      longitude: 100.573,
      capacity: 2200,
      isOnline: false,
    },
    posterUrl:
      "https://cdnali.zipeventapp.com/images/events/FFC22F54-3E13-4085-860B-3A1070A3103C/4A20EBC9-35ED-4112-886D-0C85702951F1.jpg.webp",
    coverUrl: unsplash("photo-1459749411175-04bf5292ceea", 1400),
    fallbackId: "photo-1459749411175-04bf5292ceea",
    dateRangeLabel: "10 Oct - 19 Dec 2026",
    startIso: "2026-10-24T17:00:00Z",
    endIso: "2026-12-19T23:30:00Z",
    startTime: "17:00",
    endTime: "23:30",
    price: 550000,
    ctaLabel: "Get Ticket",
    featured: true,
  },
  {
    slug: "dream-secret-a-new-musical",
    title: "\"Dream Secret\" A New Musical",
    category: "music",
    zipeventCategory: "Music & Performance",
    venueType: "Offline",
    shortDescription:
      "An original theatrical musical blending live chamber orchestration, surreal stagecraft, and contemporary storytelling.",
    venue: {
      name: "POEMS DIMENSION (Town in Town)",
      address: "Srivara Rd, Wang Thonglang",
      city: "Bangkok",
      country: "Thailand",
      latitude: 13.771,
      longitude: 100.608,
      capacity: 480,
      isOnline: false,
    },
    posterUrl:
      "https://cdnali.zipeventapp.com/images/events/A0FF6BC4-A931-48F8-BBD6-1D195053C312/FB2ED6A8-E244-4DEF-A8AC-B2C84CC27792.jpg.webp",
    coverUrl: unsplash("photo-1507676184212-d03ab07a01bf", 1400),
    fallbackId: "photo-1507676184212-d03ab07a01bf",
    dateRangeLabel: "23 Oct - 1 Nov 2026",
    startIso: "2026-10-23T18:30:00Z",
    endIso: "2026-11-01T21:30:00Z",
    startTime: "19:00",
    endTime: "21:30",
    price: 680000,
    ctaLabel: "Get Ticket",
  },

  // Hero Wide Banner + Fanmeetings, Concerts & Exhibitions
  {
    slug: "ong-seongwu-fanmeeting-bangkok-2026",
    title: "2026 ONG SEONGWU FANMEETING <Let's go-ONG!> in Bangkok",
    category: "music",
    zipeventCategory: "Music & Performance",
    venueType: "Offline",
    shortDescription:
      "An unforgettable evening of live vocals, fan stages, and exclusive hi-touch moments with Ong Seongwu at Muangthai Rachadalai Theatre.",
    venue: {
      name: "Muangthai Rachadalai Theatre",
      address: "Esplanade Ratchada, 99 Ratchadaphisek Rd",
      city: "Bangkok",
      country: "Thailand",
      latitude: 13.766,
      longitude: 100.569,
      capacity: 1500,
      isOnline: false,
    },
    posterUrl: unsplash("photo-1540039155733-5bb30b53aa14", 900),
    coverUrl:
      "https://cdnali.zipeventapp.com/images/events/A2339AB0-CC45-4EF1-B767-90D789D3894E/xl-1DC8C26F-C478-43EE-B236-0A6AD5F04324.jpg.webp",
    fallbackId: "photo-1540039155733-5bb30b53aa14",
    dateRangeLabel: "31 Oct 2026 · 17:00",
    startIso: "2026-10-31T10:00:00Z",
    endIso: "2026-10-31T14:00:00Z",
    startTime: "17:00",
    endTime: "20:00",
    price: 1450000,
    ctaLabel: "Get Ticket",
    featured: true,
  },
  {
    slug: "kunawong-house-museum",
    title: "Kunawong House Museum",
    category: "art",
    zipeventCategory: "Art & Design",
    venueType: "Offline",
    shortDescription:
      "Over 1,000 museum-grade Thai modern paintings, rare sculptures, antique furniture, and architectural gardens open for curated tours.",
    venue: {
      name: "Kunawong House Museum",
      address: "Ladprao 54, Wang Thonglang",
      city: "Bangkok",
      country: "Thailand",
      latitude: 13.792,
      longitude: 100.594,
      capacity: 180,
      isOnline: false,
    },
    posterUrl:
      "https://cdnali.zipeventapp.com/images/events/20517C46-CE59-414B-9D36-B16967F8007B/F3F2A2F9-0F5A-4A7E-AA21-843EF2767FB4.jpg.webp",
    coverUrl: unsplash("photo-1518998053901-5348d3961a04", 1400),
    fallbackId: "photo-1518998053901-5348d3961a04",
    dateRangeLabel: "5 Jan 2025 - 27 Dec 2026",
    startIso: "2026-10-11T09:30:00Z",
    endIso: "2026-12-27T18:00:00Z",
    startTime: "09:30",
    endTime: "18:00",
    price: 290000,
    ctaLabel: "Get Ticket",
  },
  {
    slug: "space-time-cube-pattaya",
    title: "Space & Time Cube Pattaya",
    category: "art",
    zipeventCategory: "Travel",
    venueType: "Offline",
    shortDescription:
      "Coastal edition of the hit immersive sci-fi & digital projection art museum at Central Pattaya.",
    venue: {
      name: "Central Pattaya",
      address: "333/99 Pattaya Sai Song Rd",
      city: "Pattaya",
      country: "Thailand",
      latitude: 12.934,
      longitude: 100.883,
      capacity: 700,
      isOnline: false,
    },
    posterUrl:
      "https://cdnali.zipeventapp.com/images/events/A7ABC828-64A6-4FB0-ACA3-60693397E938/B143C07E-D3B2-44D1-9753-55AC69FEB13F.jpg.webp",
    coverUrl: unsplash("photo-1506157786151-b8491531f063", 1400),
    fallbackId: "photo-1506157786151-b8491531f063",
    dateRangeLabel: "9 Dec 2025 - 8 Dec 2026",
    startIso: "2026-10-13T10:00:00Z",
    endIso: "2026-12-08T21:00:00Z",
    startTime: "10:30",
    endTime: "21:30",
    price: 380000,
    ctaLabel: "Get Ticket",
  },
  {
    slug: "creative-talk-conference-2026",
    title: "CREATIVE TALK CONFERENCE 2026",
    category: "technology",
    zipeventCategory: "IT & Tech",
    venueType: "Online",
    shortDescription:
      "The Festival of Futuristic Minds — 60+ sessions on design systems, creative AI, product craft, and human-centered innovation.",
    venue: {
      name: "Online Event",
      address: "On-Demand Rerun",
      city: "Online",
      country: "Thailand",
      latitude: 0,
      longitude: 0,
      capacity: 5000,
      isOnline: true,
    },
    posterUrl:
      "https://cdnali.zipeventapp.com/images/events/14B40A10-90E7-4CE4-B7D9-D1E8FB51CA31/95A0C46E-7A75-4D27-8E74-8679C24C35AB.jpg.webp",
    coverUrl: unsplash("photo-1531058020387-3be344556be6", 1400),
    fallbackId: "photo-1531058020387-3be344556be6",
    dateRangeLabel: "19 Jun - 20 Dec 2026",
    startIso: "2026-10-22T09:00:00Z",
    endIso: "2026-12-20T23:59:00Z",
    startTime: "09:30",
    endTime: "18:00",
    price: 490000,
    ctaLabel: "Rerun",
  },
  {
    slug: "marketing-conference-2026-agentic",
    title: "Marketing Conference 2026: Agentic Marketing",
    category: "business",
    zipeventCategory: "Business",
    venueType: "Online",
    shortDescription:
      "Master autonomous growth workflows, brand storytelling, and full-funnel attribution with top CMO practitioners.",
    venue: {
      name: "Online Event",
      address: "On-Demand Rerun",
      city: "Online",
      country: "Thailand",
      latitude: 0,
      longitude: 0,
      capacity: 3500,
      isOnline: true,
    },
    posterUrl:
      "https://cdnali.zipeventapp.com/images/events/2863A5AD-B24F-4A38-B62E-72DDE8A5D12D/7D6C6664-4941-4F48-96B3-62B22ACC36C2.jpg.webp",
    coverUrl: unsplash("photo-1552664730-d307ca884978", 1400),
    fallbackId: "photo-1552664730-d307ca884978",
    dateRangeLabel: "29 Sep 2026 - 2 Apr 2027",
    startIso: "2026-10-25T09:00:00Z",
    endIso: "2027-04-02T23:59:00Z",
    startTime: "09:00",
    endTime: "17:30",
    price: 450000,
    ctaLabel: "Rerun",
  },
  {
    slug: "alpha-skills-summit-expo-2026",
    title: "Alpha Skills Summit & Expo 2026",
    category: "education",
    zipeventCategory: "Self-Improvement",
    venueType: "Online",
    shortDescription:
      "Future-proof your career with hands-on tracks in analytical thinking, AI productivity, leadership communication, and creative problem solving.",
    venue: {
      name: "Online Event",
      address: "On-Demand Rerun",
      city: "Online",
      country: "Thailand",
      latitude: 0,
      longitude: 0,
      capacity: 4000,
      isOnline: true,
    },
    posterUrl:
      "https://cdnali.zipeventapp.com/images/events/BDCF9CBE-28F8-4010-9CF3-262ED516A2F0/6DB6363D-EA08-4BFE-8188-6A83E30CA3AA.jpg.webp",
    coverUrl: unsplash("photo-1524178871053-8a632f6f5a7b", 1400),
    fallbackId: "photo-1524178871053-8a632f6f5a7b",
    dateRangeLabel: "12 May - 12 Nov 2026",
    startIso: "2026-10-27T09:00:00Z",
    endIso: "2026-11-12T23:59:00Z",
    startTime: "10:00",
    endTime: "18:00",
    price: 390000,
    ctaLabel: "Rerun",
  },
  {
    slug: "longtunman-summit-2026",
    title: "Longtunman SUMMIT 2026",
    category: "business",
    zipeventCategory: "Money & Wealth",
    venueType: "Hybrid",
    shortDescription:
      "Global macroeconomics, capital markets, and wealth-building insights from leading fund managers and entrepreneurs.",
    venue: {
      name: "Online Event",
      address: "QSNCC & Live Stream",
      city: "Bangkok",
      country: "Thailand",
      latitude: 13.723,
      longitude: 100.559,
      capacity: 3000,
      isOnline: true,
    },
    posterUrl:
      "https://cdnali.zipeventapp.com/images/events/422DA79E-4AEA-4302-B9A3-B2BC5879F421/25682CE6-21BE-46F2-AB52-02DDB5F1520A.jpg.webp",
    coverUrl: unsplash("photo-1460925895917-afdab827c52f", 1400),
    fallbackId: "photo-1460925895917-afdab827c52f",
    dateRangeLabel: "7 Oct - 7 Dec 2026",
    startIso: "2026-10-28T09:00:00Z",
    endIso: "2026-12-07T23:59:00Z",
    startTime: "09:30",
    endTime: "17:30",
    price: 690000,
    ctaLabel: "Get Ticket",
  },

  // Vietnam Concerts, Cinema, Exhibitions & Conferences (preserves backend compatibility slugs too)
  {
    slug: "vietnam-future-forum-2026",
    title: "Vietnam Future Forum 2026",
    category: "business",
    zipeventCategory: "Business",
    venueType: "Offline",
    shortDescription: "Ideas and leaders shaping the next chapter of Vietnam's digital economy.",
    venue: {
      name: "Saigon Riverside Center",
      address: "12 Ton Duc Thang, District 1",
      city: "Ho Chi Minh City",
      country: "Vietnam",
      latitude: 10.77,
      longitude: 106.72,
      capacity: 1200,
      isOnline: false,
    },
    posterUrl: unsplash("photo-1511578314322-379afb476865", 900),
    coverUrl: unsplash("photo-1511578314322-379afb476865", 1600),
    fallbackId: "photo-1511578314322-379afb476865",
    dateRangeLabel: "15 Nov 2026",
    startIso: "2026-11-15T02:00:00Z",
    endIso: "2026-11-15T10:00:00Z",
    startTime: "09:00",
    endTime: "17:00",
    price: 650000,
    ctaLabel: "Get Ticket",
    featured: true,
  },
  {
    slug: "saigon-indie-music-weekend",
    title: "Saigon Indie Music Weekend",
    category: "music",
    zipeventCategory: "Music & Performance",
    venueType: "Offline",
    shortDescription: "Two nights of live indie rock, dream-pop, and electronic sets from across Southeast Asia.",
    venue: {
      name: "Saigon Riverside Center",
      address: "12 Ton Duc Thang, District 1",
      city: "Ho Chi Minh City",
      country: "Vietnam",
      latitude: 10.76,
      longitude: 106.7,
      capacity: 900,
      isOnline: false,
    },
    posterUrl: unsplash("photo-1470229722913-7c0e2dbbafd3", 900),
    coverUrl: unsplash("photo-1470229722913-7c0e2dbbafd3", 1600),
    fallbackId: "photo-1470229722913-7c0e2dbbafd3",
    dateRangeLabel: "21 - 22 Nov 2026",
    startIso: "2026-11-21T12:00:00Z",
    endIso: "2026-11-22T16:00:00Z",
    startTime: "18:00",
    endTime: "23:00",
    price: 350000,
    ctaLabel: "Get Ticket",
  },
  {
    slug: "neon-symphony-anime-orchestra-live",
    title: "Neon Symphony: Anime & Film Score Live in Concert",
    category: "music",
    zipeventCategory: "Cartoon & Gaming",
    venueType: "Offline",
    shortDescription:
      "A 60-piece symphony orchestra performs iconic Studio Ghibli, Attack on Titan, and modern cinema soundtracks synchronized to giant projection visuals.",
    venue: {
      name: "Hoa Binh Theatre",
      address: "240 Ba Thang Hai, District 10",
      city: "Ho Chi Minh City",
      country: "Vietnam",
      latitude: 10.774,
      longitude: 106.674,
      capacity: 1800,
      isOnline: false,
    },
    posterUrl: unsplash("photo-1507838153414-b4b713384a76", 900),
    coverUrl: unsplash("photo-1507838153414-b4b713384a76", 1600),
    fallbackId: "photo-1507838153414-b4b713384a76",
    dateRangeLabel: "14 - 15 Nov 2026",
    startIso: "2026-11-14T12:30:00Z",
    endIso: "2026-11-15T15:30:00Z",
    startTime: "19:30",
    endTime: "22:00",
    price: 590000,
    ctaLabel: "Get Ticket",
  },
  {
    slug: "saigon-midnight-jazz-vinyl-session",
    title: "Midnight Jazz & Analog Vinyl Session",
    category: "music",
    zipeventCategory: "Nightlife",
    venueType: "Offline",
    shortDescription: "Intimate quartet improvisation, rare Japanese jazz pressings, and craft cocktails under open skies.",
    venue: {
      name: "The Garden Rooftop",
      address: "Pasteur, District 3",
      city: "Ho Chi Minh City",
      country: "Vietnam",
      latitude: 10.78,
      longitude: 106.69,
      capacity: 260,
      isOnline: false,
    },
    posterUrl: unsplash("photo-1511192336575-5a79af67a629", 900),
    coverUrl: unsplash("photo-1511192336575-5a79af67a629", 1600),
    fallbackId: "photo-1511192336575-5a79af67a629",
    dateRangeLabel: "28 Nov 2026",
    startIso: "2026-11-28T13:00:00Z",
    endIso: "2026-11-28T16:30:00Z",
    startTime: "20:00",
    endTime: "23:30",
    price: 280000,
    ctaLabel: "Get Ticket",
  },
  {
    slug: "specialty-coffee-culture-fair-2026",
    title: "The Specialty Coffee & Roasters Fair 2026",
    category: "food",
    zipeventCategory: "Food & Drink",
    venueType: "Offline",
    shortDescription: "120+ independent roasters, sensory cupping labs, and championship latte-art battles across Asia.",
    venue: {
      name: "Youth Cultural House",
      address: "4 Pham Ngoc Thach, District 1",
      city: "Ho Chi Minh City",
      country: "Vietnam",
      latitude: 10.78,
      longitude: 106.7,
      capacity: 1100,
      isOnline: false,
    },
    posterUrl: unsplash("photo-1442512595331-e89e73853f31", 900),
    coverUrl: unsplash("photo-1442512595331-e89e73853f31", 1600),
    fallbackId: "photo-1442512595331-e89e73853f31",
    dateRangeLabel: "5 - 6 Dec 2026",
    startIso: "2026-12-05T02:00:00Z",
    endIso: "2026-12-06T12:00:00Z",
    startTime: "09:00",
    endTime: "19:00",
    price: 0,
    ctaLabel: "Free Register",
  },
  {
    slug: "hanoi-arthouse-cinema-week-2026",
    title: "Hanoi Arthouse & Documentary Film Week",
    category: "entertainment",
    zipeventCategory: "Festival",
    venueType: "Offline",
    shortDescription: "Curated Southeast Asian independent films, restored classics, and director roundtables.",
    venue: {
      name: "National Cinema Center",
      address: "87 Lang Ha, Ba Dinh",
      city: "Hanoi",
      country: "Vietnam",
      latitude: 21.02,
      longitude: 105.81,
      capacity: 450,
      isOnline: false,
    },
    posterUrl: unsplash("photo-1524985069026-dd778a71c7b4", 900),
    coverUrl: unsplash("photo-1524985069026-dd778a71c7b4", 1600),
    fallbackId: "photo-1524985069026-dd778a71c7b4",
    dateRangeLabel: "10 - 16 Dec 2026",
    startIso: "2026-12-10T11:30:00Z",
    endIso: "2026-12-16T15:30:00Z",
    startTime: "18:30",
    endTime: "22:00",
    price: 120000,
    ctaLabel: "Get Ticket",
  },
  // Live Backend Database Slugs Enrichment (ensures 100% of localhost:8080 events get bespoke Zipevent themes)
  {
    slug: "ai-data-summit-vietnam",
    title: "AI & Data Summit Vietnam",
    category: "technology",
    zipeventCategory: "IT & Tech",
    venueType: "Offline",
    shortDescription:
      "Practical enterprise AI, LLM infrastructure, and production data engineering summit in Hanoi.",
    venue: {
      name: "Hanoi Innovation Hub",
      address: "29 Lieu Giai, Ba Dinh",
      city: "Hanoi",
      country: "Vietnam",
      latitude: 21.031,
      longitude: 105.814,
      capacity: 1800,
      isOnline: false,
    },
    posterUrl: unsplash("photo-1485827404703-89b55fcc595e", 900),
    coverUrl: unsplash("photo-1485827404703-89b55fcc595e", 1600),
    fallbackId: "photo-1485827404703-89b55fcc595e",
    dateRangeLabel: "28 Nov 2026",
    startIso: "2026-11-28T02:00:00Z",
    endIso: "2026-11-28T10:00:00Z",
    startTime: "09:00",
    endTime: "17:00",
    price: 890000,
    ctaLabel: "Get Ticket",
  },
  {
    slug: "creative-talk-design-tomorrow",
    title: "Creative Talk: Design Tomorrow",
    category: "art",
    zipeventCategory: "Art & Design",
    venueType: "Offline",
    shortDescription:
      "A full-day festival for product designers, creative directors, and visual storytellers in Da Nang.",
    venue: {
      name: "Da Nang Expo Center",
      address: "09 Cach Mang Thang Tam, Cam Le",
      city: "Da Nang",
      country: "Vietnam",
      latitude: 16.032,
      longitude: 108.212,
      capacity: 450,
      isOnline: false,
    },
    posterUrl: unsplash("photo-1531058020387-3be344556be6", 900),
    coverUrl: unsplash("photo-1531058020387-3be344556be6", 1600),
    fallbackId: "photo-1531058020387-3be344556be6",
    dateRangeLabel: "5 Dec 2026",
    startIso: "2026-12-05T02:00:00Z",
    endIso: "2026-12-05T10:00:00Z",
    startTime: "09:00",
    endTime: "17:00",
    price: 420000,
    ctaLabel: "Get Ticket",
  },
  {
    slug: "coffee-culture-fair",
    title: "The Coffee & Culture Fair",
    category: "food",
    zipeventCategory: "Food & Drink",
    venueType: "Offline",
    shortDescription:
      "Farm-to-cup Vietnamese specialty coffee tasting, roaster showcases, and artisan brew bars.",
    venue: {
      name: "Saigon Riverside Center",
      address: "12 Ton Duc Thang, District 1",
      city: "Ho Chi Minh City",
      country: "Vietnam",
      latitude: 10.77,
      longitude: 106.706,
      capacity: 900,
      isOnline: false,
    },
    posterUrl: unsplash("photo-1442512595331-e89e73853f31", 900),
    coverUrl: unsplash("photo-1442512595331-e89e73853f31", 1600),
    fallbackId: "photo-1442512595331-e89e73853f31",
    dateRangeLabel: "12 Dec 2026",
    startIso: "2026-12-12T02:00:00Z",
    endIso: "2026-12-12T10:00:00Z",
    startTime: "09:00",
    endTime: "17:00",
    price: 120000,
    ctaLabel: "Get Ticket",
  },
  {
    slug: "hanoi-product-meetup-18",
    title: "Hanoi Product Meetup 18",
    category: "networking",
    zipeventCategory: "Job & Career",
    venueType: "Offline",
    shortDescription:
      "Candid product war-stories, PM portfolio clinics, and founder-builder networking in Hanoi.",
    venue: {
      name: "Hanoi Innovation Hub",
      address: "29 Lieu Giai, Ba Dinh",
      city: "Hanoi",
      country: "Vietnam",
      latitude: 21.031,
      longitude: 105.814,
      capacity: 180,
      isOnline: false,
    },
    posterUrl: unsplash("photo-1517245386807-bb43f82c33c4", 900),
    coverUrl: unsplash("photo-1517245386807-bb43f82c33c4", 1600),
    fallbackId: "photo-1517245386807-bb43f82c33c4",
    dateRangeLabel: "18 Dec 2026",
    startIso: "2026-12-18T11:30:00Z",
    endIso: "2026-12-18T14:30:00Z",
    startTime: "18:30",
    endTime: "21:30",
    price: 0,
    ctaLabel: "Free Register",
  },
  {
    slug: "tixflow-flash-sale-demo",
    title: "TixFlow Flash Sale Live Arena",
    category: "music",
    zipeventCategory: "Music & Performance",
    venueType: "Offline",
    shortDescription:
      "High-concurrency arena concert showcase with real-time seat holds, Flash 50 drops, and VIP zones.",
    venue: {
      name: "TixFlow Arena",
      address: "01 Demo Boulevard, District 1",
      city: "Ho Chi Minh City",
      country: "Vietnam",
      latitude: 10.776,
      longitude: 106.701,
      capacity: 560,
      isOnline: false,
    },
    posterUrl: unsplash("photo-1493225457124-a3eb161ffa5f", 900),
    coverUrl: unsplash("photo-1493225457124-a3eb161ffa5f", 1600),
    fallbackId: "photo-1493225457124-a3eb161ffa5f",
    dateRangeLabel: "20 Dec 2026",
    startIso: "2026-12-20T12:00:00Z",
    endIso: "2026-12-20T15:00:00Z",
    startTime: "19:00",
    endTime: "22:00",
    price: 250000,
    ctaLabel: "Get Ticket",
  },
  {
    slug: "saigon-jazz-under-the-stars",
    title: "Saigon Jazz Under the Stars",
    category: "music",
    zipeventCategory: "Nightlife",
    venueType: "Offline",
    shortDescription:
      "Open-air riverside jazz concert celebrating brass ensembles, acoustic soul, and holiday melodies.",
    venue: {
      name: "Saigon Riverside Center",
      address: "12 Ton Duc Thang, District 1",
      city: "Ho Chi Minh City",
      country: "Vietnam",
      latitude: 10.77,
      longitude: 106.706,
      capacity: 280,
      isOnline: false,
    },
    posterUrl: unsplash("photo-1516280440614-37939bbacd81", 900),
    coverUrl: unsplash("photo-1516280440614-37939bbacd81", 1600),
    fallbackId: "photo-1516280440614-37939bbacd81",
    dateRangeLabel: "25 Dec 2026",
    startIso: "2026-12-25T12:00:00Z",
    endIso: "2026-12-25T15:00:00Z",
    startTime: "19:00",
    endTime: "22:00",
    price: 280000,
    ctaLabel: "Get Ticket",
  },
  {
    slug: "future-skills-for-everyone",
    title: "Future Skills for Everyone",
    category: "education",
    zipeventCategory: "Education",
    venueType: "Offline",
    shortDescription:
      "Hands-on workshop series on AI literacy, analytical problem-solving, and modern career adaptability.",
    venue: {
      name: "Da Nang Expo Center",
      address: "09 Cach Mang Thang Tam, Cam Le",
      city: "Da Nang",
      country: "Vietnam",
      latitude: 16.032,
      longitude: 108.212,
      capacity: 3000,
      isOnline: false,
    },
    posterUrl: unsplash("photo-1524178232363-1fb2b075b655", 900),
    coverUrl: unsplash("photo-1524178232363-1fb2b075b655", 1600),
    fallbackId: "photo-1524178232363-1fb2b075b655",
    dateRangeLabel: "8 Jan 2027",
    startIso: "2027-01-08T02:00:00Z",
    endIso: "2027-01-08T09:00:00Z",
    startTime: "09:00",
    endTime: "16:00",
    price: 150000,
    ctaLabel: "Get Ticket",
  },
  {
    slug: "startup-showcase-vietnam",
    title: "Startup Showcase Vietnam",
    category: "business",
    zipeventCategory: "Money & Wealth",
    venueType: "Offline",
    shortDescription:
      "Live demo night & investor matchmaking for early-stage founders across Southeast Asia.",
    venue: {
      name: "Hanoi Innovation Hub",
      address: "29 Lieu Giai, Ba Dinh",
      city: "Hanoi",
      country: "Vietnam",
      latitude: 21.031,
      longitude: 105.814,
      capacity: 350,
      isOnline: false,
    },
    posterUrl: unsplash("photo-1556761175-b413da4baf72", 900),
    coverUrl: unsplash("photo-1556761175-b413da4baf72", 1600),
    fallbackId: "photo-1556761175-b413da4baf72",
    dateRangeLabel: "15 Jan 2027",
    startIso: "2027-01-15T11:00:00Z",
    endIso: "2027-01-15T15:00:00Z",
    startTime: "18:00",
    endTime: "22:00",
    price: 200000,
    ctaLabel: "Get Ticket",
  },
];

export function resolveTicketingMode(event: Event): TicketingMode {
  if (event.ticketingMode) return event.ticketingMode;
  if (
    (event.zones && event.zones.length > 0) ||
    (event.rounds && event.rounds.length > 0) ||
    event.ticketTypes.some((t) => t.inventoryMode === "ReservedSeating")
  ) {
    return "seating";
  }
  const allFree =
    event.ticketTypes.length > 0 && event.ticketTypes.every((t) => t.price === 0);
  if (allFree) return "registration";
  return "tiered";
}

const flagshipZipeventShowcaseEvents: Event[] = [
  // 1. FORMAT A — Free Registration (Reference: https://www.zipeventapp.com/e/Work-Life-Festival-2026)
  {
    id: "event-zip-work-life-2026",
    slug: "Work-Life-Festival-2026",
    title: "Work Life Festival 2026",
    shortDescription:
      "The biggest career, upskilling, and financial freedom festival of the year — 2 main stages (SkillForce Stage & Make Rich Stage), 60+ speakers, and 50+ interactive sessions.",
    description:
      "Work Life Festival 2026 brings together Southeast Asia's leading career strategists, founders, creators, and personal finance educators under one roof at Samyan Mitrtown Hall.\n\nExplore two powerhouse stages:\n• SkillForce Stage — AI-era career acceleration, leadership communication, and future-proof digital craft.\n• Make Rich Stage — Modern wealth creation, smart portfolio allocation, and sustainable side-business blueprints.\n\nPlus: 1-on-1 Resume & Career Clinic, 40+ Employer & Learning Booths, and networking lounges throughout both festival days.",
    coverImage:
      "https://cdnali.zipeventapp.com/images/events/A0E9FAB9-F3FA-479D-A707-F64919FDCC34/xl-6F1EA346-2F3F-421E-B47D-4F61698AEC08.jpg.webp",
    thumbnailImage:
      "https://cdnali.zipeventapp.com/images/events/A0E9FAB9-F3FA-479D-A707-F64919FDCC34/xl-AAB814A7-6CA3-4921-BB71-2B656729B9CA.jpg",
    fallbackImage: unsplash("photo-1540575467063-178a50c2df87", 900),
    category: "networking",
    zipeventCategory: "Job & Career",
    venueType: "Offline",
    dateRangeLabel: "13 - 14 Nov 2026",
    ctaLabel: "Free Register",
    ticketingMode: "registration",
    currency: "THB",
    organizer: {
      id: "org-future-trends",
      name: "Future Trends",
      slug: "future-trends",
      avatar: unsplash("photo-1560179707-f14e90ef3623", 240),
      description:
        "Thailand's premier future-of-work, business innovation, and lifelong learning media & festival organizer.",
      website: "https://futuretrends.co",
      socialLinks: {
        website: "https://futuretrends.co",
        facebook: "https://facebook.com/futuretrends.th",
        instagram: "https://instagram.com/futuretrends.th",
      },
      verified: true,
      eventCount: 38,
      followerCount: 64000,
    },
    venue: {
      name: "Samyan Mitrtown Hall 5 Fl.",
      address: "944 Rama IV Rd, Wang Mai, Pathum Wan",
      city: "Bangkok",
      country: "Thailand",
      latitude: 13.7336,
      longitude: 100.5286,
      capacity: 3500,
      isOnline: false,
    },
    startDate: "2026-11-13T03:00:00Z",
    endDate: "2026-11-14T12:00:00Z",
    startTime: "10:00",
    endTime: "19:00",
    timezone: "Asia/Bangkok",
    status: "published",
    ticketTypes: [
      {
        id: "wlf-2026-free-reg",
        eventId: "event-zip-work-life-2026",
        name: "Free Registration",
        description:
          "บัตรเข้าร่วมงานฟรี พบ 2 เวทีหลัก ได้แก่ SkillForce Stage และ Make Rich Stage, 60+ Speakers และ 50+ Sessions",
        price: 0,
        currency: "THB",
        quantity: 3500,
        sold: 1420,
        minPerOrder: 1,
        maxPerOrder: 4,
        saleStart: "2026-09-01T00:00:00+07:00",
        saleEnd: "2026-11-14T19:00:00+07:00",
        saleEndLabel: "14 Nov 2026 19:00",
        status: "available",
        benefits: [
          "Full 2-day entry to SkillForce Stage & Make Rich Stage",
          "Instant QR e-Badge for express check-in & booth Passport",
        ],
        addons: [
          {
            id: "addon-skillforce-clinic",
            name: "1-on-1 Career & Portfolio Review Clinic (Day 1)",
            timeLabel: "13 Nov · 13:30 - 15:00",
            stage: "SkillForce Zone B",
            price: 0,
            spotsLeft: 42,
          },
          {
            id: "addon-makerich-lab",
            name: "Personal Wealth & Tax Allocation Workshop (Day 2)",
            timeLabel: "14 Nov · 15:30 - 17:00",
            stage: "Make Rich Room 2",
            price: 0,
            spotsLeft: 28,
          },
        ],
      },
    ],
    admissionPolicy: {
      bullets: [
        "Present your QR e-Ticket via the TixFlow web pass or email at Hall 5 Registration Counter.",
        "One registration grants re-entry access across both 13 and 14 November 2026.",
        "Workshop & Stage seating is allocated on a first-come, first-served basis — arrive 15 minutes before each session.",
      ],
      updatedAt: "15 Oct 2026 10:30",
    },
    tags: ["Job & Career", "Self-Improvement", "Festival"],
    featured: true,
    viewCount: 38400,
    createdAt: "2026-09-01T00:00:00+07:00",
    updatedAt: "2026-10-15T10:30:00+07:00",
  },

  // 2. FORMAT B — Paid Phase-Grouped Conference + Promo Code + Bundle Min/Max + VAT & Accepted Payments
  // (Reference: https://www.zipeventapp.com/e/ECONOMICFORUM2026)
  {
    id: "event-zip-economic-forum-2026",
    slug: "ECONOMICFORUM2026",
    title: "THE STANDARD ECONOMIC FORUM 2026: Reinvent Thailand",
    shortDescription:
      "Thailand's flagship 3-day economic, policy, and executive leadership summit uniting 100+ global policymakers, economists, and CEOs at QSNCC.",
    description:
      "THE STANDARD ECONOMIC FORUM 2026: Reinvent Thailand convenes national policymakers, global macro-economists, technology pioneers, and enterprise leaders for three transformative days.\n\nKey Summit Pillars:\n• Day 1 (4 Nov): Macroeconomic Reset, Geopolitics & ASEAN Capital Flows\n• Day 2 (5 Nov): Industrial Transformation, AI Productivity & Green Transition\n• Day 3 (6 Nov): Next-Gen Leadership, Wealth Strategy & Reinventing Growth\n\nAll passes include 6-month on-demand HD session replay access so you never miss a parallel stage.",
    coverImage:
      "https://cdnali.zipeventapp.com/images/events/C74F96D8-C6A4-4F5C-B9E3-606EF2ACBEF7/xl-47BA4487-7E19-48D3-A64F-84958895F8E8.jpg.webp",
    thumbnailImage:
      "https://cdnali.zipeventapp.com/images/events/C74F96D8-C6A4-4F5C-B9E3-606EF2ACBEF7/xl-136FA2B7-2FE1-413D-AA78-F6C9445173ED.jpg",
    fallbackImage: unsplash("photo-1515187029135-18ee286d815b", 900),
    category: "conference",
    zipeventCategory: "Money & Wealth",
    venueType: "Offline",
    dateRangeLabel: "4 - 6 Nov 2026",
    ctaLabel: "Get Ticket",
    ticketingMode: "tiered",
    currency: "THB",
    vatRate: 0.07,
    vatIncluded: true,
    enablePromoCode: true,
    promoCodes: [
      { code: "REINVENT10", discountType: "percent", amount: 10, label: "10% Partner Privilege" },
      { code: "STANDARD20", discountType: "percent", amount: 20, label: "20% Alumni / Press" },
      { code: "FORUM500", discountType: "fixed", amount: 500, label: "500 THB Instant Rebate" },
    ],
    ticketPhases: [
      { id: "phase-2", name: "Phase 2", defaultOpen: true },
      { id: "phase-3", name: "Phase 3", defaultOpen: false },
    ],
    organizer: {
      id: "org-the-standard",
      name: "THE STANDARD",
      slug: "the-standard",
      avatar: unsplash("photo-1486406146926-c627a92ad1ab", 240),
      description:
        "Leading creative news, business intelligence, and international forum organization in Thailand.",
      website: "https://thestandard.co",
      socialLinks: {
        website: "https://thestandard.co",
        facebook: "https://facebook.com/thestandardth",
        twitter: "https://x.com/thestandardth",
        youtube: "https://youtube.com/@thestandardco",
      },
      verified: true,
      eventCount: 54,
      followerCount: 195000,
    },
    venue: {
      name: "Royal Paragon Hall, 5th Floor, Siam Paragon",
      address: "991 Rama I Rd, Pathum Wan",
      city: "Bangkok",
      country: "Thailand",
      latitude: 13.7468,
      longitude: 100.535,
      capacity: 5000,
      isOnline: false,
    },
    startDate: "2026-11-04T02:00:00Z",
    endDate: "2026-11-06T11:00:00Z",
    startTime: "09:00",
    endTime: "18:00",
    timezone: "Asia/Bangkok",
    status: "published",
    ticketTypes: [
      {
        id: "eco-p2-early-bird",
        eventId: "event-zip-economic-forum-2026",
        phaseId: "phase-2",
        name: "Early Bird",
        description: "",
        price: 1990,
        currency: "THB",
        quantity: 800,
        sold: 540,
        minPerOrder: 1,
        maxPerOrder: 3,
        saleStart: "2026-09-15T00:00:00+07:00",
        saleEnd: "2026-11-03T23:59:00+07:00",
        saleEndLabel: "03 Nov 2026 23:59",
        status: "available",
        benefits: [
          "เข้าร่วมงานได้ทุกโซนและทุกเวทีตลอดทั้ง 3 วัน (4–6 พ.ย. 69) · Full 3-day access to all zones & stages",
          "ดูย้อนหลังทุก Session นาน 6 เดือน · 6-month on-demand session replay",
        ],
      },
      {
        id: "eco-p2-group",
        eventId: "event-zip-economic-forum-2026",
        phaseId: "phase-2",
        name: "Group Ticket",
        description:
          "ยิ่งมาเยอะ ยิ่งคุ้ม!\n- สามารถซื้อได้ตั้งแต่ 3-10 ใบ (Bundle 3–10 tickets per order)\n- ต้องกรอกข้อมูลของทุกคนตอนซื้อ",
        price: 990,
        currency: "THB",
        quantity: 1200,
        sold: 690,
        minPerOrder: 3,
        maxPerOrder: 10,
        saleStart: "2026-09-15T00:00:00+07:00",
        saleEnd: "2026-11-03T23:59:00+07:00",
        saleEndLabel: "03 Nov 2026 23:59",
        status: "available",
        benefits: [
          "เข้าร่วมงานได้ทุกโซนและทุกเวทีตลอดทั้ง 3 วัน (4–6 พ.ย. 69) · Full 3-day access to all zones & stages",
          "ดูย้อนหลังทุก Session นาน 6 เดือน · 6-month on-demand session replay",
        ],
      },
      {
        id: "eco-p2-corporate",
        eventId: "event-zip-economic-forum-2026",
        phaseId: "phase-2",
        name: "Corporate Ticket",
        description:
          "ราคาถูกที่สุด!\n- สำหรับการซื้อบัตร 10 ใบขึ้นไป (Minimum 10 tickets per order)\n- รองรับการออกใบกำกับภาษีเต็มรูปแบบ (Corporate Tax Invoice supported)",
        price: 890,
        currency: "THB",
        quantity: 1500,
        sold: 820,
        minPerOrder: 10,
        maxPerOrder: 50,
        saleStart: "2026-09-15T00:00:00+07:00",
        saleEnd: "2026-11-03T18:00:00+07:00",
        saleEndLabel: "03 Nov 2026 18:00",
        status: "available",
        benefits: [
          "เข้าร่วมงานได้ทุกโซนและทุกเวทีตลอดทั้ง 3 วัน (4–6 พ.ย. 69) · Full 3-day access to all zones & stages",
          "ดูย้อนหลังทุก Session นาน 6 เดือน · 6-month on-demand session replay",
        ],
      },
      {
        id: "eco-p2-day1",
        eventId: "event-zip-economic-forum-2026",
        phaseId: "phase-2",
        name: "1-Day Pass - 4 Nov",
        description: "เข้าร่วมงาน 1 วัน: 4 พ.ย. (Single-day pass for 4 Nov 2026)",
        price: 790,
        currency: "THB",
        quantity: 400,
        sold: 210,
        minPerOrder: 1,
        maxPerOrder: 5,
        saleStart: "2026-09-15T00:00:00+07:00",
        saleEnd: "2026-11-03T23:59:00+07:00",
        saleEndLabel: "03 Nov 2026 23:59",
        status: "available",
        benefits: [
          "เข้าร่วมงานได้ทุกโซนและทุกเวที เฉพาะวันที่ 4 พ.ย. 69 เท่านั้น",
          "ดูย้อนหลังทุก Session นาน 6 เดือน เฉพาะวันที่ 4 พ.ย. 69 เท่านั้น",
        ],
      },
      {
        id: "eco-p2-day2",
        eventId: "event-zip-economic-forum-2026",
        phaseId: "phase-2",
        name: "1-Day Pass - 5 Nov",
        description: "เข้าร่วมงาน 1 วัน: 5 พ.ย. (Single-day pass for 5 Nov 2026)",
        price: 790,
        currency: "THB",
        quantity: 400,
        sold: 195,
        minPerOrder: 1,
        maxPerOrder: 5,
        saleStart: "2026-09-15T00:00:00+07:00",
        saleEnd: "2026-11-03T23:59:00+07:00",
        saleEndLabel: "03 Nov 2026 23:59",
        status: "available",
        benefits: [
          "เข้าร่วมงานได้ทุกโซนและทุกเวที เฉพาะวันที่ 5 พ.ย. 69 เท่านั้น",
          "ดูย้อนหลังทุก Session นาน 6 เดือน เฉพาะวันที่ 5 พ.ย. 69 เท่านั้น",
        ],
      },
      {
        id: "eco-p2-day3",
        eventId: "event-zip-economic-forum-2026",
        phaseId: "phase-2",
        name: "1-Day Pass - 6 Nov",
        description: "เข้าร่วมงาน 1 วัน: 6 พ.ย. (Single-day pass for 6 Nov 2026)",
        price: 790,
        currency: "THB",
        quantity: 400,
        sold: 180,
        minPerOrder: 1,
        maxPerOrder: 5,
        saleStart: "2026-09-15T00:00:00+07:00",
        saleEnd: "2026-11-03T23:59:00+07:00",
        saleEndLabel: "03 Nov 2026 23:59",
        status: "available",
        benefits: [
          "เข้าร่วมงานได้ทุกโซนและทุกเวที เฉพาะวันที่ 6 พ.ย. 69 เท่านั้น",
          "ดูย้อนหลังทุก Session นาน 6 เดือน เฉพาะวันที่ 6 พ.ย. 69 เท่านั้น",
        ],
      },
      // Phase 3 — Upcoming / Walk-in Regular Tier
      {
        id: "eco-p3-regular",
        eventId: "event-zip-economic-forum-2026",
        phaseId: "phase-3",
        name: "Regular Ticket",
        description: "",
        price: 3990,
        currency: "THB",
        quantity: 500,
        sold: 0,
        minPerOrder: 1,
        maxPerOrder: 5,
        saleStart: "2026-11-04T00:00:00+07:00",
        saleEnd: "2026-11-06T16:00:00+07:00",
        saleStartLabel: "04 Nov 2026 00:00",
        status: "not_started",
        benefits: [
          "เข้าร่วมงานได้ทุกโซนและทุกเวทีตลอดทั้ง 3 วัน (4–6 พ.ย. 69)",
          "ดูย้อนหลังทุก Session นาน 6 เดือน",
        ],
      },
      {
        id: "eco-p3-day1",
        eventId: "event-zip-economic-forum-2026",
        phaseId: "phase-3",
        name: "1-Day Pass - 4 NOV",
        description: "เข้าร่วมงาน 1 วัน: 4 พ.ย.",
        price: 1590,
        currency: "THB",
        quantity: 200,
        sold: 0,
        minPerOrder: 1,
        maxPerOrder: 5,
        saleStart: "2026-11-04T00:00:00+07:00",
        saleEnd: "2026-11-04T16:00:00+07:00",
        saleStartLabel: "04 Nov 2026 00:00",
        status: "not_started",
        benefits: [
          "เข้าร่วมงานได้ทุกโซนและทุกเวที เฉพาะวันที่ 4 พ.ย. 69 เท่านั้น",
          "ดูย้อนหลังทุก Session นาน 6 เดือน เฉพาะวันที่ 4 พ.ย. 69 เท่านั้น",
        ],
      },
      {
        id: "eco-p3-day2",
        eventId: "event-zip-economic-forum-2026",
        phaseId: "phase-3",
        name: "1-Day Pass - 5 NOV",
        description: "เข้าร่วมงาน 1 วัน: 5 พ.ย.",
        price: 1590,
        currency: "THB",
        quantity: 200,
        sold: 0,
        minPerOrder: 1,
        maxPerOrder: 5,
        saleStart: "2026-11-04T00:00:00+07:00",
        saleEnd: "2026-11-05T16:00:00+07:00",
        saleStartLabel: "04 Nov 2026 00:00",
        status: "not_started",
        benefits: [
          "เข้าร่วมงานได้ทุกโซนและทุกเวที เฉพาะวันที่ 5 พ.ย. 69 เท่านั้น",
          "ดูย้อนหลังทุก Session นาน 6 เดือน เฉพาะวันที่ 5 พ.ย. 69 เท่านั้น",
        ],
      },
      {
        id: "eco-p3-day3",
        eventId: "event-zip-economic-forum-2026",
        phaseId: "phase-3",
        name: "1-Day Pass - 6 NOV",
        description: "เข้าร่วมงาน 1 วัน: 6 พ.ย.",
        price: 1590,
        currency: "THB",
        quantity: 200,
        sold: 0,
        minPerOrder: 1,
        maxPerOrder: 5,
        saleStart: "2026-11-04T00:00:00+07:00",
        saleEnd: "2026-11-06T16:00:00+07:00",
        saleStartLabel: "04 Nov 2026 00:00",
        status: "not_started",
        benefits: [
          "เข้าร่วมงานได้ทุกโซนและทุกเวที เฉพาะวันที่ 6 พ.ย. 69 เท่านั้น",
          "ดูย้อนหลังทุก Session นาน 6 เดือน เฉพาะวันที่ 6 พ.ย. 69 เท่านั้น",
        ],
      },
    ],
    admissionPolicy: {
      bullets: [
        "Tickets are non-refundable once issued, except in the event of official cancellation.",
        "All prices include 7% VAT. Official corporate tax invoices can be requested during checkout.",
        "Each attendee badge is personalized; please bring a valid ID or passport matching your registration name.",
        "6-month rerun access links are sent to each registered attendee's email within 7 business days after the forum.",
      ],
      updatedAt: "24 Oct 2026 14:15",
    },
    theme: {
      pageBgColor: "#F6F6F6",
      phaseHeaderStyle: "dark",
    },
    tags: ["Money & Wealth", "Business", "Self-Improvement", "Job & Career", "Industrial"],
    featured: true,
    viewCount: 52900,
    createdAt: "2026-09-10T00:00:00+07:00",
    updatedAt: "2026-10-24T14:15:00+07:00",
  },

  // 3. FORMAT C — Date & Round Calendar + Interactive Zone/Seat Map + Dark/Gold Branded Theme + Official P2P Ticket Resale
  // (Reference: https://www.zipeventapp.com/e/POLICE-IN-LOVE-FINAL-EPISODE)
  {
    id: "event-zip-police-in-love-final",
    slug: "POLICE-IN-LOVE-FINAL-EPISODE",
    title: "ที่รักสารวัตรเธียร์ l Police in Love - FINAL EPISODE",
    shortDescription:
      "Celebrate the grand finale screening, live OST stage, and exclusive cast fan benefits at MCC Hall 4F — The Mall Lifestore Ngamwongwan.",
    description:
      "Join the full cast of 'Police in Love (ที่รักสารวัตรเธียร์)' for an unforgettable Final Episode theatrical premiere, special live concert stage, behind-the-scenes talk, and Hi-Bye / Group Photo fan benefits.\n\nZone Pricing & Fan Benefits:\n• Zone A1–A6 (3,499 THB): VIP Front Arena Seating + Hi-Bye Session + 2:10 Group Photo + Official Photocard Set + Signed Poster Raffle\n• Zone B1–B2 (2,499 THB): Mid Arena Seating + Hi-Bye Session + 2:20 Group Photo + Official Photocard Set\n• Zone C1–C5 (1,499 THB): Elevated Standard Seating + Hi-Bye Session + Commemorative Poster & Photocard",
    coverImage:
      "https://cdnali.zipeventapp.com/images/events/A937F0ED-7502-47A0-8DEA-516CCF4D8C47/xl-94D81E21-EB57-4516-9BB3-F9EFEC0A765E.jpg.webp",
    thumbnailImage:
      "https://cdnali.zipeventapp.com/images/events/A937F0ED-7502-47A0-8DEA-516CCF4D8C47/xl-6934D2A4-10E4-4E99-99BD-01EAA3B3B73D.jpg",
    fallbackImage: unsplash("photo-1540039155733-5bb30b53aa14", 900),
    category: "music",
    zipeventCategory: "Music & Performance",
    venueType: "Offline",
    dateRangeLabel: "28 Nov 2026",
    ctaLabel: "Get Ticket",
    ticketingMode: "seating",
    currency: "THB",
    theme: {
      mode: "dark",
      primaryColor: "#F5C400",
      primaryHover: "#E0B100",
      buttonTextColor: "#111111",
      softBgColor: "#FFF9E6",
      pageBgColor: "#F6F6F6",
    },
    rounds: [
      {
        id: "round-28nov-1400",
        date: "2026-11-28",
        startTime: "14:00",
        endTime: "16:30",
        title: "ที่รักสารวัตรเธียร์ l Police in Love - FINAL EPISODE",
      },
      {
        id: "round-28nov-1830",
        date: "2026-11-28",
        startTime: "18:30",
        endTime: "21:00",
        title: "Police in Love - ENCORE FAN STAGE & TALK",
      },
    ],
    zones: [
      ...(["A1", "A2", "A3", "A4", "A5", "A6"] as const).map((z, idx) => ({
        id: z,
        name: `Zone ${z}`,
        tierLabel: "VIP Gold Zone (3,499 THB)",
        price: 3499,
        currency: "THB",
        color: "#F5C400",
        ticketTypeId: "pil-zone-a",
        rows: ["A", "B", "C", "D", "E"],
        seatsPerRow: 10,
        soldSeats: ["A-3", "A-4", "A-7", "B-5", "B-6", `C-${(idx % 6) + 2}`],
        heldSeats: ["A-5", "B-2"],
        benefits: ["Hi-Bye Session (All)", "Group Photo (2:10)", "Signed Poster Raffle", "Official Photocard Set"],
      })),
      ...(["B1", "B2"] as const).map((z) => ({
        id: z,
        name: `Zone ${z}`,
        tierLabel: "Mid Arena Zone (2,499 THB)",
        price: 2499,
        currency: "THB",
        color: "#F472B6",
        ticketTypeId: "pil-zone-b",
        rows: ["F", "G", "H", "J", "K"],
        seatsPerRow: 12,
        soldSeats: ["F-4", "F-5", "G-8", "H-3"],
        heldSeats: ["F-6"],
        benefits: ["Hi-Bye Session (All)", "Group Photo (2:20)", "Official Photocard Set"],
      })),
      ...(["C1", "C2", "C3", "C4", "C5"] as const).map((z) => ({
        id: z,
        name: `Zone ${z}`,
        tierLabel: "Standard Zone (1,499 THB)",
        price: 1499,
        currency: "THB",
        color: "#60A5FA",
        ticketTypeId: "pil-zone-c",
        rows: ["L", "M", "N", "P"],
        seatsPerRow: 10,
        soldSeats: ["L-2", "M-5"],
        heldSeats: ["L-6"],
        benefits: ["Hi-Bye Session (All)", "Official Poster & Photocard"],
      })),
    ],
    zoneMapImage:
      "https://cdnali.zipeventapp.com/images/events/A937F0ED-7502-47A0-8DEA-516CCF4D8C47/19830D49-9869-4E9A-A71F-44D1E61B84E7.jpg",
    resaleEnabled: true,
    resaleListings: [
      {
        id: "resale-pil-01",
        roundId: "round-28nov-1400",
        dateLabel: "28 Nov 2026",
        roundLabel: "14:00 - 16:30",
        zoneId: "A2",
        ticketTypeName: "VIP Gold Zone A",
        seatLabel: "A-04",
        originalPrice: 3499,
        resalePrice: 3499,
        currency: "THB",
        sellerCode: "Verified Fan #8841",
        verified: true,
        listedAt: "2 hours ago",
      },
      {
        id: "resale-pil-02",
        roundId: "round-28nov-1400",
        dateLabel: "28 Nov 2026",
        roundLabel: "14:00 - 16:30",
        zoneId: "A5",
        ticketTypeName: "VIP Gold Zone A",
        seatLabel: "B-06",
        originalPrice: 3499,
        resalePrice: 3350,
        currency: "THB",
        sellerCode: "Verified Fan #4109",
        verified: true,
        listedAt: "5 hours ago",
      },
      {
        id: "resale-pil-03",
        roundId: "round-28nov-1400",
        dateLabel: "28 Nov 2026",
        roundLabel: "14:00 - 16:30",
        zoneId: "B1",
        ticketTypeName: "Mid Arena Zone B",
        seatLabel: "F-05",
        originalPrice: 2499,
        resalePrice: 2400,
        currency: "THB",
        sellerCode: "Verified Fan #2290",
        verified: true,
        listedAt: "1 day ago",
      },
      {
        id: "resale-pil-04",
        roundId: "round-28nov-1830",
        dateLabel: "28 Nov 2026",
        roundLabel: "18:30 - 21:00",
        zoneId: "C3",
        ticketTypeName: "Standard Zone C",
        seatLabel: "L-02",
        originalPrice: 1499,
        resalePrice: 1450,
        currency: "THB",
        sellerCode: "Verified Fan #6712",
        verified: true,
        listedAt: "1 day ago",
      },
    ],
    organizer: {
      id: "org-argentis",
      name: "ARGENTIS",
      slug: "argentis",
      avatar: unsplash("photo-1514525253161-7a46d19cd819", 240),
      description:
        "Series production house and live entertainment promoter creating original drama series, concerts, and fan experiences.",
      website: "https://x.com/argentis_th",
      socialLinks: {
        twitter: "https://x.com/argentis_th",
        instagram: "https://instagram.com/argentis_th",
      },
      verified: true,
      eventCount: 12,
      followerCount: 82000,
    },
    venue: {
      name: "MCC Hall ชั้น 4 -The Mall Lifestore Ngamwongwan",
      address: "30/39-50 Ngamwongwan Rd, Bang Khen, Mueang Nonthaburi District",
      city: "Nonthaburi",
      country: "Thailand",
      latitude: 13.8558,
      longitude: 100.5422,
      capacity: 3000,
      isOnline: false,
    },
    startDate: "2026-11-28T07:00:00Z",
    endDate: "2026-11-28T09:30:00Z",
    startTime: "14:00",
    endTime: "16:30",
    timezone: "Asia/Bangkok",
    status: "published",
    ticketTypes: [
      {
        id: "pil-zone-a",
        eventId: "event-zip-police-in-love-final",
        name: "VIP Gold Zone (A1–A6)",
        description: "Front-stage reserved seating with Hi-Bye & 2:10 Group Photo privilege",
        price: 3499,
        currency: "THB",
        quantity: 300,
        sold: 192,
        minPerOrder: 1,
        maxPerOrder: 4,
        saleStart: "2026-10-01T10:00:00+07:00",
        saleEnd: "2026-11-28T13:00:00+07:00",
        status: "available",
        inventoryMode: "ReservedSeating",
        benefits: ["Hi-Bye Session", "Group Photo 2:10", "Official Photocard Set"],
      },
      {
        id: "pil-zone-b",
        eventId: "event-zip-police-in-love-final",
        name: "Mid Arena Zone (B1–B2)",
        description: "Center-view reserved seating with Hi-Bye & 2:20 Group Photo privilege",
        price: 2499,
        currency: "THB",
        quantity: 240,
        sold: 128,
        minPerOrder: 1,
        maxPerOrder: 4,
        saleStart: "2026-10-01T10:00:00+07:00",
        saleEnd: "2026-11-28T13:00:00+07:00",
        status: "available",
        inventoryMode: "ReservedSeating",
        benefits: ["Hi-Bye Session", "Group Photo 2:20", "Official Photocard Set"],
      },
      {
        id: "pil-zone-c",
        eventId: "event-zip-police-in-love-final",
        name: "Standard Zone (C1–C5)",
        description: "Elevated stadium reserved seating with Hi-Bye & Souvenir Poster",
        price: 1499,
        currency: "THB",
        quantity: 400,
        sold: 164,
        minPerOrder: 1,
        maxPerOrder: 4,
        saleStart: "2026-10-01T10:00:00+07:00",
        saleEnd: "2026-11-28T13:00:00+07:00",
        status: "available",
        inventoryMode: "ReservedSeating",
        benefits: ["Hi-Bye Session", "Souvenir Poster & Photocard"],
      },
    ],
    admissionPolicy: {
      bullets: [
        "Physical plastic souvenir card is exchanged at the registration booth upon presenting your QR Ticket + ID/Passport.",
        "Changing or swapping assigned seats is strictly not permitted during the show.",
        "Outside food, beverages, LED boards larger than A4, tripods, and zoom lenses exceeding 200mm are prohibited.",
        "Live streaming or full-length video recording of the final episode screening is strictly prohibited.",
      ],
      updatedAt: "26 Oct 2026 11:00",
    },
    tags: ["Music & Performance"],
    featured: true,
    viewCount: 68500,
    createdAt: "2026-09-25T00:00:00+07:00",
    updatedAt: "2026-10-26T11:00:00+07:00",
  },

  // 4. FORMAT D — Anime Exhibition Sky-Blue Custom Skin + Brand Phase Accordions
  // (Reference: https://www.zipeventapp.com/e/BEYOND-JOURNEYS-END-EXHIBITION)
  {
    id: "event-zip-frieren-bkk",
    slug: "BEYOND-JOURNEYS-END-EXHIBITION",
    title: "FRIEREN: BEYOND JOURNEY'S END EXHIBITION IN BANGKOK",
    shortDescription:
      "Step into the magical world of Frieren, Himmel, Fern, and Stark across 7 immersive exhibition zones, original keyframe galleries, and exclusive Bangkok merchandise.",
    description:
      "Experience the official Southeast Asian tour of 'Frieren: Beyond Journey's End Exhibition' in Bangkok.\n\nExhibition Highlights:\n• Prologue: The Era of the Hero's Party & Meteor Shower Dome\n• Grimoire & Magic Battle Projection Arena (Zoltraak Interactive Hall)\n• Life-size Aureole & Himmel Statue Photo Zone\n• Official Bangkok Limited Merchandise Pop-Up Store",
    coverImage:
      "https://cdnali.zipeventapp.com/images/events/5ACD2FB9-079F-4146-871B-DF99A64D1FD5/xl-DE22B48B-5EC6-4987-B37D-C50593F390E0.jpg",
    thumbnailImage:
      "https://cdnali.zipeventapp.com/images/events/5ACD2FB9-079F-4146-871B-DF99A64D1FD5/3AE3E662-4910-4B1E-BA90-AB42416FF620.jpg",
    fallbackImage: unsplash("photo-1578632767115-351597cf2477", 900),
    category: "art",
    zipeventCategory: "Cartoon & Gaming",
    venueType: "Offline",
    dateRangeLabel: "15 Nov 2026 - 31 Jan 2027",
    ctaLabel: "Get Ticket",
    ticketingMode: "tiered",
    currency: "THB",
    vatRate: 0.07,
    vatIncluded: true,
    enablePromoCode: true,
    promoCodes: [
      { code: "FRIEREN10", discountType: "percent", amount: 10, label: "10% Fan Club Privilege" },
      { code: "HIMMEL50", discountType: "fixed", amount: 50, label: "50 THB Exhibition Rebate" },
    ],
    theme: {
      mode: "light",
      pageBgColor: "#B3E5FC",
      primaryColor: "#5EBBEA",
      primaryHover: "#3AA6DD",
      buttonTextColor: "#FFFFFF",
      softBgColor: "#E1F5FE",
      phaseHeaderStyle: "brand",
    },
    ticketPhases: [
      { id: "frieren-early", name: "Early Bird & Collector Bundles", defaultOpen: true },
      { id: "frieren-general", name: "General Admission (Door Rate)", defaultOpen: false },
    ],
    infoBanners: [
      "https://cdnali.zipeventapp.com/images/events/5ACD2FB9-079F-4146-871B-DF99A64D1FD5/A59464BD-F25E-4A55-828D-0145B52E167E.jpg",
      "https://cdnali.zipeventapp.com/images/events/5ACD2FB9-079F-4146-871B-DF99A64D1FD5/97E8193F-EE30-4088-9103-0E04ECEC1FE1.jpg",
      "https://cdnali.zipeventapp.com/images/events/5ACD2FB9-079F-4146-871B-DF99A64D1FD5/2BBA52AC-48C8-486D-9363-382097D7948A.jpg",
      "https://cdnali.zipeventapp.com/images/events/5ACD2FB9-079F-4146-871B-DF99A64D1FD5/B319E36D-34F3-4622-867F-C87D432E3703.jpg",
    ],
    organizer: {
      id: "org-muse-communication",
      name: "DEX & Muse Communication Thailand",
      slug: "muse-thailand",
      avatar: unsplash("photo-1578632767115-351597cf2477", 240),
      description:
        "Official anime licensing, theatrical screening, and immersive pop-culture exhibition producer in Southeast Asia.",
      website: "https://zipeventapp.com",
      socialLinks: {
        facebook: "https://facebook.com/musethailand",
        instagram: "https://instagram.com/museacg_th",
      },
      verified: true,
      eventCount: 24,
      followerCount: 142000,
    },
    venue: {
      name: "Attraction Hall, 6th Floor, ICONSIAM",
      address: "299 Charoen Nakhon Rd, Khlong Ton Sai",
      city: "Bangkok",
      country: "Thailand",
      latitude: 13.7267,
      longitude: 100.5105,
      capacity: 1500,
      isOnline: false,
    },
    startDate: "2026-11-15T03:30:00Z",
    endDate: "2027-01-31T13:00:00Z",
    startTime: "10:30",
    endTime: "20:30",
    timezone: "Asia/Bangkok",
    status: "published",
    ticketTypes: [
      {
        id: "frieren-eb-single",
        eventId: "event-zip-frieren-bkk",
        phaseId: "frieren-early",
        name: "Early Bird Exhibition Pass",
        description: "Single-entry exhibition ticket + 1 Random Hologram Character Ticket Card (8 designs)",
        price: 350,
        currency: "THB",
        quantity: 2000,
        sold: 1380,
        minPerOrder: 1,
        maxPerOrder: 6,
        saleStart: "2026-10-01T10:00:00+07:00",
        saleEnd: "2026-11-14T23:59:00+07:00",
        saleEndLabel: "14 Nov 2026 23:59",
        status: "available",
        benefits: [
          "1x Single-day Exhibition Admission across all 7 zones",
          "1x Exclusive Bangkok Souvenir Hologram Character Ticket",
        ],
      },
      {
        id: "frieren-merch-set-a",
        eventId: "event-zip-frieren-bkk",
        phaseId: "frieren-early",
        name: "Special Grimoire Acrylic Standee Bundle",
        description: "Exhibition Pass + Limited Frieren & Himmel Acrylic Diorama Standee",
        price: 890,
        currency: "THB",
        quantity: 600,
        sold: 465,
        minPerOrder: 1,
        maxPerOrder: 4,
        saleStart: "2026-10-01T10:00:00+07:00",
        saleEnd: "2026-11-14T23:59:00+07:00",
        saleEndLabel: "14 Nov 2026 23:59",
        status: "available",
        benefits: [
          "1x Exhibition Admission + Priority Merch Store Entry",
          "1x Limited Acrylic Diorama Standee + Hologram Ticket",
        ],
      },
      {
        id: "frieren-vip-box",
        eventId: "event-zip-frieren-bkk",
        phaseId: "frieren-early",
        name: "VIP Collector Mimic Treasure Box Set",
        description: "Complete collector set in embossed Mimic keepsake box + Fast-Track Admission",
        price: 1590,
        currency: "THB",
        quantity: 300,
        sold: 274,
        minPerOrder: 1,
        maxPerOrder: 2,
        saleStart: "2026-10-01T10:00:00+07:00",
        saleEnd: "2026-11-14T23:59:00+07:00",
        saleEndLabel: "14 Nov 2026 23:59",
        status: "available",
        benefits: [
          "Fast-Track VIP Lane Entry (any date during exhibition run)",
          "Complete Set of 8 Character Cards + Mimic Collector Box + Tote Bag",
        ],
      },
      {
        id: "frieren-door-regular",
        eventId: "event-zip-frieren-bkk",
        phaseId: "frieren-general",
        name: "General Admission Pass",
        description: "Standard single-entry ticket valid 15 Nov 2026 – 31 Jan 2027",
        price: 450,
        currency: "THB",
        quantity: 5000,
        sold: 0,
        minPerOrder: 1,
        maxPerOrder: 6,
        saleStart: "2026-11-15T00:00:00+07:00",
        saleEnd: "2027-01-31T19:00:00+07:00",
        saleStartLabel: "15 Nov 2026 00:00",
        status: "not_started",
        benefits: ["1x Single-day Exhibition Admission + Random Souvenir Ticket"],
      },
    ],
    admissionPolicy: {
      bullets: [
        "Souvenir character tickets and merchandise bundles are redeemed at the Exhibition Front Counter upon QR scan.",
        "Last admission is 60 minutes prior to hall closing time (19:30).",
        "Flash photography, selfie sticks, and video recording inside the Original Keyframe Gallery are prohibited.",
      ],
      updatedAt: "28 Oct 2026 10:00",
    },
    tags: ["Cartoon & Gaming", "Art & Design", "Exhibition"],
    featured: true,
    viewCount: 84200,
    createdAt: "2026-10-01T00:00:00+07:00",
    updatedAt: "2026-10-28T10:00:00+07:00",
  },

  // 5. FORMAT E — Custom Watercolor Wallpaper Page + Fanmeeting Seating & Zone Map
  // (Reference: https://www.zipeventapp.com/e/KJW-WONEDERLAND-BKK)
  {
    id: "event-zip-kjw-bkk",
    slug: "KJW-WONEDERLAND-BKK",
    title: "2026 KIM JI WON FANMEETING [WONEDERLAND] IN BANGKOK",
    shortDescription:
      "Welcome to WONEDERLAND — spend an enchanting evening with actress Kim Ji Won featuring live stages, Q&A segments, Hi-Bye, and exclusive fan benefits.",
    description:
      "Beloved Korean actress Kim Ji Won returns to Bangkok for her 2026 Asia Fanmeeting Tour [WONEDERLAND]!\n\nTicket Tiers & Fan Privileges:\n• VIP Zone (5,900 THB): Front Arena Reserved Seat + All-Attendee Hi-Bye + Group Photo Raffle + Signed Poster Raffle + Official Photocard Set\n• Zone A (4,900 THB): Lower Arena Reserved Seat + All-Attendee Hi-Bye + Official Photocard Set\n• Zone B / C (3,500 / 2,500 THB): Reserved Stadium Seat + All-Attendee Hi-Bye + Official Poster",
    coverImage:
      "https://cdnali.zipeventapp.com/images/events/261BA914-1E99-447B-A74C-0C7B0978C36E/xl-5A5D263A-B572-4683-B40F-C13A60E99DBF.jpg",
    thumbnailImage:
      "https://cdnali.zipeventapp.com/images/events/261BA914-1E99-447B-A74C-0C7B0978C36E/84C20D3A-3B4F-45ED-A789-2182BE9FEA74.jpg",
    fallbackImage: unsplash("photo-1516450360452-9312f5e86fc7", 900),
    category: "entertainment",
    zipeventCategory: "Music & Performance",
    venueType: "Offline",
    dateRangeLabel: "21 Nov 2026 · 18:00",
    ctaLabel: "Get Ticket",
    ticketingMode: "seating",
    currency: "THB",
    theme: {
      mode: "light",
      pageBgColor: "#FDF2F8",
      pageBgImage:
        "https://cdnali.zipeventapp.com/images/events/261BA914-1E99-447B-A74C-0C7B0978C36E/BC1E51F4-8289-4459-9F90-D1B95FF30BC8.jpg",
      primaryColor: "#EC4899",
      primaryHover: "#DB2777",
      buttonTextColor: "#FFFFFF",
      softBgColor: "#FCE7F3",
    },
    zoneMapImage:
      "https://cdnali.zipeventapp.com/images/events/261BA914-1E99-447B-A74C-0C7B0978C36E/9BC6E4B2-FDAA-4A71-B4AB-76A1E5A8211F.png",
    infoBanners: [
      "https://cdnali.zipeventapp.com/images/events/261BA914-1E99-447B-A74C-0C7B0978C36E/CF500529-AFC3-4A0A-8924-926A45C9B7DF.png",
      "https://cdnali.zipeventapp.com/images/events/261BA914-1E99-447B-A74C-0C7B0978C36E/2943F641-79FF-4E43-A6D7-89044A61CA87.png",
    ],
    rounds: [
      {
        id: "kjw-21nov-1800",
        date: "2026-11-21",
        startTime: "18:00",
        endTime: "20:30",
        title: "2026 KIM JI WON FANMEETING [WONEDERLAND] IN BANGKOK",
      },
    ],
    zones: [
      ...(["A1", "A2", "A3", "A4", "A5", "A6"] as const).map((z, idx) => ({
        id: z,
        name: `VIP ${z}`,
        tierLabel: "VIP Wonderland (5,900 THB)",
        price: 5900,
        currency: "THB",
        color: "#EC4899",
        ticketTypeId: "kjw-vip",
        rows: ["A", "B", "C", "D"],
        seatsPerRow: 10,
        soldSeats: ["A-2", "A-3", "A-6", `B-${(idx % 5) + 3}`],
        heldSeats: ["A-4"],
        benefits: ["Hi-Bye Session (All)", "Group Photo Draw", "Exclusive Photocard Set"],
      })),
      ...(["B1", "B2"] as const).map((z) => ({
        id: z,
        name: `Zone ${z}`,
        tierLabel: "Zone B (4,500 THB)",
        price: 4500,
        currency: "THB",
        color: "#A855F7",
        ticketTypeId: "kjw-zone-b",
        rows: ["E", "F", "G", "H"],
        seatsPerRow: 12,
        soldSeats: ["E-4", "E-5", "F-7"],
        benefits: ["Hi-Bye Session (All)", "Official Photocard Set"],
      })),
      ...(["C1", "C2", "C3", "C4", "C5"] as const).map((z) => ({
        id: z,
        name: `Zone ${z}`,
        tierLabel: "Zone C (2,900 THB)",
        price: 2900,
        currency: "THB",
        color: "#38BDF8",
        ticketTypeId: "kjw-zone-c",
        rows: ["J", "K", "L", "M"],
        seatsPerRow: 10,
        soldSeats: ["J-3", "K-6"],
        benefits: ["Hi-Bye Session (All)", "Official Souvenir Poster"],
      })),
    ],
    resaleEnabled: true,
    resaleListings: [
      {
        id: "resale-kjw-01",
        roundId: "kjw-21nov-1800",
        dateLabel: "21 Nov 2026",
        roundLabel: "18:00 - 20:30",
        zoneId: "A3",
        ticketTypeName: "VIP Wonderland",
        seatLabel: "A-06",
        originalPrice: 5900,
        resalePrice: 5900,
        currency: "THB",
        sellerCode: "Verified Fan #5012",
        verified: true,
        listedAt: "3 hours ago",
      },
    ],
    organizer: {
      id: "org-highzium-bkk",
      name: "Grand Star Connext",
      slug: "grand-star-connext",
      avatar: unsplash("photo-1514525253161-7a46d19cd819", 240),
      description: "International K-pop & K-drama fanmeeting and concert promoter in Bangkok.",
      website: "https://zipeventapp.com",
      socialLinks: {
        twitter: "https://x.com",
        instagram: "https://instagram.com",
      },
      verified: true,
      eventCount: 19,
      followerCount: 91000,
    },
    venue: {
      name: "Thunder Dome, Muang Thong Thani",
      address: "Popular Rd, Ban Mai, Pak Kret",
      city: "Nonthaburi",
      country: "Thailand",
      latitude: 13.913,
      longitude: 100.547,
      capacity: 3800,
      isOnline: false,
    },
    startDate: "2026-11-21T11:00:00Z",
    endDate: "2026-11-21T13:30:00Z",
    startTime: "18:00",
    endTime: "20:30",
    timezone: "Asia/Bangkok",
    status: "published",
    ticketTypes: [
      {
        id: "kjw-vip",
        eventId: "event-zip-kjw-bkk",
        name: "VIP Wonderland (A1–A6)",
        description: "Front-stage reserved seating + Hi-Bye + Group Photo Raffle",
        price: 5900,
        currency: "THB",
        quantity: 400,
        sold: 312,
        minPerOrder: 1,
        maxPerOrder: 4,
        saleStart: "2026-10-05T10:00:00+07:00",
        saleEnd: "2026-11-21T16:00:00+07:00",
        status: "available",
        inventoryMode: "ReservedSeating",
        benefits: ["Hi-Bye Session (All)", "Group Photo Raffle", "Photocard Set"],
      },
      {
        id: "kjw-zone-b",
        eventId: "event-zip-kjw-bkk",
        name: "Zone B (B1–B2)",
        description: "Mid-arena reserved seating + Hi-Bye + Photocard Set",
        price: 4500,
        currency: "THB",
        quantity: 500,
        sold: 280,
        minPerOrder: 1,
        maxPerOrder: 4,
        saleStart: "2026-10-05T10:00:00+07:00",
        saleEnd: "2026-11-21T16:00:00+07:00",
        status: "available",
        inventoryMode: "ReservedSeating",
        benefits: ["Hi-Bye Session (All)", "Photocard Set"],
      },
      {
        id: "kjw-zone-c",
        eventId: "event-zip-kjw-bkk",
        name: "Zone C (C1–C5)",
        description: "Elevated stadium reserved seating + Hi-Bye + Souvenir Poster",
        price: 2900,
        currency: "THB",
        quantity: 600,
        sold: 245,
        minPerOrder: 1,
        maxPerOrder: 4,
        saleStart: "2026-10-05T10:00:00+07:00",
        saleEnd: "2026-11-21T16:00:00+07:00",
        status: "available",
        inventoryMode: "ReservedSeating",
        benefits: ["Hi-Bye Session (All)", "Souvenir Poster"],
      },
    ],
    admissionPolicy: {
      bullets: [
        "Bring your QR e-Ticket together with a valid government ID or passport matching the attendee name.",
        "Fan benefit draw winners are announced 72 hours prior to the show on the organizer's official channels.",
      ],
      updatedAt: "29 Oct 2026 12:00",
    },
    tags: ["Music & Performance", "Fanmeeting"],
    featured: true,
    viewCount: 79400,
    createdAt: "2026-10-05T00:00:00+07:00",
    updatedAt: "2026-10-29T12:00:00+07:00",
  },

  // 6. FORMAT F — Jet-Black & Builder Orange Skin + Brand Phase Bars + Pre-Selected Ticket
  // (Reference: https://www.zipeventapp.com/e/THE-SECRET-SAUCE-SUMMIT-2026-THE-AGE-OF-BUILDERS)
  {
    id: "event-zip-secret-sauce-2026",
    slug: "THE-SECRET-SAUCE-SUMMIT-2026-THE-AGE-OF-BUILDERS",
    title: "THE SECRET SAUCE SUMMIT 2026 : THE AGE OF BUILDERS",
    shortDescription:
      "Southeast Asia's premier executive & founder summit exploring AI-native companies, regional expansion, and resilient business architecture.",
    description:
      "THE SECRET SAUCE SUMMIT 2026: THE AGE OF BUILDERS brings 80+ visionary CEOs, AI builders, and global strategists together to decode the next decade of growth.\n\nOn-Demand Rerun & Executive Playbooks:\n• Full 6-month HD access to all 40+ main-stage and breakout sessions\n• Downloadable Executive Slide Decks & Builder Frameworks",
    coverImage:
      "https://cdnali.zipeventapp.com/images/events/1626704E-92CC-42F3-9E69-130080F62EC9/xl-27C96883-BF38-4033-9A18-AF156D67BD8D.jpg",
    thumbnailImage:
      "https://cdnali.zipeventapp.com/images/events/1626704E-92CC-42F3-9E69-130080F62EC9/F8C1206E-6D6C-484D-8385-7008A5B141CB.jpg",
    fallbackImage: unsplash("photo-1515187029135-18ee286d815b", 900),
    category: "conference",
    zipeventCategory: "Business",
    venueType: "Hybrid",
    dateRangeLabel: "9 Sep 2026 - 18 Mar 2027",
    ctaLabel: "Rerun",
    ticketingMode: "tiered",
    currency: "THB",
    vatRate: 0.07,
    vatIncluded: true,
    enablePromoCode: true,
    defaultSelectedTicketId: "tss-2026-rerun",
    promoCodes: [
      { code: "BUILDER15", discountType: "percent", amount: 15, label: "15% Builder Privilege" },
      { code: "SAUCE300", discountType: "fixed", amount: 300, label: "300 THB Instant Discount" },
    ],
    theme: {
      mode: "dark",
      pageBgColor: "#010101",
      primaryColor: "#EE3B00",
      primaryHover: "#D43300",
      buttonTextColor: "#FFFFFF",
      softBgColor: "#FFF1EC",
      phaseHeaderStyle: "brand",
    },
    ticketPhases: [
      { id: "tss-rerun-phase", name: "Rerun Pass — 6-Month On-Demand Access", defaultOpen: true },
      { id: "tss-team-phase", name: "Corporate Team Bundles (Tax Invoice Ready)", defaultOpen: true },
    ],
    infoBanners: [
      "https://cdnali.zipeventapp.com/images/events/1626704E-92CC-42F3-9E69-130080F62EC9/9FFA86E0-CF6A-4455-825B-7D78B92CD3E8.jpg",
      "https://cdnali.zipeventapp.com/images/events/1626704E-92CC-42F3-9E69-130080F62EC9/80927C84-B51F-4C8C-9B77-42BA96785A02.jpg",
      "https://cdnali.zipeventapp.com/images/events/1626704E-92CC-42F3-9E69-130080F62EC9/E4F67516-209E-4C4F-AF3E-0D64E696FD18.jpg",
    ],
    organizer: {
      id: "org-the-secret-sauce",
      name: "THE SECRET SAUCE",
      slug: "the-secret-sauce",
      avatar: unsplash("photo-1486406146926-c627a92ad1ab", 240),
      description: "Thailand's #1 executive business podcast, strategy media, and leadership summit.",
      website: "https://thestandard.co/thesecretsauce",
      socialLinks: {
        website: "https://thestandard.co",
        youtube: "https://youtube.com/@thesecretsauce",
      },
      verified: true,
      eventCount: 18,
      followerCount: 168000,
    },
    venue: {
      name: "UOB LIVE, EMSPHERE & On-Demand Rerun",
      address: "622 Sukhumvit Rd, Khlong Tan, Khlong Toei",
      city: "Bangkok",
      country: "Thailand",
      latitude: 13.732,
      longitude: 100.569,
      capacity: 4000,
      isOnline: true,
    },
    startDate: "2026-09-09T02:00:00Z",
    endDate: "2027-03-18T17:00:00Z",
    startTime: "09:00",
    endTime: "18:00",
    timezone: "Asia/Bangkok",
    status: "published",
    ticketTypes: [
      {
        id: "tss-2026-rerun",
        eventId: "event-zip-secret-sauce-2026",
        phaseId: "tss-rerun-phase",
        name: "Rerun Ticket (All Stages)",
        description: "Unlimited HD replay of all 40+ sessions until 18 Mar 2027 + Executive Summary PDF",
        price: 1290,
        currency: "THB",
        quantity: 3000,
        sold: 1840,
        minPerOrder: 1,
        maxPerOrder: 10,
        saleStart: "2026-09-09T00:00:00+07:00",
        saleEnd: "2027-03-18T23:59:00+07:00",
        saleEndLabel: "18 Mar 2027 23:59",
        status: "available",
        benefits: [
          "Full 6-month HD replay across Main Stage & AI Builder Stage",
          "Downloadable 120-page Executive Trend Report 2026",
        ],
      },
      {
        id: "tss-2026-team5",
        eventId: "event-zip-secret-sauce-2026",
        phaseId: "tss-team-phase",
        name: "Team Builder Pack (5+ Passes)",
        description: "Discounted corporate learning rate for 5–30 team members with full tax invoice support",
        price: 990,
        currency: "THB",
        quantity: 1500,
        sold: 620,
        minPerOrder: 5,
        maxPerOrder: 30,
        saleStart: "2026-09-09T00:00:00+07:00",
        saleEnd: "2027-03-18T23:59:00+07:00",
        saleEndLabel: "18 Mar 2027 23:59",
        status: "available",
        benefits: [
          "Individual login codes for every team member",
          "Corporate Tax Invoice (7% VAT Included)",
        ],
      },
    ],
    admissionPolicy: {
      bullets: [
        "Rerun viewing links and personal access codes are delivered immediately via email upon payment.",
        "All passes include 7% VAT; corporate tax invoices can be requested at checkout.",
      ],
      updatedAt: "15 Oct 2026 09:30",
    },
    tags: ["Business", "IT & Tech", "Money & Wealth"],
    featured: true,
    viewCount: 61200,
    createdAt: "2026-09-01T00:00:00+07:00",
    updatedAt: "2026-10-15T09:30:00+07:00",
  },

  // 7. FORMAT G — Crisp White & Gold Skin + Exclusive 7% VAT Calculation (300 + 21 = 321 THB)
  // (Reference: https://www.zipeventapp.com/e/jamboxxmusicconnection-09)
  {
    id: "event-zip-jambox-09",
    slug: "jamboxxmusicconnection-09",
    title: "JAMBOX x Asia Pillars Music Connection #09",
    shortDescription:
      "Cross-border live house showcase & music industry mixer uniting indie bands, festival bookers, and labels across Bangkok, Saigon, Seoul, and Taipei.",
    description:
      "JAMBOX teams up with Asia Pillars for Music Connection #09 at Marshall Livehouse Bangkok!\n\nLineup & Program:\n• 18:30 – Industry Speed-Networking & Festival Booker Mixer\n• 20:00 – Live Showcase Sets by 4 Regional Indie Acts\n• 22:30 – Vinyl DJ Afterparty\n\n*Ticket prices are subject to 7% VAT added at checkout.",
    coverImage:
      "https://cdnali.zipeventapp.com/images/events/A7424B18-C453-4A3D-AA9C-22F95CE55A52/xl-59768B07-991E-4338-9EE5-9FF33B82AB4E.jpg",
    thumbnailImage:
      "https://cdnali.zipeventapp.com/images/events/A7424B18-C453-4A3D-AA9C-22F95CE55A52/FD8E214F-7EE0-493A-89B2-15155048D4F0.jpg",
    fallbackImage: unsplash("photo-1514525253161-7a46d19cd819", 900),
    category: "music",
    zipeventCategory: "Music & Performance",
    venueType: "Offline",
    dateRangeLabel: "5 Nov 2026 · 18:30",
    ctaLabel: "Get Ticket",
    ticketingMode: "tiered",
    currency: "THB",
    vatRate: 0.07,
    vatIncluded: false,
    enablePromoCode: true,
    defaultSelectedTicketId: "jambox-regular",
    promoCodes: [
      { code: "JAMBOX10", discountType: "percent", amount: 10, label: "10% Indie Community" },
    ],
    theme: {
      mode: "light",
      pageBgColor: "#FFFFFF",
      primaryColor: "#EAB308",
      primaryHover: "#CA8A04",
      buttonTextColor: "#111111",
      softBgColor: "#FEFCE8",
      phaseHeaderStyle: "dark",
    },
    organizer: {
      id: "org-jambox-asia",
      name: "JAMBOX & Asia Pillars",
      slug: "jambox-asia-pillars",
      avatar: unsplash("photo-1511671782779-c97d3d27a1d4", 240),
      description: "Pan-Asian live music showcase series and independent music industry network.",
      website: "https://zipeventapp.com",
      socialLinks: {
        instagram: "https://instagram.com",
        facebook: "https://facebook.com",
      },
      verified: true,
      eventCount: 9,
      followerCount: 18500,
    },
    venue: {
      name: "Marshall Livehouse Bangkok",
      address: "Charoen Krung 36, Bang Rak",
      city: "Bangkok",
      country: "Thailand",
      latitude: 13.729,
      longitude: 100.515,
      capacity: 450,
      isOnline: false,
    },
    startDate: "2026-11-05T11:30:00Z",
    endDate: "2026-11-05T16:30:00Z",
    startTime: "18:30",
    endTime: "23:30",
    timezone: "Asia/Bangkok",
    status: "published",
    ticketTypes: [
      {
        id: "jambox-regular",
        eventId: "event-zip-jambox-09",
        name: "Regular Standing + 1 Complimentary Drink",
        description: "Entry to industry mixer + 4 live band showcases (+7% VAT calculated in summary)",
        price: 300,
        currency: "THB",
        quantity: 350,
        sold: 218,
        minPerOrder: 1,
        maxPerOrder: 6,
        saleStart: "2026-10-10T00:00:00+07:00",
        saleEnd: "2026-11-05T18:00:00+07:00",
        saleEndLabel: "05 Nov 2026 18:00",
        status: "available",
        benefits: [
          "1x Standing Livehouse Admission + Mixer Access",
          "1x Complimentary Craft Beverage Coupon at Marshall Bar",
        ],
      },
      {
        id: "jambox-duo",
        eventId: "event-zip-jambox-09",
        name: "Buddy Pack (2+ Tickets)",
        description: "Special pair rate when booking 2 to 6 tickets (+7% VAT)",
        price: 250,
        currency: "THB",
        quantity: 100,
        sold: 64,
        minPerOrder: 2,
        maxPerOrder: 6,
        saleStart: "2026-10-10T00:00:00+07:00",
        saleEnd: "2026-11-05T18:00:00+07:00",
        saleEndLabel: "05 Nov 2026 18:00",
        status: "available",
        benefits: [" Standing Livehouse Admission + 1 Drink Coupon per guest"],
      },
    ],
    admissionPolicy: {
      bullets: [
        "Attendees must be 20+ years old and present a valid photo ID or passport at the door.",
        "Ticket price excludes 7% VAT (automatically added in the Order Summary).",
      ],
      updatedAt: "25 Oct 2026 16:00",
    },
    tags: ["Music & Performance", "Nightlife", "Networking"],
    featured: true,
    viewCount: 24300,
    createdAt: "2026-10-10T00:00:00+07:00",
    updatedAt: "2026-10-25T16:00:00+07:00",
  },

  // 8. FORMAT H — Free Registration with Single-Choice Radio Track Selector
  // (Reference: https://www.zipeventapp.com/e/Creator-Affiliate-Commerce-Fest-2026)
  {
    id: "event-zip-creator-fest-2026",
    slug: "Creator-Affiliate-Commerce-Fest-2026",
    title: "Creator & Affiliate Commerce Fest 2026",
    shortDescription:
      "Thailand's largest creator economy, live-commerce, and affiliate marketing festival — choose your attendee track and register for free!",
    description:
      "Creator & Affiliate Commerce Fest 2026 unites 100+ top creators, MCN agencies, TikTok/Shopee/YouTube Shopping partners, and D2C brands.\n\nSelect 1 Registration Track that matches your profile to receive tailored lounge access and matchmaking badges.",
    coverImage:
      "https://cdnali.zipeventapp.com/images/events/EE718FDA-5EE0-4C16-87D6-4C619A4F5840/xl-FE6DE4BD-53C0-4CF5-871D-61E439CBC0DD.jpg",
    thumbnailImage:
      "https://cdnali.zipeventapp.com/images/events/EE718FDA-5EE0-4C16-87D6-4C619A4F5840/EE0880FF-8669-4B4D-A78D-C9EDBAE7A97F.jpg",
    fallbackImage: unsplash("photo-1551818255-e6e10975bc17", 900),
    category: "business",
    zipeventCategory: "Business",
    venueType: "Offline",
    dateRangeLabel: "20 - 21 Nov 2026",
    ctaLabel: "Register",
    ticketingMode: "registration",
    registrationStyle: "radio",
    currency: "THB",
    infoBanners: [
      "https://cdnali.zipeventapp.com/images/events/EE718FDA-5EE0-4C16-87D6-4C619A4F5840/A4F5A7BE-3460-4BA9-AE1E-FF2A814C2DB7.png",
      "https://cdnali.zipeventapp.com/images/events/EE718FDA-5EE0-4C16-87D6-4C619A4F5840/CB2DAB61-5C99-4FBC-BE05-ACA7CE5D349A.png",
    ],
    organizer: {
      id: "org-tellscore-creator",
      name: "Creator Commerce Thailand",
      slug: "creator-commerce-th",
      avatar: unsplash("photo-1551818255-e6e10975bc17", 240),
      description: "Creator economy ecosystem builder & social commerce conference organizer.",
      website: "https://zipeventapp.com",
      socialLinks: {
        facebook: "https://facebook.com",
      },
      verified: true,
      eventCount: 14,
      followerCount: 47000,
    },
    venue: {
      name: "Paragon Hall, 5th Floor, Siam Paragon",
      address: "991 Rama I Rd, Pathum Wan",
      city: "Bangkok",
      country: "Thailand",
      latitude: 13.7468,
      longitude: 100.535,
      capacity: 3000,
      isOnline: false,
    },
    startDate: "2026-11-20T03:00:00Z",
    endDate: "2026-11-21T12:00:00Z",
    startTime: "10:00",
    endTime: "19:00",
    timezone: "Asia/Bangkok",
    status: "published",
    ticketTypes: [
      {
        id: "cacf-track-creator",
        eventId: "event-zip-creator-fest-2026",
        name: "Creator & Affiliate Track (General Visitor)",
        description: "For content creators, streamers, reviewers, and affiliate publishers (1 pass per account)",
        price: 0,
        currency: "THB",
        quantity: 2000,
        sold: 1120,
        minPerOrder: 1,
        maxPerOrder: 1,
        saleStart: "2026-10-01T00:00:00+07:00",
        saleEnd: "2026-11-21T18:00:00+07:00",
        saleEndLabel: "21 Nov 2026 18:00",
        status: "available",
        benefits: [
          "Creator Badge + Product Sample Passport across 80+ Brand Booths",
          "Access to Creator Main Stage & Live Studio Workshops",
        ],
      },
      {
        id: "cacf-track-brand",
        eventId: "event-zip-creator-fest-2026",
        name: "Brand, Retailer & Marketer Track",
        description: "For brand owners, e-commerce managers, and performance marketers seeking creator partnerships",
        price: 0,
        currency: "THB",
        quantity: 800,
        sold: 490,
        minPerOrder: 1,
        maxPerOrder: 1,
        saleStart: "2026-10-01T00:00:00+07:00",
        saleEnd: "2026-11-21T18:00:00+07:00",
        saleEndLabel: "21 Nov 2026 18:00",
        status: "available",
        benefits: [
          "Business Matchmaking Lounge Access + MCN Directory",
          "Full 2-day access to Commerce Strategy Stage",
        ],
      },
      {
        id: "cacf-track-agency",
        eventId: "event-zip-creator-fest-2026",
        name: "Agency, Platform & Media Partner Track",
        description: "For MCNs, media agencies, ad-tech platforms, and press representatives",
        price: 0,
        currency: "THB",
        quantity: 400,
        sold: 215,
        minPerOrder: 1,
        maxPerOrder: 1,
        saleStart: "2026-10-01T00:00:00+07:00",
        saleEnd: "2026-11-21T18:00:00+07:00",
        saleEndLabel: "21 Nov 2026 18:00",
        status: "available",
        benefits: ["Press & Partner Lounge Access + VIP Networking Mixer"],
      },
    ],
    admissionPolicy: {
      bullets: [
        "Each attendee registers 1 individual track pass linked to their QR badge.",
        "Present your QR badge at the Fast-Print Kiosk to collect your color-coded lanyard.",
      ],
      updatedAt: "27 Oct 2026 11:20",
    },
    tags: ["Business", "IT & Tech", "Festival"],
    featured: true,
    viewCount: 33900,
    createdAt: "2026-10-01T00:00:00+07:00",
    updatedAt: "2026-10-27T11:20:00+07:00",
  },

  // 9. FORMAT I — Promo-Code-Gated Exclusive Event Registration
  // (Reference: https://www.zipeventapp.com/e/Suki-Teenoi-x-Coke-Fest-2026)
  {
    id: "event-zip-teenoi-coke-2026",
    slug: "Suki-Teenoi-x-Coke-Fest-2026",
    title: "Suki Teenoi x Coke Music & Food Fest 2026",
    shortDescription:
      "Exclusive member music & unlimited hotpot festival! Enter your receipt redemption PROMO CODE to unlock your complimentary festival ticket.",
    description:
      "Suki Teenoi and Coca-Cola team up for the ultimate fan appreciation concert & food carnival!\n\nHow to Unlock Your Ticket:\n1. Collect a redemption code from participating Suki Teenoi x Coke combo receipts (or try demo code COKEFEST / TEENOI2026).\n2. Enter your Promo Code in the registration box to unlock your festival pass!",
    coverImage:
      "https://cdnali.zipeventapp.com/images/events/82E77D6C-1ABD-48BA-9DAC-B5A12871AE74/xl-1A3D3035-AE79-444C-B5F5-26F1A8385365.jpg",
    thumbnailImage:
      "https://cdnali.zipeventapp.com/images/events/82E77D6C-1ABD-48BA-9DAC-B5A12871AE74/E4E476B3-6180-4949-AEBF-50B5E0997844.jpg",
    fallbackImage: unsplash("photo-1555939594-58d7cb561ad1", 900),
    category: "food",
    zipeventCategory: "Food & Drink",
    venueType: "Offline",
    dateRangeLabel: "29 Nov 2026 · 15:00",
    ctaLabel: "Register",
    ticketingMode: "registration",
    requirePromoToUnlock: true,
    enablePromoCode: true,
    currency: "THB",
    promoCodes: [
      { code: "COKEFEST", discountType: "percent", amount: 100, label: "Coke Receipt Redemption" },
      { code: "TEENOI2026", discountType: "percent", amount: 100, label: "Teenoi VIP Member Code" },
    ],
    theme: {
      mode: "light",
      pageBgColor: "#FFF5F5",
      primaryColor: "#E11D48",
      primaryHover: "#BE123C",
      buttonTextColor: "#FFFFFF",
      softBgColor: "#FFE4E6",
    },
    organizer: {
      id: "org-suki-teenoi",
      name: "Suki Teenoi x Coca-Cola",
      slug: "suki-teenoi-coke",
      avatar: unsplash("photo-1555939594-58d7cb561ad1", 240),
      description: "Official campaign & live festival collaboration by Suki Teenoi and Coca-Cola Thailand.",
      website: "https://zipeventapp.com",
      socialLinks: {
        facebook: "https://facebook.com",
      },
      verified: true,
      eventCount: 5,
      followerCount: 112000,
    },
    venue: {
      name: "BITEC Bangna Hall 98",
      address: "88 Debaratna Rd, Bang Na Tai",
      city: "Bangkok",
      country: "Thailand",
      latitude: 13.668,
      longitude: 100.609,
      capacity: 4000,
      isOnline: false,
    },
    startDate: "2026-11-29T08:00:00Z",
    endDate: "2026-11-29T15:30:00Z",
    startTime: "15:00",
    endTime: "22:30",
    timezone: "Asia/Bangkok",
    status: "published",
    ticketTypes: [
      {
        id: "teenoi-coke-vip-pass",
        eventId: "event-zip-teenoi-coke-2026",
        name: "Privilege Festival Pass (2 Pax Entry + Food Zone)",
        description: "Unlocked via valid Suki Teenoi x Coke promo code — grants concert & tasting zone entry",
        price: 0,
        currency: "THB",
        quantity: 2000,
        sold: 1490,
        minPerOrder: 1,
        maxPerOrder: 2,
        saleStart: "2026-10-15T00:00:00+07:00",
        saleEnd: "2026-11-28T23:59:00+07:00",
        saleEndLabel: "28 Nov 2026 23:59",
        status: "available",
        benefits: [
          "Concert Arena Entry + 6 Headliner T-Pop Stages",
          "Complimentary Suki Teenoi Snack Cup & Ice-Cold Coke Zero",
        ],
      },
    ],
    admissionPolicy: {
      bullets: [
        "Each valid Promo Code can be redeemed once for up to 2 festival passes.",
        "Present your QR Ticket at Gate Hall 98 to receive your festival wristband.",
      ],
      updatedAt: "28 Oct 2026 15:00",
    },
    tags: ["Food & Drink", "Music & Performance", "Festival"],
    featured: true,
    viewCount: 46100,
    createdAt: "2026-10-15T00:00:00+07:00",
    updatedAt: "2026-10-28T15:00:00+07:00",
  },

  // 10. FORMAT J — Full-Width Official Merchandise / Visual Catalog Showcase (Black & Gold)
  // (Reference: https://www.zipeventapp.com/e/POLICE-IN-LOVE-MD)
  {
    id: "event-zip-police-md",
    slug: "POLICE-IN-LOVE-MD",
    title: "Police in Love — OFFICIAL MERCHANDISE & COLLECTOR EDITION",
    shortDescription:
      "Official series merchandise catalog, collector photobook boxsets, uniform acrylic standees, and venue pickup guide for Police in Love.",
    description:
      "Explore the complete Official Merchandise lineup for 'ที่รักสารวัตรเธียร์ | Police in Love'.\n\nPre-order and venue booth pickup schedule:\n• Merchandise Booth opens at 10:00 AM on 28 Nov 2026 at MCC Hall 4F, The Mall Lifestore Ngamwongwan.\n• Limited Boxset Editions include random signed Polaroid opportunities.",
    coverImage:
      "https://cdnali.zipeventapp.com/images/events/B5C7219D-C3B9-410E-B533-3F5AA8589485/xl-C590715B-6527-4389-B14D-6013CC2A4C38.jpg",
    thumbnailImage:
      "https://cdnali.zipeventapp.com/images/events/B5C7219D-C3B9-410E-B533-3F5AA8589485/D05980C7-3489-48BA-B84C-8CBC88510E13.jpg",
    fallbackImage: unsplash("photo-1492684223066-81342ee5ff30", 900),
    category: "community",
    zipeventCategory: "Shopping",
    venueType: "Offline",
    dateRangeLabel: "22 Sep - 28 Nov 2026",
    ctaLabel: "View Event",
    ticketingMode: "showcase",
    showcaseBadge: "OFFICIAL MERCHANDISE",
    currency: "THB",
    theme: {
      mode: "dark",
      pageBgColor: "#000000",
      primaryColor: "#F5C400",
      primaryHover: "#E0B100",
      buttonTextColor: "#111111",
      softBgColor: "#FFF9E6",
    },
    infoBanners: [
      "https://cdnali.zipeventapp.com/images/events/B5C7219D-C3B9-410E-B533-3F5AA8589485/D05980C7-3489-48BA-B84C-8CBC88510E13.jpg",
      "https://cdnali.zipeventapp.com/images/events/B5C7219D-C3B9-410E-B533-3F5AA8589485/xl-C590715B-6527-4389-B14D-6013CC2A4C38.jpg",
      "https://cdnali.zipeventapp.com/images/events/A937F0ED-7502-47A0-8DEA-516CCF4D8C47/xl-94D81E21-EB57-4516-9BB3-F9EFEC0A765E.jpg.webp",
      "https://cdnali.zipeventapp.com/images/events/A937F0ED-7502-47A0-8DEA-516CCF4D8C47/19830D49-9869-4E9A-A71F-44D1E61B84E7.jpg",
    ],
    organizer: {
      id: "org-argentis",
      name: "ARGENTIS",
      slug: "argentis",
      avatar: unsplash("photo-1514525253161-7a46d19cd819", 240),
      description:
        "Series production house and live entertainment promoter creating original drama series, concerts, and fan experiences.",
      website: "https://x.com/argentis_th",
      socialLinks: {
        twitter: "https://x.com/argentis_th",
        instagram: "https://instagram.com/argentis_th",
      },
      verified: true,
      eventCount: 12,
      followerCount: 82000,
    },
    venue: {
      name: "MCC Hall 4F Merchandise Zone — Ngamwongwan",
      address: "30/39-50 Ngamwongwan Rd, Nonthaburi",
      city: "Nonthaburi",
      country: "Thailand",
      latitude: 13.8558,
      longitude: 100.5422,
      capacity: 3000,
      isOnline: false,
    },
    startDate: "2026-10-12T03:00:00Z",
    endDate: "2026-11-28T14:00:00Z",
    startTime: "10:00",
    endTime: "21:00",
    timezone: "Asia/Bangkok",
    status: "published",
    ticketTypes: [
      {
        id: "pil-md-catalog",
        eventId: "event-zip-police-md",
        name: "Official Merchandise Info",
        description: "On-site booth & pre-order catalog showcase",
        price: 350,
        currency: "THB",
        quantity: 1000,
        sold: 410,
        minPerOrder: 1,
        maxPerOrder: 5,
        saleStart: "2026-09-22T00:00:00+07:00",
        saleEnd: "2026-11-28T21:00:00+07:00",
        status: "available",
        benefits: ["Official ARGENTIS Hologram Authenticity Seal"],
      },
    ],
    admissionPolicy: {
      bullets: [
        "Merchandise booth is open to both ticket holders and walk-in fans from 10:00 – 13:30.",
        "Please inspect items at the pickup counter; exchanges apply only to manufacturing defects.",
      ],
      updatedAt: "26 Oct 2026 11:00",
    },
    tags: ["Shopping", "Music & Performance"],
    featured: true,
    viewCount: 41800,
    createdAt: "2026-09-22T00:00:00+07:00",
    updatedAt: "2026-10-26T11:00:00+07:00",
  },
];

const categoryLabels = new Map(eventCategories.map((category) => [category.value, category.label]));

function mockOrganizerFor(index: number): Organizer {
  return mockOrganizers[index % mockOrganizers.length];
}

function buildSeedTheme(slug: string, category: EventCategory): EventTheme {
  if (slug === "space-time-cube-plus" || slug === "space-time-cube-pattaya") {
    return {
      mode: "dark",
      pageBgColor: "#0B0D17",
      pageBgImage:
        "https://cdnali.zipeventapp.com/images/events/A7ABC828-64A6-4FB0-ACA3-60693397E938/gallery/353F583D-C1AA-4D1B-89CC-80FE2F3AFE14.jpg",
      primaryColor: "#7C3AED",
      primaryHover: "#6D28D9",
      buttonTextColor: "#FFFFFF",
      softBgColor: "#F3E8FF",
      phaseHeaderStyle: "outline",
    };
  }
  if (slug === "cave-fantasy-immersive-art") {
    return {
      mode: "dark",
      pageBgColor: "#0F172A",
      primaryColor: "#06B6D4",
      primaryHover: "#0891B2",
      buttonTextColor: "#FFFFFF",
      softBgColor: "#ECFEFF",
      phaseHeaderStyle: "brand",
    };
  }
  if (slug === "sangsom-presents-volume-phase-8" || slug === "tixflow-flash-sale-demo") {
    return {
      mode: "dark",
      pageBgColor: "#141118",
      primaryColor: "#F59E0B",
      primaryHover: "#D97706",
      buttonTextColor: "#111111",
      softBgColor: "#FEF3C7",
      phaseHeaderStyle: "brand",
    };
  }
  if (slug === "ai-data-summit-vietnam" || slug === "creative-talk-conference-2026") {
    return {
      mode: "dark",
      pageBgColor: "#0B1120",
      primaryColor: "#EE3B00",
      primaryHover: "#D43300",
      buttonTextColor: "#FFFFFF",
      softBgColor: "#FFF1EC",
      phaseHeaderStyle: "brand",
    };
  }
  if (slug === "fahlanna-art-museum" || slug === "kunawong-house-museum" || slug === "creative-talk-design-tomorrow") {
    return {
      mode: "light",
      pageBgColor: "#F4EFEA",
      primaryColor: "#B45309",
      primaryHover: "#92400E",
      buttonTextColor: "#FFFFFF",
      softBgColor: "#FEF3C7",
      phaseHeaderStyle: "outline",
    };
  }
  if (slug === "coffee-culture-fair" || slug === "specialty-coffee-culture-fair-2026") {
    return {
      mode: "light",
      pageBgColor: "#FBF7F2",
      primaryColor: "#C2410C",
      primaryHover: "#9A3412",
      buttonTextColor: "#FFFFFF",
      softBgColor: "#FFEDD5",
      phaseHeaderStyle: "brand",
    };
  }
  if (slug === "vietnam-future-forum-2026" || slug === "longtunman-summit-2026" || slug === "startup-showcase-vietnam") {
    return {
      mode: "light",
      pageBgColor: "#F6F6F6",
      primaryColor: "#EF5360",
      primaryHover: "#EC3746",
      buttonTextColor: "#FFFFFF",
      softBgColor: "#FFEFF0",
      phaseHeaderStyle: "dark",
    };
  }
  if (category === "education" || category === "workshop") {
    return {
      mode: "light",
      pageBgColor: "#EFF6FF",
      primaryColor: "#0284C7",
      primaryHover: "#0369A1",
      buttonTextColor: "#FFFFFF",
      softBgColor: "#E0F2FE",
      phaseHeaderStyle: "brand",
    };
  }
  return {
    mode: "light",
    pageBgColor: "#F6F6F6",
    primaryColor: "#EF5360",
    primaryHover: "#EC3746",
    buttonTextColor: "#FFFFFF",
    softBgColor: "#FFEFF0",
    phaseHeaderStyle: "dark",
  };
}

const seededCatalogEvents: Event[] = eventSeeds.map((seed, index) => {
  const id = `event-${String(index + 1).padStart(3, "0")}`;
  const slug =
    seed.slug ??
    seed.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  const organizer = mockOrganizerFor(index);

  const isFreeEvent = seed.price === 0;
  const isSeatingShow =
    slug === "ong-seongwu-fanmeeting-bangkok-2026" ||
    slug === "neon-symphony-anime-orchestra-live" ||
    slug === "dream-secret-a-new-musical" ||
    slug === "tixflow-flash-sale-demo";
  const isCinemaTimeslot =
    seed.venue.name === "Sala Saneha" || slug === "hanoi-arthouse-cinema-week-2026";
  const isSpaceTimeCube =
    slug === "space-time-cube-plus" || slug === "space-time-cube-pattaya";
  const isConferenceTiered =
    isSpaceTimeCube ||
    seed.category === "conference" ||
    seed.category === "business" ||
    seed.category === "technology" ||
    seed.category === "education";

  const phase1Id = isSpaceTimeCube ? "stc-main" : "phase-early";
  const phase2Id = isSpaceTimeCube ? "stc-vr" : "phase-regular";

  const ticket: TicketType = {
    id: `ticket-${index + 1}-general`,
    eventId: id,
    phaseId: isConferenceTiered ? phase1Id : undefined,
    name: isFreeEvent
      ? "Free Registration"
      : isSpaceTimeCube
        ? "Adult Pass — Main 3D Hologram Hall"
        : isCinemaTimeslot
          ? "Standard Cinema Seat (Digital Projection)"
          : isConferenceTiered
            ? "Early Bird Pass"
            : "Standard Admission",
    description: isFreeEvent
      ? "Complimentary entry pass with instant QR check-in access"
      : isSpaceTimeCube
        ? "Access to all 27 immersive 720° naked-eye 3D & mirror rooms"
        : "Official e-Ticket with instant QR entry confirmation",
    price: seed.price,
    currency: "VND",
    quantity: 600,
    sold: 95 + index * 11,
    minPerOrder: 1,
    maxPerOrder: 6,
    saleStart: "2026-08-01T00:00:00+07:00",
    saleEnd: "2027-12-31T23:59:00+07:00",
    saleEndLabel: "30 Nov 2026 23:59",
    status: "available",
    inventoryMode: isSeatingShow ? "ReservedSeating" : "GeneralAdmission",
    benefits: ["Instant QR e-Ticket", "Official entry access"],
    addons: isFreeEvent
      ? [
          {
            id: `${id}-addon-networking`,
            name: "1-on-1 Mentor Speed Networking Slot",
            timeLabel: "Session Break · 45 mins",
            stage: "Community Lounge",
            price: 0,
            spotsLeft: 24,
          },
        ]
      : undefined,
  };

  const groupOrVipTicket: TicketType = {
    id: `ticket-${index + 1}-vip`,
    eventId: id,
    phaseId: isConferenceTiered ? phase1Id : undefined,
    name: isSpaceTimeCube
      ? "Child / Student Concession Pass"
      : isCinemaTimeslot
        ? "Cinephile Pair + Film Zine Booklet"
        : isConferenceTiered
          ? "Group Pass (3–10 Tickets)"
          : "VIP Priority Pass",
    description: isSpaceTimeCube
      ? "Valid for visitors height 90–130 cm or students with valid ID"
      : isConferenceTiered
        ? "Special bundle rate for teams of 3 to 10 attendees"
        : "Priority lane entry, reserved front zone, and commemorative poster",
    price: isSpaceTimeCube
      ? Math.round(seed.price * 0.72)
      : isConferenceTiered
        ? Math.round(seed.price * 0.8)
        : Math.round(seed.price * 1.8),
    currency: "VND",
    quantity: 150,
    sold: 42 + index * 3,
    minPerOrder: isConferenceTiered && !isSpaceTimeCube ? 3 : 1,
    maxPerOrder: isConferenceTiered && !isSpaceTimeCube ? 10 : 4,
    saleStart: "2026-08-01T00:00:00+07:00",
    saleEnd: "2027-12-31T23:59:00+07:00",
    saleEndLabel: "30 Nov 2026 23:59",
    status: "available",
    inventoryMode: isSeatingShow ? "ReservedSeating" : "GeneralAdmission",
    benefits: isConferenceTiered
      ? ["Full conference & workshop access", "On-demand session replay (6 months)"]
      : ["Priority fast-track gate", "Reserved front zone", "Limited edition souvenir"],
  };

  const regularPhaseTicket: TicketType | null = isConferenceTiered
    ? {
        id: `ticket-${index + 1}-regular`,
        eventId: id,
        phaseId: phase2Id,
        name: isSpaceTimeCube ? "Main Hall + VR 9D Orbital Ride Combo" : "Regular Pass",
        description: isSpaceTimeCube
          ? "Full 27-room Main Hall + 1x VR 9D Space Capsule Cinema Ride"
          : "Standard conference admission & networking lounge access",
        price: Math.round(seed.price * 1.45),
        currency: "VND",
        quantity: 300,
        sold: isSpaceTimeCube ? 88 : 0,
        minPerOrder: 1,
        maxPerOrder: 6,
        saleStart: isSpaceTimeCube ? "2026-08-01T00:00:00+07:00" : "2026-12-01T00:00:00+07:00",
        saleEnd: "2027-12-31T23:59:00+07:00",
        saleStartLabel: isSpaceTimeCube ? undefined : "01 Dec 2026 00:00",
        saleEndLabel: isSpaceTimeCube ? "08 Dec 2026 21:00" : undefined,
        status: isSpaceTimeCube ? "available" : "not_started",
        benefits: isSpaceTimeCube
          ? ["Main Hall Entry + VR 9D Motion Pod Ticket", "Souvenir Hologram Postcard"]
          : ["Full conference access", "Digital certificate of attendance"],
      }
    : null;

  const eventDay = seed.startIso.slice(0, 10);

  const cinemaRounds: EventRound[] | undefined = isCinemaTimeslot
    ? [
        { id: `${id}-r1`, date: "2026-11-04", startTime: "19:00", endTime: "21:15", title: `${seed.title} — Evening Screening` },
        { id: `${id}-r2`, date: "2026-11-09", startTime: "18:30", endTime: "20:45", title: `${seed.title} — Restored DCP` },
        { id: `${id}-r3`, date: "2026-11-13", startTime: "20:00", endTime: "22:15", title: `${seed.title} — Friday Night Club` },
        { id: `${id}-r4`, date: "2026-11-15", startTime: "16:00", endTime: "18:15", title: `${seed.title} — Matinee + Curator Talk` },
        { id: `${id}-r5`, date: "2026-11-15", startTime: "19:30", endTime: "21:45", title: `${seed.title} — Prime Screening` },
        { id: `${id}-r6`, date: "2026-11-21", startTime: "19:00", endTime: "21:15", title: `${seed.title} — Saturday Feature` },
        { id: `${id}-r7`, date: "2026-11-27", startTime: "20:00", endTime: "22:15", title: `${seed.title} — Encore Screening` },
      ]
    : undefined;

  return {
    id,
    slug,
    title: seed.title,
    description: `${seed.shortDescription}\n\nExperience seamless digital ticketing, instant QR check-in, and curated live programming powered by TixFlow. Doors open 45 minutes prior to showtime.`,
    shortDescription: seed.shortDescription,
    coverImage: isSpaceTimeCube
      ? "https://cdnali.zipeventapp.com/images/events/A7ABC828-64A6-4FB0-ACA3-60693397E938/xl-51A8C671-6282-4DBA-B681-C5691EF67C8F.jpg"
      : slug === "naza-documentary-screening"
        ? "https://cdnali.zipeventapp.com/images/events/03135A55-B472-4D04-BFCC-BA29938ED919/xl-A8801B51-5173-437E-A508-9A7AEB3EBDC7.jpg"
        : seed.coverUrl,
    thumbnailImage: seed.posterUrl,
    fallbackImage: unsplash(seed.fallbackId, 900),
    category: seed.category,
    zipeventCategory: seed.zipeventCategory,
    venueType: seed.venueType,
    dateRangeLabel: seed.dateRangeLabel,
    ctaLabel: seed.ctaLabel,
    ticketingMode: isFreeEvent
      ? "registration"
      : isSeatingShow || isCinemaTimeslot
        ? "seating"
        : "tiered",
    roundBookingType: isCinemaTimeslot ? "tickets" : isSeatingShow ? "seats" : undefined,
    theme: buildSeedTheme(slug, seed.category),
    currency: "VND",
    vatRate: isFreeEvent ? undefined : 0.08,
    vatIncluded: true,
    enablePromoCode: isConferenceTiered || (!isFreeEvent && !isSeatingShow),
    promoCodes: [
      { code: "TIXFLOW10", discountType: "percent", amount: 10, label: "10% Member Discount" },
      { code: "EARLYVIP", discountType: "percent", amount: 15, label: "15% Partner Code" },
    ],
    ticketPhases: isSpaceTimeCube
      ? [
          { id: "stc-main", name: "SPACE & TIME CUBE - MAIN HALL", defaultOpen: true },
          { id: "stc-vr", name: "VR & 9D EXPERIENCE COMBO", defaultOpen: true },
        ]
      : isConferenceTiered
        ? [
            { id: "phase-early", name: "Phase 1 — Early Bird & Group", defaultOpen: true },
            { id: "phase-regular", name: "Phase 2 — Regular Rate", defaultOpen: false },
          ]
        : undefined,
    infoBanners: isSpaceTimeCube
      ? [
          "https://cdnali.zipeventapp.com/images/events/A7ABC828-64A6-4FB0-ACA3-60693397E938/898D7A87-0A14-4C45-9C72-001D85DFB8B6.jpg",
          "https://cdnali.zipeventapp.com/images/events/A7ABC828-64A6-4FB0-ACA3-60693397E938/97A6702B-40C1-4878-B47F-4525CF71B646.jpg",
          "https://cdnali.zipeventapp.com/images/events/A7ABC828-64A6-4FB0-ACA3-60693397E938/B7666404-FA91-4F51-BB43-5B110D268A07.jpg",
        ]
      : undefined,
    rounds: isCinemaTimeslot
      ? cinemaRounds
      : isSeatingShow
        ? [
            {
              id: `${id}-round-1`,
              date: eventDay,
              startTime: seed.startTime,
              endTime: seed.endTime,
              title: `${seed.title} — Main Show`,
            },
          ]
        : undefined,
    zones: isSeatingShow
      ? [
          {
            id: "A1",
            name: "Zone A1",
            tierLabel: "VIP Front Stage",
            price: groupOrVipTicket.price,
            currency: "VND",
            color: "#ef5360",
            ticketTypeId: groupOrVipTicket.id,
            rows: ["A", "B", "C", "D"],
            seatsPerRow: 10,
            soldSeats: ["A-3", "A-4", "B-6"],
            heldSeats: ["A-5"],
            benefits: groupOrVipTicket.benefits,
          },
          {
            id: "A2",
            name: "Zone A2",
            tierLabel: "VIP Front Stage",
            price: groupOrVipTicket.price,
            currency: "VND",
            color: "#ef5360",
            ticketTypeId: groupOrVipTicket.id,
            rows: ["A", "B", "C", "D"],
            seatsPerRow: 10,
            soldSeats: ["A-2", "C-5"],
            benefits: groupOrVipTicket.benefits,
          },
          {
            id: "B1",
            name: "Zone B1",
            tierLabel: "Standard Arena",
            price: ticket.price,
            currency: "VND",
            color: "#60A5FA",
            ticketTypeId: ticket.id,
            rows: ["E", "F", "G", "H"],
            seatsPerRow: 12,
            soldSeats: ["E-4", "F-7"],
            benefits: ticket.benefits,
          },
          {
            id: "B2",
            name: "Zone B2",
            tierLabel: "Standard Arena",
            price: ticket.price,
            currency: "VND",
            color: "#60A5FA",
            ticketTypeId: ticket.id,
            rows: ["E", "F", "G", "H"],
            seatsPerRow: 12,
            soldSeats: ["E-8"],
            benefits: ticket.benefits,
          },
        ]
      : undefined,
    resaleEnabled: isSeatingShow,
    admissionPolicy: {
      bullets: [
        "Present your QR e-Ticket on mobile or printed pass at the venue check-in gate.",
        "Doors open 45 minutes prior to the scheduled start time. Tickets are non-refundable once redeemed.",
      ],
      updatedAt: "25 Oct 2026 10:00",
    },
    organizer,
    venue: seed.venue,
    startDate: seed.startIso,
    endDate: seed.endIso,
    startTime: seed.startTime,
    endTime: seed.endTime,
    timezone: "Asia/Ho_Chi_Minh",
    status: "published",
    ticketTypes: isFreeEvent
      ? [ticket]
      : regularPhaseTicket
        ? [ticket, groupOrVipTicket, regularPhaseTicket]
        : [ticket, groupOrVipTicket],
    tags: [seed.zipeventCategory, categoryLabels.get(seed.category) ?? "Events"],
    featured: Boolean(seed.featured),
    viewCount: 14800 - index * 340,
    createdAt: "2026-08-01T00:00:00+07:00",
    updatedAt: "2026-10-01T00:00:00+07:00",
  };
});

export const mockEvents: Event[] = [
  ...flagshipZipeventShowcaseEvents,
  ...seededCatalogEvents,
];
