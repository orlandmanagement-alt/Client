import { apiGet, apiPost } from "/assets/js/api.js";

export async function render() {
    return `
    <div class="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200 min-h-[75vh]">
        <div class="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
            <h2 class="text-xl font-bold text-slate-800"><i class="fa-solid fa-building text-blue-600 mr-2"></i> Profil Perusahaan</h2>
            <button onclick="window.ClientProfile.save()" id="btn-save-prof" class="bg-blue-600 text-white px-5 py-2 rounded-lg text-[13px] font-bold shadow-sm hover:bg-blue-700 transition-colors">Simpan Perubahan</button>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div class="md:col-span-1 flex flex-col items-center text-center">
                <input type="file" id="inp_logo" accept="image/*" class="hidden" onchange="window.ClientProfile.handleUpload(event)">
                
                <div onclick="document.getElementById('inp_logo').click()" class="w-32 h-32 bg-slate-100 rounded-2xl border-4 border-white shadow-md flex items-center justify-center text-4xl text-slate-300 mb-4 overflow-hidden relative group cursor-pointer bg-cover bg-center" id="prof_avatar">
                    <i class="fa-solid fa-camera" id="prof_icon"></i>
                    <div class="absolute inset-0 bg-black/60 hidden group-hover:flex items-center justify-center text-white text-[10px] font-bold uppercase tracking-widest transition-all">Ubah Logo</div>
                </div>
                <h3 id="prof_name" class="font-bold text-slate-800 text-lg leading-tight">Memuat...</h3>
                <p id="prof_email" class="text-xs text-slate-500 mb-4 mt-1">-</p>
            </div>
            
            <div class="md:col-span-2 space-y-4">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Nama Perusahaan</label>
                        <input type="text" id="inp_company" class="w-full border border-slate-200 rounded-lg py-2.5 px-3 outline-none text-[13px] font-bold text-slate-800 bg-slate-50 focus:bg-white focus:border-blue-500">
                    </div>
                    <div>
                        <label class="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Jenis Industri</label>
                        <select id="inp_industry" class="w-full border border-slate-200 rounded-lg py-2.5 px-3 outline-none text-[13px] font-bold text-slate-800 bg-slate-50 focus:bg-white focus:border-blue-500">
                            <option value="Production House">Production House</option>
                            <option value="Advertising Agency">Advertising Agency</option>
                            <option value="Brand / Corporate">Brand / Corporate</option>
                        </select>
                    </div>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Nama Kontak (PIC)</label>
                        <input type="text" id="inp_pic" class="w-full border border-slate-200 rounded-lg py-2.5 px-3 outline-none text-[13px] font-bold text-slate-800 bg-slate-50 focus:bg-white focus:border-blue-500">
                    </div>
                    <div>
                        <label class="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">No. HP / WhatsApp</label>
                        <input type="tel" id="inp_phone" class="w-full border border-slate-200 rounded-lg py-2.5 px-3 outline-none text-[13px] font-bold text-slate-800 bg-slate-50 focus:bg-white focus:border-blue-500">
                    </div>
                </div>
                <div>
                    <label class="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Alamat Lengkap</label>
                    <textarea id="inp_address" rows="3" class="w-full border border-slate-200 rounded-lg py-2 px-3 outline-none text-[13px] font-bold text-slate-800 bg-slate-50 focus:bg-white focus:border-blue-500"></textarea>
                </div>
            </div>
        </div>
    </div>
    `;
}

export async function initEvents() {
    window.ClientProfile = {
        state: { logo_base64: null },
        
        load: async () => {
            try {
                const res = await apiGet('/api/client/profile_get'); // Endpoint profil khusus client
                if(res.ok && res.data) {
                    const d = res.data;
                    document.getElementById('prof_name').textContent = d.company_name || 'Nama Perusahaan';
                    document.getElementById('prof_email').textContent = d.email || '-';
                    document.getElementById('inp_company').value = d.company_name || '';
                    document.getElementById('inp_industry').value = d.industry_type || 'Production House';
                    document.getElementById('inp_pic').value = d.contact_name || '';
                    document.getElementById('inp_phone').value = d.contact_phone || '';
                    document.getElementById('inp_address').value = d.billing?.company_address || '';
                    
                    if(d.logo_url) {
                        document.getElementById('prof_avatar').style.backgroundImage = `url('${d.logo_url}')`;
                        document.getElementById('prof_icon').style.display = 'none';
                    }
                }
            } catch(e) {}
        },
        
        handleUpload: (e) => {
            const file = e.target.files[0];
            if(!file) return;
            const reader = new FileReader();
            reader.onload = (event) => {
                const base64 = event.target.result;
                window.ClientProfile.state.logo_base64 = base64;
                document.getElementById('prof_avatar').style.backgroundImage = `url('${base64}')`;
                document.getElementById('prof_icon').style.display = 'none';
            };
            reader.readAsDataURL(file);
        },
        
        save: async () => {
            const btn = document.getElementById('btn-save-prof');
            btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Menyimpan...';
            
            const payload = {
                company_name: document.getElementById('inp_company').value,
                industry_type: document.getElementById('inp_industry').value,
                contact_name: document.getElementById('inp_pic').value,
                contact_phone: document.getElementById('inp_phone').value,
                billing: { company_address: document.getElementById('inp_address').value },
                logo_base64: window.ClientProfile.state.logo_base64
            };
            
            try {
                const res = await apiPost('/api/client/profile_update', payload);
                if(res.ok) {
                    alert('Profil berhasil diperbarui!');
                    document.getElementById('prof_name').textContent = payload.company_name;
                } else {
                    alert('Gagal menyimpan profil: ' + (res.data?.message || 'Error'));
                }
            } catch(e) { alert('Terjadi kesalahan jaringan.'); }
            
            btn.innerHTML = 'Simpan Perubahan';
        }
    };

    window.ClientProfile.load();
}
