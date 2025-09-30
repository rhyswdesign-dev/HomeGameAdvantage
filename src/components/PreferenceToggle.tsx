/**
 * PREFERENCE TOGGLE COMPONENT
 * Reusable toggle component for consent preferences
 * Handles enabled/disabled states with explanatory tooltips
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radii } from '../theme/tokens';

interface PreferenceToggleProps {
  title: string;
  description: string;
  examples: string[];
  value: boolean;
  disabled?: boolean;
  required?: boolean;
  onValueChange: (value: boolean) => void;
  onLearnMore?: () => void;
}

/**
 * Toggle component for privacy preferences with explanatory content
 */
export default function PreferenceToggle({
  title,
  description,
  examples,
  value,
  disabled = false,
  required = false,
  onValueChange,
  onLearnMore,
}: PreferenceToggleProps) {
  return (
    <View style={[
      styles.container,
      disabled && styles.containerDisabled,
    ]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={[
            styles.title,
            disabled && styles.titleDisabled,
          ]}>
            {title}
          </Text>
          {required && (
            <View style={styles.requiredBadge}>
              <Text style={styles.requiredText}>Required</Text>
            </View>
          )}
        </View>

        <Switch
          value={value}
          onValueChange={onValueChange}
          disabled={disabled || required}
          trackColor={{
            false: colors.line,
            true: colors.accent + '80',
          }}
          thumbColor={value ? colors.accent : colors.subtext}
          ios_backgroundColor={colors.line}
        />
      </View>

      {/* Description */}
      <Text style={[
        styles.description,
        disabled && styles.descriptionDisabled,
      ]}>
        {description}
      </Text>

      {/* Examples */}
      {examples.length > 0 && (
        <View style={styles.examplesContainer}>
          <Text style={styles.examplesTitle}>Examples:</Text>
          {examples.map((example, index) => (
            <View key={index} style={styles.exampleItem}>
              <Text style={styles.exampleBullet}>•</Text>
              <Text style={styles.exampleText}>{example}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Learn More Link */}
      {onLearnMore && (
        <TouchableOpacity
          style={styles.learnMoreButton}
          onPress={onLearnMore}
          activeOpacity={0.7}
        >
          <Text style={styles.learnMoreText}>Learn more</Text>
          <Ionicons name="chevron-forward" size={16} color={colors.accent} />
        </TouchableOpacity>
      )}

      {/* Required Notice */}
      {required && (
        <View style={styles.requiredNotice}>
          <Ionicons name="information-circle" size={16} color={colors.subtext} />
          <Text style={styles.requiredNoticeText}>
            This category is required for the app to function properly and cannot be disabled.
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    padding: spacing(2),
    marginBottom: spacing(2),
    borderWidth: 1,
    borderColor: colors.line,
  },
  containerDisabled: {
    opacity: 0.6,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing(1),
  },
  titleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: spacing(2),
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  titleDisabled: {
    color: colors.subtext,
  },
  requiredBadge: {
    backgroundColor: colors.accent + '20',
    paddingHorizontal: spacing(1),
    paddingVertical: spacing(0.25),
    borderRadius: radii.sm,
    marginLeft: spacing(1),
  },
  requiredText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.accent,
  },

  // Description
  description: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
    marginBottom: spacing(1.5),
  },
  descriptionDisabled: {
    color: colors.subtext,
  },

  // Examples
  examplesContainer: {
    marginBottom: spacing(1.5),
  },
  examplesTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.subtext,
    marginBottom: spacing(0.5),
  },
  exampleItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing(0.25),
  },
  exampleBullet: {
    fontSize: 14,
    color: colors.subtext,
    marginRight: spacing(1),
    marginTop: 2,
  },
  exampleText: {
    flex: 1,
    fontSize: 13,
    color: colors.subtext,
    lineHeight: 18,
  },

  // Learn More
  learnMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingVertical: spacing(0.5),
  },
  learnMoreText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.accent,
    marginRight: spacing(0.5),
  },

  // Required Notice
  requiredNotice: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.bg,
    borderRadius: radii.md,
    padding: spacing(1),
    marginTop: spacing(1),
  },
  requiredNoticeText: {
    flex: 1,
    fontSize: 12,
    color: colors.subtext,
    lineHeight: 16,
    marginLeft: spacing(0.5),
  },
});