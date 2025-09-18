/**
 * Firebase Context Provider
 * Provides Firebase services and connection state throughout the app
 */

import React, { createContext, useContext, ReactNode } from 'react';
import { useFirestore } from '../hooks/useFirestore';
import { ContentRepository, ProgressRepository, UserRepository } from '../repos/interfaces';

interface FirebaseContextType {
  isConnected: boolean;
  isInitialized: boolean;
  isOnline: boolean;
  latency?: number;
  error?: string;
  errorType?: 'network' | 'permission' | 'configuration' | 'unknown';
  userFriendlyError?: string;
  retryCount: number;
  lastConnectionAttempt?: number;
  repositories: {
    content: ContentRepository;
    progress: ProgressRepository;
    user: UserRepository;
  };
  reconnect: () => Promise<void>;
}

const FirebaseContext = createContext<FirebaseContextType | null>(null);

interface FirebaseProviderProps {
  children: ReactNode;
}

export const FirebaseProvider: React.FC<FirebaseProviderProps> = ({ children }) => {
  const firestore = useFirestore();

  return (
    <FirebaseContext.Provider value={firestore}>
      {children}
    </FirebaseContext.Provider>
  );
};

export const useFirebase = (): FirebaseContextType => {
  const context = useContext(FirebaseContext);
  if (!context) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
};

export default FirebaseProvider;