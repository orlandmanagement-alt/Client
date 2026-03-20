import { notify } from "./notify.js";

export async function loadModule(moduleName, menuElement = null) {
    const contentArea = document.getElementById('main-content');
    if(!contentArea) return;

    contentArea.innerHTML = '<div class="flex items-center justify-center h-full min-h-[50vh]"><i class="fa-solid fa-spinner fa-spin text-4xl text-blue-500"></i></div>';

    try {
        // PERBAIKAN FATAL: Gunakan Absolute Path (/) agar Browser tidak tersesat!
        const module = await import(`/modules/mod_${moduleName}.js`);
        contentArea.innerHTML = await module.render();
        
        if (module.initEvents) await module.initEvents();

        if(menuElement) {
            document.querySelectorAll('aside a.nav-item').forEach(el => el.classList.remove('bg-gray-100', 'text-gray-900', 'font-black'));
            menuElement.classList.add('bg-gray-100', 'text-gray-900', 'font-black');
        }
        
        // Tutup otomatis sidebar mobile jika user mengklik menu
        const sidebar = document.querySelector('aside');
        if(window.innerWidth < 1024 && sidebar && !sidebar.classList.contains('-translate-x-full')) {
            sidebar.classList.add('-translate-x-full');
        }

    } catch (error) {
        console.error(`Gagal memuat modul ${moduleName}:`, error);
        contentArea.innerHTML = `<div class="p-8 text-center text-red-500 bg-red-50 rounded-2xl border-2 border-red-200 m-4"><i class="fa-solid fa-triangle-exclamation text-4xl mb-3"></i><br>Gagal memuat modul "${moduleName}". <br><span class="text-xs font-normal text-gray-500">${error.message}</span></div>`;
        notify("Gagal memuat halaman", "error");
    }
}
