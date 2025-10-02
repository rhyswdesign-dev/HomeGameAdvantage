import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radii, fonts } from '../theme/tokens';
import { AIRecipeFormatter, FormattedRecipe } from '../services/aiRecipeFormatter';
import { useAICredits } from '../store/useAICredits';

interface AIRecipeSearchProps {
  onRecipeFound: (recipe: FormattedRecipe) => void;
  onCreditsNeeded?: () => void;
  placeholder?: string;
  style?: any;
}

export default function AIRecipeSearch({
  onRecipeFound,
  onCreditsNeeded,
  placeholder = "Describe what you want to make...",
  style
}: AIRecipeSearchProps) {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { canUseAI, consumeCredits, getActionCost, credits } = useAICredits();

  const handleAISearch = useCallback(async () => {
    if (!query.trim()) {
      Alert.alert('Search Required', 'Please describe the cocktail you want to make');
      return;
    }

    // Check if user has enough credits
    if (!canUseAI('recipe_generation')) {
      const cost = getActionCost('recipe_generation');
      Alert.alert(
        'Insufficient Credits',
        `You need ${cost} credits to generate an AI recipe. You currently have ${credits} credits.`,
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
      console.log('🤖 Starting AI recipe search for:', query);

      // Consume credits for the action
      const creditConsumed = consumeCredits({
        type: 'recipe_generation',
        userQuery: query
      });

      if (!creditConsumed) {
        throw new Error('Unable to consume credits for this action');
      }

      // Use the AI formatter to create a recipe from the natural language query
      const formattedRecipe = await AIRecipeFormatter.formatRecipe({
        title: query.length > 50 ? query.substring(0, 50) + '...' : query,
        userNotes: query,
        recipeType: 'cocktail' // Default to cocktail, AI will adjust if needed
      });

      console.log('✅ AI recipe search completed');
      onRecipeFound(formattedRecipe);
      setQuery(''); // Clear search after successful result

    } catch (error: any) {
      console.error('AI search error:', error);
      Alert.alert(
        'AI Search Failed',
        error.message || 'Unable to process your request. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoading(false);
    }
  }, [query, onRecipeFound, canUseAI, consumeCredits, getActionCost, credits, onCreditsNeeded]);

  const handleClearSearch = useCallback(() => {
    setQuery('');
  }, []);

  return (
    <View style={[styles.container, style]}>
      <View style={styles.searchContainer}>
        <View style={styles.inputContainer}>
          <Ionicons
            name="sparkles"
            size={20}
            color={colors.accent}
            style={styles.aiIcon}
          />
          <TextInput
            style={styles.searchInput}
            value={query}
            onChangeText={setQuery}
            placeholder={placeholder}
            placeholderTextColor={colors.muted}
            multiline
            maxLength={200}
            editable={!isLoading}
            returnKeyType="search"
            onSubmitEditing={handleAISearch}
          />
          {query.length > 0 && !isLoading && (
            <TouchableOpacity
              onPress={handleClearSearch}
              style={styles.clearButton}
            >
              <Ionicons name="close-circle" size={20} color={colors.muted} />
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
          style={[
            styles.searchButton,
            isLoading && styles.searchButtonDisabled
          ]}
          onPress={handleAISearch}
          disabled={isLoading || !query.trim()}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color={colors.white} />
          ) : (
            <Ionicons name="search" size={20} color={colors.white} />
          )}
        </TouchableOpacity>
      </View>

      <Text style={styles.helperText}>
        💡 Try: "refreshing summer drink with gin and cucumber" or "strong whiskey cocktail for winter"
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing(2),
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing(2),
  },
  inputContainer: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.line,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing(2),
    paddingVertical: spacing(1.5),
    minHeight: 50,
  },
  aiIcon: {
    marginRight: spacing(1.5),
  },
  searchInput: {
    flex: 1,
    fontSize: fonts.body,
    color: colors.text,
    maxHeight: 80, // Allow for multiline but limit height
    textAlignVertical: 'top',
  },
  clearButton: {
    padding: spacing(0.5),
    marginLeft: spacing(1),
  },
  searchButton: {
    backgroundColor: colors.accent,
    borderRadius: radii.md,
    padding: spacing(2),
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    height: 50,
  },
  searchButtonDisabled: {
    backgroundColor: colors.muted,
  },
  helperText: {
    fontSize: 12,
    color: colors.muted,
    marginTop: spacing(1),
    lineHeight: 16,
  },
});