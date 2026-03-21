import { apiGet } from "/assets/js/api.js";

export async function render() {
    return `
    <div class="p-6">
        <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-black text-slate-800">Proyek Saya</h2>
            <button onclick="location.hash='#project/new'" class="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold shadow-lg">+ Proyek Baru</button>
        </div>
        <div id="list-container" class="grid grid-cols-1 md:grid-cols-3 gap-6">
            </div>
    </div>`;
}

export async function initEvents() {
    const container = document.getElementById('list-container');
    const res = await apiGet('/api/client/project');
    
    if(res.ok && res.projects) {
        container.innerHTML = res.projects.map(p => `
            <div class="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all">
                <div class="flex justify-between mb-4">
                    <span class="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black rounded-full uppercase">${p.status}</span>
                    <i class="fa-solid fa-ellipsis text-slate-300"></i>
                </div>
                <h3 class="font-bold text-slate-800 text-lg mb-1">${p.title}</h3>
                <p class="text-slate-400 text-xs line-clamp-2 mb-4">${p.description || 'Tidak ada deskripsi'}</p>
                <button onclick="location.hash='#project/detail/${p.id}'" class="w-full py-2 bg-slate-900 text-white rounded-xl text-xs font-bold">Kelola Talent</button>
            </div>
        `).join('');
    }
}
