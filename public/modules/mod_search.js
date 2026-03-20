import { apiGet } from "/assets/js/api.js";

export async function render() {
    return `
    <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 min-h-[80vh] flex flex-col">
        <h2 class="text-xl font-bold text-slate-800 mb-6 border-b border-slate-100 pb-4"><i class="fa-solid fa-users-viewfinder text-blue-600 mr-2"></i> Cari Talent</h2>
        <div id="search-results" class="flex-1 flex flex-col items-center justify-center">
            <i class="fa-solid fa-spinner fa-spin text-3xl text-slate-300 mb-4"></i>
        </div>
    </div>
    `;
}
export async function initEvents() {
    const container = document.getElementById('search-results');
    try {
        const res = await apiGet('/functions/api/client/talent_search');
        if(!res.ok || !res.data || res.data.length === 0) throw new Error("Kosong");
        // Logika render card talent ada di sini jika data ada
    } catch(e) {
        container.innerHTML = `
            <div class="bg-slate-50 w-full py-20 flex flex-col items-center rounded-xl border-2 border-dashed border-slate-200">
                <i class="fa-solid fa-users-slash text-4xl text-slate-300 mb-3"></i>
                <h3 class="text-[14px] font-bold text-slate-700">Database Talent Kosong</h3>
                <p class="text-[12px] text-slate-500 mt-1">Belum ada talent yang memenuhi kriteria pencarian.</p>
            </div>
        `;
    }
}
