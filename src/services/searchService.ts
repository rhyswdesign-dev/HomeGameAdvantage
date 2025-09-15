export interface SearchableItem {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  category: 'recipe' | 'spirit' | 'event' | 'user' | 'bar' | 'game';
  tags: string[];
  difficulty?: 'easy' | 'medium' | 'hard';
  abv?: number;
  time?: number; // in minutes
  popularity?: number; // 0-100 score
  image?: string;
  data: any; // Original data object
}

export interface FilterOptions {
  categories: string[];
  difficulties: string[];
  abvRange: [number, number];
  timeRange: [number, number];
  sortBy: 'relevance' | 'popularity' | 'recent' | 'difficulty' | 'time' | 'abv';
  sortOrder: 'asc' | 'desc';
}

class SearchService {
  private searchIndex: SearchableItem[] = [];

  // Initialize with sample data
  constructor() {
    this.initializeSearchIndex();
  }

  private initializeSearchIndex() {
    // Sample recipes
    const recipes: SearchableItem[] = [
      {
        id: 'old-fashioned',
        title: 'Old Fashioned',
        subtitle: 'Classic • Whiskey-based',
        description: 'A timeless cocktail made with whiskey, sugar, bitters, and an orange twist.',
        category: 'recipe',
        tags: ['classic', 'whiskey', 'simple', 'stirred'],
        difficulty: 'easy',
        abv: 35,
        time: 3,
        popularity: 95,
        image: 'https://images.unsplash.com/photo-1536935338788-846bb9981813?auto=format&fit=crop&w=400&q=60',
        data: { ingredients: ['whiskey', 'sugar', 'bitters', 'orange'], type: 'stirred' }
      },
      {
        id: 'espresso-martini',
        title: 'Espresso Martini',
        subtitle: 'Modern • Vodka-based',
        description: 'A sophisticated coffee cocktail with vodka, coffee liqueur, and fresh espresso.',
        category: 'recipe',
        tags: ['modern', 'vodka', 'coffee', 'shaken'],
        difficulty: 'medium',
        abv: 28,
        time: 5,
        popularity: 88,
        image: 'https://images.unsplash.com/photo-1609951651556-5334e2706168?auto=format&fit=crop&w=400&q=60',
        data: { ingredients: ['vodka', 'coffee liqueur', 'espresso'], type: 'shaken' }
      }
    ];

    // Sample spirits
    const spirits: SearchableItem[] = [
      {
        id: 'macallan-18',
        title: 'Macallan 18 Year',
        subtitle: 'Single Malt Scotch Whisky',
        description: 'Rich, complex whisky with notes of dried fruits, honey, and oak.',
        category: 'spirit',
        tags: ['scotch', 'whisky', 'aged', 'premium'],
        abv: 43,
        popularity: 92,
        image: 'https://images.unsplash.com/photo-1569529465841-dfecdab7503b?auto=format&fit=crop&w=400&q=60',
        data: { type: 'whisky', origin: 'Scotland', age: 18 }
      },
      {
        id: 'hendricks-gin',
        title: "Hendrick's Gin",
        subtitle: 'Small Batch Gin',
        description: 'Distinctive gin infused with cucumber and rose petals.',
        category: 'spirit',
        tags: ['gin', 'botanical', 'premium', 'unique'],
        abv: 44,
        popularity: 85,
        image: 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?auto=format&fit=crop&w=400&q=60',
        data: { type: 'gin', origin: 'Scotland', botanicals: ['cucumber', 'rose'] }
      }
    ];

    // Sample events
    const events: SearchableItem[] = [
      {
        id: 'mixology-masterclass',
        title: 'Mixology Master Class',
        subtitle: 'March 15, 2025 • 7:00 PM',
        description: 'Learn advanced cocktail techniques from expert mixologists.',
        category: 'event',
        tags: ['education', 'mixology', 'advanced', 'hands-on'],
        difficulty: 'medium',
        time: 120,
        popularity: 78,
        image: 'https://images.unsplash.com/photo-1574671928146-5c89a22b2e85?auto=format&fit=crop&w=400&q=60',
        data: { date: '2025-03-15', duration: 120, type: 'workshop' }
      }
    ];

    // Sample users
    const users: SearchableItem[] = [
      {
        id: 'sarah-chen',
        title: 'Sarah Chen',
        subtitle: '@cocktail_sarah',
        description: 'Professional bartender at The Alchemist',
        category: 'user',
        tags: ['bartender', 'professional', 'verified'],
        popularity: 94,
        image: 'https://images.unsplash.com/photo-1494790108755-2616b612b359?auto=format&fit=crop&w=400&q=60',
        data: { username: 'cocktail_sarah', verified: true, location: 'New York' }
      }
    ];

    this.searchIndex = [...recipes, ...spirits, ...events, ...users];
  }

  // Search with query
  search(query: string, filters?: Partial<FilterOptions>): SearchableItem[] {
    if (!query.trim() && !filters) {
      return this.searchIndex.slice(0, 20); // Return top 20 by popularity
    }

    let results = this.searchIndex;

    // Apply text search
    if (query.trim()) {
      const searchTerms = query.toLowerCase().split(' ');
      results = results.filter(item => {
        const searchableText = [
          item.title,
          item.subtitle,
          item.description,
          ...item.tags
        ].join(' ').toLowerCase();

        return searchTerms.some(term => searchableText.includes(term));
      });
    }

    // Apply filters
    if (filters) {
      results = this.applyFilters(results, filters);
    }

    // Apply sorting
    const sortBy = filters?.sortBy || 'relevance';
    const sortOrder = filters?.sortOrder || 'desc';
    results = this.sortResults(results, sortBy, sortOrder, query);

    return results.slice(0, 50); // Limit to 50 results
  }

  private applyFilters(items: SearchableItem[], filters: Partial<FilterOptions>): SearchableItem[] {
    let filtered = items;

    if (filters.categories && filters.categories.length > 0) {
      filtered = filtered.filter(item => filters.categories!.includes(item.category));
    }

    if (filters.difficulties && filters.difficulties.length > 0) {
      filtered = filtered.filter(item => 
        item.difficulty && filters.difficulties!.includes(item.difficulty)
      );
    }

    if (filters.abvRange) {
      const [min, max] = filters.abvRange;
      filtered = filtered.filter(item => 
        item.abv !== undefined && item.abv >= min && item.abv <= max
      );
    }

    if (filters.timeRange) {
      const [min, max] = filters.timeRange;
      filtered = filtered.filter(item => 
        item.time !== undefined && item.time >= min && item.time <= max
      );
    }

    return filtered;
  }

  private sortResults(
    items: SearchableItem[], 
    sortBy: FilterOptions['sortBy'], 
    sortOrder: FilterOptions['sortOrder'],
    query?: string
  ): SearchableItem[] {
    const sorted = [...items];

    sorted.sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case 'popularity':
          comparison = (b.popularity || 0) - (a.popularity || 0);
          break;
        case 'difficulty':
          const difficultyOrder = { easy: 1, medium: 2, hard: 3 };
          comparison = (difficultyOrder[a.difficulty || 'easy']) - (difficultyOrder[b.difficulty || 'easy']);
          break;
        case 'time':
          comparison = (a.time || 0) - (b.time || 0);
          break;
        case 'abv':
          comparison = (a.abv || 0) - (b.abv || 0);
          break;
        case 'recent':
          // For now, use popularity as proxy for recency
          comparison = (b.popularity || 0) - (a.popularity || 0);
          break;
        case 'relevance':
        default:
          // Simple relevance based on title match
          if (query) {
            const aRelevance = a.title.toLowerCase().includes(query.toLowerCase()) ? 1 : 0;
            const bRelevance = b.title.toLowerCase().includes(query.toLowerCase()) ? 1 : 0;
            comparison = bRelevance - aRelevance;
            if (comparison === 0) {
              comparison = (b.popularity || 0) - (a.popularity || 0);
            }
          } else {
            comparison = (b.popularity || 0) - (a.popularity || 0);
          }
          break;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return sorted;
  }

  // Get filter options based on current search results
  getFilterOptions(query?: string): {
    categories: { key: string; label: string; count: number }[];
    difficulties: { key: string; label: string; count: number }[];
    abvRange: [number, number];
    timeRange: [number, number];
  } {
    const currentResults = query ? this.search(query) : this.searchIndex;

    // Count categories
    const categoryCounts = currentResults.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const categories = Object.entries(categoryCounts).map(([key, count]) => ({
      key,
      label: key.charAt(0).toUpperCase() + key.slice(1),
      count
    }));

    // Count difficulties
    const difficultyCounts = currentResults.reduce((acc, item) => {
      if (item.difficulty) {
        acc[item.difficulty] = (acc[item.difficulty] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    const difficulties = Object.entries(difficultyCounts).map(([key, count]) => ({
      key,
      label: key.charAt(0).toUpperCase() + key.slice(1),
      count
    }));

    // Calculate ranges
    const abvValues = currentResults.map(item => item.abv).filter(Boolean) as number[];
    const timeValues = currentResults.map(item => item.time).filter(Boolean) as number[];

    const abvRange: [number, number] = abvValues.length > 0 
      ? [Math.min(...abvValues), Math.max(...abvValues)]
      : [0, 50];

    const timeRange: [number, number] = timeValues.length > 0
      ? [Math.min(...timeValues), Math.max(...timeValues)]
      : [0, 60];

    return {
      categories,
      difficulties,
      abvRange,
      timeRange
    };
  }

  // Add new item to search index
  addToIndex(item: SearchableItem): void {
    this.searchIndex.push(item);
  }

  // Update existing item in search index
  updateInIndex(id: string, updates: Partial<SearchableItem>): void {
    const index = this.searchIndex.findIndex(item => item.id === id);
    if (index !== -1) {
      this.searchIndex[index] = { ...this.searchIndex[index], ...updates };
    }
  }

  // Remove item from search index
  removeFromIndex(id: string): void {
    this.searchIndex = this.searchIndex.filter(item => item.id !== id);
  }
}

export const searchService = new SearchService();