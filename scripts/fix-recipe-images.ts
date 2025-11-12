/**
 * Fix Recipe Image URLs
 * Update all recipes to have proper image URLs instead of just names
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Cocktail-specific images from Unsplash
const cocktailImages: Record<string, string> = {
  'margarita': 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400&h=300&fit=crop',
  'gin-tonic': 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=400&h=300&fit=crop',
  'old-fashioned': 'https://images.unsplash.com/photo-1536935338788-846bb9981813?w=400&h=300&fit=crop',
  'mojito': 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=400&h=300&fit=crop',
  'martini': 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=400&h=300&fit=crop',
  'negroni': 'https://images.unsplash.com/photo-1574096079513-d8259312b785?w=400&h=300&fit=crop',
  'whiskey-sour': 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?w=400&h=300&fit=crop',
  'moscow-mule': 'https://images.unsplash.com/photo-1571731956672-f2b94d7dd0cb?w=400&h=300&fit=crop',
  'espresso-martini': 'https://images.unsplash.com/photo-1542849187-5ec6ea5e6a27?w=400&h=300&fit=crop',
  'mai-tai': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
};

// Default fallback image for cocktails
const defaultCocktailImage = 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop';

async function fixRecipeImages() {
  console.log('🔧 Fixing recipe image URLs...\n');

  // Get all recipes
  const { data: recipes, error: fetchError } = await supabase
    .from('recipes')
    .select('id, title, image_url');

  if (fetchError) {
    console.error('❌ Error fetching recipes:', fetchError);
    return;
  }

  console.log(`Found ${recipes?.length} recipes to update\n`);

  let successCount = 0;
  let errorCount = 0;

  for (const recipe of recipes || []) {
    const currentImageUrl = recipe.image_url;

    // Skip if already a valid URL
    if (currentImageUrl && (currentImageUrl.startsWith('http://') || currentImageUrl.startsWith('https://'))) {
      console.log(`⏭️  Skipping ${recipe.title} - already has valid URL`);
      continue;
    }

    // Get the appropriate image URL
    const newImageUrl = cocktailImages[currentImageUrl] || cocktailImages[recipe.id] || defaultCocktailImage;

    // Update the recipe
    const { error: updateError } = await supabase
      .from('recipes')
      .update({ image_url: newImageUrl })
      .eq('id', recipe.id);

    if (updateError) {
      console.error(`❌ Failed to update ${recipe.title}:`, updateError.message);
      errorCount++;
    } else {
      console.log(`✅ Updated ${recipe.title}`);
      console.log(`   Old: ${currentImageUrl}`);
      console.log(`   New: ${newImageUrl}\n`);
      successCount++;
    }
  }

  console.log('\n📊 Update Summary:');
  console.log(`✅ Updated: ${successCount}`);
  console.log(`❌ Failed: ${errorCount}`);
  console.log(`📚 Total: ${recipes?.length}`);

  if (errorCount === 0) {
    console.log('\n🎉 All recipe images fixed!');
  } else {
    console.log('\n⚠️  Some updates failed. Check errors above.');
  }
}

fixRecipeImages();
