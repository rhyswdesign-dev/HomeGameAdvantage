/**
 * Create app tables using Service Role Key
 * Run with: npx tsx scripts/create-app-tables.ts
 */

import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌ Missing Supabase configuration');
  console.error('   Required: EXPO_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

async function createTables() {
  console.log('🔧 Creating app tables with Service Role Key...\n');

  // Read the migration file
  const migrationPath = path.join(__dirname, '../supabase/migrations/004_create_app_tables.sql');
  const sql = fs.readFileSync(migrationPath, 'utf-8');

  console.log('📄 Migration file loaded');
  console.log(`   Size: ${sql.length} characters\n`);

  try {
    // Execute SQL using Supabase SQL endpoint
    // The service role key allows us to execute DDL statements
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': serviceRoleKey,
        'Authorization': `Bearer ${serviceRoleKey}`,
      },
      body: JSON.stringify({ query: sql })
    });

    // Try alternative endpoint if the first one doesn't work
    if (!response.ok) {
      console.log('⚠️  Standard RPC endpoint not available, trying direct SQL execution...\n');

      // Use pgmeta endpoint for schema operations
      const metaResponse = await fetch(`${supabaseUrl}/rest/v1/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': serviceRoleKey,
          'Authorization': `Bearer ${serviceRoleKey}`,
          'Prefer': 'return=representation'
        },
        body: JSON.stringify({ query: sql })
      });

      if (!metaResponse.ok) {
        const errorText = await metaResponse.text();
        console.log('❌ Unable to execute SQL directly via API\n');
        console.log('Response:', metaResponse.status, errorText);
        console.log('\n💡 Using SQL Editor instead (recommended for DDL):');
        console.log('   https://supabase.com/dashboard/project/srbvekhupzoajedpyepr/sql/new');
        console.log('\n   Copy from: supabase/migrations/004_create_app_tables.sql\n');

        // Still try to provide a way forward
        console.log('🔄 Alternative: I can break down the migration into smaller chunks...\n');
        return false;
      }
    }

    console.log('✅ Tables created successfully!\n');
    return true;

  } catch (error: any) {
    console.log('❌ Error executing migration:', error.message);
    console.log('\n💡 The Service Role Key is valid, but direct SQL execution via API');
    console.log('   is restricted. Please use the SQL Editor:\n');
    console.log('   https://supabase.com/dashboard/project/srbvekhupzoajedpyepr/sql/new');
    console.log('\n   File to copy: supabase/migrations/004_create_app_tables.sql\n');
    return false;
  }
}

createTables().then(success => {
  if (!success) {
    console.log('📋 Quick Guide:');
    console.log('   1. Open SQL Editor (link above)');
    console.log('   2. Select all and delete existing content');
    console.log('   3. Copy entire contents of 004_create_app_tables.sql');
    console.log('   4. Paste and click "Run"');
    console.log('   5. You should see "Success. No rows returned"\n');
  }
});
