import { apiGet } from "/assets/js/api.js";

export async function render() {
    return `
    <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 min-h-[80vh]">
        <h2 class="text-xl font-bold text-slate-800 mb-6 border-b border-slate-100 pb-4"><i class="fa-solid fa-clapperboard text-red-500 mr-2"></i> Live Casting Grid</h2>
        
        <div class="flex gap-2 mb-6">
            <select id="grid-project-select" onchange="window.CastingGrid.loadExtras()" class="bg-slate-50 border border-slate-200 text-slate-800 text-[13px] font-bold rounded-lg px-4 py-2 outline-none flex-1">
                <option value="">-- Pilih Proyek --</option>
            </select>
            <button onclick="window.CastingGrid.loadExtras()" class="bg-blue-600 text-white px-4 py-2 rounded-lg text-[13px] font-bold"><i class="fa-solid fa-rotate-right"></i></button>
        </div>

        <div id="grid-container">
            <div class="flex flex-col items-center py-20 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
                <i class="fa-solid fa-film text-4xl text-slate-300 mb-3"></i>
                <h3 class="text-[14px] font-bold text-slate-700">Papan Casting Kosong</h3>
                <p class="text-[12px] text-slate-500">Pilih proyek di atas untuk melihat status extras/talent.</p>
            </div>
        </div>
    </div>
    `;
}

export async function initEvents() {
    window.CastingGrid = {
        init: async () => {
            try {
                // Ambil daftar proyek untuk dropdown
                const res = await apiGet('/api/client/projects');
                if(res.ok && res.data && res.data.length > 0) {
                    document.getElementById('grid-project-select').innerHTML = '<option value="">-- Pilih Proyek --</option>' + res.data.map(p => `<option value="${p.id}">${p.title}</option>`).join('');
                }
            } catch(e) {}
        },
        
        loadExtras: async () => {
            const pId = document.getElementById('grid-project-select').value;
            const container = document.getElementById('grid-container');
            
            if(!pId) {
                container.innerHTML = `<div class="flex flex-col items-center py-20 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200"><i class="fa-solid fa-film text-4xl text-slate-300 mb-3"></i><h3 class="text-[14px] font-bold text-slate-700">Pilih Proyek</h3></div>`;
                return;
            }

            container.innerHTML = `<div class="py-20 text-center"><i class="fa-solid fa-spinner fa-spin text-3xl text-slate-300"></i></div>`;
            
            try {
                // Panggil API khusus extras board
                const res = await apiGet(`/api/client/extras_board?project_id=${pId}`);
                if(!res.ok || !res.data || res.data.length === 0) throw new Error("Kosong");
                
                // Render Kanban Grid (Sederhana)
                container.innerHTML = `<div class="grid grid-cols-2 md:grid-cols-4 gap-3">` + res.data.map(e => `
                    <div class="border ${e.status === 'LOCK' ? 'border-red-400 bg-red-50' : 'border-green-400 bg-green-50'} rounded-lg p-3 text-center">
                        <div class="w-16 h-16 mx-auto bg-slate-200 rounded-full mb-2 bg-cover bg-center" style="background-image: url('${e.photo_url||''}')"></div>
                        <h4 class="text-[12px] font-bold text-slate-800 line-clamp-1">${e.name}</h4>
                        <span class="text-[9px] font-black px-2 py-0.5 rounded ${e.status === 'LOCK' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'} uppercase">${e.status}</span>
                    </div>
                `).join('') + `</div>`;

            } catch(err) {
                container.innerHTML = `<div class="flex flex-col items-center py-10 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200"><p class="text-[12px] font-bold text-slate-500">Belum ada extras di proyek ini.</p></div>`;
            }
        }
    };
    
    window.CastingGrid.init();
}
