import { renderLayout } from "/assets/js/ui.js";
import { apiGet } from "/assets/js/api.js";

export default async function(){
  renderLayout("Invites", `<div id="invites">Loading...</div>`);

  const res = await apiGet("/functions/api/client/project_invites_get");
  const el = document.getElementById("invites");

  if(!res.ok){
    el.textContent = "Failed load invites";
    return;
  }

  const items = res.data?.items || res.data || [];
  el.innerHTML = Array.isArray(items) && items.length
    ? items.map(x => `
      <div style="padding:8px 0;border-bottom:1px solid #eee">
        <b>${x.project_title || x.id}</b> - ${x.status || "-"}
      </div>
    `).join("")
    : "<div>No invites</div>";
}
