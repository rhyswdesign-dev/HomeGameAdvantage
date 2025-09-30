import React, { useState, useLayoutEffect } from 'react';
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
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radii, fonts } from '../theme/tokens';
import type { RootStackParamList } from '../navigation/RootNavigator';
import { createRecipe } from '../lib/firestore';

interface ManualRecipeData {
  title: string;
  description: string;
  ingredients: Array<{
    name: string;
    amount: string;
    notes?: string;
  }>;
  instructions: string[];
  garnish: string;
  glassware: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  time: string;
  servings: number;
  tags: string[];
}

export default function ManualRecipeInputScreen() {
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [saving, setSaving] = useState(false);

  const [recipeData, setRecipeData] = useState<ManualRecipeData>({
    title: '',
    description: '',
    ingredients: [{ name: '', amount: '', notes: '' }],
    instructions: [''],
    garnish: '',
    glassware: '',
    difficulty: 'Easy',
    time: '',
    servings: 1,
    tags: [],
  });

  const [tagInput, setTagInput] = useState('');

  useLayoutEffect(() => {
    nav.setOptions({
      title: '📝 Manual Recipe Entry',
      headerStyle: { backgroundColor: colors.bg },
      headerTintColor: colors.text,
      headerTitleStyle: { color: colors.text, fontWeight: '900' },
      headerShadowVisible: false,
    });
  }, [nav]);

  const updateTitle = (text: string) => {
    setRecipeData(prev => ({ ...prev, title: text }));
  };

  const updateDescription = (text: string) => {
    setRecipeData(prev => ({ ...prev, description: text }));
  };

  const updateIngredient = (index: number, field: 'name' | 'amount' | 'notes', value: string) => {
    const updatedIngredients = [...recipeData.ingredients];
    updatedIngredients[index] = { ...updatedIngredients[index], [field]: value };
    setRecipeData(prev => ({ ...prev, ingredients: updatedIngredients }));
  };

  const addIngredient = () => {
    setRecipeData(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, { name: '', amount: '', notes: '' }]
    }));
  };

  const removeIngredient = (index: number) => {
    if (recipeData.ingredients.length > 1) {
      const updatedIngredients = recipeData.ingredients.filter((_, i) => i !== index);
      setRecipeData(prev => ({ ...prev, ingredients: updatedIngredients }));
    }
  };

  const updateInstruction = (index: number, value: string) => {
    const updatedInstructions = [...recipeData.instructions];
    updatedInstructions[index] = value;
    setRecipeData(prev => ({ ...prev, instructions: updatedInstructions }));
  };

  const addInstruction = () => {
    setRecipeData(prev => ({
      ...prev,
      instructions: [...prev.instructions, '']
    }));
  };

  const removeInstruction = (index: number) => {
    if (recipeData.instructions.length > 1) {
      const updatedInstructions = recipeData.instructions.filter((_, i) => i !== index);
      setRecipeData(prev => ({ ...prev, instructions: updatedInstructions }));
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !recipeData.tags.includes(tagInput.trim())) {
      setRecipeData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setRecipeData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSave = async () => {
    // Validate required fields
    if (!recipeData.title.trim()) {
      Alert.alert('Error', 'Recipe title is required');
      return;
    }

    if (recipeData.ingredients.some(ing => !ing.name.trim())) {
      Alert.alert('Error', 'All ingredients must have names');
      return;
    }

    if (recipeData.instructions.some(inst => !inst.trim())) {
      Alert.alert('Error', 'All instruction steps must be filled');
      return;
    }

    try {
      setSaving(true);

      // Structure the data for Firebase, filtering out undefined values
      const aiFormattedData = {
        title: recipeData.title.trim(),
        description: recipeData.description.trim(),
        ingredients: recipeData.ingredients
          .filter(ing => ing.name.trim())
          .map(ing => {
            const ingredient: any = {
              name: ing.name.trim(),
              amount: ing.amount.trim(),
            };
            if (ing.notes?.trim()) {
              ingredient.notes = ing.notes.trim();
            }
            return ingredient;
          }),
        instructions: recipeData.instructions
          .filter(inst => inst.trim())
          .map(inst => inst.trim()),
        difficulty: recipeData.difficulty,
        servings: recipeData.servings,
        tags: recipeData.tags,
      };

      // Add optional fields only if they have values
      if (recipeData.garnish.trim()) {
        aiFormattedData.garnish = recipeData.garnish.trim();
      }
      if (recipeData.glassware.trim()) {
        aiFormattedData.glassware = recipeData.glassware.trim();
      }
      if (recipeData.time.trim()) {
        aiFormattedData.time = recipeData.time.trim();
      }

      const recipeForFirebase = {
        title: recipeData.title.trim(),
        tags: recipeData.tags,
        aiFormatted: true, // Mark as structured manually
        aiFormattedData: aiFormattedData,
      };

      await createRecipe(recipeForFirebase);

      Alert.alert(
        'Success!',
        'Recipe has been created successfully.',
        [
          {
            text: 'Done',
            onPress: () => nav.navigate('Main'),
          },
        ]
      );

    } catch (error: any) {
      console.error('Save error:', error);
      Alert.alert('Error', error.message || 'Failed to save recipe');
    } finally {
      setSaving(false);
    }
  };

  const difficultyOptions = ['Easy', 'Medium', 'Hard'] as const;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Create Your Recipe</Text>
          <Text style={styles.subtitle}>Fill in the details to create a structured recipe card</Text>
        </View>

        {/* Recipe Title */}
        <View style={styles.section}>
          <Text style={styles.label}>Recipe Title *</Text>
          <TextInput
            style={styles.input}
            value={recipeData.title}
            onChangeText={updateTitle}
            placeholder="e.g., Classic Old Fashioned"
            placeholderTextColor={colors.muted}
          />
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={recipeData.description}
            onChangeText={updateDescription}
            placeholder="Brief description of your recipe..."
            placeholderTextColor={colors.muted}
            multiline
            numberOfLines={3}
          />
        </View>

        {/* Ingredients */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.label}>Ingredients *</Text>
            <TouchableOpacity style={styles.addButton} onPress={addIngredient}>
              <Ionicons name="add-circle" size={20} color={colors.accent} />
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
          </View>

          {recipeData.ingredients.map((ingredient, index) => (
            <View key={index} style={styles.ingredientRow}>
              <TextInput
                style={[styles.input, styles.ingredientAmount]}
                value={ingredient.amount}
                onChangeText={(text) => updateIngredient(index, 'amount', text)}
                placeholder="2 oz"
                placeholderTextColor={colors.muted}
              />
              <TextInput
                style={[styles.input, styles.ingredientName]}
                value={ingredient.name}
                onChangeText={(text) => updateIngredient(index, 'name', text)}
                placeholder="Ingredient name"
                placeholderTextColor={colors.muted}
              />
              {recipeData.ingredients.length > 1 && (
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => removeIngredient(index)}
                >
                  <Ionicons name="remove-circle" size={20} color={colors.error} />
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>

        {/* Instructions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.label}>Instructions *</Text>
            <TouchableOpacity style={styles.addButton} onPress={addInstruction}>
              <Ionicons name="add-circle" size={20} color={colors.accent} />
              <Text style={styles.addButtonText}>Add Step</Text>
            </TouchableOpacity>
          </View>

          {recipeData.instructions.map((instruction, index) => (
            <View key={index} style={styles.instructionRow}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>{index + 1}</Text>
              </View>
              <TextInput
                style={[styles.input, styles.instructionInput]}
                value={instruction}
                onChangeText={(text) => updateInstruction(index, text)}
                placeholder={`Step ${index + 1} instructions...`}
                placeholderTextColor={colors.muted}
                multiline
              />
              {recipeData.instructions.length > 1 && (
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => removeInstruction(index)}
                >
                  <Ionicons name="remove-circle" size={20} color={colors.error} />
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>

        {/* Details Row */}
        <View style={styles.row}>
          <View style={styles.halfSection}>
            <Text style={styles.label}>Garnish</Text>
            <TextInput
              style={styles.input}
              value={recipeData.garnish}
              onChangeText={(text) => setRecipeData(prev => ({ ...prev, garnish: text }))}
              placeholder="Orange peel"
              placeholderTextColor={colors.muted}
            />
          </View>
          <View style={styles.halfSection}>
            <Text style={styles.label}>Glassware</Text>
            <TextInput
              style={styles.input}
              value={recipeData.glassware}
              onChangeText={(text) => setRecipeData(prev => ({ ...prev, glassware: text }))}
              placeholder="Rocks glass"
              placeholderTextColor={colors.muted}
            />
          </View>
        </View>

        {/* Difficulty and Time Row */}
        <View style={styles.row}>
          <View style={styles.difficultySection}>
            <Text style={styles.label}>Difficulty</Text>
            <View style={styles.difficultyContainer}>
              {difficultyOptions.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.difficultyButton,
                    recipeData.difficulty === option && styles.difficultyButtonActive
                  ]}
                  onPress={() => setRecipeData(prev => ({ ...prev, difficulty: option }))}
                >
                  <Text
                    style={[
                      styles.difficultyButtonText,
                      recipeData.difficulty === option && styles.difficultyButtonTextActive
                    ]}
                    numberOfLines={1}
                  >
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <View style={styles.timeSection}>
            <Text style={styles.label}>Time</Text>
            <TextInput
              style={styles.input}
              value={recipeData.time}
              onChangeText={(text) => setRecipeData(prev => ({ ...prev, time: text }))}
              placeholder="5 min"
              placeholderTextColor={colors.muted}
            />
          </View>
        </View>

        {/* Tags */}
        <View style={styles.section}>
          <Text style={styles.label}>Tags</Text>
          <View style={styles.tagInputRow}>
            <TextInput
              style={[styles.input, styles.tagInput]}
              value={tagInput}
              onChangeText={setTagInput}
              placeholder="Add a tag..."
              placeholderTextColor={colors.muted}
              onSubmitEditing={addTag}
            />
            <TouchableOpacity style={styles.addTagButton} onPress={addTag}>
              <Ionicons name="add" size={20} color={colors.white} />
            </TouchableOpacity>
          </View>

          {recipeData.tags.length > 0 && (
            <View style={styles.tagsContainer}>
              {recipeData.tags.map((tag, index) => (
                <View key={index} style={styles.tagChip}>
                  <Text style={styles.tagText}>{tag}</Text>
                  <TouchableOpacity onPress={() => removeTag(tag)}>
                    <Ionicons name="close" size={16} color={colors.muted} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Save Button */}
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
            {saving ? 'Saving...' : 'Save Recipe'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.cancelButton} onPress={() => nav.goBack()}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing(1),
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
    alignItems: 'center',
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
    alignItems: 'flex-start',
    gap: spacing(1.5),
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
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing(0.5),
  },
  addButtonText: {
    color: colors.accent,
    fontSize: 14,
    fontWeight: '600',
  },
  removeButton: {
    padding: spacing(0.5),
  },
  row: {
    flexDirection: 'row',
    gap: spacing(2),
    marginBottom: spacing(3),
  },
  halfSection: {
    flex: 1,
  },
  difficultySection: {
    flex: 2,
  },
  timeSection: {
    flex: 1,
  },
  difficultyContainer: {
    flexDirection: 'row',
    gap: spacing(1),
  },
  difficultyButton: {
    flex: 1,
    paddingVertical: spacing(1.5),
    paddingHorizontal: spacing(1.5),
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  difficultyButtonActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  difficultyButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
  },
  difficultyButtonTextActive: {
    color: colors.white,
  },
  tagInputRow: {
    flexDirection: 'row',
    gap: spacing(1),
    marginBottom: spacing(1),
  },
  tagInput: {
    flex: 1,
  },
  addTagButton: {
    backgroundColor: colors.accent,
    borderRadius: radii.md,
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing(1),
  },
  tagChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing(0.5),
    backgroundColor: colors.card,
    borderRadius: radii.md,
    paddingHorizontal: spacing(1.5),
    paddingVertical: spacing(0.5),
    borderWidth: 1,
    borderColor: colors.line,
  },
  tagText: {
    fontSize: 14,
    color: colors.text,
  },
  saveButton: {
    backgroundColor: colors.accent,
    borderRadius: radii.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing(2.5),
    paddingHorizontal: spacing(3),
    gap: spacing(1),
    marginTop: spacing(3),
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
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing(2.5),
    paddingHorizontal: spacing(3),
    marginTop: spacing(2),
    marginBottom: spacing(4),
  },
  cancelButtonText: {
    color: colors.subtext,
    fontSize: 16,
    fontWeight: '600',
  },
});