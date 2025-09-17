/**
 * Multiple Choice Question Exercise
 */

import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, Animated } from 'react-native';
import { Item } from '../../types/domain';
import { ExerciseCommonProps } from './OrderExercise';
import { colors, spacing, radii } from '../../theme/tokens';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

export const MCQExercise: React.FC<ExerciseCommonProps> = ({ item, onResult }) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [startTime] = useState(Date.now());
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const optionAnims = useRef(item.options?.map(() => new Animated.Value(0)) || []).current;

  // Reset state when item changes
  useEffect(() => {
    setSelectedOption(null);
    setAnswered(false);
    
    // Reset animations
    fadeAnim.setValue(0);
    optionAnims.forEach(anim => anim.setValue(0));
    
    // Start entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.stagger(100, 
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
  }, [item.id]); // Depend on item.id to reset when question changes

  const handleOptionPress = (optionIndex: number) => {
    if (answered) return;
    
    setSelectedOption(optionIndex);
    setAnswered(true);
    
    const isCorrect = optionIndex === item.answerIndex;
    const timeToAnswer = Date.now() - startTime;
    
    // Animate selection feedback
    Animated.spring(optionAnims[optionIndex], {
      toValue: 0.95,
      tension: 300,
      friction: 10,
      useNativeDriver: true,
    }).start(() => {
      Animated.spring(optionAnims[optionIndex], {
        toValue: 1,
        tension: 300,
        friction: 10,
        useNativeDriver: true,
      }).start();
    });
    
    setTimeout(() => {
      onResult({ correct: isCorrect, msToAnswer: timeToAnswer });
    }, 1000); // Show feedback for 1 second
  };

  const getOptionStyle = (optionIndex: number) => {
    if (!answered) {
      return styles.option;
    }
    
    if (optionIndex === item.answerIndex) {
      return [styles.option, styles.correctOption];
    }
    
    if (optionIndex === selectedOption && optionIndex !== item.answerIndex) {
      return [styles.option, styles.incorrectOption];
    }
    
    return [styles.option, styles.disabledOption];
  };

  const getOptionGradient = (optionIndex: number) => {
    if (!answered) {
      return ['rgba(255, 255, 255, 0.08)', 'rgba(255, 255, 255, 0.02)'];
    }
    
    if (optionIndex === item.answerIndex) {
      return ['rgba(76, 175, 80, 0.2)', 'rgba(76, 175, 80, 0.05)'];
    }
    
    if (optionIndex === selectedOption && optionIndex !== item.answerIndex) {
      return ['rgba(244, 67, 54, 0.2)', 'rgba(244, 67, 54, 0.05)'];
    }
    
    return ['rgba(255, 255, 255, 0.03)', 'rgba(255, 255, 255, 0.01)'];
  };

  const getOptionTextStyle = (optionIndex: number) => {
    if (!answered) return {};
    
    if (optionIndex === item.answerIndex) {
      return { color: colors.success, fontWeight: '700' };
    }
    
    if (optionIndex === selectedOption && optionIndex !== item.answerIndex) {
      return { color: colors.error, fontWeight: '700' };
    }
    
    return { opacity: 0.6 };
  };

  return (
    <Animated.View 
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{
            translateY: fadeAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [20, 0],
            }),
          }],
        },
      ]}
    >
      <Text style={styles.prompt}>{item.prompt}</Text>
      
      <View style={styles.optionsContainer}>
        {item.options?.map((option, index) => (
          <Animated.View
            key={index}
            style={{
              opacity: optionAnims[index],
              transform: [{
                translateY: optionAnims[index].interpolate({
                  inputRange: [0, 1],
                  outputRange: [30, 0],
                }),
              }, {
                scale: optionAnims[index],
              }],
            }}
          >
            <Pressable
              style={({ pressed }) => [
                getOptionStyle(index),
                pressed && !answered && styles.optionPressed,
              ]}
              onPress={() => handleOptionPress(index)}
              disabled={answered}
            >
              <LinearGradient
                colors={getOptionGradient(index)}
                style={styles.optionGradient}
              >
                <Text style={[styles.optionText, getOptionTextStyle(index)]}>
                  {option}
                </Text>
              </LinearGradient>
            </Pressable>
          </Animated.View>
        ))}
      </View>
      
      {answered && (
        <Animated.View 
          style={[
            styles.feedback,
            {
              opacity: fadeAnim,
              transform: [{
                scale: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.8, 1],
                }),
              }],
            },
          ]}
        >
          <View style={styles.feedbackContent}>
            <Ionicons 
              name={selectedOption === item.answerIndex ? 'checkmark-circle' : 'fitness'} 
              size={24} 
              color={selectedOption === item.answerIndex ? colors.success : colors.gold} 
            />
            <Text style={[
              styles.feedbackText,
              selectedOption === item.answerIndex ? styles.correctText : styles.incorrectText
            ]}>
              {selectedOption === item.answerIndex ? 'Perfect!' : 'Almost there!'}
            </Text>
          </View>
        </Animated.View>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  prompt: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: spacing(4),
    lineHeight: 32,
    textAlign: 'center',
    color: colors.text,
    letterSpacing: -0.3,
  },
  optionsContainer: {
    gap: spacing(2),
  },
  option: {
    borderRadius: radii.lg,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  optionPressed: {
    transform: [{ scale: 0.98 }],
  },
  optionGradient: {
    padding: spacing(3),
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 60,
  },
  correctOption: {
    borderColor: colors.success,
    shadowColor: colors.success,
    shadowOpacity: 0.3,
  },
  incorrectOption: {
    borderColor: colors.error,
    shadowColor: colors.error,
    shadowOpacity: 0.3,
  },
  disabledOption: {
    opacity: 0.4,
  },
  optionText: {
    fontSize: 18,
    textAlign: 'center',
    fontWeight: '600',
    color: colors.text,
    lineHeight: 24,
  },
  feedback: {
    marginTop: spacing(4),
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: radii.lg,
    padding: spacing(3),
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  feedbackContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing(1),
  },
  feedbackText: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
  },
  correctText: {
    color: colors.success,
  },
  incorrectText: {
    color: colors.error,
  },
});