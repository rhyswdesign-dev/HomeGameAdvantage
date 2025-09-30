/**
 * SKELETON LOADER COMPONENT
 * Smooth placeholder animations while content loads
 * Provides different skeleton layouts for various content types
 */

import React, { useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { colors, spacing, radii } from '../../theme/tokens';

interface SkeletonLoaderProps {
  type?: 'recipe' | 'list' | 'profile' | 'lesson' | 'search' | 'card' | 'text' | 'custom';
  count?: number;
  width?: number | string;
  height?: number | string;
  borderRadius?: number;
  style?: any;
  shimmer?: boolean;
  children?: React.ReactNode; // For custom skeleton layouts
}

const { width: screenWidth } = Dimensions.get('window');

export default function SkeletonLoader({
  type = 'card',
  count = 1,
  width,
  height,
  borderRadius = radii.md,
  style,
  shimmer = true,
  children,
}: SkeletonLoaderProps) {
  const shimmerValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (shimmer) {
      const shimmerAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(shimmerValue, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(shimmerValue, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      );
      shimmerAnimation.start();
      return () => shimmerAnimation.stop();
    }
  }, [shimmer]);

  const getShimmerOpacity = () => {
    if (!shimmer) return 1;

    return shimmerValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0.3, 0.7],
    });
  };

  const renderSkeletonElement = (elementStyle: any, key?: string | number) => (
    <Animated.View
      key={key}
      style={[
        styles.skeletonElement,
        elementStyle,
        { opacity: getShimmerOpacity() },
      ]}
    />
  );

  const renderRecipeSkeleton = () => (
    <View style={styles.recipeContainer}>
      {/* Image */}
      {renderSkeletonElement([styles.recipeImage])}

      {/* Content */}
      <View style={styles.recipeContent}>
        {/* Title */}
        {renderSkeletonElement([styles.recipeTitle])}

        {/* Subtitle */}
        {renderSkeletonElement([styles.recipeSubtitle])}

        {/* Description */}
        {renderSkeletonElement([styles.recipeDescription])}
        {renderSkeletonElement([styles.recipeDescriptionShort])}

        {/* Meta info */}
        <View style={styles.recipeMeta}>
          {renderSkeletonElement([styles.metaBadge])}
          {renderSkeletonElement([styles.metaBadge])}
          {renderSkeletonElement([styles.metaBadge])}
        </View>
      </View>
    </View>
  );

  const renderListSkeleton = () => (
    <View style={styles.listItem}>
      {/* Avatar/Icon */}
      {renderSkeletonElement([styles.listAvatar])}

      {/* Content */}
      <View style={styles.listContent}>
        {renderSkeletonElement([styles.listTitle])}
        {renderSkeletonElement([styles.listSubtitle])}
      </View>

      {/* Action */}
      {renderSkeletonElement([styles.listAction])}
    </View>
  );

  const renderProfileSkeleton = () => (
    <View style={styles.profileContainer}>
      {/* Header */}
      <View style={styles.profileHeader}>
        {renderSkeletonElement([styles.profileAvatar])}

        <View style={styles.profileInfo}>
          {renderSkeletonElement([styles.profileName])}
          {renderSkeletonElement([styles.profileUsername])}
          {renderSkeletonElement([styles.profileBio])}
        </View>
      </View>

      {/* Stats */}
      <View style={styles.profileStats}>
        {[1, 2, 3].map(i => (
          <View key={i} style={styles.statItem}>
            {renderSkeletonElement([styles.statValue])}
            {renderSkeletonElement([styles.statLabel])}
          </View>
        ))}
      </View>

      {/* Actions */}
      <View style={styles.profileActions}>
        {renderSkeletonElement([styles.profileButton])}
        {renderSkeletonElement([styles.profileButtonSecondary])}
      </View>
    </View>
  );

  const renderLessonSkeleton = () => (
    <View style={styles.lessonContainer}>
      {/* Progress bar */}
      {renderSkeletonElement([styles.lessonProgress])}

      {/* Content */}
      <View style={styles.lessonContent}>
        {renderSkeletonElement([styles.lessonTitle])}
        {renderSkeletonElement([styles.lessonDescription])}
        {renderSkeletonElement([styles.lessonDescriptionShort])}

        {/* Question area */}
        <View style={styles.lessonQuestion}>
          {renderSkeletonElement([styles.questionText])}

          {/* Options */}
          {[1, 2, 3, 4].map(i => (
            <View key={i} style={styles.lessonOption}>
              {renderSkeletonElement([styles.optionButton])}
            </View>
          ))}
        </View>
      </View>
    </View>
  );

  const renderSearchSkeleton = () => (
    <View style={styles.searchContainer}>
      {/* Search bar */}
      {renderSkeletonElement([styles.searchBar])}

      {/* Filters */}
      <View style={styles.searchFilters}>
        {[1, 2, 3, 4].map(i => (
          renderSkeletonElement([styles.filterChip], i)
        ))}
      </View>

      {/* Results */}
      <View style={styles.searchResults}>
        {[1, 2, 3].map(i => (
          <View key={i} style={styles.searchResult}>
            {renderSkeletonElement([styles.resultImage])}
            <View style={styles.resultContent}>
              {renderSkeletonElement([styles.resultTitle])}
              {renderSkeletonElement([styles.resultSubtitle])}
            </View>
          </View>
        ))}
      </View>
    </View>
  );

  const renderCardSkeleton = () => (
    <View style={styles.cardContainer}>
      {renderSkeletonElement([
        styles.cardElement,
        width && { width },
        height && { height },
        { borderRadius },
      ])}
    </View>
  );

  const renderTextSkeleton = () => (
    <View style={styles.textContainer}>
      {[1, 2, 3].map(i => (
        renderSkeletonElement([
          styles.textLine,
          i === 3 && styles.textLineShort,
        ], i)
      ))}
    </View>
  );

  const renderSkeleton = () => {
    if (children) {
      return (
        <Animated.View style={[{ opacity: getShimmerOpacity() }]}>
          {children}
        </Animated.View>
      );
    }

    switch (type) {
      case 'recipe': return renderRecipeSkeleton();
      case 'list': return renderListSkeleton();
      case 'profile': return renderProfileSkeleton();
      case 'lesson': return renderLessonSkeleton();
      case 'search': return renderSearchSkeleton();
      case 'text': return renderTextSkeleton();
      case 'card':
      default: return renderCardSkeleton();
    }
  };

  const skeletons = Array.from({ length: count }, (_, index) => (
    <View key={index} style={[styles.skeletonWrapper, style]}>
      {renderSkeleton()}
    </View>
  ));

  return <View style={styles.container}>{skeletons}</View>;
}

// Additional skeleton components for specific use cases
export const SkeletonText = ({
  lines = 3,
  lastLineWidth = '70%',
  ...props
}: {
  lines?: number;
  lastLineWidth?: string;
} & Partial<SkeletonLoaderProps>) => (
  <SkeletonLoader {...props}>
    <View style={styles.textContainer}>
      {Array.from({ length: lines }, (_, i) => (
        <View
          key={i}
          style={[
            styles.skeletonElement,
            styles.textLine,
            i === lines - 1 && { width: lastLineWidth },
          ]}
        />
      ))}
    </View>
  </SkeletonLoader>
);

export const SkeletonCircle = ({
  size = 40,
  ...props
}: {
  size?: number;
} & Partial<SkeletonLoaderProps>) => (
  <SkeletonLoader {...props}>
    <View
      style={[
        styles.skeletonElement,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
        },
      ]}
    />
  </SkeletonLoader>
);

export const SkeletonButton = ({
  width = 120,
  height = 40,
  ...props
}: {
  width?: number;
  height?: number;
} & Partial<SkeletonLoaderProps>) => (
  <SkeletonLoader {...props}>
    <View
      style={[
        styles.skeletonElement,
        {
          width,
          height,
          borderRadius: radii.md,
        },
      ]}
    />
  </SkeletonLoader>
);

const styles = StyleSheet.create({
  container: {
    gap: spacing(2),
  },
  skeletonWrapper: {
    // Base wrapper styles
  },
  skeletonElement: {
    backgroundColor: colors.line,
    borderRadius: radii.sm,
  },

  // Recipe skeleton
  recipeContainer: {
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    padding: spacing(2),
    borderWidth: 1,
    borderColor: colors.line,
  },
  recipeImage: {
    width: '100%',
    height: 160,
    borderRadius: radii.md,
    marginBottom: spacing(2),
  },
  recipeContent: {
    gap: spacing(1),
  },
  recipeTitle: {
    height: 20,
    width: '70%',
    marginBottom: spacing(0.5),
  },
  recipeSubtitle: {
    height: 16,
    width: '50%',
    marginBottom: spacing(1),
  },
  recipeDescription: {
    height: 14,
    width: '100%',
  },
  recipeDescriptionShort: {
    height: 14,
    width: '75%',
    marginBottom: spacing(1),
  },
  recipeMeta: {
    flexDirection: 'row',
    gap: spacing(1),
  },
  metaBadge: {
    height: 24,
    width: 60,
    borderRadius: radii.sm,
  },

  // List skeleton
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing(2),
    backgroundColor: colors.card,
    borderRadius: radii.md,
    gap: spacing(2),
  },
  listAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  listContent: {
    flex: 1,
    gap: spacing(0.5),
  },
  listTitle: {
    height: 18,
    width: '80%',
  },
  listSubtitle: {
    height: 14,
    width: '60%',
  },
  listAction: {
    width: 80,
    height: 32,
    borderRadius: radii.sm,
  },

  // Profile skeleton
  profileContainer: {
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    padding: spacing(3),
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing(2),
    gap: spacing(2),
  },
  profileAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  profileInfo: {
    flex: 1,
    gap: spacing(0.5),
  },
  profileName: {
    height: 20,
    width: '60%',
  },
  profileUsername: {
    height: 16,
    width: '40%',
  },
  profileBio: {
    height: 14,
    width: '80%',
  },
  profileStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: spacing(2),
  },
  statItem: {
    alignItems: 'center',
    gap: spacing(0.5),
  },
  statValue: {
    height: 18,
    width: 30,
  },
  statLabel: {
    height: 12,
    width: 40,
  },
  profileActions: {
    flexDirection: 'row',
    gap: spacing(2),
  },
  profileButton: {
    flex: 1,
    height: 40,
    borderRadius: radii.md,
  },
  profileButtonSecondary: {
    flex: 1,
    height: 40,
    borderRadius: radii.md,
  },

  // Lesson skeleton
  lessonContainer: {
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    padding: spacing(3),
  },
  lessonProgress: {
    height: 8,
    width: '100%',
    borderRadius: 4,
    marginBottom: spacing(3),
  },
  lessonContent: {
    gap: spacing(2),
  },
  lessonTitle: {
    height: 24,
    width: '80%',
  },
  lessonQuestion: {
    gap: spacing(1.5),
  },
  questionText: {
    height: 18,
    width: '90%',
    marginBottom: spacing(1),
  },
  lessonOption: {
    marginBottom: spacing(1),
  },
  optionButton: {
    height: 50,
    width: '100%',
    borderRadius: radii.md,
  },

  // Search skeleton
  searchContainer: {
    gap: spacing(2),
  },
  searchBar: {
    height: 44,
    width: '100%',
    borderRadius: radii.lg,
  },
  searchFilters: {
    flexDirection: 'row',
    gap: spacing(1),
  },
  filterChip: {
    height: 32,
    width: 80,
    borderRadius: radii.md,
  },
  searchResults: {
    gap: spacing(1.5),
  },
  searchResult: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing(2),
  },
  resultImage: {
    width: 60,
    height: 60,
    borderRadius: radii.md,
  },
  resultContent: {
    flex: 1,
    gap: spacing(0.5),
  },
  resultTitle: {
    height: 16,
    width: '70%',
  },
  resultSubtitle: {
    height: 14,
    width: '50%',
  },

  // Card skeleton
  cardContainer: {
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    padding: spacing(2),
  },
  cardElement: {
    width: '100%',
    height: 100,
  },

  // Text skeleton
  textContainer: {
    gap: spacing(1),
  },
  textLine: {
    height: 16,
    width: '100%',
  },
  textLineShort: {
    width: '70%',
  },
});