/**
 * Multiple Choice Question Exercise
 * Clean modern design with grid layout and images
 */

import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, Animated, Image } from 'react-native';
import { Item } from '../../types/domain';
import { ExerciseCommonProps } from './OrderExercise';
import { colors, spacing, radii } from '../../theme/tokens';
import { LinearGradient } from 'expo-linear-gradient';
import { getImageForText, shouldShowImages } from '../../utils/questionImageMapper';

export const MCQExercise: React.FC<ExerciseCommonProps> = ({ item, onResult }) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [startTime] = useState(Date.now());

  // Animation values
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const optionAnims = useRef(item.options?.map(() => new Animated.Value(1)) || []).current;

  // Reset state when item changes
  useEffect(() => {
    setSelectedOption(null);

    // Reset animations
    fadeAnim.setValue(0);
    optionAnims.forEach(anim => anim.setValue(0));

    // Start entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.stagger(60,
        optionAnims.map(anim =>
          Animated.spring(anim, {
            toValue: 1,
            tension: 80,
            friction: 8,
            useNativeDriver: true,
          })
        )
      ),
    ]).start();
  }, [item.id]);

  const handleOptionPress = (optionIndex: number) => {
    if (selectedOption !== null) return;

    setSelectedOption(optionIndex);

    const isCorrect = optionIndex === item.answerIndex;
    const timeToAnswer = Date.now() - startTime;

    setTimeout(() => {
      onResult({ correct: isCorrect, msToAnswer: timeToAnswer });
    }, 800);
  };

  const getOptionStyle = (optionIndex: number) => {
    if (selectedOption === null) {
      return styles.option;
    }

    if (optionIndex === selectedOption) {
      return [styles.option, styles.selectedOption];
    }

    return [styles.option, styles.unselectedOption];
  };

  // Check if we should show images for this question
  const showImages = shouldShowImages(item.prompt, item.options, item.tags);

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

      <View style={styles.optionsGrid}>
        {item.options?.map((option, index) => {
          const optionImage = showImages ? getImageForText(option) : null;

          return (
            <Animated.View
              key={index}
              style={[
                styles.optionWrapper,
                {
                  opacity: optionAnims[index],
                  transform: [{
                    scale: optionAnims[index],
                  }],
                },
              ]}
            >
              <Pressable
                style={({ pressed }) => [
                  getOptionStyle(index),
                  pressed && selectedOption === null && styles.optionPressed,
                ]}
                onPress={() => handleOptionPress(index)}
                disabled={selectedOption !== null}
              >
                <LinearGradient
                  colors={
                    selectedOption === index
                      ? ['rgba(215, 161, 94, 0.2)', 'rgba(228, 147, 62, 0.1)']
                      : ['rgba(255, 255, 255, 0.08)', 'rgba(255, 255, 255, 0.02)']
                  }
                  style={styles.optionGradient}
                >
                  {optionImage && (
                    <View style={styles.imageContainer}>
                      <Image
                        source={optionImage}
                        style={styles.optionImage}
                        resizeMode="cover"
                      />
                    </View>
                  )}
                  <Text style={[
                    styles.optionText,
                    selectedOption === index && styles.selectedOptionText,
                    optionImage && styles.optionTextWithImage
                  ]}>
                    {option}
                  </Text>
                </LinearGradient>
              </Pressable>
            </Animated.View>
          );
        })}
      </View>
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
    marginBottom: spacing(4),
    lineHeight: 30,
    textAlign: 'left',
    color: colors.text,
    letterSpacing: -0.3,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing(2),
  },
  optionWrapper: {
    width: '48%',
  },
  option: {
    borderRadius: radii.lg,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  selectedOption: {
    borderColor: colors.gold,
    shadowColor: colors.gold,
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  unselectedOption: {
    opacity: 0.5,
  },
  optionPressed: {
    transform: [{ scale: 0.97 }],
  },
  optionGradient: {
    padding: spacing(3),
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 100,
  },
  imageContainer: {
    width: '100%',
    height: 140,
    borderRadius: radii.md,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    marginBottom: spacing(2),
  },
  optionImage: {
    width: '100%',
    height: '100%',
  },
  optionText: {
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '600',
    color: colors.text,
    lineHeight: 20,
  },
  optionTextWithImage: {
    fontSize: 13,
    marginTop: spacing(0.5),
  },
  selectedOptionText: {
    color: colors.gold,
    fontWeight: '700',
  },
});
