let timer = null;
let isPolling = false;
let currentFn = null;
let currentMs = 30000;

export function startPolling(fn, ms = 30000) {
  stopPolling();
  currentFn = fn; currentMs = ms; isPolling = true;
  Promise.resolve().then(fn).catch(() => {});
  
  timer = setInterval(() => {
    if (document.visibilityState === 'visible') {
      Promise.resolve().then(fn).catch(() => {});
    }
  }, ms);
}

export function stopPolling() {
  isPolling = false;
  if (timer) { clearInterval(timer); timer = null; }
}

document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === 'visible' && isPolling && currentFn) {
      Promise.resolve().then(currentFn).catch(() => {});
  }
});
