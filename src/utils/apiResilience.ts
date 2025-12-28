/**
 * API RESILIENCE UTILITIES
 * Medical-grade API resilience for Prescription Clarity
 * Critical: Network failures cannot prevent medication tracking
 * 
 * Features:
 * - Automatic retry with exponential backoff
 * - Request cancellation (prevent race conditions)
 * - Offline detection
 * - Request queue for offline mode
 * - Circuit breaker pattern
 */

import { log } from './logger';

// ==================== RETRY LOGIC ====================

export interface RetryConfig {
  maxAttempts?: number; // Default: 3
  baseDelay?: number; // Default: 1000ms
  maxDelay?: number; // Default: 10000ms
  shouldRetry?: (error: Error) => boolean;
  onRetry?: (attempt: number, error: Error) => void;
}

/**
 * Retry function with exponential backoff
 * Uses: API calls that can fail due to network issues
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  config: RetryConfig = {}
): Promise<T> {
  const {
    maxAttempts = 3,
    baseDelay = 1000,
    maxDelay = 10000,
    shouldRetry = () => true,
    onRetry,
  } = config;

  let lastError: Error;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;

      // Don't retry if shouldRetry returns false
      if (!shouldRetry(lastError)) {
        throw lastError;
      }

      // Don't retry if this was the last attempt
      if (attempt === maxAttempts) {
        break;
      }

      // Calculate delay with exponential backoff
      const delay = Math.min(baseDelay * Math.pow(2, attempt - 1), maxDelay);

      log.warn(`Retry attempt ${attempt}/${maxAttempts} after ${delay}ms`, {
        error: lastError.message,
        attempt,
        delay,
      });

      // Call onRetry callback if provided
      if (onRetry) {
        onRetry(attempt, lastError);
      }

      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  // All attempts failed
  log.error('All retry attempts failed', lastError!, {
    maxAttempts,
  });

  throw lastError!;
}

/**
 * Determines if error is retryable (network errors, timeouts, 5xx)
 */
export function isRetryableError(error: any): boolean {
  // Network errors (no internet, DNS failure, etc.)
  if (error.message?.includes('network') || error.message?.includes('fetch')) {
    return true;
  }

  // Timeout errors
  if (error.message?.includes('timeout')) {
    return true;
  }

  // HTTP 5xx errors (server errors)
  if (error.status && error.status >= 500 && error.status < 600) {
    return true;
  }

  // HTTP 429 (rate limit) - retry after delay
  if (error.status === 429) {
    return true;
  }

  // Don't retry client errors (4xx) except 429
  if (error.status && error.status >= 400 && error.status < 500) {
    return false;
  }

  return false;
}

// ==================== REQUEST CANCELLATION ====================

/**
 * AbortController wrapper for request cancellation
 * Prevents race conditions when switching between pages quickly
 */
export class CancellableRequest<T> {
  private abortController: AbortController;
  private promise: Promise<T>;

  constructor(
    requestFn: (signal: AbortSignal) => Promise<T>
  ) {
    this.abortController = new AbortController();
    this.promise = requestFn(this.abortController.signal);
  }

  /**
   * Cancel the request
   */
  cancel(): void {
    this.abortController.abort();
    log.debug('Request cancelled');
  }

  /**
   * Get the promise
   */
  getPromise(): Promise<T> {
    return this.promise;
  }

  /**
   * Check if cancelled
   */
  isCancelled(): boolean {
    return this.abortController.signal.aborted;
  }
}

/**
 * Create cancellable request
 * 
 * @example
 * const request = createCancellableRequest(signal => 
 *   fetch('/api/medications', { signal })
 * );
 * 
 * // Later, if component unmounts:
 * request.cancel();
 */
export function createCancellableRequest<T>(
  requestFn: (signal: AbortSignal) => Promise<T>
): CancellableRequest<T> {
  return new CancellableRequest(requestFn);
}

// ==================== OFFLINE DETECTION ====================

/**
 * Check if user is online
 */
export function isOnline(): boolean {
  return navigator.onLine;
}

/**
 * Wait for online connection
 * Resolves when user comes back online
 */
export function waitForOnline(timeoutMs: number = 30000): Promise<void> {
  return new Promise((resolve, reject) => {
    if (isOnline()) {
      resolve();
      return;
    }

    const timeout = setTimeout(() => {
      window.removeEventListener('online', onOnline);
      reject(new Error('Timeout waiting for connection'));
    }, timeoutMs);

    const onOnline = () => {
      clearTimeout(timeout);
      window.removeEventListener('online', onOnline);
      resolve();
    };

    window.addEventListener('online', onOnline);
  });
}

/**
 * Listen for online/offline events
 */
export function onConnectionChange(
  callback: (isOnline: boolean) => void
): () => void {
  const onOnline = () => {
    log.info('Connection restored');
    callback(true);
  };

  const onOffline = () => {
    log.warn('Connection lost');
    callback(false);
  };

  window.addEventListener('online', onOnline);
  window.addEventListener('offline', onOffline);

  // Return cleanup function
  return () => {
    window.removeEventListener('online', onOnline);
    window.removeEventListener('offline', onOffline);
  };
}

// ==================== REQUEST QUEUE (Offline Support) ====================

interface QueuedRequest {
  id: string;
  method: string;
  url: string;
  data?: any;
  timestamp: number;
  retries: number;
}

class RequestQueue {
  private queue: QueuedRequest[] = [];
  private processing = false;
  private readonly STORAGE_KEY = 'offline_request_queue';
  private readonly MAX_RETRIES = 3;

  constructor() {
    this.loadQueue();
  }

  /**
   * Add request to queue (for offline mode)
   */
  enqueue(method: string, url: string, data?: any): string {
    const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const request: QueuedRequest = {
      id,
      method,
      url,
      data,
      timestamp: Date.now(),
      retries: 0,
    };

    this.queue.push(request);
    this.saveQueue();

    log.info('Request queued for offline processing', {
      id,
      method,
      url,
    });

    return id;
  }

  /**
   * Process queue when back online
   */
  async processQueue(): Promise<void> {
    if (this.processing || this.queue.length === 0) {
      return;
    }

    if (!isOnline()) {
      log.warn('Cannot process queue - still offline');
      return;
    }

    this.processing = true;
    log.info(`Processing ${this.queue.length} queued requests`);

    while (this.queue.length > 0) {
      const request = this.queue[0];

      try {
        // Try to send request
        await this.sendRequest(request);
        
        // Success - remove from queue
        this.queue.shift();
        this.saveQueue();
        
        log.info('Queued request processed successfully', {
          id: request.id,
          method: request.method,
          url: request.url,
        });
      } catch (error) {
        // Increment retry count
        request.retries++;

        if (request.retries >= this.MAX_RETRIES) {
          // Max retries reached - remove from queue
          log.error('Queued request failed after max retries', error as Error, {
            id: request.id,
            retries: request.retries,
          });
          
          this.queue.shift();
          this.saveQueue();
        } else {
          // Retry later
          log.warn(`Queued request failed, will retry (${request.retries}/${this.MAX_RETRIES})`, {
            id: request.id,
            error: (error as Error).message,
          });
          
          // Move to end of queue
          this.queue.push(this.queue.shift()!);
          this.saveQueue();
          
          // Wait before next attempt
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
    }

    this.processing = false;
    log.info('Queue processing complete');
  }

  /**
   * Send queued request
   */
  private async sendRequest(request: QueuedRequest): Promise<void> {
    const response = await fetch(request.url, {
      method: request.method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: request.data ? JSON.stringify(request.data) : undefined,
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
  }

  /**
   * Get queue size
   */
  size(): number {
    return this.queue.length;
  }

  /**
   * Clear queue
   */
  clear(): void {
    this.queue = [];
    this.saveQueue();
    log.info('Request queue cleared');
  }

  /**
   * Save queue to localStorage
   */
  private saveQueue(): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.queue));
    } catch (error) {
      log.error('Failed to save request queue', error as Error);
    }
  }

  /**
   * Load queue from localStorage
   */
  private loadQueue(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        this.queue = JSON.parse(stored);
        log.info(`Loaded ${this.queue.length} queued requests from storage`);
      }
    } catch (error) {
      log.error('Failed to load request queue', error as Error);
      this.queue = [];
    }
  }
}

// Singleton instance
const requestQueue = new RequestQueue();

export { requestQueue };

// ==================== CIRCUIT BREAKER ====================

/**
 * Circuit Breaker pattern
 * Prevents calling failing API repeatedly
 * States: CLOSED (normal) → OPEN (failing) → HALF_OPEN (testing)
 */
export enum CircuitState {
  CLOSED = 'CLOSED', // Normal operation
  OPEN = 'OPEN', // Too many failures, stop calling API
  HALF_OPEN = 'HALF_OPEN', // Testing if API recovered
}

interface CircuitBreakerConfig {
  failureThreshold?: number; // Default: 5
  resetTimeout?: number; // Default: 60000ms (1 minute)
  monitoringPeriod?: number; // Default: 120000ms (2 minutes)
}

export class CircuitBreaker {
  private state: CircuitState = CircuitState.CLOSED;
  private failureCount = 0;
  private lastFailureTime = 0;
  private resetTimer: NodeJS.Timeout | null = null;

  private readonly failureThreshold: number;
  private readonly resetTimeout: number;
  private readonly monitoringPeriod: number;

  constructor(config: CircuitBreakerConfig = {}) {
    this.failureThreshold = config.failureThreshold || 5;
    this.resetTimeout = config.resetTimeout || 60000; // 1 minute
    this.monitoringPeriod = config.monitoringPeriod || 120000; // 2 minutes
  }

  /**
   * Execute function with circuit breaker
   */
  async execute<T>(fn: () => Promise<T>): Promise<T> {
    // Check if circuit is open
    if (this.state === CircuitState.OPEN) {
      throw new Error('Circuit breaker is OPEN - too many failures');
    }

    try {
      const result = await fn();
      
      // Success - reset on half-open
      if (this.state === CircuitState.HALF_OPEN) {
        this.reset();
      }
      
      return result;
    } catch (error) {
      this.recordFailure();
      throw error;
    }
  }

  /**
   * Record a failure
   */
  private recordFailure(): void {
    this.lastFailureTime = Date.now();
    this.failureCount++;

    log.warn(`Circuit breaker failure recorded (${this.failureCount}/${this.failureThreshold})`, {
      state: this.state,
      failureCount: this.failureCount,
    });

    // Check if we should open the circuit
    if (this.failureCount >= this.failureThreshold) {
      this.open();
    }
  }

  /**
   * Open circuit (stop calling API)
   */
  private open(): void {
    this.state = CircuitState.OPEN;
    log.error('Circuit breaker OPENED - too many failures', undefined, {
      failureCount: this.failureCount,
      threshold: this.failureThreshold,
    });

    // Schedule transition to half-open
    this.resetTimer = setTimeout(() => {
      this.halfOpen();
    }, this.resetTimeout);
  }

  /**
   * Transition to half-open (test if API recovered)
   */
  private halfOpen(): void {
    this.state = CircuitState.HALF_OPEN;
    log.info('Circuit breaker HALF-OPEN - testing recovery');
  }

  /**
   * Reset circuit breaker (back to normal)
   */
  private reset(): void {
    this.state = CircuitState.CLOSED;
    this.failureCount = 0;
    
    if (this.resetTimer) {
      clearTimeout(this.resetTimer);
      this.resetTimer = null;
    }

    log.info('Circuit breaker CLOSED - recovered');
  }

  /**
   * Get current state
   */
  getState(): CircuitState {
    return this.state;
  }

  /**
   * Manually reset circuit breaker
   */
  forceReset(): void {
    this.reset();
    log.info('Circuit breaker manually reset');
  }
}

// ==================== UTILITY FUNCTIONS ====================

/**
 * Wrap fetch with retry logic
 */
export async function fetchWithRetry(
  url: string,
  options: RequestInit = {},
  retryConfig?: RetryConfig
): Promise<Response> {
  return retryWithBackoff(
    () => fetch(url, options),
    {
      ...retryConfig,
      shouldRetry: (error) => isRetryableError(error),
    }
  );
}

/**
 * Fetch with timeout
 */
export async function fetchWithTimeout(
  url: string,
  options: RequestInit = {},
  timeoutMs: number = 30000
): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeout);
    return response;
  } catch (error) {
    clearTimeout(timeout);
    throw error;
  }
}

/**
 * Combine retry + timeout
 */
export async function fetchWithResiliency(
  url: string,
  options: RequestInit = {},
  config: {
    timeoutMs?: number;
    retryConfig?: RetryConfig;
  } = {}
): Promise<Response> {
  const { timeoutMs = 30000, retryConfig } = config;

  return retryWithBackoff(
    () => fetchWithTimeout(url, options, timeoutMs),
    {
      ...retryConfig,
      shouldRetry: (error) => isRetryableError(error),
    }
  );
}

// ==================== AUTO PROCESS QUEUE ON RECONNECT ====================

// Automatically process queue when connection is restored
onConnectionChange((online) => {
  if (online && requestQueue.size() > 0) {
    log.info('Connection restored - processing queued requests');
    requestQueue.processQueue().catch((error) => {
      log.error('Failed to process queue', error);
    });
  }
});
