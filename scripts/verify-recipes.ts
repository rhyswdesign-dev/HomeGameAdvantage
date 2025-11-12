/**
 * Verify Recipes in Supabase
 * Run: npx tsx scripts/verify-recipes.ts
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

async function verifyRecipes() {
  console.log('🔍 Verifying recipes in Supabase...\n');

  try {
    // Get total count
    const { count, error: countError } = await supabase
      .from('recipes')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      console.error('❌ Error counting recipes:', countError.message);
      process.exit(1);
    }

    console.log(`📚 Total recipes in database: ${count}\n`);

    // Get sample recipes
    const { data, error } = await supabase
      .from('recipes')
      .select('id, title, category, difficulty, preparation_time')
      .order('title', { ascending: true })
      .limit(10);

    if (error) {
      console.error('❌ Error fetching recipes:', error.message);
      process.exit(1);
    }

    console.log('📋 Sample recipes (first 10):');
    data?.forEach((recipe, index) => {
      console.log(`${index + 1}. ${recipe.title} (${recipe.category}, ${recipe.difficulty}, ${recipe.preparation_time} min)`);
    });

    // Group by category
    const { data: categories, error: catError } = await supabase
      .from('recipes')
      .select('category');

    if (!catError && categories) {
      const categoryCounts = categories.reduce((acc: any, r: any) => {
        acc[r.category] = (acc[r.category] || 0) + 1;
        return acc;
      }, {});

      console.log('\n📊 Recipes by category:');
      Object.entries(categoryCounts).forEach(([cat, count]) => {
        console.log(`  ${cat}: ${count}`);
      });
    }

    // Group by difficulty
    const { data: difficulties, error: diffError } = await supabase
      .from('recipes')
      .select('difficulty');

    if (!diffError && difficulties) {
      const difficultyCounts = difficulties.reduce((acc: any, r: any) => {
        acc[r.difficulty] = (acc[r.difficulty] || 0) + 1;
        return acc;
      }, {});

      console.log('\n📊 Recipes by difficulty:');
      Object.entries(difficultyCounts).forEach(([diff, count]) => {
        console.log(`  ${diff}: ${count}`);
      });
    }

    console.log('\n✅ Verification complete!');
    console.log('🎉 All recipes are available in Supabase');

  } catch (err: any) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

verifyRecipes();
