/**
 * VAULT UNLOCK MODAL
 * Handles XP + Keys unlock transactions with XP-as-discount options
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing, radii } from '../../../theme/tokens';
import { VaultItem, UserVaultProfile } from '../../../types/vault';
import { useVault } from '../../../contexts/VaultContext';
import { canUserUnlockItem } from '../../../data/vaultData';

interface VaultUnlockModalProps {
  visible: boolean;
  item: VaultItem | null;
  userProfile: UserVaultProfile;
  onClose: () => void;
}

export default function VaultUnlockModal({ 
  visible, 
  item, 
  userProfile, 
  onClose 
}: VaultUnlockModalProps) {
  const { unlockVaultItem, state } = useVault();
  const [useDiscountOption, setUseDiscountOption] = useState(false);
  const [isUnlocking, setIsUnlocking] = useState(false);

  if (!item) return null;

  const { canUnlock, reason } = canUserUnlockItem(item, userProfile);
  
  const getUnlockCosts = () => {
    if (useDiscountOption && item.discountOption) {
      return {
        xp: item.discountOption.reducedXP,
        keys: item.keysCost,
        cash: item.discountOption.cashPrice
      };
    }
    return {
      xp: item.xpCost,
      keys: item.keysCost,
      cash: 0
    };
  };

  const costs = getUnlockCosts();
  
  const canAffordDiscountOption = () => {
    if (!item.discountOption) return false;
    return userProfile.xpBalance >= item.discountOption.reducedXP && 
           userProfile.keysBalance >= item.keysCost;
  };

  const handleUnlock = async () => {
    if (!canUnlock && !canAffordDiscountOption()) {
      Alert.alert('Cannot Unlock', reason || 'Insufficient resources');
      return;
    }

    setIsUnlocking(true);
    
    try {
      const success = await unlockVaultItem({
        userId: userProfile.userId,
        itemId: item.id,
        useDiscountOption,
      });

      if (success) {
        Alert.alert(
          '🎉 Unlocked!',
          `${item.name} has been unlocked! ${item.type === 'physical' ? 'We\'ll send you tracking information once it ships.' : ''}`,
          [{ text: 'Awesome!', onPress: onClose }]
        );
      } else {
        Alert.alert('Unlock Failed', 'Please try again or contact support.');
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setIsUnlocking(false);
    }
  };

  const getRarityColor = (rarity: VaultItem['rarity']): string => {
    switch (rarity) {
      case 'common': return colors.subtext;
      case 'limited': return colors.accent;
      case 'rare': return colors.gold;
      case 'prestige': return '#9C27B0';
      case 'mystery': return '#FF6B6B';
      default: return colors.subtext;
    }
  };

  const getRarityIcon = (rarity: VaultItem['rarity']): string => {
    switch (rarity) {
      case 'common': return 'diamond-outline';
      case 'limited': return 'diamond';
      case 'rare': return 'star';
      case 'prestige': return 'trophy';
      case 'mystery': return 'lock-open';
      default: return 'diamond-outline';
    }
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={[styles.rarityBadge, { backgroundColor: getRarityColor(item.rarity) }]}>
              <Ionicons 
                name={getRarityIcon(item.rarity) as any} 
                size={16} 
                color={colors.white} 
              />
              <Text style={styles.rarityText}>{item.rarity.toUpperCase()}</Text>
            </View>
          </View>
          
          <TouchableOpacity onPress={onClose} hitSlop={12}>
            <Ionicons name="close" size={28} color={colors.text} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          {/* Item Image */}
          <Image source={{ uri: item.image }} style={styles.itemImage} />
          
          {/* Item Info */}
          <View style={styles.itemInfo}>
            <Text style={styles.itemName}>{item.name}</Text>
            {item.estimatedValue && (
              <Text style={styles.estimatedValue}>{item.estimatedValue}</Text>
            )}
            <Text style={styles.itemDescription}>{item.description}</Text>
          </View>

          {/* Stock Info */}
          <View style={styles.stockInfo}>
            <View style={styles.stockRow}>
              <Ionicons name="cube" size={20} color={colors.accent} />
              <Text style={styles.stockText}>
                {item.currentStock} of {item.totalStock} remaining this cycle
              </Text>
            </View>
            {item.currentStock <= 10 && (
              <Text style={styles.urgencyText}>⚠️ Low stock - unlock soon!</Text>
            )}
          </View>

          {/* What's Included */}
          {item.contents && item.contents.length > 0 && (
            <View style={styles.contentsSection}>
              <Text style={styles.sectionTitle}>What's Included:</Text>
              {item.contents.map((content, index) => (
                <View key={index} style={styles.contentItem}>
                  <Ionicons name="checkmark-circle" size={16} color={colors.accent} />
                  <Text style={styles.contentText}>{content}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Mystery Drop Info */}
          {item.type === 'mystery' && (
            <View style={styles.mysteryInfo}>
              <View style={styles.mysteryHeader}>
                <Ionicons name="help-circle" size={20} color={colors.accent} />
                <Text style={styles.mysteryTitle}>Mystery Drop</Text>
              </View>
              <Text style={styles.mysteryDescription}>
                You'll receive one item from: {item.mysteryPool?.join(', ')}
              </Text>
              {userProfile.activeBooster?.type === 'mystery_luck' && (
                <View style={styles.boosterActive}>
                  <Ionicons name="trending-up" size={16} color={colors.gold} />
                  <Text style={styles.boosterText}>Mystery Luck Booster Active!</Text>
                </View>
              )}
            </View>
          )}

          {/* Pricing Options */}
          <View style={styles.pricingSection}>
            <Text style={styles.sectionTitle}>Unlock Options:</Text>
            
            {/* Standard Option */}
            <TouchableOpacity
              style={[
                styles.pricingOption,
                !useDiscountOption && styles.selectedOption
              ]}
              onPress={() => setUseDiscountOption(false)}
              activeOpacity={0.8}
            >
              <View style={styles.optionHeader}>
                <View style={styles.radioButton}>
                  {!useDiscountOption && <View style={styles.radioSelected} />}
                </View>
                <Text style={styles.optionTitle}>Standard Unlock</Text>
              </View>
              
              <View style={styles.costBreakdown}>
                <View style={styles.costItem}>
                  <MaterialCommunityIcons name="star" size={18} color={colors.gold} />
                  <Text style={[
                    styles.costText,
                    userProfile.xpBalance < item.xpCost && styles.insufficientText
                  ]}>
                    {item.xpCost.toLocaleString()} XP
                  </Text>
                </View>
                
                <View style={styles.costItem}>
                  <MaterialCommunityIcons name="key" size={18} color={colors.accent} />
                  <Text style={[
                    styles.costText,
                    userProfile.keysBalance < item.keysCost && styles.insufficientText
                  ]}>
                    {item.keysCost} Key{item.keysCost !== 1 ? 's' : ''}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>

            {/* Discount Option */}
            {item.discountOption && (
              <TouchableOpacity
                style={[
                  styles.pricingOption,
                  useDiscountOption && styles.selectedOption
                ]}
                onPress={() => setUseDiscountOption(true)}
                activeOpacity={0.8}
              >
                <View style={styles.optionHeader}>
                  <View style={styles.radioButton}>
                    {useDiscountOption && <View style={styles.radioSelected} />}
                  </View>
                  <Text style={styles.optionTitle}>XP Discount Option</Text>
                  <View style={styles.discountBadge}>
                    <Text style={styles.discountBadgeText}>SAVE XP</Text>
                  </View>
                </View>
                
                <View style={styles.costBreakdown}>
                  <View style={styles.costItem}>
                    <MaterialCommunityIcons name="star" size={18} color={colors.gold} />
                    <Text style={[
                      styles.costText,
                      userProfile.xpBalance < item.discountOption.reducedXP && styles.insufficientText
                    ]}>
                      {item.discountOption.reducedXP.toLocaleString()} XP
                    </Text>
                  </View>
                  
                  <View style={styles.costItem}>
                    <MaterialCommunityIcons name="key" size={18} color={colors.accent} />
                    <Text style={[
                      styles.costText,
                      userProfile.keysBalance < item.keysCost && styles.insufficientText
                    ]}>
                      {item.keysCost} Key{item.keysCost !== 1 ? 's' : ''}
                    </Text>
                  </View>
                  
                  <View style={styles.costItem}>
                    <Ionicons name="card" size={18} color={colors.text} />
                    <Text style={styles.costText}>
                      ${item.discountOption.cashPrice.toFixed(2)}
                    </Text>
                  </View>
                </View>
                
                <Text style={styles.savingsText}>
                  Save {(item.xpCost - item.discountOption.reducedXP).toLocaleString()} XP!
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Balance After Unlock */}
          <View style={styles.balancePreview}>
            <Text style={styles.sectionTitle}>After Unlock:</Text>
            
            <View style={styles.balanceRow}>
              <View style={styles.balanceItem}>
                <MaterialCommunityIcons name="star" size={16} color={colors.gold} />
                <Text style={styles.balanceLabel}>XP:</Text>
                <Text style={styles.balanceValue}>
                  {userProfile.xpBalance.toLocaleString()} → {(userProfile.xpBalance - costs.xp).toLocaleString()}
                </Text>
              </View>
              
              <View style={styles.balanceItem}>
                <MaterialCommunityIcons name="key" size={16} color={colors.accent} />
                <Text style={styles.balanceLabel}>Keys:</Text>
                <Text style={styles.balanceValue}>
                  {userProfile.keysBalance} → {userProfile.keysBalance - costs.keys}
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Bottom Action */}
        <View style={styles.bottomSection}>
          {!canUnlock && !canAffordDiscountOption() ? (
            <View style={styles.insufficientResources}>
              <Ionicons name="warning" size={20} color="#FF6B6B" />
              <Text style={styles.insufficientText}>{reason}</Text>
            </View>
          ) : (
            <TouchableOpacity
              style={[
                styles.unlockButton,
                isUnlocking && styles.unlockingButton
              ]}
              onPress={handleUnlock}
              disabled={isUnlocking}
              activeOpacity={0.8}
            >
              <MaterialCommunityIcons 
                name={isUnlocking ? "loading" : "lock-open"} 
                size={20} 
                color={colors.white} 
              />
              <Text style={styles.unlockButtonText}>
                {isUnlocking ? 'Unlocking...' : 'Unlock Item'}
              </Text>
            </TouchableOpacity>
          )}
          
          <Text style={styles.disclaimer}>
            {costs.cash > 0 && '💳 Payment will be processed securely\n'}
            🔒 XP and Keys will be deducted immediately
          </Text>
        </View>
      </View>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing(3),
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  headerLeft: {
    flex: 1,
  },
  rarityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing(1.5),
    paddingVertical: spacing(0.5),
    borderRadius: radii.sm,
    alignSelf: 'flex-start',
    gap: spacing(0.5),
  },
  rarityText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '800',
  },
  
  content: {
    flex: 1,
  },
  
  // Item Display
  itemImage: {
    width: '100%',
    height: 250,
    backgroundColor: colors.card,
  },
  itemInfo: {
    padding: spacing(3),
  },
  itemName: {
    fontSize: 24,
    fontWeight: '900',
    color: colors.text,
    marginBottom: spacing(1),
  },
  estimatedValue: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.gold,
    marginBottom: spacing(1),
  },
  itemDescription: {
    fontSize: 16,
    color: colors.subtext,
    lineHeight: 24,
  },
  
  // Stock Info
  stockInfo: {
    backgroundColor: colors.card,
    margin: spacing(3),
    marginTop: 0,
    padding: spacing(2.5),
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.line,
  },
  stockRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing(1.5),
    marginBottom: spacing(1),
  },
  stockText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  urgencyText: {
    fontSize: 13,
    color: '#FF6B6B',
    fontWeight: '700',
  },
  
  // Contents
  contentsSection: {
    margin: spacing(3),
    marginTop: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
    marginBottom: spacing(2),
  },
  contentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing(2),
    marginBottom: spacing(1.5),
  },
  contentText: {
    fontSize: 15,
    color: colors.text,
    flex: 1,
  },
  
  // Mystery Info
  mysteryInfo: {
    backgroundColor: colors.card,
    margin: spacing(3),
    marginTop: 0,
    padding: spacing(2.5),
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.line,
  },
  mysteryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing(1.5),
    marginBottom: spacing(1.5),
  },
  mysteryTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  mysteryDescription: {
    fontSize: 14,
    color: colors.subtext,
    lineHeight: 20,
    marginBottom: spacing(1.5),
  },
  boosterActive: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing(1),
    backgroundColor: colors.bg,
    padding: spacing(1.5),
    borderRadius: radii.md,
  },
  boosterText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.gold,
  },
  
  // Pricing Options
  pricingSection: {
    margin: spacing(3),
    marginTop: 0,
  },
  pricingOption: {
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    borderWidth: 2,
    borderColor: colors.line,
    padding: spacing(3),
    marginBottom: spacing(2),
  },
  selectedOption: {
    borderColor: colors.accent,
  },
  optionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing(2),
    marginBottom: spacing(2),
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.accent,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    flex: 1,
  },
  discountBadge: {
    backgroundColor: colors.gold,
    paddingHorizontal: spacing(1),
    paddingVertical: spacing(0.25),
    borderRadius: radii.sm,
  },
  discountBadgeText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: '800',
  },
  costBreakdown: {
    gap: spacing(2),
  },
  costItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing(1.5),
  },
  costText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  insufficientText: {
    color: '#FF6B6B',
  },
  savingsText: {
    fontSize: 13,
    color: colors.gold,
    fontWeight: '700',
    marginTop: spacing(1),
    textAlign: 'center',
  },
  
  // Balance Preview
  balancePreview: {
    margin: spacing(3),
    marginTop: 0,
  },
  balanceRow: {
    gap: spacing(2),
  },
  balanceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing(1),
    marginBottom: spacing(1),
  },
  balanceLabel: {
    fontSize: 14,
    color: colors.subtext,
    fontWeight: '600',
  },
  balanceValue: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '700',
  },
  
  // Bottom Section
  bottomSection: {
    padding: spacing(3),
    borderTopWidth: 1,
    borderTopColor: colors.line,
    backgroundColor: colors.bg,
  },
  insufficientResources: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing(2),
    marginBottom: spacing(2),
  },
  unlockButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accent,
    borderRadius: radii.md,
    paddingVertical: spacing(2.5),
    gap: spacing(2),
    marginBottom: spacing(2),
  },
  unlockingButton: {
    backgroundColor: colors.subtext,
  },
  unlockButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.white,
  },
  disclaimer: {
    fontSize: 12,
    color: colors.subtext,
    textAlign: 'center',
    lineHeight: 18,
  },
});