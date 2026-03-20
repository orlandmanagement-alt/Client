import { apiGet, apiPost } from "/assets/js/api.js";
import { notify } from "/assets/js/notify.js";

// =========================================================
// 1. TAMPILAN HTML MODUL (RENDER)
// =========================================================
export async function render() {
    return `
    <div class="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-200 min-h-[80vh]">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 border-b border-slate-100 pb-6 gap-4">
            <div>
                <h2 class="text-2xl font-black text-blue-600 tracking-tight"><i class="fa-solid fa-calendar-check mr-2"></i> Manajemen Pesanan</h2>
                <p class="text-sm text-slate-500 mt-1">Pantau status kontrak kerja dan jadwal talent yang Anda sewa.</p>
            </div>
            
            <div class="flex bg-slate-100 p-1 rounded-xl w-full md:w-auto">
                <button onclick="window.ClientBookings.filter('all')" id="btn-filter-all" class="filter-btn active flex-1 md:flex-none px-4 py-2 bg-white shadow-sm rounded-lg text-xs font-black text-blue-600 transition-all">Semua</button>
                <button onclick="window.ClientBookings.filter('active')" id="btn-filter-active" class="filter-btn flex-1 md:flex-none px-4 py-2 rounded-lg text-xs font-bold text-slate-500 hover:text-slate-800 transition-all">Aktif</button>
                <button onclick="window.ClientBookings.filter('completed')" id="btn-filter-completed" class="filter-btn flex-1 md:flex-none px-4 py-2 rounded-lg text-xs font-bold text-slate-500 hover:text-slate-800 transition-all">Selesai</button>
            </div>
        </div>

        <div id="bookings-container" class="flex flex-col gap-4 fade-in">
            <div class="py-20 text-center">
                <i class="fa-solid fa-circle-notch fa-spin text-4xl text-blue-500"></i>
                <p class="text-sm font-bold text-slate-400 mt-4 uppercase tracking-widest">Memuat Data Pesanan...</p>
            </div>
        </div>
    </div>
    `;
}

// =========================================================
// 2. LOGIKA JAVASCRIPT MODUL (EVENTS)
// =========================================================
export async function initEvents() {
    let allBookings = []; // Menyimpan data asli dari server

    window.ClientBookings = {
        fetchData: async () => {
            const container = document.getElementById("bookings-container");
            
            // Memanggil API backend (sesuai struktur endpoint Anda)
            const res = await apiGet("/api/client/project_bookings");
            
            if (!res.ok) {
                container.innerHTML = `<div class="p-8 text-center text-red-500 font-bold border-2 border-dashed border-red-200 rounded-2xl bg-red-50"><i class="fa-solid fa-triangle-exclamation text-3xl mb-2"></i><br>Gagal memuat data pesanan.</div>`;
                return;
            }

            allBookings = res.data?.items || res.data || [];
            window.ClientBookings.renderList(allBookings);
        },

        filter: (status) => {
            // Ubah tampilan tombol filter
            document.querySelectorAll('.filter-btn').forEach(btn => {
                btn.className = "filter-btn flex-1 md:flex-none px-4 py-2 rounded-lg text-xs font-bold text-slate-500 hover:text-slate-800 transition-all";
            });
            const activeBtn = document.getElementById(`btn-filter-${status}`);
            if(activeBtn) activeBtn.className = "filter-btn active flex-1 md:flex-none px-4 py-2 bg-white shadow-sm rounded-lg text-xs font-black text-blue-600 transition-all";

            // Saring data
            if (status === 'all') {
                window.ClientBookings.renderList(allBookings);
            } else {
                const filtered = allBookings.filter(b => b.status === status);
                window.ClientBookings.renderList(filtered);
            }
        },

        renderList: (dataToRender) => {
            const container = document.getElementById("bookings-container");

            if (dataToRender.length === 0) {
                container.innerHTML = `
                    <div class="flex flex-col items-center justify-center text-slate-400 py-20 border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50">
                        <i class="fa-solid fa-file-contract text-6xl mb-4 text-slate-300"></i>
                        <p class="font-black text-lg text-slate-600">Belum Ada Pesanan</p>
                        <p class="text-sm font-medium mt-1">Anda belum memiliki kontrak kerja atau pesanan talent di kategori ini.</p>
                    </div>
                `;
                return;
            }

            container.innerHTML = dataToRender.map(b => {
                // Konfigurasi Badge Status
                let statusBadge = `<span class="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-black uppercase tracking-wider border border-slate-200">${b.status || 'Menunggu'}</span>`;
                if(b.status === 'active' || b.status === 'approved') statusBadge = `<span class="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-[10px] font-black uppercase tracking-wider border border-blue-200">Sedang Berjalan</span>`;
                if(b.status === 'completed') statusBadge = `<span class="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-[10px] font-black uppercase tracking-wider border border-green-200">Selesai</span>`;
                if(b.status === 'cancelled') statusBadge = `<span class="px-3 py-1 bg-red-100 text-red-700 rounded-lg text-[10px] font-black uppercase tracking-wider border border-red-200">Dibatalkan</span>`;

                return `
                <div class="flex flex-col md:flex-row items-start md:items-center justify-between p-5 bg-white border border-slate-200 rounded-2xl hover:shadow-lg transition-all duration-300 gap-4 group">
                    <div class="flex items-center gap-4 w-full md:w-auto">
                        <div class="w-14 h-14 bg-slate-50 text-blue-500 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 group-hover:scale-110 transition-transform border border-slate-100">
                            <i class="fa-solid fa-file-signature"></i>
                        </div>
                        <div>
                            <div class="flex items-center gap-2 mb-1">
                                <h3 class="font-black text-slate-800 text-lg leading-tight">${b.project_title || 'Nama Proyek'}</h3>
                                ${statusBadge}
                            </div>
                            <p class="text-sm font-bold text-slate-500"><i class="fa-solid fa-user-tie text-slate-400 mr-1"></i> ${b.talent_name || 'Nama Talent'}</p>
                        </div>
                    </div>
                    
                    <div class="flex flex-col md:items-end w-full md:w-auto gap-2 border-t md:border-t-0 border-slate-100 pt-3 md:pt-0">
                        <p class="text-xs text-slate-400 font-bold"><i class="fa-solid fa-calendar text-slate-300 mr-1"></i> Dipesan: ${b.created_at ? new Date(b.created_at).toLocaleDateString('id-ID') : '-'}</p>
                        <button class="w-full md:w-auto px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-lg hover:bg-black transition-colors shadow-sm">
                            Lihat Detail
                        </button>
                    </div>
                </div>
                `;
            }).join("");
        }
    };

    // Jalankan pengambilan data saat modul pertama kali dimuat
    window.ClientBookings.fetchData();
}
