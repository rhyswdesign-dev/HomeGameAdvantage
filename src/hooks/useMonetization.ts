/**
 * Monetization Hook
 * React hook for managing IAP and ads
 */

import { useState, useEffect, useCallback } from 'react';
import { getIAPService, IAPProduct, IAPPurchase } from '../services/iap';
import { getAdService, AdReward, AD_UNITS } from '../services/ads';
import { useAnalyticsContext } from '../context/AnalyticsContext';

interface MonetizationState {
  iapAvailable: boolean;
  adsAvailable: boolean;
  products: IAPProduct[];
  loading: boolean;
  error?: string;
}

interface MonetizationHook extends MonetizationState {
  purchaseProduct: (productId: string) => Promise<IAPPurchase | null>;
  restorePurchases: () => Promise<IAPPurchase[]>;
  showRewardedAd: (adUnitId?: string) => Promise<AdReward | null>;
  loadRewardedAd: (adUnitId?: string) => Promise<void>;
  isAdLoaded: (adUnitId?: string) => boolean;
  refresh: () => Promise<void>;
}

const XP_PRODUCT_IDS = ['xp_small', 'xp_medium', 'xp_large', 'xp_mega'];
const SUBSCRIPTION_PRODUCT_IDS = ['premium_subscription'];

export const useMonetization = (): MonetizationHook => {
  const [state, setState] = useState<MonetizationState>({
    iapAvailable: false,
    adsAvailable: false,
    products: [],
    loading: true
  });
  
  const analytics = useAnalyticsContext();

  useEffect(() => {
    initializeMonetization();
  }, []);

  const initializeMonetization = async () => {
    setState(prev => ({ ...prev, loading: true, error: undefined }));

    try {
      const iapService = getIAPService();
      const adService = getAdService();

      // Initialize services
      await Promise.all([
        iapService.initialize(),
        adService.initialize({
          appId: process.env.EXPO_PUBLIC_ADMOB_APP_ID || 'ca-app-pub-3940256099942544~3347511713',
          testDeviceIds: __DEV__ ? ['DEVICE_ID_HERE'] : undefined
        })
      ]);

      // Check availability
      const [iapAvailable, adsAvailable] = await Promise.all([
        iapService.isAvailable(),
        adService.isAvailable()
      ]);

      // Get products
      let products: IAPProduct[] = [];
      if (iapAvailable) {
        try {
          products = await iapService.getProducts([...XP_PRODUCT_IDS, ...SUBSCRIPTION_PRODUCT_IDS]);
        } catch (error) {
          console.warn('Failed to get IAP products:', error);
        }
      }

      // Preload ads
      if (adsAvailable) {
        try {
          await adService.preloadAds();
        } catch (error) {
          console.warn('Failed to preload ads:', error);
        }
      }

      setState({
        iapAvailable,
        adsAvailable,
        products,
        loading: false
      });

      console.log('Monetization initialized:', { iapAvailable, adsAvailable, productsCount: products.length });
    } catch (error) {
      console.error('Monetization initialization failed:', error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }));
    }
  };

  const purchaseProduct = useCallback(async (productId: string): Promise<IAPPurchase | null> => {
    if (!state.iapAvailable) {
      throw new Error('IAP not available');
    }

    try {
      const iapService = getIAPService();
      const purchase = await iapService.purchaseProduct(productId);
      
      // Track purchase
      analytics.track({
        type: 'vault.purchase.completed',
        itemId: productId,
        amount: 0, // Would be filled from product data
        currency: 'USD'
      });

      // Finish transaction
      await iapService.finishTransaction(purchase.transactionId);
      
      console.log('Purchase completed:', purchase);
      return purchase;
    } catch (error) {
      console.error('Purchase failed:', error);
      throw error;
    }
  }, [state.iapAvailable, analytics]);

  const restorePurchases = useCallback(async (): Promise<IAPPurchase[]> => {
    if (!state.iapAvailable) {
      throw new Error('IAP not available');
    }

    try {
      const iapService = getIAPService();
      const purchases = await iapService.restorePurchases();
      
      console.log('Purchases restored:', purchases);
      return purchases;
    } catch (error) {
      console.error('Restore purchases failed:', error);
      throw error;
    }
  }, [state.iapAvailable]);

  const showRewardedAd = useCallback(async (adUnitId: string = AD_UNITS.LIFE_REWARD): Promise<AdReward | null> => {
    if (!state.adsAvailable) {
      throw new Error('Ads not available');
    }

    try {
      const adService = getAdService();
      
      // Load ad if not already loaded
      if (!adService.isRewardedAdLoaded(adUnitId)) {
        await adService.loadRewardedAd(adUnitId);
      }
      
      const reward = await adService.showRewardedAd(adUnitId);
      
      // Track ad view
      if (reward) {
        analytics.track({
          type: 'progress.xpAwarded',
          amount: 0 // Lives are not XP but we track the ad completion
        });
      }
      
      console.log('Rewarded ad completed:', reward);
      return reward;
    } catch (error) {
      console.error('Rewarded ad failed:', error);
      throw error;
    }
  }, [state.adsAvailable, analytics]);

  const loadRewardedAd = useCallback(async (adUnitId: string = AD_UNITS.LIFE_REWARD): Promise<void> => {
    if (!state.adsAvailable) {
      throw new Error('Ads not available');
    }

    try {
      const adService = getAdService();
      await adService.loadRewardedAd(adUnitId);
      console.log('Rewarded ad loaded:', adUnitId);
    } catch (error) {
      console.error('Load rewarded ad failed:', error);
      throw error;
    }
  }, [state.adsAvailable]);

  const isAdLoaded = useCallback((adUnitId: string = AD_UNITS.LIFE_REWARD): boolean => {
    if (!state.adsAvailable) return false;
    
    const adService = getAdService();
    return adService.isRewardedAdLoaded(adUnitId);
  }, [state.adsAvailable]);

  const refresh = useCallback(async (): Promise<void> => {
    await initializeMonetization();
  }, []);

  return {
    ...state,
    purchaseProduct,
    restorePurchases,
    showRewardedAd,
    loadRewardedAd,
    isAdLoaded,
    refresh
  };
};

export default useMonetization;