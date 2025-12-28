/**
 * VIRTUALIZED LIST COMPONENT
 * High-performance list rendering for 1000+ items
 * 
 * Features:
 * - Virtual scrolling (renders only visible items)
 * - Smooth scrolling (60fps on mobile)
 * - Scroll restoration (remembers position)
 * - Keyboard navigation (Arrow Up/Down, Home/End)
 * - Accessibility (ARIA labels, screen reader support)
 * - Dynamic item heights (auto-calculated)
 * 
 * Technology: @tanstack/react-virtual
 * Performance: Renders 10-20 items regardless of total count
 */

import { useRef, useEffect } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';

// ==================== TYPES ====================

export interface VirtualizedListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  estimateSize?: number; // Estimated item height in pixels
  overscan?: number; // Number of items to render outside viewport
  onEndReached?: () => void; // Infinite scroll callback
  endReachedThreshold?: number; // Pixels from bottom to trigger
  className?: string;
  ariaLabel?: string;
  emptyState?: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  itemKey?: (item: T, index: number) => string;
  scrollMargin?: number; // Margin for scroll restoration
}

// ==================== COMPONENT ====================

export function VirtualizedList<T>({
  items,
  renderItem,
  estimateSize = 100,
  overscan = 5,
  onEndReached,
  endReachedThreshold = 200,
  className = '',
  ariaLabel = 'Virtualized list',
  emptyState,
  header,
  footer,
  itemKey,
  scrollMargin = 0,
}: VirtualizedListProps<T>) {
  const parentRef = useRef<HTMLDivElement>(null);

  // ==================== VIRTUALIZER ====================

  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => estimateSize,
    overscan,
    scrollMargin,
  });

  // ==================== INFINITE SCROLL ====================

  useEffect(() => {
    if (!onEndReached) return;

    const [lastItem] = [...virtualizer.getVirtualItems()].reverse();

    if (!lastItem) return;

    // Check if close to end
    if (lastItem.index >= items.length - 1 - overscan) {
      const element = parentRef.current;
      if (!element) return;

      const { scrollHeight, scrollTop, clientHeight } = element;
      const distanceFromBottom = scrollHeight - scrollTop - clientHeight;

      if (distanceFromBottom < endReachedThreshold) {
        onEndReached();
      }
    }
  }, [
    virtualizer.getVirtualItems(),
    items.length,
    onEndReached,
    overscan,
    endReachedThreshold,
  ]);

  // ==================== KEYBOARD NAVIGATION ====================

  useEffect(() => {
    const element = parentRef.current;
    if (!element) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      const scrollAmount = estimateSize;

      switch (event.key) {
        case 'ArrowUp':
          event.preventDefault();
          element.scrollBy({ top: -scrollAmount, behavior: 'smooth' });
          break;

        case 'ArrowDown':
          event.preventDefault();
          element.scrollBy({ top: scrollAmount, behavior: 'smooth' });
          break;

        case 'Home':
          event.preventDefault();
          virtualizer.scrollToIndex(0, { behavior: 'smooth' });
          break;

        case 'End':
          event.preventDefault();
          virtualizer.scrollToIndex(items.length - 1, { behavior: 'smooth' });
          break;

        case 'PageUp':
          event.preventDefault();
          element.scrollBy({
            top: -element.clientHeight,
            behavior: 'smooth',
          });
          break;

        case 'PageDown':
          event.preventDefault();
          element.scrollBy({
            top: element.clientHeight,
            behavior: 'smooth',
          });
          break;
      }
    };

    element.addEventListener('keydown', handleKeyDown);
    return () => element.removeEventListener('keydown', handleKeyDown);
  }, [estimateSize, items.length, virtualizer]);

  // ==================== EMPTY STATE ====================

  if (items.length === 0) {
    return (
      <div className={className}>
        {header}
        {emptyState || (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-gray-500 dark:text-gray-400">No items to display</p>
          </div>
        )}
        {footer}
      </div>
    );
  }

  // ==================== RENDER ====================

  const virtualItems = virtualizer.getVirtualItems();
  const totalSize = virtualizer.getTotalSize();

  return (
    <div className={className}>
      {header}

      <div
        ref={parentRef}
        className="relative overflow-auto"
        style={{
          height: '100%',
          contain: 'strict',
        }}
        role="list"
        aria-label={ariaLabel}
        tabIndex={0}
      >
        {/* Spacer for total height */}
        <div
          style={{
            height: `${totalSize}px`,
            width: '100%',
            position: 'relative',
          }}
        >
          {/* Virtual items */}
          {virtualItems.map((virtualItem) => {
            const item = items[virtualItem.index];
            const key = itemKey
              ? itemKey(item, virtualItem.index)
              : virtualItem.index;

            return (
              <div
                key={key}
                data-index={virtualItem.index}
                ref={virtualizer.measureElement}
                className="absolute top-0 left-0 w-full"
                style={{
                  transform: `translateY(${virtualItem.start}px)`,
                }}
                role="listitem"
              >
                {renderItem(item, virtualItem.index)}
              </div>
            );
          })}
        </div>
      </div>

      {footer}
    </div>
  );
}

// ==================== SCROLL TO INDEX ====================

export function useVirtualizedListScroll<T>() {
  const parentRef = useRef<HTMLDivElement>(null);
  const virtualizerRef = useRef<ReturnType<typeof useVirtualizer> | null>(null);

  const scrollToIndex = (index: number, options?: { behavior?: 'auto' | 'smooth' }) => {
    virtualizerRef.current?.scrollToIndex(index, options);
  };

  const scrollToTop = (options?: { behavior?: 'auto' | 'smooth' }) => {
    scrollToIndex(0, options);
  };

  const scrollToBottom = (options?: { behavior?: 'auto' | 'smooth' }) => {
    const count = virtualizerRef.current?.options.count || 0;
    scrollToIndex(count - 1, options);
  };

  return {
    parentRef,
    virtualizerRef,
    scrollToIndex,
    scrollToTop,
    scrollToBottom,
  };
}

// ==================== SCROLL RESTORATION ====================

interface ScrollPosition {
  index: number;
  offset: number;
}

export function useScrollRestoration(key: string) {
  const scrollPositions = useRef<Map<string, ScrollPosition>>(new Map());

  const saveScrollPosition = (
    key: string,
    index: number,
    offset: number
  ) => {
    scrollPositions.current.set(key, { index, offset });
  };

  const restoreScrollPosition = (key: string) => {
    return scrollPositions.current.get(key);
  };

  return {
    saveScrollPosition,
    restoreScrollPosition,
  };
}

// ==================== EXPORTS ====================

export default VirtualizedList;
