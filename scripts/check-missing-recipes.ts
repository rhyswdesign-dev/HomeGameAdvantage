/**
 * Check for Missing Essential Cocktails
 * Run: npx tsx scripts/check-missing-recipes.ts
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Essential cocktails that should be in the database
const essentialCocktails = [
  // IBA Official Classics
  'Americano', 'Aviation', 'Bellini', 'Bloody Mary', 'Boulevardier',
  'Brandy Crusta', 'Casino', 'Champagne Cocktail', 'Clover Club',
  'Daiquiri', 'Dark n Stormy', 'Derby', 'Dry Martini', 'Espresso Martini',
  'Fernandito', 'French 75', 'French Connection', 'Gibson', 'Gimlet',
  'Gin Fizz', 'Grasshopper', 'Hanky Panky', 'Hemingway Special',
  'Horse\'s Neck', 'Irish Coffee', 'John Collins', 'Last Word', 'Lemon Drop',
  'Long Island Iced Tea', 'Mai Tai', 'Manhattan', 'Margarita', 'Martinez',
  'Mary Pickford', 'Mimosa', 'Mint Julep', 'Mojito', 'Moscow Mule',
  'Negroni', 'Old Cuban', 'Old Fashioned', 'Paloma', 'Paper Plane',
  'Penicillin', 'Pisco Sour', 'Planter\'s Punch', 'Porto Flip',
  'Ramos Gin Fizz', 'Russian Spring Punch', 'Sazerac', 'Sidecar',
  'Singapore Sling', 'Southside', 'Tequila Sunrise', 'Tommy\'s Margarita',
  'Trinidad Sour', 'Vesper', 'Vieux Carré', 'Whiskey Sour', 'White Lady',
  'Zombie',

  // Additional Popular Classics
  'Aperol Spritz', 'Amaretto Sour', 'Black Russian', 'White Russian',
  'Bramble', 'Caipirinha', 'Cosmopolitan', 'Corpse Reviver #2',
  'French Martini', 'Gin and Tonic', 'God Father', 'God Mother',
  'Godmother', 'Highball', 'Hot Toddy', 'Hurricane', 'Jungle Bird',
  'Kamikaze', 'Kir', 'Kir Royale', 'Lynchburg Lemonade', 'Manhattan Perfect',
  'Mezcal Mule', 'Mint Julep', 'New York Sour', 'Pina Colada',
  'Rob Roy', 'Rusty Nail', 'Screwdriver', 'Sea Breeze', 'Sex on the Beach',
  'Stinger', 'Tom Collins', 'Vodka Martini', 'Ward Eight', 'Whiskey Smash',

  // Tiki Classics
  'Blue Hawaiian', 'Fog Cutter', 'Painkiller', 'Pearl Diver', 'Scorpion',
  'Saturn', 'Test Pilot', 'Three Dots and a Dash', 'Zombie Punch',

  // Modern Classics
  'Bee\'s Knees', 'Gold Rush', 'Naked and Famous', 'Oaxaca Old Fashioned',
  'Pornstar Martini', 'Bramble', 'Espresso Martini'
];

async function checkMissingRecipes() {
  console.log('🔍 Checking for missing essential cocktails...\n');

  try {
    // Get all recipe titles
    const { data, error } = await supabase
      .from('recipes')
      .select('title, id');

    if (error) {
      console.error('❌ Error fetching recipes:', error.message);
      process.exit(1);
    }

    const existingTitles = new Set(
      data?.map(r => r.title.toLowerCase().trim()) || []
    );

    console.log(`📚 Database has ${data?.length} recipes\n`);

    // Find missing cocktails
    const missing: string[] = [];
    const normalized = new Map<string, string>();

    essentialCocktails.forEach(cocktail => {
      const normalized_name = cocktail.toLowerCase()
        .replace(/'/g, '')
        .replace(/\s+/g, ' ')
        .trim();
      normalized.set(normalized_name, cocktail);
    });

    normalized.forEach((original, normalized_name) => {
      let found = false;
      for (const existing of existingTitles) {
        const existing_normalized = existing
          .replace(/'/g, '')
          .replace(/\s+/g, ' ')
          .trim();

        if (existing_normalized === normalized_name ||
            existing_normalized.includes(normalized_name) ||
            normalized_name.includes(existing_normalized)) {
          found = true;
          break;
        }
      }
      if (!found) {
        missing.push(original);
      }
    });

    if (missing.length === 0) {
      console.log('✅ All essential cocktails are in the database!');
    } else {
      console.log(`⚠️  Missing ${missing.length} essential cocktails:\n`);
      missing.sort().forEach((cocktail, idx) => {
        console.log(`${idx + 1}. ${cocktail}`);
      });

      console.log(`\n📊 Missing by category:`);
      const iba = missing.filter(c =>
        ['Casino', 'Champagne Cocktail', 'Derby', 'Fernandito',
         'French Connection', 'Gibson', 'Gin Fizz', 'Hemingway Special',
         'Horse\'s Neck', 'Irish Coffee', 'Lemon Drop', 'Long Island Iced Tea',
         'Mary Pickford', 'Old Cuban', 'Planter\'s Punch', 'Russian Spring Punch',
         'Tequila Sunrise', 'Trinidad Sour', 'White Lady'].includes(c)
      );

      console.log(`\nIBA Official (${iba.length}):`);
      iba.forEach(c => console.log(`  - ${c}`));
    }

  } catch (err: any) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

checkMissingRecipes();
