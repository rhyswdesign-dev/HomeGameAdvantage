/**
 * Force update with service role key for full permissions
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

const questionId = 'ch1-004';

async function forceUpdate() {
  const item = curriculumData.items.find((i: any) => i.id === questionId);

  if (!item) {
    console.error('Item not found');
    return;
  }

  console.log('Updating with data:', {
    type: item.type,
    prompt: item.prompt,
    options: item.options,
    answer_index: item.answerIndex
  });

  const { data, error } = await supabase
    .from('items')
    .update({
      type: item.type,
      prompt: item.prompt,
      options: item.options || [],
      answer_index: item.answerIndex ?? null,
      answer_text: null,
      acceptable_answers: []
    })
    .eq('id', questionId)
    .select();

  if (error) {
    console.error('❌ Error:', error);
  } else {
    console.log('✅ Updated successfully!');
    console.log('Result:', data);
  }
}

forceUpdate();
