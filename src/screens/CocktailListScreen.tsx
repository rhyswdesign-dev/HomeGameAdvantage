import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, spacing, fonts } from '../theme/tokens';
import RecipeCard from '../components/RecipeCard';
import GroceryListModal from '../components/GroceryListModal';
import { createRecipeCardProps } from '../utils/recipeActions';
import { useSession } from '../store/useSession';
import { ALL_COCKTAILS } from '../data/cocktails';

interface CocktailListScreenProps {
  navigation: NativeStackNavigationProp<any>;
  route: RouteProp<any, any>;
}

export default function CocktailListScreen({ navigation, route }: CocktailListScreenProps) {
  const { title, cocktailIds, category } = route.params;
  const [selectedRecipe, setSelectedRecipe] = useState<any>(null);
  const [groceryListVisible, setGroceryListVisible] = useState(false);

  const {
    toggleSavedCocktail,
    isCocktailSaved,
  } = useSession();

  // Find cocktails by ID from the cocktail database
  const validCocktails = useMemo(() => {
    if (!cocktailIds || !Array.isArray(cocktailIds)) return [];

    // For now, search only in ALL_COCKTAILS - RecipesScreen should handle the ID mapping
    return cocktailIds.map(id => {
      return ALL_COCKTAILS.find(cocktail =>
        cocktail.id === id ||
        cocktail.id === id.replace(/-/g, '') ||
        cocktail.name.toLowerCase().replace(/[^a-z0-9]/g, '-') === id ||
        cocktail.name.toLowerCase().replace(/[^a-z0-9]/g, '') === id.replace(/-/g, '')
      );
    }).filter(Boolean);
  }, [cocktailIds]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>
            {validCocktails.length} {category === 'syrups' ? (validCocktails.length === 1 ? 'recipe' : 'recipes') : (validCocktails.length === 1 ? 'cocktail' : 'cocktails')}
          </Text>
        </View>

        {/* Cocktail List */}
        <View style={styles.cocktailGrid}>
          {validCocktails.map((cocktail) => (
            <RecipeCard
              key={cocktail.id}
              style={styles.cocktailCard}
              {...createRecipeCardProps(cocktail, navigation, {
                toggleSavedCocktail,
                isCocktailSaved,
                setSelectedRecipe,
                setGroceryListVisible,
                showSaveButton: true,
                showCartButton: true,
                showDeleteButton: false,
              })}
            />
          ))}
        </View>

        {validCocktails.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No cocktails found for this mood</Text>
            <Text style={styles.emptySubtext}>
              Try exploring other moods or check back later for new additions!
            </Text>
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
          recipeName={selectedRecipe.name || selectedRecipe.title}
          ingredients={selectedRecipe.ingredients || []}
          recipeId={selectedRecipe.id}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing(4),
  },
  header: {
    padding: spacing(3),
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  title: {
    fontSize: fonts.h2,
    fontWeight: '800',
    color: colors.text,
    marginBottom: spacing(0.5),
  },
  subtitle: {
    fontSize: fonts.body,
    color: colors.subtext,
    fontWeight: '500',
  },
  cocktailGrid: {
    padding: spacing(3),
    gap: spacing(2),
  },
  cocktailCard: {
    marginBottom: spacing(2),
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing(4),
    marginTop: spacing(8),
  },
  emptyText: {
    fontSize: fonts.h3,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing(1),
  },
  emptySubtext: {
    fontSize: fonts.body,
    color: colors.subtext,
    textAlign: 'center',
    lineHeight: 20,
  },
});