import React from "react";
import { Globe } from "lucide-react";

interface Language {
  languageTag: string;
  label: string;
  href: string;
}

interface AuthLayoutProps {
  children: React.ReactNode;
  currentLanguage?: { label: string };
  enabledLanguages?: Language[];
}

export function AuthLayout({
  children,
  currentLanguage,
  enabledLanguages,
}: AuthLayoutProps) {
  const [localeOpen, setLocaleOpen] = React.useState(false);

  return (
    <div className="min-h-screen w-full bg-[#f6f6f6] flex flex-col justify-between py-8 px-4 sm:px-6 relative">
      {/* Top bar with language switcher if available */}
      {enabledLanguages && enabledLanguages.length > 1 && (
        <div className="absolute top-4 right-4 sm:top-6 sm:right-8 z-30">
          <div className="relative">
            <button
              type="button"
              onClick={() => setLocaleOpen(!localeOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#4A4A4A] bg-white border border-[#e5e7eb] rounded-full hover:bg-gray-50 focus:outline-none shadow-sm transition"
            >
              <Globe className="w-3.5 h-3.5 text-[#8E8E8E]" />
              <span>{currentLanguage?.label || "Language"}</span>
            </button>

            {localeOpen && (
              <div className="absolute right-0 mt-1.5 w-36 bg-white border border-[#e5e7eb] rounded-xl shadow-lg py-1 z-40">
                {enabledLanguages.map((lang) => (
                  <a
                    key={lang.languageTag}
                    href={lang.href}
                    className="block px-3 py-1.5 text-xs font-medium text-[#4A4A4A] hover:bg-[#FFEFF0] hover:text-[#ef5360] transition"
                  >
                    {lang.label}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main centered content */}
      <main className="my-auto w-full flex items-center justify-center">
        {children}
      </main>
    </div>
  );
}
