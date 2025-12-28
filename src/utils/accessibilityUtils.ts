/**
 * ACCESSIBILITY UTILITIES
 * Elderly-optimized accessibility helpers
 * Target: Users 65+ with potential vision/motor impairments
 */

// ==================== FOCUS MANAGEMENT ====================

/**
 * Traps focus within a modal/dialog
 * Useful for accessible modals
 * 
 * @example
 * const cleanup = trapFocus(modalElement);
 * // Later: cleanup();
 */
export function trapFocus(element: HTMLElement): () => void {
  const focusableElements = element.querySelectorAll<HTMLElement>(
    'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
  );

  const firstFocusable = focusableElements[0];
  const lastFocusable = focusableElements[focusableElements.length - 1];

  const handleTabKey = (e: KeyboardEvent) => {
    if (e.key !== 'Tab') return;

    if (e.shiftKey) {
      // Shift + Tab
      if (document.activeElement === firstFocusable) {
        e.preventDefault();
        lastFocusable?.focus();
      }
    } else {
      // Tab
      if (document.activeElement === lastFocusable) {
        e.preventDefault();
        firstFocusable?.focus();
      }
    }
  };

  element.addEventListener('keydown', handleTabKey);

  // Focus first element
  firstFocusable?.focus();

  // Cleanup
  return () => {
    element.removeEventListener('keydown', handleTabKey);
  };
}

/**
 * Moves focus to element
 * Useful for announcements and navigation
 */
export function moveFocusTo(element: HTMLElement | null) {
  if (!element) return;

  // Make element focusable if it isn't already
  if (!element.hasAttribute('tabindex')) {
    element.setAttribute('tabindex', '-1');
  }

  element.focus();

  // Remove tabindex after focus (cleanup)
  setTimeout(() => {
    if (element.getAttribute('tabindex') === '-1') {
      element.removeAttribute('tabindex');
    }
  }, 100);
}

/**
 * Returns focus to previously focused element
 * Useful when closing modals
 */
export function returnFocus(previousElement: HTMLElement | null) {
  if (previousElement && typeof previousElement.focus === 'function') {
    previousElement.focus();
  }
}

// ==================== SCREEN READER ANNOUNCEMENTS ====================

/**
 * Announces message to screen readers
 * Uses aria-live region
 * 
 * @param message - Message to announce
 * @param priority - 'polite' (wait for pause) or 'assertive' (interrupt)
 */
export function announceToScreenReader(
  message: string,
  priority: 'polite' | 'assertive' = 'polite'
) {
  // Create or get existing announcement element
  let announcer = document.getElementById('sr-announcer');
  
  if (!announcer) {
    announcer = document.createElement('div');
    announcer.id = 'sr-announcer';
    announcer.className = 'sr-only';
    announcer.setAttribute('role', 'status');
    announcer.setAttribute('aria-live', priority);
    announcer.setAttribute('aria-atomic', 'true');
    document.body.appendChild(announcer);
  }

  // Update aria-live if priority changed
  announcer.setAttribute('aria-live', priority);

  // Clear and set new message
  announcer.textContent = '';
  setTimeout(() => {
    announcer!.textContent = message;
  }, 100);
}

/**
 * Clears screen reader announcement
 */
export function clearScreenReaderAnnouncement() {
  const announcer = document.getElementById('sr-announcer');
  if (announcer) {
    announcer.textContent = '';
  }
}

// ==================== ARIA HELPERS ====================

/**
 * Generates unique ID for aria-describedby
 */
let idCounter = 0;
export function generateAriaId(prefix: string = 'aria'): string {
  idCounter++;
  return `${prefix}-${idCounter}-${Date.now()}`;
}

/**
 * Creates aria-label from text content
 * Removes special characters, collapses whitespace
 */
export function createAriaLabel(text: string): string {
  return text
    .replace(/[^\w\s]/g, '') // Remove special chars
    .replace(/\s+/g, ' ') // Collapse whitespace
    .trim();
}

/**
 * Checks if element is focusable
 */
export function isFocusable(element: HTMLElement): boolean {
  if (element.hasAttribute('disabled')) return false;
  if (element.getAttribute('tabindex') === '-1') return false;
  
  const focusableTags = ['A', 'BUTTON', 'INPUT', 'SELECT', 'TEXTAREA'];
  if (focusableTags.includes(element.tagName)) return true;
  
  if (element.hasAttribute('tabindex') && element.getAttribute('tabindex') !== '-1') {
    return true;
  }
  
  return false;
}

// ==================== KEYBOARD NAVIGATION ====================

/**
 * Handles keyboard navigation for lists
 * Arrow Up/Down to navigate, Enter to select
 * 
 * @example
 * const cleanup = handleListKeyboard(listElement, (index) => {
 *   selectItem(index);
 * });
 */
export function handleListKeyboard(
  listElement: HTMLElement,
  onSelect: (index: number) => void
): () => void {
  let currentIndex = 0;
  const items = Array.from(
    listElement.querySelectorAll<HTMLElement>('[role="option"], [role="menuitem"], button, a')
  );

  const handleKeyDown = (e: KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        currentIndex = Math.min(currentIndex + 1, items.length - 1);
        items[currentIndex]?.focus();
        break;

      case 'ArrowUp':
        e.preventDefault();
        currentIndex = Math.max(currentIndex - 1, 0);
        items[currentIndex]?.focus();
        break;

      case 'Home':
        e.preventDefault();
        currentIndex = 0;
        items[currentIndex]?.focus();
        break;

      case 'End':
        e.preventDefault();
        currentIndex = items.length - 1;
        items[currentIndex]?.focus();
        break;

      case 'Enter':
      case ' ':
        e.preventDefault();
        onSelect(currentIndex);
        break;
    }
  };

  listElement.addEventListener('keydown', handleKeyDown);

  // Cleanup
  return () => {
    listElement.removeEventListener('keydown', handleKeyDown);
  };
}

// ==================== REDUCED MOTION ====================

/**
 * Checks if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Gets animation duration based on user preference
 * Returns 0 if user prefers reduced motion
 */
export function getAnimationDuration(durationMs: number): number {
  return prefersReducedMotion() ? 0 : durationMs;
}

/**
 * Gets transition classes based on user preference
 */
export function getTransitionClass(transitionClass: string): string {
  return prefersReducedMotion() ? '' : transitionClass;
}

// ==================== HIGH CONTRAST ====================

/**
 * Checks if user prefers high contrast
 */
export function prefersHighContrast(): boolean {
  return window.matchMedia('(prefers-contrast: high)').matches;
}

/**
 * Gets border width based on contrast preference
 * Elderly-friendly: Uses 2px by default, 3px for high contrast
 */
export function getBorderWidth(normalWidth: number = 2): number {
  return prefersHighContrast() ? normalWidth + 1 : normalWidth;
}

// ==================== COLOR CONTRAST ====================

/**
 * Calculates relative luminance of a color
 * Used for WCAG contrast ratio calculations
 */
function getLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    const sRGB = c / 255;
    return sRGB <= 0.03928 ? sRGB / 12.92 : Math.pow((sRGB + 0.055) / 1.055, 2.4);
  });

  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Calculates WCAG contrast ratio between two colors
 * @returns Contrast ratio (1-21)
 */
export function getContrastRatio(color1: string, color2: string): number {
  // Parse hex colors
  const hex1 = color1.replace('#', '');
  const hex2 = color2.replace('#', '');

  const r1 = parseInt(hex1.substring(0, 2), 16);
  const g1 = parseInt(hex1.substring(2, 4), 16);
  const b1 = parseInt(hex1.substring(4, 6), 16);

  const r2 = parseInt(hex2.substring(0, 2), 16);
  const g2 = parseInt(hex2.substring(2, 4), 16);
  const b2 = parseInt(hex2.substring(4, 6), 16);

  const lum1 = getLuminance(r1, g1, b1);
  const lum2 = getLuminance(r2, g2, b2);

  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);

  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Checks if contrast ratio meets WCAG standards
 * @param ratio - Contrast ratio (from getContrastRatio)
 * @param level - 'AA' or 'AAA'
 * @param isLargeText - Text is 18pt+ or 14pt+ bold
 * @returns true if meets standard
 */
export function meetsWCAG(
  ratio: number,
  level: 'AA' | 'AAA' = 'AA',
  isLargeText: boolean = false
): boolean {
  if (level === 'AAA') {
    return isLargeText ? ratio >= 4.5 : ratio >= 7;
  }
  return isLargeText ? ratio >= 3 : ratio >= 4.5;
}

// ==================== TOUCH TARGET SIZE ====================

/**
 * Checks if element meets minimum touch target size
 * WCAG 2.5.5: Minimum 44x44px (AA), 56x56px (AAA for elderly)
 */
export function isTouchTargetLargeEnough(
  element: HTMLElement,
  minimumSize: number = 44
): boolean {
  const rect = element.getBoundingClientRect();
  return rect.width >= minimumSize && rect.height >= minimumSize;
}

/**
 * Gets recommended touch target size for elderly users
 */
export function getElderlyTouchTargetSize(): { width: number; height: number } {
  return {
    width: 56, // WCAG AAA compliant
    height: 56,
  };
}

// ==================== SKIP LINKS ====================

/**
 * Creates skip link for keyboard navigation
 * Allows users to skip to main content
 */
export function createSkipLink(targetId: string, label: string = 'Skip to main content'): HTMLAnchorElement {
  const skipLink = document.createElement('a');
  skipLink.href = `#${targetId}`;
  skipLink.className = 'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded';
  skipLink.textContent = label;
  skipLink.setAttribute('role', 'navigation');

  skipLink.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.getElementById(targetId);
    if (target) {
      moveFocusTo(target);
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });

  return skipLink;
}

// ==================== LIVE REGION ====================

/**
 * Creates ARIA live region for dynamic content
 * @param priority - 'polite' or 'assertive'
 * @returns Element to append dynamic content to
 */
export function createLiveRegion(priority: 'polite' | 'assertive' = 'polite'): HTMLDivElement {
  const region = document.createElement('div');
  region.setAttribute('role', 'status');
  region.setAttribute('aria-live', priority);
  region.setAttribute('aria-atomic', 'true');
  region.className = 'sr-only';
  return region;
}

// ==================== ELDERLY-SPECIFIC HELPERS ====================

/**
 * Checks if current font size is large enough for elderly users
 * Recommended: 18px minimum
 */
export function isElderlyFriendlyFontSize(element: HTMLElement): boolean {
  const computedStyle = window.getComputedStyle(element);
  const fontSize = parseFloat(computedStyle.fontSize);
  return fontSize >= 18;
}

/**
 * Gets recommended font size for elderly users
 */
export function getElderlyFontSize(baseSize: number = 16): number {
  return Math.max(baseSize, 18); // Minimum 18px
}

/**
 * Checks if button/link has sufficient padding for elderly users
 * Recommended: 12px minimum
 */
export function hasElderlyFriendlyPadding(element: HTMLElement): boolean {
  const computedStyle = window.getComputedStyle(element);
  const paddingTop = parseFloat(computedStyle.paddingTop);
  const paddingBottom = parseFloat(computedStyle.paddingBottom);
  const paddingLeft = parseFloat(computedStyle.paddingLeft);
  const paddingRight = parseFloat(computedStyle.paddingRight);

  return (
    paddingTop >= 12 &&
    paddingBottom >= 12 &&
    paddingLeft >= 16 &&
    paddingRight >= 16
  );
}
