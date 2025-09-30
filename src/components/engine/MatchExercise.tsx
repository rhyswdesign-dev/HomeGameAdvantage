/**
 * Match Exercise Component
 * Drag and drop or tap-to-match pairs for lesson engine
 */

import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, fonts, radii, spacing } from '../../theme/tokens';
import { Item } from '../../types/domain';

interface MatchPair {
  left: string;
  right: string;
}

interface MatchExerciseProps {
  item: Item;
  onResult: (result: { correct: boolean; msToAnswer: number }) => void;
}

export const MatchExercise: React.FC<MatchExerciseProps> = ({ item, onResult }) => {
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [matches, setMatches] = useState<Record<string, string>>({});
  const [startTime] = useState(Date.now());

  const pairs: MatchPair[] = item.pairs || [];
  const leftItems = pairs.map(p => p.left);
  const rightItems = [...pairs.map(p => p.right)].sort(() => Math.random() - 0.5); // Shuffle right items

  const handleLeftPress = (leftItem: string) => {
    if (matches[leftItem]) {
      // If already matched, remove the match
      const newMatches = { ...matches };
      delete newMatches[leftItem];
      setMatches(newMatches);
      setSelectedLeft(leftItem);
    } else {
      setSelectedLeft(leftItem);
    }
  };

  const handleRightPress = (rightItem: string) => {
    if (!selectedLeft) return;

    // Remove any existing match for this right item
    const newMatches = { ...matches };
    Object.keys(newMatches).forEach(left => {
      if (newMatches[left] === rightItem) {
        delete newMatches[left];
      }
    });

    // Add new match
    newMatches[selectedLeft] = rightItem;
    setMatches(newMatches);
    setSelectedLeft(null);
  };

  const handleSubmit = () => {
    const msToAnswer = Date.now() - startTime;
    
    // Check if all pairs are correctly matched
    let isCorrect = true;
    for (const pair of pairs) {
      if (matches[pair.left] !== pair.right) {
        isCorrect = false;
        break;
      }
    }

    onResult({
      correct: isCorrect,
      msToAnswer
    });
  };

  const canSubmit = Object.keys(matches).length === pairs.length;
  const isRightItemMatched = (rightItem: string) => Object.values(matches).includes(rightItem);

  return (
    <View style={styles.container}>
      <Text style={styles.prompt}>{item.prompt}</Text>
      
      <View style={styles.matchContainer}>
        {/* Left Column */}
        <View style={styles.column}>
          <Text style={styles.columnHeader}>Match</Text>
          {leftItems.map((leftItem, index) => {
            const isSelected = selectedLeft === leftItem;
            const isMatched = !!matches[leftItem];
            
            return (
              <Pressable
                key={index}
                style={[
                  styles.item,
                  isSelected && styles.itemSelected,
                  isMatched && styles.itemMatched
                ]}
                onPress={() => handleLeftPress(leftItem)}
              >
                <LinearGradient
                  colors={isSelected 
                    ? [colors.accent, '#B8860B']
                    : isMatched 
                    ? [colors.success, '#4CAF50']
                    : [colors.card, '#2B1B12']
                  }
                  style={styles.itemGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Text style={[
                    styles.itemText,
                    (isSelected || isMatched) && styles.itemTextSelected
                  ]}>
                    {leftItem}
                  </Text>
                  {isMatched && (
                    <Text style={styles.matchedWith}>→ {matches[leftItem]}</Text>
                  )}
                </LinearGradient>
              </Pressable>
            );
          })}
        </View>

        {/* Right Column */}
        <View style={styles.column}>
          <Text style={styles.columnHeader}>With</Text>
          {rightItems.map((rightItem, index) => {
            const isMatched = isRightItemMatched(rightItem);
            
            return (
              <Pressable
                key={index}
                style={[
                  styles.item,
                  isMatched && styles.itemMatched,
                  !selectedLeft && styles.itemDisabled
                ]}
                onPress={() => handleRightPress(rightItem)}
                disabled={!selectedLeft}
              >
                <LinearGradient
                  colors={isMatched 
                    ? [colors.success, '#4CAF50']
                    : !selectedLeft
                    ? [colors.subtext, '#666']
                    : [colors.card, '#2B1B12']
                  }
                  style={styles.itemGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Text style={[
                    styles.itemText,
                    isMatched && styles.itemTextSelected,
                    !selectedLeft && styles.itemTextDisabled
                  ]}>
                    {rightItem}
                  </Text>
                </LinearGradient>
              </Pressable>
            );
          })}
        </View>
      </View>

      <Pressable
        style={[styles.submitButton, !canSubmit && styles.submitButtonDisabled]}
        onPress={handleSubmit}
        disabled={!canSubmit}
      >
        <LinearGradient
          colors={canSubmit 
            ? [colors.accent, '#B8860B'] 
            : [colors.subtext, '#666']
          }
          style={styles.submitGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={[
            styles.submitText,
            !canSubmit && styles.submitTextDisabled
          ]}>
            Submit Answer
          </Text>
        </LinearGradient>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing(3),
  },
  prompt: {
    fontSize: fonts.h2,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing(4),
    lineHeight: fonts.h2 * 1.4,
  },
  matchContainer: {
    flexDirection: 'row',
    gap: spacing(3),
    marginBottom: spacing(4),
  },
  column: {
    flex: 1,
    gap: spacing(1),
  },
  columnHeader: {
    fontSize: fonts.body,
    fontWeight: '600',
    color: colors.accent,
    textAlign: 'center',
    marginBottom: spacing(2),
  },
  item: {
    borderRadius: radii.md,
    overflow: 'hidden',
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  itemSelected: {
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  itemMatched: {
    shadowColor: colors.success,
    shadowOpacity: 0.2,
  },
  itemDisabled: {
    opacity: 0.6,
  },
  itemGradient: {
    padding: spacing(2),
    borderRadius: radii.md,
  },
  itemText: {
    fontSize: fonts.body,
    fontWeight: '500',
    color: colors.text,
    textAlign: 'center',
  },
  itemTextSelected: {
    color: colors.bg,
    fontWeight: '600',
  },
  itemTextDisabled: {
    color: colors.subtext,
  },
  matchedWith: {
    fontSize: fonts.small,
    color: colors.bg,
    textAlign: 'center',
    marginTop: spacing(0.5),
    fontWeight: '500',
  },
  submitButton: {
    borderRadius: radii.lg,
    overflow: 'hidden',
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  submitButtonDisabled: {
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  submitGradient: {
    padding: spacing(3),
    borderRadius: radii.lg,
    alignItems: 'center',
  },
  submitText: {
    fontSize: fonts.h3,
    fontWeight: '700',
    color: colors.bg,
  },
  submitTextDisabled: {
    color: colors.text,
  },
});

export default MatchExercise;