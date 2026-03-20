import config from "./config.js";
import { state } from "./state.js"; 

export async function checkSession() {
    try {
        const res = await fetch(`${config.SSO_URL}/api/auth/me`, { credentials: "include" });
        if (!res.ok) return null;
        const data = await res.json();
        return data.user || null;
    } catch (e) { return null; }
}

export function redirectToSSO() { window.location.href = config.SSO_URL; }

export async function requireAuth(expectedRole = null) {
    const user = await checkSession();
    if (!user) { redirectToSSO(); return false; }
    
    if (expectedRole && user.role !== expectedRole && user.role !== 'admin') {
        window.location.href = user.role === 'talent' ? 'https://talent.orlandmanagement.com' : 'https://sso.orlandmanagement.com';
        return false;
    }
    if (state) state.user = user; 
    return user;
}

export async function logout() {
    await fetch(`${config.SSO_URL}/api/auth/logout`, { method: 'POST', credentials: 'include' });
    redirectToSSO();
}
