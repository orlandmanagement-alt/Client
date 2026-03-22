import { apiGet } from "/assets/js/api.js";

export async function render() {
    return `
    <div class="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200 min-h-[80vh] relative">
        <h2 class="text-xl font-bold text-slate-800 mb-6 border-b border-slate-100 pb-4"><i class="fa-solid fa-wallet text-blue-600 mr-2"></i> Dompet Poin Klien</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div class="md:col-span-2 bg-gradient-to-br from-blue-700 to-blue-900 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
                <i class="fa-brands fa-gg-circle absolute -right-6 -bottom-6 text-8xl text-white/10"></i>
                <p class="text-[11px] font-bold text-blue-200 uppercase tracking-widest mb-1">Saldo Orland Point</p>
                <div class="flex items-end gap-2">
                    <h3 class="text-4xl font-black tracking-tight" id="wallet-balance">0</h3>
                    <span class="text-sm font-bold text-blue-300 mb-1">Poin</span>
                </div>
                <p class="text-[11px] text-blue-200 mt-2">1 Poin = Rp 1 (Setara Mata Uang Rupiah)</p>
            </div>
            
            <div class="flex flex-col gap-3">
                <button onclick="document.getElementById('modal-topup').classList.replace('hidden','flex')" class="flex-1 bg-blue-50 text-blue-600 border border-blue-200 rounded-xl flex flex-col items-center justify-center p-4 hover:bg-blue-100 transition-colors group">
                    <i class="fa-solid fa-bolt text-2xl mb-2 group-hover:scale-110 transition-transform"></i>
                    <span class="text-[12px] font-bold uppercase tracking-wider">Beli Poin (Top-Up)</span>
                </button>
            </div>
        </div>

        <div>
            <h3 class="text-[14px] font-bold text-slate-800 mb-4">Riwayat Transaksi</h3>
            <div id="trx-container" class="space-y-3">
                <div class="flex flex-col items-center justify-center py-12 bg-slate-50 rounded-xl border border-slate-100">
                    <i class="fa-solid fa-receipt text-4xl text-slate-300 mb-3"></i>
                    <h3 class="text-[13px] font-bold text-slate-700">Belum Ada Transaksi</h3>
                    <p class="text-[11px] text-slate-500 mt-1">Riwayat pengisian dan pemakaian poin Anda akan muncul di sini.</p>
                </div>
            </div>
        </div>

        <div id="modal-topup" class="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-[60] hidden items-center justify-center p-4">
            <div class="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl">
                <div class="flex justify-between items-center mb-6">
                    <h3 class="text-lg font-black text-slate-800">Top-Up Poin</h3>
                    <button onclick="document.getElementById('modal-topup').classList.replace('flex','hidden')" class="w-8 h-8 bg-slate-100 rounded-full text-slate-500 hover:bg-red-100 hover:text-red-500 flex items-center justify-center"><i class="fa-solid fa-xmark"></i></button>
                </div>
                
                <div class="space-y-4">
                    <div>
                        <label class="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Metode Pembayaran</label>
                        <select class="w-full border border-slate-200 rounded-xl py-3 px-4 outline-none text-[13px] font-bold bg-slate-50 focus:border-blue-500">
                            <option>BCA Virtual Account</option><option>Mandiri Virtual Account</option><option>QRIS (GoPay/OVO/Dana)</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Nominal Poin (Rp)</label>
                        <input type="number" id="tu-amount" class="w-full border border-slate-200 rounded-xl py-3 px-4 outline-none text-[13px] font-bold bg-slate-50 focus:border-blue-500" placeholder="Contoh: 500000">
                    </div>
                    <div>
                        <label class="block text-[11px] font-bold text-blue-500 uppercase tracking-wider mb-1.5"><i class="fa-solid fa-lock"></i> Masukkan PIN Keamanan</label>
                        <input type="password" id="tu-pin" maxlength="6" class="w-full border border-blue-200 rounded-xl py-3 px-4 outline-none text-[16px] font-black tracking-[0.5em] text-center bg-blue-50 focus:border-blue-500" placeholder="••••••">
                    </div>
                    <button onclick="alert('Memproses Top-Up... Mohon selesaikan pembayaran di Virtual Account Anda.'); document.getElementById('modal-topup').classList.replace('flex','hidden');" class="w-full bg-blue-600 text-white font-black py-3.5 rounded-xl shadow-lg hover:bg-blue-700 mt-2 active:scale-95 transition-transform">Lanjutkan Pembayaran</button>
                </div>
            </div>
        </div>
    </div>
    `;
}
export async function initEvents() {
    // API Fetch Dompet (Jika error, biarkan 0, jangan tampilkan tulisan error)
    try {
        const res = await apiGet('/functions/api/client/wallet');
        if(res.ok && res.data) {
            document.getElementById('wallet-balance').textContent = parseInt(res.data.balance || 0).toLocaleString('id-ID');
        }
    } catch(e) {}
}
