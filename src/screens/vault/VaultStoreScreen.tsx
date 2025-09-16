/**
 * VAULT STORE SCREEN
 * Store for purchasing Keys, Boosters, and other monetization items with real money
 */

import React, { useLayoutEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  Alert,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/RootNavigator';
import { colors, spacing, radii } from '../../theme/tokens';
import { useVault } from '../../contexts/VaultContext';
import { MonetizationItem } from '../../types/vault';

export default function VaultStoreScreen() {
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { state, addToCart, getCartItemCount } = useVault();
  const [selectedCategory, setSelectedCategory] = useState<string>('keys');
  
  useLayoutEffect(() => {
    nav.setOptions({
      title: 'Keys & Boosters',
      headerStyle: { backgroundColor: colors.bg },
      headerTintColor: colors.text,
      headerTitleStyle: { color: colors.text, fontWeight: '900' },
      headerShadowVisible: false,
      headerLeft: () => (
        <Pressable hitSlop={12} onPress={() => nav.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
      ),
      headerRight: () => (
        <Pressable 
          hitSlop={12} 
          onPress={() => nav.navigate('VaultCart' as never)}
          style={styles.headerButton}
        >
          <Ionicons name="bag-outline" size={24} color={colors.text} />
          {getCartItemCount() > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{getCartItemCount()}</Text>
            </View>
          )}
        </Pressable>
      ),
    });
  }, [nav, getCartItemCount()]);

  const getFilteredItems = (): MonetizationItem[] => {
    return state.monetizationItems.filter(item => {
      if (selectedCategory === 'keys') return item.type === 'keys';
      if (selectedCategory === 'boosters') return item.type === 'booster';
      if (selectedCategory === 'passes') return item.type === 'pass';
      return true;
    });
  };

  const getItemIcon = (type: MonetizationItem['type']): string => {
    switch (type) {
      case 'keys': return 'key';
      case 'booster': return 'flash';
      case 'pass': return 'card-outline';
      case 'merch': return 'gift-outline';
      default: return 'cube-outline';
    }
  };

  const getItemColor = (type: MonetizationItem['type']): string => {
    switch (type) {
      case 'keys': return colors.accent;
      case 'booster': return colors.gold;
      case 'pass': return '#9C27B0';
      case 'merch': return colors.subtext;
      default: return colors.accent;
    }
  };

  const handleAddToCart = async (item: MonetizationItem) => {
    try {
      const success = await addToCart(item.id, 1);
      if (success) {
        Alert.alert('Added to Cart', `${item.name} has been added to your cart.`);
      } else {
        Alert.alert('Error', 'Failed to add item to cart. Please try again.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to add item to cart. Please try again.');
    }
  };

  const categories = [
    { key: 'keys', label: 'Keys', icon: 'key' },
    { key: 'boosters', label: 'Boosters', icon: 'flash' },
    { key: 'passes', label: 'Passes', icon: 'card' },
  ];

  return (
    <View style={styles.container}>
      {/* Store Header */}
      <View style={styles.storeHeader}>
        <Text style={styles.storeTitle}>Unlock the Vault</Text>
        <Text style={styles.storeSubtitle}>
          Purchase Keys and Boosters to unlock premium cocktail items and accelerate your learning
        </Text>
      </View>

      {/* Category Filter */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        style={styles.categoriesContainer}
        contentContainerStyle={styles.categoriesContent}
      >
        {categories.map((category) => {
          const isActive = selectedCategory === category.key;
          return (
            <TouchableOpacity
              key={category.key}
              style={[styles.categoryChip, isActive && styles.activeCategoryChip]}
              onPress={() => setSelectedCategory(category.key)}
              activeOpacity={0.8}
            >
              <Ionicons 
                name={category.icon as any} 
                size={16} 
                color={isActive ? colors.white : colors.text} 
              />
              <Text style={[
                styles.categoryText,
                isActive && styles.activeCategoryText
              ]}>
                {category.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Items Grid */}
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.itemsGrid}>
          {getFilteredItems().map((item) => (
            <View key={item.id} style={styles.storeItemCard}>
              {/* Item Header */}
              <View style={styles.itemHeader}>
                <View style={[styles.itemIconContainer, { backgroundColor: getItemColor(item.type) }]}>
                  <MaterialCommunityIcons 
                    name={getItemIcon(item.type)} 
                    size={24} 
                    color={colors.white} 
                  />
                </View>
                
                {item.originalPrice && (
                  <View style={styles.discountBadge}>
                    <Text style={styles.discountText}>
                      SAVE ${((item.originalPrice - item.price) / 100).toFixed(0)}
                    </Text>
                  </View>
                )}
              </View>

              {/* Item Info */}
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemDescription}>{item.description}</Text>

              {/* What You Get */}
              <View style={styles.rewardsSection}>
                {item.keysGranted && (
                  <View style={styles.rewardRow}>
                    <MaterialCommunityIcons name="key" size={16} color={colors.accent} />
                    <Text style={styles.rewardText}>
                      {item.keysGranted} Key{item.keysGranted !== 1 ? 's' : ''}
                    </Text>
                  </View>
                )}
                
                {item.boosterEffect && (
                  <View style={styles.rewardRow}>
                    <MaterialCommunityIcons name="flash" size={16} color={colors.gold} />
                    <Text style={styles.rewardText}>
                      {item.boosterEffect.description}
                    </Text>
                  </View>
                )}
              </View>

              {/* Pricing */}
              <View style={styles.pricingSection}>
                {item.originalPrice && (
                  <Text style={styles.originalPrice}>
                    ${(item.originalPrice / 100).toFixed(2)}
                  </Text>
                )}
                <Text style={styles.currentPrice}>
                  ${(item.price / 100).toFixed(2)}
                </Text>
              </View>

              {/* Add to Cart Button */}
              <TouchableOpacity 
                style={[
                  styles.addToCartButton,
                  !item.inStock && styles.disabledButton
                ]}
                onPress={() => handleAddToCart(item)}
                disabled={!item.inStock}
                activeOpacity={0.8}
              >
                <Ionicons name="bag-add" size={16} color={colors.white} />
                <Text style={styles.addToCartText}>
                  {item.inStock ? 'Add to Cart' : 'Out of Stock'}
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {getFilteredItems().length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="storefront-outline" size={80} color={colors.subtext} />
            <Text style={styles.emptyTitle}>No Items Available</Text>
            <Text style={styles.emptySubtitle}>
              Check back later for new Keys and Boosters
            </Text>
          </View>
        )}

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  headerButton: {
    position: 'relative',
  },
  cartBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: colors.accent,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartBadgeText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '700',
  },

  // Store Header
  storeHeader: {
    backgroundColor: colors.card,
    padding: spacing(3),
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  storeTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: colors.text,
    marginBottom: spacing(1),
  },
  storeSubtitle: {
    fontSize: 14,
    color: colors.subtext,
    lineHeight: 20,
  },

  // Categories
  categoriesContainer: {
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  categoriesContent: {
    paddingHorizontal: spacing(2),
    paddingVertical: spacing(2),
    gap: spacing(1.5),
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radii.md,
    paddingHorizontal: spacing(2),
    paddingVertical: spacing(1.25),
    gap: spacing(1),
  },
  activeCategoryChip: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  activeCategoryText: {
    color: colors.white,
  },

  // Content
  scrollContent: {
    paddingBottom: spacing(4),
  },
  itemsGrid: {
    padding: spacing(2),
    gap: spacing(2),
  },

  // Store Item Card
  storeItemCard: {
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    padding: spacing(3),
    borderWidth: 1,
    borderColor: colors.line,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing(2),
  },
  itemIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  discountBadge: {
    backgroundColor: '#FF6B6B',
    borderRadius: radii.sm,
    paddingHorizontal: spacing(1.5),
    paddingVertical: spacing(0.5),
  },
  discountText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: '800',
  },
  itemName: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
    marginBottom: spacing(1),
  },
  itemDescription: {
    fontSize: 14,
    color: colors.subtext,
    lineHeight: 20,
    marginBottom: spacing(2),
  },

  // Rewards
  rewardsSection: {
    marginBottom: spacing(3),
  },
  rewardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing(1),
    gap: spacing(1),
  },
  rewardText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
  },

  // Pricing
  pricingSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing(3),
    gap: spacing(1),
  },
  originalPrice: {
    fontSize: 14,
    color: colors.subtext,
    textDecorationLine: 'line-through',
  },
  currentPrice: {
    fontSize: 24,
    fontWeight: '900',
    color: colors.text,
  },

  // Add to Cart Button
  addToCartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accent,
    borderRadius: radii.md,
    paddingHorizontal: spacing(2),
    paddingVertical: spacing(1.25),
    gap: spacing(1),
  },
  disabledButton: {
    backgroundColor: colors.subtext,
    opacity: 0.6,
  },
  addToCartText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
  },

  // Empty State
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing(8),
    paddingHorizontal: spacing(4),
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
    marginTop: spacing(2),
    marginBottom: spacing(1),
  },
  emptySubtitle: {
    fontSize: 14,
    color: colors.subtext,
    textAlign: 'center',
  },

  bottomSpacer: {
    height: spacing(4),
  },
});