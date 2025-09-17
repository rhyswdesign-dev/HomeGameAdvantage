/**
 * Monetization Service
 * XP to Lives conversion, IAP stubs, and ad integration
 */

import { useLives } from '../store/useLives';
import { MemoryUserRepository } from '../repos/memory/userRepository';

// Default repositories - can be injected for testing
let userRepo = new MemoryUserRepository();

// Configuration
const XP_COST_PER_LIFE = 50;
const REFILL_HOURS = 2;

/**
 * Set repository dependency for testing
 */
export function setUserRepository(repo: any) {
  userRepo = repo;
}

/**
 * Buy a life using XP
 */
export async function buyLifeWithXP(
  userId: string, 
  costXP: number = XP_COST_PER_LIFE
): Promise<boolean> {
  try {
    // Get user profile to check XP
    const profile = await userRepo.getUserProfile(userId);
    
    if (!profile || profile.xp < costXP) {
      console.log('Insufficient XP for life purchase');
      return false;
    }

    // Deduct XP
    const newXP = profile.xp - costXP;
    await userRepo.updatePreferences(userId, { xp: newXP });

    // Add life
    const livesStore = useLives.getState();
    livesStore.addLife(1);

    console.log(`Purchased life for ${costXP} XP. Remaining XP: ${newXP}`);
    return true;
  } catch (error) {
    console.error('Error buying life with XP:', error);
    return false;
  }
}

/**
 * Show rewarded ad for life
 * Stub implementation - returns true in development
 */
export async function showRewardedAd(): Promise<boolean> {
  return new Promise((resolve) => {
    // Simulate ad loading and display
    console.log('Showing rewarded ad...');
    
    // Simulate ad experience (3 seconds in dev)
    setTimeout(() => {
      // In development, always return true
      // In production, this would integrate with AdMob/AppLovin
      const adWatched = true; // Math.random() > 0.1; // 90% success rate
      
      if (adWatched) {
        console.log('Rewarded ad completed successfully');
        
        // Grant life reward
        const livesStore = useLives.getState();
        livesStore.addLife(1);
      } else {
        console.log('Rewarded ad failed or was skipped');
      }
      
      resolve(adWatched);
    }, 3000);
  });
}

/**
 * Purchase XP bundle via IAP
 * Stub implementation for store integration
 */
export async function purchaseXPBundle(sku: string): Promise<{
  success: boolean;
  xpGranted?: number;
}> {
  return new Promise((resolve) => {
    console.log(`Attempting to purchase XP bundle: ${sku}`);
    
    // Simulate IAP flow
    setTimeout(() => {
      // Map SKUs to XP amounts
      const xpBundles: Record<string, number> = {
        'xp_small': 100,
        'xp_medium': 250,
        'xp_large': 500,
        'xp_mega': 1200
      };
      
      const xpAmount = xpBundles[sku];
      
      if (!xpAmount) {
        console.log('Unknown XP bundle SKU');
        resolve({ success: false });
        return;
      }
      
      // In development, simulate 95% success rate
      const purchaseSuccess = Math.random() > 0.05;
      
      if (purchaseSuccess) {
        console.log(`XP bundle purchased successfully: +${xpAmount} XP`);
        // TODO: Grant XP to user profile
        resolve({ success: true, xpGranted: xpAmount });
      } else {
        console.log('XP bundle purchase failed');
        resolve({ success: false });
      }
    }, 2000);
  });
}

/**
 * Schedule automatic life refill
 */
export function scheduleRefill(hours: number = REFILL_HOURS): void {
  const livesStore = useLives.getState();
  livesStore.setRefillTimer(hours);
  console.log(`Life refill scheduled for ${hours} hours from now`);
}

/**
 * Get XP cost for buying lives (dynamic pricing)
 */
export function getLifeCostXP(livesNeeded: number = 1): number {
  // Could implement dynamic pricing based on user behavior
  return XP_COST_PER_LIFE * livesNeeded;
}

/**
 * Check if user can afford to buy lives
 */
export async function canAffordLife(userId: string, livesNeeded: number = 1): Promise<boolean> {
  try {
    const profile = await userRepo.getUserProfile(userId);
    if (!profile) return false;
    
    const cost = getLifeCostXP(livesNeeded);
    return profile.xp >= cost;
  } catch (error) {
    console.error('Error checking life affordability:', error);
    return false;
  }
}

/**
 * Get available monetization options when lives are depleted
 */
export async function getLifeRecoveryOptions(userId: string): Promise<{
  canBuyWithXP: boolean;
  xpCost: number;
  canWatchAd: boolean;
  canPurchaseXP: boolean;
  timeUntilRefill?: number;
}> {
  const livesStore = useLives.getState();
  const xpCost = getLifeCostXP(1);
  const canBuyWithXP = await canAffordLife(userId, 1);
  
  let timeUntilRefill: number | undefined;
  if (livesStore.refillAt) {
    timeUntilRefill = Math.max(0, livesStore.refillAt - Date.now());
  }
  
  return {
    canBuyWithXP,
    xpCost,
    canWatchAd: true, // Always available in this implementation
    canPurchaseXP: true, // Always available
    timeUntilRefill
  };
}

/**
 * Format time until refill for display
 */
export function formatRefillTime(milliseconds: number): string {
  const totalMinutes = Math.ceil(milliseconds / (1000 * 60));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else {
    return `${minutes}m`;
  }
}

/**
 * Analytics integration for monetization events
 */
export function trackMonetizationEvent(event: {
  type: 'life_purchased_xp' | 'life_earned_ad' | 'xp_bundle_purchased' | 'life_refilled';
  userId: string;
  value?: number;
  currency?: string;
}) {
  console.log('[Monetization Analytics]', event);
  
  // TODO: Integrate with analytics service
  // track({
  //   type: 'monetization.event',
  //   eventType: event.type,
  //   userId: event.userId,
  //   value: event.value,
  //   currency: event.currency
  // });
}