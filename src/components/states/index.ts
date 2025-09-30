/**
 * STATE COMPONENTS INDEX
 * Centralized exports for all loading, empty, and error state components
 */

export { default as LoadingState } from './LoadingState';
export { default as EmptyState } from './EmptyState';
export { default as ErrorState } from './ErrorState';
export {
  default as SkeletonLoader,
  SkeletonText,
  SkeletonCircle,
  SkeletonButton,
} from './SkeletonLoader';

// Type exports
export type {
  // Add type exports if needed in the future
} from './LoadingState';

// Re-export commonly used props for convenience
export interface StateComponentProps {
  size?: 'small' | 'medium' | 'large';
  theme?: 'light' | 'dark' | 'accent';
  onAction?: () => void;
  onSecondaryAction?: () => void;
}

// Utility functions for state management
export const createLoadingState = (type: string, message?: string) => ({
  type,
  message,
  isLoading: true,
});

export const createEmptyState = (type: string, title?: string, message?: string) => ({
  type,
  title,
  message,
  isEmpty: true,
});

export const createErrorState = (type: string, error: Error, retryAction?: () => void) => ({
  type,
  error: error.message,
  onRetry: retryAction,
  hasError: true,
});