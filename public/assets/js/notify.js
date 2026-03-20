let boxId = "app-notify-box";

function ensureBox() {
  let box = document.getElementById(boxId);
  if(box) return box;
  box = document.createElement("div");
  box.id = boxId;
  box.className = "fixed top-5 right-5 z-[9999] flex flex-col gap-2";
  document.body.appendChild(box);
  return box;
}

export function notify(message, kind = "info", ttl = 4000) {
  const box = ensureBox();
  const item = document.createElement("div");
  
  const colors = {
    error: "bg-red-50 text-red-600 border-red-200",
    success: "bg-green-50 text-green-600 border-green-200",
    info: "bg-blue-50 text-blue-600 border-blue-200",
    warning: "bg-orange-50 text-orange-600 border-orange-200"
  };

  item.className = `p-4 rounded-xl border shadow-lg transition-all duration-300 transform translate-x-0 flex items-center gap-3 ${colors[kind] || colors.info}`;
  
  const icon = kind === 'success' ? 'fa-circle-check' : kind === 'error' ? 'fa-circle-xmark' : 'fa-circle-info';
  item.innerHTML = `<i class="fa-solid ${icon} text-lg"></i> <div class="text-sm font-medium">${message}</div>`;
  
  box.appendChild(item);

  setTimeout(() => {
    item.style.opacity = '0';
    item.style.transform = 'translateX(100%)';
    setTimeout(() => item.remove(), 300);
  }, ttl);
}
