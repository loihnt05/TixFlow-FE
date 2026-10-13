import { createRoot } from "react-dom/client";
import { StrictMode } from "react";
import { KcPage } from "./kc.gen";
import { getKcContextMock } from "./login/KcPageStory";

if (import.meta.env.DEV && !window.kcContext) {
  const params = new URLSearchParams(window.location.search);
  const pageId = (params.get("page") || "login.ftl") as any;
  const hasError = params.get("error") === "true";

  window.kcContext = getKcContextMock({
    pageId,
    overrides: {
      realm: {
        displayName: "TixFlow",
        rememberMe: true,
        resetPasswordAllowed: true,
        registrationAllowed: true,
        loginWithEmailAllowed: true,
      },
      social: {
        displayInfo: true,
        providers: [
          {
            alias: "facebook",
            displayName: "Facebook",
            loginUrl: "#",
          },
          {
            alias: "google",
            displayName: "Google",
            loginUrl: "#",
          },
          {
            alias: "linkedin",
            displayName: "LinkedIn",
            loginUrl: "#",
          },
        ],
      },
      ...(hasError
        ? {
            message: {
              type: "error",
              summary: "Invalid username or password.",
            },
          }
        : {}),
    },
  });
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {!window.kcContext ? (
      <h1>No Keycloak Context</h1>
    ) : (
      <KcPage kcContext={window.kcContext} />
    )}
  </StrictMode>
);
