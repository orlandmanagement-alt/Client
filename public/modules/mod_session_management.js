import { loadSessions, revokeSession, logoutAll } from "/assets/js/session_manager.js";

function render(items){
  const box = document.getElementById("sessionBox");
  if(!box) return;

  if(!items.length){
    box.innerHTML = "<div>No active sessions</div>";
    return;
  }

  box.innerHTML = items.map(item => `
    <div style="padding:10px 0;border-bottom:1px solid #eee">
      <div style="font-weight:600">${item.device_info || item.device_name || "Unknown Device"}</div>
      <div style="font-size:12px;color:#666">Status: ${item.status || "active"}</div>
      <div style="font-size:12px;color:#666">Expires: ${item.expires_at || "-"}</div>
      <button data-session-id="${item.id || item.session_id || ""}" style="margin-top:8px">Revoke</button>
    </div>
  `).join("");

  box.querySelectorAll("button[data-session-id]").forEach(btn => {
    btn.addEventListener("click", async () => {
      const id = btn.getAttribute("data-session-id");
      if(!id) return;
      const ok = await revokeSession(id);
      if(ok) await initSessionManagement();
    });
  });
}

export default async function initSessionManagement(){
  const res = await loadSessions();
  render(res.items || []);

  const logoutAllBtn = document.getElementById("logoutAllBtn");
  if(logoutAllBtn && !logoutAllBtn.dataset.bound){
    logoutAllBtn.dataset.bound = "1";
    logoutAllBtn.addEventListener("click", async () => {
      const ok = await logoutAll();
      if(ok){
        location.href = "https://sso.orlandmanagement.com/";
      }
    });
  }
}
