/**
 * PERFORMANCE MONITORING UTILITY
 * Track and log component render times
 * Medical-grade: Critical for elderly users (max 2s load time)
 */

interface PerformanceMetric {
  componentName: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  timestamp: Date;
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private enabled: boolean = process.env.NODE_ENV === 'development';

  /**
   * Start tracking component render
   */
  startTracking(componentName: string): number {
    if (!this.enabled) return 0;

    const startTime = performance.now();
    this.metrics.push({
      componentName,
      startTime,
      timestamp: new Date(),
    });

    return startTime;
  }

  /**
   * Stop tracking and log duration
   */
  stopTracking(componentName: string, startTime: number): void {
    if (!this.enabled) return;

    const endTime = performance.now();
    const duration = endTime - startTime;

    // Find metric and update
    const metric = this.metrics.find(
      (m) => m.componentName === componentName && m.startTime === startTime
    );

    if (metric) {
      metric.endTime = endTime;
      metric.duration = duration;

      // Log slow renders (> 100ms)
      if (duration > 100) {
        console.warn(
          `⚠️ Slow render detected: ${componentName} took ${duration.toFixed(2)}ms`
        );
      } else if (duration > 50) {
        console.log(
          `⏱️ ${componentName} rendered in ${duration.toFixed(2)}ms`
        );
      }
    }
  }

  /**
   * Get performance report
   */
  getReport(): {
    totalMetrics: number;
    slowRenders: PerformanceMetric[];
    averageDuration: number;
    components: Record<string, { count: number; avgDuration: number }>;
  } {
    const slowRenders = this.metrics.filter((m) => m.duration && m.duration > 100);

    // Calculate average duration
    const durations = this.metrics
      .filter((m) => m.duration !== undefined)
      .map((m) => m.duration!);
    const averageDuration =
      durations.length > 0
        ? durations.reduce((sum, d) => sum + d, 0) / durations.length
        : 0;

    // Group by component
    const components: Record<string, { count: number; avgDuration: number }> = {};
    this.metrics.forEach((metric) => {
      if (!metric.duration) return;

      if (!components[metric.componentName]) {
        components[metric.componentName] = { count: 0, avgDuration: 0 };
      }

      const comp = components[metric.componentName];
      comp.count++;
      comp.avgDuration =
        (comp.avgDuration * (comp.count - 1) + metric.duration) / comp.count;
    });

    return {
      totalMetrics: this.metrics.length,
      slowRenders,
      averageDuration,
      components,
    };
  }

  /**
   * Log performance report to console
   */
  logReport(): void {
    if (!this.enabled) return;

    const report = this.getReport();

    console.group('📊 Performance Report');
    console.log(`Total renders tracked: ${report.totalMetrics}`);
    console.log(`Average render time: ${report.averageDuration.toFixed(2)}ms`);
    console.log(`Slow renders (>100ms): ${report.slowRenders.length}`);

    if (report.slowRenders.length > 0) {
      console.group('⚠️ Slow Renders');
      report.slowRenders.forEach((metric) => {
        console.log(
          `${metric.componentName}: ${metric.duration?.toFixed(2)}ms at ${metric.timestamp.toLocaleTimeString()}`
        );
      });
      console.groupEnd();
    }

    console.group('📈 Component Statistics');
    Object.entries(report.components)
      .sort((a, b) => b[1].avgDuration - a[1].avgDuration)
      .forEach(([name, stats]) => {
        console.log(
          `${name}: ${stats.count} renders, avg ${stats.avgDuration.toFixed(2)}ms`
        );
      });
    console.groupEnd();

    console.groupEnd();
  }

  /**
   * Clear all metrics
   */
  clear(): void {
    this.metrics = [];
  }

  /**
   * Enable/disable monitoring
   */
  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }
}

// Singleton instance
export const performanceMonitor = new PerformanceMonitor();

/**
 * React Hook for performance tracking
 */
export function usePerformanceTracking(componentName: string) {
  if (process.env.NODE_ENV !== 'development') {
    return { startTime: 0 };
  }

  const startTime = performanceMonitor.startTracking(componentName);

  // Track on unmount
  return {
    startTime,
    stop: () => performanceMonitor.stopTracking(componentName, startTime),
  };
}

/**
 * HOC for automatic performance tracking
 */
export function withPerformanceTracking<P extends object>(
  Component: React.ComponentType<P>,
  componentName?: string
) {
  const name = componentName || Component.displayName || Component.name || 'Unknown';

  return function PerformanceTrackedComponent(props: P) {
    const startTime = performanceMonitor.startTracking(name);

    React.useEffect(() => {
      return () => {
        performanceMonitor.stopTracking(name, startTime);
      };
    }, []);

    return <Component {...props} />;
  };
}

// Export for global access in dev tools
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  (window as any).__PERFORMANCE_MONITOR__ = performanceMonitor;
  console.log('💡 Performance monitor available at window.__PERFORMANCE_MONITOR__');
  console.log('   Run: __PERFORMANCE_MONITOR__.logReport()');
}
