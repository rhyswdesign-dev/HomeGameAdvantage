/**
 * VAULT ORDER HISTORY SCREEN
 * Shows all past purchases of Keys, Boosters, and other monetization items
 */

import React, { useLayoutEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  RefreshControl,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/RootNavigator';
import { colors, spacing, radii } from '../../theme/tokens';

interface OrderSummary {
  id: string;
  date: string;
  status: 'completed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  itemsCount: number;
  total: number;
  primaryItem: string; // Main item name for display
}

export default function VaultOrderHistoryScreen() {
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  
  // Mock order history - would come from backend in real app
  const [orders, setOrders] = useState<OrderSummary[]>([
    {
      id: 'order_1234567890',
      date: '2024-01-15T14:30:00Z',
      status: 'completed',
      itemsCount: 1,
      total: 299, // $2.99 - Starter Key Pack
      primaryItem: 'Starter Key Pack'
    },
    {
      id: 'order_0987654321',
      date: '2024-01-10T09:15:00Z',
      status: 'completed',
      itemsCount: 1,
      total: 199, // $1.99 - 2x XP Booster
      primaryItem: '2x XP Booster'
    },
    {
      id: 'order_1122334455',
      date: '2024-01-05T16:45:00Z',
      status: 'delivered',
      itemsCount: 1,
      total: 699, // $6.99 - Value Key Bundle
      primaryItem: 'Value Key Bundle'
    },
    {
      id: 'order_5544332211',
      date: '2023-12-28T11:20:00Z',
      status: 'completed',
      itemsCount: 1,
      total: 1499, // $14.99 - Ultimate Key Collection
      primaryItem: 'Ultimate Key Collection'
    }
  ]);
  
  useLayoutEffect(() => {
    nav.setOptions({
      title: 'Order History',
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

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const getStatusColor = (status: OrderSummary['status']): string => {
    switch (status) {
      case 'completed': return colors.accent;
      case 'processing': return colors.gold;
      case 'shipped': return '#2196F3';
      case 'delivered': return '#4CAF50';
      case 'cancelled': return colors.destructive;
      default: return colors.subtext;
    }
  };

  const getStatusIcon = (status: OrderSummary['status']): string => {
    switch (status) {
      case 'completed': return 'checkmark-circle';
      case 'processing': return 'time';
      case 'shipped': return 'car';
      case 'delivered': return 'home';
      case 'cancelled': return 'close-circle';
      default: return 'help-circle';
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getFilteredOrders = (): OrderSummary[] => {
    if (selectedFilter === 'all') return orders;
    return orders.filter(order => order.status === selectedFilter);
  };

  const filters = [
    { key: 'all', label: 'All Orders', count: orders.length },
    { key: 'completed', label: 'Completed', count: orders.filter(o => o.status === 'completed').length },
    { key: 'processing', label: 'Processing', count: orders.filter(o => o.status === 'processing').length },
    { key: 'delivered', label: 'Delivered', count: orders.filter(o => o.status === 'delivered').length }
  ];

  const filteredOrders = getFilteredOrders();

  return (
    <View style={styles.container}>
      {/* Filter Tabs */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.filtersContainer}
        contentContainerStyle={styles.filtersContent}
      >
        {filters.map((filter) => {
          const isActive = selectedFilter === filter.key;
          return (
            <TouchableOpacity
              key={filter.key}
              style={[styles.filterChip, isActive && styles.activeFilterChip]}
              onPress={() => setSelectedFilter(filter.key)}
              activeOpacity={0.8}
            >
              <Text style={[styles.filterText, isActive && styles.activeFilterText]}>
                {filter.label}
              </Text>
              {filter.count > 0 && (
                <View style={[styles.filterBadge, isActive && styles.activeFilterBadge]}>
                  <Text style={[styles.filterBadgeText, isActive && styles.activeFilterBadgeText]}>
                    {filter.count}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="receipt-outline" size={80} color={colors.subtext} />
          <Text style={styles.emptyTitle}>No orders found</Text>
          <Text style={styles.emptySubtitle}>
            {selectedFilter === 'all' 
              ? 'Your purchase history will appear here'
              : `No ${selectedFilter} orders found`
            }
          </Text>
        </View>
      ) : (
        <ScrollView 
          style={styles.ordersList}
          contentContainerStyle={styles.ordersContent}
          refreshControl={
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={onRefresh}
              tintColor={colors.accent}
            />
          }
        >
          {filteredOrders.map((order) => (
            <TouchableOpacity
              key={order.id}
              style={styles.orderCard}
              onPress={() => nav.navigate('VaultOrderDetails' as never, { orderId: order.id } as never)}
              activeOpacity={0.8}
            >
              <View style={styles.orderHeader}>
                <View style={styles.orderInfo}>
                  <Text style={styles.orderPrimaryItem}>{order.primaryItem}</Text>
                  <Text style={styles.orderDetails}>
                    Order #{order.id.slice(-8)} • {order.itemsCount} item{order.itemsCount !== 1 ? 's' : ''}
                  </Text>
                  <Text style={styles.orderDate}>{formatDate(order.date)}</Text>
                </View>
                
                <View style={styles.orderMeta}>
                  <Text style={styles.orderTotal}>${(order.total / 100).toFixed(2)}</Text>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) }]}>
                    <Ionicons 
                      name={getStatusIcon(order.status)} 
                      size={12} 
                      color={colors.white} 
                    />
                    <Text style={styles.statusText}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </Text>
                  </View>
                </View>
              </View>
              
              <View style={styles.orderActions}>
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => nav.navigate('VaultOrderDetails' as never, { orderId: order.id } as never)}
                >
                  <Text style={styles.actionButtonText}>View Details</Text>
                  <Ionicons name="chevron-forward" size={16} color={colors.subtext} />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
          
          <View style={styles.bottomSpacer} />
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  
  
  // Filters
  filtersContainer: {
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  filtersContent: {
    paddingHorizontal: spacing(2),
    paddingVertical: spacing(1),
    gap: spacing(1.5),
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 9999,
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: spacing(1),
    alignSelf: 'flex-start',
  },
  activeFilterChip: {
    backgroundColor: colors.pillButtonColor,
    borderWidth: 0,
    borderColor: 'transparent',
  },
  filterText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  activeFilterText: {
    color: colors.pillTextOnLight,
  },
  filterBadge: {
    backgroundColor: colors.bg,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeFilterBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  filterBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.text,
  },
  activeFilterBadgeText: {
    color: colors.white,
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
  },
  
  // Orders List
  ordersList: {
    flex: 1,
  },
  ordersContent: {
    paddingTop: spacing(1),
  },
  orderCard: {
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    marginHorizontal: spacing(2),
    marginBottom: spacing(1),
    borderWidth: 1,
    borderColor: colors.line,
    overflow: 'hidden',
  },
  orderHeader: {
    flexDirection: 'row',
    padding: spacing(3),
  },
  orderInfo: {
    flex: 1,
  },
  orderPrimaryItem: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing(0.5),
  },
  orderDetails: {
    fontSize: 12,
    color: colors.subtext,
    marginBottom: spacing(0.5),
  },
  orderDate: {
    fontSize: 11,
    color: colors.subtext,
  },
  orderMeta: {
    alignItems: 'flex-end',
    gap: spacing(1),
  },
  orderTotal: {
    fontSize: 18,
    fontWeight: '900',
    color: colors.text,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radii.sm,
    paddingHorizontal: spacing(1.5),
    paddingVertical: spacing(0.5),
    gap: spacing(0.5),
  },
  statusText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: '800',
  },
  orderActions: {
    borderTopWidth: 1,
    borderTopColor: colors.line,
    paddingHorizontal: spacing(3),
    paddingVertical: spacing(2),
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.accent,
  },
  
  bottomSpacer: {
    height: spacing(4),
  },
});