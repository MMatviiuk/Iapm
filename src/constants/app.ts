/**
 * APPLICATION CONSTANTS
 * Centralized constants for Prescription Clarity
 * Prevents magic numbers and hardcoded values
 */

// ==================== APPLICATION INFO ====================

export const APP_NAME = 'Prescription Clarity';
export const APP_VERSION = '2.0.0';
export const APP_DESCRIPTION = 'Universal Health Tracking Platform for medications, supplements, and wellness prescriptions';

// ==================== USER ROLES ====================

export const USER_ROLES = {
  PATIENT: 'patient',
  CAREGIVER: 'caregiver',
  DOCTOR: 'doctor',
} as const;

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];

// ==================== MEDICATION FORMS ====================

export const MEDICATION_FORMS = {
  TABLET: 'tablet',
  CAPSULE: 'capsule',
  LIQUID: 'liquid',
  INJECTION: 'injection',
  CREAM: 'cream',
  INHALER: 'inhaler',
  POWDER: 'powder',
  OTHER: 'other',
} as const;

export type MedicationForm = typeof MEDICATION_FORMS[keyof typeof MEDICATION_FORMS];

// User-friendly labels
export const MEDICATION_FORM_LABELS: Record<MedicationForm, string> = {
  [MEDICATION_FORMS.TABLET]: 'Tablet',
  [MEDICATION_FORMS.CAPSULE]: 'Capsule',
  [MEDICATION_FORMS.LIQUID]: 'Liquid/Syrup',
  [MEDICATION_FORMS.INJECTION]: 'Injection',
  [MEDICATION_FORMS.CREAM]: 'Cream/Ointment',
  [MEDICATION_FORMS.INHALER]: 'Inhaler',
  [MEDICATION_FORMS.POWDER]: 'Powder',
  [MEDICATION_FORMS.OTHER]: 'Other',
};

// ==================== MEDICATION STATUS ====================

export const MEDICATION_STATUS = {
  SCHEDULED: 'scheduled',
  ACTIVE: 'active',
  COMPLETED: 'completed',
  DELETED: 'deleted',
} as const;

export type MedicationStatus = typeof MEDICATION_STATUS[keyof typeof MEDICATION_STATUS];

// Status labels
export const MEDICATION_STATUS_LABELS: Record<MedicationStatus, string> = {
  [MEDICATION_STATUS.SCHEDULED]: 'Scheduled',
  [MEDICATION_STATUS.ACTIVE]: 'Active',
  [MEDICATION_STATUS.COMPLETED]: 'Completed',
  [MEDICATION_STATUS.DELETED]: 'Deleted',
};

// Status colors (Tailwind classes)
export const MEDICATION_STATUS_COLORS: Record<MedicationStatus, { bg: string; text: string; border: string }> = {
  [MEDICATION_STATUS.SCHEDULED]: {
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    text: 'text-blue-700 dark:text-blue-300',
    border: 'border-blue-200 dark:border-blue-700',
  },
  [MEDICATION_STATUS.ACTIVE]: {
    bg: 'bg-green-50 dark:bg-green-900/20',
    text: 'text-green-700 dark:text-green-300',
    border: 'border-green-200 dark:border-green-700',
  },
  [MEDICATION_STATUS.COMPLETED]: {
    bg: 'bg-gray-50 dark:bg-gray-900/20',
    text: 'text-gray-700 dark:text-gray-300',
    border: 'border-gray-200 dark:border-gray-700',
  },
  [MEDICATION_STATUS.DELETED]: {
    bg: 'bg-red-50 dark:bg-red-900/20',
    text: 'text-red-700 dark:text-red-300',
    border: 'border-red-200 dark:border-red-700',
  },
};

// ==================== MEAL TIMING ====================

export const MEAL_TIMING = {
  BEFORE_MEAL: 'before meal',
  WITH_MEAL: 'with meal',
  AFTER_MEAL: 'after meal',
  ANYTIME: 'anytime',
} as const;

export type MealTiming = typeof MEAL_TIMING[keyof typeof MEAL_TIMING];

// Meal timing colors (for circles)
export const MEAL_TIMING_COLORS: Record<MealTiming, { bg: string; border: string }> = {
  [MEAL_TIMING.BEFORE_MEAL]: {
    bg: 'bg-red-500',
    border: 'border-green-500',
  },
  [MEAL_TIMING.WITH_MEAL]: {
    bg: 'bg-yellow-400',
    border: 'border-green-500',
  },
  [MEAL_TIMING.AFTER_MEAL]: {
    bg: 'bg-green-500',
    border: 'border-green-500',
  },
  [MEAL_TIMING.ANYTIME]: {
    bg: 'bg-white dark:bg-gray-800',
    border: 'border-green-500',
  },
};

// ==================== DURATION UNITS ====================

export const DURATION_UNITS = {
  DAYS: 'days',
  WEEKS: 'weeks',
  MONTHS: 'months',
  LIFETIME: 'lifetime',
} as const;

export type DurationUnit = typeof DURATION_UNITS[keyof typeof DURATION_UNITS];

// Duration unit labels
export const DURATION_UNIT_LABELS: Record<DurationUnit, string> = {
  [DURATION_UNITS.DAYS]: 'Days',
  [DURATION_UNITS.WEEKS]: 'Weeks',
  [DURATION_UNITS.MONTHS]: 'Months',
  [DURATION_UNITS.LIFETIME]: 'Lifetime',
};

// ==================== TIMES PER DAY ====================

export const TIMES_PER_DAY_OPTIONS = [
  { value: 1, label: 'Once daily' },
  { value: 2, label: 'Twice daily' },
  { value: 3, label: 'Three times daily' },
  { value: 4, label: 'Four times daily' },
] as const;

// ==================== DAYS OF WEEK ====================

export const DAYS_OF_WEEK = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
] as const;

export const DAYS_OF_WEEK_SHORT = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const;

// ==================== VALIDATION LIMITS ====================

export const VALIDATION_LIMITS = {
  // Text fields
  MEDICATION_NAME_MIN: 2,
  MEDICATION_NAME_MAX: 100,
  INSTRUCTIONS_MAX: 500,
  
  // Numbers
  QUANTITY_MIN: 1,
  QUANTITY_MAX: 1000,
  DOSAGE_MAX: 10000,
  DURATION_DAYS_MAX: 365,
  DURATION_WEEKS_MAX: 52,
  DURATION_MONTHS_MAX: 120,
  
  // Files
  PHOTO_MAX_SIZE_MB: 5,
  PHOTO_MAX_SIZE_BYTES: 5 * 1024 * 1024,
  
  // Age
  MIN_AGE: 0,
  MAX_AGE: 120,
  
  // Password
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_MAX_LENGTH: 128,
} as const;

// ==================== UI SIZES (Elderly-Optimized) ====================

export const UI_SIZES = {
  // Touch targets (minimum)
  TOUCH_TARGET_MIN: 48, // WCAG AA (mobile)
  TOUCH_TARGET_DESKTOP: 56, // Elderly-optimized (desktop)
  TOUCH_TARGET_AAA: 56, // WCAG AAA
  
  // Button heights
  BUTTON_SM: 40,
  BUTTON_MD: 48,
  BUTTON_LG: 56,
  BUTTON_XL: 64,
  
  // Icon sizes
  ICON_XS: 16,
  ICON_SM: 20,
  ICON_MD: 24,
  ICON_LG: 28,
  ICON_XL: 32,
  
  // Avatar sizes
  AVATAR_SM: 48,
  AVATAR_MD: 56,
  AVATAR_LG: 64,
  AVATAR_XL: 96,
  AVATAR_2XL: 128,
  
  // Font sizes (base)
  FONT_BASE_MOBILE: 16,
  FONT_BASE_TABLET: 18,
  FONT_BASE_DESKTOP: 20,
} as const;

// ==================== BREAKPOINTS ====================

export const BREAKPOINTS = {
  XS: 375, // Mobile
  SM: 640, // Small tablets
  MD: 768, // Tablets
  LG: 1024, // Desktop
  XL: 1280, // Large desktop
  '2XL': 1536, // Extra large
} as const;

// ==================== COLORS ====================

export const COLORS = {
  PRIMARY: '#2196F3', // Blue
  CAREGIVER: '#FB923C', // Orange
  DOCTOR: '#9333EA', // Purple
  
  // Status colors
  SUCCESS: '#10B981', // Green
  WARNING: '#F59E0B', // Amber
  ERROR: '#EF4444', // Red
  INFO: '#3B82F6', // Blue
} as const;

// Role colors
export const ROLE_COLORS: Record<UserRole, string> = {
  [USER_ROLES.PATIENT]: COLORS.PRIMARY,
  [USER_ROLES.CAREGIVER]: COLORS.CAREGIVER,
  [USER_ROLES.DOCTOR]: COLORS.DOCTOR,
};

// ==================== API ENDPOINTS ====================

export const API_ENDPOINTS = {
  // Authentication
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout',
  REFRESH_TOKEN: '/auth/refresh',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
  VERIFY_EMAIL: '/auth/verify-email',
  
  // OAuth
  OAUTH_GOOGLE: '/auth/oauth/google',
  OAUTH_FACEBOOK: '/auth/oauth/facebook',
  OAUTH_APPLE: '/auth/oauth/apple',
  
  // User
  CURRENT_USER: '/users/me',
  UPDATE_PROFILE: '/users/me',
  DELETE_ACCOUNT: '/users/me',
  
  // Medications
  MEDICATIONS: '/medications',
  MEDICATION_BY_ID: (id: string) => `/medications/${id}`,
  MARK_TAKEN: (id: string) => `/medications/${id}/taken`,
  
  // Dependents (Caregiver)
  DEPENDENTS: '/dependents',
  DEPENDENT_BY_ID: (id: string) => `/dependents/${id}`,
  
  // Patients (Doctor)
  PATIENTS: '/patients',
  PATIENT_BY_ID: (id: string) => `/patients/${id}`,
  INVITE_PATIENT: '/patients/invite',
  
  // Analytics
  ANALYTICS_DASHBOARD: '/analytics/dashboard',
  ANALYTICS_ADHERENCE: '/analytics/adherence',
} as const;

// ==================== LOCAL STORAGE KEYS ====================

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'authToken',
  AUTH_TOKEN_EXPIRY: 'authTokenExpiry',
  REFRESH_TOKEN: 'refreshToken',
  USER_ROLE: 'userRole',
  DARK_MODE: 'darkMode',
  FOCUS_DASHBOARD: 'focusDashboard',
  ONBOARDING_COMPLETED: 'onboardingCompleted',
  LANGUAGE: 'language',
} as const;

// ==================== TIME CONSTANTS ====================

export const TIME_CONSTANTS = {
  // Milliseconds
  SECOND: 1000,
  MINUTE: 60 * 1000,
  HOUR: 60 * 60 * 1000,
  DAY: 24 * 60 * 60 * 1000,
  WEEK: 7 * 24 * 60 * 60 * 1000,
  
  // Debounce/throttle delays (ms)
  DEBOUNCE_SEARCH: 500,
  DEBOUNCE_INPUT: 300,
  THROTTLE_SCROLL: 100,
  THROTTLE_RESIZE: 200,
  
  // Token expiry (days)
  TOKEN_EXPIRY_SHORT: 1, // 1 day (without "Remember me")
  TOKEN_EXPIRY_LONG: 30, // 30 days (with "Remember me")
  
  // Cache expiry
  CACHE_EXPIRY_SHORT: 5 * 60 * 1000, // 5 minutes
  CACHE_EXPIRY_LONG: 60 * 60 * 1000, // 1 hour
} as const;

// ==================== PAGINATION ====================

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
  PAGE_SIZE_OPTIONS: [10, 25, 50, 100],
} as const;

// ==================== REGEX PATTERNS ====================

export const REGEX_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^\+?[\d\s\-()]+$/,
  TIME_24H: /^([0-1]?[0-9]|2[0-3]):([0-5][0-9])$/,
  DOSAGE: /^\d+(\.\d+)?\s*(mg|ml|g|mcg|iu|units?)?$/i,
} as const;

// ==================== ACHIEVEMENT THRESHOLDS ====================

export const ACHIEVEMENT_THRESHOLDS = {
  PERFECT_WEEK: 7,
  PERFECT_MONTH: 30,
  STREAK_BRONZE: 7,
  STREAK_SILVER: 30,
  STREAK_GOLD: 90,
  STREAK_PLATINUM: 365,
} as const;

// ==================== ERROR MESSAGES ====================

export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Unable to connect. Please check your internet connection.',
  UNAUTHORIZED: 'Session expired. Please login again.',
  FORBIDDEN: 'You do not have permission to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  SERVER_ERROR: 'Server error. Please try again later.',
  VALIDATION_ERROR: 'Please check your input and try again.',
} as const;

// ==================== SUCCESS MESSAGES ====================

export const SUCCESS_MESSAGES = {
  LOGIN: 'Welcome back!',
  LOGOUT: 'Logged out successfully',
  REGISTRATION: 'Account created successfully!',
  PASSWORD_RESET: 'Password reset email sent',
  MEDICATION_ADDED: 'Medication added successfully',
  MEDICATION_UPDATED: 'Medication updated successfully',
  MEDICATION_DELETED: 'Medication deleted successfully',
  MEDICATION_TAKEN: 'Marked as taken',
  SETTINGS_SAVED: 'Settings saved successfully',
} as const;
