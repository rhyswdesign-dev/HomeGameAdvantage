/**
 * Validation Utils Tests
 */

import { describe, it, expect } from 'vitest';

// Email validation function
const isValidEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// Password validation function
const isValidPassword = (password: string): boolean => {
  return password.length >= 8 && /[A-Za-z]/.test(password) && /\d/.test(password);
};

describe('Validation Utils', () => {
  describe('isValidEmail', () => {
    it('should validate correct email addresses', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user.name@domain.co.uk')).toBe(true);
      expect(isValidEmail('user+tag@example.com')).toBe(true);
    });

    it('should reject invalid email addresses', () => {
      expect(isValidEmail('notanemail')).toBe(false);
      expect(isValidEmail('@example.com')).toBe(false);
      expect(isValidEmail('test@')).toBe(false);
      expect(isValidEmail('test@.com')).toBe(false);
      expect(isValidEmail('')).toBe(false);
    });
  });

  describe('isValidPassword', () => {
    it('should validate strong passwords', () => {
      expect(isValidPassword('Password123')).toBe(true);
      expect(isValidPassword('mypass123')).toBe(true);
      expect(isValidPassword('12345678a')).toBe(true);
    });

    it('should reject weak passwords', () => {
      expect(isValidPassword('short1')).toBe(false);
      expect(isValidPassword('noNumbers')).toBe(false);
      expect(isValidPassword('12345678')).toBe(false);
      expect(isValidPassword('')).toBe(false);
    });
  });
});
