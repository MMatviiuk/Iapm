/**
 * Calculate age from date of birth
 * @param dateOfBirth - Date string in YYYY-MM-DD format
 * @returns Age in years
 */
export function calculateAge(dateOfBirth: string): number {
  if (!dateOfBirth) return 0;
  
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  // Adjust if birthday hasn't occurred this year yet
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
}

/**
 * Validate date of birth
 * @param dateOfBirth - Date string in YYYY-MM-DD format
 * @returns Error message or null if valid
 */
export function validateDateOfBirth(dateOfBirth: string): string | null {
  if (!dateOfBirth) {
    return 'Please enter date of birth';
  }
  
  const birthDate = new Date(dateOfBirth);
  const today = new Date();
  
  // Check if date is valid
  if (isNaN(birthDate.getTime())) {
    return 'Please enter a valid date';
  }
  
  // Check if date is not in the future
  if (birthDate > today) {
    return 'Date of birth cannot be in the future';
  }
  
  // Check if age is reasonable (1-120 years)
  const age = calculateAge(dateOfBirth);
  if (age < 1) {
    return 'Age must be at least 1 year';
  }
  if (age > 120) {
    return 'Please enter a valid date of birth';
  }
  
  return null;
}

/**
 * Get maximum date for date input (today)
 * @returns Date string in YYYY-MM-DD format
 */
export function getMaxDate(): string {
  const today = new Date();
  return today.toISOString().split('T')[0];
}

/**
 * Get minimum date for date input (120 years ago)
 * @returns Date string in YYYY-MM-DD format
 */
export function getMinDate(): string {
  const date = new Date();
  date.setFullYear(date.getFullYear() - 120);
  return date.toISOString().split('T')[0];
}
