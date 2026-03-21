const routes = {
    'dashboard': 'mod_client_dashboard.js',
    'search_filter': 'mod_search_filter.js',
    'notifications': 'mod_notification_center.js',
    'settings': 'mod_settings.js',
    'contract': 'mod_contract_digital.js'
};

async function navigate() {
    const app = document.getElementById('app');
    const hash = window.location.hash.replace('#', '') || 'dashboard';
    const moduleName = routes[hash] || 'mod_client_dashboard.js';

    // Update UI Navigasi
    document.querySelectorAll('.nav-link').forEach(el => {
        el.classList.toggle('nav-active', el.getAttribute('data-route') === hash);
    });

    try {
        app.style.opacity = '0';
        const module = await import(`/modules/${moduleName}`);
        app.innerHTML = await module.render();
        if (module.initEvents) await module.initEvents();
        setTimeout(() => app.style.opacity = '1', 50);
    } catch (err) {
        console.error("Router Error:", err);
        app.innerHTML = `<div class="p-20 text-center font-black italic text-slate-300">MODUL ${moduleName.toUpperCase()} SEDANG MAINTENANCE</div>`;
        app.style.opacity = '1';
    }
}

window.addEventListener('hashchange', navigate);
window.addEventListener('DOMContentLoaded', navigate);
