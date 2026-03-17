const CLIENT_LOADING_CLASS = "is-loading";

export function setClientLoading(target, loading = true){
  const el = typeof target === "string"
    ? document.getElementById(target)
    : target;

  if(!el) return;

  if(loading){
    el.dataset.loading = "1";
    el.classList.add(CLIENT_LOADING_CLASS);
    if("disabled" in el) el.disabled = true;
    return;
  }

  delete el.dataset.loading;
  el.classList.remove(CLIENT_LOADING_CLASS);
  if("disabled" in el) el.disabled = false;
}

export async function withClientLoading(target, fn){
  setClientLoading(target, true);
  try{
    return await fn();
  } finally {
    setClientLoading(target, false);
  }
}
