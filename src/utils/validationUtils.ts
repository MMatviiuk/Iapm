/**
 * VALIDATION UTILITIES
 * Medical-grade validation for Prescription Clarity
 * Critical: Medication data must be validated to prevent errors
 * Target users: Elderly patients - clear error messages
 */

// ==================== EMAIL VALIDATION ====================

/**
 * Validates email format
 * More permissive than strict RFC 5322 for better UX
 */
export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false;
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

/**
 * Validates email with detailed error message
 */
export function validateEmail(email: string): { valid: boolean; error?: string } {
  if (!email || !email.trim()) {
    return { valid: false, error: 'Email is required' };
  }

  if (!isValidEmail(email)) {
    return { valid: false, error: 'Please enter a valid email address' };
  }

  return { valid: true };
}

// ==================== PASSWORD VALIDATION ====================

export interface PasswordStrength {
  score: number; // 0-4 (0=very weak, 4=very strong)
  feedback: string[];
  isValid: boolean;
}

/**
 * Validates password strength
 * Requirements:
 * - Minimum 8 characters
 * - At least 1 uppercase letter
 * - At least 1 lowercase letter
 * - At least 1 number
 * - At least 1 special character (optional but recommended)
 */
export function validatePassword(password: string): PasswordStrength {
  const feedback: string[] = [];
  let score = 0;

  // Check length
  if (!password || password.length < 8) {
    feedback.push('Password must be at least 8 characters');
    return { score: 0, feedback, isValid: false };
  }
  score++;

  // Check uppercase
  if (!/[A-Z]/.test(password)) {
    feedback.push('Add at least one uppercase letter');
  } else {
    score++;
  }

  // Check lowercase
  if (!/[a-z]/.test(password)) {
    feedback.push('Add at least one lowercase letter');
  } else {
    score++;
  }

  // Check numbers
  if (!/[0-9]/.test(password)) {
    feedback.push('Add at least one number');
  } else {
    score++;
  }

  // Check special characters (bonus)
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    score++;
    if (score < 5) feedback.push('Great! Special characters make it stronger');
  } else {
    feedback.push('Consider adding special characters (!@#$%^&*)');
  }

  // Overall strength message
  if (score >= 4) {
    feedback.unshift('Strong password!');
  } else if (score >= 3) {
    feedback.unshift('Good password');
  } else if (score >= 2) {
    feedback.unshift('Weak password');
  } else {
    feedback.unshift('Very weak password');
  }

  return {
    score: Math.min(score, 4),
    feedback,
    isValid: score >= 3, // Minimum 3/4 required
  };
}

// ==================== MEDICATION VALIDATION ====================

/**
 * Validates medication name
 * Must be 2-100 characters
 */
export function validateMedicationName(name: string): { valid: boolean; error?: string } {
  if (!name || !name.trim()) {
    return { valid: false, error: 'Medication name is required' };
  }

  const trimmed = name.trim();
  
  if (trimmed.length < 2) {
    return { valid: false, error: 'Medication name must be at least 2 characters' };
  }

  if (trimmed.length > 100) {
    return { valid: false, error: 'Medication name is too long (max 100 characters)' };
  }

  return { valid: true };
}

/**
 * Validates medication dosage
 * Must be positive number with optional unit
 * Examples: "10mg", "5ml", "2 tablets"
 */
export function validateDosage(dosage: string): { valid: boolean; error?: string } {
  if (!dosage || !dosage.trim()) {
    return { valid: false, error: 'Dosage is required' };
  }

  const trimmed = dosage.trim();

  // Check if starts with a number
  if (!/^\d+/.test(trimmed)) {
    return { valid: false, error: 'Dosage must start with a number (e.g., 10mg, 5ml)' };
  }

  // Extract number
  const numberMatch = trimmed.match(/^\d+(\.\d+)?/);
  if (!numberMatch) {
    return { valid: false, error: 'Invalid dosage format' };
  }

  const number = parseFloat(numberMatch[0]);
  if (number <= 0) {
    return { valid: false, error: 'Dosage must be greater than 0' };
  }

  if (number > 10000) {
    return { valid: false, error: 'Dosage seems too high - please check' };
  }

  return { valid: true };
}

/**
 * Validates quantity
 * Must be positive integer
 */
export function validateQuantity(quantity: number | string): { valid: boolean; error?: string } {
  const num = typeof quantity === 'string' ? parseInt(quantity, 10) : quantity;

  if (isNaN(num)) {
    return { valid: false, error: 'Quantity must be a number' };
  }

  if (num < 1) {
    return { valid: false, error: 'Quantity must be at least 1' };
  }

  if (num > 1000) {
    return { valid: false, error: 'Quantity seems too high - please check' };
  }

  if (!Number.isInteger(num)) {
    return { valid: false, error: 'Quantity must be a whole number' };
  }

  return { valid: true };
}

/**
 * Validates time of day (HH:MM format)
 */
export function validateTimeOfDay(time: string): { valid: boolean; error?: string } {
  if (!time || !time.trim()) {
    return { valid: false, error: 'Time is required' };
  }

  const timeRegex = /^([0-1]?[0-9]|2[0-3]):([0-5][0-9])$/;
  
  if (!timeRegex.test(time)) {
    return { valid: false, error: 'Invalid time format (use HH:MM, e.g., 08:00)' };
  }

  return { valid: true };
}

/**
 * Validates duration
 * Must be positive number
 */
export function validateDuration(duration: number | string, unit: string): { valid: boolean; error?: string } {
  const num = typeof duration === 'string' ? parseInt(duration, 10) : duration;

  if (isNaN(num)) {
    return { valid: false, error: 'Duration must be a number' };
  }

  if (num < 1) {
    return { valid: false, error: 'Duration must be at least 1' };
  }

  // Validate based on unit
  if (unit === 'days' && num > 365) {
    return { valid: false, error: 'Duration in days cannot exceed 365 (use weeks/months)' };
  }

  if (unit === 'weeks' && num > 52) {
    return { valid: false, error: 'Duration in weeks cannot exceed 52 (use months)' };
  }

  if (unit === 'months' && num > 120) {
    return { valid: false, error: 'Duration in months cannot exceed 120 (10 years)' };
  }

  return { valid: true };
}

// ==================== DATE VALIDATION ====================

/**
 * Validates date is not in the past (for start dates)
 */
export function validateFutureDate(date: string | Date): { valid: boolean; error?: string } {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (dateObj < today) {
    return { valid: false, error: 'Start date cannot be in the past' };
  }

  return { valid: true };
}

/**
 * Validates end date is after start date
 */
export function validateDateRange(startDate: string | Date, endDate: string | Date): { valid: boolean; error?: string } {
  const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
  const end = typeof endDate === 'string' ? new Date(endDate) : endDate;

  if (end <= start) {
    return { valid: false, error: 'End date must be after start date' };
  }

  return { valid: true };
}

/**
 * Validates date of birth
 * Must be in the past, not more than 120 years ago
 */
export function validateDateOfBirth(dob: string | Date): { valid: boolean; error?: string } {
  const dateObj = typeof dob === 'string' ? new Date(dob) : dob;
  const today = new Date();

  if (dateObj >= today) {
    return { valid: false, error: 'Date of birth must be in the past' };
  }

  // Check not more than 120 years ago
  const minDate = new Date();
  minDate.setFullYear(minDate.getFullYear() - 120);

  if (dateObj < minDate) {
    return { valid: false, error: 'Date of birth cannot be more than 120 years ago' };
  }

  return { valid: true };
}

// ==================== PHONE VALIDATION ====================

/**
 * Validates phone number (international format)
 * Accepts: +1234567890, (123) 456-7890, 123-456-7890, etc.
 */
export function validatePhoneNumber(phone: string): { valid: boolean; error?: string } {
  if (!phone || !phone.trim()) {
    return { valid: false, error: 'Phone number is required' };
  }

  // Remove all non-digit characters
  const digitsOnly = phone.replace(/\D/g, '');

  if (digitsOnly.length < 10) {
    return { valid: false, error: 'Phone number must have at least 10 digits' };
  }

  if (digitsOnly.length > 15) {
    return { valid: false, error: 'Phone number is too long' };
  }

  return { valid: true };
}

// ==================== FILE VALIDATION ====================

/**
 * Validates image file for photo upload
 * Max 5MB, only images
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  // Check file exists
  if (!file) {
    return { valid: false, error: 'Please select a file' };
  }

  // Check file type
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/avif'];
  if (!validTypes.includes(file.type)) {
    return { valid: false, error: 'Only image files are allowed (JPG, PNG, GIF, WebP, AVIF)' };
  }

  // Check file size (5MB max)
  const maxSize = 5 * 1024 * 1024; // 5MB in bytes
  if (file.size > maxSize) {
    return { valid: false, error: 'Image size must be less than 5MB' };
  }

  return { valid: true };
}

// ==================== UTILITY FUNCTIONS ====================

/**
 * Sanitizes user input (removes dangerous characters)
 * Prevents XSS attacks
 */
export function sanitizeInput(input: string): string {
  if (!input) return '';
  
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove < and > to prevent HTML injection
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, ''); // Remove event handlers (onclick=, onload=, etc.)
}

/**
 * Validates object has all required fields
 */
export function validateRequiredFields<T extends Record<string, any>>(
  obj: T,
  requiredFields: (keyof T)[]
): { valid: boolean; missingFields: string[] } {
  const missingFields: string[] = [];

  for (const field of requiredFields) {
    if (!obj[field] || (typeof obj[field] === 'string' && !obj[field].trim())) {
      missingFields.push(String(field));
    }
  }

  return {
    valid: missingFields.length === 0,
    missingFields,
  };
}
