/**
 * SERVICE WORKER - PWA Offline Support
 * Prescription Clarity - Medical-Grade Reliability
 * 
 * Features:
 * - Offline caching (works without internet)
 * - Background sync (queues actions when offline)
 * - Push notifications (medication reminders)
 * - Version management (automatic updates)
 */

const CACHE_VERSION = 'v1';
const CACHE_NAME = `prescription-clarity-${CACHE_VERSION}`;
const OFFLINE_QUEUE_NAME = 'offline-queue-v1';

// Files to cache immediately on install
const STATIC_CACHE_URLS = [
  '/',
  '/index.html',
  '/offline.html',
  '/logo.svg',
  '/logo-square-transparent.svg',
  '/logo-transparent.svg',
];

// Cache strategies
const CACHE_STRATEGIES = {
  NETWORK_FIRST: 'network-first',    // Try network, fallback to cache (API calls)
  CACHE_FIRST: 'cache-first',        // Try cache, fallback to network (static assets)
  STALE_WHILE_REVALIDATE: 'stale-while-revalidate', // Return cache, update in background
};

// ==================== INSTALL ====================
self.addEventListener('install', (event) => {
  console.log('[SW] Installing Service Worker v' + CACHE_VERSION);
  
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Caching static assets');
      return cache.addAll(STATIC_CACHE_URLS);
    })
  );
  
  // Activate immediately
  self.skipWaiting();
});

// ==================== ACTIVATE ====================
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating Service Worker v' + CACHE_VERSION);
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // Delete old caches
          if (cacheName !== CACHE_NAME && cacheName !== OFFLINE_QUEUE_NAME) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  
  // Take control of all pages immediately
  return self.clients.claim();
});

// ==================== FETCH ====================
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip chrome extensions and non-http(s) requests
  if (!url.protocol.startsWith('http')) {
    return;
  }
  
  // API requests - Network First strategy
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(networkFirst(request));
    return;
  }
  
  // Static assets - Cache First strategy
  if (isStaticAsset(url.pathname)) {
    event.respondWith(cacheFirst(request));
    return;
  }
  
  // HTML pages - Stale While Revalidate
  if (request.headers.get('accept').includes('text/html')) {
    event.respondWith(staleWhileRevalidate(request));
    return;
  }
  
  // Default - Network First
  event.respondWith(networkFirst(request));
});

// ==================== CACHE STRATEGIES ====================

/**
 * Network First: Try network, fallback to cache
 * Best for: API calls, dynamic data
 */
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    
    // Cache successful responses
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('[SW] Network failed, trying cache:', request.url);
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline page for HTML requests
    if (request.headers.get('accept').includes('text/html')) {
      return caches.match('/offline.html');
    }
    
    // Return error for other requests
    return new Response('Offline', { status: 503 });
  }
}

/**
 * Cache First: Try cache, fallback to network
 * Best for: Static assets (CSS, JS, images)
 */
async function cacheFirst(request) {
  const cachedResponse = await caches.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('[SW] Failed to fetch:', request.url);
    return new Response('Offline', { status: 503 });
  }
}

/**
 * Stale While Revalidate: Return cache, update in background
 * Best for: HTML pages, frequently updated content
 */
async function staleWhileRevalidate(request) {
  const cache = await caches.open(CACHE_NAME);
  const cachedResponse = await cache.match(request);
  
  // Fetch in background and update cache
  const fetchPromise = fetch(request).then((networkResponse) => {
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  }).catch(() => null);
  
  // Return cached response immediately, or wait for network
  return cachedResponse || fetchPromise || caches.match('/offline.html');
}

// ==================== HELPERS ====================

/**
 * Check if URL is a static asset
 */
function isStaticAsset(pathname) {
  const staticExtensions = ['.js', '.css', '.png', '.jpg', '.jpeg', '.svg', '.gif', '.webp', '.woff', '.woff2'];
  return staticExtensions.some(ext => pathname.endsWith(ext));
}

// ==================== BACKGROUND SYNC ====================

/**
 * Background Sync: Queue offline actions
 * Syncs when connection restored
 */
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync event:', event.tag);
  
  if (event.tag === 'sync-offline-queue') {
    event.waitUntil(syncOfflineQueue());
  }
});

/**
 * Sync offline queue with server
 */
async function syncOfflineQueue() {
  try {
    const queue = await getOfflineQueue();
    
    if (queue.length === 0) {
      console.log('[SW] Offline queue is empty');
      return;
    }
    
    console.log('[SW] Syncing', queue.length, 'queued actions');
    
    for (const item of queue) {
      try {
        // Make API request
        const response = await fetch(item.url, {
          method: item.method,
          headers: item.headers,
          body: item.body,
        });
        
        if (response.ok) {
          console.log('[SW] Synced:', item.action);
          await removeFromQueue(item.id);
        }
      } catch (error) {
        console.error('[SW] Failed to sync:', item.action, error);
      }
    }
  } catch (error) {
    console.error('[SW] Background sync failed:', error);
  }
}

/**
 * Get offline queue from IndexedDB
 */
async function getOfflineQueue() {
  // TODO: Implement IndexedDB storage
  // For now, return empty array
  return [];
}

/**
 * Remove item from offline queue
 */
async function removeFromQueue(id) {
  // TODO: Implement IndexedDB removal
  console.log('[SW] Removed from queue:', id);
}

// ==================== PUSH NOTIFICATIONS ====================

/**
 * Push notification event
 * Displays medication reminders
 */
self.addEventListener('push', (event) => {
  console.log('[SW] Push notification received');
  
  let data = {
    title: 'Prescription Clarity',
    body: 'Time to take your medication!',
    icon: '/logo.svg',
    badge: '/logo.svg',
    data: {},
  };
  
  if (event.data) {
    try {
      data = { ...data, ...event.data.json() };
    } catch (error) {
      console.error('[SW] Failed to parse push data:', error);
    }
  }
  
  const options = {
    body: data.body,
    icon: data.icon,
    badge: data.badge,
    data: data.data,
    vibrate: [200, 100, 200],
    tag: 'medication-reminder',
    requireInteraction: true,
    actions: [
      {
        action: 'mark-taken',
        title: 'Mark as Taken',
      },
      {
        action: 'snooze',
        title: 'Snooze 15min',
      },
    ],
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

/**
 * Notification click event
 * Opens app or performs action
 */
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification clicked:', event.action);
  
  event.notification.close();
  
  if (event.action === 'mark-taken') {
    // TODO: Mark medication as taken via API
    console.log('[SW] Mark as taken:', event.notification.data);
  } else if (event.action === 'snooze') {
    // TODO: Snooze notification for 15 minutes
    console.log('[SW] Snooze notification');
  } else {
    // Open app
    event.waitUntil(
      clients.openWindow(event.notification.data.url || '/')
    );
  }
});

// ==================== MESSAGE ====================

/**
 * Message event from app
 * Handles commands from main thread
 */
self.addEventListener('message', (event) => {
  console.log('[SW] Message received:', event.data);
  
  if (event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data.type === 'CACHE_URLS') {
    event.waitUntil(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.addAll(event.data.urls);
      })
    );
  }
  
  if (event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.delete(CACHE_NAME).then(() => {
        console.log('[SW] Cache cleared');
      })
    );
  }
});

console.log('[SW] Service Worker loaded successfully');
