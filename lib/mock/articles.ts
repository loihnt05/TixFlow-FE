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
  editorialSection?:
    | "Editors' Picks"
    | "What's On"
    | "Videos"
    | "Art & Entertainment"
    | "IT & Gadget"
    | "Event News"
    | "Food & Travel"
    | "Event Guidelines"
    | "Health & Beauty"
    | "Lifestyles";
  likes?: number;
  tab: ArticleTab;
  author: ArticleAuthor;
  /** ISO date (YYYY-MM-DD) */
  publishedAt: string;
  readMinutes: number;
  tags: string[];
  body: ArticleBlock[];
}

const img = (id: string, w = 1200) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

export const blogSidebarCategories = [
  "Around the World",
  "Art & Entertainment",
  "Editors' Picks",
  "Event Explore",
  "Event Guidelines",
  "Event News",
  "Food & Travel",
  "Health & Beauty",
  "IT & Gadget",
  "Lifestyles",
  "Videos",
];

export const articles: Article[] = [
  {
    id: "art-1",
    slug: "top-exhibitions-bangkok-2026",
    title: "What's On in October? 10 Must-See Art Exhibitions & Digital Museums in 2026",
    excerpt:
      "What's on in October? Check in at 10 curated contemporary galleries, holographic light rooms, and weekend art spaces before they close.",
    coverImage: img("photo-1531058020387-3be344556be6"),
    category: "Editors' Picks",
    editorialSection: "Editors' Picks",
    likes: 18,
    tab: "latest",
    author: {
      name: "Wirawan Changkao",
      avatar: img("photo-1534528741775-53994a69daeb", 150),
      role: "Culture Editor",
    },
    publishedAt: "2026-10-20",
    readMinutes: 3,
    tags: ["Exhibition", "Art", "Weekend Guide"],
    body: [
      {
        type: "p",
        text: "The end of the year is the busiest time for galleries. New shows open almost every weekend, and many of them run for only a few weeks. We picked ten exhibitions that are worth your time, from blockbuster immersive experiences to small independent spaces.",
      },
      { type: "h2", text: "1. Space & Time Cube+: An Immersive Journey" },
      {
        type: "p",
        text: "A 2,000 m² digital installation that reacts to your movement. Go on a weekday morning to avoid queues, and book a timed-entry ticket online — walk-ins are often sold out by noon.",
      },
      { type: "h2", text: "2. Contemporary Voices of Southeast Asia" },
      {
        type: "p",
        text: "Thirty emerging artists from across the region present painting, sculpture and video work. Free guided tours run every Saturday at 2 PM.",
      },
      {
        type: "image",
        src: img("photo-1460661419201-fd4cecdf8a8b"),
        caption: "Many galleries now offer timed-entry tickets to manage crowds.",
      },
      { type: "h2", text: "Tips for a better gallery day" },
      {
        type: "list",
        items: [
          "Book timed-entry tickets in advance to skip the line.",
          "Check whether photography is allowed before you go.",
          "Combine nearby galleries into a single walking route.",
          "Follow the venue on TixFlow to get notified about new shows.",
        ],
      },
      {
        type: "quote",
        text: "Art is not what you see, but what you make others see.",
        cite: "Edgar Degas",
      },
    ],
  },
  {
    id: "art-2",
    slug: "music-festival-guide-packing",
    title: "October Concert Update! 24 Live Concerts & Fanmeetings Not to Miss",
    excerpt:
      "From indie livehouse tours and orchestral anime nights to K-pop fanmeetings — bookmark every ticket on-sale date this month.",
    coverImage: img("photo-1459749411175-04bf5292ceea"),
    category: "Editors' Picks",
    editorialSection: "Editors' Picks",
    likes: 24,
    tab: "latest",
    author: {
      name: "TixFlow Music Team",
      avatar: img("photo-1507003211169-0a1dd7228f2d", 150),
      role: "Music Specialist",
    },
    publishedAt: "2026-10-18",
    readMinutes: 4,
    tags: ["Concert", "Festival", "Music"],
    body: [
      {
        type: "p",
        text: "October brings back-to-back arena concerts, intimate vinyl listening sessions, and cross-border indie showcases across Bangkok and Ho Chi Minh City.",
      },
      { type: "h2", text: "Essential Concert Checklist" },
      {
        type: "list",
        items: [
          "Save your QR e-ticket offline before arriving at the venue",
          "Bring a compact power bank and cable",
          "Check bag-size restrictions for theatre & arena gates",
          "Arrive 45 minutes early for merch booths",
        ],
      },
    ],
  },
  {
    id: "art-13",
    slug: "september-art-events-roundup-2026",
    title: "What's On This Season? 12 Contemporary Galleries & Photowalks",
    excerpt:
      "Discover hidden studio spaces, ceramic pop-ups, and riverside architecture exhibitions open with free & timed-entry passes.",
    coverImage: img("photo-1547891654-e66ed7ebb968"),
    category: "Editors' Picks",
    editorialSection: "Editors' Picks",
    likes: 11,
    tab: "latest",
    author: {
      name: "Wirawan Changkao",
      avatar: img("photo-1534528741775-53994a69daeb", 150),
      role: "Culture Editor",
    },
    publishedAt: "2026-09-29",
    readMinutes: 3,
    tags: ["Exhibition", "Gallery", "Art"],
    body: [
      {
        type: "p",
        text: "Independent art spaces are transforming historic shophouses and warehouses into vibrant weekend destinations.",
      },
    ],
  },
  {
    id: "art-14",
    slug: "late-year-arena-tour-calendar-2026",
    title: "Year-End Concert Calendar: 20 Arena Tours & Indie Showcases Announced",
    excerpt:
      "Plan your year-end live music budget with early-bird presale dates, seating tier breakdowns, and venue transport tips.",
    coverImage: img("photo-1514525253161-7a46d19cd819"),
    category: "Editors' Picks",
    editorialSection: "Editors' Picks",
    likes: 19,
    tab: "latest",
    author: {
      name: "Mananchaya Warasup",
      avatar: img("photo-1544005313-94ddf0286df2", 150),
      role: "Entertainment Editor",
    },
    publishedAt: "2026-09-22",
    readMinutes: 4,
    tags: ["Concert", "Music", "Editors' Picks"],
    body: [
      {
        type: "p",
        text: "Here are the twenty biggest live tours and music festivals confirmed for the final quarter of 2026.",
      },
    ],
  },
  {
    id: "art-15",
    slug: "arthouse-cinema-october-spotlight-2026",
    title: "Cult Cinema Spotlight: 8 Restored Classics Screening at Sala Saneha",
    excerpt:
      "From Robert Eggers' The Lighthouse to Kubrick's The Shining and Scorsese's After Hours — why boutique cinema clubs are thriving.",
    coverImage: img("photo-1489599849927-2ee91cede3ba"),
    category: "Editors' Picks",
    editorialSection: "Editors' Picks",
    likes: 31,
    tab: "latest",
    author: {
      name: "Kanyavee Jin",
      avatar: img("photo-1438761681033-6461ffad8d80", 150),
      role: "Film Critic",
    },
    publishedAt: "2026-09-15",
    readMinutes: 5,
    tags: ["Film", "Cinema", "Editors' Picks"],
    body: [
      {
        type: "p",
        text: "Boutique screening rooms are bringing cult masterpieces back to the big screen with curated post-film discussions.",
      },
    ],
  },

  // What's On / Monthly Highlights (3 cards)
  {
    id: "art-16",
    slug: "october-weekend-event-horoscope-pick",
    title: "October Event Finder: Matching Your Weekend Vibe to the Perfect Show",
    excerpt:
      "Whether you crave quiet museum mornings, high-energy synth-pop gigs, or specialty coffee cuppings, here is your October match.",
    coverImage: img("photo-1518709268805-4e9042af9f23"),
    category: "Event Explore",
    editorialSection: "What's On",
    likes: 9,
    tab: "latest",
    author: {
      name: "Wirawan Changkao",
      avatar: img("photo-1534528741775-53994a69daeb", 150),
      role: "Culture Editor",
    },
    publishedAt: "2026-10-16",
    readMinutes: 2,
    tags: ["Event Explore", "Weekend Guide"],
    body: [
      {
        type: "p",
        text: "Not sure how to spend your Saturday? Match your mood with our curated picks across art, film, and live music.",
      },
    ],
  },
  {
    id: "art-17",
    slug: "immersive-digital-art-museums-guide",
    title: "Inside Southeast Asia's New Wave of 3D Projection & Mirrored Art Museums",
    excerpt:
      "A closer look at Space & Time Cube+ and Cave Fantasy — camera settings, best visiting hours, and ticket bundles.",
    coverImage: img("photo-1513364776144-60967b0f800f"),
    category: "Event Explore",
    editorialSection: "What's On",
    likes: 15,
    tab: "latest",
    author: {
      name: "Wirawan Changkao",
      avatar: img("photo-1534528741775-53994a69daeb", 150),
      role: "Culture Editor",
    },
    publishedAt: "2026-10-09",
    readMinutes: 3,
    tags: ["Digital Art", "Museum", "Exhibition"],
    body: [
      {
        type: "p",
        text: "Immersive digital art venues combine spatial audio, floor-to-ceiling LEDs, and interactive sensors for unforgettable visits.",
      },
    ],
  },
  {
    id: "art-18",
    slug: "night-museums-after-dark-experiences",
    title: "After-Dark Culture: 7 Night Museums, Rooftop Jazz & Late Screenings",
    excerpt:
      "Skip the daytime heat and explore galleries, vinyl bars, and open-air amphitheatres that come alive after 7 PM.",
    coverImage: img("photo-1511192336575-5a79af67a629"),
    category: "Around the World",
    editorialSection: "What's On",
    likes: 14,
    tab: "latest",
    author: {
      name: "Mananchaya Warasup",
      avatar: img("photo-1544005313-94ddf0286df2", 150),
      role: "Entertainment Editor",
    },
    publishedAt: "2026-10-04",
    readMinutes: 3,
    tags: ["Nightlife", "Jazz", "Museum"],
    body: [
      {
        type: "p",
        text: "Late-night cultural programming is booming across Southeast Asian capitals, offering cooler air and smaller crowds.",
      },
    ],
  },

  // Videos & Creative Playbooks (3 cards)
  {
    id: "art-8",
    slug: "organizer-hybrid-events-streaming",
    title: "Behind the Scenes: Expanding Regional Live Ticketing & Hybrid Broadcasts Across SEA",
    excerpt:
      "How multi-camera live production and interactive digital passes connect fans across Bangkok, Saigon, and Singapore.",
    coverImage: img("photo-1517245386807-bb43f82c33c4"),
    category: "Videos",
    editorialSection: "Videos",
    likes: 12,
    tab: "organizer",
    author: {
      name: "Mananchaya Warasup",
      avatar: img("photo-1506794778202-cad84cf45f1d", 150),
      role: "Live Production Lead",
    },
    publishedAt: "2026-10-01",
    readMinutes: 5,
    tags: ["Hybrid", "Videos", "Production"],
    body: [
      {
        type: "p",
        text: "Hybrid events let you reach people who can't travel, while on-demand rerun tickets extend your event's lifecycle for months.",
      },
      { type: "h2", text: "Get the audio right" },
      {
        type: "p",
        text: "Viewers forgive average video, but not bad sound. Use a dedicated audio feed from the mixing desk rather than a camera microphone.",
      },
    ],
  },
  {
    id: "art-19",
    slug: "creative-portfolio-websites-for-designers",
    title: "6 Free Online Portfolio Builders Every Creative & Event Designer Should Bookmark",
    excerpt:
      "Showcase your key visuals, stage layouts, and motion reels cleanly so agencies and festival directors notice your work.",
    coverImage: img("photo-1498050108023-c5249f4df085"),
    category: "Videos",
    editorialSection: "Videos",
    likes: 21,
    tab: "latest",
    author: {
      name: "Kanyavee Jin",
      avatar: img("photo-1438761681033-6461ffad8d80", 150),
      role: "Design Writer",
    },
    publishedAt: "2026-09-18",
    readMinutes: 3,
    tags: ["Design", "Creative", "Videos"],
    body: [
      {
        type: "p",
        text: "A fast, visual-first portfolio makes all the difference when pitching creative direction for concerts and exhibitions.",
      },
    ],
  },
  {
    id: "art-20",
    slug: "free-png-vector-resources-for-creators",
    title: "6 Royalty-Free Asset Libraries for Event Posters & Social Key Visuals",
    excerpt:
      "High-resolution textures, typography specimens, and transparent 3D elements ready for commercial poster workflows.",
    coverImage: img("photo-1558655146-d09347e92766"),
    category: "Videos",
    editorialSection: "Videos",
    likes: 20,
    tab: "latest",
    author: {
      name: "Kanyavee Jin",
      avatar: img("photo-1438761681033-6461ffad8d80", 150),
      role: "Design Writer",
    },
    publishedAt: "2026-09-11",
    readMinutes: 2,
    tags: ["Design", "Poster", "Resources"],
    body: [
      {
        type: "p",
        text: "Speed up your social media key-visual production with these vetted, high-resolution creative asset libraries.",
      },
    ],
  },

  // Art & Entertainment (3 cards)
  {
    id: "art-21",
    slug: "indie-playlists-late-night-commute",
    title: "24 Southeast Asian Indie & Dream-Pop Playlists for Late-Night Commutes",
    excerpt:
      "Warm analog synths, melancholic guitar lines, and rising bands performing live on tour this season.",
    coverImage: img("photo-1511671782779-c97d3d27a1d4"),
    category: "Art & Entertainment",
    editorialSection: "Art & Entertainment",
    likes: 8,
    tab: "latest",
    author: {
      name: "Wirawan Changkao",
      avatar: img("photo-1534528741775-53994a69daeb", 150),
      role: "Culture Editor",
    },
    publishedAt: "2026-09-26",
    readMinutes: 3,
    tags: ["Music", "Playlist", "Indie"],
    body: [
      {
        type: "p",
        text: "Queue up twenty-four curated playlists featuring artists taking the livehouse stage this autumn.",
      },
    ],
  },
  {
    id: "art-22",
    slug: "anime-orchestra-ending-themes-explained",
    title: "Decoding Iconic Anime Ending Themes Performed Live by Full Symphony Orchestras",
    excerpt:
      "Why orchestral arrangements of modern anime soundtracks are selling out concert halls across Asia in minutes.",
    coverImage: img("photo-1507838153414-b4b713384a76"),
    category: "Art & Entertainment",
    editorialSection: "Art & Entertainment",
    likes: 16,
    tab: "latest",
    author: {
      name: "TixFlow Editorial",
      avatar: img("photo-1507003211169-0a1dd7228f2d", 150),
      role: "Music Critic",
    },
    publishedAt: "2026-09-19",
    readMinutes: 4,
    tags: ["Anime", "Orchestra", "Concert"],
    body: [
      {
        type: "p",
        text: "Hearing an 80-piece choir and orchestra perform cinematic anime scores live transforms familiar melodies into cathartic theatre.",
      },
    ],
  },
  {
    id: "art-23",
    slug: "musical-theatre-revival-bangkok-saigon",
    title: "Inside 'Dream Secret' & the Rise of Original Chamber Musicals in Asia",
    excerpt:
      "Intimate black-box theatres are staging bold original musicals with immersive lighting and close-up acoustics.",
    coverImage: img("photo-1507676184212-d03ab07a01bf"),
    category: "Art & Entertainment",
    editorialSection: "Art & Entertainment",
    likes: 7,
    tab: "latest",
    author: {
      name: "Mananchaya Warasup",
      avatar: img("photo-1544005313-94ddf0286df2", 150),
      role: "Theatre Writer",
    },
    publishedAt: "2026-09-14",
    readMinutes: 3,
    tags: ["Musical", "Theatre", "Stage"],
    body: [
      {
        type: "p",
        text: "New-generation stage directors are blending projection mapping with intimate live orchestration.",
      },
    ],
  },

  // IT & Gadget (3 cards)
  {
    id: "art-4",
    slug: "tech-trends-southeast-asia-2026",
    title: "AI & Cloud in Production: Key Takeaways from Vietnam Future Forum 2026",
    excerpt:
      "A summary of the biggest themes and where the tech-startup industry in Southeast Asia is heading next.",
    coverImage: img("photo-1485827404703-89b55fcc595e"),
    category: "IT & Gadget",
    editorialSection: "IT & Gadget",
    likes: 11,
    tab: "latest",
    author: {
      name: "Anan Tech",
      avatar: img("photo-1492562080023-ab3db95bfbce", 150),
      role: "Tech Reporter",
    },
    publishedAt: "2026-10-02",
    readMinutes: 6,
    tags: ["AI", "Startup", "Conference"],
    body: [
      {
        type: "p",
        text: "Over two days, more than 3,000 founders, engineers and investors met to discuss the future of technology in the region.",
      },
      { type: "h2", text: "1. Practical AI beats hype" },
      {
        type: "p",
        text: "Speakers focused less on model size and more on measurable outcomes: customer-support automation, document processing and forecasting.",
      },
    ],
  },
  {
    id: "art-24",
    slug: "concert-phone-camera-settings-guide",
    title: "7 Smartphone Camera Settings for Crisp Low-Light Concert & Exhibition Shots",
    excerpt:
      "Lock exposure, tame stage LED flicker, and capture sharp livehouse memories without blinding your neighbours.",
    coverImage: img("photo-1516035069371-29a1b244cc32"),
    category: "IT & Gadget",
    editorialSection: "IT & Gadget",
    likes: 14,
    tab: "latest",
    author: {
      name: "Nathaikan T",
      avatar: img("photo-1500648767791-00dcc994a43e", 150),
      role: "Gadget Editor",
    },
    publishedAt: "2026-09-21",
    readMinutes: 3,
    tags: ["Photography", "Gadget", "Concert"],
    body: [
      {
        type: "p",
        text: "Stage spotlights trick automatic phone exposure into blowing out highlights. Pull exposure down -0.7 EV for dramatic concert shots.",
      },
    ],
  },
  {
    id: "art-25",
    slug: "conference-carry-gear-laptop-sleeves",
    title: "6 Ultralight Tech Pouches & Power Banks Built for All-Day Summits",
    excerpt:
      "Stay charged from morning keynotes to evening networking mixers without weighing down your shoulder bag.",
    coverImage: img("photo-1518770660439-4636190af475"),
    category: "IT & Gadget",
    editorialSection: "IT & Gadget",
    likes: 6,
    tab: "latest",
    author: {
      name: "Nathaikan T",
      avatar: img("photo-1500648767791-00dcc994a43e", 150),
      role: "Gadget Editor",
    },
    publishedAt: "2026-09-10",
    readMinutes: 2,
    tags: ["Gadget", "Conference", "Gear"],
    body: [
      {
        type: "p",
        text: "A 10,000mAh GaN pack and a slim organizer pouch keep conference days effortless.",
      },
    ],
  },

  // Event News (3 cards)
  {
    id: "art-12",
    slug: "event-ticketing-platform-international-organizers",
    title: "The Ultimate Event Ticketing Platform in Southeast Asia for International Organizers",
    excerpt:
      "Multi-currency checkout, localized payment rails, and bilingual booking flows built for cross-border attendees.",
    coverImage: img("photo-1451187580459-43490279c0fa"),
    category: "Event News",
    editorialSection: "Event News",
    likes: 9,
    tab: "organizer",
    author: {
      name: "Elena Rostova",
      avatar: img("photo-1573496359142-b8d87734a5a2", 150),
      role: "Global Expansion Lead",
    },
    publishedAt: "2026-10-11",
    readMinutes: 6,
    tags: ["Ticketing", "Global Events", "Multi-Currency"],
    body: [
      {
        type: "p",
        text: "Hosting international summits in Bangkok, Singapore, Hanoi, or Tokyo requires friction-free ticketing for overseas guests as well as local attendees.",
      },
    ],
  },
  {
    id: "art-26",
    slug: "gamescom-southeast-asia-gaming-expo-news",
    title: "Regional Gaming & Pop-Culture Expo Returns with Indie Showcase & Cosplay Arena",
    excerpt:
      "Play unreleased indie titles, meet voice actors, and grab early-bird weekend passes before tier-1 sells out.",
    coverImage: img("photo-1542751371-adc38448a05e"),
    category: "Event News",
    editorialSection: "Event News",
    likes: 13,
    tab: "latest",
    author: {
      name: "Mananchaya Warasup",
      avatar: img("photo-1544005313-94ddf0286df2", 150),
      role: "Entertainment Editor",
    },
    publishedAt: "2026-09-27",
    readMinutes: 3,
    tags: ["Gaming", "Expo", "Event News"],
    body: [
      {
        type: "p",
        text: "More than 150 studios and hardware partners are joining this year's expanded gaming convention floor.",
      },
    ],
  },
  {
    id: "art-7",
    slug: "organizer-event-marketing-playbook",
    title: "6-Week Social Media & Creator Launch Playbook for Selling Out Live Events",
    excerpt:
      "Content ideas, paid retargeting windows, and choosing niche creators to promote your event cost-effectively.",
    coverImage: img("photo-1552664730-d307ca884978"),
    category: "Event News",
    editorialSection: "Event News",
    likes: 10,
    tab: "organizer",
    author: {
      name: "Ploy Pim",
      avatar: img("photo-1544005313-94ddf0286df2", 150),
      role: "Growth Marketer",
    },
    publishedAt: "2026-10-03",
    readMinutes: 5,
    tags: ["Marketing", "Social Media", "Organizer"],
    body: [
      {
        type: "p",
        text: "A great event still needs an audience. This playbook breaks a six-week campaign into simple, repeatable steps.",
      },
    ],
  },

  // Food & Travel (3 cards)
  {
    id: "art-3",
    slug: "indie-coffee-fair-highlight",
    title: "Highlights from The Coffee & Culture Fair: Specialty Roasters Across Asia",
    excerpt:
      "Meet leading baristas and join in-depth cupping workshops all weekend long in the heart of the city.",
    coverImage: img("photo-1442512595331-e89e73853f31"),
    category: "Food & Travel",
    editorialSection: "Food & Travel",
    likes: 17,
    tab: "latest",
    author: {
      name: "Sira Wong",
      avatar: img("photo-1500648767791-00dcc994a43e", 150),
      role: "Lifestyle Writer",
    },
    publishedAt: "2026-10-05",
    readMinutes: 3,
    tags: ["Coffee", "Fair", "Food & Drink"],
    body: [
      {
        type: "p",
        text: "More than 120 roasters from 14 countries gathered for this year's Coffee & Culture Fair.",
      },
    ],
  },
  {
    id: "art-9",
    slug: "best-weekend-markets-2026",
    title: "6 Creative Neighborhood Cafes & Night Markets Near Major Exhibition Venues",
    excerpt:
      "Where to refuel with artisanal pastries, cold brew, and craft street food before your evening showtime.",
    coverImage: img("photo-1533900298318-6b8da08a523e"),
    category: "Food & Travel",
    editorialSection: "Food & Travel",
    likes: 8,
    tab: "latest",
    author: {
      name: "Mai Linh",
      avatar: img("photo-1438761681033-6461ffad8d80", 150),
      role: "Travel Writer",
    },
    publishedAt: "2026-09-28",
    readMinutes: 4,
    tags: ["Market", "Food", "Weekend Guide"],
    body: [
      {
        type: "p",
        text: "Pair your afternoon exhibition ticket with these walkable neighborhood cafes and night bazaars.",
      },
    ],
  },
  {
    id: "art-27",
    slug: "photo-booth-popups-cafe-hopping-guide",
    title: "5 Film Photo Booth Pop-Ups & Art Cafes to Visit With Friends This Weekend",
    excerpt:
      "Limited-edition artist frames, analog silver-gelatin strips, and gallery-inspired dessert menus.",
    coverImage: img("photo-1555396273-367ea4eb4db5"),
    category: "Food & Travel",
    editorialSection: "Food & Travel",
    likes: 12,
    tab: "latest",
    author: {
      name: "Wirawan Changkao",
      avatar: img("photo-1534528741775-53994a69daeb", 150),
      role: "Culture Editor",
    },
    publishedAt: "2026-09-16",
    readMinutes: 3,
    tags: ["Cafe", "Pop-up", "Food & Travel"],
    body: [
      {
        type: "p",
        text: "Artist-designed photo booth collaborations have become a signature part of fanevents and gallery openings.",
      },
    ],
  },

  // Event Guidelines — Horizontal List Section (4 cards)
  {
    id: "art-11",
    slug: "streamline-event-checkin-thailand",
    title: "Deep Dive: Modern Online Ticketing & Smart On-Site Badge Registration Systems",
    excerpt:
      "How automated QR scanners, high-speed thermal badge printing, and smart turnstiles eliminate entry queues for conferences and major expos.",
    coverImage: img("photo-1511578314322-379afb476865"),
    category: "Event Guidelines",
    editorialSection: "Event Guidelines",
    likes: 15,
    tab: "organizer",
    author: {
      name: "Kittikom Nakiam",
      avatar: img("photo-1507003211169-0a1dd7228f2d", 150),
      role: "On-site Solutions Lead",
    },
    publishedAt: "2026-10-21",
    readMinutes: 4,
    tags: ["On-site", "Check-in", "Badge Printing"],
    body: [
      {
        type: "p",
        text: "Long registration lines can sour an attendee's first impression before they ever step into your keynote. Modern event operations rely on fast, integrated check-in workflows.",
      },
      { type: "h2", text: "Instant Badge Printing" },
      {
        type: "p",
        text: "With TixFlow's automated kiosk integration, scanning an e-ticket barcode immediately prints a high-resolution name badge in under 3 seconds.",
      },
    ],
  },
  {
    id: "art-5",
    slug: "organizer-guide-ticket-pricing",
    title: "Early-Bird Tiering & Ticket Protection: How to Boost Buyer Confidence From Day One",
    excerpt:
      "Cost calculation techniques, pricing psychology, and flexible tier releases that convert early interest into sold-out houses.",
    coverImage: img("photo-1556761175-b413da4baf72"),
    category: "Event Guidelines",
    editorialSection: "Event Guidelines",
    likes: 19,
    tab: "organizer",
    author: {
      name: "Kittikom Nakiam",
      avatar: img("photo-1573496359142-b8d87734a5a2", 150),
      role: "Event Strategist",
    },
    publishedAt: "2026-10-15",
    readMinutes: 5,
    tags: ["Pricing", "Ticketing", "Organizer"],
    body: [
      {
        type: "p",
        text: "Early-bird tickets do more than generate cash flow — they create urgency, validate demand and give you data to plan the rest of your sales.",
      },
    ],
  },
  {
    id: "art-6",
    slug: "organizer-checkin-system-qr",
    title: "Upgrading Venue Access Control with Smart QR & RFID Gates for 10,000+ Attendees",
    excerpt:
      "Using multi-lane scanner sync and offline fallback so gates keep moving under heavy festival network load.",
    coverImage: img("photo-1492684223066-81342ee5ff30"),
    category: "Event Guidelines",
    editorialSection: "Event Guidelines",
    likes: 11,
    tab: "organizer",
    author: {
      name: "Chaiyaporn D.",
      avatar: img("photo-1472099645785-5658abf4ff4e", 150),
      role: "Technical Lead",
    },
    publishedAt: "2026-10-06",
    readMinutes: 4,
    tags: ["Check-in", "QR Code", "RFID"],
    body: [
      {
        type: "p",
        text: "QR-code and RFID check-in lanes process guests in under a second while blocking duplicate entries across every gate.",
      },
    ],
  },
  {
    id: "art-10",
    slug: "organizer-choosing-the-right-venue",
    title: "Choosing the Right Venue & Seat Map Layout: A First-Time Organizer Checklist",
    excerpt:
      "Capacity, sightlines, accessibility, loading docks, and contract terms to verify before locking your venue.",
    coverImage: img("photo-1505373877841-8d25f7d46678"),
    category: "Event Guidelines",
    editorialSection: "Event Guidelines",
    likes: 8,
    tab: "organizer",
    author: {
      name: "TixFlow Operations",
      avatar: img("photo-1573496359142-b8d87734a5a2", 150),
      role: "Event Strategist",
    },
    publishedAt: "2026-09-25",
    readMinutes: 6,
    tags: ["Venue", "Planning", "Organizer"],
    body: [
      {
        type: "p",
        text: "Your venue shapes the attendee experience, your budget and even your ticket price. Use this checklist before signing any contract.",
      },
    ],
  },

  // Health & Beauty + Lifestyles (6 cards)
  {
    id: "art-28",
    slug: "concert-outfit-ideas-mix-and-match-2026",
    title: "5 Concert Outfit Formulas: Breathable, Camera-Ready Looks for Arena & Festival Nights",
    excerpt:
      "Balance style and 6-hour standing comfort with smart layering, metallic accents, and supportive footwear.",
    coverImage: img("photo-1509631179647-0177331693ae"),
    category: "Health & Beauty",
    editorialSection: "Health & Beauty",
    likes: 14,
    tab: "latest",
    author: {
      name: "Mananchaya Warasup",
      avatar: img("photo-1544005313-94ddf0286df2", 150),
      role: "Style Editor",
    },
    publishedAt: "2026-09-20",
    readMinutes: 3,
    tags: ["Fashion", "Concert", "Style"],
    body: [
      {
        type: "p",
        text: "Arena air-conditioning and outdoor festival humidity call for versatile, lightweight layers.",
      },
    ],
  },
  {
    id: "art-29",
    slug: "long-wear-festival-makeup-essentials",
    title: "5 Sweat-Proof Makeup & Skincare Essentials That Survive Outdoor Encore Sets",
    excerpt:
      "Lightweight SPF, setting mists, and subtle shimmer that stay fresh from soundcheck to midnight.",
    coverImage: img("photo-1522335789203-aabd1fc54bc9"),
    category: "Health & Beauty",
    editorialSection: "Health & Beauty",
    likes: 6,
    tab: "latest",
    author: {
      name: "Wirawan Changkao",
      avatar: img("photo-1534528741775-53994a69daeb", 150),
      role: "Lifestyle Editor",
    },
    publishedAt: "2026-09-12",
    readMinutes: 2,
    tags: ["Beauty", "Festival", "Skincare"],
    body: [
      {
        type: "p",
        text: "Keep your festival kit compact with multi-use tints and travel-friendly setting sprays.",
      },
    ],
  },
  {
    id: "art-30",
    slug: "mindful-sound-bath-wellness-weekends",
    title: "Sound Baths, Breathwork & Matcha: Inside the Rise of Urban Wellness Pop-Ups",
    excerpt:
      "Why young professionals are trading late-night clubs for Sunday morning acoustic meditation and ceramic workshops.",
    coverImage: img("photo-1544367567-0f2fcb009e0b"),
    category: "Health & Beauty",
    editorialSection: "Health & Beauty",
    likes: 10,
    tab: "latest",
    author: {
      name: "Mai Linh",
      avatar: img("photo-1438761681033-6461ffad8d80", 150),
      role: "Wellness Writer",
    },
    publishedAt: "2026-09-08",
    readMinutes: 3,
    tags: ["Wellness", "Health", "Workshop"],
    body: [
      {
        type: "p",
        text: "Morning wellness gatherings combine ambient soundscapes with community connection.",
      },
    ],
  },
  {
    id: "art-31",
    slug: "solo-friendly-creative-workshops-weekend",
    title: "7 Solo-Friendly Pottery, Perfumery & Printmaking Workshops to Try This Month",
    excerpt:
      "Unplug for three hours, learn a tactile craft, and bring home something handmade — solo attendees welcome.",
    coverImage: img("photo-1531403009284-440f080d1e12"),
    category: "Lifestyles",
    editorialSection: "Lifestyles",
    likes: 22,
    tab: "latest",
    author: {
      name: "Wirawan Changkao",
      avatar: img("photo-1534528741775-53994a69daeb", 150),
      role: "Culture Editor",
    },
    publishedAt: "2026-09-17",
    readMinutes: 3,
    tags: ["Workshop", "Craft", "Lifestyles"],
    body: [
      {
        type: "p",
        text: "Hands-on studio workshops are one of the best ways to recharge on a quiet weekend afternoon.",
      },
    ],
  },
  {
    id: "art-32",
    slug: "social-detox-micro-adventures-city",
    title: "7 Analog Weekend Rituals for a Screen-Free Reset in the City",
    excerpt:
      "Independent bookshops, vinyl listening bars, kayak mornings, and botanical sketch walks.",
    coverImage: img("photo-1529156069898-49953e39b3ac"),
    category: "Lifestyles",
    editorialSection: "Lifestyles",
    likes: 9,
    tab: "latest",
    author: {
      name: "Mananchaya Warasup",
      avatar: img("photo-1544005313-94ddf0286df2", 150),
      role: "Lifestyle Editor",
    },
    publishedAt: "2026-09-05",
    readMinutes: 2,
    tags: ["Lifestyles", "Analog", "Weekend"],
    body: [
      {
        type: "p",
        text: "Step away from notifications with tactile, community-centered analog activities.",
      },
    ],
  },
  {
    id: "art-33",
    slug: "rainy-season-indoor-cultural-activities",
    title: "7 Cozy Indoor Cultural Plans for Rainy Afternoons: Planetariums, Jazz & Indie Cinema",
    excerpt:
      "Don't let afternoon showers cancel your weekend — these indoor venues shine brightest when it rains.",
    coverImage: img("photo-1517604931442-7e0c8ed2963c"),
    category: "Lifestyles",
    editorialSection: "Lifestyles",
    likes: 13,
    tab: "latest",
    author: {
      name: "Mananchaya Warasup",
      avatar: img("photo-1544005313-94ddf0286df2", 150),
      role: "Lifestyle Editor",
    },
    publishedAt: "2026-09-02",
    readMinutes: 3,
    tags: ["Indoor", "Cinema", "Lifestyles"],
    body: [
      {
        type: "p",
        text: "Arthouse cinemas, digital art museums, and specialty coffee cuppings turn rainy weekends into highlights.",
      },
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
  const picks = [
    articles.find((a) => a.id === "art-1"),
    articles.find((a) => a.id === "art-11"),
    articles.find((a) => a.id === "art-2"),
    articles.find((a) => a.id === "art-15"),
    articles.find((a) => a.id === "art-12"),
  ].filter((a): a is Article => Boolean(a));
  return picks.slice(0, limit);
}

export function getArticlesByEditorialSection(
  section: NonNullable<Article["editorialSection"]>,
  limit = 6,
): Article[] {
  return articles.filter((a) => a.editorialSection === section).slice(0, limit);
}

export function getTrendingArticles(limit = 6): Article[] {
  return getArticles()
    .filter((a) => a.tab === "latest")
    .slice(0, limit);
}

export function getOrganizerArticles(limit = 6): Article[] {
  return getArticles("organizer").slice(0, limit);
}

export function getRelatedArticles(article: Article, limit = 3): Article[] {
  return getArticles(article.tab)
    .filter((candidate) => candidate.slug !== article.slug)
    .slice(0, limit);
}

export function formatArticleDate(iso: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${iso}T00:00:00Z`));
}
