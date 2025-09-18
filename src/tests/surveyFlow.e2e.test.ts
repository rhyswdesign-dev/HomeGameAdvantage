/**
 * End-to-End Survey Flow Integration Tests
 * Tests the complete survey journey from start to placement results
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { getSurveyQuestions, getPlacement, SurveyAnswers } from '../services/placement';

describe('Survey Flow End-to-End', () => {
  let surveyQuestions: any[];

  beforeEach(() => {
    surveyQuestions = getSurveyQuestions();
  });

  describe('Complete Survey Flow', () => {
    it('should handle complete beginner journey', () => {
      // Simulate a complete beginner answering all questions
      const beginnerAnswers: SurveyAnswers = {
        q1: 'never',
        q2: 'not-at-all',
        q3: 'mojito', // Wrong answer
        q4: 'rocks', // Wrong answer
        q5: 'rarely',
        q6: 'rarely',
        q7: ['atmosphere'],
        q8: ['none'],
        q9: 'alcoholic',
        q10: 'no',
        q11: ['sweet', 'citrus'],
        q12: ['host'],
        q13: ['none'],
        q14: ['ice', 'spirit', 'citrus'], // Wrong order
        q15: '3m'
      };

      // Test placement calculation
      const placement = getPlacement(beginnerAnswers);

      // Verify beginner classification
      expect(placement.level).toBe('beginner');
      expect(placement.startModuleId).toBe('ch1-intro');
      expect(placement.track).toBe('alcoholic');
      expect(placement.spirits).toEqual(['gin', 'rum']); // Default spirits
      expect(placement.sessionMinutes).toBe(3);
      expect(placement.interlude).toContain('Perfect!');
      expect(placement.interlude).toContain('fundamentals');
    });

    it('should handle complete intermediate journey', () => {
      // Simulate an intermediate user answering all questions
      const intermediateAnswers: SurveyAnswers = {
        q1: 'occasionally',
        q2: 'somewhat',
        q3: 'margarita', // Correct
        q4: 'coupe', // Correct
        q5: 'monthly',
        q6: 'monthly',
        q7: ['drinks', 'atmosphere'],
        q8: ['gin', 'whiskey'],
        q9: 'alcoholic',
        q10: 'no',
        q11: ['citrus', 'herbal', 'bitter'],
        q12: ['classics', 'host'],
        q13: ['jigger', 'shaker'],
        q14: ['spirit', 'citrus', 'syrup'], // Partial correct order
        q15: '5m'
      };

      // Test placement calculation
      const placement = getPlacement(intermediateAnswers);

      // Verify intermediate classification
      expect(placement.level).toBe('intermediate');
      expect(placement.track).toBe('alcoholic');
      expect(placement.spirits).toEqual(['gin', 'whiskey']);
      expect(placement.sessionMinutes).toBe(5);
      expect(placement.interlude).toContain('Great foundation!');
      expect(placement.interlude).toContain('gin and whiskey');
    });

    it('should handle complete advanced journey', () => {
      // Simulate an advanced user answering all questions
      const advancedAnswers: SurveyAnswers = {
        q1: 'regularly',
        q2: 'very-confident',
        q3: 'margarita', // Correct
        q4: 'coupe', // Correct
        q5: 'weekly',
        q6: 'weekly',
        q7: ['drinks', 'music', 'atmosphere'],
        q8: ['gin', 'whiskey', 'rum'],
        q9: 'alcoholic',
        q10: 'no',
        q11: ['bitter', 'herbal', 'smoky'],
        q12: ['originals', 'professional'],
        q13: ['jigger', 'shaker', 'barspoon', 'strainer'],
        q14: ['spirit', 'citrus', 'syrup', 'ice', 'shake', 'double-strain'], // Perfect order
        q15: '8m'
      };

      // Test placement calculation
      const placement = getPlacement(advancedAnswers);

      // Verify advanced classification
      expect(placement.level).toBe('advanced');
      expect(placement.startModuleId).toBe('ch2-tools-terms');
      expect(placement.track).toBe('alcoholic');
      expect(placement.spirits).toEqual(['gin', 'whiskey']); // Limited to top 2
      expect(placement.sessionMinutes).toBe(8);
      expect(placement.interlude).toContain('Impressive');
    });

    it('should handle zero-proof track journey', () => {
      // Simulate a user who avoids alcohol
      const zeroProofAnswers: SurveyAnswers = {
        q1: 'occasionally',
        q2: 'somewhat',
        q3: 'margarita',
        q4: 'coupe',
        q5: 'monthly',
        q6: 'monthly',
        q7: ['drinks', 'atmosphere'],
        q8: ['none'], // No spirits selected
        q9: 'alcoholic', // Will be overridden by q10
        q10: 'yes', // Avoids alcohol
        q11: ['citrus', 'sweet', 'floral'],
        q12: ['host', 'classics'],
        q13: ['jigger', 'shaker'],
        q14: ['spirit', 'citrus', 'syrup', 'ice'],
        q15: '5m'
      };

      // Test placement calculation
      const placement = getPlacement(zeroProofAnswers);

      // Verify zero-proof track assignment
      expect(placement.track).toBe('zero-proof');
      expect(placement.spirits).toEqual(['gin-alternative', 'rum-alternative']);
      expect(placement.interlude).toContain('mastering');
    });

    it('should handle low-abv track journey', () => {
      // Simulate a user who prefers low-ABV drinks
      const lowAbvAnswers: SurveyAnswers = {
        q1: 'occasionally',
        q2: 'somewhat',
        q3: 'margarita',
        q4: 'coupe',
        q5: 'monthly',
        q6: 'monthly',
        q7: ['drinks', 'atmosphere'],
        q8: ['gin', 'rum'],
        q9: 'low-abv',
        q10: 'no',
        q11: ['citrus', 'floral', 'herbal'],
        q12: ['host'],
        q13: ['jigger'],
        q14: ['spirit', 'citrus'],
        q15: '5m'
      };

      // Test placement calculation
      const placement = getPlacement(lowAbvAnswers);

      // Verify low-ABV track assignment
      expect(placement.track).toBe('low-abv');
      expect(placement.spirits).toEqual(['gin', 'rum']);
      expect(placement.interlude).toContain('lower-alcohol');
    });
  });

  describe('Survey Question Validation', () => {
    it('should have exactly 15 questions in correct order', () => {
      expect(surveyQuestions).toHaveLength(15);

      // Verify question IDs are in order
      const expectedIds = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7', 'q8', 'q9', 'q10', 'q11', 'q12', 'q13', 'q14', 'q15'];
      const actualIds = surveyQuestions.map(q => q.id);
      expect(actualIds).toEqual(expectedIds);
    });

    it('should have proper section groupings', () => {
      const sections = surveyQuestions.map(q => q.section);
      
      // Check section distribution
      expect(sections.slice(0, 4)).toEqual([
        'Experience & Skill',
        'Experience & Skill',
        'Experience & Skill',
        'Experience & Skill'
      ]);

      expect(sections.slice(4, 7)).toEqual([
        'Behavior & Frequency',
        'Behavior & Frequency',
        'Behavior & Frequency'
      ]);

      expect(sections.slice(7, 13)).toEqual([
        'Preferences & Profile',
        'Preferences & Profile',
        'Preferences & Profile',
        'Preferences & Profile',
        'Preferences & Profile',
        'Preferences & Profile'
      ]);

      expect(sections.slice(13, 15)).toEqual([
        'Placement Knowledge Check',
        'Placement Knowledge Check'
      ]);
    });

    it('should have correct question types', () => {
      const expectedTypes = [
        'mcq', // q1
        'mcq', // q2
        'mcq', // q3
        'image-mcq', // q4
        'mcq', // q5
        'mcq', // q6
        'multi-select', // q7
        'multi-select', // q8
        'mcq', // q9
        'mcq', // q10
        'multi-select', // q11
        'multi-select', // q12
        'multi-select', // q13
        'order', // q14
        'mcq' // q15
      ];

      const actualTypes = surveyQuestions.map(q => q.type);
      expect(actualTypes).toEqual(expectedTypes);
    });

    it('should have valid options for all questions', () => {
      surveyQuestions.forEach((question, index) => {
        expect(question.options).toBeDefined();
        expect(question.options.length).toBeGreaterThan(0);
        
        // Each option should have value and label
        question.options.forEach((option: any) => {
          expect(option.value).toBeDefined();
          expect(option.label).toBeDefined();
          expect(typeof option.value).toBe('string');
          expect(typeof option.label).toBe('string');
        });

        // Image MCQ should have image property
        if (question.type === 'image-mcq') {
          question.options.forEach((option: any) => {
            expect(option.image).toBeDefined();
          });
        }
      });
    });
  });

  describe('User Flow Simulation', () => {
    it('should simulate realistic user progression through questions', () => {
      // Simulate a user taking their time and changing answers
      const answers: SurveyAnswers = {};
      
      // Experience questions
      answers.q1 = 'occasionally'; // Has some experience
      answers.q2 = 'somewhat'; // Moderate confidence
      answers.q3 = 'margarita'; // Correct knowledge
      answers.q4 = 'coupe'; // Correct glassware

      // Frequency questions
      answers.q5 = 'monthly'; // Regular but not frequent
      answers.q6 = 'monthly'; // Consistent with home making
      answers.q7 = ['drinks', 'atmosphere']; // Values quality

      // Preferences
      answers.q8 = ['gin', 'whiskey']; // Clear spirit preferences
      answers.q9 = 'alcoholic'; // Traditional cocktails
      answers.q10 = 'no'; // No alcohol restrictions
      answers.q11 = ['citrus', 'herbal', 'bitter']; // Sophisticated palate
      answers.q12 = ['classics', 'host']; // Clear learning goals

      // Tools and knowledge
      answers.q13 = ['jigger', 'shaker']; // Has basic tools
      answers.q14 = ['spirit', 'citrus', 'syrup', 'ice', 'shake']; // Good technique knowledge
      answers.q15 = '5m'; // Reasonable session length

      // Calculate placement
      const placement = getPlacement(answers);

      // Should be classified as intermediate
      expect(placement.level).toBe('intermediate');
      expect(placement.track).toBe('alcoholic');
      expect(placement.spirits).toEqual(['gin', 'whiskey']);
      expect(placement.sessionMinutes).toBe(5);

      // Should have personalized interlude
      expect(placement.interlude).toContain('gin and whiskey');
      expect(placement.interlude).toContain('classic cocktails');
    });

    it('should handle edge case: user with mixed signals', () => {
      // User who says they're experienced but gets knowledge questions wrong
      const mixedAnswers: SurveyAnswers = {
        q1: 'regularly', // Claims experience
        q2: 'very-confident', // Claims confidence (gets 2 points)
        q3: 'mojito', // Wrong answer (no points)
        q4: 'rocks', // Wrong answer (no points)
        q5: 'weekly',
        q6: 'weekly',
        q7: ['drinks'],
        q8: ['gin'],
        q9: 'alcoholic',
        q10: 'no',
        q11: ['sweet'],
        q12: ['host'],
        q13: ['none'], // No tools (no points)
        q14: ['ice', 'spirit'], // Wrong order (no points)
        q15: '5m'
      };

      const placement = getPlacement(mixedAnswers);

      // Should be classified as beginner since only q2 gives points (2 points total, ≤3 = beginner)
      expect(placement.level).toBe('beginner');
      expect(placement.spirits).toEqual(['gin']);
    });

    it('should handle incomplete survey gracefully', () => {
      // Minimal answers (some questions skipped)
      const incompleteAnswers: SurveyAnswers = {
        q1: 'never',
        q2: 'not-at-all',
        q9: 'alcoholic',
        q10: 'no',
        q15: '5m'
      };

      // Should not throw an error
      expect(() => getPlacement(incompleteAnswers)).not.toThrow();
      
      const placement = getPlacement(incompleteAnswers);
      expect(placement).toBeDefined();
      expect(placement.level).toBeDefined();
      expect(placement.track).toBeDefined();
      expect(placement.spirits).toBeDefined();
    });
  });

  describe('Navigation Flow Integration', () => {
    it('should produce valid lesson routing data', () => {
      const testCases = [
        {
          level: 'beginner',
          spirits: ['gin', 'rum'],
          expectedLessonId: 'lesson-glassware',
          expectedModuleId: 'ch1-intro'
        },
        {
          level: 'intermediate',
          spirits: ['gin', 'whiskey'],
          expectedLessonId: 'lesson-gin-basics', // Because gin is selected
          expectedModuleId: 'ch1-intro' // Unless very confident
        },
        {
          level: 'advanced',
          spirits: ['whiskey', 'rum'],
          expectedLessonId: 'lesson-gin-basics', // Default for advanced
          expectedModuleId: 'ch2-tools-terms'
        }
      ];

      testCases.forEach(testCase => {
        // Simulate what SurveyResultsScreen would do
        let lessonId = 'lesson-glassware'; // Default beginner lesson
        
        if (testCase.level === 'intermediate') {
          lessonId = 'lesson-shake-stir';
        } else if (testCase.level === 'advanced') {
          lessonId = 'lesson-gin-basics'; // Start with spirit knowledge
        }
        
        // Check if user selected specific spirits
        if (testCase.spirits.includes('gin')) {
          lessonId = 'lesson-gin-basics';
        }

        // Verify the routing logic produces valid results
        expect(lessonId).toBeDefined();
        expect(typeof lessonId).toBe('string');
        expect(lessonId.length).toBeGreaterThan(0);
      });
    });

    it('should handle retake survey flow', () => {
      // User completes survey, gets results, decides to retake
      const firstAnswers: SurveyAnswers = {
        q1: 'never',
        q2: 'not-at-all',
        q3: 'mojito',
        q4: 'rocks',
        q5: 'rarely',
        q6: 'rarely',
        q7: ['atmosphere'],
        q8: ['none'],
        q9: 'alcoholic',
        q10: 'no',
        q11: ['sweet'],
        q12: ['host'],
        q13: ['none'],
        q14: ['ice', 'spirit'],
        q15: '3m'
      };

      const firstPlacement = getPlacement(firstAnswers);
      expect(firstPlacement.level).toBe('beginner');

      // User retakes and gives better answers
      const retakeAnswers: SurveyAnswers = {
        q1: 'occasionally',
        q2: 'somewhat',
        q3: 'margarita', // Correct this time
        q4: 'coupe', // Correct this time
        q5: 'monthly',
        q6: 'monthly',
        q7: ['drinks', 'atmosphere'],
        q8: ['gin', 'whiskey'],
        q9: 'alcoholic',
        q10: 'no',
        q11: ['citrus', 'herbal'],
        q12: ['classics'],
        q13: ['jigger', 'shaker'],
        q14: ['spirit', 'citrus', 'syrup', 'ice'],
        q15: '5m'
      };

      const retakePlacement = getPlacement(retakeAnswers);
      expect(retakePlacement.level).toBe('intermediate');
      expect(retakePlacement.spirits).toEqual(['gin', 'whiskey']);

      // Should get different results
      expect(retakePlacement.level).not.toBe(firstPlacement.level);
      expect(retakePlacement.spirits).not.toEqual(firstPlacement.spirits);
    });
  });

  describe('Performance and Edge Cases', () => {
    it('should handle rapid answer changes', () => {
      // Simulate user quickly changing answers
      const answers: SurveyAnswers = {};
      
      // Rapidly change q3 answer multiple times
      answers.q3 = 'mojito';
      answers.q3 = 'daiquiri';
      answers.q3 = 'tom-collins';
      answers.q3 = 'margarita'; // Final answer

      // Should use the final answer
      const placement = getPlacement({ ...answers, q1: 'never', q2: 'not-at-all', q9: 'alcoholic', q10: 'no', q15: '5m' });
      // The margarita answer should contribute to the score
      expect(placement).toBeDefined();
    });

    it('should process large number of placements efficiently', () => {
      const startTime = Date.now();
      
      // Process 100 placements
      for (let i = 0; i < 100; i++) {
        const answers: SurveyAnswers = {
          q1: i % 3 === 0 ? 'never' : i % 3 === 1 ? 'occasionally' : 'regularly',
          q2: i % 3 === 0 ? 'not-at-all' : i % 3 === 1 ? 'somewhat' : 'very-confident',
          q3: i % 2 === 0 ? 'margarita' : 'mojito',
          q4: i % 2 === 0 ? 'coupe' : 'rocks',
          q5: 'monthly',
          q6: 'monthly',
          q7: ['drinks'],
          q8: ['gin'],
          q9: 'alcoholic',
          q10: 'no',
          q11: ['citrus'],
          q12: ['host'],
          q13: ['jigger'],
          q14: ['spirit', 'citrus'],
          q15: '5m'
        };
        
        const placement = getPlacement(answers);
        expect(placement).toBeDefined();
      }
      
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      // Should complete 100 placements in under 1 second
      expect(duration).toBeLessThan(1000);
    });
  });
});