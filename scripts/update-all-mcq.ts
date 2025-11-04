/**
 * Update all 19 short answer questions to MCQ using service role
 */

import { createClient } from '@supabase/supabase-js';
import * as curriculumData from '../curriculum-data.json';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌ Missing Supabase configuration.');
  process.exit(1);
}

// Use service role key for full permissions
const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

const convertedQuestionIds = [
  'ch1-004', 'ch1-010', 'ch1-017', 'ch1-026', 'ch1-030',
  'ch1-038', 'ch1-040', 'ch1-045', 'ch1-050', 'ch1-056',
  'ch1-060', 'ch1-065', 'ch1-069', 'ch1-075', 'ch1-080',
  'ch1-085', 'ch1-090', 'ch1-093', 'ch1-100'
];

async function updateAll() {
  console.log('🚀 Updating all 19 questions to MCQ with service role...\n');

  let updated = 0;
  let failed = 0;

  for (const questionId of convertedQuestionIds) {
    const item = curriculumData.items.find((i: any) => i.id === questionId);

    if (!item) {
      console.warn(`⚠️  ${questionId} not found in curriculum-data.json`);
      failed++;
      continue;
    }

    const { error } = await supabase
      .from('items')
      .update({
        type: item.type,
        prompt: item.prompt,
        options: item.options || [],
        answer_index: item.answerIndex ?? null,
        answer_text: null,
        acceptable_answers: []
      })
      .eq('id', questionId);

    if (error) {
      console.error(`❌ ${questionId}: ${error.message}`);
      failed++;
    } else {
      console.log(`✅ ${questionId}: ${item.prompt.substring(0, 60)}...`);
      updated++;
    }
  }

  console.log(`\n🎉 Complete! Updated: ${updated}, Failed: ${failed}`);
}

updateAll();
