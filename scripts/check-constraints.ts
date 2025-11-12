/**
 * Check Table Constraints
 * Run: npx tsx scripts/check-constraints.ts
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

async function checkConstraints() {
  console.log('🔍 Checking constraints...\n');

  // Check existing recipes to understand the schema better
  const { data, error } = await supabase
    .from('recipes')
    .select('*')
    .limit(5);

  if (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }

  if (data && data.length > 0) {
    console.log('📋 Sample recipe from database:');
    console.log(JSON.stringify(data[0], null, 2));
    console.log('\n✅ Check the difficulty field format above');
  } else {
    console.log('⚠️ No recipes in database yet');
  }

  // Check what we're trying to upload
  const recipesPath = path.join(process.cwd(), 'recipes-data.json');
  const recipesData = JSON.parse(fs.readFileSync(recipesPath, 'utf-8'));

  console.log('\n📝 Sample recipe from JSON:');
  console.log(JSON.stringify(recipesData.recipes[0], null, 2));

  console.log('\n🔍 Difficulty values in JSON:');
  const difficulties = recipesData.recipes.map((r: any) => r.difficulty);
  console.log('Unique difficulties:', [...new Set(difficulties)].join(', '));
}

checkConstraints();
