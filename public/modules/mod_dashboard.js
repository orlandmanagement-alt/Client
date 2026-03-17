import { renderLayout } from "/assets/js/ui.js";
import { apiGet } from "/assets/js/api.js";
import { renderBarChart } from "/assets/js/chart.js";
import { showLoading } from "/assets/js/loading.js";
import mountNotifications from "/modules/mod_notifications.js";
import initSessionManagement from "/modules/mod_session_management.js";

function card(title, value){
  return `
    <div style="flex:1;padding:16px;border:1px solid #ddd;border-radius:8px;background:#fff">
      <div style="font-size:12px;color:#666">${title}</div>
      <div style="font-size:22px;font-weight:bold">${value}</div>
    </div>
  `;
}

export default async function(){
  renderLayout("Client Dashboard", `
    <div style="display:grid;grid-template-columns:2fr 1fr;gap:20px">
      <div>
        <div id="kpi" style="display:flex;gap:10px;margin-bottom:20px">Loading...</div>
        <div style="background:#fff;border:1px solid #ddd;border-radius:8px;padding:16px">
          <h3 style="margin-top:0">Activity</h3>
          <div id="chart"></div>
        </div>
      </div>

      <div style="display:flex;flex-direction:column;gap:20px">
        <div style="background:#fff;border:1px solid #ddd;border-radius:8px;padding:16px">
          <h3 style="margin-top:0">Notifications (<span id="notifCount">0</span>)</h3>
          <div id="notifList">Loading...</div>
        </div>

        <div style="background:#fff;border:1px solid #ddd;border-radius:8px;padding:16px">
          <div style="display:flex;justify-content:space-between;align-items:center">
            <h3 style="margin-top:0;margin-bottom:12px">Sessions</h3>
            <button id="logoutAllBtn">Logout All</button>
          </div>
          <div id="sessionBox">Loading...</div>
        </div>
      </div>
    </div>
  `);

  showLoading("kpi");

  const res = await apiGet("/functions/api/dashboard_summary");
  const el = document.getElementById("kpi");

  if(!res.ok){
    el.innerHTML = "Failed load KPI";
  }else{
    const d = res.data || {};
    el.innerHTML = `
      ${card("Projects", d.projects || 0)}
      ${card("Applications", d.applications || 0)}
      ${card("Bookings", d.bookings || 0)}
      ${card("Earnings", "$" + (d.earnings || 0))}
    `;

    renderBarChart("chart", [
      { label:"Projects", value:d.projects || 0 },
      { label:"Applications", value:d.applications || 0 },
      { label:"Bookings", value:d.bookings || 0 }
    ]);
  }

  await mountNotifications();
  await initSessionManagement();
}
