/**
 * Monetization Context Provider
 * Provides monetization capabilities throughout the app
 */

import React, { createContext, useContext, ReactNode } from 'react';
import { useMonetization } from '../hooks/useMonetization';
import { IAPProduct, IAPPurchase } from '../services/iap';
import { AdReward } from '../services/ads';

interface MonetizationContextType {
  iapAvailable: boolean;
  adsAvailable: boolean;
  products: IAPProduct[];
  loading: boolean;
  error?: string;
  purchaseProduct: (productId: string) => Promise<IAPPurchase | null>;
  restorePurchases: () => Promise<IAPPurchase[]>;
  showRewardedAd: (adUnitId?: string) => Promise<AdReward | null>;
  loadRewardedAd: (adUnitId?: string) => Promise<void>;
  isAdLoaded: (adUnitId?: string) => boolean;
  refresh: () => Promise<void>;
}

const MonetizationContext = createContext<MonetizationContextType | null>(null);

interface MonetizationProviderProps {
  children: ReactNode;
}

export const MonetizationProvider: React.FC<MonetizationProviderProps> = ({ children }) => {
  const monetization = useMonetization();

  return (
    <MonetizationContext.Provider value={monetization}>
      {children}
    </MonetizationContext.Provider>
  );
};

export const useMonetizationContext = (): MonetizationContextType => {
  const context = useContext(MonetizationContext);
  if (!context) {
    throw new Error('useMonetizationContext must be used within a MonetizationProvider');
  }
  return context;
};

export default MonetizationProvider;