import { apiGet } from "/assets/js/api.js";

export async function render() {
    return `
    <div class="p-6 space-y-6">
        <div class="flex items-center justify-between">
            <h1 class="text-2xl font-black text-slate-800">Halo, Widya!</h1>
            <p class="text-[10px] font-bold text-slate-400 bg-white px-4 py-2 rounded-full border border-slate-100 shadow-sm uppercase tracking-widest">
                ${new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' })}
            </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="bg-blue-600 p-6 rounded-[2.5rem] text-white shadow-xl shadow-blue-200">
                <p class="text-[10px] font-black opacity-60 uppercase mb-1">Proyek Aktif</p>
                <h2 id="s-projects" class="text-3xl font-black">0</h2>
                <i class="fa-solid fa-clapperboard mt-4 opacity-20 text-2xl"></i>
            </div>
            <div class="bg-purple-600 p-6 rounded-[2.5rem] text-white shadow-xl shadow-purple-200">
                <p class="text-[10px] font-black opacity-60 uppercase mb-1">Pelamar Baru</p>
                <h2 id="s-applicants" class="text-3xl font-black">0</h2>
                <i class="fa-solid fa-users-viewfinder mt-4 opacity-20 text-2xl"></i>
            </div>
            <div class="bg-slate-900 p-6 rounded-[2.5rem] text-white shadow-xl">
                <p class="text-[10px] font-black opacity-40 uppercase mb-1">Saldo Orland</p>
                <h2 id="s-balance" class="text-3xl font-black">Rp 0</h2>
                <i class="fa-solid fa-wallet mt-4 opacity-20 text-2xl"></i>
            </div>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button onclick="location.hash='#projects'" class="bg-white p-4 rounded-3xl border border-slate-100 flex flex-col items-center gap-2 hover:bg-slate-50 transition-all">
                <div class="w-10 h-10 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-sm"><i class="fa-solid fa-plus"></i></div>
                <span class="text-[10px] font-black text-slate-800 uppercase">Buat Proyek</span>
            </button>
            <button onclick="location.hash='#search'" class="bg-white p-4 rounded-3xl border border-slate-100 flex flex-col items-center gap-2 hover:bg-slate-50 transition-all">
                <div class="w-10 h-10 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center text-sm"><i class="fa-solid fa-magnifying-glass"></i></div>
                <span class="text-[10px] font-black text-slate-800 uppercase">Cari Talent</span>
            </button>
            <button onclick="location.hash='#notifications'" class="bg-white p-4 rounded-3xl border border-slate-100 flex flex-col items-center gap-2 hover:bg-slate-50 transition-all">
                <div class="w-10 h-10 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center text-sm"><i class="fa-solid fa-bell"></i></div>
                <span class="text-[10px] font-black text-slate-800 uppercase">Notifikasi</span>
            </button>
            <button onclick="location.hash='#wallet'" class="bg-white p-4 rounded-3xl border border-slate-100 flex flex-col items-center gap-2 hover:bg-slate-50 transition-all">
                <div class="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center text-sm"><i class="fa-solid fa-receipt"></i></div>
                <span class="text-[10px] font-black text-slate-800 uppercase">Transaksi</span>
            </button>
        </div>
    </div>`;
}

export async function initEvents() {
    try {
        const res = await apiGet('/api/dashboard/summary');
        if(res.ok && res.stats) {
            document.getElementById('s-projects').textContent = res.stats.active_projects;
            document.getElementById('s-applicants').textContent = res.stats.new_applicants;
            document.getElementById('s-balance').textContent = `Rp ${res.stats.balance.toLocaleString()}`;
        }
    } catch(e) { console.error(e); }
}
