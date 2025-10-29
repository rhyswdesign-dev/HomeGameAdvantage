/**
 * Match Exercise Component
 * Clean tap-to-connect interface
 */

import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Pressable, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, radii, spacing } from '../../theme/tokens';
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
  const [submitted, setSubmitted] = useState(false);
  const [startTime] = useState(Date.now());

  const fadeAnim = useRef(new Animated.Value(1)).current;
  const leftAnims = useRef((item.pairs || []).map(() => new Animated.Value(1))).current;
  const rightAnims = useRef((item.pairs || []).map(() => new Animated.Value(1))).current;

  const pairs: MatchPair[] = item.pairs || [];
  const leftItems = pairs.map(p => p.left);
  const rightItems = [...pairs.map(p => p.right)].sort(() => Math.random() - 0.5);

  useEffect(() => {
    setSelectedLeft(null);
    setMatches({});
    setSubmitted(false);

    fadeAnim.setValue(0);
    leftAnims.forEach(anim => anim.setValue(0));
    rightAnims.forEach(anim => anim.setValue(0));

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.stagger(60, [
        ...leftAnims.map(anim =>
          Animated.spring(anim, {
            toValue: 1,
            tension: 80,
            friction: 8,
            useNativeDriver: true,
          })
        ),
        ...rightAnims.map(anim =>
          Animated.spring(anim, {
            toValue: 1,
            tension: 80,
            friction: 8,
            useNativeDriver: true,
          })
        ),
      ]),
    ]).start();
  }, [item.id]);

  const handleLeftPress = (leftItem: string) => {
    if (submitted) return;

    if (matches[leftItem]) {
      const newMatches = { ...matches };
      delete newMatches[leftItem];
      setMatches(newMatches);
      setSelectedLeft(leftItem);
    } else {
      setSelectedLeft(leftItem);
    }
  };

  const handleRightPress = (rightItem: string) => {
    if (!selectedLeft || submitted) return;

    const newMatches = { ...matches };
    Object.keys(newMatches).forEach(left => {
      if (newMatches[left] === rightItem) {
        delete newMatches[left];
      }
    });

    newMatches[selectedLeft] = rightItem;
    setMatches(newMatches);
    setSelectedLeft(null);
  };

  const handleSubmit = () => {
    if (submitted || Object.keys(matches).length !== pairs.length) return;

    setSubmitted(true);
    const msToAnswer = Date.now() - startTime;

    let isCorrect = true;
    for (const pair of pairs) {
      if (matches[pair.left] !== pair.right) {
        isCorrect = false;
        break;
      }
    }

    setTimeout(() => {
      onResult({
        correct: isCorrect,
        msToAnswer
      });
    }, 800);
  };

  const canSubmit = Object.keys(matches).length === pairs.length;
  const isRightItemMatched = (rightItem: string) => Object.values(matches).includes(rightItem);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
        },
      ]}
    >
      <Text style={styles.prompt}>{item.prompt}</Text>

      <View style={styles.matchContainer}>
        {/* Left Column */}
        <View style={styles.column}>
          {leftItems.map((leftItem, index) => {
            const isSelected = selectedLeft === leftItem;
            const isMatched = !!matches[leftItem];

            return (
              <Animated.View
                key={index}
                style={{
                  opacity: leftAnims[index],
                  transform: [{
                    scale: leftAnims[index],
                  }],
                }}
              >
                <Pressable
                  style={[
                    styles.item,
                    isSelected && styles.itemSelected,
                    isMatched && styles.itemMatched,
                  ]}
                  onPress={() => handleLeftPress(leftItem)}
                  disabled={submitted}
                >
                  <LinearGradient
                    colors={
                      isSelected
                        ? ['rgba(215, 161, 94, 0.25)', 'rgba(228, 147, 62, 0.15)']
                        : isMatched
                        ? ['rgba(76, 175, 80, 0.2)', 'rgba(76, 175, 80, 0.1)']
                        : ['rgba(255, 255, 255, 0.08)', 'rgba(255, 255, 255, 0.02)']
                    }
                    style={styles.itemGradient}
                  >
                    <View style={styles.itemContent}>
                      <Text style={[
                        styles.itemText,
                        (isSelected || isMatched) && styles.itemTextHighlight
                      ]}>
                        {leftItem}
                      </Text>
                      {isMatched && <Text style={styles.connectLabel}>Connect</Text>}
                    </View>
                  </LinearGradient>
                </Pressable>
              </Animated.View>
            );
          })}
        </View>

        {/* Right Column */}
        <View style={styles.column}>
          {rightItems.map((rightItem, index) => {
            const isMatched = isRightItemMatched(rightItem);

            return (
              <Animated.View
                key={index}
                style={{
                  opacity: rightAnims[index],
                  transform: [{
                    scale: rightAnims[index],
                  }],
                }}
              >
                <Pressable
                  style={[
                    styles.item,
                    isMatched && styles.itemMatched,
                    !selectedLeft && !isMatched && styles.itemDisabled,
                  ]}
                  onPress={() => handleRightPress(rightItem)}
                  disabled={!selectedLeft || submitted}
                >
                  <LinearGradient
                    colors={
                      isMatched
                        ? ['rgba(76, 175, 80, 0.2)', 'rgba(76, 175, 80, 0.1)']
                        : !selectedLeft
                        ? ['rgba(255, 255, 255, 0.03)', 'rgba(255, 255, 255, 0.01)']
                        : ['rgba(255, 255, 255, 0.08)', 'rgba(255, 255, 255, 0.02)']
                    }
                    style={styles.itemGradient}
                  >
                    <View style={styles.itemContent}>
                      <Text style={[
                        styles.itemText,
                        isMatched && styles.itemTextHighlight,
                        !selectedLeft && !isMatched && styles.itemTextDisabled,
                      ]}>
                        {rightItem}
                      </Text>
                      {isMatched && <Text style={styles.connectLabel}>Connect</Text>}
                    </View>
                  </LinearGradient>
                </Pressable>
              </Animated.View>
            );
          })}
        </View>
      </View>

      {!submitted && (
        <Pressable
          style={[styles.submitButton, !canSubmit && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={!canSubmit}
        >
          <LinearGradient
            colors={canSubmit
              ? [colors.gold, colors.accent]
              : ['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)']
            }
            style={styles.submitGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={[
              styles.submitText,
              !canSubmit && styles.submitTextDisabled
            ]}>
              Check Answers
            </Text>
          </LinearGradient>
        </Pressable>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  prompt: {
    fontSize: 22,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing(4),
    lineHeight: 30,
    letterSpacing: -0.3,
  },
  matchContainer: {
    flexDirection: 'row',
    gap: spacing(2),
    marginBottom: spacing(4),
  },
  column: {
    flex: 1,
    gap: spacing(1.5),
  },
  item: {
    borderRadius: radii.md,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  itemSelected: {
    borderColor: colors.gold,
    shadowColor: colors.gold,
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  itemMatched: {
    borderColor: colors.success,
    shadowColor: colors.success,
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  itemDisabled: {
    opacity: 0.4,
  },
  itemGradient: {
    paddingVertical: spacing(2),
    paddingHorizontal: spacing(2),
  },
  itemContent: {
    alignItems: 'center',
  },
  itemText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
    lineHeight: 20,
  },
  itemTextHighlight: {
    color: colors.gold,
    fontWeight: '700',
  },
  itemTextDisabled: {
    color: colors.subtext,
  },
  connectLabel: {
    fontSize: 11,
    color: colors.success,
    textAlign: 'center',
    marginTop: spacing(0.5),
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  submitButton: {
    borderRadius: radii.lg,
    overflow: 'hidden',
    shadowColor: colors.gold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  submitButtonDisabled: {
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  submitGradient: {
    paddingVertical: spacing(4),
    paddingHorizontal: spacing(4),
    alignItems: 'center',
  },
  submitText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.goldText,
    letterSpacing: 0.3,
  },
  submitTextDisabled: {
    color: colors.subtext,
  },
});

export default MatchExercise;
