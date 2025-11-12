/**
 * Spirit Images
 * Use these imports for spirit-related imagery
 */

export const spirits = {
  gin: require('./spirits/Gin.png'),
  gin1: require('./spirits/Gin 1.png'),
  rum: require('./spirits/Rum.png'),
  rum1: require('./spirits/Rum 1.png'),
  tequila: require('./spirits/Tequila.png'),
  brandy: require('./spirits/Brandy.png'),
} as const;

export type SpiritKey = keyof typeof spirits;
