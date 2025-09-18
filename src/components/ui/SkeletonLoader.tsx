/**
 * SkeletonLoader Components
 * Animated skeleton placeholders for loading states
 */

import React, { useEffect, useRef } from 'react';
import { 
  View, 
  StyleSheet, 
  Animated, 
  ViewStyle,
  Dimensions 
} from 'react-native';
import { colors, spacing, radii } from '../../theme/tokens';

const { width: screenWidth } = Dimensions.get('window');

interface SkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
  animated?: boolean;
}

// Base Skeleton Component
export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = 20,
  borderRadius = 4,
  style,
  animated = true,
}) => {
  const shimmerValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!animated) return;

    const shimmerAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: false,
        }),
        Animated.timing(shimmerValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: false,
        }),
      ])
    );

    shimmerAnimation.start();

    return () => shimmerAnimation.stop();
  }, [animated, shimmerValue]);

  const opacity = animated 
    ? shimmerValue.interpolate({
        inputRange: [0, 1],
        outputRange: [0.3, 0.7],
      })
    : 0.3;

  return (
    <Animated.View
      style={[
        styles.skeleton,
        {
          width,
          height,
          borderRadius,
          opacity,
        },
        style,
      ]}
    />
  );
};

// Circle Skeleton for avatars
interface SkeletonCircleProps {
  size?: number;
  style?: ViewStyle;
  animated?: boolean;
}

export const SkeletonCircle: React.FC<SkeletonCircleProps> = ({
  size = 40,
  style,
  animated = true,
}) => (
  <Skeleton
    width={size}
    height={size}
    borderRadius={size / 2}
    style={style}
    animated={animated}
  />
);

// Text line skeletons
interface SkeletonTextProps {
  lines?: number;
  lineHeight?: number;
  lastLineWidth?: string;
  style?: ViewStyle;
  animated?: boolean;
}

export const SkeletonText: React.FC<SkeletonTextProps> = ({
  lines = 1,
  lineHeight = 16,
  lastLineWidth = '60%',
  style,
  animated = true,
}) => (
  <View style={[styles.textContainer, style]}>
    {Array.from({ length: lines }, (_, index) => (
      <Skeleton
        key={index}
        width={index === lines - 1 && lines > 1 ? lastLineWidth : '100%'}
        height={lineHeight}
        borderRadius={lineHeight / 4}
        style={index > 0 ? { marginTop: spacing(0.5) } : undefined}
        animated={animated}
      />
    ))}
  </View>
);

// Card Skeleton
interface SkeletonCardProps {
  width?: number;
  height?: number;
  showImage?: boolean;
  imageHeight?: number;
  showAvatar?: boolean;
  showText?: boolean;
  textLines?: number;
  style?: ViewStyle;
  animated?: boolean;
}

export const SkeletonCard: React.FC<SkeletonCardProps> = ({
  width = screenWidth - spacing(2),
  height = 200,
  showImage = true,
  imageHeight = 120,
  showAvatar = false,
  showText = true,
  textLines = 2,
  style,
  animated = true,
}) => (
  <View style={[styles.card, { width, height }, style]}>
    {showImage && (
      <Skeleton
        width="100%"
        height={imageHeight}
        borderRadius={0}
        style={styles.cardImage}
        animated={animated}
      />
    )}
    
    <View style={styles.cardContent}>
      {showAvatar && (
        <View style={styles.cardHeader}>
          <SkeletonCircle size={32} animated={animated} />
          <View style={styles.cardHeaderText}>
            <Skeleton width="70%" height={14} animated={animated} />
            <Skeleton width="50%" height={12} style={{ marginTop: spacing(0.25) }} animated={animated} />
          </View>
        </View>
      )}
      
      {showText && (
        <SkeletonText
          lines={textLines}
          lineHeight={16}
          lastLineWidth="75%"
          style={showAvatar ? { marginTop: spacing(1) } : undefined}
          animated={animated}
        />
      )}
    </View>
  </View>
);

// List Item Skeleton
interface SkeletonListItemProps {
  showAvatar?: boolean;
  avatarSize?: number;
  showImage?: boolean;
  imageSize?: number;
  textLines?: number;
  showButton?: boolean;
  style?: ViewStyle;
  animated?: boolean;
}

export const SkeletonListItem: React.FC<SkeletonListItemProps> = ({
  showAvatar = true,
  avatarSize = 40,
  showImage = false,
  imageSize = 60,
  textLines = 2,
  showButton = false,
  style,
  animated = true,
}) => (
  <View style={[styles.listItem, style]}>
    {showAvatar && (
      <SkeletonCircle size={avatarSize} animated={animated} />
    )}
    
    {showImage && (
      <Skeleton
        width={imageSize}
        height={imageSize}
        borderRadius={radii.md}
        animated={animated}
      />
    )}
    
    <View style={styles.listItemContent}>
      <SkeletonText
        lines={textLines}
        lineHeight={16}
        lastLineWidth="65%"
        animated={animated}
      />
    </View>
    
    {showButton && (
      <Skeleton
        width={80}
        height={32}
        borderRadius={radii.lg}
        animated={animated}
      />
    )}
  </View>
);

// Grid Skeleton for grids of items
interface SkeletonGridProps {
  columns?: number;
  rows?: number;
  itemHeight?: number;
  spacing?: number;
  style?: ViewStyle;
  animated?: boolean;
}

export const SkeletonGrid: React.FC<SkeletonGridProps> = ({
  columns = 2,
  rows = 3,
  itemHeight = 120,
  spacing: gridSpacing = spacing(1),
  style,
  animated = true,
}) => {
  const itemWidth = (screenWidth - spacing(2) - (gridSpacing * (columns - 1))) / columns;

  return (
    <View style={[styles.grid, { gap: gridSpacing }, style]}>
      {Array.from({ length: rows }, (_, rowIndex) => (
        <View key={rowIndex} style={[styles.gridRow, { gap: gridSpacing }]}>
          {Array.from({ length: columns }, (_, colIndex) => (
            <Skeleton
              key={colIndex}
              width={itemWidth}
              height={itemHeight}
              borderRadius={radii.lg}
              animated={animated}
            />
          ))}
        </View>
      ))}
    </View>
  );
};

// Screen-specific skeletons
export const SkeletonFeedItem: React.FC<{ animated?: boolean }> = ({ animated = true }) => (
  <SkeletonCard
    showImage
    showAvatar
    showText
    textLines={3}
    imageHeight={160}
    animated={animated}
    style={{ marginBottom: spacing(2) }}
  />
);

export const SkeletonBarCard: React.FC<{ animated?: boolean }> = ({ animated = true }) => (
  <SkeletonCard
    width={280}
    height={200}
    showImage
    showText
    textLines={2}
    imageHeight={120}
    animated={animated}
  />
);

export const SkeletonSpiritCard: React.FC<{ animated?: boolean }> = ({ animated = true }) => (
  <SkeletonCard
    width={160}
    height={240}
    showImage
    showText
    textLines={2}
    imageHeight={160}
    animated={animated}
  />
);

export const SkeletonProfileHeader: React.FC<{ animated?: boolean }> = ({ animated = true }) => (
  <View style={styles.profileHeader}>
    <SkeletonCircle size={80} animated={animated} />
    <View style={styles.profileInfo}>
      <Skeleton width="60%" height={20} style={{ marginBottom: spacing(0.5) }} animated={animated} />
      <Skeleton width="40%" height={14} style={{ marginBottom: spacing(1) }} animated={animated} />
      <View style={styles.profileStats}>
        <Skeleton width={60} height={12} animated={animated} />
        <Skeleton width={60} height={12} animated={animated} />
        <Skeleton width={60} height={12} animated={animated} />
      </View>
    </View>
  </View>
);

// Loading screen skeletons
export const SkeletonScreen: React.FC<{
  type: 'feed' | 'grid' | 'list' | 'profile';
  animated?: boolean;
}> = ({ type, animated = true }) => {
  switch (type) {
    case 'feed':
      return (
        <View style={styles.screen}>
          {Array.from({ length: 3 }, (_, index) => (
            <SkeletonFeedItem key={index} animated={animated} />
          ))}
        </View>
      );
    
    case 'grid':
      return (
        <View style={styles.screen}>
          <SkeletonGrid animated={animated} />
        </View>
      );
    
    case 'list':
      return (
        <View style={styles.screen}>
          {Array.from({ length: 8 }, (_, index) => (
            <SkeletonListItem
              key={index}
              style={{ marginBottom: spacing(1) }}
              animated={animated}
            />
          ))}
        </View>
      );
    
    case 'profile':
      return (
        <View style={styles.screen}>
          <SkeletonProfileHeader animated={animated} />
          <View style={{ marginTop: spacing(3) }}>
            <SkeletonGrid rows={2} animated={animated} />
          </View>
        </View>
      );
    
    default:
      return <View />;
  }
};

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: colors.muted,
  },
  textContainer: {
    // Container for text lines
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    overflow: 'hidden',
    shadowColor: colors.shadow,
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  cardImage: {
    // Image at top of card
  },
  cardContent: {
    padding: spacing(2),
    flex: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing(1),
  },
  cardHeaderText: {
    flex: 1,
    marginLeft: spacing(1),
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing(2),
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    gap: spacing(1.5),
  },
  listItemContent: {
    flex: 1,
  },
  grid: {
    padding: spacing(1),
  },
  gridRow: {
    flexDirection: 'row',
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing(2),
    gap: spacing(2),
  },
  profileInfo: {
    flex: 1,
  },
  profileStats: {
    flexDirection: 'row',
    gap: spacing(2),
  },
  screen: {
    flex: 1,
    padding: spacing(1),
  },
});