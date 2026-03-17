import { state } from "./state.js";

const routes = {};

export function registerRoute(path, loader){
  routes[path] = loader;
}

export async function navigate(path){
  history.pushState({}, "", path);
  await resolveRoute();
}

export function resolveDefaultRoute(){
  const roles = state.user?.roles || [];

  if(roles.includes("admin")) return "/admin";
  if(roles.includes("client")) return "/";
  if(roles.includes("talent")) return "/";

  return "/";
}

export async function resolveRoute(){
  const path = location.pathname.replace(/\/$/, "") || "/";
  const loader = routes[path];

  if(!loader){
    document.body.innerHTML = "<h3>404</h3>";
    return;
  }

  try{
    await loader();
  }catch(e){
    console.error("ROUTE ERROR:", e);
    document.body.innerHTML = "<h3>Page Error</h3>";
  }
}

window.addEventListener("popstate", resolveRoute);
