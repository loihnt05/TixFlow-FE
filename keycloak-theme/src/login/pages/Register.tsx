import type { JSX } from "keycloakify/tools/JSX";
import { useState, useLayoutEffect } from "react";
import type { LazyOrNot } from "keycloakify/tools/LazyOrNot";
import { getKcClsx } from "keycloakify/login/lib/kcClsx";
import type { UserProfileFormFieldsProps } from "keycloakify/login/UserProfileFormFieldsProps";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { AuthButton } from "../../components/AuthButton";

type RegisterProps = PageProps<Extract<KcContext, { pageId: "register.ftl" }>, I18n> & {
  UserProfileFormFields: LazyOrNot<(props: UserProfileFormFieldsProps) => JSX.Element>;
  doMakeUserConfirmPassword: boolean;
};

export default function Register(props: RegisterProps) {
  const {
    kcContext,
    i18n,
    doUseDefaultCss,
    Template,
    classes,
    UserProfileFormFields,
    doMakeUserConfirmPassword,
  } = props;

  const { kcClsx } = getKcClsx({
    doUseDefaultCss,
    classes,
  });

  const {
    messageHeader,
    url,
    messagesPerField,
    recaptchaRequired,
    recaptchaVisible,
    recaptchaSiteKey,
    recaptchaAction,
    termsAcceptanceRequired,
  } = kcContext;

  const { advancedMsg } = i18n;

  const [isFormSubmittable, setIsFormSubmittable] = useState(false);
  const [areTermsAccepted, setAreTermsAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useLayoutEffect(() => {
    (window as any)["onSubmitRecaptcha"] = () => {
      // @ts-expect-error
      document.getElementById("kc-register-form").requestSubmit();
    };

    return () => {
      delete (window as any)["onSubmitRecaptcha"];
    };
  }, []);

  return (
    <Template
      kcContext={kcContext}
      i18n={i18n}
      doUseDefaultCss={doUseDefaultCss}
      classes={classes}
      headerNode={
        messageHeader !== undefined
          ? advancedMsg(messageHeader)
          : "Create your account"
      }
      displayMessage={messagesPerField.exists("global")}
      displayRequiredFields
      infoNode={
        <div className="text-center text-[13px] text-[#4A4A4A]">
          <span>Already have an account? </span>
          <a
            href={url.loginUrl}
            className="font-bold text-[#ef5360] hover:text-[#ec3746] transition-colors"
          >
            Sign in
          </a>
        </div>
      }
    >
      <form
        id="kc-register-form"
        className="space-y-4"
        action={url.registrationAction}
        method="post"
        onSubmit={() => {
          setIsSubmitting(true);
          return true;
        }}
      >
        <UserProfileFormFields
          kcContext={kcContext}
          i18n={i18n}
          kcClsx={kcClsx}
          onIsFormSubmittableValueChange={setIsFormSubmittable}
          doMakeUserConfirmPassword={doMakeUserConfirmPassword}
        />

        {termsAcceptanceRequired && (
          <div className="pt-2">
            <label className="flex items-start gap-2.5 text-xs text-[#4A4A4A] cursor-pointer">
              <input
                type="checkbox"
                id="termsAccepted"
                name="termsAccepted"
                className="mt-0.5 w-4 h-4 rounded border-[#e5e7eb] text-[#ef5360] focus:ring-[#ef5360]"
                checked={areTermsAccepted}
                onChange={(e) => setAreTermsAccepted(e.target.checked)}
              />
              <span>
                I agree to the{" "}
                <a
                  href="/legal/terms"
                  target="_blank"
                  className="font-semibold text-[#ef5360] hover:underline"
                >
                  Terms of Service
                </a>{" "}
                and{" "}
                <a
                  href="/legal/privacy"
                  target="_blank"
                  className="font-semibold text-[#ef5360] hover:underline"
                >
                  Privacy Policy
                </a>
                .
              </span>
            </label>
            {messagesPerField.existsError("termsAccepted") && (
              <p className="mt-1 text-xs text-[#ef5360] font-medium" role="alert">
                {messagesPerField.get("termsAccepted")}
              </p>
            )}
          </div>
        )}

        {recaptchaRequired &&
          (recaptchaVisible || recaptchaAction === undefined) && (
            <div className="my-3 flex justify-center">
              <div
                className="g-recaptcha"
                data-size="compact"
                data-sitekey={recaptchaSiteKey}
                data-action={recaptchaAction}
              />
            </div>
          )}

        <div className="pt-3">
          {recaptchaRequired &&
          !recaptchaVisible &&
          recaptchaAction !== undefined ? (
            <AuthButton
              type="submit"
              className="g-recaptcha"
              data-sitekey={recaptchaSiteKey}
              data-callback="onSubmitRecaptcha"
              data-action={recaptchaAction}
              isLoading={isSubmitting}
              loadingText="Creating account..."
            >
              CREATE ACCOUNT
            </AuthButton>
          ) : (
            <AuthButton
              type="submit"
              disabled={
                !isFormSubmittable ||
                (termsAcceptanceRequired && !areTermsAccepted)
              }
              isLoading={isSubmitting}
              loadingText="Creating account..."
            >
              CREATE ACCOUNT
            </AuthButton>
          )}
        </div>
      </form>
    </Template>
  );
}
