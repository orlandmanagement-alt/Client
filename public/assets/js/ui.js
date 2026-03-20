export async function loadModule(moduleName, menuElement = null) {
    const contentArea = document.getElementById('main-content');
    if(!contentArea) return;

    // Spinner Biru Orland
    contentArea.innerHTML = '<div class="flex items-center justify-center h-full min-h-[50vh]"><i class="fa-solid fa-circle-notch fa-spin text-4xl text-blue-600"></i></div>';

    try {
        // PERBAIKAN FATAL: Menggunakan "/" agar selalu mencari dari root public/modules
        const module = await import(`/modules/mod_${moduleName}.js?t=${Date.now()}`);
        
        contentArea.innerHTML = await module.render();
        
        if (module.initEvents) {
            await module.initEvents();
        }

        // Highlight Menu Aktif
        if(menuElement) {
            document.querySelectorAll('aside a').forEach(el => {
                el.classList.remove('bg-blue-50', 'text-blue-600', 'font-black', 'border-r-4', 'border-blue-600');
            });
            menuElement.classList.add('bg-blue-50', 'text-blue-600', 'font-black', 'border-r-4', 'border-blue-600');
        }

        // Tutup sidebar otomatis di layar mobile setelah klik menu
        const sidebar = document.getElementById('sidebar');
        if (window.innerWidth < 1024 && sidebar) {
            sidebar.classList.add('-translate-x-full');
        }

    } catch (error) {
        console.error(`Gagal memuat modul ${moduleName}:`, error);
        contentArea.innerHTML = `<div class="p-8 text-center text-red-500 font-bold border-2 border-dashed border-red-200 rounded-2xl bg-red-50 m-4"><i class="fa-solid fa-triangle-exclamation text-4xl mb-3"></i><br>Gagal memuat modul "${moduleName}".</div>`;
    }
}
window.loadModule = loadModule;
