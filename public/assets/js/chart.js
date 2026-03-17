export function renderBarChart(elId, data){
  const el = document.getElementById(elId);
  if(!el) return;

  const max = Math.max(...data.map(d => d.value), 1);

  el.innerHTML = data.map(d => `
    <div style="margin-bottom:6px">
      <div style="font-size:12px">${d.label}</div>
      <div style="background:#eee;height:10px;border-radius:4px">
        <div style="width:${(d.value/max)*100}%;background:#4caf50;height:10px;border-radius:4px"></div>
      </div>
    </div>
  `).join("");
}
