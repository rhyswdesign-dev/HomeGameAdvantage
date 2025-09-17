/**
 * VAULT HOME SCREEN - XP + KEYS ECONOMY
 * Clean layout matching app's current design patterns
 */

import React, { useLayoutEffect, useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  FlatList,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/RootNavigator';
import { colors, spacing, radii } from '../../theme/tokens';
import { VaultItem } from '../../types/vault';
import { useVault } from '../../contexts/VaultContext';
import { currentVaultCycle, getVaultCountdown } from '../../data/vaultData';
import PillButton from '../../components/PillButton';
import VaultUnlockModal from './components/VaultUnlockModal';
import VaultItemCard from './components/VaultItemCard';

const chips: Array<{ key: string; label: string }> = [
  { key: 'Home', label: 'Home' },
  { key: 'Spirits', label: 'Spirits' },
  { key: 'NonAlcoholic', label: 'Non-Alcoholic' },
  { key: 'Bars', label: 'Bars' },
  { key: 'Events', label: 'Events' },
  { key: 'Games', label: 'Games' },
  { key: 'Vault', label: 'Vault' },
];

export default function VaultScreen() {
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { state, dispatch } = useVault();
  const [selectedTab, setSelectedTab] = useState<string>('common');
  const [countdown, setCountdown] = useState(getVaultCountdown());
  const [activeChip, setActiveChip] = useState<string>('Vault');

  // Update countdown every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(getVaultCountdown());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const goto = (key: string) => {
    setActiveChip(key);
    try {
      if (key === 'Home') {
        nav.navigate('Main', { screen: 'Featured' });
      } else if (key === 'NonAlcoholic') {
        nav.navigate('NonAlcoholic' as never);
      } else if (key === 'Vault') {
        // Already on vault screen, do nothing
        return;
      } else if (key) {
        nav.navigate(key as never);
      }
    } catch {}
  };
  
  useLayoutEffect(() => {
    nav.setOptions({
      title: 'Vault',
      headerStyle: { backgroundColor: colors.bg },
      headerTintColor: colors.text,
      headerTitleStyle: { color: colors.text, fontWeight: '900' },
      headerShadowVisible: false,
      headerLeft: () => null,
      headerRight: () => (
        <Pressable 
          hitSlop={12} 
          onPress={() => nav.navigate('VaultOrderHistory')}
        >
          <Ionicons name="receipt-outline" size={24} color={colors.text} />
        </Pressable>
      ),
    });
  }, [nav]);

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

  const tabs = [
    { key: 'common', label: 'Common' },
    { key: 'limited', label: 'Limited' },
    { key: 'rare', label: 'Rare' },
    { key: 'mystery', label: 'Mystery' },
  ];

  const renderVaultItem = ({ item }: { item: VaultItem }) => (
    <VaultItemCard
      item={item}
      userProfile={state.userProfile}
      onPress={() => {
        dispatch({ type: 'SET_SELECTED_ITEM', payload: item });
        dispatch({ type: 'SHOW_UNLOCK_MODAL', payload: true });
      }}
    />
  );

  const renderHeader = () => (
    <View>
      {/* Collection Header */}
      <View style={styles.collectionHeader}>
        <View style={styles.collectionInfo}>
          <Text style={styles.collectionTitle}>{currentVaultCycle.name}</Text>
          <Text style={styles.collectionSubtitle}>
            Resets in {countdown.days}D {countdown.hours}H {countdown.minutes}M
          </Text>
        </View>
        
        {/* Quick Stats */}
        <View style={styles.quickStats}>
          <View style={styles.statCard}>
            <MaterialCommunityIcons name="star" size={16} color={colors.gold} />
            <Text style={styles.statValue}>{state.userProfile.xpBalance.toLocaleString()}</Text>
            <Text style={styles.statLabel}>XP</Text>
          </View>
          
          <View style={styles.statCard}>
            <MaterialCommunityIcons name="key" size={16} color={colors.accent} />
            <Text style={styles.statValue}>{state.userProfile.keysBalance}</Text>
            <Text style={styles.statLabel}>Keys</Text>
          </View>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionsContainer}>
        <View style={styles.actionsWrapper}>
          <TouchableOpacity 
            style={styles.primaryAction}
            onPress={() => nav.navigate('VaultEarnXP')}
          >
            <MaterialCommunityIcons name="star-plus" size={18} color={colors.white} />
            <Text style={styles.primaryActionText}>Earn XP</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.secondaryAction}
            onPress={() => nav.navigate('VaultStore')}
          >
            <MaterialCommunityIcons name="key-plus" size={18} color={colors.accent} />
            <Text style={styles.secondaryActionText}>Get Keys</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Filter Tabs */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.tabsScrollView}
        contentContainerStyle={styles.tabsContainer}
      >
        {tabs.map((tab) => {
          const isActive = selectedTab === tab.key;
          return (
            <PillButton
              key={tab.key}
              title={tab.label}
              onPress={() => setSelectedTab(tab.key)}
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
      <Ionicons name="cube-outline" size={80} color={colors.subtext} />
      <Text style={styles.emptyTitle}>No Items Available</Text>
      <Text style={styles.emptySubtitle}>
        Check back when the next cycle begins
      </Text>
    </View>
  );

  const filteredItems = getFilteredItems();

  return (
    <View style={styles.container}>
      {/* Top Navigation Chips */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        style={{ paddingTop: spacing(2), paddingBottom: spacing(1) }} 
        contentContainerStyle={{ flexDirection: 'row', paddingHorizontal: spacing(2), gap: spacing(1) }}
      >
        {chips.map(c => {
          const isActive = activeChip === c.key;
          return (
            <PillButton
              key={c.key}
              title={c.label}
              onPress={() => goto(c.key)}
              style={!isActive ? { backgroundColor: 'transparent', borderWidth: 1, borderColor: colors.line } : undefined}
              textStyle={!isActive ? { color: colors.text } : undefined}
            />
          );
        })}
      </ScrollView>

      <FlatList
        data={filteredItems}
        renderItem={renderVaultItem}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyState}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        numColumns={1}
        ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
      />

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
  
  listContent: {
    flexGrow: 1,
    paddingBottom: spacing(4),
  },
  
  // Collection Header
  collectionHeader: {
    backgroundColor: colors.card,
    padding: spacing(1.5),
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  
  collectionInfo: {
    marginBottom: spacing(1.5),
  },
  
  collectionTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: colors.text,
    marginBottom: spacing(0.5),
  },
  
  collectionSubtitle: {
    fontSize: 14,
    color: colors.accent,
    fontWeight: '600',
  },
  
  quickStats: {
    flexDirection: 'row',
    gap: spacing(2),
  },
  
  statCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bg,
    borderRadius: radii.lg,
    padding: spacing(1),
    gap: spacing(1),
  },
  
  statValue: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
    flex: 1,
  },
  
  statLabel: {
    fontSize: 11,
    color: colors.subtext,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  
  // Actions
  actionsContainer: {
    alignItems: 'center',
    padding: spacing(1.5),
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  
  actionsWrapper: {
    flexDirection: 'row',
    gap: spacing(2),
    alignItems: 'center',
  },
  
  primaryAction: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accent,
    borderRadius: radii.md,
    paddingVertical: spacing(1.5),
    paddingHorizontal: spacing(3),
    gap: spacing(1),
  },
  
  primaryActionText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '700',
  },
  
  secondaryAction: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.accent,
    borderRadius: radii.md,
    paddingVertical: spacing(1.5),
    paddingHorizontal: spacing(3),
    gap: spacing(1),
  },
  
  secondaryActionText: {
    color: colors.accent,
    fontSize: 14,
    fontWeight: '700',
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
  
  // List
  itemSeparator: {
    height: spacing(2),
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