/**
 * Firebase Configuration
 * Initialize Firebase app with Firestore, Auth, and Functions
 */

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator, enableNetwork, disableNetwork } from 'firebase/firestore';
import { getAuth, initializeAuth, getReactNativePersistence, connectAuthEmulator } from 'firebase/auth';
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions';
import { getStorage, connectStorageEmulator } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Firebase configuration object
// These values should come from your Firebase project settings
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || "your-api-key",
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || "your-project.firebaseapp.com",
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || "your-project-id",
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || "your-project.appspot.com",
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || "1:123456789:web:abcdef123456",
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-ABCDEF123"
};

// Initialize Firebase app (singleton pattern)
let app;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

// Initialize Firebase services
export const db = getFirestore(app);

// Initialize Auth with AsyncStorage persistence
let auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
  });
} catch (error) {
  // If already initialized, get existing instance
  auth = getAuth(app);
}
export { auth };

export const functions = getFunctions(app);
export const storage = getStorage(app);

// Log storage bucket configuration for debugging
console.log('Firebase Storage bucket:', app.options.storageBucket);

// Development emulator setup
const isEmulator = process.env.NODE_ENV === 'development' && process.env.EXPO_PUBLIC_USE_FIREBASE_EMULATOR === 'true';

if (isEmulator) {
  try {
    // Connect to Firestore emulator
    if (!db._delegate._databaseId.projectId.includes('demo-')) {
      connectFirestoreEmulator(db, 'localhost', 8080);
    }
    
    // Connect to Auth emulator
    if (!auth.config.apiHost?.includes('identitytoolkit.googleapis.com')) {
      connectAuthEmulator(auth, 'http://localhost:9099');
    }
    
    // Connect to Functions emulator
    if (!functions.app.options.projectId?.includes('demo-')) {
      connectFunctionsEmulator(functions, 'localhost', 5001);
    }

    // Connect to Storage emulator
    if (!storage.app.options.projectId?.includes('demo-')) {
      connectStorageEmulator(storage, 'localhost', 9199);
    }

    console.log('🔧 Connected to Firebase emulators');
  } catch (error) {
    console.warn('⚠️ Failed to connect to emulators:', error);
  }
}

// Export the app instance
export default app;

// Environment validation
export const validateFirebaseConfig = (): boolean => {
  const requiredKeys = [
    'EXPO_PUBLIC_FIREBASE_API_KEY',
    'EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN', 
    'EXPO_PUBLIC_FIREBASE_PROJECT_ID'
  ];
  
  const missing = requiredKeys.filter(key => !process.env[key] || process.env[key] === 'your-api-key');
  
  if (missing.length > 0) {
    console.error('🔥 Missing Firebase configuration:', missing);
    return false;
  }
  
  return true;
};

// Enhanced connection health check with retry logic
export const checkFirebaseConnection = async (retries = 3): Promise<{
  connected: boolean;
  latency?: number;
  error?: string;
}> => {
  let lastError: Error | null = null;
  
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const start = Date.now();
      
      // Simple Firestore read to test connection with source option
      const { doc, getDoc } = await import('firebase/firestore');
      await getDoc(doc(db, '_health', 'check'), { source: 'server' });
      
      const latency = Date.now() - start;
      return { connected: true, latency };
      
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown error');
      
      // Don't log offline errors as warnings - they're expected
      if (isNetworkError(lastError)) {
        console.log(`🔥 Firebase offline (attempt ${attempt}/${retries})`);
      } else {
        console.warn(`🔥 Firebase connection attempt ${attempt} failed:`, lastError.message);
      }
      
      // If this isn't the last attempt and it's not a persistent offline error, wait before retrying
      if (attempt < retries && !isNetworkError(lastError)) {
        const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000); // Exponential backoff, max 5s
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  // Don't log offline errors as errors - they're expected behavior
  if (isNetworkError(lastError)) {
    console.log('🔥 Firebase is offline');
  } else {
    console.error('🔥 Firebase connection failed after all retries:', lastError);
  }
  
  return { 
    connected: false, 
    error: lastError?.message || 'Connection failed'
  };
};

// Network status utilities
export const isNetworkError = (error: any): boolean => {
  if (!error) return false;
  
  const errorCode = error.code || '';
  const errorMessage = (error.message || '').toLowerCase();
  
  return (
    errorCode === 'unavailable' ||
    errorCode === 'deadline-exceeded' ||
    errorCode === 'resource-exhausted' ||
    errorMessage.includes('network') ||
    errorMessage.includes('offline') ||
    errorMessage.includes('timeout') ||
    errorMessage.includes('connection')
  );
};

export const isPermissionError = (error: any): boolean => {
  if (!error) return false;
  
  const errorCode = error.code || '';
  return (
    errorCode === 'permission-denied' ||
    errorCode === 'unauthenticated'
  );
};

export const getErrorType = (error: any): 'network' | 'permission' | 'configuration' | 'unknown' => {
  if (isNetworkError(error)) return 'network';
  if (isPermissionError(error)) return 'permission';
  
  const errorCode = error?.code || '';
  if (errorCode === 'invalid-argument' || errorCode === 'not-found') {
    return 'configuration';
  }
  
  return 'unknown';
};

export const getUserFriendlyErrorMessage = (error: any): string => {
  const errorType = getErrorType(error);
  
  switch (errorType) {
    case 'network':
      return 'Unable to connect to the server. Please check your internet connection and try again.';
    case 'permission':
      return 'You don\'t have permission to access this data. Please sign in again.';
    case 'configuration':
      return 'There\'s a configuration issue with the app. Please contact support.';
    default:
      return 'Something went wrong. Please try again later.';
  }
};

// Safe Firestore operation wrapper
export const safeFirestoreOperation = async <T>(
  operation: () => Promise<T>,
  fallback?: T,
  silentOfflineErrors = true
): Promise<T | undefined> => {
  try {
    return await operation();
  } catch (error) {
    if (silentOfflineErrors && isNetworkError(error)) {
      // Silently fail for offline errors
      return fallback;
    }
    
    // Log other errors normally
    console.error('Firestore operation failed:', error);
    throw error;
  }
};

// Enhanced error logging that filters offline errors
export const logFirebaseError = (operation: string, error: any): void => {
  if (isNetworkError(error)) {
    // Don't spam logs with offline errors
    return;
  }
  
  console.error(`Firebase ${operation} failed:`, error);
};