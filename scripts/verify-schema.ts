/**
 * Verify Supabase Schema
 * Run with: npx tsx scripts/verify-schema.ts
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

async function verifySchema() {
  console.log('🔍 Verifying Supabase Schema...\n');

  try {
    // Try to insert a test module
    const testModule = {
      id: 'test-module-001',
      title: 'Test Module',
      chapter_index: 1,
      description: 'Test',
      estimated_minutes: 10,
      tags: ['test']
    };

    const { error: moduleError } = await supabase
      .from('modules')
      .insert(testModule);

    if (moduleError) {
      console.log('❌ Modules table issue:', moduleError.message);
      console.log('\n💡 Solution: Run the clean migration in SQL Editor');
      console.log('   File: supabase/migrations/002_clean_and_recreate.sql\n');
      return;
    }

    console.log('✅ Modules table: OK');

    // Try to insert a test lesson
    const testLesson = {
      id: 'test-lesson-001',
      module_id: 'test-module-001',
      title: 'Test Lesson',
      item_ids: ['item-1'],
      estimated_minutes: 5
    };

    const { error: lessonError } = await supabase
      .from('lessons')
      .insert(testLesson);

    if (lessonError) {
      console.log('❌ Lessons table issue:', lessonError.message);
      console.log('\n💡 Solution: Run the clean migration in SQL Editor');
      console.log('   File: supabase/migrations/002_clean_and_recreate.sql\n');

      // Clean up test module
      await supabase.from('modules').delete().eq('id', 'test-module-001');
      return;
    }

    console.log('✅ Lessons table: OK (foreign key works)');

    // Try to insert a test item
    const testItem = {
      id: 'test-item-001',
      type: 'mcq',
      prompt: 'Test question?',
      options: ['A', 'B', 'C'],
      answer_index: 0,
      tags: ['test']
    };

    const { error: itemError } = await supabase
      .from('items')
      .insert(testItem);

    if (itemError) {
      console.log('❌ Items table issue:', itemError.message);
      console.log('\n💡 Solution: Run the clean migration in SQL Editor');
      console.log('   File: supabase/migrations/002_clean_and_recreate.sql\n');

      // Clean up
      await supabase.from('lessons').delete().eq('id', 'test-lesson-001');
      await supabase.from('modules').delete().eq('id', 'test-module-001');
      return;
    }

    console.log('✅ Items table: OK');

    // Clean up test data
    console.log('\n🧹 Cleaning up test data...');
    await supabase.from('items').delete().eq('id', 'test-item-001');
    await supabase.from('lessons').delete().eq('id', 'test-lesson-001');
    await supabase.from('modules').delete().eq('id', 'test-module-001');

    console.log('✅ Schema verification complete!\n');
    console.log('🚀 Ready to migrate data. Run:');
    console.log('   npm run supabase:migrate\n');

  } catch (error: any) {
    console.error('❌ Verification failed:', error.message);
    console.log('\n💡 Solution: Run the clean migration in SQL Editor');
    console.log('   File: supabase/migrations/002_clean_and_recreate.sql\n');
  }
}

verifySchema();
