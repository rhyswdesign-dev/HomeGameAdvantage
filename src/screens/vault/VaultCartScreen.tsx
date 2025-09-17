/**
 * VAULT CART SCREEN
 * Shows Keys/Boosters added to cart for real-money purchase
 */

import React, { useLayoutEffect } from 'react';
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

export default function VaultCartScreen() {
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { state, removeFromCart, getCartItemCount, getCartTotal } = useVault();
  
  useLayoutEffect(() => {
    nav.setOptions({
      title: 'Cart',
      headerStyle: { backgroundColor: colors.bg },
      headerTintColor: colors.text,
      headerTitleStyle: { color: colors.text, fontWeight: '900' },
      headerShadowVisible: false,
      headerLeft: () => null,
    });
  }, [nav]);

  const handleRemoveItem = (itemId: string, itemName: string) => {
    Alert.alert(
      'Remove Item', 
      `Remove ${itemName} from cart?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Remove', 
          style: 'destructive',
          onPress: () => removeFromCart(itemId)
        }
      ]
    );
  };

  const handleCheckout = () => {
    if (state.cart.items.length === 0) {
      Alert.alert('Empty Cart', 'Add items to your cart before checking out.');
      return;
    }
    nav.navigate('VaultCheckout' as never);
  };

  return (
    <View style={styles.container}>
      {state.cart.items.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="bag-outline" size={80} color={colors.subtext} />
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptySubtitle}>
            Add Keys or Boosters to unlock premium Vault items
          </Text>
          <TouchableOpacity 
            style={styles.shopButton}
            onPress={() => nav.navigate('VaultStore' as never)}
          >
            <Text style={styles.shopButtonText}>Browse Keys & Boosters</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <ScrollView style={styles.cartItems}>
            {state.cart.items.map((cartItem) => {
              const item = state.monetizationItems.find(m => m.id === cartItem.monetizationItemId);
              if (!item) return null;
              
              return (
                <View key={cartItem.monetizationItemId} style={styles.cartItem}>
                  <View style={styles.itemInfo}>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <Text style={styles.itemDescription}>{item.description}</Text>
                    
                    <View style={styles.itemDetails}>
                      <View style={styles.quantityInfo}>
                        <Text style={styles.quantityLabel}>Qty: </Text>
                        <Text style={styles.quantityValue}>{cartItem.quantity}</Text>
                      </View>
                      <View style={styles.priceInfo}>
                        <Text style={styles.unitPrice}>
                          ${(cartItem.unitPrice / 100).toFixed(2)} each
                        </Text>
                        <Text style={styles.totalPrice}>
                          ${(cartItem.totalPrice / 100).toFixed(2)}
                        </Text>
                      </View>
                    </View>
                  </View>
                  
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => handleRemoveItem(cartItem.monetizationItemId, item.name)}
                  >
                    <Ionicons name="trash-outline" size={20} color={colors.destructive} />
                  </TouchableOpacity>
                </View>
              );
            })}
          </ScrollView>
          
          {/* Cart Summary */}
          <View style={styles.cartSummary}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>
                ${(state.cart.subtotal / 100).toFixed(2)}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Tax</Text>
              <Text style={styles.summaryValue}>
                ${(state.cart.tax / 100).toFixed(2)}
              </Text>
            </View>
            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>
                ${(state.cart.total / 100).toFixed(2)}
              </Text>
            </View>
            
            <TouchableOpacity 
              style={styles.checkoutButton}
              onPress={handleCheckout}
            >
              <Text style={styles.checkoutButtonText}>
                Checkout ({getCartItemCount()} item{getCartItemCount() !== 1 ? 's' : ''})
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  
  // Empty State
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
    marginBottom: spacing(3),
  },
  shopButton: {
    backgroundColor: colors.accent,
    borderRadius: radii.md,
    paddingHorizontal: spacing(3),
    paddingVertical: spacing(2),
  },
  shopButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
  
  // Cart Items
  cartItems: {
    flex: 1,
    padding: spacing(2),
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    padding: spacing(3),
    marginBottom: spacing(2),
    borderWidth: 1,
    borderColor: colors.line,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing(0.5),
  },
  itemDescription: {
    fontSize: 13,
    color: colors.subtext,
    marginBottom: spacing(2),
    lineHeight: 18,
  },
  itemDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quantityInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityLabel: {
    fontSize: 12,
    color: colors.subtext,
  },
  quantityValue: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  priceInfo: {
    alignItems: 'flex-end',
  },
  unitPrice: {
    fontSize: 11,
    color: colors.subtext,
  },
  totalPrice: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
  },
  removeButton: {
    padding: spacing(1),
    marginLeft: spacing(2),
  },
  
  // Cart Summary
  cartSummary: {
    backgroundColor: colors.card,
    borderTopWidth: 1,
    borderTopColor: colors.line,
    padding: spacing(3),
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing(1),
  },
  summaryLabel: {
    fontSize: 14,
    color: colors.subtext,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  totalRow: {
    marginTop: spacing(1),
    paddingTop: spacing(2),
    borderTopWidth: 1,
    borderTopColor: colors.line,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '900',
    color: colors.text,
  },
  checkoutButton: {
    backgroundColor: colors.accent,
    borderRadius: radii.lg,
    paddingVertical: spacing(2),
    alignItems: 'center',
    marginTop: spacing(3),
  },
  checkoutButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '800',
  },
});