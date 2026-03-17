import { renderLayout } from "/assets/js/ui.js";
import { apiGet } from "/assets/js/api.js";

export default async function(){
  renderLayout("Pipeline", `<div id="pipeline">Loading...</div>`);

  const res = await apiGet("/functions/api/client/pipeline");
  const el = document.getElementById("pipeline");

  if(!res.ok){
    el.textContent = "Failed load pipeline";
    return;
  }

  const items = res.data?.items || res.data || [];
  el.innerHTML = Array.isArray(items) && items.length
    ? items.map(x => `
      <div style="padding:8px 0;border-bottom:1px solid #eee">
        <b>${x.title || x.id}</b> - ${x.status || "-"}
      </div>
    `).join("")
    : "<div>No pipeline data</div>";
}
