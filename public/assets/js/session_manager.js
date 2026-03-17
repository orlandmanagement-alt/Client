import { apiGet, apiPost } from "./api.js";
import { notify } from "./notify.js";

export async function loadSessions(){
  const res = await apiGet("/functions/api/auth/sessions");
  if(!res.ok) return { ok:false, items:[] };
  const items = res.data?.items || res.data || [];
  return { ok:true, items:Array.isArray(items) ? items : [] };
}

export async function revokeSession(sessionId){
  const res = await apiPost("/functions/api/auth/revoke_session", {
    session_id: sessionId
  });

  if(!res.ok){
    notify(res.data?.message || "Failed to revoke session", "error");
    return false;
  }

  notify("Session revoked", "success");
  return true;
}

export async function logoutAll(){
  const res = await apiPost("/functions/api/auth/logout_all", {});
  if(!res.ok){
    notify(res.data?.message || "Failed to logout all", "error");
    return false;
  }
  notify("Logged out from all sessions", "success");
  return true;
}
