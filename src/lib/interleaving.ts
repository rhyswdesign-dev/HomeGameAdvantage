/**
 * Interleaving Algorithm
 * Mixes current content with review items for optimal learning
 */

import { Item, UserProgress } from '../types/domain';

export interface InterleavingPlan {
  items: Item[];
  mix: {
    current: number;
    review: number;
    older: number;
  };
  estimatedMinutes: number;
}

export interface InterleavingTarget {
  current: number; // 0.7 = 70%
  review: number;  // 0.2 = 20%
  older: number;   // 0.1 = 10%
}

const DEFAULT_TARGET: InterleavingTarget = {
  current: 0.7,
  review: 0.2,
  older: 0.1
};

/**
 * Plan an interleaved session mixing new and review content
 * @param dueItems Items due for review
 * @param newItems New items from current module
 * @param olderItems Older review items
 * @param targetMinutes Target session length
 * @param target Mixing ratios
 * @returns Planned session
 */
export function planInterleaving(
  dueItems: { item: Item; progress: UserProgress }[],
  newItems: Item[],
  olderItems: { item: Item; progress: UserProgress }[],
  targetMinutes: number = 5,
  target: InterleavingTarget = DEFAULT_TARGET
): InterleavingPlan {
  const avgTimePerItem = 1.2; // minutes per item
  const targetItemCount = Math.round(targetMinutes / avgTimePerItem);
  
  // Calculate target counts for each category
  const targetCurrent = Math.round(targetItemCount * target.current);
  const targetReview = Math.round(targetItemCount * target.review);
  const targetOlder = Math.round(targetItemCount * target.older);
  
  // Select items from each category
  const selectedCurrent = selectItems(newItems, targetCurrent);
  const selectedReview = selectDueItems(dueItems, targetReview);
  const selectedOlder = selectDueItems(olderItems, targetOlder);
  
  // Interleave the items
  const interleavedItems = interleaveItems([
    { items: selectedCurrent, weight: target.current },
    { items: selectedReview.map(d => d.item), weight: target.review },
    { items: selectedOlder.map(d => d.item), weight: target.older }
  ]);
  
  return {
    items: interleavedItems,
    mix: {
      current: selectedCurrent.length,
      review: selectedReview.length,
      older: selectedOlder.length
    },
    estimatedMinutes: interleavedItems.length * avgTimePerItem
  };
}

/**
 * Select items with priority to difficulty and variety
 * @param items Available items
 * @param count Number to select
 * @returns Selected items
 */
function selectItems(items: Item[], count: number): Item[] {
  if (items.length <= count) return [...items];
  
  // Sort by difficulty for variety
  const sorted = [...items].sort((a, b) => a.difficulty - b.difficulty);
  
  // Select items with spacing to ensure variety
  const selected: Item[] = [];
  const step = sorted.length / count;
  
  for (let i = 0; i < count; i++) {
    const index = Math.floor(i * step);
    if (index < sorted.length) {
      selected.push(sorted[index]);
    }
  }
  
  return selected;
}

/**
 * Select due items prioritized by urgency and mastery
 * @param dueItems Items with progress data
 * @param count Number to select
 * @returns Selected items with progress
 */
function selectDueItems(
  dueItems: { item: Item; progress: UserProgress }[],
  count: number
): { item: Item; progress: UserProgress }[] {
  if (dueItems.length <= count) return [...dueItems];
  
  // Sort by urgency (lower mastery + overdue = higher priority)
  const now = Date.now();
  const sorted = [...dueItems].sort((a, b) => {
    const urgencyA = getUrgency(a.progress, now);
    const urgencyB = getUrgency(b.progress, now);
    return urgencyB - urgencyA;
  });
  
  return sorted.slice(0, count);
}

/**
 * Calculate urgency score for review prioritization
 * @param progress User progress data
 * @param now Current timestamp
 * @returns Urgency score
 */
function getUrgency(progress: UserProgress, now: number): number {
  const overdue = Math.max(0, now - progress.dueAt);
  const masteryFactor = 1 - progress.mastery;
  return (overdue / (60 * 60 * 1000)) * masteryFactor; // Hours overdue weighted by low mastery
}

/**
 * Interleave items from different categories
 * @param categories Items grouped by category with weights
 * @returns Shuffled interleaved items
 */
function interleaveItems(
  categories: { items: Item[]; weight: number }[]
): Item[] {
  const result: Item[] = [];
  const queues = categories.map(cat => ({ items: [...cat.items], weight: cat.weight }));
  
  // Create weighted selection based on ratios
  const totalWeight = queues.reduce((sum, q) => sum + q.weight, 0);
  
  while (queues.some(q => q.items.length > 0)) {
    // Select category based on weight and remaining items
    const availableQueues = queues.filter(q => q.items.length > 0);
    if (availableQueues.length === 0) break;
    
    // Weighted random selection
    const rand = Math.random() * totalWeight;
    let cumWeight = 0;
    
    for (const queue of availableQueues) {
      cumWeight += queue.weight;
      if (rand <= cumWeight) {
        const item = queue.items.shift();
        if (item) result.push(item);
        break;
      }
    }
  }
  
  return result;
}

/**
 * Adapt interleaving based on recent performance
 * @param recentCorrectRate Recent success rate (0-1)
 * @param defaultTarget Default mixing ratios
 * @returns Adjusted mixing ratios
 */
export function adaptInterleaving(
  recentCorrectRate: number,
  defaultTarget: InterleavingTarget = DEFAULT_TARGET
): InterleavingTarget {
  if (recentCorrectRate < 0.6) {
    // Struggling - more review, less new content
    return {
      current: 0.5,
      review: 0.4,
      older: 0.1
    };
  } else if (recentCorrectRate > 0.9) {
    // Excelling - more new content, less review
    return {
      current: 0.8,
      review: 0.15,
      older: 0.05
    };
  }
  
  return defaultTarget;
}