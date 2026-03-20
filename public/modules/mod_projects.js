
    <div id="review-modal" class="fixed inset-0 z-[99999] hidden flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" onclick="document.getElementById('review-modal').classList.add('hidden')"></div>
        <div class="bg-white rounded-3xl w-[95%] max-w-sm p-6 flex flex-col relative z-10 shadow-2xl text-center">
            <div class="w-16 h-16 bg-yellow-100 text-yellow-500 rounded-full flex items-center justify-center text-3xl mx-auto mb-4"><i class="fa-solid fa-star"></i></div>
            <h3 class="text-xl font-black text-gray-800 mb-1">Nilai Kinerja Talent</h3>
            <p class="text-xs text-gray-500 mb-6">Ulasan Anda akan mempengaruhi Skor Kredibilitas <span id="rev_talent_name" class="font-bold text-gray-800">Talent</span>.</p>
            
            <div class="flex justify-center gap-2 mb-6" id="star-rating-container">
                <button class="star-btn text-3xl text-gray-200 hover:text-yellow-400 transition-colors" data-val="1"><i class="fa-solid fa-star"></i></button>
                <button class="star-btn text-3xl text-gray-200 hover:text-yellow-400 transition-colors" data-val="2"><i class="fa-solid fa-star"></i></button>
                <button class="star-btn text-3xl text-gray-200 hover:text-yellow-400 transition-colors" data-val="3"><i class="fa-solid fa-star"></i></button>
                <button class="star-btn text-3xl text-gray-200 hover:text-yellow-400 transition-colors" data-val="4"><i class="fa-solid fa-star"></i></button>
                <button class="star-btn text-3xl text-gray-200 hover:text-yellow-400 transition-colors" data-val="5"><i class="fa-solid fa-star"></i></button>
            </div>
            
            <input type="hidden" id="rev_val" value="0">
            <input type="hidden" id="rev_talent_id">
            <input type="hidden" id="rev_project_id">
            
            <textarea id="rev_comment" rows="3" class="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs outline-none focus:border-yellow-400 mb-4" placeholder="Berikan komentar singkat (Punctual, Akting bagus, dll)..."></textarea>
            
            <div class="flex gap-2">
                <button onclick="document.getElementById('review-modal').classList.add('hidden')" class="flex-1 bg-gray-100 text-gray-600 font-bold py-3 rounded-xl hover:bg-gray-200">Batal</button>
                <button onclick="window.ClientProjects.submitReview()" class="flex-1 bg-gray-900 text-white font-black py-3 rounded-xl hover:bg-black shadow-lg">Kirim Ulasan</button>
            </div>
        </div>
    </div>

        
        <div id="view-pipeline" class="hidden fade-in">
            <div class="bg-gray-50 p-4 md:p-6 rounded-2xl border border-gray-200 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Pipeline Pelamar</p>
                    <h3 id="pipe-title" class="font-black text-gray-800 text-lg md:text-xl leading-tight">Judul Proyek</h3>
                </div>
                
                <div class="flex gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0 items-center">
                    <select id="pipe-role-filter" onchange="window.ClientProjects.renderPipeline('all')" class="bg-gray-50 border border-gray-200 text-gray-700 text-xs font-bold rounded-lg px-3 py-2 outline-none cursor-pointer">
                        <option value="all">Semua Peran</option>
                    </select>
                    <div class="w-px h-6 bg-gray-200 mx-1"></div>
                    <button class="pipe-filter active whitespace-nowrap px-4 py-2 bg-gray-900 text-white rounded-lg text-xs font-bold shadow" data-status="all">Semua</button>
                    <button class="pipe-filter whitespace-nowrap px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-lg text-xs font-bold hover:bg-gray-50" data-status="applied">Menunggu</button>
                    <button class="pipe-filter whitespace-nowrap px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-lg text-xs font-bold hover:bg-gray-50" data-status="approved">Diterima</button>
                </div>

            </div>

            <div id="pipeline-container" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                </div>
        </div>

        import { apiGet, apiPost } from "/assets/js/api.js";
import { notify } from "/assets/js/notify.js";

export async function render() {
  return `
    <div class="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 min-h-[80vh]">
        <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-bold text-gray-800"><i class="fa-solid fa-briefcase text-gray-900 mr-2"></i> Manajemen Proyek</h2>
            <button onclick="window.ClientProjects.toggleView('create')" id="btn-create-view" class="bg-gray-900 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-md hover:bg-black transition-colors"><i class="fa-solid fa-plus mr-1"></i> Buat Proyek</button>
        </div>

        <div id="view-list" class="fade-in">
            <div id="projects-container" class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="col-span-full py-10 text-center"><i class="fa-solid fa-spinner fa-spin text-gray-400 text-3xl"></i></div>
            </div>
        </div>

        <div id="view-create" class="hidden fade-in max-w-4xl mx-auto">
            <div class="bg-gray-50 p-6 rounded-2xl border border-gray-200 mb-6">
                <h3 class="font-black text-gray-800 mb-4 text-lg border-b border-gray-200 pb-2">1. Detail Utama Proyek</h3>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div class="sm:col-span-2">
                        <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Judul Proyek / Event <span class="text-red-500">*</span></label>
                        <input type="text" id="p_title" class="w-full border border-gray-300 rounded-xl p-3 focus:border-gray-800 outline-none text-sm bg-white" placeholder="Cth: Iklan TVC Minuman Ringan">
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Lokasi Utama Syuting</label>
                        <input type="text" id="p_loc" class="w-full border border-gray-300 rounded-xl p-3 focus:border-gray-800 outline-none text-sm bg-white" placeholder="Cth: Jakarta Selatan">
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Tanggal Pelaksanaan</label>
                        <input type="text" id="p_date" class="w-full border border-gray-300 rounded-xl p-3 focus:border-gray-800 outline-none text-sm bg-white" placeholder="Cth: 12-15 Agustus 2026">
                    </div>
                    <div class="sm:col-span-2">
                        <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Sinopsis / Deskripsi Proyek <span class="text-red-500">*</span></label>
                        <textarea id="p_desc" rows="3" class="w-full border border-gray-300 rounded-xl p-3 focus:border-gray-800 outline-none text-sm bg-white resize-y" placeholder="Ceritakan singkat tentang proyek ini..."></textarea>
                    </div>
                </div>
            </div>

            <div class="mb-6">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="font-black text-gray-800 text-lg">2. Kebutuhan Talent (Roles)</h3>
                    <button type="button" onclick="window.ClientProjects.addRole()" class="bg-blue-50 text-blue-600 border border-blue-200 px-4 py-2 rounded-lg text-xs font-bold hover:bg-blue-100 transition-colors"><i class="fa-solid fa-user-plus mr-1"></i> Tambah Karakter</button>
                </div>
                <p class="text-xs text-gray-500 mb-4">Buat spesifikasi karakter agar mesin Job Match kami mencarikan kandidat yang tepat.</p>
                
                <div id="roles-container" class="space-y-4">
                    </div>
            </div>

            <div class="flex justify-end gap-3 pt-6 border-t border-gray-100">
                <button onclick="window.ClientProjects.toggleView('list')" class="bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-bold hover:bg-gray-200">Batal</button>
                <button onclick="window.ClientProjects.submitProject()" class="bg-gray-900 text-white px-8 py-3 rounded-xl font-black shadow-lg hover:bg-black text-lg"><i class="fa-solid fa-paper-plane mr-2"></i> Publish Proyek</button>
            </div>
        </div>
    </div>
  `;
}

export async function initEvents() {
    let masterProfessions = [];
    let rolesArray = []; // Array untuk menampung data role

    // Ambil Master Data Profesi untuk dropdown Role
    apiGet("/functions/api/public/master_data").then(res => {
        if (res.ok && res.data && res.data.profession) {
            masterProfessions = res.data.profession;
            // Jika container role kosong, otomatis tambahkan 1 role default
            if(rolesArray.length === 0) window.ClientProjects.addRole();
        }
    });

    
    
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('.star-btn');
        if(btn) {
            const val = parseInt(btn.getAttribute('data-val'));
            document.getElementById('rev_val').value = val;
            document.querySelectorAll('.star-btn').forEach(b => {
                if(parseInt(b.getAttribute('data-val')) <= val) {
                    b.classList.replace('text-gray-200', 'text-yellow-400');
                } else {
                    b.classList.replace('text-yellow-400', 'text-gray-200');
                }
            });
        }
    });

    // Binding filter buttons pipeline
    document.addEventListener('click', (e) => {
        if(e.target.classList.contains('pipe-filter')) {
            document.querySelectorAll('.pipe-filter').forEach(b => {
                b.className = "pipe-filter whitespace-nowrap px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-lg text-xs font-bold hover:bg-gray-50";
            });
            e.target.className = "pipe-filter active whitespace-nowrap px-4 py-2 bg-gray-900 text-white rounded-lg text-xs font-bold shadow";
            window.ClientProjects.renderPipeline(e.target.getAttribute('data-status'));
        }
    });

    const renderRoles = () => {
        const container = document.getElementById("roles-container");
        if (rolesArray.length === 0) {
            container.innerHTML = `<div class="text-center p-6 border-2 border-dashed border-gray-200 rounded-2xl text-gray-400 font-bold">Belum ada Kebutuhan Karakter. Klik "Tambah Karakter".</div>`;
            return;
        }

        const profOptions = masterProfessions.map(p => `<option value="${p}">${p}</option>`).join("");

        container.innerHTML = rolesArray.map((r, idx) => `
            <div class="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm relative">
                <div class="absolute top-4 right-4 flex gap-2">
                    <span class="bg-gray-100 text-gray-500 px-2 py-1 rounded text-[10px] font-black">ROLE #${idx+1}</span>
                    ${rolesArray.length > 1 ? `<button onclick="window.ClientProjects.removeRole(${idx})" class="text-red-400 hover:text-red-600"><i class="fa-solid fa-trash"></i></button>` : ''}
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                    <div class="md:col-span-3">
                        <label class="block text-[10px] font-bold text-gray-400 uppercase mb-1">Nama Karakter / Posisi</label>
                        <input type="text" class="role-input w-full border-b-2 border-gray-200 py-2 outline-none focus:border-gray-800 font-bold text-gray-800" data-idx="${idx}" data-field="role_name" value="${r.role_name}" placeholder="Cth: Pemeran Utama Pria / SPG Event">
                    </div>
                    
                    <div>
                        <label class="block text-[10px] font-bold text-gray-400 uppercase mb-1">Kategori / Profesi</label>
                        <select class="role-input w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-xs outline-none" data-idx="${idx}" data-field="category">
                            <option value="">Semua Kategori</option>
                            ${profOptions}
                        </select>
                    </div>

                    <div>
                        <label class="block text-[10px] font-bold text-gray-400 uppercase mb-1">Gender</label>
                        <select class="role-input w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-xs outline-none" data-idx="${idx}" data-field="gender">
                            <option value="Semua" ${r.gender==='Semua'?'selected':''}>Bebas / Semua</option>
                            <option value="Laki-Laki" ${r.gender==='Laki-Laki'?'selected':''}>Laki-Laki</option>
                            <option value="Perempuan" ${r.gender==='Perempuan'?'selected':''}>Perempuan</option>
                        </select>
                    </div>

                    <div>
                        <label class="block text-[10px] font-bold text-gray-400 uppercase mb-1">Lokasi Spesifik</label>
                        <input type="text" class="role-input w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-xs outline-none" data-idx="${idx}" data-field="location" value="${r.location}" placeholder="Kota...">
                    </div>

                    <div class="md:col-span-1">
                        <label class="block text-[10px] font-bold text-gray-400 uppercase mb-1">Range Usia (Thn)</label>
                        <div class="flex items-center gap-2">
                            <input type="number" class="role-input w-1/2 bg-gray-50 border border-gray-200 rounded-lg p-2 text-xs text-center" data-idx="${idx}" data-field="age_min" value="${r.age_min}" placeholder="Min">
                            <span class="text-gray-300">-</span>
                            <input type="number" class="role-input w-1/2 bg-gray-50 border border-gray-200 rounded-lg p-2 text-xs text-center" data-idx="${idx}" data-field="age_max" value="${r.age_max}" placeholder="Max">
                        </div>
                    </div>

                    <div class="md:col-span-1">
                        <label class="block text-[10px] font-bold text-gray-400 uppercase mb-1">Range Tinggi (Cm)</label>
                        <div class="flex items-center gap-2">
                            <input type="number" class="role-input w-1/2 bg-gray-50 border border-gray-200 rounded-lg p-2 text-xs text-center" data-idx="${idx}" data-field="height_min" value="${r.height_min}" placeholder="Min">
                            <span class="text-gray-300">-</span>
                            <input type="number" class="role-input w-1/2 bg-gray-50 border border-gray-200 rounded-lg p-2 text-xs text-center" data-idx="${idx}" data-field="height_max" value="${r.height_max}" placeholder="Max">
                        </div>
                    </div>

                    <div class="md:col-span-3">
                        <input type="text" class="role-input w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-xs outline-none" data-idx="${idx}" data-field="description" value="${r.description}" placeholder="Catatan tambahan (Cth: Harus bisa bahasa Inggris / Punya SIM A)...">
                    </div>
                </div>
            </div>
        `).join("");

        // Set values for selects back after render
        document.querySelectorAll('.role-input[data-field="category"]').forEach(el => {
            const idx = el.getAttribute('data-idx');
            el.value = rolesArray[idx].category;
        });

        // Re-bind listeners to update array on type
        document.querySelectorAll('.role-input').forEach(input => {
            input.addEventListener('change', (e) => {
                const idx = e.target.getAttribute('data-idx');
                const field = e.target.getAttribute('data-field');
                rolesArray[idx][field] = e.target.value;
            });
            // Also listen to keyup for text inputs
            if(input.type === 'text' || input.type === 'number') {
                input.addEventListener('keyup', (e) => {
                    const idx = e.target.getAttribute('data-idx');
                    const field = e.target.getAttribute('data-field');
                    rolesArray[idx][field] = e.target.value;
                });
            }
        });
    };

    window.ClientProjects = {
        
        viewPipeline: async (projectId) => {
            const list = document.getElementById("view-list");
            const create = document.getElementById("view-create");
            const pipe = document.getElementById("view-pipeline");
            const btn = document.getElementById("btn-create-view");
            
            list.classList.add("hidden"); create.classList.add("hidden"); pipe.classList.remove("hidden");
            btn.innerHTML = `<i class="fa-solid fa-arrow-left mr-1"></i> Kembali`;
            btn.onclick = () => { pipe.classList.add("hidden"); list.classList.remove("hidden"); btn.innerHTML = `<i class="fa-solid fa-plus mr-1"></i> Buat Proyek`; btn.onclick = () => window.ClientProjects.toggleView('create'); };
            
            const container = document.getElementById("pipeline-container");
            container.innerHTML = `<div class="col-span-full py-10 text-center"><i class="fa-solid fa-spinner fa-spin text-gray-400 text-3xl"></i></div>`;
            
            const res = await apiGet(`/functions/api/client/project_applicants?id=${projectId}`);
            if(!res.ok) return container.innerHTML = `<div class="col-span-full text-red-500 font-bold text-center">Gagal memuat pelamar.</div>`;
            
            document.getElementById("pipe-title").textContent = res.data.project_title;
            const applicants = res.data.applicants || [];
            window._currentApplicants = applicants;
            const roleSelect = document.getElementById("pipe-role-filter");
            if(res.data.roles && res.data.roles.length > 0) {
                roleSelect.innerHTML = '<option value="all">Semua Peran</option>' + res.data.roles.map(r => `<option value="${r.id}">${r.role_name}</option>`).join("");
            } else {
                roleSelect.innerHTML = '<option value="all">Umum / Tanpa Peran</option>';
            }
            
            window.ClientProjects.renderPipeline('all');
        },
        renderPipeline: (statusFilter) => {
            const container = document.getElementById("pipeline-container");
            let filtered = window._currentApplicants || [];
            
            const activeRole = document.getElementById("pipe-role-filter").value;
            if(statusFilter === 'all') {
                // Cari tombol yang aktif saat ini jika dipanggil dari onchange select
                const activeBtn = document.querySelector('.pipe-filter.active');
                if(activeBtn) statusFilter = activeBtn.getAttribute('data-status');
            }
            if(statusFilter !== 'all') filtered = filtered.filter(a => a.app_status === statusFilter);
            if(activeRole !== 'all') filtered = filtered.filter(a => a.role_id === activeRole);

            
            if(filtered.length === 0) {
                container.innerHTML = `<div class="col-span-full text-center py-10 border-2 border-dashed rounded-2xl text-gray-400 font-bold">Belum ada pelamar di kategori ini.</div>`;
                return;
            }
            
            container.innerHTML = filtered.map(a => {
                let photoUrl = "";
                try { const p = JSON.parse(a.photos); photoUrl = p.headshot || p.full || ""; } catch(e) {}
                const avatar = photoUrl ? `<div class="w-16 h-16 rounded-xl bg-cover bg-center shadow-sm flex-shrink-0" style="background-image: url('${photoUrl}')"></div>` : `<div class="w-16 h-16 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400 text-2xl flex-shrink-0"><i class="fa-solid fa-user"></i></div>`;
                
                let statusBadge = `<span class="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-[9px] font-black uppercase tracking-wider border border-yellow-200">Menunggu Review</span>`;
                if(a.app_status === 'approved') statusBadge = `<span class="px-2 py-1 bg-green-100 text-green-700 rounded text-[9px] font-black uppercase tracking-wider border border-green-200">Diterima</span>`;
                if(a.app_status === 'rejected') statusBadge = `<span class="px-2 py-1 bg-red-100 text-red-700 rounded text-[9px] font-black uppercase tracking-wider border border-red-200">Ditolak</span>`;
                if(a.app_status === 'invited') statusBadge = `<span class="px-2 py-1 bg-blue-100 text-blue-700 rounded text-[9px] font-black uppercase tracking-wider border border-blue-200">Diundang</span>`;

                
                let actionBtns = `
                    <button onclick="window.ClientProjects.updateStatus('${a.application_id}', 'approved')" class="flex-1 bg-gray-900 text-white py-2.5 rounded-xl text-xs font-bold shadow hover:bg-black active:scale-95 transition-transform">Terima</button>
                    <button onclick="window.ClientProjects.updateStatus('${a.application_id}', 'rejected')" class="flex-1 bg-gray-100 text-gray-600 py-2.5 rounded-xl text-xs font-bold hover:bg-red-50 hover:text-red-600 transition-colors">Tolak</button>
                `;
                if(a.app_status === 'approved') {
                    actionBtns = `<button onclick="window.ClientProjects.openReviewModal('${a.talent_id}', '${a.full_name}', '${a.project_id}')" class="w-full bg-yellow-400 text-gray-900 py-2.5 rounded-xl text-xs font-black shadow hover:bg-yellow-500 active:scale-95 transition-all"><i class="fa-solid fa-star"></i> Beri Ulasan & Rating</button>`;
                } else if(a.app_status !== 'applied') {
                    actionBtns = `<button class="w-full bg-gray-100 text-gray-400 py-2.5 rounded-xl text-xs font-bold cursor-not-allowed border border-gray-200">Telah Diproses</button>`;
                }


                
                return `
                <div class="bg-white border border-gray-200 rounded-2xl p-4 flex flex-col gap-4 shadow-sm hover:shadow-lg transition-all relative overflow-hidden group">
                    ${a.profile_progress >= 80 ? '<div class="absolute -right-6 top-2 bg-yellow-400 text-black text-[8px] font-black py-1 px-8 rotate-45 shadow-sm">PROFIL LENGKAP</div>' : ''}
                    <div class="flex items-start gap-4">
                        ${avatar}
                        <div class="flex-1 min-w-0">
                            <div class="flex justify-between items-center mb-1.5 gap-2">
                                ${statusBadge}
                                ${a.video_link ? `<a href="${a.video_link}" target="_blank" class="flex-shrink-0 w-7 h-7 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-xs hover:bg-red-200 transition-colors" title="Tonton Video Audisi"><i class="fa-solid fa-video"></i></a>` : ''}
                            </div>
                            <h4 class="font-black text-gray-800 text-base leading-tight truncate">${a.full_name}</h4>
                            
                            ${a.role_name ? `<span class="inline-block mt-1.5 px-2 py-0.5 bg-gray-100 border border-gray-200 text-gray-600 rounded text-[9px] font-bold uppercase truncate w-full"><i class="fa-solid fa-masks-theater"></i> Peran: ${a.role_name}</span>` : ''}
                            <p class="text-xs text-gray-500 mt-1.5"><i class="fa-solid fa-location-dot"></i> ${a.city || '-'} &nbsp;|&nbsp; ${a.gender || '-'}</p>
                        </div>
                    </div>
                    
                    <div class="flex gap-2 mt-auto pt-3 border-t border-gray-100">
                        <button onclick="window.ClientSearch.openModal('${a.talent_id}')" class="w-12 bg-white border-2 border-gray-200 text-gray-600 py-2 rounded-xl flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm"><i class="fa-solid fa-eye"></i></button>
                        ${actionBtns}
                    </div>
                </div>
                `;

        } else {
            container.innerHTML = `<div class="col-span-full text-red-500 font-bold text-center">Gagal memuat proyek.</div>`;
        }
    }

    loadList();
}
