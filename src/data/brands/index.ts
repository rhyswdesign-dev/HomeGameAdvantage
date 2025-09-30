import { FEATURED_SPIRIT_IMAGES, SPIRIT_IMAGES } from '../barImages';

type BarTier = 'bronze' | 'silver' | 'gold';

export type SpiritBrand = {
  id: string;
  name: string;
  category: string;
  tier: BarTier;
  hero: {
    image: string;
    location?: string;
    tagline?: string;
  };
  quickInfo: {
    origin: string;
    age?: string;
    alcohol: string;
    style: string;
    distillery: string;
  };
  signatureCocktails: Array<{
    image: string;
    name: string;
    ingredients: string;
    description: string;
  }>;
  tastingNotes: {
    nose: string;
    palate: string;
    finish: string;
  };
  awards: string[];
  story: {
    short: string;
    long: string;
  };
  events?: Array<{
    title: string;
    date: string;
    location: string;
    description: string;
  }>;
};

// WHISKEY BRANDS (1 Gold, 2 Silver, 2 Bronze)
const whiskeyBrands: SpiritBrand[] = [
  {
    id: 'highland_crown',
    name: 'Highland Crown',
    category: 'Whiskey',
    tier: 'gold',
    hero: {
      image: FEATURED_SPIRIT_IMAGES.whiskey,
      tagline: 'Scottish Heritage, Modern Excellence'
    },
    quickInfo: {
      origin: 'Speyside, Scotland',
      age: '18 Years',
      alcohol: '43% ABV',
      style: 'Single Malt Scotch',
      distillery: 'Highland Crown Distillery'
    },
    signatureCocktails: [
      {
        image: 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?q=80&w=800&auto=format&fit=crop',
        name: 'Royal Highland',
        ingredients: 'Highland Crown, Honey, Lemon, Thyme',
        description: 'A sophisticated cocktail that honors the whiskey\'s noble character'
      },
      {
        image: 'https://images.unsplash.com/photo-1536935338788-846bb9981813?q=80&w=800&auto=format&fit=crop',
        name: 'Crown Old Fashioned',
        ingredients: 'Highland Crown, Demerara Sugar, Orange Bitters',
        description: 'Classic preparation showcasing the whiskey\'s complexity'
      }
    ],
    tastingNotes: {
      nose: 'Rich honeyed sweetness with hints of dried fruits, vanilla, and subtle smoke',
      palate: 'Full-bodied with layers of caramel, dark chocolate, and warm spices',
      finish: 'Long and warming with lingering notes of oak and gentle peat'
    },
    awards: [
      'Double Gold - San Francisco World Spirits Competition 2024',
      'Best Scotch Whisky - International Wine & Spirit Competition 2023',
      '95 Points - Whisky Magazine'
    ],
    story: {
      short: 'Crafted in the heart of Speyside, Highland Crown represents 200 years of Scottish whiskey-making tradition, where master distillers create liquid gold from the finest Scottish barley.',
      long: 'Founded in 1824 by master distiller Hamish MacLeod, Highland Crown has been perfecting the art of Scotch whisky for six generations. Nestled in the pristine Speyside region, our distillery combines time-honored traditions with modern innovation. Each bottle is aged in carefully selected oak casks, developing the complex character that has made Highland Crown a favorite among connoisseurs worldwide. Our commitment to excellence extends beyond the liquid itself - from sustainable farming practices to supporting local communities, Highland Crown embodies the true spirit of Scotland.'
    },
    events: [
      {
        title: 'Master Distiller Tasting',
        date: 'October 15, 2024',
        location: 'Toronto',
        description: 'Join our master distiller for an exclusive tasting of rare Highland Crown expressions'
      }
    ]
  },
  {
    id: 'copper_valley',
    name: 'Copper Valley',
    category: 'Whiskey',
    tier: 'silver',
    hero: {
      image: SPIRIT_IMAGES.whiskey,
      tagline: 'American Craft Excellence'
    },
    quickInfo: {
      origin: 'Kentucky, USA',
      age: '12 Years',
      alcohol: '45% ABV',
      style: 'Straight Bourbon',
      distillery: 'Copper Valley Distillery'
    },
    signatureCocktails: [
      {
        image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?q=80&w=800&auto=format&fit=crop',
        name: 'Valley Manhattan',
        ingredients: 'Copper Valley, Sweet Vermouth, Cherry Bitters',
        description: 'A refined take on the classic Manhattan'
      }
    ],
    tastingNotes: {
      nose: 'Sweet corn, vanilla, and hints of cinnamon',
      palate: 'Rich caramel with notes of toasted oak and dark fruits',
      finish: 'Medium length with warm spice and leather'
    },
    awards: ['Gold Medal - American Whiskey Competition 2023'],
    story: {
      short: 'Born from Kentucky\'s rich bourbon heritage, Copper Valley embodies American craftsmanship with every small-batch expression.',
      long: 'Established in 1995, Copper Valley Distillery sits in the heart of Kentucky\'s bourbon country. Our master distiller, Sarah Chen, brings both tradition and innovation to every batch, using locally sourced grains and limestone-filtered water.'
    }
  },
  {
    id: 'mountain_reserve',
    name: 'Mountain Reserve',
    category: 'Whiskey',
    tier: 'silver',
    hero: {
      image: SPIRIT_IMAGES.whiskey,
      tagline: 'Canadian Wilderness in a Bottle'
    },
    quickInfo: {
      origin: 'Alberta, Canada',
      age: '10 Years',
      alcohol: '40% ABV',
      style: 'Canadian Rye',
      distillery: 'Mountain Reserve Distillery'
    },
    signatureCocktails: [
      {
        image: 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?q=80&w=800&auto=format&fit=crop',
        name: 'Northern Lights',
        ingredients: 'Mountain Reserve, Maple Syrup, Lemon, Rosemary',
        description: 'A uniquely Canadian cocktail celebrating our northern heritage'
      }
    ],
    tastingNotes: {
      nose: 'Fresh rye spice with hints of pine and honey',
      palate: 'Smooth with notes of vanilla, pepper, and dried herbs',
      finish: 'Clean and crisp with lingering spice'
    },
    awards: ['Silver Medal - Canadian Whisky Awards 2023'],
    story: {
      short: 'Distilled in the pristine Canadian Rockies, Mountain Reserve captures the essence of Canadian wilderness.',
      long: 'Our distillery sits at 4,000 feet elevation in the heart of the Canadian Rockies, where pure mountain water and extreme temperature variations create the perfect conditions for aging whisky.'
    }
  },
  {
    id: 'prairie_gold',
    name: 'Prairie Gold',
    category: 'Whiskey',
    tier: 'bronze',
    hero: {
      image: SPIRIT_IMAGES.whiskey,
      tagline: 'Honest Whiskey from the Heartland'
    },
    quickInfo: {
      origin: 'Nebraska, USA',
      age: '6 Years',
      alcohol: '40% ABV',
      style: 'Wheat Whiskey',
      distillery: 'Prairie Gold Distillery'
    },
    signatureCocktails: [
      {
        image: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?q=80&w=800&auto=format&fit=crop',
        name: 'Golden Harvest',
        ingredients: 'Prairie Gold, Apple Cider, Cinnamon',
        description: 'A warm, comforting cocktail perfect for any season'
      }
    ],
    tastingNotes: {
      nose: 'Sweet wheat with hints of vanilla and grass',
      palate: 'Soft and approachable with notes of honey and grain',
      finish: 'Short and pleasant with subtle warmth'
    },
    awards: ['Bronze Medal - Great American Distillers Festival 2023'],
    story: {
      short: 'From the endless prairies of Nebraska comes an honest, approachable whiskey that celebrates American grain.',
      long: 'Prairie Gold represents the hardworking spirit of America\'s heartland, where generations of farmers have cultivated the finest grains under endless skies.'
    }
  },
  {
    id: 'riverside_straight',
    name: 'Riverside Straight',
    category: 'Whiskey',
    tier: 'bronze',
    hero: {
      image: SPIRIT_IMAGES.whiskey,
      tagline: 'Small Town Spirit, Big Flavor'
    },
    quickInfo: {
      origin: 'Tennessee, USA',
      age: '4 Years',
      alcohol: '40% ABV',
      style: 'Tennessee Whiskey',
      distillery: 'Riverside Distillery'
    },
    signatureCocktails: [
      {
        image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c76ac?q=80&w=800&auto=format&fit=crop',
        name: 'River Rocks',
        ingredients: 'Riverside Straight, Ginger Beer, Lime',
        description: 'A refreshing highball that flows as smooth as the river'
      }
    ],
    tastingNotes: {
      nose: 'Light corn sweetness with hints of charcoal',
      palate: 'Smooth with notes of caramel and vanilla',
      finish: 'Clean and straightforward with gentle warmth'
    },
    awards: ['People\'s Choice - Tennessee Whiskey Festival 2023'],
    story: {
      short: 'Crafted beside the rolling hills of Tennessee, Riverside Straight embodies small-town values and big-hearted hospitality.',
      long: 'Founded by a family of Tennessee natives, Riverside Distillery has been serving the community for over 50 years, creating honest whiskey for honest people.'
    }
  }
];

// GIN BRANDS (1 Gold, 2 Silver, 2 Bronze)
const ginBrands: SpiritBrand[] = [
  {
    id: 'botanical_crown',
    name: 'Botanical Crown',
    category: 'Gin',
    tier: 'gold',
    hero: {
      image: FEATURED_SPIRIT_IMAGES.gin,
      tagline: 'Where Tradition Meets Innovation'
    },
    quickInfo: {
      origin: 'London, England',
      alcohol: '47% ABV',
      style: 'London Dry Gin',
      distillery: 'Botanical Crown Distillery'
    },
    signatureCocktails: [
      {
        image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?q=80&w=800&auto=format&fit=crop',
        name: 'Royal Garden',
        ingredients: 'Botanical Crown, Elderflower, Cucumber, Tonic',
        description: 'An elegant cocktail showcasing the gin\'s botanical complexity'
      },
      {
        image: 'https://images.unsplash.com/photo-1536935338788-846bb9981813?q=80&w=800&auto=format&fit=crop',
        name: 'Crown Martini',
        ingredients: 'Botanical Crown, Dry Vermouth, Lemon Twist',
        description: 'The perfect martini highlighting the gin\'s pristine character'
      }
    ],
    tastingNotes: {
      nose: 'Juniper-forward with lavender, citrus, and subtle spice',
      palate: 'Complex botanical blend with angelica root and orris',
      finish: 'Long and elegant with lingering juniper and herbs'
    },
    awards: [
      'World\'s Best Gin - World Gin Awards 2024',
      'Double Gold - San Francisco World Spirits Competition',
      '98 Points - Gin Magazine'
    ],
    story: {
      short: 'Distilled in the heart of London using 12 carefully selected botanicals, Botanical Crown represents the pinnacle of English gin-making artistry.',
      long: 'Founded in 1887 by master distiller Edmund Hartwell, Botanical Crown has been perfecting the art of gin distillation for over a century. Our unique vapor-infusion process and carefully guarded botanical recipe create a gin of unparalleled complexity and refinement. Each batch is distilled in traditional copper pot stills and bottled at the optimal strength to showcase the intricate balance of our 12 botanicals, sourced from the finest suppliers around the world.'
    }
  },
  {
    id: 'coastal_breeze',
    name: 'Coastal Breeze',
    category: 'Gin',
    tier: 'silver',
    hero: {
      image: SPIRIT_IMAGES.gin,
      tagline: 'Ocean-Inspired Botanical Gin'
    },
    quickInfo: {
      origin: 'Cornwall, England',
      alcohol: '42% ABV',
      style: 'Contemporary Gin',
      distillery: 'Coastal Spirits Co.'
    },
    signatureCocktails: [
      {
        image: 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?q=80&w=800&auto=format&fit=crop',
        name: 'Sea Spray',
        ingredients: 'Coastal Breeze, Lime, Sea Salt, Tonic',
        description: 'A refreshing cocktail that captures the essence of the ocean'
      }
    ],
    tastingNotes: {
      nose: 'Fresh sea air with notes of samphire and citrus',
      palate: 'Clean and crisp with coastal botanicals',
      finish: 'Refreshing with a hint of sea salt'
    },
    awards: ['Silver Medal - International Wine & Spirit Competition 2023'],
    story: {
      short: 'Inspired by Cornwall\'s dramatic coastline, this gin captures the essence of the sea with unique coastal botanicals.',
      long: 'Distilled just miles from the Cornish coast, Coastal Breeze incorporates foraged seaweed and samphire alongside traditional botanicals.'
    }
  },
  {
    id: 'forest_grove',
    name: 'Forest Grove',
    category: 'Gin',
    tier: 'silver',
    hero: {
      image: SPIRIT_IMAGES.gin,
      tagline: 'Wild Botanicals from Ancient Forests'
    },
    quickInfo: {
      origin: 'Black Forest, Germany',
      alcohol: '44% ABV',
      style: 'Forest Gin',
      distillery: 'Forest Grove Distillery'
    },
    signatureCocktails: [
      {
        image: 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?q=80&w=800&auto=format&fit=crop',
        name: 'Woodland Negroni',
        ingredients: 'Forest Grove, Campari, Sweet Vermouth',
        description: 'An earthy twist on the classic Negroni'
      }
    ],
    tastingNotes: {
      nose: 'Pine, fir needles, and wild herbs',
      palate: 'Earthy and complex with forest botanicals',
      finish: 'Woodsy with lingering herbaceous notes'
    },
    awards: ['Gold Medal - German Spirits Awards 2023'],
    story: {
      short: 'Crafted using botanicals foraged from the mystical Black Forest, this gin embodies the wild spirit of ancient woodlands.',
      long: 'Deep in Germany\'s Black Forest, our distillery works with local foragers to sustainably harvest wild botanicals that have grown in these ancient woods for centuries.'
    }
  },
  {
    id: 'urban_roots',
    name: 'Urban Roots',
    category: 'Gin',
    tier: 'bronze',
    hero: {
      image: SPIRIT_IMAGES.gin,
      tagline: 'City-Inspired Modern Gin'
    },
    quickInfo: {
      origin: 'Brooklyn, NYC',
      alcohol: '40% ABV',
      style: 'American Gin',
      distillery: 'Urban Spirits Distillery'
    },
    signatureCocktails: [
      {
        image: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?q=80&w=800&auto=format&fit=crop',
        name: 'Brooklyn Bridge',
        ingredients: 'Urban Roots, Aperol, Lemon, Simple Syrup',
        description: 'A modern cocktail celebrating urban creativity'
      }
    ],
    tastingNotes: {
      nose: 'Contemporary with citrus and subtle juniper',
      palate: 'Smooth and approachable with modern botanicals',
      finish: 'Clean with a hint of spice'
    },
    awards: ['Bronze Medal - American Distilling Institute 2023'],
    story: {
      short: 'Born in Brooklyn\'s vibrant distilling scene, Urban Roots celebrates the creativity and diversity of modern American gin.',
      long: 'Created by a collective of Brooklyn artists and distillers, Urban Roots represents the innovative spirit of America\'s urban craft distilling movement.'
    }
  },
  {
    id: 'classic_london',
    name: 'Classic London',
    category: 'Gin',
    tier: 'bronze',
    hero: {
      image: 'https://images.unsplash.com/photo-1572116469696-31de0f17cc34?q=80&w=1200&auto=format&fit=crop',
      tagline: 'Traditional London Dry Excellence'
    },
    quickInfo: {
      origin: 'London, England',
      alcohol: '40% ABV',
      style: 'London Dry Gin',
      distillery: 'Classic London Distillery'
    },
    signatureCocktails: [
      {
        image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c76ac?q=80&w=800&auto=format&fit=crop',
        name: 'Perfect G&T',
        ingredients: 'Classic London, Premium Tonic, Lime',
        description: 'The quintessential gin and tonic'
      }
    ],
    tastingNotes: {
      nose: 'Classic juniper with citrus and spice',
      palate: 'Traditional London dry character',
      finish: 'Clean and straightforward'
    },
    awards: ['Best Value Gin - London Gin Festival 2023'],
    story: {
      short: 'A traditional London dry gin that honors the classic recipes and methods of England\'s gin heritage.',
      long: 'Classic London maintains the time-honored traditions of London dry gin making, using only the finest traditional botanicals in perfect balance.'
    }
  }
];

// VODKA BRANDS (1 Gold, 2 Silver, 2 Bronze)
const vodkaBrands: SpiritBrand[] = [
  {
    id: 'crystal_peak',
    name: 'Crystal Peak',
    category: 'Vodka',
    tier: 'gold',
    hero: {
      image: FEATURED_SPIRIT_IMAGES.vodka,
      tagline: 'Purity Perfected'
    },
    quickInfo: {
      origin: 'Siberia, Russia',
      alcohol: '40% ABV',
      style: 'Premium Vodka',
      distillery: 'Crystal Peak Distillery'
    },
    signatureCocktails: [
      {
        image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?q=80&w=800&auto=format&fit=crop',
        name: 'Crystal Martini',
        ingredients: 'Crystal Peak, Dry Vermouth, Olive',
        description: 'The ultimate expression of vodka purity'
      },
      {
        image: 'https://images.unsplash.com/photo-1536935338788-846bb9981813?q=80&w=800&auto=format&fit=crop',
        name: 'Siberian Mule',
        ingredients: 'Crystal Peak, Ginger Beer, Lime, Mint',
        description: 'A refreshing twist on the classic Moscow Mule'
      }
    ],
    tastingNotes: {
      nose: 'Clean and neutral with subtle grain notes',
      palate: 'Exceptionally smooth with perfect balance',
      finish: 'Pure and clean with no burn'
    },
    awards: [
      'World\'s Best Vodka - World Vodka Awards 2024',
      'Double Gold - San Francisco World Spirits Competition',
      '99 Points - Vodka Magazine'
    ],
    story: {
      short: 'Distilled from pristine Siberian wheat and filtered through layers of silver birch charcoal, Crystal Peak achieves the ultimate expression of vodka purity.',
      long: 'In the heart of Siberia, where temperatures drop to -40°C, Crystal Peak Distillery has perfected the art of vodka making over five generations. Our proprietary 7-stage distillation process and unique silver birch charcoal filtration create a vodka of unmatched purity and smoothness. Each batch is crafted from the finest Siberian winter wheat and pure glacier water, resulting in a spirit so pure it won the hearts of vodka connoisseurs worldwide.'
    }
  },
  {
    id: 'northern_lights',
    name: 'Northern Lights',
    category: 'Vodka',
    tier: 'silver',
    hero: {
      image: SPIRIT_IMAGES.whiskey,
      tagline: 'Scandinavian Purity'
    },
    quickInfo: {
      origin: 'Sweden',
      alcohol: '40% ABV',
      style: 'Premium Vodka',
      distillery: 'Northern Lights Distillery'
    },
    signatureCocktails: [
      {
        image: 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?q=80&w=800&auto=format&fit=crop',
        name: 'Aurora Borealis',
        ingredients: 'Northern Lights, Blue Curaçao, Lime',
        description: 'A stunning cocktail that captures the beauty of the northern lights'
      }
    ],
    tastingNotes: {
      nose: 'Clean with hints of grain and juniper',
      palate: 'Smooth and creamy with subtle sweetness',
      finish: 'Long and clean with gentle warmth'
    },
    awards: ['Gold Medal - Swedish Spirits Competition 2023'],
    story: {
      short: 'Crafted in Sweden using organic wheat and pristine Arctic water, Northern Lights embodies Scandinavian purity and craftsmanship.',
      long: 'High above the Arctic Circle, where the northern lights dance across pristine skies, our distillery creates vodka using water from ancient underground springs.'
    }
  },
  {
    id: 'prairie_pure',
    name: 'Prairie Pure',
    category: 'Vodka',
    tier: 'silver',
    hero: {
      image: SPIRIT_IMAGES.whiskey,
      tagline: 'American Grain Excellence'
    },
    quickInfo: {
      origin: 'North Dakota, USA',
      alcohol: '40% ABV',
      style: 'Grain Vodka',
      distillery: 'Prairie Pure Distillery'
    },
    signatureCocktails: [
      {
        image: 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?q=80&w=800&auto=format&fit=crop',
        name: 'Prairie Storm',
        ingredients: 'Prairie Pure, Cranberry, Lime, Club Soda',
        description: 'A refreshing cocktail inspired by prairie thunderstorms'
      }
    ],
    tastingNotes: {
      nose: 'Soft grain with subtle vanilla',
      palate: 'Smooth with notes of wheat and honey',
      finish: 'Clean with gentle warmth'
    },
    awards: ['Silver Medal - American Distilling Institute 2023'],
    story: {
      short: 'Distilled from premium North Dakota wheat in the heart of America\'s grain belt, Prairie Pure celebrates agricultural excellence.',
      long: 'Our distillery sits in the middle of North Dakota\'s golden wheat fields, where four generations of farmers have perfected the art of growing premium grain.'
    }
  },
  {
    id: 'metro_smooth',
    name: 'Metro Smooth',
    category: 'Vodka',
    tier: 'bronze',
    hero: {
      image: SPIRIT_IMAGES.gin,
      tagline: 'Urban Style, Smooth Taste'
    },
    quickInfo: {
      origin: 'Chicago, USA',
      alcohol: '40% ABV',
      style: 'American Vodka',
      distillery: 'Metro Distillery'
    },
    signatureCocktails: [
      {
        image: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?q=80&w=800&auto=format&fit=crop',
        name: 'Chicago Fizz',
        ingredients: 'Metro Smooth, Lemon, Simple Syrup, Club Soda',
        description: 'A crisp cocktail perfect for city living'
      }
    ],
    tastingNotes: {
      nose: 'Clean and neutral with subtle grain',
      palate: 'Smooth and approachable',
      finish: 'Short and clean'
    },
    awards: ['People\'s Choice - Chicago Spirits Festival 2023'],
    story: {
      short: 'Born in Chicago\'s craft distilling renaissance, Metro Smooth delivers quality and smoothness for the modern urban lifestyle.',
      long: 'Created in the heart of Chicago by a team of urban craft distillers who understand the need for quality spirits in the fast-paced city environment.'
    }
  },
  {
    id: 'glacier_waters',
    name: 'Glacier Waters',
    category: 'Vodka',
    tier: 'bronze',
    hero: {
      image: SPIRIT_IMAGES.whiskey,
      tagline: 'Pure Mountain Water Vodka'
    },
    quickInfo: {
      origin: 'Alaska, USA',
      alcohol: '40% ABV',
      style: 'Glacier Water Vodka',
      distillery: 'Glacier Waters Distillery'
    },
    signatureCocktails: [
      {
        image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c76ac?q=80&w=800&auto=format&fit=crop',
        name: 'Arctic Breeze',
        ingredients: 'Glacier Waters, Peppermint, Lime, Soda',
        description: 'A cooling cocktail that embodies the Alaskan wilderness'
      }
    ],
    tastingNotes: {
      nose: 'Pure and clean with mineral notes',
      palate: 'Crisp with subtle mineral character',
      finish: 'Clean and refreshing'
    },
    awards: ['Bronze Medal - Alaska Spirits Competition 2023'],
    story: {
      short: 'Distilled using pure glacier water from Alaska\'s pristine wilderness, delivering the essence of untouched nature.',
      long: 'High in Alaska\'s untouched wilderness, we harvest pure glacier water that has been naturally filtered through rock and ice for thousands of years.'
    }
  }
];

// TEQUILA BRANDS (1 Gold, 2 Silver, 2 Bronze)
const tequilaBrands: SpiritBrand[] = [
  {
    id: 'agave_real',
    name: 'Agave Real',
    category: 'Tequila',
    tier: 'gold',
    hero: {
      image: FEATURED_SPIRIT_IMAGES.tequila,
      tagline: 'The Soul of Jalisco'
    },
    quickInfo: {
      origin: 'Jalisco, Mexico',
      age: 'Añejo (2 Years)',
      alcohol: '40% ABV',
      style: '100% Blue Agave',
      distillery: 'Destilería Agave Real'
    },
    signatureCocktails: [
      {
        image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?q=80&w=800&auto=format&fit=crop',
        name: 'Real Margarita',
        ingredients: 'Agave Real, Fresh Lime, Agave Nectar',
        description: 'The authentic margarita showcasing pure agave flavor'
      },
      {
        image: 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?q=80&w=800&auto=format&fit=crop',
        name: 'Jalisco Sunset',
        ingredients: 'Agave Real, Orange Liqueur, Lime, Tajín',
        description: 'A sophisticated cocktail honoring Mexican traditions'
      }
    ],
    tastingNotes: {
      nose: 'Rich cooked agave with vanilla, caramel, and oak',
      palate: 'Full-bodied with complex agave sweetness and spice',
      finish: 'Long and warm with notes of chocolate and pepper'
    },
    awards: [
      'Best Tequila Añejo - World Tequila Awards 2024',
      'Double Gold - San Francisco World Spirits Competition',
      '96 Points - Tequila Aficionado Magazine'
    ],
    story: {
      short: 'Crafted from 100% blue Weber agave in the heart of Jalisco, Agave Real represents five generations of Mexican tequila-making mastery.',
      long: 'In the red clay soil of Jalisco\'s highlands, where blue agave plants mature under the intense Mexican sun for 7-10 years, the Herrera family has been crafting exceptional tequila since 1897. Agave Real is made exclusively from estate-grown blue Weber agave, cooked in traditional stone ovens, fermented with natural yeasts, and aged in American oak barrels. Every bottle represents our unwavering commitment to preserving the authentic traditions of Mexican tequila making while creating liquid art worthy of the finest occasions.'
    }
  },
  {
    id: 'sierra_blanca',
    name: 'Sierra Blanca',
    category: 'Tequila',
    tier: 'silver',
    hero: {
      image: 'https://images.unsplash.com/photo-1582543706739-8e8c8e2bc69e?q=80&w=1200&auto=format&fit=crop',
      tagline: 'Highland Heritage Tequila'
    },
    quickInfo: {
      origin: 'Los Altos, Jalisco',
      age: 'Reposado (8 Months)',
      alcohol: '40% ABV',
      style: '100% Blue Agave',
      distillery: 'Sierra Blanca Distillery'
    },
    signatureCocktails: [
      {
        image: 'https://images.unsplash.com/photo-1536935338788-846bb9981813?q=80&w=800&auto=format&fit=crop',
        name: 'Highland Paloma',
        ingredients: 'Sierra Blanca, Grapefruit, Lime, Soda',
        description: 'A refreshing cocktail celebrating highland agave'
      }
    ],
    tastingNotes: {
      nose: 'Bright agave with citrus and vanilla',
      palate: 'Smooth with notes of cooked agave and oak',
      finish: 'Medium length with gentle spice'
    },
    awards: ['Gold Medal - Mexican Spirits Awards 2023'],
    story: {
      short: 'From the highland regions of Los Altos, Sierra Blanca captures the essence of elevated agave cultivation.',
      long: 'High in the mountains of Los Altos, where altitude and climate create unique growing conditions, our family has been cultivating blue agave for over 80 years.'
    }
  },
  {
    id: 'desert_rose',
    name: 'Desert Rose',
    category: 'Tequila',
    tier: 'silver',
    hero: {
      image: 'https://images.unsplash.com/photo-1544441892-794166f1e3be?auto=format&fit=crop&w=1200&q=60',
      tagline: 'Artisanal Agave Expression'
    },
    quickInfo: {
      origin: 'Tequila, Jalisco',
      age: 'Blanco (Unaged)',
      alcohol: '42% ABV',
      style: '100% Blue Agave',
      distillery: 'Desert Rose Tequilera'
    },
    signatureCocktails: [
      {
        image: 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?q=80&w=800&auto=format&fit=crop',
        name: 'Desert Bloom',
        ingredients: 'Desert Rose, Prickly Pear, Lime, Salt',
        description: 'A cocktail that captures the beauty of the desert'
      }
    ],
    tastingNotes: {
      nose: 'Pure agave with herbal and mineral notes',
      palate: 'Crisp and clean with bright agave flavor',
      finish: 'Fresh and vibrant with peppery heat'
    },
    awards: ['Silver Medal - Tequila and Mezcal Festival 2023'],
    story: {
      short: 'A small-batch tequila that celebrates the raw beauty and intensity of pure blue agave.',
      long: 'Our small distillery focuses on traditional methods and small batches to create tequila that truly expresses the character of blue Weber agave.'
    }
  },
  {
    id: 'valle_dorado',
    name: 'Valle Dorado',
    category: 'Tequila',
    tier: 'bronze',
    hero: {
      image: 'https://images.unsplash.com/photo-1613743983303-b3e89f8a7b8f?q=80&w=1200&auto=format&fit=crop',
      tagline: 'Golden Valley Traditions'
    },
    quickInfo: {
      origin: 'Amatitán, Jalisco',
      age: 'Blanco (Unaged)',
      alcohol: '40% ABV',
      style: '100% Blue Agave',
      distillery: 'Valle Dorado Distillery'
    },
    signatureCocktails: [
      {
        image: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?q=80&w=800&auto=format&fit=crop',
        name: 'Golden Valley',
        ingredients: 'Valle Dorado, Mango, Lime, Chili Salt',
        description: 'A tropical cocktail with Mexican flair'
      }
    ],
    tastingNotes: {
      nose: 'Fresh agave with citrus notes',
      palate: 'Clean and straightforward with agave sweetness',
      finish: 'Short and crisp with mild heat'
    },
    awards: ['Bronze Medal - Jalisco Tequila Competition 2023'],
    story: {
      short: 'From the golden valleys of Amatitán comes an honest tequila that honors traditional Mexican craftsmanship.',
      long: 'Valle Dorado represents the hardworking spirit of Jalisco\'s tequila farmers, creating authentic tequila using time-honored methods.'
    }
  },
  {
    id: 'pueblo_azul',
    name: 'Pueblo Azul',
    category: 'Tequila',
    tier: 'bronze',
    hero: {
      image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?q=80&w=1200&auto=format&fit=crop',
      tagline: 'Village Spirit Tequila'
    },
    quickInfo: {
      origin: 'Arandas, Jalisco',
      age: 'Blanco (Unaged)',
      alcohol: '40% ABV',
      style: '100% Blue Agave',
      distillery: 'Pueblo Azul Tequilera'
    },
    signatureCocktails: [
      {
        image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c76ac?q=80&w=800&auto=format&fit=crop',
        name: 'Village Square',
        ingredients: 'Pueblo Azul, Pineapple, Jalapeño, Lime',
        description: 'A spicy-sweet cocktail celebrating village life'
      }
    ],
    tastingNotes: {
      nose: 'Bright agave with herbal notes',
      palate: 'Simple and clean with agave character',
      finish: 'Brief with gentle warmth'
    },
    awards: ['People\'s Choice - Arandas Tequila Festival 2023'],
    story: {
      short: 'A village tequila that embodies the community spirit and traditional values of rural Jalisco.',
      long: 'Pueblo Azul is made by and for the people of Arandas, a small village where everyone knows everyone and tequila is a way of life.'
    }
  }
];

// RUM BRANDS (1 Gold, 2 Silver, 2 Bronze)
const rumBrands: SpiritBrand[] = [
  {
    id: 'mixmind_rum',
    name: 'MixMind Rum',
    category: 'Rum',
    tier: 'gold',
    hero: {
      image: FEATURED_SPIRIT_IMAGES.rum,
      tagline: 'Crafting the world\'s finest rum'
    },
    quickInfo: {
      origin: 'Caribbean Islands',
      age: '12 Years',
      alcohol: '43% ABV',
      style: 'Premium Aged Rum',
      distillery: 'MixMind Distillery'
    },
    signatureCocktails: [
      {
        image: SPIRIT_IMAGES.whiskey,
        name: 'MixMind Daiquiri',
        ingredients: 'MixMind Rum, Fresh Lime, Simple Syrup',
        description: 'Classic daiquiri showcasing the rum\'s complexity'
      },
      {
        image: 'https://images.unsplash.com/photo-1541976076758-347942db1970?q=80&w=1200&auto=format&fit=crop',
        name: 'Tropical Piña Colada',
        ingredients: 'MixMind Rum, Coconut Cream, Pineapple, Lime',
        description: 'The ultimate tropical escape cocktail'
      }
    ],
    tastingNotes: {
      nose: 'Rich molasses with notes of vanilla, caramel, and tropical fruits',
      palate: 'Full-bodied with layers of brown sugar, oak, and warm spices',
      finish: 'Long and warming with hints of tobacco and chocolate'
    },
    awards: [
      'World\'s Best Rum - International Rum Festival 2024',
      'Double Gold - San Francisco World Spirits Competition',
      '97 Points - Rum Magazine'
    ],
    story: {
      short: 'Aged for 12 years in Caribbean oak barrels under tropical sun, MixMind Rum represents the pinnacle of Caribbean rum craftsmanship.',
      long: 'In the heart of the Caribbean, where trade winds carry the scent of molasses and oak, MixMind Distillery has been perfecting the art of rum making for over a century. Our master distillers carefully select the finest sugarcane from estate plantations, ferment with proprietary yeasts, and age in hand-selected Caribbean oak barrels. Each bottle represents our commitment to creating liquid poetry that captures the essence of tropical paradise and Caribbean heritage.'
    }
  },
  {
    id: 'caribbean_gold',
    name: 'Caribbean Gold',
    category: 'Rum',
    tier: 'silver',
    hero: {
      image: 'https://images.unsplash.com/photo-1572116469696-31de0f17cc34?q=80&w=1200&auto=format&fit=crop',
      tagline: 'Island Heritage Rum'
    },
    quickInfo: {
      origin: 'Barbados',
      age: '8 Years',
      alcohol: '40% ABV',
      style: 'Golden Rum',
      distillery: 'Caribbean Gold Distillery'
    },
    signatureCocktails: [
      {
        image: 'https://images.unsplash.com/photo-1527161153336-95b168e1acb0?q=80&w=1200&auto=format&fit=crop',
        name: 'Golden Sunset',
        ingredients: 'Caribbean Gold, Orange, Grenadine, Pineapple',
        description: 'A vibrant cocktail celebrating Caribbean sunsets'
      }
    ],
    tastingNotes: {
      nose: 'Sweet molasses with hints of banana and coconut',
      palate: 'Smooth with tropical fruit and gentle oak',
      finish: 'Medium length with warm spice notes'
    },
    awards: ['Gold Medal - Caribbean Rum Awards 2023'],
    story: {
      short: 'Distilled in Barbados using traditional methods, Caribbean Gold embodies the warm spirit of island life.',
      long: 'From the pristine beaches of Barbados comes a rum that captures the essence of Caribbean culture and tradition.'
    }
  },
  {
    id: 'spiced_islands',
    name: 'Spiced Islands',
    category: 'Rum',
    tier: 'silver',
    hero: {
      image: 'https://images.unsplash.com/photo-1560785496-3c9d27877182?q=80&w=1200&auto=format&fit=crop',
      tagline: 'Exotic Spice Blend Rum'
    },
    quickInfo: {
      origin: 'Jamaica',
      age: '5 Years',
      alcohol: '42% ABV',
      style: 'Spiced Rum',
      distillery: 'Spiced Islands Rum Works'
    },
    signatureCocktails: [
      {
        image: 'https://images.unsplash.com/photo-1544280978-b5d5be0ad9a3?q=80&w=1200&auto=format&fit=crop',
        name: 'Spiced Mojito',
        ingredients: 'Spiced Islands, Mint, Lime, Brown Sugar, Soda',
        description: 'A refreshing mojito with exotic spice complexity'
      }
    ],
    tastingNotes: {
      nose: 'Warm spices with cinnamon, nutmeg, and vanilla',
      palate: 'Rich with exotic spices and caramel sweetness',
      finish: 'Long and warming with lingering spice'
    },
    awards: ['Silver Medal - World Rum Awards 2023'],
    story: {
      short: 'Infused with hand-selected Caribbean spices, this rum celebrates the exotic flavors of the spice islands.',
      long: 'Our master blenders carefully select exotic spices from across the Caribbean to create a rum with unparalleled complexity and warmth.'
    }
  },
  {
    id: 'coastal_breeze',
    name: 'Coastal Breeze',
    category: 'Rum',
    tier: 'bronze',
    hero: {
      image: SPIRIT_IMAGES.gin,
      tagline: 'Light Caribbean Spirit'
    },
    quickInfo: {
      origin: 'Puerto Rico',
      age: '3 Years',
      alcohol: '40% ABV',
      style: 'Light Rum',
      distillery: 'Coastal Breeze Distillery'
    },
    signatureCocktails: [
      {
        image: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?q=80&w=800&auto=format&fit=crop',
        name: 'Breeze Punch',
        ingredients: 'Coastal Breeze, Tropical Juices, Coconut, Lime',
        description: 'A light and refreshing tropical punch'
      }
    ],
    tastingNotes: {
      nose: 'Light and clean with subtle sugarcane',
      palate: 'Smooth and approachable with mild sweetness',
      finish: 'Short and clean with gentle warmth'
    },
    awards: ['Bronze Medal - Puerto Rico Rum Festival 2023'],
    story: {
      short: 'A light and accessible rum perfect for tropical cocktails and easy sipping.',
      long: 'Coastal Breeze represents the approachable side of Caribbean rum making, perfect for those discovering the world of rum.'
    }
  },
  {
    id: 'island_white',
    name: 'Island White',
    category: 'Rum',
    tier: 'bronze',
    hero: {
      image: SPIRIT_IMAGES.whiskey,
      tagline: 'Pure White Caribbean Rum'
    },
    quickInfo: {
      origin: 'Dominican Republic',
      age: 'Unaged',
      alcohol: '40% ABV',
      style: 'White Rum',
      distillery: 'Island White Rum Co.'
    },
    signatureCocktails: [
      {
        image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c76ac?q=80&w=800&auto=format&fit=crop',
        name: 'White Wave',
        ingredients: 'Island White, Coconut Water, Lime, Mint',
        description: 'A crisp and clean cocktail perfect for beach days'
      }
    ],
    tastingNotes: {
      nose: 'Clean and neutral with light sugarcane',
      palate: 'Crisp and straightforward',
      finish: 'Brief and clean'
    },
    awards: ['People\'s Choice - Dominican Rum Festival 2023'],
    story: {
      short: 'A clean, versatile white rum that serves as the perfect base for tropical cocktails.',
      long: 'Island White focuses on purity and versatility, creating the ideal canvas for tropical cocktail creativity.'
    }
  }
];

// Combine all brands
export const ALL_SPIRIT_BRANDS: SpiritBrand[] = [
  ...whiskeyBrands,
  ...ginBrands,
  ...vodkaBrands,
  ...tequilaBrands,
  ...rumBrands
];

// Helper functions
export const getBrandById = (id: string): SpiritBrand | undefined => {
  return ALL_SPIRIT_BRANDS.find(brand => brand.id === id);
};

export const getBrandsByCategory = (category: string): SpiritBrand[] => {
  return ALL_SPIRIT_BRANDS.filter(brand => brand.category.toLowerCase() === category.toLowerCase());
};

export const getBrandsByTier = (tier: BarTier): SpiritBrand[] => {
  return ALL_SPIRIT_BRANDS.filter(brand => brand.tier === tier);
};

// Randomize brands within each category while maintaining tier distribution
export const getRandomizedBrandsByCategory = (category: string): SpiritBrand[] => {
  const brands = getBrandsByCategory(category);
  
  // Separate by tier to maintain distribution
  const gold = brands.filter(b => b.tier === 'gold');
  const silver = brands.filter(b => b.tier === 'silver');
  const bronze = brands.filter(b => b.tier === 'bronze');
  
  // Shuffle within each tier
  const shuffleArray = (array: SpiritBrand[]) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };
  
  return [
    ...shuffleArray(gold),
    ...shuffleArray(silver),
    ...shuffleArray(bronze)
  ];
};