/**
 * Prepare migration for SQL Editor
 * Run with: npx tsx scripts/prepare-migration.ts
 */

import * as fs from 'fs';
import * as path from 'path';
import { exec } from 'child_process';

const migrationPath = path.join(__dirname, '../supabase/migrations/004_create_app_tables.sql');
const sql = fs.readFileSync(migrationPath, 'utf-8');

console.log('\n🚀 Ready to Create App Tables!\n');
console.log('━'.repeat(60));
console.log('\n📋 STEP 1: Opening SQL Editor...\n');

const editorUrl = 'https://supabase.com/dashboard/project/srbvekhupzoajedpyepr/sql/new';

// Try to open the browser
exec(`open "${editorUrl}"`, (error) => {
  if (error) {
    console.log('⚠️  Could not auto-open browser. Please open manually:');
    console.log(`   ${editorUrl}\n`);
  } else {
    console.log('✅ SQL Editor opened in browser\n');
  }
});

console.log('━'.repeat(60));
console.log('\n📋 STEP 2: Copy the migration SQL below:\n');
console.log('━'.repeat(60));
console.log('\n');
console.log(sql);
console.log('\n');
console.log('━'.repeat(60));
console.log('\n📋 STEP 3: In the SQL Editor:\n');
console.log('   1. Select all (Cmd+A / Ctrl+A)');
console.log('   2. Delete existing content');
console.log('   3. Paste the SQL from above');
console.log('   4. Click "Run" button (bottom right)');
console.log('   5. Wait for: ✅ "Success. No rows returned"\n');
console.log('━'.repeat(60));
console.log('\n📊 Tables that will be created (15 total):\n');
console.log('   ✓ user_profiles           - User data & preferences');
console.log('   ✓ bar_inventory           - Home bar items');
console.log('   ✓ recipes                 - Cocktail/mocktail recipes');
console.log('   ✓ user_recipe_interactions - Saves, ratings, favorites');
console.log('   ✓ vault_items             - Redeemable items');
console.log('   ✓ vault_cycles            - 30-day rotation cycles');
console.log('   ✓ user_vault_profiles     - XP & keys balances');
console.log('   ✓ unlocked_vault_items    - Purchase history');
console.log('   ✓ vault_addresses         - Shipping addresses');
console.log('   ✓ monetization_items      - Keys/boosters for sale');
console.log('   ✓ vault_purchases         - Purchase transactions');
console.log('   ✓ bars                    - Bar/venue profiles\n');
console.log('━'.repeat(60));
console.log('\n💾 Migration file saved at:');
console.log(`   ${migrationPath}\n`);

// Also save to a temp file that's easy to copy from
const tempPath = path.join(__dirname, '../004_COPY_THIS.sql');
fs.writeFileSync(tempPath, sql);
console.log('📄 Also saved to easy-copy file:');
console.log(`   ${tempPath}\n`);
console.log('━'.repeat(60));
console.log('\n');
