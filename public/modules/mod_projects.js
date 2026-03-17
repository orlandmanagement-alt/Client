import { renderLayout } from "/assets/js/ui.js";
import { apiGet } from "/assets/js/api.js";

export default async function(){
  renderLayout("Projects", `<div id="list">Loading...</div>`);

  const res = await apiGet("/functions/api/client/projects_list");
  const el = document.getElementById("list");

  if(!res.ok){
    el.textContent = "Failed load";
    return;
  }

  const items = res.data?.items || res.data || [];
  el.innerHTML = Array.isArray(items) && items.length
    ? items.map(p => `
      <div style="margin-bottom:10px">
        <b>${p.title || p.id}</b><br>
        ${p.status || ""}
      </div>
    `).join("")
    : "<div>No projects</div>";
}
