import React, { useState, useLayoutEffect, useCallback } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  TextInput,
  Modal,
} from 'react-native';
import { colors, spacing, radii, fonts } from '../theme/tokens';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/RootNavigator';
import { ShoppingListStore } from '../services/shoppingListStore';
import { HomeBarService, BarIngredient } from '../services/homeBarService';

export default function ShoppingCartScreen() {
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [activeTab, setActiveTab] = useState<'cart' | 'history'>('cart');
  const [savedShoppingLists, setSavedShoppingLists] = useState<any[]>([]);
  const [consolidatedShoppingItems, setConsolidatedShoppingItems] = useState<any>({ itemsByRecipe: {}, allItems: [] });
  const [checkedShoppingItems, setCheckedShoppingItems] = useState<Set<string>>(new Set());
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [editBrand, setEditBrand] = useState('');

  // Mock history data
  const [historyItems] = useState([
    {
      id: 'hist1',
      name: 'Macallan 12',
      category: 'spirits_liquors',
      subcategory: 'whiskey',
      brand: 'Macallan',
      removedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
      reason: 'Finished bottle',
      notes: 'Was a gift from John',
    },
    {
      id: 'hist2',
      name: 'Cointreau',
      category: 'spirits_liquors',
      subcategory: 'orange liqueur',
      brand: 'Cointreau',
      removedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
      reason: 'Removed from bar',
      notes: 'Rarely used',
    },
  ]);

  // Load shopping lists when component mounts or when focused
  useFocusEffect(
    useCallback(() => {
      loadShoppingLists();
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

      // Restore checked state from saved data
      const checkedItems = new Set<string>();
      lists.forEach(list => {
        list.items.forEach(item => {
          if (item.checked || item.isCompleted) {
            checkedItems.add(item.id);
          }
        });
      });
      setCheckedShoppingItems(checkedItems);
    } catch (error) {
      console.error('Error loading shopping lists:', error);
    }
  };

  const markItemAsPurchased = async (itemId: string, item: any) => {
    try {
      // Create ingredient object for home bar
      const newIngredient: BarIngredient = {
        id: `purchased_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: item.name,
        category: mapCategoryToBarCategory(item.category),
        subcategory: item.subcategory || item.category,
        brand: item.brand || 'Unknown',
        abv: getDefaultABV(item.subcategory || item.category),
        volume: 750, // Default volume
        addedAt: new Date(),
        isFavorite: false,
        tags: [],
      };

      // Add to home bar inventory
      await HomeBarService.addIngredient(newIngredient);

      // Remove ALL instances of this item from shopping lists (synchronized)
      await ShoppingListStore.deleteShoppingItem(itemId);
      await loadShoppingLists();

      Alert.alert(
        'Added to Inventory!',
        `${item.name} has been purchased and added to your home bar inventory.`,
        [
          { text: 'OK' },
          { text: 'View Inventory', onPress: () => nav.navigate('HomeBar') }
        ]
      );
    } catch (error) {
      console.error('Error marking item as purchased:', error);
      Alert.alert('Error', 'Failed to mark item as purchased');
    }
  };

  // Helper function to map grocery categories to bar categories
  const mapCategoryToBarCategory = (category: string): BarIngredient['category'] => {
    switch (category) {
      case 'spirits_liquors':
        return 'spirit';
      case 'mixers':
        return 'mixer';
      case 'bitters':
        return 'bitters';
      case 'syrup':
        return 'syrup';
      case 'garnish':
        return 'garnish';
      default:
        return 'spirit'; // Default fallback
    }
  };

  // Helper function to get default ABV based on subcategory
  const getDefaultABV = (subcategory: string): number => {
    const lowerSub = (subcategory || '').toLowerCase();
    if (lowerSub.includes('vodka')) return 40;
    if (lowerSub.includes('gin')) return 42;
    if (lowerSub.includes('whiskey') || lowerSub.includes('bourbon')) return 43;
    if (lowerSub.includes('rum')) return 40;
    if (lowerSub.includes('tequila')) return 40;
    if (lowerSub.includes('vermouth')) return 15;
    if (lowerSub.includes('liqueur')) return 25;
    return 0; // For non-alcoholic items
  };

  const deleteShoppingItem = async (itemId: string) => {
    try {
      console.log('👍 User clicked delete for item ID:', itemId);
      await ShoppingListStore.deleteShoppingItem(itemId);
      console.log('✅ Delete operation completed, reloading lists...');
      await loadShoppingLists();
      Alert.alert('Deleted', 'Item removed from shopping cart');
    } catch (error) {
      console.error('Delete error:', error);
      Alert.alert('Error', 'Failed to delete item');
    }
  };

  const addToShoppingList = async (item: any, source: string = 'Re-add') => {
    try {
      await ShoppingListStore.addItemToShoppingList({
        name: item.name,
        category: item.category as any,
        brand: item.brand,
        notes: `Re-adding ${item.name} to cart`,
        estimatedPrice: 25, // Default price
        whereToFind: 'Liquor store, Wine & Spirits section',
      }, source);
      await loadShoppingLists(); // Refresh
      Alert.alert('Added!', `${item.name} added to your shopping cart`);
    } catch (error) {
      Alert.alert('Error', 'Failed to add item to shopping cart');
    }
  };

  const handleEditItem = (item: any) => {
    setEditingItem(item);
    setEditBrand(item.brand || '');
    setEditModalVisible(true);
  };

  const handleSaveEdit = async () => {
    if (!editingItem) return;

    try {
      // Update the item's brand in the shopping list
      await ShoppingListStore.updateItemBrand(editingItem.id, editBrand || 'Unknown');
      await loadShoppingLists(); // Refresh
      setEditModalVisible(false);
      setEditingItem(null);
      setEditBrand('');
      Alert.alert('Updated!', 'Brand name has been updated');
    } catch (error) {
      Alert.alert('Error', 'Failed to update brand name');
    }
  };

  const handleCancelEdit = () => {
    setEditModalVisible(false);
    setEditingItem(null);
    setEditBrand('');
  };

  useLayoutEffect(() => {
    nav.setOptions({
      title: 'Shopping Cart',
      headerStyle: { backgroundColor: colors.bg },
      headerTintColor: colors.text,
      headerTitleStyle: { color: colors.text, fontWeight: '900' },
      headerShadowVisible: false,
      headerRight: () => (
        <View style={{ flexDirection: 'row', gap: spacing(1) }}>
          <TouchableOpacity
            onPress={async () => {
              console.log('📋 Current shopping lists:', savedShoppingLists);
              savedShoppingLists.forEach((list, listIndex) => {
                console.log(`List ${listIndex}: "${list.recipeName}" (${list.id})`);
                list.items.forEach((item, itemIndex) => {
                  console.log(`  Item ${itemIndex}: "${item.name}" (${item.id})`);
                });
              });
            }}
            style={{ padding: spacing(1) }}
          >
            <Ionicons name="information-circle" size={24} color={colors.accent} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={async () => {
              await ShoppingListStore.clearAllShoppingLists();
              await loadShoppingLists();
              Alert.alert('Cleared', 'All shopping lists have been cleared');
            }}
            style={{ padding: spacing(1) }}
          >
            <Ionicons name="trash-outline" size={24} color={colors.error} />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [nav]);

  const renderCartTab = () => (
    <View style={styles.tabContent}>
      {savedShoppingLists.length > 0 ? (
        <>
          <Text style={styles.sectionTitle}>Shopping Cart</Text>

          {/* Items grouped by recipe */}
          {savedShoppingLists.map((list) => (
            <View key={list.id} style={styles.recipeShoppingGroup}>
              <Text style={styles.recipeGroupTitle}>{list.recipeName}</Text>
              <View style={styles.recipeItemsList}>
                {list.items.map((item, index) => {
                  return (
                    <View key={item.id} style={styles.shoppingListItem}>
                      <TouchableOpacity
                        style={styles.checkboxContainer}
                        onPress={async () => {
                          const isCurrentlyChecked = checkedShoppingItems.has(item.id);
                          const newCheckedState = !isCurrentlyChecked;

                          // Update synchronized item across all lists
                          await ShoppingListStore.updateSynchronizedItemChecked(item.id, newCheckedState);

                          // Update local state
                          const newChecked = new Set(checkedShoppingItems);
                          if (newCheckedState) {
                            newChecked.add(item.id);
                          } else {
                            newChecked.delete(item.id);
                          }
                          setCheckedShoppingItems(newChecked);

                          // Reload to show synchronized state
                          await loadShoppingLists();
                        }}
                      >
                        <Ionicons
                          name={checkedShoppingItems.has(item.id) ? 'checkbox' : 'square-outline'}
                          size={20}
                          color={checkedShoppingItems.has(item.id) ? colors.accent : colors.muted}
                        />
                      </TouchableOpacity>

                      <View style={styles.shoppingItemContent}>
                        <Text style={[styles.shoppingItemName, checkedShoppingItems.has(item.id) && styles.checkedItemName]}>
                          {item.name}
                        </Text>
                        <View style={styles.shoppingItemMeta}>
                          <Text style={[styles.shoppingItemBrand, checkedShoppingItems.has(item.id) && styles.checkedItemText]}>
                            {item.brand || 'Unknown'}
                          </Text>
                          <Text style={[styles.shoppingItemType, checkedShoppingItems.has(item.id) && styles.checkedItemText]}>
                            {item.subcategory || item.category || 'other'}
                          </Text>
                          {item.size && (
                            <Text style={[styles.shoppingItemSize, checkedShoppingItems.has(item.id) && styles.checkedItemText]}>
                              {item.size}
                            </Text>
                          )}
                        </View>
                        {item.estimatedPrice && (
                          <Text style={[styles.shoppingItemPrice, checkedShoppingItems.has(item.id) && styles.checkedItemText]}>
                            ${item.estimatedPrice}
                          </Text>
                        )}
                      </View>

                      <TouchableOpacity
                        style={styles.editButton}
                        onPress={() => handleEditItem(item)}
                      >
                        <Ionicons name="create-outline" size={18} color={colors.accent} />
                      </TouchableOpacity>

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
      ) : (
        <View style={styles.emptyState}>
          <Ionicons name="basket-outline" size={64} color={colors.muted} />
          <Text style={styles.emptyStateTitle}>Your cart is empty</Text>
          <Text style={styles.emptyStateText}>
            Add ingredients from recipes to start shopping
          </Text>
        </View>
      )}
    </View>
  );

  const renderHistoryTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.sectionTitle}>Bar History ({historyItems.length} items)</Text>
      <Text style={styles.sectionSubtitle}>Previously owned spirits and ingredients</Text>

      <View style={styles.historyList}>
        {historyItems.map((item) => (
          <View key={item.id} style={styles.historyCard}>
            <View style={styles.historyHeader}>
              <Ionicons
                name="wine"
                size={24}
                color={colors.accent}
              />
              <View style={styles.historyInfo}>
                <Text style={styles.historyName}>{item.name}</Text>
                <Text style={styles.historyCategory}>{item.brand} • {item.subcategory}</Text>
              </View>
              <View style={styles.historyMeta}>
                <Text style={styles.historyDate}>
                  {item.removedAt.toLocaleDateString()}
                </Text>
                <Text style={styles.historyReason}>{item.reason}</Text>
              </View>
            </View>

            {item.notes && (
              <View style={styles.historyNotes}>
                <Text style={styles.historyNotesText}>💡 {item.notes}</Text>
              </View>
            )}

            <TouchableOpacity
              style={styles.reAddButton}
              onPress={() => Alert.alert('Re-add', `Add ${item.name} to your shopping cart?`, [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Re-add', onPress: () => addToShoppingList(item) }
              ])}
            >
              <Text style={styles.reAddText}>Re-add</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'cart' && styles.activeTab]}
          onPress={() => setActiveTab('cart')}
        >
          <Ionicons
            name="basket"
            size={18}
            color={activeTab === 'cart' ? colors.bg : colors.muted}
          />
          <Text style={[styles.tabText, activeTab === 'cart' && styles.activeTabText]}>
            Cart
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
        {activeTab === 'cart' && renderCartTab()}
        {activeTab === 'history' && renderHistoryTab()}
      </ScrollView>

      {/* Edit Brand Modal */}
      <Modal
        visible={editModalVisible}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Brand Name</Text>
            <Text style={styles.modalSubtitle}>
              {editingItem?.name}
            </Text>

            <TextInput
              style={styles.brandInput}
              value={editBrand}
              onChangeText={setEditBrand}
              placeholder="Enter brand name"
              placeholderTextColor={colors.muted}
              autoFocus
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={handleCancelEdit}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleSaveEdit}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: colors.card,
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
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.muted,
  },
  activeTabText: {
    color: colors.bg,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  tabContent: {
    padding: spacing(3),
  },
  sectionTitle: {
    fontSize: fonts.h2,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing(3),
  },
  sectionSubtitle: {
    fontSize: 14,
    color: colors.subtext,
    marginBottom: spacing(3),
    marginTop: -spacing(2),
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing(8),
  },
  emptyStateTitle: {
    fontSize: fonts.h3,
    fontWeight: '700',
    color: colors.text,
    marginTop: spacing(2),
    marginBottom: spacing(1),
  },
  emptyStateText: {
    fontSize: 14,
    color: colors.subtext,
    textAlign: 'center',
    lineHeight: 20,
  },
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
  shoppingItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing(0.5),
  },
  shoppingItemName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
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
  quantityText: {
    color: colors.accent,
    fontWeight: '700',
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

  // New styles for improved shopping items
  shoppingItemName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing(0.5),
  },
  shoppingItemMeta: {
    flexDirection: 'row',
    gap: spacing(1),
    marginBottom: spacing(0.5),
  },
  shoppingItemBrand: {
    fontSize: 13,
    color: colors.muted,
    fontWeight: '500',
  },
  shoppingItemSize: {
    fontSize: 13,
    color: colors.muted,
  },
  editButton: {
    padding: spacing(1),
    marginLeft: spacing(1),
  },

  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    padding: spacing(4),
    minWidth: 300,
    maxWidth: '90%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing(1),
  },
  modalSubtitle: {
    fontSize: 14,
    color: colors.muted,
    textAlign: 'center',
    marginBottom: spacing(3),
  },
  brandInput: {
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radii.md,
    padding: spacing(3),
    fontSize: 16,
    color: colors.text,
    backgroundColor: colors.bg,
    marginBottom: spacing(3),
  },
  modalButtons: {
    flexDirection: 'row',
    gap: spacing(2),
  },
  modalButton: {
    flex: 1,
    padding: spacing(3),
    borderRadius: radii.md,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: colors.bg,
    borderWidth: 1,
    borderColor: colors.line,
  },
  saveButton: {
    backgroundColor: colors.accent,
  },
  cancelButtonText: {
    color: colors.text,
    fontWeight: '500',
  },
  saveButtonText: {
    color: colors.bg,
    fontWeight: '600',
  },
});