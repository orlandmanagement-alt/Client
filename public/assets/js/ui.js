// Komponen Card Statistik untuk Dashboard Client
export function createCard(title, value, icon, color = "blue") {
    return `
    <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 transition-transform hover:-translate-y-1 hover:shadow-md">
        <div class="w-14 h-14 rounded-full bg-${color}-50 text-${color}-500 flex items-center justify-center text-2xl">
            <i class="${icon}"></i>
        </div>
        <div>
            <p class="text-sm text-gray-500 font-medium mb-1">${title}</p>
            <h4 class="text-2xl font-bold text-gray-800">${value}</h4>
        </div>
    </div>`;
}

// Komponen Pesan Peringatan
export function createAlert(message, type = "info") {
    const colors = { info: "blue", error: "red", success: "green", warning: "orange" };
    const c = colors[type];
    return `<div class="bg-${c}-50 text-${c}-600 p-4 rounded-xl border border-${c}-100 text-sm flex items-center gap-2"><i class="fa-solid fa-circle-info"></i> ${message}</div>`;
}

// Komponen Badge Status
export function createBadge(text, color = "gray") {
    return `<span class="px-3 py-1 bg-${color}-50 text-${color}-600 rounded-full text-xs font-bold uppercase tracking-wider">${text}</span>`;
}

export function maskPhone(phone) {
    if (!phone || phone.length < 6) return phone || "-";
    return phone.slice(0, -5) + "****" + phone.slice(-1);
}

export function maskEmail(email) {
    if (!email || !email.includes('@')) return email || "-";
    const [name, domain] = email.split('@');
    if (name.length <= 4) return name[0] + "***@" + domain;
    return name.slice(0, 3) + "*****" + name.slice(-1) + "@" + domain;
}

export function maskPhone(phone) {
    if (!phone || phone.length < 6) return phone || "-";
    return phone.slice(0, -5) + "****" + phone.slice(-1);
}

export function maskEmail(email) {
    if (!email || !email.includes('@')) return email || "-";
    const [name, domain] = email.split('@');
    if (name.length <= 4) return name[0] + "***@" + domain;
    return name.slice(0, 3) + "*****" + name.slice(-1) + "@" + domain;
}
