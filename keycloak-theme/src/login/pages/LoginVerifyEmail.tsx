import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { AuthButton } from "../../components/AuthButton";
import { Mail } from "lucide-react";

export default function LoginVerifyEmail(
  props: PageProps<Extract<KcContext, { pageId: "login-verify-email.ftl" }>, I18n>
) {
  const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

  const { url, user } = kcContext;
  const email = user?.email ?? "your email address";

  return (
    <Template
      kcContext={kcContext}
      i18n={i18n}
      doUseDefaultCss={doUseDefaultCss}
      classes={classes}
      displayInfo={false}
      headerNode="Check your email"
    >
      <div className="flex flex-col items-center text-center space-y-4 py-2">
        <div className="w-16 h-16 rounded-full bg-[#FFEFF0] flex items-center justify-center text-[#ef5360] shadow-inner mb-1">
          <Mail className="w-8 h-8" />
        </div>

        <p className="text-[14px] text-[#4A4A4A] leading-relaxed">
          We&apos;ve sent a verification link to:
        </p>

        <p className="text-[15px] font-bold text-[#ef5360] bg-[#FFEFF0]/60 px-4 py-1.5 rounded-full inline-block">
          {email}
        </p>

        <p className="text-xs text-[#8E8E8E] max-w-[320px] leading-relaxed pt-1">
          Please check your inbox and verify your email before continuing to TixFlow.
        </p>

        <div className="w-full pt-4 space-y-3">
          {url.loginAction && (
            <div className="text-xs text-[#8E8E8E]">
              Didn&apos;t receive the email?{" "}
              <a
                href={url.loginAction}
                className="font-semibold text-[#ef5360] hover:underline"
              >
                Click here to resend
              </a>
            </div>
          )}

          <a href={url.loginUrl} className="block w-full">
            <AuthButton type="button" variant="outline">
              BACK TO LOGIN
            </AuthButton>
          </a>
        </div>
      </div>
    </Template>
  );
}
