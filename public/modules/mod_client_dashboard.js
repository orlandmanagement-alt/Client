import { apiGet } from "/assets/js/api.js";

export async function render() {
    return `
    <div class="p-6 max-w-4xl mx-auto space-y-8">
        <div class="flex justify-between items-end">
            <div>
                <h2 class="text-3xl font-black text-slate-800 tracking-tight italic">Hello, Producer!</h2>
                <p class="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mt-1">Orland Client Executive Panel</p>
            </div>
            <div class="text-right">
                <span id="d-date" class="text-[9px] font-black text-slate-300 uppercase tracking-widest">21 MARET 2026</span>
            </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="bg-slate-900 p-8 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
                <p class="text-[10px] font-bold opacity-40 uppercase tracking-widest mb-1">Saldo Deposit</p>
                <h3 id="s-balance" class="text-2xl font-black italic">Rp 0</h3>
                <i class="fa-solid fa-wallet absolute -right-4 -bottom-4 text-6xl opacity-10 group-hover:rotate-12 transition-transform"></i>
            </div>
            
            <div class="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm relative overflow-hidden group">
                <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Proyek Aktif</p>
                <h3 id="s-projects" class="text-2xl font-black text-slate-800 italic">0</h3>
                <i class="fa-solid fa-clapperboard absolute -right-4 -bottom-4 text-6xl text-slate-50 group-hover:-rotate-12 transition-transform"></i>
            </div>

            <div class="bg-blue-600 p-8 rounded-[3rem] text-white shadow-xl shadow-blue-100 relative overflow-hidden group">
                <p class="text-[10px] font-bold opacity-60 uppercase tracking-widest mb-1">Butuh Review</p>
                <h3 id="s-applicants" class="text-2xl font-black italic">0 Talent</h3>
                <i class="fa-solid fa-user-check absolute -right-4 -bottom-4 text-6xl opacity-20 group-hover:scale-110 transition-transform"></i>
            </div>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button onclick="location.hash='#project_create'" class="p-6 bg-white border border-slate-50 rounded-[2.5rem] flex flex-col items-center gap-3 hover:bg-slate-900 hover:text-white transition-all group">
                <div class="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center group-hover:bg-white/10">
                    <i class="fa-solid fa-plus text-xs"></i>
                </div>
                <span class="text-[9px] font-black uppercase tracking-widest">Buat Casting</span>
            </button>
            <button onclick="location.hash='#search_filter'" class="p-6 bg-white border border-slate-50 rounded-[2.5rem] flex flex-col items-center gap-3 hover:bg-slate-900 hover:text-white transition-all group">
                <div class="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center group-hover:bg-white/10">
                    <i class="fa-solid fa-magnifying-glass text-xs"></i>
                </div>
                <span class="text-[9px] font-black uppercase tracking-widest">Cari Talent</span>
            </button>
        </div>
    </div>`;
}

export async function initEvents() {
    try {
        const res = await apiGet('/api/client/dashboard_stats');
        if(res.ok && res.stats) {
            document.getElementById('s-balance').textContent = `Rp ${res.stats.current_balance.toLocaleString()}`;
            document.getElementById('s-projects').textContent = res.stats.active_projects;
            document.getElementById('s-applicants').textContent = `${res.stats.pending_applicants} Talent`;
        }
    } catch(e) { console.error(e); }
}
