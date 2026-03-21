import { apiPost } from "/assets/js/api.js";

export async function render(params) {
    return `
    <div class="p-6 max-w-sm mx-auto space-y-8">
        <div class="text-center">
            <h2 class="text-2xl font-black text-slate-800 tracking-tight">Beri Feedback</h2>
            <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 italic">Proyek: ${params.projectName || 'Casting Film'}</p>
        </div>

        <div class="bg-white p-10 rounded-[4rem] shadow-2xl shadow-slate-200 border border-slate-50 flex flex-col items-center gap-6">
            <div id="star-rating" class="flex gap-2 text-3xl">
                <i class="fa-solid fa-star text-slate-100 cursor-pointer transition-colors" data-v="1"></i>
                <i class="fa-solid fa-star text-slate-100 cursor-pointer transition-colors" data-v="2"></i>
                <i class="fa-solid fa-star text-slate-100 cursor-pointer transition-colors" data-v="3"></i>
                <i class="fa-solid fa-star text-slate-100 cursor-pointer transition-colors" data-v="4"></i>
                <i class="fa-solid fa-star text-slate-100 cursor-pointer transition-colors" data-v="5"></i>
            </div>

            <textarea id="f-comment" placeholder="Tuliskan pengalaman Anda bekerja dengan Talent ini..." 
                      class="w-full bg-slate-50 border-none rounded-3xl p-5 text-xs font-bold min-h-[120px] outline-none focus:ring-4 ring-blue-500/10"></textarea>
            
            <button onclick="window.submitReview('${params.projectId}', '${params.talentId}')" 
                    class="w-full bg-slate-900 text-white py-4 rounded-[2rem] font-black text-[10px] uppercase shadow-xl active:scale-95 transition-all">
                Kirim Penilaian
            </button>
        </div>
    </div>`;
}

export async function initEvents() {
    let currentRating = 0;
    const stars = document.querySelectorAll('#star-rating i');

    stars.forEach(star => {
        star.onclick = () => {
            currentRating = parseInt(star.dataset.v);
            stars.forEach((s, i) => {
                s.classList.toggle('text-amber-400', i < currentRating);
                s.classList.toggle('text-slate-100', i >= currentRating);
            });
        };
    });

    window.submitReview = async (pId, tId) => {
        const comment = document.getElementById('f-comment').value;
        if(currentRating === 0) return alert("Beri bintang dulu ya!");

        const res = await apiPost('/api/client/review_submit', {
            project_id: pId,
            talent_id: tId,
            rating: currentRating,
            comment: comment
        });

        if(res.ok) {
            alert(res.message);
            location.hash = '#projects';
        }
    };
}
