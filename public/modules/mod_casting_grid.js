import { apiGet, apiPost } from "/assets/js/api.js";
import { notify } from "/assets/js/notify.js";

export async function render() {
  return `
    <style>
      /* CSS Kustom dari Skrip Asli Anda yang disesuaikan untuk modul ini */
      #casting-grid-module { font-family: 'Inter', sans-serif; }
      #casting-grid-module .canvas-wrapper { width: 100%; display: flex; flex-direction: column; align-items: center; gap: 20px; padding: 20px; background: #1e293b; border-radius: 12px; min-height: 70vh; overflow-y: auto;}
      #casting-grid-module .a4-page { width: 297mm; height: 210mm; background: white; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.5); padding: 12mm 15mm; box-sizing: border-box; transform-origin: top center; flex-shrink: 0; page-break-after: always; color: #1e293b; position: relative; }
      #casting-grid-module .person-card { padding: 4px; position: relative; display: flex; flex-direction: column; height: 75mm; border: 2px solid; border-radius: 4px; box-sizing: border-box; }
      #casting-grid-module .status-FREE { border-color: #22c55e; background-color: #f0fdf4; }
      #casting-grid-module .status-LOCK { border-color: #ef4444; background-color: #fef2f2; }
      #casting-grid-module .status-CADANGAN { border-color: #eab308; background-color: #fefce8; }
      #casting-grid-module .status-BLACKLIST { border-color: #0f172a; background-color: #f8fafc; filter: grayscale(70%); opacity: 0.8; }
      #casting-grid-module .img-box { width: 100%; flex-grow: 1; background-color: #e2e8f0; margin-top: 4px; position: relative; overflow: hidden; border-radius: 2px; display: flex; align-items: center; justify-content: center; }
      #casting-grid-module .img-box img { width: 100%; height: 100%; object-fit: cover; }
      #casting-grid-module .card-input-box { border: 1px solid #94a3b8; background: white; border-radius: 2px; display: flex; align-items: center; justify-content: center; padding: 0; overflow: hidden; height: 16px; width: 100%; box-sizing: border-box; }
      #casting-grid-module .card-input-text { width: 100%; text-align: center; font-size: 0.65rem; padding: 0 2px; font-weight: 800; outline: none; color: #1e293b; background: transparent; border: none; line-height: 12px; box-sizing: border-box; min-width: 0; }
      #casting-grid-module .badge { position: absolute; top: -8px; left: -8px; font-size: 0.55rem; font-weight: 800; padding: 2px 6px; border-radius: 10px; z-index: 10; box-shadow: 0 2px 4px rgba(0,0,0,0.2); letter-spacing: 0.5px; cursor:pointer;}
      #casting-grid-module .badge-FREE { background: #22c55e; color: white; }
      #casting-grid-module .badge-LOCK { background: #ef4444; color: white; }
      #casting-grid-module .badge-CADANGAN { background: #eab308; color: white; }
      #casting-grid-module .badge-BLACKLIST { background: #0f172a; color: white; }
      #casting-grid-module .btn-close { position: absolute; top: -8px; right: -8px; color: #ef4444; font-size: 1.2rem; background: white; border-radius: 50%; z-index: 50; cursor: pointer; box-shadow: 0 2px 4px rgba(0,0,0,0.1); opacity: 0; transition: opacity 0.2s;}
      #casting-grid-module .person-card:hover .btn-close { opacity: 1; }
      #casting-grid-module .exporting .show-on-export { display: flex !important; }
      #casting-grid-module .exporting .hide-on-export, #casting-grid-module .exporting .no-print { display: none !important; }
      #casting-grid-module .exporting .canvas-wrapper { padding: 0 !important; background: white !important; }
      #casting-grid-module .exporting .a4-page { box-shadow: none !important; transform: scale(1) !important; margin: 0 !important; border: none !important;}
    </style>

    <div id="casting-grid-module" class="bg-white rounded-3xl shadow-sm border border-gray-100 p-4 md:p-6 min-h-[80vh] flex flex-col">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div>
                <h2 class="text-2xl font-black text-gray-800"><i class="fa-solid fa-clapperboard text-red-600 mr-2"></i> Live Casting Grid</h2>
                <p class="text-xs text-gray-500 mt-1">Papan kontrol real-time untuk Sutradara & TALCO.</p>
            </div>
            <div class="flex gap-2 w-full md:w-auto">
                <select id="grid-project-select" class="bg-gray-50 border border-gray-200 text-gray-800 text-sm font-bold rounded-xl px-4 py-2 outline-none w-full md:w-auto">
                    <option value="">-- Pilih Proyek --</option>
                </select>
                <button onclick="window.CastingGrid.fetchData()" class="bg-gray-200 text-gray-700 px-3 py-2 rounded-xl hover:bg-gray-300"><i class="fa-solid fa-rotate-right"></i></button>
            </div>
        </div>

        <div id="grid-controls" class="hidden grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
            <div class="lg:col-span-3 flex flex-wrap items-center gap-2 bg-gray-50 p-3 rounded-xl border border-gray-200">
                <select id="grid-category-select" class="bg-white border border-gray-300 text-gray-800 text-xs font-bold rounded-lg px-3 py-2 outline-none">
                    <option value="">Semua Grup Extras</option>
                </select>
                <button onclick="window.CastingGrid.addCategory()" class="bg-gray-900 text-white px-3 py-2 rounded-lg text-xs font-bold hover:bg-black"><i class="fa-solid fa-plus"></i> Buat Grup Baru</button>
                <button onclick="window.CastingGrid.copyQuickLink()" class="bg-green-500 text-white px-3 py-2 rounded-lg text-xs font-bold hover:bg-green-600 shadow"><i class="fa-solid fa-link"></i> Copy Quick Apply Link</button>
                
                <div class="ml-auto flex items-center gap-3 text-xs font-bold bg-white px-3 py-1.5 rounded-lg border border-gray-200">
                    <span class="text-green-600"><i class="fa-solid fa-circle"></i> FREE: <span id="count-free">0</span></span>
                    <span class="text-red-600"><i class="fa-solid fa-lock"></i> LOCK: <span id="count-lock">0</span></span>
                </div>
            </div>
            
            <div class="flex gap-2">
                <button onclick="window.CastingGrid.exportPDF()" class="flex-1 bg-red-600 text-white rounded-xl text-xs font-bold hover:bg-red-700 flex items-center justify-center gap-1 shadow-md"><i class="fa-solid fa-file-pdf"></i> Ekspor PDF</button>
            </div>
        </div>

        <div id="canvas-wrapper" class="canvas-wrapper relative flex-1">
            <div class="text-center py-20 text-gray-400 font-bold">Pilih Proyek terlebih dahulu untuk memuat Papan Casting.</div>
        </div>
    </div>
  `;
}

export async function initEvents() {
    // Muat library PDF & Canvas jika belum ada
    const loadScript = (src) => new Promise(r => { if(document.querySelector(`script[src="${src}"]`)) return r(); const s = document.createElement("script"); s.src = src; s.onload = r; document.head.appendChild(s); });
    await Promise.all([
        loadScript("https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"),
        loadScript("https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js")
    ]);

    let rawData = { projects: [], categories: [], extras: [] };

    window.CastingGrid = {
        fetchData: async () => {
            const wrapper = document.getElementById("canvas-wrapper");
            wrapper.innerHTML = `<div class="text-center py-20"><i class="fa-solid fa-spinner fa-spin text-4xl text-gray-300"></i></div>`;
            
            const res = await apiGet("/functions/api/client/extras_board");
            if(res.ok) {
                rawData = res.data;
                const pSelect = document.getElementById("grid-project-select");
                const currentVal = pSelect.value;
                pSelect.innerHTML = '<option value="">-- Pilih Proyek --</option>' + rawData.projects.map(p => `<option value="${p.id}">${p.title}</option>`).join("");
                if(currentVal && rawData.projects.find(x=>x.id === currentVal)) pSelect.value = currentVal;
                
                if(pSelect.value) window.CastingGrid.renderBoard();
                else wrapper.innerHTML = `<div class="text-center py-20 text-gray-400 font-bold">Pilih Proyek terlebih dahulu.</div>`;
            } else {
                notify("Gagal memuat data dari server.", "error");
            }
        },
        addCategory: async () => {
            const pId = document.getElementById("grid-project-select").value;
            if(!pId) return notify("Pilih Proyek Dulu!", "error");
            
            const title = prompt("Nama Grup Extras (Contoh: Prajurit Desa):", "Grup Baru");
            if(!title) return;

            notify("Membuat grup...", "info");
            const res = await apiPost("/functions/api/client/extras_board", { action: 'create_category', project_id: pId, title: title, target_qty: 50 });
            if(res.ok) { notify("Berhasil", "success"); window.CastingGrid.fetchData(); }
            else notify("Gagal", "error");
        },
        copyQuickLink: () => {
            const pId = document.getElementById("grid-project-select").value;
            const cId = document.getElementById("grid-category-select").value;
            if(!pId || !cId) return notify("Pilih Proyek dan Grup Extras yang spesifik di dropdown untuk membuat link!", "error");

            const link = `https://talent.orlandmanagement.com/quick-apply.html?pid=${pId}&cid=${cId}`;
            navigator.clipboard.writeText(link);
            notify("Link Quick Apply disalin! Sebarkan ke Grup WA.", "success");
        },
        toggleStatus: async (extraId) => {
            const extra = rawData.extras.find(e => e.id === extraId);
            if(!extra) return;
            // Siklus: FREE -> LOCK -> CADANGAN -> FREE
            let newStatus = 'FREE';
            if(extra.status === 'FREE') newStatus = 'LOCK';
            else if(extra.status === 'LOCK') newStatus = 'CADANGAN';
            
            // Optimistic UI Update
            extra.status = newStatus;
            window.CastingGrid.renderBoard(); 

            // Latar belakang simpan ke DB
            await apiPost("/functions/api/client/extras_action", { action: 'update_status', id: extraId, status: newStatus });
            window.CastingGrid.fetchData(); // Sync ulang
        },
        deleteExtra: async (extraId) => {
            if(!confirm("Keluarkan orang ini dari papan casting?")) return;
            await apiPost("/functions/api/client/extras_action", { action: 'delete_extra', id: extraId });
            window.CastingGrid.fetchData();
        },
        updateField: async (extraId, field, val) => {
            await apiPost("/functions/api/client/extras_action", { action: 'update_field', id: extraId, field: field, value: val });
        },
        exportPDF: async () => {
            const wrapper = document.getElementById('casting-grid-module');
            wrapper.classList.add('exporting');
            const pages = document.querySelectorAll('.a4-page');
            pages.forEach(p => { p.style.transform = 'none'; p.style.margin = '0'; });
            
            notify("Menyiapkan PDF... Mohon tunggu.", "info");
            await new Promise(r => setTimeout(r, 500)); // Tunggu render
            
            try {
                const { jsPDF } = window.jspdf; 
                const pdf = new jsPDF('l', 'mm', 'a4');
                for(let i=0; i<pages.length; i++){
                    const canvas = await html2canvas(pages[i], { scale: 2, useCORS: true, backgroundColor: "#ffffff" });
                    if(i > 0) pdf.addPage(); 
                    pdf.addImage(canvas.toDataURL('image/jpeg', 0.95), 'JPEG', 0, 0, 297, 210);
                }
                pdf.save(`Director_Board_Extras.pdf`);
                notify("PDF Berhasil diunduh!", "success");
            } catch(e) { notify("Gagal membuat PDF", "error"); }
            
            wrapper.classList.remove('exporting');
            window.CastingGrid.scalePages();
        },
        scalePages: () => {
            const wrapper = document.getElementById('canvas-wrapper');
            const pages = document.querySelectorAll('.a4-page'); 
            if(!wrapper || pages.length === 0) return;
            const a4Width = 1122; 
            const wrapperWidth = wrapper.clientWidth - 40;
            pages.forEach(canvas => {
                if(wrapperWidth < a4Width) { 
                    const scale = wrapperWidth / a4Width; 
                    canvas.style.transform = `scale(${scale})`; 
                    canvas.style.marginBottom = `-${(1 - scale) * canvas.offsetHeight - 20}px`; 
                } else { 
                    canvas.style.transform = `scale(1)`; 
                    canvas.style.marginBottom = '20px'; 
                }
            });
        },
        renderBoard: () => {
            const pId = document.getElementById("grid-project-select").value;
            const cId = document.getElementById("grid-category-select").value;
            const wrapper = document.getElementById("canvas-wrapper");
            
            if(!pId) { wrapper.innerHTML = ''; document.getElementById("grid-controls").classList.add("hidden"); return; }
            document.getElementById("grid-controls").classList.remove("hidden");

            const project = rawData.projects.find(p => p.id === pId);
            let activeCats = rawData.categories.filter(c => c.project_id === pId);
            
            // Update dropdown kategori
            const cSelect = document.getElementById("grid-category-select");
            cSelect.innerHTML = '<option value="">Semua Grup Extras</option>' + activeCats.map(c => `<option value="${c.id}" ${c.id===cId?'selected':''}>${c.title}</option>`).join("");
            
            if(cId) activeCats = activeCats.filter(c => c.id === cId);

            wrapper.innerHTML = '';
            let totalFree = 0; let totalLock = 0; let totalPagesRendered = 0;

            activeCats.forEach(cat => {
                const people = rawData.extras.filter(e => e.category_id === cat.id);
                people.forEach(p => { if(p.status === 'FREE') totalFree++; if(p.status === 'LOCK') totalLock++; });

                const chunks = [];
                for (let i = 0; i < people.length; i += 12) chunks.push(people.slice(i, i + 12));
                if(chunks.length === 0) chunks.push([]);

                chunks.forEach((chunk, chunkIdx) => {
                    totalPagesRendered++;
                    const pageDiv = document.createElement('div'); 
                    pageDiv.className = 'a4-page flex flex-col justify-start';

                    let headerHTML = `
                    <div style="border-bottom: 4px solid #1e293b; padding-bottom: 8px; margin-bottom: 16px; display:flex; justify-content:space-between; align-items:flex-start;">
                        <div style="width: 50%;">
                            <h1 style="font-size:1.25rem; font-weight:900; text-transform:uppercase; color:#1e293b; line-height:1.2; margin:0 0 4px 0;">${project.title}</h1>
                            <p style="font-size:0.75rem; font-weight:700; color:#64748b; margin:0;">${project.location || 'Lokasi TBA'}</p>
                        </div>
                        <div style="width: 50%; text-align:right;">
                            <div style="background-color:#ef4444; color:white; font-weight:800; font-size:14px; padding:4px 12px; border-radius:4px; display:inline-block; text-transform:uppercase;">
                                GRUP: ${cat.title} ${chunks.length > 1 ? `(${chunkIdx+1})` : ''}
                            </div>
                        </div>
                    </div>`;

                    let gridHTML = `<div class="grid grid-cols-6 gap-[6px]">`;

                    chunk.forEach(person => {
                        const sClass = `status-${person.status}`; const bClass = `badge-${person.status}`;
                        gridHTML += `
                        <div class="person-card group ${sClass}">
                            <div class="badge ${bClass} no-print" onclick="window.CastingGrid.toggleStatus('${person.id}')">${person.status}</div>
                            <i class="fa-solid fa-circle-xmark btn-close no-print" onclick="window.CastingGrid.deleteExtra('${person.id}')"></i>
                            
                            <div class="hide-on-export flex flex-col w-full gap-[2px] mb-[2px] overflow-hidden max-w-full">
                                <div class="card-input-box w-full"><input type="text" class="card-input-text truncate w-full" value="${person.name}" onchange="window.CastingGrid.updateField('${person.id}', 'name', this.value)"></div>
                                <div class="grid grid-cols-3 gap-[2px] w-full">
                                    <div class="card-input-box"><input type="number" class="card-input-text w-full" value="${person.age||''}" placeholder="U" onchange="window.CastingGrid.updateField('${person.id}', 'age', this.value)"></div>
                                    <div class="card-input-box"><input type="number" class="card-input-text w-full" value="${person.height||''}" placeholder="T" onchange="window.CastingGrid.updateField('${person.id}', 'height', this.value)"></div>
                                    <div class="card-input-box"><input type="number" class="card-input-text w-full" value="${person.weight||''}" placeholder="B" onchange="window.CastingGrid.updateField('${person.id}', 'weight', this.value)"></div>
                                </div>
                            </div>

                            <div class="show-on-export hidden flex-col w-full gap-[2px] mb-[2px]">
                                <div style="border:1px solid #94a3b8; border-radius:2px; height:18px; display:flex; align-items:center; justify-content:center; background:white; overflow:hidden; width:100%; box-sizing:border-box;">
                                    <div style="font-size:11px; font-weight:800; color:#1e293b; white-space:nowrap; max-width:98%; overflow:hidden; text-overflow:ellipsis;">${person.name || ''}</div>
                                </div>
                                <div style="display:flex; gap:2px; height:18px; width:100%; box-sizing:border-box;">
                                    <div style="flex:1; border:1px solid #94a3b8; background:white; text-align:center; font-size:10px; font-weight:800; line-height:16px;">${person.age || '-'}t</div>
                                    <div style="flex:1; border:1px solid #94a3b8; background:white; text-align:center; font-size:10px; font-weight:800; line-height:16px;">${person.height || '-'}c</div>
                                    <div style="flex:1; border:1px solid #94a3b8; background:white; text-align:center; font-size:10px; font-weight:800; line-height:16px;">${person.weight || '-'}k</div>
                                </div>
                            </div>

                            <div class="img-box group/img">
                                ${person.photo_base64 ? `<img src="${person.photo_base64}">` : `<i class="fa-solid fa-user text-3xl text-gray-300"></i>`}
                            </div>
                        </div>
                        `;
                    });

                    gridHTML += `</div><div class="absolute bottom-4 right-6 text-[10px] font-bold text-slate-400">Hal ${totalPagesRendered}</div>`;
                    pageDiv.innerHTML = headerHTML + gridHTML;
                    wrapper.appendChild(pageDiv);
                });
            });

            document.getElementById("count-free").textContent = totalFree;
            document.getElementById("count-lock").textContent = totalLock;

            if(wrapper.innerHTML === '') wrapper.innerHTML = `<div class="text-center py-20 text-gray-400 font-bold border-2 border-dashed rounded-2xl m-4">Belum ada grup atau extras di proyek ini.</div>`;
            setTimeout(window.CastingGrid.scalePages, 100);
        }
    };

    // Event Listeners
    document.getElementById("grid-project-select").addEventListener('change', window.CastingGrid.renderBoard);
    document.getElementById("grid-category-select").addEventListener('change', window.CastingGrid.renderBoard);
    window.addEventListener('resize', window.CastingGrid.scalePages);

    // Initial Fetch
    window.CastingGrid.fetchData();
}
