import { apiGet, apiPost } from "/assets/js/api.js";
import { notify } from "/assets/js/notify.js";
import { maskPhone, maskEmail } from "/assets/js/ui.js";
import { maskPhone, maskEmail } from "/assets/js/ui.js";

export async function render() {
  return `
    <style>
        .floating-save-bar { position: fixed; bottom: 0; left: 0; right: 0; background: rgba(255,255,255,0.95); backdrop-filter: blur(10px); border-top: 1px solid #e5e7eb; padding: 16px 24px; display: flex; justify-content: flex-end; align-items: center; gap: 16px; box-shadow: 0 -4px 20px rgba(0,0,0,0.05); z-index: 9000; transform: translateY(100%); transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        .floating-save-bar.visible { transform: translateY(0); }
    </style>

    <div class="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 max-w-4xl mx-auto min-h-[75vh] relative pb-20">
        
        <div class="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-8 border-b border-gray-100 pb-8">
            <div class="w-24 h-24 rounded-2xl bg-gray-900 text-white flex items-center justify-center text-4xl font-bold shadow-lg">
                <i class="fa-regular fa-building"></i>
            </div>
            <div class="flex-1 text-center sm:text-left">
                <h2 id="disp_company_name" class="text-3xl font-bold text-gray-800 tracking-tight">Memuat...</h2>
                <p id="disp_email" class="text-gray-500 mt-1">-</p>
                <div class="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-yellow-50 border border-yellow-200 text-yellow-700 text-xs font-bold uppercase tracking-wider" id="disp_status">
                    <i class="fa-solid fa-triangle-exclamation"></i> Unverified
                </div>
            </div>
        </div>

        <div class="space-y-8" id="client-form-container" style="display:none;">
            
            <div>
                <h3 class="text-lg font-bold text-gray-800 mb-4 border-b border-gray-100 pb-2"><i class="fa-solid fa-briefcase text-gray-400 mr-2"></i> Informasi Perusahaan</h3>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                        <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Nama Perusahaan / Agensi <span class="text-red-500">*</span></label>
                        <input type="text" id="inp_company_name" class="w-full border border-gray-300 rounded-xl p-3 focus:border-gray-800 outline-none text-sm font-medium bg-gray-50 focus:bg-white transition-colors">
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Jenis Industri</label>
                        <select id="inp_industry" class="w-full border border-gray-300 rounded-xl p-3 focus:border-gray-800 outline-none text-sm font-medium bg-gray-50 focus:bg-white transition-colors cursor-pointer">
                            <option value="">Pilih Industri...</option>
                            <option value="Production House">Production House (PH)</option>
                            <option value="Advertising Agency">Advertising Agency</option>
                            <option value="Brand / Corporate">Brand / Corporate</option>
                            <option value="Event Organizer">Event Organizer</option>
                            <option value="Independent Creator">Kreator Independen</option>
                        </select>
                    </div>
                    <div class="sm:col-span-2">
                        <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Website URL</label>
                        <input type="text" id="inp_website" placeholder="https://www.perusahaananda.com" class="w-full border border-gray-300 rounded-xl p-3 focus:border-gray-800 outline-none text-sm font-medium bg-gray-50 focus:bg-white transition-colors">
                    </div>
                </div>
            </div>

            <div>
                <h3 class="text-lg font-bold text-gray-800 mb-4 border-b border-gray-100 pb-2"><i class="fa-solid fa-address-book text-gray-400 mr-2"></i> Kontak Penanggung Jawab (PIC)</h3>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                        <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Nama PIC</label>
                        <input type="text" id="inp_contact_name" class="w-full border border-gray-300 rounded-xl p-3 focus:border-gray-800 outline-none text-sm font-medium bg-gray-50 focus:bg-white transition-colors">
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">No. Handphone / WhatsApp</label>
                        <input type="tel" id="inp_contact_phone" placeholder="08..." class="w-full border border-gray-300 rounded-xl p-3 focus:border-gray-800 outline-none text-sm font-medium bg-gray-50 focus:bg-white transition-colors">
                    </div>
                </div>
            </div>

            <div>
                <h3 class="text-lg font-bold text-gray-800 mb-4 border-b border-gray-100 pb-2"><i class="fa-solid fa-file-invoice text-gray-400 mr-2"></i> Data Penagihan & Alamat</h3>
                <div class="grid grid-cols-1 gap-5">
                    <div>
                        <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Nomor NPWP Perusahaan</label>
                        <input type="text" id="inp_npwp" placeholder="00.000.000.0-000.000" class="w-full border border-gray-300 rounded-xl p-3 focus:border-gray-800 outline-none text-sm font-medium bg-gray-50 focus:bg-white transition-colors">
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Alamat Lengkap Perusahaan</label>
                        <textarea id="inp_address" rows="3" placeholder="Jl. Contoh No. 123, Jakarta..." class="w-full border border-gray-300 rounded-xl p-3 focus:border-gray-800 outline-none text-sm font-medium bg-gray-50 focus:bg-white transition-colors resize-y"></textarea>
                    </div>
                </div>
            </div>
            
        </div>
    </div>

    <div id="floatingSaveBar" class="floating-save-bar">
        <div class="text-sm font-bold text-orange-600 flex items-center gap-2"><i class="fa-solid fa-circle-exclamation"></i> Perubahan belum disimpan</div>
        <button class="bg-gray-200 text-gray-700 px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-gray-300 transition-colors" onclick="window.ClientProfileSync.revert()">Batal</button>
        <button class="bg-gray-900 text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-md hover:bg-black transition-colors" onclick="window.ClientProfileSync.saveToApi()">Simpan Profil</button>
    </div>
  `;
}

// =========================================================
// LOGIC & DIRTY STATE CHECKER
// =========================================================
export async function initEvents() {
    let originalState = {};
    let currentState = {};

    const qs = (id) => document.getElementById(id);

    function checkDirty() {
        const isDirty = JSON.stringify(originalState) !== JSON.stringify(currentState);
        const bar = qs("floatingSaveBar");
        if (bar) {
            if (isDirty) bar.classList.add("visible");
            else bar.classList.remove("visible");
        }
    }

    function bindInput(id, key, subKey = null) {
        const el = qs(id);
        if(!el) return;
        el.addEventListener("input", (e) => {
            if (subKey) currentState[key][subKey] = e.target.value;
            else currentState[key] = e.target.value;
            
            // Auto update header display for Company Name
            if(id === "inp_company_name") qs("disp_company_name").textContent = e.target.value || "Nama Perusahaan";
            
            checkDirty();
        });
    }

    // 1. Fetch Data dari API
    const res = await apiGet("/functions/api/client/profile_get");
    qs("client-form-container").style.display = "block";

    if (res.ok && res.data) {
        const d = res.data;
        originalState = {
            company_name: d.company_name || "",
            industry_type: d.industry_type || "",
            contact_name: d.contact_name || "",
            contact_phone: d.contact_phone || "",
            website_url: d.website_url || "",
            billing: {
                npwp: d.billing?.npwp || "",
                company_address: d.billing?.company_address || ""
            }
        };

        // Render Static Header
        qs("disp_company_name").textContent = d.company_name || "Nama Perusahaan";
        qs("disp_email").textContent = maskEmail(d.email);
        
        if(d.verification_status === 'verified') {
            qs("disp_status").className = "mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-50 border border-green-200 text-green-700 text-xs font-bold uppercase tracking-wider";
            qs("disp_status").innerHTML = `<i class="fa-solid fa-shield-check"></i> Verified Client`;
        }
    } else {
        originalState = { company_name: "", industry_type: "", contact_name: "", contact_phone: "", website_url: "", billing: { npwp: "", company_address: "" } };
    }

    currentState = JSON.parse(JSON.stringify(originalState));

    // 2. Isi Form dengan Data
    function populateForm() {
        qs("inp_company_name").value = currentState.company_name;
        qs("inp_industry").value = currentState.industry_type;
        qs("inp_contact_name").value = currentState.contact_name;
        qs("inp_contact_phone").value = currentState.contact_phone;
        qs("inp_website").value = currentState.website_url;
        qs("inp_npwp").value = currentState.billing.npwp;
        qs("inp_address").value = currentState.billing.company_address;
    }

    populateForm();

    // 3. Pasang Event Listener (Ketikan)
    bindInput("inp_company_name", "company_name");
    bindInput("inp_industry", "industry_type");
    bindInput("inp_contact_name", "contact_name");
    bindInput("inp_contact_phone", "contact_phone");
    bindInput("inp_website", "website_url");
    bindInput("inp_npwp", "billing", "npwp");
    bindInput("inp_address", "billing", "company_address");

    // 4. Global Action (Batal / Simpan)
    window.ClientProfileSync = {
        revert: () => {
            currentState = JSON.parse(JSON.stringify(originalState));
            populateForm();
            qs("disp_company_name").textContent = currentState.company_name || "Nama Perusahaan";
            checkDirty();
        },
        saveToApi: async () => {
            if(!currentState.company_name) return notify("Nama perusahaan wajib diisi", "error");
            
            notify("Menyimpan profil...", "info");
            const res = await apiPost("/functions/api/client/profile_update", currentState);
            
            if (res.ok) {
                notify("Profil perusahaan berhasil disimpan!", "success");
                originalState = JSON.parse(JSON.stringify(currentState));
                checkDirty(); // Sembunyikan floating bar
            } else {
                notify(res.data?.message || "Gagal menyimpan", "error");
            }
        }
    };
}
