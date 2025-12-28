// Error Messages Utility - Elderly-Friendly Error Handling
// Created: November 7, 2025
// Purpose: Provide specific, actionable error messages instead of generic ones

export interface ErrorMessage {
  title: string;
  message: string;
  action?: string;
  icon?: string;
}

/**
 * Get elderly-friendly error message from error object or code
 * Returns specific, actionable messages instead of technical jargon
 */
export function getErrorMessage(error: any, context?: string): ErrorMessage {
  // Extract error message from various error formats
  const errorMsg = error?.message || error?.error || error?.toString() || '';
  const statusCode = error?.status || error?.statusCode || 0;

  // Authentication errors
  if (errorMsg.includes('Invalid email or password') || errorMsg.includes('wrong password')) {
    return {
      title: 'Login Failed',
      message: 'Email or password is incorrect. Please check and try again.',
      action: 'Try Again',
      icon: '🔒'
    };
  }

  if (errorMsg.includes('Email already registered') || errorMsg.includes('already exists')) {
    return {
      title: 'Email Already in Use',
      message: 'This email is already registered. Try logging in instead, or use a different email.',
      action: 'Go to Login',
      icon: '📧'
    };
  }

  if (errorMsg.includes('User not found') || errorMsg.includes('Account not found')) {
    return {
      title: 'Account Not Found',
      message: 'No account found with this email. Please check the email or create a new account.',
      action: 'Create Account',
      icon: '🔍'
    };
  }

  if (errorMsg.includes('expired') || errorMsg.includes('Session expired')) {
    return {
      title: 'Session Expired',
      message: 'Your session has expired. Please log in again.',
      action: 'Log In',
      icon: '⏰'
    };
  }

  if (errorMsg.includes('Unauthorized') || statusCode === 401) {
    return {
      title: 'Not Authorized',
      message: 'You need to log in to access this feature.',
      action: 'Log In',
      icon: '🔐'
    };
  }

  // Network errors
  if (errorMsg.includes('Network') || errorMsg.includes('Failed to fetch') || errorMsg.includes('ECONNREFUSED')) {
    return {
      title: 'Connection Problem',
      message: 'Cannot connect to the internet. Please check your internet connection and try again.',
      action: 'Retry',
      icon: '📡'
    };
  }

  if (errorMsg.includes('timeout') || errorMsg.includes('timed out')) {
    return {
      title: 'Request Timeout',
      message: 'The request took too long. Your internet might be slow. Please try again.',
      action: 'Retry',
      icon: '⏱️'
    };
  }

  // Validation errors
  if (errorMsg.includes('required') || errorMsg.includes('cannot be empty')) {
    const field = extractFieldName(errorMsg);
    return {
      title: 'Missing Information',
      message: `Please fill in ${field || 'all required fields'} and try again.`,
      action: 'OK',
      icon: '📝'
    };
  }

  if (errorMsg.includes('invalid email') || errorMsg.includes('email format')) {
    return {
      title: 'Invalid Email',
      message: 'Please enter a valid email address (e.g., name@example.com).',
      action: 'OK',
      icon: '📧'
    };
  }

  if (errorMsg.includes('password') && errorMsg.includes('weak')) {
    return {
      title: 'Weak Password',
      message: 'Password must be at least 8 characters long with letters and numbers.',
      action: 'OK',
      icon: '🔑'
    };
  }

  // Medication errors
  if (errorMsg.includes('Medication not found')) {
    return {
      title: 'Medication Not Found',
      message: 'This medication could not be found. It may have been deleted.',
      action: 'Go Back',
      icon: '💊'
    };
  }

  if (errorMsg.includes('Failed to add medication') || (context === 'add-medication' && errorMsg.includes('Failed'))) {
    return {
      title: 'Could Not Add Medication',
      message: 'Unable to save the medication. Please check all fields and try again.',
      action: 'Try Again',
      icon: '💊'
    };
  }

  if (errorMsg.includes('Failed to update medication') || (context === 'edit-medication' && errorMsg.includes('Failed'))) {
    return {
      title: 'Could Not Update Medication',
      message: 'Unable to save changes. Please try again in a moment.',
      action: 'Try Again',
      icon: '💊'
    };
  }

  if (errorMsg.includes('Failed to delete medication')) {
    return {
      title: 'Could Not Delete Medication',
      message: 'Unable to delete the medication. Please try again.',
      action: 'Try Again',
      icon: '💊'
    };
  }

  // User/Dependent/Patient errors
  if (errorMsg.includes('Failed to add dependent')) {
    return {
      title: 'Could Not Add Family Member',
      message: 'Unable to add this family member. Please check the information and try again.',
      action: 'Try Again',
      icon: '👥'
    };
  }

  if (errorMsg.includes('Failed to invite patient') || errorMsg.includes('invitation failed')) {
    return {
      title: 'Invitation Not Sent',
      message: 'Unable to send invitation email. Please check the email address and try again.',
      action: 'Try Again',
      icon: '✉️'
    };
  }

  // Data loading errors
  if (errorMsg.includes('Failed to load') || errorMsg.includes('Failed to fetch')) {
    const dataType = extractDataType(errorMsg, context);
    return {
      title: 'Loading Failed',
      message: `Could not load ${dataType}. Please check your internet connection and try again.`,
      action: 'Retry',
      icon: '📥'
    };
  }

  // Server errors
  if (statusCode >= 500 || errorMsg.includes('Server error') || errorMsg.includes('500')) {
    return {
      title: 'Server Problem',
      message: 'The server is having issues. Please try again in a few minutes.',
      action: 'Try Later',
      icon: '🔧'
    };
  }

  if (statusCode === 404 || errorMsg.includes('Not found') || errorMsg.includes('404')) {
    return {
      title: 'Not Found',
      message: 'The requested information could not be found.',
      action: 'Go Back',
      icon: '🔍'
    };
  }

  // Permission errors
  if (errorMsg.includes('Permission denied') || errorMsg.includes('Forbidden') || statusCode === 403) {
    return {
      title: 'Access Denied',
      message: 'You do not have permission to do this.',
      action: 'Go Back',
      icon: '🚫'
    };
  }

  // File upload errors
  if (errorMsg.includes('file too large') || errorMsg.includes('size limit')) {
    return {
      title: 'File Too Large',
      message: 'The file is too large. Please use a smaller file (maximum 5MB).',
      action: 'OK',
      icon: '📁'
    };
  }

  if (errorMsg.includes('invalid file type') || errorMsg.includes('file format')) {
    return {
      title: 'Invalid File Type',
      message: 'This file type is not supported. Please use JPG, PNG, or GIF images.',
      action: 'OK',
      icon: '📁'
    };
  }

  // Rate limiting
  if (errorMsg.includes('Too many requests') || errorMsg.includes('rate limit') || statusCode === 429) {
    return {
      title: 'Too Many Attempts',
      message: 'You have made too many attempts. Please wait a few minutes and try again.',
      action: 'Wait',
      icon: '⏸️'
    };
  }

  // Generic fallback with context
  if (context) {
    return getContextualFallback(context);
  }

  // Ultimate fallback - avoid "Something went wrong"
  return {
    title: 'Unable to Complete',
    message: 'We could not complete this action. Please try again or contact support if the problem continues.',
    action: 'Try Again',
    icon: '⚠️'
  };
}

/**
 * Extract field name from error message
 * E.g., "Name is required" → "name"
 */
function extractFieldName(errorMsg: string): string {
  const words = errorMsg.toLowerCase().split(' ');
  const commonFields = ['name', 'email', 'password', 'phone', 'date', 'time', 'dosage'];
  
  for (const field of commonFields) {
    if (words.includes(field)) {
      return field;
    }
  }
  
  return '';
}

/**
 * Extract data type from error message or context
 * E.g., "Failed to load medications" → "your medications"
 */
function extractDataType(errorMsg: string, context?: string): string {
  const msg = errorMsg.toLowerCase();
  
  if (msg.includes('medication')) return 'your medications';
  if (msg.includes('user') || msg.includes('profile')) return 'your profile';
  if (msg.includes('dependent')) return 'family members';
  if (msg.includes('patient')) return 'patients';
  if (msg.includes('history')) return 'medication history';
  if (msg.includes('analytics') || msg.includes('stats')) return 'analytics data';
  if (msg.includes('achievement')) return 'achievements';
  
  // Use context if available
  if (context) {
    if (context.includes('medication')) return 'your medications';
    if (context.includes('dependent')) return 'family members';
    if (context.includes('patient')) return 'patients';
    if (context.includes('profile')) return 'your profile';
  }
  
  return 'this information';
}

/**
 * Get contextual fallback message based on action context
 */
function getContextualFallback(context: string): ErrorMessage {
  const ctx = context.toLowerCase();
  
  if (ctx.includes('login')) {
    return {
      title: 'Login Problem',
      message: 'Could not log you in. Please check your email and password.',
      action: 'Try Again',
      icon: '🔐'
    };
  }
  
  if (ctx.includes('register') || ctx.includes('signup')) {
    return {
      title: 'Registration Problem',
      message: 'Could not create your account. Please try again.',
      action: 'Try Again',
      icon: '📝'
    };
  }
  
  if (ctx.includes('save') || ctx.includes('update')) {
    return {
      title: 'Save Failed',
      message: 'Could not save your changes. Please try again.',
      action: 'Try Again',
      icon: '💾'
    };
  }
  
  if (ctx.includes('delete')) {
    return {
      title: 'Delete Failed',
      message: 'Could not delete the item. Please try again.',
      action: 'Try Again',
      icon: '🗑️'
    };
  }
  
  if (ctx.includes('load') || ctx.includes('fetch')) {
    return {
      title: 'Loading Failed',
      message: 'Could not load the information. Please try again.',
      action: 'Try Again',
      icon: '📥'
    };
  }
  
  return {
    title: 'Action Failed',
    message: 'Could not complete this action. Please try again.',
    action: 'Try Again',
    icon: '⚠️'
  };
}

/**
 * Format error for toast notification
 * Returns a string formatted for elderly users
 */
export function formatErrorForToast(error: any, context?: string): string {
  const errorInfo = getErrorMessage(error, context);
  return `${errorInfo.icon ? errorInfo.icon + ' ' : ''}${errorInfo.title}: ${errorInfo.message}`;
}

/**
 * Get action button label for error
 */
export function getErrorAction(error: any, context?: string): string {
  const errorInfo = getErrorMessage(error, context);
  return errorInfo.action || 'Try Again';
}

/**
 * Check if error requires re-authentication
 */
export function requiresReauth(error: any): boolean {
  const errorMsg = error?.message || error?.error || error?.toString() || '';
  const statusCode = error?.status || error?.statusCode || 0;
  
  return (
    errorMsg.includes('Unauthorized') ||
    errorMsg.includes('expired') ||
    errorMsg.includes('Session expired') ||
    errorMsg.includes('Invalid token') ||
    statusCode === 401
  );
}

/**
 * Check if error is recoverable (user can try again)
 */
export function isRecoverableError(error: any): boolean {
  const errorMsg = error?.message || error?.error || error?.toString() || '';
  const statusCode = error?.status || error?.statusCode || 0;
  
  // Non-recoverable: permission denied, not found, invalid data
  const nonRecoverable = [
    'Permission denied',
    'Forbidden',
    'Not found',
    'invalid email',
    'Email already registered',
    'weak password'
  ];
  
  for (const msg of nonRecoverable) {
    if (errorMsg.includes(msg)) return false;
  }
  
  if (statusCode === 403 || statusCode === 404) return false;
  
  // Recoverable: network issues, timeouts, server errors
  return true;
}
