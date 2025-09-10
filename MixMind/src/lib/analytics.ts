// Analytics Events Type Definitions
export interface AnalyticsEvents {
  // Onboarding Events
  'onboarding_started': {
    source: 'app_launch' | 'manual_reset';
  };
  'onboarding_slide_viewed': {
    slide_id: string;
    slide_index: number;
    total_slides: number;
  };
  'onboarding_slide_back': {
    from_slide_id: string;
    to_slide_id: string;
    slide_index: number;
  };
  'onboarding_slide_next': {
    from_slide_id: string;
    to_slide_id: string;
    slide_index: number;
  };
  'onboarding_slide_jump': {
    from_slide_id: string;
    to_slide_id: string;
    from_index: number;
    to_index: number;
    method: 'progress_dot' | 'swipe';
  };
  'onboarding_skipped': {
    current_slide_id: string;
    slide_index: number;
    total_slides: number;
  };
  'onboarding_completed': {
    completion_method: 'done_button' | 'slide_completion';
    total_duration_ms?: number;
  };
  'onboarding_permission_explainer': {
    permission_type: 'notifications' | 'location' | 'camera' | 'contacts';
    action: 'viewed' | 'dismissed';
  };
}

// Mock analytics implementation for development
class MockAnalytics {
  track<T extends keyof AnalyticsEvents>(
    event: T,
    properties: AnalyticsEvents[T]
  ): void {
    if (__DEV__) {
      console.log('📊 Analytics:', event, properties);
    }
  }

  identify(userId: string, traits?: Record<string, any>): void {
    if (__DEV__) {
      console.log('👤 Analytics Identify:', userId, traits);
    }
  }

  screen(screenName: string, properties?: Record<string, any>): void {
    if (__DEV__) {
      console.log('📱 Analytics Screen:', screenName, properties);
    }
  }
}

export const analytics = new MockAnalytics();