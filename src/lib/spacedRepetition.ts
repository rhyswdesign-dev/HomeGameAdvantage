/**
 * Spaced Repetition Algorithm (SM-2/Leitner hybrid)
 * Pure functions for calculating review schedules
 */

export interface ReviewState {
  mastery: number; // 0-1 scale
  stability: number; // >0, multiplier for intervals
  dueAt: number; // timestamp
}

export interface ReviewResult {
  mastery: number;
  stability: number;
  dueAt: number;
}

const BASE_INTERVAL_HOURS = 4; // 4 hours base interval
const HOUR_MS = 60 * 60 * 1000;
const MIN_INTERVAL_HOURS = 12;

/**
 * Update review state based on correctness
 * @param prevState Previous review state
 * @param isCorrect Whether the answer was correct
 * @param now Current timestamp
 * @returns Updated review state
 */
export function updateReviewState(
  prevState: ReviewState,
  isCorrect: boolean,
  now: number = Date.now()
): ReviewResult {
  let { mastery, stability } = prevState;

  if (isCorrect) {
    // Boost mastery with diminishing returns
    mastery = mastery + (1 - mastery) * 0.35;
    // Increase stability for longer intervals
    stability *= 1.6;
  } else {
    // Reduce mastery
    mastery *= 0.7;
    // Reduce stability for shorter intervals
    stability *= 0.8;
  }

  // Clamp values
  mastery = Math.max(0, Math.min(1, mastery));
  stability = Math.max(0.1, stability);

  // Calculate next due time
  const baseInterval = BASE_INTERVAL_HOURS * HOUR_MS;
  let interval: number;

  if (isCorrect) {
    interval = baseInterval * stability;
  } else {
    // Shorter interval for incorrect answers
    interval = Math.max(
      MIN_INTERVAL_HOURS * HOUR_MS,
      baseInterval * stability * 0.3
    );
  }

  const dueAt = now + interval;

  return {
    mastery: Math.round(mastery * 1000) / 1000, // Round to 3 decimal places
    stability: Math.round(stability * 1000) / 1000,
    dueAt
  };
}

/**
 * Initialize review state for a new item
 * @param difficulty Item difficulty (0-1)
 * @param now Current timestamp
 * @returns Initial review state
 */
export function initializeReviewState(
  difficulty: number = 0.5,
  now: number = Date.now()
): ReviewState {
  // Start with mastery inversely related to difficulty
  const mastery = Math.max(0.1, 1 - difficulty);
  
  return {
    mastery,
    stability: 1.0,
    dueAt: now // Available immediately for first attempt
  };
}

/**
 * Check if an item is due for review
 * @param state Review state
 * @param now Current timestamp
 * @returns Whether the item is due
 */
export function isDue(state: ReviewState, now: number = Date.now()): boolean {
  return state.dueAt <= now;
}

/**
 * Calculate urgency score for prioritizing due items
 * @param state Review state
 * @param now Current timestamp
 * @returns Urgency score (higher = more urgent)
 */
export function getUrgencyScore(state: ReviewState, now: number = Date.now()): number {
  if (!isDue(state, now)) return 0;
  
  const overdue = now - state.dueAt;
  const urgency = (overdue / HOUR_MS) * (1 - state.mastery);
  return Math.max(0, urgency);
}