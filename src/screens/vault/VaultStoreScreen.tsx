/**
 * VAULT STORE SCREEN - KEYS & BOOSTERS
 * Clean, modern design following app's current patterns
 */

import React, { useLayoutEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/RootNavigator';
import { colors, spacing, radii } from '../../theme/tokens';
import { useVault } from '../../contexts/VaultContext';
import { MonetizationItem } from '../../types/vault';
import PillButton from '../../components/PillButton';

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
      headerLeft: () => null,
      headerRight: () => (
        <Pressable 
          hitSlop={12} 
          onPress={() => nav.navigate('VaultCart')}
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
      if (selectedCategory === 'bundles') return item.type === 'pass';
      return true;
    });
  };

  const getItemIcon = (type: MonetizationItem['type']): string => {
    switch (type) {
      case 'keys': return 'key';
      case 'booster': return 'flash';
      case 'pass': return 'gift';
      default: return 'cube';
    }
  };

  const getItemColor = (type: MonetizationItem['type']): string => {
    switch (type) {
      case 'keys': return colors.accent;
      case 'booster': return colors.gold;
      case 'pass': return '#9C27B0';
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
    { key: 'keys', label: 'Keys' },
    { key: 'boosters', label: 'Boosters' },
    { key: 'bundles', label: 'Bundles' },
  ];

  const renderStoreItem = ({ item }: { item: MonetizationItem }) => (
    <View style={styles.storeItemCard}>
      {/* Item Header */}
      <View style={styles.itemHeader}>
        <View style={[styles.itemIcon, { backgroundColor: getItemColor(item.type) }]}>
          <MaterialCommunityIcons 
            name={getItemIcon(item.type) as any} 
            size={20} 
            color={colors.white} 
          />
        </View>
        
        {item.originalPrice && item.originalPrice > item.price && (
          <View style={styles.saveBadge}>
            <Text style={styles.saveText}>
              SAVE ${((item.originalPrice - item.price) / 100).toFixed(0)}
            </Text>
          </View>
        )}
      </View>

      {/* Item Content */}
      <View style={styles.itemContent}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemDescription}>{item.description}</Text>
        
        {/* What You Get */}
        <View style={styles.benefitsContainer}>
          {item.keysGranted && (
            <View style={styles.benefitRow}>
              <MaterialCommunityIcons name="key" size={14} color={colors.accent} />
              <Text style={styles.benefitText}>
                {item.keysGranted} Key{item.keysGranted !== 1 ? 's' : ''}
              </Text>
            </View>
          )}
          
          {item.boosterEffect && (
            <View style={styles.benefitRow}>
              <MaterialCommunityIcons name="flash" size={14} color={colors.gold} />
              <Text style={styles.benefitText}>
                {item.boosterEffect.description}
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Pricing & Purchase */}
      <View style={styles.purchaseSection}>
        <View style={styles.priceContainer}>
          {item.originalPrice && item.originalPrice > item.price && (
            <Text style={styles.originalPrice}>
              ${(item.originalPrice / 100).toFixed(2)}
            </Text>
          )}
          <Text style={styles.currentPrice}>
            ${(item.price / 100).toFixed(2)}
          </Text>
        </View>
        
        <TouchableOpacity 
          style={[
            styles.purchaseButton,
            !item.inStock && styles.disabledButton
          ]}
          onPress={() => handleAddToCart(item)}
          disabled={!item.inStock}
          activeOpacity={0.8}
        >
          <Ionicons 
            name={item.inStock ? "bag-add" : "close-circle"} 
            size={16} 
            color={colors.white} 
          />
          <Text style={styles.purchaseButtonText}>
            {item.inStock ? 'Add to Cart' : 'Out of Stock'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderHeader = () => (
    <View>
      {/* Store Header */}
      <View style={styles.storeHeader}>
        <Text style={styles.storeTitle}>Unlock Premium Content</Text>
        <Text style={styles.storeSubtitle}>
          Get Keys to unlock rare items and Boosters to accelerate your progress
        </Text>
      </View>

      {/* Category Tabs */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.tabsScrollView}
        contentContainerStyle={styles.tabsContainer}
      >
        {categories.map((category) => {
          const isActive = selectedCategory === category.key;
          return (
            <PillButton
              key={category.key}
              title={category.label}
              onPress={() => setSelectedCategory(category.key)}
              style={!isActive ? { backgroundColor: 'transparent', borderWidth: 1, borderColor: colors.line } : undefined}
              textStyle={{ color: isActive ? colors.pillTextOnLight : colors.text }}
            />
          );
        })}
      </ScrollView>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="storefront-outline" size={80} color={colors.subtext} />
      <Text style={styles.emptyTitle}>No Items Available</Text>
      <Text style={styles.emptySubtitle}>
        Check back later for new Keys and Boosters
      </Text>
    </View>
  );

  const filteredItems = getFilteredItems();

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredItems}
        renderItem={renderStoreItem}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyState}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        numColumns={1}
      />
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
    fontSize: 10,
    fontWeight: '700',
  },
  
  listContent: {
    flexGrow: 1,
    paddingBottom: spacing(4),
  },
  
  // Store Header
  storeHeader: {
    backgroundColor: colors.card,
    padding: spacing(1.5),
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  
  storeTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: colors.text,
    marginBottom: spacing(0.5),
  },
  
  storeSubtitle: {
    fontSize: 13,
    color: colors.subtext,
    lineHeight: 18,
  },
  
  // Tabs
  tabsScrollView: {
    backgroundColor: colors.bg,
  },
  
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing(2),
    paddingVertical: spacing(1),
    gap: spacing(1),
  },
  
  // Store Item Card
  storeItemCard: {
    backgroundColor: colors.card,
    marginHorizontal: spacing(2),
    marginBottom: spacing(1.5),
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.line,
    overflow: 'hidden',
  },
  
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: spacing(2),
    paddingBottom: spacing(1),
  },
  
  itemIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  saveBadge: {
    backgroundColor: '#FF6B6B',
    borderRadius: radii.sm,
    paddingHorizontal: spacing(1),
    paddingVertical: spacing(0.5),
  },
  
  saveText: {
    color: colors.white,
    fontSize: 9,
    fontWeight: '800',
  },
  
  itemContent: {
    paddingHorizontal: spacing(2),
    paddingBottom: spacing(1.5),
  },
  
  itemName: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
    marginBottom: spacing(0.5),
  },
  
  itemDescription: {
    fontSize: 12,
    color: colors.subtext,
    lineHeight: 16,
    marginBottom: spacing(1.5),
  },
  
  // Benefits
  benefitsContainer: {
    gap: spacing(0.75),
  },
  
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing(1),
  },
  
  benefitText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
  },
  
  // Purchase Section
  purchaseSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing(2),
    borderTopWidth: 1,
    borderTopColor: colors.line,
    gap: spacing(2),
  },
  
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing(1),
  },
  
  originalPrice: {
    fontSize: 12,
    color: colors.subtext,
    textDecorationLine: 'line-through',
  },
  
  currentPrice: {
    fontSize: 18,
    fontWeight: '900',
    color: colors.text,
  },
  
  purchaseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.accent,
    borderRadius: radii.md,
    paddingHorizontal: spacing(2),
    paddingVertical: spacing(1),
    gap: spacing(0.75),
    minWidth: 120,
    justifyContent: 'center',
  },
  
  disabledButton: {
    backgroundColor: colors.subtext,
    opacity: 0.6,
  },
  
  purchaseButtonText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '700',
  },
  
  // Empty State
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing(4),
    paddingTop: spacing(8),
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
});