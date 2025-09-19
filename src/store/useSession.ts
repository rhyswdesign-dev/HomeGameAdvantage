/**
 * Session Store using Zustand
 * Manages current learning session state
 */

import { create } from 'zustand';
import { Item, Attempt, UserProgress } from '../types/domain';

interface SessionState {
  // Current session
  lessonId: string | null;
  items: Item[];
  currentItemIndex: number;
  attempts: Attempt[];
  lives: number;
  startTime: number;
  
  // Session results
  correctCount: number;
  totalAttempts: number;
  masteryGains: Record<string, number>;
  
  // Actions
  startSession: (lessonId: string, items: Item[]) => void;
  submitAnswer: (attempt: Attempt) => void;
  nextItem: () => void;
  endSession: () => SessionResults;
  loseLife: () => void;
  gainLife: () => void;
  reset: () => void;
}

interface SessionResults {
  lessonId: string;
  totalTime: number;
  correctCount: number;
  totalAttempts: number;
  xpEarned: number;
  masteryGains: Record<string, number>;
  completed: boolean;
}

const INITIAL_LIVES = 5;

export const useSession = create<SessionState>((set, get) => ({
  // Initial state
  lessonId: null,
  items: [],
  currentItemIndex: 0,
  attempts: [],
  lives: INITIAL_LIVES,
  startTime: 0,
  correctCount: 0,
  totalAttempts: 0,
  masteryGains: {},

  // Actions
  startSession: (lessonId: string, items: Item[]) => {
    console.log('🔧 Session: Starting session with', lessonId, 'and', items.length, 'items');
    console.log('🔧 Session: Items:', items);
    set({
      lessonId,
      items,
      currentItemIndex: 0,
      attempts: [],
      lives: INITIAL_LIVES,
      startTime: Date.now(),
      correctCount: 0,
      totalAttempts: 0,
      masteryGains: {}
    });
  },

  submitAnswer: (attempt: Attempt) => {
    const state = get();
    const newAttempts = [...state.attempts, attempt];
    const newTotalAttempts = state.totalAttempts + 1;
    const newCorrectCount = state.correctCount + (attempt.correct ? 1 : 0);
    
    // Calculate mastery gain for this item
    const masteryGain = attempt.correct ? 0.1 : 0.05; // Simple calculation
    const newMasteryGains = {
      ...state.masteryGains,
      [attempt.itemId]: (state.masteryGains[attempt.itemId] || 0) + masteryGain
    };

    set({
      attempts: newAttempts,
      totalAttempts: newTotalAttempts,
      correctCount: newCorrectCount,
      masteryGains: newMasteryGains
    });

    // Lose life if incorrect
    if (!attempt.correct) {
      get().loseLife();
    }
  },

  nextItem: () => {
    const state = get();
    if (state.currentItemIndex < state.items.length - 1) {
      set({ currentItemIndex: state.currentItemIndex + 1 });
    }
  },

  loseLife: () => {
    set(state => ({ lives: Math.max(0, state.lives - 1) }));
  },

  gainLife: () => {
    set(state => ({ lives: Math.min(INITIAL_LIVES, state.lives + 1) }));
  },

  endSession: (): SessionResults => {
    const state = get();
    const totalTime = Date.now() - state.startTime;
    const completed = state.currentItemIndex >= state.items.length - 1;
    const xpEarned = state.correctCount * 15 + (completed ? 25 : 0); // Bonus for completion
    
    return {
      lessonId: state.lessonId!,
      totalTime,
      correctCount: state.correctCount,
      totalAttempts: state.totalAttempts,
      xpEarned,
      masteryGains: state.masteryGains,
      completed
    };
  },

  reset: () => {
    set({
      lessonId: null,
      items: [],
      currentItemIndex: 0,
      attempts: [],
      lives: INITIAL_LIVES,
      startTime: 0,
      correctCount: 0,
      totalAttempts: 0,
      masteryGains: {}
    });
  }
}));