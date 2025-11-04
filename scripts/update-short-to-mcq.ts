/**
 * Script to update the 19 short answer questions to MCQ
 * Run with: npx tsx scripts/update-short-to-mcq.ts
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

// IDs of questions that were converted from short to MCQ
const convertedQuestionIds = [
  'ch1-004', 'ch1-010', 'ch1-017', 'ch1-026', 'ch1-030',
  'ch1-038', 'ch1-040', 'ch1-045', 'ch1-050', 'ch1-056',
  'ch1-060', 'ch1-065', 'ch1-069', 'ch1-075', 'ch1-080',
  'ch1-085', 'ch1-090', 'ch1-093', 'ch1-100'
];

async function updateQuestions() {
  console.log('🚀 Updating short answer questions to MCQ...\n');

  try {
    let updatedCount = 0;

    for (const questionId of convertedQuestionIds) {
      // Find the question in curriculum data
      const item = curriculumData.items.find((i: any) => i.id === questionId);

      if (!item) {
        console.warn(`⚠️  Question ${questionId} not found in curriculum-data.json`);
        continue;
      }

      // Update the question in Supabase
      const { error } = await supabase
        .from('items')
        .update({
          type: 'mcq',
          prompt: item.prompt,
          options: item.options || [],
          answer_index: item.answerIndex ?? null,
          answer_text: null, // Clear short answer fields
          acceptable_answers: [],
        })
        .eq('id', questionId);

      if (error) {
        console.error(`❌ Error updating ${questionId}:`, error.message);
      } else {
        console.log(`✅ Updated ${questionId}: ${item.prompt.substring(0, 50)}...`);
        updatedCount++;
      }
    }

    console.log(`\n🎉 Successfully updated ${updatedCount}/${convertedQuestionIds.length} questions!`);

  } catch (error) {
    console.error('\n❌ Update failed:', error);
    process.exit(1);
  }
}

// Run update
updateQuestions();
