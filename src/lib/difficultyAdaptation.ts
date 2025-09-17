/**
 * Difficulty Adaptation using Logistic ELO
 * Adjusts user skill and item difficulty based on performance
 */

export interface SkillUpdate {
  newUserSkill: number;
  newItemDifficulty: number;
  confidence: number; // How confident we are in this update
}

const K_USER = 0.1; // Learning rate for user skill
const K_ITEM = 0.05; // Learning rate for item difficulty (slower)

/**
 * Update user skill and item difficulty based on performance
 * @param userSkill Current user skill (0-1)
 * @param itemDifficulty Current item difficulty (0-1)
 * @param isCorrect Whether the user answered correctly
 * @returns Updated skill levels
 */
export function updateSkill(
  userSkill: number,
  itemDifficulty: number,
  isCorrect: boolean
): SkillUpdate {
  // Calculate expected probability of success using logistic function
  const expectedProbability = 1 / (1 + Math.exp(-(userSkill - itemDifficulty) * 5));
  
  // Actual outcome (1 for correct, 0 for incorrect)
  const actualOutcome = isCorrect ? 1 : 0;
  
  // Update user skill based on performance vs expectation
  const userSkillDelta = K_USER * (actualOutcome - expectedProbability);
  const newUserSkill = Math.max(0, Math.min(1, userSkill + userSkillDelta));
  
  // Update item difficulty (inverse of user performance)
  const itemDifficultyDelta = K_ITEM * (expectedProbability - actualOutcome);
  const newItemDifficulty = Math.max(0, Math.min(1, itemDifficulty + itemDifficultyDelta));
  
  // Calculate confidence based on how surprising the result was
  const surprise = Math.abs(actualOutcome - expectedProbability);
  const confidence = Math.max(0.1, 1 - surprise);
  
  return {
    newUserSkill: Math.round(newUserSkill * 1000) / 1000,
    newItemDifficulty: Math.round(newItemDifficulty * 1000) / 1000,
    confidence: Math.round(confidence * 1000) / 1000
  };
}

/**
 * Calculate the expected probability of success
 * @param userSkill User's current skill level (0-1)
 * @param itemDifficulty Item's difficulty level (0-1)
 * @returns Probability of success (0-1)
 */
export function getExpectedProbability(userSkill: number, itemDifficulty: number): number {
  return 1 / (1 + Math.exp(-(userSkill - itemDifficulty) * 5));
}

/**
 * Recommend difficulty level for next item based on target success rate
 * @param userSkill Current user skill
 * @param targetSuccessRate Desired success rate (e.g., 0.8 for 80%)
 * @returns Recommended item difficulty
 */
export function recommendDifficulty(userSkill: number, targetSuccessRate: number = 0.8): number {
  // Inverse of the logistic function to find difficulty that gives target success rate
  const logOdds = Math.log(targetSuccessRate / (1 - targetSuccessRate));
  const recommendedDifficulty = userSkill - (logOdds / 5);
  
  return Math.max(0, Math.min(1, recommendedDifficulty));
}

/**
 * Initialize user skill based on placement test results
 * @param correctAnswers Number of correct answers
 * @param totalQuestions Total number of questions
 * @param adjustmentFactor Optional adjustment based on question difficulty
 * @returns Initial skill level
 */
export function initializeUserSkill(
  correctAnswers: number,
  totalQuestions: number,
  adjustmentFactor: number = 1.0
): number {
  const baseSkill = correctAnswers / totalQuestions;
  const adjustedSkill = baseSkill * adjustmentFactor;
  
  return Math.max(0.1, Math.min(0.9, adjustedSkill));
}