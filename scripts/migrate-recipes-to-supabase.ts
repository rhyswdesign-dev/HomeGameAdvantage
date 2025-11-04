/**
 * Migrate Recipes from local data to Supabase
 * Run with: npx tsx scripts/migrate-recipes-to-supabase.ts
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase configuration');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Import cocktails data
const cocktailsData = require('../src/data/cocktails.ts');

// Extract all cocktails from the file
const getAllCocktails = (): any[] => {
  // Use ALL_COCKTAILS if available
  if (cocktailsData.ALL_COCKTAILS) {
    return cocktailsData.ALL_COCKTAILS;
  }

  // Fallback: collect from individual arrays
  const cocktails: any[] = [];
  if (cocktailsData.ESSENTIAL_SYRUPS) cocktails.push(...cocktailsData.ESSENTIAL_SYRUPS);
  if (cocktailsData.CLASSIC_COCKTAILS) cocktails.push(...cocktailsData.CLASSIC_COCKTAILS);
  if (cocktailsData.NON_ALCOHOLIC_COCKTAILS) cocktails.push(...cocktailsData.NON_ALCOHOLIC_COCKTAILS);
  if (cocktailsData.MODERN_COCKTAILS) cocktails.push(...cocktailsData.MODERN_COCKTAILS);
  if (cocktailsData.ADVANCED_COCKTAILS) cocktails.push(...cocktailsData.ADVANCED_COCKTAILS);
  if (cocktailsData.VODKA_COCKTAILS) cocktails.push(...cocktailsData.VODKA_COCKTAILS);
  if (cocktailsData.GIN_COCKTAILS) cocktails.push(...cocktailsData.GIN_COCKTAILS);
  if (cocktailsData.RUM_COCKTAILS) cocktails.push(...cocktailsData.RUM_COCKTAILS);
  if (cocktailsData.WHISKEY_COCKTAILS) cocktails.push(...cocktailsData.WHISKEY_COCKTAILS);
  if (cocktailsData.TEQUILA_COCKTAILS) cocktails.push(...cocktailsData.TEQUILA_COCKTAILS);

  return cocktails;
};

// Convert local recipe format to Supabase format
const convertRecipe = (localRecipe: any): any => {
  // Parse ingredients to structured format
  const ingredients = localRecipe.ingredients.map((ing: any) => {
    if (typeof ing === 'string') {
      return { name: ing, amount: '', unit: '', notes: '', category: 'other' };
    }
    return {
      name: ing.name || '',
      amount: ing.amount || '',
      unit: ing.unit || '',
      notes: ing.note || ing.notes || '',
      category: ing.category || 'other'
    };
  });

  // Determine base spirit from category or name
  let baseSpirit = null;
  const categoryLower = (localRecipe.category || '').toLowerCase();
  const nameLower = (localRecipe.name || '').toLowerCase();

  if (categoryLower.includes('vodka') || nameLower.includes('vodka')) baseSpirit = 'vodka';
  else if (categoryLower.includes('gin') || nameLower.includes('gin')) baseSpirit = 'gin';
  else if (categoryLower.includes('rum') || nameLower.includes('rum')) baseSpirit = 'rum';
  else if (categoryLower.includes('whiskey') || nameLower.includes('whiskey')) baseSpirit = 'whiskey';
  else if (categoryLower.includes('tequila') || nameLower.includes('tequila')) baseSpirit = 'tequila';

  // Determine difficulty
  let difficulty = 'beginner';
  if (localRecipe.difficulty) {
    const diffLower = localRecipe.difficulty.toLowerCase();
    if (diffLower.includes('easy') || diffLower.includes('beginner')) difficulty = 'beginner';
    else if (diffLower.includes('medium') || diffLower.includes('intermediate')) difficulty = 'intermediate';
    else if (diffLower.includes('hard') || diffLower.includes('advanced')) difficulty = 'advanced';
    else if (diffLower.includes('expert')) difficulty = 'expert';
  }

  // Parse time to minutes
  let preparationTime = 5;
  if (localRecipe.time) {
    const match = localRecipe.time.match(/(\d+)/);
    if (match) preparationTime = parseInt(match[1]);
  }

  // Determine ABV (rough estimate)
  let abv = 0;
  if (categoryLower.includes('syrup') || categoryLower.includes('non-alcoholic')) {
    abv = 0;
  } else if (categoryLower.includes('cocktail')) {
    abv = 15; // Average cocktail ABV
  }

  return {
    id: localRecipe.id,
    title: localRecipe.title || localRecipe.name,
    description: localRecipe.description || localRecipe.subtitle || '',
    ingredients: JSON.stringify(ingredients),
    instructions: localRecipe.instructions || [],
    garnish: localRecipe.garnish || null,
    glassware: localRecipe.glassware || null,
    category: localRecipe.category || 'classic',
    difficulty,
    recipe_type: categoryLower.includes('non-alcoholic') || categoryLower.includes('syrup') ? 'mocktail' : 'cocktail',
    base_spirit: baseSpirit,
    spirits_used: baseSpirit ? [baseSpirit] : [],
    flavor_profiles: localRecipe.flavorProfiles || [],
    abv,
    complexity: localRecipe.complexity || 0.5,
    preparation_time: preparationTime,
    servings: 1,
    tools: localRecipe.tools || [],
    image_url: localRecipe.image,
    source_url: null,
    video_url: null,
    tags: localRecipe.tags || [],
    occasion: [],
    season: [],
    time_of_day: [],
    created_by: null,
    is_public: true,
    likes: 0,
    saves: 0,
    calories: null,
    sugar: null,
    carbs: null
  };
};

async function migrateRecipes() {
  console.log('🚀 Migrating recipes to Supabase...\n');

  try {
    // Get all cocktails
    const allCocktails = getAllCocktails();
    console.log(`📚 Found ${allCocktails.length} recipes to migrate\n`);

    // Clear existing recipes (optional)
    console.log('🗑️  Clearing existing recipes...');
    const { error: deleteError } = await supabase
      .from('recipes')
      .delete()
      .neq('id', 'none'); // Delete all

    if (deleteError) {
      console.log('⚠️  Could not clear existing recipes:', deleteError.message);
    } else {
      console.log('✅ Cleared existing recipes\n');
    }

    // Convert recipes
    console.log('🔄 Converting recipe format...');
    const convertedRecipes = allCocktails.map(convertRecipe);
    console.log(`✅ Converted ${convertedRecipes.length} recipes\n`);

    // Insert in batches
    const batchSize = 50;
    const batches = Math.ceil(convertedRecipes.length / batchSize);

    console.log(`📤 Inserting ${convertedRecipes.length} recipes in ${batches} batches...\n`);

    for (let i = 0; i < batches; i++) {
      const start = i * batchSize;
      const end = Math.min(start + batchSize, convertedRecipes.length);
      const batch = convertedRecipes.slice(start, end);

      // Use upsert to handle duplicates
      const { error } = await supabase
        .from('recipes')
        .upsert(batch, { onConflict: 'id' });

      if (error) {
        console.log(`❌ Error inserting batch ${i + 1}:`, error.message);
      } else {
        console.log(`  ✅ Inserted batch ${i + 1}/${batches} (${batch.length} recipes)`);
      }
    }

    // Verify
    console.log('\n🔍 Verifying migration...\n');
    const { count } = await supabase
      .from('recipes')
      .select('*', { count: 'exact', head: true });

    console.log('✅ Migration complete!\n');
    console.log('📊 Summary:');
    console.log(`   - Recipes in database: ${count}`);
    console.log(`   - Source recipes: ${allCocktails.length}\n`);

  } catch (error: any) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  }
}

migrateRecipes();
