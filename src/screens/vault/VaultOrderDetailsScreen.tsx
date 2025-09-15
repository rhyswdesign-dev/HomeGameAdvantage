/**
 * VAULT ORDER DETAILS SCREEN
 * Shows detailed information about a specific order
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
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/RootNavigator';
import { colors, spacing, radii } from '../../theme/tokens';

interface OrderItem {
  id: string;
  name: string;
  type: 'keys' | 'booster' | 'pass' | 'merch';
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

interface Order {
  id: string;
  date: string;
  status: 'completed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  paymentMethod: string;
  shippingAddress?: {
    name: string;
    street1: string;
    street2?: string;
    city: string;
    state: string;
    zipCode: string;
  };
  trackingNumber?: string;
}

type OrderDetailsRouteProp = RouteProp<RootStackParamList, 'VaultOrderDetails'>;

export default function VaultOrderDetailsScreen() {
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<OrderDetailsRouteProp>();
  
  const { orderId } = route.params || {};
  
  // Mock order data - would come from backend in real app
  const order: Order = {
    id: orderId || 'order_1234567890',
    date: '2024-01-15T14:30:00Z',
    status: 'completed',
    items: [
      {
        id: 'keys_starter_pack',
        name: 'Starter Key Pack',
        type: 'keys',
        quantity: 1,
        unitPrice: 499,
        totalPrice: 499
      },
      {
        id: 'xp_booster_24h',
        name: '24-Hour XP Booster',
        type: 'booster',
        quantity: 1,
        unitPrice: 199,
        totalPrice: 199
      }
    ],
    subtotal: 698,
    tax: 56,
    shipping: 0,
    total: 754,
    paymentMethod: 'Card ending in ••••4242'
  };
  
  useLayoutEffect(() => {
    nav.setOptions({
      title: 'Order Details',
      headerStyle: { backgroundColor: colors.bg },
      headerTintColor: colors.text,
      headerTitleStyle: { color: colors.text, fontWeight: '900' },
      headerShadowVisible: false,
      headerLeft: () => (
        <Pressable hitSlop={12} onPress={() => nav.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
      ),
    });
  }, [nav]);

  const getStatusColor = (status: Order['status']): string => {
    switch (status) {
      case 'completed': return colors.accent;
      case 'processing': return colors.gold;
      case 'shipped': return '#2196F3';
      case 'delivered': return '#4CAF50';
      case 'cancelled': return colors.destructive;
      default: return colors.subtext;
    }
  };

  const getStatusIcon = (status: Order['status']): string => {
    switch (status) {
      case 'completed': return 'checkmark-circle';
      case 'processing': return 'time';
      case 'shipped': return 'car';
      case 'delivered': return 'home';
      case 'cancelled': return 'close-circle';
      default: return 'help-circle';
    }
  };

  const getItemIcon = (type: OrderItem['type']): string => {
    switch (type) {
      case 'keys': return 'key';
      case 'booster': return 'flash';
      case 'pass': return 'card';
      case 'merch': return 'gift';
      default: return 'cube';
    }
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleDownloadReceipt = () => {
    Alert.alert(
      'Download Receipt',
      'Receipt will be downloaded to your device.',
      [{ text: 'OK' }]
    );
  };

  const handleContactSupport = () => {
    Alert.alert(
      'Contact Support',
      'Would you like to contact support about this order?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Contact Support', onPress: () => {} }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        {/* Order Status */}
        <View style={styles.statusSection}>
          <View style={styles.statusHeader}>
            <Ionicons 
              name={getStatusIcon(order.status)} 
              size={32} 
              color={getStatusColor(order.status)} 
            />
            <View style={styles.statusInfo}>
              <Text style={styles.statusTitle}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </Text>
              <Text style={styles.statusSubtitle}>
                Order #{order.id.slice(-8)}
              </Text>
              <Text style={styles.orderDate}>
                {formatDate(order.date)}
              </Text>
            </View>
          </View>
          
          {order.trackingNumber && (
            <View style={styles.trackingInfo}>
              <Text style={styles.trackingLabel}>Tracking Number</Text>
              <Text style={styles.trackingNumber}>{order.trackingNumber}</Text>
            </View>
          )}
        </View>

        {/* Order Items */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Items Purchased</Text>
          
          {order.items.map((item) => (
            <View key={item.id} style={styles.orderItem}>
              <View style={styles.itemIcon}>
                <MaterialCommunityIcons 
                  name={getItemIcon(item.type)} 
                  size={20} 
                  color={colors.accent} 
                />
              </View>
              
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemDetails}>
                  Qty: {item.quantity} • ${(item.unitPrice / 100).toFixed(2)} each
                </Text>
              </View>
              
              <Text style={styles.itemPrice}>
                ${(item.totalPrice / 100).toFixed(2)}
              </Text>
            </View>
          ))}
        </View>

        {/* Order Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          
          <View style={styles.summaryRows}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>
                ${(order.subtotal / 100).toFixed(2)}
              </Text>
            </View>
            
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Tax</Text>
              <Text style={styles.summaryValue}>
                ${(order.tax / 100).toFixed(2)}
              </Text>
            </View>
            
            {order.shipping > 0 && (
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Shipping</Text>
                <Text style={styles.summaryValue}>
                  ${(order.shipping / 100).toFixed(2)}
                </Text>
              </View>
            )}
            
            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>
                ${(order.total / 100).toFixed(2)}
              </Text>
            </View>
          </View>
        </View>

        {/* Payment & Shipping */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment & Shipping</Text>
          
          <View style={styles.infoRows}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Payment Method</Text>
              <Text style={styles.infoValue}>{order.paymentMethod}</Text>
            </View>
            
            {order.shippingAddress && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Shipping Address</Text>
                <View style={styles.addressValue}>
                  <Text style={styles.addressLine}>{order.shippingAddress.name}</Text>
                  <Text style={styles.addressLine}>{order.shippingAddress.street1}</Text>
                  {order.shippingAddress.street2 && (
                    <Text style={styles.addressLine}>{order.shippingAddress.street2}</Text>
                  )}
                  <Text style={styles.addressLine}>
                    {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                  </Text>
                </View>
              </View>
            )}
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actionsSection}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={handleDownloadReceipt}
          >
            <Ionicons name="download-outline" size={20} color={colors.text} />
            <Text style={styles.actionButtonText}>Download Receipt</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={handleContactSupport}
          >
            <Ionicons name="help-circle-outline" size={20} color={colors.text} />
            <Text style={styles.actionButtonText}>Contact Support</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  
  // Status Section
  statusSection: {
    backgroundColor: colors.card,
    padding: spacing(3),
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing(2),
  },
  statusInfo: {
    marginLeft: spacing(2),
  },
  statusTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
  },
  statusSubtitle: {
    fontSize: 14,
    color: colors.subtext,
    marginTop: spacing(0.5),
  },
  orderDate: {
    fontSize: 12,
    color: colors.subtext,
    marginTop: spacing(0.5),
  },
  trackingInfo: {
    backgroundColor: colors.bg,
    borderRadius: radii.lg,
    padding: spacing(2),
  },
  trackingLabel: {
    fontSize: 12,
    color: colors.subtext,
    marginBottom: spacing(0.5),
  },
  trackingNumber: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  
  // Sections
  section: {
    backgroundColor: colors.card,
    padding: spacing(3),
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
    marginBottom: spacing(2),
  },
  
  // Order Items
  orderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bg,
    borderRadius: radii.lg,
    padding: spacing(2),
    marginBottom: spacing(2),
  },
  itemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemInfo: {
    flex: 1,
    marginLeft: spacing(2),
  },
  itemName: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing(0.5),
  },
  itemDetails: {
    fontSize: 12,
    color: colors.subtext,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
  },
  
  // Summary
  summaryRows: {
    backgroundColor: colors.bg,
    borderRadius: radii.lg,
    padding: spacing(2),
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing(1),
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
  
  // Info Rows
  infoRows: {
    backgroundColor: colors.bg,
    borderRadius: radii.lg,
    padding: spacing(2),
  },
  infoRow: {
    paddingVertical: spacing(1.5),
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  infoLabel: {
    fontSize: 12,
    color: colors.subtext,
    marginBottom: spacing(0.5),
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  addressValue: {
    
  },
  addressLine: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  
  // Actions
  actionsSection: {
    padding: spacing(3),
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    padding: spacing(3),
    marginBottom: spacing(2),
    borderWidth: 1,
    borderColor: colors.line,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginLeft: spacing(2),
  },
});