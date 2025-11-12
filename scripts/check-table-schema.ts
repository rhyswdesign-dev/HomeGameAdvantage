/**
 * Check Recipes Table Schema
 * Run: npx tsx scripts/check-table-schema.ts
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

async function checkSchema() {
  console.log('🔍 Checking recipes table schema...\n');

  try {
    // Try to select all columns to see what exists
    const { data, error } = await supabase
      .from('recipes')
      .select('*')
      .limit(1);

    if (error) {
      console.error('❌ Error querying table:', error.message);
      console.log('\nThe recipes table exists but has an incompatible schema.');
      console.log('You need to run the migration SQL to update it.\n');
      process.exit(1);
    }

    console.log('✅ Successfully queried recipes table');
    console.log('📋 Current table structure:');

    if (data && data.length > 0) {
      const columns = Object.keys(data[0]);
      console.log('\nColumns found:', columns.join(', '));
      console.log('\n✅ Table has data. Checking for required columns...');
    } else {
      console.log('\n⚠️ Table exists but is empty');
      console.log('Cannot determine exact columns without data.');
    }

    // Check what we need
    const requiredColumns = [
      'id', 'name', 'category', 'difficulty', 'prep_time',
      'spirits', 'glass_type', 'garnish', 'ingredients',
      'instructions', 'tips', 'tags', 'image_url', 'description'
    ];

    console.log('\n📝 Required columns for upload:');
    console.log(requiredColumns.join(', '));

  } catch (err: any) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

checkSchema();
