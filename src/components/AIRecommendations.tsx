import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radii, fonts } from '../theme/tokens';
import RecipeCard from './RecipeCard';
import { createRecipeCardProps } from '../utils/recipeActions';
import { FormattedRecipe } from '../services/aiRecipeFormatter';
import { useAICredits } from '../store/useAICredits';

interface AIRecommendationsProps {
  navigation: any;
  toggleSavedCocktail?: (cocktail: any) => void;
  isCocktailSaved?: (id: string) => boolean;
  setSelectedRecipe?: (recipe: any) => void;
  setGroceryListVisible?: (visible: boolean) => void;
  onCreditsNeeded?: () => void;
  style?: any;
}

export default function AIRecommendations({
  navigation,
  toggleSavedCocktail,
  isCocktailSaved,
  setSelectedRecipe,
  setGroceryListVisible,
  onCreditsNeeded,
  style
}: AIRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<FormattedRecipe[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  const { canUseAI, consumeCredits, getActionCost, credits } = useAICredits();

  // Generate AI-powered recommendations based on user context
  const generateRecommendations = useCallback(async () => {
    // Check if user has enough credits
    if (!canUseAI('recommendation')) {
      const cost = getActionCost('recommendation');
      Alert.alert(
        'Insufficient Credits',
        `You need ${cost} credits to generate AI recommendations. You currently have ${credits} credits.`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Get Credits',
            onPress: () => onCreditsNeeded?.()
          }
        ]
      );
      return;
    }

    setIsLoading(true);

    try {
      console.log('🤖 Generating AI recommendations...');

      // Consume credits for the action
      const creditConsumed = consumeCredits({
        type: 'recommendation',
        userQuery: 'AI recommendations generation'
      });

      if (!creditConsumed) {
        throw new Error('Unable to consume credits for this action');
      }

      // Get current time context for recommendations
      const now = new Date();
      const hour = now.getHours();
      const day = now.getDay();
      const month = now.getMonth();

      // Determine context-based prompts
      let contextPrompt = '';

      if (hour >= 5 && hour < 12) {
        contextPrompt = 'morning or brunch cocktails with coffee, citrus, or light spirits';
      } else if (hour >= 12 && hour < 17) {
        contextPrompt = 'afternoon refreshers, aperitifs, or light cocktails';
      } else if (hour >= 17 && hour < 22) {
        contextPrompt = 'evening cocktails, classics, or sophisticated drinks for unwinding';
      } else {
        contextPrompt = 'nightcap cocktails, digestifs, or bold drinks for late night';
      }

      // Weekend vs weekday context
      if (day === 0 || day === 6) {
        contextPrompt += ', perfect for weekend relaxation';
      } else {
        contextPrompt += ', ideal for weekday unwinding';
      }

      // Seasonal context
      const seasons = ['winter warming drinks', 'spring fresh cocktails', 'summer refreshers', 'fall cozy drinks'];
      contextPrompt += `, featuring ${seasons[Math.floor(month / 3)]}`;

      // Create mock recommendations for now (in production, this would use AIRecommendationEngine)
      const mockRecommendations: FormattedRecipe[] = [
        {
          title: 'AI-Crafted Classic',
          description: `Perfect ${contextPrompt.split(',')[0]} for this moment`,
          ingredients: [
            { name: 'Premium Spirit', amount: '2 oz', notes: 'Base of choice' },
            { name: 'Balancing Element', amount: '0.75 oz', notes: 'For harmony' },
            { name: 'Accent', amount: '2 dashes', notes: 'Complexity' }
          ],
          instructions: [
            'Combine ingredients with precision',
            'Use proper technique for style',
            'Serve with appropriate garnish'
          ],
          garnish: 'Contextually appropriate',
          glassware: 'Proper vessel',
          difficulty: 'Medium' as const,
          time: '3 min',
          servings: 1,
          tags: ['ai-recommended', 'contextual', 'personalized']
        },
        {
          title: 'Mood-Matched Mixer',
          description: `Tailored for your current vibe and ${contextPrompt.split(',')[1]?.trim() || 'perfect timing'}`,
          ingredients: [
            { name: 'Seasonal Base', amount: '1.5 oz', notes: 'Time-appropriate' },
            { name: 'Fresh Component', amount: '1 oz', notes: 'Bright accent' },
            { name: 'Mixer', amount: '3 oz', notes: 'To top' }
          ],
          instructions: [
            'Build in appropriate glass',
            'Add fresh elements first',
            'Top and garnish thoughtfully'
          ],
          garnish: 'Fresh and seasonal',
          glassware: 'Highball Glass',
          difficulty: 'Easy' as const,
          time: '2 min',
          servings: 1,
          tags: ['ai-recommended', 'seasonal', 'easy']
        },
        {
          title: 'Discovery Special',
          description: `Introducing flavors based on trending combinations and ${contextPrompt.split(',')[2]?.trim() || 'current preferences'}`,
          ingredients: [
            { name: 'Unique Spirit', amount: '2 oz', notes: 'Explore new flavors' },
            { name: 'Artisanal Modifier', amount: '0.5 oz', notes: 'Craft element' },
            { name: 'Signature Touch', amount: '1 dash', notes: 'Personal flair' }
          ],
          instructions: [
            'Experiment with technique',
            'Focus on flavor development',
            'Present with creativity'
          ],
          garnish: 'Innovative presentation',
          glassware: 'Coupe Glass',
          difficulty: 'Hard' as const,
          time: '5 min',
          servings: 1,
          tags: ['ai-recommended', 'experimental', 'craft']
        }
      ];

      setRecommendations(mockRecommendations);
      setLastRefresh(new Date());
      console.log('✅ AI recommendations generated');

    } catch (error: any) {
      console.error('AI recommendations error:', error);
      Alert.alert(
        'Recommendations Unavailable',
        'Unable to generate personalized recommendations right now. Please try again later.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoading(false);
    }
  }, [canUseAI, consumeCredits, getActionCost, credits, onCreditsNeeded]);

  // Generate recommendations on component mount
  useEffect(() => {
    generateRecommendations();
  }, [generateRecommendations]);

  // Convert FormattedRecipe to the format expected by RecipeCard
  const convertToRecipeCardFormat = (recipe: FormattedRecipe, index: number) => ({
    id: `ai-rec-${index}-${Date.now()}`,
    name: recipe.title,
    title: recipe.title,
    subtitle: recipe.description,
    description: recipe.description,
    image: 'https://images.unsplash.com/photo-1574671928146-5c89a22b2e85?q=80&w=400&auto=format&fit=crop', // Default cocktail image
    difficulty: recipe.difficulty || 'Medium',
    time: recipe.time || '3 min',
    ingredients: recipe.ingredients,
    instructions: recipe.instructions,
    garnish: recipe.garnish,
    glassware: recipe.glassware,
  });

  const handleRefresh = useCallback(() => {
    generateRecommendations();
  }, [generateRecommendations]);

  if (isLoading && recommendations.length === 0) {
    return (
      <View style={[styles.container, style]}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Ionicons name="sparkles" size={20} color={colors.accent} />
            <Text style={styles.title}>AI Recommendations</Text>
          </View>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.accent} />
          <Text style={styles.loadingText}>Crafting personalized recommendations...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Ionicons name="sparkles" size={20} color={colors.accent} />
          <Text style={styles.title}>AI Recommendations</Text>
        </View>
        <TouchableOpacity
          onPress={handleRefresh}
          style={styles.refreshButton}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color={colors.accent} />
          ) : (
            <Ionicons name="refresh" size={20} color={colors.accent} />
          )}
        </TouchableOpacity>
      </View>

      {lastRefresh && (
        <Text style={styles.refreshTime}>
          Generated {lastRefresh.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      )}

      <ScrollView
        horizontal
        nestedScrollEnabled
        showsHorizontalScrollIndicator={false}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {recommendations.map((recipe, index) => {
          const recipeCardData = convertToRecipeCardFormat(recipe, index);
          return (
            <RecipeCard
              key={recipeCardData.id}
              style={styles.recipeCard}
              {...createRecipeCardProps(recipeCardData, navigation, {
                toggleSavedCocktail,
                isCocktailSaved,
                setSelectedRecipe,
                setGroceryListVisible,
                showSaveButton: true,
                showCartButton: true,
                showDeleteButton: false,
              })}
            />
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing(2),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing(3),
    marginBottom: spacing(1),
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing(1),
  },
  title: {
    fontSize: fonts.h3,
    fontWeight: '700',
    color: colors.text,
  },
  refreshButton: {
    padding: spacing(1),
  },
  refreshTime: {
    fontSize: 12,
    color: colors.muted,
    paddingHorizontal: spacing(3),
    marginBottom: spacing(1),
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing(4),
  },
  loadingText: {
    fontSize: fonts.body,
    color: colors.muted,
    marginTop: spacing(2),
  },
  scrollView: {
    paddingLeft: spacing(3),
  },
  scrollContent: {
    paddingRight: spacing(3),
  },
  recipeCard: {
    width: 280,
    marginRight: spacing(2),
  },
});