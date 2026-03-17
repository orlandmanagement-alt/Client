import { renderLayout } from "/assets/js/ui.js";
import { state } from "/assets/js/state.js";

export default async function(){
  renderLayout("Roles", `<pre id="rolesBox">Loading...</pre>`);
  const el = document.getElementById("rolesBox");
  el.textContent = JSON.stringify(state.user?.roles || [], null, 2);
}
