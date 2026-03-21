import { apiGet, apiPost } from "/assets/js/api.js";

export async function render() {
    return `
    <div class="p-6 max-w-2xl mx-auto">
        <div class="flex justify-between items-center mb-8">
            <h2 class="text-2xl font-black text-slate-800">Notifikasi</h2>
            <span id="notif-count" class="bg-red-500 text-white text-[10px] font-black px-2.5 py-1 rounded-full hidden">0 NEW</span>
        </div>
        
        <div id="notif-list" class="space-y-4">
            <div class="py-20 text-center text-slate-300">
                <i class="fa-solid fa-bell-slash text-4xl mb-3"></i>
                <p class="text-xs">Tidak ada pemberitahuan baru</p>
            </div>
        </div>
    </div>`;
}

export async function initEvents() {
    const container = document.getElementById('notif-list');
    const badge = document.getElementById('notif-count');

    window.readNotif = async (id, url) => {
        await apiPost('/api/notifications_read', { id });
        if(url) window.location.hash = url;
        else window.location.reload();
    };

    try {
        const res = await apiGet('/api/notifications');
        if(res.ok && res.notifications.length > 0) {
            const unread = res.notifications.filter(n => !n.is_read).length;
            if(unread > 0) {
                badge.textContent = `${unread} BARU`;
                badge.classList.remove('hidden');
            }

            container.innerHTML = res.notifications.map(n => `
                <div onclick="window.readNotif('${n.id}', '${n.link_url}')" 
                     class="p-5 rounded-[2rem] border transition-all cursor-pointer flex gap-4 
                     ${n.is_read ? 'bg-white border-slate-100 opacity-60' : 'bg-blue-50/50 border-blue-100 shadow-sm'}">
                    <div class="w-10 h-10 rounded-2xl flex items-center justify-center 
                         ${n.type === 'success' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}">
                        <i class="fa-solid ${n.type === 'success' ? 'fa-check' : 'fa-bell'}"></i>
                    </div>
                    <div class="flex-1">
                        <h4 class="text-xs font-black text-slate-800 mb-1">${n.title}</h4>
                        <p class="text-[11px] text-slate-500 leading-relaxed">${n.message}</p>
                        <p class="text-[9px] text-slate-400 mt-2 font-bold uppercase tracking-widest">
                            ${new Date(n.created_at * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </p>
                    </div>
                </div>
            `).join('');
        }
    } catch(e) { console.error(e); }
}
