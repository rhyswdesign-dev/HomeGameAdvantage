/**
 * Placement Logic
 * Analyzes survey responses to determine user's starting level and track
 */

import { PlacementResult, SurveyAnswer } from '../types/domain';

export interface SurveyAnswers {
  [questionId: string]: string | string[];
}

/**
 * Analyze survey responses and determine placement
 * @param answers Survey responses
 * @returns Placement recommendation
 */
export function getPlacement(answers: SurveyAnswers): PlacementResult {
  let levelScore = 0;
  let track: 'alcoholic' | 'low-abv' | 'zero-proof' = 'alcoholic';
  let spirits: string[] = [];
  let sessionMinutes = 5;

  // Q2: Technique Comfort (shake vs stir)
  const techniqueComfort = answers['q2'] as string;
  if (techniqueComfort === 'very-confident') levelScore += 2;
  else if (techniqueComfort === 'somewhat') levelScore += 1;

  // Q3: Knowledge Check (Which cocktail uses tequila?)
  const knowledgeCheck = answers['q3'] as string;
  if (knowledgeCheck === 'margarita') levelScore += 2;

  // Q4: Glassware Recognition
  const glasswareCheck = answers['q4'] as string;
  if (glasswareCheck === 'coupe') levelScore += 2;

  // Q13: Tools on Hand
  const tools = answers['q13'] as string[];
  if (tools && tools.length > 2) levelScore += 2;
  else if (tools && tools.length >= 1) levelScore += 1;

  // Q14: Build Order (Shaken Sour)
  const buildOrder = answers['q14'] as string[];
  const correctOrder = ['spirit', 'citrus', 'syrup', 'ice', 'shake', 'double-strain'];
  if (buildOrder && arraysEqual(buildOrder, correctOrder)) levelScore += 2;

  // Determine level based on score (0-10)
  let level: 'beginner' | 'intermediate' | 'advanced';
  if (levelScore <= 3) level = 'beginner';
  else if (levelScore <= 7) level = 'intermediate';
  else level = 'advanced';

  // Q10: Alcohol Constraint
  const avoidAlcohol = answers['q10'] as string;
  if (avoidAlcohol === 'yes') {
    track = 'zero-proof';
  } else {
    // Q9: ABV Track
    const abvTrack = answers['q9'] as string;
    if (abvTrack === 'low-abv') track = 'low-abv';
    else if (abvTrack === 'zero-proof') track = 'zero-proof';
    else track = 'alcoholic';
  }

  // Q8: Spirit Preferences
  const spiritPrefs = answers['q8'] as string[];
  if (spiritPrefs && spiritPrefs.length > 0 && !spiritPrefs.includes('none')) {
    spirits = spiritPrefs.slice(0, 2); // Take top 2
  } else {
    // Default suggestions based on track
    if (track === 'zero-proof') {
      spirits = ['gin-alternative', 'rum-alternative'];
    } else {
      spirits = ['gin', 'rum'];
    }
  }

  // Q15: Preferred Lesson Time
  const lessonTime = answers['q15'] as string;
  if (lessonTime === '3m') sessionMinutes = 3;
  else if (lessonTime === '8m') sessionMinutes = 8;
  else sessionMinutes = 5;

  // Determine starting module
  let startModuleId: string;
  if (level === 'beginner') {
    startModuleId = 'ch1-intro';
  } else if (level === 'intermediate') {
    startModuleId = techniqueComfort === 'very-confident' ? 'ch2-tools-terms' : 'ch1-intro';
  } else {
    startModuleId = 'ch2-tools-terms';
  }

  // Create interlude message
  const interlude = createInterludeMessage(level, track, spirits, levelScore);

  return {
    level,
    track,
    spirits,
    startModuleId,
    interlude,
    sessionMinutes
  };
}

/**
 * Create personalized interlude message
 */
function createInterludeMessage(
  level: string,
  track: string,
  spirits: string[],
  score: number
): string {
  const levelMessages = {
    beginner: "Perfect! We'll start with the fundamentals and build your confidence step by step.",
    intermediate: "Great foundation! We'll focus on refining your technique and expanding your knowledge.",
    advanced: "Impressive skills! We'll challenge you with advanced techniques and complex flavor profiles."
  };

  const trackMessages = {
    'alcoholic': 'focusing on classic cocktails and traditional spirits',
    'low-abv': 'exploring lower-alcohol options and aperitif-style drinks',
    'zero-proof': 'mastering alcohol-free cocktails and mocktails'
  };

  const spiritText = spirits.length > 0 
    ? `We'll start with ${spirits.join(' and ')} to match your preferences.`
    : '';

  return `${levelMessages[level as keyof typeof levelMessages]} Your learning path will be ${trackMessages[track as keyof typeof trackMessages]}. ${spiritText}`;
}

/**
 * Utility function to compare arrays
 */
function arraysEqual(a: string[], b: string[]): boolean {
  if (a.length !== b.length) return false;
  return a.every((val, index) => val === b[index]);
}

/**
 * Get survey questions for the onboarding flow
 */
export function getSurveyQuestions() {
  return [
    // Section A: Experience & Skill
    {
      id: 'q1',
      section: 'Experience & Skill',
      type: 'mcq',
      question: 'What\'s your home bartending experience?',
      options: [
        { value: 'never', label: 'Never' },
        { value: 'occasionally', label: 'Occasionally (few times a year)' },
        { value: 'regularly', label: 'Regularly (monthly+)' }
      ]
    },
    {
      id: 'q2',
      section: 'Experience & Skill',
      type: 'mcq',
      question: 'How confident are you with shake vs stir techniques?',
      options: [
        { value: 'not-at-all', label: 'Not at all' },
        { value: 'somewhat', label: 'Somewhat' },
        { value: 'very-confident', label: 'Very confident' }
      ]
    },
    {
      id: 'q3',
      section: 'Experience & Skill',
      type: 'mcq',
      question: 'Which cocktail uses tequila by default?',
      options: [
        { value: 'margarita', label: 'Margarita' },
        { value: 'mojito', label: 'Mojito' },
        { value: 'tom-collins', label: 'Tom Collins' },
        { value: 'daiquiri', label: 'Daiquiri' }
      ]
    },
    {
      id: 'q4',
      section: 'Experience & Skill',
      type: 'image-mcq',
      question: 'Which is a coupe?',
      options: [
        { value: 'coupe', label: 'Wide, shallow bowl', image: 'coupe.jpg' },
        { value: 'martini', label: 'Triangular cone', image: 'martini.jpg' },
        { value: 'rocks', label: 'Short cylinder', image: 'rocks.jpg' },
        { value: 'highball', label: 'Tall cylinder', image: 'highball.jpg' }
      ]
    },

    // Section B: Behavior & Frequency
    {
      id: 'q5',
      section: 'Behavior & Frequency',
      type: 'mcq',
      question: 'How often do you make drinks?',
      options: [
        { value: 'rarely', label: 'Rarely/Never' },
        { value: 'monthly', label: 'Monthly' },
        { value: 'weekly', label: 'Weekly' },
        { value: 'daily', label: 'Most days' }
      ]
    },
    {
      id: 'q6',
      section: 'Behavior & Frequency',
      type: 'mcq',
      question: 'How often do you go out for drinks?',
      options: [
        { value: 'rarely', label: 'Rarely' },
        { value: 'monthly', label: 'Monthly' },
        { value: 'weekly', label: 'Weekly' },
        { value: 'weekends', label: 'Most weekends' }
      ]
    },
    {
      id: 'q7',
      section: 'Behavior & Frequency',
      type: 'multi-select',
      question: 'What matters most when you go out? (Choose up to 3)',
      options: [
        { value: 'music', label: 'Music/DJ or live performances' },
        { value: 'drinks', label: 'Quality drinks/cocktails' },
        { value: 'decor', label: 'Room décor & design' },
        { value: 'atmosphere', label: 'Atmosphere/crowd vibe' },
        { value: 'food', label: 'Food options' },
        { value: 'price', label: 'Price/promotions' }
      ]
    },

    // Section C: Preferences & Profile
    {
      id: 'q8',
      section: 'Preferences & Profile',
      type: 'multi-select',
      question: 'Which spirits interest you most? (Select all that apply)',
      options: [
        { value: 'tequila', label: 'Tequila' },
        { value: 'whiskey', label: 'Whiskey' },
        { value: 'rum', label: 'Rum' },
        { value: 'gin', label: 'Gin' },
        { value: 'brandy', label: 'Brandy' },
        { value: 'liqueurs', label: 'Liqueurs' },
        { value: 'none', label: 'None' }
      ]
    },
    {
      id: 'q9',
      section: 'Preferences & Profile',
      type: 'mcq',
      question: 'What\'s your preferred alcohol content?',
      options: [
        { value: 'alcoholic', label: 'Alcoholic' },
        { value: 'low-abv', label: 'Low-ABV' },
        { value: 'zero-proof', label: 'Zero-proof' }
      ]
    },
    {
      id: 'q10',
      section: 'Preferences & Profile',
      type: 'mcq',
      question: 'Do you avoid alcohol entirely?',
      options: [
        { value: 'yes', label: 'Yes' },
        { value: 'no', label: 'No' }
      ]
    },
    {
      id: 'q11',
      section: 'Preferences & Profile',
      type: 'multi-select',
      question: 'What flavor profiles do you prefer? (Pick three)',
      options: [
        { value: 'citrus', label: 'Citrus & Fresh' },
        { value: 'herbal', label: 'Herbal & Green' },
        { value: 'bitter', label: 'Bitter & Complex' },
        { value: 'sweet', label: 'Sweet & Fruity' },
        { value: 'smoky', label: 'Smoky & Bold' },
        { value: 'floral', label: 'Floral & Light' },
        { value: 'spiced', label: 'Spiced & Warm' }
      ]
    },
    {
      id: 'q12',
      section: 'Preferences & Profile',
      type: 'multi-select',
      question: 'What are your goals for learning?',
      options: [
        { value: 'host', label: 'Host better' },
        { value: 'classics', label: 'Learn classics' },
        { value: 'originals', label: 'Create originals' },
        { value: 'professional', label: 'Train for professional bar work' }
      ]
    },
    {
      id: 'q13',
      section: 'Preferences & Profile',
      type: 'multi-select',
      question: 'What bar tools do you have? (Select all that apply)',
      options: [
        { value: 'jigger', label: 'Jigger' },
        { value: 'shaker', label: 'Shaker' },
        { value: 'barspoon', label: 'Barspoon' },
        { value: 'strainer', label: 'Fine Strainer' },
        { value: 'none', label: 'None' }
      ]
    },

    // Section D: Placement Knowledge Check
    {
      id: 'q14',
      section: 'Placement Knowledge Check',
      type: 'order',
      question: 'Put these steps in order for making a shaken sour:',
      options: [
        { value: 'spirit', label: 'Spirit' },
        { value: 'citrus', label: 'Citrus' },
        { value: 'syrup', label: 'Syrup' },
        { value: 'ice', label: 'Ice' },
        { value: 'shake', label: 'Shake' },
        { value: 'double-strain', label: 'Double-strain' }
      ]
    },
    {
      id: 'q15',
      section: 'Placement Knowledge Check',
      type: 'mcq',
      question: 'Preferred lesson time:',
      options: [
        { value: '3m', label: '3m' },
        { value: '5m', label: '5m' },
        { value: '8m', label: '8m' }
      ]
    }
  ];
}