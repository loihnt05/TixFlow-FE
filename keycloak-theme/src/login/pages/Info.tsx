import type { PageProps } from "keycloakify/login/pages/PageProps";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { AuthButton } from "../../components/AuthButton";
import { Info as InfoIcon } from "lucide-react";

export default function Info(
  props: PageProps<Extract<KcContext, { pageId: "info.ftl" }>, I18n>
) {
  const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

  const { advancedMsgStr, msg } = i18n;
  const {
    messageHeader,
    message,
    requiredActions,
    skipLink,
    pageRedirectUri,
    actionUri,
    client,
  } = kcContext;

  const targetLink = pageRedirectUri || actionUri || client.baseUrl;

  return (
    <Template
      kcContext={kcContext}
      i18n={i18n}
      doUseDefaultCss={doUseDefaultCss}
      classes={classes}
      displayMessage={false}
      headerNode={
        <span
          dangerouslySetInnerHTML={{
            __html: kcSanitize(
              messageHeader
                ? advancedMsgStr(messageHeader)
                : message?.summary || "Information"
            ),
          }}
        />
      }
    >
      <div className="flex flex-col items-center text-center space-y-4 py-2">
        <div className="w-14 h-14 rounded-full bg-[#eff6ff] flex items-center justify-center text-[#3b82f6] shadow-inner mb-1">
          <InfoIcon className="w-7 h-7" />
        </div>

        <p
          className="text-sm text-[#4A4A4A] leading-relaxed max-w-[340px]"
          dangerouslySetInnerHTML={{
            __html: kcSanitize(
              (() => {
                let html = message?.summary?.trim() || "";
                if (requiredActions) {
                  html += " <b>";
                  html += requiredActions
                    .map((action) => advancedMsgStr(`requiredAction.${action}`))
                    .join(", ");
                  html += "</b>";
                }
                return html;
              })()
            ),
          }}
        />

        {!skipLink && targetLink && (
          <div className="w-full pt-4">
            <a href={targetLink} className="block w-full">
              <AuthButton type="button">
                {pageRedirectUri || client.baseUrl
                  ? msg("backToApplication")
                  : msg("proceedWithAction")}
              </AuthButton>
            </a>
          </div>
        )}
      </div>
    </Template>
  );
}
