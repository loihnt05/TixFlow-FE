"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import {
  Bookmark,
  Calendar,
  CalendarPlus,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock3,
  ExternalLink,
  Globe,
  MapPin,
  Share2,
  Video,
  X,
} from "lucide-react";
import {
  resolveTicketingMode,
  type Event,
  type EventRound,
  type PromoCodeRule,
  type TicketType,
} from "@/lib/mock/events";
import { EventCard } from "./event-card";
import {
  buildGoogleCalendarUrl,
  downloadEventIcs,
  formatTicketMoney,
  ZipeventTicketIcon,
} from "./ticketing/format-utils";
import {
  FreeRegistrationLeftPanel,
  FreeRegistrationSummaryCard,
} from "./ticketing/free-registration-panel";
import {
  TieredOrderSummaryCard,
  TieredTicketsLeftPanel,
} from "./ticketing/tiered-tickets-panel";
import {
  buildEffectiveRounds,
  buildEffectiveZones,
  SeatingOrderSummaryCard,
  SeatingRoundsLeftPanel,
  type SelectedZoneSeat,
} from "./ticketing/seating-rounds-panel";
import { ResaleMarketplacePanel } from "./ticketing/resale-marketplace-panel";

const fallbackHeroPoster =
  "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=900&q=82";

const shortDateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "Asia/Ho_Chi_Minh",
});

function buildInitialQuantities(event: Event, mode: ReturnType<typeof resolveTicketingMode>) {
  const init: Record<string, number> = {};
  event.ticketTypes.forEach((t, idx) => {
    if (event.defaultSelectedTicketId && t.id === event.defaultSelectedTicketId && t.status === "available") {
      init[t.id] = t.minPerOrder ?? 1;
    } else if (
      mode === "registration" &&
      !event.requirePromoToUnlock &&
      idx === 0 &&
      t.status === "available"
    ) {
      init[t.id] = 1;
    } else if (
      mode === "seating" &&
      event.roundBookingType === "tickets" &&
      idx === 0 &&
      t.status === "available"
    ) {
      init[t.id] = 1;
    } else {
      init[t.id] = 0;
    }
  });
  return init;
}

export function EventDetailView({
  event,
  related,
}: {
  event: Event;
  related: Event[];
}) {
  const mode = useMemo(() => resolveTicketingMode(event), [event]);
  const currency = event.currency ?? event.ticketTypes[0]?.currency ?? "VND";

  // Cover & Poster image state with graceful fallback
  const [posterSrc, setPosterSrc] = useState(event.thumbnailImage || event.coverImage);
  const [coverSrc, setCoverSrc] = useState(event.coverImage || event.thumbnailImage);
  const [hiddenBanners, setHiddenBanners] = useState<Record<string, boolean>>({});
  const [lightboxOpen, setLightboxOpen] = useState(false);

  useEffect(() => {
    setPosterSrc(event.thumbnailImage || event.coverImage);
    setCoverSrc(event.coverImage || event.thumbnailImage);
    setHiddenBanners({});
  }, [event.thumbnailImage, event.coverImage, event.id]);

  // Sub-navigation & scroll state
  const [subNavTab, setSubNavTab] = useState<"info" | "resale">("info");
  const [scrolledPastHero, setScrolledPastHero] = useState(false);
  const [calendarMenuOpen, setCalendarMenuOpen] = useState(false);
  const [favorite, setFavorite] = useState(false);
  const [copied, setCopied] = useState(false);
  const [detailsExpanded, setDetailsExpanded] = useState(false);

  const heroRef = useRef<HTMLDivElement>(null);

  // Ticket quantities & add-ons & promo state
  const [quantities, setQuantities] = useState<Record<string, number>>(() =>
    buildInitialQuantities(event, mode)
  );
  const [selectedAddons, setSelectedAddons] = useState<Record<string, string[]>>({});
  const [appliedPromo, setAppliedPromo] = useState<PromoCodeRule | null>(null);

  // Format C state: Date & Round -> Zone -> Seats (or Cinema Time-Slot Tickets)
  const effectiveRounds = useMemo(() => buildEffectiveRounds(event), [event]);
  const effectiveZones = useMemo(() => buildEffectiveZones(event), [event]);
  const [seatingStep, setSeatingStep] = useState<"round" | "seats">("round");
  const [selectedRound, setSelectedRound] = useState<EventRound>(effectiveRounds[0]);
  const [activeZoneId, setActiveZoneId] = useState<string>(
    effectiveZones[0]?.id ?? "A1"
  );
  const [selectedZoneSeats, setSelectedZoneSeats] = useState<SelectedZoneSeat[]>([]);

  // Reset state if navigating between event slugs client-side
  useEffect(() => {
    setQuantities(buildInitialQuantities(event, mode));
    setSelectedAddons({});
    setAppliedPromo(null);
    setSubNavTab("info");
    setSeatingStep("round");
    setSelectedRound(effectiveRounds[0]);
    setActiveZoneId(effectiveZones[0]?.id ?? "A1");
    setSelectedZoneSeats([]);
  }, [event, mode, effectiveRounds, effectiveZones]);

  useEffect(() => {
    try {
      const saved = new Set<string>(
        JSON.parse(localStorage.getItem("tixflow-favorites") ?? "[]") as string[]
      );
      setFavorite(saved.has(event.slug));
    } catch {
      setFavorite(false);
    }
  }, [event.slug]);

  useEffect(() => {
    const onScroll = () => {
      const heroBottom = heroRef.current?.getBoundingClientRect().bottom ?? 100;
      setScrolledPastHero(heroBottom < 68);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function toggleFavorite() {
    const saved = new Set<string>(
      JSON.parse(localStorage.getItem("tixflow-favorites") ?? "[]") as string[]
    );
    if (saved.has(event.slug)) saved.delete(event.slug);
    else saved.add(event.slug);
    localStorage.setItem("tixflow-favorites", JSON.stringify([...saved]));
    setFavorite(saved.has(event.slug));
  }

  async function shareEvent() {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  }

  function handleChangeQuantity(ticket: TicketType, nextQty: number) {
    setQuantities((prev) => ({ ...prev, [ticket.id]: nextQty }));
  }

  function handleSelectSingleTicket(ticket: TicketType) {
    const next: Record<string, number> = {};
    event.ticketTypes.forEach((t) => {
      next[t.id] = t.id === ticket.id ? 1 : 0;
    });
    setQuantities(next);
  }

  function handleToggleAddon(ticketId: string, addonId: string) {
    setSelectedAddons((prev) => {
      const cur = prev[ticketId] ?? [];
      const next = cur.includes(addonId)
        ? cur.filter((id) => id !== addonId)
        : [...cur, addonId];
      return { ...prev, [ticketId]: next };
    });
  }

  function handleToggleZoneSeat(seat: SelectedZoneSeat, maxPerOrder: number) {
    setSelectedZoneSeats((prev) => {
      const exists = prev.some((s) => s.key === seat.key);
      if (exists) return prev.filter((s) => s.key !== seat.key);
      if (prev.length >= maxPerOrder) return prev;
      return [...prev, seat];
    });
  }

  function handleRemoveZoneSeat(key: string) {
    setSelectedZoneSeats((prev) => prev.filter((s) => s.key !== key));
  }

  function scrollToElement(id: string) {
    if (subNavTab !== "info") {
      setSubNavTab("info");
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      }, 80);
      return;
    }
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }

  const isTimeslotTicketsMode = mode === "seating" && event.roundBookingType === "tickets";

  // Price & Cart Calculations
  const totalTickets =
    mode === "seating" && !isTimeslotTicketsMode
      ? selectedZoneSeats.length
      : event.ticketTypes.reduce((sum, t) => sum + (quantities[t.id] ?? 0), 0);

  const subtotal =
    mode === "seating" && !isTimeslotTicketsMode
      ? selectedZoneSeats.reduce((sum, s) => sum + s.price, 0)
      : event.ticketTypes.reduce(
          (sum, t) => sum + t.price * (quantities[t.id] ?? 0),
          0
        );

  const discountAmount = useMemo(() => {
    if (!appliedPromo || subtotal <= 0) return 0;
    if (appliedPromo.discountType === "percent") {
      return Math.min(subtotal, (subtotal * appliedPromo.amount) / 100);
    }
    return Math.min(subtotal, appliedPromo.amount);
  }, [appliedPromo, subtotal]);

  const netAfterPromo = Math.max(0, subtotal - discountAmount);
  const vatRate = event.vatRate ?? 0;
  const vatIncluded = event.vatIncluded !== false;
  const payableGrandTotal =
    vatRate > 0 && !vatIncluded && netAfterPromo > 0
      ? netAfterPromo * (1 + vatRate)
      : netAfterPromo;

  // Build Checkout URL preserving full backend hold/checkout compatibility + multi-item/round/seat metadata
  const checkoutHref = useMemo(() => {
    const params = new URLSearchParams();
    params.set("event", event.slug);

    if (mode === "seating" && !isTimeslotTicketsMode) {
      const primaryTicketId =
        selectedZoneSeats[0]?.ticketTypeId ?? event.ticketTypes[0]?.id ?? "";
      params.set("ticket", primaryTicketId);
      params.set("quantity", String(Math.max(1, selectedZoneSeats.length)));
      if (selectedRound.sessionId) {
        params.set("sessionId", selectedRound.sessionId);
      }
      params.set(
        "round",
        `${selectedRound.date} · ${selectedRound.startTime}-${selectedRound.endTime}`
      );
      if (selectedZoneSeats.length > 0) {
        const backendIds = selectedZoneSeats
          .map((s) => s.seatId)
          .filter((id): id is string => Boolean(id));
        if (backendIds.length > 0) {
          params.set("seats", backendIds.join(","));
        }
        params.set(
          "seatLabels",
          selectedZoneSeats.map((s) => `${s.zoneId}-${s.seatLabel}`).join(",")
        );
        params.set("zone", selectedZoneSeats[0].zoneId);
      }
      return `/checkout?${params.toString()}`;
    }

    const activeEntries = event.ticketTypes
      .map((t) => ({ ticket: t, qty: quantities[t.id] ?? 0 }))
      .filter((entry) => entry.qty > 0);

    const primary = activeEntries[0];
    params.set("ticket", primary?.ticket.id ?? event.ticketTypes[0]?.id ?? "");
    params.set("quantity", String(primary?.qty ?? 1));

    if (mode === "seating" && isTimeslotTicketsMode) {
      if (selectedRound.sessionId) {
        params.set("sessionId", selectedRound.sessionId);
      }
      params.set(
        "round",
        `${selectedRound.date} · ${selectedRound.startTime}-${selectedRound.endTime}`
      );
    }

    if (activeEntries.length > 0) {
      params.set(
        "items",
        activeEntries.map((e) => `${e.ticket.id}:${e.qty}`).join(",")
      );
    }
    if (appliedPromo) {
      params.set("promo", appliedPromo.code);
    }
    const addonNames = Object.entries(selectedAddons).flatMap(([tId, aIds]) => {
      const t = event.ticketTypes.find((cand) => cand.id === tId);
      return aIds
        .map((id) => t?.addons?.find((a) => a.id === id)?.name)
        .filter((n): n is string => Boolean(n));
    });
    if (addonNames.length > 0) {
      params.set("addons", addonNames.join(" | "));
    }

    return `/checkout?${params.toString()}`;
  }, [
    event.slug,
    event.ticketTypes,
    mode,
    isTimeslotTicketsMode,
    quantities,
    appliedPromo,
    selectedAddons,
    selectedRound,
    selectedZoneSeats,
  ]);

  // Per-Event Custom Zipevent Theme & Wallpaper Skin Engine
  const isDarkTheme = event.theme?.mode === "dark";
  const primaryColor = event.theme?.primaryColor ?? "#ef5360";
  const primaryHover = event.theme?.primaryHover ?? "#ec3746";
  const btnTextColor = event.theme?.buttonTextColor ?? "#ffffff";
  const softBgColor = event.theme?.softBgColor ?? "#FFF0F1";
  const pageBgColor =
    event.theme?.pageBgColor ?? (isDarkTheme ? "#000000" : "#F6F6F6");
  const pageBgImage = event.theme?.pageBgImage;

  const themeVars: CSSProperties = {
    "--ev-primary": primaryColor,
    "--ev-primary-hover": primaryHover,
    "--ev-btn-text": btnTextColor,
    "--ev-soft": softBgColor,
    backgroundColor: pageBgColor,
    ...(pageBgImage
      ? {
          backgroundImage: `url("${pageBgImage}")`,
          backgroundSize: "cover",
          backgroundPosition: "center top",
          backgroundAttachment: "fixed",
        }
      : {}),
  } as CSSProperties;

  const formattedDateRange =
    event.dateRangeLabel ?? shortDateFormatter.format(new Date(event.startDate));
  const heroPrimaryLabel =
    event.status === "sold_out"
      ? "Sold Out"
      : mode === "registration"
        ? "Register"
        : "Get Ticket";

  const categoryPills = Array.from(
    new Set([event.zipeventCategory, ...event.tags].filter(Boolean))
  ) as string[];

  const mapEmbedUrl =
    !event.venue.isOnline && event.venue.latitude && event.venue.longitude
      ? `https://www.openstreetmap.org/export/embed.html?bbox=${
          event.venue.longitude - 0.012
        }%2C${event.venue.latitude - 0.008}%2C${event.venue.longitude + 0.012}%2C${
          event.venue.latitude + 0.008
        }&layer=mapnik&marker=${event.venue.latitude}%2C${event.venue.longitude}`
      : null;

  const visibleInfoBanners = (event.infoBanners ?? []).filter(
    (url) => !hiddenBanners[url]
  );

  const renderLowerPanels = () => (
    <>
      {/* Event Information Panel (#panel-event-info) */}
      <section
        id="panel-event-info"
        className="scroll-mt-32 rounded-xl border border-gray-200/80 bg-white p-6 shadow-xs sm:p-8"
      >
        <h2 className="text-center text-xl font-bold text-[#2B212B] sm:text-[22px]">
          Event Information
        </h2>

        {event.showcaseBadge && (
          <div className="mt-5 text-center">
            <span className="inline-flex items-center justify-center rounded-full bg-[var(--ev-primary)] px-8 py-2.5 text-base font-extrabold tracking-wide text-[var(--ev-btn-text)] shadow-xs sm:text-lg">
              {event.showcaseBadge}
            </span>
          </div>
        )}

        <hr className="my-5 border-gray-100" />

        {/* Primary Cover / Infographics Stack */}
        {visibleInfoBanners.length > 0 ? (
          <div className="mx-auto max-w-3xl space-y-4">
            {visibleInfoBanners.map((bannerUrl, idx) => (
              <div
                key={`${bannerUrl}-${idx}`}
                className="overflow-hidden rounded-lg border border-gray-100 bg-gray-50"
              >
                <img
                  src={bannerUrl}
                  alt={`${event.title} visual ${idx + 1}`}
                  referrerPolicy="no-referrer"
                  loading="lazy"
                  onError={() =>
                    setHiddenBanners((prev) => ({ ...prev, [bannerUrl]: true }))
                  }
                  className="w-full object-contain"
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="overflow-hidden rounded-lg border border-gray-100 bg-gray-50">
            <img
              src={coverSrc}
              alt={event.title}
              referrerPolicy="no-referrer"
              onError={() => {
                if (coverSrc !== fallbackHeroPoster) setCoverSrc(fallbackHeroPoster);
              }}
              className="max-h-[480px] w-full object-cover"
            />
          </div>
        )}

        {/* Rich Event Copy */}
        <div
          className={`mt-6 text-xs leading-relaxed text-gray-700 sm:text-[14px] ${
            !detailsExpanded && event.description.length > 480 ? "line-clamp-6" : ""
          }`}
        >
          <p className="whitespace-pre-line">{event.description}</p>
        </div>

        {event.description.length > 480 && (
          <div className="mt-5 text-center">
            <button
              type="button"
              onClick={() => setDetailsExpanded((v) => !v)}
              className="inline-flex h-10 items-center justify-center rounded-full border border-[var(--ev-primary)] px-6 text-xs font-bold text-[var(--ev-primary)] transition-colors hover:bg-[var(--ev-soft)]"
            >
              {detailsExpanded ? "Show Less" : "View More Details"}
            </button>
          </div>
        )}
      </section>

      {/* Details, Prices and Exhibit Zones (#panel-zone-detail) */}
      {(event.zoneMapImage || (event.zones && event.zones.length > 0)) && (
        <section
          id="panel-zone-detail"
          className="rounded-xl border border-gray-200/80 bg-white p-6 shadow-xs sm:p-8"
        >
          <h2 className="text-center text-xl font-bold text-[#2B212B] sm:text-[22px]">
            Details, Prices and Exhibit Zones
          </h2>
          <hr className="my-5 border-gray-100" />

          {event.zoneMapImage && (
            <div className="mx-auto max-w-2xl overflow-hidden rounded-lg border border-gray-100">
              <img
                src={event.zoneMapImage}
                alt={`${event.title} Zone & Price Chart`}
                referrerPolicy="no-referrer"
                className="w-full object-contain"
              />
            </div>
          )}

          {/* Clean Zone Tier Summary Table */}
          {event.zones && event.zones.length > 0 && (
            <div className="mt-5 overflow-hidden rounded-xl border border-gray-200">
              <table className="w-full text-left text-xs sm:text-[13px]">
                <thead className="bg-gray-50 font-bold text-[#2B212B]">
                  <tr>
                    <th className="px-4 py-3">Zone Tier</th>
                    <th className="px-4 py-3">Included Privileges</th>
                    <th className="px-4 py-3 text-right">Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {Array.from(
                    new Map(event.zones.map((z) => [z.tierLabel, z])).values()
                  ).map((tier) => (
                    <tr key={tier.tierLabel}>
                      <td className="px-4 py-3 font-bold text-[#2B212B]">
                        <span className="inline-flex items-center gap-2">
                          <i
                            style={{ backgroundColor: tier.color }}
                            className="h-3 w-3 rounded-full"
                          />
                          {tier.tierLabel}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {(tier.benefits ?? []).join(" · ") || "Reserved seating"}
                      </td>
                      <td className="px-4 py-3 text-right font-bold text-[var(--ev-primary)]">
                        {formatTicketMoney(tier.price, tier.currency)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}

      {/* Restriction & Event Admission Policy (#panel-org-policy) */}
      {event.admissionPolicy && (
        <section
          id="panel-org-policy"
          className="rounded-xl border border-gray-200/80 bg-white p-6 shadow-xs sm:p-8"
        >
          <h2 className="text-center text-xl font-bold text-[#2B212B] sm:text-[22px]">
            Restriction &amp; Event Admission Policy
          </h2>
          <hr className="my-5 border-gray-100" />

          <ul className="list-disc space-y-2 pl-5 text-xs leading-relaxed text-gray-700 sm:text-[13.5px]">
            {event.admissionPolicy.bullets.map((rule, idx) => (
              <li key={idx}>{rule}</li>
            ))}
          </ul>

          <div className="mt-5 text-right text-[11.5px] text-gray-400">
            Latest Update : {event.admissionPolicy.updatedAt}
          </div>
        </section>
      )}

      {/* Location Details (#panel-event-venue) */}
      {mode !== "showcase" && (
        <section
          id="panel-event-venue"
          className="rounded-xl border border-gray-200/80 bg-white p-6 shadow-xs sm:p-8"
        >
          <h2 className="text-center text-xl font-bold text-[#2B212B] sm:text-[22px]">
            Location Details
          </h2>
          <hr className="my-5 border-gray-100" />

          <div className="grid gap-6 md:grid-cols-2 md:items-center">
            {/* Left: Embedded Map or Online Stream Box */}
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-gray-100">
              {mapEmbedUrl ? (
                <iframe
                  title={`Map for ${event.venue.name}`}
                  src={mapEmbedUrl}
                  className="h-56 w-full border-0"
                  loading="lazy"
                />
              ) : (
                <div className="flex h-52 flex-col items-center justify-center p-6 text-center">
                  {event.venue.isOnline ? (
                    <>
                      <Video size={32} className="text-[var(--ev-primary)]" />
                      <span className="mt-2 text-sm font-bold text-[#2B212B]">
                        Digital Stream &amp; Rerun Access
                      </span>
                      <span className="mt-1 text-xs text-gray-500">
                        Viewing link will be sent directly to registered attendees
                      </span>
                    </>
                  ) : (
                    <>
                      <MapPin size={32} className="text-[var(--ev-primary)]" />
                      <span className="mt-2 text-sm font-bold text-[#2B212B]">
                        {event.venue.name}
                      </span>
                      <span className="mt-1 text-xs text-gray-500">
                        {event.venue.city}, {event.venue.country}
                      </span>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Right: Venue Name, Address & View Map Pill */}
            <div>
              <h3 className="text-base font-bold text-[#2B212B] sm:text-lg">
                {event.venue.isOnline ? "Online Event" : event.venue.name}
              </h3>

              <div className="mt-2.5 flex items-center gap-1.5 text-xs font-bold text-[var(--ev-primary)]">
                <MapPin size={14} />
                <span>Location</span>
              </div>

              <p className="mt-1.5 text-xs leading-relaxed text-gray-600 sm:text-[13.5px]">
                {[event.venue.address, event.venue.city, event.venue.country]
                  .filter(Boolean)
                  .join(", ")}
              </p>

              {!event.venue.isOnline && (
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(
                    `${event.venue.name} ${event.venue.address} ${event.venue.city}`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-5 inline-flex h-10 items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-5 text-xs font-bold text-[#2B212B] transition-colors hover:border-[var(--ev-primary)] hover:text-[var(--ev-primary)]"
                >
                  <MapPin size={14} className="text-[#EA4335]" />
                  <span>View Map</span>
                  <ExternalLink size={12} className="text-gray-400" />
                </a>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Organizer Contact Panel (#group-about) */}
      <section
        id="group-about"
        className="rounded-xl border border-gray-200/80 bg-white p-6 shadow-xs sm:p-8"
      >
        <div className="text-center">
          <h2 className="text-lg font-bold text-[#2B212B] sm:text-xl">
            Want to know more about this event?
          </h2>
          <p className="mt-1 text-xs text-gray-500 sm:text-[13.5px]">
            Please contact the organizer for more information.
          </p>
        </div>
        <hr className="my-5 border-gray-100" />

        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
          <div className="h-24 w-24 shrink-0 overflow-hidden rounded-2xl border border-gray-200 bg-gray-50">
            <img
              src={
                event.organizer.avatar ||
                "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=240&h=240&fit=crop"
              }
              alt={event.organizer.name}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="flex-1 text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5">
              <h3 className="text-base font-extrabold text-[#2B212B] sm:text-lg">
                {event.organizer.name}
              </h3>
              {event.organizer.verified && (
                <CheckCircle2
                  size={17}
                  className="fill-[var(--ev-primary)] text-white"
                />
              )}
            </div>

            <p className="mt-1.5 text-xs leading-relaxed text-gray-600 sm:text-[13.5px]">
              {event.organizer.description}
            </p>

            {/* Social / Contact Links */}
            <div className="mt-3.5 flex flex-wrap items-center justify-center gap-3 text-xs font-medium text-gray-600 sm:justify-start">
              {event.organizer.website && (
                <a
                  href={event.organizer.website}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 hover:text-[var(--ev-primary)]"
                >
                  <Globe size={13} className="text-[var(--ev-primary)]" />
                  <span>{event.organizer.website.replace(/^https?:\/\//, "")}</span>
                </a>
              )}
              {event.organizer.socialLinks.facebook && (
                <a
                  href={event.organizer.socialLinks.facebook}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 hover:text-[var(--ev-primary)]"
                >
                  <span>Facebook</span>
                  <ExternalLink size={11} />
                </a>
              )}
              {event.organizer.socialLinks.twitter && (
                <a
                  href={event.organizer.socialLinks.twitter}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 hover:text-[var(--ev-primary)]"
                >
                  <span>
                    {event.organizer.socialLinks.twitter.replace(/^https?:\/\//, "")}
                  </span>
                </a>
              )}
              {event.organizer.socialLinks.instagram && (
                <a
                  href={event.organizer.socialLinks.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 hover:text-[var(--ev-primary)]"
                >
                  <span>
                    {event.organizer.socialLinks.instagram.replace(/^https?:\/\//, "")}
                  </span>
                </a>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );

  return (
    <main style={themeVars} className="min-h-screen pb-28 transition-colors">
      {/* 1. Authentic Zipevent Hero Cover (#event-cover): Vivid Blurred Banner + 4:5 Poster + Smoked Frosted Glass Card */}
      <div
        id="event-cover"
        ref={heroRef}
        className="relative overflow-hidden bg-[#18181B] text-white"
      >
        {/* Full-bleed Vivid Blurred Cover Backdrop matching Zipevent */}
        <div
          className="absolute inset-0 scale-[1.03] bg-cover bg-center opacity-85 blur-[4px]"
          style={{ backgroundImage: `url("${coverSrc}")` }}
        />
        <div className="absolute inset-0 bg-black/45" />

        <div className="container relative z-10 py-6 sm:py-9">
          <div className="grid gap-5 md:grid-cols-12 md:items-stretch lg:gap-7">
            {/* Left Column (col-md-4): Portrait 4:5 Event Poster */}
            <div className="md:col-span-4">
              <button
                type="button"
                onClick={() => setLightboxOpen(true)}
                aria-label={`View full poster for ${event.title}`}
                className="group relative mx-auto block aspect-[4/5] w-full max-w-[330px] overflow-hidden rounded-[4px] bg-zinc-900 shadow-[0_14px_34px_rgba(0,0,0,0.48)] md:max-w-none"
              >
                <img
                  src={posterSrc}
                  alt={event.title}
                  referrerPolicy="no-referrer"
                  onError={() => {
                    const next = event.fallbackImage || fallbackHeroPoster;
                    if (posterSrc !== next) setPosterSrc(next);
                    if (coverSrc !== next) setCoverSrc(next);
                  }}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                />
              </button>
            </div>

            {/* Right Column (col-md-8): Authentic Zipevent Neutral Smoked Frosted Glass Card */}
            <div className="flex flex-col justify-between rounded-[6px] bg-white/18 p-6 shadow-xl backdrop-blur-md sm:p-8 md:col-span-8 lg:px-9 lg:py-8">
              <div>
                <h1 className="text-xl font-bold leading-snug tracking-tight text-white sm:text-2xl lg:text-[26px]">
                  {event.title}
                </h1>

                {mode !== "showcase" && (
                  <div className="mt-4 space-y-2.5 text-[13.5px] font-normal text-white sm:text-[15px]">
                    <div className="flex items-center gap-3">
                      <Calendar size={16} className="shrink-0 text-white" />
                      <span>{formattedDateRange}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <Clock3 size={16} className="shrink-0 text-white" />
                      <span>
                        {event.startTime} - {event.endTime} (UTC+7)
                      </span>
                    </div>

                    <div className="flex items-start gap-3">
                      <MapPin size={16} className="mt-0.5 shrink-0 text-white" />
                      <span>
                        {event.venue.isOnline ? "Online Event" : event.venue.name}
                      </span>
                    </div>
                  </div>
                )}

                {/* Category Pill Tags (All topic badges shown like Zipevent) */}
                {categoryPills.length > 0 && (
                  <div className="mt-5 flex flex-wrap gap-2">
                    {categoryPills.slice(0, 6).map((tag) => (
                      <Link
                        key={tag}
                        href={`/events?category=${event.category}`}
                        className="rounded-[4px] bg-white/25 px-3 py-1 text-xs font-medium text-white backdrop-blur-2xs transition-colors hover:bg-white/35"
                      >
                        {tag}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Bottom CTA Row inside Frosted Card */}
              {mode !== "showcase" && (
                <div className="mt-8 flex flex-wrap items-center gap-3.5 pt-2">
                  <button
                    type="button"
                    onClick={() => scrollToElement("panel-register")}
                    className="inline-flex h-[42px] min-w-[200px] flex-1 items-center justify-center gap-2 rounded-full bg-[var(--ev-primary)] px-7 text-sm font-semibold text-[var(--ev-btn-text)] shadow-md transition-all hover:opacity-92 active:scale-[0.99] sm:flex-initial sm:min-w-[295px]"
                  >
                    <ZipeventTicketIcon />
                    <span>{heroPrimaryLabel}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => scrollToElement("panel-event-info")}
                    className="inline-flex h-[42px] items-center justify-center gap-1.5 rounded-full border-[1.5px] border-white bg-transparent px-5 text-sm font-medium text-white transition-colors hover:bg-white/15"
                  >
                    <span>View Details</span>
                    <ChevronDown size={15} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Zipevent Sticky Header Strip + White Sub-Navigation Bar */}
      <div className="sticky top-[65px] z-30 shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
        {/* Slim Black Event Title Strip on Scroll */}
        {scrolledPastHero && (
          <div className="bg-[#000000] py-1.5 text-white">
            <div className="container flex items-center justify-between gap-4 text-xs">
              <span className="truncate font-bold">{event.title}</span>
              <span className="hidden shrink-0 items-center gap-1 text-[11px] text-white/80 sm:inline-flex">
                <Globe size={12} />
                <span>English</span>
              </span>
            </div>
          </div>
        )}

        {/* Sub-Navbar: Left (Info | Ticket Resale) & Right (Calendar | Bookmark | Share) */}
        <div className="border-b border-gray-200/80 bg-white">
          <div className="container flex h-12 items-center justify-between">
            <div className="flex items-center gap-6 text-xs font-semibold sm:text-[13.5px]">
              <button
                type="button"
                onClick={() => setSubNavTab("info")}
                className={`py-3 transition-colors ${
                  subNavTab === "info"
                    ? "text-[var(--ev-primary)]"
                    : "text-gray-600 hover:text-[var(--ev-primary)]"
                }`}
              >
                Info
              </button>

              {event.resaleEnabled && (
                <button
                  type="button"
                  onClick={() => setSubNavTab("resale")}
                  className={`py-3 transition-colors ${
                    subNavTab === "resale"
                      ? "text-[var(--ev-primary)]"
                      : "text-gray-600 hover:text-[var(--ev-primary)]"
                  }`}
                >
                  Ticket Resale
                </button>
              )}
            </div>

            {/* Right Action Icons: Calendar, Save/Bookmark, Share */}
            <div className="relative flex items-center gap-1.5 sm:gap-2">
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setCalendarMenuOpen((v) => !v)}
                  aria-label="Add event to calendar"
                  title="Add to Calendar"
                  className="grid h-8 w-8 place-items-center rounded-full text-[var(--ev-primary)] transition-colors hover:bg-gray-100"
                >
                  <CalendarPlus size={17} strokeWidth={2} />
                </button>

                {calendarMenuOpen && (
                  <div className="absolute right-0 top-10 z-40 w-48 overflow-hidden rounded-xl border border-gray-200 bg-white py-1.5 text-xs shadow-lg">
                    <a
                      href={buildGoogleCalendarUrl(event)}
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => setCalendarMenuOpen(false)}
                      className="flex items-center gap-2 px-3.5 py-2 font-medium text-[#2B212B] hover:bg-gray-50"
                    >
                      <Calendar size={14} className="text-[var(--ev-primary)]" />
                      <span>Google Calendar</span>
                    </a>
                    <button
                      type="button"
                      onClick={() => {
                        downloadEventIcs(event);
                        setCalendarMenuOpen(false);
                      }}
                      className="flex w-full items-center gap-2 px-3.5 py-2 text-left font-medium text-[#2B212B] hover:bg-gray-50"
                    >
                      <CalendarPlus size={14} className="text-[var(--ev-primary)]" />
                      <span>Apple / Outlook (.ics)</span>
                    </button>
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={toggleFavorite}
                aria-pressed={favorite}
                aria-label={favorite ? "Remove bookmark" : "Bookmark event"}
                title={favorite ? "Saved" : "Save event"}
                className="grid h-8 w-8 place-items-center rounded-full text-[var(--ev-primary)] transition-colors hover:bg-gray-100"
              >
                <Bookmark
                  size={17}
                  strokeWidth={2}
                  fill={favorite ? "currentColor" : "none"}
                />
              </button>

              <button
                type="button"
                onClick={shareEvent}
                aria-label="Share event link"
                title="Copy event link"
                className="inline-flex h-8 items-center gap-1 rounded-full px-1.5 text-[var(--ev-primary)] transition-colors hover:bg-gray-100"
              >
                {copied ? <Check size={16} /> : <Share2 size={17} strokeWidth={2} />}
                {copied && <span className="text-[11px] font-bold">Copied!</span>}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Main Content Body */}
      <div className="container mt-7">
        {subNavTab === "resale" && event.resaleEnabled ? (
          <ResaleMarketplacePanel event={event} />
        ) : mode === "showcase" ? (
          /* Format 4: Full-Width Showcase / Official Merchandise Layout (e.g. POLICE-IN-LOVE-MD) */
          <div className="space-y-6">{renderLowerPanels()}</div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
            {/* Left Column: Ticketing Format + Lower Zipevent Panels */}
            <div className="min-w-0 space-y-6">
              {mode === "registration" && (
                <FreeRegistrationLeftPanel
                  event={event}
                  quantities={quantities}
                  selectedAddons={selectedAddons}
                  onChangeQuantity={handleChangeQuantity}
                  onSelectSingleTicket={handleSelectSingleTicket}
                  onToggleAddon={handleToggleAddon}
                  appliedPromo={appliedPromo}
                  onApplyPromo={setAppliedPromo}
                />
              )}

              {mode === "tiered" && (
                <TieredTicketsLeftPanel
                  event={event}
                  quantities={quantities}
                  onChangeQuantity={handleChangeQuantity}
                  appliedPromo={appliedPromo}
                  onApplyPromo={setAppliedPromo}
                />
              )}

              {mode === "seating" && (
                <SeatingRoundsLeftPanel
                  event={event}
                  step={seatingStep}
                  onStepChange={setSeatingStep}
                  selectedRound={selectedRound}
                  onSelectRound={(round) => {
                    setSelectedRound(round);
                    setSelectedZoneSeats([]);
                  }}
                  activeZoneId={activeZoneId}
                  onSelectZone={setActiveZoneId}
                  selectedSeats={selectedZoneSeats}
                  onToggleSeat={handleToggleZoneSeat}
                  quantities={quantities}
                  onChangeQuantity={handleChangeQuantity}
                  onOpenMarketplace={() => {
                    setSubNavTab("resale");
                    window.scrollTo({ top: 380, behavior: "smooth" });
                  }}
                />
              )}

              {renderLowerPanels()}
            </div>

            {/* Right Sticky Summary Column (.panel-booking-sum) */}
            <aside className="h-fit lg:sticky lg:top-32">
              {mode === "registration" && (
                <FreeRegistrationSummaryCard
                  event={event}
                  quantities={quantities}
                  selectedAddons={selectedAddons}
                  appliedPromo={appliedPromo}
                  checkoutHref={checkoutHref}
                  totalTickets={totalTickets}
                />
              )}

              {mode === "tiered" && (
                <TieredOrderSummaryCard
                  event={event}
                  quantities={quantities}
                  appliedPromo={appliedPromo}
                  checkoutHref={checkoutHref}
                  totalTickets={totalTickets}
                  subtotal={subtotal}
                  discountAmount={discountAmount}
                  grandTotal={netAfterPromo}
                />
              )}

              {mode === "seating" && (
                <SeatingOrderSummaryCard
                  event={event}
                  step={seatingStep}
                  onStepChange={setSeatingStep}
                  selectedRound={selectedRound}
                  selectedSeats={selectedZoneSeats}
                  onRemoveSeat={handleRemoveZoneSeat}
                  quantities={quantities}
                  checkoutHref={checkoutHref}
                />
              )}
            </aside>
          </div>
        )}

        {/* 4. Similar Events (#similar-events) — Full 5-card Zipevent Portrait Row */}
        {related.length > 0 && (
          <section
            id="similar-events"
            className="mt-10 rounded-xl border border-gray-200/80 bg-white p-6 shadow-xs sm:p-8"
          >
            <h2 className="mb-6 text-center text-xl font-bold text-[#2B212B] sm:text-[22px]">
              Similar Events
            </h2>

            <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-5">
              {related.slice(0, 5).map((relEvent) => (
                <EventCard key={relEvent.id} event={relEvent} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* 5. Mobile Sticky Bottom Bar */}
      {subNavTab === "info" && mode !== "showcase" && (
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-gray-200 bg-white/95 px-4 py-3 shadow-[0_-4px_16px_rgba(0,0,0,0.08)] backdrop-blur-md lg:hidden">
          <div className="container flex items-center justify-between gap-4 !px-0">
            {mode === "seating" && seatingStep === "round" ? (
              <>
                <div className="min-w-0">
                  <div className="text-[11px] font-bold text-[var(--ev-primary)]">
                    Show Time
                  </div>
                  <div className="truncate text-xs font-bold text-[#2B212B]">
                    {selectedRound.date} · {selectedRound.startTime}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSeatingStep("seats");
                    scrollToElement("panel-register");
                  }}
                  className="inline-flex h-10 shrink-0 items-center justify-center rounded-full bg-[var(--ev-primary)] px-7 text-xs font-bold text-[var(--ev-btn-text)] shadow-sm"
                >
                  Next
                </button>
              </>
            ) : (
              <>
                <div>
                  <div className="text-[11px] text-gray-500">
                    {totalTickets} {totalTickets === 1 ? "item" : "items"}
                  </div>
                  <div className="text-sm font-black text-[var(--ev-primary)]">
                    {mode === "registration"
                      ? event.requirePromoToUnlock && !appliedPromo
                        ? formatTicketMoney(0, currency, { zeroAsNumber: true })
                        : "FREE"
                      : formatTicketMoney(payableGrandTotal, currency, {
                          zeroAsNumber: true,
                        })}
                  </div>
                </div>

                {totalTickets > 0 &&
                event.status !== "sold_out" &&
                !(event.requirePromoToUnlock && !appliedPromo) ? (
                  <Link
                    href={checkoutHref}
                    className="inline-flex h-10 items-center justify-center gap-1.5 rounded-full bg-[var(--ev-primary)] px-7 text-xs font-bold text-[var(--ev-btn-text)] shadow-sm"
                  >
                    <span>{mode === "registration" ? "Register" : "Buy Ticket"}</span>
                  </Link>
                ) : (
                  <button
                    type="button"
                    onClick={() => scrollToElement("panel-register")}
                    className="inline-flex h-10 items-center justify-center rounded-full bg-[var(--ev-primary)] px-7 text-xs font-bold text-[var(--ev-btn-text)] shadow-sm"
                  >
                    {mode === "registration" ? "Register" : "Select Ticket"}
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* Full Poster Lightbox */}
      {lightboxOpen && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setLightboxOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-xs"
        >
          <button
            type="button"
            onClick={() => setLightboxOpen(false)}
            aria-label="Close poster preview"
            className="absolute right-5 top-5 grid h-10 w-10 place-items-center rounded-full bg-white/15 text-white hover:bg-white/25"
          >
            <X size={20} />
          </button>
          <img
            src={posterSrc}
            alt={event.title}
            onClick={(e) => e.stopPropagation()}
            className="max-h-[88vh] max-w-full rounded-xl object-contain shadow-2xl"
          />
        </div>
      )}
    </main>
  );
}
