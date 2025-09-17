/**
 * Multi-Armed Bandit for Exercise Type Selection
 * Epsilon-greedy algorithm to optimize exercise type selection
 */

import { ExerciseType } from '../types/domain';

export interface BanditArm {
  type: ExerciseType;
  totalReward: number;
  attemptCount: number;
  averageReward: number;
}

export interface BanditHistory {
  arms: Map<ExerciseType, BanditArm>;
  epsilon: number;
  totalAttempts: number;
}

const DEFAULT_EPSILON = 0.1; // 10% exploration rate
const INITIAL_REWARD = 0.5; // Neutral starting point

/**
 * Initialize bandit with exercise types
 * @param epsilon Exploration rate (0-1)
 * @returns Initial bandit state
 */
export function initializeBandit(epsilon: number = DEFAULT_EPSILON): BanditHistory {
  const exerciseTypes: ExerciseType[] = ['mcq', 'order', 'short'];
  const arms = new Map<ExerciseType, BanditArm>();
  
  exerciseTypes.forEach(type => {
    arms.set(type, {
      type,
      totalReward: INITIAL_REWARD,
      attemptCount: 1,
      averageReward: INITIAL_REWARD
    });
  });
  
  return {
    arms,
    epsilon,
    totalAttempts: exerciseTypes.length
  };
}

/**
 * Select exercise type using epsilon-greedy strategy
 * @param history Current bandit state
 * @returns Selected exercise type
 */
export function pickExerciseType(history: BanditHistory): ExerciseType {
  const { arms, epsilon } = history;
  const exerciseTypes = Array.from(arms.keys());
  
  // Epsilon-greedy: explore vs exploit
  if (Math.random() < epsilon) {
    // Explore: random selection
    return exerciseTypes[Math.floor(Math.random() * exerciseTypes.length)];
  } else {
    // Exploit: select best performing type
    let bestType = exerciseTypes[0];
    let bestReward = arms.get(bestType)!.averageReward;
    
    for (const type of exerciseTypes) {
      const arm = arms.get(type)!;
      if (arm.averageReward > bestReward) {
        bestType = type;
        bestReward = arm.averageReward;
      }
    }
    
    return bestType;
  }
}

/**
 * Update bandit with performance feedback
 * @param history Current bandit state
 * @param exerciseType Type that was used
 * @param reward Performance score (0-1, where 1 = perfect mastery gain)
 * @returns Updated bandit state
 */
export function updateBandit(
  history: BanditHistory,
  exerciseType: ExerciseType,
  reward: number
): BanditHistory {
  const newArms = new Map(history.arms);
  const arm = newArms.get(exerciseType)!;
  
  // Update arm statistics
  const updatedArm: BanditArm = {
    ...arm,
    totalReward: arm.totalReward + reward,
    attemptCount: arm.attemptCount + 1,
    averageReward: (arm.totalReward + reward) / (arm.attemptCount + 1)
  };
  
  newArms.set(exerciseType, updatedArm);
  
  return {
    ...history,
    arms: newArms,
    totalAttempts: history.totalAttempts + 1
  };
}

/**
 * Calculate reward based on learning performance
 * @param masteryGain Change in mastery (0-1)
 * @param timeToAnswer Response time in milliseconds
 * @param wasCorrect Whether the answer was correct
 * @returns Reward score (0-1)
 */
export function calculateReward(
  masteryGain: number,
  timeToAnswer: number,
  wasCorrect: boolean
): number {
  let reward = 0;
  
  // Base reward from mastery gain
  reward += masteryGain * 0.6;
  
  // Correctness bonus
  reward += wasCorrect ? 0.3 : 0;
  
  // Time efficiency bonus (faster = better, up to reasonable limit)
  const optimalTime = 5000; // 5 seconds optimal
  const maxTime = 30000; // 30 seconds max
  const timeEfficiency = Math.max(0, Math.min(1, 
    (maxTime - timeToAnswer) / (maxTime - optimalTime)
  ));
  reward += timeEfficiency * 0.1;
  
  return Math.max(0, Math.min(1, reward));
}

/**
 * Get performance statistics for each exercise type
 * @param history Bandit state
 * @returns Performance summary
 */
export function getBanditStats(history: BanditHistory): {
  type: ExerciseType;
  averageReward: number;
  attempts: number;
  confidence: number;
}[] {
  return Array.from(history.arms.values()).map(arm => ({
    type: arm.type,
    averageReward: Math.round(arm.averageReward * 1000) / 1000,
    attempts: arm.attemptCount,
    confidence: Math.min(1, arm.attemptCount / 10) // Confidence grows with attempts
  }));
}

/**
 * Adapt epsilon based on learning progress
 * @param history Current bandit state
 * @param learningStage User's current learning stage
 * @returns Adjusted epsilon value
 */
export function adaptEpsilon(
  history: BanditHistory,
  learningStage: 'beginner' | 'intermediate' | 'advanced'
): number {
  const baseEpsilon = history.epsilon;
  
  // More exploration for beginners, less for advanced users
  switch (learningStage) {
    case 'beginner':
      return Math.min(0.2, baseEpsilon * 1.5);
    case 'intermediate':
      return baseEpsilon;
    case 'advanced':
      return Math.max(0.05, baseEpsilon * 0.7);
    default:
      return baseEpsilon;
  }
}