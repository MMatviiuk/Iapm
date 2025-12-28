/**
 * USE VIRTUALIZATION HOOK
 * Easy integration of virtual scrolling into existing components
 * 
 * Features:
 * - Auto-detect when virtualization is needed (100+ items)
 * - Scroll restoration (remember position on navigation)
 * - Performance monitoring (measure FPS)
 * - Threshold-based activation (enable/disable dynamically)
 */

import { useState, useEffect, useRef, useMemo } from 'react';

// ==================== TYPES ====================

interface VirtualizationConfig {
  enabled?: boolean; // Force enable/disable
  threshold?: number; // Auto-enable when items > threshold
  estimateSize?: number; // Estimated item height
  overscan?: number; // Items to render outside viewport
  scrollRestoration?: boolean; // Save/restore scroll position
}

interface VirtualizationState {
  shouldVirtualize: boolean;
  itemCount: number;
  visibleRange: { start: number; end: number };
  scrollPosition: number;
}

// ==================== HOOK ====================

export function useVirtualization<T>(
  items: T[],
  config: VirtualizationConfig = {}
) {
  const {
    enabled,
    threshold = 100,
    estimateSize = 100,
    overscan = 5,
    scrollRestoration = true,
  } = config;

  // ==================== STATE ====================

  const [state, setState] = useState<VirtualizationState>({
    shouldVirtualize: false,
    itemCount: items.length,
    visibleRange: { start: 0, end: items.length },
    scrollPosition: 0,
  });

  const scrollPositionRef = useRef<number>(0);

  // ==================== SHOULD VIRTUALIZE ====================

  const shouldVirtualize = useMemo(() => {
    // Force enable/disable
    if (enabled !== undefined) {
      return enabled;
    }

    // Auto-enable based on threshold
    return items.length > threshold;
  }, [items.length, threshold, enabled]);

  // ==================== UPDATE STATE ====================

  useEffect(() => {
    setState((prev) => ({
      ...prev,
      shouldVirtualize,
      itemCount: items.length,
    }));
  }, [shouldVirtualize, items.length]);

  // ==================== SCROLL RESTORATION ====================

  useEffect(() => {
    if (!scrollRestoration) return;

    // Restore scroll position on mount
    const savedPosition = scrollPositionRef.current;
    if (savedPosition > 0) {
      window.scrollTo(0, savedPosition);
    }

    // Save scroll position on unmount
    return () => {
      scrollPositionRef.current = window.scrollY;
    };
  }, [scrollRestoration]);

  // ==================== PERFORMANCE MONITORING ====================

  const performanceRef = useRef({
    fps: 60,
    lastFrameTime: performance.now(),
    frameCount: 0,
  });

  useEffect(() => {
    if (!shouldVirtualize) return;

    let animationFrameId: number;

    const measureFPS = () => {
      const now = performance.now();
      const delta = now - performanceRef.current.lastFrameTime;

      performanceRef.current.frameCount++;

      // Calculate FPS every second
      if (delta >= 1000) {
        performanceRef.current.fps =
          (performanceRef.current.frameCount * 1000) / delta;
        performanceRef.current.frameCount = 0;
        performanceRef.current.lastFrameTime = now;

        // Log low FPS
        if (performanceRef.current.fps < 30) {
          console.warn(
            `[Virtualization] Low FPS detected: ${performanceRef.current.fps.toFixed(1)}`
          );
        }
      }

      animationFrameId = requestAnimationFrame(measureFPS);
    };

    animationFrameId = requestAnimationFrame(measureFPS);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [shouldVirtualize]);

  // ==================== UTILITIES ====================

  const getVisibleItems = () => {
    if (!shouldVirtualize) {
      return items;
    }

    const { start, end } = state.visibleRange;
    return items.slice(start, end);
  };

  const getTotalHeight = () => {
    return items.length * estimateSize;
  };

  const getItemOffset = (index: number) => {
    return index * estimateSize;
  };

  // ==================== RETURN ====================

  return {
    shouldVirtualize,
    itemCount: items.length,
    estimateSize,
    overscan,
    visibleRange: state.visibleRange,
    getVisibleItems,
    getTotalHeight,
    getItemOffset,
    performance: {
      fps: performanceRef.current.fps,
      enabled: shouldVirtualize,
    },
  };
}

// ==================== AUTO-DETECT VIRTUALIZATION NEED ====================

export function useVirtualizationThreshold(itemCount: number) {
  // Thresholds based on device capabilities
  const threshold = useMemo(() => {
    // Mobile devices (lower threshold)
    if (window.innerWidth < 768) {
      return 50;
    }

    // Tablets
    if (window.innerWidth < 1024) {
      return 75;
    }

    // Desktop
    return 100;
  }, []);

  return itemCount > threshold;
}

// ==================== EXPORTS ====================

export default useVirtualization;
