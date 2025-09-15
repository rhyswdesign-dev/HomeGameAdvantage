import type { SpiritContent } from '../types/spirit';
import { getBrandById } from './brands/index';

export const highlandCrownGold: SpiritContent = {
  id: 'highland_crown',
  name: 'Highland Crown',
  hero: {
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1200&auto=format&fit=crop',
    title: 'Scottish Heritage, Modern Excellence',
    xpMessage: '+150 XP'
  },
  products: [
    {
      id: '18yo',
      image: 'https://images.unsplash.com/photo-1569529465841-dfecdab7503b?q=80&w=1200&auto=format&fit=crop',
      name: 'Highland Crown 18 Year Old',
      blurb: 'Our flagship single malt with rich honey and oak notes.'
    },
    {
      id: '25yo',
      image: 'https://images.unsplash.com/photo-1572116469696-31de0f17cc34?q=80&w=1200&auto=format&fit=crop',
      name: 'Highland Crown 25 Year Old',
      blurb: 'Ultra-premium expression with extraordinary depth and complexity.'
    },
    {
      id: 'cask_strength',
      image: 'https://images.unsplash.com/photo-1582270715020-55c3ad3df4b4?q=80&w=1200&auto=format&fit=crop',
      name: 'Highland Crown Cask Strength',
      blurb: 'Unfiltered at natural strength for the ultimate whisky experience.'
    }
  ],
  recipes: [
    {
      id: 'highland_sour',
      image: 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?q=80&w=1200&auto=format&fit=crop',
      name: 'Highland Crown Sour',
      ingredients: ['2 oz Highland Crown 18', '1 oz Fresh Lemon Juice', '0.75 oz Honey Syrup', 'Egg White'],
      instructions: 'Dry shake, then shake with ice. Double strain into coupe glass.',
      glassware: 'Coupe Glass',
      garnish: 'Lemon wheel & cherry'
    },
    {
      id: 'highland_old_fashioned',
      image: 'https://images.unsplash.com/photo-1536935338788-846bb9981813?q=80&w=1200&auto=format&fit=crop',
      name: 'Highland Crown Old Fashioned',
      ingredients: ['2 oz Highland Crown 18', '0.25 oz Demerara Syrup', '2 dashes Angostura Bitters', 'Orange peel'],
      instructions: 'Stir with ice. Strain over large ice cube. Express orange peel.',
      glassware: 'Rocks Glass',
      garnish: 'Orange peel'
    },
    {
      id: 'highland_manhattan',
      image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?q=80&w=1200&auto=format&fit=crop',
      name: 'Highland Crown Manhattan',
      ingredients: ['2 oz Highland Crown 18', '1 oz Sweet Vermouth', '2 dashes Angostura Bitters'],
      instructions: 'Stir with ice. Strain into coupe glass.',
      glassware: 'Coupe Glass',
      garnish: 'Luxardo cherry'
    },
    {
      id: 'penicillin',
      image: 'https://images.unsplash.com/photo-1527161153336-95b168e1acb0?q=80&w=1200&auto=format&fit=crop',
      name: 'Highland Crown Penicillin',
      ingredients: ['2 oz Highland Crown 18', '0.75 oz Lemon Juice', '0.75 oz Honey-Ginger Syrup', '0.25 oz Islay Scotch float'],
      instructions: 'Shake first three ingredients with ice. Strain over ice. Float Islay Scotch.',
      glassware: 'Rocks Glass',
      garnish: 'Candied ginger'
    },
    {
      id: 'highland_highball',
      image: 'https://images.unsplash.com/photo-1560785496-3c9d27877182?q=80&w=1200&auto=format&fit=crop',
      name: 'Highland Crown Highball',
      ingredients: ['2 oz Highland Crown 18', '4 oz Premium Soda Water', 'Lemon peel'],
      instructions: 'Build over ice in chilled glass. Express lemon peel and drop in.',
      glassware: 'Highball Glass',
      garnish: 'Lemon peel'
    }
  ],
  challenge: {
    image: 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?q=80&w=1200&auto=format&fit=crop',
    title: 'Master the Highland Crown Cocktail',
    copy: 'Create your signature whisky cocktail using Highland Crown. Show us your creativity and craftsmanship.',
    cta: 'Submit Recipe'
  },
  events: [
    {
      id: 'hc1',
      title: 'Highland Crown Master Class',
      city: 'Edinburgh, Scotland',
      dateISO: '2025-07-10'
    },
    {
      id: 'hc2',
      title: 'Highland Crown Tasting Experience',
      city: 'New York, NY',
      dateISO: '2025-08-05'
    },
    {
      id: 'hc3',
      title: 'Highland Crown Whisky & Food Pairing',
      city: 'London, UK',
      dateISO: '2025-08-20'
    },
    {
      id: 'hc4',
      title: 'Highland Crown Distillery Tour',
      city: 'Speyside, Scotland',
      dateISO: '2025-09-15'
    }
  ],
  ambassadors: [
    {
      id: 'master_distiller_highlands',
      name: 'Hamish MacLeod',
      role: 'Master Distiller',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=240&h=240&auto=format&fit=crop'
    },
    {
      id: 'brand_ambassador_hc',
      name: 'Fiona Campbell',
      role: 'Global Brand Ambassador',
      avatar: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?q=80&w=240&h=240&auto=format&fit=crop'
    },
    {
      id: 'whisky_expert_hc',
      name: 'Robert Stewart',
      role: 'Whisky Expert',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=240&h=240&auto=format&fit=crop'
    }
  ],
  learning: {
    id: 'scotch_whisky_101',
    title: 'Scotch Whisky Masterclass',
    icon: 'book'
  },
  rewards: [
    {
      id: 'highland_glencairn',
      image: 'https://images.unsplash.com/photo-1544280978-b5d5be0ad9a3?q=80&w=1200&auto=format&fit=crop',
      name: 'Highland Crown Glencairn Glass Set',
      xp: 500
    },
    {
      id: 'highland_tasting_kit',
      image: 'https://images.unsplash.com/photo-1560785496-3c9d27877182?q=80&w=1200&auto=format&fit=crop',
      name: 'Highland Crown Tasting Kit',
      xp: 750
    },
    {
      id: 'highland_collectors_bottle',
      image: 'https://images.unsplash.com/photo-1569529465841-dfecdab7503b?q=80&w=1200&auto=format&fit=crop',
      name: 'Highland Crown Limited Edition',
      xp: 1200
    },
    {
      id: 'highland_distillery_visit',
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1200&auto=format&fit=crop',
      name: 'Highland Crown Distillery Experience',
      xp: 2000
    }
  ],
  social: [
    {
      id: 'post1_hc',
      image: 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?q=80&w=1200&auto=format&fit=crop',
      handle: '@whisky_connoisseur',
      caption: 'Just tried the Highland Crown 25 - absolutely incredible depth and complexity! 🥃'
    },
    {
      id: 'post2_hc',
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1200&auto=format&fit=crop',
      handle: '@bartender_mike',
      caption: 'Highland Crown makes the perfect Old Fashioned. The honey notes really shine through.'
    },
    {
      id: 'post3_hc',
      image: 'https://images.unsplash.com/photo-1536935338788-846bb9981813?q=80&w=1200&auto=format&fit=crop',
      handle: '@scotch_lover',
      caption: 'Visited the Highland Crown distillery today. What an amazing experience! #WhiskyTrail'
    }
  ],
  pairings: [
    {
      id: 'dark_chocolate',
      name: 'Dark Chocolate',
      category: 'food' as const,
      image: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?q=80&w=400&auto=format&fit=crop',
      description: 'Rich 70% cocoa chocolate pairs beautifully with Highland Crown\'s oak notes.',
      rating: 5
    },
    {
      id: 'aged_cheese',
      name: 'Aged Scottish Cheese',
      category: 'food' as const,
      image: 'https://images.unsplash.com/photo-1552767059-ce182ead6c1b?q=80&w=400&auto=format&fit=crop',
      description: 'Traditional Scottish cheeses complement the whisky\'s complexity perfectly.',
      rating: 4
    }
  ],
  brandVideos: [
    {
      id: 'distillery_tour',
      title: 'Highland Crown Distillery Tour',
      description: 'Take an exclusive behind-the-scenes tour of our Scottish distillery.',
      thumbnail: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1200&auto=format&fit=crop',
      duration: '3:45',
      xpReward: 50,
      watched: false
    },
    {
      id: 'master_distiller_interview',
      title: 'Meet Master Distiller Hamish MacLeod',
      description: 'Learn about traditional whisky making from our master distiller.',
      thumbnail: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1200&auto=format&fit=crop',
      duration: '5:20',
      xpReward: 75,
      watched: false
    },
    {
      id: 'cocktail_masterclass',
      title: 'Highland Crown Cocktail Masterclass',
      description: 'Master the art of whisky cocktails with expert techniques.',
      thumbnail: 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?q=80&w=1200&auto=format&fit=crop',
      duration: '4:15',
      xpReward: 60,
      watched: false
    }
  ]
};

export const mixmindRumGold: SpiritContent = {
  id: 'mixmind_rum',
  name: 'MixMind Rum',
  hero: {
    image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c76ac?q=80&w=1600&auto=format&fit=crop',
    title: 'Crafting the world\'s finest rum',
    xpMessage: '+150 XP'
  },
  products: [
    {
      id: '12yo',
      image: 'https://images.unsplash.com/photo-1569529465841-dfecdab7503b?q=80&w=1200&auto=format&fit=crop',
      name: 'MixMind 12 Year Old',
      blurb: 'Our flagship aged rum with notes of caramel and oak.'
    },
    {
      id: 'reserve',
      image: 'https://images.unsplash.com/photo-1572116469696-31de0f17cc34?q=80&w=1200&auto=format&fit=crop',
      name: 'MixMind Reserve',
      blurb: 'Limited batch reserve with complex spice profile.'
    },
    {
      id: 'white',
      image: 'https://images.unsplash.com/photo-1582270715020-55c3ad3df4b4?q=80&w=1200&auto=format&fit=crop',
      name: 'MixMind White',
      blurb: 'Crystal clear premium white rum, perfect for cocktails.'
    }
  ],
  recipes: [
    {
      id: 'classic_daiquiri',
      image: 'https://images.unsplash.com/photo-1569529465841-dfecdab7503b?q=80&w=1200&auto=format&fit=crop',
      name: 'Classic MixMind Daiquiri',
      ingredients: ['2 oz MixMind White Rum', '1 oz Fresh Lime Juice', '0.5 oz Simple Syrup'],
      instructions: 'Shake all ingredients with ice. Double strain into coupe glass.',
      glassware: 'Coupe Glass',
      garnish: 'Lime wheel'
    },
    {
      id: 'pina_colada',
      image: 'https://images.unsplash.com/photo-1541976076758-347942db1970?q=80&w=1200&auto=format&fit=crop',
      name: 'MixMind Piña Colada',
      ingredients: ['2 oz MixMind 12 Year Old', '1 oz Coconut Cream', '1 oz Pineapple Juice', '0.5 oz Lime Juice'],
      instructions: 'Blend with ice until smooth. Pour into hurricane glass.',
      glassware: 'Hurricane Glass',
      garnish: 'Pineapple wedge & cherry'
    },
    {
      id: 'rum_old_fashioned',
      image: 'https://images.unsplash.com/photo-1527161153336-95b168e1acb0?q=80&w=1200&auto=format&fit=crop',
      name: 'MixMind Old Fashioned',
      ingredients: ['2 oz MixMind Reserve', '0.25 oz Demerara Syrup', '2 dashes Angostura Bitters', 'Orange peel'],
      instructions: 'Stir with ice. Strain over large ice cube. Express orange peel.',
      glassware: 'Rocks Glass',
      garnish: 'Orange peel'
    },
    {
      id: 'dark_stormy',
      image: 'https://images.unsplash.com/photo-1544280978-b5d5be0ad9a3?q=80&w=1200&auto=format&fit=crop',
      name: 'MixMind Dark & Stormy',
      ingredients: ['2 oz MixMind 12 Year Old', '0.5 oz Fresh Lime Juice', '4 oz Ginger Beer'],
      instructions: 'Build in glass with ice. Top with ginger beer. Stir gently.',
      glassware: 'Highball Glass',
      garnish: 'Lime wedge'
    },
    {
      id: 'mai_tai',
      image: 'https://images.unsplash.com/photo-1560785496-3c9d27877182?q=80&w=1200&auto=format&fit=crop',
      name: 'MixMind Mai Tai',
      ingredients: ['1.5 oz MixMind White', '0.5 oz MixMind Reserve', '0.5 oz Orange Curaçao', '0.75 oz Lime Juice', '0.25 oz Orgeat Syrup'],
      instructions: 'Shake with ice. Strain over crushed ice. Float reserve rum on top.',
      glassware: 'Tiki Mug',
      garnish: 'Mint sprig & pineapple'
    }
  ],
  challenge: {
    image: 'https://images.unsplash.com/photo-1541976076758-347942db1970?q=80&w=1200&auto=format&fit=crop',
    title: 'Your Best Twist on the Piña Colada',
    copy: 'Submit your unique recipe for a chance to win exclusive prizes.',
    cta: 'Submit'
  },
  events: [
    {
      id: 'ev1',
      title: 'MixMind Tasting Event',
      city: 'New York, NY',
      dateISO: '2025-07-15'
    },
    {
      id: 'ev2',
      title: 'MixMind Cocktail Workshop',
      city: 'Los Angeles, CA',
      dateISO: '2025-08-02'
    }
  ],
  ambassadors: [
    {
      id: 'a1',
      name: 'Ethan Carter',
      role: 'Master Distiller',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=240&h=240&auto=format&fit=crop'
    },
    {
      id: 'a2',
      name: 'Olivia Bennett',
      role: 'Brand Ambassador',
      avatar: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?q=80&w=240&h=240&auto=format&fit=crop'
    }
  ],
  learning: {
    id: 'lm_rum101',
    title: 'Rum Origin 101',
    icon: 'book'
  },
  rewards: [
    {
      id: 'rw1',
      image: 'https://images.unsplash.com/photo-1560785496-3c9d27877182?q=80&w=1200&auto=format&fit=crop',
      name: 'MixMind Shaker',
      xp: 500
    },
    {
      id: 'rw2',
      image: 'https://images.unsplash.com/photo-1544280978-b5d5be0ad9a3?q=80&w=1200&auto=format&fit=crop',
      name: 'MixMind Glassware Set',
      xp: 300
    },
    {
      id: 'rw3',
      image: 'https://images.unsplash.com/photo-1569529465841-dfecdab7503b?q=80&w=1200&auto=format&fit=crop',
      name: 'MixMind Bar Tools Kit',
      xp: 750
    }
  ],
  social: [
    {
      id: 's1',
      image: 'https://images.unsplash.com/photo-1541976076758-347942db1970?q=80&w=1200&auto=format&fit=crop',
      handle: '@bartender_pro',
      caption: 'My MixMind creation!'
    },
    {
      id: 's2',
      image: 'https://images.unsplash.com/photo-1527161153336-95b168e1acb0?q=80&w=1200&auto=format&fit=crop',
      handle: '@mixology_master',
      caption: 'Loving this MixMind cocktail!'
    },
    {
      id: 's3',
      image: 'https://images.unsplash.com/photo-1560785496-3c9d27877182?q=80&w=1200&auto=format&fit=crop',
      handle: '@rum_enthusiast',
      caption: 'Perfect Mai Tai with MixMind!'
    },
    {
      id: 's4',
      image: 'https://images.unsplash.com/photo-1544280978-b5d5be0ad9a3?q=80&w=1200&auto=format&fit=crop',
      handle: '@cocktail_queen',
      caption: 'MixMind Dark & Stormy hits different'
    },
    {
      id: 's5',
      image: 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?q=80&w=1200&auto=format&fit=crop',
      handle: '@island_vibes',
      caption: 'Taking MixMind to paradise 🏝️'
    }
  ],
  brandVideos: [
    {
      id: 'v1',
      title: 'The Art of Rum Making',
      description: 'Discover the traditional methods behind MixMind Rum production',
      thumbnail: 'https://images.unsplash.com/photo-1569529465841-dfecdab7503b?q=80&w=1200&auto=format&fit=crop',
      duration: '3:45',
      xpReward: 50,
      watched: false
    },
    {
      id: 'v2',
      title: 'Master Distiller Stories',
      description: 'Meet Ethan Carter and learn about his 20-year journey',
      thumbnail: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1200&auto=format&fit=crop',
      duration: '5:20',
      xpReward: 75,
      watched: false
    },
    {
      id: 'v3',
      title: 'Perfect Rum Cocktails',
      description: 'Learn to craft signature MixMind cocktails from our ambassadors',
      thumbnail: 'https://images.unsplash.com/photo-1541976076758-347942db1970?q=80&w=1200&auto=format&fit=crop',
      duration: '4:15',
      xpReward: 60,
      watched: false
    },
    {
      id: 'v4',
      title: 'Heritage & Tradition',
      description: 'The history of Caribbean rum making and MixMind\'s legacy',
      thumbnail: 'https://images.unsplash.com/photo-1572116469696-31de0f17cc34?q=80&w=1200&auto=format&fit=crop',
      duration: '6:30',
      xpReward: 100,
      watched: false
    }
  ],
  pairings: [
    {
      id: 'p1',
      name: 'Dark Chocolate Truffles',
      category: 'food' as const,
      description: 'Rich 70% dark chocolate complements the rum\'s complex vanilla and caramel notes',
      image: 'https://images.unsplash.com/photo-1559664663-e0ec7e7a2c73?q=80&w=1200&auto=format&fit=crop',
      rating: 5
    },
    {
      id: 'p2',
      name: 'Cuban Cigars',
      category: 'cigar' as const,
      description: 'Premium hand-rolled cigars with earthy tobacco flavors that harmonize with aged rum',
      image: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?q=80&w=1200&auto=format&fit=crop',
      rating: 4
    },
    {
      id: 'p3',
      name: 'Grilled Caribbean Jerk Chicken',
      category: 'food' as const,
      description: 'Spicy island flavors enhanced by the rum\'s smooth finish and tropical undertones',
      image: 'https://images.unsplash.com/photo-1532636721123-4d7df8c31cce?q=80&w=1200&auto=format&fit=crop',
      rating: 4
    },
    {
      id: 'p4',
      name: 'Sunset Beach Relaxation',
      category: 'occasion' as const,
      description: 'Perfect for unwinding during golden hour with ocean views and gentle sea breeze',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1200&auto=format&fit=crop',
      rating: 5
    }
  ]
};

export const botanicalCrownGold: SpiritContent = {
  id: 'botanical_crown',
  name: 'Botanical Crown',
  hero: {
    image: 'https://images.unsplash.com/photo-1542843137-4b8b2f9d7690?q=80&w=1200&auto=format&fit=crop',
    title: 'Where Tradition Meets Innovation',
    xpMessage: '+150 XP'
  },
  products: [
    {
      id: 'london_dry',
      image: 'https://images.unsplash.com/photo-1569529465841-dfecdab7503b?q=80&w=1200&auto=format&fit=crop',
      name: 'Botanical Crown London Dry',
      blurb: 'Classic London Dry with 10 carefully selected botanicals.'
    },
    {
      id: 'navy_strength',
      image: 'https://images.unsplash.com/photo-1572116469696-31de0f17cc34?q=80&w=1200&auto=format&fit=crop',
      name: 'Botanical Crown Navy Strength',
      blurb: 'Bold 57% ABV expression with intensified botanical flavors.'
    },
    {
      id: 'barrel_aged',
      image: 'https://images.unsplash.com/photo-1582270715020-55c3ad3df4b4?q=80&w=1200&auto=format&fit=crop',
      name: 'Botanical Crown Barrel Aged',
      blurb: 'Unique oak-aged gin with whisky-like complexity.'
    }
  ],
  recipes: [
    {
      id: 'botanical_gin_tonic',
      image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c76ac?q=80&w=1200&auto=format&fit=crop',
      name: 'Botanical Crown & Tonic',
      ingredients: ['2 oz Botanical Crown London Dry', '4 oz Premium Tonic Water', 'Juniper berries', 'Lime wheel'],
      instructions: 'Build over ice. Stir gently. Garnish with juniper and lime.',
      glassware: 'Copa Glass',
      garnish: 'Juniper berries & lime wheel'
    },
    {
      id: 'botanical_negroni',
      image: 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?q=80&w=1200&auto=format&fit=crop',
      name: 'Botanical Crown Negroni',
      ingredients: ['1 oz Botanical Crown London Dry', '1 oz Campari', '1 oz Sweet Vermouth'],
      instructions: 'Stir with ice. Strain over large ice cube.',
      glassware: 'Rocks Glass',
      garnish: 'Orange peel'
    },
    {
      id: 'botanical_martini',
      image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?q=80&w=1200&auto=format&fit=crop',
      name: 'Botanical Crown Martini',
      ingredients: ['2.5 oz Botanical Crown London Dry', '0.5 oz Dry Vermouth', 'Lemon twist'],
      instructions: 'Stir with ice. Strain into chilled martini glass.',
      glassware: 'Martini Glass',
      garnish: 'Lemon twist'
    },
    {
      id: 'botanical_basil_smash',
      image: 'https://images.unsplash.com/photo-1527161153336-95b168e1acb0?q=80&w=1200&auto=format&fit=crop',
      name: 'Botanical Crown Basil Smash',
      ingredients: ['2 oz Botanical Crown London Dry', '8 fresh basil leaves', '1 oz Lemon juice', '0.75 oz Simple syrup'],
      instructions: 'Muddle basil gently. Shake with other ingredients. Double strain over ice.',
      glassware: 'Rocks Glass',
      garnish: 'Fresh basil sprig'
    },
    {
      id: 'french_75',
      image: 'https://images.unsplash.com/photo-1560785496-3c9d27877182?q=80&w=1200&auto=format&fit=crop',
      name: 'Botanical Crown French 75',
      ingredients: ['1 oz Botanical Crown London Dry', '0.5 oz Lemon juice', '0.5 oz Simple syrup', '3 oz Champagne'],
      instructions: 'Shake gin, lemon, and syrup with ice. Strain into flute. Top with Champagne.',
      glassware: 'Champagne Flute',
      garnish: 'Lemon twist'
    }
  ],
  challenge: {
    image: 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?q=80&w=1200&auto=format&fit=crop',
    title: 'Craft the Perfect Botanical Cocktail',
    copy: 'Create an innovative gin cocktail that showcases our unique botanical blend. Let your creativity flourish!',
    cta: 'Submit Recipe'
  },
  events: [
    {
      id: 'bc1',
      title: 'Botanical Crown Distillery Experience',
      city: 'London, UK',
      dateISO: '2025-07-12'
    },
    {
      id: 'bc2',
      title: 'Gin & Botanical Tasting',
      city: 'New York, NY',
      dateISO: '2025-08-08'
    },
    {
      id: 'bc3',
      title: 'Botanical Crown Cocktail Workshop',
      city: 'San Francisco, CA',
      dateISO: '2025-08-25'
    },
    {
      id: 'bc4',
      title: 'Meet the Master Distiller',
      city: 'London, UK',
      dateISO: '2025-09-18'
    }
  ],
  ambassadors: [
    {
      id: 'master_distiller_gin',
      name: 'Oliver Hartwell',
      role: 'Master Distiller',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=240&h=240&auto=format&fit=crop'
    },
    {
      id: 'botanical_expert',
      name: 'Emma Thompson',
      role: 'Head of Botanicals',
      avatar: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?q=80&w=240&h=240&auto=format&fit=crop'
    },
    {
      id: 'gin_ambassador',
      name: 'James Fletcher',
      role: 'Global Gin Ambassador',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=240&h=240&auto=format&fit=crop'
    }
  ],
  learning: {
    id: 'gin_botanical_masterclass',
    title: 'Gin & Botanicals Masterclass',
    icon: 'book'
  },
  rewards: [
    {
      id: 'botanical_gin_glass_set',
      image: 'https://images.unsplash.com/photo-1544280978-b5d5be0ad9a3?q=80&w=1200&auto=format&fit=crop',
      name: 'Botanical Crown Copa Glass Set',
      xp: 500
    },
    {
      id: 'gin_botanical_kit',
      image: 'https://images.unsplash.com/photo-1560785496-3c9d27877182?q=80&w=1200&auto=format&fit=crop',
      name: 'Botanical Tasting Kit',
      xp: 750
    },
    {
      id: 'botanical_collectors_bottle',
      image: 'https://images.unsplash.com/photo-1569529465841-dfecdab7503b?q=80&w=1200&auto=format&fit=crop',
      name: 'Botanical Crown Limited Edition',
      xp: 1200
    },
    {
      id: 'distillery_masterclass',
      image: 'https://images.unsplash.com/photo-1542843137-4b8b2f9d7690?q=80&w=1200&auto=format&fit=crop',
      name: 'Private Distillery Masterclass',
      xp: 2000
    }
  ],
  social: [
    {
      id: 'post1_bc',
      image: 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?q=80&w=1200&auto=format&fit=crop',
      handle: '@gin_enthusiast',
      caption: 'The Botanical Crown Navy Strength makes the most incredible Negroni! 🍸'
    },
    {
      id: 'post2_bc',
      image: 'https://images.unsplash.com/photo-1542843137-4b8b2f9d7690?q=80&w=1200&auto=format&fit=crop',
      handle: '@cocktail_sarah',
      caption: 'Love the botanical complexity in every sip. Perfect for classic cocktails and modern creations alike!'
    },
    {
      id: 'post3_bc',
      image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c76ac?q=80&w=1200&auto=format&fit=crop',
      handle: '@london_bartender',
      caption: 'Botanical Crown & Tonic with juniper garnish is perfection. #GinLife #BotanicalCrown'
    }
  ],
  pairings: [
    {
      id: 'cucumber_mint',
      name: 'Cucumber & Fresh Herbs',
      category: 'food' as const,
      image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?q=80&w=400&auto=format&fit=crop',
      description: 'Fresh cucumber and herbs complement gin\'s botanical character beautifully.',
      rating: 4
    },
    {
      id: 'seafood',
      name: 'Fresh Seafood',
      category: 'food' as const,
      image: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?q=80&w=400&auto=format&fit=crop',
      description: 'The clean, crisp notes pair perfectly with oysters and fresh seafood.',
      rating: 5
    }
  ],
  brandVideos: [
    {
      id: 'botanical_distillation',
      title: 'The Art of Botanical Distillation',
      description: 'Discover the intricate process of botanical distillation that creates Botanical Crown\'s unique flavor profile.',
      thumbnail: 'https://images.unsplash.com/photo-1542843137-4b8b2f9d7690?q=80&w=1200&auto=format&fit=crop',
      duration: '4:20',
      xpReward: 65,
      watched: false
    },
    {
      id: 'gin_cocktail_series',
      title: 'Classic Gin Cocktails Masterclass',
      description: 'Master the art of crafting classic gin cocktails with our expert bartenders.',
      thumbnail: 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?q=80&w=1200&auto=format&fit=crop',
      duration: '6:15',
      xpReward: 90,
      watched: false
    },
    {
      id: 'botanical_sourcing',
      title: 'Sourcing Premium Botanicals',
      description: 'Learn about our carefully selected botanicals from around the world that make Botanical Crown special.',
      thumbnail: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1200&auto=format&fit=crop',
      duration: '3:50',
      xpReward: 55,
      watched: false
    }
  ]
};

export const crystalPeakGold: SpiritContent = {
  id: 'crystal_peak',
  name: 'Crystal Peak',
  hero: {
    image: 'https://images.unsplash.com/photo-1551022372-0bdac482b9d8?q=80&w=1200&auto=format&fit=crop',
    title: 'Purity Perfected',
    xpMessage: '+150 XP'
  },
  products: [
    {
      id: 'platinum',
      image: 'https://images.unsplash.com/photo-1569529465841-dfecdab7503b?q=80&w=1200&auto=format&fit=crop',
      name: 'Crystal Peak Platinum',
      blurb: 'Ultra-premium vodka filtered through diamond dust for ultimate purity.'
    },
    {
      id: 'glacier',
      image: 'https://images.unsplash.com/photo-1572116469696-31de0f17cc34?q=80&w=1200&auto=format&fit=crop',
      name: 'Crystal Peak Glacier',
      blurb: 'Crafted from pristine glacier water with a silky smooth finish.'
    },
    {
      id: 'reserve',
      image: 'https://images.unsplash.com/photo-1582270715020-55c3ad3df4b4?q=80&w=1200&auto=format&fit=crop',
      name: 'Crystal Peak Reserve',
      blurb: 'Small batch vodka with enhanced character and depth.'
    }
  ],
  recipes: [
    {
      id: 'crystal_moscow_mule',
      image: 'https://images.unsplash.com/photo-1536935338788-846bb9981813?q=80&w=1200&auto=format&fit=crop',
      name: 'Crystal Peak Moscow Mule',
      ingredients: ['2 oz Crystal Peak Platinum', '0.5 oz Fresh Lime Juice', '4 oz Premium Ginger Beer'],
      instructions: 'Build over ice in copper mug. Stir gently.',
      glassware: 'Copper Mug',
      garnish: 'Lime wheel & fresh mint'
    },
    {
      id: 'crystal_cosmopolitan',
      image: 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?q=80&w=1200&auto=format&fit=crop',
      name: 'Crystal Peak Cosmopolitan',
      ingredients: ['1.5 oz Crystal Peak Platinum', '1 oz Cranberry Juice', '0.5 oz Fresh Lime Juice', '0.5 oz Triple Sec'],
      instructions: 'Shake with ice. Double strain into chilled martini glass.',
      glassware: 'Martini Glass',
      garnish: 'Lime wheel'
    },
    {
      id: 'crystal_martini',
      image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?q=80&w=1200&auto=format&fit=crop',
      name: 'Crystal Peak Martini',
      ingredients: ['2.5 oz Crystal Peak Platinum', '0.25 oz Dry Vermouth', 'Lemon twist or olive'],
      instructions: 'Stir with ice. Strain into chilled martini glass.',
      glassware: 'Martini Glass',
      garnish: 'Lemon twist or olive'
    },
    {
      id: 'crystal_bloody_mary',
      image: 'https://images.unsplash.com/photo-1527161153336-95b168e1acb0?q=80&w=1200&auto=format&fit=crop',
      name: 'Crystal Peak Bloody Mary',
      ingredients: ['2 oz Crystal Peak Glacier', '4 oz Premium Tomato Juice', '0.5 oz Lemon Juice', 'Worcestershire', 'Celery Salt'],
      instructions: 'Stir ingredients over ice. Garnish elaborately.',
      glassware: 'Highball Glass',
      garnish: 'Celery, olives, lemon'
    },
    {
      id: 'crystal_espresso_martini',
      image: 'https://images.unsplash.com/photo-1560785496-3c9d27877182?q=80&w=1200&auto=format&fit=crop',
      name: 'Crystal Peak Espresso Martini',
      ingredients: ['2 oz Crystal Peak Reserve', '1 oz Fresh Espresso', '0.5 oz Coffee Liqueur', '0.25 oz Simple Syrup'],
      instructions: 'Shake vigorously with ice. Double strain into coupe.',
      glassware: 'Coupe Glass',
      garnish: '3 coffee beans'
    }
  ],
  challenge: {
    image: 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?q=80&w=1200&auto=format&fit=crop',
    title: 'Pure Innovation Challenge',
    copy: 'Create a cocktail that showcases Crystal Peak\'s pure character. Show us how clean meets creative!',
    cta: 'Submit Recipe'
  },
  events: [
    {
      id: 'cp1',
      title: 'Crystal Peak Purity Experience',
      city: 'Reykjavik, Iceland',
      dateISO: '2025-07-18'
    },
    {
      id: 'cp2',
      title: 'Premium Vodka Tasting',
      city: 'Moscow, Russia',
      dateISO: '2025-08-12'
    },
    {
      id: 'cp3',
      title: 'Crystal Peak Cocktail Masterclass',
      city: 'New York, NY',
      dateISO: '2025-09-02'
    },
    {
      id: 'cp4',
      title: 'Glacier Water Source Tour',
      city: 'Reykjavik, Iceland',
      dateISO: '2025-09-22'
    }
  ],
  ambassadors: [
    {
      id: 'master_distiller_vodka',
      name: 'Viktor Petrov',
      role: 'Master Distiller',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=240&h=240&auto=format&fit=crop'
    },
    {
      id: 'vodka_specialist',
      name: 'Anastasia Volkov',
      role: 'Vodka Specialist',
      avatar: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?q=80&w=240&h=240&auto=format&fit=crop'
    },
    {
      id: 'brand_ambassador_vodka',
      name: 'Magnus Berg',
      role: 'Nordic Brand Ambassador',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=240&h=240&auto=format&fit=crop'
    }
  ],
  learning: {
    id: 'vodka_purity_masterclass',
    title: 'The Art of Vodka Purity',
    icon: 'book'
  },
  rewards: [
    {
      id: 'crystal_vodka_glasses',
      image: 'https://images.unsplash.com/photo-1544280978-b5d5be0ad9a3?q=80&w=1200&auto=format&fit=crop',
      name: 'Crystal Peak Glass Collection',
      xp: 500
    },
    {
      id: 'vodka_tasting_kit',
      image: 'https://images.unsplash.com/photo-1560785496-3c9d27877182?q=80&w=1200&auto=format&fit=crop',
      name: 'Premium Vodka Tasting Kit',
      xp: 750
    },
    {
      id: 'crystal_collectors_bottle',
      image: 'https://images.unsplash.com/photo-1569529465841-dfecdab7503b?q=80&w=1200&auto=format&fit=crop',
      name: 'Crystal Peak Diamond Edition',
      xp: 1500
    },
    {
      id: 'glacier_source_visit',
      image: 'https://images.unsplash.com/photo-1551022372-0bdac482b9d8?q=80&w=1200&auto=format&fit=crop',
      name: 'Glacier Source Experience',
      xp: 2500
    }
  ],
  social: [
    {
      id: 'post1_cp',
      image: 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?q=80&w=1200&auto=format&fit=crop',
      handle: '@vodka_lover',
      caption: 'Crystal Peak Platinum is incredibly smooth. Perfect for sipping neat or in cocktails! ❄️'
    },
    {
      id: 'post2_cp',
      image: 'https://images.unsplash.com/photo-1551022372-0bdac482b9d8?q=80&w=1200&auto=format&fit=crop',
      handle: '@bartender_alex',
      caption: 'The purity of Crystal Peak makes every cocktail taste cleaner and more refined.'
    },
    {
      id: 'post3_cp',
      image: 'https://images.unsplash.com/photo-1536935338788-846bb9981813?q=80&w=1200&auto=format&fit=crop',
      handle: '@mixology_master',
      caption: 'Crystal Peak Moscow Mule is my new favorite. The glacier water makes all the difference! 🍹'
    }
  ],
  pairings: [
    {
      id: 'caviar',
      name: 'Premium Caviar',
      category: 'food' as const,
      image: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?q=80&w=400&auto=format&fit=crop',
      description: 'The ultimate luxury pairing - pure vodka with pristine caviar.',
      rating: 5
    },
    {
      id: 'smoked_salmon',
      name: 'Smoked Salmon',
      category: 'food' as const,
      image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?q=80&w=400&auto=format&fit=crop',
      description: 'Clean vodka perfectly complements the rich, smoky flavors.',
      rating: 4
    }
  ],
  brandVideos: [
    {
      id: 'glacier_water_story',
      title: 'From Glacier to Glass',
      description: 'Discover how pristine glacier water becomes Crystal Peak\'s signature purity.',
      thumbnail: 'https://images.unsplash.com/photo-1551022372-0bdac482b9d8?q=80&w=1200&auto=format&fit=crop',
      duration: '4:30',
      xpReward: 70,
      watched: false
    },
    {
      id: 'distillation_process',
      title: 'The Crystal Peak Distillation Process',
      description: 'Learn about our innovative distillation methods that create unmatched vodka purity.',
      thumbnail: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1200&auto=format&fit=crop',
      duration: '5:45',
      xpReward: 85,
      watched: false
    },
    {
      id: 'vodka_cocktail_guide',
      title: 'Essential Vodka Cocktails Guide',
      description: 'Master classic vodka cocktails with expert techniques and Crystal Peak\'s smooth finish.',
      thumbnail: 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?q=80&w=1200&auto=format&fit=crop',
      duration: '3:25',
      xpReward: 50,
      watched: false
    }
  ]
};

export const agaveRealGold: SpiritContent = {
  id: 'agave_real',
  name: 'Agave Real',
  hero: {
    image: 'https://images.unsplash.com/photo-1620325867503-2e8b5d0a5b90?q=80&w=1200&auto=format&fit=crop',
    title: 'The Soul of Jalisco',
    xpMessage: '+150 XP'
  },
  products: [
    {
      id: 'blanco',
      image: 'https://images.unsplash.com/photo-1569529465841-dfecdab7503b?q=80&w=1200&auto=format&fit=crop',
      name: 'Agave Real Blanco',
      blurb: 'Pure expression of blue agave with bright, crisp character.'
    },
    {
      id: 'reposado',
      image: 'https://images.unsplash.com/photo-1572116469696-31de0f17cc34?q=80&w=1200&auto=format&fit=crop',
      name: 'Agave Real Reposado',
      blurb: 'Aged 8 months in American oak for perfect balance of agave and wood.'
    },
    {
      id: 'anejo',
      image: 'https://images.unsplash.com/photo-1582270715020-55c3ad3df4b4?q=80&w=1200&auto=format&fit=crop',
      name: 'Agave Real Añejo',
      blurb: 'Aged 18 months for rich complexity and smooth finish.'
    }
  ],
  recipes: [
    {
      id: 'agave_margarita',
      image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?q=80&w=1200&auto=format&fit=crop',
      name: 'Agave Real Margarita',
      ingredients: ['2 oz Agave Real Blanco', '1 oz Fresh Lime Juice', '1 oz Orange Liqueur', 'Himalayan salt rim'],
      instructions: 'Shake with ice. Strain into salt-rimmed glass over ice.',
      glassware: 'Rocks Glass',
      garnish: 'Lime wheel'
    },
    {
      id: 'agave_paloma',
      image: 'https://images.unsplash.com/photo-1536935338788-846bb9981813?q=80&w=1200&auto=format&fit=crop',
      name: 'Agave Real Paloma',
      ingredients: ['2 oz Agave Real Blanco', '0.5 oz Lime Juice', '4 oz Grapefruit Soda', 'Salt rim'],
      instructions: 'Build over ice in salt-rimmed glass. Stir gently.',
      glassware: 'Highball Glass',
      garnish: 'Grapefruit wedge'
    },
    {
      id: 'agave_old_fashioned',
      image: 'https://images.unsplash.com/photo-1527161153336-95b168e1acb0?q=80&w=1200&auto=format&fit=crop',
      name: 'Agave Real Old Fashioned',
      ingredients: ['2 oz Agave Real Añejo', '0.25 oz Agave Syrup', '2 dashes Orange Bitters', 'Orange peel'],
      instructions: 'Stir with ice. Strain over large ice cube. Express orange peel.',
      glassware: 'Rocks Glass',
      garnish: 'Orange peel'
    },
    {
      id: 'tommy_margarita',
      image: 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?q=80&w=1200&auto=format&fit=crop',
      name: 'Agave Real Tommy\'s Margarita',
      ingredients: ['2 oz Agave Real Blanco', '1 oz Fresh Lime Juice', '0.5 oz Agave Nectar'],
      instructions: 'Shake with ice. Strain into coupe glass.',
      glassware: 'Coupe Glass',
      garnish: 'Lime wheel'
    },
    {
      id: 'tequila_sunrise',
      image: 'https://images.unsplash.com/photo-1560785496-3c9d27877182?q=80&w=1200&auto=format&fit=crop',
      name: 'Agave Real Sunrise',
      ingredients: ['2 oz Agave Real Blanco', '4 oz Orange Juice', '0.5 oz Grenadine'],
      instructions: 'Build tequila and OJ over ice. Float grenadine by pouring slowly.',
      glassware: 'Hurricane Glass',
      garnish: 'Orange wheel & cherry'
    }
  ],
  challenge: {
    image: 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?q=80&w=1200&auto=format&fit=crop',
    title: 'Celebrate Agave Heritage',
    copy: 'Create a tequila cocktail that honors Mexican tradition while showcasing modern creativity. ¡Salud!',
    cta: 'Submit Recipe'
  },
  events: [
    {
      id: 'ar1',
      title: 'Agave Real Hacienda Experience',
      city: 'Guadalajara, Mexico',
      dateISO: '2025-07-25'
    },
    {
      id: 'ar2',
      title: 'Tequila & Mezcal Masterclass',
      city: 'Mexico City, Mexico',
      dateISO: '2025-08-15'
    },
    {
      id: 'ar3',
      title: 'Agave Real Cocktail Festival',
      city: 'Austin, TX',
      dateISO: '2025-09-05'
    },
    {
      id: 'ar4',
      title: 'Day of the Dead Celebration',
      city: 'Los Angeles, CA',
      dateISO: '2025-11-02'
    }
  ],
  ambassadors: [
    {
      id: 'master_tequilero',
      name: 'Carlos Hernández',
      role: 'Master Tequilero',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=240&h=240&auto=format&fit=crop'
    },
    {
      id: 'agave_expert',
      name: 'María González',
      role: 'Agave Cultivation Expert',
      avatar: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?q=80&w=240&h=240&auto=format&fit=crop'
    },
    {
      id: 'brand_ambassador_tequila',
      name: 'Diego Ramirez',
      role: 'Global Tequila Ambassador',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=240&h=240&auto=format&fit=crop'
    }
  ],
  learning: {
    id: 'tequila_agave_masterclass',
    title: 'From Agave to Añejo: Tequila Mastery',
    icon: 'book'
  },
  rewards: [
    {
      id: 'agave_shot_glasses',
      image: 'https://images.unsplash.com/photo-1544280978-b5d5be0ad9a3?q=80&w=1200&auto=format&fit=crop',
      name: 'Handcrafted Agave Glass Set',
      xp: 500
    },
    {
      id: 'tequila_tasting_kit',
      image: 'https://images.unsplash.com/photo-1560785496-3c9d27877182?q=80&w=1200&auto=format&fit=crop',
      name: 'Agave Real Tasting Collection',
      xp: 750
    },
    {
      id: 'agave_collectors_bottle',
      image: 'https://images.unsplash.com/photo-1569529465841-dfecdab7503b?q=80&w=1200&auto=format&fit=crop',
      name: 'Agave Real Día de Muertos Edition',
      xp: 1200
    },
    {
      id: 'hacienda_experience',
      image: 'https://images.unsplash.com/photo-1620325867503-2e8b5d0a5b90?q=80&w=1200&auto=format&fit=crop',
      name: 'Agave Real Hacienda Tour',
      xp: 2200
    }
  ],
  social: [
    {
      id: 'post1_ar',
      image: 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?q=80&w=1200&auto=format&fit=crop',
      handle: '@tequila_amigo',
      caption: 'Agave Real Reposado neat is pure magic. The oak aging adds such beautiful complexity! 🌵'
    },
    {
      id: 'post2_ar',
      image: 'https://images.unsplash.com/photo-1620325867503-2e8b5d0a5b90?q=80&w=1200&auto=format&fit=crop',
      handle: '@mexican_mixology',
      caption: 'Nothing beats an Agave Real Margarita on a sunset patio. Authentic Mexican craftsmanship! 🌅'
    },
    {
      id: 'post3_ar',
      image: 'https://images.unsplash.com/photo-1536935338788-846bb9981813?q=80&w=1200&auto=format&fit=crop',
      handle: '@cocktail_maria',
      caption: 'Just visited the Agave Real hacienda - seeing the jimadores at work was incredible! #TequilaHeritage'
    }
  ],
  pairings: [
    {
      id: 'mexican_chocolate',
      name: 'Mexican Chocolate',
      category: 'food' as const,
      image: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?q=80&w=400&auto=format&fit=crop',
      description: 'Rich, spiced chocolate perfectly complements tequila\'s earthy agave notes.',
      rating: 5
    },
    {
      id: 'lime_salt',
      name: 'Lime & Sea Salt',
      category: 'food' as const,
      image: 'https://images.unsplash.com/photo-1594736797933-d0e1da20c51e?q=80&w=400&auto=format&fit=crop',
      description: 'The classic pairing that enhances tequila\'s natural brightness.',
      rating: 4
    }
  ],
  brandVideos: [
    {
      id: 'agave_harvest',
      title: 'The Sacred Agave Harvest',
      description: 'Journey to the highlands of Jalisco and witness the traditional art of agave harvesting by skilled jimadores.',
      thumbnail: 'https://images.unsplash.com/photo-1620325867503-2e8b5d0a5b90?q=80&w=1200&auto=format&fit=crop',
      duration: '5:10',
      xpReward: 80,
      watched: false
    },
    {
      id: 'tequila_production',
      title: 'Traditional Tequila Production',
      description: 'Discover the time-honored methods of tequila production from piña cooking to final distillation.',
      thumbnail: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1200&auto=format&fit=crop',
      duration: '4:45',
      xpReward: 75,
      watched: false
    },
    {
      id: 'margarita_masterclass',
      title: 'Perfect Margarita Masterclass',
      description: 'Learn to craft the perfect margarita with authentic techniques and premium Agave Real tequila.',
      thumbnail: 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?q=80&w=1200&auto=format&fit=crop',
      duration: '3:35',
      xpReward: 55,
      watched: false
    }
  ]
};

// Function to convert any brand to Gold tier spirit content
function createSpiritContentFromBrand(brand: any): SpiritContent {
  const categoryRecipes: Record<string, any[]> = {
    'Whiskey': [
      {
        id: 'whiskey_sour',
        image: 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?q=80&w=1200&auto=format&fit=crop',
        name: `${brand.name} Sour`,
        ingredients: [`2 oz ${brand.name}`, '1 oz Lemon Juice', '0.75 oz Simple Syrup', 'Egg White'],
        instructions: 'Dry shake, then shake with ice. Double strain into coupe.',
        glassware: 'Coupe Glass',
        garnish: 'Lemon wheel'
      },
      {
        id: 'old_fashioned',
        image: 'https://images.unsplash.com/photo-1536935338788-846bb9981813?q=80&w=800&auto=format&fit=crop',
        name: `${brand.name} Old Fashioned`,
        ingredients: [`2 oz ${brand.name}`, '0.25 oz Simple Syrup', '2 dashes Angostura Bitters'],
        instructions: 'Stir with ice. Strain over large ice cube.',
        glassware: 'Rocks Glass',
        garnish: 'Orange peel'
      },
      {
        id: 'manhattan',
        image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?q=80&w=800&auto=format&fit=crop',
        name: `${brand.name} Manhattan`,
        ingredients: [`2 oz ${brand.name}`, '1 oz Sweet Vermouth', '2 dashes Angostura Bitters'],
        instructions: 'Stir with ice. Strain into coupe glass.',
        glassware: 'Coupe Glass',
        garnish: 'Cherry'
      }
    ],
    'Gin': [
      {
        id: 'gin_tonic',
        image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c76ac?q=80&w=800&auto=format&fit=crop',
        name: `${brand.name} & Tonic`,
        ingredients: [`2 oz ${brand.name}`, '4 oz Tonic Water', 'Lime Wedge'],
        instructions: 'Build over ice. Stir gently. Garnish with lime.',
        glassware: 'Highball Glass',
        garnish: 'Lime wedge'
      },
      {
        id: 'negroni',
        image: 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?q=80&w=800&auto=format&fit=crop',
        name: `${brand.name} Negroni`,
        ingredients: [`1 oz ${brand.name}`, '1 oz Campari', '1 oz Sweet Vermouth'],
        instructions: 'Stir with ice. Strain over ice cube.',
        glassware: 'Rocks Glass',
        garnish: 'Orange peel'
      },
      {
        id: 'martini',
        image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?q=80&w=800&auto=format&fit=crop',
        name: `${brand.name} Martini`,
        ingredients: [`2.5 oz ${brand.name}`, '0.5 oz Dry Vermouth', 'Olive or Lemon Twist'],
        instructions: 'Stir with ice. Strain into martini glass.',
        glassware: 'Martini Glass',
        garnish: 'Olive or lemon twist'
      }
    ],
    'Vodka': [
      {
        id: 'moscow_mule',
        image: 'https://images.unsplash.com/photo-1536935338788-846bb9981813?q=80&w=800&auto=format&fit=crop',
        name: `${brand.name} Mule`,
        ingredients: [`2 oz ${brand.name}`, '0.5 oz Lime Juice', '4 oz Ginger Beer'],
        instructions: 'Build over ice. Stir gently.',
        glassware: 'Copper Mug',
        garnish: 'Lime wedge & mint'
      },
      {
        id: 'cosmopolitan',
        image: 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?q=80&w=800&auto=format&fit=crop',
        name: `${brand.name} Cosmopolitan`,
        ingredients: [`1.5 oz ${brand.name}`, '1 oz Cranberry Juice', '0.5 oz Lime Juice', '0.5 oz Triple Sec'],
        instructions: 'Shake with ice. Double strain into martini glass.',
        glassware: 'Martini Glass',
        garnish: 'Lime wheel'
      }
    ],
    'Tequila': [
      {
        id: 'margarita',
        image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?q=80&w=800&auto=format&fit=crop',
        name: `${brand.name} Margarita`,
        ingredients: [`2 oz ${brand.name}`, '1 oz Lime Juice', '1 oz Triple Sec', 'Salt for rim'],
        instructions: 'Shake with ice. Strain into salt-rimmed glass.',
        glassware: 'Margarita Glass',
        garnish: 'Lime wheel'
      },
      {
        id: 'paloma',
        image: 'https://images.unsplash.com/photo-1536935338788-846bb9981813?q=80&w=800&auto=format&fit=crop',
        name: `${brand.name} Paloma`,
        ingredients: [`2 oz ${brand.name}`, '0.5 oz Lime Juice', '4 oz Grapefruit Soda', 'Salt for rim'],
        instructions: 'Build over ice in salt-rimmed glass.',
        glassware: 'Highball Glass',
        garnish: 'Grapefruit wedge'
      }
    ],
    'Rum': [] // Already handled by mixmindRumGold
  };

  return {
    id: brand.id,
    name: brand.name,
    hero: {
      image: brand.hero.image,
      title: brand.hero.tagline || `Crafting exceptional ${brand.category.toLowerCase()}`,
      xpMessage: '+150 XP'
    },
    products: [
      {
        id: 'signature',
        image: brand.hero.image,
        name: `${brand.name} Signature`,
        blurb: `Our flagship ${brand.quickInfo.style.toLowerCase()} with exceptional character.`
      },
      {
        id: 'reserve',
        image: brand.hero.image,
        name: `${brand.name} Reserve`,
        blurb: `Limited batch reserve with premium aging process.`
      },
      {
        id: 'classic',
        image: brand.hero.image,
        name: `${brand.name} Classic`,
        blurb: `Traditional expression perfect for cocktails and sipping.`
      }
    ],
    recipes: categoryRecipes[brand.category]?.slice(0, 5) || [
      {
        id: 'signature_cocktail',
        image: brand.hero.image,
        name: `Signature ${brand.name} Cocktail`,
        ingredients: [`2 oz ${brand.name}`, 'Premium mixers', 'Fresh garnish'],
        instructions: 'Crafted to perfection by our expert bartenders.',
        glassware: 'Premium Glassware',
        garnish: 'Fresh garnish'
      }
    ],
    challenge: {
      image: brand.hero.image,
      title: `Master the Art of ${brand.category}`,
      copy: `Submit your best cocktail recipe using ${brand.name} for a chance to win exclusive prizes and recognition.`,
      cta: 'Submit Recipe'
    },
    events: brand.events?.slice(0, 4) || [
      {
        id: `${brand.id}_tasting_event`,
        title: `${brand.name} Master Class`,
        city: 'New York, NY',
        dateISO: '2025-07-20'
      },
      {
        id: `${brand.id}_cocktail_workshop`,
        title: `${brand.category} Cocktail Workshop`,
        city: 'Los Angeles, CA',
        dateISO: '2025-08-15'
      }
    ],
    ambassadors: [
      {
        id: `${brand.id}_master_distiller`,
        name: `${brand.name.split(' ')[0]} Master`,
        role: 'Master Distiller',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=240&h=240&auto=format&fit=crop'
      },
      {
        id: `${brand.id}_brand_ambassador`,
        name: `${brand.name} Ambassador`,
        role: 'Brand Ambassador',
        avatar: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?q=80&w=240&h=240&auto=format&fit=crop'
      }
    ],
    learning: {
      id: `${brand.category.toLowerCase()}_101`,
      title: `${brand.category} Origin 101`,
      icon: 'book'
    },
    rewards: [
      {
        id: 'premium_glass',
        image: 'https://images.unsplash.com/photo-1544280978-b5d5be0ad9a3?q=80&w=1200&auto=format&fit=crop',
        name: `${brand.name} Premium Glass`,
        xp: 500
      },
      {
        id: `${brand.id}_tasting_kit`,
        image: 'https://images.unsplash.com/photo-1560785496-3c9d27877182?q=80&w=1200&auto=format&fit=crop',
        name: `${brand.name} Tasting Kit`,
        xp: 300
      },
      {
        id: `${brand.id}_collectors_bottle`,
        image: 'https://images.unsplash.com/photo-1569529465841-dfecdab7503b?q=80&w=1200&auto=format&fit=crop',
        name: `${brand.name} Collector's Bottle`,
        xp: 800
      }
    ],
    social: [
      {
        id: `${brand.id}_social_1`,
        image: brand.hero.image,
        handle: '@spiritlover',
        caption: `Amazing ${brand.name} cocktail experience!`
      },
      {
        id: `${brand.id}_social_2`,
        image: brand.hero.image,
        handle: '@bartender_pro',
        caption: `Perfect pour of ${brand.name} tonight`
      },
      {
        id: 'social_3',
        image: brand.hero.image,
        handle: '@cocktail_enthusiast',
        caption: `${brand.name} never disappoints 🥃`
      },
      {
        id: 'social_4',
        image: brand.hero.image,
        handle: '@mixology_expert',
        caption: `Crafting perfection with ${brand.name}`
      },
      {
        id: 'social_5',
        image: brand.hero.image,
        handle: '@spirit_connoisseur',
        caption: `${brand.name} is my go-to choice`
      }
    ],
    brandVideos: [
      {
        id: `${brand.id}_brand_story`,
        title: `The ${brand.name} Story`,
        description: `Discover the heritage and craftsmanship behind ${brand.name}`,
        thumbnail: brand.hero.image,
        duration: '4:30',
        xpReward: 50,
        watched: false
      },
      {
        id: `${brand.id}_master_distiller`,
        title: 'Meet the Master Distiller',
        description: `Learn from the expert behind ${brand.name}'s unique flavor profile`,
        thumbnail: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1200&auto=format&fit=crop',
        duration: '5:15',
        xpReward: 75,
        watched: false
      },
      {
        id: `${brand.id}_cocktail_masterclass`,
        title: 'Perfect Cocktails',
        description: `Master the art of crafting cocktails with ${brand.name}`,
        thumbnail: 'https://images.unsplash.com/photo-1541976076758-347942db1970?q=80&w=1200&auto=format&fit=crop',
        duration: '3:45',
        xpReward: 60,
        watched: false
      }
    ]
  };
}

// Spirit content database - map spirit IDs to their full Gold tier content
const spiritContentDatabase: Record<string, SpiritContent> = {
  'highland_crown': highlandCrownGold,
  'botanical_crown': botanicalCrownGold,
  'crystal_peak': crystalPeakGold,
  'agave_real': agaveRealGold,
  'mixmind_rum': mixmindRumGold,
};

export function getSpirit(spiritId: string): SpiritContent | null {
  // First check if we have custom content
  if (spiritContentDatabase[spiritId]) {
    return spiritContentDatabase[spiritId];
  }
  
  // Otherwise, generate content from brand data
  const brand = getBrandById(spiritId);
  if (brand && brand.tier === 'gold') {
    return createSpiritContentFromBrand(brand);
  }
  
  return null;
}