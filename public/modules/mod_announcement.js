import { apiGet } from "/assets/js/api.js";

export async function render() {
    return `
    <div class="p-6 max-w-2xl mx-auto space-y-8">
        <div class="flex items-center justify-between px-2">
            <h2 class="text-2xl font-black text-slate-800 tracking-tight italic">Orland News</h2>
            <div class="w-10 h-10 bg-slate-900 text-white rounded-2xl flex items-center justify-center shadow-lg">
                <i class="fa-solid fa-bullhorn"></i>
            </div>
        </div>

        <div id="ann-list" class="space-y-6">
            </div>
    </div>`;
}

export async function initEvents() {
    const container = document.getElementById('ann-list');
    
    try {
        const res = await apiGet('/api/announcements_list');
        if(res.ok && res.data.length > 0) {
            container.innerHTML = res.data.map(ann => `
                <div class="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden group transition-all hover:shadow-xl">
                    ${ann.banner_url ? `<img src="${ann.banner_url}" class="w-full h-48 object-cover">` : ''}
                    <div class="p-8">
                        <div class="flex items-center gap-2 mb-4">
                            <span class="px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest 
                                ${ann.priority === 'urgent' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}">
                                ${ann.priority}
                            </span>
                            <span class="text-[9px] font-bold text-slate-300 uppercase italic">
                                ${new Date(ann.created_at * 1000).toLocaleDateString('id-ID', {day:'numeric', month:'long'})}
                            </span>
                        </div>
                        <h3 class="text-xl font-black text-slate-800 mb-3">${ann.title}</h3>
                        <p class="text-xs text-slate-500 leading-relaxed">${ann.content}</p>
                    </div>
                </div>
            `).join('');
        } else {
            container.innerHTML = '<div class="text-center py-20 text-slate-300 font-bold italic">Belum ada info terbaru...</div>';
        }
    } catch(e) { console.error(e); }
}
