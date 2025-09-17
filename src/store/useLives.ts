/**
 * Lives Store using Zustand
 * Manages hearts/lives system for monetization
 */

import { create } from 'zustand';

export type LivesState = {
  lives: number;
  maxLives: number;
  refillAt?: number;
};

interface LivesStore extends LivesState {
  loseLife: () => void;
  addLife: (n?: number) => void;
  canContinue: () => boolean;
  setRefillTimer: (hours: number) => void;
  checkRefill: () => void;
  reset: () => void;
}

const INITIAL_LIVES = 3;
const MAX_LIVES = 5;
const REFILL_HOURS = 2; // 2 hours per life refill

export const useLives = create<LivesStore>((set, get) => ({
  // Initial state
  lives: INITIAL_LIVES,
  maxLives: MAX_LIVES,
  refillAt: undefined,

  // Actions
  loseLife: () => {
    const state = get();
    const newLives = Math.max(0, state.lives - 1);
    
    set({ lives: newLives });
    
    // Start refill timer if we lost our last life
    if (newLives === 0 && !state.refillAt) {
      get().setRefillTimer(REFILL_HOURS);
    }
  },

  addLife: (n = 1) => {
    const state = get();
    const newLives = Math.min(state.maxLives, state.lives + n);
    
    set({ 
      lives: newLives,
      refillAt: newLives >= state.maxLives ? undefined : state.refillAt
    });
  },

  canContinue: () => {
    const state = get();
    return state.lives > 0;
  },

  setRefillTimer: (hours: number) => {
    const refillAt = Date.now() + (hours * 60 * 60 * 1000);
    set({ refillAt });
  },

  checkRefill: () => {
    const state = get();
    const now = Date.now();
    
    if (state.refillAt && now >= state.refillAt) {
      // Time to refill one life
      if (state.lives < state.maxLives) {
        const newLives = Math.min(state.maxLives, state.lives + 1);
        const shouldContinueRefill = newLives < state.maxLives;
        
        set({
          lives: newLives,
          refillAt: shouldContinueRefill ? now + (REFILL_HOURS * 60 * 60 * 1000) : undefined
        });
      } else {
        set({ refillAt: undefined });
      }
    }
  },

  reset: () => {
    set({
      lives: INITIAL_LIVES,
      maxLives: MAX_LIVES,
      refillAt: undefined
    });
  }
}));

// Auto-check refill every minute
setInterval(() => {
  useLives.getState().checkRefill();
}, 60 * 1000);