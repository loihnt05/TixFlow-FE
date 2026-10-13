import { useEffect } from "react";
import type { TemplateProps } from "keycloakify/login/TemplateProps";
import { useInitialize } from "keycloakify/login/Template.useInitialize";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import type { KcContext } from "./KcContext";
import type { I18n } from "./i18n";
import { AuthLayout } from "../components/AuthLayout";
import { AuthCard } from "../components/AuthCard";
import { AuthHeader } from "../components/AuthHeader";
import { AuthAlert } from "../components/AuthAlert";
import { AuthFooter } from "../components/AuthFooter";
import "../styles/auth.css";

export default function Template(props: TemplateProps<KcContext, I18n>) {
  const {
    displayMessage = true,
    headerNode,
    socialProvidersNode = null,
    infoNode = null,
    documentTitle,
    kcContext,
    i18n,
    doUseDefaultCss,
    children,
  } = props;

  const { currentLanguage, enabledLanguages } = i18n;
  const { realm, message, isAppInitiatedAction } = kcContext;

  useEffect(() => {
    document.title =
      documentTitle ?? `${realm.displayName || "TixFlow"} - Sign In`;
  }, [documentTitle, realm.displayName]);

  const { isReadyToRender } = useInitialize({ kcContext, doUseDefaultCss });

  if (!isReadyToRender) {
    return null;
  }

  // Determine subtitle based on pageId
  const getSubtitle = () => {
    switch (kcContext.pageId) {
      case "login.ftl":
        return "Sign in to discover events and manage your tickets.";
      case "register.ftl":
        return "Create your account to start booking tickets.";
      case "login-reset-password.ftl":
        return "Enter your email address and we'll help you reset your password.";
      case "login-verify-email.ftl":
        return "Please verify your email address to continue.";
      case "login-otp.ftl":
        return "Enter your two-factor verification code to continue.";
      case "login-update-profile.ftl":
        return "Please update your profile details below.";
      default:
        return undefined;
    }
  };

  const alertType = message?.type as "error" | "warning" | "info" | "success" | undefined;

  return (
    <AuthLayout
      currentLanguage={currentLanguage}
      enabledLanguages={enabledLanguages}
    >
      <AuthCard>
        <AuthHeader
          title={kcContext.pageId === "login.ftl" ? "Welcome to TixFlow" : headerNode ?? "Welcome to TixFlow"}
          subtitle={getSubtitle()}
        />

        {/* Global Keycloak message / alert */}
        {displayMessage &&
          message !== undefined &&
          (message.type !== "warning" || !isAppInitiatedAction) && (
            <AuthAlert
              type={alertType || "error"}
              message={
                <span
                  dangerouslySetInnerHTML={{
                    __html: kcSanitize(message.summary),
                  }}
                />
              }
            />
          )}

        {/* Social login buttons (if on login page and providers exist) */}
        {socialProvidersNode}

        {/* Form body */}
        <div className="w-full">{children}</div>

        {/* Info node / links (e.g. register CTA) */}
        {infoNode && <div className="mt-6 text-center">{infoNode}</div>}

        <AuthFooter />
      </AuthCard>
    </AuthLayout>
  );
}
