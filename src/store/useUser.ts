/**
 * User Store using Zustand
 * Manages persistent user state (XP, lives, completed lessons, etc.)
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserState {
  // Persistent user data
  xp: number;
  lives: number;
  level: number;
  streak: number;
  completedLessons: string[];
  lastLifeLossTime: number | null;

  // Actions
  gainXP: (amount: number) => void;
  loseLife: () => void;
  gainLife: () => void;
  completeLesson: (lessonId: string, xpEarned: number) => void;
  checkLifeRefresh: () => void;
}

const INITIAL_LIVES = 3;
const LIFE_REFRESH_TIME = 60 * 60 * 1000; // 1 hour in milliseconds
const SUBSEQUENT_REFRESH_TIME = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

export const useUser = create<UserState>()(
  persist(
    (set, get) => ({
      // Initial state
      xp: 0,
      lives: INITIAL_LIVES,
      level: 1,
      streak: 0,
      completedLessons: [],
      lastLifeLossTime: null,

      gainXP: (amount: number) => {
        set(state => {
          const newXP = state.xp + amount;
          const newLevel = Math.floor(newXP / 100) + 1; // Level up every 100 XP
          return {
            xp: newXP,
            level: newLevel
          };
        });
      },

      loseLife: () => {
        set(state => {
          const newLives = Math.max(0, state.lives - 1);
          return {
            lives: newLives,
            lastLifeLossTime: Date.now()
          };
        });
      },

      gainLife: () => {
        set(state => ({
          lives: Math.min(INITIAL_LIVES, state.lives + 1)
        }));
      },

      completeLesson: (lessonId: string, xpEarned: number) => {
        set(state => {
          if (state.completedLessons.includes(lessonId)) {
            return state; // Already completed
          }

          const newXP = state.xp + xpEarned;
          const newLevel = Math.floor(newXP / 100) + 1;

          return {
            completedLessons: [...state.completedLessons, lessonId],
            xp: newXP,
            level: newLevel,
            streak: state.streak + 1 // Simple streak increment
          };
        });
      },

      checkLifeRefresh: () => {
        const state = get();
        if (state.lives >= INITIAL_LIVES || !state.lastLifeLossTime) {
          return; // Already at max lives or never lost a life
        }

        const now = Date.now();
        const timeSinceLastLoss = now - state.lastLifeLossTime;

        // Check if enough time has passed for life refresh
        const refreshTime = state.lives === 0 ? SUBSEQUENT_REFRESH_TIME : LIFE_REFRESH_TIME;

        if (timeSinceLastLoss >= refreshTime) {
          set(state => ({
            lives: INITIAL_LIVES,
            lastLifeLossTime: null
          }));
        }
      }
    }),
    {
      name: 'user-store', // Storage key
    }
  )
);