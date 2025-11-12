/**
 * List All Recipes in Supabase
 * Run: npx tsx scripts/list-all-recipes.ts
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function listAllRecipes() {
  console.log('📚 Fetching all recipes from Supabase...\n');

  try {
    // Get all recipes
    const { data, error } = await supabase
      .from('recipes')
      .select('id, title, category, difficulty, ingredients, description')
      .order('title', { ascending: true });

    if (error) {
      console.error('❌ Error fetching recipes:', error.message);
      process.exit(1);
    }

    if (!data || data.length === 0) {
      console.log('⚠️ No recipes found in database');
      process.exit(0);
    }

    console.log(`📊 Total recipes: ${data.length}\n`);

    // Categorize recipes
    const categorized: Record<string, any[]> = {};
    const incomplete: any[] = [];

    data.forEach(recipe => {
      const cat = recipe.category || 'uncategorized';
      if (!categorized[cat]) {
        categorized[cat] = [];
      }
      categorized[cat].push(recipe);

      // Check if recipe is incomplete
      const hasIngredients = recipe.ingredients &&
        (typeof recipe.ingredients === 'string'
          ? JSON.parse(recipe.ingredients).length > 0
          : recipe.ingredients.length > 0);

      const hasDescription = recipe.description && recipe.description.trim().length > 0;

      if (!hasIngredients || !hasDescription) {
        incomplete.push(recipe);
      }
    });

    // Print by category
    console.log('📋 Recipes by Category:\n');
    Object.entries(categorized).forEach(([category, recipes]) => {
      console.log(`\n${category.toUpperCase()} (${recipes.length}):`);
      recipes.forEach(r => {
        console.log(`  - ${r.title} (${r.difficulty})`);
      });
    });

    // Print incomplete recipes
    if (incomplete.length > 0) {
      console.log('\n\n⚠️  Incomplete Recipes:\n');
      incomplete.forEach(r => {
        const issues: string[] = [];
        const hasIngredients = r.ingredients &&
          (typeof r.ingredients === 'string'
            ? JSON.parse(r.ingredients).length > 0
            : r.ingredients.length > 0);

        if (!hasIngredients) issues.push('missing ingredients');
        if (!r.description || r.description.trim().length === 0) issues.push('missing description');

        console.log(`  - ${r.title}: ${issues.join(', ')}`);
      });
    } else {
      console.log('\n\n✅ All recipes are complete!');
    }

  } catch (err: any) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

listAllRecipes();
