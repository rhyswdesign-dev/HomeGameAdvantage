/**
 * Recipes Repository - Supabase
 * Fetches recipes from Supabase instead of local data
 */

import { supabase } from '../../lib/supabase';
import { Recipe, RecipeFilters } from '../../types/recipe';

export class RecipesRepository {
  /**
   * Get all recipes
   */
  static async getAllRecipes(): Promise<Recipe[]> {
    const { data, error } = await supabase
      .from('recipes')
      .select('*')
      .eq('is_public', true)
      .order('title');

    if (error) {
      console.error('Error fetching recipes:', error);
      return [];
    }

    return (data || []).map(this.mapFromDatabase);
  }

  /**
   * Get recipe by ID
   */
  static async getRecipeById(id: string): Promise<Recipe | null> {
    const { data, error } = await supabase
      .from('recipes')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching recipe:', error);
      return null;
    }

    return data ? this.mapFromDatabase(data) : null;
  }

  /**
   * Get recipes by category
   */
  static async getRecipesByCategory(category: string): Promise<Recipe[]> {
    const { data, error } = await supabase
      .from('recipes')
      .select('*')
      .eq('category', category)
      .eq('is_public', true)
      .order('title');

    if (error) {
      console.error('Error fetching recipes by category:', error);
      return [];
    }

    return (data || []).map(this.mapFromDatabase);
  }

  /**
   * Get recipes by base spirit
   */
  static async getRecipesBySpirit(spirit: string): Promise<Recipe[]> {
    const { data, error } = await supabase
      .from('recipes')
      .select('*')
      .eq('base_spirit', spirit)
      .eq('is_public', true)
      .order('title');

    if (error) {
      console.error('Error fetching recipes by spirit:', error);
      return [];
    }

    return (data || []).map(this.mapFromDatabase);
  }

  /**
   * Search recipes
   */
  static async searchRecipes(query: string): Promise<Recipe[]> {
    const { data, error } = await supabase
      .from('recipes')
      .select('*')
      .eq('is_public', true)
      .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
      .order('title')
      .limit(50);

    if (error) {
      console.error('Error searching recipes:', error);
      return [];
    }

    return (data || []).map(this.mapFromDatabase);
  }

  /**
   * Filter recipes
   */
  static async filterRecipes(filters: RecipeFilters): Promise<Recipe[]> {
    let query = supabase
      .from('recipes')
      .select('*')
      .eq('is_public', true);

    // Apply filters
    if (filters.spirits && filters.spirits.length > 0) {
      query = query.in('base_spirit', filters.spirits);
    }

    if (filters.difficulty && filters.difficulty.length > 0) {
      query = query.in('difficulty', filters.difficulty);
    }

    if (filters.category && filters.category.length > 0) {
      query = query.in('category', filters.category);
    }

    if (filters.abvRange) {
      query = query
        .gte('abv', filters.abvRange.min)
        .lte('abv', filters.abvRange.max);
    }

    if (filters.preparationTimeMax) {
      query = query.lte('preparation_time', filters.preparationTimeMax);
    }

    const { data, error } = await query.order('title').limit(100);

    if (error) {
      console.error('Error filtering recipes:', error);
      return [];
    }

    return (data || []).map(this.mapFromDatabase);
  }

  /**
   * Map database record to Recipe type
   */
  private static mapFromDatabase(data: any): Recipe {
    return {
      id: data.id,
      title: data.title,
      description: data.description || '',
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),

      // Parse ingredients from JSON
      ingredients: typeof data.ingredients === 'string'
        ? JSON.parse(data.ingredients)
        : data.ingredients,
      instructions: data.instructions || [],
      garnish: data.garnish,
      glassware: data.glassware,

      category: data.category,
      difficulty: data.difficulty,
      recipeType: data.recipe_type,

      baseSpirit: data.base_spirit,
      spiritsUsed: data.spirits_used || [],
      flavorProfiles: data.flavor_profiles || [],
      abv: parseFloat(data.abv) || 0,
      complexity: parseFloat(data.complexity) || 0.5,

      preparationTime: data.preparation_time,
      servings: data.servings || 1,
      tools: data.tools || [],

      imageUrl: data.image_url,
      sourceUrl: data.source_url,
      videoUrl: data.video_url,

      tags: data.tags || [],
      occasion: data.occasion || [],
      season: data.season || [],
      timeOfDay: data.time_of_day || [],

      createdBy: data.created_by,
      isPublic: data.is_public,
      likes: data.likes || 0,
      saves: data.saves || 0,

      nutrition: {
        calories: data.calories,
        sugar: data.sugar ? parseFloat(data.sugar) : undefined,
        carbs: data.carbs ? parseFloat(data.carbs) : undefined,
      }
    };
  }
}
