/**
 * Survey Component for Onboarding
 * Handles the 15-question placement survey
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Image, Platform } from 'react-native';
import { getSurveyQuestions, getPlacement } from '../../services/placement';
import { SurveyAnswers } from '../../services/placement';
import { colors, spacing, radii } from '../../theme/tokens';
import { Ionicons } from '@expo/vector-icons';

interface SurveyProps {
  onComplete: (answers: SurveyAnswers) => void;
}

// Order Question Component for drag-and-drop ordering
const OrderQuestion: React.FC<{
  question: any;
  answer: string[];
  onAnswer: (value: string[]) => void;
  onNext: () => void;
  canProceed: boolean;
  isLastQuestion: boolean;
}> = ({ question, answer, onAnswer, onNext, canProceed, isLastQuestion }) => {
  const [currentOrder, setCurrentOrder] = useState<string[]>(answer || []);

  useEffect(() => {
    if (!answer || answer.length === 0) {
      // Initialize with randomized order
      const shuffled = [...question.options.map((opt: any) => opt.value)].sort(() => Math.random() - 0.5);
      setCurrentOrder(shuffled);
    } else {
      setCurrentOrder(answer);
    }
  }, [question.id]);

  const moveItem = (fromIndex: number, toIndex: number) => {
    const newOrder = [...currentOrder];
    const [movedItem] = newOrder.splice(fromIndex, 1);
    newOrder.splice(toIndex, 0, movedItem);
    setCurrentOrder(newOrder);
    onAnswer(newOrder);
  };

  const getOptionLabel = (value: string) => {
    const option = question.options.find((opt: any) => opt.value === value);
    return option ? option.label : value;
  };

  return (
    <View style={styles.orderContainer}>
      <Text style={styles.orderInstructions}>
        Drag items to reorder them, or tap the arrows to move items up and down.
      </Text>
      
      <View style={styles.orderList}>
        {currentOrder.map((item, index) => (
          <View key={item} style={styles.orderItem}>
            <View style={styles.orderItemContent}>
              <Text style={styles.orderNumber}>{index + 1}</Text>
              <Text style={styles.orderItemText}>{getOptionLabel(item)}</Text>
              <View style={styles.orderControls}>
                {index > 0 && (
                  <Pressable
                    style={styles.orderButton}
                    onPress={() => moveItem(index, index - 1)}
                  >
                    <Ionicons name="chevron-up" size={20} color={colors.gold} />
                  </Pressable>
                )}
                {index < currentOrder.length - 1 && (
                  <Pressable
                    style={styles.orderButton}
                    onPress={() => moveItem(index, index + 1)}
                  >
                    <Ionicons name="chevron-down" size={20} color={colors.gold} />
                  </Pressable>
                )}
              </View>
            </View>
          </View>
        ))}
      </View>

      <Pressable
        style={[styles.nextButton, !canProceed && styles.disabledButton]}
        onPress={onNext}
        disabled={!canProceed}
      >
        <Text style={styles.nextButtonText}>
          {isLastQuestion ? 'Complete Survey' : 'Next Question'}
        </Text>
      </Pressable>
    </View>
  );
};

export const Survey: React.FC<SurveyProps> = ({ onComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<SurveyAnswers>({});
  
  const questions = getSurveyQuestions();
  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  const handleAnswer = (value: string | string[]) => {
    const newAnswers = {
      ...answers,
      [currentQuestion.id]: value
    };
    setAnswers(newAnswers);

    // Auto-advance for single-select questions
    if (currentQuestion.type === 'mcq' || currentQuestion.type === 'image-mcq') {
      setTimeout(() => {
        if (isLastQuestion) {
          onComplete(newAnswers);
        } else {
          setCurrentQuestionIndex(prev => prev + 1);
        }
      }, 500);
    }
  };

  const handleMultiSelectAnswer = (value: string) => {
    const currentAnswers = (answers[currentQuestion.id] as string[]) || [];
    let newAnswers: string[];
    
    if (currentAnswers.includes(value)) {
      newAnswers = currentAnswers.filter(v => v !== value);
    } else {
      newAnswers = [...currentAnswers, value];
    }
    
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: newAnswers
    }));
  };

  const canProceed = () => {
    const answer = answers[currentQuestion.id];
    if (!answer) return false;
    
    if (currentQuestion.type === 'multi-select') {
      return Array.isArray(answer) && answer.length > 0;
    }
    
    return true;
  };

  const handleNext = () => {
    if (isLastQuestion) {
      onComplete(answers);
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const renderQuestion = () => {
    const currentAnswer = answers[currentQuestion.id];
    
    switch (currentQuestion.type) {
      case 'mcq':
        return (
          <View style={styles.optionsContainer}>
            {currentQuestion.options.map((option, index) => (
              <Pressable
                key={option.value}
                style={[
                  styles.option,
                  currentAnswer === option.value && styles.selectedOption
                ]}
                onPress={() => handleAnswer(option.value)}
              >
                <Text style={[
                  styles.optionText,
                  currentAnswer === option.value && styles.selectedOptionText
                ]}>
                  {option.label}
                </Text>
              </Pressable>
            ))}
          </View>
        );

      case 'image-mcq':
        return (
          <View style={styles.optionsContainer}>
            {currentQuestion.options.map((option, index) => (
              <Pressable
                key={option.value}
                style={[
                  styles.imageOption,
                  currentAnswer === option.value && styles.selectedOption
                ]}
                onPress={() => handleAnswer(option.value)}
              >
                <View style={styles.imageContainer}>
                  <View style={[styles.glassDiagram, getGlassStyle(option.value)]}>
                    <Text style={styles.glassLabel}>{option.label}</Text>
                  </View>
                </View>
                <Text style={[
                  styles.optionText,
                  currentAnswer === option.value && styles.selectedOptionText
                ]}>
                  {option.label}
                </Text>
              </Pressable>
            ))}
          </View>
        );
        
      case 'multi-select':
        const multiAnswers = (currentAnswer as string[]) || [];
        return (
          <View style={styles.optionsContainer}>
            {currentQuestion.options.map((option) => (
              <Pressable
                key={option.value}
                style={[
                  styles.option,
                  multiAnswers.includes(option.value) && styles.selectedOption
                ]}
                onPress={() => handleMultiSelectAnswer(option.value)}
              >
                <View style={styles.multiSelectContent}>
                  <View style={[styles.checkbox, multiAnswers.includes(option.value) && styles.checkedBox]}>
                    {multiAnswers.includes(option.value) && (
                      <Ionicons name="checkmark" size={16} color={colors.goldText} />
                    )}
                  </View>
                  <Text style={[
                    styles.optionText,
                    multiAnswers.includes(option.value) && styles.selectedOptionText
                  ]}>
                    {option.label}
                  </Text>
                </View>
              </Pressable>
            ))}
            
            {currentQuestion.type === 'multi-select' && (
              <Pressable
                style={[styles.nextButton, !canProceed() && styles.disabledButton]}
                onPress={handleNext}
                disabled={!canProceed()}
              >
                <Text style={styles.nextButtonText}>
                  {isLastQuestion ? 'Complete Survey' : 'Next Question'}
                </Text>
              </Pressable>
            )}
          </View>
        );

      case 'order':
        return <OrderQuestion 
          question={currentQuestion} 
          answer={currentAnswer as string[]} 
          onAnswer={handleAnswer}
          onNext={handleNext}
          canProceed={canProceed()}
          isLastQuestion={isLastQuestion}
        />;
        
      default:
        return <Text>Unsupported question type: {currentQuestion.type}</Text>;
    }
  };

  const getGlassStyle = (glassType: string) => {
    switch (glassType) {
      case 'coupe':
        return { borderRadius: 50, height: 80, backgroundColor: colors.gold + '20' };
      case 'martini':
        return { borderRadius: 0, height: 80, clipPath: 'polygon(20% 100%, 80% 100%, 50% 0%)', backgroundColor: colors.accent + '20' };
      case 'rocks':
        return { borderRadius: 8, height: 60, backgroundColor: colors.primary + '20' };
      case 'highball':
        return { borderRadius: 8, height: 100, backgroundColor: colors.secondary + '20' };
      default:
        return { borderRadius: 8, height: 80, backgroundColor: colors.card };
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.progressText}>
            Question {currentQuestionIndex + 1} of {questions.length}
          </Text>
          <Pressable
            style={styles.skipButton}
            onPress={() => onComplete({})}
          >
            <Text style={styles.skipButtonText}>Skip Survey</Text>
          </Pressable>
        </View>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill,
              { width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }
            ]}
          />
        </View>
      </View>
      
      <View style={styles.content}>
        <Text style={styles.sectionTitle}>{currentQuestion.section}</Text>
        <Text style={styles.questionText}>{currentQuestion.question}</Text>
        {renderQuestion()}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? spacing(6) : spacing(4), // Platform-specific top padding
    paddingHorizontal: spacing(3),
    paddingBottom: spacing(3),
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    backgroundColor: colors.card,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing(1),
  },
  skipButton: {
    paddingHorizontal: spacing(2),
    paddingVertical: spacing(1),
    borderRadius: radii.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  skipButtonText: {
    fontSize: 12,
    color: colors.subtext,
    fontWeight: '600',
  },
  progressText: {
    fontSize: 14,
    color: colors.subtext,
    fontWeight: '500',
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.gold,
    borderRadius: 4,
  },
  content: {
    padding: spacing(3),
    flex: 1,
  },
  sectionTitle: {
    fontSize: 12,
    color: colors.gold,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: spacing(1),
    fontWeight: '700',
  },
  questionText: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: spacing(3),
    lineHeight: 32,
    color: colors.text,
    letterSpacing: -0.3,
  },
  optionsContainer: {
    gap: spacing(2),
  },
  option: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: radii.lg,
    padding: spacing(2.5),
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  selectedOption: {
    backgroundColor: colors.gold + '20',
    borderColor: colors.gold,
    shadowColor: colors.gold,
    shadowOpacity: 0.3,
  },
  optionText: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '500',
    lineHeight: 22,
  },
  selectedOptionText: {
    color: colors.gold,
    fontWeight: '700',
  },
  // Image MCQ styles
  imageOption: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: radii.lg,
    padding: spacing(2),
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
  },
  imageContainer: {
    marginBottom: spacing(1),
  },
  glassDiagram: {
    width: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing(1),
  },
  glassLabel: {
    fontSize: 10,
    color: colors.subtext,
    textAlign: 'center',
  },
  // Multi-select styles
  multiSelectContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing(2),
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkedBox: {
    backgroundColor: colors.gold,
    borderColor: colors.gold,
  },
  // Order question styles
  orderContainer: {
    gap: spacing(2),
  },
  orderInstructions: {
    fontSize: 14,
    color: colors.subtext,
    marginBottom: spacing(2),
    textAlign: 'center',
    fontStyle: 'italic',
  },
  orderList: {
    gap: spacing(1.5),
  },
  orderItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  orderItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing(2),
    gap: spacing(2),
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.gold,
    minWidth: 24,
    textAlign: 'center',
  },
  orderItemText: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    fontWeight: '500',
  },
  orderControls: {
    flexDirection: 'row',
    gap: spacing(1),
  },
  orderButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextButton: {
    backgroundColor: colors.gold,
    borderRadius: radii.lg,
    padding: spacing(2.5),
    marginTop: spacing(3),
    alignItems: 'center',
    shadowColor: colors.gold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  disabledButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    shadowOpacity: 0,
  },
  nextButtonText: {
    color: colors.goldText,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});