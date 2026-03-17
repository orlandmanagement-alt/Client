const API_BASE = "https://api.orlandmanagement.com";
const SSO_BASE = "https://sso.orlandmanagement.com";

export async function checkSession() {
  try {
    const res = await fetch(`${SSO_BASE}/functions/api/auth/me`, {
      credentials: "include"
    });

    if (!res.ok) return null;

    const j = await res.json();
    return j?.data || null;
  } catch {
    return null;
  }
}

export function redirectToSSO(portal = "talent", next = "/") {
  const url = `${SSO_BASE}/index.html?portal=${portal}&next=${encodeURIComponent(next)}`;
  window.location.href = url;
}

export function redirectToRegister(portal = "talent") {
  const url = `${SSO_BASE}/register.html?portal=${portal}`;
  window.location.href = url;
}

export function logout() {
  window.location.href = `${SSO_BASE}/index.html`;
}
