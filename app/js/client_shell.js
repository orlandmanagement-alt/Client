import { CLIENT_CONFIG } from "./client_config.js";
import { renderClientNav } from "./client_nav.js";
import { showClientNotice } from "./client_notice.js";

function ensureRoot(){
  let root = document.getElementById("clientAppShell");
  if(root) return root;

  document.body.innerHTML = `
    <div id="clientAppShell">
      <header id="clientShellHeader" style="padding:16px;border-bottom:1px solid #ddd;background:#fff;">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:16px;flex-wrap:wrap;">
          <div>
            <div style="font-size:20px;font-weight:700;" id="clientShellTitle">${CLIENT_CONFIG.appName}</div>
            <div style="margin-top:6px;font-size:14px;">
              Signed in as:
              <strong id="clientUserName">-</strong>
            </div>
            <div style="margin-top:6px;font-size:12px;color:#666;">
              Environment:
              <strong id="clientEnvName">${CLIENT_CONFIG.envName || "unknown"}</strong>
            </div>
          </div>

          <div id="clientShellActions" style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;">
            <a
              href="${CLIENT_CONFIG.portalUrl || "#"}"
              style="text-decoration:none;padding:8px 10px;border:1px solid #ccc;border-radius:8px;background:#fff;color:#111;"
            >Client Portal</a>

            <a
              href="${CLIENT_CONFIG.backendBaseUrl || "#"}"
              target="_blank"
              rel="noreferrer"
              style="text-decoration:none;padding:8px 10px;border:1px solid #ccc;border-radius:8px;background:#fff;color:#111;"
            >Dashboard API</a>

            <a
              href="${CLIENT_CONFIG.ssoLoginUrl || "#"}"
              style="text-decoration:none;padding:8px 10px;border:1px solid #ccc;border-radius:8px;background:#fff;color:#111;"
            >SSO</a>

            <button
              id="clientLogoutBtn"
              type="button"
              style="padding:8px 10px;border:1px solid #c33;border-radius:8px;background:#fff;color:#900;cursor:pointer;"
            >Logout</button>
          </div>
        </div>

        <div id="clientShellNotice" style="display:none;margin-top:12px;padding:10px;border:1px solid #ddd;border-radius:8px;font-size:13px;"></div>
      </header>

      <div id="clientShellNavWrap" style="padding:0 16px;"></div>
      <main id="clientShellMain" style="padding:16px;"></main>
    </div>
  `;

  return document.getElementById("clientAppShell");
}

async function runLogout(){
  const btn = document.getElementById("clientLogoutBtn");
  if(btn) btn.disabled = true;

  try{
    showClientNotice("Signing out...", "info");

    const res = await fetch(`${String(CLIENT_CONFIG.backendBaseUrl || "").replace(/\/+$/, "")}/functions/api/sso/logout`, {
      method: "POST",
      credentials: "include",
      headers: {
        "content-type": "application/json"
      },
      body: "{}"
    });

    let data = null;
    try{
      data = await res.json();
    }catch{}

    if(!res.ok || data?.status !== "ok"){
      showClientNotice((data?.data?.message || "Logout failed."), "error");
      return;
    }

    showClientNotice("Logout successful. Redirecting to SSO login...", "success");
    setTimeout(() => {
      location.href = CLIENT_CONFIG.ssoLoginUrl;
    }, 350);
  } finally {
    if(btn) btn.disabled = false;
  }
}

function bindShellActions(){
  const btn = document.getElementById("clientLogoutBtn");
  if(btn && !btn.dataset.bound){
    btn.dataset.bound = "1";
    btn.addEventListener("click", runLogout);
  }
}

export function mountClientShell(pageTitle, contentHtml){
  ensureRoot();

  const titleEl = document.getElementById("clientShellTitle");
  if(titleEl){
    titleEl.textContent = pageTitle
      ? `${CLIENT_CONFIG.appName} • ${pageTitle}`
      : CLIENT_CONFIG.appName;
  }

  const envEl = document.getElementById("clientEnvName");
  if(envEl){
    envEl.textContent = CLIENT_CONFIG.envName || "unknown";
  }

  const navWrap = document.getElementById("clientShellNavWrap");
  if(navWrap){
    navWrap.innerHTML = `<div id="clientPortalNav"></div>`;
    renderClientNav();
  }

  const main = document.getElementById("clientShellMain");
  if(main){
    main.innerHTML = `
      <section>
        <h1 style="margin-top:0;">${pageTitle || CLIENT_CONFIG.appName}</h1>
        ${contentHtml || ""}
      </section>
    `;
  }

  bindShellActions();
}
