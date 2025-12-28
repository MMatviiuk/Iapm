/**
 * PWA UTILITIES
 * Progressive Web App helpers for Prescription Clarity
 * 
 * Features:
 * - Service Worker registration
 * - Install prompt management
 * - Push notification subscription
 * - Offline detection
 * - Update management
 */

// ==================== SERVICE WORKER ====================

/**
 * Register Service Worker
 * Enables offline functionality
 */
export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (!('serviceWorker' in navigator)) {
    console.log('[PWA] Service Worker not supported');
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/',
    });

    console.log('[PWA] Service Worker registered:', registration.scope);

    // Check for updates every 24 hours
    setInterval(() => {
      registration.update();
    }, 24 * 60 * 60 * 1000);

    // Listen for updates
    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing;
      if (newWorker) {
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            // New version available
            console.log('[PWA] New version available!');
            showUpdateNotification();
          }
        });
      }
    });

    return registration;
  } catch (error) {
    console.error('[PWA] Service Worker registration failed:', error);
    return null;
  }
}

/**
 * Unregister Service Worker
 * For testing or troubleshooting
 */
export async function unregisterServiceWorker(): Promise<boolean> {
  if (!('serviceWorker' in navigator)) {
    return false;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    const success = await registration.unregister();
    console.log('[PWA] Service Worker unregistered:', success);
    return success;
  } catch (error) {
    console.error('[PWA] Service Worker unregistration failed:', error);
    return false;
  }
}

/**
 * Show update notification
 * Prompts user to reload for new version
 */
function showUpdateNotification() {
  // TODO: Show toast notification with reload button
  console.log('[PWA] Please reload to get the latest version');
}

/**
 * Skip waiting and activate new service worker
 */
export async function updateServiceWorker(): Promise<void> {
  if (!('serviceWorker' in navigator)) {
    return;
  }

  const registration = await navigator.serviceWorker.ready;
  if (registration.waiting) {
    registration.waiting.postMessage({ type: 'SKIP_WAITING' });
    window.location.reload();
  }
}

// ==================== INSTALL PROMPT ====================

let deferredPrompt: any = null;

/**
 * Initialize install prompt
 * Captures beforeinstallprompt event
 */
export function initializeInstallPrompt(): void {
  window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent default browser prompt
    e.preventDefault();
    
    // Store event for later
    deferredPrompt = e;
    
    console.log('[PWA] Install prompt available');
    
    // TODO: Show custom install button
  });

  // Log install outcome
  window.addEventListener('appinstalled', () => {
    console.log('[PWA] App installed successfully');
    deferredPrompt = null;
    
    // TODO: Track install event
  });
}

/**
 * Show install prompt
 * Displays browser's install dialog
 */
export async function showInstallPrompt(): Promise<boolean> {
  if (!deferredPrompt) {
    console.log('[PWA] Install prompt not available');
    return false;
  }

  try {
    // Show prompt
    deferredPrompt.prompt();

    // Wait for user choice
    const { outcome } = await deferredPrompt.userChoice;
    console.log('[PWA] Install prompt outcome:', outcome);

    // Clear prompt
    deferredPrompt = null;

    return outcome === 'accepted';
  } catch (error) {
    console.error('[PWA] Install prompt failed:', error);
    return false;
  }
}

/**
 * Check if app can be installed
 */
export function canInstall(): boolean {
  return deferredPrompt !== null;
}

/**
 * Check if app is installed
 */
export function isInstalled(): boolean {
  // Check if running in standalone mode
  if (window.matchMedia('(display-mode: standalone)').matches) {
    return true;
  }

  // Check if running as PWA on iOS
  if ((window.navigator as any).standalone) {
    return true;
  }

  return false;
}

// ==================== PUSH NOTIFICATIONS ====================

/**
 * Request notification permission
 * Required before subscribing to push
 */
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!('Notification' in window)) {
    console.log('[PWA] Notifications not supported');
    return 'denied';
  }

  if (Notification.permission === 'granted') {
    return 'granted';
  }

  if (Notification.permission === 'denied') {
    return 'denied';
  }

  try {
    const permission = await Notification.requestPermission();
    console.log('[PWA] Notification permission:', permission);
    return permission;
  } catch (error) {
    console.error('[PWA] Notification permission request failed:', error);
    return 'denied';
  }
}

/**
 * Subscribe to push notifications
 * Requires VAPID public key from backend
 */
export async function subscribeToPush(vapidPublicKey: string): Promise<PushSubscription | null> {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    console.log('[PWA] Push notifications not supported');
    return null;
  }

  try {
    // Request permission first
    const permission = await requestNotificationPermission();
    if (permission !== 'granted') {
      console.log('[PWA] Notification permission denied');
      return null;
    }

    // Get service worker registration
    const registration = await navigator.serviceWorker.ready;

    // Subscribe to push
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
    });

    console.log('[PWA] Push subscription created');
    return subscription;
  } catch (error) {
    console.error('[PWA] Push subscription failed:', error);
    return null;
  }
}

/**
 * Unsubscribe from push notifications
 */
export async function unsubscribeFromPush(): Promise<boolean> {
  if (!('serviceWorker' in navigator)) {
    return false;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();

    if (subscription) {
      const success = await subscription.unsubscribe();
      console.log('[PWA] Push unsubscribed:', success);
      return success;
    }

    return false;
  } catch (error) {
    console.error('[PWA] Push unsubscribe failed:', error);
    return false;
  }
}

/**
 * Get current push subscription
 */
export async function getPushSubscription(): Promise<PushSubscription | null> {
  if (!('serviceWorker' in navigator)) {
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    return subscription;
  } catch (error) {
    console.error('[PWA] Get push subscription failed:', error);
    return null;
  }
}

/**
 * Convert VAPID key from base64 to Uint8Array
 */
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
}

// ==================== OFFLINE DETECTION ====================

let isOnlineState = navigator.onLine;
const onlineCallbacks: Array<() => void> = [];
const offlineCallbacks: Array<() => void> = [];

/**
 * Initialize online/offline detection
 */
export function initializeOnlineDetection(): void {
  window.addEventListener('online', () => {
    console.log('[PWA] Back online');
    isOnlineState = true;
    onlineCallbacks.forEach((callback) => callback());
  });

  window.addEventListener('offline', () => {
    console.log('[PWA] Gone offline');
    isOnlineState = false;
    offlineCallbacks.forEach((callback) => callback());
  });
}

/**
 * Check if online
 */
export function isOnline(): boolean {
  return isOnlineState;
}

/**
 * Add callback for when online
 */
export function onOnline(callback: () => void): void {
  onlineCallbacks.push(callback);
}

/**
 * Add callback for when offline
 */
export function onOffline(callback: () => void): void {
  offlineCallbacks.push(callback);
}

/**
 * Remove online callback
 */
export function removeOnlineCallback(callback: () => void): void {
  const index = onlineCallbacks.indexOf(callback);
  if (index > -1) {
    onlineCallbacks.splice(index, 1);
  }
}

/**
 * Remove offline callback
 */
export function removeOfflineCallback(callback: () => void): void {
  const index = offlineCallbacks.indexOf(callback);
  if (index > -1) {
    offlineCallbacks.splice(index, 1);
  }
}

// ==================== CACHE MANAGEMENT ====================

/**
 * Clear all caches
 * Useful for troubleshooting
 */
export async function clearAllCaches(): Promise<void> {
  if (!('caches' in window)) {
    return;
  }

  try {
    const cacheNames = await caches.keys();
    await Promise.all(cacheNames.map((cacheName) => caches.delete(cacheName)));
    console.log('[PWA] All caches cleared');
  } catch (error) {
    console.error('[PWA] Clear caches failed:', error);
  }
}

/**
 * Get cache size
 */
export async function getCacheSize(): Promise<number> {
  if (!('caches' in window)) {
    return 0;
  }

  try {
    const cacheNames = await caches.keys();
    let totalSize = 0;

    for (const cacheName of cacheNames) {
      const cache = await caches.open(cacheName);
      const requests = await cache.keys();

      for (const request of requests) {
        const response = await cache.match(request);
        if (response) {
          const blob = await response.blob();
          totalSize += blob.size;
        }
      }
    }

    return totalSize;
  } catch (error) {
    console.error('[PWA] Get cache size failed:', error);
    return 0;
  }
}

/**
 * Format cache size for display
 */
export function formatCacheSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

// ==================== INITIALIZATION ====================

/**
 * Initialize all PWA features
 * Call this in main.tsx or App.tsx
 */
export async function initializePWA(): Promise<void> {
  console.log('[PWA] Initializing...');

  // Register service worker
  await registerServiceWorker();

  // Initialize install prompt
  initializeInstallPrompt();

  // Initialize online detection
  initializeOnlineDetection();

  console.log('[PWA] Initialized successfully');
}

// ==================== EXPORTS ====================

export default {
  // Service Worker
  registerServiceWorker,
  unregisterServiceWorker,
  updateServiceWorker,

  // Install
  initializeInstallPrompt,
  showInstallPrompt,
  canInstall,
  isInstalled,

  // Push Notifications
  requestNotificationPermission,
  subscribeToPush,
  unsubscribeFromPush,
  getPushSubscription,

  // Offline Detection
  initializeOnlineDetection,
  isOnline,
  onOnline,
  onOffline,
  removeOnlineCallback,
  removeOfflineCallback,

  // Cache Management
  clearAllCaches,
  getCacheSize,
  formatCacheSize,

  // Initialize
  initializePWA,
};
