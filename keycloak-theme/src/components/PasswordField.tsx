import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface PasswordFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const PasswordField = React.forwardRef<HTMLInputElement, PasswordFieldProps>(
  ({ label = "Password", error, helperText, id = "password", className = "", ...props }, ref) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    return (
      <div className="w-full mb-4">
        {label && (
          <label
            htmlFor={id}
            className="block text-[11px] font-bold uppercase tracking-wider text-[#4A4A4A] mb-1.5"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            id={id}
            type={isPasswordVisible ? "text" : "password"}
            className={`w-full h-[48px] pl-4 pr-11 text-[14px] text-[#2B212B] bg-white border rounded-xl placeholder:text-[#9ca3af] auth-input-transition focus:outline-none disabled:bg-gray-50 disabled:text-gray-400 ${
              error
                ? "border-[#ef5360] focus:ring-2 focus:ring-[#ef5360]/20 focus:border-[#ef5360]"
                : "border-[#e5e7eb] hover:border-[#d1d5db] focus:border-[#ef5360] focus:ring-2 focus:ring-[#ef5360]/15"
            } ${className}`}
            {...props}
          />
          <button
            type="button"
            onClick={() => setIsPasswordVisible(!isPasswordVisible)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8E8E8E] hover:text-[#2B212B] p-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ef5360] transition-colors"
            aria-label={isPasswordVisible ? "Hide password" : "Show password"}
          >
            {isPasswordVisible ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        </div>
        {error ? (
          <p className="mt-1 text-xs text-[#ef5360] font-medium" role="alert">
            {error}
          </p>
        ) : helperText ? (
          <p className="mt-1 text-xs text-[#8E8E8E]">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

PasswordField.displayName = "PasswordField";
