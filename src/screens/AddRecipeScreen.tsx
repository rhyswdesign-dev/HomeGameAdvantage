import React, { useState, useLayoutEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  ScrollView,
  Modal,
  FlatList,
} from 'react-native';
import { colors, spacing, radii, fonts } from '../theme/tokens';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/RootNavigator';
import { useUserRecipes } from '../store/useUserRecipes';

type ManualRecipe = {
  title: string;
  description: string;
  ingredients: Array<{
    name: string;
    amount: string;
  }>;
  instructions: string[];
  garnish: string;
  glassware: string;
  time: string;
  servings: number;
  tags: string[];
};

const measurementOptions = ['BS', '0.25', '0.5', '0.75', '1', '1.25', '1.5', '1.75', '2', '2.25', '2.5'];

const spiritsOptions = [
  'Bourbon Whiskey',
  'Rye Whiskey',
  'Scottish Whisky',
  'Irish Whiskey',
  'London Dry Gin',
  'Navy Strength Gin',
  'Barrel Aged Gin',
  'Premium Vodka',
  'White Rum',
  'Dark Rum',
  'Aged Rum',
  'Blanco Tequila',
  'Reposado Tequila',
  'Añejo Tequila',
  'Highland Crown',
  'Botanical Crown',
  'Crystal Peak',
  'Agave Real',
  'MixMind Rum'
];

const juicesOptions = [
  'Fresh Lemon Juice',
  'Fresh Lime Juice',
  'Fresh Orange Juice',
  'Fresh Grapefruit Juice',
  'Cranberry Juice',
  'Pineapple Juice',
  'Apple Juice',
  'Pomegranate Juice',
  'Fresh Ginger Juice',
  'Tomato Juice'
];

const syrupsOptions = [
  'Simple Syrup',
  'Honey Syrup',
  'Agave Syrup',
  'Demerara Syrup',
  'Maple Syrup',
  'Ginger Syrup',
  'Cinnamon Syrup',
  'Vanilla Syrup',
  'Grenadine',
  'Orgeat Syrup'
];

const glasswareOptions = [
  'Rocks Glass',
  'Highball Glass',
  'Coupe Glass',
  'Martini Glass',
  'Copa Glass',
  'Champagne Flute',
  'Hurricane Glass',
  'Copper Mug',
  'Wine Glass',
  'Shot Glass',
  'Collins Glass',
  'Nick & Nora Glass',
  'Snifter',
  'Tiki Mug'
];

const difficultyOptions = [
  'Beginner',
  'Easy',
  'Intermediate',
  'Advanced',
  'Expert'
];

export default function AddRecipeScreen() {
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { addRecipe } = useUserRecipes();
  const [loading, setLoading] = useState(false);
  const [showMeasurementModal, setShowMeasurementModal] = useState(false);
  const [showIngredientModal, setShowIngredientModal] = useState(false);
  const [showGlasswareModal, setShowGlasswareModal] = useState(false);
  const [showDifficultyModal, setShowDifficultyModal] = useState(false);
  const [selectedIngredientIndex, setSelectedIngredientIndex] = useState<number>(0);
  const [ingredientModalType, setIngredientModalType] = useState<'spirits' | 'juices' | 'syrups'>('spirits');

  const [recipe, setRecipe] = useState<ManualRecipe>({
    title: '',
    description: '',
    ingredients: [{ name: '', amount: '' }],
    instructions: [''],
    garnish: '',
    glassware: '',
    time: '',
    servings: 1,
    tags: []
  });

  useLayoutEffect(() => {
    nav.setOptions({
      title: 'Create Recipe',
      headerStyle: { backgroundColor: colors.bg },
      headerTintColor: colors.text,
      headerTitleStyle: { color: colors.text, fontWeight: '900' },
      headerShadowVisible: false,
    });
  }, [nav]);

  const updateIngredient = (index: number, field: 'name' | 'amount', value: string) => {
    const updatedIngredients = [...recipe.ingredients];
    updatedIngredients[index] = { ...updatedIngredients[index], [field]: value };
    setRecipe({ ...recipe, ingredients: updatedIngredients });
  };

  const addIngredient = () => {
    setRecipe({
      ...recipe,
      ingredients: [...recipe.ingredients, { name: '', amount: '' }]
    });
  };

  const removeIngredient = (index: number) => {
    if (recipe.ingredients.length > 1) {
      setRecipe({
        ...recipe,
        ingredients: recipe.ingredients.filter((_, i) => i !== index)
      });
    }
  };

  const updateInstruction = (index: number, value: string) => {
    const updatedInstructions = [...recipe.instructions];
    updatedInstructions[index] = value;
    setRecipe({ ...recipe, instructions: updatedInstructions });
  };

  const addInstruction = () => {
    setRecipe({
      ...recipe,
      instructions: [...recipe.instructions, '']
    });
  };

  const removeInstruction = (index: number) => {
    if (recipe.instructions.length > 1) {
      setRecipe({
        ...recipe,
        instructions: recipe.instructions.filter((_, i) => i !== index)
      });
    }
  };

  const saveRecipe = async () => {
    if (!recipe.title.trim()) {
      Alert.alert('Required Field', 'Please provide a recipe title');
      return;
    }

    if (recipe.ingredients.length === 0 || !recipe.ingredients[0].name.trim()) {
      Alert.alert('Required Field', 'Please provide at least one ingredient');
      return;
    }

    if (recipe.instructions.length === 0 || !recipe.instructions[0].trim()) {
      Alert.alert('Required Field', 'Please provide at least one instruction');
      return;
    }

    setLoading(true);
    try {
      await addRecipe({
        name: recipe.title.trim(),
        type: 'created',
        description: recipe.description.trim() || 'Custom cocktail recipe',
        ingredients: recipe.ingredients
          .filter(ing => ing.name.trim())
          .map(ing => ({
            name: ing.name.trim(),
            amount: ing.amount.trim(),
            unit: '',
            notes: ''
          })),
        instructions: recipe.instructions.filter(inst => inst.trim()),
        tags: recipe.tags,
        difficulty: recipe.tags.length ? recipe.tags[0] : 'Easy',
        prepTime: parseInt(recipe.time) || 5,
        servings: recipe.servings,
        notes: `Garnish: ${recipe.garnish}, Glass: ${recipe.glassware}`
      });

      Alert.alert('Success', 'Recipe saved successfully!', [
        { text: 'Create Another', onPress: resetForm },
        { text: 'View My Recipes', onPress: () => nav.navigate('MyRecipes') }
      ]);
    } catch (error: any) {
      console.error('Save error:', error);
      Alert.alert('Error', `Failed to save recipe: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setRecipe({
      title: '',
      description: '',
      ingredients: [{ name: '', amount: '' }],
      instructions: [''],
      garnish: '',
      glassware: '',
      time: '',
      servings: 1,
      tags: []
    });
  };

  const openMeasurementModal = (index: number) => {
    setSelectedIngredientIndex(index);
    setShowMeasurementModal(true);
  };

  const selectMeasurement = (measurement: string) => {
    updateIngredient(selectedIngredientIndex, 'amount', measurement + ' oz');
    setShowMeasurementModal(false);
  };

  const openIngredientModal = (index: number, type: 'spirits' | 'juices' | 'syrups') => {
    setSelectedIngredientIndex(index);
    setIngredientModalType(type);
    setShowIngredientModal(true);
  };

  const selectIngredient = (ingredient: string) => {
    // If it's the last ingredient and it's empty, use it
    const targetIndex = selectedIngredientIndex;
    if (targetIndex < recipe.ingredients.length && !recipe.ingredients[targetIndex].name) {
      updateIngredient(targetIndex, 'name', ingredient);
    } else {
      // Add a new ingredient
      setRecipe({
        ...recipe,
        ingredients: [...recipe.ingredients, { name: ingredient, amount: '' }]
      });
    }
    setShowIngredientModal(false);
  };

  const getIngredientOptions = () => {
    switch (ingredientModalType) {
      case 'spirits': return spiritsOptions;
      case 'juices': return juicesOptions;
      case 'syrups': return syrupsOptions;
      default: return [];
    }
  };

  const selectGlassware = (glassware: string) => {
    setRecipe({ ...recipe, glassware });
    setShowGlasswareModal(false);
  };

  const selectDifficulty = (difficulty: string) => {
    setRecipe({ ...recipe, tags: [difficulty] });
    setShowDifficultyModal(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Create New Recipe</Text>
          <Text style={styles.subtitle}>Build your own custom cocktail recipe</Text>
        </View>

        {/* Recipe Title */}
        <View style={styles.section}>
          <Text style={styles.label}>Recipe Name *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., My Perfect Manhattan"
            placeholderTextColor={colors.subtext}
            value={recipe.title}
            onChangeText={(text) => setRecipe({...recipe, title: text})}
          />
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="What makes this recipe special?"
            placeholderTextColor={colors.subtext}
            value={recipe.description}
            onChangeText={(text) => setRecipe({...recipe, description: text})}
            multiline
            numberOfLines={3}
          />
        </View>

        {/* Ingredients */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Ingredients *</Text>
            <View style={styles.sectionHeaderRight}>
              <Text style={styles.ingredientCount}>{recipe.ingredients.length} items</Text>
              <TouchableOpacity onPress={addIngredient} style={styles.addButton}>
                <Ionicons name="add" size={16} color={colors.accent} />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.ingredientsContainer}>
            {recipe.ingredients.map((ingredient, index) => (
              <View key={index} style={styles.ingredientCard}>
                <View style={styles.ingredientHeader}>
                  <View style={styles.ingredientNumber}>
                    <Text style={styles.ingredientNumberText}>{index + 1}</Text>
                  </View>
                  {recipe.ingredients.length > 1 && (
                    <TouchableOpacity
                      onPress={() => removeIngredient(index)}
                      style={styles.removeButton}
                    >
                      <Ionicons name="close" size={16} color={colors.error} />
                    </TouchableOpacity>
                  )}
                </View>

                <View style={styles.ingredientInputs}>
                  <TouchableOpacity
                    style={[styles.input, styles.ingredientAmount, styles.dropdownButton]}
                    onPress={() => openMeasurementModal(index)}
                  >
                    <Text style={[styles.dropdownText, !ingredient.amount && styles.placeholderText]}>
                      {ingredient.amount || '2 oz'}
                    </Text>
                    <Ionicons name="chevron-down" size={16} color={colors.subtext} />
                  </TouchableOpacity>
                  <TextInput
                    style={[styles.input, styles.ingredientName]}
                    value={ingredient.name}
                    onChangeText={(text) => updateIngredient(index, 'name', text)}
                    placeholder="Bourbon whiskey"
                    placeholderTextColor={colors.subtext}
                  />
                </View>

              </View>
            ))}
          </View>
        </View>

        {/* Quick Add Ingredients */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Add Ingredients</Text>
          <View style={styles.quickAddContainer}>
            <TouchableOpacity
              style={styles.quickAddButton}
              onPress={() => {
                // Find first empty ingredient or use last one
                const emptyIndex = recipe.ingredients.findIndex(ing => !ing.name);
                const targetIndex = emptyIndex >= 0 ? emptyIndex : recipe.ingredients.length - 1;
                openIngredientModal(targetIndex, 'spirits');
              }}
            >
              <Ionicons name="wine" size={16} color={colors.accent} />
              <Text style={styles.quickAddText}>Spirits</Text>
              <Ionicons name="add" size={14} color={colors.accent} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickAddButton}
              onPress={() => {
                const emptyIndex = recipe.ingredients.findIndex(ing => !ing.name);
                const targetIndex = emptyIndex >= 0 ? emptyIndex : recipe.ingredients.length - 1;
                openIngredientModal(targetIndex, 'juices');
              }}
            >
              <Ionicons name="water" size={16} color={colors.accent} />
              <Text style={styles.quickAddText}>Juices</Text>
              <Ionicons name="add" size={14} color={colors.accent} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickAddButton}
              onPress={() => {
                const emptyIndex = recipe.ingredients.findIndex(ing => !ing.name);
                const targetIndex = emptyIndex >= 0 ? emptyIndex : recipe.ingredients.length - 1;
                openIngredientModal(targetIndex, 'syrups');
              }}
            >
              <Ionicons name="leaf" size={16} color={colors.accent} />
              <Text style={styles.quickAddText}>Syrups</Text>
              <Ionicons name="add" size={14} color={colors.accent} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Instructions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Instructions *</Text>
            <View style={styles.sectionHeaderRight}>
              <Text style={styles.stepCount}>{recipe.instructions.length} steps</Text>
              <TouchableOpacity onPress={addInstruction} style={styles.addButton}>
                <Ionicons name="add" size={16} color={colors.accent} />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.instructionsContainer}>
            {recipe.instructions.map((instruction, index) => (
              <View key={index} style={styles.instructionCard}>
                <View style={styles.stepHeader}>
                  <View style={styles.stepBadge}>
                    <Text style={styles.stepBadgeText}>Step {index + 1}</Text>
                  </View>
                  {recipe.instructions.length > 1 && (
                    <TouchableOpacity
                      onPress={() => removeInstruction(index)}
                      style={styles.removeButton}
                    >
                      <Ionicons name="close" size={16} color={colors.error} />
                    </TouchableOpacity>
                  )}
                </View>
                <TextInput
                  style={[styles.input, styles.instructionInput]}
                  value={instruction}
                  onChangeText={(text) => updateInstruction(index, text)}
                  placeholder={`Describe step ${index + 1}...`}
                  placeholderTextColor={colors.subtext}
                  multiline
                />
              </View>
            ))}
          </View>
        </View>

        {/* Recipe Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recipe Details</Text>
          <View style={styles.detailsGrid}>
            <View style={styles.detailCard}>
              <Text style={styles.detailLabel}>Garnish</Text>
              <TextInput
                style={[styles.input, styles.detailInput]}
                value={recipe.garnish}
                onChangeText={(text) => setRecipe({...recipe, garnish: text})}
                placeholder="Orange peel, cherry..."
                placeholderTextColor={colors.subtext}
              />
            </View>

            <View style={styles.detailCard}>
              <Text style={styles.detailLabel}>Glassware</Text>
              <TouchableOpacity
                style={[styles.input, styles.detailInput, styles.dropdownButton]}
                onPress={() => setShowGlasswareModal(true)}
              >
                <Text style={[styles.dropdownText, !recipe.glassware && styles.placeholderText]}>
                  {recipe.glassware || 'Rocks glass, coupe...'}
                </Text>
                <Ionicons name="chevron-down" size={16} color={colors.subtext} />
              </TouchableOpacity>
            </View>

            <View style={styles.detailCard}>
              <Text style={styles.detailLabel}>Prep Time (minutes)</Text>
              <TextInput
                style={[styles.input, styles.detailInput]}
                value={recipe.time}
                onChangeText={(text) => setRecipe({...recipe, time: text})}
                placeholder="5"
                placeholderTextColor={colors.subtext}
                keyboardType="number-pad"
              />
            </View>

            <View style={styles.detailCard}>
              <Text style={styles.detailLabel}>Servings</Text>
              <TextInput
                style={[styles.input, styles.detailInput]}
                value={recipe.servings.toString()}
                onChangeText={(text) => setRecipe({...recipe, servings: parseInt(text) || 1})}
                placeholder="1"
                placeholderTextColor={colors.subtext}
                keyboardType="number-pad"
              />
            </View>
          </View>
        </View>

        {/* Difficulty */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recipe Difficulty</Text>
          <TouchableOpacity
            style={[styles.input, styles.dropdownButton]}
            onPress={() => setShowDifficultyModal(true)}
          >
            <Text style={[styles.dropdownText, !recipe.tags.length && styles.placeholderText]}>
              {recipe.tags.length ? recipe.tags[0] : 'Select difficulty level'}
            </Text>
            <Ionicons name="chevron-down" size={16} color={colors.subtext} />
          </TouchableOpacity>
        </View>

        {/* Save Button */}
        <TouchableOpacity
          style={[styles.saveButton, loading && styles.saveButtonDisabled]}
          onPress={saveRecipe}
          disabled={loading}
        >
          <Text style={styles.saveButtonText}>
            {loading ? 'Saving...' : 'Save Recipe'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.cancelButton} onPress={resetForm}>
          <Text style={styles.cancelButtonText}>Clear Form</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Measurement Modal */}
      <Modal
        visible={showMeasurementModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowMeasurementModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Amount</Text>
              <TouchableOpacity
                onPress={() => setShowMeasurementModal(false)}
                style={styles.modalCloseButton}
              >
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={measurementOptions}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.measurementOption}
                  onPress={() => selectMeasurement(item)}
                >
                  <Text style={styles.measurementText}>{item} oz</Text>
                </TouchableOpacity>
              )}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </View>
      </Modal>

      {/* Ingredient Selection Modal */}
      <Modal
        visible={showIngredientModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowIngredientModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                Select {ingredientModalType.charAt(0).toUpperCase() + ingredientModalType.slice(1)}
              </Text>
              <TouchableOpacity
                onPress={() => setShowIngredientModal(false)}
                style={styles.modalCloseButton}
              >
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={getIngredientOptions()}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.measurementOption}
                  onPress={() => selectIngredient(item)}
                >
                  <Text style={styles.measurementText}>{item}</Text>
                </TouchableOpacity>
              )}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </View>
      </Modal>

      {/* Glassware Selection Modal */}
      <Modal
        visible={showGlasswareModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowGlasswareModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Glassware</Text>
              <TouchableOpacity
                onPress={() => setShowGlasswareModal(false)}
                style={styles.modalCloseButton}
              >
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={glasswareOptions}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.measurementOption}
                  onPress={() => selectGlassware(item)}
                >
                  <Text style={styles.measurementText}>{item}</Text>
                </TouchableOpacity>
              )}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </View>
      </Modal>

      {/* Difficulty Selection Modal */}
      <Modal
        visible={showDifficultyModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowDifficultyModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Difficulty</Text>
              <TouchableOpacity
                onPress={() => setShowDifficultyModal(false)}
                style={styles.modalCloseButton}
              >
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={difficultyOptions}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.measurementOption}
                  onPress={() => selectDifficulty(item)}
                >
                  <Text style={styles.measurementText}>{item}</Text>
                </TouchableOpacity>
              )}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </View>
      </Modal>
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
    minHeight: 50,
    color: colors.text,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
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
  sectionHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing(1.5),
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
  addButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.error,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ingredientsContainer: {
    gap: spacing(2),
  },
  ingredientCard: {
    backgroundColor: colors.bg,
    borderRadius: radii.md,
    padding: spacing(2),
    borderWidth: 1,
    borderColor: colors.line,
    gap: spacing(2),
  },
  ingredientHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  ingredientAmount: {
    width: 80,
  },
  ingredientName: {
    flex: 1,
  },
  ingredientNotes: {
    minHeight: 40,
    fontSize: 14,
    fontStyle: 'italic',
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
  stepHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing(1.5),
  },
  stepBadge: {
    backgroundColor: colors.accent,
    borderRadius: radii.sm,
    paddingHorizontal: spacing(2),
    paddingVertical: spacing(0.5),
  },
  stepBadgeText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '700',
  },
  instructionInput: {
    minHeight: 50,
    textAlignVertical: 'top',
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
  saveButton: {
    backgroundColor: colors.accent,
    borderRadius: radii.md,
    padding: spacing(2.5),
    alignItems: 'center',
    marginTop: spacing(2),
  },
  saveButtonDisabled: {
    backgroundColor: colors.subtext,
    opacity: 0.6,
  },
  saveButtonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '700',
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderRadius: radii.md,
    padding: spacing(2.5),
    alignItems: 'center',
    marginTop: spacing(1.5),
  },
  cancelButtonText: {
    color: colors.subtext,
    fontSize: 16,
    fontWeight: '600',
  },

  // Dropdown styles
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dropdownText: {
    fontSize: 16,
    color: colors.text,
  },
  placeholderText: {
    color: colors.subtext,
  },

  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.card,
    borderTopLeftRadius: radii.xl,
    borderTopRightRadius: radii.xl,
    maxHeight: '50%',
    paddingBottom: spacing(4),
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing(2),
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  modalCloseButton: {
    padding: spacing(0.5),
  },
  measurementOption: {
    padding: spacing(2),
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  measurementText: {
    fontSize: 16,
    color: colors.text,
    textAlign: 'center',
  },

  // Quick Add styles
  quickAddContainer: {
    flexDirection: 'row',
    gap: spacing(1.5),
    marginTop: spacing(1),
  },
  quickAddButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.accent,
    borderRadius: radii.md,
    paddingVertical: spacing(1.5),
    paddingHorizontal: spacing(2),
    gap: spacing(0.5),
  },
  quickAddText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.accent,
  },
});