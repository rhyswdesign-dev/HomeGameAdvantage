import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Pressable, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radii } from '../../theme/tokens';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastConfig {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  action?: {
    label: string;
    onPress: () => void;
  };
  onDismiss?: () => void;
}

interface ToastContextType {
  showToast: (config: Omit<ToastConfig, 'id'>) => void;
  hideToast: (id: string) => void;
  hideAllToasts: () => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

const getToastIcon = (type: ToastType) => {
  switch (type) {
    case 'success': return 'checkmark-circle';
    case 'error': return 'close-circle';
    case 'warning': return 'warning';
    case 'info': return 'information-circle';
    default: return 'information-circle';
  }
};

const getToastColors = (type: ToastType) => {
  switch (type) {
    case 'success': 
      return { 
        background: '#10B981', 
        icon: '#FFFFFF', 
        text: '#FFFFFF',
        border: '#059669'
      };
    case 'error': 
      return { 
        background: '#EF4444', 
        icon: '#FFFFFF', 
        text: '#FFFFFF',
        border: '#DC2626'
      };
    case 'warning': 
      return { 
        background: '#F59E0B', 
        icon: '#FFFFFF', 
        text: '#FFFFFF',
        border: '#D97706'
      };
    case 'info': 
      return { 
        background: colors.accent, 
        icon: colors.accentText, 
        text: colors.accentText,
        border: colors.accent
      };
    default: 
      return { 
        background: colors.card, 
        icon: colors.text, 
        text: colors.text,
        border: colors.line
      };
  }
};

interface ToastItemProps {
  toast: ToastConfig & { animatedValue: Animated.Value };
  onDismiss: (id: string) => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, onDismiss }) => {
  const colors = getToastColors(toast.type);
  const icon = getToastIcon(toast.type);

  const handleDismiss = () => {
    toast.onDismiss?.();
    onDismiss(toast.id);
  };

  const handleAction = () => {
    toast.action?.onPress();
    handleDismiss();
  };

  const translateY = toast.animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-100, 0],
  });

  const opacity = toast.animatedValue;

  return (
    <Animated.View 
      style={[
        styles.toastItem,
        { 
          backgroundColor: colors.background,
          borderColor: colors.border,
          transform: [{ translateY }],
          opacity,
        }
      ]}
    >
      <View style={styles.toastContent}>
        <Ionicons name={icon as any} size={24} color={colors.icon} style={styles.toastIcon} />
        
        <View style={styles.toastText}>
          <Text style={[styles.toastTitle, { color: colors.text }]}>{toast.title}</Text>
          {toast.message && (
            <Text style={[styles.toastMessage, { color: colors.text }]}>{toast.message}</Text>
          )}
        </View>

        <View style={styles.toastActions}>
          {toast.action && (
            <Pressable onPress={handleAction} style={styles.actionButton}>
              <Text style={[styles.actionText, { color: colors.text }]}>
                {toast.action.label}
              </Text>
            </Pressable>
          )}
          
          <Pressable onPress={handleDismiss} hitSlop={8} style={styles.closeButton}>
            <Ionicons name="close" size={20} color={colors.icon} />
          </Pressable>
        </View>
      </View>
    </Animated.View>
  );
};

interface ToastContainerProps {
  children: React.ReactNode;
}

export const ToastProvider: React.FC<ToastContainerProps> = ({ children }) => {
  const [toasts, setToasts] = useState<(ToastConfig & { animatedValue: Animated.Value })[]>([]);
  const toastTimeouts = useRef<Map<string, NodeJS.Timeout>>(new Map());

  const showToast = useCallback((config: Omit<ToastConfig, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const animatedValue = new Animated.Value(0);
    const duration = config.duration ?? 4000;

    const toast = { ...config, id, animatedValue };

    setToasts(prev => [...prev, toast]);

    // Animate in
    Animated.spring(animatedValue, {
      toValue: 1,
      useNativeDriver: false,
      tension: 100,
      friction: 8,
    }).start();

    // Auto dismiss
    if (duration > 0) {
      const timeout = setTimeout(() => {
        hideToast(id);
      }, duration);
      toastTimeouts.current.set(id, timeout);
    }
  }, []);

  const hideToast = useCallback((id: string) => {
    const toast = toasts.find(t => t.id === id);
    if (!toast) return;

    // Clear timeout
    const timeout = toastTimeouts.current.get(id);
    if (timeout) {
      clearTimeout(timeout);
      toastTimeouts.current.delete(id);
    }

    // Animate out
    Animated.timing(toast.animatedValue, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    });
  }, [toasts]);

  const hideAllToasts = useCallback(() => {
    toasts.forEach(toast => {
      const timeout = toastTimeouts.current.get(toast.id);
      if (timeout) {
        clearTimeout(timeout);
        toastTimeouts.current.delete(toast.id);
      }
    });
    setToasts([]);
  }, [toasts]);

  useEffect(() => {
    return () => {
      // Cleanup timeouts on unmount
      toastTimeouts.current.forEach(timeout => clearTimeout(timeout));
    };
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, hideToast, hideAllToasts }}>
      {children}
      <SafeAreaView style={styles.toastContainer} pointerEvents="box-none" edges={['top']}>
        {toasts.map(toast => (
          <ToastItem
            key={toast.id}
            toast={toast}
            onDismiss={hideToast}
          />
        ))}
      </SafeAreaView>
    </ToastContext.Provider>
  );
};

const styles = StyleSheet.create({
  toastContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 999,
    paddingHorizontal: spacing(2),
  },
  toastItem: {
    borderRadius: radii.lg,
    marginBottom: spacing(1),
    borderWidth: 1,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  toastContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: spacing(2),
  },
  toastIcon: {
    marginRight: spacing(1.5),
    marginTop: 2,
  },
  toastText: {
    flex: 1,
  },
  toastTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  toastMessage: {
    fontSize: 14,
    opacity: 0.9,
    lineHeight: 18,
  },
  toastActions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: spacing(1),
  },
  actionButton: {
    paddingHorizontal: spacing(1),
    paddingVertical: 4,
    marginRight: spacing(1),
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  closeButton: {
    padding: 4,
  },
});