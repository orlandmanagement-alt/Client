import { apiGet } from "/assets/js/api.js";

export async function render() {
    return `
    <div class="p-6">
        <div class="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 mb-8">
            <h3 class="font-bold text-slate-800 mb-4">Cari Talent</h3>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                <select id="f-gender" class="bg-slate-50 border-none rounded-xl p-3 text-xs font-bold">
                    <option value="">Semua Gender</option>
                    <option value="male">Pria</option>
                    <option value="female">Wanita</option>
                </select>
                <input type="number" id="f-age-min" placeholder="Min Umur" class="bg-slate-50 border-none rounded-xl p-3 text-xs font-bold">
                <input type="number" id="f-age-max" placeholder="Max Umur" class="bg-slate-50 border-none rounded-xl p-3 text-xs font-bold">
                <button onclick="window.searchTalent()" class="bg-blue-600 text-white rounded-xl font-black text-xs">Cari</button>
            </div>
        </div>
        <div id="search-results" class="grid grid-cols-2 md:grid-cols-5 gap-4"></div>
    </div>`;
}

export async function initEvents() {
    window.searchTalent = async () => {
        const g = document.getElementById('f-gender').value;
        const min = document.getElementById('f-age-min').value;
        const max = document.getElementById('f-age-max').value;
        
        const res = await apiGet(`/api/client/talent_search?gender=${g}&age_min=${min}&age_max=${max}`);
        const container = document.getElementById('search-results');
        
        if(res.ok && res.talents) {
            container.innerHTML = res.talents.map(t => `
                <div class="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 p-2">
                    <div class="aspect-square rounded-2xl bg-cover bg-center mb-3" style="background-image: url('${t.photo_url || '/assets/img/default.jpg'}')"></div>
                    <h4 class="font-bold text-slate-800 text-xs text-center">${t.full_name}</h4>
                    <p class="text-[10px] text-slate-400 text-center">${t.city} | ${t.age} thn</p>
                </div>
            `).join('');
        }
    };
    window.searchTalent();
}
