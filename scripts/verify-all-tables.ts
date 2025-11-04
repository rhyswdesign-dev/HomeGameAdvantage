/**
 * Verify all tables are working correctly
 * Run with: npx tsx scripts/verify-all-tables.ts
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

async function verifyTables() {
  console.log('🔍 Verifying all tables are working...\n');

  const tables = {
    'Curriculum': ['modules', 'lessons', 'items'],
    'User System': ['user_profiles', 'bar_inventory'],
    'Recipe System': ['recipes', 'user_recipe_interactions'],
    'Vault Economy': [
      'vault_items',
      'vault_cycles',
      'user_vault_profiles',
      'unlocked_vault_items',
      'vault_addresses',
      'monetization_items',
      'vault_purchases'
    ],
    'Bar/Venue': ['bars']
  };

  let allGood = true;

  for (const [category, tableList] of Object.entries(tables)) {
    console.log(`📦 ${category}:`);

    for (const table of tableList) {
      try {
        const { count, error } = await supabase
          .from(table)
          .select('*', { count: 'exact', head: true });

        if (error) {
          console.log(`   ❌ ${table.padEnd(30)} - ${error.message}`);
          allGood = false;
        } else {
          console.log(`   ✅ ${table.padEnd(30)} - ${count || 0} rows`);
        }
      } catch (err: any) {
        console.log(`   ❌ ${table.padEnd(30)} - ${err.message}`);
        allGood = false;
      }
    }
    console.log('');
  }

  if (allGood) {
    console.log('━'.repeat(60));
    console.log('🎉 All tables verified and working!\n');
    console.log('📊 Database Summary:');
    console.log('   ✅ 3 curriculum tables (modules, lessons, items)');
    console.log('   ✅ 2 user system tables');
    console.log('   ✅ 2 recipe system tables');
    console.log('   ✅ 7 vault economy tables');
    console.log('   ✅ 1 bar/venue table');
    console.log('\n🚀 Your Supabase database is fully set up and ready to use!\n');
  } else {
    console.log('⚠️  Some tables have issues. Please review above.\n');
  }
}

verifyTables();
