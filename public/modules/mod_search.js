import { apiGet } from "/assets/js/api.js";
import { notify } from "/assets/js/notify.js";

// =========================================================
// TEMPLATE RENDER (Filter UI, Grid Talent & MODAL DETAIL)
// =========================================================
export async function render() {
  return `
    <div class="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 max-w-6xl mx-auto min-h-[80vh] flex flex-col md:flex-row gap-8 relative">
        
        <aside class="w-full md:w-64 flex-shrink-0">
            <h2 class="text-xl font-bold text-gray-800 mb-6 border-b border-gray-100 pb-4"><i class="fa-solid fa-filter text-blue-600 mr-2"></i> Filter Talent</h2>
            <form id="filter-form" class="space-y-5">
                <div>
                    <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Kata Kunci / Profesi</label>
                    <input type="text" id="f_keyword" placeholder="Cth: Aktor, Model..." class="w-full border border-gray-300 rounded-xl p-3 focus:border-gray-800 outline-none text-sm bg-gray-50">
                </div>
                <div>
                    <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Gender</label>
                    <select id="f_gender" class="w-full border border-gray-300 rounded-xl p-3 focus:border-gray-800 outline-none text-sm bg-gray-50 cursor-pointer">
                        <option value="">Semua Gender</option>
                        <option value="Laki-Laki">Laki-Laki</option>
                        <option value="Perempuan">Perempuan</option>
                    </select>
                </div>
                <div>
                    <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Lokasi Kota</label>
                    <input type="text" id="f_loc" placeholder="Cth: Jakarta" class="w-full border border-gray-300 rounded-xl p-3 focus:border-gray-800 outline-none text-sm bg-gray-50">
                </div>
                <button type="submit" class="w-full bg-gray-900 text-white font-bold py-3 rounded-xl shadow-md hover:bg-black transition-colors mt-4">
                    <i class="fa-solid fa-magnifying-glass mr-1"></i> Terapkan Filter
                </button>
                <button type="button" onclick="document.getElementById('filter-form').reset(); window.ClientSearch.doSearch();" class="w-full text-gray-500 font-bold py-2 rounded-xl text-xs hover:text-gray-800 transition-colors mt-2">
                    Reset Filter
                </button>
            </form>
        </aside>

        <div class="flex-1">
            <div class="flex justify-between items-center mb-6">
                <h3 class="text-lg font-bold text-gray-800">Hasil Pencarian</h3>
                <span id="search-count" class="text-sm font-bold text-gray-500 bg-gray-100 px-3 py-1 rounded-lg">Menunggu...</span>
            </div>
            <div id="search-results" class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 fade-in"></div>
        </div>

    </div>

    <div id="talent-modal" class="fixed inset-0 z-[9999] hidden flex items-center justify-center p-4 sm:p-6">
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" onclick="window.ClientSearch.closeModal()"></div>
        
        <div class="bg-white rounded-3xl w-[95%] max-w-4xl max-h-[90vh] overflow-y-auto relative z-10 shadow-2xl flex flex-col md:flex-row transform transition-all">
            
            <button onclick="window.ClientSearch.closeModal()" class="absolute top-4 right-4 w-10 h-10 bg-gray-100 hover:bg-red-100 hover:text-red-600 rounded-full flex items-center justify-center text-gray-600 font-bold z-20 transition-colors">
                <i class="fa-solid fa-xmark text-xl"></i>
            </button>

            <div class="w-full md:w-2/5 bg-gray-100 relative min-h-[300px] md:min-h-full">
                <div id="m-photo" class="absolute inset-0 bg-cover bg-center"></div>
                <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 pt-16">
                    <h2 id="m-name" class="text-3xl font-black text-white drop-shadow-md leading-none mb-1">Nama Talent</h2>
                    <p id="m-profession" class="text-blue-400 font-bold tracking-widest uppercase text-xs drop-shadow-md">Profesi</p>
                </div>
            </div>

            <div class="w-full md:w-3/5 p-6 md:p-8 flex flex-col">
                <div class="flex flex-wrap gap-2 mb-6">
                    <span id="m-loc" class="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded-lg"><i class="fa-solid fa-location-dot"></i> -</span>
                    <span id="m-gender" class="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded-lg"><i class="fa-solid fa-venus-mars"></i> -</span>
                    <span id="m-height" class="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded-lg"><i class="fa-solid fa-ruler-vertical"></i> -</span>
                </div>

                <div class="mb-6">
                    <h4 class="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Tentang Saya</h4>
                    <p id="m-bio" class="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap bg-gray-50 p-4 rounded-xl border border-gray-100">-</p>
                </div>

                <div class="mb-8">
                    <h4 class="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Keahlian & Kategori</h4>
                    <div id="m-skills" class="flex flex-wrap gap-2"></div>
                </div>

                <div class="mt-auto pt-6 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button class="w-full bg-white border-2 border-gray-200 text-gray-800 font-bold py-3 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all flex items-center justify-center gap-2">
                        <i class="fa-regular fa-star"></i> Simpan Favorit
                    </button>
                    <button onclick="window.ClientSearch.inviteTalent()" class="w-full bg-gray-900 text-white font-bold py-3 rounded-xl shadow-lg hover:bg-black transition-all flex items-center justify-center gap-2 active:scale-95">
                        <i class="fa-regular fa-envelope"></i> Undang ke Proyek
                    </button>
                </div>
            </div>
        </div>
    </div>
  `;
}

// =========================================================
// LOGIC & EVENTS
// =========================================================
export async function initEvents() {
    const resultsContainer = document.getElementById("search-results");
    const countDisplay = document.getElementById("search-count");
    const modal = document.getElementById("talent-modal");

    let currentSelectedTalentId = null;

    async function executeSearch() {
        resultsContainer.innerHTML = `<div class="col-span-full flex justify-center py-16"><i class="fa-solid fa-spinner fa-spin text-4xl text-gray-300"></i></div>`;
        countDisplay.textContent = `Mencari...`;

        const kw = document.getElementById("f_keyword").value;
        const gen = document.getElementById("f_gender").value;
        const loc = document.getElementById("f_loc").value;

        const params = new URLSearchParams();
        if (kw) params.append("keyword", kw);
        if (gen) params.append("gender", gen);
        if (loc) params.append("location", loc);

        const res = await apiGet(`/functions/api/client/talent_search?${params.toString()}`);
        if (!res.ok) { resultsContainer.innerHTML = `<div class="col-span-full text-red-500 p-4 text-center">Gagal memuat database.</div>`; return; }

        const items = res.data?.items || [];
        countDisplay.textContent = `${items.length} Talent`;

        if (!items.length) {
            resultsContainer.innerHTML = `<div class="col-span-full text-center py-16 text-gray-400">Tidak ada talent yang sesuai.</div>`; return;
        }

        resultsContainer.innerHTML = items.map(t => {
            let photoUrl = "";
            try { const p = JSON.parse(t.photos); photoUrl = p.headshot || p.full || p.side || ""; } catch(e) {}
            const bgImage = photoUrl ? `url('${photoUrl}')` : 'none';
            const initial = t.full_name ? t.full_name.charAt(0).toUpperCase() : '?';
            
            const avatarHtml = photoUrl 
                ? `<div class="w-full aspect-[4/5] bg-cover bg-center" style="background-image: ${bgImage};"></div>`
                : `<div class="w-full aspect-[4/5] bg-gray-100 flex items-center justify-center text-5xl font-black text-gray-300">${initial}</div>`;

            return `
            <div class="border border-gray-200 rounded-2xl bg-white overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col relative cursor-pointer" onclick="window.ClientSearch.openModal('${t.user_id}')">
                <div class="absolute top-3 right-3 z-10 flex flex-col gap-2 items-end">
                    <span class="bg-black/60 backdrop-blur text-white text-[10px] font-bold px-2 py-1 rounded-md border border-white/20"><i class="fa-solid fa-star text-yellow-400"></i> ${t.profile_progress}%</span>
                </div>
                <div class="w-full overflow-hidden relative">
                    ${avatarHtml}
                    <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>
                </div>
                <div class="p-4 flex-1 flex flex-col -mt-12 z-10 relative">
                    <h3 class="font-black text-lg text-white drop-shadow-md leading-tight mb-1 truncate">${t.full_name || 'Talent'}</h3>
                    <p class="text-xs font-bold text-blue-400 uppercase tracking-wider mb-3 drop-shadow-md truncate">${t.talent_type || 'Uncategorized'}</p>
                    <div class="grid grid-cols-2 gap-2 mt-auto">
                        <div class="bg-gray-50 border border-gray-100 rounded-lg p-2 text-center">
                            <p class="text-[10px] text-gray-400 font-bold uppercase">Lokasi</p>
                            <p class="text-xs font-bold text-gray-700 truncate">${t.city || '-'}</p>
                        </div>
                        <div class="bg-gray-50 border border-gray-100 rounded-lg p-2 text-center">
                            <p class="text-[10px] text-gray-400 font-bold uppercase">Tinggi</p>
                            <p class="text-xs font-bold text-gray-700">${t.height_cm ? t.height_cm + 'cm' : '-'}</p>
                        </div>
                    </div>
                </div>
            </div>
            `;
        }).join("");
    }

    // Global Functions
    window.ClientSearch = {
        doSearch: () => { executeSearch(); },
        
        closeModal: () => { 
            modal.classList.add('hidden'); 
            document.body.style.overflow = 'auto'; // Kembalikan scroll
            currentSelectedTalentId = null;
        },
        
        openModal: async (userId) => {
            notify("Memuat profil...", "info");
            currentSelectedTalentId = userId;

            const res = await apiGet(`/functions/api/client/talent_detail?id=${userId}`);
            if (!res.ok) return notify("Gagal memuat detail talent", "error");

            const t = res.data;

            // Mapping Data ke Modal
            document.getElementById("m-name").textContent = t.full_name;
            document.getElementById("m-profession").textContent = t.profession;
            document.getElementById("m-loc").innerHTML = `<i class="fa-solid fa-location-dot"></i> ${t.city || '-'}`;
            document.getElementById("m-gender").innerHTML = `<i class="fa-solid fa-venus-mars"></i> ${t.gender || '-'}`;
            document.getElementById("m-height").innerHTML = `<i class="fa-solid fa-ruler-vertical"></i> ${t.height ? t.height+'cm' : '-'}`;
            document.getElementById("m-bio").textContent = t.bio || 'Belum ada deskripsi profil.';

            // Render Skills Chips
            const skillCont = document.getElementById("m-skills");
            if (t.skills && t.skills.length > 0) {
                skillCont.innerHTML = t.skills.map(s => `<span class="px-3 py-1 bg-blue-50 text-blue-600 border border-blue-100 text-xs font-bold rounded-lg uppercase">${s}</span>`).join("");
            } else {
                skillCont.innerHTML = `<span class="text-xs text-gray-400 italic">Belum ada keahlian ditambahkan.</span>`;
            }

            // Render Foto (Headshot / Full)
            const photoBg = document.getElementById("m-photo");
            let bgUrl = "";
            if (t.photos) { bgUrl = t.photos.headshot || t.photos.full || t.photos.side || ""; }
            if (bgUrl) {
                photoBg.style.backgroundImage = `url('${bgUrl}')`;
            } else {
                photoBg.style.backgroundImage = `none`;
                photoBg.className = "absolute inset-0 bg-gray-200 flex items-center justify-center text-6xl text-gray-400 fa-solid fa-user";
            }

            // Tampilkan Modal & Kunci Scroll Background
            modal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        },
        
        inviteTalent: () => {
            if(!currentSelectedTalentId) return;
            notify("Fitur Undangan Proyek akan segera hadir!", "info");
            // Disini nanti kita panggil Pop-up kedua yang berisi daftar proyek Client 
            // agar mereka bisa memilih mau mengundang talent ini ke proyek mana.
        }
    };

    document.getElementById("filter-form").addEventListener("submit", (e) => {
        e.preventDefault(); executeSearch();
    });

    executeSearch();
}
