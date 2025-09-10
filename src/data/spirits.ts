import type { SpiritContent } from '../types/spirit';
import { getBrandById } from './brands/index';

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
      category: 'food',
      description: 'Rich 70% dark chocolate complements the rum\'s complex vanilla and caramel notes',
      image: 'https://images.unsplash.com/photo-1559664663-e0ec7e7a2c73?q=80&w=1200&auto=format&fit=crop',
      rating: 5
    },
    {
      id: 'p2',
      name: 'Cuban Cigars',
      category: 'cigar',
      description: 'Premium hand-rolled cigars with earthy tobacco flavors that harmonize with aged rum',
      image: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?q=80&w=1200&auto=format&fit=crop',
      rating: 4
    },
    {
      id: 'p3',
      name: 'Grilled Caribbean Jerk Chicken',
      category: 'food',
      description: 'Spicy island flavors enhanced by the rum\'s smooth finish and tropical undertones',
      image: 'https://images.unsplash.com/photo-1532636721123-4d7df8c31cce?q=80&w=1200&auto=format&fit=crop',
      rating: 4
    },
    {
      id: 'p4',
      name: 'Sunset Beach Relaxation',
      category: 'occasion',
      description: 'Perfect for unwinding during golden hour with ocean views and gentle sea breeze',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1200&auto=format&fit=crop',
      rating: 5
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
  'mixmind_rum': mixmindRumGold,
  // Add more Gold tier spirits here as needed
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