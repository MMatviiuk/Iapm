/**
 * HAPTIC FEEDBACK UTILITY
 * Provides tactile feedback for elderly users on mobile devices
 * Enhances button presses and important interactions
 */

/**
 * Check if haptic feedback is supported
 */
export function isHapticSupported(): boolean {
  return 'vibrate' in navigator;
}

/**
 * Haptic feedback patterns for different interactions
 */
export const HapticPatterns = {
  // Light tap - for regular buttons
  tap: [10],

  // Double tap - for successful actions
  success: [10, 50, 10],

  // Strong tap - for important actions
  strong: [20],

  // Warning - for destructive actions
  warning: [50, 100, 50],

  // Error - for failed actions
  error: [20, 100, 20, 100, 20],

  // Long press - for hold actions
  longPress: [50, 50, 50],

  // Selection - for selecting items
  selection: [5],

  // Toggle - for switches
  toggle: [15, 30, 15],
} as const;

/**
 * Trigger haptic feedback
 */
export function triggerHaptic(pattern: keyof typeof HapticPatterns = 'tap'): void {
  if (!isHapticSupported()) {
    return;
  }

  try {
    const vibrationPattern = HapticPatterns[pattern];
    navigator.vibrate(vibrationPattern);
  } catch (error) {
    console.warn('Haptic feedback failed:', error);
  }
}

/**
 * Cancel any ongoing haptic feedback
 */
export function cancelHaptic(): void {
  if (!isHapticSupported()) {
    return;
  }

  try {
    navigator.vibrate(0);
  } catch (error) {
    console.warn('Cancel haptic failed:', error);
  }
}

/**
 * Custom haptic pattern
 */
export function customHaptic(pattern: number | number[]): void {
  if (!isHapticSupported()) {
    return;
  }

  try {
    navigator.vibrate(pattern);
  } catch (error) {
    console.warn('Custom haptic failed:', error);
  }
}

/**
 * React hook for haptic feedback
 */
export function useHapticFeedback() {
  const supported = isHapticSupported();

  const haptic = {
    tap: () => triggerHaptic('tap'),
    success: () => triggerHaptic('success'),
    strong: () => triggerHaptic('strong'),
    warning: () => triggerHaptic('warning'),
    error: () => triggerHaptic('error'),
    longPress: () => triggerHaptic('longPress'),
    selection: () => triggerHaptic('selection'),
    toggle: () => triggerHaptic('toggle'),
    custom: (pattern: number | number[]) => customHaptic(pattern),
    cancel: () => cancelHaptic(),
    supported,
  };

  return haptic;
}

/**
 * Add haptic feedback to button click events
 */
export function addHapticToButton(
  button: HTMLElement,
  pattern: keyof typeof HapticPatterns = 'tap'
): () => void {
  const handleClick = () => {
    triggerHaptic(pattern);
  };

  button.addEventListener('click', handleClick);

  // Return cleanup function
  return () => {
    button.removeEventListener('click', handleClick);
  };
}

/**
 * Add haptic feedback to all buttons in a container
 */
export function addHapticToContainer(
  container: HTMLElement,
  pattern: keyof typeof HapticPatterns = 'tap'
): () => void {
  const buttons = container.querySelectorAll('button');
  const cleanupFunctions: Array<() => void> = [];

  buttons.forEach((button) => {
    const cleanup = addHapticToButton(button as HTMLElement, pattern);
    cleanupFunctions.push(cleanup);
  });

  // Return cleanup function
  return () => {
    cleanupFunctions.forEach((cleanup) => cleanup());
  };
}

/**
 * Haptic feedback for form validation
 */
export function hapticFormValidation(isValid: boolean): void {
  if (isValid) {
    triggerHaptic('success');
  } else {
    triggerHaptic('error');
  }
}

/**
 * Haptic feedback for navigation
 */
export function hapticNavigation(): void {
  triggerHaptic('selection');
}

/**
 * Haptic feedback for toggle switches
 */
export function hapticToggle(isEnabled: boolean): void {
  triggerHaptic(isEnabled ? 'toggle' : 'tap');
}

/**
 * Haptic feedback for destructive actions
 */
export function hapticDestructive(): void {
  triggerHaptic('warning');
}

/**
 * Haptic feedback for successful medication marked as taken
 */
export function hapticMedicationTaken(): void {
  // Custom pattern: short-long-short (celebration)
  customHaptic([30, 50, 100, 50, 30]);
}

/**
 * Haptic feedback for medication reminder
 */
export function hapticReminder(): void {
  // Gentle reminder pattern
  customHaptic([20, 100, 20, 100, 20]);
}

/**
 * Settings for user-configurable haptics
 */
interface HapticSettings {
  enabled: boolean;
  intensity: 'light' | 'medium' | 'strong';
}

const HAPTIC_SETTINGS_KEY = 'haptic_settings';

/**
 * Get haptic settings from localStorage
 */
export function getHapticSettings(): HapticSettings {
  try {
    const stored = localStorage.getItem(HAPTIC_SETTINGS_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.warn('Failed to load haptic settings:', error);
  }

  return {
    enabled: true,
    intensity: 'medium',
  };
}

/**
 * Save haptic settings to localStorage
 */
export function saveHapticSettings(settings: HapticSettings): void {
  try {
    localStorage.setItem(HAPTIC_SETTINGS_KEY, JSON.stringify(settings));
  } catch (error) {
    console.warn('Failed to save haptic settings:', error);
  }
}

/**
 * Adjust haptic intensity based on settings
 */
export function triggerHapticWithSettings(pattern: keyof typeof HapticPatterns = 'tap'): void {
  const settings = getHapticSettings();

  if (!settings.enabled) {
    return;
  }

  let adjustedPattern = HapticPatterns[pattern];

  // Adjust intensity
  if (settings.intensity === 'light') {
    adjustedPattern = adjustedPattern.map((v) => Math.floor(v * 0.5));
  } else if (settings.intensity === 'strong') {
    adjustedPattern = adjustedPattern.map((v) => Math.floor(v * 1.5));
  }

  customHaptic(adjustedPattern);
}
