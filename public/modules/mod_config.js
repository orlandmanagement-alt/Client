import { apiGet, apiPost } from "/assets/js/api.js";

export async function render() {
    return `
    <div class="p-6 max-w-2xl mx-auto space-y-6">
        <div class="mb-8">
            <h2 class="text-2xl font-black text-slate-800">Pengaturan Sistem</h2>
            <p class="text-xs text-slate-400 font-bold uppercase tracking-widest">Optimasi SEO & Bisnis Orland</p>
        </div>

        <div id="config-container" class="space-y-4">
            </div>

        <div class="pt-6">
            <button onclick="window.saveAllConfigs()" class="w-full bg-slate-900 text-white py-4 rounded-[2rem] font-black text-xs uppercase shadow-xl active:scale-95 transition-all">
                Simpan Semua Perubahan
            </button>
        </div>
    </div>`;
}

export async function initEvents() {
    const container = document.getElementById('config-container');
    
    window.saveAllConfigs = async () => {
        const inputs = container.querySelectorAll('input');
        for (let input of inputs) {
            await apiPost('/api/admin/config_action', { 
                key: input.id.replace('c-', ''), 
                value: input.value 
            });
        }
        alert("Semua konfigurasi berhasil disimpan!");
    };

    const res = await apiGet('/api/admin/config_action');
    if(res.ok && res.configs) {
        container.innerHTML = res.configs.map(c => `
            <div class="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
                <label class="text-[10px] font-black text-slate-400 uppercase mb-2 block">${c.config_key.replace(/_/g, ' ')}</label>
                <input type="text" id="c-${c.config_key}" value="${c.config_value}" 
                       class="w-full bg-slate-50 border-none rounded-xl p-3 text-xs font-bold outline-none ring-blue-500/10 focus:ring-4 transition-all">
            </div>
        `).join('');
    }
}
