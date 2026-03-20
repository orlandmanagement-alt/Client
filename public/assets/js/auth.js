import config from "./config.js";

export async function checkSession() {
    try {
        // Tembak ke SSO_URL
        const res = await fetch(`${config.SSO_URL}/api/auth/me`, { 
            method: 'GET', credentials: 'include', headers: { 'Accept': 'application/json' }
        });
        if (!res.ok) return null;
        const data = await res.json();
        return data.user || null;
    } catch (e) { return null; }
}

export async function requireAuth(expectedRole = 'client') {
    const user = await checkSession();
    if (!user || user.role !== expectedRole) {
        sessionStorage.setItem('auth_error', 'Sesi Anda telah habis atau akses ditolak.');
