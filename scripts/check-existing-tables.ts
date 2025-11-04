/**
 * Check which tables already exist
 * Run with: npx tsx scripts/check-existing-tables.ts
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase configuration');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const expectedTables = [
  'modules',
  'lessons',
  'items',
  'user_profiles',
  'bar_inventory',
  'recipes',
  'user_recipe_interactions',
  'vault_items',
  'vault_cycles',
  'user_vault_profiles',
  'unlocked_vault_items',
  'vault_addresses',
  'monetization_items',
  'vault_purchases',
  'bars'
];

async function checkTables() {
  console.log('🔍 Checking existing tables...\n');

  const existing: string[] = [];
  const missing: string[] = [];

  for (const table of expectedTables) {
    try {
      const { error } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });

      if (error) {
        if (error.message.includes('does not exist') || error.message.includes('schema cache')) {
          missing.push(table);
          console.log(`❌ ${table.padEnd(30)} - Does not exist`);
        } else {
          console.log(`⚠️  ${table.padEnd(30)} - Error: ${error.message}`);
        }
      } else {
        existing.push(table);
        console.log(`✅ ${table.padEnd(30)} - Exists`);
      }
    } catch (err: any) {
      missing.push(table);
      console.log(`❌ ${table.padEnd(30)} - ${err.message}`);
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log(`\n📊 Summary:`);
  console.log(`   Existing: ${existing.length} tables`);
  console.log(`   Missing:  ${missing.length} tables\n`);

  if (missing.length > 0) {
    console.log('📋 Missing tables:');
    missing.forEach(t => console.log(`   - ${t}`));
    console.log('');
  }

  if (existing.includes('recipes')) {
    console.log('⚠️  The "recipes" table already exists.');
    console.log('   Options:');
    console.log('   1. Drop and recreate all tables (clean slate)');
    console.log('   2. Keep existing tables and only create missing ones\n');
  }
}

checkTables();
