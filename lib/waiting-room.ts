"use client";

import { useEffect, useRef, useState } from "react";
import { useKeycloakAuth } from "@/components/auth-provider";
import { ApiError, useApi } from "@/lib/api";

type Phase = "idle" | "checking" | "direct" | "waiting" | "admitted" |
  "expired" | "rejected" | "consumed" | "unavailable";

export interface WaitingRoomState {
  phase: Phase;
  queueId?: string;
  positionEstimate?: number | null;
  admissionToken?: string;
  expiresAtUnixMs?: number;
  message?: string;
}

interface JoinResponse {
  data: { mode: "Direct" | "Waiting"; queueId?: string; status?: string;
    positionEstimate?: number | null; pollAfterMs?: number };
}

interface StatusResponse {
  data: { queueId: string; status: string; positionEstimate: number | null;
    expiresAtUnixMs: number; admissionToken: string | null; pollAfterMs: number };
}

const initial: WaitingRoomState = { phase: "idle" };
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function storageKey(subject: string, sessionId: string): string {
  return `tixflow-waiting-room-${subject}-${sessionId}`;
}

export function useWaitingRoom(sessionId?: string, enabled = true) {
  const auth = useKeycloakAuth();
  const api = useApi();
  const apiRef = useRef(api);
  apiRef.current = api;
  const [state, setState] = useState<WaitingRoomState>(initial);
  const [generation, setGeneration] = useState(0);
  const skippedKey = useRef<string | undefined>(undefined);
  const subject = auth.tokenParsed?.sub;

  useEffect(() => {
    if (!enabled || !sessionId || !uuid.test(sessionId) || !auth.authenticated || !subject) {
      setState(initial);
      return;
    }
    const key = storageKey(subject, sessionId);
    if (skippedKey.current === key) return;
    const controller = new AbortController();
    let timer: ReturnType<typeof setTimeout> | undefined;
    let stopped = false;
    const update = (next: WaitingRoomState) => { if (!stopped) setState(next); };
    const schedule = (id: string, milliseconds: number) => {
      const delay = Math.min(5000, Math.max(3000, milliseconds || 3000)) + Math.floor(Math.random() * 500);
      timer = setTimeout(() => { void poll(id); }, delay);
    };
    const unavailable = (cause: unknown, id?: string) => {
      if (stopped || controller.signal.aborted) return;
      if (cause instanceof ApiError && ["WAITING_ROOM_CLOSED", "SALES_WINDOW_CLOSED"].includes(cause.code ?? "")) {
        sessionStorage.removeItem(key);
        update({ phase: "rejected", message: "Suất diễn đã hết vé hoặc ngừng bán." });
        return;
      }
      update({ phase: "unavailable", queueId: id,
        message: "Chưa kết nối được phòng chờ. Vui lòng thử lại sau ít giây." });
      const wait = cause instanceof ApiError && cause.retryAfter ? cause.retryAfter * 1000 : 5000;
      timer = setTimeout(() => { void (id ? poll(id) : join()); }, Math.min(15000, Math.max(3000, wait)));
    };
    const poll = async (id: string) => {
      try {
        const { data } = await apiRef.current<StatusResponse>(
          `/api/v1/waiting-room/status?queueId=${encodeURIComponent(id)}`, controller.signal);
        if (stopped) return;
        if (data.status === "Waiting") {
          update({ phase: "waiting", queueId: id, positionEstimate: data.positionEstimate });
          schedule(id, data.pollAfterMs);
        } else if (data.status === "Admitted" && data.admissionToken && data.expiresAtUnixMs > Date.now()) {
          update({ phase: "admitted", queueId: id, admissionToken: data.admissionToken,
            expiresAtUnixMs: data.expiresAtUnixMs });
          schedule(id, data.pollAfterMs);
        } else {
          sessionStorage.removeItem(key);
          const phase: Phase = data.status === "Rejected" ? "rejected"
            : data.status === "Consumed" ? "consumed" : "expired";
          update({ phase, message: phase === "rejected" ? "Suất diễn đã hết vé hoặc ngừng bán."
            : phase === "consumed" ? "Lượt này đã được dùng để tạo Hold. Hãy kiểm tra đơn hàng của bạn."
              : "Lượt chờ đã hết hạn. Bạn có thể vào lại hàng chờ." });
        }
      } catch (cause) {
        if (stopped || controller.signal.aborted) return;
        if (cause instanceof ApiError && cause.status === 404) {
          sessionStorage.removeItem(key);
          void join();
        } else unavailable(cause, id);
      }
    };
    const join = async () => {
      try {
        const { data } = await apiRef.current<JoinResponse>("/api/v1/waiting-room/join", {
          method: "POST", body: JSON.stringify({ eventSessionId: sessionId }), signal: controller.signal,
        });
        if (stopped) return;
        if (data.mode === "Direct") {
          sessionStorage.removeItem(key);
          update({ phase: "direct" });
        } else if (data.queueId && uuid.test(data.queueId)) {
          sessionStorage.setItem(key, data.queueId);
          if (data.status === "Admitted") void poll(data.queueId);
          else {
            update({ phase: "waiting", queueId: data.queueId, positionEstimate: data.positionEstimate });
            schedule(data.queueId, data.pollAfterMs ?? 3000);
          }
        } else unavailable(new Error("Invalid waiting room response"));
      } catch (cause) { unavailable(cause); }
    };

    update({ phase: "checking" });
    const saved = sessionStorage.getItem(key);
    if (saved && uuid.test(saved)) void poll(saved);
    else {
      if (saved) sessionStorage.removeItem(key);
      void join();
    }
    return () => {
      stopped = true;
      if (timer) clearTimeout(timer);
      controller.abort();
    };
  }, [sessionId, enabled, auth.authenticated, subject, generation]);

  const retry = () => {
    skippedKey.current = undefined;
    if (subject && sessionId && state.phase !== "unavailable" && state.phase !== "waiting")
      sessionStorage.removeItem(storageKey(subject, sessionId));
    setGeneration((value) => value + 1);
  };

  const leave = async () => {
    if (subject && sessionId) {
      skippedKey.current = storageKey(subject, sessionId);
      sessionStorage.removeItem(skippedKey.current);
    }
    setGeneration((value) => value + 1);
    if (state.queueId) {
      try { await apiRef.current(`/api/v1/waiting-room/${state.queueId}`, { method: "DELETE" }); }
      catch { /* Local state is cleared; a later join receives server state. */ }
    }
    setState({ phase: "expired", message: "Bạn đã rời hàng chờ." });
  };

  return { ...state, retry, leave };
}
