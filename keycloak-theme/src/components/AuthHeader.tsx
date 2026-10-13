import React from "react";
import { Ticket } from "lucide-react";

interface AuthHeaderProps {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
}

export function AuthHeader({ title, subtitle }: AuthHeaderProps) {
  return (
    <div className="flex flex-col items-center text-center mb-6">
      <div className="inline-flex items-center gap-2 mb-4 select-none">
        <span className="grid w-8 h-8 place-items-center rounded-xl bg-[#ef5360] text-white shadow-[0_3px_8px_rgba(239,83,96,0.35)]">
          <Ticket className="w-[18px] h-[18px]" strokeWidth={2.5} />
        </span>
        <span className="text-[24px] font-extrabold tracking-[-0.6px] text-[#2B212B]">
          TixFlow
        </span>
      </div>

      {title && (
        <h1 className="text-[22px] font-bold tracking-tight text-[#2B212B] leading-snug">
          {title}
        </h1>
      )}

      {subtitle && (
        <p className="text-[13.5px] text-[#8E8E8E] mt-1.5 leading-relaxed max-w-[340px]">
          {subtitle}
        </p>
      )}
    </div>
  );
}
