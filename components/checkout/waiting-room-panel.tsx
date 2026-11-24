"use client";

import Link from "next/link";
import { Clock3, Ticket, AlertCircle } from "lucide-react";
import type { WaitingRoomState } from "@/lib/waiting-room";

interface Props extends WaitingRoomState {
  retry(): void;
  leave(): Promise<void>;
  eventHref?: string;
}

export function WaitingRoomPanel({ phase, positionEstimate, expiresAtUnixMs,
  message, retry, leave, eventHref }: Props) {
  if (phase === "idle" || phase === "direct") return null;
  const waiting = phase === "waiting";
  const admitted = phase === "admitted";
  const problem = phase === "unavailable" || phase === "expired" || phase === "rejected" || phase === "consumed";
  return (
    <section aria-label="Phòng chờ mua vé" role="status"
      className={`mb-5 rounded-2xl border p-4 sm:p-5 ${admitted ? "border-emerald-200 bg-emerald-50" :
        problem ? "border-amber-200 bg-amber-50" : "border-rose-200 bg-rose-50"}`}>
      <div className="flex items-start gap-3">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white text-[#ef5360]">
          {problem ? <AlertCircle size={18} /> : admitted ? <Ticket size={18} /> : <Clock3 size={18} />}
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="text-sm font-bold text-[#2B212B]">
            {phase === "checking" ? "Đang kiểm tra phòng chờ…" : waiting ? "Bạn đang ở trong hàng chờ" :
              admitted ? "Đã đến lượt tạo Hold" : phase === "unavailable" ? "Phòng chờ tạm gián đoạn" :
                phase === "rejected" ? "Suất diễn không còn mở bán" : phase === "consumed" ? "Lượt đã được sử dụng" :
                  "Lượt chờ đã hết hạn"}
          </h2>
          <p className="mt-1 text-xs leading-relaxed text-gray-700">
            {waiting ? `Vị trí ước lượng: ${positionEstimate ?? "đang cập nhật"}. Vị trí có thể thay đổi; trang sẽ tự cập nhật.` :
              admitted ? `Bạn có thể tiếp tục. Lượt có hiệu lực đến ${expiresAtUnixMs
                ? new Date(expiresAtUnixMs).toLocaleTimeString("vi-VN") : "trong ít phút"}. Lượt này không bảo đảm còn vé.` :
                message ?? (phase === "checking" ? "Đang nối lại lượt chờ của bạn nếu có." : "")}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {(phase === "expired" || phase === "unavailable") && (
              <button type="button" onClick={retry}
                className="rounded-full bg-[#ef5360] px-4 py-2 text-xs font-semibold text-white hover:bg-[#df3c4b]">
                {phase === "expired" ? "Vào lại hàng chờ" : "Thử kết nối lại"}
              </button>
            )}
            {waiting && (
              <button type="button" onClick={() => void leave()}
                className="rounded-full border border-gray-300 bg-white px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50">
                Rời hàng chờ
              </button>
            )}
            {phase === "rejected" && eventHref && (
              <Link href={eventHref} className="rounded-full bg-white px-4 py-2 text-xs font-semibold text-[#ef5360]">
                Xem lại sự kiện
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
