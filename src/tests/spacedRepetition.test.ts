/**
 * Unit Tests for Spaced Repetition Algorithm
 */

import { describe, it, expect } from 'vitest';
import {
  updateReviewState,
  initializeReviewState,
  isDue,
  getUrgencyScore
} from '../lib/spacedRepetition';

describe('Spaced Repetition', () => {
  describe('updateReviewState', () => {
    it('should increase mastery and stability on correct answer', () => {
      const prevState = {
        mastery: 0.5,
        stability: 1.0,
        dueAt: Date.now()
      };

      const result = updateReviewState(prevState, true, Date.now());

      expect(result.mastery).toBeGreaterThan(prevState.mastery);
      expect(result.stability).toBeGreaterThan(prevState.stability);
      expect(result.dueAt).toBeGreaterThan(Date.now());
    });

    it('should decrease mastery and stability on incorrect answer', () => {
      const prevState = {
        mastery: 0.7,
        stability: 2.0,
        dueAt: Date.now()
      };

      const result = updateReviewState(prevState, false, Date.now());

      expect(result.mastery).toBeLessThan(prevState.mastery);
      expect(result.stability).toBeLessThan(prevState.stability);
    });

    it('should clamp mastery between 0 and 1', () => {
      const highMasteryState = {
        mastery: 0.95,
        stability: 1.0,
        dueAt: Date.now()
      };

      const result = updateReviewState(highMasteryState, true, Date.now());
      expect(result.mastery).toBeLessThanOrEqual(1);

      const lowMasteryState = {
        mastery: 0.1,
        stability: 0.5,
        dueAt: Date.now()
      };

      const result2 = updateReviewState(lowMasteryState, false, Date.now());
      expect(result2.mastery).toBeGreaterThanOrEqual(0);
    });
  });

  describe('initializeReviewState', () => {
    it('should create valid initial state', () => {
      const state = initializeReviewState(0.5);

      expect(state.mastery).toBeGreaterThan(0);
      expect(state.mastery).toBeLessThanOrEqual(1);
      expect(state.stability).toBe(1.0);
      expect(state.dueAt).toBeLessThanOrEqual(Date.now());
    });

    it('should adjust initial mastery based on difficulty', () => {
      const easyState = initializeReviewState(0.2);
      const hardState = initializeReviewState(0.8);

      expect(easyState.mastery).toBeGreaterThan(hardState.mastery);
    });
  });

  describe('isDue', () => {
    it('should return true for past due items', () => {
      const pastDue = {
        mastery: 0.5,
        stability: 1.0,
        dueAt: Date.now() - 1000
      };

      expect(isDue(pastDue)).toBe(true);
    });

    it('should return false for future items', () => {
      const future = {
        mastery: 0.5,
        stability: 1.0,
        dueAt: Date.now() + 1000
      };

      expect(isDue(future)).toBe(false);
    });
  });

  describe('getUrgencyScore', () => {
    it('should return 0 for non-due items', () => {
      const notDue = {
        mastery: 0.5,
        stability: 1.0,
        dueAt: Date.now() + 1000
      };

      expect(getUrgencyScore(notDue)).toBe(0);
    });

    it('should return higher urgency for lower mastery', () => {
      const now = Date.now();
      const oneHourAgo = now - (60 * 60 * 1000);

      const lowMastery = {
        mastery: 0.2,
        stability: 1.0,
        dueAt: oneHourAgo
      };

      const highMastery = {
        mastery: 0.8,
        stability: 1.0,
        dueAt: oneHourAgo
      };

      expect(getUrgencyScore(lowMastery, now)).toBeGreaterThan(getUrgencyScore(highMastery, now));
    });
  });
});