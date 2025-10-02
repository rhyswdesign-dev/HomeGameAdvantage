import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radii, fonts } from '../theme/tokens';
import { useAICredits } from '../store/useAICredits';

interface AICreditsStatusProps {
  onPress: () => void;
  style?: any;
}

export default function AICreditsStatus({ onPress, style }: AICreditsStatusProps) {
  const { credits, dailyUsage, dailyLimit, isPremium } = useAICredits();

  // Determine status color based on credit levels
  const getStatusColor = () => {
    if (isPremium) return colors.success;
    if (credits <= 5) return colors.error;
    if (credits <= 15) return colors.warning || '#f59e0b';
    return colors.success;
  };

  const getStatusText = () => {
    if (isPremium) return 'Premium';
    if (credits <= 5) return 'Low Credits';
    return 'Good';
  };

  const statusColor = getStatusColor();

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        <View style={styles.leftSection}>
          <View style={[styles.icon, { backgroundColor: statusColor + '20' }]}>
            <Ionicons
              name={isPremium ? "diamond" : "sparkles"}
              size={16}
              color={statusColor}
            />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.credits}>
              {isPremium ? '∞' : credits} {!isPremium && 'credits'}
            </Text>
            <Text style={[styles.status, { color: statusColor }]}>
              {getStatusText()}
            </Text>
          </View>
        </View>

        <View style={styles.rightSection}>
          <Text style={styles.usage}>
            {dailyUsage}/{isPremium ? '∞' : dailyLimit}
          </Text>
          <Text style={styles.usageLabel}>today</Text>
        </View>

        <Ionicons name="chevron-forward" size={16} color={colors.muted} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.line,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing(2),
  },
  leftSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing(1.5),
  },
  textContainer: {
    flex: 1,
  },
  credits: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  status: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 1,
  },
  rightSection: {
    alignItems: 'flex-end',
    marginRight: spacing(1),
  },
  usage: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  usageLabel: {
    fontSize: 11,
    color: colors.muted,
    marginTop: 1,
  },
});