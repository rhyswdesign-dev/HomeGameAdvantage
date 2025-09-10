export interface SlideContent {
  title: string;
  subtitle: string;
  bullets: string[];
  ctaLabel: string;
}

export const slideCopy: Record<string, SlideContent> = {
  welcome: {
    title: "Welcome to MixMind",
    subtitle: "Learn, play, and level up your home bartending skills",
    bullets: [
      "Discover premium spirits and cocktail recipes",
      "Learn from expert bartenders and mixologists", 
      "Build your personal collection and favorites"
    ],
    ctaLabel: "Get Started"
  },
  
  features: {
    title: "Earn XP & Build Your Vault",
    subtitle: "Track your progress and unlock new content",
    bullets: [
      "Complete challenges to earn experience points",
      "Unlock rare recipes and advanced techniques",
      "Build your virtual liquor cabinet and wish list"
    ],
    ctaLabel: "Continue"
  },
  
  community: {
    title: "Join the Community",
    subtitle: "Connect with fellow cocktail enthusiasts",
    bullets: [
      "Share your favorite recipes and photos",
      "Get tips and feedback from other mixologists",
      "Join local events and tastings near you"
    ],
    ctaLabel: "Continue"
  },
  
  commerce: {
    title: "Shop Premium Spirits",
    subtitle: "Discover and purchase quality ingredients",
    bullets: [
      "Browse curated selection of spirits and tools",
      "Get personalized recommendations based on your taste",
      "Support local liquor stores and distilleries"
    ],
    ctaLabel: "Continue"
  },
  
  permissions: {
    title: "Customize Your Experience",
    subtitle: "Help us personalize MixMind for you",
    bullets: [
      "Get notifications for new recipes and events",
      "Find nearby bars and liquor stores",
      "Share photos of your cocktail creations"
    ],
    ctaLabel: "Start Mixing!"
  }
};