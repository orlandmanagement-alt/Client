import { apiGet } from "/assets/js/api.js";

export async function render() {
    return `
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div class="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
        <div class="w-12 h-12 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center text-xl"><i class="fa-solid fa-briefcase"></i></div>
        <div><p class="text-[11px] text-slate-500 font-bold uppercase tracking-wider mb-0.5">Proyek Aktif</p><h4 class="text-xl font-black text-slate-800" id="stat-proj">0</h4></div>
      </div>
      <div class="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
        <div class="w-12 h-12 rounded-full bg-purple-50 text-purple-500 flex items-center justify-center text-xl"><i class="fa-solid fa-users-viewfinder"></i></div>
        <div><p class="text-[11px] text-slate-500 font-bold uppercase tracking-wider mb-0.5">Total Pelamar</p><h4 class="text-xl font-black text-slate-800" id="stat-app">0</h4></div>
      </div>
      <div class="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
        <div class="w-12 h-12 rounded-full bg-green-50 text-green-500 flex items-center justify-center text-xl"><i class="fa-solid fa-user-check"></i></div>
        <div><p class="text-[11px] text-slate-500 font-bold uppercase tracking-wider mb-0.5">Dipekerjakan</p><h4 class="text-xl font-black text-slate-800" id="stat-hired">0</h4></div>
      </div>
      <div class="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
        <div class="w-12 h-12 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center text-xl"><i class="fa-solid fa-coins"></i></div>
        <div><p class="text-[11px] text-slate-500 font-bold uppercase tracking-wider mb-0.5">Pengeluaran Poin</p><h4 class="text-xl font-black text-slate-800" id="stat-spent">0</h4></div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <h3 class="text-[14px] font-bold mb-4 text-slate-800 border-b border-slate-100 pb-2">Lamaran Terbaru</h3>
        <div class="flex flex-col items-center justify-center text-slate-400 py-8 bg-slate-50 rounded-xl">
            <i class="fa-solid fa-inbox text-4xl mb-3 text-slate-300"></i>
            <p class="text-[12px] font-medium text-slate-500">Belum ada pelamar baru hari ini.</p>
        </div>
      </div>
      <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <h3 class="text-[14px] font-bold mb-4 text-slate-800 border-b border-slate-100 pb-2">Rekomendasi Talent</h3>
        <div class="flex flex-col items-center justify-center text-slate-400 py-8 bg-slate-50 rounded-xl">
            <i class="fa-solid fa-star text-4xl mb-3 text-slate-300"></i>
            <p class="text-[12px] font-medium text-slate-500">Sistem AI sedang mencocokkan talent.</p>
        </div>
      </div>
    </div>
    `;
}
export async function initEvents() {
    try {
        const res = await apiGet('/functions/api/client/dashboard_stats');
        if(res.ok && res.data) {
            document.getElementById('stat-proj').textContent = res.data.active_projects || 0;
            document.getElementById('stat-app').textContent = res.data.total_applicants || 0;
            document.getElementById('stat-hired').textContent = res.data.hired_talents || 0;
            document.getElementById('stat-spent').textContent = res.data.total_spent || 0;
        }
    } catch(e) {}
}
