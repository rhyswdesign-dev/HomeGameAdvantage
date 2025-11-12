/**
 * Upload Missing Recipes to Supabase
 * Run: npx tsx scripts/upload-missing-recipes.ts
 */

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
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

async function uploadMissingRecipes() {
  console.log('📚 Starting missing recipes upload...\n');

  // Read recipes data
  const recipesPath = path.join(process.cwd(), 'missing-recipes-data.json');
  const recipesData = JSON.parse(fs.readFileSync(recipesPath, 'utf-8'));

  console.log(`Found ${recipesData.recipes.length} missing recipes to upload\n`);

  // Map difficulty values to match database constraints
  const difficultyMap: Record<string, string> = {
    'easy': 'beginner',
    'medium': 'intermediate',
    'hard': 'advanced'
  };

  // Transform recipes for Supabase (matching existing table schema)
  const recipesToUpload = recipesData.recipes.map((recipe: any) => ({
    id: recipe.id,
    title: recipe.name,
    category: recipe.category,
    difficulty: difficultyMap[recipe.difficulty] || recipe.difficulty,
    preparation_time: recipe.prepTime,
    spirits_used: recipe.spirits,
    base_spirit: recipe.spirits?.[0] || null,
    glassware: recipe.glass,
    garnish: recipe.garnish,
    ingredients: recipe.ingredients,
    instructions: recipe.instructions,
    tags: recipe.tags,
    image_url: recipe.image,
    description: recipe.ingredients.map((i: any) => `${i.amount} ${i.item}`).join(', '),
    recipe_type: 'cocktail',
    is_public: true,
    created_by: 'system'
  }));

  // Upload recipes one by one to see progress
  let successCount = 0;
  let errorCount = 0;

  for (const recipe of recipesToUpload) {
    try {
      const { error } = await supabase
        .from('recipes')
        .upsert(recipe, { onConflict: 'id' });

      if (error) {
        console.error(`❌ Failed to upload ${recipe.title}:`, error.message);
        errorCount++;
      } else {
        console.log(`✅ Uploaded: ${recipe.title}`);
        successCount++;
      }
    } catch (err) {
      console.error(`❌ Error uploading ${recipe.title}:`, err);
      errorCount++;
    }
  }

  console.log('\n📊 Upload Summary:');
  console.log(`✅ Success: ${successCount}`);
  console.log(`❌ Failed: ${errorCount}`);
  console.log(`📚 Total: ${recipesToUpload.length}`);

  if (errorCount === 0) {
    console.log('\n🎉 All missing recipes uploaded successfully!');
    console.log(`📚 Database now has ${100 + successCount} total recipes`);
  } else {
    console.log('\n⚠️ Some recipes failed to upload. Check errors above.');
  }
}

uploadMissingRecipes().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
