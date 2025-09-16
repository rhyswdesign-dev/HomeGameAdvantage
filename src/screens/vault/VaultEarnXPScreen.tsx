/**
 * VAULT EARN XP SCREEN
 * Shows available actions to earn XP with expected rewards
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
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/RootNavigator';
import { colors, spacing, radii } from '../../theme/tokens';
import { useVault } from '../../contexts/VaultContext';

interface XPAction {
  id: string;
  title: string;
  description: string;
  expectedXP: number;
  icon: string;
  color: string;
  estimatedTime: string;
  navigationTarget?: keyof RootStackParamList;
}

export default function VaultEarnXPScreen() {
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { state } = useVault();
  
  const xpActions: XPAction[] = [
    {
      id: 'lesson',
      title: 'Complete a Lesson',
      description: 'Learn cocktail techniques and recipes',
      expectedXP: 50,
      icon: 'school',
      color: colors.accent,
      estimatedTime: '5-10 min',
      navigationTarget: 'Main', // Navigate to lessons tab
    },
    {
      id: 'daily_streak',
      title: 'Daily Login Streak',
      description: 'Keep your learning streak alive',
      expectedXP: 100,
      icon: 'calendar',
      color: '#FF6B6B',
      estimatedTime: 'Daily',
    },
    {
      id: 'brand_video',
      title: 'Watch Brand Video',
      description: 'Learn from premium spirits brands',
      expectedXP: 50,
      icon: 'play-circle',
      color: '#9C27B0',
      estimatedTime: '3-5 min',
      navigationTarget: 'Spirits',
    },
    {
      id: 'small_challenge',
      title: 'Complete Small Challenge',
      description: 'Quick skill challenges and competitions',
      expectedXP: 250,
      icon: 'trophy',
      color: colors.gold,
      estimatedTime: '10-15 min',
      navigationTarget: 'Events',
    },
    {
      id: 'win_event',
      title: 'Win Competition Event',
      description: 'Participate in major competitions',
      expectedXP: 1000,
      icon: 'medal',
      color: '#4CAF50',
      estimatedTime: '30-60 min',
      navigationTarget: 'Events',
    },
  ];
  
  useLayoutEffect(() => {
    nav.setOptions({
      title: 'Earn XP',
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

  const handleActionPress = (action: XPAction) => {
    if (action.navigationTarget) {
      nav.navigate(action.navigationTarget);
    }
  };

  const getMultipliedXP = (baseXP: number): number => {
    if (state.userProfile.activeBooster?.type === 'xp_multiplier') {
      const multiplier = state.userProfile.activeBooster.multiplier || 1;
      return Math.floor(baseXP * multiplier);
    }
    return baseXP;
  };

  const hasActiveBooster = state.userProfile.activeBooster?.type === 'xp_multiplier';
  const boosterMultiplier = state.userProfile.activeBooster?.multiplier || 1;

  return (
    <View style={styles.container}>
      {/* Current XP Header */}
      <View style={styles.xpHeader}>
        <View style={styles.xpCard}>
          <MaterialCommunityIcons name="star" size={32} color={colors.gold} />
          <View style={styles.xpInfo}>
            <Text style={styles.currentXpLabel}>Current XP</Text>
            <Text style={styles.currentXpValue}>
              {state.userProfile.xpBalance.toLocaleString()}
            </Text>
          </View>
        </View>
        
        {hasActiveBooster && (
          <View style={styles.boosterCard}>
            <MaterialCommunityIcons name="flash" size={20} color={colors.gold} />
            <Text style={styles.boosterText}>
              {boosterMultiplier}x XP Active
            </Text>
          </View>
        )}
      </View>

      {/* XP Actions List */}
      <ScrollView style={styles.actionsList}>
        <Text style={styles.sectionTitle}>Ways to Earn XP</Text>
        
        {xpActions.map((action) => {
          const finalXP = getMultipliedXP(action.expectedXP);
          const showBooster = hasActiveBooster && finalXP > action.expectedXP;
          
          return (
            <TouchableOpacity
              key={action.id}
              style={styles.actionCard}
              onPress={() => handleActionPress(action)}
              activeOpacity={0.8}
            >
              <View style={styles.actionHeader}>
                <View style={[styles.actionIcon, { backgroundColor: action.color }]}>
                  <Ionicons name={action.icon as any} size={24} color={colors.white} />
                </View>
                
                <View style={styles.actionInfo}>
                  <Text style={styles.actionTitle}>{action.title}</Text>
                  <Text style={styles.actionDescription}>{action.description}</Text>
                  <Text style={styles.actionTime}>{action.estimatedTime}</Text>
                </View>
                
                <View style={styles.xpReward}>
                  {showBooster && (
                    <Text style={styles.originalXP}>
                      {action.expectedXP} XP
                    </Text>
                  )}
                  <Text style={[styles.rewardXP, showBooster && styles.boostedXP]}>
                    +{finalXP} XP
                  </Text>
                  {showBooster && (
                    <View style={styles.boosterBadge}>
                      <MaterialCommunityIcons name="flash" size={12} color={colors.gold} />
                    </View>
                  )}
                </View>
              </View>
              
              <View style={styles.actionArrow}>
                <Ionicons name="chevron-forward" size={20} color={colors.subtext} />
              </View>
            </TouchableOpacity>
          );
        })}
        
        {/* Booster Upsell */}
        {!hasActiveBooster && (
          <TouchableOpacity 
            style={styles.boosterUpsell}
            onPress={() => nav.navigate('VaultStore' as never)}
          >
            <View style={styles.upsellContent}>
              <MaterialCommunityIcons name="flash" size={24} color={colors.gold} />
              <View style={styles.upsellText}>
                <Text style={styles.upsellTitle}>Get XP Boosters</Text>
                <Text style={styles.upsellDescription}>
                  Multiply your XP earnings with boosters from the Keys Store
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.subtext} />
          </TouchableOpacity>
        )}
        
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  
  // XP Header
  xpHeader: {
    backgroundColor: colors.card,
    padding: spacing(3),
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing(2),
  },
  xpCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bg,
    borderRadius: radii.lg,
    padding: spacing(2),
    gap: spacing(2),
  },
  xpInfo: {
    flex: 1,
  },
  currentXpLabel: {
    fontSize: 12,
    color: colors.subtext,
    fontWeight: '600',
  },
  currentXpValue: {
    fontSize: 24,
    fontWeight: '900',
    color: colors.text,
  },
  boosterCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.gold,
    borderRadius: radii.md,
    paddingHorizontal: spacing(2),
    paddingVertical: spacing(1),
    gap: spacing(1),
  },
  boosterText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '800',
  },
  
  // Actions List
  actionsList: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
    margin: spacing(3),
    marginBottom: spacing(2),
  },
  actionCard: {
    backgroundColor: colors.card,
    marginHorizontal: spacing(3),
    marginBottom: spacing(2),
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.line,
    overflow: 'hidden',
    position: 'relative',
  },
  actionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing(2.5),
    paddingRight: spacing(4.5),
    gap: spacing(2),
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionInfo: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing(0.5),
  },
  actionDescription: {
    fontSize: 13,
    color: colors.subtext,
    marginBottom: spacing(0.5),
  },
  actionTime: {
    fontSize: 11,
    color: colors.subtext,
    fontWeight: '600',
  },
  xpReward: {
    alignItems: 'flex-end',
    position: 'relative',
  },
  originalXP: {
    fontSize: 11,
    color: colors.subtext,
    textDecorationLine: 'line-through',
  },
  rewardXP: {
    fontSize: 18,
    fontWeight: '900',
    color: colors.gold,
  },
  boostedXP: {
    color: colors.gold,
  },
  boosterBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: colors.gold,
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionArrow: {
    position: 'absolute',
    right: spacing(2.5),
    top: '50%',
    marginTop: -10,
  },
  
  // Booster Upsell
  boosterUpsell: {
    backgroundColor: colors.card,
    marginHorizontal: spacing(3),
    marginBottom: spacing(2),
    borderRadius: radii.lg,
    borderWidth: 2,
    borderColor: colors.gold,
    borderStyle: 'dashed',
    padding: spacing(3),
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing(2),
  },
  upsellContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing(2),
  },
  upsellText: {
    flex: 1,
  },
  upsellTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing(0.5),
  },
  upsellDescription: {
    fontSize: 12,
    color: colors.subtext,
  },
  
  bottomSpacer: {
    height: spacing(4),
  },
});