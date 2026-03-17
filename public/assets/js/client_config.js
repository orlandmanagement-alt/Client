import { CLIENT_CONFIG_LOCAL } from "./client_config.local.js";
import { CLIENT_CONFIG_STAGING } from "./client_config.staging.js";
import { CLIENT_CONFIG_PROD } from "./client_config.prod.js";

function detectClientEnv(){
  const host = String(location.hostname || "").toLowerCase();

  if(host === "127.0.0.1" || host === "localhost"){
    return "local";
  }

  if(host.includes("staging-client.") || host.includes("staging-")){
    return "staging";
  }

  return "production";
}

function selectClientConfig(){
  const env = detectClientEnv();

  if(env === "local") return CLIENT_CONFIG_LOCAL;
  if(env === "staging") return CLIENT_CONFIG_STAGING;
  return CLIENT_CONFIG_PROD;
}

export const CLIENT_CONFIG = selectClientConfig();

export function clientApiUrl(path){
  const base = String(CLIENT_CONFIG.backendBaseUrl || "").replace(/\/+$/, "");
  const clean = String(path || "").startsWith("/") ? String(path) : `/${String(path || "")}`;
  return `${base}${clean}`;
}
