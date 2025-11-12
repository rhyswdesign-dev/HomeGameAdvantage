/**
 * Bartending Techniques Images
 * Tools, methods, and cocktail preparation techniques
 */

export const techniques = {
  bartools: require('./techniques/Bartools.png'),
  muddling: require('./techniques/Muddling.png'),
  stirring: require('./techniques/Stiring Cocktail.png'),
  layered: require('./techniques/Layered Cocktail.png'),
  sour: require('./techniques/Sour Cocktail.png'),
  infusion: require('./techniques/Infusion.png'),
  negroni: require('./techniques/Negronin.png'),
  citrusJuice: require('./techniques/Citrus Juice.png'),
  juices: require('./techniques/Juices.png'),
  fruit: require('./techniques/Fruit.png'),
} as const;

export type TechniqueKey = keyof typeof techniques;
