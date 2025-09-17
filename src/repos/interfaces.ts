/**
 * Repository Interfaces
 * Clean architecture with abstractions for data access
 */

import { Module, Lesson, Item, UserProfile, UserProgress, Attempt, PlacementResult, PersonalizationProfile } from '../types/domain';

export interface ContentRepository {
  getModule(id: string): Promise<Module | null>;
  getLesson(id: string): Promise<Lesson | null>;
  getItemsForLesson(lessonId: string): Promise<Item[]>;
  listModules(): Promise<Module[]>;
  getItem(id: string): Promise<Item | null>;
  getModulesByChapter(chapterIndex: number): Promise<Module[]>;
}

export interface ProgressRepository {
  getUserProgress(userId: string, lessonId: string): Promise<UserProgress | null>;
  upsertUserProgress(record: UserProgress): Promise<void>;
  logAttempt(attempt: Attempt): Promise<void>;
  getUserProgressByModule(userId: string, moduleId: string): Promise<UserProgress[]>;
  getDueItems(userId: string, beforeTimestamp: number): Promise<UserProgress[]>;
}

export interface UserRepository {
  savePlacement(userId: string, result: PlacementResult): Promise<void>;
  getUserProfile(userId: string): Promise<UserProfile | null>;
  updatePreferences(userId: string, patch: Partial<UserProfile>): Promise<void>;
  createUser(profile: UserProfile): Promise<void>;
  savePersonalizationProfile(userId: string, profile: PersonalizationProfile): Promise<void>;
  getPersonalizationProfile(userId: string): Promise<PersonalizationProfile | null>;
}