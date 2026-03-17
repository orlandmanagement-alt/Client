export function showLoading(elId, text = "Loading..."){
  const el = document.getElementById(elId);
  if(el){
    el.innerHTML = `<div style="opacity:0.6">${text}</div>`;
  }
}
