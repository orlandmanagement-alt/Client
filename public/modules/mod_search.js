import { apiGet } from "/assets/js/api.js";

export async function render() {
    return `
    <div class="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200 min-h-[80vh] flex flex-col md:flex-row gap-8 relative">
        
        <aside class="w-full md:w-64 flex-shrink-0">
            <h2 class="text-xl font-bold text-slate-800 mb-6 border-b border-slate-100 pb-4"><i class="fa-solid fa-filter text-blue-600 mr-2"></i> Filter Talent</h2>
            <form id="filter-form" class="space-y-4">
                <div>
                    <label class="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Kata Kunci / Profesi</label>
                    <input type="text" id="f_keyword" placeholder="Cth: Aktor Utama..." class="w-full border border-slate-200 rounded-lg p-2.5 outline-none text-[13px] font-bold bg-slate-50 focus:bg-white focus:border-blue-500">
                </div>
                <div>
                    <label class="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Gender</label>
                    <select id="f_gender" class="w-full border border-slate-200 rounded-lg p-2.5 outline-none text-[13px] font-bold bg-slate-50 focus:bg-white focus:border-blue-500">
                        <option value="">Semua Gender</option>
                        <option value="Laki-Laki">Laki-Laki</option>
                        <option value="Perempuan">Perempuan</option>
                    </select>
                </div>
                <div>
                    <label class="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Lokasi (Kota)</label>
                    <input type="text" id="f_loc" placeholder="Cth: Jakarta" class="w-full border border-slate-200 rounded-lg p-2.5 outline-none text-[13px] font-bold bg-slate-50 focus:bg-white focus:border-blue-500">
                </div>
                <button type="submit" class="w-full bg-slate-900 text-white font-bold py-3 rounded-lg shadow-sm hover:bg-black transition-colors mt-2 text-[13px]">
                    <i class="fa-solid fa-magnifying-glass mr-1"></i> Terapkan Filter
                </button>
                <button type="button" onclick="document.getElementById('filter-form').reset(); window.ClientSearch.doSearch();" class="w-full text-slate-500 font-bold py-2 rounded-lg text-[12px] hover:bg-slate-100 transition-colors mt-1">
                    Reset Pencarian
                </button>
            </form>
        </aside>

        <div class="flex-1">
            <div class="flex justify-between items-center mb-6">
                <h3 class="text-lg font-bold text-slate-800">Hasil Pencarian</h3>
                <span id="search-count" class="text-[12px] font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-lg">Menunggu...</span>
            </div>
            <div id="search-results" class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 fade-in"></div>
        </div>
    </div>
    `;
}

export async function initEvents() {
    window.ClientSearch = {
        doSearch: async () => {
            const container = document.getElementById("search-results");
            const countDisplay = document.getElementById("search-count");
            
            container.innerHTML = `<div class="col-span-full flex justify-center py-16"><i class="fa-solid fa-spinner fa-spin text-4xl text-slate-300"></i></div>`;
            countDisplay.textContent = `Mencari...`;

            const params = new URLSearchParams();
            const kw = document.getElementById("f_keyword").value;
            const gen = document.getElementById("f_gender").value;
            const loc = document.getElementById("f_loc").value;
            
            if (kw) params.append("keyword", kw);
            if (gen) params.append("gender", gen);
            if (loc) params.append("location", loc);

            try {
                const res = await apiGet(`/api/client/talent_search?${params.toString()}`);
                
                // EMPTY STATE GRACEFUL
                if (!res.ok || !res.data || res.data.length === 0 || (res.data.items && res.data.items.length === 0)) {
                    container.innerHTML = `
                        <div class="col-span-full flex flex-col items-center justify-center py-20 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
                            <i class="fa-solid fa-users-slash text-4xl text-slate-300 mb-3"></i>
                            <h3 class="text-[14px] font-bold text-slate-700">Talent Tidak Ditemukan</h3>
                            <p class="text-[12px] text-slate-500 mt-1">Coba sesuaikan filter pencarian Anda.</p>
                        </div>
                    `;
                    countDisplay.textContent = `0 Talent`;
                    return;
                }

                // JIKA ADA DATA
                const items = res.data.items || res.data;
                countDisplay.textContent = `${items.length} Talent`;

                container.innerHTML = items.map(t => `
                    <div class="border border-slate-200 rounded-xl bg-white overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group flex flex-col relative cursor-pointer">
                        <div class="absolute top-3 right-3 z-10">
                            <span class="bg-black/60 backdrop-blur text-white text-[10px] font-bold px-2 py-1 rounded-md border border-white/20"><i class="fa-solid fa-star text-yellow-400"></i> ${t.profile_progress || 0}%</span>
                        </div>
                        <div class="w-full aspect-[4/5] bg-slate-100 flex items-center justify-center bg-cover bg-center" style="background-image: url('${t.photo_url || ''}')">
                            ${!t.photo_url ? `<i class="fa-solid fa-user text-4xl text-slate-300"></i>` : ''}
                        </div>
                        <div class="p-4 flex-1 flex flex-col">
                            <h3 class="font-black text-slate-800 leading-tight mb-1 truncate">${t.full_name || 'Nama Talent'}</h3>
                            <p class="text-[11px] font-bold text-blue-500 uppercase tracking-wider mb-3 truncate">${t.profession || 'Talent Umum'}</p>
                            <div class="grid grid-cols-2 gap-2 mt-auto">
                                <div class="bg-slate-50 border border-slate-100 rounded-md p-1.5 text-center">
                                    <p class="text-[9px] text-slate-400 font-bold uppercase">Lokasi</p>
                                    <p class="text-[11px] font-bold text-slate-700 truncate">${t.city || '-'}</p>
                                </div>
                                <div class="bg-slate-50 border border-slate-100 rounded-md p-1.5 text-center">
                                    <p class="text-[9px] text-slate-400 font-bold uppercase">Gender</p>
                                    <p class="text-[11px] font-bold text-slate-700 truncate">${t.gender || '-'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                `).join("");

            } catch(e) {
                container.innerHTML = `<div class="col-span-full text-center py-10 text-red-500 text-[12px] font-bold">Gagal terhubung ke database talent.</div>`;
            }
        }
    };

    // Binding Form Filter
    document.getElementById("filter-form").addEventListener("submit", (e) => {
        e.preventDefault();
        window.ClientSearch.doSearch();
    });

    // Panggil pencarian awal
    window.ClientSearch.doSearch();
}
