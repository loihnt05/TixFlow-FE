
export function AuthFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-8 pt-4 border-t border-[#f1f2f4] text-center text-xs text-[#8E8E8E]">
      <div className="flex items-center justify-center gap-3 mb-2 font-medium">
        <a
          href="/legal/terms"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-[#ef5360] transition-colors"
        >
          Terms of Service
        </a>
        <span>•</span>
        <a
          href="/legal/privacy"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-[#ef5360] transition-colors"
        >
          Privacy Policy
        </a>
      </div>
      <p className="text-[11px] text-[#a0a0a0]">
        &copy; {currentYear} TixFlow. All rights reserved.
      </p>
    </footer>
  );
}
