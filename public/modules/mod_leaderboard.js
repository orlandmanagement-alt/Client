import { apiGet } from "/assets/js/api.js";

export async function render() {
    return `
    <div class="p-6 max-w-2xl mx-auto space-y-8">
        <div class="text-center space-y-2">
            <div class="inline-block bg-amber-100 text-amber-600 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                <i class="fa-solid fa-trophy mr-1"></i> Orland Top Performers
            </div>
            <h2 class="text-3xl font-black text-slate-800 tracking-tight">Leaderboard</h2>
            <p class="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Talent terbaik bulan ini di Malang</p>
        </div>

        <div id="leaderboard-list" class="space-y-4">
            </div>
    </div>`;
}

export async function initEvents() {
    const container = document.getElementById('leaderboard-list');
    
    try {
        const res = await apiGet('/api/talent/leaderboard');
        if(res.ok && res.leaderboard.length > 0) {
            container.innerHTML = res.leaderboard.map((t, index) => `
                <div onclick="location.hash='#talent?id=${t.user_id}'" 
                     class="bg-white p-5 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center gap-5 transition-all hover:scale-[1.02] cursor-pointer">
                    
                    <div class="w-12 h-12 flex items-center justify-center font-black text-xl 
                         ${index === 0 ? 'text-amber-500' : index === 1 ? 'text-slate-400' : index === 2 ? 'text-amber-700' : 'text-slate-200'}">
                        ${index + 1}
                    </div>

                    <div class="flex-1">
                        <h4 class="text-sm font-black text-slate-800">${t.full_name}</h4>
                        <p class="text-[9px] text-slate-400 font-bold uppercase tracking-widest">${t.city}</p>
                    </div>

                    <div class="text-right">
                        <div class="text-xs font-black text-slate-800">${t.total_projects} Proyek</div>
                        <div class="flex items-center justify-end gap-1 text-[10px] text-amber-500 font-black">
                            <i class="fa-solid fa-star text-[8px]"></i> ${t.avg_rating ? t.avg_rating.toFixed(1) : '5.0'}
                        </div>
                    </div>
                </div>
            `).join('');
        } else {
            container.innerHTML = '<div class="text-center py-20 text-slate-300 font-bold italic">Belum ada data kompetisi...</div>';
        }
    } catch(e) { console.error(e); }
}
