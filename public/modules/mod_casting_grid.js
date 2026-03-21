import { apiGet, apiPost } from "/assets/js/api.js";

export async function render() {
    return `
    <div class="p-4 md:p-8">
        <div class="mb-8">
            <h2 class="text-2xl font-black text-slate-800">Selection Grid</h2>
            <p class="text-sm text-slate-500">Pilih talent terbaik untuk proyek Anda</p>
        </div>

        <div id="casting-container" class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            </div>
    </div>`;
}

export async function initEvents(roleId) {
    const container = document.getElementById('casting-container');
    
    window.CastingAction = {
        update: async (appId, status) => {
            const res = await apiPost('/api/client/applications', { app_id: appId, status });
            if(res.ok) {
                document.getElementById(`app-${appId}`).style.opacity = '0.5';
                alert('Talent di-' + status);
            }
        }
    };

    try {
        const res = await apiGet(`/api/client/applications?role_id=${roleId}`);
        if(res.ok && res.applications.length > 0) {
            container.innerHTML = res.applications.map(app => `
                <div id="app-${app.id}" class="relative bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 group">
                    <div class="aspect-[3/4] bg-slate-200 bg-cover bg-center transition-transform group-hover:scale-105" 
                         style="background-image: url('${app.photo_url || '/assets/img/default-talent.jpg'}')">
                    </div>
                    
                    <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-4">
                        <h4 class="text-white font-bold text-sm leading-tight">${app.full_name}</h4>
                        <p class="text-white/60 text-[10px] mb-3">Status: ${app.status}</p>
                        
                        <div class="flex gap-2">
                            <button onclick="window.CastingAction.update('${app.id}', 'shortlisted')" class="flex-1 bg-blue-600 text-white py-2 rounded-xl text-[10px] font-bold">Lolos</button>
                            <button onclick="window.CastingAction.update('${app.id}', 'rejected')" class="flex-1 bg-white/20 backdrop-blur-md text-white py-2 rounded-xl text-[10px] font-bold">X</button>
                        </div>
                    </div>
                </div>
            `).join('');
        } else {
            container.innerHTML = `<div class="col-span-full py-20 text-center text-slate-400">Belum ada pelamar untuk role ini.</div>`;
        }
    } catch(e) { console.error(e); }
}
