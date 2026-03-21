import { apiGet, apiPost } from "/assets/js/api.js";

export async function render() {
    return `
    <div class="p-6 space-y-6 max-w-lg mx-auto">
        <div class="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden">
            <div class="relative z-10">
                <p class="text-[10px] font-black opacity-40 uppercase tracking-[0.2em] mb-2">Total Saldo Orland</p>
                <h2 id="w-balance" class="text-4xl font-black mb-6 text-emerald-400">Rp 0</h2>
                <div class="flex gap-3">
                    <button onclick="window.openWalletModal('topup')" class="flex-1 bg-white/10 backdrop-blur-md py-3 rounded-2xl text-[10px] font-black uppercase hover:bg-white/20 transition-all">Top Up</button>
                    <button onclick="window.openWalletModal('withdraw')" class="flex-1 bg-white/10 backdrop-blur-md py-3 rounded-2xl text-[10px] font-black uppercase hover:bg-white/20 transition-all">Tarik Dana</button>
                </div>
            </div>
            <i class="fa-solid fa-vault absolute -right-4 -bottom-4 text-8xl opacity-10 rotate-12"></i>
        </div>

        <div class="space-y-4">
            <h3 class="text-sm font-black text-slate-800 uppercase tracking-widest px-2">Aktivitas Terakhir</h3>
            <div id="w-history" class="space-y-3">
                </div>
        </div>

        <div id="modal-wallet" class="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-[9999] hidden flex items-center justify-center p-4">
            <div class="bg-white w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl">
                <h3 id="modal-title" class="text-xl font-black text-slate-800 mb-6 uppercase text-center">Wallet Action</h3>
                <div class="space-y-4">
                    <input type="number" id="w-amount" placeholder="Nominal (Rp)" class="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold outline-none focus:ring-2 ring-emerald-500/20">
                    <input type="text" id="w-bank" placeholder="Nama Bank" class="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold">
                    <input type="text" id="w-acc-num" placeholder="Nomor Rekening" class="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold">
                    <input type="text" id="w-acc-name" placeholder="Nama Pemilik Rekening" class="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold">
                    <button onclick="window.submitWalletReq()" class="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-xs uppercase shadow-lg">Kirim Permintaan</button>
                    <button onclick="window.closeWalletModal()" class="w-full text-slate-400 text-[10px] font-black uppercase">Batalkan</button>
                </div>
            </div>
        </div>
    </div>`;
}

export async function initEvents() {
    let currentType = 'topup';

    window.openWalletModal = (type) => {
        currentType = type;
        document.getElementById('modal-title').textContent = type === 'topup' ? 'Top Up Saldo' : 'Tarik Dana';
        document.getElementById('modal-wallet').classList.remove('hidden');
    };

    window.closeWalletModal = () => document.getElementById('modal-wallet').classList.add('hidden');

    window.submitWalletReq = async () => {
        const payload = {
            type: currentType,
            amount: document.getElementById('w-amount').value,
            bank: document.getElementById('w-bank').value,
            acc_num: document.getElementById('w-acc-num').value,
            acc_name: document.getElementById('w-acc-name').value
        };
        const res = await apiPost('/api/wallet/request_create', payload);
        if(res.ok) {
            alert("Permintaan Terkirim!");
            window.closeWalletModal();
        }
    };

    const res = await apiGet('/api/wallet/info');
    if(res.ok) {
        document.getElementById('w-balance').textContent = `Rp ${res.balance.toLocaleString()}`;
        // Render history logic...
    }
}
