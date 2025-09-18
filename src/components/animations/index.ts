/**
 * Animation Components Export
 * Centralized exports for all animation components
 */

export { CompletionAnimation } from './CompletionAnimation';
export { QuickFeedbackAnimation } from './QuickFeedbackAnimation';
export { AnimationDemo } from './AnimationDemo';

// Export types
export type { CompletionAnimationType } from '../../hooks/useCompletionAnimation';

// Re-export the hook for convenience
export { useCompletionAnimation } from '../../hooks/useCompletionAnimation';