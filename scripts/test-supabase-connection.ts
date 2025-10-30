/**
 * Test Supabase Connection
 * Run with: npx tsx scripts/test-supabase-connection.ts
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

console.log('🔍 Testing Supabase Connection...\n');

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase configuration!');
  console.error('Please check your .env file for:');
  console.error('  - EXPO_PUBLIC_SUPABASE_URL');
  console.error('  - EXPO_PUBLIC_SUPABASE_ANON_KEY');
  process.exit(1);
}

console.log('✅ Configuration found:');
console.log(`   URL: ${supabaseUrl}`);
console.log(`   Key: ${supabaseAnonKey.substring(0, 20)}...`);
console.log('');

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
  try {
    console.log('🔌 Testing connection...');

    // Test 1: Simple query to check connection
    const { data, error } = await supabase
      .from('modules')
      .select('count')
      .limit(1);

    if (error) {
      if (error.message.includes('relation "public.modules" does not exist')) {
        console.log('⚠️  Tables not created yet. Run migrations first!');
        console.log('   Run: npx tsx scripts/run-migrations.ts');
        return;
      }
      throw error;
    }

    console.log('✅ Connection successful!');

    // Test 2: Check if tables exist
    console.log('\n📊 Checking tables...');

    const { data: modules } = await supabase.from('modules').select('*').limit(5);
    const { data: lessons } = await supabase.from('lessons').select('*').limit(5);
    const { data: items } = await supabase.from('items').select('*').limit(5);

    console.log(`   Modules: ${modules?.length || 0} found`);
    console.log(`   Lessons: ${lessons?.length || 0} found`);
    console.log(`   Items: ${items?.length || 0} found`);

    if (modules && modules.length > 0) {
      console.log('\n✨ Sample module:');
      console.log(JSON.stringify(modules[0], null, 2));
    }

    console.log('\n🎉 Supabase is ready to use!');

  } catch (error: any) {
    console.error('\n❌ Connection failed:', error.message);
    console.error('\nPossible issues:');
    console.error('  1. Check your Supabase project is active');
    console.error('  2. Verify the URL and API key in .env');
    console.error('  3. Run migrations if tables don\'t exist');
    process.exit(1);
  }
}

testConnection();
