import React from "react";
import { AlertCircle, CheckCircle2, Info, AlertTriangle } from "lucide-react";

interface AuthAlertProps {
  type?: "error" | "warning" | "info" | "success";
  message?: React.ReactNode;
}

export function AuthAlert({ type = "error", message }: AuthAlertProps) {
  if (!message) return null;

  const styleMap = {
    error: {
      bg: "bg-[#fef2f2] border-[#fecaca] text-[#dc2626]",
      icon: <AlertCircle className="w-4 h-4 shrink-0 text-[#ef5360]" />,
    },
    warning: {
      bg: "bg-[#fffbeb] border-[#fde68a] text-[#b45309]",
      icon: <AlertTriangle className="w-4 h-4 shrink-0 text-[#f59e0b]" />,
    },
    info: {
      bg: "bg-[#eff6ff] border-[#bfdbfe] text-[#1d4ed8]",
      icon: <Info className="w-4 h-4 shrink-0 text-[#3b82f6]" />,
    },
    success: {
      bg: "bg-[#f0fdf4] border-[#bbf7d0] text-[#15803d]",
      icon: <CheckCircle2 className="w-4 h-4 shrink-0 text-[#22c55e]" />,
    },
  };

  const current = styleMap[type] || styleMap.error;

  return (
    <div
      role="alert"
      className={`auth-alert-animate mb-5 flex items-start gap-2.5 rounded-xl border p-3.5 text-xs font-medium leading-relaxed ${current.bg}`}
    >
      <span className="mt-0.5">{current.icon}</span>
      <div className="flex-1">{message}</div>
    </div>
  );
}
