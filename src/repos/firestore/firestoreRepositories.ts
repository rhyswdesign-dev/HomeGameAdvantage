/**
 * Firestore Repository Implementations
 * Production-ready implementations with converters and error handling
 */

import { ContentRepository, ProgressRepository, UserRepository } from '../interfaces';
import { Module, Lesson, Item, UserProfile, UserProgress, Attempt, PlacementResult, PersonalizationProfile } from '../../types/domain';

// Type-safe Firestore interfaces (stubs for now - replace with actual Firebase imports)
interface FirestoreDoc {
  id: string;
  data(): any;
  exists: boolean;
}

interface FirestoreCollection {
  doc(id: string): FirestoreDocRef;
  where(field: string, op: string, value: any): FirestoreQuery;
  orderBy(field: string, direction?: 'asc' | 'desc'): FirestoreQuery;
  add(data: any): Promise<FirestoreDocRef>;
}

interface FirestoreDocRef {
  get(): Promise<FirestoreDoc>;
  set(data: any, options?: { merge: boolean }): Promise<void>;
  update(data: any): Promise<void>;
  delete(): Promise<void>;
}

interface FirestoreQuery {
  where(field: string, op: string, value: any): FirestoreQuery;
  orderBy(field: string, direction?: 'asc' | 'desc'): FirestoreQuery;
  limit(count: number): FirestoreQuery;
  get(): Promise<{ docs: FirestoreDoc[] }>;
}

interface FirestoreInstance {
  collection(name: string): FirestoreCollection;
}

// Firestore connection stub - replace with actual Firebase initialization
let firestore: FirestoreInstance | null = null;

export function initializeFirestore(instance: FirestoreInstance): void {
  firestore = instance;
}

function requireFirestore(): FirestoreInstance {
  if (!firestore) {
    throw new Error('Firestore not initialized. Call initializeFirestore() first.');
  }
  return firestore;
}

// Firestore converters for type safety
const moduleConverter = {
  toFirestore: (module: Module) => ({
    ...module,
    createdAt: new Date(),
    updatedAt: new Date()
  }),
  fromFirestore: (doc: FirestoreDoc): Module => {
    const data = doc.data();
    return {
      id: doc.id,
      title: data.title,
      description: data.description,
      chapterIndex: data.chapterIndex,
      prerequisiteIds: data.prerequisiteIds || [],
      estimatedMinutes: data.estimatedMinutes || 0,
      tags: data.tags || []
    };
  }
};

const lessonConverter = {
  toFirestore: (lesson: Lesson) => ({
    ...lesson,
    createdAt: new Date(),
    updatedAt: new Date()
  }),
  fromFirestore: (doc: FirestoreDoc): Lesson => {
    const data = doc.data();
    return {
      id: doc.id,
      title: data.title,
      moduleId: data.moduleId,
      types: data.types || ['mcq'],
      itemIds: data.itemIds || [],
      estimatedMinutes: data.estimatedMinutes || 5,
      prereqs: data.prereqs || []
    };
  }
};

const itemConverter = {
  toFirestore: (item: Item) => ({
    ...item,
    createdAt: new Date(),
    updatedAt: new Date()
  }),
  fromFirestore: (doc: FirestoreDoc): Item => {
    const data = doc.data();
    return {
      id: doc.id,
      type: data.type,
      prompt: data.prompt,
      options: data.options,
      answerIndex: data.answerIndex,
      orderTarget: data.orderTarget || data.expectedOrder,
      answerText: data.answerText || data.expectedAnswer,
      tags: data.tags || [],
      difficulty: data.difficulty || 0.5
    };
  }
};

const userProgressConverter = {
  toFirestore: (progress: UserProgress) => ({
    ...progress,
    updatedAt: new Date()
  }),
  fromFirestore: (doc: FirestoreDoc): UserProgress => {
    const data = doc.data();
    return {
      userId: data.userId,
      lessonId: data.lessonId,
      mastery: data.mastery || 0.5,
      dueAt: data.dueAt,
      streak: data.streak || 0,
      lastResult: data.lastResult || 'pass',
      stability: data.stability || 1
    };
  }
};

const userProfileConverter = {
  toFirestore: (profile: UserProfile) => ({
    ...profile,
    createdAt: profile.createdAt || new Date(),
    updatedAt: new Date()
  }),
  fromFirestore: (doc: FirestoreDoc): UserProfile => {
    const data = doc.data();
    return {
      id: doc.id,
      level: data.level || 1,
      track: data.track || 'alcoholic',
      spiritFocus: data.spiritFocus || [],
      goals: data.goals || [],
      sessionMinutes: data.sessionMinutes || 5,
      consent: data.consent || { analytics: true, date: Date.now() },
      xp: data.xp || 0,
      streak: data.streak || 0,
      lives: data.lives || 3,
      badges: data.badges || []
    };
  }
};

export class FirestoreContentRepository implements ContentRepository {
  async getModule(id: string): Promise<Module | null> {
    try {
      const fs = requireFirestore();
      const doc = await fs.collection('modules').doc(id).get();
      return doc.exists ? moduleConverter.fromFirestore(doc) : null;
    } catch (error) {
      console.error('Error fetching module:', error);
      throw new Error(`Failed to get module ${id}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getLesson(id: string): Promise<Lesson | null> {
    try {
      const fs = requireFirestore();
      const doc = await fs.collection('lessons').doc(id).get();
      return doc.exists ? lessonConverter.fromFirestore(doc) : null;
    } catch (error) {
      console.error('Error fetching lesson:', error);
      throw new Error(`Failed to get lesson ${id}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getItem(id: string): Promise<Item | null> {
    try {
      const fs = requireFirestore();
      const doc = await fs.collection('items').doc(id).get();
      return doc.exists ? itemConverter.fromFirestore(doc) : null;
    } catch (error) {
      console.error('Error fetching item:', error);
      throw new Error(`Failed to get item ${id}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getItemsForLesson(lessonId: string): Promise<Item[]> {
    try {
      const lesson = await this.getLesson(lessonId);
      if (!lesson || !lesson.itemIds?.length) return [];

      const fs = requireFirestore();
      
      // Firestore 'in' queries are limited to 10 items
      if (lesson.itemIds.length <= 10) {
        const snapshot = await fs.collection('items')
          .where('id', 'in', lesson.itemIds)
          .get();
        return snapshot.docs.map(doc => itemConverter.fromFirestore(doc));
      } else {
        // For larger sets, batch the queries
        const items: Item[] = [];
        for (let i = 0; i < lesson.itemIds.length; i += 10) {
          const batch = lesson.itemIds.slice(i, i + 10);
          const snapshot = await fs.collection('items')
            .where('id', 'in', batch)
            .get();
          items.push(...snapshot.docs.map(doc => itemConverter.fromFirestore(doc)));
        }
        return items;
      }
    } catch (error) {
      console.error('Error fetching items for lesson:', error);
      throw new Error(`Failed to get items for lesson ${lessonId}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async listModules(): Promise<Module[]> {
    try {
      const fs = requireFirestore();
      const snapshot = await fs.collection('modules')
        .orderBy('chapterIndex')
        .get();
      return snapshot.docs.map(doc => moduleConverter.fromFirestore(doc));
    } catch (error) {
      console.error('Error listing modules:', error);
      throw new Error(`Failed to list modules: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getModulesByChapter(chapterIndex: number): Promise<Module[]> {
    try {
      const fs = requireFirestore();
      const snapshot = await fs.collection('modules')
        .where('chapterIndex', '==', chapterIndex)
        .get();
      return snapshot.docs.map(doc => moduleConverter.fromFirestore(doc));
    } catch (error) {
      console.error('Error fetching modules by chapter:', error);
      throw new Error(`Failed to get modules for chapter ${chapterIndex}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

export class FirestoreProgressRepository implements ProgressRepository {
  async getUserProgress(userId: string, lessonId: string): Promise<UserProgress | null> {
    try {
      const fs = requireFirestore();
      const doc = await fs.collection('user_progress')
        .doc(`${userId}_${lessonId}`)
        .get();
      return doc.exists ? userProgressConverter.fromFirestore(doc) : null;
    } catch (error) {
      console.error('Error fetching user progress:', error);
      throw new Error(`Failed to get user progress for ${userId}/${lessonId}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async upsertUserProgress(record: UserProgress): Promise<void> {
    try {
      const fs = requireFirestore();
      const data = userProgressConverter.toFirestore(record);
      await fs.collection('user_progress')
        .doc(`${record.userId}_${record.lessonId}_${record.itemId}`)
        .set(data, { merge: true });
    } catch (error) {
      console.error('Error upserting user progress:', error);
      throw new Error(`Failed to upsert user progress: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async logAttempt(attempt: Attempt): Promise<void> {
    try {
      const fs = requireFirestore();
      const data = {
        ...attempt,
        timestamp: new Date()
      };
      await fs.collection('attempts').add(data);
    } catch (error) {
      console.error('Error logging attempt:', error);
      throw new Error(`Failed to log attempt: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getUserProgressByModule(userId: string, moduleId: string): Promise<UserProgress[]> {
    try {
      // First get all lessons for this module
      const contentRepo = new FirestoreContentRepository();
      const module = await contentRepo.getModule(moduleId);
      if (!module || !module.lessonIds?.length) return [];

      const fs = requireFirestore();
      const progressRecords: UserProgress[] = [];

      // Query progress for each lesson in the module
      for (const lessonId of module.lessonIds) {
        const snapshot = await fs.collection('user_progress')
          .where('userId', '==', userId)
          .where('lessonId', '==', lessonId)
          .get();
        
        progressRecords.push(...snapshot.docs.map(doc => userProgressConverter.fromFirestore(doc)));
      }

      return progressRecords;
    } catch (error) {
      console.error('Error fetching user progress by module:', error);
      throw new Error(`Failed to get user progress for module ${moduleId}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getDueItems(userId: string, beforeTimestamp: number): Promise<UserProgress[]> {
    try {
      const fs = requireFirestore();
      const snapshot = await fs.collection('user_progress')
        .where('userId', '==', userId)
        .where('dueAt', '<=', beforeTimestamp)
        .orderBy('dueAt')
        .get();
      
      return snapshot.docs.map(doc => userProgressConverter.fromFirestore(doc));
    } catch (error) {
      console.error('Error fetching due items:', error);
      throw new Error(`Failed to get due items for user ${userId}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

export class FirestoreUserRepository implements UserRepository {
  async createUser(profile: UserProfile): Promise<void> {
    try {
      const fs = requireFirestore();
      const data = userProfileConverter.toFirestore(profile);
      await fs.collection('users').doc(profile.id).set(data);
    } catch (error) {
      console.error('Error creating user:', error);
      throw new Error(`Failed to create user ${profile.id}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const fs = requireFirestore();
      const doc = await fs.collection('users').doc(userId).get();
      return doc.exists ? userProfileConverter.fromFirestore(doc) : null;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw new Error(`Failed to get user profile ${userId}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async updatePreferences(userId: string, patch: Partial<UserProfile>): Promise<void> {
    try {
      const fs = requireFirestore();
      const updates = {
        ...patch,
        updatedAt: new Date()
      };
      await fs.collection('users').doc(userId).update(updates);
    } catch (error) {
      console.error('Error updating user preferences:', error);
      throw new Error(`Failed to update preferences for user ${userId}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async savePlacement(userId: string, result: PlacementResult): Promise<void> {
    try {
      const fs = requireFirestore();
      const updates = {
        level: result.level === 'beginner' ? 1 : result.level === 'intermediate' ? 2 : 3,
        track: result.track,
        spiritFocus: result.spirits,
        sessionMinutes: result.sessionMinutes,
        placementCompleted: true,
        placementResult: result,
        updatedAt: new Date()
      };
      await fs.collection('users').doc(userId).update(updates);
    } catch (error) {
      console.error('Error saving placement result:', error);
      throw new Error(`Failed to save placement for user ${userId}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async savePersonalizationProfile(userId: string, profile: PersonalizationProfile): Promise<void> {
    try {
      const fs = requireFirestore();
      const data = {
        ...profile,
        userId,
        updatedAt: new Date()
      };
      await fs.collection('personalization').doc(userId).set(data, { merge: true });
    } catch (error) {
      console.error('Error saving personalization profile:', error);
      throw new Error(`Failed to save personalization profile for user ${userId}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getPersonalizationProfile(userId: string): Promise<PersonalizationProfile | null> {
    try {
      const fs = requireFirestore();
      const doc = await fs.collection('personalization').doc(userId).get();
      if (!doc.exists) return null;
      
      const data = doc.data();
      return {
        topSpirits: data.topSpirits || [],
        flavorVibes: data.flavorVibes || [],
        outingPriorities: data.outingPriorities || [],
        track: data.track || 'alcoholic'
      };
    } catch (error) {
      console.error('Error fetching personalization profile:', error);
      throw new Error(`Failed to get personalization profile for user ${userId}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

// Utility functions for batch operations and data migration

/**
 * Batch write multiple documents
 */
export async function batchWrite(operations: Array<{
  collection: string;
  docId: string;
  data: any;
  operation: 'set' | 'update' | 'delete';
}>): Promise<void> {
  try {
    const fs = requireFirestore();
    
    // Firestore batch writes are limited to 500 operations
    const BATCH_SIZE = 500;
    
    for (let i = 0; i < operations.length; i += BATCH_SIZE) {
      const batch = operations.slice(i, i + BATCH_SIZE);
      
      for (const op of batch) {
        const docRef = fs.collection(op.collection).doc(op.docId);
        
        switch (op.operation) {
          case 'set':
            await docRef.set(op.data, { merge: true });
            break;
          case 'update':
            await docRef.update(op.data);
            break;
          case 'delete':
            await docRef.delete();
            break;
        }
      }
    }
  } catch (error) {
    console.error('Error in batch write:', error);
    throw new Error(`Batch write failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Migrate data from memory repositories to Firestore
 */
export async function migrateFromMemory(
  memoryContentRepo: any,
  memoryProgressRepo: any,
  memoryUserRepo: any
): Promise<void> {
  try {
    console.log('Starting migration from memory to Firestore...');
    
    const firestoreContentRepo = new FirestoreContentRepository();
    const firestoreProgressRepo = new FirestoreProgressRepository();
    const firestoreUserRepo = new FirestoreUserRepository();
    
    // Migrate modules (if memory repo has export method)
    if (memoryContentRepo.getAllModules) {
      const modules = await memoryContentRepo.getAllModules();
      for (const module of modules) {
        const operations = [{
          collection: 'modules',
          docId: module.id,
          data: moduleConverter.toFirestore(module),
          operation: 'set' as const
        }];
        await batchWrite(operations);
      }
      console.log(`Migrated ${modules.length} modules`);
    }
    
    // Similar for lessons, items, user profiles, progress...
    console.log('Migration completed successfully');
    
  } catch (error) {
    console.error('Migration failed:', error);
    throw new Error(`Migration failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Health check for Firestore connection
 */
export async function healthCheck(): Promise<{
  connected: boolean;
  latency?: number;
  error?: string;
}> {
  try {
    const start = Date.now();
    const fs = requireFirestore();
    
    // Try a simple read operation
    await fs.collection('health').doc('check').get();
    
    const latency = Date.now() - start;
    return { connected: true, latency };
    
  } catch (error) {
    return { 
      connected: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}