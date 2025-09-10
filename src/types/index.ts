/**
 * Global type definitions for HomeGameAdvantage app
 * Contains user data, lesson structure, and navigation types
 */

// User-related types
export interface User {
  id: string;
  email: string;
  displayName?: string;
  xp: number;              // Experience points earned
  lessonsCompleted: number; // Total lessons finished
  createdAt: string;       // ISO date string
  updatedAt: string;       // ISO date string
}

// Lesson and quiz types  
export interface Lesson {
  id: string;
  title: string;
  description: string;
  xpReward: number;        // XP gained on completion (default: 15)
  questions: Question[];   // Array of 3 questions
  category: string;        // e.g., "Cocktail Basics", "Advanced Mixing"
}

export interface Question {
  id: string;
  text: string;           // The question being asked
  options: string[];      // Array of 4 possible answers
  correctAnswer: number;  // Index of correct answer (0-3)
  explanation?: string;   // Optional explanation after answering
}

// Vault items (unlocked at 1000 XP)
export interface VaultItem {
  id: string;
  name: string;
  description: string;
  category: 'recipe' | 'technique' | 'history' | 'equipment';
  unlockRequirement: number; // XP needed to unlock
  content: string;           // The actual content/recipe
}

// Navigation types
export type RootTabParamList = {
  Home: undefined;
  Lessons: undefined;
  Vault: undefined;
  Profile: undefined;
  Settings: undefined;
};

// App state types for context
export interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  lessons: Lesson[];
  vaultItems: VaultItem[];
  completedLessons: string[]; // Array of lesson IDs
}

export interface AppActions {
  setUser: (user: User | null) => void;
  updateUserXP: (xpToAdd: number) => void;
  completeLesson: (lessonId: string) => void;
  logout: () => void;
}