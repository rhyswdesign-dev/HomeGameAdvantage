/**
 * Firestore Hook
 * React hook for managing Firestore connection state and operations
 */

import { useState, useEffect, useCallback } from 'react';
import { FirestoreContentRepository, FirestoreProgressRepository, FirestoreUserRepository, healthCheck } from '../repos/firestore/firestoreRepositories';
import { validateFirebaseConfig, checkFirebaseConnection, getUserFriendlyErrorMessage, getErrorType, isNetworkError } from '../config/firebase';
import NetInfo from '@react-native-community/netinfo';

interface FirestoreState {
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
    content: FirestoreContentRepository;
    progress: FirestoreProgressRepository;
    user: FirestoreUserRepository;
  };
}

export const useFirestore = () => {
  const [state, setState] = useState<FirestoreState>({
    isConnected: false,
    isInitialized: false,
    isOnline: false,
    retryCount: 0,
    repositories: {
      content: new FirestoreContentRepository(),
      progress: new FirestoreProgressRepository(),
      user: new FirestoreUserRepository()
    }
  });

  // Monitor network connectivity
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      const isOnline = !!state.isConnected && !!state.isInternetReachable;
      
      setState(prev => ({ ...prev, isOnline }));
      
      // If we came back online and were previously disconnected, try to reconnect
      if (isOnline && !state.isConnected) {
        console.log('📶 Network restored, attempting to reconnect to Firebase...');
        initializeFirestore();
      }
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    initializeFirestore();
  }, []);

  const initializeFirestore = useCallback(async () => {
    try {
      setState(prev => ({ 
        ...prev, 
        lastConnectionAttempt: Date.now(),
        error: undefined,
        errorType: undefined,
        userFriendlyError: undefined
      }));

      // Validate configuration
      if (!validateFirebaseConfig()) {
        const error = 'Firebase configuration is incomplete. Check your environment variables.';
        setState(prev => ({
          ...prev,
          error,
          errorType: 'configuration',
          userFriendlyError: 'The app is not properly configured. Please contact support.',
          isInitialized: true
        }));
        return;
      }

      // Test connection with retries
      const connectionResult = await checkFirebaseConnection(3);
      
      if (!connectionResult.connected) {
        const errorType = getErrorType({ message: connectionResult.error });
        setState(prev => ({
          ...prev,
          error: connectionResult.error,
          errorType,
          userFriendlyError: getUserFriendlyErrorMessage({ message: connectionResult.error }),
          retryCount: prev.retryCount + 1,
          isInitialized: true
        }));
        
        // Schedule automatic retry for network errors
        if (errorType === 'network') {
          scheduleRetry();
        }
        return;
      }

      // Health check
      const health = await healthCheck();
      
      setState(prev => ({
        ...prev,
        isConnected: health.connected,
        latency: health.latency || connectionResult.latency,
        error: health.error,
        errorType: health.error ? getErrorType({ message: health.error }) : undefined,
        userFriendlyError: health.error ? getUserFriendlyErrorMessage({ message: health.error }) : undefined,
        retryCount: health.connected ? 0 : prev.retryCount + 1,
        isInitialized: true
      }));

      if (!health.connected && health.error && isNetworkError({ message: health.error })) {
        scheduleRetry();
      }

    } catch (error) {
      console.error('Firestore initialization failed:', error);
      const errorType = getErrorType(error);
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Unknown error',
        errorType,
        userFriendlyError: getUserFriendlyErrorMessage(error),
        retryCount: prev.retryCount + 1,
        isInitialized: true
      }));
      
      if (errorType === 'network') {
        scheduleRetry();
      }
    }
  }, []);

  const scheduleRetry = useCallback(() => {
    const delay = Math.min(5000 * Math.pow(2, state.retryCount), 30000); // Max 30s delay
    console.log(`🔄 Scheduling Firebase reconnection in ${delay}ms (attempt ${state.retryCount + 1})`);
    
    setTimeout(() => {
      initializeFirestore();
    }, delay);
  }, [state.retryCount, initializeFirestore]);

  const reconnect = useCallback(async () => {
    setState(prev => ({ 
      ...prev, 
      isInitialized: false, 
      error: undefined,
      errorType: undefined,
      userFriendlyError: undefined,
      retryCount: 0
    }));
    await initializeFirestore();
  }, [initializeFirestore]);

  return {
    ...state,
    reconnect
  };
};

export default useFirestore;