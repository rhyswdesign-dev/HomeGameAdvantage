/**
 * Syrup Images
 * Various syrup flavors for cocktails
 */

export const syrups = {
  blueberry: require('./syrups/Blueberry Syrup.png'),
  mango: require('./syrups/Mango Syrup.png'),
  raspberry: require('./syrups/Raspberry Syrup.png'),
  herbal: require('./syrups/Herbel Syrup.png'),
  simple: require('./syrups/Syrup.png'),
  simple1: require('./syrups/Syrup 1.png'),
} as const;

export type SyrupKey = keyof typeof syrups;
