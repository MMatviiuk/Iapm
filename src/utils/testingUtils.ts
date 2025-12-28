/**
 * TESTING UTILITIES
 * Helper functions for testing Prescription Clarity
 * Useful for manual testing, automated tests, and development
 */

import type {
  Prescription,
  User,
  Dependent,
  Patient,
  MedicationHistoryEntry,
} from '../types';

// ==================== TEST DATA GENERATORS ====================

/**
 * Generate random ID
 */
export function generateId(prefix: string = 'test'): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Generate test medication
 */
export function createTestMedication(overrides?: Partial<Prescription>): Prescription {
  return {
    id: generateId('med'),
    name: 'Aspirin',
    dosage: '100mg',
    frequency: 'once daily',
    timesPerDay: ['08:00'],
    mealTiming: 'with meal',
    duration: {
      amount: 30,
      unit: 'days',
    },
    startDate: new Date().toISOString().split('T')[0],
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  };
}

/**
 * Generate test user
 */
export function createTestUser(overrides?: Partial<User>): User {
  return {
    id: generateId('user'),
    email: 'test@example.com',
    firstName: 'Test',
    lastName: 'User',
    role: 'patient',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  };
}

/**
 * Generate test dependent
 */
export function createTestDependent(overrides?: Partial<Dependent>): Dependent {
  return {
    id: generateId('dep'),
    caregiverId: generateId('user'),
    firstName: 'John',
    lastName: 'Dependent',
    dateOfBirth: '1950-01-01',
    relationship: 'Father',
    createdAt: new Date().toISOString(),
    ...overrides,
  };
}

/**
 * Generate test patient
 */
export function createTestPatient(overrides?: Partial<Patient>): Patient {
  return {
    id: generateId('pat'),
    doctorId: generateId('doc'),
    firstName: 'Jane',
    lastName: 'Patient',
    dateOfBirth: '1945-06-15',
    gender: 'Female',
    createdAt: new Date().toISOString(),
    ...overrides,
  };
}

/**
 * Generate test history entry
 */
export function createTestHistoryEntry(overrides?: Partial<MedicationHistoryEntry>): MedicationHistoryEntry {
  return {
    id: generateId('hist'),
    medicationId: generateId('med'),
    medicationName: 'Aspirin',
    date: new Date().toISOString().split('T')[0],
    time: '08:00',
    taken: true,
    ...overrides,
  };
}

// ==================== BATCH GENERATORS ====================

/**
 * Generate multiple medications
 */
export function createTestMedications(count: number, overrides?: Partial<Prescription>): Prescription[] {
  const medications: Prescription[] = [];
  const medicationNames = [
    'Aspirin',
    'Metformin',
    'Atorvastatin',
    'Lisinopril',
    'Levothyroxine',
    'Amlodipine',
    'Omeprazole',
    'Losartan',
  ];

  for (let i = 0; i < count; i++) {
    medications.push(
      createTestMedication({
        name: medicationNames[i % medicationNames.length],
        id: generateId(`med-${i}`),
        ...overrides,
      })
    );
  }

  return medications;
}

/**
 * Generate medication history for testing
 */
export function createTestHistory(
  medicationId: string,
  medicationName: string,
  days: number,
  adherenceRate: number = 0.9
): MedicationHistoryEntry[] {
  const history: MedicationHistoryEntry[] = [];
  const today = new Date();

  for (let i = 0; i < days; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];

    // Randomly skip based on adherence rate
    const taken = Math.random() < adherenceRate;
    const skippedReason = !taken
      ? ['Forgot', 'Felt better', 'Side effects', 'No medication'][Math.floor(Math.random() * 4)]
      : undefined;

    history.push(
      createTestHistoryEntry({
        medicationId,
        medicationName,
        date: dateStr,
        time: '08:00',
        taken,
        skippedReason,
      })
    );
  }

  return history;
}

// ==================== VALIDATION HELPERS ====================

/**
 * Check if medication is valid
 */
export function isValidMedication(med: Prescription): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!med.name || med.name.trim().length < 2) {
    errors.push('Name must be at least 2 characters');
  }

  if (!med.dosage || med.dosage.trim().length === 0) {
    errors.push('Dosage is required');
  }

  if (!med.frequency || med.frequency.trim().length === 0) {
    errors.push('Frequency is required');
  }

  if (!med.timesPerDay || med.timesPerDay.length === 0) {
    errors.push('At least one time per day is required');
  }

  if (!med.startDate) {
    errors.push('Start date is required');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Check if user is valid
 */
export function isValidUser(user: User): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!user.email || !user.email.includes('@')) {
    errors.push('Valid email is required');
  }

  if (!user.firstName || user.firstName.trim().length === 0) {
    errors.push('First name is required');
  }

  if (!user.lastName || user.lastName.trim().length === 0) {
    errors.push('Last name is required');
  }

  if (!['patient', 'caregiver', 'doctor'].includes(user.role)) {
    errors.push('Invalid role');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

// ==================== COMPARISON HELPERS ====================

/**
 * Compare two medications (for testing updates)
 */
export function compareMedications(
  med1: Prescription,
  med2: Prescription
): { equal: boolean; differences: string[] } {
  const differences: string[] = [];

  const keys: (keyof Prescription)[] = [
    'name',
    'dosage',
    'frequency',
    'mealTiming',
    'startDate',
    'endDate',
    'notes',
  ];

  for (const key of keys) {
    if (med1[key] !== med2[key]) {
      differences.push(`${key}: "${med1[key]}" vs "${med2[key]}"`);
    }
  }

  // Compare arrays
  if (JSON.stringify(med1.timesPerDay) !== JSON.stringify(med2.timesPerDay)) {
    differences.push(`timesPerDay: ${JSON.stringify(med1.timesPerDay)} vs ${JSON.stringify(med2.timesPerDay)}`);
  }

  return {
    equal: differences.length === 0,
    differences,
  };
}

// ==================== MOCK API RESPONSES ====================

/**
 * Create mock successful API response
 */
export function mockApiSuccess<T>(data: T) {
  return {
    success: true,
    data,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Create mock error API response
 */
export function mockApiError(code: string, message: string, details?: Record<string, unknown>) {
  return {
    success: false,
    error: {
      code,
      message,
      details,
    },
    timestamp: new Date().toISOString(),
  };
}

// ==================== DELAY UTILITIES ====================

/**
 * Create artificial delay (for testing loading states)
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Simulate network latency
 */
export async function withNetworkLatency<T>(
  fn: () => Promise<T>,
  latencyMs: number = 500
): Promise<T> {
  await delay(latencyMs);
  return fn();
}

/**
 * Simulate random network failure
 */
export async function withRandomFailure<T>(
  fn: () => Promise<T>,
  failureRate: number = 0.1
): Promise<T> {
  if (Math.random() < failureRate) {
    throw new Error('Simulated network failure');
  }
  return fn();
}

// ==================== STORAGE HELPERS ====================

/**
 * Clear all localStorage data
 */
export function clearAllStorage(): void {
  localStorage.clear();
  sessionStorage.clear();
  console.log('✅ All storage cleared');
}

/**
 * Clear specific localStorage key
 */
export function clearStorageKey(key: string): void {
  localStorage.removeItem(key);
  console.log(`✅ Cleared storage key: ${key}`);
}

/**
 * Get all localStorage keys
 */
export function getStorageKeys(): string[] {
  return Object.keys(localStorage);
}

/**
 * Print all localStorage data
 */
export function printStorage(): void {
  const keys = getStorageKeys();
  console.log('📦 LocalStorage contents:');
  keys.forEach(key => {
    try {
      const value = localStorage.getItem(key);
      const parsed = value ? JSON.parse(value) : value;
      console.log(`  ${key}:`, parsed);
    } catch {
      console.log(`  ${key}:`, localStorage.getItem(key));
    }
  });
}

// ==================== DATE HELPERS ====================

/**
 * Get date N days ago
 */
export function getDaysAgo(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString().split('T')[0];
}

/**
 * Get date N days from now
 */
export function getDaysFromNow(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().split('T')[0];
}

/**
 * Format date for display
 */
export function formatTestDate(date: string): string {
  return new Date(date).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

// ==================== CONSOLE HELPERS ====================

/**
 * Pretty print object to console
 */
export function prettyPrint(obj: unknown, label?: string): void {
  if (label) {
    console.log(`\n📋 ${label}:`);
  }
  console.log(JSON.stringify(obj, null, 2));
}

/**
 * Print test results
 */
export function printTestResults(results: {
  passed: number;
  failed: number;
  total: number;
  tests: Array<{ name: string; passed: boolean; error?: string }>;
}): void {
  console.log('\n' + '='.repeat(60));
  console.log('🧪 TEST RESULTS');
  console.log('='.repeat(60));
  console.log(`Total: ${results.total} | Passed: ${results.passed} | Failed: ${results.failed}`);
  console.log('='.repeat(60) + '\n');

  results.tests.forEach((test, i) => {
    const icon = test.passed ? '✅' : '❌';
    console.log(`${icon} ${i + 1}. ${test.name}`);
    if (!test.passed && test.error) {
      console.log(`   Error: ${test.error}`);
    }
  });

  console.log('\n' + '='.repeat(60) + '\n');
}

// ==================== PERFORMANCE HELPERS ====================

/**
 * Measure function execution time
 */
export async function measurePerformance<T>(
  fn: () => Promise<T>,
  label: string
): Promise<{ result: T; durationMs: number }> {
  const start = performance.now();
  const result = await fn();
  const durationMs = performance.now() - start;

  console.log(`⏱️ ${label}: ${durationMs.toFixed(2)}ms`);

  return { result, durationMs };
}

/**
 * Benchmark function multiple times
 */
export async function benchmark<T>(
  fn: () => Promise<T>,
  iterations: number = 10,
  label: string = 'Benchmark'
): Promise<{ average: number; min: number; max: number; total: number }> {
  const times: number[] = [];

  console.log(`\n🏃 Running ${label} (${iterations} iterations)...`);

  for (let i = 0; i < iterations; i++) {
    const start = performance.now();
    await fn();
    const duration = performance.now() - start;
    times.push(duration);
  }

  const total = times.reduce((sum, t) => sum + t, 0);
  const average = total / iterations;
  const min = Math.min(...times);
  const max = Math.max(...times);

  console.log(`📊 ${label} Results:`);
  console.log(`  Average: ${average.toFixed(2)}ms`);
  console.log(`  Min: ${min.toFixed(2)}ms`);
  console.log(`  Max: ${max.toFixed(2)}ms`);
  console.log(`  Total: ${total.toFixed(2)}ms\n`);

  return { average, min, max, total };
}

// ==================== EXPORT FOR GLOBAL USE ====================

/**
 * Add testing utilities to window for console access
 */
export function enableTestingMode(): void {
  (window as any).testUtils = {
    // Generators
    createTestMedication,
    createTestUser,
    createTestDependent,
    createTestPatient,
    createTestHistoryEntry,
    createTestMedications,
    createTestHistory,

    // Validators
    isValidMedication,
    isValidUser,

    // Comparisons
    compareMedications,

    // Mock API
    mockApiSuccess,
    mockApiError,

    // Delays
    delay,
    withNetworkLatency,
    withRandomFailure,

    // Storage
    clearAllStorage,
    clearStorageKey,
    getStorageKeys,
    printStorage,

    // Dates
    getDaysAgo,
    getDaysFromNow,
    formatTestDate,

    // Console
    prettyPrint,
    printTestResults,

    // Performance
    measurePerformance,
    benchmark,
  };

  console.log('🧪 Testing mode enabled! Use window.testUtils in console');
  console.log('Example: window.testUtils.createTestMedication()');
}

// Enable in development mode
if (import.meta.env.DEV) {
  enableTestingMode();
}
