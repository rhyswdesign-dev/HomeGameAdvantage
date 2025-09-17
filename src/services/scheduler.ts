/**
 * Session Scheduler Service
 * Implements spaced repetition, interleaving, and bandit algorithms for session planning
 */

import { Item, UserProgress, ExerciseType } from '../types/domain';
import { MemoryContentRepository } from '../repos/memory/contentRepository';
import { MemoryProgressRepository } from '../repos/memory/progressRepository';
import { updateReviewState as spacedRepetitionUpdate, initializeReviewState } from '../lib/spacedRepetition';
import { updateSkill as difficultyUpdate } from '../lib/difficultyAdaptation';
import { planInterleaving } from '../lib/interleaving';
import { pickExerciseType, initializeBandit, updateBandit, BanditHistory } from '../lib/bandit';

export type ReviewState = { 
  mastery: number; 
  stability: number; 
  dueAt: number; 
};

export type PlanMix = { 
  current: number; 
  review: number; 
  older: number; 
};

export type SessionPlan = { 
  items: Item[]; 
  mix: PlanMix; 
  expectedMinutes: number; 
};

// Default repositories - can be injected for testing
let contentRepo = new MemoryContentRepository();
let progressRepo = new MemoryProgressRepository();

// Global bandit state per user (in production, this would be persisted)
const userBandits = new Map<string, BanditHistory>();

/**
 * Set repository dependencies for testing
 */
export function setRepositories(content: any, progress: any) {
  contentRepo = content;
  progressRepo = progress;
}

/**
 * Get next items for a user and module using interleaving and bandit selection
 */
export async function getNextItems(
  userId: string, 
  moduleId: string, 
  now: number = Date.now()
): Promise<Item[]> {
  const plan = await getNextSessionPlan(userId, moduleId, 5, now);
  return plan.items;
}

/**
 * Plan a complete session with interleaving and difficulty adaptation
 */
export async function getNextSessionPlan(
  userId: string,
  moduleId: string,
  targetMinutes: number = 5,
  now: number = Date.now()
): Promise<SessionPlan> {
  // Get module and its lessons
  const module = await contentRepo.getModule(moduleId);
  if (!module) {
    return { items: [], mix: { current: 0, review: 0, older: 0 }, expectedMinutes: 0 };
  }

  // Get all lessons for this module
  const allModules = await contentRepo.listModules();
  const moduleItems: Item[] = [];
  
  for (const mod of allModules) {
    if (mod.id === moduleId) {
      // Get lessons for current module
      const lessons = await Promise.all(
        mod.prerequisiteIds.map(id => contentRepo.getLesson(id))
      );
      
      for (const lesson of lessons) {
        if (lesson) {
          const items = await contentRepo.getItemsForLesson(lesson.id);
          moduleItems.push(...items);
        }
      }
    }
  }

  // Get user progress for items
  const sevenDaysAgo = now - (7 * 24 * 60 * 60 * 1000);
  const fourteenDaysAgo = now - (14 * 24 * 60 * 60 * 1000);

  const allProgress = await progressRepo.getDueItems(userId, now);
  
  // Categorize items
  const dueItems: { item: Item; progress: UserProgress }[] = [];
  const recentReview: { item: Item; progress: UserProgress }[] = [];
  const olderReview: { item: Item; progress: UserProgress }[] = [];
  const newItems: Item[] = [];

  // Get bandit for exercise type selection
  const bandit = getUserBandit(userId);

  for (const item of moduleItems) {
    const progress = allProgress.find(p => 
      p.userId === userId && 
      p.lessonId.includes(item.id) // Simplified matching
    );

    if (!progress) {
      // New item - apply bandit selection for exercise type
      const selectedType = pickExerciseType(bandit);
      if (item.type === selectedType) {
        newItems.push(item);
      }
    } else if (progress.dueAt <= now) {
      if (progress.dueAt >= sevenDaysAgo) {
        recentReview.push({ item, progress });
      } else if (progress.dueAt >= fourteenDaysAgo) {
        olderReview.push({ item, progress });
      }
    }
  }

  // Apply interleaving algorithm
  const interleavingPlan = planInterleaving(
    recentReview,
    newItems,
    olderReview,
    targetMinutes
  );

  return {
    items: interleavingPlan.items,
    mix: interleavingPlan.mix,
    expectedMinutes: interleavingPlan.estimatedMinutes
  };
}

/**
 * Update review state using spaced repetition algorithm
 */
export function updateReviewState(
  prev: ReviewState,
  isCorrect: boolean,
  now: number = Date.now(),
  baseIntervalHrs: number = 4
): ReviewState {
  return spacedRepetitionUpdate(prev, isCorrect, now);
}

/**
 * Update user and item difficulty using logistic ELO
 */
export function updateSkill(
  userSkill: number,
  itemDifficulty: number,
  isCorrect: boolean,
  k: number = 0.1,
  kItem: number = 0.05
): { userSkill: number; itemDifficulty: number } {
  const result = difficultyUpdate(userSkill, itemDifficulty, isCorrect);
  return {
    userSkill: result.newUserSkill,
    itemDifficulty: result.newItemDifficulty
  };
}

/**
 * Get or initialize bandit for user
 */
function getUserBandit(userId: string): BanditHistory {
  if (!userBandits.has(userId)) {
    userBandits.set(userId, initializeBandit(0.1)); // 10% exploration
  }
  return userBandits.get(userId)!;
}

/**
 * Update bandit based on exercise performance
 */
export function updateBanditForUser(
  userId: string,
  exerciseType: ExerciseType,
  masteryGain: number,
  timeToAnswer: number,
  wasCorrect: boolean
): void {
  const bandit = getUserBandit(userId);
  
  // Calculate reward based on performance
  const baseReward = masteryGain * 0.6; // 60% weight on mastery gain
  const correctnessBonus = wasCorrect ? 0.3 : 0; // 30% weight on correctness
  const timeEfficiency = Math.max(0, Math.min(0.1, (10000 - timeToAnswer) / 10000)); // 10% weight on speed
  
  const reward = Math.max(0, Math.min(1, baseReward + correctnessBonus + timeEfficiency));
  
  const updatedBandit = updateBandit(bandit, exerciseType, reward);
  userBandits.set(userId, updatedBandit);
}

/**
 * Get recommended items based on user skill and target difficulty
 */
export async function getRecommendedDifficulty(
  userId: string,
  targetSuccessRate: number = 0.8
): Promise<number> {
  // This would typically come from user profile
  const userSkill = 0.5; // Default middle skill
  
  // Calculate difficulty that would yield target success rate
  const logOdds = Math.log(targetSuccessRate / (1 - targetSuccessRate));
  const difficulty = userSkill - (logOdds / 5);
  
  return Math.max(0, Math.min(1, difficulty));
}

/**
 * Analyze session performance and adapt future scheduling
 */
export function analyzeSessionPerformance(
  items: Item[],
  attempts: Array<{ itemId: string; correct: boolean; timeMs: number }>
): {
  averageAccuracy: number;
  averageTime: number;
  recommendedAdjustment: 'easier' | 'harder' | 'maintain';
} {
  const accuracy = attempts.reduce((sum, a) => sum + (a.correct ? 1 : 0), 0) / attempts.length;
  const avgTime = attempts.reduce((sum, a) => sum + a.timeMs, 0) / attempts.length;
  
  let adjustment: 'easier' | 'harder' | 'maintain' = 'maintain';
  
  if (accuracy < 0.6) {
    adjustment = 'easier';
  } else if (accuracy > 0.9 && avgTime < 5000) {
    adjustment = 'harder';
  }
  
  return {
    averageAccuracy: accuracy,
    averageTime: avgTime,
    recommendedAdjustment: adjustment
  };
}