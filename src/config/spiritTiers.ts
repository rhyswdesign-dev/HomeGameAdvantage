import type { SpiritTier } from '../types/spirit';

export const SPIRIT_TIERS: Record<SpiritTier, {
  showProducts: boolean;
  showRecipes: boolean;
  showChallenge: boolean;
  maxEvents: number;
  showAmbassadors: boolean;
  showLearning: boolean;
  showRewards: boolean;
  showSocial: boolean;
  showBrandVideos: boolean;
}> = {
  bronze: {
    showProducts: true,
    showRecipes: false,
    showChallenge: false,
    maxEvents: 1,
    showAmbassadors: false,
    showLearning: false,
    showRewards: false,
    showSocial: false,
    showBrandVideos: false
  },
  silver: {
    showProducts: true,
    showRecipes: false,
    showChallenge: true,
    maxEvents: 2,
    showAmbassadors: false,
    showLearning: true,
    showRewards: false,
    showSocial: false,
    showBrandVideos: false
  },
  gold: {
    showProducts: true,
    showRecipes: true,
    showChallenge: true,
    maxEvents: 4,
    showAmbassadors: true,
    showLearning: true,
    showRewards: true,
    showSocial: true,
    showBrandVideos: true
  }
};