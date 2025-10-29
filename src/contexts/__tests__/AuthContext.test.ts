/**
 * AuthContext Tests
 */

import { describe, it, expect, vi } from 'vitest';
import { auth } from '../../config/firebase';

describe('AuthContext', () => {
  it('should provide auth user from Firebase', () => {
    expect(auth).toBeDefined();
  });

  it('should have onAuthStateChanged method', () => {
    expect(typeof auth.onAuthStateChanged).toBe('function');
  });

  it('should export auth instance', () => {
    expect(auth).toHaveProperty('currentUser');
  });
});
