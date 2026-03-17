import { bootClient } from "../assets/js/client_boot.js";
import { clientGet } from "../assets/js/client_api.js";
import { showClientNotice } from "../assets/js/client_notice.js";

function getEl(id){ return document.getElementById(id); }

function setText(id, value){
  const el = getEl(id);
  if(el) el.textContent = String(value ?? "0");
}

function setInfo(message){
  const el = getEl("clientPipelineInfo");
  if(el) el.textContent = message || "";
}

async function loadPipeline(projectId){
  if(!projectId){
    setInfo("Project id is required.");
    return;
  }

  setInfo("Loading pipeline...");
  const res = await clientGet(`/functions/api/project/pipeline_get?project_id=${encodeURIComponent(projectId)}`);

  if(!res.ok){
    setInfo("Failed to load pipeline.");
    showClientNotice(res?.data?.message || "Failed to load pipeline.", "error");
    return;
  }

  const summary = res.data?.summary || {};
  setText("ppApplications", summary.applications || 0);
  setText("ppShortlists", summary.shortlists || 0);
  setText("ppInvites", summary.invites || 0);
  setText("ppBookings", summary.bookings || 0);
  setInfo("Pipeline loaded.");
}

export default async function(){
  const user = await bootClient();
  if(!user) return;

  getEl("clientPipelineForm")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const projectId = String(getEl("clientPipelineProjectId")?.value || "").trim();
    await loadPipeline(projectId);
  });
}
