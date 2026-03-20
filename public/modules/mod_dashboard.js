export async function render() {
  return `
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      
      <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 transition-transform hover:-translate-y-1 hover:shadow-md">
        <div class="w-14 h-14 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center text-2xl"><i class="fa-solid fa-briefcase"></i></div>
        <div><p class="text-sm text-gray-500 font-medium mb-1">Proyek Aktif</p><h4 class="text-2xl font-bold text-gray-800">2</h4></div>
      </div>
      
      <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 transition-transform hover:-translate-y-1 hover:shadow-md">
        <div class="w-14 h-14 rounded-full bg-purple-50 text-purple-500 flex items-center justify-center text-2xl"><i class="fa-solid fa-users-viewfinder"></i></div>
        <div><p class="text-sm text-gray-500 font-medium mb-1">Total Pelamar</p><h4 class="text-2xl font-bold text-gray-800">145</h4></div>
      </div>

      <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 transition-transform hover:-translate-y-1 hover:shadow-md">
        <div class="w-14 h-14 rounded-full bg-green-50 text-green-500 flex items-center justify-center text-2xl"><i class="fa-solid fa-user-check"></i></div>
        <div><p class="text-sm text-gray-500 font-medium mb-1">Talent Dipekerjakan</p><h4 class="text-2xl font-bold text-gray-800">12</h4></div>
      </div>

      <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 transition-transform hover:-translate-y-1 hover:shadow-md">
        <div class="w-14 h-14 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center text-2xl"><i class="fa-solid fa-file-invoice-dollar"></i></div>
        <div><p class="text-sm text-gray-500 font-medium mb-1">Total Pengeluaran</p><h4 class="text-2xl font-bold text-gray-800">Rp 0</h4></div>
      </div>

    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <h3 class="text-lg font-bold mb-4 text-gray-800 border-b border-gray-100 pb-2">Lamaran Terbaru</h3>
        <div class="flex flex-col items-center justify-center text-gray-400 py-10">
            <i class="fa-solid fa-inbox text-5xl mb-3 text-gray-200"></i>
            <p class="font-medium text-gray-500">Belum ada pelamar baru hari ini.</p>
        </div>
      </div>

      <div class="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <div class="flex justify-between items-center mb-4 border-b border-gray-100 pb-2">
            <h3 class="text-lg font-bold text-gray-800">Cari Talent (Rekomendasi)</h3>
            <button class="text-xs font-bold text-blue-500 hover:underline">Lihat Semua</button>
        </div>
        <div class="flex flex-col items-center justify-center text-gray-400 py-10">
            <i class="fa-solid fa-star text-5xl mb-3 text-gray-200"></i>
            <p class="font-medium text-gray-500">Sistem AI sedang mencocokkan talent untuk proyek Anda.</p>
        </div>
      </div>
    </div>
  `;
}
export async function initEvents() {
  // Logic untuk fetch API stats client ditaruh di sini nantinya
}
