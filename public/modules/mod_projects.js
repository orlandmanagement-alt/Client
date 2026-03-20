import { apiGet, apiPost } from "/assets/js/api.js";
import { notify } from "/assets/js/notify.js";

// =========================================================
// TEMPLATE RENDER (3 Tabs: Proyek Saya, Buat Proyek, Pelamar)
// =========================================================
export async function render() {
  return `
    <div class="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 max-w-5xl mx-auto min-h-[75vh]">
        
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div>
                <h2 class="text-2xl font-bold text-gray-800"><i class="fa-solid fa-briefcase text-blue-600 mr-2"></i> Kelola Proyek</h2>
                <p class="text-sm text-gray-500 mt-1">Publikasikan proyek baru dan tinjau lamaran dari talent.</p>
            </div>
        </div>

        <div class="flex gap-6 border-b border-gray-100 mb-6 overflow-x-auto no-scrollbar">
            <button id="tab-list" class="pb-3 text-sm font-bold text-gray-800 border-b-2 border-gray-800 whitespace-nowrap">Proyek Aktif</button>
            <button id="tab-create" class="pb-3 text-sm font-bold text-gray-400 hover:text-gray-600 border-b-2 border-transparent whitespace-nowrap transition-colors">Buat Lowongan Baru</button>
            <button id="tab-pipeline" class="pb-3 text-sm font-bold text-gray-400 hover:text-gray-600 border-b-2 border-transparent whitespace-nowrap transition-colors">Review Pelamar</button>
        </div>

        <div id="projects-content" class="fade-in">
            <div class="flex justify-center py-10"><i class="fa-solid fa-spinner fa-spin text-3xl text-gray-400"></i></div>
        </div>
        
    </div>
  `;
}

// =========================================================
// LOGIC & EVENTS
// =========================================================
export async function initEvents() {
    const tabList = document.getElementById("tab-list");
    const tabCreate = document.getElementById("tab-create");
    const tabPipeline = document.getElementById("tab-pipeline");
    const content = document.getElementById("projects-content");

    function setTabActive(activeTab) {
        [tabList, tabCreate, tabPipeline].forEach(t => t.className = "pb-3 text-sm font-bold text-gray-400 hover:text-gray-600 border-b-2 border-transparent whitespace-nowrap transition-colors");
        activeTab.className = "pb-3 text-sm font-bold text-gray-800 border-b-2 border-gray-800 whitespace-nowrap";
    }

    // --- TAB 1: DAFTAR PROYEK ---
    async function loadProjectList() {
        setTabActive(tabList);
        content.innerHTML = `<div class="flex justify-center py-10"><i class="fa-solid fa-spinner fa-spin text-3xl text-gray-400"></i></div>`;
        const res = await apiGet("/functions/api/client/projects_list");
        
        if (!res.ok) { content.innerHTML = `<div class="bg-red-50 text-red-500 p-4 rounded-xl text-center">Gagal memuat proyek.</div>`; return; }
        const items = res.data?.items || [];
        if (!items.length) {
            content.innerHTML = `<div class="text-center py-16 text-gray-400"><i class="fa-solid fa-folder-open text-6xl mb-4 text-gray-200"></i><p>Belum ada proyek yang Anda buat.</p></div>`; return;
        }

        content.innerHTML = `<div class="grid grid-cols-1 md:grid-cols-2 gap-6">` + items.map(p => `
            <div class="border border-gray-200 p-6 rounded-2xl bg-white hover:shadow-lg transition-shadow">
                <div class="flex justify-between items-start mb-2">
                    <h3 class="font-bold text-lg text-gray-800">${p.title}</h3>
                    <span class="px-3 py-1 bg-green-50 text-green-600 text-[10px] font-black rounded-full uppercase tracking-widest">${p.status}</span>
                </div>
                <div class="flex gap-2 mb-3 border-t border-gray-100 pt-3">
                    <button onclick="window.ClientProjects.share('${p.id}')" class="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-blue-50 hover:text-blue-600 transition-colors"><i class="fa-solid fa-share-nodes"></i> Share WA</button>
                </div>
                <div class="text-xs text-gray-500 mb-3"><i class="fa-solid fa-location-dot w-4"></i> ${p.location || 'TBA'} &nbsp;|&nbsp; <i class="fa-regular fa-calendar w-4"></i> ${p.event_date || 'TBA'}</div>
                <p class="text-sm text-gray-600 line-clamp-2">${p.description}</p>
            </div>
        `).join("") + `</div>`;
    }

    // --- TAB 2: BUAT PROYEK BARU ---
    function loadCreateForm() {
        setTabActive(tabCreate);
        content.innerHTML = `
            <form id="form-create-project" class="space-y-5 max-w-2xl">
                <div>
                    <label class="block text-sm font-bold text-gray-700 mb-1">Judul Proyek / Iklan <span class="text-red-500">*</span></label>
                    <input type="text" id="cp_title" required placeholder="Cth: Dicari Aktor untuk Iklan TV" class="w-full border border-gray-300 rounded-xl p-3 focus:border-blue-500 outline-none text-sm">
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                        <label class="block text-sm font-bold text-gray-700 mb-1">Lokasi Syuting/Event</label>
                        <input type="text" id="cp_location" placeholder="Cth: Jakarta Selatan" class="w-full border border-gray-300 rounded-xl p-3 focus:border-blue-500 outline-none text-sm">
                    </div>
                    <div>
                        <label class="block text-sm font-bold text-gray-700 mb-1">Tanggal Event</label>
                        <input type="text" id="cp_date" placeholder="Cth: 15-20 Nov 2026" class="w-full border border-gray-300 rounded-xl p-3 focus:border-blue-500 outline-none text-sm">
                    </div>
                </div>
                <div>
                    <label class="block text-sm font-bold text-gray-700 mb-1">Deskripsi Lengkap & Kebutuhan Talent</label>
                    <textarea id="cp_desc" rows="5" placeholder="Jelaskan detail proyek, fee, dan kriteria talent yang dibutuhkan..." class="w-full border border-gray-300 rounded-xl p-3 focus:border-blue-500 outline-none text-sm resize-y"></textarea>
                </div>
                <button type="submit" class="bg-gray-800 text-white font-bold py-3 px-8 rounded-xl shadow-md hover:bg-gray-900 transition-colors">Publikasikan Lowongan</button>
            </form>
        `;

        document.getElementById("form-create-project").onsubmit = async (e) => {
            e.preventDefault();
            notify("Menyimpan proyek...", "info");
            const payload = {
                title: document.getElementById('cp_title').value,
                location: document.getElementById('cp_location').value,
                event_date: document.getElementById('cp_date').value,
                description: document.getElementById('cp_desc').value
            };
            const res = await apiPost("/functions/api/client/project_create", payload);
            if(res.ok) { notify("Berhasil! Proyek Anda kini tayang.", "success"); loadProjectList(); } 
            else { notify(res.data?.message || "Gagal membuat proyek", "error"); }
        };
    }

    // --- TAB 3: REVIEW PELAMAR (Pipeline) ---
    async function loadPipeline() {
        setTabActive(tabPipeline);
        content.innerHTML = `<div class="flex justify-center py-10"><i class="fa-solid fa-spinner fa-spin text-3xl text-gray-400"></i></div>`;
        const res = await apiGet("/functions/api/client/applications");
        
        if (!res.ok) { content.innerHTML = `<div class="bg-red-50 text-red-500 p-4 rounded-xl text-center">Gagal memuat data pelamar.</div>`; return; }
        const items = res.data?.items || [];
        if (!items.length) {
            content.innerHTML = `<div class="text-center py-16 text-gray-400"><i class="fa-solid fa-user-xmark text-6xl mb-4 text-gray-200"></i><p>Belum ada talent yang melamar.</p></div>`; return;
        }

        content.innerHTML = `<div class="space-y-4">` + items.map(a => {
            let statusBadge = `<span class="px-3 py-1 bg-yellow-50 text-yellow-600 border border-yellow-200 text-xs font-bold rounded-full uppercase">Pending</span>`;
            let actions = `
                <button onclick="window.ClientProjects.updateStatus('${a.application_id}', 'approved')" class="bg-green-500 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-green-600 transition-colors"><i class="fa-solid fa-check"></i> Terima</button>
                <button onclick="window.ClientProjects.updateStatus('${a.application_id}', 'rejected')" class="bg-red-50 text-red-500 px-4 py-2 rounded-lg text-xs font-bold hover:bg-red-100 transition-colors">Tolak</button>
            `;

            if (a.application_status === 'approved') {
                statusBadge = `<span class="px-3 py-1 bg-green-50 text-green-600 border border-green-200 text-xs font-bold rounded-full uppercase"><i class="fa-solid fa-check mr-1"></i> Diterima</span>`;
                actions = `<a href="https://wa.me/${(a.talent_phone||'').replace(/[^0-9]/g, '')}" target="_blank" class="text-green-600 text-sm font-bold hover:underline"><i class="fa-brands fa-whatsapp"></i> Hubungi Talent</a>`;
            } else if (a.application_status === 'rejected') {
                statusBadge = `<span class="px-3 py-1 bg-red-50 text-red-600 border border-red-200 text-xs font-bold rounded-full uppercase">Ditolak</span>`;
                actions = ``;
            }

            return `
            <div class="border border-gray-200 p-5 rounded-2xl bg-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-gray-50 transition-colors">
                <div>
                    <div class="flex items-center gap-3 mb-1">
                        <h4 class="font-bold text-gray-800 text-lg">${a.talent_name || 'Talent'}</h4>
                        ${statusBadge}
                    </div>
                    <p class="text-sm text-gray-600 font-medium"><i class="fa-solid fa-briefcase w-5 text-gray-400"></i> Melamar di: <span class="text-gray-800">${a.project_title}</span></p>
                    <p class="text-xs text-gray-400 mt-1">Diajukan pada: ${new Date(a.applied_at * 1000).toLocaleDateString('id-ID')}</p>
                </div>
                <div class="flex gap-2 w-full sm:w-auto mt-2 sm:mt-0 justify-end">
                    <button class="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-xs font-bold hover:bg-gray-50"><i class="fa-solid fa-eye"></i> Lihat Profil</button>
                    <button onclick="window.ClientProjects.openReviewModal('${a.application_id}', '${a.talent_name}')" class="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-2 rounded-lg text-xs font-bold hover:bg-yellow-100 transition-colors"><i class="fa-solid fa-star"></i> Beri Ulasan</button>
                    <button onclick="window.ClientProjects.issueCert('${a.application_id}')" class="bg-purple-50 border border-purple-200 text-purple-600 px-4 py-2 rounded-lg text-xs font-bold hover:bg-purple-100 transition-colors"><i class="fa-solid fa-award"></i> Cetak Sertifikat</button>
                    ${actions}
                </div>
            </div>
            `;
        }).join("") + `</div>`;
    }

    // --- GLOBAL METHOD: UPDATE STATUS LAMARAN ---
    window.ClientProjects = {
        share: (projectId) => {
            const url = `https://talent.orlandmanagement.com/project.html?id=${projectId}`;
            if (navigator.clipboard) {
                navigator.clipboard.writeText(url);
                notify("Link berhasil disalin! Silakan Paste di WhatsApp/IG.", "success");
            } else {
                prompt("Salin link ini untuk dibagikan:", url);
            }
        },
        openReviewModal: (appId, talentName) => {
            document.getElementById("rev_app_id").value = appId;
            document.getElementById("rev_talent_name").textContent = talentName;
            document.getElementById("rev_rating").value = "0";
            document.getElementById("rev_text").value = "";
            document.querySelectorAll("#star-container i").forEach(s => s.classList.replace("text-yellow-400", "text-gray-300"));
            document.getElementById("review-modal").classList.remove("hidden");
            
            // Logic Bintang
            document.querySelectorAll("#star-container i").forEach(star => {
                star.onclick = function() {
                    const val = parseInt(this.getAttribute("data-val"));
                    document.getElementById("rev_rating").value = val;
                    document.querySelectorAll("#star-container i").forEach(s => {
                        if(parseInt(s.getAttribute("data-val")) <= val) s.classList.replace("text-gray-300", "text-yellow-400");
                        else s.classList.replace("text-yellow-400", "text-gray-300");
                    });
                }
            });
        },
        submitReview: async () => {
            const appId = document.getElementById("rev_app_id").value;
            const rating = document.getElementById("rev_rating").value;
            const text = document.getElementById("rev_text").value;
            if(rating === "0") return notify("Pilih minimal 1 bintang!", "error");
            notify("Mengirim ulasan...", "info");
            const res = await apiPost("/functions/api/client/review_submit", { application_id: appId, rating: parseInt(rating), review_text: text });
            if(res.ok) { notify(res.message, "success"); document.getElementById("review-modal").classList.add("hidden"); }
            else { notify(res.data?.message || "Gagal mengirim ulasan", "error"); }
        },
        issueCert: async (appId) => {
            if(!confirm("Terbitkan sertifikat resmi untuk talent ini sebagai bukti kehadiran/partisipasi?")) return;
            notify("Memproses sertifikat...", "info");
            const res = await apiPost("/functions/api/client/certificate_issue", { application_id: appId });
            if(res.ok) { notify(res.message, "success"); } 
            else { notify(res.data?.message || "Gagal menerbitkan", "error"); }
        },
        updateStatus: async (appId, newStatus) => {
            if(!confirm(`Yakin ingin mengubah status menjadi ${newStatus.toUpperCase()}?`)) return;
            notify("Memproses...", "info");
            const res = await apiPost("/functions/api/client/application_update", { application_id: appId, status: newStatus });
            if(res.ok) { notify(res.message, "success"); loadPipeline(); } 
            else { notify(res.data?.message || "Gagal memproses", "error"); }
        }
    };

    // --- BINDING EVENT TABS ---
    tabList.addEventListener("click", loadProjectList);
    tabCreate.addEventListener("click", loadCreateForm);
    tabPipeline.addEventListener("click", loadPipeline);

    // Initial Load
    loadProjectList();
}
