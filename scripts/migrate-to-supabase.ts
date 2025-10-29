/**
 * Migration script to upload curriculum data to Supabase
 * Run with: npx tsx scripts/migrate-to-supabase.ts
 */

import { createClient } from '@supabase/supabase-js';
import * as curriculumData from '../curriculum-data.json';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase configuration. Please check your .env file.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function migrate() {
  console.log('🚀 Starting migration to Supabase...\n');

  try {
    // Step 1: Clear existing data (optional - be careful in production!)
    console.log('🗑️  Clearing existing data...');
    await supabase.from('items').delete().neq('id', '');
    await supabase.from('lessons').delete().neq('id', '');
    await supabase.from('modules').delete().neq('id', '');
    console.log('✅ Cleared existing data\n');

    // Step 2: Insert modules
    console.log(`📚 Inserting ${curriculumData.modules.length} modules...`);
    const modulesData = curriculumData.modules.map(m => ({
      id: m.id,
      title: m.title,
      chapter_index: m.chapterIndex,
      description: m.title,
      prerequisite_ids: [],
      estimated_minutes: m.estimatedMinutes,
      tags: m.tags,
    }));

    const { error: modulesError } = await supabase
      .from('modules')
      .insert(modulesData);

    if (modulesError) {
      console.error('❌ Error inserting modules:', modulesError);
      throw modulesError;
    }
    console.log(`✅ Inserted ${modulesData.length} modules\n`);

    // Step 3: Insert lessons
    console.log(`📖 Inserting ${curriculumData.lessons.length} lessons...`);
    const lessonsData = curriculumData.lessons.map(l => ({
      id: l.id,
      module_id: l.moduleId,
      title: l.title,
      item_ids: l.itemIds,
      estimated_minutes: l.estimatedMinutes,
      prerequisite_ids: l.prereqs || [],
      types: l.types,
    }));

    const { error: lessonsError } = await supabase
      .from('lessons')
      .insert(lessonsData);

    if (lessonsError) {
      console.error('❌ Error inserting lessons:', lessonsError);
      throw lessonsError;
    }
    console.log(`✅ Inserted ${lessonsData.length} lessons\n`);

    // Step 4: Insert items (in batches to avoid payload size limits)
    console.log(`❓ Inserting ${curriculumData.items.length} items...`);
    const batchSize = 100;
    const itemsData = curriculumData.items.map(i => ({
      id: i.id,
      type: i.type,
      prompt: i.prompt,
      options: i.options || [],
      answer_index: i.answerIndex ?? null,
      order_target: i.orderTarget || [],
      answer_text: i.answerText ?? null,
      acceptable_answers: i.acceptableAnswers || [],
      correct: i.correct || [],
      pairs: i.pairs ?? null,
      roleplay: i.roleplay ?? null,
      tags: i.tags || [],
      concept_id: i.conceptId ?? null,
      difficulty: i.difficulty ?? null,
      xp_award: i.xpAward || 10,
      review_weight: i.reviewWeight ?? null,
    }));

    for (let i = 0; i < itemsData.length; i += batchSize) {
      const batch = itemsData.slice(i, i + batchSize);
      const { error: itemsError } = await supabase
        .from('items')
        .insert(batch);

      if (itemsError) {
        console.error(`❌ Error inserting items batch ${i / batchSize + 1}:`, itemsError);
        throw itemsError;
      }
      console.log(`  ✅ Inserted batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(itemsData.length / batchSize)}`);
    }
    console.log(`✅ Inserted ${itemsData.length} items\n`);

    // Verification
    console.log('🔍 Verifying migration...');
    const { count: modulesCount } = await supabase
      .from('modules')
      .select('*', { count: 'exact', head: true });

    const { count: lessonsCount } = await supabase
      .from('lessons')
      .select('*', { count: 'exact', head: true });

    const { count: itemsCount } = await supabase
      .from('items')
      .select('*', { count: 'exact', head: true });

    console.log(`\n✅ Migration complete!`);
    console.log(`📊 Summary:`);
    console.log(`   - Modules: ${modulesCount}`);
    console.log(`   - Lessons: ${lessonsCount}`);
    console.log(`   - Items: ${itemsCount}`);

  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    process.exit(1);
  }
}

// Run migration
migrate();
