/**
 * Create Recipes Table via Supabase API
 * Run: npx tsx scripts/create-recipes-table.ts
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

async function createTable() {
  console.log('🚀 Creating recipes table via REST API...\n');

  // Read the migration SQL
  const sqlPath = path.join(process.cwd(), 'supabase/migrations/002_create_recipes_table.sql');
  const sql = fs.readFileSync(sqlPath, 'utf-8');

  try {
    // Try to query the recipes table to see if it already exists
    const { data, error } = await supabase
      .from('recipes')
      .select('id')
      .limit(1);

    if (!error) {
      console.log('✅ Recipes table already exists!');
      console.log('📚 Ready to upload recipes');
      console.log('\nNext step: Run npm run recipes:upload');
      process.exit(0);
    }

    // If we get here, table doesn't exist
    console.log('⚠️ Table does not exist. Manual SQL execution required.\n');
    console.log('📋 Please follow these steps:');
    console.log('1. Go to your Supabase dashboard');
    console.log(`2. Navigate to: ${supabaseUrl.replace('/rest/v1', '')}`);
    console.log('3. Click on "SQL Editor" in the left sidebar');
    console.log('4. Click "New Query"');
    console.log('5. Copy and paste the SQL below:\n');
    console.log('─'.repeat(80));
    console.log(sql);
    console.log('─'.repeat(80));
    console.log('\n6. Click "Run" to execute the SQL');
    console.log('7. After successful execution, run: npm run recipes:upload\n');

  } catch (err: any) {
    console.error('❌ Error checking table:', err.message);
    console.log('\n📋 Manual migration required:');
    console.log('Please run the SQL from supabase/migrations/002_create_recipes_table.sql manually in Supabase dashboard');
    process.exit(1);
  }
}

createTable();
