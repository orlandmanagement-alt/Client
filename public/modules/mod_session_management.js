import { apiPost } from "/assets/js/api.js";

export async function render() {
    return `
    <div class="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 max-w-2xl mx-auto min-h-[60vh]">
        <h2 class="text-xl font-bold text-gray-800 mb-2"><i class="fa-solid fa-shield-halved text-green-500 mr-2"></i> Keamanan Akun</h2>
        <p class="text-sm text-gray-500 mb-8 border-b border-gray-100 pb-6">Kelola kata sandi dan pengaturan keamanan sesi Anda di sini.</p>
        
        <div class="space-y-4">
            <div>
                <label class="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Kata Sandi Baru</label>
                <input type="password" id="sec_new_pw" class="w-full border border-gray-200 rounded-lg py-2.5 px-3 focus:border-gray-800 outline-none text-sm bg-gray-50 focus:bg-white">
            </div>
            <div>
                <label class="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Konfirmasi Kata Sandi</label>
                <input type="password" id="sec_conf_pw" class="w-full border border-gray-200 rounded-lg py-2.5 px-3 focus:border-gray-800 outline-none text-sm bg-gray-50 focus:bg-white">
            </div>
            <button onclick="alert('Fitur pembaruan kata sandi sedang dalam penyesuaian API.')" class="w-full bg-gray-900 text-white font-bold py-3 rounded-lg text-[13px] hover:bg-black transition-colors mt-4">Perbarui Kata Sandi</button>
        </div>
    </div>
    `;
}
export async function initEvents() {}
