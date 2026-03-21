import { apiGet, apiPost } from "/assets/js/api.js";

export async function render() {
    return `
    <div class="flex flex-col h-[85vh] max-w-2xl mx-auto bg-white rounded-[3rem] shadow-xl border border-slate-100 overflow-hidden">
        <div class="p-6 border-b border-slate-50 flex items-center gap-4 bg-slate-50/50">
            <div id="chat-avatar" class="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-black">T</div>
            <div>
                <h3 id="chat-target-name" class="font-black text-slate-800 text-sm italic">Talent Name</h3>
                <p class="text-[9px] text-green-500 font-bold uppercase tracking-widest">Online</p>
            </div>
        </div>
        
        <div id="chat-box" class="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-50/30">
            </div>

        <div class="p-6 bg-white border-t border-slate-50 flex gap-2">
            <input type="text" id="chat-input" placeholder="Tulis pesan..." class="flex-1 bg-slate-100 border-none rounded-2xl px-5 text-xs font-bold outline-none focus:ring-2 ring-blue-500/20">
            <button onclick="window.sendMessage()" class="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center shadow-lg active:scale-90 transition-all">
                <i class="fa-solid fa-paper-plane"></i>
            </button>
        </div>
    </div>`;
}

export async function initEvents(roomId) {
    const box = document.getElementById('chat-box');
    const input = document.getElementById('chat-input');

    window.sendMessage = async () => {
        const msg = input.value;
        if(!msg) return;
        const res = await apiPost('/api/chat_send', { room_id: roomId, message: msg });
        if(res.ok) {
            input.value = '';
            loadMessages();
        }
    };

    const loadMessages = async () => {
        const res = await apiGet(`/api/chat_messages?room_id=${roomId}`);
        if(res.ok) {
            box.innerHTML = res.messages.map(m => `
                <div class="flex ${m.sender_id === 'ME' ? 'justify-end' : 'justify-start'}">
                    <div class="max-w-[80%] p-4 rounded-[1.5rem] text-xs font-bold shadow-sm 
                        ${m.sender_id === 'ME' ? 'bg-slate-900 text-white rounded-tr-none' : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none'}">
                        ${m.message_text}
                    </div>
                </div>
            `).join('');
            box.scrollTop = box.scrollHeight;
        }
    };

    setInterval(loadMessages, 3000); // Polling sederhana setiap 3 detik
    loadMessages();
}
