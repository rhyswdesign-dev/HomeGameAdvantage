/**
 * PostHog Analytics Integration
 * Safe wrapper with fallbacks
 */

import { AnalyticsSink, AnalyticsEvent } from './analytics';

export class PostHogAdapter implements AnalyticsSink {
  private client: any = null;
  private config: any = null;

  async init(cfg: { apiKey: string; host?: string }): Promise<void> {
    this.config = cfg;
    
    try {
      const PostHog = require('posthog-react-native').default;
      
      this.client = new PostHog(cfg.apiKey, {
        host: cfg.host || 'https://app.posthog.com',
        captureApplicationLifecycleEvents: false,
        debug: __DEV__,
        flushAt: 5, // Flush after 5 events
        flushInterval: 30000, // Flush every 30 seconds
      });

      console.log('PostHog initialized successfully');
      
    } catch (error) {
      console.warn('PostHog initialization failed - falling back to console logging:', error);
      this.client = null;
    }
  }

  async track(ev: AnalyticsEvent): Promise<void> {
    if (!this.client) {
      // Fallback to console logging
      console.log('[PostHog Fallback]', ev.type, ev);
      return;
    }

    try {
      // Map our events to PostHog format
      const properties = { ...ev };
      delete (properties as any).type;

      this.client.capture(ev.type, properties);
      console.log('[PostHog]', ev.type, properties);
      
    } catch (error) {
      console.error('PostHog track error:', error);
    }
  }

  async flush(): Promise<void> {
    if (this.client?.flush) {
      try {
        await this.client.flush();
        console.log('PostHog flush completed');
      } catch (error) {
        console.error('PostHog flush error:', error);
      }
    }
  }

  // Helper method to identify users
  async identify(userId: string, traits?: Record<string, any>): Promise<void> {
    if (!this.client) return;

    try {
      this.client.identify(userId, traits);
      console.log('[PostHog] Identify:', userId, traits);
    } catch (error) {
      console.error('PostHog identify error:', error);
    }
  }

  // Helper method to set user properties
  async setPersonProperties(properties: Record<string, any>): Promise<void> {
    if (!this.client) return;

    try {
      this.client.setPersonProperties(properties);
      console.log('[PostHog] Set person properties:', properties);
    } catch (error) {
      console.error('PostHog set person properties error:', error);
    }
  }
}

/**
 * Create and configure PostHog analytics sink
 */
export function createPostHogSink(apiKey: string, host?: string): PostHogAdapter {
  return new PostHogAdapter();
}

/**
 * PostHog feature flags integration (future)
 */
export class PostHogFeatureFlags {
  private client: any = null;

  constructor(client: any) {
    this.client = client;
  }

  async isFeatureEnabled(flag: string, userId?: string): Promise<boolean> {
    if (!this.client) return false;

    try {
      // TODO: Implement when PostHog is available
      // return await this.client.isFeatureEnabled(flag, userId);
      console.log('[PostHog] Check feature flag:', flag, userId);
      return false;
    } catch (error) {
      console.error('PostHog feature flag error:', error);
      return false;
    }
  }

  async getFeatureFlag(flag: string, userId?: string): Promise<string | boolean> {
    if (!this.client) return false;

    try {
      // TODO: Implement when PostHog is available
      // return await this.client.getFeatureFlag(flag, userId);
      console.log('[PostHog] Get feature flag:', flag, userId);
      return false;
    } catch (error) {
      console.error('PostHog get feature flag error:', error);
      return false;
    }
  }
}