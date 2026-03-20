import { apiGet } from "/assets/js/api.js";
export async function render() {
    return `<div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 min-h-[80vh]"><h2 class="text-xl font-bold text-slate-800 mb-6 border-b border-slate-100 pb-4"><i class="fa-solid fa-calendar-check text-green-500 mr-2"></i> Manajemen Pesanan</h2><div id="booking-container"></div></div>`;
}
export async function initEvents() {
    document.getElementById('booking-container').innerHTML = `<div class="flex flex-col items-center py-20 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200"><i class="fa-solid fa-file-signature text-4xl text-slate-300 mb-3"></i><h3 class="text-[14px] font-bold text-slate-700">Belum Ada Pesanan</h3><p class="text-[12px] text-slate-500">Anda belum memiliki kontrak kerja aktif dengan talent.</p></div>`;
}
