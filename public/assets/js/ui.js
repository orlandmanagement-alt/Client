import { navigate } from "./router.js";
import { state } from "./state.js";

export function renderLayout(title, content){
  const roles = state.user?.roles || [];

  document.body.innerHTML = `
    <div style="display:flex;font-family:sans-serif;background:#f5f6fa">
      <aside style="width:220px;padding:20px;background:#111;color:#fff;min-height:100vh">
        <h3>Orland Client</h3>
        <div><a href="/" data-link style="color:#fff">Dashboard</a></div>
        <div><a href="/projects" data-link style="color:#fff">Projects</a></div>
        <div><a href="/pipeline" data-link style="color:#fff">Pipeline</a></div>
        <div><a href="/bookings" data-link style="color:#fff">Bookings</a></div>
        <div><a href="/invites" data-link style="color:#fff">Invites</a></div>
        <div><a href="/applications" data-link style="color:#fff">Applications</a></div>
        <div><a href="/roles" data-link style="color:#fff">Roles</a></div>
        ${roles.includes("admin") ? '<div><a href="/admin" data-link style="color:#fff">Admin</a></div>' : ''}
      </aside>

      <main style="flex:1;padding:20px">
        <h2>${title}</h2>
        ${content}
      </main>
    </div>
  `;

  document.querySelectorAll("[data-link]").forEach(el => {
    el.onclick = (e) => {
      e.preventDefault();
      navigate(el.getAttribute("href"));
    };
  });
}
