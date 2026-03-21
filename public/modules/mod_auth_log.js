import { apiGet } from "/assets/js/api.js";

export async function render() {
    return `
    <div class="p-6 max-w-2xl mx-auto space-y-6">
        <div class="mb-8">
            <h2 class="text-2xl font-black text-slate-800 tracking-tight">Riwayat Login</h2>
            <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Keamanan Akun Orland Management</p>
        </div>

        <div id="auth-list" class="space-y-4">
            </div>
    </div>`;
}

export async function initEvents() {
    const container = document.getElementById('auth-list');
    
    try {
        const res = await apiGet('/api/admin/auth_history_get');
        if(res.ok && res.logs) {
            container.innerHTML = res.logs.map(log => `
                <div class="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-4">
                    <div class="w-10 h-10 rounded-2xl flex items-center justify-center 
                         ${log.event_type === 'login_success' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}">
                        <i class="fa-solid ${log.event_type.includes('success') ? 'fa-shield-check' : 'fa-shield-exclamation'}"></i>
                    </div>
                    <div class="flex-1">
                        <div class="flex justify-between items-center mb-1">
                            <h4 class="text-xs font-black text-slate-800 uppercase tracking-wide">
                                ${log.event_type.replace('_', ' ')}
                            </h4>
                            <span class="text-[8px] font-black text-slate-400 uppercase tracking-widest">
                                ${new Date(log.created_at * 1000).toLocaleString('id-ID')}
                            </span>
                        </div>
                        <p class="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
                            IP: ${log.ip_address} • Lokasi: ${log.location_city}
                        </p>
                    </div>
                </div>
            `).join('');
        }
    } catch(e) { console.error(e); }
}
