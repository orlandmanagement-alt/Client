import config from "./config.js";

async function safeFetch(url, options = {}){
  try{
    const res = await fetch(config.API_BASE + url, {
      credentials: "include",
      ...options
    });

    const text = await res.text();

    let data = {};
    try{
      data = JSON.parse(text);
    }catch{}

    return { ok: res.ok, data };
  }catch(e){
    return { ok:false, data:{ message:"network_error" } };
  }
}

export const apiGet = (url) => safeFetch(url);
export const apiPost = (url, body) => safeFetch(url, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(body)
});
