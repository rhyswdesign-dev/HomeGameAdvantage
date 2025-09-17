/**
 * In-Memory User Repository
 * Manages user profiles and personalization
 */

import { UserRepository } from '../interfaces';
import { UserProfile, PlacementResult, PersonalizationProfile } from '../../types/domain';

export class MemoryUserRepository implements UserRepository {
  private users: Map<string, UserProfile> = new Map();
  private personalization: Map<string, PersonalizationProfile> = new Map();

  async createUser(profile: UserProfile): Promise<void> {
    this.users.set(profile.id, { ...profile });
  }

  async getUserProfile(userId: string): Promise<UserProfile | null> {
    return this.users.get(userId) || null;
  }

  async updatePreferences(userId: string, patch: Partial<UserProfile>): Promise<void> {
    const existing = this.users.get(userId);
    if (existing) {
      this.users.set(userId, { ...existing, ...patch });
    }
  }

  async savePlacement(userId: string, result: PlacementResult): Promise<void> {
    const existing = this.users.get(userId);
    if (existing) {
      const updated: UserProfile = {
        ...existing,
        level: result.level === 'beginner' ? 1 : result.level === 'intermediate' ? 2 : 3,
        track: result.track,
        spiritFocus: result.spirits,
        sessionMinutes: result.sessionMinutes
      };
      this.users.set(userId, updated);
    }
  }

  async savePersonalizationProfile(userId: string, profile: PersonalizationProfile): Promise<void> {
    this.personalization.set(userId, { ...profile });
  }

  async getPersonalizationProfile(userId: string): Promise<PersonalizationProfile | null> {
    return this.personalization.get(userId) || null;
  }

  // Helper methods for testing
  getAllUsers(): UserProfile[] {
    return Array.from(this.users.values());
  }

  clearData(): void {
    this.users.clear();
    this.personalization.clear();
  }
}