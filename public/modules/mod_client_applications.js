import { bootClient } from "../assets/js/client_boot.js";
import { clientGet } from "../assets/js/client_api.js";
import { showClientNotice } from "../assets/js/client_notice.js";

function getEl(id){
  return document.getElementById(id);
}

function setInfo(message){
  const el = getEl("clientApplicationInfo");
  if(el) el.textContent = message || "";
}

function renderItems(items){
  const list = getEl("clientApplicationList");
  if(!list) return;

  list.innerHTML = "";
  const rows = Array.isArray(items) ? items : [];

  if(!rows.length){
    const li = document.createElement("li");
    li.textContent = "No applications found.";
    list.appendChild(li);
    return;
  }

  rows.forEach(item => {
    const li = document.createElement("li");
    const title = item.project_title || item.title || "Untitled Project";
    const meta = [
      item.role_title || item.role_name || "",
      item.talent_name || item.talent_user_id || "",
      item.status || ""
    ].filter(Boolean).join(" • ");

    li.innerHTML = `<div><strong>${title}</strong></div><div>${meta || "-"}</div>`;
    list.appendChild(li);
  });
}

async function loadApplications(projectId = ""){
  const path = projectId
    ? `/api/client/project_applications_get?project_id=${encodeURIComponent(projectId)}`
    : "/api/client/project_applications_get";

  setInfo("Loading applications...");
  const res = await clientGet(path);

  if(!res.ok){
    setInfo("Failed to load applications.");
    renderItems([]);
    showClientNotice(res?.data?.message || "Failed to load applications.", "error");
    return;
  }

  const rows = Array.isArray(res.data) ? res.data : (res.data?.items || []);
  setInfo(`Loaded ${rows.length} application(s).`);
  renderItems(rows);
}

export default async function(){
  const user = await bootClient();
  if(!user) return;

  getEl("clientApplicationFilterForm")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const projectId = String(getEl("clientApplicationProjectId")?.value || "").trim();
    await loadApplications(projectId);
  });

  await loadApplications("");
}
