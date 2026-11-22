import Link from "next/link";

/**
 * Zipevent-inspired pastel wide promotional banners:
 * 1. Official Ticket Resale Marketplace (#market-place) — placed directly below Register & Tickets / Explore Events
 * 2. All-In-One Event Marketing & Management Solutions (.banner.all-in-one) — 4-arch illustrated pastel banner below Categories
 */

function BrandRibbonEmblem() {
  return (
    <div className="relative flex h-14 w-14 sm:h-16 sm:w-16 shrink-0 items-center justify-center">
      <svg
        viewBox="0 0 68 68"
        className="h-full w-full drop-shadow-[0_4px_10px_rgba(239,83,96,0.25)]"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="zipEmblemGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ff3b7d" />
            <stop offset="55%" stopColor="#ef5360" />
            <stop offset="100%" stopColor="#f8a846" />
          </linearGradient>
          <linearGradient id="zipEmblemGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#f8a846" />
            <stop offset="100%" stopColor="#ef5360" />
          </linearGradient>
        </defs>
        {/* Outer stylized ribbon arcs matching Zipevent emblem */}
        <path
          d="M14 34C14 21.85 23.85 12 36 12C43.2 12 49.6 15.45 53.6 20.8L22.5 46.2C17.3 42.6 14 38.6 14 34Z"
          fill="url(#zipEmblemGrad1)"
        />
        <path
          d="M54 34C54 46.15 44.15 56 32 56C24.8 56 18.4 52.55 14.4 47.2L45.5 21.8C50.7 25.4 54 29.4 54 34Z"
          fill="url(#zipEmblemGrad2)"
          opacity="0.92"
        />
        <path
          d="M20 44L48 24"
          stroke="#ffffff"
          strokeWidth="6"
          strokeLinecap="round"
        />
        <circle cx="13" cy="24" r="2.2" fill="#ef5360" />
        <circle cx="55" cy="44" r="2.2" fill="#f8a846" />
      </svg>
    </div>
  );
}

function GlossyHereButton({ label = "HERE" }: { label?: string }) {
  return (
    <span
      className="relative inline-flex h-9 sm:h-10 min-w-[128px] sm:min-w-[146px] items-center justify-center overflow-hidden rounded-full border border-white/80 px-6 text-xs sm:text-sm font-bold uppercase tracking-wider text-white shadow-[0_6px_16px_rgba(168,45,220,0.32)] transition-transform duration-200 group-hover:scale-105"
      style={{
        background: "linear-gradient(90deg, #ff1470 0%, #d926a9 52%, #7c3aed 100%)",
      }}
    >
      {/* Top glossy specular reflection matching Zipevent button */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-1.5 top-0.5 h-3.5 rounded-full bg-gradient-to-b from-white/55 to-transparent"
      />
      <span className="relative z-10 drop-shadow-xs">{label}</span>
    </span>
  );
}

export function ResaleMarketplaceSection() {
  return (
    <section id="market-place" className="container py-6 sm:py-9">
      <h3 className="mb-4 sm:mb-6 text-center text-lg sm:text-xl md:text-[23px] font-bold uppercase tracking-tight text-[#2B212B]">
        Official Ticket Resale Marketplace
      </h3>

      <Link
        href="/events"
        className="group relative block w-full overflow-hidden rounded-xl border border-[#f2d6cf]/80 bg-gradient-to-r from-[#f8dbd3] via-[#fdf3f0] to-white px-5 py-6 sm:px-9 sm:py-7 shadow-[0_4px_18px_rgba(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_28px_rgba(239,83,96,0.14)]"
      >
        {/* Subtle decorative ticket & plus watermarks on left pastel backdrop */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "radial-gradient(circle at 12% 20%, rgba(239,83,96,0.14) 0, transparent 36%), radial-gradient(circle at 85% 50%, rgba(168,85,247,0.08) 0, transparent 40%)",
          }}
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-6 top-3 text-sm font-bold text-[#ef5360]/20 select-none"
        >
          +
        </span>
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-1/3 bottom-3 text-base font-bold text-[#ef5360]/20 select-none"
        >
          +
        </span>
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-10 bottom-2 text-xs font-bold text-[#f8a846]/25 select-none"
        >
          ✦
        </span>

        <div className="relative z-10 flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
          {/* Left Copy & Glossy HERE CTA */}
          <div className="flex items-start sm:items-center gap-4 sm:gap-5">
            <BrandRibbonEmblem />

            <div>
              <h4 className="text-xl sm:text-2xl md:text-[28px] font-extrabold tracking-tight text-[#ef5360] leading-tight">
                P2P TICKET MARKETPLACE
              </h4>
              <p className="mt-1 text-xs sm:text-sm md:text-[15px] font-semibold uppercase tracking-wide text-[#2B212B]">
                OFFICIAL TICKET RESELL MARKETPLACE
              </p>
              <div className="mt-3.5">
                <GlossyHereButton label="HERE" />
              </div>
            </div>
          </div>

          {/* Right 3D-style Vector Storefront & Star Tickets Illustration matching Zipevent */}
          <div className="flex items-center justify-center lg:justify-end">
            <svg
              viewBox="0 0 420 148"
              className="h-28 sm:h-36 w-auto max-w-full drop-shadow-xs"
              role="img"
              aria-label="Official Ticket Resale Marketplace Illustration"
            >
              <defs>
                <linearGradient id="mpPhoneFrame" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#fde68a" />
                  <stop offset="100%" stopColor="#d97706" />
                </linearGradient>
                <linearGradient id="mpTicketPurple" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#a855f7" />
                  <stop offset="100%" stopColor="#6366f1" />
                </linearGradient>
                <linearGradient id="mpTicketPink" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ec4899" />
                  <stop offset="100%" stopColor="#a855f7" />
                </linearGradient>
              </defs>

              {/* Left seated buyer with laptop */}
              <g transform="translate(24, 18)">
                {/* Armchair */}
                <rect x="6" y="48" width="52" height="54" rx="12" fill="#ea580c" />
                <rect x="14" y="60" width="44" height="36" rx="8" fill="#f97316" />
                {/* Person */}
                <circle cx="38" cy="24" r="13" fill="#fcd34d" />
                <path d="M25 20C25 12 51 12 51 20C47 16 30 16 25 20Z" fill="#451a03" />
                <rect x="24" y="38" width="28" height="34" rx="10" fill="#fed7aa" />
                {/* Blue trousers */}
                <rect x="28" y="68" width="11" height="42" rx="5" fill="#2563eb" />
                <rect x="43" y="68" width="11" height="42" rx="5" fill="#1d4ed8" />
                {/* Laptop */}
                <path d="M44 56H74L80 42H54L44 56Z" fill="#38bdf8" />
                <rect x="40" y="55" width="34" height="4" rx="2" fill="#0284c7" />
              </g>

              {/* Center Smartphone Storefront with Striped Awning & Floating Star Tickets */}
              <g transform="translate(152, 6)">
                {/* Phone Body */}
                <rect x="26" y="10" width="76" height="126" rx="12" fill="url(#mpPhoneFrame)" />
                <rect x="30" y="14" width="68" height="118" rx="9" fill="#fff7ed" />

                {/* Pink & White Storefront Awning */}
                <path d="M16 14H100L92 32H8L16 14Z" fill="#f43f5e" />
                <path d="M28 14H42L36 32H22L28 14Z" fill="#ffffff" />
                <path d="M56 14H70L64 32H50L56 14Z" fill="#ffffff" />
                <path d="M84 14H98L92 32H78L84 14Z" fill="#ffffff" />
                <rect x="8" y="32" width="84" height="6" rx="3" fill="#fb7185" />

                {/* Floating Ticket 1 (Pink/Magenta) */}
                <g transform="translate(10, 56) rotate(-28)">
                  <rect x="0" y="0" width="62" height="32" rx="6" fill="url(#mpTicketPink)" />
                  <line x1="16" y1="3" x2="16" y2="29" stroke="#ffffff" strokeDasharray="3 3" strokeWidth="1.5" opacity="0.7" />
                  <polygon
                    points="40,8 43,14 50,15 45,19 46,26 40,22 34,26 35,19 30,15 37,14"
                    fill="#fde047"
                  />
                </g>

                {/* Floating Ticket 2 (Purple/Indigo) */}
                <g transform="translate(26, 72) rotate(-18)">
                  <rect x="0" y="0" width="64" height="34" rx="6" fill="url(#mpTicketPurple)" />
                  <line x1="17" y1="3" x2="17" y2="31" stroke="#ffffff" strokeDasharray="3 3" strokeWidth="1.5" opacity="0.7" />
                  <polygon
                    points="42,8 45,14 52,15 47,19 48,26 42,22 36,26 37,19 32,15 39,14"
                    fill="#fde047"
                  />
                </g>

                {/* Coral Pedestal Steps */}
                <rect x="12" y="122" width="76" height="8" rx="4" fill="#fb7185" />
                <rect x="4" y="130" width="90" height="8" rx="4" fill="#f43f5e" />
              </g>

              {/* Right Seller / Fan with Gold Coins, Growth Arrow & Pink Cart */}
              <g transform="translate(284, 14)">
                {/* Growth arrow & gold coin stacks */}
                <path d="M52 30C66 26 78 18 86 6" stroke="#10b981" strokeWidth="3" strokeLinecap="round" fill="none" />
                <polygon points="88,3 89,12 81,8" fill="#10b981" />
                <rect x="58" y="34" width="12" height="10" rx="2" fill="#f59e0b" />
                <rect x="72" y="28" width="12" height="16" rx="2" fill="#fbbf24" />
                <rect x="86" y="20" width="12" height="24" rx="2" fill="#f59e0b" />

                {/* Person in yellow top */}
                <circle cx="36" cy="24" r="12" fill="#fde68a" />
                <path d="M24 22C24 10 48 10 48 22" fill="#27272a" />
                <rect x="22" y="38" width="28" height="34" rx="8" fill="#facc15" />
                <rect x="25" y="70" width="10" height="46" rx="5" fill="#3b82f6" />
                <rect x="37" y="70" width="10" height="46" rx="5" fill="#2563eb" />

                {/* Thumbs-up blue circle badge */}
                <circle cx="66" cy="64" r="10" fill="#3b82f6" />
                <path d="M63 65H69V70H63V65ZM66 59L68 63H63V65" fill="#ffffff" />

                {/* Pink Shopping Cart */}
                <g transform="translate(56, 74)">
                  <path d="M0 0H10L16 32H48L54 10H14" stroke="#f43f5e" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                  <line x1="22" y1="14" x2="24" y2="28" stroke="#fb7185" strokeWidth="2.5" />
                  <line x1="32" y1="14" x2="32" y2="28" stroke="#fb7185" strokeWidth="2.5" />
                  <line x1="42" y1="14" x2="40" y2="28" stroke="#fb7185" strokeWidth="2.5" />
                  <circle cx="20" cy="38" r="4" fill="#e11d48" />
                  <circle cx="44" cy="38" r="4" fill="#e11d48" />
                </g>
              </g>
            </svg>
          </div>
        </div>
      </Link>
    </section>
  );
}

export function ForOrganizerBannerSection() {
  return (
    <section className="container pt-2 pb-10 sm:pb-14">
      <Link
        href="/blog?tab=organizer"
        className="group relative block w-full overflow-hidden rounded-xl border border-[#f2d6cf]/80 bg-gradient-to-r from-[#f8dbd3] via-[#fdf3f0] to-white px-5 py-6 sm:px-9 sm:py-7 shadow-[0_4px_18px_rgba(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_28px_rgba(239,83,96,0.14)]"
      >
        <div className="relative z-10 flex flex-col justify-between gap-7 xl:flex-row xl:items-center">
          {/* Left Copy & HERE CTA */}
          <div className="flex items-start sm:items-center gap-4 sm:gap-5">
            <BrandRibbonEmblem />

            <div>
              <h3 className="text-xl sm:text-2xl md:text-[28px] font-extrabold tracking-tight text-[#ef5360] leading-tight">
                FOR ORGANIZER
              </h3>
              <p className="mt-1 text-xs sm:text-sm md:text-[14.5px] font-semibold uppercase tracking-wide text-[#2B212B]">
                ALL-IN-ONE EVENT MARKETING &amp; MANAGEMENT SOLUTIONS
              </p>
              <div className="mt-3.5">
                <GlossyHereButton label="HERE" />
              </div>
            </div>
          </div>

          {/* Right 4 Arch-Shaped Pastel Illustrated Pillars matching Zipevent */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
            {/* Pillar 1: Acquire Customer */}
            <div className="flex flex-col items-center text-center">
              <div className="relative flex h-28 w-24 sm:h-32 sm:w-28 items-end justify-center overflow-hidden rounded-t-full rounded-b-xl bg-[#f5e6e4] pt-3 shadow-2xs transition-transform duration-200 group-hover:scale-[1.03]">
                <svg viewBox="0 0 100 110" className="h-24 w-24" aria-hidden="true">
                  <circle cx="52" cy="36" r="12" fill="#f59e0b" />
                  <path d="M40 32C40 20 64 20 64 32Z" fill="#1e1b4b" />
                  <rect x="34" y="50" width="36" height="52" rx="12" fill="#475569" />
                  {/* Coral Megaphone */}
                  <path d="M14 42L36 34V54L14 46Z" fill="#ef5360" />
                  <rect x="10" y="40" width="5" height="8" rx="2" fill="#be123c" />
                </svg>
              </div>
              <span className="mt-2 text-[11px] sm:text-xs font-semibold text-[#2B212B]">
                Acquire Customer
              </span>
            </div>

            {/* Pillar 2: Engage your visitor */}
            <div className="flex flex-col items-center text-center">
              <div className="relative flex h-28 w-24 sm:h-32 sm:w-28 items-end justify-center overflow-hidden rounded-t-full rounded-b-xl bg-[#f5e6e4] pt-3 shadow-2xs transition-transform duration-200 group-hover:scale-[1.03]">
                <svg viewBox="0 0 100 110" className="h-24 w-24" aria-hidden="true">
                  {/* Smartphone UI */}
                  <rect x="44" y="14" width="44" height="86" rx="8" fill="#1e293b" />
                  <rect x="48" y="20" width="36" height="74" rx="5" fill="#ffffff" />
                  <rect x="52" y="30" width="28" height="10" rx="4" fill="#ef5360" />
                  <rect x="52" y="46" width="28" height="8" rx="4" fill="#fecdd3" />
                  <rect x="52" y="58" width="28" height="8" rx="4" fill="#fecdd3" />
                  {/* Visitor figure */}
                  <circle cx="26" cy="44" r="9" fill="#fbbf24" />
                  <rect x="16" y="56" width="20" height="44" rx="8" fill="#6366f1" />
                </svg>
              </div>
              <span className="mt-2 text-[11px] sm:text-xs font-semibold text-[#2B212B]">
                Engage your visitor
              </span>
            </div>

            {/* Pillar 3: Host an Online Event */}
            <div className="flex flex-col items-center text-center">
              <div className="relative flex h-28 w-24 sm:h-32 sm:w-28 items-end justify-center overflow-hidden rounded-t-full rounded-b-xl bg-[#f5e6e4] pt-3 shadow-2xs transition-transform duration-200 group-hover:scale-[1.03]">
                <svg viewBox="0 0 100 110" className="h-24 w-24" aria-hidden="true">
                  {/* Reaction badges */}
                  <circle cx="40" cy="22" r="7" fill="#3b82f6" />
                  <circle cx="58" cy="28" r="6" fill="#f59e0b" />
                  {/* Laptop screen */}
                  <rect x="18" y="42" width="64" height="42" rx="5" fill="#1e293b" />
                  <rect x="22" y="46" width="56" height="34" rx="3" fill="#ffffff" />
                  <rect x="26" y="52" width="28" height="20" rx="2" fill="#ec4899" />
                  <rect x="58" y="52" width="16" height="6" rx="2" fill="#fbcfe8" />
                  <rect x="58" y="62" width="16" height="6" rx="2" fill="#fbcfe8" />
                  <path d="M12 84H88L92 92H8L12 84Z" fill="#334155" />
                </svg>
              </div>
              <span className="mt-2 text-[11px] sm:text-xs font-semibold text-[#2B212B]">
                Host an Online Event
              </span>
            </div>

            {/* Pillar 4: On-site Services */}
            <div className="flex flex-col items-center text-center">
              <div className="relative flex h-28 w-24 sm:h-32 sm:w-28 items-end justify-center overflow-hidden rounded-t-full rounded-b-xl bg-[#f5e6e4] pt-3 shadow-2xs transition-transform duration-200 group-hover:scale-[1.03]">
                <svg viewBox="0 0 100 110" className="h-24 w-24" aria-hidden="true">
                  {/* Check-in Kiosk */}
                  <rect x="36" y="14" width="28" height="20" rx="3" fill="#1e293b" />
                  <rect x="34" y="38" width="32" height="64" rx="3" fill="#e2e8f0" />
                  <rect x="40" y="44" width="20" height="14" rx="2" fill="#334155" />
                  <circle cx="50" cy="72" r="4" fill="#ef5360" />
                  {/* Staff & Attendee */}
                  <circle cx="20" cy="36" r="8" fill="#fbbf24" />
                  <rect x="12" y="46" width="16" height="54" rx="6" fill="#1e1b4b" />
                  <circle cx="80" cy="36" r="8" fill="#fbbf24" />
                  <rect x="70" y="46" width="18" height="54" rx="6" fill="#f97316" />
                </svg>
              </div>
              <span className="mt-2 text-[11px] sm:text-xs font-semibold text-[#2B212B]">
                On-site Services
              </span>
            </div>
          </div>
        </div>
      </Link>
    </section>
  );
}
