/**
 * In-Memory Progress Repository
 * Tracks user progress and attempts
 */

import { ProgressRepository } from '../interfaces';
import { UserProgress, Attempt } from '../../types/domain';

export class MemoryProgressRepository implements ProgressRepository {
  private progress: Map<string, UserProgress> = new Map();
  private attempts: Attempt[] = [];

  private getProgressKey(userId: string, lessonId: string): string {
    return `${userId}:${lessonId}`;
  }

  async getUserProgress(userId: string, lessonId: string): Promise<UserProgress | null> {
    const key = this.getProgressKey(userId, lessonId);
    return this.progress.get(key) || null;
  }

  async upsertUserProgress(record: UserProgress): Promise<void> {
    const key = this.getProgressKey(record.userId, record.lessonId);
    this.progress.set(key, { ...record });
  }

  async logAttempt(attempt: Attempt): Promise<void> {
    this.attempts.push({ ...attempt });
  }

  async getUserProgressByModule(userId: string, moduleId: string): Promise<UserProgress[]> {
    // For memory implementation, we'd need to cross-reference with lessons
    // In a real implementation, this would be a more efficient query
    const allProgress = Array.from(this.progress.values());
    return allProgress.filter(p => p.userId === userId);
  }

  async getDueItems(userId: string, beforeTimestamp: number): Promise<UserProgress[]> {
    const allProgress = Array.from(this.progress.values());
    return allProgress.filter(p => 
      p.userId === userId && 
      p.dueAt <= beforeTimestamp
    );
  }

  // Helper method for testing
  getAttempts(userId?: string): Attempt[] {
    if (userId) {
      return this.attempts.filter(a => a.userId === userId);
    }
    return [...this.attempts];
  }

  // Helper method for testing
  clearData(): void {
    this.progress.clear();
    this.attempts.length = 0;
  }
}