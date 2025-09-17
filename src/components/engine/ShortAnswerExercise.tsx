/**
 * Short Answer Exercise Component
 * Text input with case/whitespace normalization and hints
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable } from 'react-native';
import { Item } from '../../types/domain';
import { ExerciseCommonProps } from './OrderExercise';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/tokens';

export default function ShortAnswerExercise({ item, onResult, disabled = false }: ExerciseCommonProps): React.JSX.Element {
  const [userAnswer, setUserAnswer] = useState('');
  const [answered, setAnswered] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [startTime] = useState(Date.now());

  // Reset state when item changes
  useEffect(() => {
    setUserAnswer('');
    setAnswered(false);
    setAttempts(0);
    setShowHint(false);
  }, [item.id]); // Depend on item.id to reset when question changes

  const normalizeAnswer = (answer: string): string => {
    return answer.toLowerCase().trim().replace(/\s+/g, ' ');
  };

  const getAcceptableAnswers = (): string[] => {
    if (!item.answerText) return [];
    
    // Primary answer
    const answers = [item.answerText];
    
    // Add acceptable variations if defined in item
    if ((item as any).acceptableAnswers) {
      answers.push(...(item as any).acceptableAnswers);
    }
    
    // Add common variations for cocktail names
    if (item.answerText.includes(' ')) {
      // Add version without spaces
      answers.push(item.answerText.replace(/\s+/g, ''));
    }
    
    // Add version with "the" prefix for certain cocktails
    if (!item.answerText.toLowerCase().startsWith('the ')) {
      answers.push(`the ${item.answerText}`);
    }
    
    return answers.map(normalizeAnswer);
  };

  const checkAnswer = (): boolean => {
    const normalizedInput = normalizeAnswer(userAnswer);
    const acceptableAnswers = getAcceptableAnswers();
    
    return acceptableAnswers.some(answer => 
      normalizedInput === answer || 
      normalizedInput.includes(answer) ||
      answer.includes(normalizedInput)
    );
  };

  const handleSubmit = () => {
    if (answered || disabled || !userAnswer.trim()) return;
    
    const isCorrect = checkAnswer();
    const timeToAnswer = Date.now() - startTime;
    const newAttempts = attempts + 1;
    
    setAttempts(newAttempts);
    
    if (isCorrect) {
      setAnswered(true);
      setTimeout(() => {
        onResult({ correct: true, msToAnswer: timeToAnswer });
      }, 1000);
    } else {
      // Show hint after 2 failed attempts
      if (newAttempts >= 2) {
        setShowHint(true);
      }
      
      // After 3 attempts, mark as answered and show correct answer
      if (newAttempts >= 3) {
        setAnswered(true);
        setTimeout(() => {
          onResult({ correct: false, msToAnswer: timeToAnswer });
        }, 2000);
      }
    }
  };

  const handleRetry = () => {
    setUserAnswer('');
    // Don't reset attempts - keep building toward hint
  };

  const getHint = (): string => {
    if (!item.answerText) return '';
    
    const answer = item.answerText.toLowerCase();
    
    // Create a hint by showing first letter and length
    const firstLetter = answer.charAt(0).toUpperCase();
    const restLength = answer.length - 1;
    const dashes = '_'.repeat(restLength);
    
    return `${firstLetter}${dashes}`;
  };

  const getPlaceholder = (): string => {
    if (attempts === 0) {
      return 'Type your answer...';
    } else if (attempts === 1) {
      return 'Try again...';
    } else {
      return 'One more try...';
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.prompt}>{item.prompt}</Text>
      
      <View style={styles.inputContainer}>
        <TextInput
          style={[
            styles.input,
            answered && (checkAnswer() ? styles.correctInput : styles.incorrectInput)
          ]}
          value={userAnswer}
          onChangeText={setUserAnswer}
          placeholder={getPlaceholder()}
          placeholderTextColor="#999"
          editable={!answered && !disabled}
          autoCapitalize="none"
          autoCorrect={false}
          onSubmitEditing={handleSubmit}
          returnKeyType="done"
        />
        
        {!answered && (
          <Pressable
            style={[
              styles.submitButton,
              (!userAnswer.trim() || disabled) && styles.disabledButton
            ]}
            onPress={handleSubmit}
            disabled={!userAnswer.trim() || disabled}
          >
            <Text style={styles.submitButtonText}>
              {attempts === 0 ? 'Submit' : 'Try Again'}
            </Text>
          </Pressable>
        )}
      </View>

      {showHint && !answered && (
        <View style={styles.hintContainer}>
          <Text style={styles.hintLabel}>Hint:</Text>
          <Text style={styles.hintText}>{getHint()}</Text>
          <Text style={styles.hintSubtext}>
            {item.answerText?.length} letters
          </Text>
        </View>
      )}

      {answered && (
        <View style={styles.feedback}>
          <View style={styles.feedbackContent}>
            <Ionicons 
              name={checkAnswer() ? 'checkmark-circle' : 'close-circle'} 
              size={24} 
              color={checkAnswer() ? colors.success : colors.error} 
            />
            <Text style={[
              styles.feedbackText,
              checkAnswer() ? styles.correctText : styles.incorrectText
            ]}>
              {checkAnswer() ? 'Correct!' : 'Incorrect'}
            </Text>
          </View>
          
          {!checkAnswer() && (
            <View style={styles.correctAnswerContainer}>
              <Text style={styles.correctAnswerLabel}>Correct answer:</Text>
              <Text style={styles.correctAnswerText}>
                {item.answerText}
              </Text>
            </View>
          )}
          
          {!checkAnswer() && attempts < 3 && (
            <Pressable style={styles.retryButton} onPress={handleRetry}>
              <Text style={styles.retryButtonText}>Try Again</Text>
            </Pressable>
          )}
        </View>
      )}
      
      {attempts > 0 && !answered && (
        <View style={styles.attemptsContainer}>
          <Text style={styles.attemptsText}>
            Attempt {attempts} of 3
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  prompt: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 32,
    lineHeight: 28,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 24,
    gap: 16,
  },
  input: {
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    padding: 16,
    fontSize: 18,
    textAlign: 'center',
    backgroundColor: '#fff',
  },
  correctInput: {
    borderColor: '#4CAF50',
    backgroundColor: '#e8f5e8',
  },
  incorrectInput: {
    borderColor: '#f44336',
    backgroundColor: '#ffeaea',
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  hintContainer: {
    backgroundColor: '#fff3cd',
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: '#ffc107',
    alignItems: 'center',
  },
  hintLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#856404',
    marginBottom: 8,
  },
  hintText: {
    fontSize: 24,
    fontFamily: 'monospace',
    letterSpacing: 2,
    color: '#856404',
    marginBottom: 4,
  },
  hintSubtext: {
    fontSize: 12,
    color: '#856404',
  },
  feedback: {
    alignItems: 'center',
    gap: 12,
  },
  feedbackContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  feedbackText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  correctText: {
    color: '#4CAF50',
  },
  incorrectText: {
    color: '#f44336',
  },
  correctAnswerContainer: {
    alignItems: 'center',
    gap: 4,
  },
  correctAnswerLabel: {
    fontSize: 14,
    color: '#666',
  },
  correctAnswerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  retryButton: {
    backgroundColor: '#2196F3',
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  attemptsContainer: {
    alignItems: 'center',
    marginTop: 16,
  },
  attemptsText: {
    fontSize: 12,
    color: '#666',
  },
});