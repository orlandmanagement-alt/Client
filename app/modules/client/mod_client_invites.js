import { bootClient } from "../../js/client_boot.js";
import { clientGet, clientPost } from "../../js/client_api.js";
import { showClientNotice } from "../../js/client_notice.js";

function getEl(id){
  return document.getElementById(id);
}

function setInfo(message){
  const el = getEl("clientInviteInfo");
  if(el) el.textContent = message || "";
}

function renderItems(items){
  const list = getEl("clientInviteList");
  if(!list) return;

  list.innerHTML = "";
  const rows = Array.isArray(items) ? items : [];

  if(!rows.length){
    const li = document.createElement("li");
    li.textContent = "No invites found.";
    list.appendChild(li);
    return;
  }

  rows.forEach(item => {
    const li = document.createElement("li");
    const title = item.project_title || item.title || "Untitled Project";
    const meta = [
      item.role_title || item.role_name || item.project_role_id || "",
      item.talent_name || item.talent_user_id || "",
      item.status || ""
    ].filter(Boolean).join(" • ");

    li.innerHTML = `<div><strong>${title}</strong></div><div>${meta || "-"}</div>`;
    list.appendChild(li);
  });
}

async function loadInvites(projectId = ""){
  const path = projectId
    ? `/functions/api/client/project_invites_get?project_id=${encodeURIComponent(projectId)}`
    : "/functions/api/client/project_invites_get";

  setInfo("Loading invites...");
  const res = await clientGet(path);

  if(!res.ok){
    setInfo("Failed to load invites.");
    renderItems([]);
    showClientNotice(res?.data?.message || "Failed to load invites.", "error");
    return;
  }

  const rows = Array.isArray(res.data) ? res.data : (res.data?.items || []);
  setInfo(`Loaded ${rows.length} invite(s).`);
  renderItems(rows);
}

async function createInvite(event){
  event.preventDefault();

  const projectRoleId = String(getEl("clientInviteRoleId")?.value || "").trim();
  const talentUserId = String(getEl("clientInviteTalentId")?.value || "").trim();
  const message = String(getEl("clientInviteMessage")?.value || "").trim();

  if(!projectRoleId || !talentUserId){
    setInfo("Project role id and talent user id are required.");
    return;
  }

  setInfo("Sending invite...");
  const res = await clientPost("/functions/api/client/project_invite_create", {
    project_role_id: projectRoleId,
    talent_user_id: talentUserId,
    message
  });

  if(!res.ok){
    setInfo(res?.data?.message || "Failed to send invite.");
    showClientNotice(res?.data?.message || "Failed to send invite.", "error");
    return;
  }

  showClientNotice("Invite sent.", "success");
  setInfo("Invite sent.");
  await loadInvites("");
}

export default async function(){
  const user = await bootClient();
  if(!user) return;

  getEl("clientInviteCreateForm")?.addEventListener("submit", createInvite);

  getEl("clientInviteFilterForm")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const projectId = String(getEl("clientInviteProjectId")?.value || "").trim();
    await loadInvites(projectId);
  });

  await loadInvites("");
}
