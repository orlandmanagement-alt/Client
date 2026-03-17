let boxId = "app-notify-box";

function ensureBox(){
  let box = document.getElementById(boxId);
  if(box) return box;

  box = document.createElement("div");
  box.id = boxId;
  box.style.position = "fixed";
  box.style.top = "16px";
  box.style.right = "16px";
  box.style.zIndex = "9999";
  box.style.display = "flex";
  box.style.flexDirection = "column";
  box.style.gap = "8px";
  document.body.appendChild(box);
  return box;
}

export function notify(message, kind = "info", ttl = 3000){
  const box = ensureBox();
  const item = document.createElement("div");
  item.textContent = message || "";
  item.style.padding = "10px 14px";
  item.style.borderRadius = "8px";
  item.style.color = "#111";
  item.style.background = kind === "error" ? "#ffd7d7" : kind === "success" ? "#d9ffe0" : "#eef3ff";
  item.style.border = "1px solid rgba(0,0,0,0.08)";
  item.style.boxShadow = "0 4px 18px rgba(0,0,0,0.08)";
  box.appendChild(item);

  setTimeout(() => item.remove(), ttl);
}
