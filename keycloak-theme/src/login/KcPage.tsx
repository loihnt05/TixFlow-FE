import { Suspense, lazy } from "react";
import type { ClassKey } from "keycloakify/login";
import type { KcContext } from "./KcContext";
import { useI18n } from "./i18n";
import DefaultPage from "keycloakify/login/DefaultPage";
import Template from "./Template";

const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const LoginResetPassword = lazy(() => import("./pages/LoginResetPassword"));
const LoginVerifyEmail = lazy(() => import("./pages/LoginVerifyEmail"));
const LoginOtp = lazy(() => import("./pages/LoginOtp"));
const LoginUpdateProfile = lazy(() => import("./pages/LoginUpdateProfile"));
const ErrorPage = lazy(() => import("./pages/Error"));
const InfoPage = lazy(() => import("./pages/Info"));

const UserProfileFormFields = lazy(
  () => import("keycloakify/login/UserProfileFormFields")
);

const doMakeUserConfirmPassword = true;

export default function KcPage(props: { kcContext: KcContext }) {
  const { kcContext } = props;
  const { i18n } = useI18n({ kcContext });

  return (
    <Suspense>
      {(() => {
        switch (kcContext.pageId) {
          case "login.ftl":
            return (
              <Login
                kcContext={kcContext}
                i18n={i18n}
                classes={classes}
                Template={Template}
                doUseDefaultCss={false}
              />
            );
          case "register.ftl":
            return (
              <Register
                kcContext={kcContext}
                i18n={i18n}
                classes={classes}
                Template={Template}
                doUseDefaultCss={false}
                UserProfileFormFields={UserProfileFormFields}
                doMakeUserConfirmPassword={doMakeUserConfirmPassword}
              />
            );
          case "login-reset-password.ftl":
            return (
              <LoginResetPassword
                kcContext={kcContext}
                i18n={i18n}
                classes={classes}
                Template={Template}
                doUseDefaultCss={false}
              />
            );
          case "login-verify-email.ftl":
            return (
              <LoginVerifyEmail
                kcContext={kcContext}
                i18n={i18n}
                classes={classes}
                Template={Template}
                doUseDefaultCss={false}
              />
            );
          case "login-otp.ftl":
            return (
              <LoginOtp
                kcContext={kcContext}
                i18n={i18n}
                classes={classes}
                Template={Template}
                doUseDefaultCss={false}
              />
            );
          case "login-update-profile.ftl":
            return (
              <LoginUpdateProfile
                kcContext={kcContext}
                i18n={i18n}
                classes={classes}
                Template={Template}
                doUseDefaultCss={false}
                UserProfileFormFields={UserProfileFormFields}
                doMakeUserConfirmPassword={doMakeUserConfirmPassword}
              />
            );
          case "error.ftl":
            return (
              <ErrorPage
                kcContext={kcContext}
                i18n={i18n}
                classes={classes}
                Template={Template}
                doUseDefaultCss={false}
              />
            );
          case "info.ftl":
            return (
              <InfoPage
                kcContext={kcContext}
                i18n={i18n}
                classes={classes}
                Template={Template}
                doUseDefaultCss={false}
              />
            );
          default:
            return (
              <DefaultPage
                kcContext={kcContext}
                i18n={i18n}
                classes={classes}
                Template={Template}
                doUseDefaultCss={true}
                UserProfileFormFields={UserProfileFormFields}
                doMakeUserConfirmPassword={doMakeUserConfirmPassword}
              />
            );
        }
      })()}
    </Suspense>
  );
}

const classes = {
  kcFormGroupClass: "tf-form-group",
  kcLabelWrapperClass: "tf-label-wrapper",
  kcLabelClass: "tf-label",
  kcInputWrapperClass: "tf-input-wrapper",
  kcInputClass: "tf-input",
  kcInputErrorMessageClass: "tf-input-error",
  kcInputGroup: "tf-input-group",
  kcFormPasswordVisibilityButtonClass: "tf-pw-toggle",
  kcFormClass: "tf-form"
} satisfies { [key in ClassKey]?: string };

