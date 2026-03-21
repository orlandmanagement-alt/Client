import { apiGet } from "/assets/js/api.js";

export async function render() {
    return `
    <div class="p-6 max-w-2xl mx-auto space-y-8">
        <div class="bg-slate-900 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
            <div class="relative z-10">
                <h2 class="text-2xl font-black mb-2 tracking-tight">Data Vault</h2>
                <p class="text-xs text-white/40 font-bold uppercase tracking-widest mb-8">Cadangkan Seluruh Ekosistem Orland</p>
                
                <button onclick="window.downloadBackup()" class="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-900 py-4 rounded-2xl font-black text-xs uppercase shadow-lg transition-all active:scale-95">
                    <i class="fa-solid fa-cloud-arrow-down mr-2"></i> Unduh Cadangan JSON
                </button>
            </div>
            <i class="fa-solid fa-database absolute -right-6 -bottom-6 text-9xl opacity-10 rotate-12"></i>
        </div>

        <div class="bg-white p-8 rounded-[2.5rem] border border-slate-100">
            <h3 class="text-xs font-black text-slate-800 uppercase tracking-widest mb-4">Informasi Keamanan</h3>
            <ul class="space-y-3 text-[11px] text-slate-500 font-bold leading-relaxed">
                <li class="flex gap-3 items-start"><i class="fa-solid fa-circle-check text-emerald-500 mt-0.5"></i> Backup mencakup Profil Talent, Proyek, dan Transaksi.</li>
                <li class="flex gap-3 items-start"><i class="fa-solid fa-circle-check text-emerald-500 mt-0.5"></i> Data diunduh dalam format teks JSON standar.</li>
                <li class="flex gap-3 items-start"><i class="fa-solid fa-triangle-exclamation text-amber-500 mt-0.5"></i> Simpan file ini di tempat aman karena berisi data sensitif.</li>
            </ul>
        </div>
    </div>`;
}

export async function initEvents() {
    window.downloadBackup = async () => {
        const btn = event.currentTarget;
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-2"></i> Mengolah Data...';
        
        try {
            const res = await apiGet('/api/admin/backup_export');
            if(res.ok) {
                const blob = new Blob([JSON.stringify(res, null, 4)], { type: 'application/json' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `ORLAND_BACKUP_${new Date().toISOString().split('T')[0]}.json`;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                a.remove();
                alert("Cadangan berhasil diunduh!");
            }
        } catch(e) { 
            console.error(e);
            alert("Gagal mengunduh cadangan.");
        } finally {
            btn.innerHTML = '<i class="fa-solid fa-cloud-arrow-down mr-2"></i> Unduh Cadangan JSON';
        }
    };
}
