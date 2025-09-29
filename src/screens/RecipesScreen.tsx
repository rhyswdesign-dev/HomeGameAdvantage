import React, { useState, useLayoutEffect, useEffect, useCallback } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Pressable,
  Alert,
  TextInput,
  Keyboard,
} from 'react-native';
import { colors, spacing, radii, fonts } from '../theme/tokens';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import PillButton from '../components/PillButton';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import type { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/RootNavigator';
import { useSavedItems } from '../hooks/useSavedItems';
import { getUserRecipes, Recipe, deleteRecipe } from '../lib/firestore';
import { auth } from '../config/firebase';
import GroceryListModal from '../components/GroceryListModal';
import { recommendationEngine, type RecommendationSet, type Recommendation } from '../services/recommendationEngine';
import { AIRecipeFormatter } from '../services/aiRecipeFormatter';
import { searchService, type SearchableItem } from '../services/searchService';

const chips: Array<{ key: string; label: string }> = [
  { key: 'For You', label: 'For You' },
  { key: 'AI Suggestions', label: 'AI Suggestions' },
  { key: 'Cocktails', label: 'Cocktails' },
  { key: 'Shots', label: 'Shots' },
  { key: 'Mocktails', label: 'Mocktails' },
  { key: 'My Recipes', label: 'My Recipes' },
  { key: 'Home Bar', label: 'Home Bar' },
];

const classicCocktails = [
  {
    id: 'old-fashioned',
    name: 'Old Fashioned',
    title: 'Old Fashioned',
    subtitle: 'Classic • Whiskey-based',
    category: 'Cocktails',
    image: 'https://images.unsplash.com/photo-1536935338788-846bb9981813?auto=format&fit=crop&w=1200&q=60',
    img: 'https://images.unsplash.com/photo-1536935338788-846bb9981813?auto=format&fit=crop&w=1200&q=60',
    difficulty: 'Easy',
    time: '3 min',
    rating: 4.7,
    ingredients: [
      { name: '2 oz Whiskey', note: 'Bourbon or Rye preferred' },
      { name: '1/4 oz Simple Syrup', note: 'Or 1 sugar cube' },
      { name: '2 dashes Angostura Bitters', note: 'Essential for flavor' },
      { name: 'Orange Peel', note: 'For garnish and aroma' }
    ],
    description: 'A timeless cocktail made with whiskey, sugar, bitters, and an orange twist.',
  },
  {
    id: 'manhattan',
    name: 'Manhattan',
    title: 'Manhattan',
    subtitle: 'Classic • Whiskey-based',
    category: 'Cocktails',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=1200&q=60',
    img: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=1200&q=60',
    difficulty: 'Easy',
    time: '2 min',
    rating: 4.8,
    ingredients: [
      { name: '2 oz Rye Whiskey', note: 'Bourbon also works well' },
      { name: '1 oz Sweet Vermouth', note: 'Quality matters here' },
      { name: '2 dashes Angostura Bitters', note: 'Classic choice' },
      { name: 'Maraschino Cherry', note: 'For garnish' }
    ],
    description: 'An elegant mix of whiskey, sweet vermouth, and bitters, garnished with a cherry.',
  },
  {
    id: 'negroni',
    name: 'Negroni',
    title: 'Negroni',
    subtitle: 'Classic • Gin-based',
    category: 'Cocktails',
    image: 'https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?auto=format&fit=crop&w=1200&q=60',
    img: 'https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?auto=format&fit=crop&w=1200&q=60',
    difficulty: 'Easy',
    time: '2 min',
    rating: 4.6,
    ingredients: [
      { name: '1 oz Gin', note: 'London Dry style preferred' },
      { name: '1 oz Campari', note: 'The signature bitter element' },
      { name: '1 oz Sweet Vermouth', note: 'Balances the bitterness' },
      { name: 'Orange Peel', note: 'Essential garnish' }
    ],
    description: 'A bitter and sweet Italian cocktail with gin, Campari, and sweet vermouth.',
  },
  {
    id: 'espresso-martini',
    name: 'Espresso Martini',
    title: 'Espresso Martini',
    subtitle: 'Modern • Vodka-based',
    category: 'Cocktails',
    image: 'https://images.unsplash.com/photo-1609951651556-5334e2706168?auto=format&fit=crop&w=1200&q=60',
    img: 'https://images.unsplash.com/photo-1609951651556-5334e2706168?auto=format&fit=crop&w=1200&q=60',
    difficulty: 'Medium',
    time: '5 min',
    rating: 4.9,
    ingredients: [
      { name: '2 oz Vodka', note: 'Premium vodka recommended' },
      { name: '1/2 oz Coffee Liqueur', note: 'Kahlúa or similar' },
      { name: '1 shot Fresh Espresso', note: 'Must be fresh and hot' },
      { name: '1/4 oz Simple Syrup', note: 'Optional, to taste' }
    ],
    description: 'A sophisticated coffee cocktail with vodka, coffee liqueur, and fresh espresso.',
  },
  {
    id: 'mojito',
    name: 'Mojito',
    title: 'Mojito',
    subtitle: 'Classic • Rum-based',
    category: 'Cocktails',
    image: 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?q=80&w=1200&auto=format&fit=crop',
    img: 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?q=80&w=1200&auto=format&fit=crop',
    difficulty: 'Easy',
    time: '3 min',
    rating: 4.5,
    ingredients: [
      { name: '2 oz White Rum', note: 'Light rum preferred' },
      { name: '1 oz Fresh Lime Juice', note: 'Freshly squeezed' },
      { name: '2 tsp Sugar', note: 'Or 1/2 oz simple syrup' },
      { name: '8-10 Mint Leaves', note: 'Fresh mint only' },
      { name: 'Soda Water', note: '2-3 oz to top' }
    ],
    description: 'A refreshing Cuban cocktail with white rum, fresh mint, lime juice, sugar, and soda water.',
  },
  {
    id: 'daiquiri',
    name: 'Daiquiri',
    title: 'Daiquiri',
    subtitle: 'Classic • Rum-based',
    category: 'Cocktails',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=1200&auto=format&fit=crop',
    img: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=1200&auto=format&fit=crop',
    difficulty: 'Easy',
    time: '2 min',
    rating: 4.4,
    ingredients: [
      { name: '2 oz White Rum', note: 'Quality white rum' },
      { name: '1 oz Fresh Lime Juice', note: 'Freshly squeezed' },
      { name: '3/4 oz Simple Syrup', note: 'Adjust to taste' }
    ],
    description: 'A simple yet perfect cocktail with white rum, lime juice, and simple syrup.',
  },
  {
    id: 'margarita',
    name: 'Margarita',
    title: 'Margarita',
    subtitle: 'Classic • Tequila-based',
    category: 'Cocktails',
    image: 'https://images.unsplash.com/photo-1541976076758-347942db1978?q=80&w=1200&auto=format&fit=crop',
    img: 'https://images.unsplash.com/photo-1541976076758-347942db1978?q=80&w=1200&auto=format&fit=crop',
    difficulty: 'Easy',
    time: '3 min',
    rating: 4.6,
    ingredients: [
      { name: '2 oz Blanco Tequila', note: '100% agave preferred' },
      { name: '1 oz Fresh Lime Juice', note: 'Freshly squeezed' },
      { name: '3/4 oz Orange Liqueur', note: 'Cointreau or Triple Sec' },
      { name: 'Salt', note: 'For rim' }
    ],
    description: 'The quintessential tequila cocktail with lime juice, orange liqueur, and a salted rim.',
  },
  {
    id: 'cosmopolitan',
    name: 'Cosmopolitan',
    title: 'Cosmopolitan',
    subtitle: 'Modern • Vodka-based',
    category: 'Cocktails',
    image: 'https://images.unsplash.com/photo-1609951651556-5334e2706168?q=80&w=1200&auto=format&fit=crop',
    img: 'https://images.unsplash.com/photo-1609951651556-5334e2706168?q=80&w=1200&auto=format&fit=crop',
    difficulty: 'Easy',
    time: '2 min',
    rating: 4.3,
    ingredients: [
      { name: '1.5 oz Vodka', note: 'Premium vodka preferred' },
      { name: '1/2 oz Orange Liqueur', note: 'Cointreau or Triple Sec' },
      { name: '1/2 oz Fresh Lime Juice', note: 'Freshly squeezed' },
      { name: '1/4 oz Cranberry Juice', note: 'For color and flavor' }
    ],
    description: 'A glamorous pink cocktail with vodka, cranberry juice, lime juice, and orange liqueur.',
  },
  {
    id: 'moscow-mule',
    name: 'Moscow Mule',
    title: 'Moscow Mule',
    subtitle: 'Classic • Vodka-based',
    category: 'Cocktails',
    image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?q=80&w=1200&auto=format&fit=crop',
    img: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?q=80&w=1200&auto=format&fit=crop',
    difficulty: 'Easy',
    time: '2 min',
    rating: 4.4,
    ingredients: [
      { name: '2 oz Vodka', note: 'Quality vodka' },
      { name: '1/2 oz Fresh Lime Juice', note: 'Freshly squeezed' },
      { name: '4-6 oz Ginger Beer', note: 'Spicy ginger beer preferred' },
      { name: 'Lime Wedge', note: 'For garnish' }
    ],
    description: 'A refreshing cocktail with vodka, ginger beer, and lime juice, traditionally served in a copper mug.',
  },
  {
    id: 'classic-martini',
    name: 'Classic Martini',
    title: 'Classic Martini',
    subtitle: 'Classic • Gin-based',
    category: 'Cocktails',
    image: 'https://images.unsplash.com/photo-1541976076758-347942db1978?q=80&w=1200&auto=format&fit=crop',
    img: 'https://images.unsplash.com/photo-1541976076758-347942db1978?q=80&w=1200&auto=format&fit=crop',
    difficulty: 'Easy',
    time: '2 min',
    rating: 4.8,
    ingredients: [
      { name: '2 oz Gin', note: 'London Dry preferred' },
      { name: '1/2 oz Dry Vermouth', note: 'Quality matters' },
      { name: 'Olive or Lemon Twist', note: 'For garnish' }
    ],
    description: 'A timeless classic cocktail with gin and dry vermouth.',
  },
];

const sampleRecipes = [
  {
    id: 'virgin-mojito',
    name: 'Virgin Mojito',
    title: 'Virgin Mojito',
    subtitle: 'Non-Alcoholic • Refreshing',
    category: 'Mocktails',
    image: 'https://images.unsplash.com/photo-1497534547324-0ebb3f052e88?q=80&w=1200&auto=format&fit=crop',
    img: 'https://images.unsplash.com/photo-1497534547324-0ebb3f052e88?q=80&w=1200&auto=format&fit=crop',
    difficulty: 'Easy',
    time: '2 min',
    rating: 4.6,
    ingredients: [
      { name: 'Fresh Lime Juice', note: '1 oz freshly squeezed' },
      { name: 'Mint Leaves', note: '8-10 fresh leaves' },
      { name: 'Simple Syrup', note: '1/2 oz to taste' },
      { name: 'Soda Water', note: '4 oz chilled' }
    ],
    description: 'Refreshing non-alcoholic version of the classic mojito.',
  },
];

export default function RecipesScreen() {
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute();
  const [active, setActive] = useState<string>((route.params as any)?.activeTab || 'For You');
  const { toggleSavedCocktail, isCocktailSaved } = useSavedItems();
  const [userRecipes, setUserRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [groceryListVisible, setGroceryListVisible] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<any>(null);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [recommendations, setRecommendations] = useState<RecommendationSet | null>(null);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchableItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  useLayoutEffect(() => {
    nav.setOptions({
      title: 'Recipes',
      headerStyle: { backgroundColor: colors.bg },
      headerTintColor: colors.text,
      headerTitleStyle: { color: colors.text, fontWeight: '900' },
      headerShadowVisible: false,
      headerLeft: () => null,
      headerRight: () => (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing(1) }}>
          <Pressable
            hitSlop={12}
            onPress={() => setShowSearch(!showSearch)}
            style={{ padding: spacing(1) }}
          >
            <Ionicons name="search" size={24} color={showSearch ? colors.accent : colors.text} />
          </Pressable>

          <Pressable
            hitSlop={12}
            onPress={() => nav.navigate('ShoppingCart')}
            style={{ padding: spacing(1) }}
          >
            <Ionicons name="basket" size={24} color={colors.accent} />
          </Pressable>

          <Pressable
            hitSlop={12}
            onPress={() => setDropdownVisible(!dropdownVisible)}
            style={{ padding: spacing(1) }}
          >
            <Ionicons name="add-circle" size={24} color={colors.accent} />
          </Pressable>
        </View>
      ),
    });
  }, [nav, dropdownVisible, showSearch]);

  useFocusEffect(
    useCallback(() => {
      loadUserRecipes();
      loadRecommendations();
    }, [])
  );

  const loadUserRecipes = async () => {
    try {
      setLoading(true);
      const user = auth.currentUser;
      if (user) {
        const recipes = await getUserRecipes(user.uid);
        setUserRecipes(recipes);
      }
    } catch (error) {
      console.error('Error loading user recipes:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadRecommendations = async () => {
    try {
      setLoadingRecommendations(true);
      console.log('🤖 Loading AI recommendations...');

      const recs = await recommendationEngine.getRecommendations({
        availableTime: 'standard',
        currentSkillLevel: 5,
      });

      console.log('✅ AI recommendations loaded:', {
        featured: recs.featured.length,
        forYou: recs.forYou.length,
        quickPicks: recs.quickPicks.length,
        trending: recs.trending.length,
      });

      setRecommendations(recs);
    } catch (error) {
      console.error('❌ Error loading AI recommendations:', error);
    } finally {
      setLoadingRecommendations(false);
    }
  };

  // AI-powered search functionality
  const performAISearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    try {
      setIsSearching(true);
      console.log('🔍 AI Search:', query);

      // Use the search service to get results
      const results = await searchService.search(query, {
        categories: ['recipe'],
        sortBy: 'relevance',
        sortOrder: 'desc',
        showOnlyFavorites: false,
        showOnlyCompleted: false,
      });

      console.log('✅ AI Search Results:', results.length);

      // Record search behavior for AI learning
      await recommendationEngine.recordBehavior({
        type: 'searched',
        query: query,
      });

      setSearchResults(results);
    } catch (error) {
      console.error('❌ AI Search Error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery) {
        performAISearch(searchQuery);
      } else {
        setSearchResults([]);
        setIsSearching(false);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const goto = (key: string) => {
    if (key === 'Home Bar') {
      nav.navigate('HomeBar');
    } else {
      setActive(key);
    }
  };


  const handleDeleteRecipe = async (recipe: any) => {
    if (!recipe.id) return;

    Alert.alert(
      'Delete Recipe',
      `Are you sure you want to delete "${recipe.name || recipe.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteRecipe(recipe.id);
              await loadUserRecipes(); // Refresh the list
              Alert.alert('Success', 'Recipe deleted successfully');
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Failed to delete recipe');
            }
          },
        },
      ]
    );
  };


  const handleCreateShoppingList = (recipe: any) => {
    setSelectedRecipe(recipe);
    setGroceryListVisible(true);
    // Record user behavior for AI learning
    recommendationEngine.recordBehavior({
      type: 'searched',
      query: `shopping_list_${recipe.name}`,
    });
  };

  const handleRecipeView = (recipe: any) => {
    nav.navigate('CocktailDetail', { cocktailId: recipe.id });
    // Record user behavior for AI learning
    recommendationEngine.recordBehavior({
      type: 'completed', // Consider viewing as interest/completion
      itemId: recipe.id,
    });
  };

  const handleSaveRecipe = (recipe: any) => {
    toggleSavedCocktail({
      id: recipe.id,
      name: recipe.name,
      subtitle: recipe.description,
      image: recipe.image
    });
    // Record user behavior for AI learning
    if (!isCocktailSaved(recipe.id)) {
      recommendationEngine.recordBehavior({
        type: 'favorited',
        itemId: recipe.id,
      });
    }
  };

  const dropdownOptions = [
    {
      key: 'voice',
      label: 'Voice Recipe',
      icon: 'mic',
      action: () => nav.navigate('VoiceRecipe')
    },
    {
      key: 'camera',
      label: 'Scan Recipe',
      icon: 'camera',
      action: () => nav.navigate('OCRCapture')
    },
    {
      key: 'add',
      label: 'Add Recipe',
      icon: 'add-circle-outline',
      action: () => nav.navigate('AddRecipe')
    },
  ];

  const handleDropdownOption = (option: typeof dropdownOptions[0]) => {
    setDropdownVisible(false);
    option.action();
  };

  const allRecipes = [...sampleRecipes, ...classicCocktails];

  // Convert AI recommendations to recipe format
  const convertRecommendationToRecipe = (rec: Recommendation) => ({
    id: rec.item.id,
    name: rec.item.title,
    title: rec.item.title,
    subtitle: `${rec.category} • AI Score: ${Math.round(rec.score)}`,
    category: rec.category,
    image: rec.item.data?.imageUrl || rec.item.image || 'https://images.unsplash.com/photo-1497534547324-0ebb3f052e88?q=80&w=1200&auto=format&fit=crop',
    difficulty: rec.item.difficulty || 'Medium',
    time: rec.item.time ? `${rec.item.time} min` : '5 min',
    rating: rec.confidence / 20, // Convert confidence to 1-5 rating scale
    ingredients: rec.item.data?.ingredients || [],
    description: rec.reasons.join(' • '),
  });

  // Convert our recipes to searchable items for better AI recommendations
  const convertRecipeToSearchableItem = (recipe: any) => ({
    id: recipe.id,
    title: recipe.name || recipe.title,
    subtitle: recipe.subtitle,
    description: recipe.description,
    category: 'recipe' as const,
    tags: [recipe.difficulty?.toLowerCase() || 'medium', ...(recipe.ingredients?.map((ing: any) =>
      typeof ing === 'string' ? ing.split(' ').slice(-1)[0].toLowerCase() : ing.name?.split(' ').slice(-1)[0].toLowerCase()
    ).filter(Boolean) || [])],
    difficulty: recipe.difficulty?.toLowerCase() as 'easy' | 'medium' | 'hard' || 'medium',
    time: parseInt(recipe.time) || 5,
    popularity: recipe.rating ? recipe.rating * 20 : 80,
    image: recipe.image,
    data: recipe,
  });

  // Convert SearchableItem to recipe format
  const convertSearchableItemToRecipe = (item: SearchableItem) => ({
    id: item.id,
    name: item.title,
    title: item.title,
    subtitle: item.subtitle || `${item.difficulty} • ${item.time} min`,
    category: 'Search Results',
    image: item.image || item.data?.image || 'https://images.unsplash.com/photo-1497534547324-0ebb3f052e88?q=80&w=1200&auto=format&fit=crop',
    difficulty: item.difficulty || 'medium',
    time: item.time ? `${item.time} min` : '5 min',
    rating: item.popularity ? item.popularity / 20 : 4.0,
    ingredients: item.data?.ingredients || [],
    description: item.description || 'AI-powered search result',
  });

  let filteredRecipes;
  if (active === 'For You') {
    // Show AI-powered recommendations
    if (recommendations) {
      const allRecommendations = [
        ...recommendations.featured,
        ...recommendations.forYou,
        ...recommendations.quickPicks,
        ...recommendations.trending,
      ];

      // Remove duplicates by ID and convert to recipe format
      const seenIds = new Set();
      const uniqueRecommendations = allRecommendations.filter(rec => {
        if (seenIds.has(rec.item.id)) {
          return false;
        }
        seenIds.add(rec.item.id);
        return true;
      });

      filteredRecipes = uniqueRecommendations.map(convertRecommendationToRecipe);
    } else {
      // Fallback to popular classics while loading
      filteredRecipes = classicCocktails.slice(0, 6).map((recipe, index) => ({
        ...recipe,
        id: `loading-${recipe.id}-${index}`, // Ensure unique ID while loading
        subtitle: 'Popular • While AI loads...',
      }));
    }
  } else if (active === 'AI Suggestions') {
    // Show AI-powered contextual suggestions
    if (recommendations) {
      const contextualRecommendations = [
        ...recommendations.challenges,
        ...recommendations.similar,
        ...recommendations.trending.slice(0, 3),
      ];

      // Remove duplicates and convert
      const seenIds = new Set();
      const uniqueSuggestions = contextualRecommendations.filter(rec => {
        if (seenIds.has(rec.item.id)) {
          return false;
        }
        seenIds.add(rec.item.id);
        return true;
      });

      filteredRecipes = uniqueSuggestions.map(rec => ({
        ...convertRecommendationToRecipe(rec),
        subtitle: `${rec.category} • ${rec.reasons[0]}`,
      }));
    } else {
      // Fallback to difficulty-based suggestions
      filteredRecipes = classicCocktails.slice(0, 5).map((recipe, index) => ({
        ...recipe,
        id: `ai-suggest-${recipe.id}-${index}`,
        subtitle: 'AI Suggestion • Try this next',
      }));
    }
  } else if (active === 'My Recipes') {
    // Show only user recipes for "My Recipes" tab
    filteredRecipes = userRecipes.map(recipe => ({
      id: recipe.id || '',
      name: recipe.title || 'Untitled Recipe',
      category: 'My Recipes',
      image: recipe.imageUrl || 'https://images.unsplash.com/photo-1497534547324-0ebb3f052e88?q=80&w=1200&auto=format&fit=crop',
      difficulty: 'Custom',
      time: '5 min',
      rating: 0,
      ingredients: recipe.tags || [],
      description: recipe.sourceUrl ?
        (() => {
          try {
            return `From: ${new URL(recipe.sourceUrl).hostname}`;
          } catch {
            return `Source: ${recipe.sourceUrl}`;
          }
        })()
        : 'Custom recipe',
    }));
  } else {
    filteredRecipes = allRecipes.filter(recipe => recipe.category === active);
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      {/* Dropdown backdrop and menu */}
      {dropdownVisible && (
        <>
          <Pressable
            style={styles.dropdownBackdrop}
            onPress={() => setDropdownVisible(false)}
          />
          <View style={styles.dropdownOverlay}>
            {dropdownOptions.map((option) => (
              <Pressable
                key={option.key}
                style={styles.dropdownItem}
                onPress={() => handleDropdownOption(option)}
              >
                <Ionicons name={option.icon as any} size={18} color={colors.accent} />
                <Text style={styles.dropdownText}>{option.label}</Text>
              </Pressable>
            ))}
          </View>
        </>
      )}

      <ScrollView contentContainerStyle={{ paddingBottom: spacing(8) }}>
        {/* Navigation Chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.chipsContainer}
          contentContainerStyle={styles.chipsRow}
        >
          {chips.map((c) => {
            const isActive = active === c.key;
            return (
              <PillButton
                key={c.key}
                title={c.label}
                onPress={() => goto(c.key)}
                style={!isActive ? { backgroundColor: 'transparent', borderWidth: 1, borderColor: colors.line } : undefined}
                textStyle={!isActive ? { color: colors.text } : undefined}
              />
            );
          })}
        </ScrollView>

        {/* AI Search Bar */}
        {showSearch && (
          <View style={styles.searchContainer}>
            <View style={styles.searchInputContainer}>
              <Ionicons name="search" size={20} color={colors.subtext} style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder={active === 'AI Suggestions' ?
                  "Try 'challenging gin cocktails' or 'beginner friendly drinks'" :
                  "Search recipes with AI... (e.g., 'refreshing summer cocktails')"
                }
                placeholderTextColor={colors.subtext}
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoFocus={showSearch}
                returnKeyType="search"
                onSubmitEditing={() => Keyboard.dismiss()}
              />
              {searchQuery ? (
                <Pressable
                  onPress={() => setSearchQuery('')}
                  style={styles.clearButton}
                >
                  <Ionicons name="close-circle" size={20} color={colors.subtext} />
                </Pressable>
              ) : null}
            </View>
            {isSearching && (
              <View style={styles.searchStatus}>
                <Ionicons name="sparkles" size={16} color={colors.accent} />
                <Text style={styles.searchingText}>AI searching...</Text>
              </View>
            )}
          </View>
        )}

        {/* Search Results or Regular Recipes Section */}
        {showSearch && searchQuery ? (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                Search Results
              </Text>
              <View style={styles.aiIndicator}>
                <Ionicons name="sparkles" size={16} color={colors.accent} />
                <Text style={styles.aiText}>AI</Text>
              </View>
            </View>
            <Text style={styles.sectionSubtitle}>
              {isSearching ? 'Searching with AI...' :
               `${searchResults.length} result${searchResults.length !== 1 ? 's' : ''} found`}
            </Text>

            <View style={styles.verticalGrid}>
              {searchResults.map((item, index) => {
                const recipe = convertSearchableItemToRecipe(item);
                return (
                  <TouchableOpacity
                    key={`search-${item.id}-${index}`}
                    style={styles.verticalCard}
                    onPress={() => handleRecipeView(recipe)}
                    activeOpacity={0.8}
                  >
                    <Image source={{ uri: recipe.image }} style={styles.cocktailImage} />
                    <View style={styles.cocktailInfo}>
                      <Text style={styles.cardTitle}>{recipe.name}</Text>
                      <Text style={styles.cardSub}>{recipe.subtitle}</Text>
                      <View style={styles.cocktailMeta}>
                        <Text style={styles.cocktailDifficulty}>{recipe.difficulty}</Text>
                        <Text style={styles.cocktailTime}>{recipe.time}</Text>
                      </View>
                    </View>

                    {/* Action buttons for search results */}
                    <View style={styles.recipeActions}>
                      <TouchableOpacity
                        style={styles.shoppingCartButton}
                        activeOpacity={0.7}
                        onPress={() => handleCreateShoppingList(recipe)}
                      >
                        <Ionicons name="basket" size={18} color={colors.white} />
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.saveButton}
                        activeOpacity={0.7}
                        onPress={() => handleSaveRecipe(recipe)}
                      >
                        <Ionicons
                          name={isCocktailSaved(recipe.id) ? "bookmark" : "bookmark-outline"}
                          size={20}
                          color={isCocktailSaved(recipe.id) ? colors.accent : colors.text}
                        />
                      </TouchableOpacity>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        ) : (
          /* Regular Recipes Section */
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                {active === 'For You' ? 'Personalized For You' :
                 active === 'AI Suggestions' ? 'AI Suggestions' : active}
              </Text>
              {(active === 'For You' || active === 'AI Suggestions') && (
                <View style={styles.aiIndicator}>
                  <Ionicons name="sparkles" size={16} color={colors.accent} />
                  <Text style={styles.aiText}>AI</Text>
                </View>
              )}
            </View>
          <Text style={styles.sectionSubtitle}>
            {active === 'For You' ?
              (loadingRecommendations ? 'Loading AI recommendations...' :
               `${filteredRecipes.length} personalized suggestions`) :
             active === 'AI Suggestions' ?
              (loadingRecommendations ? 'Loading AI suggestions...' :
               `${filteredRecipes.length} contextual suggestions`) :
              `${filteredRecipes.length} recipe${filteredRecipes.length !== 1 ? 's' : ''} available`
            }
          </Text>

          <View style={styles.verticalGrid}>
            {filteredRecipes.map((recipe, index) => (
              <TouchableOpacity
                key={`${active}-${recipe.id}-${index}`}
                style={styles.verticalCard}
                onPress={() => handleRecipeView(recipe)}
                activeOpacity={0.8}
              >
                <Image source={{ uri: recipe.image }} style={styles.cocktailImage} />
                <View style={styles.cocktailInfo}>
                  <Text style={styles.cardTitle}>{recipe.name}</Text>
                  <Text style={styles.cardSub}>{recipe.subtitle || recipe.description}</Text>
                  <View style={styles.cocktailMeta}>
                    <Text style={styles.cocktailDifficulty}>{recipe.difficulty}</Text>
                    <Text style={styles.cocktailTime}>{recipe.time}</Text>
                  </View>
                </View>

                {/* Action buttons */}
                <View style={styles.recipeActions}>
                  {/* Shopping cart button */}
                  <TouchableOpacity
                    style={styles.shoppingCartButton}
                    activeOpacity={0.7}
                    onPress={() => handleCreateShoppingList(recipe)}
                  >
                    <Ionicons
                      name="basket"
                      size={18}
                      color={colors.white}
                    />
                  </TouchableOpacity>

                  {/* Delete button for My Recipes */}
                  {active === 'My Recipes' && recipe.id && (
                    <TouchableOpacity
                      style={styles.deleteButton}
                      activeOpacity={0.7}
                      onPress={() => handleDeleteRecipe(recipe)}
                    >
                      <Ionicons name="trash-outline" size={18} color={colors.white} />
                    </TouchableOpacity>
                  )}

                  {/* Save button - only show if NOT on My Recipes page */}
                  {active !== 'My Recipes' && (
                    <TouchableOpacity
                      style={styles.saveButton}
                      activeOpacity={0.7}
                      onPress={() => handleSaveRecipe(recipe)}
                    >
                      <Ionicons
                        name={isCocktailSaved(recipe.id) ? "bookmark" : "bookmark-outline"}
                        size={20}
                        color={isCocktailSaved(recipe.id) ? colors.accent : colors.text}
                      />
                    </TouchableOpacity>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        )}
      </ScrollView>


      {/* Grocery List Modal */}
      {selectedRecipe && (
        <GroceryListModal
          visible={groceryListVisible}
          onClose={() => {
            setGroceryListVisible(false);
            setSelectedRecipe(null);
          }}
          recipeName={selectedRecipe.name || selectedRecipe.title || 'Recipe'}
          ingredients={selectedRecipe.ingredients || []}
          recipeId={selectedRecipe.id}
        />
      )}
    </View>
  );
}


const styles = StyleSheet.create({
  // Navigation chips
  chipsContainer: {
    paddingTop: spacing(2),
    paddingBottom: spacing(1),
  },
  chipsRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing(2),
    gap: spacing(1),
  },

  // Section
  section: {
    paddingHorizontal: spacing(2),
    marginTop: spacing(2)
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing(2),
  },
  sectionTitle: {
    color: colors.text,
    fontSize: fonts.h2,
    fontWeight: '800'
  },
  sectionSubtitle: {
    color: colors.subtext,
    fontSize: 14,
    marginBottom: spacing(3),
  },
  aiIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.accent + '20',
    paddingHorizontal: spacing(2),
    paddingVertical: spacing(0.5),
    borderRadius: radii.full,
    gap: spacing(1),
  },
  aiText: {
    color: colors.accent,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },

  // Search Components
  searchContainer: {
    paddingHorizontal: spacing(3),
    paddingVertical: spacing(2),
    backgroundColor: colors.bg,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.line,
    paddingHorizontal: spacing(3),
    paddingVertical: spacing(2),
  },
  searchIcon: {
    marginRight: spacing(2),
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    paddingVertical: 0,
  },
  clearButton: {
    marginLeft: spacing(2),
  },
  searchStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing(2),
    gap: spacing(1),
  },
  searchingText: {
    color: colors.accent,
    fontSize: 14,
    fontWeight: '600',
  },

  // Vertical Grid
  verticalGrid: {
    gap: spacing(2),
    paddingHorizontal: spacing(2),
  },

  // Vertical Cards - Full width for Recipe tab
  verticalCard: {
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.line,
    overflow: 'hidden',
    position: 'relative',
  },
  cocktailImage: {
    width: '100%',
    height: 160,
  },
  cocktailInfo: {
    padding: spacing(2),
  },
  cocktailMeta: {
    flexDirection: 'row',
    gap: spacing(2),
    marginTop: spacing(1),
  },
  cocktailDifficulty: {
    fontSize: 12,
    color: colors.accent,
    fontWeight: '600',
  },
  cocktailTime: {
    fontSize: 12,
    color: colors.subtext,
    fontWeight: '600',
  },
  recipeActions: {
    position: 'absolute',
    top: spacing(1),
    right: spacing(1),
    flexDirection: 'row',
    gap: spacing(1),
  },
  shoppingCartButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
  },
  saveButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(220, 38, 38, 0.8)', // Red background for delete
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Text styles matching featured page
  cardTitle: {
    color: colors.text,
    fontWeight: '800',
    fontSize: fonts.h3,
  },
  cardSub: {
    color: colors.muted,
    marginTop: 2,
  },

  // Dropdown styles
  dropdownBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
    backgroundColor: 'transparent',
  },
  dropdown: {
    position: 'absolute',
    top: '100%',
    right: 0,
    backgroundColor: colors.card,
    borderRadius: radii.md,
    paddingVertical: spacing(1),
    minWidth: 180,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 2,
    borderWidth: 1,
    borderColor: colors.line,
  },
  dropdownOverlay: {
    position: 'absolute',
    top: 60, // Below the header
    right: spacing(3),
    backgroundColor: colors.card,
    borderRadius: radii.md,
    paddingVertical: spacing(1),
    minWidth: 180,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 2,
    borderWidth: 1,
    borderColor: colors.line,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing(2),
    paddingVertical: spacing(2),
    gap: spacing(2),
  },
  dropdownText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
  },
});