"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useKeycloakAuth } from "@/components/auth-provider";
import { useApi, type CurrentUser } from "@/lib/api";
import { getEvents } from "@/lib/mock-api/events";
import type { Event } from "@/lib/mock/events";
import { keycloakPublicConfig } from "@/lib/public-config";
import {
  mapTicket,
  type AccountTicket,
  type TicketDto,
  type TicketQrDto,
} from "@/lib/tickets";

export interface AccountOrderItem {
  id?: string;
  ticketTypeId?: string;
  ticketTypeNameSnapshot: string;
  quantity: number;
  unitPrice?: number;
  serviceFee?: number;
  lineTotal?: number;
}

export interface AccountOrder {
  id: string;
  orderNumber: string;
  status: string;
  totalAmount: number;
  currency: string;
  createdAtUtc: string;
  eventSessionName?: string;
  eventName: string;
  items: AccountOrderItem[];
}

export interface AccountPreferences {
  eventAlerts: boolean;
  personalizedRecommendations: boolean;
  newsletterOffers: boolean;
}

const defaultPreferences: AccountPreferences = {
  eventAlerts: true,
  personalizedRecommendations: true,
  newsletterOffers: true,
};

interface AccountContextValue {
  name: string;
  email: string;
  localUserId: string;
  oidcSubject: string;
  profileRole: string;
  accountStatus: string;
  createdAtUtc?: string;
  isCustomer: boolean;
  profileLoading: boolean;
  profileError?: string;
  syncingProfile: boolean;
  syncSuccess: boolean;
  keycloakAccountUrl?: string;
  syncProfile(): Promise<void>;

  tickets: AccountTicket[];
  ticketsLoading: boolean;
  ticketsError?: string;
  refreshTickets(): Promise<void>;

  orders: AccountOrder[];
  ordersById: Map<string, AccountOrder>;
  ordersLoading: boolean;
  ordersError?: string;
  refreshOrders(): Promise<void>;

  favoriteEvents: Event[];
  eventsLoading: boolean;
  removeFavorite(slug: string): void;

  preferences: AccountPreferences;
  preferencesSaved: boolean;
  updatePreference(key: keyof AccountPreferences, value: boolean): void;

  selectedTicket: AccountTicket | null;
  ticketQr: { id: string; image: string } | null;
  qrLoading: boolean;
  qrError?: string;
  openTicketQr(ticket: AccountTicket): void;
  closeTicketQr(): void;
}

const AccountContext = createContext<AccountContextValue | undefined>(undefined);

function readSavedSlugs(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw =
      window.localStorage.getItem("tixflow-favorites") ??
      window.localStorage.getItem("zipevent-favorites") ??
      "[]";
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string") : [];
  } catch {
    return [];
  }
}

function preferencesStorageKey(subject: string): string {
  return `tixflow-account-preferences:${subject || "default"}`;
}

function readPreferences(subject: string): AccountPreferences {
  if (typeof window === "undefined") return defaultPreferences;
  try {
    const raw = window.localStorage.getItem(preferencesStorageKey(subject));
    if (!raw) return defaultPreferences;
    const parsed = JSON.parse(raw) as Partial<AccountPreferences>;
    return {
      eventAlerts: typeof parsed.eventAlerts === "boolean" ? parsed.eventAlerts : true,
      personalizedRecommendations:
        typeof parsed.personalizedRecommendations === "boolean"
          ? parsed.personalizedRecommendations
          : true,
      newsletterOffers: typeof parsed.newsletterOffers === "boolean" ? parsed.newsletterOffers : true,
    };
  } catch {
    return defaultPreferences;
  }
}

export function AccountProvider({ children }: { children: React.ReactNode }) {
  const auth = useKeycloakAuth();
  const api = useApi();
  const apiRef = useRef(api);
  apiRef.current = api;

  const [name, setName] = useState(
    String(auth.tokenParsed?.name ?? auth.tokenParsed?.preferred_username ?? ""),
  );
  const [email, setEmail] = useState(String(auth.tokenParsed?.email ?? ""));
  const [localUserId, setLocalUserId] = useState("");
  const [oidcSubject, setOidcSubject] = useState(String(auth.tokenParsed?.sub ?? ""));
  const [profileRole, setProfileRole] = useState<string>(auth.roles[0] ?? "");
  const [accountStatus, setAccountStatus] = useState<string>("Active");
  const [createdAtUtc, setCreatedAtUtc] = useState<string | undefined>(undefined);

  const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState<string>();
  const [syncingProfile, setSyncingProfile] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState(false);
  const [keycloakAccountUrl, setKeycloakAccountUrl] = useState<string>();

  const [tickets, setTickets] = useState<AccountTicket[]>([]);
  const [ticketsLoading, setTicketsLoading] = useState(false);
  const [ticketsError, setTicketsError] = useState<string>();

  const [orders, setOrders] = useState<AccountOrder[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState<string>();

  const [events, setEvents] = useState<Event[]>([]);
  const [eventsLoading, setEventsLoading] = useState(false);
  const [savedSlugs, setSavedSlugs] = useState<string[]>([]);

  const [preferences, setPreferences] = useState<AccountPreferences>(defaultPreferences);
  const [preferencesSaved, setPreferencesSaved] = useState(false);
  const saveFeedbackTimer = useRef<number | undefined>(undefined);

  const [selectedTicket, setSelectedTicket] = useState<AccountTicket | null>(null);
  const [ticketQr, setTicketQr] = useState<{ id: string; image: string } | null>(null);
  const [qrLoading, setQrLoading] = useState(false);
  const [qrError, setQrError] = useState<string>();

  const isCustomer = profileRole === "Customer" || auth.roles.includes("Customer");

  useEffect(() => {
    try {
      const config = keycloakPublicConfig();
      const returnUrl = `${window.location.origin}/account`;
      setKeycloakAccountUrl(
        `${config.url}/realms/${encodeURIComponent(config.realm)}/account?referrer=${encodeURIComponent(
          config.clientId,
        )}&referrer_uri=${encodeURIComponent(returnUrl)}`,
      );
    } catch {
      setKeycloakAccountUrl(undefined);
    }
  }, []);

  useEffect(() => {
    const subject = oidcSubject || String(auth.tokenParsed?.sub ?? "");
    setPreferences(readPreferences(subject));
  }, [auth.tokenParsed?.sub, oidcSubject]);

  useEffect(() => {
    const syncFavorites = () => setSavedSlugs(readSavedSlugs());
    syncFavorites();
    window.addEventListener("storage", syncFavorites);
    window.addEventListener("focus", syncFavorites);
    return () => {
      window.removeEventListener("storage", syncFavorites);
      window.removeEventListener("focus", syncFavorites);
    };
  }, []);

  const applyUser = useCallback((user: CurrentUser) => {
    setName(user.name);
    setEmail(user.email);
    setLocalUserId(user.id);
    setOidcSubject(user.sub);
    setProfileRole(user.roles[0] ?? "");
    if (user.status) setAccountStatus(user.status);
    if (user.createdAtUtc) setCreatedAtUtc(user.createdAtUtc);
  }, []);

  // Load user profile once per authenticated session
  useEffect(() => {
    if (!auth.authenticated) return;
    const controller = new AbortController();
    setProfileLoading(true);
    setProfileError(undefined);

    void apiRef
      .current<CurrentUser>("/api/v1/users/me", controller.signal)
      .then((user) => {
        if (!controller.signal.aborted) {
          applyUser(user);
          setProfileLoading(false);
        }
      })
      .catch((cause) => {
        if (!controller.signal.aborted) {
          setProfileError(cause instanceof Error ? cause.message : "Unable to load profile.");
          setProfileLoading(false);
        }
      });

    return () => controller.abort();
  }, [applyUser, auth.authenticated]);

  const fetchTickets = useCallback(async (signal?: AbortSignal, silent = false) => {
    if (!silent) {
      setTicketsLoading(true);
      setTicketsError(undefined);
    }
    try {
      const result = await apiRef.current<{ data: TicketDto[] }>("/api/v1/tickets", signal);
      if (!signal?.aborted) {
        const mapped = result.data.map(mapTicket);
        setTickets(mapped);
        setSelectedTicket((current) =>
          current ? (mapped.find((ticket) => ticket.id === current.id) ?? null) : null,
        );
        setTicketsError(undefined);
      }
    } catch (cause) {
      if (!signal?.aborted && !silent) {
        setTicketsError(cause instanceof Error ? cause.message : "Unable to load tickets.");
      }
    } finally {
      if (!signal?.aborted && !silent) {
        setTicketsLoading(false);
      }
    }
  }, []);

  const fetchOrders = useCallback(async (signal?: AbortSignal) => {
    setOrdersLoading(true);
    setOrdersError(undefined);
    try {
      const result = await apiRef.current<{ data: AccountOrder[] }>("/api/v1/orders", signal);
      if (!signal?.aborted) {
        setOrders(result.data);
      }
    } catch (cause) {
      if (!signal?.aborted) {
        setOrdersError(cause instanceof Error ? cause.message : "Unable to load order history.");
      }
    } finally {
      if (!signal?.aborted) {
        setOrdersLoading(false);
      }
    }
  }, []);

  // Load customer tickets, orders, and event catalog once at layout level
  useEffect(() => {
    if (!auth.authenticated || !isCustomer) return;
    const controller = new AbortController();

    void fetchTickets(controller.signal, false);
    void fetchOrders(controller.signal);

    setEventsLoading(true);
    void getEvents({ limit: 100 })
      .then((result) => {
        if (!controller.signal.aborted) setEvents(result.events);
      })
      .finally(() => {
        if (!controller.signal.aborted) setEventsLoading(false);
      });

    // Silent background ticket refresh (for async Worker issuance / check-in updates) without skeleton flash
    const ticketTimer = window.setInterval(() => {
      if (document.visibilityState === "visible") {
        void fetchTickets(controller.signal, true);
      }
    }, 8000);

    return () => {
      window.clearInterval(ticketTimer);
      controller.abort();
    };
  }, [auth.authenticated, fetchOrders, fetchTickets, isCustomer]);

  const selectedTicketId = selectedTicket?.id;
  useEffect(() => {
    setTicketQr(null);
    setQrError(undefined);
    if (!selectedTicketId) {
      setQrLoading(false);
      return;
    }
    const controller = new AbortController();
    setQrLoading(true);

    void apiRef
      .current<{ data: TicketQrDto }>(`/api/v1/tickets/${selectedTicketId}/qr`, controller.signal)
      .then((result) => {
        if (!controller.signal.aborted) {
          setTicketQr({ id: selectedTicketId, image: result.data.qrImageDataUrl });
          setQrLoading(false);
        }
      })
      .catch((cause) => {
        if (!controller.signal.aborted) {
          setQrError(cause instanceof Error ? cause.message : "Unable to load QR code.");
          setQrLoading(false);
        }
      });

    return () => controller.abort();
  }, [selectedTicketId]);

  const syncProfile = useCallback(async () => {
    setSyncingProfile(true);
    setProfileError(undefined);
    setSyncSuccess(false);
    try {
      await auth.getAccessToken(true);
      const user = await apiRef.current<CurrentUser>("/api/v1/users/me");
      applyUser(user);
      setSyncSuccess(true);
      window.setTimeout(() => setSyncSuccess(false), 3000);
    } catch (cause) {
      setProfileError(cause instanceof Error ? cause.message : "Unable to sync profile.");
    } finally {
      setSyncingProfile(false);
    }
  }, [applyUser, auth]);

  const removeFavorite = useCallback((slug: string) => {
    setSavedSlugs((prev) => {
      const next = prev.filter((item) => item !== slug);
      try {
        window.localStorage.setItem("tixflow-favorites", JSON.stringify(next));
      } catch {
        // Ignore storage quota errors
      }
      return next;
    });
  }, []);

  const updatePreference = useCallback(
    (key: keyof AccountPreferences, value: boolean) => {
      setPreferences((prev) => {
        const next = { ...prev, [key]: value };
        try {
          const subject = oidcSubject || String(auth.tokenParsed?.sub ?? "");
          window.localStorage.setItem(preferencesStorageKey(subject), JSON.stringify(next));
        } catch {
          // Ignore storage quota errors
        }
        return next;
      });
      setPreferencesSaved(true);
      if (saveFeedbackTimer.current) window.clearTimeout(saveFeedbackTimer.current);
      saveFeedbackTimer.current = window.setTimeout(() => setPreferencesSaved(false), 2000);
    },
    [auth.tokenParsed?.sub, oidcSubject],
  );

  const ordersById = useMemo(
    () => new Map(orders.map((order) => [order.id, order])),
    [orders],
  );

  const favoriteEvents = useMemo(
    () => events.filter((event) => savedSlugs.includes(event.slug)),
    [events, savedSlugs],
  );

  const refreshTickets = useCallback(() => fetchTickets(undefined, false), [fetchTickets]);
  const refreshOrders = useCallback(() => fetchOrders(undefined), [fetchOrders]);
  const openTicketQr = useCallback((ticket: AccountTicket) => setSelectedTicket(ticket), []);
  const closeTicketQr = useCallback(() => setSelectedTicket(null), []);

  const value = useMemo<AccountContextValue>(
    () => ({
      name,
      email,
      localUserId,
      oidcSubject,
      profileRole,
      accountStatus,
      createdAtUtc,
      isCustomer,
      profileLoading,
      profileError,
      syncingProfile,
      syncSuccess,
      keycloakAccountUrl,
      syncProfile,
      tickets,
      ticketsLoading,
      ticketsError,
      refreshTickets,
      orders,
      ordersById,
      ordersLoading,
      ordersError,
      refreshOrders,
      favoriteEvents,
      eventsLoading,
      removeFavorite,
      preferences,
      preferencesSaved,
      updatePreference,
      selectedTicket,
      ticketQr,
      qrLoading,
      qrError,
      openTicketQr,
      closeTicketQr,
    }),
    [
      accountStatus,
      closeTicketQr,
      createdAtUtc,
      email,
      eventsLoading,
      favoriteEvents,
      isCustomer,
      keycloakAccountUrl,
      localUserId,
      name,
      oidcSubject,
      openTicketQr,
      orders,
      ordersById,
      ordersError,
      ordersLoading,
      preferences,
      preferencesSaved,
      profileError,
      profileLoading,
      profileRole,
      qrError,
      qrLoading,
      refreshOrders,
      refreshTickets,
      removeFavorite,
      selectedTicket,
      syncProfile,
      syncSuccess,
      syncingProfile,
      ticketQr,
      tickets,
      ticketsError,
      ticketsLoading,
      updatePreference,
    ],
  );

  return <AccountContext.Provider value={value}>{children}</AccountContext.Provider>;
}

export function useAccount(): AccountContextValue {
  const context = useContext(AccountContext);
  if (!context) throw new Error("useAccount must be used inside AccountProvider.");
  return context;
}
