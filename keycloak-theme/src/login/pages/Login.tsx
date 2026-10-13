import { useState } from "react";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import { useScript } from "keycloakify/login/pages/Login.useScript";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { FormField } from "../../components/FormField";
import { PasswordField } from "../../components/PasswordField";
import { AuthButton } from "../../components/AuthButton";
import { SocialLogin } from "../../components/SocialLogin";
import { AuthAlert } from "../../components/AuthAlert";

export default function Login(
  props: PageProps<Extract<KcContext, { pageId: "login.ftl" }>, I18n>
) {
  const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

  const {
    social,
    realm,
    url,
    usernameHidden,
    login,
    auth,
    registrationDisabled,
    messagesPerField,
    enableWebAuthnConditionalUI,
    authenticators,
  } = kcContext;

  const { msg, msgStr } = i18n;

  const [isSubmitting, setIsSubmitting] = useState(false);

  const webAuthnButtonId = "authenticateWebAuthnButton";

  useScript({
    webAuthnButtonId,
    kcContext,
    i18n,
  });

  const usernameError: string | undefined = undefined;
  const passwordError: string | undefined = undefined;
  const hasCombinedError = messagesPerField.existsError("username", "password");
  const combinedErrorMessage = hasCombinedError
    ? messagesPerField.getFirstError("username", "password")
    : undefined;

  return (
    <Template
      kcContext={kcContext}
      i18n={i18n}
      doUseDefaultCss={doUseDefaultCss}
      classes={classes}
      displayMessage={!hasCombinedError}
      headerNode={msg("loginAccountTitle")}
      displayInfo={realm.password && realm.registrationAllowed && !registrationDisabled}
      socialProvidersNode={
        realm.password && social?.providers && social.providers.length > 0 ? (
          <SocialLogin providers={social.providers} />
        ) : null
      }
      infoNode={
        realm.password && realm.registrationAllowed && !registrationDisabled ? (
          <div className="text-center text-[13px] text-[#4A4A4A]">
            <span>Don't have an account? </span>
            <a
              href={url.registrationUrl}
              className="font-bold text-[#ef5360] hover:text-[#ec3746] transition-colors"
            >
              Create account
            </a>
          </div>
        ) : null
      }
    >
      {/* Alert for username/password error if present */}
      {hasCombinedError && combinedErrorMessage && (
        <AuthAlert type="error" message={combinedErrorMessage} />
      )}

      {realm.password && (
        <form
          id="kc-form-login"
          onSubmit={() => {
            setIsSubmitting(true);
            return true;
          }}
          action={url.loginAction}
          method="post"
          className="space-y-4"
        >
          {/* Username / Email field */}
          {!usernameHidden && (
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
              defaultValue={login.username ?? ""}
              type={realm.loginWithEmailAllowed ? "email" : "text"}
              autoFocus
              autoComplete={
                enableWebAuthnConditionalUI ? "username webauthn" : "username"
              }
              placeholder="user@example.com"
              error={usernameError}
              required
            />
          )}

          {/* Password field */}
          <div>
            <PasswordField
              id="password"
              name="password"
              label="PASSWORD"
              autoComplete="current-password"
              placeholder="••••••••••••"
              error={passwordError}
              required
            />

            {/* Remember me and Forgot password options */}
            <div className="flex items-center justify-between mt-2 text-xs">
              {realm.rememberMe && !usernameHidden ? (
                <label className="flex items-center gap-2 cursor-pointer select-none text-[#4A4A4A] hover:text-[#2B212B]">
                  <input
                    id="rememberMe"
                    name="rememberMe"
                    type="checkbox"
                    defaultChecked={!!login.rememberMe}
                    className="w-4 h-4 rounded border-[#e5e7eb] text-[#ef5360] focus:ring-[#ef5360] focus:ring-offset-0"
                  />
                  <span>{msgStr("rememberMe")}</span>
                </label>
              ) : (
                <div />
              )}

              {realm.resetPasswordAllowed && (
                <a
                  tabIndex={5}
                  href={url.loginResetCredentialsUrl}
                  className="font-medium text-[#8E8E8E] hover:text-[#ef5360] transition-colors"
                >
                  Forgot password?
                </a>
              )}
            </div>
          </div>

          {/* Hidden inputs for Keycloak credential selection */}
          <input
            type="hidden"
            id="id-hidden-input"
            name="credentialId"
            value={auth.selectedCredential}
          />

          {/* Primary Login Button */}
          <div className="pt-2">
            <AuthButton
              type="submit"
              name="login"
              id="kc-login"
              isLoading={isSubmitting}
              loadingText="Signing in..."
            >
              LOGIN
            </AuthButton>
          </div>
        </form>
      )}

      {/* WebAuthn Passkey UI if enabled */}
      {enableWebAuthnConditionalUI && (
        <div className="mt-4">
          <form id="webauth" action={url.loginAction} method="post">
            <input type="hidden" id="clientDataJSON" name="clientDataJSON" />
            <input
              type="hidden"
              id="authenticatorData"
              name="authenticatorData"
            />
            <input type="hidden" id="signature" name="signature" />
            <input type="hidden" id="credentialId" name="credentialId" />
            <input type="hidden" id="userHandle" name="userHandle" />
            <input type="hidden" id="error" name="error" />
          </form>

          {authenticators !== undefined &&
            authenticators.authenticators.length !== 0 && (
              <form id="authn_select">
                {authenticators.authenticators.map((authenticator, i) => (
                  <input
                    key={i}
                    type="hidden"
                    name="authn_use_chk"
                    readOnly
                    value={authenticator.credentialId}
                  />
                ))}
              </form>
            )}

          <AuthButton
            id={webAuthnButtonId}
            type="button"
            variant="outline"
            className="mt-3"
          >
            {msgStr("passkey-doAuthenticate")}
          </AuthButton>
        </div>
      )}
    </Template>
  );
}
