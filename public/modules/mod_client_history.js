import { apiGet } from "/assets/js/api.js";

export async function render() {
    return `
    <div class="p-6 max-w-2xl mx-auto space-y-8">
        <div class="flex items-center justify-between">
            <div>
                <h2 class="text-2xl font-black text-slate-800 tracking-tight italic">Riwayat Bayar</h2>
                <p class="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Rekapitulasi biaya talent</p>
            </div>
            <div class="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-[1.5rem] flex items-center justify-center shadow-sm">
                <i class="fa-solid fa-file-invoice-dollar"></i>
            </div>
        </div>

        <div id="history-list" class="space-y-4">
            </div>
    </div>`;
}

export async function initEvents() {
    const container = document.getElementById('history-list');
    
    try {
        const res = await apiGet('/api/client/payment_history');
        if(res.ok && res.history.length > 0) {
            container.innerHTML = res.history.map(item => `
                <div class="bg-white p-6 rounded-[2.5rem] border border-slate-50 shadow-sm flex items-center justify-between transition-all hover:scale-[1.01]">
                    <div class="space-y-1">
                        <p class="text-[8px] font-black text-blue-500 uppercase tracking-widest">${item.project_name || 'Project Umum'}</p>
                        <h4 class="text-sm font-black text-slate-800">${item.purpose}</h4>
                        <p class="text-[9px] text-slate-300 font-bold uppercase">
                            ${new Date(item.created_at * 1000).toLocaleDateString('id-ID', {day:'numeric', month:'short', year:'numeric'})}
                        </p>
                    </div>
                    
                    <div class="text-right">
                        <div class="text-sm font-black text-slate-800">- Rp ${item.amount.toLocaleString()}</div>
                        <span class="px-3 py-1 rounded-full text-[7px] font-black uppercase tracking-widest 
                            ${item.status === 'pending' ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'}">
                            ${item.status}
                        </span>
                    </div>
                </div>
            `).join('');
        } else {
            container.innerHTML = '<div class="text-center py-20 text-slate-200 font-black italic">Belum ada transaksi...</div>';
        }
    } catch(e) { console.error(e); }
}
