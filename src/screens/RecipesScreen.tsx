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
import { getUserRecipes, Recipe } from '../lib/firestore';
import { auth } from '../config/firebase';

const chips: Array<{ key: string; label: string }> = [
  { key: 'All', label: 'All' },
  { key: 'Cocktails', label: 'Cocktails' },
  { key: 'Shots', label: 'Shots' },
  { key: 'Mocktails', label: 'Mocktails' },
  { key: 'My Recipes', label: 'My Recipes' },
];

const sampleRecipes = [
  {
    id: '1',
    name: 'Classic Martini',
    category: 'Cocktails',
    image: 'https://images.unsplash.com/photo-1541976076758-347942db1978?q=80&w=1200&auto=format&fit=crop',
    difficulty: 'Easy',
    time: '2 min',
    rating: 4.8,
    ingredients: ['Gin', 'Dry Vermouth', 'Olive', 'Lemon Twist'],
    description: 'A timeless classic cocktail with gin and dry vermouth.',
  },
  {
    id: '2',
    name: 'Old Fashioned',
    category: 'Cocktails',
    image: 'https://images.unsplash.com/photo-1541542684-4c7b4916e66e?q=80&w=1200&auto=format&fit=crop',
    difficulty: 'Medium',
    time: '3 min',
    rating: 4.9,
    ingredients: ['Bourbon', 'Sugar', 'Angostura Bitters', 'Orange Peel'],
    description: 'The original cocktail, simple and sophisticated.',
  },
  {
    id: '3',
    name: 'Virgin Mojito',
    category: 'Mocktails',
    image: 'https://images.unsplash.com/photo-1497534547324-0ebb3f052e88?q=80&w=1200&auto=format&fit=crop',
    difficulty: 'Easy',
    time: '2 min',
    rating: 4.6,
    ingredients: ['Lime', 'Mint', 'Sugar', 'Soda Water'],
    description: 'Refreshing non-alcoholic version of the classic mojito.',
  },
];

export default function RecipesScreen() {
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute();
  const [active, setActive] = useState<string>((route.params as any)?.activeTab || 'All');
  const { toggleSavedSpirit, isSpiritSaved } = useSavedItems();
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

  const allRecipes = [...sampleRecipes];

  let filteredRecipes;
  if (active === 'My Recipes') {
    // Show only user recipes for "My Recipes" tab
    filteredRecipes = userRecipes.map(recipe => ({
      id: recipe.id || '',
      name: recipe.title || 'Untitled Recipe',
      category: 'My Recipes',
      image: recipe.imageUrl || 'https://images.unsplash.com/photo-1497534547324-0ebb3f052e88?q=80&w=1200&auto=format&fit=crop',
      difficulty: 'Unknown',
      time: 'N/A',
      rating: 0,
      ingredients: recipe.tags || [],
      description: recipe.sourceUrl ? `Source: ${recipe.sourceUrl}` : 'User-created recipe',
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

        {/* Recipes Grid */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {active === 'All' ? 'All Recipes' : active}
          </Text>
          <Text style={styles.sectionSubtitle}>
            {filteredRecipes.length} recipe{filteredRecipes.length !== 1 ? 's' : ''} available
          </Text>

          {filteredRecipes.map((recipe) => (
            <TouchableOpacity
              key={recipe.id}
              style={styles.recipeCard}
              onPress={() => nav.navigate('RecipeDetail', { recipe })}
              activeOpacity={0.8}
            >
              <Image source={{ uri: recipe.image }} style={styles.recipeImage} />
              <View style={styles.recipeContent}>
                <View style={styles.recipeHeader}>
                  <Text style={styles.recipeName}>{recipe.name}</Text>
                  <TouchableOpacity
                    onPress={() => handleShare(recipe)}
                    style={styles.shareButton}
                  >
                    <Ionicons name="share-outline" size={20} color={colors.subtext} />
                  </TouchableOpacity>
                </View>

                <Text style={styles.recipeDescription}>{recipe.description}</Text>

                <View style={styles.recipeStats}>
                  <View style={styles.statItem}>
                    <Ionicons name="time-outline" size={16} color={colors.accent} />
                    <Text style={styles.statText}>{recipe.time}</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Ionicons name="bar-chart-outline" size={16} color={colors.accent} />
                    <Text style={styles.statText}>{recipe.difficulty}</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Ionicons name="star" size={16} color={colors.gold} />
                    <Text style={styles.statText}>{recipe.rating}</Text>
                  </View>
                </View>

                <View style={styles.ingredientsList}>
                  <Text style={styles.ingredientsLabel}>Ingredients:</Text>
                  <Text style={styles.ingredientsText}>
                    {recipe.ingredients.join(', ')}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
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
    marginTop: spacing(3)
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

  // Recipe Cards
  recipeCard: {
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    marginBottom: spacing(3),
    borderWidth: 1,
    borderColor: colors.line,
    overflow: 'hidden',
  },
  recipeImage: {
    width: '100%',
    height: 200,
  },
  recipeContent: {
    padding: spacing(2.5),
  },
  recipeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing(1),
  },
  recipeName: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    flex: 1,
  },
  shareButton: {
    padding: spacing(0.5),
  },
  recipeDescription: {
    fontSize: 14,
    color: colors.subtext,
    marginBottom: spacing(2),
    lineHeight: 20,
  },
  recipeStats: {
    flexDirection: 'row',
    marginBottom: spacing(2),
    gap: spacing(2),
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing(0.5),
  },
  statText: {
    fontSize: 12,
    color: colors.subtext,
    fontWeight: '600',
  },
  ingredientsList: {
    marginTop: spacing(1),
  },
  ingredientsLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing(0.5),
  },
  ingredientsText: {
    fontSize: 14,
    color: colors.subtext,
    lineHeight: 20,
  },
});