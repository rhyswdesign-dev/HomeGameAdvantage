/**
 * Comprehensive Unit Tests for Difficulty Adaptation System
 * Testing ELO-based skill updates and difficulty recommendations
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { mockRandom } from './setup';
import {
  updateSkill,
  getExpectedProbability,
  recommendDifficulty,
  initializeUserSkill,
  SkillUpdate
} from '../lib/difficultyAdaptation';

describe('Difficulty Adaptation System', () => {
  describe('updateSkill', () => {
    it('should increase user skill on correct answer', () => {
      const result = updateSkill(0.5, 0.6, true);
      
      expect(result.newUserSkill).toBeGreaterThan(0.5);
      expect(result.newItemDifficulty).toBeLessThan(0.6);
      expect(result.confidence).toBeGreaterThan(0);
      expect(result.confidence).toBeLessThanOrEqual(1);
    });

    it('should decrease user skill on incorrect answer', () => {
      const result = updateSkill(0.7, 0.4, false);
      
      expect(result.newUserSkill).toBeLessThan(0.7);
      expect(result.newItemDifficulty).toBeGreaterThan(0.4);
      expect(result.confidence).toBeGreaterThan(0);
    });

    it('should handle edge case: very high skill vs very easy item', () => {
      const result = updateSkill(0.9, 0.1, true);
      
      // Should barely change skill since success was expected
      expect(Math.abs(result.newUserSkill - 0.9)).toBeLessThan(0.05);
      expect(result.confidence).toBeGreaterThan(0.8); // High confidence
    });

    it('should handle edge case: very low skill vs very hard item', () => {
      const result = updateSkill(0.1, 0.9, false);
      
      // Should barely change skill since failure was expected
      expect(Math.abs(result.newUserSkill - 0.1)).toBeLessThan(0.05);
      expect(result.confidence).toBeGreaterThan(0.8); // High confidence
    });

    it('should provide low confidence for surprising results', () => {
      // Low skill user succeeding on hard item
      const surprisingSuccess = updateSkill(0.2, 0.8, true);
      expect(surprisingSuccess.confidence).toBeLessThan(0.5);

      // High skill user failing on easy item
      const surprisingFailure = updateSkill(0.8, 0.2, false);
      expect(surprisingFailure.confidence).toBeLessThan(0.5);
    });

    it('should clamp user skill between 0 and 1', () => {
      // Test upper bound
      const highSkillResult = updateSkill(0.99, 0.1, true);
      expect(highSkillResult.newUserSkill).toBeLessThanOrEqual(1);

      // Test lower bound
      const lowSkillResult = updateSkill(0.01, 0.9, false);
      expect(lowSkillResult.newUserSkill).toBeGreaterThanOrEqual(0);
    });

    it('should clamp item difficulty between 0 and 1', () => {
      // Test upper bound
      const hardItemResult = updateSkill(0.1, 0.99, false);
      expect(hardItemResult.newItemDifficulty).toBeLessThanOrEqual(1);

      // Test lower bound
      const easyItemResult = updateSkill(0.9, 0.01, true);
      expect(easyItemResult.newItemDifficulty).toBeGreaterThanOrEqual(0);
    });

    it('should round results to 3 decimal places', () => {
      const result = updateSkill(0.333333, 0.666666, true);
      
      // Check that values are rounded to 3 decimal places
      expect(result.newUserSkill.toString().split('.')[1]?.length || 0).toBeLessThanOrEqual(3);
      expect(result.newItemDifficulty.toString().split('.')[1]?.length || 0).toBeLessThanOrEqual(3);
      expect(result.confidence.toString().split('.')[1]?.length || 0).toBeLessThanOrEqual(3);
    });
  });

  describe('getExpectedProbability', () => {
    it('should return 0.5 for equal skill and difficulty', () => {
      const probability = getExpectedProbability(0.5, 0.5);
      expect(probability).toBeCloseTo(0.5, 2);
    });

    it('should return higher probability when skill > difficulty', () => {
      const probability = getExpectedProbability(0.8, 0.3);
      expect(probability).toBeGreaterThan(0.5);
      expect(probability).toBeLessThanOrEqual(1);
    });

    it('should return lower probability when skill < difficulty', () => {
      const probability = getExpectedProbability(0.2, 0.7);
      expect(probability).toBeLessThan(0.5);
      expect(probability).toBeGreaterThanOrEqual(0);
    });

    it('should handle extreme cases', () => {
      // Very high skill vs very low difficulty
      const highProb = getExpectedProbability(0.9, 0.1);
      expect(highProb).toBeGreaterThan(0.9);

      // Very low skill vs very high difficulty
      const lowProb = getExpectedProbability(0.1, 0.9);
      expect(lowProb).toBeLessThan(0.1);
    });

    it('should be symmetric around the skill-difficulty difference', () => {
      const prob1 = getExpectedProbability(0.7, 0.3); // diff = +0.4
      const prob2 = getExpectedProbability(0.3, 0.7); // diff = -0.4
      
      expect(prob1 + prob2).toBeCloseTo(1, 2); // Should be complementary
    });
  });

  describe('recommendDifficulty', () => {
    it('should recommend easier difficulty for lower skill users', () => {
      const lowSkillDifficulty = recommendDifficulty(0.2);
      const highSkillDifficulty = recommendDifficulty(0.8);
      
      expect(lowSkillDifficulty).toBeLessThan(highSkillDifficulty);
    });

    it('should achieve target success rate of 80% by default', () => {
      const userSkill = 0.6;
      const recommendedDifficulty = recommendDifficulty(userSkill);
      const expectedProb = getExpectedProbability(userSkill, recommendedDifficulty);
      
      expect(expectedProb).toBeCloseTo(0.8, 2);
    });

    it('should handle custom target success rates', () => {
      const userSkill = 0.5;
      
      const easyTarget = recommendDifficulty(userSkill, 0.9);
      const hardTarget = recommendDifficulty(userSkill, 0.6);
      
      expect(easyTarget).toBeLessThan(hardTarget);
      
      // Verify the targets are achieved
      expect(getExpectedProbability(userSkill, easyTarget)).toBeCloseTo(0.9, 2);
      expect(getExpectedProbability(userSkill, hardTarget)).toBeCloseTo(0.6, 2);
    });

    it('should clamp recommended difficulty between 0 and 1', () => {
      // Very high skill with easy target
      const easyRec = recommendDifficulty(0.9, 0.95);
      expect(easyRec).toBeGreaterThanOrEqual(0);
      expect(easyRec).toBeLessThanOrEqual(1);

      // Very low skill with hard target
      const hardRec = recommendDifficulty(0.1, 0.2);
      expect(hardRec).toBeGreaterThanOrEqual(0);
      expect(hardRec).toBeLessThanOrEqual(1);
    });

    it('should handle edge case target success rates', () => {
      const userSkill = 0.5;
      
      // Very high success rate
      const almostCertain = recommendDifficulty(userSkill, 0.99);
      expect(almostCertain).toBeLessThan(userSkill);
      
      // Very low success rate
      const almostImpossible = recommendDifficulty(userSkill, 0.01);
      expect(almostImpossible).toBeGreaterThan(userSkill);
    });
  });

  describe('initializeUserSkill', () => {
    it('should calculate skill based on correct answer ratio', () => {
      const perfectScore = initializeUserSkill(10, 10);
      const halfScore = initializeUserSkill(5, 10);
      const zeroScore = initializeUserSkill(0, 10);
      
      expect(perfectScore).toBeGreaterThan(halfScore);
      expect(halfScore).toBeGreaterThan(zeroScore);
    });

    it('should apply adjustment factor', () => {
      const baseSkill = initializeUserSkill(7, 10, 1.0);
      const adjustedUpSkill = initializeUserSkill(7, 10, 1.2);
      const adjustedDownSkill = initializeUserSkill(7, 10, 0.8);
      
      expect(adjustedUpSkill).toBeGreaterThan(baseSkill);
      expect(adjustedDownSkill).toBeLessThan(baseSkill);
    });

    it('should clamp skill between 0.1 and 0.9', () => {
      // Test upper bound
      const perfectWithBoost = initializeUserSkill(10, 10, 2.0);
      expect(perfectWithBoost).toBeLessThanOrEqual(0.9);

      // Test lower bound
      const zeroWithPenalty = initializeUserSkill(0, 10, 0.5);
      expect(zeroWithPenalty).toBeGreaterThanOrEqual(0.1);
    });

    it('should handle edge cases', () => {
      // Zero questions
      expect(() => initializeUserSkill(0, 0)).not.toThrow();
      
      // More correct than total (edge case)
      const invalidScore = initializeUserSkill(15, 10);
      expect(invalidScore).toBeLessThanOrEqual(0.9);
    });
  });

  describe('Learning Progression Scenarios', () => {
    it('should demonstrate skill improvement over multiple correct answers', () => {
      let userSkill = 0.3;
      const itemDifficulty = 0.5;
      let itemDiff = itemDifficulty;

      // Simulate 10 correct answers
      for (let i = 0; i < 10; i++) {
        const result = updateSkill(userSkill, itemDiff, true);
        userSkill = result.newUserSkill;
        itemDiff = result.newItemDifficulty;
      }

      expect(userSkill).toBeGreaterThan(0.3);
      expect(itemDiff).toBeLessThan(itemDifficulty); // Item becomes easier
    });

    it('should demonstrate skill decline over multiple incorrect answers', () => {
      let userSkill = 0.7;
      const itemDifficulty = 0.4;
      let itemDiff = itemDifficulty;

      // Simulate 10 incorrect answers
      for (let i = 0; i < 10; i++) {
        const result = updateSkill(userSkill, itemDiff, false);
        userSkill = result.newUserSkill;
        itemDiff = result.newItemDifficulty;
      }

      expect(userSkill).toBeLessThan(0.7);
      expect(itemDiff).toBeGreaterThan(itemDifficulty); // Item becomes harder
    });

    it('should handle mixed performance patterns', () => {
      let userSkill = 0.5;
      let itemDifficulty = 0.5;
      
      const pattern = [true, true, false, true, false, false, true, true, true];
      
      for (const isCorrect of pattern) {
        const result = updateSkill(userSkill, itemDifficulty, isCorrect);
        userSkill = result.newUserSkill;
        itemDifficulty = result.newItemDifficulty;
      }

      // Should reflect the overall positive performance (6/9 correct)
      expect(userSkill).toBeGreaterThan(0.5);
    });

    it('should converge to stable values with consistent performance', () => {
      let userSkill = 0.4;
      let itemDifficulty = 0.6;
      
      const updates: number[] = [];
      
      // Simulate consistent 80% success rate
      for (let i = 0; i < 100; i++) {
        const isCorrect = (i % 5) < 4; // 4 out of 5 correct
        const result = updateSkill(userSkill, itemDifficulty, isCorrect);
        
        const skillChange = Math.abs(result.newUserSkill - userSkill);
        updates.push(skillChange);
        
        userSkill = result.newUserSkill;
        itemDifficulty = result.newItemDifficulty;
      }
      
      // Later updates should be smaller (convergence)
      const earlyUpdates = updates.slice(0, 20);
      const lateUpdates = updates.slice(-20);
      
      const avgEarlyUpdate = earlyUpdates.reduce((a, b) => a + b, 0) / earlyUpdates.length;
      const avgLateUpdate = lateUpdates.reduce((a, b) => a + b, 0) / lateUpdates.length;
      
      expect(avgLateUpdate).toBeLessThan(avgEarlyUpdate);
    });
  });

  describe('Adaptive Difficulty Recommendations', () => {
    it('should recommend appropriate difficulty for beginner', () => {
      const beginnerSkill = 0.2;
      const difficulty = recommendDifficulty(beginnerSkill, 0.85); // Easy target
      
      expect(difficulty).toBeLessThan(beginnerSkill);
      // Verify the recommendation produces reasonable probability
      const probability = getExpectedProbability(beginnerSkill, difficulty);
      expect(probability).toBeGreaterThan(0.7);
      expect(probability).toBeLessThan(0.95);
    });

    it('should recommend appropriate difficulty for expert', () => {
      const expertSkill = 0.9;
      const difficulty = recommendDifficulty(expertSkill, 0.75); // Challenging target
      
      expect(difficulty).toBeGreaterThan(0.6); // More reasonable expectation
      expect(getExpectedProbability(expertSkill, difficulty)).toBeCloseTo(0.75, 1);
    });

    it('should adapt recommendations based on recent performance', () => {
      let userSkill = 0.5;
      
      // Simulate struggling performance
      for (let i = 0; i < 5; i++) {
        const hardDifficulty = 0.8;
        const result = updateSkill(userSkill, hardDifficulty, false);
        userSkill = result.newUserSkill;
      }
      
      // Recommend easier difficulty after struggles
      const newDifficulty = recommendDifficulty(userSkill);
      expect(newDifficulty).toBeLessThan(0.5);
    });
  });

  describe('Performance Validation', () => {
    it('should maintain mathematical consistency', () => {
      const testCases = [
        { skill: 0.1, difficulty: 0.1 },
        { skill: 0.5, difficulty: 0.5 },
        { skill: 0.9, difficulty: 0.9 },
        { skill: 0.2, difficulty: 0.8 },
        { skill: 0.8, difficulty: 0.2 }
      ];

      testCases.forEach(({ skill, difficulty }) => {
        const correctResult = updateSkill(skill, difficulty, true);
        const incorrectResult = updateSkill(skill, difficulty, false);
        
        // Skill should move in opposite directions
        expect(correctResult.newUserSkill >= skill).toBe(true);
        expect(incorrectResult.newUserSkill <= skill).toBe(true);
        
        // Difficulty should move inversely to user performance
        expect(correctResult.newItemDifficulty <= difficulty).toBe(true);
        expect(incorrectResult.newItemDifficulty >= difficulty).toBe(true);
      });
    });

    it('should have consistent expected probabilities', () => {
      // Test that probability function is monotonic
      const skill = 0.5;
      const difficulties = [0.1, 0.3, 0.5, 0.7, 0.9];
      
      const probabilities = difficulties.map(diff => getExpectedProbability(skill, diff));
      
      // Probabilities should decrease as difficulty increases
      for (let i = 1; i < probabilities.length; i++) {
        expect(probabilities[i]).toBeLessThan(probabilities[i - 1]);
      }
    });

    it('should handle rapid successive updates', () => {
      let userSkill = 0.5;
      let itemDifficulty = 0.5;
      
      // Rapid updates (simulating quick learning)
      for (let i = 0; i < 50; i++) {
        const result = updateSkill(userSkill, itemDifficulty, true);
        userSkill = result.newUserSkill;
        itemDifficulty = result.newItemDifficulty;
        
        // Values should remain within bounds
        expect(userSkill).toBeGreaterThanOrEqual(0);
        expect(userSkill).toBeLessThanOrEqual(1);
        expect(itemDifficulty).toBeGreaterThanOrEqual(0);
        expect(itemDifficulty).toBeLessThanOrEqual(1);
      }
    });
  });
});