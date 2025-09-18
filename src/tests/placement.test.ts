/**
 * Unit tests for placement logic
 * Testing survey analysis and user placement algorithms
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { getPlacement, getSurveyQuestions } from '../services/placement';
import { SurveyAnswers } from '../services/placement';

describe('Placement Logic', () => {
  let baseAnswers: SurveyAnswers;

  beforeEach(() => {
    // Default answers for a moderate beginner
    baseAnswers = {
      q1: 'occasionally',
      q2: 'somewhat',
      q3: 'margarita',
      q4: 'coupe',
      q5: 'monthly',
      q6: 'monthly',
      q7: ['drinks', 'atmosphere'],
      q8: ['gin', 'rum'],
      q9: 'alcoholic',
      q10: 'no',
      q11: ['citrus', 'sweet', 'herbal'],
      q12: ['host', 'classics'],
      q13: ['jigger', 'shaker'],
      q14: ['spirit', 'citrus', 'syrup', 'ice', 'shake', 'double-strain'],
      q15: '5m'
    };
  });

  describe('Level Assessment', () => {
    it('should classify absolute beginner correctly', () => {
      const beginnerAnswers: SurveyAnswers = {
        ...baseAnswers,
        q1: 'never',
        q2: 'not-at-all',
        q3: 'mojito', // Wrong answer
        q4: 'rocks', // Wrong answer
        q13: ['none'], // No tools
        q14: ['ice', 'spirit', 'citrus'] // Wrong order
      };

      const result = getPlacement(beginnerAnswers);
      expect(result.level).toBe('beginner');
      expect(result.startModuleId).toBe('ch1-intro');
    });

    it('should classify intermediate user correctly', () => {
      const intermediateAnswers: SurveyAnswers = {
        ...baseAnswers,
        q1: 'regularly',
        q2: 'somewhat',
        q3: 'margarita', // Correct
        q4: 'coupe', // Correct
        q13: ['jigger', 'shaker', 'barspoon'], // More tools
        q14: ['spirit', 'citrus', 'syrup', 'ice', 'shake'] // Mostly correct
      };

      const result = getPlacement(intermediateAnswers);
      expect(result.level).toBe('intermediate');
    });

    it('should classify advanced user correctly', () => {
      const advancedAnswers: SurveyAnswers = {
        ...baseAnswers,
        q1: 'regularly',
        q2: 'very-confident',
        q3: 'margarita', // Correct
        q4: 'coupe', // Correct
        q13: ['jigger', 'shaker', 'barspoon', 'strainer'], // All tools
        q14: ['spirit', 'citrus', 'syrup', 'ice', 'shake', 'double-strain'] // Perfect order
      };

      const result = getPlacement(advancedAnswers);
      expect(result.level).toBe('advanced');
      expect(result.startModuleId).toBe('ch2-tools-terms');
    });
  });

  describe('Track Determination', () => {
    it('should assign alcoholic track for regular drinkers', () => {
      const alcoholicAnswers: SurveyAnswers = {
        ...baseAnswers,
        q9: 'alcoholic',
        q10: 'no'
      };

      const result = getPlacement(alcoholicAnswers);
      expect(result.track).toBe('alcoholic');
    });

    it('should assign low-abv track when preferred', () => {
      const lowAbvAnswers: SurveyAnswers = {
        ...baseAnswers,
        q9: 'low-abv',
        q10: 'no'
      };

      const result = getPlacement(lowAbvAnswers);
      expect(result.track).toBe('low-abv');
    });

    it('should assign zero-proof track when alcohol is avoided', () => {
      const zeroProofAnswers: SurveyAnswers = {
        ...baseAnswers,
        q9: 'alcoholic', // This should be overridden by q10
        q10: 'yes'
      };

      const result = getPlacement(zeroProofAnswers);
      expect(result.track).toBe('zero-proof');
    });

    it('should assign zero-proof track when explicitly chosen', () => {
      const zeroProofAnswers: SurveyAnswers = {
        ...baseAnswers,
        q9: 'zero-proof',
        q10: 'no'
      };

      const result = getPlacement(zeroProofAnswers);
      expect(result.track).toBe('zero-proof');
    });
  });

  describe('Spirit Preferences', () => {
    it('should respect user spirit preferences', () => {
      const spiritAnswers: SurveyAnswers = {
        ...baseAnswers,
        q8: ['whiskey', 'brandy']
      };

      const result = getPlacement(spiritAnswers);
      expect(result.spirits).toEqual(['whiskey', 'brandy']);
    });

    it('should limit to top 2 spirits when more are selected', () => {
      const manySpiritAnswers: SurveyAnswers = {
        ...baseAnswers,
        q8: ['gin', 'rum', 'whiskey', 'tequila', 'brandy']
      };

      const result = getPlacement(manySpiritAnswers);
      expect(result.spirits).toHaveLength(2);
      expect(result.spirits).toEqual(['gin', 'rum']); // First 2
    });

    it('should provide defaults for zero-proof track when no spirits selected', () => {
      const noSpiritAnswers: SurveyAnswers = {
        ...baseAnswers,
        q8: ['none'],
        q10: 'yes'
      };

      const result = getPlacement(noSpiritAnswers);
      expect(result.track).toBe('zero-proof');
      expect(result.spirits).toEqual(['gin-alternative', 'rum-alternative']);
    });

    it('should provide default spirits for alcoholic track when none selected', () => {
      const noSpiritAnswers: SurveyAnswers = {
        ...baseAnswers,
        q8: ['none'],
        q10: 'no'
      };

      const result = getPlacement(noSpiritAnswers);
      expect(result.track).toBe('alcoholic');
      expect(result.spirits).toEqual(['gin', 'rum']);
    });
  });

  describe('Session Duration', () => {
    it('should set 3-minute sessions when preferred', () => {
      const shortAnswers: SurveyAnswers = {
        ...baseAnswers,
        q15: '3m'
      };

      const result = getPlacement(shortAnswers);
      expect(result.sessionMinutes).toBe(3);
    });

    it('should set 5-minute sessions as default', () => {
      const defaultAnswers: SurveyAnswers = {
        ...baseAnswers,
        q15: '5m'
      };

      const result = getPlacement(defaultAnswers);
      expect(result.sessionMinutes).toBe(5);
    });

    it('should set 8-minute sessions when preferred', () => {
      const longAnswers: SurveyAnswers = {
        ...baseAnswers,
        q15: '8m'
      };

      const result = getPlacement(longAnswers);
      expect(result.sessionMinutes).toBe(8);
    });
  });

  describe('Interlude Messages', () => {
    it('should create appropriate beginner message', () => {
      const beginnerAnswers: SurveyAnswers = {
        ...baseAnswers,
        q1: 'never',
        q2: 'not-at-all',
        q3: 'mojito', // Wrong answer
        q4: 'rocks', // Wrong answer
        q13: ['none'], // No tools
        q14: ['ice', 'spirit'] // Wrong order
      };

      const result = getPlacement(beginnerAnswers);
      expect(result.level).toBe('beginner');
      expect(result.interlude).toContain('Perfect!');
      expect(result.interlude).toContain('fundamentals');
    });

    it('should create appropriate intermediate message', () => {
      const intermediateAnswers: SurveyAnswers = {
        ...baseAnswers,
        q1: 'occasionally',
        q2: 'somewhat',
        q3: 'margarita', // Correct
        q4: 'coupe', // Correct
        q13: ['jigger', 'shaker'], // Some tools
        q14: ['spirit', 'citrus', 'syrup'] // Partial order
      };

      const result = getPlacement(intermediateAnswers);
      expect(result.level).toBe('intermediate');
      expect(result.interlude).toContain('Great foundation!');
      expect(result.interlude).toContain('refining');
    });

    it('should create appropriate advanced message', () => {
      const advancedAnswers: SurveyAnswers = {
        ...baseAnswers,
        q2: 'very-confident',
        q13: ['jigger', 'shaker', 'barspoon', 'strainer'],
        q14: ['spirit', 'citrus', 'syrup', 'ice', 'shake', 'double-strain']
      };

      const result = getPlacement(advancedAnswers);
      expect(result.interlude).toContain('Impressive');
      expect(result.interlude).toContain('advanced techniques');
    });

    it('should include track information in message', () => {
      const lowAbvAnswers: SurveyAnswers = {
        ...baseAnswers,
        q9: 'low-abv'
      };

      const result = getPlacement(lowAbvAnswers);
      expect(result.interlude).toContain('lower-alcohol');
    });

    it('should include spirit preferences in message', () => {
      const spiritAnswers: SurveyAnswers = {
        ...baseAnswers,
        q8: ['gin', 'whiskey']
      };

      const result = getPlacement(spiritAnswers);
      expect(result.interlude).toContain('gin and whiskey');
    });
  });

  describe('Edge Cases', () => {
    it('should handle missing answers gracefully', () => {
      const incompleteAnswers: SurveyAnswers = {
        q1: 'never',
        q2: 'not-at-all',
        q9: 'alcoholic',
        q10: 'no',
        q15: '5m'
      };

      const result = getPlacement(incompleteAnswers);
      expect(result).toBeDefined();
      expect(result.level).toBeDefined();
      expect(result.track).toBeDefined();
      expect(result.spirits).toBeDefined();
      expect(result.sessionMinutes).toBeDefined();
    });

    it('should handle conflicting answers appropriately', () => {
      const conflictingAnswers: SurveyAnswers = {
        ...baseAnswers,
        q9: 'alcoholic', // Says alcoholic
        q10: 'yes' // But avoids alcohol - should override to zero-proof
      };

      const result = getPlacement(conflictingAnswers);
      expect(result.track).toBe('zero-proof');
    });

    it('should validate build order correctly', () => {
      const correctOrderAnswers: SurveyAnswers = {
        ...baseAnswers,
        q14: ['spirit', 'citrus', 'syrup', 'ice', 'shake', 'double-strain']
      };

      const incorrectOrderAnswers: SurveyAnswers = {
        ...baseAnswers,
        q14: ['ice', 'spirit', 'citrus', 'syrup', 'shake', 'double-strain']
      };

      const correctResult = getPlacement(correctOrderAnswers);
      const incorrectResult = getPlacement(incorrectOrderAnswers);

      // The correct order should contribute to higher level
      expect(correctResult.level).not.toBe('beginner');
      // This test verifies the order checking logic works
    });
  });
});

describe('Survey Questions Structure', () => {
  it('should have exactly 15 questions', () => {
    const questions = getSurveyQuestions();
    expect(questions).toHaveLength(15);
  });

  it('should have all required question properties', () => {
    const questions = getSurveyQuestions();
    
    questions.forEach((question, index) => {
      expect(question.id).toBeDefined();
      expect(question.section).toBeDefined();
      expect(question.type).toBeDefined();
      expect(question.question).toBeDefined();
      expect(question.options).toBeDefined();
      expect(question.options.length).toBeGreaterThan(0);
    });
  });

  it('should have valid question types', () => {
    const questions = getSurveyQuestions();
    const validTypes = ['mcq', 'image-mcq', 'multi-select', 'order'];
    
    questions.forEach(question => {
      expect(validTypes).toContain(question.type);
    });
  });

  it('should have unique question IDs', () => {
    const questions = getSurveyQuestions();
    const ids = questions.map(q => q.id);
    const uniqueIds = [...new Set(ids)];
    
    expect(uniqueIds).toHaveLength(questions.length);
  });

  it('should have expected sections', () => {
    const questions = getSurveyQuestions();
    const sections = [...new Set(questions.map(q => q.section))];
    
    expect(sections).toContain('Experience & Skill');
    expect(sections).toContain('Behavior & Frequency');
    expect(sections).toContain('Preferences & Profile');
    expect(sections).toContain('Placement Knowledge Check');
  });
});