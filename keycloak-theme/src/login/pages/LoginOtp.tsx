import { useState, useRef, useEffect } from "react";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { AuthButton } from "../../components/AuthButton";
import { ShieldCheck } from "lucide-react";

export default function LoginOtp(
  props: PageProps<Extract<KcContext, { pageId: "login-otp.ftl" }>, I18n>
) {
  const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

  const { otpLogin, url, messagesPerField } = kcContext;

  const [otpDigits, setOtpDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const fullOtp = otpDigits.join("");
  const hasError = messagesPerField.existsError("totp");
  const errorMessage = hasError ? messagesPerField.get("totp") : undefined;

  useEffect(() => {
    // Focus first input on mount
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    const cleanVal = value.replace(/\D/g, "");

    if (cleanVal.length === 0) {
      const nextDigits = [...otpDigits];
      nextDigits[index] = "";
      setOtpDigits(nextDigits);
      return;
    }

    if (cleanVal.length > 1) {
      // Handle paste of multiple characters into one input
      handlePasteString(cleanVal);
      return;
    }

    const nextDigits = [...otpDigits];
    nextDigits[index] = cleanVal[cleanVal.length - 1];
    setOtpDigits(nextDigits);

    // Advance focus
    if (index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePasteString = (pasted: string) => {
    const numbers = pasted.replace(/\D/g, "").slice(0, 6);
    const nextDigits = [...otpDigits];
    for (let i = 0; i < 6; i++) {
      nextDigits[i] = numbers[i] || "";
    }
    setOtpDigits(nextDigits);
    const nextFocusIndex = Math.min(numbers.length, 5);
    inputRefs.current[nextFocusIndex]?.focus();
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text");
    handlePasteString(pasted);
  };

  return (
    <Template
      kcContext={kcContext}
      i18n={i18n}
      doUseDefaultCss={doUseDefaultCss}
      classes={classes}
      displayMessage={!hasError}
      headerNode="Verification code"
    >
      <div className="flex flex-col items-center text-center mb-6">
        <div className="w-14 h-14 rounded-full bg-[#FFEFF0] flex items-center justify-center text-[#ef5360] shadow-inner mb-2">
          <ShieldCheck className="w-7 h-7" />
        </div>
        <p className="text-[13.5px] text-[#8E8E8E]">
          Enter the 6-digit authentication code from your authenticator app.
        </p>
      </div>

      <form
        id="kc-otp-login-form"
        action={url.loginAction}
        method="post"
        onSubmit={() => {
          setIsSubmitting(true);
          return true;
        }}
        className="space-y-6"
      >
        {/* Support multiple OTP credentials if configured */}
        {otpLogin.userOtpCredentials.length > 1 && (
          <div className="mb-4 space-y-2">
            <span className="block text-xs font-semibold text-[#4A4A4A]">
              Choose Authenticator:
            </span>
            <div className="flex flex-col gap-2">
              {otpLogin.userOtpCredentials.map((cred) => (
                <label
                  key={cred.id}
                  className="flex items-center gap-2 text-xs text-[#4A4A4A] cursor-pointer bg-gray-50 p-2.5 rounded-lg border border-gray-200 hover:border-[#ef5360]"
                >
                  <input
                    type="radio"
                    name="selectedCredentialId"
                    value={cred.id}
                    defaultChecked={cred.id === otpLogin.selectedCredentialId}
                    className="text-[#ef5360] focus:ring-[#ef5360]"
                  />
                  <span className="font-medium">{cred.userLabel}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* 6 Digit Inputs */}
        <div className="flex justify-center gap-2 sm:gap-3 py-2">
          {otpDigits.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              className={`otp-box text-center text-xl font-bold rounded-xl border ${
                hasError
                  ? "border-[#ef5360] bg-[#fef2f2]"
                  : "border-[#e5e7eb] focus:border-[#ef5360] focus:ring-2 focus:ring-[#ef5360]/20"
              }`}
            />
          ))}
        </div>

        {/* Hidden input binding to Keycloak standard name */}
        <input type="hidden" id="otp" name="otp" value={fullOtp} />

        {hasError && errorMessage && (
          <p className="text-center text-xs font-semibold text-[#ef5360]" role="alert">
            {errorMessage}
          </p>
        )}

        <div className="pt-2">
          <AuthButton
            type="submit"
            name="login"
            id="kc-login"
            disabled={fullOtp.length < 6}
            isLoading={isSubmitting}
            loadingText="Verifying..."
          >
            CONTINUE
          </AuthButton>
        </div>

        <div className="text-center pt-2">
          <a
            href={url.loginUrl}
            className="text-xs font-semibold text-[#8E8E8E] hover:text-[#ef5360] transition-colors"
          >
            Back to login
          </a>
        </div>
      </form>
    </Template>
  );
}
