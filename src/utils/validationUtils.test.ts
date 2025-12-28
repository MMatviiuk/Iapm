/**
 * UNIT TESTS: validationUtils
 * Testing validation utility functions (CRITICAL for medical app)
 */

import { describe, it, expect } from 'vitest';
import {
  validateEmail,
  validatePassword,
  validateMedicationName,
  validateDosage,
  validateQuantity,
  validateDate,
  validateFile,
  sanitizeInput,
} from './validationUtils';

describe('validationUtils', () => {
  describe('validateEmail', () => {
    it('should accept valid email addresses', () => {
      const validEmails = [
        'user@example.com',
        'test.user@domain.co.uk',
        'name+tag@gmail.com',
        '123@test.com',
      ];

      validEmails.forEach(email => {
        const result = validateEmail(email);
        expect(result.isValid).toBe(true);
        expect(result.error).toBeUndefined();
      });
    });

    it('should reject invalid email addresses', () => {
      const invalidEmails = [
        'notanemail',
        '@nodomain.com',
        'missing@domain',
        'spaces in@email.com',
        'double@@domain.com',
      ];

      invalidEmails.forEach(email => {
        const result = validateEmail(email);
        expect(result.isValid).toBe(false);
        expect(result.error).toBeDefined();
      });
    });

    it('should reject empty email', () => {
      const result = validateEmail('');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Email is required');
    });
  });

  describe('validatePassword', () => {
    it('should accept strong passwords', () => {
      const strongPasswords = [
        'SecurePass123!',
        'MyP@ssw0rd',
        'Str0ng!Password',
      ];

      strongPasswords.forEach(password => {
        const result = validatePassword(password);
        expect(result.isValid).toBe(true);
        expect(result.error).toBeUndefined();
      });
    });

    it('should reject password shorter than 8 characters', () => {
      const result = validatePassword('Short1!');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('8 characters');
    });

    it('should reject password without uppercase', () => {
      const result = validatePassword('lowercase123!');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('uppercase');
    });

    it('should reject password without lowercase', () => {
      const result = validatePassword('UPPERCASE123!');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('lowercase');
    });

    it('should reject password without number', () => {
      const result = validatePassword('NoNumbers!');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('number');
    });

    it('should reject password without special character', () => {
      const result = validatePassword('NoSpecial123');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('special character');
    });

    it('should reject empty password', () => {
      const result = validatePassword('');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Password is required');
    });
  });

  describe('validateMedicationName', () => {
    it('should accept valid medication names', () => {
      const validNames = [
        'Aspirin',
        'Metformin',
        'Vitamin D3',
        'Omega-3 Fish Oil',
      ];

      validNames.forEach(name => {
        const result = validateMedicationName(name);
        expect(result.isValid).toBe(true);
        expect(result.error).toBeUndefined();
      });
    });

    it('should reject medication name shorter than 2 characters', () => {
      const result = validateMedicationName('A');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('2 characters');
    });

    it('should reject medication name longer than 100 characters', () => {
      const longName = 'A'.repeat(101);
      const result = validateMedicationName(longName);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('100 characters');
    });

    it('should reject empty medication name', () => {
      const result = validateMedicationName('');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Medication name is required');
    });

    it('should trim whitespace', () => {
      const result = validateMedicationName('  Aspirin  ');
      expect(result.isValid).toBe(true);
    });
  });

  describe('validateDosage', () => {
    it('should accept valid dosages', () => {
      const validDosages = [
        '10mg',
        '500 mg',
        '2.5mg',
        '1 tablet',
        '5ml',
      ];

      validDosages.forEach(dosage => {
        const result = validateDosage(dosage);
        expect(result.isValid).toBe(true);
        expect(result.error).toBeUndefined();
      });
    });

    it('should reject empty dosage', () => {
      const result = validateDosage('');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Dosage is required');
    });

    it('should reject dosage longer than 50 characters', () => {
      const longDosage = 'A'.repeat(51);
      const result = validateDosage(longDosage);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('50 characters');
    });
  });

  describe('validateQuantity', () => {
    it('should accept valid quantities', () => {
      const validQuantities = [1, 2, 5, 10, 100];

      validQuantities.forEach(qty => {
        const result = validateQuantity(qty);
        expect(result.isValid).toBe(true);
        expect(result.error).toBeUndefined();
      });
    });

    it('should reject zero quantity', () => {
      const result = validateQuantity(0);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('at least 1');
    });

    it('should reject negative quantity', () => {
      const result = validateQuantity(-5);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('at least 1');
    });

    it('should reject quantity over 1000', () => {
      const result = validateQuantity(1001);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('1000');
    });

    it('should reject non-integer quantity', () => {
      const result = validateQuantity(2.5);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('whole number');
    });
  });

  describe('validateDate', () => {
    it('should accept valid date formats', () => {
      const validDates = [
        '2025-11-10',
        '2025-01-01',
        '2025-12-31',
      ];

      validDates.forEach(date => {
        const result = validateDate(date);
        expect(result.isValid).toBe(true);
        expect(result.error).toBeUndefined();
      });
    });

    it('should reject invalid date format', () => {
      const invalidDates = [
        '11-10-2025', // Wrong format
        '2025/11/10', // Wrong separator
        'invalid',
      ];

      invalidDates.forEach(date => {
        const result = validateDate(date);
        expect(result.isValid).toBe(false);
        expect(result.error).toBeDefined();
      });
    });

    it('should reject empty date', () => {
      const result = validateDate('');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Date is required');
    });

    it('should reject invalid calendar dates', () => {
      const invalidDates = [
        '2025-13-01', // Month 13
        '2025-02-30', // Feb 30
        '2025-04-31', // April 31
      ];

      invalidDates.forEach(date => {
        const result = validateDate(date);
        expect(result.isValid).toBe(false);
      });
    });
  });

  describe('validateFile', () => {
    it('should accept valid image files', () => {
      const validFiles = [
        new File([''], 'photo.jpg', { type: 'image/jpeg' }),
        new File([''], 'photo.png', { type: 'image/png' }),
        new File([''], 'photo.gif', { type: 'image/gif' }),
        new File([''], 'photo.webp', { type: 'image/webp' }),
      ];

      validFiles.forEach(file => {
        const result = validateFile(file, { maxSizeMB: 5 });
        expect(result.isValid).toBe(true);
        expect(result.error).toBeUndefined();
      });
    });

    it('should reject file larger than max size', () => {
      // Create 6MB file (over 5MB limit)
      const largeFile = new File([new ArrayBuffer(6 * 1024 * 1024)], 'large.jpg', {
        type: 'image/jpeg',
      });

      const result = validateFile(largeFile, { maxSizeMB: 5 });
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('5 MB');
    });

    it('should reject non-image file', () => {
      const pdfFile = new File([''], 'document.pdf', { type: 'application/pdf' });

      const result = validateFile(pdfFile, { maxSizeMB: 5 });
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('image');
    });

    it('should accept custom allowed types', () => {
      const pdfFile = new File([''], 'document.pdf', { type: 'application/pdf' });

      const result = validateFile(pdfFile, {
        maxSizeMB: 5,
        allowedTypes: ['application/pdf'],
      });
      expect(result.isValid).toBe(true);
    });
  });

  describe('sanitizeInput', () => {
    it('should remove HTML tags', () => {
      const input = '<script>alert("XSS")</script>Hello';
      const sanitized = sanitizeInput(input);
      expect(sanitized).toBe('Hello');
    });

    it('should remove script tags', () => {
      const input = 'Safe text<script>dangerous()</script>More safe';
      const sanitized = sanitizeInput(input);
      expect(sanitized).not.toContain('<script>');
      expect(sanitized).not.toContain('dangerous()');
    });

    it('should keep safe text unchanged', () => {
      const input = 'This is safe text with numbers 123 and symbols !@#';
      const sanitized = sanitizeInput(input);
      expect(sanitized).toBe(input);
    });

    it('should remove all HTML entities', () => {
      const input = '<div>Content</div><p>Paragraph</p>';
      const sanitized = sanitizeInput(input);
      expect(sanitized).toBe('ContentParagraph');
    });

    it('should handle empty string', () => {
      const sanitized = sanitizeInput('');
      expect(sanitized).toBe('');
    });

    it('should trim whitespace', () => {
      const input = '  Hello World  ';
      const sanitized = sanitizeInput(input);
      expect(sanitized).toBe('Hello World');
    });
  });
});
