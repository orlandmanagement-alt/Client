import { apiGet } from "/assets/js/api.js";

export async function render() {
  return `
    <div class="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 min-h-[80vh]">
        <h2 class="text-2xl font-black text-gray-800 mb-6"><i class="fa-solid fa-wallet text-gray-900 mr-2"></i> Dompet Poin Klien</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div class="md:col-span-1 bg-gradient-to-br from-gray-900 to-black rounded-3xl p-6 text-white shadow-xl relative overflow-hidden h-fit">
                <div class="absolute -right-6 -bottom-6 text-yellow-500 opacity-20 text-8xl"><i class="fa-solid fa-coins"></i></div>
                <div class="relative z-10">
                    <p class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Saldo Orland Point (OP)</p>
                    <h3 class="text-5xl font-black text-yellow-400 mb-1" id="w_balance"><i class="fa-solid fa-spinner fa-spin text-2xl"></i></h3>
                    <p class="text-[10px] text-gray-400 mb-6">1 OP = Rp 1.000</p>
                    
                    <button onclick="window.ClientWallet.topup()" class="w-full bg-yellow-400 text-black font-black py-3 rounded-xl hover:bg-yellow-500 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(251,191,36,0.3)]">
                        <i class="fa-solid fa-plus-circle"></i> Beli Poin (Top-Up)
                    </button>
                </div>
            </div>

            <div class="md:col-span-2 bg-gray-50 rounded-3xl p-6 border border-gray-200">
                <h4 class="font-black text-gray-800 mb-4 border-b border-gray-200 pb-3"><i class="fa-solid fa-clock-rotate-left mr-2"></i> Riwayat Transaksi</h4>
                <div id="w_history" class="space-y-3">
                    <div class="text-center py-10"><i class="fa-solid fa-spinner fa-spin text-gray-400 text-3xl"></i></div>
                </div>
            </div>

        </div>

        <div class="mt-8 pt-8 border-t border-gray-100">
            <h4 class="font-black text-gray-800 mb-4">Pilih Paket Poin</h4>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div class="border border-gray-200 rounded-2xl p-5 text-center hover:border-yellow-400 hover:shadow-md transition-all bg-white cursor-pointer" onclick="window.ClientWallet.requestTopup(100, 100000)">
                    <div class="text-3xl text-yellow-400 mb-2"><i class="fa-solid fa-coins"></i></div>
                    <h5 class="font-black text-xl text-gray-800">100 OP</h5>
                    <p class="text-xs text-gray-500 font-bold bg-gray-100 py-1 rounded mt-2">Rp 100.000</p>
                </div>
                <div class="border-2 border-gray-900 rounded-2xl p-5 text-center hover:shadow-lg transition-all bg-gray-50 cursor-pointer relative" onclick="window.ClientWallet.requestTopup(500, 480000)">
                    <span class="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-red-500 text-white text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-wider">Terlaris (Diskon)</span>
                    <div class="text-4xl text-yellow-400 mb-2"><i class="fa-solid fa-coins"></i></div>
                    <h5 class="font-black text-2xl text-gray-900">500 OP</h5>
                    <p class="text-xs text-gray-500 font-bold bg-gray-200 py-1 rounded mt-2">Rp 480.000</p>
                </div>
                <div class="border border-gray-200 rounded-2xl p-5 text-center hover:border-yellow-400 hover:shadow-md transition-all bg-white cursor-pointer" onclick="window.ClientWallet.requestTopup(1000, 950000)">
                    <div class="text-3xl text-yellow-400 mb-2"><i class="fa-solid fa-sack-dollar"></i></div>
                    <h5 class="font-black text-xl text-gray-800">1000 OP</h5>
                    <p class="text-xs text-gray-500 font-bold bg-gray-100 py-1 rounded mt-2">Rp 950.000</p>
                </div>
            </div>
        </div>
    </div>
  `;
}

export async function initEvents() {
    window.ClientWallet = {
        topup: () => {
            alert("Silakan pilih paket poin di bawah untuk melanjutkan pembayaran.");
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        },
        requestTopup: async (op, price) => {
            // Karena ini MVP, kita arahkan ke WhatsApp Admin Orland Management
            // Di masa depan, fungsi ini memanggil API Midtrans/Xendit
            const { state } = await import("/assets/js/state.js");
            const clientName = state?.user?.full_name || 'Klien';
            
            const message = `Halo Admin Orland!%0A%0ASaya ingin melakukan Top-Up Saldo Klien:%0ANama: ${clientName}%0APaket: *${op} OP*%0AHarga: *Rp ${price.toLocaleString('id-ID')}*%0A%0AMohon info nomor rekening pembayarannya. Terima kasih!`;
            const waNumber = "6281234567890"; // GANTI DENGAN NOMOR WA ADMIN ANDA
            
            window.open(`https://wa.me/${waNumber}?text=${message}`, '_blank');
        }
    };

    const res = await apiGet("/functions/api/wallet/info");
    if(res.ok && res.data) {
        document.getElementById("w_balance").textContent = res.data.balance;
        
        const historyContainer = document.getElementById("w_history");
        if(res.data.history.length === 0) {
            historyContainer.innerHTML = `<p class="text-center text-xs text-gray-400 font-bold py-6">Belum ada riwayat transaksi.</p>`;
        } else {
            historyContainer.innerHTML = res.data.history.map(h => {
                const isPlus = h.trx_type === 'topup' || h.trx_type === 'earn';
                const sign = isPlus ? '+' : '-';
                const color = isPlus ? 'text-green-500 bg-green-50' : 'text-red-500 bg-red-50';
                const icon = isPlus ? 'fa-arrow-turn-down' : 'fa-arrow-turn-up';
                const dateStr = new Date(h.created_at * 1000).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
                
                return `
                <div class="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-100">
                    <div class="flex items-center gap-3">
                        <div class="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black ${color}"><i class="fa-solid ${icon}"></i></div>
                        <div>
                            <p class="text-xs font-bold text-gray-800">${h.note || 'Transaksi Sistem'}</p>
                            <p class="text-[9px] text-gray-400 font-bold uppercase">${dateStr}</p>
                        </div>
                    </div>
                    <div class="font-black ${isPlus ? 'text-green-600' : 'text-red-600'}">${sign}${h.amount} OP</div>
                </div>
                `;
            }).join("");
        }
    } else {
        document.getElementById("w_balance").textContent = "ERR";
        document.getElementById("w_history").innerHTML = `<p class="text-center text-red-500 font-bold py-6">Gagal memuat dompet.</p>`;
    }
}
