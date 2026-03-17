import { requireClient } from "./client_session.js";
import { CLIENT_CONFIG } from "./client_config.js";

export async function bootClient(){
  const user = await requireClient();
  if(!user){
    return null;
  }

  window.__CLIENT_USER__ = user;
  window.__CLIENT_CONFIG__ = CLIENT_CONFIG;

  document.title = document.title || CLIENT_CONFIG.appName;

  const nameEl = document.getElementById("clientUserName");
  if(nameEl){
    nameEl.textContent = user.display_name || user.email || user.id || "Client";
  }

  return user;
}
