import { CLIENT_CONFIG_BASE } from "./client_config.base.js";

export const CLIENT_CONFIG_STAGING = {
  ...CLIENT_CONFIG_BASE,
  appName: "Orland Client Staging",
  portalUrl: "https://staging-client.orlandmanagement.com",
  backendBaseUrl: "https://staging-dashboard.orlandmanagement.com",
  ssoLoginUrl: "https://staging-sso.orlandmanagement.com/app/pages/sso/login.html",
  ssoDeniedUrl: "https://staging-sso.orlandmanagement.com/app/pages/sso/access-denied.html",
  envName: "staging"
};
