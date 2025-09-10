import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { MMKV } from 'react-native-mmkv';

// Create MMKV storage instance
const storage = new MMKV({
  id: 'session-storage',
});

// Zustand-compatible storage adapter
const mmkvStorage = {
  setItem: (name: string, value: string) => {
    return storage.set(name, value);
  },
  getItem: (name: string) => {
    const value = storage.getString(name);
    return value ?? null;
  },
  removeItem: (name: string) => {
    return storage.delete(name);
  },
};

export interface SessionState {
  // Onboarding
  onboardingCompleted: boolean;
  
  // Actions
  setOnboardingCompleted: (completed: boolean) => void;
  resetOnboarding: () => void;
}

export const useSession = create<SessionState>()(
  persist(
    immer((set) => ({
      // Initial state
      onboardingCompleted: false,
      
      // Actions
      setOnboardingCompleted: (completed: boolean) =>
        set((state) => {
          state.onboardingCompleted = completed;
        }),
        
      resetOnboarding: () =>
        set((state) => {
          state.onboardingCompleted = false;
        }),
    })),
    {
      name: 'session-storage',
      storage: createJSONStorage(() => mmkvStorage),
      partialize: (state) => ({
        onboardingCompleted: state.onboardingCompleted,
      }),
    }
  )
);