import { bootClient } from "../assets/js/client_boot.js";
import { clientGet } from "../assets/js/client_api.js";
import { showClientNotice } from "../assets/js/client_notice.js";

function renderProjects(items){
  const list = document.getElementById("projectList");
  if(!list) return;

  list.innerHTML = "";

  const rows = Array.isArray(items) ? items : [];
  if(!rows.length){
    const li = document.createElement("li");
    li.textContent = "No projects yet.";
    list.appendChild(li);
    return;
  }

  rows.forEach(p => {
    const li = document.createElement("li");
    li.textContent = p.title || p.id || "Untitled project";
    list.appendChild(li);
  });
}

export default async function(){
  const user = await bootClient();
  if(!user) return;

  const res = await clientGet("/api/client/projects_get");
  if(!res.ok){
    showClientNotice(res?.data?.message || "Failed to load dashboard projects.", "error");
    renderProjects([]);
    return;
  }

  renderProjects(res.data || res.data?.items || []);
}
