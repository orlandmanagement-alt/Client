import { apiGet } from "/assets/js/api.js";

export async function render() {
    return `
    <div class="p-6 max-w-3xl mx-auto space-y-6">
        <div class="mb-8">
            <h2 class="text-2xl font-black text-slate-800 tracking-tight">Audit Trail</h2>
            <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Log Aktivitas Sistem Orland</p>
        </div>

        <div id="audit-list" class="space-y-3">
            </div>
    </div>`;
}

export async function initEvents() {
    const container = document.getElementById('audit-list');
    
    try {
        const res = await apiGet('/api/admin/audit_logs_monitor_get');
        if(res.ok && res.logs) {
            container.innerHTML = res.logs.map(log => `
                <div class="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm flex items-start gap-4 transition-all hover:bg-slate-50">
                    <div class="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center text-[10px] shrink-0">
                        <i class="fa-solid fa-fingerprint"></i>
                    </div>
                    <div class="flex-1 min-w-0">
                        <div class="flex justify-between items-start mb-1">
                            <h4 class="text-xs font-black text-slate-800 uppercase tracking-wide">${log.action}</h4>
                            <span class="text-[9px] font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-lg">
                                ${new Date(log.created_at * 1000).toLocaleString('id-ID')}
                            </span>
                        </div>
                        <p class="text-[11px] text-slate-500 truncate mb-2">Oleh: ${log.user_email || 'System'}</p>
                        
                        <div class="bg-slate-50 rounded-xl p-3 flex gap-4 text-[9px] font-mono border border-slate-100">
                            <div class="flex-1"><p class="text-slate-400 mb-1">DULU</p><p class="text-rose-500 font-bold">${log.old_value || '-'}</p></div>
                            <div class="w-[1px] bg-slate-200"></div>
                            <div class="flex-1"><p class="text-slate-400 mb-1">BARU</p><p class="text-emerald-500 font-bold">${log.new_value || '-'}</p></div>
                        </div>
                    </div>
                </div>
            `).join('');
        }
    } catch(e) { console.error(e); }
}
