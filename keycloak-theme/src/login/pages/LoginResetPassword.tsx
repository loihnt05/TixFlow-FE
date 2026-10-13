import { useState } from "react";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { FormField } from "../../components/FormField";
import { AuthButton } from "../../components/AuthButton";
import { ArrowLeft } from "lucide-react";

export default function LoginResetPassword(
  props: PageProps<Extract<KcContext, { pageId: "login-reset-password.ftl" }>, I18n>
) {
  const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

  const { url, realm, auth, messagesPerField } = kcContext;
  const { msgStr } = i18n;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const usernameError = messagesPerField.existsError("username")
    ? messagesPerField.get("username")
    : undefined;

  return (
    <Template
      kcContext={kcContext}
      i18n={i18n}
      doUseDefaultCss={doUseDefaultCss}
      classes={classes}
      displayInfo={false}
      displayMessage={!messagesPerField.existsError("username")}
      headerNode="Forgot your password?"
    >
      <form
        id="kc-reset-password-form"
        action={url.loginAction}
        method="post"
        className="space-y-5"
        onSubmit={() => {
          setIsSubmitting(true);
          return true;
        }}
      >
        <FormField
          id="username"
          name="username"
          label={
            !realm.loginWithEmailAllowed
              ? msgStr("username")
              : !realm.registrationEmailAsUsername
              ? msgStr("usernameOrEmail")
              : "EMAIL ADDRESS"
          }
          type={realm.loginWithEmailAllowed ? "email" : "text"}
          autoFocus
          defaultValue={auth.attemptedUsername ?? ""}
          placeholder="user@example.com"
          error={usernameError}
          required
        />

        <div className="pt-2">
          <AuthButton
            type="submit"
            isLoading={isSubmitting}
            loadingText="Sending reset link..."
          >
            SEND RESET LINK
          </AuthButton>
        </div>

        <div className="text-center pt-2">
          <a
            href={url.loginUrl}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#8E8E8E] hover:text-[#ef5360] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to login</span>
          </a>
        </div>
      </form>
    </Template>
  );
}
