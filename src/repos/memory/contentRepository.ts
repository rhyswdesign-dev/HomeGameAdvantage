/**
 * In-Memory Content Repository
 * Default implementation for development and testing
 */

import { ContentRepository } from '../interfaces';
import { Module, Lesson, Item, ExerciseType } from '../../types/domain';
import curriculumData from '../../../curriculum-data.json';

export class MemoryContentRepository implements ContentRepository {
  private modules: Map<string, Module> = new Map();
  private lessons: Map<string, Lesson> = new Map();
  private items: Map<string, Item> = new Map();

  constructor() {
    this.initializeData();
  }

  private initializeData(): void {
    // Load data from curriculum JSON
    console.log('Initializing content repository with curriculum data:', curriculumData);
    curriculumData.modules.forEach(module => {
      const moduleData: Module = {
        id: module.id,
        title: module.title,
        chapterIndex: module.chapterIndex,
        description: module.title, // Using title as description for now
        prerequisiteIds: [],
        estimatedMinutes: module.estimatedMinutes,
        tags: module.tags
      };
      this.modules.set(module.id, moduleData);
    });

    curriculumData.lessons.forEach(lesson => {
      const lessonData: Lesson = {
        id: lesson.id,
        moduleId: lesson.moduleId,
        title: lesson.title,
        itemIds: lesson.itemIds,
        estimatedMinutes: lesson.estimatedMinutes,
        prerequisiteIds: lesson.prereqs || [],
        types: lesson.types as ExerciseType[]
      };
      this.lessons.set(lesson.id, lessonData);
    });

    curriculumData.items.forEach(item => {
      const itemData: Item = {
        id: item.id,
        type: item.type as ExerciseType,
        prompt: item.prompt,
        options: item.options || [],
        answerIndex: item.answerIndex,
        orderTarget: item.orderTarget,
        answerText: item.answerText,
        acceptableAnswers: item.acceptableAnswers,
        correct: item.correct,
        pairs: item.pairs,
        roleplay: item.roleplay,
        tags: item.tags,
        conceptId: item.conceptId,
        difficulty: item.difficulty,
        xpAward: item.xpAward,
        reviewWeight: item.reviewWeight
      };
      this.items.set(item.id, itemData);
    });
  }

  async getModule(id: string): Promise<Module | null> {
    return this.modules.get(id) || null;
  }

  async getLesson(id: string): Promise<Lesson | null> {
    console.log('Getting lesson:', id, 'Available lessons:', Array.from(this.lessons.keys()));
    return this.lessons.get(id) || null;
  }

  async getItem(id: string): Promise<Item | null> {
    return this.items.get(id) || null;
  }

  async getItemsForLesson(lessonId: string): Promise<Item[]> {
    const lesson = await this.getLesson(lessonId);
    if (!lesson) {
      console.log('No lesson found for:', lessonId);
      return [];
    }

    console.log('Lesson found:', lesson, 'Looking for items:', lesson.itemIds);
    console.log('Available items:', Array.from(this.items.keys()));
    
    const items = lesson.itemIds
      .map(id => {
        const item = this.items.get(id);
        console.log('Looking for item:', id, 'Found:', !!item);
        return item;
      })
      .filter((item): item is Item => item !== undefined);

    console.log('Final items for lesson:', items);
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