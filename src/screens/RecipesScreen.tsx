import React, { useState, useLayoutEffect, useEffect, useCallback, useRef } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Pressable,
  Alert,
  TextInput,
  Keyboard,
  FlatList,
  Dimensions,
  ListRenderItem,
  Modal,
} from 'react-native';
import { colors, spacing, radii, fonts } from '../theme/tokens';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import SectionHeader from '../components/SectionHeader';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import type { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/RootNavigator';
import { useSavedItems } from '../hooks/useSavedItems';
import { getUserRecipes, Recipe, deleteRecipe } from '../lib/firestore';
import { auth } from '../config/firebase';
import GroceryListModal from '../components/GroceryListModal';
import { recommendationEngine, type RecommendationSet, type Recommendation } from '../services/recommendationEngine';
import { AIRecipeFormatter } from '../services/aiRecipeFormatter';
import { searchService, type SearchableItem, FilterOptions } from '../services/searchService';
import RecipeCard from '../components/RecipeCard';
import { createRecipeCardProps } from '../utils/recipeActions';
import { StatusBar } from 'expo-status-bar';
import {
  ALL_COCKTAILS
} from '../data/cocktails';

type Nav = NativeStackNavigationProp<RootStackParamList>;
const { width } = Dimensions.get('window');
const GUTTER = 12;
const GOLD = '#C9A15A'; // spotlight color


/* ------------------------- DATA ------------------------- */

// Featured Cocktail of the Month
const COCKTAIL_OF_THE_MONTH = {
  id: 'old-fashioned',
  name: 'Old Fashioned',
  subtitle: 'Cocktail of the Month',
  image: 'https://images.unsplash.com/photo-1536935338788-846bb9981813?auto=format&fit=crop&w=1200&q=60',
  description: 'A timeless classic that defined the cocktail era.',
  badge: 'GOLD' as const
};

// Mood-based categories (only Shots and Mocktails)
const COCKTAIL_MOODS = [
  {
    title: 'Bold & Serious',
    subtitle: 'Classic strength & sophistication',
    image: 'https://images.unsplash.com/photo-1574096079513-d8259312b785?auto=format&fit=crop&w=800&q=60',
    category: 'bold_serious',
    cocktails: ['old-fashioned', 'negroni', 'martini', 'sazerac', 'manhattan']
  },
  {
    title: 'Romantic & Elegant',
    subtitle: 'Refined drinks for special moments',
    image: 'https://images.unsplash.com/photo-1510972527921-ce03766a1cf1?auto=format&fit=crop&w=800&q=60',
    category: 'romantic_elegant',
    cocktails: ['french-75', 'bellini', 'aviation', 'kir-royale', 'cosmopolitan']
  },
  {
    title: 'Playful & Fun',
    subtitle: 'Vibrant & cheerful cocktails',
    image: 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?auto=format&fit=crop&w=800&q=60',
    category: 'playful_fun',
    cocktails: ['margarita', 'mojito', 'aperol-spritz', 'pornstar-martini', 'bramble']
  },
  {
    title: 'Tropical Escape',
    subtitle: 'Transport yourself to paradise',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=800&q=60',
    category: 'tropical_escape',
    cocktails: ['mai-tai', 'pina-colada', 'zombie', 'painkiller', 'jungle-bird']
  },
  {
    title: 'Cozy & Comforting',
    subtitle: 'Warm drinks for relaxation',
    image: 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=800&q=60',
    category: 'cozy_comforting',
    cocktails: ['irish-coffee', 'white-russian', 'hot-toddy', 'amaretto-sour']
  },
  {
    title: 'Late-Night Energy',
    subtitle: 'Energizing cocktails for the night',
    image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=800&q=60',
    category: 'late_night_energy',
    cocktails: ['espresso-martini', 'paper-plane', 'naked-famous', 'kamikaze']
  },
  {
    title: 'Mystery & Depth',
    subtitle: 'Complex & intriguing flavors',
    image: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=800&q=60',
    category: 'mystery_depth',
    cocktails: ['vieux-carre', 'last-word', 'oaxaca-old-fashioned', 'rusty-nail']
  },
  {
    title: 'Party Crowd-Pleasers',
    subtitle: 'Easy-drinking favorites for groups',
    image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=800&q=60',
    category: 'party_crowd_pleasers',
    cocktails: ['moscow-mule', 'cuba-libre', 'paloma', 'spritz-veneziano']
  },
  {
    title: 'After-Dinner Indulgence',
    subtitle: 'Rich dessert-style cocktails',
    image: 'https://images.unsplash.com/photo-1546171753-97d7676e4602?auto=format&fit=crop&w=800&q=60',
    category: 'after_dinner_indulgence',
    cocktails: ['brandy-alexander', 'grasshopper', 'b-52', 'black-russian']
  },
];

// Fun Party Shots (25 shots)
const PARTY_SHOTS = [
  {
    id: 'lemon-drop-shot',
    name: 'Lemon Drop Shot',
    title: 'Lemon Drop Shot',
    subtitle: 'Party Shot • Vodka-based',
    category: 'Shots',
    image: 'https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?q=80&w=1200&auto=format&fit=crop',
    difficulty: 'Easy',
    time: '1 min',
    rating: 4.3,
    ingredients: [
      { name: '1 oz Vodka', note: 'Citrus vodka preferred' },
      { name: '1/2 oz Fresh Lemon Juice', note: 'Fresh only' },
      { name: '1/2 oz Simple Syrup', note: 'To sweeten' },
      { name: 'Sugar Rim', note: 'For glass' }
    ],
    description: 'Sweet and sour crowd favorite.',
  },
  {
    id: 'kamikaze-shot',
    name: 'Kamikaze',
    title: 'Kamikaze',
    subtitle: 'Party Shot • Vodka-based',
    category: 'Shots',
    image: 'https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?q=80&w=1200&auto=format&fit=crop',
    difficulty: 'Easy',
    time: '1 min',
    rating: 4.2,
    ingredients: [
      { name: '1 oz Vodka', note: 'Quality vodka' },
      { name: '1/2 oz Triple Sec', note: 'Cointreau preferred' },
      { name: '1/2 oz Fresh Lime Juice', note: 'Freshly squeezed' }
    ],
    description: 'Classic three-ingredient shot.',
  },
  {
    id: 'washington-apple',
    name: 'Washington Apple',
    title: 'Washington Apple',
    subtitle: 'Party Shot • Whiskey-based',
    category: 'Shots',
    image: 'https://images.unsplash.com/photo-1580424805313-04ac2b1fef66?q=80&w=1200&auto=format&fit=crop',
    difficulty: 'Easy',
    time: '1 min',
    rating: 4.4,
    ingredients: [
      { name: '1/2 oz Canadian Whisky', note: 'Crown Royal' },
      { name: '1/2 oz Apple Schnapps', note: 'Sour Apple Pucker' },
      { name: 'Splash Cranberry Juice', note: 'For color' }
    ],
    description: 'Sweet apple-flavored shot.',
  },
  {
    id: 'buttery-nipple',
    name: 'Buttery Nipple',
    title: 'Buttery Nipple',
    subtitle: 'Party Shot • Layered',
    category: 'Shots',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=1200&auto=format&fit=crop',
    difficulty: 'Easy',
    time: '1 min',
    rating: 4.1,
    ingredients: [
      { name: '1/2 oz Butterscotch Schnapps', note: 'Bottom layer' },
      { name: '1/2 oz Irish Cream', note: 'Float on top' }
    ],
    description: 'Sweet layered shot with butterscotch and cream.',
  },
  {
    id: 'green-tea-shot',
    name: 'Green Tea Shot',
    title: 'Green Tea Shot',
    subtitle: 'Party Shot • Whiskey-based',
    category: 'Shots',
    image: 'https://images.unsplash.com/photo-1580424805313-04ac2b1fef66?q=80&w=1200&auto=format&fit=crop',
    difficulty: 'Easy',
    time: '1 min',
    rating: 4.3,
    ingredients: [
      { name: '1/2 oz Jameson Irish Whiskey', note: 'Base spirit' },
      { name: '1/2 oz Peach Schnapps', note: 'Sweet element' },
      { name: '1/2 oz Sour Mix', note: 'Tart balance' },
      { name: 'Splash Sprite', note: 'For fizz' }
    ],
    description: 'Surprisingly doesn\'t taste like tea, but it\'s delicious.',
  },
  {
    id: 'pickleback',
    name: 'Pickleback',
    title: 'Pickleback',
    subtitle: 'Party Shot • Whiskey chase',
    category: 'Shots',
    image: 'https://images.unsplash.com/photo-1580424805313-04ac2b1fef66?q=80&w=1200&auto=format&fit=crop',
    difficulty: 'Easy',
    time: '1 min',
    rating: 3.9,
    ingredients: [
      { name: '1 oz Whiskey', note: 'Any whiskey works' },
      { name: '1 oz Pickle Juice', note: 'Dill pickle brine chaser' }
    ],
    description: 'Brooklyn bar classic - whiskey followed by pickle juice.',
  },
  {
    id: 'redheaded-slut',
    name: 'Redheaded Slut',
    title: 'Redheaded Slut',
    subtitle: 'Party Shot • Fruit-forward',
    category: 'Shots',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=1200&auto=format&fit=crop',
    difficulty: 'Easy',
    time: '1 min',
    rating: 4.0,
    ingredients: [
      { name: '1/2 oz Peach Schnapps', note: 'Sweet base' },
      { name: '1/2 oz Jägermeister', note: 'Herbal complexity' },
      { name: 'Splash Cranberry Juice', note: 'For color and tartness' }
    ],
    description: 'Sweet and herbal party favorite.',
  },
  {
    id: 'baby-guinness',
    name: 'Baby Guinness',
    title: 'Baby Guinness',
    subtitle: 'Party Shot • Layered',
    category: 'Shots',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=1200&auto=format&fit=crop',
    difficulty: 'Medium',
    time: '2 min',
    rating: 4.2,
    ingredients: [
      { name: '3/4 oz Kahlúa', note: 'Dark bottom layer' },
      { name: '1/4 oz Irish Cream', note: 'Float to create "foam"' }
    ],
    description: 'Looks like a tiny pint of Guinness.',
  },
  {
    id: 'scooby-snack',
    name: 'Scooby Snack',
    title: 'Scooby Snack',
    subtitle: 'Party Shot • Tropical',
    category: 'Shots',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=1200&auto=format&fit=crop',
    difficulty: 'Easy',
    time: '1 min',
    rating: 4.1,
    ingredients: [
      { name: '1/2 oz Coconut Rum', note: 'Malibu works well' },
      { name: '1/2 oz Banana Liqueur', note: 'Crème de Banane' },
      { name: '1/2 oz Pineapple Juice', note: 'Fresh preferred' },
      { name: 'Splash Lime Juice', note: 'Just a touch' }
    ],
    description: 'Tropical fruity shot that\'s always a hit.',
  },
  {
    id: 'slippery-nipple',
    name: 'Slippery Nipple',
    title: 'Slippery Nipple',
    subtitle: 'Party Shot • Layered',
    category: 'Shots',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=1200&auto=format&fit=crop',
    difficulty: 'Medium',
    time: '2 min',
    rating: 3.8,
    ingredients: [
      { name: '1/2 oz Sambuca', note: 'Clear anise liqueur' },
      { name: '1/2 oz Irish Cream', note: 'Float on top' },
      { name: 'Drop Grenadine', note: 'Sink to bottom' }
    ],
    description: 'Three-layer shot with interesting flavor profile.',
  },
  {
    id: 'birthday-cake-shot',
    name: 'Birthday Cake Shot',
    title: 'Birthday Cake Shot',
    subtitle: 'Party Shot • Sweet',
    category: 'Shots',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=1200&auto=format&fit=crop',
    difficulty: 'Easy',
    time: '1 min',
    rating: 4.4,
    ingredients: [
      { name: '1/2 oz Vanilla Vodka', note: 'Cake flavor base' },
      { name: '1/2 oz Amaretto', note: 'Almond sweetness' },
      { name: 'Splash Cranberry Juice', note: 'For color' },
      { name: 'Vanilla Frosting Rim', note: 'With rainbow sprinkles' }
    ],
    description: 'Tastes like birthday cake in a shot glass.',
  },
  {
    id: 'duck-fart',
    name: 'Duck Fart',
    title: 'Duck Fart',
    subtitle: 'Party Shot • Layered',
    category: 'Shots',
    image: 'https://images.unsplash.com/photo-1580424805313-04ac2b1fef66?q=80&w=1200&auto=format&fit=crop',
    difficulty: 'Medium',
    time: '2 min',
    rating: 3.7,
    ingredients: [
      { name: '1/3 oz Kahlúa', note: 'Bottom layer' },
      { name: '1/3 oz Crown Royal', note: 'Middle layer' },
      { name: '1/3 oz Irish Cream', note: 'Top layer' }
    ],
    description: 'Alaskan favorite with unfortunate name but great taste.',
  },
  {
    id: 'mind-eraser',
    name: 'Mind Eraser',
    title: 'Mind Eraser',
    subtitle: 'Party Shot • Strong',
    category: 'Shots',
    image: 'https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?q=80&w=1200&auto=format&fit=crop',
    difficulty: 'Easy',
    time: '1 min',
    rating: 3.9,
    ingredients: [
      { name: '1/2 oz Vodka', note: 'Quality vodka' },
      { name: '1/2 oz Kahlúa', note: 'Coffee liqueur' },
      { name: 'Splash Soda Water', note: 'To top' }
    ],
    description: 'Strong shot meant to be consumed through a straw.',
  },
  {
    id: 'porn-star-martini-shot',
    name: 'Porn Star Martini Shot',
    title: 'Porn Star Martini Shot',
    subtitle: 'Party Shot • Passion fruit',
    category: 'Shots',
    image: 'https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?q=80&w=1200&auto=format&fit=crop',
    difficulty: 'Medium',
    time: '2 min',
    rating: 4.5,
    ingredients: [
      { name: '1/2 oz Vanilla Vodka', note: 'Premium preferred' },
      { name: '1/4 oz Passoã', note: 'Passion fruit liqueur' },
      { name: '1/4 oz Lime Juice', note: 'Fresh squeezed' },
      { name: 'Splash Prosecco', note: 'Side shot glass' }
    ],
    description: 'Shot version of the famous cocktail.',
  },
  {
    id: 'jolly-rancher-shot',
    name: 'Jolly Rancher Shot',
    title: 'Jolly Rancher Shot',
    subtitle: 'Party Shot • Candy-flavored',
    category: 'Shots',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=1200&auto=format&fit=crop',
    difficulty: 'Easy',
    time: '1 min',
    rating: 4.2,
    ingredients: [
      { name: '1/2 oz Vodka', note: 'Neutral base' },
      { name: '1/2 oz Apple Schnapps', note: 'Green apple flavor' },
      { name: 'Splash Cranberry Juice', note: 'For color and tartness' }
    ],
    description: 'Tastes like the green apple candy.',
  },
  {
    id: 'alien-brain-hemorrhage',
    name: 'Alien Brain Hemorrhage',
    title: 'Alien Brain Hemorrhage',
    subtitle: 'Party Shot • Gross-looking',
    category: 'Shots',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=1200&auto=format&fit=crop',
    difficulty: 'Hard',
    time: '3 min',
    rating: 3.5,
    ingredients: [
      { name: '1/2 oz Peach Schnapps', note: 'Base layer' },
      { name: '1/2 oz Irish Cream', note: 'Pour slowly to curdle' },
      { name: 'Drop Grenadine', note: 'For "blood" effect' },
      { name: 'Drop Blue Curaçao', note: 'For alien color' }
    ],
    description: 'Disgusting looking but surprisingly tasty Halloween shot.',
  },
  {
    id: 'chocolate-cake-shot',
    name: 'Chocolate Cake Shot',
    title: 'Chocolate Cake Shot',
    subtitle: 'Party Shot • Dessert-like',
    category: 'Shots',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=1200&auto=format&fit=crop',
    difficulty: 'Easy',
    time: '1 min',
    rating: 4.3,
    ingredients: [
      { name: '1/2 oz Vanilla Vodka', note: 'Cake base' },
      { name: '1/2 oz Frangelico', note: 'Hazelnut liqueur' },
      { name: 'Sugar Rim', note: 'With cocoa powder' },
      { name: 'Lemon Wedge', note: 'Bite after shot' }
    ],
    description: 'Magically tastes like chocolate cake when done right.',
  },
  {
    id: 'pineapple-upside-down-cake',
    name: 'Pineapple Upside Down Cake',
    title: 'Pineapple Upside Down Cake',
    subtitle: 'Party Shot • Tropical dessert',
    category: 'Shots',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=1200&auto=format&fit=crop',
    difficulty: 'Easy',
    time: '1 min',
    rating: 4.1,
    ingredients: [
      { name: '1/2 oz Vanilla Vodka', note: 'Cake element' },
      { name: '1/4 oz Pineapple Juice', note: 'Fruit flavor' },
      { name: '1/4 oz Grenadine', note: 'Cherry topping' },
      { name: 'Whipped Cream', note: 'Float on top' }
    ],
    description: 'Dessert shot that tastes like the classic cake.',
  },
  {
    id: 'blow-job-shot',
    name: 'Blow Job Shot',
    title: 'Blow Job Shot',
    subtitle: 'Party Shot • No hands',
    category: 'Shots',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=1200&auto=format&fit=crop',
    difficulty: 'Easy',
    time: '1 min',
    rating: 3.6,
    ingredients: [
      { name: '1/2 oz Kahlúa', note: 'Coffee base' },
      { name: '1/4 oz Vodka', note: 'Middle layer' },
      { name: '1/4 oz Whipped Cream', note: 'Generous top layer' }
    ],
    description: 'Must be consumed without using hands - party challenge shot.',
  },
  {
    id: 'fuzzy-navel-shot',
    name: 'Fuzzy Navel Shot',
    title: 'Fuzzy Navel Shot',
    subtitle: 'Party Shot • Peachy',
    category: 'Shots',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=1200&auto=format&fit=crop',
    difficulty: 'Easy',
    time: '1 min',
    rating: 4.0,
    ingredients: [
      { name: '1/2 oz Peach Schnapps', note: 'Fuzzy peach flavor' },
      { name: '1/2 oz Orange Juice', note: 'Fresh preferred' },
      { name: 'Splash Cranberry Juice', note: 'For color' }
    ],
    description: 'Shot version of the classic fuzzy navel cocktail.',
  },
  {
    id: 'leg-spreader',
    name: 'Leg Spreader',
    title: 'Leg Spreader',
    subtitle: 'Party Shot • Fruity',
    category: 'Shots',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=1200&auto=format&fit=crop',
    difficulty: 'Easy',
    time: '1 min',
    rating: 3.8,
    ingredients: [
      { name: '1/3 oz Vodka', note: 'Base spirit' },
      { name: '1/3 oz Peach Schnapps', note: 'Sweet element' },
      { name: '1/3 oz Cranberry Juice', note: 'Tart balance' },
      { name: 'Splash Lime Juice', note: 'Citrus finish' }
    ],
    description: 'Dangerously smooth and fruity party shot.',
  },
  {
    id: 'brain-hemorrhage',
    name: 'Brain Hemorrhage',
    title: 'Brain Hemorrhage',
    subtitle: 'Party Shot • Halloween favorite',
    category: 'Shots',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=1200&auto=format&fit=crop',
    difficulty: 'Medium',
    time: '2 min',
    rating: 3.4,
    ingredients: [
      { name: '1/2 oz Peach Schnapps', note: 'Base layer' },
      { name: '1/2 oz Irish Cream', note: 'Pour slowly to create brain effect' },
      { name: 'Few drops Grenadine', note: 'For hemorrhage effect' }
    ],
    description: 'Looks disturbing but tastes great - perfect for Halloween.',
  },
  {
    id: 'liquid-cocaine',
    name: 'Liquid Cocaine',
    title: 'Liquid Cocaine',
    subtitle: 'Party Shot • High energy',
    category: 'Shots',
    image: 'https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?q=80&w=1200&auto=format&fit=crop',
    difficulty: 'Easy',
    time: '1 min',
    rating: 4.0,
    ingredients: [
      { name: '1/4 oz Vodka', note: 'Base spirit' },
      { name: '1/4 oz Rum', note: 'White rum' },
      { name: '1/4 oz Amaretto', note: 'Almond flavor' },
      { name: '1/4 oz Southern Comfort', note: 'Peach liqueur' },
      { name: 'Splash Pineapple Juice', note: 'Tropical element' }
    ],
    description: 'High-octane party shot with multiple spirits.',
  },
  {
    id: 'surfer-on-acid',
    name: 'Surfer on Acid',
    title: 'Surfer on Acid',
    subtitle: 'Party Shot • Tropical',
    category: 'Shots',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=1200&auto=format&fit=crop',
    difficulty: 'Easy',
    time: '1 min',
    rating: 4.2,
    ingredients: [
      { name: '1/3 oz Jägermeister', note: 'Herbal base' },
      { name: '1/3 oz Coconut Rum', note: 'Tropical element' },
      { name: '1/3 oz Pineapple Juice', note: 'Fresh preferred' }
    ],
    description: 'Surprisingly delicious combination of herbal and tropical.',
  },
];

// All shots for easy access
const ALL_SHOTS = [...PARTY_SHOTS];

const sampleRecipes = [
  {
    id: 'virgin-mojito',
    name: 'Virgin Mojito',
    title: 'Virgin Mojito',
    subtitle: 'Non-Alcoholic • Refreshing',
    category: 'Mocktails',
    image: 'https://images.unsplash.com/photo-1497534547324-0ebb3f052e88?q=80&w=1200&auto=format&fit=crop',
    img: 'https://images.unsplash.com/photo-1497534547324-0ebb3f052e88?q=80&w=1200&auto=format&fit=crop',
    difficulty: 'Easy',
    time: '2 min',
    rating: 4.6,
    ingredients: [
      { name: 'Fresh Lime Juice', note: '1 oz freshly squeezed' },
      { name: 'Mint Leaves', note: '8-10 fresh leaves' },
      { name: 'Simple Syrup', note: '1/2 oz to taste' },
      { name: 'Soda Water', note: '4 oz chilled' }
    ],
    description: 'Refreshing non-alcoholic version of the classic mojito.',
  },
];

/* ------------------------- UI PIECES ------------------------- */

function MoodCard({ title, image, subtitle, onPress }: { title: string; image: string; subtitle?: string; onPress?: () => void }) {
  const w = Math.min(0.78 * width, 300);
  const h = Math.round(w * 0.66);
  return (
    <Pressable onPress={onPress} style={{ width: w, marginRight: spacing(1.25) }}>
      <Image source={{ uri: image }} style={{ width: '100%', height: h, borderRadius: radii.lg }} />
      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
        <Text style={{ color: colors.text, fontWeight: '900', fontSize: 18 }}>{title}</Text>
        <Ionicons name="chevron-forward" size={16} color={colors.accent} style={{ marginLeft: 4 }} />
      </View>
      {subtitle ? <Text style={{ color: colors.muted }}>{subtitle}</Text> : null}
    </Pressable>
  );
}

function HeroCard({ cocktail, onPress }: { cocktail: typeof COCKTAIL_OF_THE_MONTH; onPress: () => void }) {
  const cardW = width - spacing(2) * 2;
  const cardH = Math.round(cardW * 0.56);

  return (
    <View style={{ marginHorizontal: spacing(2), borderRadius: radii.xl, overflow: 'hidden', backgroundColor: colors.card, marginBottom: spacing(1.5) }}>
      <Pressable onPress={onPress} style={{ width: cardW, height: cardH }}>
        <Image source={{ uri: cocktail.image }} style={{ width: '100%', height: '100%' }} />
      </Pressable>

      {/* gold label */}
      <View style={{ position: 'absolute', top: 10, left: 10, backgroundColor: GOLD, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999 }}>
        <Text style={{ color: '#120D07', fontWeight: '900' }}>COCKTAIL OF THE MONTH</Text>
      </View>

      <View style={{ padding: spacing(2) }}>
        <Text style={{ color: colors.text, fontSize: 28, fontWeight: '900' }}>{cocktail.name}</Text>
        <Text style={{ color: colors.muted, fontSize: 18, marginTop: 4 }}>{cocktail.description}</Text>
      </View>
    </View>
  );
}

/* ------------------------- SCREEN ------------------------- */

export default function RecipesScreen() {
  const navigation = useNavigation<Nav>();
  const { savedItems, toggleSavedCocktail, isCocktailSaved } = useSavedItems();

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [currentFilters, setCurrentFilters] = useState<Partial<FilterOptions>>({
    sortBy: 'popularity',
    sortOrder: 'desc'
  });
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [showSortModal, setShowSortModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);

  // Modal states
  const [groceryListVisible, setGroceryListVisible] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<any>(null);



  // Search functionality with debouncing and fallback
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);

    // Clear existing timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (!query.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);

    // Debounce the actual search
    searchTimeoutRef.current = setTimeout(async () => {
      try {
        // Primary search using search service
        try {
          const results = await searchService.search(query, currentFilters);
          const recipeResults = results
            .filter(item => item.category === 'recipe')
            .map(item => {
              // Find the actual recipe object from our arrays
              return ALL_COCKTAILS.find(cocktail =>
                cocktail.id === item.id ||
                cocktail.name.toLowerCase() === item.title.toLowerCase()
              ) || item.data;
            })
            .filter(Boolean);
          setSearchResults(recipeResults);
        } catch (searchError) {
          console.warn('Search service error, using fallback:', searchError);
          // Fallback: Direct string matching
          const queryLower = query.toLowerCase();
          const directResults = ALL_COCKTAILS.filter(cocktail => {
            const searchText = `${cocktail.name} ${cocktail.subtitle || ''} ${cocktail.description || ''} ${(cocktail.ingredients || []).join(' ')}`.toLowerCase();
            return searchText.includes(queryLower);
          });
          setSearchResults(directResults);
        }
      } catch (error) {
        console.error('Search error:', error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300); // 300ms debounce
  }, [currentFilters]);

  // Cleanup search timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  // Get current displayed recipes
  const getCurrentRecipes = () => {
    if (searchQuery.trim()) {
      return searchResults;
    }

    // Apply current filters to ALL_COCKTAILS
    let recipes = [...ALL_COCKTAILS];

    // Filter by ingredients/spirits
    if (currentFilters.ingredients && currentFilters.ingredients.length > 0) {
      recipes = recipes.filter(recipe => {
        const recipeText = `${recipe.name} ${recipe.subtitle || ''} ${recipe.description || ''} ${(recipe.ingredients || []).join(' ')}`.toLowerCase();
        return currentFilters.ingredients.some(ingredient =>
          recipeText.includes(ingredient.toLowerCase())
        );
      });
    }

    // Sort recipes
    if (currentFilters.sortBy) {
      recipes.sort((a, b) => {
        let comparison = 0;
        switch (currentFilters.sortBy) {
          case 'alphabetical':
            comparison = a.name.localeCompare(b.name);
            break;
          case 'difficulty_easy':
            const diffOrderEasy = { 'Easy': 1, 'Easy-Medium': 2, 'Medium': 3, 'Medium-Hard': 4, 'Hard': 5 };
            comparison = (diffOrderEasy[a.difficulty as keyof typeof diffOrderEasy] || 3) - (diffOrderEasy[b.difficulty as keyof typeof diffOrderEasy] || 3);
            break;
          case 'difficulty_hard':
            const diffOrderHard = { 'Easy': 5, 'Easy-Medium': 4, 'Medium': 3, 'Medium-Hard': 2, 'Hard': 1 };
            comparison = (diffOrderHard[a.difficulty as keyof typeof diffOrderHard] || 3) - (diffOrderHard[b.difficulty as keyof typeof diffOrderHard] || 3);
            break;
          case 'popularity':
            comparison = (b.rating || 0) - (a.rating || 0);
            break;
          case 'difficulty':
            const diffOrder = { 'Easy': 1, 'Medium': 2, 'Hard': 3 };
            comparison = (diffOrder[a.difficulty as keyof typeof diffOrder] || 2) - (diffOrder[b.difficulty as keyof typeof diffOrder] || 2);
            break;
          case 'time':
            const getTime = (timeStr: string) => parseInt(timeStr) || 0;
            comparison = getTime(a.time) - getTime(b.time);
            break;
          case 'abv':
            // Estimate ABV based on category
            const getABV = (subtitle: string) => {
              if (subtitle?.includes('Spirit-Forward')) return 35;
              if (subtitle?.includes('Shot')) return 25;
              if (subtitle?.includes('Light')) return 15;
              return 20;
            };
            comparison = getABV(a.subtitle) - getABV(b.subtitle);
            break;
          default:
            comparison = (b.rating || 0) - (a.rating || 0);
        }
        return currentFilters.sortOrder === 'asc' ? comparison : -comparison;
      });
    }

    return recipes;
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Recipes',
      headerStyle: { backgroundColor: colors.bg },
      headerTintColor: colors.text,
      headerTitleStyle: { color: colors.text, fontWeight: '900' },
      headerShadowVisible: false,
      headerLeft: () => null,
      headerRight: () => (
        <View style={{ flexDirection: 'row', gap: 16 }}>
          <Pressable hitSlop={12} onPress={() => setShowSortModal(true)}>
            <Ionicons name="funnel" size={24} color={colors.accent} />
          </Pressable>
          <Pressable hitSlop={12} onPress={() => navigation.navigate('ShoppingCart')}>
            <Ionicons name="cart" size={24} color={colors.accent} />
          </Pressable>
          <Pressable hitSlop={12} onPress={() => navigation.navigate('HomeBar')}>
            <Ionicons name="library" size={24} color={colors.accent} />
          </Pressable>
        </View>
      ),
    });
  }, [navigation]);

  const renderRecipeItem: ListRenderItem<any> = ({ item }) => {
    const cardProps = createRecipeCardProps(item, navigation, {
      toggleSavedCocktail,
      isCocktailSaved,
      setSelectedRecipe,
      setGroceryListVisible,
      showSaveButton: false,
      showCartButton: false,
      showDeleteButton: false,
    });

    return (
      <RecipeCard
        {...cardProps}
        style={{ width: (width - spacing(2) * 2 - GUTTER) / 2, marginBottom: spacing(2) }}
      />
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <StatusBar style="light" />
      <FlatList
        data={getCurrentRecipes() || []}
        keyExtractor={(item) => item.id}
        renderItem={renderRecipeItem}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: spacing(8) }}
        ListHeaderComponent={
          <View>

            {/* Search Bar */}
            <View style={{
              marginHorizontal: spacing(2),
              marginTop: spacing(2),
              marginBottom: spacing(1.5),
              backgroundColor: colors.card,
              borderRadius: radii.lg,
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: spacing(1.5)
            }}>
              <Ionicons name="search" size={20} color={colors.muted} style={{ marginRight: spacing(1) }} />
              <TextInput
                value={searchQuery}
                onChangeText={handleSearch}
                placeholder="Search cocktails by name, spirit, or ingredient..."
                placeholderTextColor={colors.muted}
                style={{
                  flex: 1,
                  color: colors.text,
                  fontSize: 16,
                  paddingVertical: spacing(1.5),
                }}
                returnKeyType="search"
                autoCapitalize="none"
                autoCorrect={false}
              />
              {searchQuery ? (
                <Pressable onPress={() => {
                  setSearchQuery('');
                  setSearchResults([]);
                }} hitSlop={8}>
                  <Ionicons name="close-circle" size={20} color={colors.muted} />
                </Pressable>
              ) : null}
            </View>


            {/* Search Results Info */}
            {searchQuery.trim() && (
              <View style={{
                marginHorizontal: spacing(2),
                marginBottom: spacing(1)
              }}>
                <Text style={{
                  color: colors.muted,
                  fontSize: 14
                }}>
                  {isSearching ? 'Searching...' : `Found ${searchResults.length} cocktail${searchResults.length !== 1 ? 's' : ''}`}
                </Text>
              </View>
            )}

            {/* Only show featured content when not searching */}
            {!searchQuery.trim() && (
              <>
                {/* Cocktail of the Month */}
                <View style={{ marginTop: spacing(1) }}>
              <HeroCard
                cocktail={COCKTAIL_OF_THE_MONTH}
                onPress={() => navigation.navigate('CocktailDetail', { cocktailId: COCKTAIL_OF_THE_MONTH.id })}
              />
            </View>

            {/* Explore by Mood (expanded) */}
            <SectionHeader title="Explore by Mood" />
            <ScrollView horizontal nestedScrollEnabled showsHorizontalScrollIndicator={false} style={{ paddingLeft: spacing(2), marginBottom: spacing(2) }}>
              {COCKTAIL_MOODS?.map((mood) => (
                <MoodCard
                  key={mood.title}
                  title={mood.title}
                  subtitle={mood.subtitle}
                  image={mood.image}
                  onPress={() => {
                    // Find cocktails by ID from all available cocktails
                    const moodCocktails = mood.cocktails.map(id => {
                      return ALL_COCKTAILS.find(cocktail =>
                        cocktail.id === id ||
                        cocktail.id === id.replace(/-/g, '') ||
                        cocktail.name.toLowerCase().replace(/[^a-z0-9]/g, '-') === id ||
                        cocktail.name.toLowerCase().replace(/[^a-z0-9]/g, '') === id.replace(/-/g, '')
                      );
                    }).filter(Boolean); // Remove any undefined matches

                    navigation.navigate('CocktailList', {
                      title: mood.title,
                      cocktails: moodCocktails,
                      category: mood.category
                    });
                  }}
                />
              ))}
            </ScrollView>

            {/* Shots */}
            <SectionHeader
              title="Shots"
              onPress={() => {
                navigation.navigate('CocktailList', {
                  title: 'Shots',
                  cocktails: ALL_SHOTS,
                  category: 'shots'
                });
              }}
            />
            <ScrollView horizontal nestedScrollEnabled showsHorizontalScrollIndicator={false} style={{ paddingLeft: spacing(2), marginBottom: spacing(2) }}>
              {PARTY_SHOTS?.slice(0, 5).map((shot) => {
                const cardProps = createRecipeCardProps(shot, navigation, {
                  toggleSavedCocktail,
                  isCocktailSaved,
                  setSelectedRecipe,
                  setGroceryListVisible,
                  showSaveButton: false,
                  showCartButton: false,
                  showDeleteButton: false,
                });
                return (
                  <RecipeCard key={shot.id} {...cardProps} style={{ width: 240, marginRight: 16 }} />
                );
              })}
            </ScrollView>

            {/* Mocktails */}
            <SectionHeader
              title="Mocktails"
              onPress={() => {
                navigation.navigate('CocktailList', {
                  title: 'Mocktails',
                  cocktails: sampleRecipes,
                  category: 'mocktails'
                });
              }}
            />
            <ScrollView horizontal nestedScrollEnabled showsHorizontalScrollIndicator={false} style={{ paddingLeft: spacing(2), marginBottom: spacing(2) }}>
              {sampleRecipes?.map((mocktail) => {
                const cardProps = createRecipeCardProps(mocktail, navigation, {
                  toggleSavedCocktail,
                  isCocktailSaved,
                  setSelectedRecipe,
                  setGroceryListVisible,
                  showSaveButton: false,
                  showCartButton: false,
                  showDeleteButton: false,
                });
                return (
                  <RecipeCard key={mocktail.id} {...cardProps} style={{ width: 240, marginRight: 16 }} />
                );
              })}
            </ScrollView>










              </>
            )}

            {/* All Cocktails Header with Filter Button */}
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginHorizontal: spacing(2),
              marginTop: spacing(2),
              marginBottom: spacing(1.5)
            }}>
              <Text style={{
                color: colors.text,
                fontSize: 24,
                fontWeight: '900'
              }}>
                All Cocktails
              </Text>
              {!searchQuery.trim() && (
                <Pressable
                  onPress={() => setShowFilterModal(true)}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: colors.card,
                    paddingHorizontal: spacing(1.5),
                    paddingVertical: spacing(1),
                    borderRadius: radii.md,
                    borderWidth: 1,
                    borderColor: colors.border
                  }}
                >
                  <Ionicons name="filter" size={16} color={colors.accent} style={{ marginRight: spacing(0.5) }} />
                  <Text style={{
                    color: colors.text,
                    fontSize: 14,
                    fontWeight: '500'
                  }}>
                    Filter
                  </Text>
                </Pressable>
              )}
            </View>

            {/* Spirit Filter Modal */}
            <Modal visible={showFilterModal} transparent animationType="fade">
              <View style={{
                flex: 1,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                justifyContent: 'center',
                alignItems: 'center',
                padding: spacing(4)
              }}>
                <View style={{
                  backgroundColor: colors.card,
                  borderRadius: radii.lg,
                  padding: spacing(4),
                  width: '100%',
                  maxWidth: 400
                }}>
                  <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: spacing(3),
                    paddingBottom: spacing(2),
                    borderBottomWidth: 1,
                    borderBottomColor: colors.border
                  }}>
                    <Text style={{
                      fontSize: 20,
                      fontWeight: '600',
                      color: colors.text
                    }}>Filter & Sort</Text>
                    <Pressable onPress={() => setShowFilterModal(false)}>
                      <Ionicons name="close" size={24} color={colors.text} />
                    </Pressable>
                  </View>

                  <Text style={{
                    fontSize: 16,
                    fontWeight: '600',
                    color: colors.text,
                    marginBottom: spacing(2)
                  }}>Sort Options</Text>

                  <Pressable
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      padding: spacing(2),
                      marginBottom: spacing(1),
                      backgroundColor: currentFilters.sortBy === 'alphabetical' ? colors.accent + '10' : 'transparent',
                      borderRadius: radii.md,
                      borderWidth: currentFilters.sortBy === 'alphabetical' ? 1 : 0,
                      borderColor: currentFilters.sortBy === 'alphabetical' ? colors.accent : 'transparent'
                    }}
                    onPress={() => {
                      setCurrentFilters(prev => ({ ...prev, sortBy: 'alphabetical', sortOrder: 'asc' }));
                    }}
                  >
                    <Ionicons
                      name="text"
                      size={20}
                      color={currentFilters.sortBy === 'alphabetical' ? colors.accent : colors.text}
                      style={{ marginRight: spacing(2) }}
                    />
                    <Text style={{
                      fontSize: 16,
                      color: currentFilters.sortBy === 'alphabetical' ? colors.accent : colors.text,
                      fontWeight: currentFilters.sortBy === 'alphabetical' ? '600' : '400'
                    }}>
                      Sort Alphabetically
                    </Text>
                  </Pressable>

                  <Pressable
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      padding: spacing(2),
                      marginBottom: spacing(1),
                      backgroundColor: currentFilters.sortBy === 'difficulty_easy' ? colors.accent + '10' : 'transparent',
                      borderRadius: radii.md,
                      borderWidth: currentFilters.sortBy === 'difficulty_easy' ? 1 : 0,
                      borderColor: currentFilters.sortBy === 'difficulty_easy' ? colors.accent : 'transparent'
                    }}
                    onPress={() => {
                      setCurrentFilters(prev => ({ ...prev, sortBy: 'difficulty_easy' }));
                    }}
                  >
                    <Ionicons
                      name="trending-up"
                      size={20}
                      color={currentFilters.sortBy === 'difficulty_easy' ? colors.accent : colors.text}
                      style={{ marginRight: spacing(2) }}
                    />
                    <Text style={{
                      fontSize: 16,
                      color: currentFilters.sortBy === 'difficulty_easy' ? colors.accent : colors.text,
                      fontWeight: currentFilters.sortBy === 'difficulty_easy' ? '600' : '400'
                    }}>
                      Easy to Hard
                    </Text>
                  </Pressable>

                  <Pressable
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      padding: spacing(2),
                      marginBottom: spacing(3),
                      backgroundColor: currentFilters.sortBy === 'difficulty_hard' ? colors.accent + '10' : 'transparent',
                      borderRadius: radii.md,
                      borderWidth: currentFilters.sortBy === 'difficulty_hard' ? 1 : 0,
                      borderColor: currentFilters.sortBy === 'difficulty_hard' ? colors.accent : 'transparent'
                    }}
                    onPress={() => {
                      setCurrentFilters(prev => ({ ...prev, sortBy: 'difficulty_hard' }));
                    }}
                  >
                    <Ionicons
                      name="trending-down"
                      size={20}
                      color={currentFilters.sortBy === 'difficulty_hard' ? colors.accent : colors.text}
                      style={{ marginRight: spacing(2) }}
                    />
                    <Text style={{
                      fontSize: 16,
                      color: currentFilters.sortBy === 'difficulty_hard' ? colors.accent : colors.text,
                      fontWeight: currentFilters.sortBy === 'difficulty_hard' ? '600' : '400'
                    }}>
                      Hard to Easy
                    </Text>
                  </Pressable>

                  <Text style={{
                    fontSize: 16,
                    fontWeight: '600',
                    color: colors.text,
                    marginBottom: spacing(2)
                  }}>Filter by Spirit</Text>

                  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: spacing(2) }}>
                    <View style={{
                      flexDirection: 'row',
                      gap: spacing(1),
                      paddingRight: spacing(2)
                    }}>
                    {['All', 'Whiskey', 'Gin', 'Vodka', 'Rum', 'Tequila', 'Cognac'].map((spirit) => {
                      const isSelected = currentFilters.ingredients?.includes(spirit.toLowerCase()) || (spirit === 'All' && !currentFilters.ingredients?.length);
                      return (
                        <Pressable
                          key={spirit}
                          onPress={() => {
                            if (spirit === 'All') {
                              setCurrentFilters({ ...currentFilters, ingredients: [] });
                            } else {
                              const ingredients = currentFilters.ingredients || [];
                              const newIngredients = ingredients.includes(spirit.toLowerCase())
                                ? ingredients.filter(i => i !== spirit.toLowerCase())
                                : [spirit.toLowerCase()];
                              setCurrentFilters({ ...currentFilters, ingredients: newIngredients });
                            }
                          }}
                          style={{
                            backgroundColor: isSelected ? colors.accent : colors.card,
                            paddingHorizontal: spacing(2),
                            paddingVertical: spacing(1.5),
                            borderRadius: radii.md,
                            borderWidth: 1,
                            borderColor: isSelected ? colors.accent : colors.border
                          }}
                        >
                          <Text style={{
                            color: isSelected ? colors.white : colors.text,
                            fontSize: 16,
                            fontWeight: isSelected ? '600' : '400'
                          }}>
                            {spirit}
                          </Text>
                        </Pressable>
                      );
                    })}
                    </View>
                  </ScrollView>

                  <Pressable
                    style={{
                      backgroundColor: colors.accent,
                      paddingVertical: spacing(1.5),
                      borderRadius: radii.md,
                      alignItems: 'center',
                      marginTop: spacing(4)
                    }}
                    onPress={() => setShowFilterModal(false)}
                  >
                    <Text style={{
                      color: colors.white,
                      fontSize: 16,
                      fontWeight: '600'
                    }}>Apply Filters</Text>
                  </Pressable>
                </View>
              </View>
            </Modal>
          </View>
        }
        columnWrapperStyle={{ paddingHorizontal: spacing(2), columnGap: GUTTER }}
      />

      {/* Modals */}

      <GroceryListModal
        visible={groceryListVisible}
        recipeName={selectedRecipe?.name || selectedRecipe?.title || 'Recipe'}
        ingredients={selectedRecipe?.ingredients || []}
        recipeId={selectedRecipe?.id}
        onClose={() => {
          setGroceryListVisible(false);
          setSelectedRecipe(null);
        }}
      />

      {/* Sort Modal */}
      <Modal visible={showSortModal} transparent animationType="fade">
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          justifyContent: 'center',
          alignItems: 'center',
          padding: spacing(4)
        }}>
          <View style={{
            backgroundColor: colors.surface,
            borderRadius: radii.lg,
            padding: spacing(4),
            width: '100%',
            maxWidth: 400,
            maxHeight: '80%'
          }}>
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: spacing(4),
              paddingBottom: spacing(3),
              borderBottomWidth: 1,
              borderBottomColor: colors.border
            }}>
              <Text style={{
                fontSize: 20,
                fontWeight: '600',
                color: colors.text,
                fontFamily: fonts.heading
              }}>Sort Recipes</Text>
              <Pressable
                onPress={() => setShowSortModal(false)}
                style={{
                  padding: spacing(1),
                  borderRadius: radii.md
                }}
              >
                <Ionicons name="close" size={24} color={colors.text} />
              </Pressable>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={{
                fontSize: 16,
                fontWeight: '600',
                color: colors.text,
                marginBottom: spacing(3),
                fontFamily: fonts.heading
              }}>Sort By</Text>

              <Pressable
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: spacing(3),
                  marginBottom: spacing(2),
                  backgroundColor: currentFilters.sortBy === 'popularity' ? colors.accent + '10' : 'transparent',
                  borderRadius: radii.md,
                  borderWidth: currentFilters.sortBy === 'popularity' ? 1 : 0,
                  borderColor: currentFilters.sortBy === 'popularity' ? colors.accent : 'transparent'
                }}
                onPress={() => {
                  setCurrentFilters(prev => ({ ...prev, sortBy: 'popularity' }));
                }}
              >
                <Ionicons
                  name="trending-up"
                  size={20}
                  color={currentFilters.sortBy === 'popularity' ? colors.accent : colors.text}
                  style={{ marginRight: spacing(3) }}
                />
                <Text style={{
                  fontSize: 16,
                  color: currentFilters.sortBy === 'popularity' ? colors.accent : colors.text,
                  fontWeight: currentFilters.sortBy === 'popularity' ? '600' : '400'
                }}>
                  Popularity
                </Text>
              </Pressable>

              <Pressable
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: spacing(3),
                  marginBottom: spacing(2),
                  backgroundColor: currentFilters.sortBy === 'difficulty' ? colors.accent + '10' : 'transparent',
                  borderRadius: radii.md,
                  borderWidth: currentFilters.sortBy === 'difficulty' ? 1 : 0,
                  borderColor: currentFilters.sortBy === 'difficulty' ? colors.accent : 'transparent'
                }}
                onPress={() => {
                  setCurrentFilters(prev => ({ ...prev, sortBy: 'difficulty' }));
                }}
              >
                <Ionicons
                  name="bar-chart"
                  size={20}
                  color={currentFilters.sortBy === 'difficulty' ? colors.accent : colors.text}
                  style={{ marginRight: spacing(3) }}
                />
                <Text style={{
                  fontSize: 16,
                  color: currentFilters.sortBy === 'difficulty' ? colors.accent : colors.text,
                  fontWeight: currentFilters.sortBy === 'difficulty' ? '600' : '400'
                }}>
                  Difficulty
                </Text>
              </Pressable>

              <Pressable
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: spacing(3),
                  marginBottom: spacing(2),
                  backgroundColor: currentFilters.sortBy === 'time' ? colors.accent + '10' : 'transparent',
                  borderRadius: radii.md,
                  borderWidth: currentFilters.sortBy === 'time' ? 1 : 0,
                  borderColor: currentFilters.sortBy === 'time' ? colors.accent : 'transparent'
                }}
                onPress={() => {
                  setCurrentFilters(prev => ({ ...prev, sortBy: 'time' }));
                }}
              >
                <Ionicons
                  name="time"
                  size={20}
                  color={currentFilters.sortBy === 'time' ? colors.accent : colors.text}
                  style={{ marginRight: spacing(3) }}
                />
                <Text style={{
                  fontSize: 16,
                  color: currentFilters.sortBy === 'time' ? colors.accent : colors.text,
                  fontWeight: currentFilters.sortBy === 'time' ? '600' : '400'
                }}>
                  Time
                </Text>
              </Pressable>

              <Pressable
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: spacing(3),
                  marginBottom: spacing(4),
                  backgroundColor: currentFilters.sortBy === 'abv' ? colors.accent + '10' : 'transparent',
                  borderRadius: radii.md,
                  borderWidth: currentFilters.sortBy === 'abv' ? 1 : 0,
                  borderColor: currentFilters.sortBy === 'abv' ? colors.accent : 'transparent'
                }}
                onPress={() => {
                  setCurrentFilters(prev => ({ ...prev, sortBy: 'abv' }));
                }}
              >
                <Ionicons
                  name="wine"
                  size={20}
                  color={currentFilters.sortBy === 'abv' ? colors.accent : colors.text}
                  style={{ marginRight: spacing(3) }}
                />
                <Text style={{
                  fontSize: 16,
                  color: currentFilters.sortBy === 'abv' ? colors.accent : colors.text,
                  fontWeight: currentFilters.sortBy === 'abv' ? '600' : '400'
                }}>
                  ABV
                </Text>
              </Pressable>

              <Text style={{
                fontSize: 16,
                fontWeight: '600',
                color: colors.text,
                marginBottom: spacing(3),
                marginTop: spacing(2),
                fontFamily: fonts.heading
              }}>Order</Text>

              <Pressable
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: spacing(3),
                  marginBottom: spacing(2),
                  backgroundColor: currentFilters.sortOrder === 'desc' ? colors.accent + '10' : 'transparent',
                  borderRadius: radii.md,
                  borderWidth: currentFilters.sortOrder === 'desc' ? 1 : 0,
                  borderColor: currentFilters.sortOrder === 'desc' ? colors.accent : 'transparent'
                }}
                onPress={() => {
                  setCurrentFilters(prev => ({ ...prev, sortOrder: 'desc' }));
                }}
              >
                <Ionicons
                  name="arrow-down"
                  size={20}
                  color={currentFilters.sortOrder === 'desc' ? colors.accent : colors.text}
                  style={{ marginRight: spacing(3) }}
                />
                <Text style={{
                  fontSize: 16,
                  color: currentFilters.sortOrder === 'desc' ? colors.accent : colors.text,
                  fontWeight: currentFilters.sortOrder === 'desc' ? '600' : '400'
                }}>
                  High to Low
                </Text>
              </Pressable>

              <Pressable
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: spacing(3),
                  marginBottom: spacing(4),
                  backgroundColor: currentFilters.sortOrder === 'asc' ? colors.accent + '10' : 'transparent',
                  borderRadius: radii.md,
                  borderWidth: currentFilters.sortOrder === 'asc' ? 1 : 0,
                  borderColor: currentFilters.sortOrder === 'asc' ? colors.accent : 'transparent'
                }}
                onPress={() => {
                  setCurrentFilters(prev => ({ ...prev, sortOrder: 'asc' }));
                }}
              >
                <Ionicons
                  name="arrow-up"
                  size={20}
                  color={currentFilters.sortOrder === 'asc' ? colors.accent : colors.text}
                  style={{ marginRight: spacing(3) }}
                />
                <Text style={{
                  fontSize: 16,
                  color: currentFilters.sortOrder === 'asc' ? colors.accent : colors.text,
                  fontWeight: currentFilters.sortOrder === 'asc' ? '600' : '400'
                }}>
                  Low to High
                </Text>
              </Pressable>
            </ScrollView>

            <View style={{
              flexDirection: 'row',
              gap: spacing(3),
              marginTop: spacing(4),
              paddingTop: spacing(3),
              borderTopWidth: 1,
              borderTopColor: colors.border
            }}>
              <Pressable
                style={{
                  flex: 1,
                  padding: spacing(3),
                  backgroundColor: colors.card,
                  borderRadius: radii.md,
                  borderWidth: 1,
                  borderColor: colors.border,
                  alignItems: 'center'
                }}
                onPress={() => {
                  setCurrentFilters({ sortBy: 'popularity', sortOrder: 'desc' });
                }}
              >
                <Text style={{
                  fontSize: 16,
                  color: colors.text,
                  fontWeight: '500'
                }}>Reset</Text>
              </Pressable>

              <Pressable
                style={{
                  flex: 1,
                  padding: spacing(3),
                  backgroundColor: colors.accent,
                  borderRadius: radii.md,
                  alignItems: 'center'
                }}
                onPress={() => setShowSortModal(false)}
              >
                <Text style={{
                  fontSize: 16,
                  color: colors.white,
                  fontWeight: '600'
                }}>Apply</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
