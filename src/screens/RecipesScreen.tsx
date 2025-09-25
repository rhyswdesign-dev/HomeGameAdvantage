import React, { useState, useLayoutEffect, useEffect, useCallback } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Pressable,
  Share,
  Alert,
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

const chips: Array<{ key: string; label: string }> = [
  { key: 'All', label: 'All' },
  { key: 'Cocktails', label: 'Cocktails' },
  { key: 'Shots', label: 'Shots' },
  { key: 'Mocktails', label: 'Mocktails' },
  { key: 'My Recipes', label: 'My Recipes' },
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
    ingredients: ['2 oz Whiskey', '1/4 oz Simple Syrup', '2 dashes Angostura Bitters', 'Orange Peel'],
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
    ingredients: ['2 oz Rye Whiskey', '1 oz Sweet Vermouth', '2 dashes Angostura Bitters', 'Maraschino Cherry'],
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
    ingredients: ['1 oz Gin', '1 oz Campari', '1 oz Sweet Vermouth', 'Orange Peel'],
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
    ingredients: ['2 oz Vodka', '1/2 oz Coffee Liqueur', '1 shot Fresh Espresso', '1/4 oz Simple Syrup'],
    description: 'A sophisticated coffee cocktail with vodka, coffee liqueur, and fresh espresso.',
  },
];

const sampleRecipes = [
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
    ingredients: ['2 oz Gin', '1/2 oz Dry Vermouth', 'Olive or Lemon Twist'],
    description: 'A timeless classic cocktail with gin and dry vermouth.',
  },
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
    ingredients: ['Fresh Lime Juice', 'Mint Leaves', 'Simple Syrup', 'Soda Water'],
    description: 'Refreshing non-alcoholic version of the classic mojito.',
  },
];

export default function RecipesScreen() {
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute();
  const [active, setActive] = useState<string>((route.params as any)?.activeTab || 'All');
  const { toggleSavedCocktail, isCocktailSaved } = useSavedItems();
  const [userRecipes, setUserRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  useLayoutEffect(() => {
    nav.setOptions({
      title: 'Recipes',
      headerStyle: { backgroundColor: colors.bg },
      headerTintColor: colors.text,
      headerTitleStyle: { color: colors.text, fontWeight: '900' },
      headerShadowVisible: false,
      headerLeft: () => null,
      headerRight: () => (
        <Pressable hitSlop={12} onPress={() => nav.navigate('AddRecipe')}>
          <Ionicons name="add-circle" size={24} color={colors.accent} />
        </Pressable>
      ),
    });
  }, [nav]);

  useFocusEffect(
    useCallback(() => {
      loadUserRecipes();
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

  const goto = (key: string) => {
    setActive(key);
  };

  const handleShare = async (recipe: any) => {
    try {
      await Share.share({
        message: `Check out this ${recipe.name} recipe! ${recipe.description}`,
        title: `${recipe.name} Recipe`,
      });
    } catch (error) {
      Alert.alert('Error', 'Unable to share at this time');
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

  const allRecipes = [...sampleRecipes, ...classicCocktails];

  let filteredRecipes;
  if (active === 'My Recipes') {
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
    filteredRecipes = active === 'All'
      ? allRecipes
      : allRecipes.filter(recipe => recipe.category === active);
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
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

        {/* Recipes Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {active === 'All' ? 'All Recipes' : active}
          </Text>
          <Text style={styles.sectionSubtitle}>
            {filteredRecipes.length} recipe{filteredRecipes.length !== 1 ? 's' : ''} available
          </Text>

          <View style={styles.verticalGrid}>
            {filteredRecipes.map((recipe) => (
              <TouchableOpacity
                key={recipe.id}
                style={styles.verticalCard}
                onPress={() => nav.navigate('CocktailDetail', { cocktailId: recipe.id })}
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

                {/* Save button */}
                <TouchableOpacity
                  style={styles.saveButton}
                  activeOpacity={0.7}
                  onPress={() => toggleSavedCocktail({
                    id: recipe.id,
                    name: recipe.name,
                    subtitle: recipe.description,
                    image: recipe.image
                  })}
                >
                  <Ionicons
                    name={isCocktailSaved(recipe.id) ? "bookmark" : "bookmark-outline"}
                    size={20}
                    color={isCocktailSaved(recipe.id) ? colors.accent : colors.text}
                  />
                </TouchableOpacity>

                {/* Additional actions for My Recipes */}
                {active === 'My Recipes' && recipe.id && (
                  <View style={styles.additionalActions}>
                    <TouchableOpacity
                      onPress={() => handleShare(recipe)}
                      style={styles.additionalActionButton}
                    >
                      <Ionicons name="share-outline" size={16} color={colors.white} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleDeleteRecipe(recipe)}
                      style={styles.additionalActionButton}
                    >
                      <Ionicons name="trash-outline" size={16} color={colors.white} />
                    </TouchableOpacity>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
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
  saveButton: {
    position: 'absolute',
    top: spacing(1),
    right: spacing(1),
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  additionalActions: {
    position: 'absolute',
    top: spacing(1),
    right: spacing(5.5),
    flexDirection: 'row',
    gap: spacing(0.5),
  },
  additionalActionButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(0,0,0,0.5)',
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
});