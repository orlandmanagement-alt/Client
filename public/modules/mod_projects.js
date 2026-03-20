import { apiGet, apiPost } from "/assets/js/api.js";

export async function render() {
    return `
    <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 min-h-[80vh]">
        
        <div id="view-list" class="fade-in">
            <div class="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
                <h2 class="text-xl font-bold text-slate-800"><i class="fa-solid fa-briefcase text-blue-600 mr-2"></i> Manajemen Proyek</h2>
                <button onclick="window.ClientProjects.toggleView('create')" class="bg-blue-600 text-white px-4 py-2 rounded-lg text-[12px] font-bold shadow hover:bg-blue-700 transition-colors"><i class="fa-solid fa-plus mr-1"></i> Buat Proyek</button>
            </div>
            <div id="projects-container" class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="col-span-full py-20 text-center"><i class="fa-solid fa-spinner fa-spin text-3xl text-slate-300"></i></div>
            </div>
        </div>

        <div id="view-create" class="hidden fade-in max-w-4xl mx-auto">
            <div class="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
                <h2 class="text-xl font-bold text-slate-800"><i class="fa-solid fa-folder-plus text-blue-600 mr-2"></i> Buat Proyek Baru</h2>
                <button onclick="window.ClientProjects.toggleView('list')" class="bg-slate-100 text-slate-600 px-4 py-2 rounded-lg text-[12px] font-bold hover:bg-slate-200"><i class="fa-solid fa-arrow-left mr-1"></i> Batal</button>
            </div>
            
            <div class="space-y-4 mb-6">
                <div>
                    <label class="block text-[11px] font-bold text-slate-500 uppercase mb-1.5">Judul Proyek <span class="text-red-500">*</span></label>
                    <input type="text" id="p_title" class="w-full border border-slate-200 rounded-lg py-2.5 px-3 outline-none text-[13px] font-bold bg-slate-50 focus:border-blue-500" placeholder="Contoh: TVC Minuman Segar">
                </div>
                <div>
                    <label class="block text-[11px] font-bold text-slate-500 uppercase mb-1.5">Sinopsis / Deskripsi</label>
                    <textarea id="p_desc" rows="3" class="w-full border border-slate-200 rounded-lg py-2.5 px-3 outline-none text-[13px] bg-slate-50 focus:border-blue-500"></textarea>
                </div>
            </div>

            <div class="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-6">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-[13px] font-bold text-slate-800">Kebutuhan Peran (Roles)</h3>
                    <button onclick="window.ClientProjects.addRole()" class="text-blue-600 text-[11px] font-bold border border-blue-200 bg-white px-2 py-1 rounded hover:bg-blue-50"><i class="fa-solid fa-user-plus"></i> Tambah Peran</button>
                </div>
                <div id="roles-container" class="space-y-3"></div>
            </div>

            <button onclick="window.ClientProjects.submitProject()" id="btn-submit-proj" class="w-full bg-slate-900 text-white font-black py-3 rounded-xl shadow-md hover:bg-black transition-all">Publish Proyek</button>
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
                if(!res.ok || !res.data || res.data.length === 0) {
                    container.innerHTML = `<div class="col-span-full flex flex-col items-center py-16 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200"><i class="fa-solid fa-folder-open text-4xl text-slate-300 mb-3"></i><h3 class="text-[14px] font-bold text-slate-700">Belum Ada Proyek</h3></div>`;
                    return;
                }
                container.innerHTML = res.data.map(p => `
                    <div class="border border-slate-200 p-5 rounded-xl hover:shadow-md bg-white transition-all">
                        <div class="flex justify-between items-start mb-2">
                            <h4 class="font-bold text-slate-800 text-base">${p.title}</h4>
                            <span class="bg-green-100 text-green-700 text-[9px] font-black px-2 py-0.5 rounded uppercase">${p.status || 'Active'}</span>
                        </div>
                        <p class="text-[12px] text-slate-500 mb-4 line-clamp-2">${p.description || 'Tidak ada deskripsi'}</p>
                        <div class="flex gap-2">
                            <button class="flex-1 bg-slate-100 text-slate-700 text-[11px] font-bold py-2 rounded-lg hover:bg-slate-200">Kelola Pelamar</button>
                        </div>
                    </div>
                `).join('');
            } catch(e) { container.innerHTML = `<div class="col-span-full text-center text-red-500 font-bold py-10">Gagal memuat data dari server.</div>`; }
        },

        addRole: () => {
            const id = Date.now();
            rolesData.push({ id, title: '', gender: 'Semua' });
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
            container.innerHTML = rolesData.map((r, i) => `
                <div class="bg-white p-3 border border-slate-200 rounded-lg flex gap-3 items-center relative">
                    <div class="flex-1 grid grid-cols-2 gap-2">
                        <input type="text" placeholder="Nama Peran (Misal: Aktor Utama)" class="border border-slate-200 rounded p-2 text-[12px] w-full" value="${r.title}" oninput="window.ClientProjects.updateRole(${r.id}, 'title', this.value)">
                        <select class="border border-slate-200 rounded p-2 text-[12px] w-full" onchange="window.ClientProjects.updateRole(${r.id}, 'gender', this.value)">
                            <option value="Semua" ${r.gender==='Semua'?'selected':''}>Semua Gender</option>
                            <option value="Pria" ${r.gender==='Pria'?'selected':''}>Pria</option>
                            <option value="Wanita" ${r.gender==='Wanita'?'selected':''}>Wanita</option>
                        </select>
                    </div>
                    <button onclick="window.ClientProjects.removeRole(${r.id})" class="text-red-400 hover:text-red-600 px-2"><i class="fa-solid fa-trash"></i></button>
                </div>
            `).join('');
        },

        submitProject: async () => {
            const title = document.getElementById('p_title').value;
            const desc = document.getElementById('p_desc').value;
            if(!title) return alert("Judul proyek wajib diisi!");
            
            document.getElementById('btn-submit-proj').innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Memproses...';
            
            try {
                // Konversi rolesData ke format yang diterima API
                const rolesToSubmit = rolesData.map(r => ({ role_name: r.title, gender: r.gender }));
                const res = await apiPost('/api/client/project_create', { title, description: desc, roles: rolesToSubmit });
                
                if(res.ok) {
                    alert("Proyek berhasil dibuat!");
                    document.getElementById('p_title').value = '';
                    document.getElementById('p_desc').value = '';
                    rolesData = [];
                    window.ClientProjects.toggleView('list');
                } else { alert("Gagal: " + (res.data?.message || 'Server error')); }
            } catch(e) { alert("Terjadi kesalahan jaringan."); }
            
            document.getElementById('btn-submit-proj').innerHTML = 'Publish Proyek';
        }
    };

    window.ClientProjects.fetchList();
}
