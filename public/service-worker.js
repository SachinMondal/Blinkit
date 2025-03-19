const CACHE_NAME = "app-cache-v2"; // Increment version when updating
const urlsToCache = [
  "/",
  "/index.html",
  "/logo192.png",
  "/logo512.png",
  "/manifest.json"
];

// Install Service Worker and Cache Files
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting(); // Forces new service worker to take control immediately
});

// Serve Cached Files but Always Check for Updates
self.addEventListener("fetch", (event) => {
  event.respondWith(
    fetch(event.request) // Try network first
      .then((response) => {
        if (!response || response.status !== 200 || response.type !== "basic") {
          return response;
        }

        // Clone response and store in cache
        let responseToCache = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return response;
      })
      .catch(() => caches.match(event.request)) // Fallback to cache if offline
  );
});

// Activate: Delete Old Caches and Claim Clients
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log("Deleting old cache:", cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim(); // Take control of all tabs immediately
});

// Listen for Messages from Client (e.g., force update)
self.addEventListener("message", (event) => {
  if (event.data === "skipWaiting") {
    self.skipWaiting();
  }
});
