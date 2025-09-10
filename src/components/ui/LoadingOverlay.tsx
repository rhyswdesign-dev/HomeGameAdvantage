import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, ActivityIndicator, Modal } from 'react-native';
import { colors, spacing } from '../../theme/tokens';
import { BlurView } from 'expo-blur';

export interface LoadingConfig {
  id: string;
  message?: string;
  showSpinner?: boolean;
  dismissible?: boolean;
  timeout?: number; // Auto-dismiss after timeout (ms)
  onTimeout?: () => void;
}

interface LoadingContextType {
  showLoading: (config?: Omit<LoadingConfig, 'id'>) => string;
  hideLoading: (id?: string) => void;
  hideAllLoading: () => void;
  updateLoading: (id: string, config: Partial<Omit<LoadingConfig, 'id'>>) => void;
}

const LoadingContext = createContext<LoadingContextType | null>(null);

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
};

interface LoadingItemProps {
  loading: LoadingConfig & { animatedValue: Animated.Value };
}

const LoadingItem: React.FC<LoadingItemProps> = ({ loading }) => {
  const spinValue = useRef(new Animated.Value(0)).current;
  const scaleValue = loading.animatedValue;

  useEffect(() => {
    // Continuous rotation for spinner
    const spinAnimation = Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      })
    );
    spinAnimation.start();

    return () => spinAnimation.stop();
  }, [spinValue]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const scale = scaleValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.8, 1],
  });

  const opacity = scaleValue;

  return (
    <Modal visible={true} transparent statusBarTranslucent>
      <View style={styles.overlay}>
        <BlurView intensity={15} style={StyleSheet.absoluteFill} />
        <Animated.View 
          style={[
            styles.loadingContainer,
            {
              transform: [{ scale }],
              opacity,
            }
          ]}
        >
          {loading.showSpinner !== false && (
            <View style={styles.spinnerContainer}>
              <Animated.View style={[styles.customSpinner, { transform: [{ rotate: spin }] }]}>
                <View style={styles.spinnerRing} />
              </Animated.View>
            </View>
          )}
          
          {loading.message && (
            <Text style={styles.loadingMessage}>{loading.message}</Text>
          )}
        </Animated.View>
      </View>
    </Modal>
  );
};

interface LoadingProviderProps {
  children: React.ReactNode;
}

export const LoadingProvider: React.FC<LoadingProviderProps> = ({ children }) => {
  const [loadingStates, setLoadingStates] = useState<(LoadingConfig & { animatedValue: Animated.Value })[]>([]);
  const timeouts = useRef<Map<string, NodeJS.Timeout>>(new Map());

  const showLoading = useCallback((config: Omit<LoadingConfig, 'id'> = {}) => {
    const id = Math.random().toString(36).substr(2, 9);
    const animatedValue = new Animated.Value(0);
    
    const loadingConfig = {
      message: 'Loading...',
      showSpinner: true,
      dismissible: false,
      ...config,
      id,
      animatedValue,
    };

    setLoadingStates(prev => [...prev, loadingConfig]);

    // Animate in
    Animated.spring(animatedValue, {
      toValue: 1,
      useNativeDriver: false,
      tension: 100,
      friction: 8,
    }).start();

    // Set timeout if specified
    if (loadingConfig.timeout && loadingConfig.timeout > 0) {
      const timeout = setTimeout(() => {
        loadingConfig.onTimeout?.();
        hideLoading(id);
      }, loadingConfig.timeout);
      timeouts.current.set(id, timeout);
    }

    return id;
  }, []);

  const hideLoading = useCallback((id?: string) => {
    if (!id) {
      // Hide the most recent loading if no ID specified
      const lastLoading = loadingStates[loadingStates.length - 1];
      if (lastLoading) {
        id = lastLoading.id;
      } else {
        return;
      }
    }

    const loading = loadingStates.find(l => l.id === id);
    if (!loading) return;

    // Clear timeout
    const timeout = timeouts.current.get(id);
    if (timeout) {
      clearTimeout(timeout);
      timeouts.current.delete(id);
    }

    // Animate out
    Animated.timing(loading.animatedValue, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start(() => {
      setLoadingStates(prev => prev.filter(l => l.id !== id));
    });
  }, [loadingStates]);

  const hideAllLoading = useCallback(() => {
    // Clear all timeouts
    timeouts.current.forEach(timeout => clearTimeout(timeout));
    timeouts.current.clear();

    // Animate out all
    const animations = loadingStates.map(loading =>
      Animated.timing(loading.animatedValue, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      })
    );

    Animated.parallel(animations).start(() => {
      setLoadingStates([]);
    });
  }, [loadingStates]);

  const updateLoading = useCallback((id: string, config: Partial<Omit<LoadingConfig, 'id'>>) => {
    setLoadingStates(prev => 
      prev.map(loading => 
        loading.id === id 
          ? { ...loading, ...config }
          : loading
      )
    );
  }, []);

  useEffect(() => {
    return () => {
      // Cleanup timeouts on unmount
      timeouts.current.forEach(timeout => clearTimeout(timeout));
    };
  }, []);

  // Only show the most recent loading overlay
  const currentLoading = loadingStates[loadingStates.length - 1];

  return (
    <LoadingContext.Provider value={{ showLoading, hideLoading, hideAllLoading, updateLoading }}>
      {children}
      {currentLoading && <LoadingItem loading={currentLoading} />}
    </LoadingContext.Provider>
  );
};

// Convenience hooks for common loading patterns
export const useAsyncOperation = () => {
  const { showLoading, hideLoading } = useLoading();

  const runWithLoading = useCallback(async <T,>(
    operation: () => Promise<T>,
    loadingMessage?: string
  ): Promise<T> => {
    const loadingId = showLoading({ message: loadingMessage });
    try {
      const result = await operation();
      return result;
    } finally {
      hideLoading(loadingId);
    }
  }, [showLoading, hideLoading]);

  return { runWithLoading };
};

export const useProgressLoading = () => {
  const { showLoading, hideLoading, updateLoading } = useLoading();

  const startProgress = useCallback((initialMessage?: string) => {
    return showLoading({ message: initialMessage || 'Starting...', showSpinner: true });
  }, [showLoading]);

  const updateProgress = useCallback((id: string, message: string) => {
    updateLoading(id, { message });
  }, [updateLoading]);

  const finishProgress = useCallback((id: string) => {
    hideLoading(id);
  }, [hideLoading]);

  return { startProgress, updateProgress, finishProgress };
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  loadingContainer: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: spacing(3),
    alignItems: 'center',
    minWidth: 120,
    maxWidth: 280,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 8,
  },
  spinnerContainer: {
    marginBottom: spacing(2),
  },
  customSpinner: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  spinnerRing: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 3,
    borderColor: 'transparent',
    borderTopColor: colors.accent,
    borderRightColor: colors.accent,
  },
  loadingMessage: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
    lineHeight: 22,
  },
});