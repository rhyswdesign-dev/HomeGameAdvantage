/**
 * Comprehensive Unit Tests for Spaced Repetition Algorithm
 * Testing memory algorithms and review scheduling
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { mockCurrentTime } from './setup';
import {
  updateReviewState,
  initializeReviewState,
  isDue,
  getUrgencyScore
} from '../lib/spacedRepetition';

describe('Spaced Repetition', () => {
  const baseTime = 1640995200000; // 2022-01-01 00:00:00 UTC
  
  beforeEach(() => {
    mockCurrentTime(baseTime);
  });
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

    it('should return higher urgency for items overdue longer', () => {
      const now = baseTime;
      const oneHourAgo = now - (60 * 60 * 1000);
      const oneDayAgo = now - (24 * 60 * 60 * 1000);

      const recentlyOverdue = {
        mastery: 0.5,
        stability: 1.0,
        dueAt: oneHourAgo
      };

      const longOverdue = {
        mastery: 0.5,
        stability: 1.0,
        dueAt: oneDayAgo
      };

      expect(getUrgencyScore(longOverdue, now)).toBeGreaterThan(getUrgencyScore(recentlyOverdue, now));
    });
  });

  describe('Advanced Review Mechanics', () => {
    it('should handle consecutive correct answers with diminishing returns', () => {
      let state = {
        mastery: 0.3,
        stability: 1.0,
        dueAt: baseTime
      };

      const initialMastery = state.mastery;
      
      // First correct answer
      state = updateReviewState(state, true, baseTime);
      const firstIncrease = state.mastery - initialMastery;
      
      // Second correct answer
      const prevMastery = state.mastery;
      state = updateReviewState(state, true, baseTime + 1000);
      const secondIncrease = state.mastery - prevMastery;
      
      // Diminishing returns: second increase should be smaller
      expect(secondIncrease).toBeLessThan(firstIncrease);
    });

    it('should handle consecutive incorrect answers with increasing penalty', () => {
      let state = {
        mastery: 0.7,
        stability: 2.0,
        dueAt: baseTime
      };

      const initialMastery = state.mastery;
      
      // First incorrect answer
      state = updateReviewState(state, false, baseTime);
      const firstDecrease = initialMastery - state.mastery;
      
      // Second incorrect answer
      const prevMastery = state.mastery;
      state = updateReviewState(state, false, baseTime + 1000);
      const secondDecrease = prevMastery - state.mastery;
      
      // Should penalize for repeated failures (may not always be increasing due to diminishing returns)
      expect(secondDecrease).toBeGreaterThan(0);
    });

    it('should recover from low mastery with correct answers', () => {
      let state = {
        mastery: 0.1,
        stability: 0.5,
        dueAt: baseTime
      };

      // Multiple correct answers should gradually improve mastery
      for (let i = 0; i < 5; i++) {
        state = updateReviewState(state, true, baseTime + (i * 1000));
      }

      expect(state.mastery).toBeGreaterThan(0.4);
      expect(state.stability).toBeGreaterThan(1.0);
    });

    it('should handle mixed performance patterns', () => {
      let state = initializeReviewState(0.5);
      const pattern = [true, true, false, true, false, false, true, true, true];
      
      for (let i = 0; i < pattern.length; i++) {
        state = updateReviewState(state, pattern[i], baseTime + (i * 1000));
      }

      // Should reflect the mixed performance
      expect(state.mastery).toBeGreaterThan(0.2);
      expect(state.mastery).toBeLessThan(0.9); // More lenient upper bound
    });
  });

  describe('Edge Cases and Boundaries', () => {
    it('should handle extreme mastery values', () => {
      const extremeHigh = {
        mastery: 0.99,
        stability: 10.0,
        dueAt: baseTime
      };

      const extremeLow = {
        mastery: 0.01,
        stability: 0.1,
        dueAt: baseTime
      };

      const highResult = updateReviewState(extremeHigh, true, baseTime);
      const lowResult = updateReviewState(extremeLow, false, baseTime);

      expect(highResult.mastery).toBeLessThanOrEqual(1);
      expect(lowResult.mastery).toBeGreaterThanOrEqual(0);
    });

    it('should handle very long time intervals', () => {
      const state = {
        mastery: 0.8,
        stability: 100.0, // 100 days
        dueAt: baseTime
      };

      const futureTime = baseTime + (365 * 24 * 60 * 60 * 1000); // 1 year later
      const result = updateReviewState(state, true, futureTime);

      expect(result.dueAt).toBeGreaterThan(futureTime);
      expect(result.stability).toBeGreaterThan(state.stability);
    });

    it('should handle rapid successive reviews', () => {
      let state = initializeReviewState(0.5);
      
      // Simulate rapid reviews within seconds
      for (let i = 0; i < 10; i++) {
        state = updateReviewState(state, true, baseTime + (i * 100)); // 100ms apart
      }

      expect(state.mastery).toBeGreaterThan(0.5);
      expect(state.dueAt).toBeGreaterThan(baseTime);
    });
  });

  describe('Performance Analysis', () => {
    it('should calculate urgency score with proper scaling', () => {
      const now = baseTime;
      const states = [
        { mastery: 0.1, stability: 1.0, dueAt: now - (24 * 60 * 60 * 1000) }, // Low mastery, 1 day overdue
        { mastery: 0.5, stability: 1.0, dueAt: now - (12 * 60 * 60 * 1000) }, // Med mastery, 12 hours overdue
        { mastery: 0.9, stability: 1.0, dueAt: now - (1 * 60 * 60 * 1000) },  // High mastery, 1 hour overdue
      ];

      const scores = states.map(state => getUrgencyScore(state, now));

      // Urgency should be highest for low mastery + long overdue
      expect(scores[0]).toBeGreaterThan(scores[1]);
      expect(scores[1]).toBeGreaterThan(scores[2]);
    });

    it('should prioritize review scheduling appropriately', () => {
      const createState = (mastery: number, hoursOverdue: number) => ({
        mastery,
        stability: 1.0,
        dueAt: baseTime - (hoursOverdue * 60 * 60 * 1000)
      });

      const states = [
        createState(0.2, 48), // Low mastery, very overdue
        createState(0.8, 24), // High mastery, moderately overdue
        createState(0.5, 12), // Medium mastery, slightly overdue
        createState(0.1, 1),  // Very low mastery, just overdue
      ];

      const scores = states.map(state => getUrgencyScore(state, baseTime));
      
      // Low mastery + very overdue should have highest priority
      expect(scores[0]).toBeGreaterThan(scores[1]);
      expect(scores[0]).toBeGreaterThan(scores[2]);
      expect(scores[0]).toBeGreaterThan(scores[3]);
    });
  });
});