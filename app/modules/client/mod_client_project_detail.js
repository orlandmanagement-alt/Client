import { bootClient } from "../../js/client_boot.js";
import { clientGet } from "../../js/client_api.js";
import { showClientNotice } from "../../js/client_notice.js";

function getEl(id){
  return document.getElementById(id);
}

function getQuery(name){
  return new URL(location.href).searchParams.get(name) || "";
}

function setText(id, value){
  const el = getEl(id);
  if(el) el.textContent = value || "-";
}

export default async function(){
  const user = await bootClient();
  if(!user) return;

  const info = getEl("projectDetailInfo");
  const projectId = String(getQuery("id") || "").trim();

  if(!projectId){
    if(info) info.textContent = "Project id is missing.";
    return;
  }

  if(info) info.textContent = "Loading project detail...";

  const res = await clientGet(`/functions/api/client/project_detail?id=${encodeURIComponent(projectId)}`);
  if(!res.ok){
    if(info) info.textContent = "Failed to load project detail.";
    showClientNotice(res?.data?.message || "Failed to load project detail.", "error");
    return;
  }

  const data = res.data || {};
  setText("pdId", data.id);
  setText("pdTitle", data.title);
  setText("pdStatus", data.status);
  setText("pdType", data.project_type);
  setText("pdLocation", data.location_text);

  if(info) info.textContent = "Project detail loaded.";
}
