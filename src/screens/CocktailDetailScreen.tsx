import React, { useState, useLayoutEffect } from 'react';
import {
  View, Text, ScrollView, Image, TouchableOpacity, StyleSheet, Share, Alert, Pressable
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing, radii } from '../theme/tokens';
import { useSavedItems } from '../hooks/useSavedItems';
import type { RootStackParamList } from '../navigation/RootNavigator';

type CocktailDetailScreenRouteProp = {
  params: {
    cocktailId: string;
  };
};

// Non-alcoholic beverages data (complete dataset matching NonAlcoholicScreen)
const nonAlcoholicBeverages = [
  {
    id: 'seedlip-garden-108',
    name: 'Seedlip Garden 108',
    category: 'Zero-Proof Spirits',
    region: 'United Kingdom',
    tier: 'gold',
    image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?q=80&w=1200&auto=format&fit=crop',
    tagline: 'Herbal & Garden Fresh',
    description: 'A complex blend of peas, hay, spearmint, rosemary, and thyme creating a fresh garden experience.',
    abv: '0.0%',
    flavorNotes: ['Fresh herbs', 'Garden peas', 'Mint', 'Rosemary'],
    useCase: 'Perfect for G&T-style serves and herb-forward cocktails',
    buyLink: 'https://seedlipdrinks.com',
    recipes: [
      {
        name: 'Garden 108 & Tonic',
        ingredients: ['2 oz Seedlip Garden 108', '4 oz Premium tonic water', '3 cucumber slices', 'Fresh mint sprig', 'Lime wheel'],
        instructions: 'Fill glass with ice. Add Seedlip Garden 108. Top with tonic water. Garnish with cucumber, mint, and lime.',
        glassware: 'Highball glass',
        difficulty: 'Easy',
        time: '2 min'
      },
      {
        name: 'Herbaceous Spritz',
        ingredients: ['1.5 oz Seedlip Garden 108', '3 oz Elderflower sparkling water', '0.5 oz Fresh lime juice', 'Rosemary sprig', 'Grapefruit peel'],
        instructions: 'Combine in wine glass over ice. Stir gently. Express grapefruit oils and garnish with rosemary.',
        glassware: 'Wine glass',
        difficulty: 'Easy',
        time: '3 min'
      },
      {
        name: 'Garden Gimlet',
        ingredients: ['2 oz Seedlip Garden 108', '0.75 oz Fresh lime juice', '0.75 oz Simple syrup', 'Cucumber wheel', 'Fresh basil'],
        instructions: 'Shake ingredients with ice. Double strain into chilled coupe. Garnish with cucumber and basil.',
        glassware: 'Coupe glass',
        difficulty: 'Easy',
        time: '3 min'
      }
    ]
  },
  {
    id: 'lyre-s-american-malt',
    name: "Lyre's American Malt",
    category: 'Zero-Proof Spirits',
    region: 'Australia',
    tier: 'gold',
    image: 'https://images.unsplash.com/photo-1569529465841-dfecdab7503b?q=80&w=1200&auto=format&fit=crop',
    tagline: 'Rich & Smoky',
    description: 'Generous flavors of honey and vanilla with a gentle smoky finish, perfect for classic cocktails.',
    abv: '0.0%',
    flavorNotes: ['Honey', 'Vanilla', 'Oak', 'Smoke'],
    useCase: 'Ideal for whiskey cocktails like Old Fashioned and Manhattan',
    buyLink: 'https://lyres.com',
    recipes: [
      {
        name: 'Smokeless Old Fashioned',
        ingredients: ['2 oz Lyre\'s American Malt', '0.25 oz Maple syrup', '2 dashes Orange bitters', '1 dash Angostura bitters', 'Orange peel', 'Luxardo cherry'],
        instructions: 'Stir all ingredients with ice. Strain over large ice cube. Express orange oils and garnish with cherry.',
        glassware: 'Old Fashioned glass',
        difficulty: 'Easy',
        time: '3 min'
      },
      {
        name: 'Zero Proof Manhattan',
        ingredients: ['2 oz Lyre\'s American Malt', '1 oz Sweet vermouth', '2 dashes Angostura bitters', 'Maraschino cherry'],
        instructions: 'Stir ingredients with ice for 30 seconds. Strain into chilled coupe. Garnish with cherry.',
        glassware: 'Coupe glass',
        difficulty: 'Easy',
        time: '3 min'
      },
      {
        name: 'Maple Whiskey Sour',
        ingredients: ['2 oz Lyre\'s American Malt', '0.75 oz Fresh lemon juice', '0.5 oz Maple syrup', '1 Egg white', 'Lemon wheel'],
        instructions: 'Dry shake without ice. Shake again with ice. Double strain into coupe. Garnish with lemon wheel.',
        glassware: 'Coupe glass',
        difficulty: 'Medium',
        time: '4 min'
      }
    ]
  },
  {
    id: 'monday-gin',
    name: 'Monday Zero Alcohol Gin',
    category: 'Zero-Proof Spirits',
    region: 'Canada',
    tier: 'silver',
    image: 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?q=80&w=1200&auto=format&fit=crop',
    tagline: 'Juniper Forward',
    description: 'Classic gin botanicals with zero alcohol - juniper, coriander, and citrus in perfect balance.',
    abv: '0.0%',
    flavorNotes: ['Juniper', 'Citrus', 'Coriander', 'Angelica'],
    useCase: 'Classic gin cocktails and modern mixed drinks',
    recipes: [
      {
        name: 'Zero Proof Gin & Tonic',
        ingredients: ['2 oz Monday Gin', '4 oz Tonic water', 'Lime wheel', 'Juniper berries'],
        instructions: 'Build in glass over ice. Stir gently. Garnish with lime and juniper berries.',
        glassware: 'Highball glass',
        difficulty: 'Easy',
        time: '2 min'
      }
    ]
  },
  {
    id: 'ghia-aperitif',
    name: 'Ghia Aperitif',
    category: 'Low-ABV Options',
    region: 'United States',
    tier: 'gold',
    image: 'https://images.unsplash.com/photo-1574671928146-5c89a22b2e85?q=80&w=1200&auto=format&fit=crop',
    tagline: 'Mediterranean Botanicals',
    description: 'A sophisticated aperitif with rosemary, ginger, and elderflower for the perfect pre-dinner drink.',
    abv: '0.0%',
    flavorNotes: ['Rosemary', 'Ginger', 'Elderflower', 'Citrus'],
    useCase: 'Perfect for aperitif hour and spritz-style cocktails',
    recipes: [
      {
        name: 'Ghia Spritz',
        ingredients: ['2 oz Ghia Aperitif', '3 oz Sparkling water', '1 oz Fresh grapefruit juice', 'Rosemary sprig', 'Grapefruit wheel'],
        instructions: 'Build in wine glass over ice. Top with sparkling water. Garnish with grapefruit and rosemary.',
        glassware: 'Wine glass',
        difficulty: 'Easy',
        time: '2 min'
      }
    ]
  },
  {
    id: 'gt-s-gingerade',
    name: "GT's Gingerade Kombucha",
    category: 'Wellness Drinks',
    region: 'United States',
    tier: 'bronze',
    image: 'https://images.unsplash.com/photo-1559181567-c3190ca9959b?q=80&w=1200&auto=format&fit=crop',
    tagline: 'Probiotic & Refreshing',
    description: 'Living kombucha with organic ginger providing digestive benefits and refreshing taste.',
    abv: '<0.5%',
    flavorNotes: ['Ginger', 'Fermented tea', 'Probiotics', 'Tangy'],
    useCase: 'Great for wellness cocktails and digestive health',
    recipes: [
      {
        name: 'Ginger Kombucha Mule',
        ingredients: ['6 oz GT\'s Gingerade', '1 oz Fresh lime juice', '0.5 oz Agave syrup', 'Mint sprig', 'Candied ginger', 'Lime wheel'],
        instructions: 'Combine lime juice and agave in mug. Add ice and kombucha. Stir gently. Garnish with mint, ginger, and lime.',
        glassware: 'Copper mug',
        difficulty: 'Easy',
        time: '3 min'
      }
    ]
  },
  {
    id: 'recess-hemp-sparkling-water',
    name: 'Recess Hemp Sparkling Water',
    category: 'Wellness Drinks',
    region: 'United States',
    tier: 'silver',
    image: 'https://images.unsplash.com/photo-1556881286-fc6915169721?q=80&w=1200&auto=format&fit=crop',
    tagline: 'Calm & Focused',
    description: 'Sparkling water infused with hemp extract and adaptogens for relaxation and focus.',
    abv: '0.0%',
    flavorNotes: ['Light hemp', 'Citrus', 'Adaptogenic herbs', 'Clean finish'],
    useCase: 'Perfect for mindful drinking and wellness-focused cocktails',
    recipes: [
      {
        name: 'Zen Garden Spritz',
        ingredients: ['8 oz Recess Hemp Water', '1 oz Fresh cucumber juice', '0.5 oz Mint simple syrup', 'Cucumber ribbons', 'Fresh mint'],
        instructions: 'Combine cucumber juice and syrup in glass. Add ice and Recess water. Garnish with cucumber and mint.',
        glassware: 'Wine glass',
        difficulty: 'Easy',
        time: '4 min'
      },
      {
        name: 'Hemp Citrus Cooler',
        ingredients: ['8 oz Recess Hemp Water', '1 oz Fresh lemon juice', '0.5 oz Simple syrup', 'Fresh thyme', 'Lemon wheel'],
        instructions: 'Muddle thyme gently in glass. Add lemon juice and syrup. Fill with ice. Top with Recess water. Garnish with lemon wheel.',
        glassware: 'Highball glass',
        difficulty: 'Easy',
        time: '3 min'
      }
    ]
  },
  {
    id: 'ritual-zero-proof-gin',
    name: 'Ritual Zero Proof Gin Alternative',
    category: 'Zero-Proof Spirits',
    region: 'United States',
    tier: 'gold',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=1200&auto=format&fit=crop',
    tagline: 'Botanical Excellence',
    description: 'Distilled with juniper, coriander, and angelica root for an authentic gin experience without alcohol.',
    abv: '0.0%',
    flavorNotes: ['Juniper', 'Angelica root', 'Coriander', 'Citrus'],
    useCase: 'Perfect for classic gin cocktails and modern zero-proof mixology',
    recipes: [
      {
        name: 'Zero Proof Negroni',
        ingredients: ['1 oz Ritual Gin Alternative', '1 oz Seedlip Spice 94', '1 oz Sweet vermouth', 'Orange peel'],
        instructions: 'Stir all ingredients with ice. Strain over fresh ice. Express orange oils and garnish with peel.',
        glassware: 'Rocks glass',
        difficulty: 'Easy',
        time: '3 min'
      },
      {
        name: 'Garden Martini',
        ingredients: ['2.5 oz Ritual Gin Alternative', '0.5 oz Dry vermouth', '2 dashes Orange bitters', 'Lemon twist'],
        instructions: 'Stir ingredients with ice until well chilled. Strain into chilled coupe. Garnish with lemon twist.',
        glassware: 'Coupe glass',
        difficulty: 'Easy',
        time: '3 min'
      }
    ]
  },
  {
    id: 'wilderton-earthen',
    name: 'Wilderton Earthen',
    category: 'Zero-Proof Spirits',
    region: 'United States',
    tier: 'silver',
    image: 'https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?q=80&w=1200&auto=format&fit=crop',
    tagline: 'Forest Floor',
    description: 'Crafted with Douglas fir, sage, and lavender for an earthy, complex botanical experience.',
    abv: '0.0%',
    flavorNotes: ['Douglas fir', 'Sage', 'Lavender', 'Earthy botanicals'],
    useCase: 'Ideal for contemplative sipping and herbal cocktails',
    recipes: [
      {
        name: 'Forest Floor',
        ingredients: ['2 oz Wilderton Earthen', '0.5 oz Honey syrup', '0.5 oz Fresh lemon juice', 'Sage sprig', 'Lavender garnish'],
        instructions: 'Shake ingredients with ice. Strain into rocks glass over fresh ice. Garnish with sage and lavender.',
        glassware: 'Rocks glass',
        difficulty: 'Easy',
        time: '3 min'
      }
    ]
  },
  {
    id: 'athletic-brewing-coffee',
    name: 'Athletic Brewing Cold Brew Coffee',
    category: 'Wellness Drinks',
    region: 'United States',
    tier: 'bronze',
    image: 'https://images.unsplash.com/photo-1609951651556-5334e2706168?q=80&w=1200&auto=format&fit=crop',
    tagline: 'Performance & Flavor',
    description: 'Premium cold brew coffee crafted for athletes and coffee enthusiasts seeking clean energy.',
    abv: '0.0%',
    flavorNotes: ['Rich coffee', 'Chocolate notes', 'Smooth finish', 'No sugar crash'],
    useCase: 'Perfect for coffee cocktails and energy-focused beverages',
    recipes: [
      {
        name: 'Coffee Spritz',
        ingredients: ['4 oz Athletic Cold Brew', '2 oz Sparkling water', '0.5 oz Vanilla syrup', 'Orange peel', 'Coffee beans'],
        instructions: 'Combine cold brew and vanilla syrup in glass. Add ice and top with sparkling water. Garnish with orange peel and coffee beans.',
        glassware: 'Highball glass',
        difficulty: 'Easy',
        time: '2 min'
      },
      {
        name: 'Espresso Martini Zero',
        ingredients: ['3 oz Athletic Cold Brew', '1 oz Coffee liqueur alternative', '0.5 oz Simple syrup', '3 Coffee beans'],
        instructions: 'Shake all ingredients vigorously with ice. Double strain into chilled coupe. Float 3 coffee beans on foam.',
        glassware: 'Coupe glass',
        difficulty: 'Medium',
        time: '4 min'
      }
    ]
  },
  {
    id: 'kin-euphorics-high-rhode',
    name: 'Kin Euphorics High Rhode',
    category: 'Low-ABV Options',
    region: 'United States',
    tier: 'gold',
    image: 'https://images.unsplash.com/photo-1574671928146-5c89a22b2e85?q=80&w=1200&auto=format&fit=crop',
    tagline: 'Mood-Elevating',
    description: 'A euphoric blend of adaptogens, nootropics, and botanicals designed to elevate your mood naturally.',
    abv: '<0.5%',
    flavorNotes: ['Hibiscus', 'Orange bitters', 'Licorice root', 'Cardamom'],
    useCase: 'Perfect for social occasions and mood enhancement',
    recipes: [
      {
        name: 'High Rhode Spritz',
        ingredients: ['2 oz Kin High Rhode', '3 oz Sparkling wine', '1 oz Fresh grapefruit juice', 'Grapefruit wheel', 'Rosemary sprig'],
        instructions: 'Combine High Rhode and grapefruit juice in wine glass. Add ice and top with sparkling wine. Garnish with grapefruit and rosemary.',
        glassware: 'Wine glass',
        difficulty: 'Easy',
        time: '3 min'
      }
    ]
  },
  {
    id: 'seedlip-spice-94',
    name: 'Seedlip Spice 94',
    category: 'Zero-Proof Spirits',
    region: 'United Kingdom',
    tier: 'gold',
    image: 'https://images.unsplash.com/photo-1574671928146-5c89a22b2e85?q=80&w=1200&auto=format&fit=crop',
    tagline: 'Warm & Spiced',
    description: 'A warm, aromatic blend of allspice and cardamom with a complex spice profile.',
    abv: '0.0%',
    flavorNotes: ['Allspice', 'Cardamom', 'Oak', 'Citrus peel'],
    useCase: 'Perfect for spiced cocktails and warming winter drinks',
    recipes: [
      {
        name: 'Spiced Mule',
        ingredients: ['2 oz Seedlip Spice 94', '0.5 oz Fresh lime juice', '4 oz Ginger beer', 'Lime wheel', 'Candied ginger'],
        instructions: 'Build in copper mug over ice. Stir gently. Garnish with lime and candied ginger.',
        glassware: 'Copper mug',
        difficulty: 'Easy',
        time: '2 min'
      },
      {
        name: 'Spice Route',
        ingredients: ['1.5 oz Seedlip Spice 94', '1 oz Apple juice', '0.5 oz Honey syrup', '0.25 oz Lemon juice', 'Cinnamon stick'],
        instructions: 'Shake ingredients with ice. Strain into rocks glass over fresh ice. Garnish with cinnamon stick.',
        glassware: 'Rocks glass',
        difficulty: 'Easy',
        time: '3 min'
      }
    ]
  },
  {
    id: 'aperol-spritz-zero',
    name: 'Lyre\'s Italian Orange',
    category: 'Low-ABV Options',
    region: 'Australia',
    tier: 'silver',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=1200&auto=format&fit=crop',
    tagline: 'Italian Aperitivo',
    description: 'Zero-proof alternative to Italian orange aperitif with bitter orange and herbal complexity.',
    abv: '0.0%',
    flavorNotes: ['Bitter orange', 'Herbs', 'Rhubarb', 'Vanilla'],
    useCase: 'Perfect for aperitif hour and Italian-style spritzes',
    recipes: [
      {
        name: 'Zero Proof Aperol Spritz',
        ingredients: ['3 oz Lyre\'s Italian Orange', '3 oz Prosecco', '1 oz Soda water', 'Orange slice'],
        instructions: 'Build in wine glass over ice. Top with soda water. Garnish with orange slice.',
        glassware: 'Wine glass',
        difficulty: 'Easy',
        time: '2 min'
      },
      {
        name: 'Italian Sunset',
        ingredients: ['2 oz Lyre\'s Italian Orange', '1 oz Fresh grapefruit juice', '0.5 oz Honey syrup', '3 oz Sparkling water', 'Grapefruit twist'],
        instructions: 'Shake orange liqueur, grapefruit juice, and honey with ice. Strain into highball over ice. Top with sparkling water.',
        glassware: 'Highball glass',
        difficulty: 'Easy',
        time: '3 min'
      }
    ]
  },
  {
    id: 'curious-elixir-no2',
    name: 'Curious Elixir No. 2',
    category: 'Low-ABV Options',
    region: 'United States',
    tier: 'bronze',
    image: 'https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?q=80&w=1200&auto=format&fit=crop',
    tagline: 'Negroni Inspired',
    description: 'A sophisticated blend inspired by the classic Negroni with bitter and sweet botanicals.',
    abv: '<0.5%',
    flavorNotes: ['Bitter orange', 'Juniper', 'Gentian', 'Rosemary'],
    useCase: 'Ready-to-drink alternative to classic bitter cocktails',
    recipes: [
      {
        name: 'Curious Spritz',
        ingredients: ['4 oz Curious Elixir No. 2', '2 oz Sparkling water', 'Orange peel', 'Fresh rosemary'],
        instructions: 'Pour over ice in wine glass. Top with sparkling water. Express orange oils and garnish with rosemary.',
        glassware: 'Wine glass',
        difficulty: 'Easy',
        time: '2 min'
      }
    ]
  },
  {
    id: 'health-ade-kombucha',
    name: 'Health-Ade Ginger Lemon Kombucha',
    category: 'Wellness Drinks',
    region: 'United States',
    tier: 'bronze',
    image: 'https://images.unsplash.com/photo-1559181567-c3190ca9959b?q=80&w=1200&auto=format&fit=crop',
    tagline: 'Probiotic Power',
    description: 'Organic kombucha with real ginger and lemon for digestive health and refreshing taste.',
    abv: '<0.5%',
    flavorNotes: ['Fresh ginger', 'Lemon', 'Fermented tea', 'Tangy'],
    useCase: 'Great for wellness cocktails and digestive support',
    recipes: [
      {
        name: 'Ginger Lemon Mule',
        ingredients: ['6 oz Health-Ade Ginger Lemon', '1 oz Fresh lime juice', '0.5 oz Agave nectar', 'Mint sprig', 'Crystallized ginger'],
        instructions: 'Combine lime juice and agave in mug. Add ice and kombucha. Stir gently. Garnish with mint and ginger.',
        glassware: 'Copper mug',
        difficulty: 'Easy',
        time: '3 min'
      },
      {
        name: 'Wellness Spritzer',
        ingredients: ['4 oz Health-Ade Ginger Lemon', '2 oz Sparkling water', '1 oz Fresh cucumber juice', 'Cucumber ribbon', 'Lemon wheel'],
        instructions: 'Combine cucumber juice with kombucha in glass. Add ice and top with sparkling water. Garnish with cucumber and lemon.',
        glassware: 'Highball glass',
        difficulty: 'Easy',
        time: '3 min'
      }
    ]
  },
  {
    id: 'rebbl-ashwagandha-chai',
    name: 'REBBL Ashwagandha Chai',
    category: 'Wellness Drinks',
    region: 'United States',
    tier: 'silver',
    image: 'https://images.unsplash.com/photo-1574671928146-5c89a22b2e85?q=80&w=1200&auto=format&fit=crop',
    tagline: 'Adaptogenic Blend',
    description: 'Plant-based superfood drink with ashwagandha, reishi, and warming spices for stress support.',
    abv: '0.0%',
    flavorNotes: ['Chai spices', 'Coconut', 'Ashwagandha', 'Cinnamon'],
    useCase: 'Perfect for evening relaxation and stress relief cocktails',
    recipes: [
      {
        name: 'Golden Hour Latte',
        ingredients: ['6 oz REBBL Ashwagandha Chai', '2 oz Steamed oat milk', '0.5 oz Vanilla syrup', 'Cinnamon stick', 'Star anise'],
        instructions: 'Heat chai drink. Steam oat milk and vanilla syrup. Combine in mug. Garnish with cinnamon and star anise.',
        glassware: 'Coffee mug',
        difficulty: 'Easy',
        time: '4 min'
      },
      {
        name: 'Spiced Chai Fizz',
        ingredients: ['4 oz REBBL Ashwagandha Chai', '2 oz Sparkling water', '0.5 oz Maple syrup', 'Orange peel', 'Cardamom pod'],
        instructions: 'Combine chai and maple syrup in glass. Add ice and top with sparkling water. Garnish with orange peel and cardamom.',
        glassware: 'Highball glass',
        difficulty: 'Easy',
        time: '3 min'
      }
    ]
  }
];

const cocktailData = {
  'old-fashioned': {
    id: 'old-fashioned',
    title: 'Old Fashioned',
    subtitle: 'Classic • Whiskey-based',
    description: 'A timeless cocktail made with whiskey, sugar, bitters, and an orange twist. This drink represents the essence of what a cocktail should be - simple, balanced, and perfectly executed.',
    img: 'https://images.unsplash.com/photo-1536935338788-846bb9981813?auto=format&fit=crop&w=1200&q=60',
    difficulty: 'Easy',
    time: '3 min',
    ingredients: [
      { name: '2 oz Whiskey', note: 'Bourbon or Rye preferred' },
      { name: '1/4 oz Simple Syrup', note: 'Or 1 sugar cube' },
      { name: '2 dashes Angostura Bitters', note: 'Essential for flavor' },
      { name: 'Orange Peel', note: 'For garnish and aroma' },
      { name: 'Ice', note: 'Large cube preferred' }
    ],
    instructions: [
      'Add simple syrup and bitters to rocks glass',
      'Add whiskey and stir to combine',
      'Add ice (preferably one large cube)',
      'Stir gently to chill and dilute',
      'Express orange peel oils over drink',
      'Garnish with orange peel'
    ],
    tips: [
      'Use a large ice cube to minimize dilution',
      'Express the orange peel properly for best aroma',
      'Quality whiskey makes a big difference'
    ],
    glassware: 'Rocks Glass',
    kitAvailable: true,
    kitPrice: 49.99
  },
  'manhattan': {
    id: 'manhattan',
    title: 'Manhattan',
    subtitle: 'Classic • Whiskey-based',
    description: 'An elegant mix of whiskey, sweet vermouth, and bitters, garnished with a cherry. The Manhattan is the sophisticated sibling of the Old Fashioned.',
    img: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=1200&q=60',
    difficulty: 'Easy',
    time: '2 min',
    ingredients: [
      { name: '2 oz Rye Whiskey', note: 'Bourbon also works well' },
      { name: '1 oz Sweet Vermouth', note: 'Quality matters here' },
      { name: '2 dashes Angostura Bitters', note: 'Classic choice' },
      { name: 'Maraschino Cherry', note: 'For garnish' }
    ],
    instructions: [
      'Add whiskey, vermouth, and bitters to mixing glass',
      'Add ice and stir for 30 seconds',
      'Strain into chilled coupe glass',
      'Garnish with cherry'
    ],
    tips: [
      'Stir, don\'t shake - keeps it clear',
      'Chill your glass beforehand',
      'Good vermouth is crucial'
    ],
    glassware: 'Coupe Glass',
    kitAvailable: true,
    kitPrice: 54.99
  },
  'negroni': {
    id: 'negroni',
    title: 'Negroni',
    subtitle: 'Classic • Gin-based',
    description: 'A bitter and sweet Italian cocktail with gin, Campari, and sweet vermouth. Perfect for those who appreciate complex, bitter flavors.',
    img: 'https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?auto=format&fit=crop&w=1200&q=60',
    difficulty: 'Easy',
    time: '2 min',
    ingredients: [
      { name: '1 oz Gin', note: 'London Dry style preferred' },
      { name: '1 oz Campari', note: 'The signature bitter element' },
      { name: '1 oz Sweet Vermouth', note: 'Balances the bitterness' },
      { name: 'Orange Peel', note: 'Essential garnish' }
    ],
    instructions: [
      'Add gin, Campari, and vermouth to rocks glass',
      'Add ice and stir to combine',
      'Express orange peel over drink',
      'Drop peel into glass'
    ],
    tips: [
      'Equal parts - the perfect balance',
      'Build in glass for simplicity',
      'Orange peel oils are essential'
    ],
    glassware: 'Rocks Glass',
    kitAvailable: true,
    kitPrice: 64.99
  },
  'espresso-martini': {
    id: 'espresso-martini',
    title: 'Espresso Martini',
    subtitle: 'Modern • Vodka-based',
    description: 'A sophisticated coffee cocktail with vodka, coffee liqueur, and fresh espresso. The perfect pick-me-up cocktail.',
    img: 'https://images.unsplash.com/photo-1609951651556-5334e2706168?auto=format&fit=crop&w=1200&q=60',
    difficulty: 'Medium',
    time: '5 min',
    ingredients: [
      { name: '2 oz Vodka', note: 'Premium vodka recommended' },
      { name: '1/2 oz Coffee Liqueur', note: 'Kahlúa or similar' },
      { name: '1 shot Fresh Espresso', note: 'Must be fresh and hot' },
      { name: '1/4 oz Simple Syrup', note: 'Optional, to taste' }
    ],
    instructions: [
      'Brew fresh espresso shot',
      'Add all ingredients to shaker with ice',
      'Shake vigorously for 15 seconds',
      'Double strain into chilled coupe',
      'Garnish with 3 coffee beans'
    ],
    tips: [
      'Fresh espresso is non-negotiable',
      'Shake hard to create foam',
      'Serve immediately while hot'
    ],
    glassware: 'Coupe Glass',
    kitAvailable: true,
    kitPrice: 39.99
  },
  'classic-martini': {
    id: 'classic-martini',
    title: 'Classic Martini',
    subtitle: 'Classic • Gin-based',
    description: 'A timeless classic cocktail with gin and dry vermouth. The epitome of cocktail elegance and sophistication.',
    img: 'https://images.unsplash.com/photo-1541976076758-347942db1978?q=80&w=1200&auto=format&fit=crop',
    difficulty: 'Easy',
    time: '2 min',
    ingredients: [
      { name: '2 oz Gin', note: 'London Dry preferred' },
      { name: '1/2 oz Dry Vermouth', note: 'Quality matters' },
      { name: 'Olive or Lemon Twist', note: 'For garnish' }
    ],
    instructions: [
      'Add gin and vermouth to mixing glass with ice',
      'Stir for 30 seconds until well chilled',
      'Strain into chilled coupe glass',
      'Garnish with olive or lemon twist'
    ],
    tips: [
      'Stir, don\'t shake for clarity',
      'Chill your glass beforehand',
      'Less vermouth for a drier martini'
    ],
    glassware: 'Coupe Glass',
    kitAvailable: true,
    kitPrice: 44.99
  },
  'virgin-mojito': {
    id: 'virgin-mojito',
    title: 'Virgin Mojito',
    subtitle: 'Non-Alcoholic • Refreshing',
    description: 'Refreshing non-alcoholic version of the classic mojito with fresh mint, lime, and sparkling water.',
    img: 'https://images.unsplash.com/photo-1497534547324-0ebb3f052e88?q=80&w=1200&auto=format&fit=crop',
    difficulty: 'Easy',
    time: '2 min',
    ingredients: [
      { name: 'Fresh Lime Juice', note: '1 oz freshly squeezed' },
      { name: 'Mint Leaves', note: '8-10 fresh leaves' },
      { name: 'Simple Syrup', note: '1/2 oz to taste' },
      { name: 'Soda Water', note: '4 oz chilled' },
      { name: 'Ice', note: 'Crushed preferred' }
    ],
    instructions: [
      'Muddle mint leaves gently in glass',
      'Add lime juice and simple syrup',
      'Fill glass with crushed ice',
      'Top with soda water',
      'Stir gently and garnish with mint sprig'
    ],
    tips: [
      'Don\'t over-muddle the mint',
      'Use fresh lime juice only',
      'Adjust sweetness to taste'
    ],
    glassware: 'Highball Glass',
    kitAvailable: false,
    kitPrice: 0
  }
};

// Function to get non-alcoholic recipe data
const getNonAlcoholicRecipeData = (recipeId: string) => {
  for (const beverage of nonAlcoholicBeverages) {
    for (const recipe of beverage.recipes) {
      const fullRecipeId = `${beverage.id}-${recipe.name}`;
      if (fullRecipeId === recipeId) {
        return {
          id: fullRecipeId,
          title: recipe.name,
          subtitle: `${beverage.category} • ${beverage.name}`,
          description: `${beverage.description} ${beverage.useCase}`,
          img: beverage.image,
          difficulty: recipe.difficulty,
          time: recipe.time,
          ingredients: recipe.ingredients.map(ingredient => ({ 
            name: ingredient, 
            note: beverage.name 
          })),
          instructions: recipe.instructions.split('. ').filter(step => step.trim()),
          tips: beverage.flavorNotes.map(note => `Features ${note.toLowerCase()} notes`),
          glassware: recipe.glassware,
          kitAvailable: false,
          kitPrice: 0,
          isNonAlcoholic: true,
          beverage
        };
      }
    }
  }
  return null;
};

export default function CocktailDetailScreen() {
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<CocktailDetailScreenRouteProp>();
  const { toggleSavedCocktail, isCocktailSaved } = useSavedItems();
  
  // Check if it's a non-alcoholic recipe first
  const nonAlcoholicRecipe = getNonAlcoholicRecipeData(route.params.cocktailId);
  const cocktail = nonAlcoholicRecipe || cocktailData[route.params.cocktailId as keyof typeof cocktailData];
  const isSaved = isCocktailSaved(route.params.cocktailId);

  const handleShare = async () => {
    if (!cocktail) return;
    try {
      await Share.share({
        message: `Check out this amazing ${cocktail.title} recipe! Perfect for any occasion.`,
        title: `${cocktail.title} - Cocktail Recipe`,
      });
    } catch (error) {
      Alert.alert('Error', 'Unable to share at this time');
    }
  };

  const handleSave = () => {
    if (!cocktail) return;
    toggleSavedCocktail({
      id: route.params.cocktailId,
      name: cocktail.title,
      subtitle: cocktail.subtitle,
      image: cocktail.img
    });
  };

  const handleAddToCart = () => {
    if (!cocktail || !cocktail.kitAvailable) return;
    Alert.alert(
      'Add to Cart',
      `Add ${cocktail.title} ingredient kit for $${cocktail.kitPrice}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Add to Cart', onPress: () => Alert.alert('Success', 'Added to cart!') }
      ]
    );
  };

  const handleDownload = () => {
    if (!cocktail) return;
    Alert.alert('Download Recipe', `${cocktail.title} recipe downloaded!`);
  };

  useLayoutEffect(() => {
    nav.setOptions({
      title: cocktail?.title || 'Cocktail',
      headerStyle: { backgroundColor: colors.bg },
      headerTintColor: colors.text,
      headerTitleStyle: { color: colors.text, fontWeight: '900' },
      headerShadowVisible: false,
    });
  }, [nav, cocktail?.title]);

  if (!cocktail) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Cocktail not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Hero Image */}
        <View style={styles.heroImageContainer}>
          <Image source={{ uri: cocktail.img }} style={styles.heroImage} />
          
          {/* Action Buttons Overlay */}
          <View style={styles.actionButtonsContainer}>
            <TouchableOpacity 
              onPress={handleShare}
              style={styles.actionButton}
              activeOpacity={0.7}
            >
              <Ionicons name="share-outline" size={18} color={colors.white} />
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={handleDownload}
              style={styles.actionButton}
              activeOpacity={0.7}
            >
              <Ionicons name="download-outline" size={18} color={colors.white} />
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={handleSave}
              style={[styles.actionButton, isSaved && styles.actionButtonActive]}
              activeOpacity={0.7}
            >
              <Ionicons 
                name={isSaved ? "bookmark" : "bookmark-outline"} 
                size={18} 
                color={colors.white} 
              />
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Content */}
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>{cocktail.title}</Text>
            <Text style={styles.subtitle}>{cocktail.subtitle}</Text>
            <Text style={styles.description}>{cocktail.description}</Text>
          </View>

          {/* Stats */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <MaterialCommunityIcons name="clock-outline" size={20} color={colors.accent} />
              <Text style={styles.statText}>{cocktail.time}</Text>
            </View>
            <View style={styles.statItem}>
              <MaterialCommunityIcons name="speedometer" size={20} color={colors.accent} />
              <Text style={styles.statText}>{cocktail.difficulty}</Text>
            </View>
            <View style={styles.statItem}>
              <MaterialCommunityIcons name="glass-cocktail" size={20} color={colors.accent} />
              <Text style={styles.statText}>{cocktail.glassware}</Text>
            </View>
          </View>

          {/* Ingredients */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ingredients</Text>
            {cocktail.ingredients.map((ingredient, index) => (
              <View key={`ingredient-${index}-${ingredient.name}`} style={styles.ingredientItem}>
                <Text style={styles.ingredientName}>{ingredient.name}</Text>
                <Text style={styles.ingredientNote}>{ingredient.note}</Text>
              </View>
            ))}
          </View>

          {/* Instructions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Instructions</Text>
            {cocktail.instructions.map((instruction, index) => (
              <View key={`instruction-${index}`} style={styles.instructionItem}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>{index + 1}</Text>
                </View>
                <Text style={styles.instructionText}>{instruction}</Text>
              </View>
            ))}
          </View>

          {/* Add to Cart Button or Buy Beverage */}
          {cocktail.kitAvailable && (
            <View style={styles.section}>
              <Pressable 
                style={styles.addToCartButton}
                onPress={handleAddToCart}
              >
                <MaterialCommunityIcons name="cart-plus" size={20} color={colors.white} />
                <Text style={styles.addToCartText}>Add Ingredient Kit - ${cocktail.kitPrice}</Text>
              </Pressable>
            </View>
          )}
          
          {cocktail.isNonAlcoholic && cocktail.beverage?.buyLink && (
            <View style={styles.section}>
              <Pressable 
                style={styles.addToCartButton}
                onPress={() => Alert.alert('Buy Beverage', `Visit ${cocktail.beverage.name} store to purchase this premium non-alcoholic spirit.`)}
              >
                <MaterialCommunityIcons name="open-in-new" size={20} color={colors.white} />
                <Text style={styles.addToCartText}>Buy {cocktail.beverage.name}</Text>
              </Pressable>
            </View>
          )}

          {/* Pro Tips / Flavor Notes */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {cocktail.isNonAlcoholic ? 'Flavor Profile' : 'Pro Tips'}
            </Text>
            {cocktail.tips.map((tip, index) => (
              <View key={`tip-${index}`} style={styles.tipItem}>
                <MaterialCommunityIcons 
                  name={cocktail.isNonAlcoholic ? "leaf" : "lightbulb-outline"} 
                  size={16} 
                  color={colors.accent} 
                />
                <Text style={styles.tipText}>{tip}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  scrollContent: {
    paddingBottom: spacing(6),
  },
  heroImageContainer: {
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: 300,
    backgroundColor: colors.card,
  },
  actionButtonsContainer: {
    position: 'absolute',
    top: spacing(2),
    right: spacing(2),
    flexDirection: 'row',
    gap: spacing(1),
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  actionButtonActive: {
    backgroundColor: colors.accent,
  },
  content: {
    padding: spacing(3),
  },
  header: {
    marginBottom: spacing(3),
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: colors.text,
    marginBottom: spacing(1),
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.accent,
    marginBottom: spacing(2),
  },
  description: {
    fontSize: 16,
    color: colors.subtext,
    lineHeight: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: spacing(4),
    marginBottom: spacing(4),
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing(1),
  },
  statText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  section: {
    marginBottom: spacing(4),
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
    marginBottom: spacing(2),
  },
  ingredientItem: {
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    padding: spacing(2.5),
    marginBottom: spacing(1),
    borderWidth: 1,
    borderColor: colors.line,
  },
  ingredientName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing(0.5),
  },
  ingredientNote: {
    fontSize: 14,
    color: colors.subtext,
  },
  instructionItem: {
    flexDirection: 'row',
    marginBottom: spacing(2),
    gap: spacing(2),
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing(0.5),
  },
  stepNumberText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.white,
  },
  instructionText: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
    paddingTop: spacing(0.5),
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing(2),
    marginBottom: spacing(1.5),
  },
  tipText: {
    flex: 1,
    fontSize: 15,
    color: colors.subtext,
    lineHeight: 22,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    fontSize: 18,
    color: colors.subtext,
  },
  addToCartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accent,
    borderRadius: radii.lg,
    paddingVertical: spacing(2.5),
    paddingHorizontal: spacing(3),
    gap: spacing(1.5),
    shadowColor: colors.accent,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  addToCartText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.white,
  },
});