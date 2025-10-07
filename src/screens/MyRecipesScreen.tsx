/**
 * My Recipes Screen - Shows user-created and AI-generated recipes
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, FlatList, Alert } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radii } from '../theme/tokens';
import { useUserRecipes, UserRecipe } from '../store/useUserRecipes';

type MyRecipesScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'MyRecipes'>;
};

export default function MyRecipesScreen({ navigation }: MyRecipesScreenProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'created' | 'ai' | 'modified'>('all');
  const { recipes, isLoading, loadRecipes, deleteRecipe } = useUserRecipes();

  useEffect(() => {
    loadRecipes();
  }, []);

  const userRecipes = recipes;

  const filteredRecipes = userRecipes.filter(recipe => {
    if (activeTab === 'all') return true;
    if (activeTab === 'created') return recipe.type === 'created';
    if (activeTab === 'ai') return recipe.type === 'ai_generated';
    if (activeTab === 'modified') return recipe.type === 'modified';
    return true;
  });

  const TabButton = ({ id, label, count }: { id: typeof activeTab; label: string; count: number }) => (
    <Pressable
      style={[
        styles.tabButton,
        activeTab === id && styles.activeTabButton
      ]}
      onPress={() => setActiveTab(id)}
    >
      <Text style={[
        styles.tabButtonText,
        activeTab === id && styles.activeTabButtonText
      ]}>
        {label} {count > 0 && `(${count})`}
      </Text>
    </Pressable>
  );

  const EmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="restaurant-outline" size={64} color={colors.muted} />
      <Text style={styles.emptyTitle}>No Recipes Yet</Text>
      <Text style={styles.emptyDescription}>
        Start creating your own cocktail recipes or generate them with AI
      </Text>
      <Pressable
        style={styles.createButton}
        onPress={() => navigation.navigate('AddRecipe')}
      >
        <Ionicons name="add-circle" size={20} color={colors.background} />
        <Text style={styles.createButtonText}>Create First Recipe</Text>
      </Pressable>
    </View>
  );

  const RecipeCard = ({ recipe }: { recipe: UserRecipe }) => (
    <View style={styles.recipeCard}>
      <Pressable
        style={styles.recipeCardContent}
        onPress={() => navigation.navigate('RecipeDetail', { recipe })}
      >
        <View style={styles.recipeHeader}>
          <Text style={styles.recipeName}>{recipe.name}</Text>
          <View style={styles.recipeHeaderRight}>
            <View style={[styles.typeBadge, { backgroundColor: getTypeBadgeColor(recipe.type) }]}>
              <Text style={styles.typeBadgeText}>{getTypeLabel(recipe.type)}</Text>
            </View>
            <Pressable
              style={styles.deleteButton}
              onPress={() => handleDeleteRecipe(recipe)}
              hitSlop={8}
            >
              <Ionicons name="trash-outline" size={18} color={colors.error} />
            </Pressable>
          </View>
        </View>
        {recipe.description && (
          <Text style={styles.recipeDescription} numberOfLines={2}>
            {recipe.description}
          </Text>
        )}
        <View style={styles.recipeFooter}>
          <Text style={styles.recipeDate}>
            Created {recipe.createdAt.toLocaleDateString()}
          </Text>
          <Ionicons name="chevron-forward" size={16} color={colors.muted} />
        </View>
      </Pressable>
    </View>
  );

  const getTypeBadgeColor = (type: UserRecipe['type']) => {
    switch (type) {
      case 'created': return colors.accent;
      case 'ai_generated': return colors.primary;
      case 'modified': return '#FF9800';
      default: return colors.muted;
    }
  };

  const getTypeLabel = (type: UserRecipe['type']) => {
    switch (type) {
      case 'created': return 'Created';
      case 'ai_generated': return 'AI Generated';
      case 'modified': return 'Modified';
      default: return 'Recipe';
    }
  };

  const getTabCount = (type: typeof activeTab) => {
    if (type === 'all') return userRecipes.length;
    if (type === 'created') return userRecipes.filter(r => r.type === 'created').length;
    if (type === 'ai') return userRecipes.filter(r => r.type === 'ai_generated').length;
    if (type === 'modified') return userRecipes.filter(r => r.type === 'modified').length;
    return 0;
  };

  const handleDeleteRecipe = (recipe: UserRecipe) => {
    Alert.alert(
      'Delete Recipe',
      `Are you sure you want to delete "${recipe.name}"? This action cannot be undone.`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteRecipe(recipe.id);
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Header Actions */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.headerActionsScroll}
        contentContainerStyle={styles.headerActions}
      >
        <Pressable
          style={styles.actionButton}
          onPress={() => navigation.navigate('AddRecipe')}
        >
          <Ionicons name="create-outline" size={20} color={colors.accent} />
          <Text style={styles.actionButtonText}>Create Cocktail</Text>
        </Pressable>

        <Pressable
          style={styles.actionButton}
          onPress={() => navigation.navigate('URLRecipeInput')}
        >
          <Ionicons name="link" size={20} color={colors.accent} />
          <Text style={styles.actionButtonText}>From URL</Text>
        </Pressable>

        <Pressable
          style={styles.actionButton}
          onPress={() => navigation.navigate('AIRecipeFormat')}
        >
          <Ionicons name="sparkles" size={20} color={colors.primary} />
          <Text style={styles.actionButtonText}>AI Generate</Text>
        </Pressable>
      </ScrollView>

      {/* Filter Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tabsContainer}
        contentContainerStyle={styles.tabsContent}
      >
        <TabButton id="all" label="All" count={getTabCount('all')} />
        <TabButton id="created" label="My Creations" count={getTabCount('created')} />
        <TabButton id="ai" label="AI Generated" count={getTabCount('ai')} />
        <TabButton id="modified" label="Modified" count={getTabCount('modified')} />
      </ScrollView>

      {/* Content */}
      {filteredRecipes.length === 0 ? (
        <EmptyState />
      ) : (
        <FlatList
          data={filteredRecipes}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <RecipeCard recipe={item} />}
          contentContainerStyle={styles.recipesList}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  headerActionsScroll: {
    maxHeight: 60,
    marginBottom: spacing(1),
  },
  headerActions: {
    flexDirection: 'row',
    paddingHorizontal: spacing(2),
    paddingVertical: spacing(1),
    gap: spacing(1.5),
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    paddingHorizontal: spacing(2.5),
    paddingVertical: spacing(1.5),
    borderRadius: radii.lg,
    gap: 8,
    minWidth: 120,
    justifyContent: 'center',
  },
  actionButtonText: {
    color: colors.text,
    fontWeight: '600',
    fontSize: 14,
  },
  tabsContainer: {
    maxHeight: 50,
    marginBottom: spacing(1),
  },
  tabsContent: {
    paddingHorizontal: spacing(2),
    gap: spacing(1.5),
    paddingVertical: spacing(0.5),
  },
  tabButton: {
    paddingHorizontal: spacing(2),
    paddingVertical: spacing(1.5),
    borderRadius: radii.lg,
    backgroundColor: colors.card,
    minWidth: 80,
    alignItems: 'center',
  },
  activeTabButton: {
    backgroundColor: colors.accent,
  },
  tabButtonText: {
    color: colors.text,
    fontWeight: '500',
    fontSize: 14,
  },
  activeTabButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing(3),
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginTop: spacing(2),
    marginBottom: spacing(1),
  },
  emptyDescription: {
    fontSize: 16,
    color: colors.muted,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: spacing(3),
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.accent,
    paddingHorizontal: spacing(2),
    paddingVertical: spacing(1.5),
    borderRadius: radii.lg,
    gap: 8,
  },
  createButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
  recipesList: {
    padding: spacing(2),
    paddingTop: spacing(1),
  },
  recipeCard: {
    backgroundColor: colors.card,
    borderRadius: radii.xl,
    marginBottom: spacing(2),
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  recipeCardContent: {
    padding: spacing(2),
  },
  recipeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing(1),
  },
  recipeHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing(1.5),
  },
  recipeName: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    flex: 1,
    marginRight: spacing(1),
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radii.sm,
  },
  typeBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  recipeDescription: {
    fontSize: 14,
    color: colors.muted,
    lineHeight: 20,
    marginBottom: spacing(1.5),
  },
  recipeFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  recipeDate: {
    fontSize: 12,
    color: colors.muted,
  },
  deleteButton: {
    padding: spacing(0.5),
    borderRadius: radii.sm,
    backgroundColor: colors.bg,
    borderWidth: 1,
    borderColor: colors.line,
  },
});