import { CLIENT_CONFIG_BASE } from "./client_config.base.js";

export const CLIENT_CONFIG_PROD = {
  ...CLIENT_CONFIG_BASE,
  appName: "Orland Client",
  portalUrl: "https://client.orlandmanagement.com",
  backendBaseUrl: "https://api.orlandmanagement.com",
  ssoLoginUrl: "https://sso.orlandmanagement.com/app/pages/sso/login.html",
  ssoDeniedUrl: "https://sso.orlandmanagement.com/app/pages/sso/access-denied.html",
  envName: "production"
};
