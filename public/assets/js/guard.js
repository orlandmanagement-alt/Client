import { state } from "./state.js";
import config from "./config.js";

export function hasRole(role){
  return state.user?.roles?.includes(role);
}

export function requireAuth(){
  if(!state.user){
    location.href = config.SSO_URL;
    return false;
  }
  return true;
}

export function requireRole(role){
  if(!requireAuth()) return false;

  if(!hasRole(role)){
    location.href = "https://sso.orlandmanagement.com/access-denied.html";
    return false;
  }

  return true;
}
