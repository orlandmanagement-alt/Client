import { apiGet } from "/assets/js/api.js";

export async function render() {
    return `
    <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 min-h-[80vh]">
        <div class="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
            <h2 class="text-xl font-bold text-slate-800"><i class="fa-solid fa-briefcase text-blue-600 mr-2"></i> Manajemen Proyek</h2>
            <button class="bg-blue-600 text-white px-4 py-2 rounded-lg text-[12px] font-bold shadow"><i class="fa-solid fa-plus"></i> Buat Proyek</button>
        </div>
        <div id="projects-container"></div>
    </div>
    `;
}
export async function initEvents() {
    const container = document.getElementById('projects-container');
    try {
        const res = await apiGet('/functions/api/client/projects');
        if(!res.ok || !res.data || res.data.length === 0) throw new Error("Kosong");
    } catch(e) {
        container.innerHTML = `
            <div class="flex flex-col items-center py-20 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
                <i class="fa-solid fa-folder-open text-4xl text-slate-300 mb-3"></i>
                <h3 class="text-[14px] font-bold text-slate-700">Belum Ada Proyek</h3>
                <p class="text-[12px] text-slate-500 mt-1">Buat proyek pertama Anda untuk mulai merekrut talent.</p>
            </div>
        `;
    }
}
