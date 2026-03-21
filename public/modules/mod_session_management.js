import { apiGet, apiPost } from "/assets/js/api.js";

export async function render() {
    return `
    <div class="p-6 max-w-2xl mx-auto">
        <div class="mb-8">
            <h2 class="text-2xl font-black text-slate-800">Keamanan Akun</h2>
            <p class="text-xs text-slate-400">Kelola perangkat yang sedang login ke akun Orland Anda</p>
        </div>
        
        <div id="session-list" class="space-y-4">
            </div>
    </div>`;
}

export async function initEvents() {
    const container = document.getElementById('session-list');

    window.revokeSession = async (id) => {
        if(!confirm("Keluarkan perangkat ini?")) return;
        const res = await apiPost('/api/admin/sessions_bulk_revoke', { session_id: id });
        if(res.ok) window.location.reload();
    };

    try {
        const res = await apiGet('/api/admin/sessions_monitor_get');
        if(res.ok && res.sessions.length > 0) {
            container.innerHTML = res.sessions.map(s => `
                <div class="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-4 transition-all hover:border-red-100">
                    <div class="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400">
                        <i class="fa-solid ${s.device_name.toLowerCase().includes('phone') ? 'fa-mobile-screen' : 'fa-laptop'}"></i>
                    </div>
                    <div class="flex-1">
                        <h4 class="text-sm font-black text-slate-800">${s.device_name || 'Perangkat Tidak Dikenal'}</h4>
                        <p class="text-[10px] text-slate-400 font-bold uppercase tracking-wider">${s.browser_name} • ${s.ip_address}</p>
                        <p class="text-[9px] text-blue-500 mt-1 font-bold italic">Aktif: ${new Date(s.last_active * 1000).toLocaleString('id-ID')}</p>
                    </div>
                    <button onclick="window.revokeSession('${s.id}')" class="text-red-500 w-10 h-10 hover:bg-red-50 rounded-2xl transition-all">
                        <i class="fa-solid fa-arrow-right-from-bracket"></i>
                    </button>
                </div>
            `).join('');
        }
    } catch(e) { console.error(e); }
}
