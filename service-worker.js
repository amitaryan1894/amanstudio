self.addEventListener('fetch', function(event) {
    event.respondWith(fetch(event.request));
  });
  
  self.addEventListener('install', function(event) {
    event.waitUntil(
      caches.open('my-app-cache').then(function(cache) {
        return cache.addAll([
          '/',
          '/index.html',
          '/styles.css',
          '/script.js'
        ]);
      })
    );
  });
  
  self.addEventListener('activate', function(event) {
    event.waitUntil(
      caches.keys().then(function(cacheNames) {
        return Promise.all(
          cacheNames.filter(function(cacheName) {
            return cacheName.startsWith('my-app-') &&
                   cacheName != 'my-app-cache';
          }).map(function(cacheName) {
            return caches.delete(cacheName);
          })
        );
      })
    );
  });
  