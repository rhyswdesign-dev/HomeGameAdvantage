import React, { useState, useMemo } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Share,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GroceryListService, GroceryList, GroceryItem } from '../services/groceryListService';
import { ShoppingListStore } from '../services/shoppingListStore';
import { useAuth } from '../contexts/AuthContext';

interface GroceryListModalProps {
  visible: boolean;
  onClose: () => void;
  recipeName: string;
  ingredients: string[] | { name: string; note?: string }[];
  recipeId?: string;
}

export default function GroceryListModal({
  visible,
  onClose,
  recipeName,
  ingredients,
  recipeId,
}: GroceryListModalProps) {
  const { user } = useAuth();
  const [groceryList] = useState<Omit<GroceryList, 'id' | 'createdAt' | 'updatedAt' | 'userId'>>(() =>
    GroceryListService.generateGroceryList(recipeName, ingredients, recipeId)
  );

  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

  const groupedItems = useMemo(() => {
    const mockGroceryList = {
      ...groceryList,
      id: 'temp',
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: 'temp',
    } as GroceryList;

    return GroceryListService.groupByCategory(mockGroceryList);
  }, [groceryList]);

  const totalCost = useMemo(() => {
    const mockGroceryList = {
      ...groceryList,
      id: 'temp',
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: 'temp',
    } as GroceryList;

    return GroceryListService.calculateTotalCost(mockGroceryList);
  }, [groceryList]);

  const toggleItem = (itemId: string) => {
    const newCheckedItems = new Set(checkedItems);
    if (newCheckedItems.has(itemId)) {
      newCheckedItems.delete(itemId);
    } else {
      newCheckedItems.add(itemId);
    }
    setCheckedItems(newCheckedItems);
  };

  const handleShare = async () => {
    try {
      const checkedCount = checkedItems.size;
      const totalItems = groceryList.items.length;

      let shareText = `🛒 ${groceryList.name}\n\nShopping List (${checkedCount}/${totalItems} items checked):\n\n`;

      Object.entries(groupedItems).forEach(([category, items]) => {
        shareText += `${GroceryListService.getCategoryDisplayName(category as GroceryItem['category'])}:\n`;
        items.forEach(item => {
          const checked = checkedItems.has(item.id) ? '✅' : '⬜';
          const price = item.estimatedPrice ? ` (~$${item.estimatedPrice})` : '';
          shareText += `${checked} ${item.name}${price}\n`;
          if (item.notes) {
            shareText += `   💡 ${item.notes}\n`;
          }
        });
        shareText += '\n';
      });

      if (totalCost > 0) {
        shareText += `💰 Estimated total: $${totalCost}\n\n`;
      }

      shareText += '🍸 Created with HomeGameAdvantage';

      await Share.share({
        message: shareText,
        title: groceryList.name,
      });
    } catch (error) {
      Alert.alert('Error', 'Unable to share shopping list');
    }
  };

  const handleSaveToList = async () => {
    try {
      // Only save checked items
      const selectedItems = groceryList.items.filter(item => checkedItems.has(item.id));

      if (selectedItems.length === 0) {
        Alert.alert('No Items Selected', 'Please select at least one item to add to your cart.');
        return;
      }

      const selectedGroceryList = {
        ...groceryList,
        items: selectedItems
      };

      await ShoppingListStore.saveShoppingList(selectedGroceryList, recipeName, user?.uid || 'anonymous');
      Alert.alert(
        'Added to Cart!',
        `${selectedItems.length} item${selectedItems.length !== 1 ? 's' : ''} added to your shopping cart.`,
        [
          { text: 'OK', onPress: onClose }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to add items to cart. Please try again.');
    }
  };

  const checkedCount = checkedItems.size;
  const totalItems = groceryList.items.length;
  const progress = totalItems > 0 ? checkedCount / totalItems : 0;

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="fullScreen">
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Add Ingredients to Cart</Text>
          <TouchableOpacity onPress={handleShare} style={styles.shareButton}>
            <Ionicons name="share-outline" size={24} color="#D4A574" />
          </TouchableOpacity>
        </View>

        {/* Subtitle */}
        <Text style={styles.subtitle}>{recipeName} — Shopping List</Text>

        {/* Progress Section */}
        <View style={styles.progressSection}>
          <Text style={styles.progressText}>
            {checkedCount} of {totalItems} items ({Math.round(progress * 100)}%)
          </Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
          </View>
        </View>

        {/* Cost Summary */}
        <Text style={styles.costText}>Estimated Total: ${totalCost}</Text>

        {/* Grocery Items */}
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {Object.entries(groupedItems).map(([category, items]) => (
            <View key={category} style={styles.categorySection}>
              <Text style={styles.categoryTitle}>
                {GroceryListService.getCategoryDisplayName(category as GroceryItem['category'])} ({items.length})
              </Text>

              {items.map((item, index) => {
                const isChecked = checkedItems.has(item.id);
                const isLastItem = index === items.length - 1;

                // Get category label based on item.category and subcategory
                const getCategoryLabel = (category: string, subcategory?: string): string => {
                  switch (category) {
                    case 'spirits_liquors':
                      if (subcategory?.toLowerCase().includes('liqueur') ||
                          ['Maraschino', 'Amaretto', 'Campari'].includes(subcategory || '')) {
                        return 'Liqueur';
                      }
                      return 'Spirit';
                    case 'mixers':
                      return 'Mixer';
                    case 'garnish':
                      return 'Garnish';
                    case 'bitters':
                      return 'Bitters';
                    case 'syrup':
                      return 'Syrup';
                    default:
                      return 'Item';
                  }
                };

                const subcategoryDisplay = item.subcategory
                  ? `${getCategoryLabel(item.category, item.subcategory)} • ${item.subcategory}`
                  : getCategoryLabel(item.category, item.subcategory);

                return (
                  <TouchableOpacity
                    key={item.id}
                    style={[
                      styles.itemContainer,
                      isChecked && styles.itemContainerChecked,
                      !isLastItem && styles.itemBorder
                    ]}
                    onPress={() => toggleItem(item.id)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.itemLeft}>
                      <View style={[styles.checkbox, isChecked && styles.checkboxChecked]}>
                        {isChecked && <Ionicons name="checkmark" size={16} color="#2C2416" />}
                      </View>

                      <View style={styles.itemDetails}>
                        <Text style={[styles.itemName, isChecked && styles.itemNameChecked]}>
                          {item.name}
                        </Text>
                        <Text style={styles.itemSubcategory}>{subcategoryDisplay}</Text>
                      </View>
                    </View>

                    {item.estimatedPrice && (
                      <Text style={[styles.itemPrice, isChecked && styles.itemPriceChecked]}>
                        ${item.estimatedPrice}
                      </Text>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          ))}

          {/* Bottom spacing for button */}
          <View style={{ height: 180 }} />
        </ScrollView>

        {/* Actions - Fixed at bottom */}
        <View style={styles.actions}>
          <TouchableOpacity style={styles.saveButton} onPress={handleSaveToList}>
            <Text style={styles.saveButtonText}>Add All to Cart →</Text>
          </TouchableOpacity>

          {checkedItems.size > 0 && (
            <View style={styles.cartSummary}>
              <Ionicons name="cart" size={16} color="#888888" />
              <Text style={styles.cartSummaryText}>
                {checkedItems.size} Items Selected | ${groceryList.items
                  .filter(item => checkedItems.has(item.id))
                  .reduce((sum, item) => sum + (item.estimatedPrice || 0), 0)
                  .toFixed(2)}
              </Text>
            </View>
          )}
        </View>

        {/* Bottom Navigation */}
        <View style={styles.bottomNav}>
          <TouchableOpacity style={styles.navItem}>
            <Ionicons name="book-outline" size={24} color="#888" />
            <Text style={styles.navText}>Lessons</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem}>
            <Ionicons name="list" size={24} color="#888" />
            <Text style={styles.navText}>Recipes</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem}>
            <Ionicons name="home-outline" size={24} color="#888" />
            <Text style={styles.navText}>Featured</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem}>
            <Ionicons name="briefcase-outline" size={24} color="#888" />
            <Text style={styles.navText}>Vault</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem}>
            <Ionicons name="person-outline" size={24} color="#888" />
            <Text style={styles.navText}>Profile</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2C2416',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#ffffff',
  },
  shareButton: {
    padding: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginBottom: 20,
  },
  progressSection: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  progressText: {
    fontSize: 13,
    color: '#ccc',
    marginBottom: 8,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#3a3225',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#D4A574',
  },
  costText: {
    fontSize: 14,
    color: '#ccc',
    textAlign: 'left',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  categorySection: {
    marginBottom: 20,
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    padding: 16,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 16,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  itemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a2a',
  },
  itemContainerChecked: {
    opacity: 0.5,
  },
  itemLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#555',
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  checkboxChecked: {
    backgroundColor: '#D4A574',
    borderColor: '#D4A574',
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 15,
    fontWeight: '500',
    color: '#ffffff',
    marginBottom: 4,
  },
  itemNameChecked: {
    textDecorationLine: 'line-through',
  },
  itemSubcategory: {
    fontSize: 13,
    color: '#888',
  },
  itemPrice: {
    fontSize: 15,
    fontWeight: '600',
    color: '#ffffff',
    marginLeft: 12,
  },
  itemPriceChecked: {
    textDecorationLine: 'line-through',
  },
  actions: {
    position: 'absolute',
    bottom: 80,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#2C2416',
  },
  saveButton: {
    backgroundColor: '#D4A574',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  saveButtonText: {
    color: '#1a1a1a',
    fontSize: 16,
    fontWeight: '700',
  },
  cartSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3a3225',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
  },
  cartSummaryText: {
    color: '#ccc',
    fontSize: 13,
    fontWeight: '500',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 12,
    paddingBottom: 24,
    backgroundColor: '#1a1a1a',
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  navItem: {
    alignItems: 'center',
    gap: 4,
  },
  navText: {
    fontSize: 11,
    color: '#888',
  },
});
