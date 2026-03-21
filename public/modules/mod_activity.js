import { apiGet } from "/assets/js/api.js";

export async function render() {
    return `
    <div class="p-6 max-w-2xl mx-auto space-y-8">
        <div class="flex items-center justify-between px-2">
            <h2 class="text-2xl font-black text-slate-800 tracking-tight">Eksplorasi</h2>
            <div class="flex gap-2 text-[8px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 px-4 py-2 rounded-full border border-blue-100">
                <i class="fa-solid fa-bolt-lightning animate-pulse"></i> Update Real-time
            </div>
        </div>

        <div id="feed-container" class="space-y-12">
            </div>
    </div>`;
}

export async function initEvents() {
    const container = document.getElementById('feed-container');
    
    try {
        const res = await apiGet('/api/client/activity_feed');
        if(res.ok && res.feed.length > 0) {
            container.innerHTML = res.feed.map(item => `
                <div class="space-y-4">
                    <div class="flex items-center gap-3 px-2">
                        <div class="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center text-[10px] text-white font-black">
                            ${item.full_name.charAt(0)}
                        </div>
                        <div>
                            <h4 class="text-xs font-black text-slate-800">${item.full_name}</h4>
                            <p class="text-[9px] text-slate-400 font-bold uppercase tracking-widest">${item.city} • Baru saja mengupload foto</p>
                        </div>
                    </div>
                    
                    <div class="aspect-square rounded-[3rem] bg-cover bg-center shadow-2xl shadow-slate-200 border border-slate-100" 
                         style="background-image: url('${item.public_url}')">
                    </div>
                    
                    <div class="flex gap-4 px-4 pt-2">
                        <button onclick="location.hash='#talent?id=${item.user_id}'" 
                                class="bg-slate-900 text-white px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest active:scale-95 transition-all">
                            Lihat Profil
                        </button>
                    </div>
                </div>
            `).join('');
        } else {
            container.innerHTML = '<div class="text-center text-slate-300 py-20 font-bold italic">Belum ada aktivitas terbaru...</div>';
        }
    } catch(e) { console.error(e); }
}
