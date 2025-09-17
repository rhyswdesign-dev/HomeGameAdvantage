/**
 * In-Memory Content Repository
 * Default implementation for development and testing
 */

import { ContentRepository } from '../interfaces';
import { Module, Lesson, Item } from '../../types/domain';
import { seedModules, seedLessons, seedItems } from './seedData';

export class MemoryContentRepository implements ContentRepository {
  private modules: Map<string, Module> = new Map();
  private lessons: Map<string, Lesson> = new Map();
  private items: Map<string, Item> = new Map();

  constructor() {
    this.initializeData();
  }

  private initializeData(): void {
    // Load seed data
    seedModules.forEach(module => this.modules.set(module.id, module));
    seedLessons.forEach(lesson => this.lessons.set(lesson.id, lesson));
    seedItems.forEach(item => this.items.set(item.id, item));
  }

  async getModule(id: string): Promise<Module | null> {
    return this.modules.get(id) || null;
  }

  async getLesson(id: string): Promise<Lesson | null> {
    return this.lessons.get(id) || null;
  }

  async getItem(id: string): Promise<Item | null> {
    return this.items.get(id) || null;
  }

  async getItemsForLesson(lessonId: string): Promise<Item[]> {
    const lesson = await this.getLesson(lessonId);
    if (!lesson) return [];

    const items = lesson.itemIds
      .map(id => this.items.get(id))
      .filter((item): item is Item => item !== undefined);

    return items;
  }

  async listModules(): Promise<Module[]> {
    return Array.from(this.modules.values()).sort((a, b) => a.chapterIndex - b.chapterIndex);
  }

  async getModulesByChapter(chapterIndex: number): Promise<Module[]> {
    return Array.from(this.modules.values())
      .filter(module => module.chapterIndex === chapterIndex)
      .sort((a, b) => a.title.localeCompare(b.title));
  }
}