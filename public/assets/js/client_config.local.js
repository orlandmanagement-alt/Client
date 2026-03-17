import { CLIENT_CONFIG_BASE } from "./client_config.base.js";

export const CLIENT_CONFIG_LOCAL = {
  ...CLIENT_CONFIG_BASE,
  appName: "Orland Client Local",
  portalUrl: "http://127.0.0.1:8081",
  backendBaseUrl: "http://127.0.0.1:8787",
  ssoLoginUrl: "http://127.0.0.1:8080/app/pages/sso/login.html",
  ssoDeniedUrl: "http://127.0.0.1:8080/app/pages/sso/access-denied.html",
  envName: "local"
};
