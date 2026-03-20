export function renderBarChart(elId, data) {
  const el = document.getElementById(elId);
  if(!el) return;

  const max = Math.max(...data.map(d => d.value), 1);

  el.innerHTML = data.map(d => `
    <div class="mb-4 w-full">
      <div class="flex justify-between text-sm font-medium mb-1 text-gray-600">
        <span>${d.label}</span>
        <span class="font-bold text-gray-800">${d.value}</span>
      </div>
      <div class="w-full bg-gray-100 rounded-full h-3 overflow-hidden border border-gray-200">
        <div class="bg-gray-800 h-3 rounded-full transition-all duration-1000 ease-out" style="width: ${(d.value / max) * 100}%"></div>
      </div>
    </div>
  `).join("");
}
