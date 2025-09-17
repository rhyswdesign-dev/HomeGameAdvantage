/**
 * Lesson Engine Component
 * Main component for running lessons with exercises
 */

import React, { useEffect, useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Alert, 
  Animated, 
  StatusBar,
  Platform,
  Pressable
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSession } from '../../store/useSession';
import { MemoryContentRepository } from '../../repos/memory/contentRepository';
import { MCQExercise } from './MCQExercise';
import OrderExercise from './OrderExercise';
import ShortAnswerExercise from './ShortAnswerExercise';
import { Item, Attempt } from '../../types/domain';
import { colors, spacing, radii } from '../../theme/tokens';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

interface LessonEngineProps {
  lessonId: string;
  onComplete?: (results: any) => void;
  onExit?: () => void;
}

const contentRepo = new MemoryContentRepository();

export const LessonEngine: React.FC<LessonEngineProps> = ({ lessonId, onComplete, onExit }) => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [lastResult, setLastResult] = useState<{ correct: boolean; msToAnswer: number } | null>(null);
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const feedbackAnim = useRef(new Animated.Value(0)).current;
  const heartPulseAnim = useRef(new Animated.Value(1)).current;
  
  const {
    items,
    currentItemIndex,
    lives,
    startSession,
    submitAnswer,
    nextItem,
    endSession,
    reset
  } = useSession();

  const currentItem = items[currentItemIndex];
  const isLastItem = currentItemIndex >= items.length - 1;

  useEffect(() => {
    StatusBar.setBarStyle('light-content', true);
    loadLesson();
    return () => reset(); // Cleanup on unmount
  }, [lessonId]);

  // Animate progress bar when currentItemIndex changes
  useEffect(() => {
    if (items.length > 0) {
      const targetProgress = (currentItemIndex + 1) / items.length;
      Animated.timing(progressAnim, {
        toValue: targetProgress,
        duration: 800,
        useNativeDriver: false,
      }).start();
    }
  }, [currentItemIndex, items.length]);

  // Initial entrance animation
  useEffect(() => {
    if (!loading && !error) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 1,
          tension: 80,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [loading, error]);

  // Heart pulse animation for lives
  useEffect(() => {
    const createPulse = () => {
      Animated.sequence([
        Animated.timing(heartPulseAnim, {
          toValue: 1.1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(heartPulseAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ]).start(() => {
        if (lives > 0) {
          setTimeout(createPulse, 2000);
        }
      });
    };
    
    if (lives > 0) {
      createPulse();
    }
  }, [lives]);

  const loadLesson = async () => {
    try {
      setLoading(true);
      const lesson = await contentRepo.getLesson(lessonId);
      
      if (!lesson) {
        setError('Lesson not found');
        return;
      }

      const lessonItems = await contentRepo.getItemsForLesson(lessonId);
      
      if (lessonItems.length === 0) {
        setError('No items found for this lesson');
        return;
      }

      startSession(lessonId, lessonItems);
    } catch (err) {
      setError('Failed to load lesson');
      console.error('Lesson loading error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (result: { correct: boolean; msToAnswer: number }) => {
    if (!currentItem) return;

    const attempt: Attempt = {
      id: `${Date.now()}_${Math.random()}`,
      userId: 'current_user', // TODO: Get from user store
      itemId: currentItem.id,
      correct: result.correct,
      msToAnswer: result.msToAnswer,
      timestamp: Date.now(),
      exerciseType: currentItem.type
    };

    setLastResult(result);
    setShowFeedback(true);
    submitAnswer(attempt);

    // Animate feedback
    Animated.sequence([
      Animated.spring(feedbackAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.timing(feedbackAnim, {
        toValue: 0,
        duration: 300,
        delay: 1200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowFeedback(false);
      setLastResult(null);
      
      // Smooth transition to next item
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        if (isLastItem) {
          completeLesson();
        } else {
          nextItem();
          
          // Animate in new item
          Animated.spring(slideAnim, {
            toValue: 1,
            tension: 80,
            friction: 8,
            useNativeDriver: true,
          }).start();
        }
      });
    });
  };

  const completeLesson = () => {
    const results = endSession();
    
    // Navigate to results screen (will be handled by parent component)
    if (onComplete) {
      onComplete(results);
    }
  };

  const handleOutOfLives = () => {
    Alert.alert(
      'Out of Lives!',
      'You\'re out of lives for this session. What would you like to do?',
      [
        {
          text: 'Buy Life (50 XP)',
          onPress: () => {
            // TODO: Implement XP spending
            console.log('Buy life with XP');
          }
        },
        {
          text: 'Watch Ad',
          onPress: () => {
            // TODO: Implement ad watching
            console.log('Show rewarded ad');
          }
        },
        {
          text: 'End Session',
          onPress: completeLesson,
          style: 'destructive'
        }
      ]
    );
  };

  useEffect(() => {
    if (lives <= 0) {
      handleOutOfLives();
    }
  }, [lives]);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading lesson...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!currentItem) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No current item</Text>
      </View>
    );
  }

  const renderExercise = () => {
    // Validate exercise data
    if (!currentItem.type) {
      console.error('Item missing type:', currentItem);
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Exercise missing type</Text>
          <Text style={styles.errorSubtext}>Item ID: {currentItem.id}</Text>
        </View>
      );
    }

    switch (currentItem.type) {
      case 'mcq':
        if (!currentItem.options || !currentItem.options.length) {
          console.error('MCQ item missing options:', currentItem);
          return (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>Multiple choice question missing options</Text>
            </View>
          );
        }
        return (
          <MCQExercise
            item={currentItem}
            onResult={handleAnswer}
          />
        );
      case 'order':
        if (!currentItem.orderTarget || !currentItem.orderTarget.length) {
          console.error('Order item missing orderTarget:', currentItem);
          return (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>Order exercise missing target sequence</Text>
            </View>
          );
        }
        return (
          <OrderExercise
            item={currentItem}
            onResult={handleAnswer}
          />
        );
      case 'short':
        if (!currentItem.answerText) {
          console.error('Short answer item missing answerText:', currentItem);
          return (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>Short answer question missing answer</Text>
            </View>
          );
        }
        return (
          <ShortAnswerExercise
            item={currentItem}
            onResult={handleAnswer}
          />
        );
      default:
        console.error('Unsupported exercise type:', currentItem.type, 'for item:', currentItem);
        return (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Unsupported question type: {currentItem.type}</Text>
            <Text style={styles.errorSubtext}>Supported types: mcq, order, short</Text>
          </View>
        );
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* Luxury gradient background */}
      <LinearGradient
        colors={[colors.bg, '#1A0F0B', colors.card]}
        style={StyleSheet.absoluteFillObject}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      {/* Enhanced Header */}
      <View style={styles.header}>
        {/* Exit Button */}
        <Pressable
          style={styles.exitButton}
          onPress={() => {
            Alert.alert(
              'Exit Lesson',
              'Are you sure you want to exit? Your progress will be saved.',
              [
                { text: 'Continue', style: 'cancel' },
                { text: 'Exit', style: 'destructive', onPress: () => onExit?.() },
              ]
            );
          }}
        >
          <Ionicons name="close" size={24} color={colors.text} />
        </Pressable>

        {/* Animated Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <Animated.View 
              style={[
                styles.progressFill,
                {
                  width: progressAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0%', '100%'],
                  }),
                },
              ]} 
            />
          </View>
          <Text style={styles.progressText}>
            {currentItemIndex + 1} of {items.length}
          </Text>
        </View>

        {/* Animated Lives */}
        <View style={styles.livesContainer}>
          {Array.from({ length: 5 }, (_, i) => (
            <Animated.View
              key={i}
              style={[
                styles.heart,
                {
                  opacity: i < lives ? 1 : 0.3,
                  transform: i < lives ? [{ scale: heartPulseAnim }] : [{ scale: 1 }],
                },
              ]}
            >
              <Ionicons name="heart" size={18} color="#FF6B6B" />
            </Animated.View>
          ))}
        </View>
      </View>

      {/* Exercise Content with Animations */}
      <Animated.View 
        style={[
          styles.exerciseContainer,
          {
            opacity: fadeAnim,
            transform: [
              {
                translateY: slideAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [30, 0],
                }),
              },
              {
                scale: slideAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.95, 1],
                }),
              },
            ],
          },
        ]}
      >
        <View style={styles.exerciseCard}>
          {renderExercise()}
        </View>
      </Animated.View>

      {/* Feedback Overlay */}
      {showFeedback && lastResult && (
        <Animated.View
          style={[
            styles.feedbackOverlay,
            {
              opacity: feedbackAnim,
              transform: [
                {
                  scale: feedbackAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.8, 1],
                  }),
                },
              ],
            },
          ]}
        >
          <View style={[
            styles.feedbackCard,
            lastResult.correct ? styles.correctFeedback : styles.incorrectFeedback
          ]}>
            <View style={styles.feedbackIcon}>
              <Ionicons 
                name={lastResult.correct ? 'checkmark-circle' : 'fitness'} 
                size={48} 
                color={lastResult.correct ? colors.success : colors.gold} 
              />
            </View>
            <Text style={styles.feedbackText}>
              {lastResult.correct ? 'Perfect!' : 'Keep trying!'}
            </Text>
            <Text style={styles.feedbackSubtext}>
              {lastResult.correct 
                ? `Answered in ${(lastResult.msToAnswer / 1000).toFixed(1)}s`
                : 'You\'ll get it next time!'
              }
            </Text>
          </View>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing(2),
    paddingTop: Platform.OS === 'ios' ? spacing(6) : spacing(3),
    paddingBottom: spacing(2),
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  exitButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing(2),
  },
  progressContainer: {
    flex: 1,
    marginRight: spacing(2),
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 4,
    marginBottom: spacing(1),
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.gold,
    borderRadius: 4,
    shadowColor: colors.gold,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: colors.subtext,
    textAlign: 'center',
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  livesContainer: {
    flexDirection: 'row',
    gap: spacing(1),
  },
  heart: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  exerciseContainer: {
    flex: 1,
    padding: spacing(3),
    justifyContent: 'center',
  },
  exerciseCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: radii.xl,
    padding: spacing(3),
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 8,
  },
  loadingText: {
    textAlign: 'center',
    fontSize: 18,
    color: colors.text,
    marginTop: 100,
    fontWeight: '600',
  },
  errorText: {
    textAlign: 'center',
    fontSize: 18,
    color: colors.error,
    marginTop: 100,
    fontWeight: '600',
  },
  feedbackOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  feedbackCard: {
    backgroundColor: colors.card,
    borderRadius: radii.xl,
    padding: spacing(4),
    alignItems: 'center',
    borderWidth: 2,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.4,
    shadowRadius: 24,
    elevation: 12,
    minWidth: 200,
  },
  correctFeedback: {
    borderColor: colors.success,
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
  },
  incorrectFeedback: {
    borderColor: colors.error,
    backgroundColor: 'rgba(244, 67, 54, 0.1)',
  },
  feedbackIcon: {
    marginBottom: spacing(2),
    alignItems: 'center',
    justifyContent: 'center',
  },
  feedbackText: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing(1),
    textAlign: 'center',
  },
  feedbackSubtext: {
    fontSize: 16,
    color: colors.subtext,
    textAlign: 'center',
    fontWeight: '500',
  },
  errorContainer: {
    backgroundColor: 'rgba(244, 67, 54, 0.1)',
    borderRadius: radii.lg,
    padding: spacing(3),
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.error,
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.error,
    textAlign: 'center',
    marginBottom: spacing(1),
  },
  errorSubtext: {
    fontSize: 14,
    color: colors.error,
    textAlign: 'center',
    opacity: 0.8,
  },
});