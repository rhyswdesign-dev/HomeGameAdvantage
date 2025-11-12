/**
 * Ingredient Images
 * Fruits, herbs, liquors, and bitters
 */

export const ingredients = {
  // Fruits
  blueberry: require('./ingredients/Blueberry.png'),
  cherry: require('./ingredients/Cherry.png'),
  grapefruit: require('./ingredients/Grapefruit.png'),
  lemon: require('./ingredients/Lemon.png'),
  lime: require('./ingredients/Lime.png'),
  orange: require('./ingredients/Orange.png'),
  pineapple: require('./ingredients/Pineapple.png'),
  raspberry: require('./ingredients/Raspberry.png'),
  strawberry: require('./ingredients/Strawberry.png'),
  watermelon: require('./ingredients/Watermelon.png'),

  // Herbs
  basil: require('./ingredients/Basil.png'),
  lavender: require('./ingredients/Lavender.png'),
  mint: require('./ingredients/Mint.png'),
  rose: require('./ingredients/Rose.png'),

  // Liquors
  amaro: require('./ingredients/Amaro.png'),
  aniseLiquor: require('./ingredients/Anise Liquor.png'),
  cremeDeCacao: require('./ingredients/Creme De Cacao Liquor.png'),
  elderflowerLiquor: require('./ingredients/Elderflower Liquor.png'),
  espressoLiquor: require('./ingredients/Espresso Liquor.png'),
  orangeLiquor: require('./ingredients/Orange Liquor.png'),

  // Bitters
  bitters: require('./ingredients/Bitters.png'),
  bitters1: require('./ingredients/Bitters 1.png'),
  bitters3: require('./ingredients/Bitters 3.png'),
} as const;

export type IngredientKey = keyof typeof ingredients;
