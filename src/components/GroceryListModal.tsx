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
import { colors, spacing, radii, fonts } from '../theme/tokens';
import { Ionicons } from '@expo/vector-icons';
import { GroceryListService, GroceryList, GroceryItem } from '../services/groceryListService';
import { ShoppingListStore } from '../services/shoppingListStore';

interface GroceryListModalProps {
  visible: boolean;
  onClose: () => void;
  recipeName: string;
  ingredients: string[];
  recipeId?: string;
}

export default function GroceryListModal({
  visible,
  onClose,
  recipeName,
  ingredients,
  recipeId,
}: GroceryListModalProps) {
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

      await ShoppingListStore.saveShoppingList(selectedGroceryList, recipeName);
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
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color={colors.text} />
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>Add Ingredients to Cart</Text>
            <Text style={styles.headerSubtitle}>{groceryList.name}</Text>
          </View>
          <TouchableOpacity onPress={handleShare} style={styles.shareButton}>
            <Ionicons name="share-outline" size={24} color={colors.accent} />
          </TouchableOpacity>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
          </View>
          <Text style={styles.progressText}>
            {checkedCount} of {totalItems} items ({Math.round(progress * 100)}%)
          </Text>
        </View>

        {/* Cost Summary */}
        {totalCost > 0 && (
          <View style={styles.costSummary}>
            <Text style={styles.costText}>Estimated Total: ${totalCost}</Text>
            <Text style={styles.costNote}>Prices may vary by location</Text>
          </View>
        )}

        {/* Grocery Items */}
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {Object.entries(groupedItems).map(([category, items]) => (
            <View key={category} style={styles.categorySection}>
              <Text style={styles.categoryTitle}>
                {GroceryListService.getCategoryDisplayName(category as GroceryItem['category'])} ({items.length})
              </Text>

              {items.map((item) => {
                const isChecked = checkedItems.has(item.id);
                return (
                  <TouchableOpacity
                    key={item.id}
                    style={[styles.itemContainer, isChecked && styles.itemContainerChecked]}
                    onPress={() => toggleItem(item.id)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.itemLeft}>
                      <View style={[styles.checkbox, isChecked && styles.checkboxChecked]}>
                        {isChecked && <Ionicons name="checkmark" size={16} color={colors.bg} />}
                      </View>

                      <View style={styles.itemDetails}>
                        <Text style={[styles.itemName, isChecked && styles.itemNameChecked]}>
                          {item.name}
                        </Text>
                        {item.brand && (
                          <Text style={styles.itemBrand}>{item.brand}</Text>
                        )}
                        {item.size && (
                          <Text style={styles.itemSize}>{item.size}</Text>
                        )}
                        {item.notes && (
                          <Text style={styles.itemNotes}>💡 {item.notes}</Text>
                        )}
                        {item.whereToFind && (
                          <Text style={styles.whereToFind}>📍 {item.whereToFind}</Text>
                        )}
                      </View>
                    </View>

                    {item.estimatedPrice && (
                      <View style={styles.itemRight}>
                        <Text style={[styles.itemPrice, isChecked && styles.itemPriceChecked]}>
                          ${item.estimatedPrice}
                        </Text>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          ))}
        </ScrollView>

        {/* Actions */}
        <View style={styles.actions}>
          <TouchableOpacity style={styles.saveButton} onPress={handleSaveToList}>
            <Ionicons name="cart" size={20} color={colors.bg} />
            <Text style={styles.saveButtonText}>Add to Cart ({checkedItems.size})</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing(3),
    paddingVertical: spacing(2),
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  closeButton: {
    padding: spacing(1),
  },
  headerTextContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: fonts.h3,
    fontWeight: '700',
    color: colors.text,
  },
  headerSubtitle: {
    fontSize: 12,
    color: colors.subtext,
    marginTop: 2,
  },
  shareButton: {
    padding: spacing(1),
  },
  progressContainer: {
    paddingHorizontal: spacing(3),
    paddingVertical: spacing(2),
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.line,
    borderRadius: 4,
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
    textAlign: 'center',
  },
  costSummary: {
    paddingHorizontal: spacing(3),
    paddingBottom: spacing(2),
    alignItems: 'center',
  },
  costText: {
    fontSize: fonts.body,
    fontWeight: '600',
    color: colors.text,
  },
  costNote: {
    fontSize: 12,
    color: colors.muted,
    marginTop: 2,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing(3),
  },
  categorySection: {
    marginBottom: spacing(3),
  },
  categoryTitle: {
    fontSize: fonts.body,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing(2),
    paddingHorizontal: spacing(1),
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    backgroundColor: colors.card,
    padding: spacing(2),
    borderRadius: radii.md,
    marginBottom: spacing(1),
    borderWidth: 1,
    borderColor: colors.line,
  },
  itemContainerChecked: {
    backgroundColor: colors.accent + '10',
    borderColor: colors.accent + '30',
  },
  itemLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.line,
    marginRight: spacing(2),
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: fonts.body,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  itemNameChecked: {
    color: colors.muted,
    textDecorationLine: 'line-through',
  },
  itemBrand: {
    fontSize: 12,
    color: colors.accent,
    fontWeight: '500',
    marginBottom: 2,
  },
  itemSize: {
    fontSize: 12,
    color: colors.subtext,
    marginBottom: 2,
  },
  itemNotes: {
    fontSize: 12,
    color: colors.muted,
    fontStyle: 'italic',
    marginTop: spacing(0.5),
  },
  whereToFind: {
    fontSize: 12,
    color: colors.subtext,
    marginTop: spacing(0.5),
  },
  itemRight: {
    alignItems: 'flex-end',
    marginLeft: spacing(2),
  },
  itemPrice: {
    fontSize: fonts.body,
    fontWeight: '600',
    color: colors.text,
  },
  itemPriceChecked: {
    color: colors.muted,
    textDecorationLine: 'line-through',
  },
  actions: {
    paddingHorizontal: spacing(3),
    paddingVertical: spacing(2),
    borderTopWidth: 1,
    borderTopColor: colors.line,
  },
  saveButton: {
    backgroundColor: colors.accent,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing(2.5),
    borderRadius: radii.md,
    gap: spacing(1),
  },
  saveButtonText: {
    color: colors.bg,
    fontSize: fonts.body,
    fontWeight: '600',
  },
});