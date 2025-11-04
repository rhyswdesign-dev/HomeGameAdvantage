# Supabase Repositories Usage Guide

Your app data is now stored in Supabase! Here's how to use it.

## 📚 Available Repositories

### 1. **RecipesRepository** - 90 Cocktail Recipes
### 2. **VaultRepository** - Vault Economy Items
### 3. **CurriculumRepository** - Learning Curriculum

---

## 🍸 Recipes Repository

### Get All Recipes
```typescript
import { RecipesRepository } from '@repos/supabase';

const recipes = await RecipesRepository.getAllRecipes();
console.log(`Found ${recipes.length} recipes`);
```

### Search Recipes
```typescript
const results = await RecipesRepository.searchRecipes('margarita');
```

### Filter by Spirit
```typescript
const ginCocktails = await RecipesRepository.getRecipesBySpirit('gin');
```

### Filter by Category
```typescript
const classics = await RecipesRepository.getRecipesByCategory('classic');
```

### Get Single Recipe
```typescript
const recipe = await RecipesRepository.getRecipeById('gin-tonic');
if (recipe) {
  console.log(recipe.title, recipe.ingredients);
}
```

### Advanced Filtering
```typescript
import { RecipeFilters } from '@/types/recipe';

const filters: RecipeFilters = {
  spirits: ['gin', 'vodka'],
  difficulty: ['beginner', 'intermediate'],
  abvRange: { min: 0, max: 20 },
  preparationTimeMax: 10
};

const filtered = await RecipesRepository.filterRecipes(filters);
```

---

## 🎁 Vault Repository

### Get Current Vault Cycle
```typescript
import { VaultRepository } from '@repos/supabase';

const cycle = await VaultRepository.getCurrentCycle();
if (cycle) {
  console.log(`Current cycle: ${cycle.name}`);
  console.log(`Ends: ${cycle.endDate}`);
}
```

### Get All Active Vault Items
```typescript
const items = await VaultRepository.getActiveVaultItems();
console.log(`${items.length} items available in vault`);
```

### Get Items by Rarity
```typescript
const rareItems = await VaultRepository.getVaultItemsByRarity('rare');
const commonItems = await VaultRepository.getVaultItemsByRarity('common');
```

### Get Monetization Items (Keys/Boosters)
```typescript
const monetizationItems = await VaultRepository.getMonetizationItems();
```

### User Vault Profile
```typescript
import { useAuth } from '@contexts/AuthContext';

const { user } = useAuth();

// Get user's vault profile
const profile = await VaultRepository.getUserVaultProfile(user.uid);
if (profile) {
  console.log(`XP Balance: ${profile.xpBalance}`);
  console.log(`Keys Balance: ${profile.keysBalance}`);
}

// Update user's vault profile
const updated = await VaultRepository.upsertUserVaultProfile({
  userId: user.uid,
  xpBalance: 1500,
  keysBalance: 3,
  totalXpEarned: 2000,
  totalKeysEarned: 5,
  totalXpSpent: 500,
  totalKeysSpent: 2,
  unlockedItems: [],
  updatedAt: new Date().toISOString()
});
```

---

## 📖 Curriculum Repository

### Get All Modules
```typescript
import { CurriculumRepository } from '@repos/supabase';

const modules = await CurriculumRepository.getAllModules();
console.log(`${modules.length} learning modules`);
```

### Get Module by ID
```typescript
const module = await CurriculumRepository.getModuleById('ch1-basics');
```

### Get Lessons for a Module
```typescript
const lessons = await CurriculumRepository.getLessonsByModuleId('ch1-basics');
```

### Get Lesson Items (Quiz Questions)
```typescript
const lesson = await CurriculumRepository.getLessonById('l1-intro');
if (lesson) {
  const items = await CurriculumRepository.getItemsByIds(lesson.itemIds);
  console.log(`${items.length} quiz questions in this lesson`);
}
```

---

## 🔄 Replacing Local Data

### Before (using local data):
```typescript
// ❌ Old way - loads all data into memory
import { ALL_COCKTAILS } from '@/data/cocktails';

function RecipesScreen() {
  const [recipes, setRecipes] = useState(ALL_COCKTAILS);
  // ...
}
```

### After (using Supabase):
```typescript
// ✅ New way - fetches from Supabase
import { RecipesRepository } from '@repos/supabase';

function RecipesScreen() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRecipes() {
      const data = await RecipesRepository.getAllRecipes();
      setRecipes(data);
      setLoading(false);
    }
    loadRecipes();
  }, []);

  if (loading) return <ActivityIndicator />;
  // ...
}
```

---

## 🎯 Benefits

✅ **Reduced App Size** - Data lives in cloud, not bundled in app
✅ **Live Updates** - Update recipes/vault items without app updates
✅ **Scalability** - Add hundreds of recipes without impacting app size
✅ **Better Performance** - Load only what you need, when you need it
✅ **Search & Filter** - Powerful database queries instead of array filtering

---

## 📊 Current Data in Supabase

- ✅ **13 Modules** - Learning curriculum modules
- ✅ **17 Lessons** - Individual lessons
- ✅ **101 Quiz Items** - Interactive questions
- ✅ **90 Recipes** - Cocktails and syrups
- ✅ **1 Vault Cycle** - Current active cycle
- ✅ **10 Vault Items** - Redeemable items
- ✅ **6 Monetization Items** - Keys/boosters for purchase

---

## 🛠️ Useful Commands

```bash
# Verify all data
npm run supabase:verify

# Re-migrate recipes
npm run supabase:migrate-recipes

# Re-migrate vault items
npm run supabase:migrate-vault

# Re-migrate curriculum
npm run supabase:migrate
```

---

## 🔐 Security

All repositories use the anonymous key from your .env:
```
EXPO_PUBLIC_SUPABASE_ANON_KEY=...
```

Row Level Security (RLS) policies ensure:
- ✅ Anyone can read public recipes, vault items, curriculum
- ✅ Users can only read/write their own profiles
- ✅ Sensitive operations require authentication

---

## 📱 Example: Recipe Detail Screen

```typescript
import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { RecipesRepository } from '@repos/supabase';
import { Recipe } from '@/types/recipe';

export function RecipeDetailScreen({ route }) {
  const { recipeId } = route.params;
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRecipe() {
      const data = await RecipesRepository.getRecipeById(recipeId);
      setRecipe(data);
      setLoading(false);
    }
    loadRecipe();
  }, [recipeId]);

  if (loading) return <ActivityIndicator />;
  if (!recipe) return <Text>Recipe not found</Text>;

  return (
    <View>
      <Text style={{ fontSize: 24 }}>{recipe.title}</Text>
      <Text>{recipe.description}</Text>
      {/* Render ingredients, instructions, etc */}
    </View>
  );
}
```

---

Happy coding! 🚀
