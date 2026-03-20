import { apiGet, apiPost } from "/assets/js/api.js";

export async function render() {
    return `
    <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 min-h-[80vh]">
        
        <div id="view-list" class="fade-in">
            <div class="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
                <h2 class="text-xl font-bold text-slate-800"><i class="fa-solid fa-briefcase text-blue-600 mr-2"></i> Manajemen Proyek</h2>
                <button onclick="window.ClientProjects.toggleView('create')" class="bg-blue-600 text-white px-4 py-2 rounded-lg text-[12px] font-bold shadow hover:bg-blue-700 transition-colors"><i class="fa-solid fa-plus mr-1"></i> Buat Proyek</button>
            </div>
            <div id="projects-container" class="grid grid-cols-1 md:grid-cols-2 gap-4"></div>
        </div>

        <div id="view-create" class="hidden fade-in max-w-4xl mx-auto">
            <div class="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
                <h2 class="text-xl font-bold text-slate-800"><i class="fa-solid fa-folder-plus text-blue-600 mr-2"></i> Buat Proyek Baru</h2>
                <button onclick="window.ClientProjects.toggleView('list')" class="bg-slate-100 text-slate-600 px-4 py-2 rounded-lg text-[12px] font-bold hover:bg-slate-200"><i class="fa-solid fa-arrow-left mr-1"></i> Kembali</button>
            </div>
            
            <div class="bg-slate-50 p-5 rounded-2xl border border-slate-200 mb-6">
                <h3 class="text-[13px] font-black text-slate-800 mb-3 uppercase tracking-wider">Detail Utama Proyek</h3>
                <div class="space-y-4">
                    <div>
                        <label class="block text-[11px] font-bold text-slate-500 uppercase mb-1.5">Judul Proyek <span class="text-red-500">*</span></label>
                        <input type="text" id="p_title" class="w-full border border-slate-200 rounded-lg py-2.5 px-3 outline-none text-[13px] font-bold bg-white focus:border-blue-500" placeholder="Contoh: Iklan TVC Ramadhan">
                    </div>
                    <div>
                        <label class="block text-[11px] font-bold text-slate-500 uppercase mb-1.5">Sinopsis / Deskripsi</label>
                        <textarea id="p_desc" rows="3" class="w-full border border-slate-200 rounded-lg py-2.5 px-3 outline-none text-[13px] bg-white focus:border-blue-500" placeholder="Ceritakan detail proyek ini..."></textarea>
                    </div>
                </div>
            </div>

            <div class="mb-6">
                <div class="flex justify-between items-center mb-4">
                    <div>
                        <h3 class="text-[14px] font-black text-slate-800">Kebutuhan Peran (Custom Roles)</h3>
                        <p class="text-[11px] text-slate-500">Tambahkan sebanyak mungkin karakter yang Anda butuhkan.</p>
                    </div>
                    <button onclick="window.ClientProjects.addRole()" class="bg-blue-50 text-blue-600 border border-blue-200 px-3 py-1.5 rounded-lg text-[11px] font-bold hover:bg-blue-100 shadow-sm"><i class="fa-solid fa-user-plus"></i> Tambah Peran</button>
                </div>
                
                <div id="roles-container" class="space-y-4"></div>
            </div>

            <div class="border-t border-slate-100 pt-6">
                <button onclick="window.ClientProjects.submitProject()" id="btn-submit-proj" class="w-full bg-slate-900 text-white font-black py-4 rounded-xl shadow-lg hover:bg-black transition-all text-[14px]">Publish Proyek ke Talent</button>
            </div>
        </div>

    </div>
    `;
}

export async function initEvents() {
    let rolesData = [];

    window.ClientProjects = {
        toggleView: (view) => {
            document.getElementById('view-list').classList.add('hidden');
            document.getElementById('view-create').classList.add('hidden');
            document.getElementById(`view-${view}`).classList.remove('hidden');
            if(view === 'list') window.ClientProjects.fetchList();
            if(view === 'create' && rolesData.length === 0) window.ClientProjects.addRole();
        },

        fetchList: async () => {
            const container = document.getElementById('projects-container');
            container.innerHTML = `<div class="col-span-full py-10 text-center"><i class="fa-solid fa-spinner fa-spin text-3xl text-slate-300"></i></div>`;
            try {
                const res = await apiGet('/api/client/projects');
                if(!res.ok || !res.data || res.data.length === 0) throw new Error("Empty");
                container.innerHTML = res.data.map(p => `
                    <div class="border border-slate-200 p-5 rounded-xl hover:shadow-md bg-white transition-all group cursor-pointer">
                        <div class="flex justify-between items-start mb-2">
                            <h4 class="font-bold text-slate-800 text-base">${p.title}</h4>
                            <span class="bg-green-100 text-green-700 text-[9px] font-black px-2 py-0.5 rounded uppercase">${p.status || 'Active'}</span>
                        </div>
                        <div class="flex gap-2">
                            <button class="bg-slate-100 text-slate-700 text-[10px] font-bold px-3 py-1.5 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">Buka Pipeline Pelamar</button>
                        </div>
                    </div>
                `).join('');
            } catch(e) {
                container.innerHTML = `<div class="col-span-full flex flex-col items-center py-16 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200"><i class="fa-solid fa-folder-open text-4xl text-slate-300 mb-3"></i><h3 class="text-[14px] font-bold text-slate-700">Belum Ada Proyek</h3><p class="text-[11px] text-slate-500">Mulai buat proyek pertama Anda.</p></div>`;
            }
        },

        addRole: () => {
            rolesData.push({ 
                id: Date.now(), role_name: '', gender: 'Semua', category: '', 
                location: '', age_min: '', age_max: '', height_min: '', height_max: '', description: '' 
            });
            window.ClientProjects.renderRoles();
        },
        
        removeRole: (id) => {
            rolesData = rolesData.filter(r => r.id !== id);
            window.ClientProjects.renderRoles();
        },
        
        updateRole: (id, field, val) => {
            const role = rolesData.find(r => r.id === id);
            if(role) role[field] = val;
        },
        
        renderRoles: () => {
            const container = document.getElementById('roles-container');
            if(rolesData.length === 0) {
                container.innerHTML = `<div class="text-center py-6 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 font-bold text-[12px]">Silakan tambah minimal 1 peran/kebutuhan talent.</div>`;
                return;
            }

            container.innerHTML = rolesData.map((r, idx) => `
                <div class="bg-white p-4 border border-slate-200 shadow-sm rounded-xl relative">
                    <div class="absolute top-3 right-3 flex gap-2">
                        <span class="bg-slate-100 text-slate-500 px-2 py-0.5 rounded text-[9px] font-black uppercase">PERAN #${idx+1}</span>
                        <button onclick="window.ClientProjects.removeRole(${r.id})" class="text-red-400 hover:text-red-600 bg-red-50 w-5 h-5 rounded flex items-center justify-center"><i class="fa-solid fa-trash text-[10px]"></i></button>
                    </div>
                    
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
                        <div class="md:col-span-3">
                            <label class="block text-[10px] font-bold text-slate-400 uppercase mb-1">Nama Peran / Karakter</label>
                            <input type="text" class="w-full border-b-2 border-slate-200 py-1 outline-none focus:border-blue-500 font-bold text-slate-800 text-[13px]" value="${r.role_name}" oninput="window.ClientProjects.updateRole(${r.id}, 'role_name', this.value)" placeholder="Cth: Pemeran Utama Pria">
                        </div>
                        
                        <div>
                            <label class="block text-[10px] font-bold text-slate-400 uppercase mb-1">Gender</label>
                            <select class="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-[12px] font-bold outline-none" onchange="window.ClientProjects.updateRole(${r.id}, 'gender', this.value)">
                                <option value="Semua" ${r.gender==='Semua'?'selected':''}>Bebas / Semua</option>
                                <option value="Laki-Laki" ${r.gender==='Laki-Laki'?'selected':''}>Laki-Laki</option>
                                <option value="Perempuan" ${r.gender==='Perempuan'?'selected':''}>Perempuan</option>
                            </select>
                        </div>

                        <div>
                            <label class="block text-[10px] font-bold text-slate-400 uppercase mb-1">Kategori</label>
                            <select class="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-[12px] font-bold outline-none" onchange="window.ClientProjects.updateRole(${r.id}, 'category', this.value)">
                                <option value="">Semua Profesi</option>
                                <option value="Aktor" ${r.category==='Aktor'?'selected':''}>Aktor / Aktris</option>
                                <option value="Model" ${r.category==='Model'?'selected':''}>Model</option>
                                <option value="Extras" ${r.category==='Extras'?'selected':''}>Extras / Figuran</option>
                            </select>
                        </div>

                        <div>
                            <label class="block text-[10px] font-bold text-slate-400 uppercase mb-1">Lokasi Syuting</label>
                            <input type="text" class="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-[12px] font-bold outline-none" value="${r.location}" oninput="window.ClientProjects.updateRole(${r.id}, 'location', this.value)" placeholder="Kota / Region">
                        </div>

                        <div class="md:col-span-1">
                            <label class="block text-[10px] font-bold text-slate-400 uppercase mb-1">Usia (Min-Max)</label>
                            <div class="flex gap-2">
                                <input type="number" class="w-1/2 bg-slate-50 border border-slate-200 rounded-lg p-2 text-[12px] text-center" value="${r.age_min}" oninput="window.ClientProjects.updateRole(${r.id}, 'age_min', this.value)" placeholder="Min">
                                <input type="number" class="w-1/2 bg-slate-50 border border-slate-200 rounded-lg p-2 text-[12px] text-center" value="${r.age_max}" oninput="window.ClientProjects.updateRole(${r.id}, 'age_max', this.value)" placeholder="Max">
                            </div>
                        </div>

                        <div class="md:col-span-1">
                            <label class="block text-[10px] font-bold text-slate-400 uppercase mb-1">Tinggi (Min-Max Cm)</label>
                            <div class="flex gap-2">
                                <input type="number" class="w-1/2 bg-slate-50 border border-slate-200 rounded-lg p-2 text-[12px] text-center" value="${r.height_min}" oninput="window.ClientProjects.updateRole(${r.id}, 'height_min', this.value)" placeholder="Min">
                                <input type="number" class="w-1/2 bg-slate-50 border border-slate-200 rounded-lg p-2 text-[12px] text-center" value="${r.height_max}" oninput="window.ClientProjects.updateRole(${r.id}, 'height_max', this.value)" placeholder="Max">
                            </div>
                        </div>

                        <div class="md:col-span-3">
                            <input type="text" class="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-[12px] outline-none" value="${r.description}" oninput="window.ClientProjects.updateRole(${r.id}, 'description', this.value)" placeholder="Syarat tambahan (Cth: Harus bisa menyetir mobil)">
                        </div>
                    </div>
                </div>
            `).join('');
        },

        submitProject: async () => {
            const title = document.getElementById('p_title').value;
            const desc = document.getElementById('p_desc').value;
            if(!title) return alert("Judul proyek wajib diisi!");
            if(rolesData.length === 0) return alert("Minimal harus ada 1 peran!");
            
            const btn = document.getElementById('btn-submit-proj');
            btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Menyimpan ke Server...';
            
            try {
                const res = await apiPost('/api/client/project_create', { title, description: desc, roles: rolesData });
                if(res.ok) {
                    alert("Proyek berhasil diterbitkan! Talent sekarang bisa melihatnya.");
                    document.getElementById('p_title').value = '';
                    document.getElementById('p_desc').value = '';
                    rolesData = [];
                    window.ClientProjects.toggleView('list');
                } else { alert("Gagal menyimpan: " + (res.data?.message || 'Server Error')); }
            } catch(e) { alert("Koneksi bermasalah."); }
            
            btn.innerHTML = 'Publish Proyek ke Talent';
        }
    };

    window.ClientProjects.fetchList();
}
