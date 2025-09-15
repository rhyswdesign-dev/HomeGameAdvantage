/**
 * VAULT ORDER CONFIRMATION SCREEN
 * Shows successful purchase confirmation with order details
 */

import React, { useLayoutEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/RootNavigator';
import { colors, spacing, radii } from '../../theme/tokens';
import { useVault } from '../../contexts/VaultContext';

type OrderConfirmationRouteProp = RouteProp<RootStackParamList, 'VaultOrderConfirmation'>;

export default function VaultOrderConfirmationScreen() {
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<OrderConfirmationRouteProp>();
  const { state } = useVault();
  
  const { orderId, total } = route.params || {};
  
  useLayoutEffect(() => {
    nav.setOptions({
      title: 'Order Confirmed',
      headerStyle: { backgroundColor: colors.bg },
      headerTintColor: colors.text,
      headerTitleStyle: { color: colors.text, fontWeight: '900' },
      headerShadowVisible: false,
      headerLeft: () => null, // Prevent going back to checkout
      headerRight: () => (
        <Pressable hitSlop={12} onPress={() => nav.navigate('Tabs' as never)}>
          <Ionicons name="close" size={24} color={colors.text} />
        </Pressable>
      ),
    });
  }, [nav]);

  const handleViewOrderHistory = () => {
    nav.navigate('VaultOrderHistory' as never);
  };

  const handleContinueShopping = () => {
    nav.navigate('Vault' as never);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Success Header */}
        <View style={styles.successHeader}>
          <View style={styles.successIcon}>
            <Ionicons name="checkmark-circle" size={80} color={colors.accent} />
          </View>
          <Text style={styles.successTitle}>Order Confirmed!</Text>
          <Text style={styles.successSubtitle}>
            Your payment has been processed successfully
          </Text>
        </View>

        {/* Order Details */}
        <View style={styles.orderDetails}>
          <Text style={styles.sectionTitle}>Order Details</Text>
          
          <View style={styles.orderInfo}>
            <View style={styles.orderRow}>
              <Text style={styles.orderLabel}>Order ID</Text>
              <Text style={styles.orderValue}>{orderId}</Text>
            </View>
            <View style={styles.orderRow}>
              <Text style={styles.orderLabel}>Total Paid</Text>
              <Text style={styles.orderValue}>${(total / 100).toFixed(2)}</Text>
            </View>
            <View style={styles.orderRow}>
              <Text style={styles.orderLabel}>Payment Method</Text>
              <Text style={styles.orderValue}>Card ending in ••••</Text>
            </View>
            <View style={styles.orderRow}>
              <Text style={styles.orderLabel}>Date</Text>
              <Text style={styles.orderValue}>
                {new Date().toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </Text>
            </View>
          </View>
        </View>

        {/* Keys & Boosters Added */}
        <View style={styles.rewardsSection}>
          <Text style={styles.sectionTitle}>Added to Your Account</Text>
          
          <View style={styles.rewardCard}>
            <MaterialCommunityIcons name="key" size={24} color={colors.accent} />
            <View style={styles.rewardInfo}>
              <Text style={styles.rewardTitle}>Keys Added</Text>
              <Text style={styles.rewardDescription}>
                Use these keys to unlock premium Vault items
              </Text>
            </View>
            <View style={styles.rewardBalance}>
              <Text style={styles.balanceValue}>+5</Text>
              <Text style={styles.balanceLabel}>Keys</Text>
            </View>
          </View>
          
          <View style={styles.rewardCard}>
            <MaterialCommunityIcons name="star-outline" size={24} color={colors.gold} />
            <View style={styles.rewardInfo}>
              <Text style={styles.rewardTitle}>XP Booster Active</Text>
              <Text style={styles.rewardDescription}>
                2x XP for the next 24 hours
              </Text>
            </View>
            <View style={styles.rewardBadge}>
              <Text style={styles.badgeText}>Active</Text>
            </View>
          </View>
        </View>

        {/* What's Next */}
        <View style={styles.nextStepsSection}>
          <Text style={styles.sectionTitle}>What's Next?</Text>
          
          <View style={styles.nextStepCard}>
            <View style={styles.stepIcon}>
              <Ionicons name="cube" size={20} color={colors.white} />
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Explore the Vault</Text>
              <Text style={styles.stepDescription}>
                Use your new Keys to unlock premium cocktail kits, tools, and experiences
              </Text>
            </View>
          </View>
          
          <View style={styles.nextStepCard}>
            <View style={styles.stepIcon}>
              <Ionicons name="school" size={20} color={colors.white} />
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Earn More XP</Text>
              <Text style={styles.stepDescription}>
                Complete lessons and challenges to earn XP faster with your active booster
              </Text>
            </View>
          </View>
        </View>

        {/* Receipt Info */}
        <View style={styles.receiptInfo}>
          <Ionicons name="receipt-outline" size={16} color={colors.subtext} />
          <Text style={styles.receiptText}>
            A receipt has been sent to your email address
          </Text>
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.actions}>
        <TouchableOpacity 
          style={styles.secondaryButton}
          onPress={handleViewOrderHistory}
        >
          <Text style={styles.secondaryButtonText}>View Order History</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.primaryButton}
          onPress={handleContinueShopping}
        >
          <Text style={styles.primaryButtonText}>Continue Shopping</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  content: {
    paddingBottom: spacing(4),
  },
  
  // Success Header
  successHeader: {
    alignItems: 'center',
    padding: spacing(4),
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  successIcon: {
    marginBottom: spacing(2),
  },
  successTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: colors.text,
    marginBottom: spacing(1),
  },
  successSubtitle: {
    fontSize: 14,
    color: colors.subtext,
    textAlign: 'center',
  },
  
  // Sections
  orderDetails: {
    backgroundColor: colors.card,
    padding: spacing(3),
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  rewardsSection: {
    backgroundColor: colors.card,
    padding: spacing(3),
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  nextStepsSection: {
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
  
  // Order Info
  orderInfo: {
    backgroundColor: colors.bg,
    borderRadius: radii.lg,
    padding: spacing(2),
  },
  orderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing(1),
  },
  orderLabel: {
    fontSize: 14,
    color: colors.subtext,
  },
  orderValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  
  // Rewards
  rewardCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bg,
    borderRadius: radii.lg,
    padding: spacing(2.5),
    marginBottom: spacing(2),
  },
  rewardInfo: {
    flex: 1,
    marginLeft: spacing(2),
  },
  rewardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing(0.5),
  },
  rewardDescription: {
    fontSize: 12,
    color: colors.subtext,
  },
  rewardBalance: {
    alignItems: 'center',
  },
  balanceValue: {
    fontSize: 18,
    fontWeight: '900',
    color: colors.text,
  },
  balanceLabel: {
    fontSize: 10,
    color: colors.subtext,
    textTransform: 'uppercase',
    fontWeight: '700',
  },
  rewardBadge: {
    backgroundColor: colors.accent,
    borderRadius: radii.sm,
    paddingHorizontal: spacing(1.5),
    paddingVertical: spacing(0.5),
  },
  badgeText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: '800',
  },
  
  // Next Steps
  nextStepCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bg,
    borderRadius: radii.lg,
    padding: spacing(2.5),
    marginBottom: spacing(2),
  },
  stepIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepContent: {
    flex: 1,
    marginLeft: spacing(2),
  },
  stepTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing(0.5),
  },
  stepDescription: {
    fontSize: 12,
    color: colors.subtext,
    lineHeight: 16,
  },
  
  // Receipt
  receiptInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing(3),
    gap: spacing(1),
  },
  receiptText: {
    fontSize: 12,
    color: colors.subtext,
  },
  
  // Actions
  actions: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderTopWidth: 1,
    borderTopColor: colors.line,
    padding: spacing(3),
    gap: spacing(2),
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: colors.bg,
    borderRadius: radii.lg,
    paddingVertical: spacing(2),
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.line,
  },
  secondaryButtonText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '600',
  },
  primaryButton: {
    flex: 1,
    backgroundColor: colors.accent,
    borderRadius: radii.lg,
    paddingVertical: spacing(2),
    alignItems: 'center',
  },
  primaryButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '700',
  },
});