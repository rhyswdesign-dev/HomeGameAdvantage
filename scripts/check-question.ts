import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL!,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!
);

async function check() {
  const { data, error } = await supabase
    .from('items')
    .select('*')
    .eq('id', 'ch1-004')
    .single();

  if (error) {
    console.error('❌ Error:', error);
  } else {
    console.log('\n📝 Question ch1-004 in Supabase database:');
    console.log('   Type:', data.type);
    console.log('   Prompt:', data.prompt);
    console.log('   Options:', data.options);
    console.log('   Answer Index:', data.answer_index);
    console.log('   Answer Text:', data.answer_text);
  }
}

check();
