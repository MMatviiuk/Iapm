import { useState, useEffect } from 'react';

/**
 * MEDIA QUERY HOOK
 * React to screen size changes
 * Better than window.matchMedia() - reactive
 * 
 * @param query - Media query string
 * @returns boolean - true if query matches
 * 
 * @example
 * const isMobile = useMediaQuery('(max-width: 768px)');
 * const isTablet = useMediaQuery('(min-width: 769px) and (max-width: 1023px)');
 * const isDesktop = useMediaQuery('(min-width: 1024px)');
 * const isDark = useMediaQuery('(prefers-color-scheme: dark)');
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia(query).matches;
    }
    return false;
  });

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const mediaQuery = window.matchMedia(query);
    
    // Set initial value
    setMatches(mediaQuery.matches);

    // Define listener
    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Add listener (modern browsers)
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', listener);
    } else {
      // Fallback for older browsers
      mediaQuery.addListener(listener);
    }

    // Cleanup
    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', listener);
      } else {
        mediaQuery.removeListener(listener);
      }
    };
  }, [query]);

  return matches;
}

/**
 * RESPONSIVE BREAKPOINTS HOOK
 * Predefined breakpoints for Prescription Clarity
 * Matches Tailwind breakpoints
 */
export function useBreakpoints() {
  const isMobile = useMediaQuery('(max-width: 639px)'); // < sm
  const isTablet = useMediaQuery('(min-width: 640px) and (max-width: 1023px)'); // sm to lg
  const isDesktop = useMediaQuery('(min-width: 1024px)'); // >= lg
  const isLargeDesktop = useMediaQuery('(min-width: 1536px)'); // >= 2xl

  return {
    isMobile,
    isTablet,
    isDesktop,
    isLargeDesktop,
    // Convenience flags
    isSmallScreen: isMobile,
    isMediumScreen: isTablet,
    isLargeScreen: isDesktop || isLargeDesktop,
  };
}

/**
 * SYSTEM PREFERENCES HOOK
 * Detect user system preferences
 */
export function useSystemPreferences() {
  const prefersDark = useMediaQuery('(prefers-color-scheme: dark)');
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const prefersHighContrast = useMediaQuery('(prefers-contrast: high)');

  return {
    prefersDark,
    prefersReducedMotion,
    prefersHighContrast,
  };
}
