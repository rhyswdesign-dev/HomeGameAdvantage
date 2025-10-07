/**
 * Recipe Types with Enhanced Metadata for Personalization
 */

import { Spirit, FlavorProfile } from './userProfile';

export interface Recipe {
  // Core Identity
  id: string;
  title: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;

  // Recipe Content
  ingredients: Ingredient[];
  instructions: string[];
  garnish?: string;
  glassware?: Glassware;

  // Categorization
  category: RecipeCategory;
  difficulty: Difficulty;
  recipeType: 'cocktail' | 'mocktail' | 'spirit-forward' | 'highball' | 'sour' | 'other';

  // Personalization Metadata
  baseSpirit?: Spirit; // Primary spirit (vodka, gin, rum, etc.)
  spiritsUsed: Spirit[]; // All spirits in the recipe
  flavorProfiles: FlavorProfile[]; // Flavor characteristics
  abv: number; // Alcohol by volume percentage (0-100)
  complexity: number; // 0-1 scale (simple to complex)

  // Preparation Details
  preparationTime: number; // minutes
  servings: number;
  tools: BarTool[];

  // Media & Sources
  imageUrl?: string;
  sourceUrl?: string;
  videoUrl?: string;

  // Tags & Classification
  tags: string[];
  occasion?: Occasion[]; // When to serve (brunch, dinner party, etc.)
  season?: Season[]; // Best seasons for this drink
  timeOfDay?: TimeOfDay[]; // Morning, afternoon, evening

  // User Data
  createdBy?: string; // User ID
  isPublic: boolean;
  likes?: number;
  saves?: number;

  // Nutrition (optional)
  nutrition?: NutritionInfo;
}

// Supporting Types

export interface Ingredient {
  name: string;
  amount: string;
  unit?: string;
  notes?: string;
  category?: IngredientCategory; // For grouping (spirits, mixers, garnish)
}

export type IngredientCategory = 'spirit' | 'liqueur' | 'mixer' | 'citrus' | 'syrup' | 'bitters' | 'garnish' | 'other';

export type RecipeCategory =
  | 'classic'        // Classic cocktails (Old Fashioned, Manhattan, etc.)
  | 'modern'         // Modern creations
  | 'tiki'           // Tiki cocktails
  | 'sour'           // Sour family
  | 'stirred'        // Stirred cocktails
  | 'shaken'         // Shaken cocktails
  | 'built'          // Built in glass
  | 'blended'        // Blended drinks
  | 'shot'           // Shots
  | 'punch'          // Punches
  | 'mocktail'       // Non-alcoholic
  | 'educational';   // For learning modules

export type Difficulty = 'beginner' | 'intermediate' | 'advanced' | 'expert';

export type Glassware =
  | 'rocks'          // Old fashioned glass
  | 'highball'       // Collins/highball glass
  | 'coupe'          // Coupe glass
  | 'martini'        // Martini/cocktail glass
  | 'nick-and-nora'  // Nick & Nora glass
  | 'wine'           // Wine glass
  | 'champagne'      // Champagne flute
  | 'hurricane'      // Hurricane glass
  | 'tiki-mug'       // Tiki mug
  | 'shot'           // Shot glass
  | 'mug'            // Mug (for hot drinks)
  | 'punch-bowl'     // Punch bowl
  | 'other';

export type BarTool =
  | 'jigger'
  | 'shaker'         // Boston or cobbler
  | 'barspoon'
  | 'strainer'       // Hawthorne strainer
  | 'fine-strainer'  // Fine mesh strainer
  | 'muddler'
  | 'citrus-press'
  | 'peeler'         // For citrus peels
  | 'knife'
  | 'grater'         // For nutmeg, etc.
  | 'blender'
  | 'torch'          // For flaming garnishes
  | 'none';

export type Occasion =
  | 'everyday'
  | 'brunch'
  | 'dinner-party'
  | 'date-night'
  | 'celebration'
  | 'holiday'
  | 'game-day'
  | 'outdoor'
  | 'formal';

export type Season = 'spring' | 'summer' | 'fall' | 'winter' | 'year-round';

export type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'late-night' | 'any';

export interface NutritionInfo {
  calories?: number;
  sugar?: number; // grams
  carbs?: number; // grams
}

// Recipe with user-specific data (for displaying in feeds)
export interface RecipeWithUserData extends Recipe {
  isSaved: boolean;
  isFavorite: boolean;
  userRating?: number; // 1-5 stars
  userFeedback?: 'loved' | 'liked' | 'disliked' | 'skipped';
  recommendationScore?: number; // 0-100, calculated based on user preferences
}

// Recipe filters for personalized queries
export interface RecipeFilters {
  spirits?: Spirit[];
  flavorProfiles?: FlavorProfile[];
  difficulty?: Difficulty[];
  abvRange?: { min: number; max: number };
  category?: RecipeCategory[];
  occasion?: Occasion[];
  season?: Season[];
  timeOfDay?: TimeOfDay[];
  preparationTimeMax?: number; // minutes
  requiredTools?: BarTool[];
  excludeRecipeIds?: string[]; // For filtering out disliked recipes
}

// Helper function to calculate ABV for a recipe
export function calculateRecipeABV(ingredients: Ingredient[]): number {
  // Simplified ABV calculation
  // In reality, this would need spirit ABV data and total volume calculations
  let totalAlcohol = 0;
  let totalVolume = 0;

  ingredients.forEach(ingredient => {
    const name = ingredient.name.toLowerCase();
    const amount = parseFloat(ingredient.amount) || 0;

    // Estimate ABV based on ingredient type
    let ingredientABV = 0;
    if (name.includes('vodka') || name.includes('gin') || name.includes('rum') ||
        name.includes('whiskey') || name.includes('tequila') || name.includes('brandy')) {
      ingredientABV = 40; // Standard spirits
    } else if (name.includes('liqueur') || name.includes('vermouth') || name.includes('aperol')) {
      ingredientABV = 20; // Liqueurs and fortified wines
    } else if (name.includes('wine') || name.includes('champagne')) {
      ingredientABV = 12; // Wine
    } else if (name.includes('beer')) {
      ingredientABV = 5; // Beer
    }

    totalAlcohol += amount * (ingredientABV / 100);
    totalVolume += amount;
  });

  if (totalVolume === 0) return 0;
  return (totalAlcohol / totalVolume) * 100;
}

// Helper function to determine difficulty based on recipe characteristics
export function calculateDifficulty(recipe: Partial<Recipe>): Difficulty {
  let score = 0;

  // More ingredients = harder
  if (recipe.ingredients && recipe.ingredients.length > 5) score += 1;
  if (recipe.ingredients && recipe.ingredients.length > 8) score += 1;

  // More steps = harder
  if (recipe.instructions && recipe.instructions.length > 5) score += 1;

  // Complex tools = harder
  const complexTools = ['fine-strainer', 'torch', 'blender'];
  if (recipe.tools?.some(tool => complexTools.includes(tool))) score += 1;

  // High complexity rating
  if (recipe.complexity && recipe.complexity > 0.7) score += 1;

  if (score <= 1) return 'beginner';
  if (score <= 2) return 'intermediate';
  if (score <= 4) return 'advanced';
  return 'expert';
}

// Helper function to extract primary spirit from ingredients
export function extractBaseSpirit(ingredients: Ingredient[]): Spirit | undefined {
  const spiritKeywords: { [key in Spirit]?: string[] } = {
    vodka: ['vodka'],
    gin: ['gin'],
    rum: ['rum'],
    tequila: ['tequila', 'mezcal'],
    whiskey: ['whiskey', 'whisky', 'bourbon', 'rye', 'scotch'],
    brandy: ['brandy', 'cognac', 'armagnac'],
    liqueurs: ['liqueur', 'cordial'],
  };

  // Look for the first spirit ingredient
  for (const ingredient of ingredients) {
    const name = ingredient.name.toLowerCase();

    for (const [spirit, keywords] of Object.entries(spiritKeywords)) {
      if (keywords.some(keyword => name.includes(keyword))) {
        return spirit as Spirit;
      }
    }
  }

  return undefined;
}

// Helper function to extract all spirits from ingredients
export function extractAllSpirits(ingredients: Ingredient[]): Spirit[] {
  const spiritKeywords: { [key in Spirit]?: string[] } = {
    vodka: ['vodka'],
    gin: ['gin'],
    rum: ['rum'],
    tequila: ['tequila', 'mezcal'],
    whiskey: ['whiskey', 'whisky', 'bourbon', 'rye', 'scotch'],
    brandy: ['brandy', 'cognac', 'armagnac'],
    liqueurs: ['liqueur', 'cordial', 'triple sec', 'amaretto', 'bailey'],
  };

  const foundSpirits = new Set<Spirit>();

  for (const ingredient of ingredients) {
    const name = ingredient.name.toLowerCase();

    for (const [spirit, keywords] of Object.entries(spiritKeywords)) {
      if (keywords.some(keyword => name.includes(keyword))) {
        foundSpirits.add(spirit as Spirit);
      }
    }
  }

  return Array.from(foundSpirits);
}

// Helper to determine flavor profiles from ingredients
export function extractFlavorProfiles(ingredients: Ingredient[]): FlavorProfile[] {
  const flavorKeywords: { [key in FlavorProfile]?: string[] } = {
    citrus: ['lemon', 'lime', 'orange', 'grapefruit', 'citrus'],
    herbal: ['basil', 'mint', 'rosemary', 'thyme', 'sage', 'herbal'],
    bitter: ['campari', 'aperol', 'fernet', 'bitter', 'amaro'],
    sweet: ['sugar', 'syrup', 'honey', 'sweet', 'liqueur'],
    smoky: ['mezcal', 'scotch', 'smoke', 'charred'],
    floral: ['elderflower', 'lavender', 'rose', 'hibiscus', 'floral'],
    spiced: ['cinnamon', 'ginger', 'nutmeg', 'clove', 'spice'],
  };

  const foundProfiles = new Set<FlavorProfile>();

  for (const ingredient of ingredients) {
    const name = ingredient.name.toLowerCase();

    for (const [profile, keywords] of Object.entries(flavorKeywords)) {
      if (keywords.some(keyword => name.includes(keyword))) {
        foundProfiles.add(profile as FlavorProfile);
      }
    }
  }

  return Array.from(foundProfiles);
}
