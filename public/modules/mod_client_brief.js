import { apiPost, apiGet } from "/assets/js/api.js";

export async function render(params) {
    return `
    <div class="p-6 max-w-lg mx-auto space-y-8">
        <div class="text-center">
            <h2 class="text-2xl font-black text-slate-800 tracking-tight">Brief Produksi</h2>
            <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 italic">Instruksi kerja untuk Talent</p>
        </div>

        <div class="bg-white p-8 rounded-[3rem] border border-slate-50 shadow-xl space-y-6">
            <div>
                <label class="text-[9px] font-black text-slate-400 uppercase px-2 tracking-widest">Catatan Wardrobe</label>
                <textarea id="b-wardrobe" placeholder="Contoh: Casual, warna cerah, hindari garis-garis..." 
                          class="w-full bg-slate-50 border-none rounded-2xl p-4 text-xs font-bold mt-2 outline-none focus:ring-4 ring-blue-500/10"></textarea>
            </div>

            <div>
                <label class="text-[9px] font-black text-slate-400 uppercase px-2 tracking-widest">Link Skrip / Call Sheet (URL)</label>
                <input type="text" id="b-script" placeholder="https://drive.google.com/..." 
                       class="w-full bg-slate-50 border-none rounded-2xl p-4 text-xs font-bold mt-2 outline-none focus:ring-4 ring-blue-500/10">
            </div>

            <button onclick="window.saveBrief('${params.projectId}')" 
                    class="w-full bg-slate-900 text-white py-5 rounded-[2.5rem] font-black text-[10px] uppercase shadow-xl hover:scale-[1.02] active:scale-95 transition-all">
                Simpan & Bagikan Brief
            </button>
        </div>
    </div>`;
}

export async function initEvents(params) {
    // Load existing brief
    const res = await apiGet(`/api/get_brief?project_id=${params.projectId}`);
    if(res.ok && res.brief) {
        document.getElementById('b-wardrobe').value = res.brief.wardrobe_notes || '';
        document.getElementById('b-script').value = res.brief.script_url || '';
    }

    window.saveBrief = async (pId) => {
        const payload = {
            project_id: pId,
            wardrobe: document.getElementById('b-wardrobe').value,
            script: document.getElementById('b-script').value
        };
        const postRes = await apiPost('/api/client/brief_update', payload);
        if(postRes.ok) alert(postRes.message);
    };
}
