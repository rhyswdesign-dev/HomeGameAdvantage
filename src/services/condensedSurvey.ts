/**
 * Condensed Essential Survey (5-7 questions)
 * Gets what we need, learns the rest from behavior
 */

export interface CondensedSurveyAnswers {
  favoriteSpirit?: string;        // Q1: Primary spirit preference
  skillLevel: string;              // Q2: Beginner/Intermediate/Advanced
  alcoholPreference: string;       // Q3: Alcoholic/Low-ABV/Zero-proof
  flavorPreferences: string[];     // Q4: Top 3 flavor profiles
  learningGoal?: string;           // Q5: What they want to learn
  availableTools?: string[];       // Q6: What tools they have (optional)
  sessionTime?: string;            // Q7: How much time per session (optional)
}

export function getCondensedSurveyQuestions() {
  return [
    // Q1: Favorite Spirit (Drives 30% of recommendations)
    {
      id: 'favorite_spirit',
      section: 'Getting Started',
      type: 'mcq',
      question: 'What\'s your favorite spirit?',
      subtitle: 'We\'ll recommend cocktails featuring this',
      options: [
        { value: 'tequila', label: '🌵 Tequila', emoji: '🌵' },
        { value: 'whiskey', label: '🥃 Whiskey', emoji: '🥃' },
        { value: 'rum', label: '🏝️ Rum', emoji: '🏝️' },
        { value: 'gin', label: '🌿 Gin', emoji: '🌿' },
        { value: 'vodka', label: '❄️ Vodka', emoji: '❄️' },
        { value: 'none', label: '🚫 None / No preference', emoji: '🚫' },
      ]
    },

    // Q2: Skill Level (Drives difficulty filtering)
    {
      id: 'skill_level',
      section: 'Your Experience',
      type: 'mcq',
      question: 'How would you describe your bartending experience?',
      subtitle: 'Be honest - we\'ll match you with the right recipes',
      options: [
        {
          value: 'beginner',
          label: 'Beginner',
          description: 'New to making cocktails'
        },
        {
          value: 'intermediate',
          label: 'Intermediate',
          description: 'I can make a few classics'
        },
        {
          value: 'advanced',
          label: 'Advanced',
          description: 'Confident with techniques'
        },
      ]
    },

    // Q3: Alcohol Preference (Critical for filtering)
    {
      id: 'alcohol_preference',
      section: 'Your Preferences',
      type: 'mcq',
      question: 'What\'s your alcohol preference?',
      options: [
        { value: 'alcoholic', label: '🍸 Full-strength cocktails' },
        { value: 'low-abv', label: '🍷 Low-alcohol drinks' },
        { value: 'zero-proof', label: '🥤 Alcohol-free only' },
      ]
    },

    // Q4: Flavor Profiles (Drives 25% of recommendations)
    {
      id: 'flavor_preferences',
      section: 'Your Tastes',
      type: 'multi-select',
      question: 'Pick your top 3 flavor profiles',
      subtitle: 'Select up to 3',
      maxSelections: 3,
      options: [
        { value: 'citrus', label: '🍋 Citrus & Fresh' },
        { value: 'sweet', label: '🍯 Sweet & Fruity' },
        { value: 'herbal', label: '🌿 Herbal & Green' },
        { value: 'bitter', label: '☕ Bitter & Complex' },
        { value: 'smoky', label: '🔥 Smoky & Bold' },
        { value: 'spiced', label: '🌶️ Spiced & Warm' },
        { value: 'floral', label: '🌸 Floral & Light' },
      ]
    },

    // Q5: Learning Goal (Tailors content)
    {
      id: 'learning_goal',
      section: 'Your Goals',
      type: 'mcq',
      question: 'What do you want to achieve?',
      options: [
        { value: 'host', label: '🏠 Impress guests at home' },
        { value: 'classics', label: '📚 Master the classics' },
        { value: 'creative', label: '🎨 Create my own drinks' },
        { value: 'professional', label: '💼 Learn professional bartending' },
        { value: 'explore', label: '🌍 Just exploring for fun' },
      ]
    },

    // Q6: Available Tools (Optional - affects recommendations)
    {
      id: 'available_tools',
      section: 'Your Setup',
      type: 'multi-select',
      question: 'What bar tools do you have?',
      subtitle: 'Select all that apply (or skip)',
      optional: true,
      options: [
        { value: 'shaker', label: '🍹 Shaker' },
        { value: 'jigger', label: '📏 Jigger (measuring tool)' },
        { value: 'barspoon', label: '🥄 Bar spoon' },
        { value: 'strainer', label: '⚗️ Strainer' },
        { value: 'muddler', label: '🔨 Muddler' },
        { value: 'none', label: '❌ None yet' },
      ]
    },

    // Q7: Time Preference (Optional)
    {
      id: 'session_time',
      section: 'Final Question',
      type: 'mcq',
      question: 'How much time do you typically have?',
      subtitle: 'We\'ll suggest recipes that fit your schedule',
      optional: true,
      options: [
        { value: 'quick', label: '⚡ 3-5 minutes (quick drinks)' },
        { value: 'standard', label: '⏱️ 5-10 minutes (most recipes)' },
        { value: 'extended', label: '🎯 10+ minutes (elaborate cocktails)' },
      ]
    },
  ];
}

/**
 * Convert condensed survey to user profile
 */
export function condensedSurveyToProfile(answers: CondensedSurveyAnswers) {
  return {
    // Core preferences from survey
    favoriteSpirit: answers.favoriteSpirit,
    spiritPreferences: answers.favoriteSpirit ? [answers.favoriteSpirit] : [],
    skillLevel: answers.skillLevel as 'beginner' | 'intermediate' | 'advanced',
    alcoholPreference: answers.alcoholPreference as 'alcoholic' | 'low-abv' | 'zero-proof',
    flavorProfiles: answers.flavorPreferences || [],
    learningGoal: answers.learningGoal,
    availableTools: answers.availableTools || [],
    sessionTime: answers.sessionTime || 'standard',

    // These will be learned from behavior
    behavioralScores: {
      spiritScores: {},      // Learn from interactions
      flavorScores: {},      // Learn from interactions
      moodScores: {},        // Learn from interactions
      complexityScore: 0.5,  // Starts neutral, adjusts based on what they view/complete
    },

    // Interaction tracking
    interactions: {
      viewedRecipes: [],
      completedRecipes: [],
      likedRecipes: [],
      skippedRecipes: [],
      searchedTerms: [],
      lastUpdated: new Date(),
    },
  };
}

/**
 * Map learning goal to lesson track
 */
export function getLearningTrackFromGoal(goal?: string): string[] {
  switch (goal) {
    case 'host':
      return ['crowd-pleasers', 'batch-cocktails', 'party-hosting'];
    case 'classics':
      return ['classic-cocktails', 'fundamentals', 'spirit-education'];
    case 'creative':
      return ['flavor-pairing', 'recipe-creation', 'advanced-techniques'];
    case 'professional':
      return ['pro-techniques', 'speed-accuracy', 'menu-development'];
    case 'explore':
    default:
      return ['getting-started', 'popular-cocktails', 'flavor-exploration'];
  }
}

/**
 * Initial score weights (before any learning)
 */
export const INITIAL_WEIGHTS = {
  favoriteSpirit: 30,    // Highest weight
  flavorMatch: 25,
  skillMatch: 15,
  alcoholMatch: 15,
  toolsMatch: 10,
  moodMatch: 5,
};

/**
 * Behavioral learning weights (increase over time)
 */
export const BEHAVIORAL_WEIGHTS = {
  viewed: 2,       // User viewed recipe = +2 to similar recipes
  liked: 10,       // User liked = +10 to similar
  completed: 15,   // User made it = +15 to similar
  skipped: -5,     // User skipped = -5 to similar
};
