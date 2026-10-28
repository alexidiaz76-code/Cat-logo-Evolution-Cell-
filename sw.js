const CACHE_NAME='sp-catalogo-v1';
const APP_SHELL=['./','./index.html','./manifest.json'];
self.addEventListener('install',function(e){self.skipWaiting();e.waitUntil(caches.open(CACHE_NAME).then(function(c){return c.addAll(APP_SHELL).catch(function(){});}));});
self.addEventListener('activate',function(e){e.waitUntil(caches.keys().then(function(keys){return Promise.all(keys.filter(function(k){return k!==CACHE_NAME;}).map(function(k){return caches.delete(k);}));}));self.clients.claim();});
self.addEventListener('fetch',function(e){
  if(e.request.method!=='GET') return;
  if(new URL(e.request.url).origin !== self.location.origin) return;
  if(e.request.url.indexOf('version.json')!==-1) return;
  e.respondWith(caches.match(e.request).then(function(cached){
    if(cached){
      fetch(e.request).then(function(resp){ if(resp && resp.ok) caches.open(CACHE_NAME).then(function(c){ c.put(e.request, resp); }); }).catch(function(){});
      return cached;
    }
    return fetch(e.request).then(function(resp){
      if(resp && resp.ok){ var copy = resp.clone(); caches.open(CACHE_NAME).then(function(c){ c.put(e.request, copy); }); }
      return resp;
    });
  }));
});
