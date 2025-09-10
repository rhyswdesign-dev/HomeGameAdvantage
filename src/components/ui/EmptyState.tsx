import React from 'react';
import { View, Text, StyleSheet, Pressable, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radii, fonts } from '../../theme/tokens';

export interface EmptyStateProps {
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
  variant?: 'default' | 'search' | 'error' | 'offline';
  style?: ViewStyle;
  compact?: boolean;
}

const getVariantConfig = (variant: EmptyStateProps['variant']) => {
  switch (variant) {
    case 'search':
      return {
        icon: 'search-outline' as const,
        iconColor: colors.muted,
        title: 'No results found',
        description: 'Try adjusting your search or filters to find what you\'re looking for.',
      };
    case 'error':
      return {
        icon: 'alert-circle-outline' as const,
        iconColor: '#EF4444',
        title: 'Something went wrong',
        description: 'We encountered an error while loading this content.',
      };
    case 'offline':
      return {
        icon: 'cloud-offline-outline' as const,
        iconColor: '#6B7280',
        title: 'You\'re offline',
        description: 'Check your internet connection and try again.',
      };
    default:
      return {
        icon: 'document-outline' as const,
        iconColor: colors.muted,
        title: 'No content yet',
        description: 'This area will populate once you have some content.',
      };
  }
};

export default function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
  variant = 'default',
  style,
  compact = false,
}: EmptyStateProps) {
  const variantConfig = getVariantConfig(variant);
  
  const displayIcon = icon || variantConfig.icon;
  const displayTitle = title || variantConfig.title;
  const displayDescription = description || variantConfig.description;

  return (
    <View style={[styles.container, compact && styles.compactContainer, style]}>
      <View style={[styles.content, compact && styles.compactContent]}>
        {/* Icon */}
        <View style={[styles.iconContainer, compact && styles.compactIconContainer]}>
          <Ionicons 
            name={displayIcon} 
            size={compact ? 48 : 64} 
            color={variantConfig.iconColor} 
          />
        </View>

        {/* Title */}
        <Text style={[styles.title, compact && styles.compactTitle]}>
          {displayTitle}
        </Text>

        {/* Description */}
        {displayDescription && (
          <Text style={[styles.description, compact && styles.compactDescription]}>
            {displayDescription}
          </Text>
        )}

        {/* Actions */}
        {(actionLabel || secondaryActionLabel) && (
          <View style={[styles.actionsContainer, compact && styles.compactActionsContainer]}>
            {actionLabel && onAction && (
              <Pressable 
                style={[styles.primaryAction, compact && styles.compactPrimaryAction]} 
                onPress={onAction}
              >
                <Text style={styles.primaryActionText}>{actionLabel}</Text>
              </Pressable>
            )}

            {secondaryActionLabel && onSecondaryAction && (
              <Pressable 
                style={[styles.secondaryAction, compact && styles.compactSecondaryAction]} 
                onPress={onSecondaryAction}
              >
                <Text style={styles.secondaryActionText}>{secondaryActionLabel}</Text>
              </Pressable>
            )}
          </View>
        )}
      </View>
    </View>
  );
}

// Convenience components for common empty states
export const SearchEmptyState: React.FC<Omit<EmptyStateProps, 'variant'>> = (props) => (
  <EmptyState {...props} variant="search" />
);

export const ErrorEmptyState: React.FC<Omit<EmptyStateProps, 'variant'>> = (props) => (
  <EmptyState {...props} variant="error" />
);

export const OfflineEmptyState: React.FC<Omit<EmptyStateProps, 'variant'>> = (props) => (
  <EmptyState {...props} variant="offline" />
);

// List-specific empty state
interface ListEmptyStateProps extends Omit<EmptyStateProps, 'title'> {
  itemType: string; // e.g., 'events', 'bars', 'spirits'
  showCreateButton?: boolean;
  onCreatePress?: () => void;
}

export const ListEmptyState: React.FC<ListEmptyStateProps> = ({
  itemType,
  showCreateButton = false,
  onCreatePress,
  ...props
}) => {
  const title = `No ${itemType} yet`;
  const description = props.description || `Start adding ${itemType} to see them here.`;
  
  return (
    <EmptyState
      {...props}
      title={title}
      description={description}
      actionLabel={showCreateButton && onCreatePress ? `Add ${itemType}` : props.actionLabel}
      onAction={showCreateButton && onCreatePress ? onCreatePress : props.onAction}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing(3),
    paddingVertical: spacing(4),
  },
  compactContainer: {
    paddingVertical: spacing(3),
  },
  content: {
    alignItems: 'center',
    maxWidth: 320,
    width: '100%',
  },
  compactContent: {
    maxWidth: 280,
  },
  iconContainer: {
    marginBottom: spacing(3),
    padding: spacing(2),
    backgroundColor: colors.chipBg,
    borderRadius: 50,
  },
  compactIconContainer: {
    marginBottom: spacing(2),
    padding: spacing(1.5),
  },
  title: {
    fontSize: fonts.h2,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing(1.5),
  },
  compactTitle: {
    fontSize: fonts.h3,
    marginBottom: spacing(1),
  },
  description: {
    fontSize: fonts.body,
    color: colors.subtext,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: spacing(3),
  },
  compactDescription: {
    fontSize: fonts.caption,
    lineHeight: 20,
    marginBottom: spacing(2.5),
  },
  actionsContainer: {
    gap: spacing(1.5),
    width: '100%',
  },
  compactActionsContainer: {
    gap: spacing(1),
  },
  primaryAction: {
    backgroundColor: colors.accent,
    paddingVertical: spacing(1.5),
    paddingHorizontal: spacing(3),
    borderRadius: radii.lg,
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  compactPrimaryAction: {
    paddingVertical: spacing(1.25),
    paddingHorizontal: spacing(2.5),
  },
  primaryActionText: {
    fontSize: fonts.body,
    fontWeight: '600',
    color: colors.accentText,
  },
  secondaryAction: {
    backgroundColor: 'transparent',
    paddingVertical: spacing(1.5),
    paddingHorizontal: spacing(3),
    borderRadius: radii.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.line,
  },
  compactSecondaryAction: {
    paddingVertical: spacing(1.25),
    paddingHorizontal: spacing(2.5),
  },
  secondaryActionText: {
    fontSize: fonts.body,
    fontWeight: '600',
    color: colors.text,
  },
});