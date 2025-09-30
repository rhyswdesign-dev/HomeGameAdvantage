export interface GroceryItem {
  id: string;
  name: string;
  category: 'spirits_liquors' | 'mixers' | 'garnish' | 'bitters' | 'syrup' | 'other';
  subcategory?: string;
  brand?: string;
  size?: string;
  notes?: string;
  checked: boolean;
  estimatedPrice?: number;
  whereToFind?: string;
  isCompleted?: boolean;
}

export interface GroceryList {
  id: string;
  name: string;
  recipeIds: string[];
  items: GroceryItem[];
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

/**
 * Grocery List Service
 * Handles creating grocery lists from recipe ingredients
 */
export class GroceryListService {

  /**
   * Generate grocery list from recipe ingredients
   */
  static generateGroceryList(
    recipeName: string,
    ingredients: string[] | { name: string; note?: string }[],
    recipeId?: string
  ): Omit<GroceryList, 'id' | 'createdAt' | 'updatedAt' | 'userId'> {
    const items: GroceryItem[] = (ingredients || []).map((ingredient, index) => {
      // Handle both string and object formats
      let ingredientStr: string;
      let recipeNote: string | undefined;

      if (typeof ingredient === 'string') {
        ingredientStr = ingredient;
        recipeNote = undefined;
      } else {
        ingredientStr = ingredient.name;
        recipeNote = ingredient.note;
      }

      const parsed = this.parseIngredient(ingredientStr);
      const category = this.categorizeIngredient(parsed.name);
      const subcategory = this.getSubcategory(parsed.name);
      const uniqueId = `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}_${index}`;

      // Combine recipe note with parsed notes
      const combinedNotes = recipeNote
        ? (parsed.notes ? `${recipeNote} • ${parsed.notes}` : recipeNote)
        : parsed.notes;

      return {
        id: uniqueId,
        name: parsed.name,
        category,
        subcategory,
        brand: parsed.brand || 'Unknown',
        size: parsed.size,
        notes: combinedNotes,
        checked: false,
        estimatedPrice: this.estimatePrice(parsed.name, parsed.size),
        whereToFind: this.getWhereToFind(category),
      };
    });

    return {
      name: `${recipeName} - Shopping List`,
      recipeIds: recipeId ? [recipeId] : [],
      items,
    };
  }

  /**
   * Parse ingredient string to extract components
   */
  private static parseIngredient(ingredient: string | any): {
    name: string;
    amount?: string;
    unit?: string;
    brand?: string;
    size?: string;
    notes?: string;
  } {
    // Extract ingredient string from both formats
    let ingredientStr: string;
    if (typeof ingredient === 'string') {
      ingredientStr = ingredient;
    } else if (ingredient && typeof ingredient === 'object' && ingredient.name) {
      ingredientStr = ingredient.name;
    } else {
      ingredientStr = String(ingredient || '');
    }

    // Remove common measurements and extract core ingredient
    const measurementPattern = /^(\d+(?:\.\d+)?(?:\/\d+)?)\s*(oz|ml|cl|tsp|tbsp|dash|drop|splash|bottle|can)?\s*/i;
    const brandPattern = /\b([A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z]+)*)\s+(vodka|gin|rum|whiskey|bourbon|rye|tequila|brandy|cognac|liqueur)/i;

    let cleaned = ingredientStr.trim();
    let amount, unit, brand;

    // Extract measurement
    const measureMatch = cleaned.match(measurementPattern);
    if (measureMatch) {
      amount = measureMatch[1];
      unit = measureMatch[2];
      cleaned = cleaned.replace(measurementPattern, '').trim();
    }

    // Extract brand
    const brandMatch = cleaned.match(brandPattern);
    if (brandMatch) {
      brand = brandMatch[1];
      cleaned = cleaned.replace(brandMatch[1], '').trim();
    }

    // Clean up the name but preserve core ingredient names
    let name = cleaned
      .replace(/\b(fresh|freshly|squeezed|homemade)\b/gi, '')
      .replace(/\s+/g, ' ')
      .trim();

    // If name is empty or too short, use the original ingredient name without measurements
    if (!name || name.length < 3) {
      name = ingredientStr.replace(measurementPattern, '').trim();
    }

    // Capitalize first letter of each word for better presentation
    name = name.replace(/\b\w+/g, word =>
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    );

    const size = amount && unit ? `${amount} ${unit}` : undefined;

    return {
      name: name || ingredientStr,
      amount,
      unit,
      brand,
      size,
      notes: this.generateNotes(ingredientStr),
    };
  }

  /**
   * Categorize ingredient by type
   */
  private static categorizeIngredient(ingredient: string): GroceryItem['category'] {
    const lowerCase = ingredient.toLowerCase();

    // Spirits & Liquors (including vermouths)
    if (lowerCase.match(/(vodka|gin|rum|whiskey|bourbon|rye|tequila|brandy|cognac|mezcal|absinthe|scotch|vermouth)/)) {
      return 'spirits_liquors';
    }

    // Bitters
    if (lowerCase.match(/(bitters|angostura|peychaud|orange bitters|walnut bitters)/)) {
      return 'bitters';
    }

    // Syrups
    if (lowerCase.match(/(syrup|simple syrup|grenadine|orgeat|falernum|honey|agave)/)) {
      return 'syrup';
    }

    // Mixers (removed vermouth from here)
    if (lowerCase.match(/(juice|soda|tonic|ginger beer|club soda|cola|wine|champagne|prosecco|beer)/)) {
      return 'mixers';
    }

    // Garnishes
    if (lowerCase.match(/(peel|twist|cherry|olive|lime|lemon|orange|mint|basil|cucumber|salt|sugar)/)) {
      return 'garnish';
    }

    return 'other';
  }

  /**
   * Get specific subcategory for spirits
   */
  private static getSubcategory(ingredient: string): string | undefined {
    const lowerCase = ingredient.toLowerCase();

    // Spirits - return specific type
    if (lowerCase.match(/vodka/)) return 'vodka';
    if (lowerCase.match(/gin/)) return 'gin';
    if (lowerCase.match(/rum/)) return 'rum';
    if (lowerCase.match(/(whiskey|bourbon|rye|scotch)/)) return 'whiskey';
    if (lowerCase.match(/tequila/)) return 'tequila';
    if (lowerCase.match(/(brandy|cognac)/)) return 'brandy';
    if (lowerCase.match(/mezcal/)) return 'mezcal';
    if (lowerCase.match(/absinthe/)) return 'absinthe';
    if (lowerCase.match(/vermouth/)) {
      if (lowerCase.match(/dry/)) return 'dry vermouth';
      if (lowerCase.match(/sweet/)) return 'sweet vermouth';
      return 'vermouth';
    }

    // Liqueurs
    if (lowerCase.match(/cointreau|triple sec|grand marnier/)) return 'orange liqueur';
    if (lowerCase.match(/kahlua|coffee liqueur/)) return 'coffee liqueur';
    if (lowerCase.match(/amaretto/)) return 'amaretto';
    if (lowerCase.match(/chambord/)) return 'raspberry liqueur';

    return undefined;
  }

  /**
   * Estimate price for ingredient
   */
  private static estimatePrice(ingredient: string, size?: string): number | undefined {
    const lowerCase = ingredient.toLowerCase();

    // Vermouths (specific pricing)
    if (lowerCase.includes('vermouth')) {
      const vermouthPrices: { [key: string]: number } = {
        'dry vermouth': 15,
        'sweet vermouth': 18,
        'dolin dry': 16,
        'dolin rouge': 18,
        'carpano antica': 35,
        'noilly prat': 15,
        'martini & rossi': 12,
        'cinzano': 14,
      };

      // Find matching vermouth price
      for (const [key, price] of Object.entries(vermouthPrices)) {
        if (lowerCase.includes(key)) {
          return price;
        }
      }

      // Default vermouth price
      return 16;
    }

    // Spirits (typically $20-80)
    if (lowerCase.match(/(vodka|gin|rum|whiskey|bourbon|rye|tequila|brandy|cognac)/)) {
      return Math.round(Math.random() * 60 + 20);
    }

    // Liqueurs ($15-50)
    if (lowerCase.match(/(liqueur|cointreau|grand marnier|kahlua|bailey|amaretto)/)) {
      return Math.round(Math.random() * 35 + 15);
    }

    // Mixers ($2-8)
    if (lowerCase.match(/(juice|soda|tonic|ginger beer|club soda)/)) {
      return Math.round(Math.random() * 6 + 2);
    }

    // Bitters ($8-20)
    if (lowerCase.match(/bitters/)) {
      return Math.round(Math.random() * 12 + 8);
    }

    // Syrups ($5-15)
    if (lowerCase.match(/syrup/)) {
      return Math.round(Math.random() * 10 + 5);
    }

    // Garnishes ($1-8)
    if (lowerCase.match(/(peel|cherry|olive|lime|lemon|orange|mint|salt|sugar)/)) {
      return Math.round(Math.random() * 7 + 1);
    }

    return undefined;
  }

  /**
   * Get suggestions for where to find ingredient
   */
  private static getWhereToFind(category: GroceryItem['category']): string {
    switch (category) {
      case 'spirits_liquors':
        return 'Liquor store, Wine & Spirits section';
      case 'mixers':
        return 'Beverage aisle, Wine & Spirits section';
      case 'bitters':
        return 'Liquor store, Cocktail supplies section';
      case 'syrup':
        return 'Coffee aisle, Cocktail supplies, Liquor store';
      case 'garnish':
        return 'Produce section, Condiments aisle';
      default:
        return 'Check multiple sections';
    }
  }

  /**
   * Generate helpful notes for ingredient
   */
  private static generateNotes(ingredient: string): string | undefined {
    const lowerCase = ingredient.toLowerCase();

    if (lowerCase.includes('fresh')) {
      return 'Get fresh - avoid bottled when possible';
    }

    if (lowerCase.includes('simple syrup')) {
      return 'Can make at home: 1:1 sugar and water';
    }

    if (lowerCase.includes('angostura bitters')) {
      return 'Small bottle lasts a long time';
    }

    if (lowerCase.match(/(peel|twist)/)) {
      return 'Just need the fruit for peel';
    }

    if (lowerCase.includes('egg white')) {
      return 'Buy whole eggs, use whites only';
    }

    return undefined;
  }

  /**
   * Combine grocery lists (for multiple recipes)
   */
  static combineGroceryLists(lists: GroceryList[]): GroceryList {
    if (lists.length === 0) {
      throw new Error('Cannot combine empty grocery lists');
    }

    if (lists.length === 1) {
      return lists[0];
    }

    const combinedItems: GroceryItem[] = [];
    const seenIngredients = new Set<string>();

    lists.forEach(list => {
      list.items.forEach(item => {
        const key = item.name.toLowerCase();
        if (!seenIngredients.has(key)) {
          seenIngredients.add(key);
          combinedItems.push({ ...item });
        } else {
          // Find existing item and potentially merge notes
          const existing = combinedItems.find(i => i.name.toLowerCase() === key);
          if (existing && item.notes && existing.notes !== item.notes) {
            existing.notes = `${existing.notes}; ${item.notes}`;
          }
        }
      });
    });

    return {
      id: `combined-${Date.now()}`,
      name: 'Combined Shopping List',
      recipeIds: lists.flatMap(l => l.recipeIds),
      items: combinedItems,
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: lists[0].userId,
    };
  }

  /**
   * Calculate total estimated cost
   */
  static calculateTotalCost(groceryList: GroceryList): number {
    return groceryList.items.reduce((total, item) => {
      return total + (item.estimatedPrice || 0);
    }, 0);
  }

  /**
   * Group items by category
   */
  static groupByCategory(groceryList: GroceryList): Record<string, GroceryItem[]> {
    return groceryList.items.reduce((groups, item) => {
      const category = item.category;
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(item);
      return groups;
    }, {} as Record<string, GroceryItem[]>);
  }

  /**
   * Get category display names
   */
  static getCategoryDisplayName(category: GroceryItem['category']): string {
    switch (category) {
      case 'spirits_liquors':
        return 'Spirits & Liquors';
      case 'mixers':
        return 'Mixers & Beverages';
      case 'bitters':
        return 'Bitters & Modifiers';
      case 'syrup':
        return 'Syrups & Sweeteners';
      case 'garnish':
        return 'Garnishes & Fresh';
      case 'other':
        return 'Other Items';
      default:
        return 'Uncategorized';
    }
  }
}