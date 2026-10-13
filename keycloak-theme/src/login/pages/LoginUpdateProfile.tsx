import type { JSX } from "keycloakify/tools/JSX";
import { useState } from "react";
import type { LazyOrNot } from "keycloakify/tools/LazyOrNot";
import { getKcClsx } from "keycloakify/login/lib/kcClsx";
import type { UserProfileFormFieldsProps } from "keycloakify/login/UserProfileFormFieldsProps";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { AuthButton } from "../../components/AuthButton";

type LoginUpdateProfileProps = PageProps<
  Extract<KcContext, { pageId: "login-update-profile.ftl" }>,
  I18n
> & {
  UserProfileFormFields: LazyOrNot<(props: UserProfileFormFieldsProps) => JSX.Element>;
  doMakeUserConfirmPassword: boolean;
};

export default function LoginUpdateProfile(props: LoginUpdateProfileProps) {
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

  const { messagesPerField, url, isAppInitiatedAction } = kcContext;
  const { msg } = i18n;

  const [isFormSubmittable, setIsFormSubmittable] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <Template
      kcContext={kcContext}
      i18n={i18n}
      doUseDefaultCss={doUseDefaultCss}
      classes={classes}
      displayRequiredFields
      headerNode="Complete your profile"
      displayMessage={messagesPerField.exists("global")}
    >
      <div className="mb-5 text-center">
        <p className="text-[13.5px] text-[#8E8E8E]">
          Tell us a little about yourself to make ticket checkout faster.
        </p>
      </div>

      <form
        id="kc-update-profile-form"
        action={url.loginAction}
        method="post"
        onSubmit={() => {
          setIsSubmitting(true);
          return true;
        }}
        className="space-y-4"
      >
        <UserProfileFormFields
          kcContext={kcContext}
          i18n={i18n}
          kcClsx={kcClsx}
          onIsFormSubmittableValueChange={setIsFormSubmittable}
          doMakeUserConfirmPassword={doMakeUserConfirmPassword}
        />

        <div className="pt-3 space-y-2">
          <AuthButton
            type="submit"
            disabled={!isFormSubmittable}
            isLoading={isSubmitting}
            loadingText="Saving profile..."
          >
            SAVE & CONTINUE
          </AuthButton>

          {isAppInitiatedAction && (
            <button
              className="w-full h-[44px] text-xs font-semibold text-[#8E8E8E] hover:text-[#4A4A4A] transition-colors"
              type="submit"
              name="cancel-aia"
              value="true"
              formNoValidate
            >
              {msg("doCancel")}
            </button>
          )}
        </div>
      </form>
    </Template>
  );
}
