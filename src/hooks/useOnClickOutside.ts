import { useEffect, RefObject } from 'react';

/**
 * CLICK OUTSIDE HOOK
 * Detects clicks outside an element
 * Useful for closing dropdowns, modals, popovers
 * 
 * @param ref - React ref to element
 * @param handler - Callback when click outside
 * @param enabled - Enable/disable listener (default: true)
 * 
 * @example
 * const ref = useRef<HTMLDivElement>(null);
 * useOnClickOutside(ref, () => setIsOpen(false));
 * 
 * return <div ref={ref}>Dropdown content</div>
 */
export function useOnClickOutside<T extends HTMLElement = HTMLElement>(
  ref: RefObject<T>,
  handler: (event: MouseEvent | TouchEvent) => void,
  enabled: boolean = true
): void {
  useEffect(() => {
    if (!enabled) return;

    const listener = (event: MouseEvent | TouchEvent) => {
      const el = ref?.current;

      // Do nothing if clicking ref's element or descendent elements
      if (!el || el.contains(event.target as Node)) {
        return;
      }

      handler(event);
    };

    // Add event listeners
    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    // Cleanup
    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler, enabled]);
}

/**
 * ESCAPE KEY HOOK
 * Detects Escape key press
 * Useful for closing modals, dialogs
 * 
 * @param handler - Callback when Escape pressed
 * @param enabled - Enable/disable listener (default: true)
 * 
 * @example
 * useEscapeKey(() => setIsOpen(false));
 */
export function useEscapeKey(
  handler: () => void,
  enabled: boolean = true
): void {
  useEffect(() => {
    if (!enabled) return;

    const listener = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handler();
      }
    };

    document.addEventListener('keydown', listener);

    return () => {
      document.removeEventListener('keydown', listener);
    };
  }, [handler, enabled]);
}
