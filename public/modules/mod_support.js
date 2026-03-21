import { apiPost } from "/assets/js/api.js";

export async function render() {
    return `
    <div class="p-6 max-w-lg mx-auto space-y-8">
        <div class="text-center">
            <h2 class="text-2xl font-black text-slate-800 tracking-tight">Pusat Bantuan</h2>
            <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Ada kendala? Kami siap membantu.</p>
        </div>

        <div class="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm space-y-4">
            <div>
                <label class="text-[10px] font-black text-slate-400 uppercase mb-2 block px-2">Kategori Masalah</label>
                <select id="s-category" class="w-full bg-slate-50 border-none rounded-2xl p-4 text-xs font-bold outline-none ring-blue-500/10 focus:ring-4">
                    <option value="technical">Masalah Teknis / App</option>
                    <option value="payment">Pembayaran / Saldo</option>
                    <option value="casting">Proses Casting</option>
                    <option value="other">Lainnya</option>
                </select>
            </div>

            <div>
                <label class="text-[10px] font-black text-slate-400 uppercase mb-2 block px-2">Subjek</label>
                <input type="text" id="s-subject" placeholder="Contoh: Gagal upload foto" class="w-full bg-slate-50 border-none rounded-2xl p-4 text-xs font-bold outline-none ring-blue-500/10 focus:ring-4">
            </div>

            <div>
                <label class="text-[10px] font-black text-slate-400 uppercase mb-2 block px-2">Pesan Detail</label>
                <textarea id="s-message" rows="5" class="w-full bg-slate-50 border-none rounded-3xl p-4 text-xs font-bold outline-none ring-blue-500/10 focus:ring-4" placeholder="Jelaskan kendala Anda selengkap mungkin..."></textarea>
            </div>

            <button onclick="window.submitTicket()" class="w-full bg-slate-900 text-white py-4 rounded-[2rem] font-black text-[10px] uppercase shadow-xl active:scale-95 transition-all">
                Kirim Laporan
            </button>
        </div>

        <div class="flex items-center gap-4 bg-blue-50 p-6 rounded-[2.5rem] border border-blue-100">
            <div class="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shrink-0">
                <i class="fa-brands fa-whatsapp"></i>
            </div>
            <div>
                <h4 class="text-[10px] font-black text-blue-900 uppercase">Emergency?</h4>
                <p class="text-[11px] text-blue-600 font-bold">Hubungi Admin Orland via WhatsApp</p>
            </div>
        </div>
    </div>`;
}

export async function initEvents() {
    window.submitTicket = async () => {
        const payload = {
            category: document.getElementById('s-category').value,
            subject: document.getElementById('s-subject').value,
            message: document.getElementById('s-message').value
        };

        if(!payload.subject || !payload.message) return alert("Mohon lengkapi data!");

        const res = await apiPost('/api/support/ticket_create', payload);
        if(res.ok) {
            alert(res.message);
            location.hash = '#dashboard';
        }
    };
}
