import React from "react";
import { Loader2 } from "lucide-react";

interface AuthButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  loadingText?: string;
  variant?: "primary" | "outline" | "secondary";
  children: React.ReactNode;
}

export function AuthButton({
  children,
  isLoading = false,
  loadingText = "Please wait...",
  variant = "primary",
  disabled,
  className = "",
  ...props
}: AuthButtonProps) {
  const baseClasses =
    "relative flex items-center justify-center w-full h-[48px] px-6 text-[14px] font-bold tracking-wide rounded-full select-none focus:outline-none focus:ring-2 focus:ring-[#ef5360] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none transition-all duration-150";

  const variantClasses = {
    primary:
      "bg-[#ef5360] hover:bg-[#ec3746] active:bg-[#d71424] text-white shadow-[0_4px_12px_rgba(239,83,96,0.25)] hover:shadow-[0_6px_16px_rgba(239,83,96,0.32)] hover:-translate-y-[1px] active:scale-[0.99]",
    outline:
      "bg-white hover:bg-[#FFEFF0] border border-[#e5e7eb] hover:border-[#ef5360] text-[#4A4A4A] hover:text-[#ef5360]",
    secondary:
      "bg-[#FFEFF0] hover:bg-[#ffb9b9] text-[#ef5360]",
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <span className="inline-flex items-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin text-current" />
          <span>{loadingText}</span>
        </span>
      ) : (
        children
      )}
    </button>
  );
}
