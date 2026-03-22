const routes = {
    'dashboard': { file: 'mod_dashboard.js', title: 'Executive Summary', breadcrumb: 'Orland / Dashboard' },
    'search_filter': { file: 'mod_search_filter.js', title: 'Talent Scouter', breadcrumb: 'Orland / Database' }
};

async function navigate() {
    const app = document.getElementById('app');
    const loader = document.getElementById('page-loader');
    const hash = window.location.hash.replace('#', '') || 'dashboard';
    const route = routes[hash] || routes['dashboard'];

    // Update Topbar
    document.getElementById('top-title').textContent = route.title;
    document.getElementById('top-breadcrumb').textContent = route.breadcrumb;

    loader.classList.remove('opacity-0', 'pointer-events-none');
    app.style.opacity = '0';

    try {
        const module = await import(`/modules/${route.file}`);
        app.innerHTML = await module.render();
        if (module.initEvents) setTimeout(() => module.initEvents(), 100);
    } catch (err) {
        console.error("Router Error:", err);
        app.innerHTML = `<div class="bg-rose-50 text-rose-600 p-8 rounded-2xl border border-rose-200">
            <h3 class="font-bold text-lg"><i class="fa-solid fa-triangle-exclamation"></i> Sistem Error</h3>
            <p class="text-xs mt-2">Modul gagal dimuat. Hubungi Administrator.</p>
        </div>`;
    } finally {
        setTimeout(() => {
            loader.classList.add('opacity-0', 'pointer-events-none');
            app.style.opacity = '1';
        }, 300);
    }
}
window.addEventListener('hashchange', navigate);
window.addEventListener('DOMContentLoaded', navigate);
