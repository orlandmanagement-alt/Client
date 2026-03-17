let timer = null;

export function startPolling(fn, ms = 30000){
  stopPolling();
  timer = setInterval(() => {
    Promise.resolve().then(fn).catch(() => {});
  }, ms);
}

export function stopPolling(){
  if(timer){
    clearInterval(timer);
    timer = null;
  }
}
