export type BarTier = 'bronze' | 'silver' | 'gold';

export interface BarContent {
  id: string;
  name: string;
  hero: { 
    image: string; 
    location?: string; 
    xpReward?: number;
  };
  location?: {
    latitude: number;
    longitude: number;
    name: string;
    address: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
    phone?: string;
    website?: string;
  };
  quickTags?: string[];
  quickInfo?: {
    music?: string; 
    vibe?: string; 
    menu?: string;
    popularNights?: string; 
    happyHour?: string;
  };
  signatureDrinks?: Array<{
    image: string; 
    name: string; 
    tagline?: string; 
    price?: string;
  }>;
  events?: Array<{ 
    title: string; 
    dateISO: string; 
    time?: string; 
    city?: string;
  }>;
  challenge?: { 
    image: string; 
    title: string; 
    copy?: string; 
    cta?: string;
  };
  crowdTags?: string[];
  bartender?: { 
    name: string; 
    avatar: string; 
    quote?: string;
  };
  story?: { 
    short?: string; 
    long?: string;
  };
  team?: Array<{ 
    name: string; 
    role: string; 
    avatar: string;
  }>;
  rewards?: Array<{ 
    image: string; 
    name: string; 
    xp: number;
  }>;
  social?: Array<{ 
    image: string; 
    handle?: string; 
    caption?: string;
  }>;
  vibes?: {
    crowdAndAtmosphere?: Array<{ icon: string; text: string }>;
    bartender?: { name: string; avatar: string; subtitle?: string };
    travelTips?: Array<{ icon: string; text: string }>;
    dressCodeAndEntry?: Array<{ icon: string; text: string }>;
  };
}