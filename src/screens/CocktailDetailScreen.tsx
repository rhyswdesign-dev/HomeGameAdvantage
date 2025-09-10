import React, { useState, useLayoutEffect } from 'react';
import {
  View, Text, ScrollView, Image, TouchableOpacity, StyleSheet, Share, Alert, Pressable
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing, radii } from '../theme/tokens';
import { useSavedItems } from '../hooks/useSavedItems';
import type { RootStackParamList } from '../navigation/RootNavigator';

type CocktailDetailScreenRouteProp = {
  params: {
    cocktailId: string;
  };
};

const cocktailData = {
  'old-fashioned': {
    id: 'old-fashioned',
    title: 'Old Fashioned',
    subtitle: 'Classic • Whiskey-based',
    description: 'A timeless cocktail made with whiskey, sugar, bitters, and an orange twist. This drink represents the essence of what a cocktail should be - simple, balanced, and perfectly executed.',
    img: 'https://images.unsplash.com/photo-1536935338788-846bb9981813?auto=format&fit=crop&w=1200&q=60',
    difficulty: 'Easy',
    time: '3 min',
    ingredients: [
      { name: '2 oz Whiskey', note: 'Bourbon or Rye preferred' },
      { name: '1/4 oz Simple Syrup', note: 'Or 1 sugar cube' },
      { name: '2 dashes Angostura Bitters', note: 'Essential for flavor' },
      { name: 'Orange Peel', note: 'For garnish and aroma' },
      { name: 'Ice', note: 'Large cube preferred' }
    ],
    instructions: [
      'Add simple syrup and bitters to rocks glass',
      'Add whiskey and stir to combine',
      'Add ice (preferably one large cube)',
      'Stir gently to chill and dilute',
      'Express orange peel oils over drink',
      'Garnish with orange peel'
    ],
    tips: [
      'Use a large ice cube to minimize dilution',
      'Express the orange peel properly for best aroma',
      'Quality whiskey makes a big difference'
    ],
    glassware: 'Rocks Glass',
    kitAvailable: true,
    kitPrice: 49.99
  },
  'manhattan': {
    id: 'manhattan',
    title: 'Manhattan',
    subtitle: 'Classic • Whiskey-based',
    description: 'An elegant mix of whiskey, sweet vermouth, and bitters, garnished with a cherry. The Manhattan is the sophisticated sibling of the Old Fashioned.',
    img: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=1200&q=60',
    difficulty: 'Easy',
    time: '2 min',
    ingredients: [
      { name: '2 oz Rye Whiskey', note: 'Bourbon also works well' },
      { name: '1 oz Sweet Vermouth', note: 'Quality matters here' },
      { name: '2 dashes Angostura Bitters', note: 'Classic choice' },
      { name: 'Maraschino Cherry', note: 'For garnish' }
    ],
    instructions: [
      'Add whiskey, vermouth, and bitters to mixing glass',
      'Add ice and stir for 30 seconds',
      'Strain into chilled coupe glass',
      'Garnish with cherry'
    ],
    tips: [
      'Stir, don\'t shake - keeps it clear',
      'Chill your glass beforehand',
      'Good vermouth is crucial'
    ],
    glassware: 'Coupe Glass',
    kitAvailable: true,
    kitPrice: 54.99
  },
  'negroni': {
    id: 'negroni',
    title: 'Negroni',
    subtitle: 'Classic • Gin-based',
    description: 'A bitter and sweet Italian cocktail with gin, Campari, and sweet vermouth. Perfect for those who appreciate complex, bitter flavors.',
    img: 'https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?auto=format&fit=crop&w=1200&q=60',
    difficulty: 'Easy',
    time: '2 min',
    ingredients: [
      { name: '1 oz Gin', note: 'London Dry style preferred' },
      { name: '1 oz Campari', note: 'The signature bitter element' },
      { name: '1 oz Sweet Vermouth', note: 'Balances the bitterness' },
      { name: 'Orange Peel', note: 'Essential garnish' }
    ],
    instructions: [
      'Add gin, Campari, and vermouth to rocks glass',
      'Add ice and stir to combine',
      'Express orange peel over drink',
      'Drop peel into glass'
    ],
    tips: [
      'Equal parts - the perfect balance',
      'Build in glass for simplicity',
      'Orange peel oils are essential'
    ],
    glassware: 'Rocks Glass',
    kitAvailable: true,
    kitPrice: 64.99
  },
  'espresso-martini': {
    id: 'espresso-martini',
    title: 'Espresso Martini',
    subtitle: 'Modern • Vodka-based',
    description: 'A sophisticated coffee cocktail with vodka, coffee liqueur, and fresh espresso. The perfect pick-me-up cocktail.',
    img: 'https://images.unsplash.com/photo-1609951651556-5334e2706168?auto=format&fit=crop&w=1200&q=60',
    difficulty: 'Medium',
    time: '5 min',
    ingredients: [
      { name: '2 oz Vodka', note: 'Premium vodka recommended' },
      { name: '1/2 oz Coffee Liqueur', note: 'Kahlúa or similar' },
      { name: '1 shot Fresh Espresso', note: 'Must be fresh and hot' },
      { name: '1/4 oz Simple Syrup', note: 'Optional, to taste' }
    ],
    instructions: [
      'Brew fresh espresso shot',
      'Add all ingredients to shaker with ice',
      'Shake vigorously for 15 seconds',
      'Double strain into chilled coupe',
      'Garnish with 3 coffee beans'
    ],
    tips: [
      'Fresh espresso is non-negotiable',
      'Shake hard to create foam',
      'Serve immediately while hot'
    ],
    glassware: 'Coupe Glass',
    kitAvailable: true,
    kitPrice: 39.99
  }
};

export default function CocktailDetailScreen() {
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<CocktailDetailScreenRouteProp>();
  const { toggleSavedCocktail, isCocktailSaved } = useSavedItems();
  
  const cocktail = cocktailData[route.params.cocktailId as keyof typeof cocktailData];
  const isSaved = isCocktailSaved(route.params.cocktailId);

  const handleShare = async () => {
    if (!cocktail) return;
    try {
      await Share.share({
        message: `Check out this amazing ${cocktail.title} recipe! Perfect for any occasion.`,
        title: `${cocktail.title} - Cocktail Recipe`,
      });
    } catch (error) {
      Alert.alert('Error', 'Unable to share at this time');
    }
  };

  const handleSave = () => {
    if (!cocktail) return;
    toggleSavedCocktail({
      id: route.params.cocktailId,
      name: cocktail.title,
      subtitle: cocktail.subtitle,
      image: cocktail.img
    });
  };

  const handleAddToCart = () => {
    if (!cocktail || !cocktail.kitAvailable) return;
    Alert.alert(
      'Add to Cart',
      `Add ${cocktail.title} ingredient kit for $${cocktail.kitPrice}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Add to Cart', onPress: () => Alert.alert('Success', 'Added to cart!') }
      ]
    );
  };

  const handleDownload = () => {
    if (!cocktail) return;
    Alert.alert('Download Recipe', `${cocktail.title} recipe downloaded!`);
  };

  useLayoutEffect(() => {
    nav.setOptions({
      title: cocktail?.title || 'Cocktail',
      headerStyle: { backgroundColor: colors.bg },
      headerTintColor: colors.text,
      headerTitleStyle: { color: colors.text, fontWeight: '900' },
      headerShadowVisible: false,
      headerRight: () => (
        <View style={{ flexDirection: 'row', gap: 14 }}>
          <Pressable hitSlop={10} onPress={() => {}}>
            <Ionicons name="search-outline" size={20} color={colors.text} />
          </Pressable>
          <Pressable hitSlop={10} onPress={() => {}}>
            <Ionicons name="funnel-outline" size={20} color={colors.text} />
          </Pressable>
          <Pressable hitSlop={10} onPress={() => {}}>
            <Ionicons name="ellipsis-horizontal" size={20} color={colors.text} />
          </Pressable>
        </View>
      ),
    });
  }, [nav, cocktail?.title]);

  if (!cocktail) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Cocktail not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Hero Image */}
        <View style={styles.heroImageContainer}>
          <Image source={{ uri: cocktail.img }} style={styles.heroImage} />
          
          {/* Action Buttons Overlay */}
          <View style={styles.actionButtonsContainer}>
            <TouchableOpacity 
              onPress={handleShare}
              style={styles.actionButton}
              activeOpacity={0.7}
            >
              <Ionicons name="share-outline" size={18} color={colors.white} />
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={handleDownload}
              style={styles.actionButton}
              activeOpacity={0.7}
            >
              <Ionicons name="download-outline" size={18} color={colors.white} />
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={handleSave}
              style={[styles.actionButton, isSaved && styles.actionButtonActive]}
              activeOpacity={0.7}
            >
              <Ionicons 
                name={isSaved ? "bookmark" : "bookmark-outline"} 
                size={18} 
                color={colors.white} 
              />
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Content */}
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>{cocktail.title}</Text>
            <Text style={styles.subtitle}>{cocktail.subtitle}</Text>
            <Text style={styles.description}>{cocktail.description}</Text>
          </View>

          {/* Stats */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <MaterialCommunityIcons name="clock-outline" size={20} color={colors.accent} />
              <Text style={styles.statText}>{cocktail.time}</Text>
            </View>
            <View style={styles.statItem}>
              <MaterialCommunityIcons name="speedometer" size={20} color={colors.accent} />
              <Text style={styles.statText}>{cocktail.difficulty}</Text>
            </View>
            <View style={styles.statItem}>
              <MaterialCommunityIcons name="glass-cocktail" size={20} color={colors.accent} />
              <Text style={styles.statText}>{cocktail.glassware}</Text>
            </View>
          </View>

          {/* Ingredients */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ingredients</Text>
            {cocktail.ingredients.map((ingredient, index) => (
              <View key={`ingredient-${index}-${ingredient.name}`} style={styles.ingredientItem}>
                <Text style={styles.ingredientName}>{ingredient.name}</Text>
                <Text style={styles.ingredientNote}>{ingredient.note}</Text>
              </View>
            ))}
          </View>

          {/* Instructions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Instructions</Text>
            {cocktail.instructions.map((instruction, index) => (
              <View key={`instruction-${index}`} style={styles.instructionItem}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>{index + 1}</Text>
                </View>
                <Text style={styles.instructionText}>{instruction}</Text>
              </View>
            ))}
          </View>

          {/* Add to Cart Button */}
          {cocktail.kitAvailable && (
            <View style={styles.section}>
              <Pressable 
                style={styles.addToCartButton}
                onPress={handleAddToCart}
              >
                <MaterialCommunityIcons name="cart-plus" size={20} color={colors.white} />
                <Text style={styles.addToCartText}>Add Ingredient Kit - ${cocktail.kitPrice}</Text>
              </Pressable>
            </View>
          )}

          {/* Pro Tips */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Pro Tips</Text>
            {cocktail.tips.map((tip, index) => (
              <View key={`tip-${index}`} style={styles.tipItem}>
                <MaterialCommunityIcons name="lightbulb-outline" size={16} color={colors.accent} />
                <Text style={styles.tipText}>{tip}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  scrollContent: {
    paddingBottom: spacing(6),
  },
  heroImageContainer: {
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: 300,
    backgroundColor: colors.card,
  },
  actionButtonsContainer: {
    position: 'absolute',
    top: spacing(2),
    right: spacing(2),
    flexDirection: 'row',
    gap: spacing(1),
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  actionButtonActive: {
    backgroundColor: colors.accent,
  },
  content: {
    padding: spacing(3),
  },
  header: {
    marginBottom: spacing(3),
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: colors.text,
    marginBottom: spacing(1),
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.accent,
    marginBottom: spacing(2),
  },
  description: {
    fontSize: 16,
    color: colors.subtext,
    lineHeight: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: spacing(4),
    marginBottom: spacing(4),
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing(1),
  },
  statText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  section: {
    marginBottom: spacing(4),
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
    marginBottom: spacing(2),
  },
  ingredientItem: {
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    padding: spacing(2.5),
    marginBottom: spacing(1),
    borderWidth: 1,
    borderColor: colors.line,
  },
  ingredientName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing(0.5),
  },
  ingredientNote: {
    fontSize: 14,
    color: colors.subtext,
  },
  instructionItem: {
    flexDirection: 'row',
    marginBottom: spacing(2),
    gap: spacing(2),
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing(0.5),
  },
  stepNumberText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.white,
  },
  instructionText: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
    paddingTop: spacing(0.5),
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing(2),
    marginBottom: spacing(1.5),
  },
  tipText: {
    flex: 1,
    fontSize: 15,
    color: colors.subtext,
    lineHeight: 22,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    fontSize: 18,
    color: colors.subtext,
  },
  addToCartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accent,
    borderRadius: radii.lg,
    paddingVertical: spacing(2.5),
    paddingHorizontal: spacing(3),
    gap: spacing(1.5),
    shadowColor: colors.accent,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  addToCartText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.white,
  },
});