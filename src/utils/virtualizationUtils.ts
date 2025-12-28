/**
 * VIRTUALIZATION UTILITIES
 * Performance optimization helpers for virtual scrolling
 * 
 * Features:
 * - Lazy loading images in viewport
 * - Debounced scroll handlers
 * - Intersection Observer for visibility detection
 * - Memory usage monitoring
 */

// ==================== INTERSECTION OBSERVER ====================

/**
 * Create Intersection Observer for lazy loading
 */
export function createIntersectionObserver(
  callback: (entry: IntersectionObserverEntry) => void,
  options: IntersectionObserverInit = {}
): IntersectionObserver {
  const defaultOptions: IntersectionObserverInit = {
    root: null,
    rootMargin: '50px', // Load 50px before entering viewport
    threshold: 0.01, // Trigger when 1% visible
    ...options,
  };

  return new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        callback(entry);
      }
    });
  }, defaultOptions);
}

// ==================== DEBOUNCED SCROLL ====================

/**
 * Debounce scroll events for performance
 */
export function debounceScroll(
  callback: (event: Event) => void,
  delay: number = 100
): (event: Event) => void {
  let timeoutId: NodeJS.Timeout;

  return (event: Event) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => callback(event), delay);
  };
}

/**
 * Throttle scroll events for performance
 */
export function throttleScroll(
  callback: (event: Event) => void,
  delay: number = 100
): (event: Event) => void {
  let lastCall = 0;

  return (event: Event) => {
    const now = Date.now();

    if (now - lastCall >= delay) {
      lastCall = now;
      callback(event);
    }
  };
}

// ==================== ITEM MEASUREMENT ====================

/**
 * Measure item height dynamically
 */
export function measureItemHeight(element: HTMLElement): number {
  const rect = element.getBoundingClientRect();
  return rect.height;
}

/**
 * Get average item height from visible items
 */
export function getAverageItemHeight(
  container: HTMLElement,
  itemSelector: string = '[data-index]'
): number {
  const items = container.querySelectorAll<HTMLElement>(itemSelector);

  if (items.length === 0) {
    return 100; // Default fallback
  }

  let totalHeight = 0;
  items.forEach((item) => {
    totalHeight += measureItemHeight(item);
  });

  return totalHeight / items.length;
}

// ==================== SCROLL POSITION ====================

interface ScrollPosition {
  x: number;
  y: number;
}

const scrollPositions = new Map<string, ScrollPosition>();

/**
 * Save scroll position for later restoration
 */
export function saveScrollPosition(key: string, element: HTMLElement): void {
  scrollPositions.set(key, {
    x: element.scrollLeft,
    y: element.scrollTop,
  });
}

/**
 * Restore scroll position
 */
export function restoreScrollPosition(key: string, element: HTMLElement): boolean {
  const position = scrollPositions.get(key);

  if (position) {
    element.scrollTo(position.x, position.y);
    return true;
  }

  return false;
}

/**
 * Clear saved scroll position
 */
export function clearScrollPosition(key: string): void {
  scrollPositions.delete(key);
}

// ==================== VISIBLE RANGE ====================

interface VisibleRange {
  start: number;
  end: number;
}

/**
 * Calculate visible item range based on scroll position
 */
export function calculateVisibleRange(
  scrollTop: number,
  containerHeight: number,
  itemHeight: number,
  totalItems: number,
  overscan: number = 5
): VisibleRange {
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    totalItems,
    Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
  );

  return { start: startIndex, end: endIndex };
}

// ==================== PERFORMANCE MONITORING ====================

interface PerformanceMetrics {
  fps: number;
  renderTime: number;
  memoryUsage?: number;
}

let lastFrameTime = performance.now();
let frameCount = 0;
let currentFPS = 60;

/**
 * Measure rendering performance (FPS)
 */
export function measureFPS(): number {
  const now = performance.now();
  const delta = now - lastFrameTime;

  frameCount++;

  // Calculate FPS every second
  if (delta >= 1000) {
    currentFPS = (frameCount * 1000) / delta;
    frameCount = 0;
    lastFrameTime = now;
  }

  return currentFPS;
}

/**
 * Get memory usage (if available)
 */
export function getMemoryUsage(): number | undefined {
  if ('memory' in performance) {
    const memory = (performance as any).memory;
    return memory.usedJSHeapSize;
  }
  return undefined;
}

/**
 * Get performance metrics
 */
export function getPerformanceMetrics(): PerformanceMetrics {
  return {
    fps: measureFPS(),
    renderTime: performance.now(),
    memoryUsage: getMemoryUsage(),
  };
}

/**
 * Log performance warning if FPS is low
 */
export function checkPerformance(): void {
  const fps = measureFPS();

  if (fps < 30) {
    console.warn(`[Virtualization] Low FPS detected: ${fps.toFixed(1)}`);
  }

  const memory = getMemoryUsage();
  if (memory && memory > 100 * 1024 * 1024) {
    // > 100MB
    console.warn(
      `[Virtualization] High memory usage: ${(memory / 1024 / 1024).toFixed(1)}MB`
    );
  }
}

// ==================== DYNAMIC HEIGHT ====================

/**
 * Cache for measured item heights
 */
const heightCache = new Map<string, number>();

/**
 * Get cached item height or measure it
 */
export function getCachedItemHeight(
  itemId: string,
  element?: HTMLElement,
  defaultHeight: number = 100
): number {
  // Check cache first
  if (heightCache.has(itemId)) {
    return heightCache.get(itemId)!;
  }

  // Measure if element provided
  if (element) {
    const height = measureItemHeight(element);
    heightCache.set(itemId, height);
    return height;
  }

  // Return default
  return defaultHeight;
}

/**
 * Clear height cache
 */
export function clearHeightCache(): void {
  heightCache.clear();
}

// ==================== SMOOTH SCROLLING ====================

/**
 * Smooth scroll to element
 */
export function smoothScrollToElement(
  container: HTMLElement,
  targetElement: HTMLElement,
  options: ScrollIntoViewOptions = {}
): void {
  targetElement.scrollIntoView({
    behavior: 'smooth',
    block: 'nearest',
    inline: 'nearest',
    ...options,
  });
}

/**
 * Smooth scroll to index
 */
export function smoothScrollToIndex(
  container: HTMLElement,
  index: number,
  itemHeight: number,
  options: ScrollToOptions = {}
): void {
  const targetY = index * itemHeight;

  container.scrollTo({
    top: targetY,
    behavior: 'smooth',
    ...options,
  });
}

// ==================== PREFETCHING ====================

/**
 * Prefetch items outside viewport for smooth scrolling
 */
export function prefetchItems(
  currentIndex: number,
  totalItems: number,
  prefetchCount: number = 10,
  onPrefetch: (index: number) => void
): void {
  const startIndex = Math.max(0, currentIndex - prefetchCount);
  const endIndex = Math.min(totalItems, currentIndex + prefetchCount);

  for (let i = startIndex; i < endIndex; i++) {
    onPrefetch(i);
  }
}

// ==================== EXPORTS ====================

export default {
  createIntersectionObserver,
  debounceScroll,
  throttleScroll,
  measureItemHeight,
  getAverageItemHeight,
  saveScrollPosition,
  restoreScrollPosition,
  clearScrollPosition,
  calculateVisibleRange,
  measureFPS,
  getMemoryUsage,
  getPerformanceMetrics,
  checkPerformance,
  getCachedItemHeight,
  clearHeightCache,
  smoothScrollToElement,
  smoothScrollToIndex,
  prefetchItems,
};
