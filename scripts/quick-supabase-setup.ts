/**
 * Quick Supabase Setup Helper
 * Run with: npx tsx scripts/quick-supabase-setup.ts
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

dotenv.config();

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase configuration');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkSetupStatus() {
  console.log('🔍 Checking Supabase Setup Status...\n');

  try {
    // Check connection
    console.log('1️⃣  Testing connection...');
    const { error: connectionError } = await supabase
      .from('modules')
      .select('count')
      .limit(1);

    if (connectionError) {
      if (connectionError.message.includes('does not exist') ||
          connectionError.message.includes('schema cache')) {
        console.log('   ❌ Tables not created yet\n');
        console.log('📋 QUICK START - Create Tables:');
        console.log('');
        console.log('   1. Open Supabase SQL Editor:');
        console.log('      https://supabase.com/dashboard/project/srbvekhupzoajedpyepr/sql/new');
        console.log('');
        console.log('   2. Copy & paste this file content:');
        console.log('      supabase/migrations/001_create_curriculum_tables.sql');
        console.log('');
        console.log('   3. Click "Run" ▶️');
        console.log('');
        console.log('   4. Come back and run:');
        console.log('      npx tsx scripts/migrate-to-supabase.ts');
        console.log('');
        console.log('💡 Full guide: cat SUPABASE_SETUP.md\n');
        return;
      }
      throw connectionError;
    }

    console.log('   ✅ Connection successful\n');

    // Check data
    console.log('2️⃣  Checking data...');
    const { data: modules } = await supabase.from('modules').select('id');
    const { data: lessons } = await supabase.from('lessons').select('id');
    const { data: items } = await supabase.from('items').select('id');

    const moduleCount = modules?.length || 0;
    const lessonCount = lessons?.length || 0;
    const itemCount = items?.length || 0;

    console.log(`   Modules: ${moduleCount}`);
    console.log(`   Lessons: ${lessonCount}`);
    console.log(`   Items: ${itemCount}\n`);

    if (moduleCount === 0) {
      console.log('📋 Next Steps:');
      console.log('   Run data migration: npx tsx scripts/migrate-to-supabase.ts\n');
      return;
    }

    console.log('✅ Setup Complete!');
    console.log('\n🎉 Your Supabase database is ready to use!\n');

    // Show sample data
    const { data: sampleModule } = await supabase
      .from('modules')
      .select('*')
      .limit(1)
      .single();

    if (sampleModule) {
      console.log('📚 Sample Module:');
      console.log(`   Title: ${sampleModule.title}`);
      console.log(`   Chapter: ${sampleModule.chapter_index}`);
      console.log(`   Estimated time: ${sampleModule.estimated_minutes} min`);
    }

    console.log('\n🚀 Ready to code! Check SUPABASE_SETUP.md for usage examples.\n');

  } catch (error: any) {
    console.error('\n❌ Error:', error.message);
    console.log('\n💡 Run: cat SUPABASE_SETUP.md for troubleshooting\n');
  }
}

checkSetupStatus();
