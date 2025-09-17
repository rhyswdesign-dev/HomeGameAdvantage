/**
 * Progression Service
 * Manages XP, streaks, badges, and user advancement
 */

import { MemoryUserRepository } from '../repos/memory/userRepository';
import { MemoryProgressRepository } from '../repos/memory/progressRepository';
import { UserProfile, Badge } from '../types/domain';

export type ProgressUpdate = {
  userId: string;
  lessonId: string;
  masteryDelta: number;
  nextDueAt: number;
  correctCount: number;
  totalCount: number;
  now: number;
};

// Default repositories - can be injected for testing
let userRepo = new MemoryUserRepository();
let progressRepo = new MemoryProgressRepository();

// In-memory badge state (in production, this would be persisted)
const userBadges = new Map<string, Set<string>>();
const userStats = new Map<string, {
  totalLessons: number;
  totalCorrect: number;
  streak: number;
  lastActivityDate: string;
  totalXP: number;
}>();

/**
 * Set repository dependencies for testing
 */
export function setRepositories(user: any, progress: any) {
  userRepo = user;
  progressRepo = progress;
}

/**
 * Award XP based on performance
 */
export function awardXP(delta: number): number {
  // Base XP calculation
  return Math.max(0, Math.round(delta * 15)); // 15 XP per mastery point gained
}

/**
 * Update user progress and award XP, streaks, badges
 */
export async function updateProgress(p: ProgressUpdate): Promise<{
  xpAwarded: number;
  newStreak: number;
  badgesUnlocked: string[];
}> {
  const { userId, lessonId, masteryDelta, correctCount, totalCount, now } = p;
  
  // Get current user stats
  const currentStats = getUserStats(userId);
  const accuracy = totalCount > 0 ? correctCount / totalCount : 0;
  
  // Calculate XP award
  let xp = awardXP(masteryDelta);
  
  // Accuracy bonus: +5 XP if ≥85% accuracy
  if (accuracy >= 0.85) {
    xp += 5;
  }
  
  // Completion bonus: +15 XP base per lesson
  xp += 15;
  
  // Update lesson completion stats
  const newTotalLessons = currentStats.totalLessons + 1;
  const newTotalCorrect = currentStats.totalCorrect + correctCount;
  const newTotalXP = currentStats.totalXP + xp;
  
  // Calculate streak
  const newStreak = calculateStreak(userId, now);
  
  // Update user stats
  userStats.set(userId, {
    totalLessons: newTotalLessons,
    totalCorrect: newTotalCorrect,
    streak: newStreak,
    lastActivityDate: new Date(now).toISOString().split('T')[0],
    totalXP: newTotalXP
  });
  
  // Update user profile with new XP
  const profile = await userRepo.getUserProfile(userId);
  if (profile) {
    await userRepo.updatePreferences(userId, {
      xp: newTotalXP,
      streak: newStreak
    });
  }
  
  // Check for new badges
  const badgeContext = {
    totalLessons: newTotalLessons,
    totalCorrect: newTotalCorrect,
    streak: newStreak,
    lessonId,
    accuracy
  };
  
  const newBadges = computeBadges(badgeContext);
  const previousBadges = userBadges.get(userId) || new Set();
  const badgesUnlocked = newBadges.filter(badge => !previousBadges.has(badge));
  
  // Update badge set
  const updatedBadges = new Set([...previousBadges, ...newBadges]);
  userBadges.set(userId, updatedBadges);
  
  return {
    xpAwarded: xp,
    newStreak,
    badgesUnlocked
  };
}

/**
 * Compute which badges user has earned
 */
export function computeBadges(ctx: {
  totalLessons: number;
  totalCorrect: number;
  streak: number;
  lessonId?: string;
  accuracy?: number;
}): string[] {
  const badges: string[] = [];
  
  // Ice Crusher: Complete 5 lessons with shake technique
  if (ctx.totalLessons >= 5 && ctx.lessonId?.includes('shake')) {
    badges.push('Ice Crusher');
  }
  
  // Spirit Guide: Complete 5 spirit-related quizzes
  if (ctx.totalCorrect >= 10 && ctx.lessonId?.includes('spirit')) {
    badges.push('Spirit Guide');
  }
  
  // Seven-Shift Streak: Maintain 7-day streak
  if (ctx.streak >= 7) {
    badges.push('Seven-Shift Streak');
  }
  
  // Perfect Pour: Complete lesson with 100% accuracy
  if (ctx.accuracy === 1.0) {
    badges.push('Perfect Pour');
  }
  
  // Speed Demon: Complete 10 lessons total
  if (ctx.totalLessons >= 10) {
    badges.push('Speed Demon');
  }
  
  // Master Mixologist: Complete 25 lessons total
  if (ctx.totalLessons >= 25) {
    badges.push('Master Mixologist');
  }
  
  // Consistency King: Maintain 14-day streak
  if (ctx.streak >= 14) {
    badges.push('Consistency King');
  }
  
  // Knowledge Collector: Answer 50 questions correctly
  if (ctx.totalCorrect >= 50) {
    badges.push('Knowledge Collector');
  }
  
  return badges;
}

/**
 * Calculate user's current streak
 */
function calculateStreak(userId: string, now: number): number {
  const currentStats = getUserStats(userId);
  const today = new Date(now).toISOString().split('T')[0];
  const lastActivity = currentStats.lastActivityDate;
  
  if (!lastActivity) {
    return 1; // First day
  }
  
  const lastDate = new Date(lastActivity);
  const currentDate = new Date(today);
  const daysDiff = Math.floor((currentDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
  
  if (daysDiff === 0) {
    // Same day, maintain streak
    return currentStats.streak;
  } else if (daysDiff === 1) {
    // Next day, increment streak
    return currentStats.streak + 1;
  } else if (daysDiff <= 2) {
    // Grace period (24-48 hours), maintain streak
    return currentStats.streak;
  } else {
    // Streak broken, reset to 1
    return 1;
  }
}

/**
 * Get user statistics (with defaults)
 */
function getUserStats(userId: string) {
  if (!userStats.has(userId)) {
    userStats.set(userId, {
      totalLessons: 0,
      totalCorrect: 0,
      streak: 0,
      lastActivityDate: '',
      totalXP: 0
    });
  }
  return userStats.get(userId)!;
}

/**
 * Get user's current badges
 */
export function getUserBadges(userId: string): string[] {
  const badges = userBadges.get(userId);
  return badges ? Array.from(badges) : [];
}

/**
 * Calculate XP required for next level
 */
export function getXPForLevel(level: number): number {
  // XP required: level^2 * 100
  return level * level * 100;
}

/**
 * Calculate user's level from total XP
 */
export function getLevelFromXP(totalXP: number): {
  level: number;
  currentLevelXP: number;
  nextLevelXP: number;
  progress: number;
} {
  let level = 1;
  let xpForLevel = getXPForLevel(level);
  
  while (totalXP >= xpForLevel) {
    level++;
    xpForLevel = getXPForLevel(level);
  }
  
  const previousLevelXP = level > 1 ? getXPForLevel(level - 1) : 0;
  const currentLevelXP = totalXP - previousLevelXP;
  const nextLevelXP = xpForLevel - previousLevelXP;
  const progress = nextLevelXP > 0 ? currentLevelXP / nextLevelXP : 1;
  
  return {
    level: level - 1, // Adjust because we incremented one too many
    currentLevelXP,
    nextLevelXP,
    progress: Math.min(1, progress)
  };
}

/**
 * Award bonus XP for special achievements
 */
export function awardBonusXP(userId: string, amount: number, reason: string): void {
  const currentStats = getUserStats(userId);
  userStats.set(userId, {
    ...currentStats,
    totalXP: currentStats.totalXP + amount
  });
}

/**
 * Get leaderboard data (stub for future implementation)
 */
export function getLeaderboard(timeframe: 'daily' | 'weekly' | 'all-time' = 'weekly'): Array<{
  userId: string;
  username: string;
  xp: number;
  rank: number;
}> {
  // Stub implementation - would query real leaderboard data
  return [
    { userId: 'user1', username: 'MasterMixer', xp: 1250, rank: 1 },
    { userId: 'user2', username: 'CocktailPro', xp: 980, rank: 2 },
    { userId: 'user3', username: 'BarChamp', xp: 875, rank: 3 }
  ];
}

/**
 * Reset user progress (for testing or account reset)
 */
export function resetUserProgress(userId: string): void {
  userStats.delete(userId);
  userBadges.delete(userId);
}