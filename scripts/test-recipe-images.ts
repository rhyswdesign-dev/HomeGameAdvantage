/**
 * Test Recipe Images
 * Check what image URLs are in the database
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

async function testRecipeImages() {
  console.log('🔍 Checking recipe images in database...\n');

  const { data, error } = await supabase
    .from('recipes')
    .select('id, title, image_url')
    .limit(10);

  if (error) {
    console.error('❌ Error:', error);
    return;
  }

  console.log(`Found ${data?.length} recipes:\n`);
  data?.forEach(recipe => {
    console.log(`📚 ${recipe.title}`);
    console.log(`   ID: ${recipe.id}`);
    console.log(`   Image URL: ${recipe.image_url || '(none)'}`);
    console.log('');
  });
}

testRecipeImages();
