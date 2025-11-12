/**
 * Central Image Exports
 * Import all app images from this file
 *
 * Usage:
 * import { spirits, ingredients, games } from '@/assets/images';
 *
 * <Image source={spirits.gin} />
 * <Image source={ingredients.mint} />
 * <Image source={games.beerPong} />
 */

export * from './spirits';
export * from './ingredients';
export * from './syrups';
export * from './glassware';
export * from './techniques';
export * from './branding';
export * from './games';

// Re-export everything as a single object for convenience
import { spirits } from './spirits';
import { ingredients } from './ingredients';
import { syrups } from './syrups';
import { glassware } from './glassware';
import { techniques } from './techniques';
import { branding } from './branding';
import { games } from './games';

export const images = {
  spirits,
  ingredients,
  syrups,
  glassware,
  techniques,
  branding,
  games,
} as const;

export default images;
