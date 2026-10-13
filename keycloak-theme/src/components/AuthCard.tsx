import React from "react";

interface AuthCardProps {
  children: React.ReactNode;
  className?: string;
}

export function AuthCard({ children, className = "" }: AuthCardProps) {
  return (
    <div
      className={`auth-card-animate w-full max-w-[460px] mx-auto bg-white rounded-2xl border border-[#f0f0f2] shadow-[0_4px_24px_rgba(0,0,0,0.06)] p-6 sm:p-9 ${className}`}
    >
      {children}
    </div>
  );
}
