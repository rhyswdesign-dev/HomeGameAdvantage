/**
 * Migrate Vault Items from local data to Supabase
 * Run with: npx tsx scripts/migrate-vault-to-supabase.ts
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase configuration');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Import vault data
const vaultData = require('../src/data/vaultData.ts');

async function migrateVault() {
  console.log('🚀 Migrating vault data to Supabase...\n');

  try {
    // Migrate Vault Cycle
    console.log('📅 Migrating vault cycle...');
    const cycle = vaultData.currentVaultCycle;

    const { error: cycleDeleteError } = await supabase
      .from('vault_cycles')
      .delete()
      .neq('id', 'none');

    if (cycleDeleteError) {
      console.log('⚠️  Could not clear existing cycles:', cycleDeleteError.message);
    }

    const { error: cycleError } = await supabase
      .from('vault_cycles')
      .insert({
        id: cycle.id,
        name: cycle.name,
        start_date: cycle.startDate,
        end_date: cycle.endDate,
        is_active: cycle.isActive,
        featured_item_ids: cycle.featuredItemIds,
        mystery_drop_pool: cycle.mysteryDropPool,
        total_items_released: cycle.totalItemsReleased,
        total_unlocks: cycle.totalUnlocks
      });

    if (cycleError) {
      console.log('❌ Error inserting cycle:', cycleError.message);
    } else {
      console.log('✅ Inserted vault cycle\n');
    }

    // Migrate Vault Items
    console.log('📦 Migrating vault items...');
    const items = vaultData.vaultItems || [];

    const { error: itemsDeleteError } = await supabase
      .from('vault_items')
      .delete()
      .neq('id', 'none');

    if (itemsDeleteError) {
      console.log('⚠️  Could not clear existing items:', itemsDeleteError.message);
    }

    const convertedItems = items.map((item: any) => ({
      id: item.id,
      name: item.name,
      description: item.description,
      image: item.image,
      category: item.category,
      type: item.type,
      rarity: item.rarity,
      xp_cost: item.xpCost,
      keys_cost: item.keysCost,
      discount_reduced_xp: item.discountOption?.reducedXP || null,
      discount_cash_price: item.discountOption?.cashPrice ? Math.round(item.discountOption.cashPrice * 100) : null,
      total_stock: item.totalStock,
      current_stock: item.currentStock,
      cycle_id: item.cycleId,
      contents: item.contents || [],
      estimated_value: item.estimatedValue || null,
      partner: item.partner || null,
      is_active: item.isActive,
      release_date: item.releaseDate,
      expiry_date: item.expiryDate || null,
      mystery_pool: item.mysteryPool || [],
      mystery_tags: item.mysteryTags || []
    }));

    const { error: itemsError } = await supabase
      .from('vault_items')
      .insert(convertedItems);

    if (itemsError) {
      console.log('❌ Error inserting items:', itemsError.message);
    } else {
      console.log(`✅ Inserted ${convertedItems.length} vault items\n`);
    }

    // Migrate Monetization Items
    console.log('💰 Migrating monetization items...');
    const monItems = vaultData.monetizationItems || [];

    const { error: monDeleteError } = await supabase
      .from('monetization_items')
      .delete()
      .neq('id', 'none');

    if (monDeleteError) {
      console.log('⚠️  Could not clear existing monetization items:', monDeleteError.message);
    }

    const convertedMonItems = monItems.map((item: any) => ({
      id: item.id,
      type: item.type,
      name: item.name,
      description: item.description,
      image: item.image,
      price: Math.round(item.price * 100), // Convert to cents
      original_price: item.originalPrice ? Math.round(item.originalPrice * 100) : null,
      keys_granted: item.keysGranted || null,
      booster_type: item.boosterEffect?.type || null,
      booster_multiplier: item.boosterEffect?.multiplier || null,
      booster_duration: item.boosterEffect?.duration || null,
      is_bundle: item.isBundle,
      bundle_items: item.bundleItems ? JSON.stringify(item.bundleItems) : null,
      in_stock: item.inStock,
      stock_limit: item.stockLimit || null,
      stripe_price_id: item.stripePriceId,
      stripe_product_id: item.stripeProductId
    }));

    const { error: monItemsError } = await supabase
      .from('monetization_items')
      .insert(convertedMonItems);

    if (monItemsError) {
      console.log('❌ Error inserting monetization items:', monItemsError.message);
    } else {
      console.log(`✅ Inserted ${convertedMonItems.length} monetization items\n`);
    }

    // Verify
    console.log('🔍 Verifying migration...\n');

    const { count: cycleCount } = await supabase
      .from('vault_cycles')
      .select('*', { count: 'exact', head: true });

    const { count: itemCount } = await supabase
      .from('vault_items')
      .select('*', { count: 'exact', head: true });

    const { count: monCount } = await supabase
      .from('monetization_items')
      .select('*', { count: 'exact', head: true });

    console.log('✅ Vault migration complete!\n');
    console.log('📊 Summary:');
    console.log(`   - Vault Cycles: ${cycleCount}`);
    console.log(`   - Vault Items: ${itemCount}`);
    console.log(`   - Monetization Items: ${monCount}\n`);

  } catch (error: any) {
    console.error('❌ Migration failed:', error.message);
    console.error(error);
    process.exit(1);
  }
}

migrateVault();
