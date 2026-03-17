import { bootClient } from "../assets/js/client_boot.js";
import { clientGet } from "../assets/js/client_api.js";
import { withClientLoading } from "../assets/js/client_loading.js";
import { showClientNotice } from "../assets/js/client_notice.js";

function getEl(id){
  return document.getElementById(id);
}

function setInfo(message){
  const el = getEl("clientRoleInfo");
  if(el) el.textContent = message || "";
}

function renderItems(items){
  const list = getEl("clientRoleList");
  if(!list) return;

  list.innerHTML = "";
  const rows = Array.isArray(items) ? items : [];

  if(!rows.length){
    const li = document.createElement("li");
    li.textContent = "No roles found.";
    list.appendChild(li);
    return;
  }

  rows.forEach(item => {
    const li = document.createElement("li");
    const title = item.title || item.role_title || item.role_name || item.id || "Untitled Role";
    const meta = [
      item.status || "",
      item.gender_requirement || item.gender_pref || "",
      item.age_range || "",
      item.location_text || ""
    ].filter(Boolean).join(" • ");

    li.innerHTML = `<div><strong>${title}</strong></div><div>${meta || "-"}</div>`;
    list.appendChild(li);
  });
}

async function loadRoles(projectId = ""){
  const path = projectId
    ? `/api/client/project_roles_get?project_id=${encodeURIComponent(projectId)}`
    : "/api/client/project_roles_get";

  setInfo("Loading roles...");
  const res = await clientGet(path);

  if(!res.ok){
    setInfo("Failed to load roles.");
    renderItems([]);
    showClientNotice(res?.data?.message || "Failed to load roles.", "error");
    return;
  }

  const rows = Array.isArray(res.data) ? res.data : (res.data?.items || []);
  setInfo(`Loaded ${rows.length} role(s).`);
  renderItems(rows);
}

export default async function(){
  const user = await bootClient();
  if(!user) return;

  getEl("clientRoleFilterForm")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const projectId = String(getEl("clientRoleProjectId")?.value || "").trim();
    await withClientLoading("clientRoleReloadBtn", async () => loadRoles(projectId));
  });

  getEl("clientRoleReloadBtn")?.addEventListener("click", async () => {
    const projectId = String(getEl("clientRoleProjectId")?.value || "").trim();
    await withClientLoading("clientRoleReloadBtn", async () => loadRoles(projectId));
  });

  await loadRoles("");
}
