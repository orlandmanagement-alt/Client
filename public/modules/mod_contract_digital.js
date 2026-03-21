import { apiGet, apiPost } from "/assets/js/api.js";

export async function render(params) {
    return `
    <div class="p-6 max-w-2xl mx-auto space-y-8">
        <div class="text-center">
            <h2 class="text-2xl font-black text-slate-800 tracking-tight uppercase">Surat Perjanjian</h2>
            <p class="text-[9px] font-bold text-slate-400 uppercase tracking-[0.3em] mt-1 italic">Orland Management Digital Contract</p>
        </div>

        <div class="bg-white p-10 rounded-[4rem] shadow-2xl border border-slate-50 relative overflow-hidden">
            <div class="absolute top-0 right-0 p-8 opacity-10 rotate-12">
                <i class="fa-solid fa-file-signature text-8xl text-slate-900"></i>
            </div>

            <div id="contract-content" class="text-[11px] leading-relaxed text-slate-600 font-medium space-y-4 relative z-10">
                <p class="font-black text-slate-900">Pasal 1: Lingkup Kerja</p>
                <p>Talent setuju untuk melaksanakan pekerjaan pada proyek <span id="c-project-name" class="font-bold text-blue-600">...</span> sesuai arahan Client.</p>
                
                <p class="font-black text-slate-900">Pasal 2: Honorarium</p>
                <p>Pihak Client setuju membayar sebesar <span id="c-budget" class="font-bold text-emerald-600">...</span> yang akan dikelola melalui sistem Wallet Orland.</p>
                
                <hr class="border-slate-50 my-6">
                
                <div class="grid grid-cols-2 gap-8 pt-6">
                    <div class="text-center space-y-4">
                        <p class="text-[8px] font-black uppercase text-slate-400">Pihak Client</p>
                        <div id="sign-client" class="h-16 border-b-2 border-slate-100 flex items-center justify-center italic text-slate-300">Belum Tanda Tangan</div>
                    </div>
                    <div class="text-center space-y-4">
                        <p class="text-[8px] font-black uppercase text-slate-400">Pihak Talent</p>
                        <div id="sign-talent" class="h-16 border-b-2 border-slate-100 flex items-center justify-center italic text-slate-300">Belum Tanda Tangan</div>
                    </div>
                </div>
            </div>
        </div>

        <button id="btn-sign" class="w-full bg-slate-900 text-white py-5 rounded-[2.5rem] font-black text-[10px] uppercase shadow-xl hover:scale-[1.02] active:scale-95 transition-all">
            Tanda Tangan Sekarang
        </button>
    </div>`;
}

export async function initEvents(params) {
    const res = await apiGet(`/api/contract_detail?project_id=${params.projectId}`);
    if(res.ok && res.contract) {
        document.getElementById('c-project-name').textContent = res.contract.project_name;
        document.getElementById('c-budget').textContent = `Rp ${res.contract.budget.toLocaleString()}`;
        
        if(res.contract.client_signed_at) document.getElementById('sign-client').innerHTML = '<span class="text-blue-600 font-black italic text-xs">SIGNED DIGITAL</span>';
        if(res.contract.talent_signed_at) document.getElementById('sign-talent').innerHTML = '<span class="text-blue-600 font-black italic text-xs">SIGNED DIGITAL</span>';
    }
}
