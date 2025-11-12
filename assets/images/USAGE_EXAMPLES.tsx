/**
 * Image Usage Examples
 * Copy these patterns into your components
 */

import React from 'react';
import { View, Image, StyleSheet, ScrollView, Text } from 'react-native';
import { spirits, ingredients, games, glassware, branding } from './index';

// ============================================
// Example 1: Simple Image Display
// ============================================
export function SimpleImageExample() {
  return (
    <View style={styles.container}>
      <Image source={spirits.gin} style={styles.spiritImage} />
    </View>
  );
}

// ============================================
// Example 2: Grid of Ingredients
// ============================================
export function IngredientsGrid() {
  const ingredientList = [
    { key: 'lemon', source: ingredients.lemon, label: 'Lemon' },
    { key: 'lime', source: ingredients.lime, label: 'Lime' },
    { key: 'mint', source: ingredients.mint, label: 'Mint' },
    { key: 'basil', source: ingredients.basil, label: 'Basil' },
  ];

  return (
    <View style={styles.grid}>
      {ingredientList.map((item) => (
        <View key={item.key} style={styles.gridItem}>
          <Image source={item.source} style={styles.ingredientImage} />
          <Text style={styles.label}>{item.label}</Text>
        </View>
      ))}
    </View>
  );
}

// ============================================
// Example 3: Game Tutorial Card
// ============================================
export function GameTutorialCard() {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Beer Pong</Text>
      <Image source={games.beerPong} style={styles.gameImage} />
      <Text style={styles.description}>
        A classic drinking game with cups and ping pong balls
      </Text>
    </View>
  );
}

// ============================================
// Example 4: Cocktail Recipe with Images
// ============================================
export function CocktailRecipe() {
  const recipe = {
    name: 'Gin & Tonic',
    spirit: spirits.gin,
    ingredients: [ingredients.lime, glassware.collins],
  };

  return (
    <View style={styles.recipe}>
      <Text style={styles.recipeTitle}>{recipe.name}</Text>

      {/* Main Spirit */}
      <View style={styles.recipeSection}>
        <Text style={styles.sectionTitle}>Spirit</Text>
        <Image source={recipe.spirit} style={styles.mainSpirit} />
      </View>

      {/* Ingredients */}
      <View style={styles.recipeSection}>
        <Text style={styles.sectionTitle}>Ingredients & Glass</Text>
        <View style={styles.recipeIngredients}>
          {recipe.ingredients.map((ingredient, idx) => (
            <Image key={idx} source={ingredient} style={styles.recipeItem} />
          ))}
        </View>
      </View>
    </View>
  );
}

// ============================================
// Example 5: Branded Header
// ============================================
export function BrandedHeader() {
  return (
    <View style={styles.header}>
      <Image source={branding.backsplash} style={styles.headerBg} />
      <View style={styles.headerOverlay}>
        <Text style={styles.headerTitle}>MixedMinds</Text>
      </View>
    </View>
  );
}

// ============================================
// Example 6: Dynamic Spirit Selector
// ============================================
export function SpiritSelector({ selectedSpirit }: { selectedSpirit: keyof typeof spirits }) {
  return (
    <View style={styles.selector}>
      <Image source={spirits[selectedSpirit]} style={styles.selectedSpirit} />
    </View>
  );
}

// ============================================
// Example 7: Games Carousel
// ============================================
export function GamesCarousel() {
  const popularGames = [
    { key: 'beerPong', source: games.beerPong, name: 'Beer Pong' },
    { key: 'kingsCup', source: games.kingsCup, name: 'Kings Cup' },
    { key: 'flipCup', source: games.flipCup, name: 'Flip Cup' },
    { key: 'neverHaveIEver', source: games.neverHaveIEver, name: 'Never Have I Ever' },
  ];

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.carousel}>
      {popularGames.map((game) => (
        <View key={game.key} style={styles.carouselCard}>
          <Image source={game.source} style={styles.carouselImage} />
          <Text style={styles.carouselLabel}>{game.name}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

// ============================================
// Styles
// ============================================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  spiritImage: {
    width: 200,
    height: 300,
    resizeMode: 'contain',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
  },
  gridItem: {
    width: '50%',
    padding: 10,
    alignItems: 'center',
  },
  ingredientImage: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  label: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    margin: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  gameImage: {
    width: '100%',
    height: 300,
    resizeMode: 'contain',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: '#666',
  },
  recipe: {
    padding: 20,
  },
  recipeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  recipeSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  mainSpirit: {
    width: 150,
    height: 200,
    resizeMode: 'contain',
  },
  recipeIngredients: {
    flexDirection: 'row',
    gap: 16,
  },
  recipeItem: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
  },
  header: {
    height: 200,
    position: 'relative',
  },
  headerBg: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  headerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  selector: {
    padding: 20,
    alignItems: 'center',
  },
  selectedSpirit: {
    width: 180,
    height: 250,
    resizeMode: 'contain',
  },
  carousel: {
    paddingVertical: 20,
  },
  carouselCard: {
    width: 200,
    marginHorizontal: 10,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  carouselImage: {
    width: '100%',
    height: 250,
    resizeMode: 'contain',
    marginBottom: 8,
  },
  carouselLabel: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});
