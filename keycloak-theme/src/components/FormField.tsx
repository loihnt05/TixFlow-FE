import React from "react";

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const FormField = React.forwardRef<HTMLInputElement, FormFieldProps>(
  ({ label, error, helperText, id, className = "", ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full mb-4">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-[11px] font-bold uppercase tracking-wider text-[#4A4A4A] mb-1.5"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            className={`w-full h-[48px] px-4 text-[14px] text-[#2B212B] bg-white border rounded-xl placeholder:text-[#9ca3af] auth-input-transition focus:outline-none disabled:bg-gray-50 disabled:text-gray-400 ${
              error
                ? "border-[#ef5360] focus:ring-2 focus:ring-[#ef5360]/20 focus:border-[#ef5360]"
                : "border-[#e5e7eb] hover:border-[#d1d5db] focus:border-[#ef5360] focus:ring-2 focus:ring-[#ef5360]/15"
            } ${className}`}
            {...props}
          />
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

FormField.displayName = "FormField";
