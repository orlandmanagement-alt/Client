import { apiGet } from "./api.js";
import config from "./config.js";
import { state } from "./state.js";

export async function initSession(){
  const res = await apiGet("/functions/api/auth/me");

  if(!res.ok){
    location.href = config.SSO_URL;
    return null;
  }

  state.user = res.data;
  return state.user;
}
