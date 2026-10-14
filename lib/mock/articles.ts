export type ArticleTab = "latest" | "organizer";

export interface ArticleAuthor {
  name: string;
  avatar: string;
  role: string;
}

export type ArticleBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "list"; items: string[] }
  | { type: "quote"; text: string; cite?: string }
  | { type: "image"; src: string; caption?: string };

export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  coverImage: string;
  category: string;
  tab: ArticleTab;
  author: ArticleAuthor;
  /** ISO date (YYYY-MM-DD) */
  publishedAt: string;
  readMinutes: number;
  tags: string[];
  body: ArticleBlock[];
}

const img = (id: string, w = 1200) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

export const articles: Article[] = [
  {
    id: "art-1",
    slug: "top-exhibitions-bangkok-2026",
    title: "10 Exhibitions and Art Galleries You Shouldn't Miss This Season",
    excerpt: "Our curated list of must-see art shows, photo-worthy installations, opening hours and tips for booking tickets in advance.",
    coverImage: img("photo-1531058020387-3be344556be6"),
    category: "Art & Culture",
    tab: "latest",
    author: { name: "Nattha Karn", avatar: img("photo-1534528741775-53994a69daeb", 150), role: "Culture Editor" },
    publishedAt: "2026-10-10",
    readMinutes: 5,
    tags: ["Exhibition", "Art", "Weekend Guide"],
    body: [
      { type: "p", text: "The end of the year is the busiest time for galleries. New shows open almost every weekend, and many of them run for only a few weeks. We picked ten exhibitions that are worth your time, from blockbuster immersive experiences to small independent spaces." },
      { type: "h2", text: "1. Light & Space: An Immersive Journey" },
      { type: "p", text: "A 2,000 m² digital installation that reacts to your movement. Go on a weekday morning to avoid queues, and book a timed-entry ticket online — walk-ins are often sold out by noon." },
      { type: "h2", text: "2. Contemporary Voices of Southeast Asia" },
      { type: "p", text: "Thirty emerging artists from across the region present painting, sculpture and video work. Free guided tours run every Saturday at 2 PM." },
      { type: "image", src: img("photo-1460661419201-fd4cecdf8a8b"), caption: "Many galleries now offer timed-entry tickets to manage crowds." },
      { type: "h2", text: "Tips for a better gallery day" },
      { type: "list", items: ["Book timed-entry tickets in advance to skip the line.", "Check whether photography is allowed before you go.", "Combine nearby galleries into a single walking route.", "Follow the venue on TixFlow to get notified about new shows."] },
      { type: "quote", text: "Art is not what you see, but what you make others see.", cite: "Edgar Degas" },
      { type: "p", text: "Whatever your taste, there has never been a better time to explore the local art scene. Browse all exhibition tickets on TixFlow and save your favourites to your account." },
    ],
  },
  {
    id: "art-2",
    slug: "music-festival-guide-packing",
    title: "Going to Your First Music Festival? The Essential Packing Checklist",
    excerpt: "A survival guide for festival newcomers — pack smart so you can enjoy every set from sunset to the final encore.",
    coverImage: img("photo-1459749411175-04bf5292ceea"),
    category: "Festival",
    tab: "latest",
    author: { name: "TixFlow Music Team", avatar: img("photo-1507003211169-0a1dd7228f2d", 150), role: "Music Specialist" },
    publishedAt: "2026-10-08",
    readMinutes: 4,
    tags: ["Festival", "Music", "Checklist"],
    body: [
      { type: "p", text: "Your first festival is exciting — and a little overwhelming. Long days, big crowds and unpredictable weather mean a bit of planning goes a long way." },
      { type: "h2", text: "The must-haves" },
      { type: "list", items: ["Your e-ticket saved offline in the TixFlow app", "A fully charged power bank and cable", "Reusable water bottle (most festivals have free refill stations)", "Light rain poncho", "Comfortable, closed-toe shoes", "Ear plugs — your future self will thank you"] },
      { type: "h2", text: "Nice to have" },
      { type: "list", items: ["Small cross-body bag", "Sunscreen and sunglasses", "Wet wipes and hand sanitiser", "A meeting point agreed with your friends"] },
      { type: "quote", text: "Download your ticket before you leave home. Mobile networks at big festivals are often overloaded.", cite: "TixFlow Support" },
      { type: "p", text: "Most importantly: pace yourself, stay hydrated and have fun. See you in the front row!" },
    ],
  },
  {
    id: "art-3",
    slug: "indie-coffee-fair-highlight",
    title: "Highlights from The Coffee & Culture Fair: Specialty Coffee from Across Asia",
    excerpt: "Meet leading baristas and join in-depth cupping workshops all weekend long in the heart of the city.",
    coverImage: img("photo-1442512595331-e89e73853f31"),
    category: "Food & Drink",
    tab: "latest",
    author: { name: "Sira Wong", avatar: img("photo-1500648767791-00dcc994a43e", 150), role: "Lifestyle Writer" },
    publishedAt: "2026-10-05",
    readMinutes: 3,
    tags: ["Coffee", "Fair", "Food & Drink"],
    body: [
      { type: "p", text: "More than 120 roasters from 14 countries gathered for this year's Coffee & Culture Fair. Here is what stood out." },
      { type: "h2", text: "Cupping workshops sold out in minutes" },
      { type: "p", text: "Guided cupping sessions were limited to 20 people each and were fully booked within minutes of going on sale. If you plan to attend next year, enable ticket alerts so you don't miss the release." },
      { type: "h2", text: "Our favourite booths" },
      { type: "list", items: ["Highland single-origin roasts with fruity, floral notes", "Cold-brew tasting flight with five brewing methods", "Latte-art battle stage with live judging"] },
      { type: "p", text: "The fair returns next year with an expanded workshop zone. Follow the organizer on TixFlow to be the first to know." },
    ],
  },
  {
    id: "art-4",
    slug: "tech-trends-southeast-asia-2026",
    title: "AI & Cloud: Key Takeaways from the Vietnam Future Forum",
    excerpt: "A summary of the biggest themes and where the tech-startup industry in Southeast Asia is heading next.",
    coverImage: img("photo-1485827404703-89b55fcc595e"),
    category: "Technology",
    tab: "latest",
    author: { name: "Anan Tech", avatar: img("photo-1492562080023-ab3db95bfbce", 150), role: "Tech Reporter" },
    publishedAt: "2026-10-02",
    readMinutes: 6,
    tags: ["AI", "Startup", "Conference"],
    body: [
      { type: "p", text: "Over two days, more than 3,000 founders, engineers and investors met to discuss the future of technology in the region. These were the recurring themes." },
      { type: "h2", text: "1. Practical AI beats hype" },
      { type: "p", text: "Speakers focused less on model size and more on measurable outcomes: customer-support automation, document processing and forecasting." },
      { type: "h2", text: "2. Cloud cost optimisation" },
      { type: "p", text: "With funding tighter than in previous years, startups are investing heavily in FinOps and moving workloads to more efficient architectures." },
      { type: "h2", text: "3. Regional talent" },
      { type: "list", items: ["Remote-first hiring across borders is now the norm", "Universities partnering with startups on applied research", "Growing demand for data and security engineers"] },
      { type: "quote", text: "The next wave of unicorns will be built on boring, reliable infrastructure.", cite: "Keynote speaker" },
    ],
  },
  {
    id: "art-5",
    slug: "organizer-guide-ticket-pricing",
    title: "Early-Bird Pricing Strategies That Sell Out Your Tickets in 24 Hours",
    excerpt: "Cost calculation techniques, pricing psychology and how to release ticket tiers for maximum impact.",
    coverImage: img("photo-1556761175-b413da4baf72"),
    category: "Organizer Tips",
    tab: "organizer",
    author: { name: "TixFlow Operations", avatar: img("photo-1573496359142-b8d87734a5a2", 150), role: "Event Strategist" },
    publishedAt: "2026-10-09",
    readMinutes: 7,
    tags: ["Pricing", "Ticketing", "Organizer"],
    body: [
      { type: "p", text: "Early-bird tickets do more than generate cash flow — they create urgency, validate demand and give you data to plan the rest of your sales." },
      { type: "h2", text: "Start with your break-even point" },
      { type: "p", text: "Add up venue, production, staff and marketing costs, then divide by your realistic attendance. Your early-bird price should sit 15–30% below your standard price, but never below break-even." },
      { type: "h2", text: "Use tiers, not deadlines alone" },
      { type: "list", items: ["Tier 1: limited quantity (e.g. first 200 tickets)", "Tier 2: time-limited (e.g. the following two weeks)", "Standard: regular price until the event", "Door: highest price, if available"] },
      { type: "h2", text: "Communicate scarcity honestly" },
      { type: "p", text: "Show remaining quantities on your TixFlow event page. Real-time inventory builds trust and encourages buyers to act now." },
      { type: "quote", text: "The best early-bird campaigns reward your most loyal fans first.", cite: "TixFlow Operations" },
    ],
  },
  {
    id: "art-6",
    slug: "organizer-checkin-system-qr",
    title: "How QR-Code Check-in Cuts Entry Queues in Half",
    excerpt: "Using the TixFlow scanner and setting up an offline fallback for smooth on-site operations.",
    coverImage: img("photo-1511578314322-379afb476865"),
    category: "Operations",
    tab: "organizer",
    author: { name: "Chaiyaporn D.", avatar: img("photo-1472099645785-5658abf4ff4e", 150), role: "Technical Lead" },
    publishedAt: "2026-10-06",
    readMinutes: 4,
    tags: ["Check-in", "QR Code", "Operations"],
    body: [
      { type: "p", text: "Long queues are the first impression attendees have of your event. QR-code check-in can process a guest in under three seconds." },
      { type: "h2", text: "Before event day" },
      { type: "list", items: ["Assign scanner roles to your staff in the organizer dashboard", "Download the attendee list for offline mode", "Test every device on the venue Wi-Fi"] },
      { type: "h2", text: "On the day" },
      { type: "p", text: "Open separate lanes for pre-registered guests and on-site purchases. Each scan syncs instantly, so duplicate entries are rejected across all gates." },
      { type: "h2", text: "When the network fails" },
      { type: "p", text: "Offline mode keeps scanning and syncs automatically once a connection returns — no lost check-ins." },
    ],
  },
  {
    id: "art-7",
    slug: "organizer-event-marketing-playbook",
    title: "The Social Media Playbook for Promoting Your Event",
    excerpt: "Content ideas, paid ads and choosing the right influencers to promote your event cost-effectively.",
    coverImage: img("photo-1552664730-d307ca884978"),
    category: "Marketing",
    tab: "organizer",
    author: { name: "Ploy Pim", avatar: img("photo-1544005313-94ddf0286df2", 150), role: "Growth Marketer" },
    publishedAt: "2026-10-03",
    readMinutes: 5,
    tags: ["Marketing", "Social Media", "Organizer"],
    body: [
      { type: "p", text: "A great event still needs an audience. This playbook breaks a six-week campaign into simple, repeatable steps." },
      { type: "h2", text: "Weeks 6–4: Build anticipation" },
      { type: "list", items: ["Announce the date with a strong key visual", "Share behind-the-scenes content from planning", "Open early-bird sales with a clear deadline"] },
      { type: "h2", text: "Weeks 3–2: Convert" },
      { type: "list", items: ["Reveal speakers or line-up in batches", "Run retargeting ads to page visitors", "Partner with 2–3 niche creators rather than one big name"] },
      { type: "h2", text: "Final week: Urgency" },
      { type: "p", text: "Share remaining ticket counts, run a countdown and remind buyers about the schedule and venue logistics." },
    ],
  },
  {
    id: "art-8",
    slug: "organizer-hybrid-events-streaming",
    title: "Running Hybrid Events That Engage Both On-site and Online Audiences",
    excerpt: "Audio gear, high-quality video streaming and interactive activities that keep everyone involved.",
    coverImage: img("photo-1517245386807-bb43f82c33c4"),
    category: "Production",
    tab: "organizer",
    author: { name: "Korn V.", avatar: img("photo-1506794778202-cad84cf45f1d", 150), role: "Live Production Lead" },
    publishedAt: "2026-10-01",
    readMinutes: 5,
    tags: ["Hybrid", "Streaming", "Production"],
    body: [
      { type: "p", text: "Hybrid events let you reach people who can't travel, but online viewers disengage quickly if they feel like an afterthought." },
      { type: "h2", text: "Get the audio right" },
      { type: "p", text: "Viewers forgive average video, but not bad sound. Use a dedicated audio feed from the mixing desk rather than a camera microphone." },
      { type: "h2", text: "Design for both audiences" },
      { type: "list", items: ["Assign a host dedicated to the online audience", "Use live polls and Q&A open to everyone", "Schedule shorter sessions with breaks for online viewers"] },
      { type: "p", text: "Sell separate on-site and online ticket types in TixFlow to track attendance and engagement for each group." },
    ],
  },
  {
    id: "art-9",
    slug: "best-weekend-markets-2026",
    title: "The Best Weekend Markets and Night Bazaars to Explore",
    excerpt: "Street food, handmade crafts and live music — our pick of markets that make the perfect weekend plan.",
    coverImage: img("photo-1533900298318-6b8da08a523e"),
    category: "Lifestyle",
    tab: "latest",
    author: { name: "Mai Linh", avatar: img("photo-1438761681033-6461ffad8d80", 150), role: "Travel Writer" },
    publishedAt: "2026-09-28",
    readMinutes: 4,
    tags: ["Market", "Food", "Weekend Guide"],
    body: [
      { type: "p", text: "Weekend markets are the easiest way to discover local makers, try new food and enjoy live music without breaking the bank." },
      { type: "h2", text: "What to expect" },
      { type: "list", items: ["Free entry at most markets; some special editions require a ticket", "Cash and QR payments widely accepted", "Peak hours usually between 6 PM and 9 PM"] },
      { type: "p", text: "Check the Shopping and Food & Drink categories on TixFlow for special market editions and pop-ups." },
    ],
  },
  {
    id: "art-10",
    slug: "organizer-choosing-the-right-venue",
    title: "Choosing the Right Venue: A Checklist for First-Time Organizers",
    excerpt: "Capacity, accessibility, technical specs and contract terms to review before you sign.",
    coverImage: img("photo-1505373877841-8d25f7d46678"),
    category: "Organizer Tips",
    tab: "organizer",
    author: { name: "TixFlow Operations", avatar: img("photo-1573496359142-b8d87734a5a2", 150), role: "Event Strategist" },
    publishedAt: "2026-09-25",
    readMinutes: 6,
    tags: ["Venue", "Planning", "Organizer"],
    body: [
      { type: "p", text: "Your venue shapes the attendee experience, your budget and even your ticket price. Use this checklist before signing any contract." },
      { type: "h2", text: "The essentials" },
      { type: "list", items: ["Capacity for both seated and standing layouts", "Wheelchair access and accessible restrooms", "Loading access for production equipment", "Reliable Wi-Fi for check-in and streaming", "Public transport and parking options"] },
      { type: "h2", text: "Contract details" },
      { type: "list", items: ["Cancellation and force-majeure terms", "Noise and curfew restrictions", "Exclusive supplier requirements (catering, AV)"] },
      { type: "p", text: "Once your venue is confirmed, create a seat map in TixFlow and start selling reserved-seating tickets in minutes." },
    ],
  },
  {
    id: "art-11",
    slug: "streamline-event-checkin-thailand",
    title: "Streamline Your Event Entry with Advanced On-Site Registration & Badge Distribution",
    excerpt: "How automated QR scanners, high-speed thermal badge printing, and smart turnstiles eliminate entry queues for conferences and major expos.",
    coverImage: img("photo-1511578314322-379afb476865"),
    category: "Operations",
    tab: "organizer",
    author: { name: "Tanachai R.", avatar: img("photo-1507003211169-0a1dd7228f2d", 150), role: "On-site Solutions Lead" },
    publishedAt: "2026-10-12",
    readMinutes: 5,
    tags: ["On-site", "Check-in", "Badge Printing"],
    body: [
      { type: "p", text: "Long registration lines can sour an attendee's first impression before they ever step into your keynote. Modern event operations rely on fast, integrated check-in workflows." },
      { type: "h2", text: "Instant Badge Printing" },
      { type: "p", text: "With TixFlow's automated kiosk integration, scanning an e-ticket barcode immediately prints a high-resolution name badge in under 3 seconds." },
      { type: "h2", text: "Offline-First Synchronization" },
      { type: "p", text: "Even in crowded convention halls with fluctuating cell signals, local mesh syncing keeps multiple gates coordinated without double entries." },
    ],
  },
  {
    id: "art-12",
    slug: "event-ticketing-platform-international-organizers",
    title: "The Ultimate Event Ticketing Platform in Southeast Asia for International Organizers",
    excerpt: "Multi-currency checkout, localized payment rails, and bilingual booking flows built for cross-border attendees.",
    coverImage: img("photo-1451187580459-43490279c0fa"),
    category: "Ticketing",
    tab: "organizer",
    author: { name: "Elena Rostova", avatar: img("photo-1573496359142-b8d87734a5a2", 150), role: "Global Expansion Lead" },
    publishedAt: "2026-10-11",
    readMinutes: 6,
    tags: ["Ticketing", "Global Events", "Multi-Currency"],
    body: [
      { type: "p", text: "Hosting international summits in Bangkok, Singapore, Hanoi, or Tokyo requires friction-free ticketing for overseas guests as well as local attendees." },
      { type: "h2", text: "Local & International Payment Rails" },
      { type: "p", text: "Accept Visa, Mastercard, PromptPay, MoMo, and bank transfers without forcing users through clunky currency conversion fees." },
      { type: "h2", text: "Automated Tax Invoices & VAT Receipts" },
      { type: "p", text: "Corporate attendees require compliant expense documents. TixFlow automates corporate tax invoice generation instantly upon payment confirmation." },
    ],
  },
];

export function getArticles(tab?: ArticleTab): Article[] {
  const list = tab ? articles.filter((article) => article.tab === tab) : articles;
  return [...list].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find((article) => article.slug === slug);
}

export function getFeaturedArticles(limit = 5): Article[] {
  const sorted = getArticles();
  // Curate top 5 high-impact banner stories
  return [
    sorted.find((a) => a.id === "art-11") || sorted[0],
    sorted.find((a) => a.id === "art-1") || sorted[1],
    sorted.find((a) => a.id === "art-12") || sorted[2],
    sorted.find((a) => a.id === "art-4") || sorted[3],
    sorted.find((a) => a.id === "art-2") || sorted[4],
  ].filter(Boolean).slice(0, limit);
}

export function getTrendingArticles(limit = 6): Article[] {
  // Lifestyle, festivals, culture, food
  return getArticles().filter((a) => a.tab === "latest").slice(0, limit);
}

export function getOrganizerArticles(limit = 6): Article[] {
  // Organizer guides and playbooks
  return getArticles("organizer").slice(0, limit);
}

export function getRelatedArticles(article: Article, limit = 3): Article[] {
  return getArticles(article.tab).filter((candidate) => candidate.slug !== article.slug).slice(0, limit);
}

export function formatArticleDate(iso: string): string {
  return new Intl.DateTimeFormat("en-US", { day: "numeric", month: "short", year: "numeric" }).format(new Date(`${iso}T00:00:00Z`));
}
