/**
 * VAULT STORE SCREEN - KEYS & BOOSTERS
 * Clean, modern design following app's current patterns
 */

import React, { useLayoutEffect, useState, useEffect, useRef } from 'react';
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
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/RootNavigator';
import { colors, spacing, radii } from '../../theme/tokens';
import { useVault } from '../../contexts/VaultContext';
import { MonetizationItem } from '../../types/vault';
import PillButton from '../../components/PillButton';

export default function VaultStoreScreen() {
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute();
  const { state, addToCart, getCartItemCount } = useVault();
  const hasProcessedInitialParams = useRef(false);
  const [selectedCategory, setSelectedCategory] = useState<string>(() => {
    // Check initial route params
    const params = route.params as any;
    console.log('🔧 VaultStore: Initial route params:', params);
    return params?.tab || 'keys';
  });

  useEffect(() => {
    // Only process initial navigation params once
    const params = route.params as any;
    console.log('🔧 VaultStore: Route params changed:', params);
    if (params?.tab && !hasProcessedInitialParams.current) {
      console.log('🔧 VaultStore: Setting category to:', params.tab);
      setSelectedCategory(params.tab);
      hasProcessedInitialParams.current = true;
    }
  }, [route.params]);

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
    // For hearts category, show placeholder hearts items
    if (selectedCategory === 'hearts') {
      return [
        {
          id: 'heart-1',
          name: '1 Heart',
          description: 'Restore 1 heart to continue playing',
          type: 'hearts' as any,
          price: 99, // $0.99
          inStock: true,
          heartsGranted: 1
        },
        {
          id: 'heart-5',
          name: '5 Hearts',
          description: 'Restore 5 hearts with bonus value',
          type: 'hearts' as any,
          price: 399, // $3.99
          originalPrice: 495, // $4.95 (save $0.96)
          inStock: true,
          heartsGranted: 5
        },
        {
          id: 'heart-unlimited',
          name: 'Unlimited Hearts',
          description: '24 hours of unlimited hearts',
          type: 'hearts' as any,
          price: 799, // $7.99
          inStock: true,
          heartsGranted: 999
        }
      ];
    }

    return state.monetizationItems.filter(item => {
      if (selectedCategory === 'keys') return item.type === 'keys';
      if (selectedCategory === 'boosters') return item.type === 'booster';
      if (selectedCategory === 'bundles') return item.type === 'pass';
      return true;
    });
  };

  const getItemIcon = (type: MonetizationItem['type'] | 'hearts'): string => {
    switch (type) {
      case 'keys': return 'key';
      case 'booster': return 'flash';
      case 'pass': return 'gift';
      case 'hearts': return 'heart';
      default: return 'cube';
    }
  };

  const getItemColor = (type: MonetizationItem['type'] | 'hearts'): string => {
    switch (type) {
      case 'keys': return colors.accent;
      case 'booster': return colors.gold;
      case 'pass': return '#9C27B0';
      case 'hearts': return '#FF6B6B';
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
    { key: 'hearts', label: 'Hearts' },
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

          {(item as any).heartsGranted && (
            <View style={styles.benefitRow}>
              <Ionicons name="heart" size={14} color="#FF6B6B" />
              <Text style={styles.benefitText}>
                {(item as any).heartsGranted === 999 ? 'Unlimited Hearts' : `${(item as any).heartsGranted} Heart${(item as any).heartsGranted !== 1 ? 's' : ''}`}
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