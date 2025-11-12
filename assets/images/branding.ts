/**
 * MixedMinds Branding Images
 * Branded spirit bottles and backgrounds
 */

export const branding = {
  backsplash: require('./branding/MMS Backsplash.png'),
  gin: require('./branding/MMS Gin.png'),
  scotch: require('./branding/MMS Scotch.png'),
  tequila: require('./branding/MMS Tequila.png'),
  vodka: require('./branding/MMS Vodka.png'),
  whiskey: require('./branding/MMS Whiskey.png'),
} as const;

export type BrandingKey = keyof typeof branding;
