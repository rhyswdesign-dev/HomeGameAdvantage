/**
 * VAULT HOME SCREEN - XP + KEYS ECONOMY
 * Month view with countdown timer, tabs, global stats, and item grid
 * Economy: XP earned only, Keys purchasable, XP-as-discount options
 */

import React, { useLayoutEffect, useState, useEffect } from 'react';
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
import { VaultItem } from '../../types/vault';
import { useVault } from '../../contexts/VaultContext';
import { currentVaultCycle, getVaultCountdown } from '../../data/vaultData';
import VaultUnlockModal from './components/VaultUnlockModal';
import VaultItemCard from './components/VaultItemCard';

export default function VaultScreen() {
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { state, dispatch, addToCart } = useVault();
  const [selectedTab, setSelectedTab] = useState<string>('common');
  const [countdown, setCountdown] = useState(getVaultCountdown());

  // Update countdown every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(getVaultCountdown());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);
  
  useLayoutEffect(() => {
    nav.setOptions({
      title: 'Vault',
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
        <View style={styles.headerActions}>
          <Pressable 
            hitSlop={12} 
            onPress={() => nav.navigate('VaultOrderHistory' as never)}
          >
            <Ionicons name="receipt-outline" size={24} color={colors.text} />
          </Pressable>
        </View>
      ),
    });
  }, [nav]);

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
      case 'mystery': return 'help';
      default: return 'diamond-outline';
    }
  };

  const getFilteredItems = (): VaultItem[] => {
    const items = state.vaultItems.filter(item => item.isActive);
    
    switch (selectedTab) {
      case 'common':
        return items.filter(item => item.rarity === 'common');
      case 'limited':
        return items.filter(item => item.rarity === 'limited');
      case 'rare':
        return items.filter(item => item.rarity === 'rare' || item.rarity === 'prestige');
      case 'mystery':
        return items.filter(item => item.type === 'mystery');
      default:
        return items;
    }
  };

  const getItemsCount = (tab: string): number => {
    const items = state.vaultItems.filter(item => item.isActive);
    switch (tab) {
      case 'common':
        return items.filter(item => item.rarity === 'common').length;
      case 'limited':
        return items.filter(item => item.rarity === 'limited').length;
      case 'rare':
        return items.filter(item => item.rarity === 'rare' || item.rarity === 'prestige').length;
      case 'mystery':
        return items.filter(item => item.type === 'mystery').length;
      default:
        return items.length;
    }
  };

  const tabs = [
    { key: 'common', label: 'Common', icon: 'diamond-outline', description: '500-1,000 XP + 1 Key' },
    { key: 'limited', label: 'Limited', icon: 'diamond', description: '2,500-5,000 XP + 2 Keys' },
    { key: 'rare', label: 'Rare/Prestige', icon: 'trophy', description: '10,000+ XP + 3-4 Keys' },
    { key: 'mystery', label: 'Mystery', icon: 'help', description: 'Variable XP + Keys' },
  ];

  const handleEarnXP = () => {
    nav.navigate('VaultEarnXP' as never);
  };

  const handleGetKeys = () => {
    nav.navigate('VaultStore' as never);
  };

  return (
    <View style={styles.container}>
      {/* Month Header with Countdown */}
      <View style={styles.monthHeader}>
        <View style={styles.monthInfo}>
          <Text style={styles.monthName}>{currentVaultCycle.name}</Text>
          <Text style={styles.countdownText}>
            Resets in {countdown.days}D:{countdown.hours.toString().padStart(2, '0')}H:{countdown.minutes.toString().padStart(2, '0')}M
          </Text>
        </View>
        <View style={styles.headerActions}>
          {/* XP Balance */}
          <View style={styles.headerStatCard}>
            <MaterialCommunityIcons name="star" size={18} color={colors.gold} />
            <View style={styles.headerStatInfo}>
              <Text style={styles.headerStatValue}>{state.userProfile.xpBalance.toLocaleString()}</Text>
              <Text style={styles.headerStatLabel}>XP</Text>
            </View>
          </View>
          
          {/* Keys Balance */}
          <View style={styles.headerStatCard}>
            <MaterialCommunityIcons name="key" size={18} color={colors.accent} />
            <View style={styles.headerStatInfo}>
              <Text style={styles.headerStatValue}>{state.userProfile.keysBalance}</Text>
              <Text style={styles.headerStatLabel}>Keys</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Global Stats Bar */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.statsBarContainer}
        contentContainerStyle={styles.statsBar}
      >
        {/* Action Buttons */}
        <TouchableOpacity style={styles.actionButton} onPress={handleGetKeys}>
          <Text style={styles.actionButtonText}>Get Keys</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.actionButton, styles.earnButton]} onPress={handleEarnXP}>
          <Text style={[styles.actionButtonText, styles.earnButtonText]}>Earn XP</Text>
        </TouchableOpacity>
        
      </ScrollView>

      {/* Tier Tabs */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        style={styles.tabsContainer}
        contentContainerStyle={styles.tabsContent}
      >
        {tabs.map((tab) => {
          const isActive = selectedTab === tab.key;
          const count = getItemsCount(tab.key);
          
          return (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tabChip, isActive && styles.activeTabChip]}
              onPress={() => setSelectedTab(tab.key)}
              activeOpacity={0.8}
            >
              <View style={styles.tabHeader}>
                <Ionicons 
                  name={tab.icon as any} 
                  size={16} 
                  color={isActive ? colors.white : colors.text} 
                />
                <Text style={[
                  styles.tabLabel,
                  isActive && styles.activeTabLabel
                ]}>
                  {tab.label}
                </Text>
                <View style={[styles.countBadge, isActive && styles.activeCountBadge]}>
                  <Text style={[styles.countText, isActive && styles.activeCountText]}>
                    {count}
                  </Text>
                </View>
              </View>
              <Text style={[
                styles.tabDescription,
                isActive && styles.activeTabDescription
              ]}>
                {tab.description}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Item Grid */}
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.itemsGrid}>
          {getFilteredItems().map((item) => (
            <VaultItemCard
              key={item.id}
              item={item}
              userProfile={state.userProfile}
              onPress={() => {
                dispatch({ type: 'SET_SELECTED_ITEM', payload: item });
                dispatch({ type: 'SHOW_UNLOCK_MODAL', payload: true });
              }}
            />
          ))}
        </View>

        {getFilteredItems().length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="cube-outline" size={80} color={colors.subtext} />
            <Text style={styles.emptyTitle}>No Items Available</Text>
            <Text style={styles.emptySubtitle}>
              Check back when the next cycle begins
            </Text>
          </View>
        )}

        {/* Mystery Explanation */}
        {selectedTab === 'mystery' && getFilteredItems().length > 0 && (
          <View style={styles.explanationBox}>
            <View style={styles.explanationHeader}>
              <Ionicons name="help-circle" size={20} color={colors.accent} />
              <Text style={styles.explanationTitle}>Mystery Drops</Text>
            </View>
            <Text style={styles.explanationText}>
              Mystery items contain randomized rewards from our premium collection. 
              Each unlock is a surprise with varying rarity and value!
            </Text>
          </View>
        )}

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Unlock Modal */}
      <VaultUnlockModal
        visible={state.showUnlockModal}
        item={state.selectedItem}
        userProfile={state.userProfile}
        onClose={() => {
          dispatch({ type: 'SHOW_UNLOCK_MODAL', payload: false });
          dispatch({ type: 'SET_SELECTED_ITEM', payload: null });
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing(1),
  },
  headerStatCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bg,
    borderRadius: radii.md,
    paddingHorizontal: spacing(2),
    paddingVertical: spacing(1.5),
    gap: spacing(1),
  },
  headerStatInfo: {
    alignItems: 'center',
  },
  headerStatValue: {
    fontSize: 16,
    fontWeight: '900',
    color: colors.text,
  },
  headerStatLabel: {
    fontSize: 10,
    color: colors.subtext,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  
  // Month Header
  monthHeader: {
    backgroundColor: colors.card,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing(3),
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  monthInfo: {
    flex: 1,
  },
  monthName: {
    fontSize: 20,
    fontWeight: '900',
    color: colors.text,
    marginBottom: spacing(0.5),
  },
  countdownText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.accent,
  },
  statsChip: {
    backgroundColor: colors.bg,
    borderRadius: radii.lg,
    paddingHorizontal: spacing(2),
    paddingVertical: spacing(1),
  },
  statsText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.subtext,
  },
  
  // Global Stats Bar
  statsBarContainer: {
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  statsBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing(2),
    gap: spacing(2),
    minWidth: '100%',
  },
  statCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bg,
    borderRadius: radii.md,
    paddingHorizontal: spacing(2),
    paddingVertical: spacing(1.5),
    gap: spacing(1),
  },
  statInfo: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '900',
    color: colors.text,
  },
  statLabel: {
    fontSize: 10,
    color: colors.subtext,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  actionButton: {
    backgroundColor: colors.accent,
    borderRadius: radii.md,
    paddingHorizontal: spacing(2),
    paddingVertical: spacing(1.25),
    alignItems: 'center',
    justifyContent: 'center',
  },
  earnButton: {
    backgroundColor: colors.gold,
  },
  actionButtonText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '700',
  },
  earnButtonText: {
    color: colors.white,
  },
  
  // Tier Tabs
  tabsContainer: {
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  tabsContent: {
    paddingHorizontal: spacing(2),
    paddingVertical: spacing(2),
    gap: spacing(1.5),
  },
  tabChip: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radii.md,
    paddingHorizontal: spacing(2),
    paddingVertical: spacing(1.25),
    alignSelf: 'flex-start',
  },
  activeTabChip: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  tabHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing(0.75),
    marginBottom: spacing(0.5),
  },
  tabLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    lineHeight: 16,
  },
  activeTabLabel: {
    color: colors.white,
  },
  countBadge: {
    backgroundColor: colors.bg,
    borderRadius: 10,
    paddingHorizontal: spacing(1),
    paddingVertical: spacing(0.5),
    minWidth: 24,
    alignItems: 'center',
  },
  activeCountBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  countText: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.text,
  },
  activeCountText: {
    color: colors.white,
  },
  tabDescription: {
    fontSize: 11,
    color: colors.subtext,
    lineHeight: 14,
  },
  activeTabDescription: {
    color: 'rgba(255,255,255,0.8)',
  },
  
  // Content
  scrollContent: {
    paddingBottom: spacing(4),
  },
  itemsGrid: {
    paddingHorizontal: spacing(2),
    paddingTop: spacing(2),
    gap: spacing(2),
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
  
  // Explanation Box
  explanationBox: {
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    margin: spacing(2),
    padding: spacing(3),
    borderWidth: 1,
    borderColor: colors.line,
  },
  explanationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing(1.5),
    marginBottom: spacing(1.5),
  },
  explanationTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  explanationText: {
    fontSize: 14,
    color: colors.subtext,
    lineHeight: 20,
  },
  
  bottomSpacer: {
    height: spacing(4),
  },
});