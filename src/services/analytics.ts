/**
 * Analytics Service
 * Event tracking with multiple sink support (Memory, PostHog, Segment)
 */

export type AnalyticsEvent =
  | { type: 'onboarding.completed'; level: string; track: string; spirits: string[]; sessionMinutes: number }
  | { type: 'lesson.start'; lessonId: string }
  | { type: 'lesson.complete'; lessonId: string; durationMs: number; itemsAttempted: number; correctCount: number }
  | { type: 'item.attempted'; itemId: string; result: 'correct' | 'incorrect'; msToAnswer: number; exerciseType: 'mcq' | 'order' | 'short' }
  | { type: 'scheduler.plan'; moduleId: string; mix: { current: number; review: number; older: number }; expectedMinutes: number }
  | { type: 'progress.xpAwarded'; amount: number }
  | { type: 'streak.updated'; value: number }
  | { type: 'badge.unlocked'; name: string };

export interface AnalyticsSink {
  init(cfg: any): Promise<void>;
  track(ev: AnalyticsEvent): Promise<void>;
  flush?(): Promise<void>;
}

/**
 * In-memory analytics sink for development and testing
 */
export class MemorySink implements AnalyticsSink {
  private events: Array<AnalyticsEvent & { timestamp: number }> = [];

  async init(cfg: any): Promise<void> {
    console.log('MemorySink initialized');
  }

  async track(ev: AnalyticsEvent): Promise<void> {
    const eventWithTimestamp = {
      ...ev,
      timestamp: Date.now()
    };
    
    this.events.push(eventWithTimestamp);
    console.log('[Analytics]', ev.type, ev);
  }

  async flush(): Promise<void> {
    console.log('MemorySink flush - events:', this.events.length);
  }

  // Helper methods for testing
  getEvents(): Array<AnalyticsEvent & { timestamp: number }> {
    return [...this.events];
  }

  getEventsByType(type: string): Array<AnalyticsEvent & { timestamp: number }> {
    return this.events.filter(e => e.type === type);
  }

  clear(): void {
    this.events = [];
  }

  getEventCount(): number {
    return this.events.length;
  }
}

/**
 * PostHog analytics sink
 */
export class PostHogSink implements AnalyticsSink {
  private client: any = null;
  private initialized = false;

  async init(cfg: { apiKey: string; host?: string }): Promise<void> {
    try {
      // TODO: Implement PostHog integration
      // const { PostHog } = require('posthog-react-native');
      // this.client = new PostHog(cfg.apiKey, { host: cfg.host });
      
      console.log('PostHogSink would initialize with:', cfg);
      this.initialized = true;
    } catch (error) {
      console.warn('PostHog initialization failed:', error);
      this.initialized = false;
    }
  }

  async track(ev: AnalyticsEvent): Promise<void> {
    if (!this.initialized || !this.client) {
      console.warn('PostHog not initialized, skipping event:', ev.type);
      return;
    }

    try {
      // TODO: Implement actual PostHog tracking
      // this.client.capture(ev.type, ev);
      console.log('[PostHog]', ev.type, ev);
    } catch (error) {
      console.error('PostHog tracking error:', error);
    }
  }

  async flush(): Promise<void> {
    if (this.client?.flush) {
      try {
        await this.client.flush();
      } catch (error) {
        console.error('PostHog flush error:', error);
      }
    }
  }
}

/**
 * Segment analytics sink
 */
export class SegmentSink implements AnalyticsSink {
  private client: any = null;
  private initialized = false;

  async init(cfg: { writeKey: string }): Promise<void> {
    try {
      // TODO: Implement Segment integration
      // const { createClient } = require('@segment/analytics-react-native');
      // this.client = createClient({ writeKey: cfg.writeKey });
      
      console.log('SegmentSink would initialize with writeKey:', cfg.writeKey);
      this.initialized = true;
    } catch (error) {
      console.warn('Segment initialization failed:', error);
      this.initialized = false;
    }
  }

  async track(ev: AnalyticsEvent): Promise<void> {
    if (!this.initialized || !this.client) {
      console.warn('Segment not initialized, skipping event:', ev.type);
      return;
    }

    try {
      // TODO: Implement actual Segment tracking
      // this.client.track(ev.type, ev);
      console.log('[Segment]', ev.type, ev);
    } catch (error) {
      console.error('Segment tracking error:', error);
    }
  }

  async flush(): Promise<void> {
    if (this.client?.flush) {
      try {
        await this.client.flush();
      } catch (error) {
        console.error('Segment flush error:', error);
      }
    }
  }
}

// Global analytics state
let sink: AnalyticsSink = new MemorySink();

/**
 * Set the analytics sink (call during app initialization)
 */
export async function setAnalyticsSink(s: AnalyticsSink): Promise<void> {
  sink = s;
}

/**
 * Track an analytics event
 */
export async function track(ev: AnalyticsEvent): Promise<void> {
  try {
    await sink.track(ev);
  } catch (error) {
    console.error('Analytics tracking error:', error);
  }
}

/**
 * Flush pending analytics events
 */
export async function flush(): Promise<void> {
  if (sink.flush) {
    try {
      await sink.flush();
    } catch (error) {
      console.error('Analytics flush error:', error);
    }
  }
}

/**
 * Initialize analytics with configuration
 */
export async function initAnalytics(config: {
  provider: 'memory' | 'posthog' | 'segment';
  apiKey?: string;
  writeKey?: string;
  host?: string;
}): Promise<void> {
  let newSink: AnalyticsSink;

  switch (config.provider) {
    case 'posthog':
      newSink = new PostHogSink();
      await newSink.init({
        apiKey: config.apiKey!,
        host: config.host
      });
      break;
    
    case 'segment':
      newSink = new SegmentSink();
      await newSink.init({
        writeKey: config.writeKey!
      });
      break;
    
    case 'memory':
    default:
      newSink = new MemorySink();
      await newSink.init({});
      break;
  }

  await setAnalyticsSink(newSink);
}

/**
 * Helper functions for common event tracking
 */
export const trackOnboardingCompleted = (level: string, userTrack: string, spirits: string[], sessionMinutes: number) => {
  return track({
    type: 'onboarding.completed',
    level,
    track: userTrack,
    spirits,
    sessionMinutes
  });
};

export const trackLessonStart = (lessonId: string) => {
  return track({
    type: 'lesson.start',
    lessonId
  });
};

export const trackLessonComplete = (lessonId: string, durationMs: number, itemsAttempted: number, correctCount: number) => {
  return track({
    type: 'lesson.complete',
    lessonId,
    durationMs,
    itemsAttempted,
    correctCount
  });
};

export const trackItemAttempted = (itemId: string, result: 'correct' | 'incorrect', msToAnswer: number, exerciseType: 'mcq' | 'order' | 'short') => {
  return track({
    type: 'item.attempted',
    itemId,
    result,
    msToAnswer,
    exerciseType
  });
};

export const trackSchedulerPlan = (moduleId: string, mix: { current: number; review: number; older: number }, expectedMinutes: number) => {
  return track({
    type: 'scheduler.plan',
    moduleId,
    mix,
    expectedMinutes
  });
};

export const trackXPAwarded = (amount: number) => {
  return track({
    type: 'progress.xpAwarded',
    amount
  });
};

export const trackStreakUpdated = (value: number) => {
  return track({
    type: 'streak.updated',
    value
  });
};

export const trackBadgeUnlocked = (name: string) => {
  return track({
    type: 'badge.unlocked',
    name
  });
};