import React, { useState, useLayoutEffect, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radii, fonts } from '../theme/tokens';
import { AIRecipeFormatter, FormattedRecipe, RecipeInput } from '../services/aiRecipeFormatter';
import { updateRecipe } from '../lib/firestore';
import { useAuth } from '../contexts/AuthContext';

export default function AIRecipeFormatScreen() {
  const nav = useNavigation<NativeStackNavigationProp<any>>();
  const route = useRoute();
  const { recipe } = route.params as { recipe: any };
  const { user, isAuthenticated } = useAuth();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formattedRecipe, setFormattedRecipe] = useState<FormattedRecipe | null>(null);
  const [error, setError] = useState<string | null>(null);
  // Removed recipe type selection - AI will auto-detect

  useLayoutEffect(() => {
    nav.setOptions({
      title: '✨ AI Recipe Formatting',
      headerStyle: { backgroundColor: colors.bg },
      headerTintColor: colors.text,
      headerTitleStyle: { color: colors.text, fontWeight: '900' },
      headerShadowVisible: false,
    });
  }, [nav]);

  useEffect(() => {
    // Auto-format immediately - AI will detect recipe type
    formatRecipeWithAI();
  }, []);

  const formatRecipeWithAI = async () => {
    try {
      setLoading(true);
      setError(null);

      // Prepare input for AI formatting
      const input: RecipeInput = {
        title: recipe.title || recipe.name,
        sourceUrl: recipe.sourceUrl,
        imageUrl: recipe.imageUrl,
        userNotes: `Recipe from ${recipe.sourceUrl || 'user input'}`,
        // recipeType will be auto-detected by AI
      };

      // Extract text from URL if available
      if (recipe.sourceUrl) {
        try {
          const extractedText = await AIRecipeFormatter.extractTextFromUrl(recipe.sourceUrl);
          input.extractedText = extractedText;
        } catch (error) {
          console.log('Could not extract URL text:', error);
        }
      }

      // Format with AI
      const result = await AIRecipeFormatter.formatRecipe(input);
      setFormattedRecipe(result);

    } catch (error: any) {
      setError(error.message || 'Failed to format recipe with AI');
      console.error('AI formatting error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!formattedRecipe) {
      Alert.alert('Error', 'No formatted recipe data available');
      return;
    }

    console.log('AIRecipeFormatScreen: Starting save process');
    console.log('AIRecipeFormatScreen: Recipe data:', recipe);
    console.log('AIRecipeFormatScreen: Formatted recipe:', formattedRecipe);
    console.log('AIRecipeFormatScreen: User authenticated:', isAuthenticated);
    console.log('AIRecipeFormatScreen: User ID:', user?.uid);

    if (!isAuthenticated || !user) {
      Alert.alert('Authentication Error', 'Please sign in to save recipes');
      return;
    }

    try {
      setSaving(true);

      // Check if this is a new recipe (from OCR/Vision) or existing recipe
      const isNewRecipe = !recipe.id ||
                         recipe.id.startsWith('ocr-') ||
                         recipe.id.startsWith('vision-') ||
                         recipe.id.startsWith('manual-') ||
                         recipe.id.startsWith('temp-');

      console.log('AIRecipeFormatScreen: Recipe ID:', recipe.id);
      console.log('AIRecipeFormatScreen: Is new recipe:', isNewRecipe);

      if (isNewRecipe) {
        // Create new recipe for OCR-captured recipes
        const { createRecipe } = await import('../lib/firestore');

        const newRecipeData = {
          title: formattedRecipe.title,
          sourceUrl: recipe.sourceUrl || null,
          imageUrl: recipe.imageUrl || null,
          tags: formattedRecipe.tags || [],
        };

        // Add custom fields for AI formatted recipes
        const recipeWithAIData = {
          ...newRecipeData,
          aiFormatted: true,
          aiFormattedData: formattedRecipe,
        };

        console.log('AIRecipeFormatScreen: Creating new recipe with data:', recipeWithAIData);
        await createRecipe(recipeWithAIData);
        console.log('AIRecipeFormatScreen: Recipe created successfully');

        Alert.alert(
          'Success!',
          'Recipe has been created and saved with AI-generated structure.',
          [
            {
              text: 'Done',
              onPress: () => {
                // Navigate back to main tab and then to recipes
                nav.navigate('Main');
                // Navigate to recipes tab would need to be handled by the tab navigator
              },
            },
          ]
        );

      } else {
        // Update existing recipe
        const updateData = {
          title: formattedRecipe.title,
          aiFormatted: true,
          aiFormattedData: formattedRecipe,
          updatedAt: new Date(),
        };

        console.log('AIRecipeFormatScreen: Updating existing recipe with ID:', recipe.id);
        console.log('AIRecipeFormatScreen: Update data:', updateData);
        await updateRecipe(recipe.id, updateData);
        console.log('AIRecipeFormatScreen: Recipe updated successfully');

        Alert.alert(
          'Success!',
          'Recipe has been updated with AI-generated structure.',
          [
            {
              text: 'Done',
              onPress: () => nav.goBack(),
            },
          ]
        );
      }

    } catch (error: any) {
      console.error('Save error:', error);
      Alert.alert('Error', error.message || 'Failed to save formatted recipe');
    } finally {
      setSaving(false);
    }
  };

  const updateIngredient = (index: number, field: 'name' | 'amount' | 'notes', value: string) => {
    if (!formattedRecipe) return;

    const updatedIngredients = [...formattedRecipe.ingredients];
    updatedIngredients[index] = { ...updatedIngredients[index], [field]: value };

    setFormattedRecipe({
      ...formattedRecipe,
      ingredients: updatedIngredients,
    });
  };

  const updateInstruction = (index: number, value: string) => {
    if (!formattedRecipe) return;

    const updatedInstructions = [...formattedRecipe.instructions];
    updatedInstructions[index] = value;

    setFormattedRecipe({
      ...formattedRecipe,
      instructions: updatedInstructions,
    });
  };

  // Recipe type selection removed - AI auto-detects type from content

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.accent} />
          <Text style={styles.loadingText}>AI is formatting your recipe...</Text>
          <Text style={styles.loadingSubtext}>This may take a few moments</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={64} color={colors.error} />
          <Text style={styles.errorTitle}>Formatting Failed</Text>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={formatRecipeWithAI}>
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.manualButton} onPress={() => nav.goBack()}>
            <Text style={styles.manualButtonText}>Manual Format Instead</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (!formattedRecipe) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Enhanced Header with Recipe Preview */}
        <View style={styles.header}>
          <Text style={styles.title}>Recipe Card Preview</Text>
          <Text style={styles.subtitle}>Review and refine your AI-generated recipe</Text>

          {/* Recipe Type Badge */}
          {formattedRecipe.tags && formattedRecipe.tags.length > 0 && (
            <View style={styles.tagContainer}>
              {formattedRecipe.tags.slice(0, 3).map((tag, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Recipe Card Container */}
        <View style={styles.recipeCard}>
          {/* Recipe Title */}
          <View style={styles.titleSection}>
            <Text style={styles.label}>Recipe Title</Text>
            <TextInput
              style={[styles.input, styles.titleInput]}
              value={formattedRecipe.title}
              onChangeText={(text) => setFormattedRecipe({...formattedRecipe, title: text})}
              placeholder="Recipe title..."
            />
          </View>

          {/* Description */}
          <View style={styles.descriptionSection}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formattedRecipe.description}
              onChangeText={(text) => setFormattedRecipe({...formattedRecipe, description: text})}
              placeholder="What makes this recipe special?"
              multiline
              numberOfLines={3}
            />
          </View>

          {/* Ingredients */}
          <View style={styles.ingredientsSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Ingredients</Text>
              <Text style={styles.ingredientCount}>{formattedRecipe.ingredients.length} items</Text>
            </View>
            <View style={styles.ingredientsContainer}>
              {formattedRecipe.ingredients.map((ingredient, index) => (
                <View key={index} style={styles.ingredientCard}>
                  <View style={styles.ingredientNumber}>
                    <Text style={styles.ingredientNumberText}>{index + 1}</Text>
                  </View>
                  <View style={styles.ingredientInputs}>
                    <TextInput
                      style={[styles.input, styles.ingredientAmount]}
                      value={ingredient.amount}
                      onChangeText={(text) => updateIngredient(index, 'amount', text)}
                      placeholder="2 oz"
                    />
                    <TextInput
                      style={[styles.input, styles.ingredientName]}
                      value={ingredient.name}
                      onChangeText={(text) => updateIngredient(index, 'name', text)}
                      placeholder="Ingredient name"
                    />
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Instructions */}
          <View style={styles.instructionsSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Instructions</Text>
              <Text style={styles.stepCount}>{formattedRecipe.instructions.length} steps</Text>
            </View>
            <View style={styles.instructionsContainer}>
              {formattedRecipe.instructions.map((instruction, index) => (
                <View key={index} style={styles.instructionCard}>
                  <View style={styles.stepBadge}>
                    <Text style={styles.stepBadgeText}>Step {index + 1}</Text>
                  </View>
                  <TextInput
                    style={[styles.input, styles.instructionInput]}
                    value={instruction}
                    onChangeText={(text) => updateInstruction(index, text)}
                    placeholder={`Describe step ${index + 1}...`}
                    multiline
                  />
                </View>
              ))}
            </View>
          </View>

          {/* Recipe Details */}
          <View style={styles.detailsSection}>
            <Text style={styles.sectionTitle}>Recipe Details</Text>

            <View style={styles.detailsGrid}>
              <View style={styles.detailCard}>
                <Text style={styles.detailLabel}>Garnish</Text>
                <TextInput
                  style={[styles.input, styles.detailInput]}
                  value={formattedRecipe.garnish || ''}
                  onChangeText={(text) => setFormattedRecipe({...formattedRecipe, garnish: text})}
                  placeholder="Cherry, lemon twist..."
                />
              </View>

              <View style={styles.detailCard}>
                <Text style={styles.detailLabel}>Glassware</Text>
                <TextInput
                  style={[styles.input, styles.detailInput]}
                  value={formattedRecipe.glassware || ''}
                  onChangeText={(text) => setFormattedRecipe({...formattedRecipe, glassware: text})}
                  placeholder="Rocks glass, coupe..."
                />
              </View>

              <View style={styles.detailCard}>
                <Text style={styles.detailLabel}>Prep Time</Text>
                <TextInput
                  style={[styles.input, styles.detailInput]}
                  value={formattedRecipe.time || ''}
                  onChangeText={(text) => setFormattedRecipe({...formattedRecipe, time: text})}
                  placeholder="5 minutes"
                />
              </View>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.saveButton, saving && styles.saveButtonDisabled]}
            onPress={handleSave}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator size="small" color={colors.white} />
            ) : (
              <Ionicons name="checkmark-circle" size={20} color={colors.white} />
            )}
            <Text style={styles.saveButtonText}>
              {saving ? 'Saving...' : 'Save Formatted Recipe'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancelButton} onPress={() => nav.goBack()}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
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
  content: {
    flex: 1,
    padding: spacing(2),
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing(4),
  },
  loadingText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginTop: spacing(3),
    textAlign: 'center',
  },
  loadingSubtext: {
    fontSize: 14,
    color: colors.subtext,
    marginTop: spacing(1),
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing(4),
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.error,
    marginTop: spacing(2),
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    color: colors.subtext,
    marginTop: spacing(1),
    textAlign: 'center',
    lineHeight: 22,
  },
  retryButton: {
    backgroundColor: colors.accent,
    borderRadius: radii.md,
    paddingHorizontal: spacing(4),
    paddingVertical: spacing(2),
    marginTop: spacing(3),
  },
  retryButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  manualButton: {
    borderRadius: radii.md,
    paddingHorizontal: spacing(4),
    paddingVertical: spacing(2),
    marginTop: spacing(2),
  },
  manualButtonText: {
    color: colors.subtext,
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    marginBottom: spacing(4),
  },
  title: {
    fontSize: fonts.h1,
    fontWeight: '900',
    color: colors.text,
  },
  subtitle: {
    fontSize: 16,
    color: colors.subtext,
    marginTop: spacing(0.5),
  },
  section: {
    marginBottom: spacing(3),
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing(1),
  },
  input: {
    backgroundColor: colors.card,
    borderRadius: radii.md,
    padding: spacing(2),
    fontSize: 16,
    borderWidth: 1,
    borderColor: colors.line,
    color: colors.text,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  ingredientRow: {
    flexDirection: 'row',
    gap: spacing(1),
    marginBottom: spacing(1),
  },
  ingredientAmount: {
    width: 80,
  },
  ingredientName: {
    flex: 1,
  },
  instructionRow: {
    flexDirection: 'row',
    gap: spacing(2),
    marginBottom: spacing(2),
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing(2),
  },
  stepNumberText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.white,
  },
  instructionInput: {
    flex: 1,
    minHeight: 50,
  },
  row: {
    flexDirection: 'row',
    gap: spacing(2),
  },
  halfSection: {
    flex: 1,
  },

  // Button container for proper spacing
  buttonContainer: {
    marginTop: spacing(4),
    marginBottom: spacing(4),
    gap: spacing(3),
  },
  saveButton: {
    backgroundColor: colors.accent,
    borderRadius: radii.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing(3),
    paddingHorizontal: spacing(4),
    gap: spacing(1.5),
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing(2.5),
    paddingHorizontal: spacing(4),
  },
  cancelButtonText: {
    color: colors.subtext,
    fontSize: 16,
    fontWeight: '600',
  },

  // Enhanced recipe card styles
  tagContainer: {
    flexDirection: 'row',
    gap: spacing(1),
    marginTop: spacing(2),
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: colors.accent,
    borderRadius: radii.sm,
    paddingHorizontal: spacing(1.5),
    paddingVertical: spacing(0.5),
  },
  tagText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '600',
  },

  recipeCard: {
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    padding: spacing(3),
    marginBottom: spacing(3),
    borderWidth: 1,
    borderColor: colors.line,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  titleSection: {
    marginBottom: spacing(3),
  },
  titleInput: {
    fontSize: 20,
    fontWeight: '700',
  },

  descriptionSection: {
    marginBottom: spacing(3),
  },

  ingredientsSection: {
    marginBottom: spacing(3),
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing(2),
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  ingredientCount: {
    fontSize: 14,
    color: colors.subtext,
    fontWeight: '600',
  },
  stepCount: {
    fontSize: 14,
    color: colors.subtext,
    fontWeight: '600',
  },

  ingredientsContainer: {
    gap: spacing(2),
  },
  ingredientCard: {
    backgroundColor: colors.bg,
    borderRadius: radii.md,
    padding: spacing(2),
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing(2),
    borderWidth: 1,
    borderColor: colors.line,
  },
  ingredientNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ingredientNumberText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.white,
  },
  ingredientInputs: {
    flex: 1,
    flexDirection: 'row',
    gap: spacing(1.5),
  },

  instructionsSection: {
    marginBottom: spacing(3),
  },
  instructionsContainer: {
    gap: spacing(3),
  },
  instructionCard: {
    backgroundColor: colors.bg,
    borderRadius: radii.md,
    padding: spacing(2.5),
    borderWidth: 1,
    borderColor: colors.line,
  },
  stepBadge: {
    backgroundColor: colors.accent,
    borderRadius: radii.sm,
    paddingHorizontal: spacing(2),
    paddingVertical: spacing(0.5),
    alignSelf: 'flex-start',
    marginBottom: spacing(1.5),
  },
  stepBadgeText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '700',
  },

  detailsSection: {
    marginBottom: spacing(2),
  },
  detailsGrid: {
    gap: spacing(2),
    marginTop: spacing(2),
  },
  detailCard: {
    backgroundColor: colors.bg,
    borderRadius: radii.md,
    padding: spacing(2),
    borderWidth: 1,
    borderColor: colors.line,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing(1),
  },
  detailInput: {
    fontSize: 14,
  },
});