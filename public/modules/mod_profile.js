import { apiGet, apiPost } from "/assets/js/api.js";

export async function render() {
    return `
    <div class="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200 min-h-[75vh]">
        <div class="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
            <h2 class="text-xl font-bold text-slate-800"><i class="fa-solid fa-building text-blue-600 mr-2"></i> Profil Perusahaan</h2>
            <button class="bg-blue-600 text-white px-4 py-2 rounded-lg text-[12px] font-bold shadow-sm hover:bg-blue-700">Simpan Perubahan</button>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div class="md:col-span-1 flex flex-col items-center text-center">
                <div class="w-32 h-32 bg-slate-100 rounded-2xl border-4 border-white shadow-md flex items-center justify-center text-4xl text-slate-300 mb-4 overflow-hidden relative group cursor-pointer">
                    <i class="fa-solid fa-camera"></i>
                    <div class="absolute inset-0 bg-black/50 hidden group-hover:flex items-center justify-center text-white text-[10px] font-bold uppercase tracking-widest">Ubah Logo</div>
                </div>
                <h3 id="prof_name" class="font-bold text-slate-800 text-lg">Memuat...</h3>
                <p id="prof_email" class="text-xs text-slate-500 mb-4">-</p>
                <span class="px-3 py-1 bg-yellow-50 text-yellow-600 border border-yellow-200 text-[10px] font-bold uppercase rounded-md">Unverified Client</span>
            </div>
            
            <div class="md:col-span-2 space-y-4">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Nama Perusahaan / Agensi</label>
                        <input type="text" id="inp_company" class="w-full border border-slate-200 rounded-lg py-2 px-3 outline-none text-[13px] bg-slate-50 focus:bg-white focus:border-blue-500">
                    </div>
                    <div>
                        <label class="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Jenis Industri</label>
                        <select class="w-full border border-slate-200 rounded-lg py-2 px-3 outline-none text-[13px] bg-slate-50 focus:bg-white focus:border-blue-500">
                            <option>Production House</option><option>Advertising Agency</option><option>Brand / Corporate</option>
                        </select>
                    </div>
                </div>
                <div>
                    <label class="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Nama Kontak (PIC)</label>
                    <input type="text" id="inp_pic" class="w-full border border-slate-200 rounded-lg py-2 px-3 outline-none text-[13px] bg-slate-50 focus:bg-white focus:border-blue-500">
                </div>
                <div>
                    <label class="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Alamat Penagihan & NPWP</label>
                    <textarea rows="3" class="w-full border border-slate-200 rounded-lg py-2 px-3 outline-none text-[13px] bg-slate-50 focus:bg-white focus:border-blue-500"></textarea>
                </div>
            </div>
        </div>
    </div>
    `;
}

export async function initEvents() {
    try {
        const res = await apiGet('/functions/api/auth/me');
        if(res.ok && res.data && res.data.user) {
            document.getElementById('prof_name').textContent = res.data.user.full_name;
            document.getElementById('prof_email').textContent = res.data.user.email;
            document.getElementById('inp_company').value = res.data.user.full_name;
        }
    } catch(e) {}
}
