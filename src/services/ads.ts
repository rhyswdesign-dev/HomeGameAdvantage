/**
 * Advertising Service
 * Platform-safe ad integration with rewarded ads
 */

export interface AdReward {
  type: string;
  amount: number;
}

export interface AdService {
  initialize(config: any): Promise<void>;
  loadRewardedAd(adUnitId: string): Promise<void>;
  showRewardedAd(adUnitId: string): Promise<AdReward | null>;
  isRewardedAdLoaded(adUnitId: string): boolean;
  preloadAds(): Promise<void>;
  isAvailable(): Promise<boolean>;
}

/**
 * Stub Ad Service for development
 */
export class StubAdService implements AdService {
  private loadedAds = new Set<string>();
  private config: any = null;

  async initialize(config: any): Promise<void> {
    this.config = config;
    console.log('Stub Ad Service initialized with config:', config);
  }

  async loadRewardedAd(adUnitId: string): Promise<void> {
    console.log('Loading rewarded ad:', adUnitId);
    
    // Simulate loading delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simulate 90% load success rate
    if (Math.random() < 0.9) {
      this.loadedAds.add(adUnitId);
      console.log('Rewarded ad loaded successfully:', adUnitId);
    } else {
      console.log('Rewarded ad failed to load:', adUnitId);
      throw new Error('Ad failed to load');
    }
  }

  async showRewardedAd(adUnitId: string): Promise<AdReward | null> {
    console.log('Showing rewarded ad:', adUnitId);
    
    if (!this.loadedAds.has(adUnitId)) {
      throw new Error('Ad not loaded');
    }
    
    // Simulate ad display time
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Remove from loaded ads (single use)
    this.loadedAds.delete(adUnitId);
    
    // Simulate 95% completion rate
    if (Math.random() < 0.95) {
      const reward: AdReward = {
        type: 'life',
        amount: 1
      };
      console.log('Rewarded ad completed, granting reward:', reward);
      return reward;
    } else {
      console.log('Rewarded ad was skipped or failed');
      return null;
    }
  }

  isRewardedAdLoaded(adUnitId: string): boolean {
    return this.loadedAds.has(adUnitId);
  }

  async preloadAds(): Promise<void> {
    console.log('Preloading ads...');
    
    // Preload common ad units
    const adUnits = ['life_reward', 'xp_bonus', 'hint_unlock'];
    
    for (const adUnit of adUnits) {
      try {
        await this.loadRewardedAd(adUnit);
      } catch (error) {
        console.warn(`Failed to preload ad: ${adUnit}`, error);
      }
    }
  }

  async isAvailable(): Promise<boolean> {
    return true; // Always available in stub
  }
}

/**
 * AdMob Service (Google Mobile Ads)
 */
export class AdMobService implements AdService {
  private initialized = false;
  private loadedAds = new Map<string, any>();

  async initialize(config: { appId: string; testDeviceIds?: string[] }): Promise<void> {
    try {
      const mobileAds = require('react-native-google-mobile-ads').default;
      
      await mobileAds().initialize();
      
      if (config.testDeviceIds) {
        await mobileAds().setRequestConfiguration({
          testDeviceIdentifiers: config.testDeviceIds,
        });
      }
      
      console.log('AdMob initialized successfully');
      this.initialized = true;
    } catch (error) {
      console.error('AdMob initialization failed:', error);
      this.initialized = false;
      throw error;
    }
  }

  async loadRewardedAd(adUnitId: string): Promise<void> {
    if (!this.initialized) {
      throw new Error('AdMob not initialized');
    }

    try {
      // TODO: Load rewarded ad
      // 
      // import { RewardedAd, RewardedAdEventType } from '@react-native-google-mobile-ads/googlemobileads';
      // 
      // const rewardedAd = RewardedAd.createForAdRequest(adUnitId);
      // 
      // return new Promise((resolve, reject) => {
      //   const unsubscribe = rewardedAd.addAdEventListener(RewardedAdEventType.LOADED, () => {
      //     unsubscribe();
      //     resolve();
      //   });
      //   
      //   rewardedAd.addAdEventListener(RewardedAdEventType.ERROR, (error) => {
      //     unsubscribe();
      //     reject(error);
      //   });
      //   
      //   rewardedAd.load();
      // });
      
      throw new Error('AdMob not implemented');
    } catch (error) {
      console.error('AdMob load failed:', error);
      throw error;
    }
  }

  async showRewardedAd(adUnitId: string): Promise<AdReward | null> {
    try {
      // TODO: Show rewarded ad
      // 
      // return new Promise((resolve) => {
      //   const rewardedAd = this.getLoadedAd(adUnitId);
      //   
      //   rewardedAd.addAdEventListener(RewardedAdEventType.EARNED_REWARD, (reward) => {
      //     resolve({ type: reward.type, amount: reward.amount });
      //   });
      //   
      //   rewardedAd.addAdEventListener(RewardedAdEventType.CLOSED, () => {
      //     resolve(null);
      //   });
      //   
      //   rewardedAd.show();
      // });
      
      throw new Error('AdMob not implemented');
    } catch (error) {
      console.error('AdMob show failed:', error);
      throw error;
    }
  }

  isRewardedAdLoaded(adUnitId: string): boolean {
    return this.loadedAds.has(adUnitId);
  }

  async preloadAds(): Promise<void> {
    if (!this.initialized) {
      console.warn('AdMob not initialized, skipping preload');
      return;
    }

    const adUnits = Object.values(AD_UNITS);
    
    for (const adUnit of adUnits) {
      try {
        await this.loadRewardedAd(adUnit);
      } catch (error) {
        console.warn(`Failed to preload ad: ${adUnit}`, error);
      }
    }
    
    console.log('AdMob ads preloaded');
  }

  async isAvailable(): Promise<boolean> {
    return this.initialized;
  }
}

/**
 * AppLovin MAX Service
 */
export class AppLovinService implements AdService {
  private initialized = false;

  async initialize(config: { sdkKey: string }): Promise<void> {
    try {
      // TODO: Initialize AppLovin MAX
      // 
      // import { AppLovinMAX } from 'react-native-applovin-max';
      // 
      // await AppLovinMAX.initialize(config.sdkKey);
      
      console.log('AppLovin would initialize with SDK key:', config.sdkKey);
      this.initialized = true;
    } catch (error) {
      console.error('AppLovin initialization failed:', error);
      throw error;
    }
  }

  async loadRewardedAd(adUnitId: string): Promise<void> {
    if (!this.initialized) {
      throw new Error('AppLovin not initialized');
    }

    try {
      // TODO: Load rewarded ad
      // 
      // import { AppLovinMAX } from 'react-native-applovin-max';
      // 
      // await AppLovinMAX.loadRewardedAd(adUnitId);
      
      throw new Error('AppLovin not implemented');
    } catch (error) {
      console.error('AppLovin load failed:', error);
      throw error;
    }
  }

  async showRewardedAd(adUnitId: string): Promise<AdReward | null> {
    try {
      // TODO: Show rewarded ad
      // 
      // import { AppLovinMAX } from 'react-native-applovin-max';
      // 
      // const result = await AppLovinMAX.showRewardedAd(adUnitId);
      // return result.reward;
      
      throw new Error('AppLovin not implemented');
    } catch (error) {
      console.error('AppLovin show failed:', error);
      throw error;
    }
  }

  isRewardedAdLoaded(adUnitId: string): boolean {
    // TODO: Check if ad is loaded
    return false;
  }

  async preloadAds(): Promise<void> {
    // TODO: Preload common ad units
    console.log('AppLovin preload not implemented');
  }

  async isAvailable(): Promise<boolean> {
    return this.initialized;
  }
}

// Export singleton instance
let adService: AdService;

/**
 * Get ad service instance
 */
export function getAdService(): AdService {
  if (!adService) {
    // Use stub in development, real service in production
    adService = __DEV__ ? new StubAdService() : new AdMobService();
  }
  return adService;
}

/**
 * Set ad service (for testing)
 */
export function setAdService(service: AdService): void {
  adService = service;
}

/**
 * Ad unit IDs configuration
 */
export const AD_UNITS = {
  LIFE_REWARD: __DEV__ 
    ? 'ca-app-pub-3940256099942544/5224354917' 
    : (process.env.EXPO_PUBLIC_ADMOB_LIFE_REWARD_ID || 'ca-app-pub-3940256099942544/5224354917'),
  XP_BONUS: __DEV__ 
    ? 'ca-app-pub-3940256099942544/5224354917' 
    : (process.env.EXPO_PUBLIC_ADMOB_XP_BONUS_ID || 'ca-app-pub-3940256099942544/5224354917'),
  HINT_UNLOCK: __DEV__ 
    ? 'ca-app-pub-3940256099942544/5224354917' 
    : (process.env.EXPO_PUBLIC_ADMOB_XP_BONUS_ID || 'ca-app-pub-3940256099942544/5224354917')
} as const;

/**
 * Initialize ads with default configuration
 */
export async function initializeAds(): Promise<void> {
  const service = getAdService();
  
  await service.initialize({
    appId: __DEV__ 
      ? 'ca-app-pub-3940256099942544~3347511713' 
      : (process.env.EXPO_PUBLIC_ADMOB_APP_ID || 'ca-app-pub-3940256099942544~3347511713'),
    testDeviceIds: __DEV__ ? ['DEVICE_ID_HERE'] : undefined
  });
  
  // Preload common ads
  await service.preloadAds();
}