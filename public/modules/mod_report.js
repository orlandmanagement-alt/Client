import { apiGet } from "/assets/js/api.js";

export async function render() {
    return `
    <div class="p-6 max-w-2xl mx-auto space-y-6">
        <div class="flex justify-between items-center mb-4">
            <h2 class="text-2xl font-black text-slate-800">Laporan Orland</h2>
            <select id="r-month" class="bg-white border-none rounded-xl text-[10px] font-black uppercase p-2 shadow-sm">
                <option value="3">Maret 2026</option>
                <option value="2">Februari 2026</option>
            </select>
        </div>

        <div class="grid grid-cols-2 gap-4">
            <div class="bg-emerald-500 p-6 rounded-[2.5rem] text-white shadow-xl shadow-emerald-100">
                <p class="text-[9px] font-black opacity-60 uppercase mb-1">Total Masuk</p>
                <h3 id="r-in" class="text-xl font-black">Rp 0</h3>
            </div>
            <div class="bg-rose-500 p-6 rounded-[2.5rem] text-white shadow-xl shadow-rose-100">
                <p class="text-[9px] font-black opacity-60 uppercase mb-1">Total Keluar</p>
                <h3 id="r-out" class="text-xl font-black">Rp 0</h3>
            </div>
        </div>

        <div class="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm">
            <h4 class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Aktivitas Terakhir</h4>
            <div id="r-latest" class="space-y-4">
                </div>
        </div>
    </div>`;
}

export async function initEvents() {
    const loadReport = async () => {
        const m = document.getElementById('r-month').value;
        const res = await apiGet(`/api/admin/stats?m=${m}`);
        
        if(res.ok) {
            document.getElementById('r-in').textContent = `Rp ${(res.stats.total_in || 0).toLocaleString()}`;
            document.getElementById('r-out').textContent = `Rp ${(res.stats.total_out || 0).toLocaleString()}`;
            
            const container = document.getElementById('r-latest');
            container.innerHTML = res.latest.map(tx => `
                <div class="flex justify-between items-center pb-4 border-b border-slate-50 last:border-0">
                    <div>
                        <p class="text-xs font-black text-slate-800">${tx.purpose}</p>
                        <p class="text-[9px] text-slate-400 font-bold uppercase">${new Date(tx.created_at * 1000).toLocaleDateString()}</p>
                    </div>
                    <p class="text-xs font-black ${tx.type === 'credit' ? 'text-emerald-500' : 'text-rose-500'}">
                        ${tx.type === 'credit' ? '+' : '-'} ${tx.amount.toLocaleString()}
                    </p>
                </div>
            `).join('');
        }
    };

    document.getElementById('r-month').addEventListener('change', loadReport);
    loadReport();
}
