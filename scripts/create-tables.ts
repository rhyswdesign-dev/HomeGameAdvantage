/**
 * Attempt to create tables programmatically
 * This will fail with anon key, but let's try to confirm
 */

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase configuration');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function createTables() {
  console.log('🔧 Attempting to create tables programmatically...\n');

  // Read the migration file
  const migrationPath = path.join(__dirname, '../supabase/migrations/004_create_app_tables.sql');
  const sql = fs.readFileSync(migrationPath, 'utf-8');

  console.log('📄 Migration file loaded');
  console.log(`   Size: ${sql.length} characters\n`);

  try {
    // Try to execute the SQL
    // Note: This requires the service role key, not the anon key
    const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql }) as any;

    if (error) {
      console.log('❌ Cannot create tables with current credentials\n');
      console.log('Error:', error.message);
      console.log('\n📋 To create tables programmatically, you need:\n');
      console.log('1. Go to: https://supabase.com/dashboard/project/srbvekhupzoajedpyepr/settings/api');
      console.log('2. Copy the "service_role" key (⚠️  Keep it secret!)');
      console.log('3. Add to .env: SUPABASE_SERVICE_ROLE_KEY=your-service-role-key');
      console.log('4. Run this script again\n');
      console.log('OR\n');
      console.log('Use the SQL Editor (recommended):');
      console.log('   https://supabase.com/dashboard/project/srbvekhupzoajedpyepr/sql/new\n');
      return false;
    }

    console.log('✅ Tables created successfully!\n');
    return true;

  } catch (error: any) {
    console.log('❌ Failed to create tables\n');
    console.log('Reason:', error.message);
    console.log('\n💡 Solution: Use the SQL Editor in Supabase Dashboard');
    console.log('   https://supabase.com/dashboard/project/srbvekhupzoajedpyepr/sql/new\n');
    return false;
  }
}

createTables();
