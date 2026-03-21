import { apiGet, apiPost } from "/assets/js/api.js";

export async function render() {
    return `
    <div class="p-6 max-w-3xl mx-auto space-y-6">
        <div class="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100 relative overflow-hidden">
            <div class="flex flex-col md:flex-row gap-6 items-center relative z-10">
                <div class="w-24 h-24 bg-slate-900 rounded-[2rem] flex items-center justify-center text-white text-3xl font-black">
                    O
                </div>
                <div class="flex-1 text-center md:text-left">
                    <h2 id="c-display-name" class="text-2xl font-black text-slate-800">Orland Management</h2>
                    <p class="text-xs text-slate-400 font-bold uppercase tracking-widest">Verified Client Account</p>
                </div>
                <button onclick="window.saveClientProfile()" class="bg-slate-900 text-white px-8 py-3 rounded-2xl font-black text-xs shadow-xl active:scale-95 transition-all">Update</button>
            </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-4">
                <div class="bg-white p-6 rounded-[2rem] border border-slate-100">
                    <label class="text-[10px] font-black text-slate-400 uppercase mb-2 block">Nama Perusahaan / Brand</label>
                    <input type="text" id="c-name" class="w-full bg-slate-50 border-none rounded-xl p-3 text-xs font-bold outline-none ring-blue-500/10 focus:ring-4">
                </div>
                <div class="bg-white p-6 rounded-[2rem] border border-slate-100">
                    <label class="text-[10px] font-black text-slate-400 uppercase mb-2 block">Website URL</label>
                    <input type="text" id="c-web" class="w-full bg-slate-50 border-none rounded-xl p-3 text-xs font-bold">
                </div>
                <div class="bg-white p-6 rounded-[2rem] border border-slate-100">
                    <label class="text-[10px] font-black text-slate-400 uppercase mb-2 block">Nomor Telepon Kantor</label>
                    <input type="text" id="c-phone" class="w-full bg-slate-50 border-none rounded-xl p-3 text-xs font-bold">
                </div>
            </div>

            <div class="bg-white p-6 rounded-[2.5rem] border border-slate-100 flex flex-col">
                <label class="text-[10px] font-black text-slate-400 uppercase mb-2 block">Deskripsi & Alamat</label>
                <textarea id="c-desc" rows="4" class="w-full bg-slate-50 border-none rounded-2xl p-4 text-xs font-bold mb-4" placeholder="Jelaskan bisnis Anda..."></textarea>
                <textarea id="c-address" rows="3" class="w-full bg-slate-50 border-none rounded-2xl p-4 text-xs font-bold" placeholder="Alamat lengkap kantor..."></textarea>
            </div>
        </div>
    </div>`;
}

export async function initEvents() {
    const res = await apiGet('/api/client/profile_get');
    if(res.ok && res.data) {
        const d = res.data;
        document.getElementById('c-name').value = d.company_name;
        document.getElementById('c-display-name').textContent = d.company_name;
        document.getElementById('c-web').value = d.website_url;
        document.getElementById('c-phone').value = d.contact_phone;
        document.getElementById('c-desc').value = d.company_description;
        document.getElementById('c-address').value = d.office_address;
    }

    window.saveClientProfile = async () => {
        const payload = {
            name: document.getElementById('c-name').value,
            web: document.getElementById('c-web').value,
            phone: document.getElementById('c-phone').value,
            desc: document.getElementById('c-desc').value,
            address: document.getElementById('c-address').value
        };
        const update = await apiPost('/api/client/profile_update', payload);
        if(update.ok) {
            alert("Profil Orland Management Diperbarui!");
            document.getElementById('c-display-name').textContent = payload.name;
        }
    };
}
