import { CLIENT_CONFIG, clientApiUrl } from "./client_config.js";

function buildLoginUrl(){
  const url = new URL(CLIENT_CONFIG.ssoLoginUrl);
  url.searchParams.set("next", location.href);
  url.searchParams.set("portal", "client");
  return url.toString();
}

function buildDeniedUrl(reason = "role_not_allowed"){
  const url = new URL(CLIENT_CONFIG.ssoDeniedUrl);
  url.searchParams.set("reason", reason);
  url.searchParams.set("role", "client");
  url.searchParams.set("next", location.href);
  return url.toString();
}

export async function getSession(){
  const res = await fetch(
    clientApiUrl("/api/sso/me"),
    {
      method: "GET",
      credentials: "include"
    }
  );

  if(!res.ok){
    return null;
  }

  const data = await res.json();
  if(data.status !== "ok"){
    return null;
  }

  return data.data || null;
}

export async function requireClient(){
  const session = await getSession();

  if(!session){
    location.href = buildLoginUrl();
    return null;
  }

  const user = session.user || session;
  const roles = new Set((session.roles || user.roles || []).map(String));

  if(!roles.has("client")){
    location.href = buildDeniedUrl("role_not_allowed");
    return null;
  }

  return {
    ...user,
    roles: Array.from(roles)
  };
}
