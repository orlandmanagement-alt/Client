import { bootClient } from "../../js/client_boot.js";
import { clientGet, clientPost } from "../../js/client_api.js";
import { withClientLoading } from "../../js/client_loading.js";
import { showClientNotice } from "../../js/client_notice.js";

function getEl(id){
  return document.getElementById(id);
}

function setInfo(message){
  const el = getEl("clientShortlistInfo");
  if(el) el.textContent = message || "";
}

function renderItems(items){
  const list = getEl("clientShortlistList");
  if(!list) return;

  list.innerHTML = "";
  const rows = Array.isArray(items) ? items : [];

  if(!rows.length){
    const li = document.createElement("li");
    li.textContent = "No shortlists found.";
    list.appendChild(li);
    return;
  }

  rows.forEach(item => {
    const li = document.createElement("li");
    const title = item.project_title || item.title || "Untitled Project";
    const meta = [
      item.role_title || item.role_name || item.project_role_id || "",
      item.talent_name || item.talent_user_id || "",
      item.status || "shortlisted"
    ].filter(Boolean).join(" • ");

    li.innerHTML = `<div><strong>${title}</strong></div><div>${meta || "-"}</div>`;
    list.appendChild(li);
  });
}

async function loadShortlists(projectId = ""){
  const path = projectId
    ? `/functions/api/client/project_shortlists_get?project_id=${encodeURIComponent(projectId)}`
    : "/functions/api/client/project_shortlists_get";

  setInfo("Loading shortlists...");
  const res = await clientGet(path);

  if(!res.ok){
    setInfo("Failed to load shortlists.");
    renderItems([]);
    showClientNotice(res?.data?.message || "Failed to load shortlists.", "error");
    return;
  }

  const rows = Array.isArray(res.data) ? res.data : (res.data?.items || []);
  setInfo(`Loaded ${rows.length} shortlist item(s).`);
  renderItems(rows);
}

async function createShortlist(event){
  event.preventDefault();

  const projectRoleId = String(getEl("clientShortlistRoleId")?.value || "").trim();
  const talentUserId = String(getEl("clientShortlistTalentId")?.value || "").trim();

  if(!projectRoleId || !talentUserId){
    setInfo("Project role id and talent user id are required.");
    return;
  }

  setInfo("Creating shortlist...");
  const res = await clientPost("/functions/api/client/project_shortlist_create", {
    project_role_id: projectRoleId,
    talent_user_id: talentUserId
  });

  if(!res.ok){
    setInfo(res?.data?.message || "Failed to create shortlist.");
    showClientNotice(res?.data?.message || "Failed to create shortlist.", "error");
    return;
  }

  showClientNotice("Shortlist created.", "success");
  setInfo("Shortlist created.");
  await loadShortlists("");
}

export default async function(){
  const user = await bootClient();
  if(!user) return;

  getEl("clientShortlistFilterForm")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const projectId = String(getEl("clientShortlistProjectId")?.value || "").trim();
    await loadShortlists(projectId);
  });

  getEl("clientShortlistCreateForm")?.addEventListener("submit", async (event) => {
    await withClientLoading(event.submitter || "clientShortlistRoleId", async () => createShortlist(event));
  });

  await loadShortlists("");
}
