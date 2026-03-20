import { apiGet } from "/assets/js/api.js";

export async function render() {
    return `
    <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 min-h-[75vh]">
        <div class="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
            <h2 class="text-xl font-bold text-gray-800"><i class="fa-solid fa-bell text-blue-500 mr-2"></i> Kotak Masuk</h2>
            <button class="text-[12px] font-bold text-blue-600 hover:underline">Tandai semua dibaca</button>
        </div>
        <div id="notif-container" class="space-y-3">
            <div class="py-20 text-center"><i class="fa-solid fa-spinner fa-spin text-3xl text-gray-300"></i></div>
        </div>
    </div>
    `;
}

export async function initEvents() {
    const container = document.getElementById('notif-container');
    try {
        const res = await apiGet("/api/notifications");
        
        // GRACEFUL EMPTY STATE: Jika error / kosong, jangan tampilkan tulisan "Sistem Offline"
        if (!res.ok || !res.data || res.data.length === 0 || res.data.items?.length === 0) {
            container.innerHTML = `
                <div class="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                    <div class="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                        <i class="fa-regular fa-bell-slash text-3xl text-gray-300"></i>
                    </div>
                    <h3 class="text-[14px] font-bold text-gray-700">Belum Ada Notifikasi</h3>
                    <p class="text-[12px] text-gray-500 mt-1">Kotak masuk Anda masih kosong.</p>
                </div>
            `;
            return;
        }

        const items = res.data.items || res.data;
        container.innerHTML = items.map(n => `
            <div class="p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer flex gap-4 items-start">
                <div class="w-10 h-10 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center flex-shrink-0"><i class="fa-solid fa-info"></i></div>
                <div>
                    <h4 class="text-[13px] font-bold text-gray-800">${n.title || 'Informasi'}</h4>
                    <p class="text-[12px] text-gray-500 mt-0.5">${n.message || n.body || ''}</p>
                    <span class="text-[10px] text-gray-400 font-bold mt-2 block">${new Date(n.created_at || Date.now()).toLocaleDateString('id-ID')}</span>
                </div>
            </div>
        `).join('');

    } catch(e) {
        container.innerHTML = `
            <div class="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                <i class="fa-regular fa-bell-slash text-4xl text-gray-300 mb-3"></i>
                <h3 class="text-[14px] font-bold text-gray-700">Tidak Ada Pemberitahuan</h3>
            </div>
        `;
    }
}
