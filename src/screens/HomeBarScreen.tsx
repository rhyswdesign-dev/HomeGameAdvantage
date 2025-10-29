import React, { useState, useLayoutEffect, useCallback } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Animated,
  PanResponder,
  Image,
  Modal,
} from 'react-native';
import { colors, spacing, radii, fonts } from '../theme/tokens';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/RootNavigator';
import { HomeBar, BarIngredient, HomeBarService } from '../services/homeBarService';
import { ShoppingListStore } from '../services/shoppingListStore';

// Mock data for demonstration
const mockHomeBar: HomeBar = {
  id: 'default',
  userId: 'user1',
  name: 'My Home Bar',
  description: 'Personal cocktail ingredients',
  ingredients: [
    {
      id: '1',
      name: 'Tito\'s Vodka',
      category: 'spirit',
      subcategory: 'vodka',
      brand: 'Tito\'s',
      abv: 40,
      volume: 750,
      addedAt: new Date(),
      isFavorite: true,
      tags: ['premium', 'neutral'],
      image: 'https://cdn.shopify.com/s/files/1/0012/4021/1900/products/titos-handmade-vodka-750ml_1024x1024.jpg?v=1574708617',
    },
    {
      id: '2',
      name: 'Hendrick\'s Gin',
      category: 'spirit',
      subcategory: 'gin',
      brand: 'Hendrick\'s',
      abv: 44,
      volume: 700,
      addedAt: new Date(),
      isFavorite: true,
      tags: ['premium', 'juniper'],
      image: 'https://cdn.shopify.com/s/files/1/0012/4021/1900/products/hendricks-gin-750ml_1024x1024.jpg?v=1574708617',
    },
    {
      id: '3',
      name: 'Buffalo Trace Bourbon',
      category: 'spirit',
      subcategory: 'whiskey',
      brand: 'Buffalo Trace',
      abv: 45,
      volume: 750,
      addedAt: new Date(),
      isFavorite: false,
      tags: ['bourbon', 'american'],
      image: 'https://cdn.shopify.com/s/files/1/0012/4021/1900/products/buffalo-trace-bourbon-750ml_1024x1024.jpg?v=1574708617',
    },
    {
      id: '4',
      name: 'Espolòn Tequila',
      category: 'spirit',
      subcategory: 'tequila',
      brand: 'Espolòn',
      abv: 40,
      volume: 750,
      addedAt: new Date(),
      isFavorite: true,
      tags: ['blanco', 'agave'],
    },
    {
      id: '5',
      name: 'Cointreau',
      category: 'liqueur',
      subcategory: 'orange liqueur',
      brand: 'Cointreau',
      abv: 40,
      volume: 700,
      addedAt: new Date(),
      isFavorite: false,
      tags: ['orange', 'triple sec'],
    },
    {
      id: '6',
      name: 'Mount Gay Eclipse Rum',
      category: 'spirit',
      subcategory: 'rum',
      brand: 'Mount Gay',
      abv: 40,
      volume: 750,
      addedAt: new Date(),
      isFavorite: true,
      tags: ['golden', 'barbados'],
    },
  ],
  createdAt: new Date(),
  updatedAt: new Date(),
  isDefault: true,
};

const mockTasteProfile = {
  preferredSpirits: ['gin', 'whiskey'],
  flavorProfile: ['herbal', 'bitter'] as ('sweet' | 'sour' | 'bitter' | 'herbal' | 'fruity' | 'spicy')[],
  drinkStrength: 'medium' as 'light' | 'medium' | 'strong',
  experience: 'intermediate' as 'beginner' | 'intermediate' | 'expert',
};

// Swipeable Ingredient Card Component
interface SwipeableIngredientCardProps {
  ingredient: any;
  onDelete: () => void;
  onFinish: () => void;
  onPress: () => void;
  getCategoryIcon: (category: any) => string;
  getCategoryColor: (category: any) => string;
}

function SwipeableIngredientCard({
  ingredient,
  onDelete,
  onFinish,
  onPress,
  getCategoryIcon,
  getCategoryColor
}: SwipeableIngredientCardProps) {
  const [pan] = useState(new Animated.ValueXY());
  const [isSwipeActive, setIsSwipeActive] = useState(false);

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (evt, gestureState) => {
      return Math.abs(gestureState.dx) > 20;
    },
    onPanResponderGrant: () => {
      setIsSwipeActive(true);
    },
    onPanResponderMove: (evt, gestureState) => {
      // Only allow left swipe (negative dx)
      if (gestureState.dx < 0) {
        pan.setValue({ x: gestureState.dx, y: 0 });
      }
    },
    onPanResponderRelease: (evt, gestureState) => {
      if (gestureState.dx < -80) {
        // Swipe threshold reached - trigger finish action
        Animated.timing(pan, {
          toValue: { x: -200, y: 0 },
          duration: 200,
          useNativeDriver: false,
        }).start(() => {
          onFinish();
          // Reset position
          pan.setValue({ x: 0, y: 0 });
        });
      } else {
        // Snap back to original position
        Animated.spring(pan, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: false,
        }).start();
      }
      setIsSwipeActive(false);
    },
  });

  return (
    <View style={styles.ingredientCard}>
      {/* Finish Action Background */}
      <View style={styles.swipeBackground}>
        <Text style={styles.swipeText}>Finished</Text>
        <Ionicons name="checkmark-circle" size={20} color={colors.white} />
      </View>

      {/* Main Card Content */}
      <Animated.View
        style={[
          styles.swipeableContent,
          {
            transform: pan.getTranslateTransform(),
          },
        ]}
        {...panResponder.panHandlers}
      >
        <TouchableOpacity style={styles.ingredientContent} onPress={onPress}>
          <View style={styles.ingredientHeader}>
            {ingredient.image ? (
              <Image source={{ uri: ingredient.image }} style={styles.ingredientImage} />
            ) : (
              <Ionicons
                name={getCategoryIcon(ingredient.category)}
                size={24}
                color={getCategoryColor(ingredient.category)}
              />
            )}
          </View>

          <Text style={styles.ingredientName}>{ingredient.name}</Text>
          <Text style={styles.ingredientCategory}>{ingredient.subcategory || ingredient.category}</Text>

          {ingredient.volume && (
            <Text style={styles.ingredientVolume}>{ingredient.volume}ml</Text>
          )}
        </TouchableOpacity>

        {/* Delete button */}
        <TouchableOpacity style={styles.ingredientDeleteButton} onPress={onDelete}>
          <Ionicons name="trash-outline" size={16} color={colors.error} />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

export default function HomeBarScreen() {
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [homeBar, setHomeBar] = useState<HomeBar>(mockHomeBar);
  const [activeTab, setActiveTab] = useState<'inventory' | 'history'>('inventory');
  const [savedShoppingLists, setSavedShoppingLists] = useState<any[]>([]);
  const [consolidatedShoppingItems, setConsolidatedShoppingItems] = useState<any>({ itemsByRecipe: {}, allItems: [] });
  const [checkedShoppingItems, setCheckedShoppingItems] = useState<Set<string>>(new Set());
  const [layoutStyle, setLayoutStyle] = useState<'grid' | 'list' | 'cards' | 'minimal'>('minimal');
  const [filterByType, setFilterByType] = useState<string | null>(null);
  const [sortByType, setSortByType] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedIngredient, setSelectedIngredient] = useState<BarIngredient | null>(null);
  const [showIngredientModal, setShowIngredientModal] = useState(false);

  const cocktailSuggestions = HomeBarService.getCocktailSuggestions(homeBar, mockTasteProfile);
  const ingredientSuggestions = HomeBarService.getIngredientSuggestions(homeBar);

  // Mock history data
  const [historyItems] = useState([
    {
      id: 'hist1',
      name: 'Macallan 12',
      category: 'spirit',
      subcategory: 'whiskey',
      brand: 'Macallan',
      removedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
      reason: 'Finished bottle',
      notes: 'Was a gift from John',
    },
    {
      id: 'hist2',
      name: 'Cointreau',
      category: 'liqueur',
      subcategory: 'orange liqueur',
      brand: 'Cointreau',
      removedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
      reason: 'Removed from bar',
      notes: 'Rarely used',
    },
  ]);

  // Load shopping lists and stored ingredients when component mounts or when focused
  useFocusEffect(
    useCallback(() => {
      loadShoppingLists();
      loadStoredIngredients();
    }, [])
  );

  const loadShoppingLists = async () => {
    try {
      // Migrate existing lists to include subcategory
      await ShoppingListStore.migrateShoppingLists();

      const lists = await ShoppingListStore.getShoppingListsWithSpiritsCategory();
      const consolidated = await ShoppingListStore.getConsolidatedShoppingItems();
      setSavedShoppingLists(lists);
      setConsolidatedShoppingItems(consolidated);
    } catch (error) {
      console.error('Error loading shopping lists:', error);
    }
  };

  const loadStoredIngredients = async () => {
    try {
      const storedIngredients = await HomeBarService.getStoredIngredients();
      if (storedIngredients.length > 0) {
        // Merge stored ingredients with existing mock data
        setHomeBar(prev => ({
          ...prev,
          ingredients: [...prev.ingredients, ...storedIngredients]
        }));

        // Clear stored ingredients after loading to avoid duplicates
        await HomeBarService.clearStoredIngredients();
      }
    } catch (error) {
      console.error('Error loading stored ingredients:', error);
    }
  };

  const deleteShoppingList = async (listId: string) => {
    try {
      await ShoppingListStore.deleteShoppingList(listId);
      await loadShoppingLists(); // Refresh
    } catch (error) {
      Alert.alert('Error', 'Failed to delete shopping list');
    }
  };

  const deleteIngredient = (ingredientId: string) => {
    Alert.alert(
      'Remove Ingredient',
      'Are you sure you want to remove this ingredient from your bar?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            setHomeBar(prev => ({
              ...prev,
              ingredients: prev.ingredients.filter(ing => ing.id !== ingredientId)
            }));
          }
        }
      ]
    );
  };

  const addToShoppingList = async (item: any, source: string = 'Recommendation') => {
    try {
      await ShoppingListStore.addItemToShoppingList({
        name: item.name,
        category: item.category as any,
        brand: item.brand,
        notes: item.description,
        estimatedPrice: item.averagePrice,
        whereToFind: 'Liquor store, Wine & Spirits section',
      }, source);
      await loadShoppingLists(); // Refresh
      Alert.alert('Added!', `${item.name} added to your shopping list`);
    } catch (error) {
      Alert.alert('Error', 'Failed to add item to shopping list');
    }
  };

  const markItemAsPurchased = async (itemId: string, item: any) => {
    try {
      // Add to inventory
      const newIngredient: BarIngredient = {
        id: `purchased_${Date.now()}`,
        name: item.name,
        category: item.category,
        subcategory: item.category,
        brand: item.brand || 'Unknown',
        abv: 40, // Default
        volume: 750, // Default
        addedAt: new Date(),
        isFavorite: false,
        tags: [],
      };

      setHomeBar(prev => ({
        ...prev,
        ingredients: [...prev.ingredients, newIngredient]
      }));

      // Remove from shopping list by deleting the list
      const lists = await ShoppingListStore.getAllShoppingLists();
      const listToDelete = lists.find(list =>
        list.items.some((listItem: any) => listItem.id === itemId)
      );

      if (listToDelete) {
        await ShoppingListStore.deleteShoppingList(listToDelete.id);
      }

      await loadShoppingLists();
      Alert.alert('Added to Inventory!', `${item.name} has been added to your bar`);
    } catch (error) {
      Alert.alert('Error', 'Failed to mark item as purchased');
    }
  };

  const deleteShoppingItem = async (itemId: string) => {
    try {
      await ShoppingListStore.deleteShoppingItem(itemId);
      await loadShoppingLists();
      Alert.alert('Deleted', 'Item removed from shopping list');
    } catch (error) {
      Alert.alert('Error', 'Failed to delete item');
    }
  };

  const reAddToBar = async (historyItem: any) => {
    await addToShoppingList({
      name: historyItem.name,
      category: historyItem.category,
      brand: historyItem.brand,
      description: `Re-adding ${historyItem.name} to bar`,
      averagePrice: 25, // Default price
    }, 'Re-add');
  };

  const finishIngredient = (ingredientId: string) => {
    Alert.alert(
      'Mark as Finished',
      'Mark this bottle as finished and move to history?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Finished',
          style: 'destructive',
          onPress: () => {
            // Remove from current bar and add to history
            const ingredient = homeBar.ingredients.find(ing => ing.id === ingredientId);
            if (ingredient) {
              setHomeBar(prev => ({
                ...prev,
                ingredients: prev.ingredients.filter(ing => ing.id !== ingredientId)
              }));
              // In real app, would add to history with proper date
              Alert.alert('Moved to History', `${ingredient.name} has been moved to your bar history`);
            }
          }
        }
      ]
    );
  };

  const handleIngredientPress = (ingredient: BarIngredient) => {
    setSelectedIngredient(ingredient);
    setShowIngredientModal(true);
  };

  const getCocktailsForIngredient = (ingredient: BarIngredient) => {
    // Cocktails that match available recipe IDs in CocktailDetailScreen
    const cocktailDb: { [key: string]: string[] } = {
      'vodka': ['Moscow Mule', 'Cosmopolitan', 'Espresso Martini', 'Classic Martini'],
      'gin': ['Classic Martini', 'Negroni'],
      'whiskey': ['Old Fashioned', 'Manhattan'],
      'rum': ['Mojito', 'Daiquiri'],
      'tequila': ['Margarita'],
      'orange liqueur': ['Margarita', 'Cosmopolitan'],
    };

    const spiritType = ingredient.subcategory || ingredient.category;
    return cocktailDb[spiritType.toLowerCase()] || ['Classic cocktails featuring this ingredient'];
  };

  useLayoutEffect(() => {
    nav.setOptions({
      title: 'My Home Bar',
      headerStyle: { backgroundColor: colors.bg },
      headerTintColor: colors.text,
      headerTitleStyle: { color: colors.text, fontWeight: '900' },
      headerShadowVisible: false,
      headerRight: () => (
        <View style={{ flexDirection: 'row', gap: spacing(1.5) }}>
          <TouchableOpacity onPress={() => nav.navigate('SpiritRecognition')} style={styles.headerButton}>
            <Ionicons name="camera" size={22} color={colors.accent} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleAddIngredient} style={styles.headerButton}>
            <Ionicons name="add" size={22} color={colors.accent} />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [nav]);

  const handleAddIngredient = () => {
    Alert.alert(
      'Add Ingredient',
      'Choose how to add an ingredient to your bar',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Scan with Camera', onPress: () => nav.navigate('SpiritRecognition') },
        { text: 'Manual Entry', onPress: () => Alert.alert('Coming Soon', 'Manual entry feature coming soon!') },
      ]
    );
  };

  const getCategoryIcon = (category: BarIngredient['category']) => {
    switch (category) {
      case 'spirit': return 'wine';
      case 'liqueur': return 'wine-outline';
      case 'mixer': return 'water';
      case 'bitters': return 'medical';
      case 'syrup': return 'water-outline';
      case 'garnish': return 'leaf';
      default: return 'ellipse';
    }
  };

  const getCategoryColor = (category: BarIngredient['category']) => {
    switch (category) {
      case 'spirit': return colors.accent;
      case 'liqueur': return '#8B4513';
      case 'mixer': return '#4169E1';
      case 'bitters': return '#8B0000';
      case 'syrup': return '#FFD700';
      case 'garnish': return '#228B22';
      default: return colors.muted;
    }
  };

  const getFilteredAndSortedIngredients = () => {
    let filtered = homeBar.ingredients;

    // Filter by type if selected
    if (filterByType) {
      filtered = filtered.filter(ingredient => ingredient.subcategory === filterByType || ingredient.category === filterByType);
    }

    // Sort by type if enabled
    if (sortByType) {
      filtered = [...filtered].sort((a, b) => {
        const typeA = a.subcategory || a.category;
        const typeB = b.subcategory || b.category;
        return typeA.localeCompare(typeB);
      });
    }

    return filtered;
  };

  const getUniqueSpritTypes = () => {
    const types = new Set<string>();
    homeBar.ingredients.forEach(ingredient => {
      // Include all types for comprehensive filtering
      types.add(ingredient.subcategory || ingredient.category);
    });
    return Array.from(types).sort();
  };

  const renderInventoryByLayout = () => {
    const ingredients = getFilteredAndSortedIngredients();

    // Show empty state if no ingredients match the filter
    if (ingredients.length === 0) {
      return (
        <View style={styles.emptyState}>
          <Ionicons name="wine-outline" size={48} color={colors.muted} />
          <Text style={styles.emptyStateTitle}>No items found</Text>
          <Text style={styles.emptyStateText}>
            {filterByType ? `No ${filterByType} items in your bar.` : 'Your bar is empty.'}
          </Text>
          {filterByType && (
            <TouchableOpacity
              style={styles.clearFilterButton}
              onPress={() => setFilterByType(null)}
            >
              <Text style={styles.clearFilterText}>Clear Filter</Text>
            </TouchableOpacity>
          )}
        </View>
      );
    }

    switch (layoutStyle) {
      case 'grid':
        return (
          <ScrollView
            style={styles.inventoryContainer}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.gridContainer}>
              {ingredients.map((ingredient) => (
                <SwipeableIngredientCard
                  key={ingredient.id}
                  ingredient={ingredient}
                  onDelete={() => deleteIngredient(ingredient.id)}
                  onFinish={() => finishIngredient(ingredient.id)}
                  onPress={() => handleIngredientPress(ingredient)}
                  getCategoryIcon={getCategoryIcon}
                  getCategoryColor={getCategoryColor}
                />
              ))}
            </View>
          </ScrollView>
        );

      case 'list':
        return (
          <ScrollView
            style={styles.inventoryContainer}
            showsVerticalScrollIndicator={false}
          >
            {ingredients.map((ingredient) => (
              <TouchableOpacity
                key={ingredient.id}
                style={styles.listItem}
                onPress={() => handleIngredientPress(ingredient)}
              >
                <View style={styles.listItemImageContainer}>
                  {ingredient.image ? (
                    <Image source={{ uri: ingredient.image }} style={styles.listItemImage} />
                  ) : (
                    <View style={styles.listItemIcon}>
                      <Ionicons
                        name={getCategoryIcon(ingredient.category)}
                        size={24}
                        color={getCategoryColor(ingredient.category)}
                      />
                    </View>
                  )}
                </View>
                <View style={styles.listItemContent}>
                  <Text style={styles.listItemName}>{ingredient.name}</Text>
                  <Text style={styles.listItemBrand}>{ingredient.brand}</Text>
                  <Text style={styles.listItemCategory}>{ingredient.category}</Text>
                </View>
                <TouchableOpacity
                  style={styles.listItemAction}
                  onPress={() => finishIngredient(ingredient.id)}
                >
                  <Ionicons name="checkmark-circle" size={24} color={colors.success} />
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </ScrollView>
        );

      case 'cards':
        return (
          <ScrollView
            style={styles.inventoryContainer}
            showsVerticalScrollIndicator={false}
          >
            {ingredients.map((ingredient) => (
              <TouchableOpacity
                key={ingredient.id}
                style={styles.cardItem}
                onPress={() => handleIngredientPress(ingredient)}
              >
                {ingredient.image && (
                  <Image source={{ uri: ingredient.image }} style={styles.cardImage} />
                )}
                <View style={styles.cardHeader}>
                  <View style={styles.cardIconContainer}>
                    {ingredient.image ? (
                      <View style={styles.cardImageOverlay}>
                        <Ionicons
                          name={getCategoryIcon(ingredient.category)}
                          size={24}
                          color={colors.white}
                        />
                      </View>
                    ) : (
                      <View style={styles.cardIcon}>
                        <Ionicons
                          name={getCategoryIcon(ingredient.category)}
                          size={32}
                          color={getCategoryColor(ingredient.category)}
                        />
                      </View>
                    )}
                  </View>
                  <View style={styles.cardContent}>
                    <Text style={styles.cardName}>{ingredient.name}</Text>
                    <Text style={styles.cardBrand}>{ingredient.brand}</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.cardAction}
                    onPress={() => finishIngredient(ingredient.id)}
                  >
                    <Ionicons name="remove-circle" size={28} color={colors.error} />
                  </TouchableOpacity>
                </View>
                <View style={styles.cardFooter}>
                  <Text style={styles.cardCategory}>{ingredient.category}</Text>
                  {ingredient.notes && (
                    <Text style={styles.cardNotes}>{ingredient.notes}</Text>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        );

      case 'minimal':
        return (
          <ScrollView
            style={styles.inventoryContainer}
            showsVerticalScrollIndicator={false}
          >
            {ingredients.map((ingredient) => (
              <TouchableOpacity
                key={ingredient.id}
                style={styles.minimalItem}
                onPress={() => handleIngredientPress(ingredient)}
              >
                <View style={styles.minimalContent}>
                  <Text style={styles.minimalName}>{ingredient.name}</Text>
                  <Text style={styles.minimalBrand}>{ingredient.brand}</Text>
                </View>
                <TouchableOpacity
                  style={styles.minimalAction}
                  onPress={() => finishIngredient(ingredient.id)}
                >
                  <Text style={styles.minimalActionText}>✓</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </ScrollView>
        );

      default:
        return null;
    }
  };

  const renderInventoryTab = () => (
    <View style={styles.tabContent}>
      {/* Quick Stats */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{homeBar.ingredients.length}</Text>
          <Text style={styles.statLabel}>Total Items</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{homeBar.ingredients.filter(i => i.category === 'spirit').length}</Text>
          <Text style={styles.statLabel}>Spirits</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{getUniqueSpritTypes().length}</Text>
          <Text style={styles.statLabel}>Types</Text>
        </View>
      </View>

      {/* Collection Header */}
      <View style={styles.collectionHeader}>
        <Text style={styles.sectionTitle}>Your Collection</Text>
        <Text style={styles.itemCount}>
          {getFilteredAndSortedIngredients().length} of {homeBar.ingredients.length} items
        </Text>
      </View>

      {/* Filter Controls */}
      <View style={styles.filterControls}>
        <TouchableOpacity
          style={styles.filterHeader}
          onPress={() => setShowFilters(!showFilters)}
        >
          <Ionicons name="funnel-outline" size={16} color={colors.muted} />
          <Text style={styles.filterLabel}>Filter & Sort</Text>
          <Ionicons
            name={showFilters ? "chevron-up" : "chevron-down"}
            size={16}
            color={colors.muted}
            style={styles.chevronIcon}
          />
        </TouchableOpacity>

        {showFilters && (
          <>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScrollView}>
              <TouchableOpacity
                style={[styles.filterChip, !filterByType && styles.activeFilterChip]}
                onPress={() => setFilterByType(null)}
              >
                <Text style={[styles.filterChipText, !filterByType && styles.activeFilterChipText]}>All</Text>
              </TouchableOpacity>
              {getUniqueSpritTypes().map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[styles.filterChip, filterByType === type && styles.activeFilterChip]}
                  onPress={() => setFilterByType(filterByType === type ? null : type)}
                >
                  <Text style={[styles.filterChipText, filterByType === type && styles.activeFilterChipText]}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TouchableOpacity
              style={[styles.sortToggle, sortByType && styles.activeSortToggle]}
              onPress={() => setSortByType(!sortByType)}
            >
              <Ionicons
                name={sortByType ? "funnel" : "funnel-outline"}
                size={14}
                color={sortByType ? colors.accent : colors.muted}
              />
              <Text style={[styles.sortToggleText, sortByType && styles.activeSortToggleText]}>
                Sort A-Z
              </Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      {/* Inventory List */}
      {getFilteredAndSortedIngredients().length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="wine-outline" size={48} color={colors.muted} />
          <Text style={styles.emptyStateTitle}>No items found</Text>
          <Text style={styles.emptyStateText}>
            {filterByType ? `No ${filterByType} items in your bar.` : 'Your bar is empty.'}
          </Text>
          {filterByType && (
            <TouchableOpacity
              style={styles.clearFilterButton}
              onPress={() => setFilterByType(null)}
            >
              <Text style={styles.clearFilterText}>Clear Filter</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <View style={styles.historyContainer}>
          {getFilteredAndSortedIngredients().map((ingredient) => (
            <View key={ingredient.id} style={styles.historyCard}>
              <View style={styles.historyHeader}>
                <View style={styles.historyIconContainer}>
                  {ingredient.image ? (
                    <Image source={{ uri: ingredient.image }} style={styles.ingredientCardImage} />
                  ) : (
                    <Ionicons
                      name={getCategoryIcon(ingredient.category)}
                      size={24}
                      color={getCategoryColor(ingredient.category)}
                    />
                  )}
                </View>
                <View style={styles.historyInfo}>
                  <Text style={styles.historyName}>{ingredient.name}</Text>
                  <Text style={styles.historyCategory}>{ingredient.brand} • {ingredient.subcategory || ingredient.category}</Text>
                  {ingredient.volume && (
                    <Text style={styles.historyDate}>
                      {ingredient.volume}ml • Added {ingredient.addedAt ? ingredient.addedAt.toLocaleDateString() : 'Recently'}
                    </Text>
                  )}
                </View>
                <TouchableOpacity
                  style={styles.reAddButton}
                  onPress={() => handleIngredientPress(ingredient)}
                >
                  <Ionicons name="information-circle" size={20} color={colors.accent} />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      )}

      {/* Add More Section */}
      <View style={styles.addMoreSection}>
        <TouchableOpacity style={styles.addMoreButton} onPress={handleAddIngredient}>
          <View style={styles.addMoreContent}>
            <View style={styles.addMoreIcon}>
              <Ionicons name="add" size={20} color={colors.white} />
            </View>
            <View style={styles.addMoreTextContainer}>
              <Text style={styles.addMoreTitle}>Add New Ingredient</Text>
              <Text style={styles.addMoreSubtitle}>Scan or enter manually</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.muted} />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderSuggestionsTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.sectionTitle}>Cocktails You Can Make</Text>

      <View style={styles.cocktailsList}>
        {cocktailSuggestions.slice(0, 6).map((cocktail, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.cocktailCard,
              cocktail.recommendation === 'can_make' ? styles.canMakeCard : styles.almostCanMakeCard
            ]}
            onPress={() => Alert.alert(
              cocktail.name,
              `Ingredients needed:\n${cocktail.ingredients.join('\n')}\n${cocktail.missingIngredients.length > 0 ? `\nMissing: ${cocktail.missingIngredients.join(', ')}` : ''}`
            )}
          >
            <View style={styles.cocktailHeader}>
              <Text style={styles.cocktailName}>{cocktail.name}</Text>
              <View style={styles.cocktailBadges}>
                {cocktail.recommendation === 'can_make' && (
                  <View style={styles.canMakeBadge}>
                    <Text style={styles.canMakeText}>✓ Can Make</Text>
                  </View>
                )}
                {cocktail.recommendation === 'missing_one' && (
                  <View style={styles.missingOneBadge}>
                    <Text style={styles.missingOneText}>Missing 1</Text>
                  </View>
                )}
              </View>
            </View>

            <Text style={styles.cocktailDifficulty}>Difficulty: {cocktail.difficulty}</Text>
            <Text style={styles.cocktailCategory}>{cocktail.category}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderShoppingTab = () => (
    <View style={styles.tabContent}>
      {/* Consolidated Shopping Items */}
      {Object.keys(consolidatedShoppingItems.itemsByRecipe).length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Shopping Lists</Text>

          {/* Items grouped by recipe */}
          {Object.entries(consolidatedShoppingItems.itemsByRecipe).map(([recipeName, items]: [string, any[]]) => (
            <View key={recipeName} style={styles.recipeShoppingGroup}>
              <Text style={styles.recipeGroupTitle}>{recipeName}</Text>
              <View style={styles.recipeItemsList}>
                {items.map((item, index) => {
                  const allItemData = consolidatedShoppingItems.allItems.find((ai: any) => ai.name.toLowerCase() === item.name.toLowerCase());
                  const quantity = allItemData?.quantity || 1;

                  return (
                    <View key={`${recipeName}-${index}`} style={styles.shoppingListItem}>
                      <TouchableOpacity
                        style={styles.checkboxContainer}
                        onPress={() => {
                          const newChecked = new Set(checkedShoppingItems);
                          if (newChecked.has(item.id)) {
                            newChecked.delete(item.id);
                          } else {
                            newChecked.add(item.id);
                          }
                          setCheckedShoppingItems(newChecked);
                        }}
                      >
                        <Ionicons
                          name={checkedShoppingItems.has(item.id) ? 'checkbox' : 'square-outline'}
                          size={20}
                          color={checkedShoppingItems.has(item.id) ? colors.accent : colors.muted}
                        />
                      </TouchableOpacity>

                      <View style={styles.shoppingItemContent}>
                        <Text style={[styles.shoppingItemBrand, checkedShoppingItems.has(item.id) && styles.checkedItemName]}>
                          {item.brand || 'Various Brands'}
                          {quantity > 1 && <Text style={styles.quantityText}> x{quantity}</Text>}
                        </Text>
                        <Text style={[styles.shoppingItemType, checkedShoppingItems.has(item.id) && styles.checkedItemText]}>
                          {item.subcategory || item.category || 'Spirit'}
                        </Text>
                        {item.estimatedPrice && (
                          <Text style={[styles.shoppingItemPrice, checkedShoppingItems.has(item.id) && styles.checkedItemText]}>
                            ${item.estimatedPrice}
                          </Text>
                        )}
                      </View>

                      <View style={styles.shoppingItemActions}>
                        <TouchableOpacity
                          style={styles.purchaseButton}
                          onPress={() => markItemAsPurchased(item.id, item)}
                        >
                          <Ionicons name="cart" size={16} color={colors.accent} />
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={styles.deleteItemButton}
                          onPress={() => deleteShoppingItem(item.id)}
                        >
                          <Ionicons name="trash-outline" size={16} color={colors.error} />
                        </TouchableOpacity>
                      </View>
                    </View>
                  );
                })}
              </View>
            </View>
          ))}
        </>
      )}

      {/* Recommended Purchases */}
      <Text style={styles.sectionTitle}>
        {Object.keys(consolidatedShoppingItems.itemsByRecipe).length > 0 ? 'Recommended Bar Additions' : 'Recommended Purchases'}
      </Text>

      <View style={styles.suggestionsList}>
        {ingredientSuggestions.slice(0, 8).map((suggestion, index) => (
          <View key={index} style={styles.suggestionCard}>
            <TouchableOpacity
              style={styles.suggestionContent}
              onPress={() => Alert.alert(
                suggestion.name,
                `${suggestion.description}\n\nUsed in: ${suggestion.usedInCocktails.join(', ')}\n\nAverage price: $${suggestion.averagePrice}`
              )}
            >
              <View style={styles.suggestionHeader}>
                <Ionicons
                  name={getCategoryIcon(suggestion.category)}
                  size={24}
                  color={getCategoryColor(suggestion.category)}
                />
                <View style={styles.essentialBadge}>
                  <Text style={styles.essentialText}>
                    {suggestion.essentialLevel === 'must-have' ? 'Must Have' :
                     suggestion.essentialLevel === 'recommended' ? 'Recommended' : 'Nice to Have'}
                  </Text>
                </View>
              </View>

              <Text style={styles.suggestionName}>{suggestion.name}</Text>
              <Text style={styles.suggestionDescription}>{suggestion.description}</Text>
              <Text style={styles.suggestionPrice}>${suggestion.averagePrice} avg</Text>
              <Text style={styles.suggestionCocktails}>
                +{suggestion.usedInCocktails.length} cocktails
              </Text>
            </TouchableOpacity>

            {/* Add to Shopping List Button */}
            <TouchableOpacity
              style={styles.addToShoppingButton}
              onPress={() => addToShoppingList(suggestion)}
            >
              <Ionicons name="add" size={20} color={colors.accent} />
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </View>
  );

  const renderHistoryTab = () => (
    <View style={styles.tabContent}>
      {/* History Stats */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{historyItems.length}</Text>
          <Text style={styles.statLabel}>Total Items</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{historyItems.filter(i => i.category === 'spirit').length}</Text>
          <Text style={styles.statLabel}>Spirits</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{Math.round(historyItems.length / 6) || 1}</Text>
          <Text style={styles.statLabel}>Months</Text>
        </View>
      </View>

      {/* History Header */}
      <View style={styles.collectionHeader}>
        <Text style={styles.sectionTitle}>History</Text>
        <Text style={styles.itemCount}>Previously owned spirits and ingredients</Text>
      </View>

      {/* History List */}
      <View style={styles.historyContainer}>
        {historyItems.map((item) => (
          <View key={item.id} style={styles.historyCard}>
            <View style={styles.historyHeader}>
              <View style={styles.historyIconContainer}>
                <Ionicons
                  name={getCategoryIcon(item.category as any)}
                  size={24}
                  color={getCategoryColor(item.category as any)}
                />
              </View>
              <View style={styles.historyInfo}>
                <Text style={styles.historyName}>{item.name}</Text>
                <Text style={styles.historyCategory}>{item.brand} • {item.subcategory}</Text>
                <Text style={styles.historyDate}>
                  Removed {item.removedAt.toLocaleDateString()}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.reAddButton}
                onPress={() => Alert.alert('Re-add', `Add ${item.name} to your shopping list?`, [
                  { text: 'Cancel', style: 'cancel' },
                  { text: 'Re-add', onPress: () => reAddToBar(item) }
                ])}
              >
                <Ionicons name="add-circle" size={20} color={colors.accent} />
              </TouchableOpacity>
            </View>

            {item.notes && (
              <View style={styles.historyNotesContainer}>
                <Text style={styles.historyNotesText}>💡 {item.notes}</Text>
              </View>
            )}
          </View>
        ))}
      </View>
    </View>
  );

  const renderIngredientModal = () => (
    <Modal
      visible={showIngredientModal}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={() => setShowIngredientModal(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity
            style={styles.modalCloseButton}
            onPress={() => setShowIngredientModal(false)}
          >
            <Ionicons name="close" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        {selectedIngredient && (
          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            {/* Ingredient Header */}
            <View style={styles.ingredientModalHeader}>
              {selectedIngredient.image && (
                <Image source={{ uri: selectedIngredient.image }} style={styles.modalIngredientImage} />
              )}
              <View style={styles.ingredientModalInfo}>
                <Text style={styles.modalIngredientName}>{selectedIngredient.name}</Text>
                <Text style={styles.modalIngredientBrand}>{selectedIngredient.brand}</Text>
                <Text style={styles.modalIngredientCategory}>
                  {selectedIngredient.subcategory || selectedIngredient.category}
                </Text>
              </View>
            </View>

            {/* Spirit Details */}
            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle}>Spirit Details</Text>
              <View style={styles.spiritDetailsGrid}>
                <View style={styles.spiritDetailItem}>
                  <Text style={styles.spiritDetailLabel}>ABV</Text>
                  <Text style={styles.spiritDetailValue}>{selectedIngredient.abv || 40}%</Text>
                </View>
                <View style={styles.spiritDetailItem}>
                  <Text style={styles.spiritDetailLabel}>Volume</Text>
                  <Text style={styles.spiritDetailValue}>{selectedIngredient.volume || 750}ml</Text>
                </View>
                <View style={styles.spiritDetailItem}>
                  <Text style={styles.spiritDetailLabel}>Category</Text>
                  <Text style={styles.spiritDetailValue}>{selectedIngredient.category}</Text>
                </View>
                <View style={styles.spiritDetailItem}>
                  <Text style={styles.spiritDetailLabel}>Added</Text>
                  <Text style={styles.spiritDetailValue}>
                    {selectedIngredient.addedAt ? selectedIngredient.addedAt.toLocaleDateString() : 'Recently'}
                  </Text>
                </View>
              </View>
            </View>

            {/* Cocktail Suggestions */}
            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle}>Cocktails You Can Make</Text>
              <Text style={styles.modalSectionSubtitle}>
                Popular cocktails featuring {selectedIngredient.name}
              </Text>
              <View style={styles.cocktailSuggestions}>
                {getCocktailsForIngredient(selectedIngredient).map((cocktail, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.cocktailSuggestionCard}
                    onPress={() => {
                      setShowIngredientModal(false);
                      nav.navigate('CocktailDetail', { cocktailId: cocktail.toLowerCase().replace(/\s+/g, '-') });
                    }}
                  >
                    <View style={styles.cocktailSuggestionContent}>
                      <Text style={styles.cocktailSuggestionName}>{cocktail}</Text>
                      <Ionicons name="arrow-forward" size={16} color={colors.muted} />
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalActionButton}
                onPress={() => {
                  setShowIngredientModal(false);
                  finishIngredient(selectedIngredient.id);
                }}
              >
                <Ionicons name="checkmark" size={20} color={colors.white} />
                <Text style={styles.modalActionButtonText}>Mark as Finished</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        )}
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'inventory' && styles.activeTab]}
          onPress={() => setActiveTab('inventory')}
        >
          <Ionicons
            name="library"
            size={18}
            color={activeTab === 'inventory' ? colors.bg : colors.muted}
          />
          <Text style={[styles.tabText, activeTab === 'inventory' && styles.activeTabText]}>
            Inventory
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'history' && styles.activeTab]}
          onPress={() => setActiveTab('history')}
        >
          <Ionicons
            name="time"
            size={18}
            color={activeTab === 'history' ? colors.bg : colors.muted}
          />
          <Text style={[styles.tabText, activeTab === 'history' && styles.activeTabText]}>
            History
          </Text>
        </TouchableOpacity>
      </View>

      {/* Tab Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === 'inventory' && renderInventoryTab()}
        {activeTab === 'history' && renderHistoryTab()}
      </ScrollView>

      {/* Ingredient Detail Modal */}
      {renderIngredientModal()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  headerButton: {
    padding: spacing(1),
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: colors.bg,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing(2),
    gap: spacing(1),
  },
  activeTab: {
    backgroundColor: colors.accent,
    borderBottomWidth: 2,
    borderBottomColor: colors.accent,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.subtext,
  },
  activeTabText: {
    color: colors.white,
    fontWeight: '700',
  },
  content: {
    flex: 1,
  },
  tabContent: {
    paddingTop: spacing(4),
    paddingBottom: spacing(4),
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing(0.5),
  },
  sectionSubtitle: {
    fontSize: 14,
    color: colors.subtext,
    marginBottom: spacing(3),
    marginTop: -spacing(2),
  },
  // Essentials tip card
  essentialsTipCard: {
    backgroundColor: colors.accent + '15',
    padding: spacing(3),
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.accent + '30',
    marginBottom: spacing(3),
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing(1),
    marginBottom: spacing(1.5),
  },
  tipTitle: {
    fontSize: fonts.body,
    fontWeight: '700',
    color: colors.text,
  },
  tipText: {
    fontSize: 14,
    color: colors.subtext,
    lineHeight: 18,
  },
  ingredientsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing(2),
    marginBottom: spacing(3),
  },
  ingredientCard: {
    width: '47%',
    backgroundColor: colors.card,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.line,
    position: 'relative',
  },
  ingredientContent: {
    padding: spacing(2),
  },
  ingredientDeleteButton: {
    position: 'absolute',
    top: spacing(1),
    right: spacing(1),
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(220, 38, 38, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ingredientHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing(2),
  },
  ingredientImage: {
    width: 40,
    height: 60,
    borderRadius: 8,
    backgroundColor: colors.bg,
  },
  ingredientName: {
    fontSize: fonts.body,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing(0.5),
  },
  ingredientCategory: {
    fontSize: 12,
    color: colors.muted,
    textTransform: 'capitalize',
    marginBottom: spacing(0.5),
  },
  ingredientVolume: {
    fontSize: 12,
    color: colors.subtext,
  },
  addMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card,
    padding: spacing(3),
    borderRadius: radii.md,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: colors.accent,
    gap: spacing(1),
  },
  addMoreText: {
    fontSize: fonts.body,
    color: colors.accent,
    fontWeight: '500',
  },
  cocktailsList: {
    gap: spacing(2),
  },
  cocktailCard: {
    backgroundColor: colors.card,
    padding: spacing(3),
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.line,
  },
  canMakeCard: {
    borderColor: colors.accent,
    backgroundColor: colors.accent + '10',
  },
  almostCanMakeCard: {
    borderColor: '#FFA500',
    backgroundColor: '#FFA50010',
  },
  cocktailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing(1),
  },
  cocktailName: {
    fontSize: fonts.body,
    fontWeight: '700',
    color: colors.text,
    flex: 1,
  },
  cocktailBadges: {
    marginLeft: spacing(2),
  },
  canMakeBadge: {
    backgroundColor: colors.accent,
    paddingHorizontal: spacing(1),
    paddingVertical: spacing(0.5),
    borderRadius: radii.sm,
  },
  canMakeText: {
    fontSize: 10,
    color: colors.bg,
    fontWeight: '600',
  },
  missingOneBadge: {
    backgroundColor: '#FFA500',
    paddingHorizontal: spacing(1),
    paddingVertical: spacing(0.5),
    borderRadius: radii.sm,
  },
  missingOneText: {
    fontSize: 10,
    color: colors.bg,
    fontWeight: '600',
  },
  cocktailDifficulty: {
    fontSize: 12,
    color: colors.subtext,
    marginBottom: spacing(0.5),
  },
  cocktailCategory: {
    fontSize: 12,
    color: colors.muted,
  },
  suggestionsList: {
    gap: spacing(2),
  },
  suggestionCard: {
    backgroundColor: colors.card,
    padding: spacing(3),
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.line,
  },
  suggestionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing(2),
  },
  essentialBadge: {
    backgroundColor: colors.accent,
    paddingHorizontal: spacing(1.5),
    paddingVertical: spacing(0.5),
    borderRadius: radii.sm,
  },
  essentialText: {
    fontSize: 10,
    color: colors.bg,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  suggestionName: {
    fontSize: fonts.body,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing(1),
  },
  suggestionDescription: {
    fontSize: 14,
    color: colors.subtext,
    marginBottom: spacing(1),
    lineHeight: 18,
  },
  suggestionPrice: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '600',
    marginBottom: spacing(0.5),
  },
  suggestionCocktails: {
    fontSize: 12,
    color: colors.accent,
    fontWeight: '500',
  },
  // Shopping list styles
  shoppingListsContainer: {
    gap: spacing(2),
    marginBottom: spacing(4),
  },
  shoppingListCard: {
    backgroundColor: colors.card,
    padding: spacing(3),
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.line,
  },
  completedShoppingList: {
    borderColor: colors.accent + '30',
    backgroundColor: colors.accent + '10',
  },
  shoppingListHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing(2),
  },
  shoppingListInfo: {
    flex: 1,
    marginRight: spacing(2),
  },
  shoppingListName: {
    fontSize: fonts.body,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing(0.5),
  },
  shoppingListRecipe: {
    fontSize: 12,
    color: colors.subtext,
    fontStyle: 'italic',
  },
  deleteButton: {
    padding: spacing(1),
  },
  shoppingListProgress: {
    marginBottom: spacing(2),
  },
  progressBar: {
    height: 6,
    backgroundColor: colors.line,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: spacing(1),
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.accent,
  },
  progressText: {
    fontSize: 12,
    color: colors.subtext,
  },
  shoppingListMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  shoppingListDate: {
    fontSize: 12,
    color: colors.muted,
  },
  completedBadge: {
    backgroundColor: colors.accent,
    paddingHorizontal: spacing(1.5),
    paddingVertical: spacing(0.5),
    borderRadius: radii.sm,
  },
  completedText: {
    fontSize: 10,
    color: colors.bg,
    fontWeight: '600',
  },
  // History tab styles
  historyList: {
    gap: spacing(2),
  },
  historyCard: {
    backgroundColor: colors.card,
    padding: spacing(3),
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.line,
  },
  historyHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing(2),
    marginBottom: spacing(2),
  },
  historyInfo: {
    flex: 1,
  },
  historyName: {
    fontSize: fonts.body,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing(0.5),
  },
  historyCategory: {
    fontSize: 12,
    color: colors.subtext,
  },
  historyMeta: {
    alignItems: 'flex-end',
  },
  historyDate: {
    fontSize: 12,
    color: colors.muted,
    marginBottom: spacing(0.5),
  },
  historyReason: {
    fontSize: 10,
    color: colors.accent,
    fontWeight: '500',
    textTransform: 'uppercase',
  },
  historyNotes: {
    backgroundColor: colors.bg,
    padding: spacing(2),
    borderRadius: radii.sm,
    marginBottom: spacing(2),
    borderLeftWidth: 3,
    borderLeftColor: colors.accent,
  },
  historyNotesText: {
    fontSize: 12,
    color: colors.subtext,
    fontStyle: 'italic',
  },
  reAddButton: {
    backgroundColor: colors.accent + '20',
    paddingHorizontal: spacing(3),
    paddingVertical: spacing(1.5),
    borderRadius: radii.sm,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.accent + '40',
  },
  reAddText: {
    fontSize: 14,
    color: colors.accent,
    fontWeight: '600',
  },
  // New shopping list styles
  recipeShoppingGroup: {
    backgroundColor: colors.card,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.line,
    marginBottom: spacing(3),
    overflow: 'hidden',
  },
  recipeGroupTitle: {
    fontSize: fonts.body,
    fontWeight: '700',
    color: colors.text,
    backgroundColor: colors.accent + '15',
    paddingHorizontal: spacing(3),
    paddingVertical: spacing(2),
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  recipeItemsList: {
    padding: spacing(2),
  },
  consolidatedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing(1.5),
    paddingHorizontal: spacing(1),
    borderBottomWidth: 1,
    borderBottomColor: colors.line + '50',
  },
  consolidatedItemContent: {
    flex: 1,
  },
  consolidatedItemName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing(0.5),
  },
  quantityText: {
    color: colors.accent,
    fontWeight: '700',
  },
  consolidatedItemCategory: {
    fontSize: 12,
    color: colors.subtext,
    textTransform: 'capitalize',
    marginBottom: spacing(0.5),
  },
  consolidatedItemPrice: {
    fontSize: 12,
    color: colors.accent,
    fontWeight: '600',
  },
  suggestionContent: {
    flex: 1,
  },
  addToShoppingButton: {
    position: 'absolute',
    bottom: spacing(1),
    right: spacing(1),
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.accent + '20',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.accent + '40',
  },
  // Shopping list item styles
  shoppingListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing(2),
    paddingHorizontal: spacing(1),
    borderBottomWidth: 1,
    borderBottomColor: colors.line + '50',
  },
  checkboxContainer: {
    marginRight: spacing(2),
  },
  shoppingItemContent: {
    flex: 1,
  },
  shoppingItemBrand: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing(0.5),
  },
  checkedItemName: {
    textDecorationLine: 'line-through',
    color: colors.muted,
  },
  shoppingItemType: {
    fontSize: 13,
    color: colors.subtext,
    marginBottom: spacing(0.5),
  },
  shoppingItemPrice: {
    fontSize: 12,
    color: colors.accent,
    fontWeight: '600',
  },
  checkedItemText: {
    textDecorationLine: 'line-through',
    color: colors.muted,
  },
  shoppingItemActions: {
    flexDirection: 'row',
    gap: spacing(1),
  },
  purchaseButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.accent + '20',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.accent + '40',
  },
  deleteItemButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.error + '20',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.error + '40',
  },
  // Swipe functionality styles
  swipeBackground: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 120,
    backgroundColor: colors.accent,
    borderRadius: radii.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing(1),
  },
  swipeText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
  swipeableContent: {
    backgroundColor: colors.card,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.line,
    position: 'relative',
  },
  // Layout styles
  inventoryContainer: {
    flex: 1,
    marginTop: spacing(2),
    marginBottom: spacing(4),
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing(2),
    paddingHorizontal: spacing(2),
  },
  // List layout styles
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    padding: spacing(3),
    marginHorizontal: spacing(2),
    marginVertical: spacing(1),
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.line,
  },
  listItemImageContainer: {
    marginRight: spacing(3),
  },
  listItemImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.bg,
  },
  listItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listItemContent: {
    flex: 1,
  },
  listItemName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing(0.5),
  },
  listItemBrand: {
    fontSize: 14,
    color: colors.muted,
    marginBottom: spacing(0.5),
  },
  listItemCategory: {
    fontSize: 12,
    color: colors.accent,
    textTransform: 'capitalize',
  },
  listItemAction: {
    padding: spacing(1),
  },
  // Card layout styles
  cardItem: {
    backgroundColor: colors.card,
    marginHorizontal: spacing(2),
    marginVertical: spacing(1),
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.line,
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: 120,
    backgroundColor: colors.bg,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing(3),
  },
  cardIconContainer: {
    marginRight: spacing(3),
  },
  cardIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardImageOverlay: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.accent + '80',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: -60,
    left: 0,
    zIndex: 1,
  },
  cardContent: {
    flex: 1,
  },
  cardName: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing(0.5),
  },
  cardBrand: {
    fontSize: 14,
    color: colors.muted,
  },
  cardAction: {
    padding: spacing(1),
  },
  cardFooter: {
    paddingHorizontal: spacing(3),
    paddingBottom: spacing(3),
    borderTopWidth: 1,
    borderTopColor: colors.line,
    backgroundColor: colors.bg,
  },
  cardCategory: {
    fontSize: 12,
    color: colors.accent,
    textTransform: 'capitalize',
    fontWeight: '600',
    marginBottom: spacing(1),
  },
  cardNotes: {
    fontSize: 12,
    color: colors.muted,
    fontStyle: 'italic',
  },
  // Minimal layout styles
  minimalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing(3),
    paddingHorizontal: spacing(4),
    marginHorizontal: spacing(3),
    borderBottomWidth: 0,
    backgroundColor: 'transparent',
  },
  minimalImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: spacing(2),
    backgroundColor: colors.bg,
  },
  minimalContent: {
    flex: 1,
  },
  minimalName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing(0.5),
  },
  minimalBrand: {
    fontSize: 14,
    color: colors.muted,
    fontWeight: '400',
  },
  minimalAction: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.success,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0,
  },
  minimalActionText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.white,
  },
  // Organization controls styles
  organizationControls: {
    paddingHorizontal: spacing(2),
    paddingVertical: spacing(2),
    backgroundColor: colors.card,
    marginHorizontal: spacing(2),
    marginBottom: spacing(2),
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.line,
  },
  organizationSection: {
    marginBottom: spacing(2),
  },
  organizationLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing(1),
  },
  filterScrollView: {
    flexGrow: 0,
    marginTop: spacing(2),
    marginBottom: spacing(2),
  },
  filterChip: {
    paddingHorizontal: spacing(3),
    paddingVertical: spacing(1.5),
    borderRadius: spacing(3),
    backgroundColor: colors.bg,
    borderWidth: 1,
    borderColor: colors.line,
    marginRight: spacing(2),
    minWidth: 60,
    alignItems: 'center',
  },
  activeFilterChip: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.subtext,
    textAlign: 'center',
  },
  activeFilterChipText: {
    color: colors.white,
    fontWeight: '700',
  },
  sortToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing(1.5),
    paddingHorizontal: spacing(2),
    borderRadius: spacing(2),
    backgroundColor: 'transparent',
  },
  sortToggleText: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.muted,
    marginLeft: spacing(1),
  },
  activeSortToggleText: {
    color: colors.accent,
    fontWeight: '600',
  },
  // Empty state styles
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing(8),
    paddingHorizontal: spacing(4),
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginTop: spacing(2),
    marginBottom: spacing(1),
  },
  emptyStateText: {
    fontSize: 14,
    color: colors.muted,
    textAlign: 'center',
    marginBottom: spacing(3),
  },
  clearFilterButton: {
    paddingHorizontal: spacing(4),
    paddingVertical: spacing(2),
    backgroundColor: colors.accent,
    borderRadius: radii.md,
  },
  clearFilterText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.white,
  },
  // Stats row styles
  statsRow: {
    flexDirection: 'row',
    marginHorizontal: spacing(3),
    marginBottom: spacing(4),
    gap: spacing(3),
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.card,
    paddingVertical: spacing(2),
    paddingHorizontal: spacing(1.5),
    borderRadius: radii.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.line,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.accent,
    marginBottom: spacing(0.5),
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.subtext,
    textAlign: 'center',
  },
  // Collection header styles
  collectionHeader: {
    marginHorizontal: spacing(3),
    marginBottom: spacing(3),
  },
  itemCount: {
    fontSize: 12,
    color: colors.muted,
    fontWeight: '500',
    marginTop: spacing(0.5),
  },
  // Filter controls styles
  filterControls: {
    backgroundColor: colors.card,
    marginHorizontal: spacing(3),
    marginBottom: spacing(3),
    borderRadius: radii.lg,
    paddingHorizontal: spacing(3),
    paddingVertical: spacing(2),
    borderWidth: 1,
    borderColor: colors.line,
  },
  filterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing(1),
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginLeft: spacing(1),
    flex: 1,
  },
  chevronIcon: {
    marginLeft: spacing(1),
  },
  // Add more section styles
  addMoreSection: {
    marginHorizontal: spacing(3),
    marginTop: spacing(3),
    marginBottom: spacing(6),
  },
  addMoreButton: {
    backgroundColor: colors.card,
    borderRadius: radii.xl,
    borderWidth: 2,
    borderColor: colors.accent,
    borderStyle: 'dashed',
    padding: spacing(4),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  addMoreContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  addMoreIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing(3),
  },
  addMoreTextContainer: {
    flex: 1,
  },
  addMoreTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing(0.5),
  },
  addMoreSubtitle: {
    fontSize: 12,
    color: colors.muted,
  },
  // Updated sort toggle styles
  activeSortToggle: {
    backgroundColor: colors.accent + '10',
  },
  // History container styles
  historyContainer: {
    marginHorizontal: spacing(2),
    gap: spacing(2),
  },
  historyIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing(3),
  },
  ingredientCardImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.bg,
  },
  historyNotesContainer: {
    marginTop: spacing(2),
    paddingTop: spacing(2),
    borderTopWidth: 1,
    borderTopColor: colors.line,
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: spacing(3),
    paddingTop: spacing(3),
    paddingBottom: spacing(2),
  },
  modalCloseButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: spacing(3),
  },
  ingredientModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing(4),
  },
  modalIngredientImage: {
    width: 80,
    height: 120,
    borderRadius: radii.lg,
    marginRight: spacing(3),
    backgroundColor: colors.card,
  },
  ingredientModalInfo: {
    flex: 1,
  },
  modalIngredientName: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing(1),
  },
  modalIngredientBrand: {
    fontSize: 16,
    color: colors.muted,
    marginBottom: spacing(0.5),
  },
  modalIngredientCategory: {
    fontSize: 14,
    color: colors.accent,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  modalSection: {
    marginBottom: spacing(4),
  },
  modalSectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing(1),
  },
  modalSectionSubtitle: {
    fontSize: 14,
    color: colors.muted,
    marginBottom: spacing(3),
  },
  spiritDetailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing(2),
  },
  spiritDetailItem: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: colors.card,
    padding: spacing(3),
    borderRadius: radii.md,
    alignItems: 'center',
  },
  spiritDetailLabel: {
    fontSize: 12,
    color: colors.muted,
    fontWeight: '500',
    marginBottom: spacing(0.5),
  },
  spiritDetailValue: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '600',
  },
  cocktailSuggestions: {
    gap: spacing(2),
  },
  cocktailSuggestionCard: {
    backgroundColor: colors.card,
    borderRadius: radii.md,
    padding: spacing(3),
  },
  cocktailSuggestionContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cocktailSuggestionName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  modalActions: {
    paddingVertical: spacing(4),
    gap: spacing(2),
  },
  modalActionButton: {
    backgroundColor: colors.accent,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing(3),
    borderRadius: radii.lg,
    gap: spacing(2),
  },
  modalActionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
  },
});