/**
 * Segment Analytics Integration
 * Safe wrapper with fallbacks
 */

import { AnalyticsSink, AnalyticsEvent } from './analytics';

export class SegmentAdapter implements AnalyticsSink {
  private client: any = null;
  private config: any = null;

  async init(cfg: { writeKey: string }): Promise<void> {
    this.config = cfg;
    
    try {
      // TODO: Uncomment when Segment is available
      // const { createClient } = require('@segment/analytics-react-native');
      // 
      // this.client = createClient({
      //   writeKey: cfg.writeKey,
      //   debug: __DEV__,
      //   trackAppLifecycleEvents: false,
      // });
      //
      // console.log('Segment initialized successfully');
      
      // For now, just log
      console.log('Segment would initialize with writeKey:', cfg.writeKey);
      
    } catch (error) {
      console.warn('Segment initialization failed - falling back to console logging:', error);
      this.client = null;
    }
  }

  async track(ev: AnalyticsEvent): Promise<void> {
    if (!this.client) {
      // Fallback to console logging
      console.log('[Segment Fallback]', ev.type, ev);
      return;
    }

    try {
      // Map our events to Segment format
      const properties = { ...ev };
      delete (properties as any).type;

      // TODO: Uncomment when Segment is available
      // this.client.track(ev.type, properties);
      
      console.log('[Segment]', ev.type, properties);
      
    } catch (error) {
      console.error('Segment track error:', error);
    }
  }

  async flush(): Promise<void> {
    if (this.client?.flush) {
      try {
        // TODO: Uncomment when Segment is available
        // await this.client.flush();
        console.log('Segment flush completed');
      } catch (error) {
        console.error('Segment flush error:', error);
      }
    }
  }

  // Helper method to identify users
  async identify(userId: string, traits?: Record<string, any>): Promise<void> {
    if (!this.client) return;

    try {
      // TODO: Uncomment when Segment is available
      // this.client.identify(userId, traits);
      console.log('[Segment] Identify:', userId, traits);
    } catch (error) {
      console.error('Segment identify error:', error);
    }
  }

  // Helper method to track screen views
  async screen(name: string, properties?: Record<string, any>): Promise<void> {
    if (!this.client) return;

    try {
      // TODO: Uncomment when Segment is available
      // this.client.screen(name, properties);
      console.log('[Segment] Screen:', name, properties);
    } catch (error) {
      console.error('Segment screen error:', error);
    }
  }

  // Helper method to set user context
  async group(groupId: string, traits?: Record<string, any>): Promise<void> {
    if (!this.client) return;

    try {
      // TODO: Uncomment when Segment is available
      // this.client.group(groupId, traits);
      console.log('[Segment] Group:', groupId, traits);
    } catch (error) {
      console.error('Segment group error:', error);
    }
  }
}

/**
 * Create and configure Segment analytics sink
 */
export function createSegmentSink(writeKey: string): SegmentAdapter {
  return new SegmentAdapter();
}

/**
 * Segment destination-specific helpers
 */
export class SegmentDestinations {
  private client: any = null;

  constructor(client: any) {
    this.client = client;
  }

  // Send events to specific destinations
  async trackToDestination(
    event: string, 
    properties: Record<string, any>, 
    destinations: string[]
  ): Promise<void> {
    if (!this.client) return;

    try {
      // TODO: Implement when Segment is available
      // const integrations = destinations.reduce((acc, dest) => {
      //   acc[dest] = true;
      //   return acc;
      // }, {} as Record<string, boolean>);
      //
      // this.client.track(event, properties, { integrations });
      
      console.log('[Segment] Track to destinations:', event, properties, destinations);
    } catch (error) {
      console.error('Segment destination tracking error:', error);
    }
  }

  // Disable specific destinations for an event
  async trackExcludingDestinations(
    event: string, 
    properties: Record<string, any>, 
    excludeDestinations: string[]
  ): Promise<void> {
    if (!this.client) return;

    try {
      // TODO: Implement when Segment is available
      // const integrations = excludeDestinations.reduce((acc, dest) => {
      //   acc[dest] = false;
      //   return acc;
      // }, {} as Record<string, boolean>);
      //
      // this.client.track(event, properties, { integrations });
      
      console.log('[Segment] Track excluding destinations:', event, properties, excludeDestinations);
    } catch (error) {
      console.error('Segment exclude destinations error:', error);
    }
  }
}