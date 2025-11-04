/**
 * Check Supabase Table Status
 * Run with: npx tsx scripts/check-supabase-tables.ts
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

async function checkTables() {
  console.log('🔍 Checking existing tables...\n');

  const tables = ['modules', 'lessons', 'items'];

  for (const table of tables) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });

      if (error) {
        if (error.message.includes('does not exist')) {
          console.log(`❌ ${table}: Does not exist`);
        } else {
          console.log(`⚠️  ${table}: Error - ${error.message}`);
        }
      } else {
        console.log(`✅ ${table}: Exists (${data?.length || 0} rows)`);
      }
    } catch (err: any) {
      console.log(`❌ ${table}: ${err.message}`);
    }
  }

  console.log('\n💡 Next steps:');
  console.log('   If tables exist but have issues, run the clean migration:');
  console.log('   cat supabase/migrations/002_clean_and_recreate.sql\n');
}

checkTables();
