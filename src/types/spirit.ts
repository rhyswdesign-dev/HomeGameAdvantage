export type ProductItem = {
  id: string;
  image: string;
  name: string;
  blurb?: string;
};

export type Recipe = {
  id: string;
  image: string;
  name: string;
  ingredients: string[];
  instructions: string;
  glassware?: string;
  garnish?: string;
};

export type Challenge = {
  image: string;
  title: string;
  copy: string;
  cta?: string;
};

export type EventItem = {
  id: string;
  title: string;
  city?: string;
  dateISO: string;
};

export type Ambassador = {
  id: string;
  name: string;
  role: string;
  avatar: string;
};

export type LearningModule = {
  id: string;
  title: string;
  icon?: string;
};

export type RewardItem = {
  id: string;
  image: string;
  name: string;
  xp: number;
};

export type SocialPost = {
  id: string;
  image: string;
  handle?: string;
  caption?: string;
};

export type BrandVideo = {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: string;
  xpReward: number;
  watched: boolean;
};

export type PairingItem = {
  id: string;
  name: string;
  category: 'food' | 'cigar' | 'occasion';
  description: string;
  image: string;
  rating: number; // 1-5 stars
};

export type SpiritContent = {
  id: string;
  name: string;
  hero: {
    image: string;
    title?: string;
    xpMessage?: string;
  };
  // Gold tier sections:
  products?: ProductItem[];
  recipes?: Recipe[];
  challenge?: Challenge;
  events?: EventItem[];
  ambassadors?: Ambassador[];
  learning?: LearningModule;
  rewards?: RewardItem[];
  social?: SocialPost[];
  brandVideos?: BrandVideo[];
  pairings?: PairingItem[];
};

export type SpiritTier = 'bronze' | 'silver' | 'gold';