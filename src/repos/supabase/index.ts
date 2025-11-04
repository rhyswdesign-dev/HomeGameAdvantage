/**
 * Supabase Repositories
 * Central export for all Supabase data repositories
 */

export { RecipesRepository } from './recipesRepo';
export { VaultRepository } from './vaultRepo';
export { CurriculumRepository } from './curriculumRepo';

// Re-export types
export type { Module, Lesson, Item } from './curriculumRepo';
