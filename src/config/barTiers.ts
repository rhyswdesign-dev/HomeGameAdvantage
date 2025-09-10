import { BarTier } from '../types/bar';

export const BAR_TIERS: Record<BarTier, {
  maxDrinks: number;
  maxEvents: number;
  maxSocial: number;
  showQuickTags: boolean;
  showQuickInfo: boolean;
  showChallenge: boolean;
  showCrowdTags: boolean;
  showBartender: boolean;
  showTeam: boolean;
  showRewards: boolean;
  showStoryLong: boolean;
}> = {
  bronze: {
    maxDrinks: 1,
    maxEvents: 1,
    maxSocial: 1,
    showQuickTags: true,
    showQuickInfo: false,
    showChallenge: false,
    showCrowdTags: false,
    showBartender: false,
    showTeam: false,
    showRewards: false,
    showStoryLong: false,
  },
  silver: {
    maxDrinks: 3,
    maxEvents: 2,
    maxSocial: 2,
    showQuickTags: false,
    showQuickInfo: true,
    showChallenge: true,
    showCrowdTags: true,
    showBartender: true,
    showTeam: false,
    showRewards: false,
    showStoryLong: false,
  },
  gold: {
    maxDrinks: 6,
    maxEvents: 4,
    maxSocial: 6,
    showQuickTags: false,
    showQuickInfo: true,
    showChallenge: true,
    showCrowdTags: true,
    showBartender: true,
    showTeam: true,
    showRewards: true,
    showStoryLong: true,
  },
};