/**
 * OFFLINE QUEUE
 * Queues API requests when offline, syncs when back online
 * 
 * Features:
 * - IndexedDB storage (persistent across sessions)
 * - Automatic retry (exponential backoff)
 * - Background Sync API (syncs when connection restored)
 * - FIFO queue (first in, first out)
 */

import { openDB, DBSchema, IDBPDatabase } from 'idb';

// ==================== TYPES ====================

interface QueueItem {
  id: string;
  action: string;
  url: string;
  method: string;
  headers: Record<string, string>;
  body?: string;
  data?: any;
  timestamp: number;
  retries: number;
  maxRetries: number;
}

interface OfflineQueueDB extends DBSchema {
  queue: {
    key: string;
    value: QueueItem;
    indexes: {
      timestamp: number;
      action: string;
    };
  };
}

// ==================== DATABASE ====================

const DB_NAME = 'prescription-clarity-offline';
const DB_VERSION = 1;
const QUEUE_STORE = 'queue';

let db: IDBPDatabase<OfflineQueueDB> | null = null;

/**
 * Initialize IndexedDB
 */
async function initDB(): Promise<IDBPDatabase<OfflineQueueDB>> {
  if (db) {
    return db;
  }

  db = await openDB<OfflineQueueDB>(DB_NAME, DB_VERSION, {
    upgrade(database) {
      // Create queue store
      if (!database.objectStoreNames.contains(QUEUE_STORE)) {
        const store = database.createObjectStore(QUEUE_STORE, {
          keyPath: 'id',
        });

        // Create indexes
        store.createIndex('timestamp', 'timestamp');
        store.createIndex('action', 'action');
      }
    },
  });

  return db;
}

// ==================== QUEUE OPERATIONS ====================

/**
 * Add item to offline queue
 */
export async function addToQueue(item: Omit<QueueItem, 'id' | 'timestamp' | 'retries'>): Promise<string> {
  const database = await initDB();

  const queueItem: QueueItem = {
    ...item,
    id: generateId(),
    timestamp: Date.now(),
    retries: 0,
    maxRetries: item.maxRetries || 3,
  };

  await database.add(QUEUE_STORE, queueItem);

  console.log('[OfflineQueue] Added to queue:', queueItem.action);

  // Request background sync
  requestBackgroundSync();

  return queueItem.id;
}

/**
 * Get all queued items
 */
export async function getQueue(): Promise<QueueItem[]> {
  const database = await initDB();
  const items = await database.getAll(QUEUE_STORE);

  // Sort by timestamp (FIFO)
  return items.sort((a, b) => a.timestamp - b.timestamp);
}

/**
 * Get queue item by ID
 */
export async function getQueueItem(id: string): Promise<QueueItem | undefined> {
  const database = await initDB();
  return await database.get(QUEUE_STORE, id);
}

/**
 * Remove item from queue
 */
export async function removeFromQueue(id: string): Promise<void> {
  const database = await initDB();
  await database.delete(QUEUE_STORE, id);

  console.log('[OfflineQueue] Removed from queue:', id);
}

/**
 * Update queue item (for retry logic)
 */
export async function updateQueueItem(id: string, updates: Partial<QueueItem>): Promise<void> {
  const database = await initDB();
  const item = await database.get(QUEUE_STORE, id);

  if (item) {
    await database.put(QUEUE_STORE, { ...item, ...updates });
  }
}

/**
 * Clear entire queue
 */
export async function clearQueue(): Promise<void> {
  const database = await initDB();
  await database.clear(QUEUE_STORE);

  console.log('[OfflineQueue] Queue cleared');
}

/**
 * Get queue size
 */
export async function getQueueSize(): Promise<number> {
  const database = await initDB();
  return await database.count(QUEUE_STORE);
}

// ==================== SYNC ====================

/**
 * Process offline queue
 * Syncs all queued items with server
 */
export async function processQueue(): Promise<void> {
  const queue = await getQueue();

  if (queue.length === 0) {
    console.log('[OfflineQueue] Queue is empty');
    return;
  }

  console.log('[OfflineQueue] Processing', queue.length, 'items');

  for (const item of queue) {
    try {
      await syncQueueItem(item);
    } catch (error) {
      console.error('[OfflineQueue] Failed to sync item:', item.action, error);
    }
  }
}

/**
 * Sync single queue item
 */
async function syncQueueItem(item: QueueItem): Promise<void> {
  try {
    // Make API request
    const response = await fetch(item.url, {
      method: item.method,
      headers: item.headers,
      body: item.body,
    });

    if (response.ok) {
      // Success - remove from queue
      await removeFromQueue(item.id);
      console.log('[OfflineQueue] Synced:', item.action);
    } else if (response.status >= 400 && response.status < 500) {
      // Client error - remove from queue (won't succeed on retry)
      await removeFromQueue(item.id);
      console.error('[OfflineQueue] Client error, removed:', item.action, response.status);
    } else {
      // Server error - retry
      await retryQueueItem(item);
    }
  } catch (error) {
    // Network error - retry
    await retryQueueItem(item);
  }
}

/**
 * Retry queue item with exponential backoff
 */
async function retryQueueItem(item: QueueItem): Promise<void> {
  const newRetries = item.retries + 1;

  if (newRetries >= item.maxRetries) {
    // Max retries reached - remove from queue
    await removeFromQueue(item.id);
    console.error('[OfflineQueue] Max retries reached, removed:', item.action);
    return;
  }

  // Update retry count
  await updateQueueItem(item.id, {
    retries: newRetries,
  });

  console.log(`[OfflineQueue] Retry ${newRetries}/${item.maxRetries}:`, item.action);

  // Schedule retry with exponential backoff
  const delay = Math.min(1000 * Math.pow(2, newRetries), 30000); // Max 30 seconds
  setTimeout(() => {
    syncQueueItem(item);
  }, delay);
}

// ==================== BACKGROUND SYNC ====================

/**
 * Request background sync
 * Syncs queue when connection restored
 */
function requestBackgroundSync(): void {
  if (!('serviceWorker' in navigator) || !('sync' in ServiceWorkerRegistration.prototype)) {
    console.log('[OfflineQueue] Background Sync not supported');
    return;
  }

  navigator.serviceWorker.ready
    .then((registration) => {
      return registration.sync.register('sync-offline-queue');
    })
    .then(() => {
      console.log('[OfflineQueue] Background sync registered');
    })
    .catch((error) => {
      console.error('[OfflineQueue] Background sync registration failed:', error);
    });
}

// ==================== HELPERS ====================

/**
 * Generate unique ID
 */
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Check if online
 */
export function isOnline(): boolean {
  return navigator.onLine;
}

// ==================== AUTO-SYNC ====================

/**
 * Initialize auto-sync
 * Automatically syncs queue when back online
 */
export function initializeAutoSync(): void {
  // Sync when online
  window.addEventListener('online', () => {
    console.log('[OfflineQueue] Back online, syncing queue');
    processQueue();
  });

  // Sync on page load if online
  if (isOnline()) {
    processQueue();
  }

  // Periodic sync (every 5 minutes)
  setInterval(() => {
    if (isOnline()) {
      processQueue();
    }
  }, 5 * 60 * 1000);
}

// ==================== API WRAPPER ====================

/**
 * Offline-aware fetch wrapper
 * Automatically queues requests when offline
 */
export async function offlineFetch(
  url: string,
  options: RequestInit & { action?: string; data?: any; maxRetries?: number } = {}
): Promise<Response> {
  // Try immediate fetch if online
  if (isOnline()) {
    try {
      const response = await fetch(url, options);
      return response;
    } catch (error) {
      // Network error - fall through to queue
      console.log('[OfflineQueue] Fetch failed, queuing:', url);
    }
  }

  // Queue request for later
  const headers: Record<string, string> = {};
  if (options.headers) {
    if (options.headers instanceof Headers) {
      options.headers.forEach((value, key) => {
        headers[key] = value;
      });
    } else if (Array.isArray(options.headers)) {
      options.headers.forEach(([key, value]) => {
        headers[key] = value;
      });
    } else {
      Object.assign(headers, options.headers);
    }
  }

  await addToQueue({
    action: options.action || 'api-request',
    url,
    method: options.method || 'GET',
    headers,
    body: options.body as string,
    data: options.data,
    maxRetries: options.maxRetries || 3,
  });

  // Return mock response
  return new Response(JSON.stringify({ queued: true }), {
    status: 202, // Accepted
    statusText: 'Queued for sync',
  });
}

// ==================== EXPORTS ====================

export default {
  // Queue operations
  addToQueue,
  getQueue,
  getQueueItem,
  removeFromQueue,
  updateQueueItem,
  clearQueue,
  getQueueSize,

  // Sync
  processQueue,

  // Auto-sync
  initializeAutoSync,

  // Fetch wrapper
  offlineFetch,

  // Helpers
  isOnline,
};
