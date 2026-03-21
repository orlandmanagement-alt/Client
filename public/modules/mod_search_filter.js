import { apiGet } from "/assets/js/api.js";

export async function render() {
    return `
    <div class="p-6 max-w-4xl mx-auto space-y-8">
        <div class="bg-white p-8 rounded-[3rem] shadow-xl border border-slate-50 space-y-6">
            <h2 class="text-xl font-black text-slate-800 italic">Filter Talent</h2>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <select id="f-gender" class="bg-slate-50 border-none rounded-2xl p-4 text-xs font-black outline-none focus:ring-2 ring-blue-500/20">
                    <option value="">Semua Gender</option>
                    <option value="male">Pria</option>
                    <option value="female">Wanita</option>
                </select>
                
                <input type="number" id="f-min-h" placeholder="Tinggi Min (cm)" 
                       class="bg-slate-50 border-none rounded-2xl p-4 text-xs font-black outline-none focus:ring-2 ring-blue-500/20">
                
                <input type="text" id="f-city" placeholder="Kota (Cth: Malang)" 
                       class="bg-slate-50 border-none rounded-2xl p-4 text-xs font-black outline-none focus:ring-2 ring-blue-500/20">
            </div>

            <button onclick="window.applyFilter()" class="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-[10px] uppercase shadow-lg shadow-blue-100 active:scale-95 transition-all">
                Cari Talent Sekarang
            </button>
        </div>

        <div id="search-results" class="grid grid-cols-2 md:grid-cols-4 gap-4">
            </div>
    </div>`;
}

export async function initEvents() {
    window.applyFilter = async () => {
        const g = document.getElementById('f-gender').value;
        const h = document.getElementById('f-min-h').value;
        const c = document.getElementById('f-city').value;
        
        const container = document.getElementById('search-results');
        container.innerHTML = '<p class="col-span-full text-center text-xs font-bold text-slate-300 animate-pulse">Mencari talent terbaik...</p>';

        const res = await apiGet(`/api/client/search_talent?gender=${g}&min_h=${h}&city=${c}`);
        if(res.ok && res.talents.length > 0) {
            container.innerHTML = res.talents.map(t => `
                <div class="bg-white p-3 rounded-[2rem] border border-slate-100 shadow-sm text-center space-y-3">
                    <div class="w-full aspect-square bg-slate-100 rounded-2xl overflow-hidden bg-cover bg-center" 
                         style="background-image: url('${t.profile_image_url || 'https://via.placeholder.com/150'}')"></div>
                    <div>
                        <h4 class="text-[10px] font-black text-slate-800 truncate uppercase">${t.full_name}</h4>
                        <p class="text-[8px] text-slate-400 font-bold uppercase tracking-widest">${t.city} • ${t.height}cm</p>
                    </div>
                </div>
            `).join('');
        } else {
            container.innerHTML = '<p class="col-span-full text-center text-xs font-bold text-slate-300 py-10">Talent tidak ditemukan.</p>';
        }
    };
}
