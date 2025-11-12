/**
 * Glassware Images
 * Various cocktail glasses and serving vessels
 */

export const glassware = {
  collins: require('./glassware/Collins Glass.png'),
  coupe: require('./glassware/Coupe.png'),
  martini: require('./glassware/Martini Glass.png'),
  rocks: require('./glassware/Rocks Glass.png'),
  brandySnifter: require('./glassware/Brandy Sniffter.png'),
  shot: require('./glassware/Shot.png'),
} as const;

export type GlasswareKey = keyof typeof glassware;
