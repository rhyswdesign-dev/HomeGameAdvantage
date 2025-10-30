/**
 * Run Supabase Migrations
 * Run with: npx tsx scripts/run-migrations.ts
 */

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase configuration');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function runMigrations() {
  console.log('🚀 Running Supabase migrations...\n');

  try {
    // Read migration file
    const migrationPath = path.join(__dirname, '../supabase/migrations/001_create_curriculum_tables.sql');
    const sql = fs.readFileSync(migrationPath, 'utf-8');

    console.log('📄 Migration file loaded');
    console.log(`   Path: ${migrationPath}`);
    console.log(`   Size: ${sql.length} characters\n`);

    // Note: Running raw SQL requires service role key or Supabase CLI
    // For now, let's use the Supabase dashboard or CLI to run migrations
    console.log('⚠️  To run migrations, you have 2 options:\n');

    console.log('Option 1: Using Supabase Dashboard (Recommended)');
    console.log('   1. Go to: https://supabase.com/dashboard/project/srbvekhupzoajedpyepr/sql/new');
    console.log('   2. Copy the SQL from: supabase/migrations/001_create_curriculum_tables.sql');
    console.log('   3. Paste and run it in the SQL Editor\n');

    console.log('Option 2: Using Supabase CLI');
    console.log('   1. Install: npm install -g supabase');
    console.log('   2. Link: supabase link --project-ref srbvekhupzoajedpyepr');
    console.log('   3. Run: supabase db push\n');

    console.log('📋 SQL Preview (first 500 chars):');
    console.log('─'.repeat(60));
    console.log(sql.substring(0, 500) + '...');
    console.log('─'.repeat(60));

    // Test if we can create a simple table (will fail with anon key, which is expected)
    console.log('\n🔐 Note: Anonymous key cannot run DDL statements.');
    console.log('   Use the dashboard or CLI to create tables.\n');

  } catch (error: any) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

runMigrations();
