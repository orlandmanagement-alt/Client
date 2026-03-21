import { apiGet, apiPost } from "/assets/js/api.js";

export async function render() {
    return `
    <div class="p-6">
        <h2 class="text-2xl font-black text-slate-800 mb-6">Daftar Booking</h2>
        <div id="booking-list" class="space-y-4"></div>
    </div>`;
}

export async function initEvents() {
    const container = document.getElementById('booking-list');
    
    window.confirmBooking = async (id) => {
        if(!confirm("Proses pembayaran booking ini?")) return;
        const res = await apiPost('/api/client/booking_patch', { booking_id: id });
        if(res.ok) {
            alert("Pembayaran Berhasil");
            window.location.reload();
        }
    };

    const res = await apiGet('/api/client/project_bookings');
    if(res.ok && res.bookings) {
        container.innerHTML = res.bookings.map(b => `
            <div class="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex justify-between items-center">
                <div>
                    <p class="text-[10px] font-black uppercase text-blue-600">${b.id}</p>
                    <h4 class="font-bold text-slate-800">Total: Rp ${b.total_amount.toLocaleString()}</h4>
                    <p class="text-xs text-slate-400">Status: ${b.booking_status} | ${b.payment_status}</p>
                </div>
                ${b.payment_status === 'unpaid' ? `
                    <button onclick="confirmBooking('${b.id}')" class="bg-slate-900 text-white px-6 py-2 rounded-xl text-xs font-bold">Bayar Sekarang</button>
                ` : `<span class="text-green-500"><i class="fa-solid fa-circle-check"></i></span>`}
            </div>
        `).join('');
    }
}
