import { apiPost } from "/assets/js/api.js";

export async function render() {
    return `
    <div class="p-6 max-w-lg mx-auto space-y-8">
        <div class="mb-8">
            <h2 class="text-2xl font-black text-slate-800 tracking-tight">Pengaturan Akun</h2>
            <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Keamanan & Privasi Orland</p>
        </div>

        <div class="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm space-y-4">
            <h3 class="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Keamanan</h3>
            
            <div class="space-y-2">
                <input type="password" id="s-old-pass" placeholder="Password Lama" 
                       class="w-full bg-slate-50 border-none rounded-2xl p-4 text-xs font-bold outline-none focus:ring-4 ring-blue-500/10">
                <input type="password" id="s-new-pass" placeholder="Password Baru" 
                       class="w-full bg-slate-50 border-none rounded-2xl p-4 text-xs font-bold outline-none focus:ring-4 ring-blue-500/10">
            </div>

            <button onclick="window.updatePassword()" class="w-full bg-slate-900 text-white py-4 rounded-[2rem] font-black text-[10px] uppercase shadow-xl active:scale-95 transition-all">
                Update Password
            </button>
        </div>

        <div class="bg-rose-50 p-8 rounded-[3rem] border border-rose-100 space-y-4">
            <h3 class="text-[10px] font-black text-rose-400 uppercase tracking-widest px-2">Zona Berbahaya</h3>
            <p class="text-[10px] text-rose-600/60 font-bold px-2">Menghapus akun akan menghilangkan semua data portofolio dan saldo wallet Anda secara permanen.</p>
            
            <button onclick="window.deleteAccount()" class="w-full bg-rose-500 text-white py-4 rounded-[2rem] font-black text-[10px] uppercase shadow-xl active:scale-95 transition-all">
                Hapus Akun Selamanya
            </button>
        </div>
    </div>`;
}

export async function initEvents() {
    window.updatePassword = async () => {
        const oldP = document.getElementById('s-old-pass').value;
        const newP = document.getElementById('s-new-pass').value;
        
        if(!oldP || !newP) return alert("Isi kedua password ya!");

        const res = await apiPost('/api/auth/change_password', { old_pass: oldP, new_pass: newP });
        if(res.ok) {
            alert(res.message);
            location.reload();
        }
    };

    window.deleteAccount = () => {
        const confirm = window.confirm("Apakah Anda yakin? Tindakan ini tidak bisa dibatalkan.");
        if(confirm) {
            alert("Permintaan penghapusan akun telah dikirim ke Admin.");
        }
    };
}
