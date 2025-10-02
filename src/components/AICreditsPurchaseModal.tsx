import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radii, fonts } from '../theme/tokens';
import { useAICredits, CREDIT_PACKAGES, CreditPackage } from '../store/useAICredits';

interface AICreditsPurchaseModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function AICreditsPurchaseModal({
  visible,
  onClose
}: AICreditsPurchaseModalProps) {
  const { credits, purchaseCredits, getUsageStats } = useAICredits();
  const [purchasingPackage, setPurchasingPackage] = useState<string | null>(null);
  const stats = getUsageStats();

  const handlePurchase = async (package_: CreditPackage) => {
    setPurchasingPackage(package_.id);

    try {
      const success = await purchaseCredits(package_.id);

      if (success) {
        Alert.alert(
          'Purchase Successful! 🎉',
          `You've received ${package_.credits}${package_.bonus ? ` + ${package_.bonus} bonus` : ''} AI credits!`,
          [
            {
              text: 'Awesome!',
              onPress: onClose
            }
          ]
        );
      } else {
        Alert.alert(
          'Purchase Failed',
          'Unable to complete your purchase. Please try again.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      Alert.alert(
        'Purchase Error',
        'Something went wrong. Please check your payment method and try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setPurchasingPackage(null);
    }
  };

  const renderPackage = (package_: CreditPackage) => {
    const isUnlimited = package_.id === 'unlimited_monthly';
    const totalCredits = package_.credits + (package_.bonus || 0);
    const pricePerCredit = package_.credits > 0 ? (package_.price / package_.credits) : 0;
    const isPurchasing = purchasingPackage === package_.id;

    return (
      <TouchableOpacity
        key={package_.id}
        style={[
          styles.packageCard,
          package_.popular && styles.popularPackage,
          isPurchasing && styles.purchasingPackage
        ]}
        onPress={() => handlePurchase(package_)}
        disabled={isPurchasing}
      >
        {package_.popular && (
          <View style={styles.popularBadge}>
            <Text style={styles.popularBadgeText}>MOST POPULAR</Text>
          </View>
        )}

        <View style={styles.packageHeader}>
          <Text style={styles.packageName}>{package_.name}</Text>
          <Text style={styles.packagePrice}>${package_.price}</Text>
        </View>

        <View style={styles.packageDetails}>
          {isUnlimited ? (
            <View style={styles.packageCredits}>
              <Ionicons name="infinite" size={24} color={colors.accent} />
              <Text style={styles.creditsText}>Unlimited AI</Text>
              <Text style={styles.creditsSubtext}>For 30 days</Text>
            </View>
          ) : (
            <View style={styles.packageCredits}>
              <Text style={styles.creditsAmount}>{package_.credits.toLocaleString()}</Text>
              <Text style={styles.creditsText}>AI Credits</Text>
              {package_.bonus && (
                <Text style={styles.bonusText}>+{package_.bonus} bonus!</Text>
              )}
            </View>
          )}

          {!isUnlimited && (
            <Text style={styles.pricePerCredit}>
              ${pricePerCredit.toFixed(3)} per credit
            </Text>
          )}
        </View>

        <View style={styles.packageFeatures}>
          <View style={styles.feature}>
            <Ionicons name="checkmark-circle" size={16} color={colors.success} />
            <Text style={styles.featureText}>
              {isUnlimited ? 'Unlimited recipe generation' : `${Math.floor(package_.credits / 3)} recipe generations`}
            </Text>
          </View>
          <View style={styles.feature}>
            <Ionicons name="checkmark-circle" size={16} color={colors.success} />
            <Text style={styles.featureText}>
              {isUnlimited ? 'Unlimited recommendations' : `${Math.floor(package_.credits / 2)} AI recommendations`}
            </Text>
          </View>
          <View style={styles.feature}>
            <Ionicons name="checkmark-circle" size={16} color={colors.success} />
            <Text style={styles.featureText}>
              {isUnlimited ? 'Unlimited image analysis' : `${Math.floor(package_.credits / 5)} image analyses`}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={[
            styles.purchaseButton,
            package_.popular && styles.popularButton,
            isPurchasing && styles.purchasingButton
          ]}
          onPress={() => handlePurchase(package_)}
          disabled={isPurchasing}
        >
          {isPurchasing ? (
            <ActivityIndicator size="small" color={colors.white} />
          ) : (
            <>
              <Ionicons name="card" size={20} color={colors.white} />
              <Text style={styles.purchaseButtonText}>
                {isUnlimited ? 'Subscribe' : 'Purchase'}
              </Text>
            </>
          )}
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color={colors.text} />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Ionicons name="sparkles" size={20} color={colors.accent} />
            <Text style={styles.headerTitle}>AI Credits</Text>
          </View>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Current Credits */}
          <View style={styles.currentCreditsSection}>
            <View style={styles.creditsDisplay}>
              <View style={styles.creditsIcon}>
                <Ionicons name="diamond" size={24} color={colors.accent} />
              </View>
              <View>
                <Text style={styles.currentCreditsAmount}>{credits}</Text>
                <Text style={styles.currentCreditsLabel}>Credits Available</Text>
              </View>
            </View>

            <View style={styles.usageStats}>
              <Text style={styles.usageStatsTitle}>Your Usage</Text>
              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{stats.today}</Text>
                  <Text style={styles.statLabel}>Today</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{stats.thisMonth}</Text>
                  <Text style={styles.statLabel}>This Month</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{Math.round(stats.averageDaily)}</Text>
                  <Text style={styles.statLabel}>Daily Avg</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Info Section */}
          <View style={styles.infoSection}>
            <Text style={styles.infoTitle}>How AI Credits Work</Text>
            <View style={styles.infoItem}>
              <Ionicons name="create" size={16} color={colors.accent} />
              <Text style={styles.infoText}>Recipe Generation: 3 credits</Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="bulb" size={16} color={colors.accent} />
              <Text style={styles.infoText}>AI Recommendations: 2 credits</Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="camera" size={16} color={colors.accent} />
              <Text style={styles.infoText}>Image Analysis: 5 credits</Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="gift" size={16} color={colors.success} />
              <Text style={styles.infoText}>Get 5 free credits daily!</Text>
            </View>
          </View>

          {/* Credit Packages */}
          <Text style={styles.sectionTitle}>Choose Your Plan</Text>
          <View style={styles.packagesContainer}>
            {CREDIT_PACKAGES.map(renderPackage)}
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              • Secure payment processing{'\n'}
              • Credits never expire{'\n'}
              • Cancel unlimited plan anytime
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
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
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing(1),
  },
  headerTitle: {
    fontSize: fonts.h3,
    fontWeight: '700',
    color: colors.text,
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing(3),
  },
  currentCreditsSection: {
    paddingVertical: spacing(3),
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  creditsDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing(3),
  },
  creditsIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.accent + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing(2),
  },
  currentCreditsAmount: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
  },
  currentCreditsLabel: {
    fontSize: 14,
    color: colors.subtext,
    fontWeight: '500',
  },
  usageStats: {
    backgroundColor: colors.card,
    borderRadius: radii.md,
    padding: spacing(2.5),
  },
  usageStatsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing(2),
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.accent,
  },
  statLabel: {
    fontSize: 12,
    color: colors.subtext,
    marginTop: 2,
  },
  infoSection: {
    paddingVertical: spacing(3),
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing(2),
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing(1.5),
    gap: spacing(1.5),
  },
  infoText: {
    fontSize: 14,
    color: colors.subtext,
    flex: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginTop: spacing(3),
    marginBottom: spacing(2),
  },
  packagesContainer: {
    gap: spacing(2),
  },
  packageCard: {
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    padding: spacing(3),
    borderWidth: 2,
    borderColor: 'transparent',
    position: 'relative',
  },
  popularPackage: {
    borderColor: colors.accent,
    backgroundColor: colors.accent + '05',
  },
  purchasingPackage: {
    opacity: 0.7,
  },
  popularBadge: {
    position: 'absolute',
    top: -8,
    right: spacing(3),
    backgroundColor: colors.accent,
    paddingHorizontal: spacing(2),
    paddingVertical: spacing(0.5),
    borderRadius: radii.sm,
  },
  popularBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.white,
  },
  packageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing(2),
  },
  packageName: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  packagePrice: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.accent,
  },
  packageDetails: {
    alignItems: 'center',
    marginBottom: spacing(3),
  },
  packageCredits: {
    alignItems: 'center',
    marginBottom: spacing(1),
  },
  creditsAmount: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.text,
  },
  creditsText: {
    fontSize: 14,
    color: colors.subtext,
    fontWeight: '500',
  },
  creditsSubtext: {
    fontSize: 12,
    color: colors.muted,
    fontStyle: 'italic',
  },
  bonusText: {
    fontSize: 12,
    color: colors.success,
    fontWeight: '600',
    marginTop: 2,
  },
  pricePerCredit: {
    fontSize: 12,
    color: colors.muted,
  },
  packageFeatures: {
    gap: spacing(1),
    marginBottom: spacing(3),
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing(1),
  },
  featureText: {
    fontSize: 13,
    color: colors.subtext,
    flex: 1,
  },
  purchaseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.text,
    paddingVertical: spacing(2.5),
    borderRadius: radii.md,
    gap: spacing(1),
  },
  popularButton: {
    backgroundColor: colors.accent,
  },
  purchasingButton: {
    backgroundColor: colors.muted,
  },
  purchaseButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
  },
  footer: {
    paddingVertical: spacing(4),
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: colors.muted,
    textAlign: 'center',
    lineHeight: 16,
  },
});