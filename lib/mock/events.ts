export interface Event {
  id: string;
  slug: string;
  title: string;
  description: string;
  shortDescription: string;
  coverImage: string;
  thumbnailImage: string;
  category: EventCategory;
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
  maxPerOrder: number;
  saleStart: string;
  saleEnd: string;
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
  { value: "technology", label: "Technology & IT", icon: "⌘" },
  { value: "business", label: "Business & Seminars", icon: "▥" },
  { value: "entertainment", label: "Entertainment & Shows", icon: "◎" },
  { value: "art", label: "Art & Design", icon: "✿" },
  { value: "education", label: "Education & Talks", icon: "▤" },
  { value: "food", label: "Food & Drink", icon: "◒" },
  { value: "workshop", label: "Workshops & Training", icon: "✦" },
  { value: "networking", label: "Networking & Meetups", icon: "↗" },
  { value: "community", label: "Community & Culture", icon: "♡" },
  { value: "health", label: "Health & Wellness", icon: "✚" },
  { value: "conference", label: "Conferences & Summits", icon: "◇" },
];

const eventSeeds: Array<Pick<Event, "title" | "category" | "shortDescription" | "venue"> & { image: string; day: number; price: number }> = [
  { title: "Vietnam Future Forum 2026", category: "business", shortDescription: "Ideas and leaders shaping the next chapter of Vietnam.", venue: { name: "Thiskyhall Sala", address: "10 Mai Chi Tho, Thu Thiem", city: "Ho Chi Minh City", country: "Vietnam", latitude: 10.77, longitude: 106.72, capacity: 1200, isOnline: false }, image: "photo-1511578314322-379afb476865", day: 15, price: 650000 },
  { title: "Saigon Indie Music Weekend", category: "music", shortDescription: "Two nights of new sounds from across Southeast Asia.", venue: { name: "The Observatory", address: "5 Nguyen Tat Thanh", city: "Ho Chi Minh City", country: "Vietnam", latitude: 10.76, longitude: 106.70, capacity: 700, isOnline: false }, image: "photo-1459749411175-04bf5292ceea", day: 17, price: 350000 },
  { title: "AI & Data Summit Vietnam", category: "technology", shortDescription: "Meet the teams bringing applied AI into everyday business.", venue: { name: "National Convention Center", address: "Pham Hung, Me Tri", city: "Hanoi", country: "Vietnam", latitude: 21.00, longitude: 105.78, capacity: 1800, isOnline: false }, image: "photo-1485827404703-89b55fcc595e", day: 20, price: 890000 },
  { title: "Creative Talk: Design Tomorrow", category: "art", shortDescription: "A full day for designers, makers, and creative founders.", venue: { name: "D7 Studio", address: "2 Le Loi, District 1", city: "Ho Chi Minh City", country: "Vietnam", latitude: 10.77, longitude: 106.70, capacity: 450, isOnline: false }, image: "photo-1531058020387-3be344556be6", day: 22, price: 420000 },
  { title: "The Coffee & Culture Fair", category: "food", shortDescription: "Taste Vietnamese coffee from farm to cup.", venue: { name: "Youth Cultural House", address: "4 Pham Ngoc Thach, District 1", city: "Ho Chi Minh City", country: "Vietnam", latitude: 10.78, longitude: 106.70, capacity: 900, isOnline: false }, image: "photo-1442512595331-e89e73853f31", day: 24, price: 120000 },
  { title: "Hanoi Product Meetup #18", category: "networking", shortDescription: "An evening of honest product stories and new connections.", venue: { name: "Toong Hoang Dao Thuy", address: "25T2 Hoang Dao Thuy", city: "Hanoi", country: "Vietnam", latitude: 21.01, longitude: 105.80, capacity: 180, isOnline: false }, image: "photo-1517245386807-bb43f82c33c4", day: 26, price: 0 },
  { title: "Saigon Jazz Under the Stars", category: "music", shortDescription: "Live jazz, open air, and a slow Sunday evening.", venue: { name: "The Garden Rooftop", address: "District 3", city: "Ho Chi Minh City", country: "Vietnam", latitude: 10.78, longitude: 106.69, capacity: 280, isOnline: false }, image: "photo-1516280440614-37939bbacd81", day: 28, price: 280000 },
  { title: "Future Skills for Everyone", category: "education", shortDescription: "Practical workshops for the changing world of work.", venue: { name: "Online Event", address: "Live online", city: "Online", country: "Vietnam", latitude: 0, longitude: 0, capacity: 3000, isOnline: true }, image: "photo-1524178871053-8a632f6f5a7b", day: 30, price: 150000 },
  { title: "Startup Showcase Vietnam", category: "business", shortDescription: "A live pitch night for ambitious early-stage teams.", venue: { name: "Dreamplex Tran Quang Khai", address: "21 Tran Quang Khai, District 1", city: "Ho Chi Minh City", country: "Vietnam", latitude: 10.79, longitude: 106.69, capacity: 350, isOnline: false }, image: "photo-1556761175-b413da4baf72", day: 2, price: 200000 },
  { title: "Illustration Market Saigon", category: "art", shortDescription: "Meet independent illustrators and find your next favourite print.", venue: { name: "The Factory Contemporary Arts Centre", address: "15 Nguyen U Di, Thao Dien", city: "Ho Chi Minh City", country: "Vietnam", latitude: 10.80, longitude: 106.73, capacity: 600, isOnline: false }, image: "photo-1513364776144-60967b0f800f", day: 5, price: 50000 },
  { title: "Marathon for Green Cities", category: "entertainment", shortDescription: "Run together for cleaner and healthier neighbourhoods.", venue: { name: "Sala Urban Park", address: "Thu Duc City", city: "Ho Chi Minh City", country: "Vietnam", latitude: 10.77, longitude: 106.72, capacity: 2500, isOnline: false }, image: "photo-1530549387789-4c1017266635", day: 8, price: 300000 },
  { title: "Vietnam Education Innovation Day", category: "education", shortDescription: "Teachers and innovators share what works in modern classrooms.", venue: { name: "RMIT University Saigon South", address: "702 Nguyen Van Linh, District 7", city: "Ho Chi Minh City", country: "Vietnam", latitude: 10.73, longitude: 106.70, capacity: 800, isOnline: false }, image: "photo-1509062522246-3755977927d7", day: 11, price: 250000 },
  { title: "Women in Product Vietnam", category: "networking", shortDescription: "A welcoming space to learn, share, and grow together.", venue: { name: "The Sentry C", address: "16 Nguyen Dang Giai, Thao Dien", city: "Ho Chi Minh City", country: "Vietnam", latitude: 10.81, longitude: 106.73, capacity: 220, isOnline: false }, image: "photo-1551836022-d5d88e9218df", day: 14, price: 180000 },
  { title: "Mindful Living Weekend", category: "health", shortDescription: "Slow down with movement, breathwork, and thoughtful conversation.", venue: { name: "An Lam Retreats", address: "Binh Duong Province", city: "Binh Duong", country: "Vietnam", latitude: 10.95, longitude: 106.74, capacity: 160, isOnline: false }, image: "photo-1545205597-3d9d02c29597", day: 17, price: 500000 },
  { title: "Vietnam Game Dev Gathering", category: "technology", shortDescription: "From indie prototypes to the business of making games.", venue: { name: "Saigon Innovation Hub", address: "273 Dien Bien Phu, District 3", city: "Ho Chi Minh City", country: "Vietnam", latitude: 10.78, longitude: 106.69, capacity: 500, isOnline: false }, image: "photo-1542751371-adc38448a05e", day: 20, price: 320000 },
  { title: "Sunday Farmers Market", category: "food", shortDescription: "Seasonal produce, local makers, and a friendly morning out.", venue: { name: "Tao Dan Park", address: "District 1", city: "Ho Chi Minh City", country: "Vietnam", latitude: 10.77, longitude: 106.69, capacity: 1200, isOnline: false }, image: "photo-1488459716781-31db52582fe9", day: 23, price: 0 },
  { title: "The Future of Fintech", category: "business", shortDescription: "A practical look at payments, access, and responsible finance.", venue: { name: "JW Marriott Hanoi", address: "8 Do Duc Duc, Me Tri", city: "Hanoi", country: "Vietnam", latitude: 21.00, longitude: 105.78, capacity: 900, isOnline: false }, image: "photo-1460925895917-afdab827c52f", day: 26, price: 750000 },
  { title: "Acoustic Nights: New Voices", category: "music", shortDescription: "Discover emerging singer-songwriters in an intimate room.", venue: { name: "Indika Saigon", address: "43 Nguyen Van Giai, District 1", city: "Ho Chi Minh City", country: "Vietnam", latitude: 10.79, longitude: 106.69, capacity: 150, isOnline: false }, image: "photo-1510915361894-db8b60106cb1", day: 29, price: 220000 },
  { title: "Circular Design Workshop", category: "workshop", shortDescription: "Build better products with materials already around us.", venue: { name: "Think Playground", address: "District 2", city: "Ho Chi Minh City", country: "Vietnam", latitude: 10.80, longitude: 106.73, capacity: 90, isOnline: false }, image: "photo-1455390582262-044cdead277a", day: 1, price: 390000 },
  { title: "Hanoi Documentary Film Week", category: "entertainment", shortDescription: "Stories from Vietnam and the region, with filmmaker talks.", venue: { name: "National Cinema Center", address: "87 Lang Ha, Ba Dinh", city: "Hanoi", country: "Vietnam", latitude: 21.02, longitude: 105.81, capacity: 450, isOnline: false }, image: "photo-1489599849927-2ee91cede3ba", day: 4, price: 100000 },
  { title: "Cloud Native Vietnam Day", category: "technology", shortDescription: "Cloud infrastructure, platform teams, and lessons from production.", venue: { name: "Grand Palace Convention Center", address: "Tan Binh District", city: "Ho Chi Minh City", country: "Vietnam", latitude: 10.80, longitude: 106.65, capacity: 1100, isOnline: false }, image: "photo-1518770660439-4636190af475", day: 7, price: 620000 },
  { title: "Vietnam Contemporary Dance Showcase", category: "art", shortDescription: "A night of movement from the next generation of performers.", venue: { name: "Ho Chi Minh City Opera House", address: "7 Lam Son, District 1", city: "Ho Chi Minh City", country: "Vietnam", latitude: 10.78, longitude: 106.70, capacity: 500, isOnline: false }, image: "photo-1508700115892-45ecd05ae2ad", day: 10, price: 450000 },
  { title: "People & Planet Community Fair", category: "community", shortDescription: "Local groups, practical ideas, and small ways to make a difference.", venue: { name: "Independence Palace Gardens", address: "135 Nam Ky Khoi Nghia, District 1", city: "Ho Chi Minh City", country: "Vietnam", latitude: 10.78, longitude: 106.70, capacity: 1000, isOnline: false }, image: "photo-1511632765486-a01980e01a18", day: 13, price: 0 },
  { title: "UX Research: From Insight to Impact", category: "workshop", shortDescription: "Hands-on methods for asking better questions and sharing findings.", venue: { name: "UPGen Landmark 81", address: "720A Dien Bien Phu, Binh Thanh", city: "Ho Chi Minh City", country: "Vietnam", latitude: 10.79, longitude: 106.72, capacity: 120, isOnline: false }, image: "photo-1553877522-43269d4ea984", day: 16, price: 270000 },
  { title: "Vietnam Street Food Stories", category: "food", shortDescription: "A guided tasting and conversation with the people behind the dishes.", venue: { name: "Ben Thanh Street Food Market", address: "District 1", city: "Ho Chi Minh City", country: "Vietnam", latitude: 10.77, longitude: 106.70, capacity: 120, isOnline: false }, image: "photo-1555939594-58d7cb561ad1", day: 19, price: 180000 },
  { title: "The Makers' Holiday Market", category: "community", shortDescription: "Thoughtful gifts from independent Vietnamese makers.", venue: { name: "Saigon Outcast", address: "188/1 Nguyen Van Huong, Thao Dien", city: "Ho Chi Minh City", country: "Vietnam", latitude: 10.81, longitude: 106.73, capacity: 1400, isOnline: false }, image: "photo-1513506003901-1e6a229e2d15", day: 22, price: 0 },
  { title: "Digital Marketing Exchange", category: "business", shortDescription: "A working session for teams growing brands in Southeast Asia.", venue: { name: "Meliá Hanoi", address: "44B Ly Thuong Kiet, Hoan Kiem", city: "Hanoi", country: "Vietnam", latitude: 21.02, longitude: 105.85, capacity: 400, isOnline: false }, image: "photo-1552664730-d307ca884978", day: 25, price: 490000 },
  { title: "Vietnam Classical Music Evening", category: "music", shortDescription: "A chamber programme in a beautiful historic setting.", venue: { name: "Hanoi Opera House", address: "1 Trang Tien, Hoan Kiem", city: "Hanoi", country: "Vietnam", latitude: 21.02, longitude: 105.86, capacity: 600, isOnline: false }, image: "photo-1507838153414-b4b713384a76", day: 28, price: 550000 },
  { title: "Open Source Maintainers Meetup", category: "technology", shortDescription: "A community thank-you and knowledge exchange for maintainers.", venue: { name: "Online Event", address: "Live online", city: "Online", country: "Vietnam", latitude: 0, longitude: 0, capacity: 2000, isOnline: true }, image: "photo-1556075798-4825dfaaf498", day: 3, price: 0 },
  { title: "Vietnam Design Futures Conference", category: "conference", shortDescription: "Where design practice meets technology, culture, and business.", venue: { name: "Gem Center", address: "8 Nguyen Binh Khiem, District 1", city: "Ho Chi Minh City", country: "Vietnam", latitude: 10.79, longitude: 106.70, capacity: 950, isOnline: false }, image: "photo-1497366754035-f200968a6e72", day: 6, price: 790000 },
];

const imageUrl = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=960&q=82`;
const categoryLabels = new Map(eventCategories.map((category) => [category.value, category.label]));

export const mockEvents: Event[] = eventSeeds.map((seed, index) => {
  const id = `event-${String(index + 1).padStart(3, "0")}`;
  const start = new Date(Date.UTC(2026, 9 + Math.floor((seed.day - 1) / 30), ((seed.day - 1) % 30) + 1, 10));
  const organizer = mockOrganizerFor(index);
  const ticket: TicketType = {
    id: `ticket-${index + 1}-general`, eventId: id, name: "General Admission", description: "Standard event access", price: seed.price, currency: "VND", quantity: 500, sold: 80 + index * 7, maxPerOrder: 6,
    saleStart: "2026-08-01T00:00:00+07:00", saleEnd: "2026-12-31T23:59:00+07:00", status: "available", benefits: ["Event access"],
  };
  return {
    id, slug: seed.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""), title: seed.title,
    description: `${seed.shortDescription} Join a curious community of people who care about what comes next. Meet new people, learn from practitioners, and leave with ideas you can put into action.`,
    shortDescription: seed.shortDescription, coverImage: imageUrl(seed.image), thumbnailImage: imageUrl(seed.image), category: seed.category,
    organizer, venue: seed.venue, startDate: start.toISOString(), endDate: new Date(start.getTime() + 3 * 60 * 60 * 1000).toISOString(), startTime: "10:00", endTime: "18:00", timezone: "Asia/Ho_Chi_Minh",
    status: index === 26 ? "sold_out" : "published", ticketTypes: [ticket], tags: [categoryLabels.get(seed.category) ?? "Events"], featured: index < 8, viewCount: 9000 - index * 173,
    createdAt: "2026-08-01T00:00:00+07:00", updatedAt: "2026-09-01T00:00:00+07:00",
  };
});

import { mockOrganizers } from "@/lib/mock/organizers";
function mockOrganizerFor(index: number): Organizer {
  return mockOrganizers[index % mockOrganizers.length];
}
