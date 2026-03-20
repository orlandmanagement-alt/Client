import config from "./config.js";

export async function checkSession() {
    try {
        const res = await fetch(`${config.API_BASE}/api/auth/me`, { 
            method: 'GET', credentials: 'include', headers: { 'Accept': 'application/json' }
        });
        if (!res.ok) return null;
        const data = await res.json();
        return data.user || null;
    } catch (e) { return null; }
}

export async function logout() {
    try { await fetch(`${config.SSO_URL}/api/auth/logout`, { method: 'POST', credentials: 'include' }); } catch(e) {}
    // Cukup refresh halaman. Script SPA di index.html akan otomatis memunculkan Popup Login.
    window.location.href = '/'; 
}
