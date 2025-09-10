/**
 * Bar Tier Inference System
 * 
 * Automatically determines a bar's tier (Bronze/Silver/Gold) based on content completeness.
 * Content teams can "upgrade" bars by adding more sections:
 * 
 * BRONZE → SILVER: Add quickInfo, 2-3 drinks, events, crowdTags, or bartender
 * SILVER → GOLD: Add team, rewards, story.long, or reach thresholds (4+ drinks, 3+ events/social)
 */

import { BarContent, BarTier } from '../types/bar';

export function inferBarTier(content: BarContent): BarTier {
  // Gold tier - comprehensive content (first match wins)
  if (
    (content.team && content.team.length >= 1) ||
    (content.rewards && content.rewards.length >= 1) ||
    (content.story?.long) ||
    (content.events && content.events.length >= 3) ||
    (content.signatureDrinks && content.signatureDrinks.length >= 4) ||
    (content.social && content.social.length >= 3) ||
    (content.challenge && 
     ((content.events && content.events.length >= 2) || 
      (content.signatureDrinks && content.signatureDrinks.length >= 3)))
  ) {
    return 'gold';
  }

  // Silver tier - enhanced content
  if (
    content.quickInfo ||
    (content.signatureDrinks && content.signatureDrinks.length >= 2 && content.signatureDrinks.length <= 3) ||
    (content.events && content.events.length >= 1 && content.events.length <= 2) ||
    (content.crowdTags && content.crowdTags.length >= 1) ||
    content.bartender ||
    content.challenge
  ) {
    return 'silver';
  }

  // Bronze tier - basic presence
  return 'bronze';
}

export function resolveTier(paramTier: BarTier | undefined, content: BarContent): BarTier {
  return paramTier ?? inferBarTier(content);
}