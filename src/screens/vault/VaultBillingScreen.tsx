/**
 * VAULT BILLING SCREEN
 * Manage billing, receipts, and subscription management with Stripe portal integration
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
  Linking,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/RootNavigator';
import { colors, spacing, radii } from '../../theme/tokens';
import { useVault } from '../../contexts/VaultContext';

interface Receipt {
  id: string;
  date: string;
  description: string;
  amount: number;
  status: 'paid' | 'pending' | 'failed';
  downloadUrl?: string;
}

interface Subscription {
  id: string;
  name: string;
  status: 'active' | 'cancelled' | 'past_due';
  nextBillingDate: string;
  amount: number;
  interval: 'monthly' | 'yearly';
}

export default function VaultBillingScreen() {
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { state } = useVault();
  
  // Mock data - would come from backend/Stripe in real app
  const [receipts, setReceipts] = useState<Receipt[]>([
    {
      id: 'in_1234567890',
      date: '2024-01-15T14:30:00Z',
      description: 'Starter Key Pack + 24-Hour XP Booster',
      amount: 754,
      status: 'paid',
      downloadUrl: 'https://invoice.stripe.com/...'
    },
    {
      id: 'in_0987654321',
      date: '2024-01-10T09:15:00Z',
      description: '24-Hour XP Booster',
      amount: 199,
      status: 'paid',
      downloadUrl: 'https://invoice.stripe.com/...'
    },
    {
      id: 'in_1122334455',
      date: '2024-01-05T16:45:00Z',
      description: 'Premium Cocktail Kit',
      amount: 2999,
      status: 'paid',
      downloadUrl: 'https://invoice.stripe.com/...'
    }
  ]);

  const [subscriptions, setSubscriptions] = useState<Subscription[]>([
    {
      id: 'sub_premium_pass',
      name: 'Premium Pass',
      status: 'active',
      nextBillingDate: '2024-02-15T00:00:00Z',
      amount: 999,
      interval: 'monthly'
    }
  ]);
  
  useLayoutEffect(() => {
    nav.setOptions({
      title: 'Billing & Receipts',
      headerStyle: { backgroundColor: colors.bg },
      headerTintColor: colors.text,
      headerTitleStyle: { color: colors.text, fontWeight: '900' },
      headerShadowVisible: false,
      headerLeft: () => null,
    });
  }, [nav]);

  const getReceiptStatusColor = (status: Receipt['status']): string => {
    switch (status) {
      case 'paid': return colors.accent;
      case 'pending': return colors.gold;
      case 'failed': return colors.destructive;
      default: return colors.subtext;
    }
  };

  const getSubscriptionStatusColor = (status: Subscription['status']): string => {
    switch (status) {
      case 'active': return colors.accent;
      case 'past_due': return colors.gold;
      case 'cancelled': return colors.destructive;
      default: return colors.subtext;
    }
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleDownloadReceipt = async (receipt: Receipt) => {
    if (receipt.downloadUrl) {
      try {
        await Linking.openURL(receipt.downloadUrl);
      } catch (error) {
        Alert.alert('Error', 'Unable to open receipt. Please try again.');
      }
    } else {
      Alert.alert('Receipt', 'Receipt download will be available soon.');
    }
  };

  const handleManageSubscription = async (subscriptionId: string) => {
    Alert.alert(
      'Manage Subscription',
      'You will be redirected to Stripe Customer Portal to manage your subscription.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Continue', 
          onPress: async () => {
            try {
              // In a real app, this would call your backend to create a Stripe Portal session
              const portalUrl = `https://billing.stripe.com/session/portal_session_${subscriptionId}`;
              await Linking.openURL(portalUrl);
            } catch (error) {
              Alert.alert('Error', 'Unable to open billing portal. Please try again.');
            }
          }
        }
      ]
    );
  };

  const handleOpenStripePortal = async () => {
    Alert.alert(
      'Stripe Customer Portal',
      'Manage all your billing information, payment methods, and subscriptions in the secure Stripe Customer Portal.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Open Portal', 
          onPress: async () => {
            try {
              // In a real app, this would call your backend to create a portal session
              const portalUrl = 'https://billing.stripe.com/p/login/test_28o00A0uK9rr1a02QQ';
              await Linking.openURL(portalUrl);
            } catch (error) {
              Alert.alert('Error', 'Unable to open billing portal. Please try again.');
            }
          }
        }
      ]
    );
  };

  const totalSpent = receipts.reduce((sum, receipt) => sum + receipt.amount, 0);

  return (
    <View style={styles.container}>
      <ScrollView>
        {/* Billing Summary */}
        <View style={styles.summarySection}>
          <Text style={styles.sectionTitle}>Billing Summary</Text>
          
          <View style={styles.summaryCards}>
            <View style={styles.summaryCard}>
              <MaterialCommunityIcons name="currency-usd" size={24} color={colors.gold} />
              <View style={styles.summaryInfo}>
                <Text style={styles.summaryValue}>${(totalSpent / 100).toFixed(0)}</Text>
                <Text style={styles.summaryLabel}>Total Spent</Text>
              </View>
            </View>
            
            <View style={styles.summaryCard}>
              <MaterialCommunityIcons name="receipt" size={24} color={colors.accent} />
              <View style={styles.summaryInfo}>
                <Text style={styles.summaryValue}>{receipts.length}</Text>
                <Text style={styles.summaryLabel}>Receipts</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Subscriptions */}
        {subscriptions.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Active Subscriptions</Text>
            
            {subscriptions.map((subscription) => (
              <View key={subscription.id} style={styles.subscriptionCard}>
                <View style={styles.subscriptionHeader}>
                  <View style={styles.subscriptionInfo}>
                    <Text style={styles.subscriptionName}>{subscription.name}</Text>
                    <Text style={styles.subscriptionPrice}>
                      ${(subscription.amount / 100).toFixed(2)}/{subscription.interval}
                    </Text>
                  </View>
                  
                  <View style={[
                    styles.subscriptionStatusBadge,
                    { backgroundColor: getSubscriptionStatusColor(subscription.status) }
                  ]}>
                    <Text style={styles.statusBadgeText}>
                      {subscription.status.toUpperCase()}
                    </Text>
                  </View>
                </View>
                
                <Text style={styles.subscriptionNextBilling}>
                  Next billing: {formatDate(subscription.nextBillingDate)}
                </Text>
                
                <TouchableOpacity 
                  style={styles.manageButton}
                  onPress={() => handleManageSubscription(subscription.id)}
                >
                  <Text style={styles.manageButtonText}>Manage Subscription</Text>
                  <Ionicons name="external-link" size={16} color={colors.accent} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {/* Stripe Portal Access */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Billing Management</Text>
          
          <TouchableOpacity 
            style={styles.portalCard}
            onPress={handleOpenStripePortal}
          >
            <View style={styles.portalContent}>
              <MaterialCommunityIcons name="credit-card-settings" size={32} color={colors.accent} />
              <View style={styles.portalInfo}>
                <Text style={styles.portalTitle}>Stripe Customer Portal</Text>
                <Text style={styles.portalDescription}>
                  Manage payment methods, billing history, and subscription settings
                </Text>
              </View>
            </View>
            <Ionicons name="external-link" size={20} color={colors.subtext} />
          </TouchableOpacity>
        </View>

        {/* Recent Receipts */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Receipts</Text>
            <TouchableOpacity onPress={() => nav.navigate('VaultOrderHistory' as never)}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          
          {receipts.slice(0, 5).map((receipt) => (
            <View key={receipt.id} style={styles.receiptCard}>
              <View style={styles.receiptInfo}>
                <Text style={styles.receiptDescription}>{receipt.description}</Text>
                <Text style={styles.receiptDate}>{formatDate(receipt.date)}</Text>
                <View style={styles.receiptMeta}>
                  <Text style={styles.receiptAmount}>${(receipt.amount / 100).toFixed(2)}</Text>
                  <View style={[
                    styles.receiptStatusBadge,
                    { backgroundColor: getReceiptStatusColor(receipt.status) }
                  ]}>
                    <Text style={styles.statusBadgeText}>
                      {receipt.status.toUpperCase()}
                    </Text>
                  </View>
                </View>
              </View>
              
              <TouchableOpacity 
                style={styles.downloadButton}
                onPress={() => handleDownloadReceipt(receipt)}
              >
                <Ionicons name="download-outline" size={20} color={colors.accent} />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Billing Help */}
        <View style={styles.helpSection}>
          <Text style={styles.helpTitle}>Need Help?</Text>
          <Text style={styles.helpDescription}>
            Contact our support team for billing questions or refund requests.
          </Text>
          
          <TouchableOpacity 
            style={styles.helpButton}
            onPress={() => nav.navigate('HelpSupport' as never)}
          >
            <Ionicons name="help-circle-outline" size={20} color={colors.white} />
            <Text style={styles.helpButtonText}>Contact Support</Text>
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
  
  // Sections
  section: {
    backgroundColor: colors.card,
    padding: spacing(3),
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing(2),
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.accent,
  },
  
  // Summary
  summarySection: {
    backgroundColor: colors.card,
    padding: spacing(3),
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  summaryCards: {
    flexDirection: 'row',
    gap: spacing(2),
  },
  summaryCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bg,
    borderRadius: radii.lg,
    padding: spacing(2),
    gap: spacing(2),
  },
  summaryInfo: {
    flex: 1,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: '900',
    color: colors.text,
  },
  summaryLabel: {
    fontSize: 12,
    color: colors.subtext,
    marginTop: spacing(0.5),
  },
  
  // Subscriptions
  subscriptionCard: {
    backgroundColor: colors.bg,
    borderRadius: radii.lg,
    padding: spacing(3),
    marginBottom: spacing(2),
  },
  subscriptionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing(1),
  },
  subscriptionInfo: {
    flex: 1,
  },
  subscriptionName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing(0.5),
  },
  subscriptionPrice: {
    fontSize: 14,
    color: colors.subtext,
  },
  subscriptionStatusBadge: {
    borderRadius: radii.sm,
    paddingHorizontal: spacing(1.5),
    paddingVertical: spacing(0.5),
  },
  statusBadgeText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: '800',
  },
  subscriptionNextBilling: {
    fontSize: 12,
    color: colors.subtext,
    marginBottom: spacing(2),
  },
  manageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card,
    borderRadius: radii.md,
    paddingVertical: spacing(1.5),
    borderWidth: 1,
    borderColor: colors.line,
    gap: spacing(1),
  },
  manageButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.accent,
  },
  
  // Stripe Portal
  portalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bg,
    borderRadius: radii.lg,
    padding: spacing(3),
    borderWidth: 1,
    borderColor: colors.line,
  },
  portalContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  portalInfo: {
    marginLeft: spacing(2),
    flex: 1,
  },
  portalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing(0.5),
  },
  portalDescription: {
    fontSize: 12,
    color: colors.subtext,
    lineHeight: 16,
  },
  
  // Receipts
  receiptCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bg,
    borderRadius: radii.lg,
    padding: spacing(2.5),
    marginBottom: spacing(2),
  },
  receiptInfo: {
    flex: 1,
  },
  receiptDescription: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing(0.5),
  },
  receiptDate: {
    fontSize: 12,
    color: colors.subtext,
    marginBottom: spacing(1),
  },
  receiptMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing(2),
  },
  receiptAmount: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  receiptStatusBadge: {
    borderRadius: radii.sm,
    paddingHorizontal: spacing(1),
    paddingVertical: spacing(0.5),
  },
  downloadButton: {
    padding: spacing(1),
    marginLeft: spacing(2),
  },
  
  // Help Section
  helpSection: {
    backgroundColor: colors.card,
    padding: spacing(3),
    alignItems: 'center',
  },
  helpTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
    marginBottom: spacing(1),
  },
  helpDescription: {
    fontSize: 14,
    color: colors.subtext,
    textAlign: 'center',
    marginBottom: spacing(3),
  },
  helpButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.accent,
    borderRadius: radii.md,
    paddingHorizontal: spacing(3),
    paddingVertical: spacing(2),
    gap: spacing(1),
  },
  helpButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '700',
  },
});