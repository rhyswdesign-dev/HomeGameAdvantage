/**
 * Run Recipes Table Migration
 * Creates the recipes table in Supabase
 * Run: npx tsx scripts/run-recipes-migration.ts
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

const migrationSQL = `
-- Create recipes table
CREATE TABLE IF NOT EXISTS recipes (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  difficulty TEXT NOT NULL,
  prep_time INTEGER NOT NULL,
  spirits TEXT[] DEFAULT '{}',
  glass_type TEXT,
  garnish TEXT,
  ingredients JSONB NOT NULL,
  instructions TEXT[] NOT NULL,
  tips TEXT[] DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  image_url TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_recipes_category ON recipes(category);
CREATE INDEX IF NOT EXISTS idx_recipes_difficulty ON recipes(difficulty);
CREATE INDEX IF NOT EXISTS idx_recipes_tags ON recipes USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_recipes_spirits ON recipes USING GIN(spirits);

-- Enable Row Level Security
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public read access to recipes" ON recipes;
DROP POLICY IF EXISTS "Allow authenticated users to manage recipes" ON recipes;

-- Create policy to allow public read access
CREATE POLICY "Allow public read access to recipes"
  ON recipes
  FOR SELECT
  TO public
  USING (true);

-- Create policy to allow authenticated users to insert/update
CREATE POLICY "Allow authenticated users to manage recipes"
  ON recipes
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);
`;

async function runMigration() {
  console.log('🚀 Running recipes table migration...\n');

  try {
    const { data, error } = await supabase.rpc('exec_sql', {
      sql: migrationSQL
    });

    if (error) {
      console.error('❌ Migration failed:', error.message);
      console.log('\n📋 Manual steps required:');
      console.log('1. Go to your Supabase dashboard');
      console.log('2. Navigate to SQL Editor');
      console.log('3. Copy and run the SQL from: supabase/migrations/002_create_recipes_table.sql');
      console.log('\nOr use Supabase CLI:');
      console.log('  supabase db push');
      process.exit(1);
    }

    console.log('✅ Migration completed successfully!');
    console.log('📚 Recipes table created');
    console.log('\nNext step: Run npm run recipes:upload');

  } catch (err: any) {
    console.error('❌ Error running migration:', err.message);
    console.log('\n📋 Manual migration required:');
    console.log('Please run the SQL from supabase/migrations/002_create_recipes_table.sql manually in Supabase dashboard');
    process.exit(1);
  }
}

runMigration();
