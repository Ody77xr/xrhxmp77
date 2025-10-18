/**
 * Service Worker for HXMP Space
 * Handles caching strategy and ensures fresh content
 */

const CACHE_VERSION = 'v1.0.0';
const CACHE_NAME = `hxmp-space-${CACHE_VERSION}`;

// Assets to cache immediately
const PRECACHE_ASSETS = [
    '/',
    '/index.html',
    '/xrhome.html',
    '/auth-gateway.html',
    '/assets/xr2.png',
    '/floating-nav.css',
    '/floating-nav.js'
];

// Assets that should always be fetched fresh
const NETWORK_FIRST = [
    '/api/',
    '/auth-',
    '/admin-',
    '/supabase-config.js'
];

// Install event - cache essential assets
self.addEventListener('install', (event) => {
    console.log('Service Worker installing...');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Caching essential assets');
                return cache.addAll(PRECACHE_ASSETS.map(url => new Request(url, { cache: 'reload' })));
            })
            .then(() => self.skipWaiting())
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    console.log('Service Worker activating...');
    event.waitUntil(
        caches.keys()
            .then(cacheNames => {
                return Promise.all(
                    cacheNames
                        .filter(name => name.startsWith('hxmp-space-') && name !== CACHE_NAME)
                        .map(name => {
                            console.log('Deleting old cache:', name);
                            return caches.delete(name);
                        })
                );
            })
            .then(() => self.clients.claim())
    );
});

// Fetch event - implement caching strategy
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);
    
    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }
    
    // Skip external requests
    if (url.origin !== location.origin) {
        return;
    }
    
    // Network-first strategy for dynamic content
    if (NETWORK_FIRST.some(path => url.pathname.includes(path))) {
        event.respondWith(networkFirst(request));
        return;
    }
    
    // Cache-first strategy for static assets
    if (url.pathname.match(/\.(js|css|png|jpg|jpeg|svg|gif|woff|woff2)$/)) {
        event.respondWith(cacheFirst(request));
        return;
    }
    
    // Stale-while-revalidate for HTML pages
    event.respondWith(staleWhileRevalidate(request));
});

// Network-first strategy
async function networkFirst(request) {
    try {
        const response = await fetch(request);
        const cache = await caches.open(CACHE_NAME);
        cache.put(request, response.clone());
        return response;
    } catch (error) {
        const cached = await caches.match(request);
        return cached || new Response('Offline', { status: 503 });
    }
}

// Cache-first strategy
async function cacheFirst(request) {
    const cached = await caches.match(request);
    if (cached) {
        return cached;
    }
    
    try {
        const response = await fetch(request);
        const cache = await caches.open(CACHE_NAME);
        cache.put(request, response.clone());
        return response;
    } catch (error) {
        return new Response('Offline', { status: 503 });
    }
}

// Stale-while-revalidate strategy
async function staleWhileRevalidate(request) {
    const cached = await caches.match(request);
    
    const fetchPromise = fetch(request).then(response => {
        const cache = caches.open(CACHE_NAME);
        cache.then(c => c.put(request, response.clone()));
        return response;
    });
    
    return cached || fetchPromise;
}

// Listen for messages from clients
self.addEventListener('message', (event) => {
    if (event.data === 'skipWaiting') {
        self.skipWaiting();
    }
    
    if (event.data === 'clearCache') {
        event.waitUntil(
            caches.keys().then(cacheNames => {
                return Promise.all(
                    cacheNames.map(name => caches.delete(name))
                );
            })
        );
    }
});
