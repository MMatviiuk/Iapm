/**
 * UNIT TESTS: dateUtils
 * Testing date utility functions
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { 
  calculateAge, 
  formatDate, 
  isToday, 
  isSameDay,
  getWeekDays,
  getDayName,
} from './dateUtils';

describe('dateUtils', () => {
  beforeEach(() => {
    // Reset date to fixed time for consistent testing
    vi.setSystemTime(new Date('2025-11-10T12:00:00Z'));
  });

  describe('calculateAge', () => {
    it('should calculate correct age for date in the past', () => {
      const birthDate = '1950-03-15';
      const age = calculateAge(birthDate);
      expect(age).toBe(75);
    });

    it('should handle birthday today', () => {
      const birthDate = '1950-11-10'; // Today
      const age = calculateAge(birthDate);
      expect(age).toBe(75);
    });

    it('should handle birthday tomorrow (not yet reached)', () => {
      const birthDate = '1950-11-11'; // Tomorrow
      const age = calculateAge(birthDate);
      expect(age).toBe(74); // Haven't reached birthday yet
    });

    it('should handle birthday yesterday', () => {
      const birthDate = '1950-11-09'; // Yesterday
      const age = calculateAge(birthDate);
      expect(age).toBe(75);
    });

    it('should handle leap year birthdays', () => {
      const birthDate = '2000-02-29'; // Leap year
      const age = calculateAge(birthDate);
      expect(age).toBe(25);
    });

    it('should return 0 for birth date today', () => {
      const birthDate = '2025-11-10';
      const age = calculateAge(birthDate);
      expect(age).toBe(0);
    });

    it('should handle invalid date format gracefully', () => {
      const birthDate = 'invalid-date';
      const age = calculateAge(birthDate);
      expect(isNaN(age)).toBe(true);
    });
  });

  describe('formatDate', () => {
    it('should format date in dd MMM yyyy format', () => {
      const date = '2025-03-15';
      const formatted = formatDate(date);
      expect(formatted).toBe('15 Mar 2025');
    });

    it('should handle Date object', () => {
      const date = new Date('2025-03-15');
      const formatted = formatDate(date.toISOString());
      expect(formatted).toBe('15 Mar 2025');
    });

    it('should handle today', () => {
      const today = '2025-11-10';
      const formatted = formatDate(today);
      expect(formatted).toBe('10 Nov 2025');
    });
  });

  describe('isToday', () => {
    it('should return true for today', () => {
      const date = '2025-11-10';
      expect(isToday(date)).toBe(true);
    });

    it('should return false for yesterday', () => {
      const date = '2025-11-09';
      expect(isToday(date)).toBe(false);
    });

    it('should return false for tomorrow', () => {
      const date = '2025-11-11';
      expect(isToday(date)).toBe(false);
    });

    it('should handle Date object', () => {
      const date = new Date('2025-11-10');
      expect(isToday(date.toISOString())).toBe(true);
    });
  });

  describe('isSameDay', () => {
    it('should return true for same day', () => {
      const date1 = '2025-03-15';
      const date2 = '2025-03-15';
      expect(isSameDay(date1, date2)).toBe(true);
    });

    it('should return false for different days', () => {
      const date1 = '2025-03-15';
      const date2 = '2025-03-16';
      expect(isSameDay(date1, date2)).toBe(false);
    });

    it('should ignore time component', () => {
      const date1 = '2025-03-15T08:00:00Z';
      const date2 = '2025-03-15T20:00:00Z';
      expect(isSameDay(date1, date2)).toBe(true);
    });
  });

  describe('getWeekDays', () => {
    it('should return 7 days starting from given date', () => {
      const startDate = '2025-11-10'; // Sunday
      const weekDays = getWeekDays(startDate);
      
      expect(weekDays).toHaveLength(7);
      expect(weekDays[0]).toBe('2025-11-10');
      expect(weekDays[6]).toBe('2025-11-16');
    });

    it('should handle month boundaries', () => {
      const startDate = '2025-11-28'; // Near end of month
      const weekDays = getWeekDays(startDate);
      
      expect(weekDays).toHaveLength(7);
      expect(weekDays[0]).toBe('2025-11-28');
      expect(weekDays[6]).toBe('2025-12-04'); // Next month
    });
  });

  describe('getDayName', () => {
    it('should return correct day name for date', () => {
      const monday = '2025-11-10'; // Monday
      expect(getDayName(monday)).toBe('Monday');
    });

    it('should return short day name', () => {
      const monday = '2025-11-10';
      expect(getDayName(monday, true)).toBe('Mon');
    });

    it('should handle all days of week', () => {
      const days = [
        '2025-11-10', // Monday
        '2025-11-11', // Tuesday
        '2025-11-12', // Wednesday
        '2025-11-13', // Thursday
        '2025-11-14', // Friday
        '2025-11-15', // Saturday
        '2025-11-16', // Sunday
      ];

      const expectedFull = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
      const expectedShort = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

      days.forEach((date, index) => {
        expect(getDayName(date)).toBe(expectedFull[index]);
        expect(getDayName(date, true)).toBe(expectedShort[index]);
      });
    });
  });
});
