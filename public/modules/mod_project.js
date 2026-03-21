import { apiGet, apiPost } from "/assets/js/api.js";

export async function render() {
    return `
    <div class="space-y-6">
        <div class="flex items-center justify-between bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <div>
                <h2 class="text-xl font-bold text-slate-800">Manajemen Proyek</h2>
                <p class="text-xs text-slate-500">Kelola penawaran dan pencarian talent Anda</p>
            </div>
            <button onclick="window.ProjectClient.openModal()" class="bg-[#7c3aed] text-white px-5 py-2.5 rounded-xl text-[13px] font-black shadow-lg hover:bg-purple-700 transition-all">
                <i class="fa-solid fa-plus mr-1"></i> Buat Proyek Baru
            </button>
        </div>

        <div id="project-list" class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="col-span-full py-20 text-center text-slate-400">
                <i class="fa-solid fa-spinner fa-spin text-3xl mb-3"></i>
                <p class="text-sm">Memuat proyek...</p>
            </div>
        </div>
    </div>

    <div id="modal-project" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[9999] hidden flex items-center justify-center p-4">
        <div class="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl transform transition-all">
            <div class="p-6 border-b border-slate-100 flex justify-between items-center">
                <h3 class="font-bold text-slate-800">Buat Proyek Baru</h3>
                <button onclick="window.ProjectClient.closeModal()" class="text-slate-400 hover:text-slate-600"><i class="fa-solid fa-xmark"></i></button>
            </div>
            <div class="p-6 space-y-4">
                <div>
                    <label class="block text-[11px] font-bold text-slate-500 uppercase mb-1.5">Judul Proyek / Iklan</label>
                    <input type="text" id="new_proj_title" placeholder="Contoh: Iklan Kopi Viral 2026" class="w-full border border-slate-200 rounded-xl py-3 px-4 outline-none text-[14px] focus:border-purple-500">
                </div>
                <button onclick="window.ProjectClient.create()" id="btn-confirm-project" class="w-full bg-[#7c3aed] text-white py-3.5 rounded-xl font-black shadow-lg hover:bg-purple-700 transition-all">Publish Proyek</button>
            </div>
        </div>
    </div>
    `;
}

export async function initEvents() {
    window.ProjectClient = {
        load: async () => {
            const listEl = document.getElementById('project-list');
            try {
                const res = await apiGet('/api/client/project');
                if(res.ok && res.projects.length > 0) {
                    listEl.innerHTML = res.projects.map(p => `
                        <div class="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:border-purple-200 transition-all group">
                            <div class="flex justify-between items-start mb-3">
                                <span class="text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md ${p.status === 'draft' ? 'bg-amber-100 text-amber-600' : 'bg-green-100 text-green-600'}">${p.status}</span>
                                <button class="text-slate-300 group-hover:text-slate-600"><i class="fa-solid fa-ellipsis-vertical"></i></button>
                            </div>
                            <h4 class="font-bold text-slate-800 mb-1">${p.title}</h4>
                            <p class="text-[11px] text-slate-400"><i class="fa-regular fa-calendar mr-1"></i> Dibuat: ${new Date(p.created_at * 1000).toLocaleDateString()}</p>
                            <div class="mt-4 pt-4 border-t border-slate-50 flex gap-2">
                                <button class="flex-1 py-2 text-[11px] font-bold bg-slate-50 text-slate-600 rounded-lg hover:bg-slate-100">Detail</button>
                                <button class="flex-1 py-2 text-[11px] font-bold bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100">Cari Talent</button>
                            </div>
                        </div>
                    `).join('');
                } else {
                    listEl.innerHTML = `<div class="col-span-full py-20 text-center bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                        <p class="text-slate-400 text-sm">Belum ada proyek aktif.</p>
                    </div>`;
                }
            } catch(e) {
                listEl.innerHTML = `<div class="col-span-full text-center text-red-500 text-sm">Gagal memuat data.</div>`;
            }
        },

        openModal: () => document.getElementById('modal-project').classList.remove('hidden'),
        closeModal: () => document.getElementById('modal-project').classList.add('hidden'),

        create: async () => {
            const title = document.getElementById('new_proj_title').value;
            if(!title) return alert("Isi judul proyek!");

            const btn = document.getElementById('btn-confirm-project');
            btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Memproses...';
            btn.disabled = true;

            try {
                const res = await apiPost('/api/client/project', { title });
                if(res.ok) {
                    window.ProjectClient.closeModal();
                    window.ProjectClient.load();
                }
            } catch(e) { alert("Gagal membuat proyek."); }
            
            btn.innerHTML = 'Publish Proyek';
            btn.disabled = false;
        }
    };
    window.ProjectClient.load();
}
