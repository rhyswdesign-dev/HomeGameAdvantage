/**
 * In-App Purchase Service
 * Platform-safe IAP integration with stubs
 */

export interface IAPProduct {
  id: string;
  title: string;
  description: string;
  price: string;
  localizedPrice: string;
  currency: string;
  type: 'consumable' | 'non_consumable' | 'subscription';
}

export interface IAPPurchase {
  transactionId: string;
  productId: string;
  purchaseTime: number;
  purchaseState: 'purchased' | 'pending' | 'cancelled';
  receipt: string;
}

export interface IAPService {
  initialize(): Promise<void>;
  getProducts(productIds: string[]): Promise<IAPProduct[]>;
  purchaseProduct(productId: string): Promise<IAPPurchase>;
  restorePurchases(): Promise<IAPPurchase[]>;
  finishTransaction(transactionId: string): Promise<void>;
  isAvailable(): Promise<boolean>;
}

/**
 * Stub IAP Service for development
 */
export class StubIAPService implements IAPService {
  private products: Record<string, IAPProduct> = {
    'xp_small': {
      id: 'xp_small',
      title: 'Small XP Pack',
      description: '100 XP points',
      price: '$0.99',
      localizedPrice: '$0.99',
      currency: 'USD',
      type: 'consumable'
    },
    'xp_medium': {
      id: 'xp_medium',
      title: 'Medium XP Pack',
      description: '250 XP points',
      price: '$1.99',
      localizedPrice: '$1.99',
      currency: 'USD',
      type: 'consumable'
    },
    'xp_large': {
      id: 'xp_large',
      title: 'Large XP Pack',
      description: '500 XP points',
      price: '$3.99',
      localizedPrice: '$3.99',
      currency: 'USD',
      type: 'consumable'
    },
    'xp_mega': {
      id: 'xp_mega',
      title: 'Mega XP Pack',
      description: '1200 XP points',
      price: '$7.99',
      localizedPrice: '$7.99',
      currency: 'USD',
      type: 'consumable'
    },
    'premium_subscription': {
      id: 'premium_subscription',
      title: 'Premium Subscription',
      description: 'Unlimited lives and exclusive content',
      price: '$4.99/month',
      localizedPrice: '$4.99/month',
      currency: 'USD',
      type: 'subscription'
    }
  };

  async initialize(): Promise<void> {
    console.log('Stub IAP Service initialized');
    // TODO: Initialize platform-specific IAP
    // iOS: StoreKit
    // Android: Google Play Billing
  }

  async getProducts(productIds: string[]): Promise<IAPProduct[]> {
    console.log('Getting products:', productIds);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return productIds
      .map(id => this.products[id])
      .filter(Boolean);
  }

  async purchaseProduct(productId: string): Promise<IAPPurchase> {
    console.log('Purchasing product:', productId);
    
    // Simulate purchase flow
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simulate 95% success rate
    if (Math.random() < 0.95) {
      const purchase: IAPPurchase = {
        transactionId: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        productId,
        purchaseTime: Date.now(),
        purchaseState: 'purchased',
        receipt: `receipt_${productId}_${Date.now()}`
      };
      
      console.log('Purchase successful:', purchase);
      return purchase;
    } else {
      throw new Error('Purchase cancelled or failed');
    }
  }

  async restorePurchases(): Promise<IAPPurchase[]> {
    console.log('Restoring purchases');
    
    // Simulate restore delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Return empty array for stub - in production would restore actual purchases
    return [];
  }

  async finishTransaction(transactionId: string): Promise<void> {
    console.log('Finishing transaction:', transactionId);
    // In production, this would acknowledge the purchase
  }

  async isAvailable(): Promise<boolean> {
    // Always available in stub
    return true;
  }
}

/**
 * Real IAP Service (platform-specific implementation)
 */
export class PlatformIAPService implements IAPService {
  async initialize(): Promise<void> {
    try {
      // TODO: Initialize platform-specific IAP libraries
      // 
      // For iOS:
      // import { initConnection } from 'react-native-iap';
      // await initConnection();
      //
      // For Android:
      // await initConnection();
      
      console.log('Platform IAP Service would initialize here');
    } catch (error) {
      console.error('IAP initialization failed:', error);
      throw error;
    }
  }

  async getProducts(productIds: string[]): Promise<IAPProduct[]> {
    try {
      // TODO: Get products from platform store
      // 
      // import { getProducts } from 'react-native-iap';
      // const products = await getProducts({ skus: productIds });
      // return products.map(mapToIAPProduct);
      
      throw new Error('Platform IAP not implemented');
    } catch (error) {
      console.error('Get products failed:', error);
      throw error;
    }
  }

  async purchaseProduct(productId: string): Promise<IAPPurchase> {
    try {
      // TODO: Initiate platform purchase
      // 
      // import { requestPurchase } from 'react-native-iap';
      // const purchase = await requestPurchase({ sku: productId });
      // return mapToIAPPurchase(purchase);
      
      throw new Error('Platform IAP not implemented');
    } catch (error) {
      console.error('Purchase failed:', error);
      throw error;
    }
  }

  async restorePurchases(): Promise<IAPPurchase[]> {
    try {
      // TODO: Restore platform purchases
      // 
      // import { getAvailablePurchases } from 'react-native-iap';
      // const purchases = await getAvailablePurchases();
      // return purchases.map(mapToIAPPurchase);
      
      throw new Error('Platform IAP not implemented');
    } catch (error) {
      console.error('Restore purchases failed:', error);
      throw error;
    }
  }

  async finishTransaction(transactionId: string): Promise<void> {
    try {
      // TODO: Finish platform transaction
      // 
      // import { finishTransaction } from 'react-native-iap';
      // await finishTransaction({ purchase: { transactionId } });
      
      console.log('Platform transaction finish not implemented');
    } catch (error) {
      console.error('Finish transaction failed:', error);
      throw error;
    }
  }

  async isAvailable(): Promise<boolean> {
    try {
      // TODO: Check platform IAP availability
      // 
      // import { initConnection } from 'react-native-iap';
      // await initConnection();
      // return true;
      
      return false; // Not implemented yet
    } catch (error) {
      console.error('IAP availability check failed:', error);
      return false;
    }
  }
}

// Export singleton instance
let iapService: IAPService;

/**
 * Get IAP service instance
 */
export function getIAPService(): IAPService {
  if (!iapService) {
    // Use stub in development, platform service in production
    iapService = __DEV__ ? new StubIAPService() : new PlatformIAPService();
  }
  return iapService;
}

/**
 * Set IAP service (for testing)
 */
export function setIAPService(service: IAPService): void {
  iapService = service;
}

/**
 * XP Bundle configuration
 */
export const XP_BUNDLES = {
  'xp_small': { xp: 100, price: 0.99 },
  'xp_medium': { xp: 250, price: 1.99 },
  'xp_large': { xp: 500, price: 3.99 },
  'xp_mega': { xp: 1200, price: 7.99 }
} as const;

/**
 * Get XP amount for product ID
 */
export function getXPForProduct(productId: string): number {
  return (XP_BUNDLES as any)[productId]?.xp || 0;
}