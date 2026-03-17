import { apiGet } from "/assets/js/api.js";
import { notify } from "/assets/js/notify.js";
import { startPolling, stopPolling } from "/assets/js/realtime.js";

let lastCount = null;

async function fetchNotifications(){
  const res = await apiGet("/functions/api/notifications");
  if(!res.ok) return;

  const items = res.data?.items || res.data || [];
  const count = Array.isArray(items) ? items.length : 0;

  const badge = document.getElementById("notifCount");
  if(badge) badge.textContent = String(count);

  const list = document.getElementById("notifList");
  if(list){
    if(!count){
      list.innerHTML = "<div>No notifications</div>";
    }else{
      list.innerHTML = items.slice(0, 8).map(x => `
        <div style="padding:8px 0;border-bottom:1px solid #eee">
          <div style="font-weight:600">${x.title || x.type || "Notification"}</div>
          <div style="font-size:12px;color:#666">${x.body || ""}</div>
        </div>
      `).join("");
    }
  }

  if(lastCount !== null && count > lastCount){
    notify("You have new notifications", "info");
  }

  lastCount = count;
}

export default async function mountNotifications(){
  await fetchNotifications();
  startPolling(fetchNotifications, 20000);
  window.addEventListener("beforeunload", stopPolling, { once:true });
}
