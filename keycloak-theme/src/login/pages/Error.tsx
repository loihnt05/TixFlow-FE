import type { PageProps } from "keycloakify/login/pages/PageProps";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { AuthButton } from "../../components/AuthButton";
import { AlertCircle } from "lucide-react";

export default function Error(
  props: PageProps<Extract<KcContext, { pageId: "error.ftl" }>, I18n>
) {
  const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

  const { message, client, skipLink } = kcContext;
  const { msg } = i18n;

  return (
    <Template
      kcContext={kcContext}
      i18n={i18n}
      doUseDefaultCss={doUseDefaultCss}
      classes={classes}
      displayMessage={false}
      headerNode="Something went wrong"
    >
      <div className="flex flex-col items-center text-center space-y-4 py-2">
        <div className="w-14 h-14 rounded-full bg-[#fef2f2] flex items-center justify-center text-[#ef5360] shadow-inner mb-1">
          <AlertCircle className="w-7 h-7" />
        </div>

        <div
          className="text-sm text-[#4A4A4A] leading-relaxed max-w-[340px]"
          dangerouslySetInnerHTML={{ __html: kcSanitize(message.summary) }}
        />

        {!skipLink && !!client?.baseUrl && (
          <div className="w-full pt-4">
            <a href={client.baseUrl} className="block w-full">
              <AuthButton type="button">
                {msg("backToApplication")}
              </AuthButton>
            </a>
          </div>
        )}
      </div>
    </Template>
  );
}
