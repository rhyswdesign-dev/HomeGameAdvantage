/**
 * Checkbox Exercise Component
 * Multiple selection quiz for lesson engine
 */

import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors, fonts, radii, spacing } from '../../theme/tokens';
import { Item } from '../../types/domain';

interface CheckboxExerciseProps {
  item: Item;
  onResult: (result: { correct: boolean; msToAnswer: number }) => void;
}

export const CheckboxExercise: React.FC<CheckboxExerciseProps> = ({ item, onResult }) => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [startTime] = useState(Date.now());

  const handleOptionPress = (option: string) => {
    setSelectedOptions(prev => {
      if (prev.includes(option)) {
        return prev.filter(o => o !== option);
      } else {
        return [...prev, option];
      }
    });
  };

  const handleSubmit = () => {
    const msToAnswer = Date.now() - startTime;
    const correctAnswers = item.correct || [];
    
    // Check if selected options match correct answers exactly
    const selectedSet = new Set(selectedOptions);
    const correctSet = new Set(correctAnswers);
    
    const isCorrect = selectedSet.size === correctSet.size && 
      [...selectedSet].every(option => correctSet.has(option));

    onResult({
      correct: isCorrect,
      msToAnswer
    });
  };

  const isOptionSelected = (option: string) => selectedOptions.includes(option);
  const canSubmit = selectedOptions.length > 0;

  return (
    <View style={styles.container}>
      <Text style={styles.prompt}>{item.prompt}</Text>
      
      <View style={styles.optionsContainer}>
        {item.options?.map((option, index) => {
          const isSelected = isOptionSelected(option);
          
          return (
            <Pressable
              key={index}
              style={[styles.optionButton, isSelected && styles.optionButtonSelected]}
              onPress={() => handleOptionPress(option)}
            >
              <LinearGradient
                colors={isSelected 
                  ? [colors.accent, '#B8860B'] 
                  : [colors.card, '#2B1B12']
                }
                style={styles.optionGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.optionContent}>
                  <Ionicons 
                    name={isSelected ? "checkbox" : "square-outline"} 
                    size={20} 
                    color={isSelected ? colors.bg : colors.subtext} 
                  />
                  <Text style={[
                    styles.optionText,
                    isSelected && styles.optionTextSelected
                  ]}>
                    {option}
                  </Text>
                </View>
              </LinearGradient>
            </Pressable>
          );
        })}
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
  optionsContainer: {
    gap: spacing(2),
    marginBottom: spacing(4),
  },
  optionButton: {
    borderRadius: radii.lg,
    overflow: 'hidden',
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  optionButtonSelected: {
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  optionGradient: {
    padding: spacing(3),
    borderRadius: radii.lg,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing(2),
  },
  optionText: {
    flex: 1,
    fontSize: fonts.h3,
    fontWeight: '500',
    color: colors.text,
  },
  optionTextSelected: {
    color: colors.bg,
    fontWeight: '600',
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

export default CheckboxExercise;