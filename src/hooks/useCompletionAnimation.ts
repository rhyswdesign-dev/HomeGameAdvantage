/**
 * Hook for managing completion animations
 * Provides state and logic for celebration animations
 */

import { useState, useCallback } from 'react';

export type CompletionAnimationType = 
  | 'question_correct' 
  | 'lesson_complete' 
  | 'perfect_score' 
  | 'first_lesson' 
  | 'streak' 
  | 'level_up';

interface CompletionAnimationState {
  isVisible: boolean;
  type: CompletionAnimationType;
  message?: string;
  score?: number;
  xpAwarded?: number;
}

export const useCompletionAnimation = () => {
  const [animationState, setAnimationState] = useState<CompletionAnimationState>({
    isVisible: false,
    type: 'lesson_complete'
  });

  const showAnimation = useCallback((
    type: CompletionAnimationType,
    options?: {
      message?: string;
      score?: number;
      xpAwarded?: number;
    }
  ) => {
    setAnimationState({
      isVisible: true,
      type,
      ...options
    });
  }, []);

  const hideAnimation = useCallback(() => {
    setAnimationState(prev => ({
      ...prev,
      isVisible: false
    }));
  }, []);

  const showLessonComplete = useCallback((score: number, xpAwarded: number) => {
    let type: CompletionAnimationType = 'lesson_complete';
    let message = 'Lesson completed successfully!';

    if (score === 100) {
      type = 'perfect_score';
      message = 'Outstanding! Perfect score achieved!';
    } else if (score >= 90) {
      type = 'lesson_complete';
      message = 'Excellent work! Well done!';
    } else if (score >= 70) {
      type = 'lesson_complete';
      message = 'Good job! Keep it up!';
    } else {
      type = 'lesson_complete';
      message = 'Lesson completed! Practice makes perfect!';
    }

    showAnimation(type, { message, score, xpAwarded });
  }, [showAnimation]);

  const showQuestionCorrect = useCallback((timeToAnswer?: number) => {
    let message = 'Correct! Well done!';
    
    if (timeToAnswer && timeToAnswer < 3000) {
      message = 'Lightning fast! Excellent!';
    } else if (timeToAnswer && timeToAnswer < 5000) {
      message = 'Quick thinking! Great job!';
    }

    showAnimation('question_correct', { message });
  }, [showAnimation]);

  const showStreak = useCallback((streakCount: number) => {
    showAnimation('streak', { 
      message: `${streakCount} in a row! You're on fire!` 
    });
  }, [showAnimation]);

  const showFirstLesson = useCallback(() => {
    showAnimation('first_lesson', {
      message: 'Welcome to your bartending journey!'
    });
  }, [showAnimation]);

  const showLevelUp = useCallback((newLevel: number) => {
    showAnimation('level_up', {
      message: `Congratulations! You've reached level ${newLevel}!`
    });
  }, [showAnimation]);

  return {
    ...animationState,
    showAnimation,
    hideAnimation,
    showLessonComplete,
    showQuestionCorrect,
    showStreak,
    showFirstLesson,
    showLevelUp
  };
};

export default useCompletionAnimation;