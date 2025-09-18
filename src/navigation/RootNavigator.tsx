import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, components } from '../theme/tokens';
import Tabs from './Tabs';
import BarsScreen from '../screens/BarsScreen';
import AccountSetupScreen from '../screens/AccountSetupScreen';
import SpiritsScreen from '../screens/SpiritsScreen';
import EventsScreen from '../screens/EventsScreen';
import GamesScreen from '../screens/GamesScreen';
import BrandScreen from '../screens/BrandScreen';
import BarThemeScreen from '../screens/BarThemeScreen';
import BarDetailsScreen from '../screens/BarDetailsScreen';
import UntitledLoungeScreen from '../screens/bars/UntitledLoungeScreen';
import TheAlchemistScreen from '../screens/bars/TheAlchemistScreen';
import TheVelvetCurtainScreen from '../screens/bars/TheVelvetCurtainScreen';
import TheGildedLilyScreen from '../screens/bars/TheGildedLilyScreen';
import TheIronFlaskScreen from '../screens/bars/TheIronFlaskScreen';
import TheVelvetNoteScreen from '../screens/bars/TheVelvetNoteScreen';
import SkylineLoungeScreen from '../screens/bars/SkylineLoungeScreen';
import TheTikiHutScreen from '../screens/bars/TheTikiHutScreen';
import TheWineCellarScreen from '../screens/bars/TheWineCellarScreen';
import TheHiddenFlaskScreen from '../screens/bars/TheHiddenFlaskScreen';
import KingsCupScreen from '../screens/KingsCupScreen';
import GameDetailsScreen from '../screens/GameDetailsScreen';
import GarnishCompetitionScreen from '../screens/GarnishCompetitionScreen';
import CocktailSubmissionScreen from '../screens/CocktailSubmissionScreen';
import MixologyMasterClassScreen from '../screens/MixologyMasterClassScreen';
import BrandDetailScreen from '../screens/BrandDetailScreen';
import FeaturedSpiritScreen from '../screens/FeaturedSpiritScreen';
import XPTransactionScreen from '../screens/XPTransactionScreen';
import XPReminderScreen from '../screens/XPReminderScreen';
import SettingsScreen from '../screens/SettingsScreen';
import HelpSupportScreen from '../screens/HelpSupportScreen';
import PrivacyPolicyScreen from '../screens/PrivacyPolicyScreen';
import TermsOfServiceScreen from '../screens/TermsOfServiceScreen';
import FeedbackScreen from '../screens/FeedbackScreen';
import CocktailDetailScreen from '../screens/CocktailDetailScreen';
import SavedItemsScreen from '../screens/SavedItemsScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import NonAlcoholicScreen from '../screens/NonAlcoholicScreen';
import VaultScreen from '../screens/vault/VaultScreen';
// Vault screens
import VaultStoreScreen from '../screens/vault/VaultStoreScreen';
import VaultCartScreen from '../screens/vault/VaultCartScreen';
import VaultCheckoutScreen from '../screens/vault/VaultCheckoutScreen';
import VaultPaymentMethodsScreen from '../screens/vault/VaultPaymentMethodsScreen';
import VaultOrderConfirmationScreen from '../screens/vault/VaultOrderConfirmationScreen';
import VaultOrderDetailsScreen from '../screens/vault/VaultOrderDetailsScreen';
import VaultOrderHistoryScreen from '../screens/vault/VaultOrderHistoryScreen';
import VaultBillingScreen from '../screens/vault/VaultBillingScreen';
import VaultEarnXPScreen from '../screens/vault/VaultEarnXPScreen';
import LeaderboardScreen from '../screens/LeaderboardScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import CategoriesListScreen from '../screens/CategoriesListScreen';
import CategoryDetailScreen from '../screens/CategoryDetailScreen';
import UserProfileScreen from '../screens/UserProfileScreen';
import FollowersListScreen from '../screens/FollowersListScreen';
import GroupDiscoveryScreen from '../screens/GroupDiscoveryScreen';
import GroupProfileScreen from '../screens/GroupProfileScreen';
import FeaturedBarsScreen from '../screens/FeaturedBarsScreen';
import MapsDemo from '../screens/MapsDemo';
// Onboarding screens
import WelcomeScreen from '../screens/onboarding/WelcomeScreen';
import ConsentScreen from '../screens/onboarding/ConsentScreen';
import SurveyScreen from '../screens/onboarding/SurveyScreen';
import SurveyResultsScreen from '../screens/onboarding/SurveyResultsScreen';
// Lesson screens
import LessonEngineScreen from '../screens/lessons/LessonEngineScreen';
import LessonSummaryScreen from '../screens/lessons/LessonSummaryScreen';
// Commerce screens
import PricingScreen from '../screens/commerce/PricingScreen';
import CartScreen from '../screens/commerce/CartScreen';
import CheckoutScreen from '../screens/commerce/CheckoutScreen';
import OrderConfirmationScreen from '../screens/commerce/OrderConfirmationScreen';
import OrderHistoryScreen from '../screens/commerce/OrderHistoryScreen';

export type RootStackParamList = {
  Main: undefined;
  Bars: undefined;
  Spirits: undefined;
  Events: undefined;
  Games: undefined;
  GamesScreen: undefined;
  Brand: { brand: string };
  BarTheme: { theme: string };
  BarDetails: { name: string; subtitle: string; image: string; city?: string; address?: string };
  UntitledLounge: undefined;
  TheAlchemist: undefined;
  TheVelvetCurtain: undefined;
  TheGildedLily: undefined;
  TheIronFlask: undefined;
  TheVelvetNote: undefined;
  SkylineLounge: undefined;
  TheTikiHut: undefined;
  TheWineCellar: undefined;
  TheHiddenFlask: undefined;
  KingsCup: undefined;
  GameDetails: { id: string };
  AccountSetup: undefined;
  XPReminder: undefined;
  GarnishCompetition: undefined;
  CocktailSubmission: undefined;
  MixologyMasterClass: undefined;
  BrandDetail: { brandId: string };
  FeaturedSpirit: { spiritId: string; tier: 'bronze' | 'silver' | 'gold' };
  XPTransaction: undefined;
  Settings: undefined;
  HelpSupport: undefined;
  PrivacyPolicy: undefined;
  TermsOfService: undefined;
  Feedback: undefined;
  CocktailDetail: { cocktailId: string };
  SavedItems: { category: 'bars' | 'spirits' | 'cocktails' | 'events' | 'communities' };
  EditProfile: undefined;
  NonAlcoholic: undefined;
  Vault: undefined;
  VaultStore: undefined;
  VaultCart: undefined;
  VaultCheckout: undefined;
  VaultPaymentMethods: undefined;
  VaultOrderConfirmation: { orderId: string; total: number };
  VaultOrderDetails: { orderId: string };
  VaultOrderHistory: undefined;
  VaultBilling: undefined;
  VaultEarnXP: undefined;
  Leaderboard: undefined;
  Notifications: undefined;
  CategoriesList: undefined;
  CategoryDetail: { categoryId: string; categoryName: string };
  UserProfile: { userId: string; isOwnProfile?: boolean };
  FollowersList: { userId: string; type: 'followers' | 'following' };
  GroupDiscovery: undefined;
  GroupProfile: { groupId: string };
  FeaturedBar: { barId: string };
  MapsDemo: undefined;
  // Onboarding screens
  Welcome: undefined;
  Consent: undefined;
  Survey: undefined;
  SurveyResults: { answers: any };
  // Lesson screens
  LessonEngine: { moduleId?: string; lessonId?: string; isFirstLesson?: boolean };
  LessonSummary: { xpAwarded: number; correctCount: number; totalCount: number; masteryDelta: number; moduleId?: string; lessonId?: string; isFirstLesson?: boolean };
  // Commerce screens
  Pricing: undefined;
  Cart: undefined;
  Checkout: undefined;
  PaymentMethods: undefined;
  AddPaymentMethod: undefined;
  OrderConfirmation: { orderId: string };
  OrderDetails: { orderId: string };
  OrderHistory: undefined;
  Billing: undefined;
  AddAddress: { addressId?: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <Stack.Navigator 
      screenOptions={{ 
        headerShown: false,
        headerStyle: components.header,
        headerTintColor: colors.headerText,
        headerTitleStyle: components.headerText,
        headerShadowVisible: false,
        animation: 'fade',
        animationDuration: 200,
      }}
    >
      <Stack.Screen name="Main" component={Tabs} />
      <Stack.Screen name="Bars" component={BarsScreen} options={{ headerShown: true, title: 'Featured Bars' }} />
      <Stack.Screen name="Spirits" component={SpiritsScreen} options={{ headerShown: true, title: 'Featured Spirits' }} />
      <Stack.Screen name="Events" component={EventsScreen} options={{ headerShown: true, title: 'Events' }} />
      <Stack.Screen name="Games" component={GamesScreen} options={{ headerShown: true, title: 'Games' }} />
      <Stack.Screen name="Brand" component={BrandScreen} options={({ route }) => ({ headerShown: true, title: route.params.brand })} />
      <Stack.Screen name="BarTheme" component={BarThemeScreen} options={({ route }) => ({ headerShown: true, title: route.params.theme })} />
      <Stack.Screen name="BarDetails" component={BarDetailsScreen} options={({ route }) => ({ headerShown: true, title: route.params.name })} />
      <Stack.Screen name="UntitledLounge" component={UntitledLoungeScreen} options={({ navigation }) => ({ 
        headerShown: true, 
        title: 'Untitled Champagne Lounge',
        headerStyle: components.header,
        headerTintColor: colors.headerText,
        headerTitleStyle: components.headerText,
        headerShadowVisible: false,
        headerLeft: () => null,
        headerRight: () => (
          <Pressable hitSlop={12} onPress={() => { /* Save bar functionality will be handled in screen */ }}>
            <Ionicons name="bookmark-outline" size={24} color={colors.headerText} />
          </Pressable>
        ),
      })} />
      <Stack.Screen name="TheAlchemist" component={TheAlchemistScreen} options={({ navigation }) => ({ 
        headerShown: true, 
        title: 'The Alchemist',
        headerStyle: components.header,
        headerTintColor: colors.headerText,
        headerTitleStyle: components.headerText,
        headerShadowVisible: false,
        headerLeft: () => null,
      })} />
      <Stack.Screen name="TheVelvetCurtain" component={TheVelvetCurtainScreen} options={({ navigation }) => ({ 
        headerShown: true, 
        title: 'The Velvet Curtain',
        headerStyle: components.header,
        headerTintColor: colors.headerText,
        headerTitleStyle: components.headerText,
        headerShadowVisible: false,
        headerLeft: () => null,
      })} />
      <Stack.Screen name="TheGildedLily" component={TheGildedLilyScreen} options={({ navigation }) => ({ 
        headerShown: true, 
        title: 'The Gilded Lily',
        headerStyle: components.header,
        headerTintColor: colors.headerText,
        headerTitleStyle: components.headerText,
        headerShadowVisible: false,
        headerLeft: () => null,
      })} />
      <Stack.Screen name="TheIronFlask" component={TheIronFlaskScreen} options={({ navigation }) => ({ 
        headerShown: true, 
        title: 'The Iron Flask',
        headerStyle: components.header,
        headerTintColor: colors.headerText,
        headerTitleStyle: components.headerText,
        headerShadowVisible: false,
        headerLeft: () => null,
      })} />
      <Stack.Screen name="TheVelvetNote" component={TheVelvetNoteScreen} options={({ navigation }) => ({ 
        headerShown: true, 
        title: 'The Velvet Note',
        headerStyle: components.header,
        headerTintColor: colors.headerText,
        headerTitleStyle: components.headerText,
        headerShadowVisible: false,
        headerLeft: () => null,
      })} />
      <Stack.Screen name="SkylineLounge" component={SkylineLoungeScreen} options={({ navigation }) => ({ 
        headerShown: true, 
        title: 'Skyline Lounge',
        headerStyle: components.header,
        headerTintColor: colors.headerText,
        headerTitleStyle: components.headerText,
        headerShadowVisible: false,
        headerLeft: () => null,
      })} />
      <Stack.Screen name="TheTikiHut" component={TheTikiHutScreen} options={({ navigation }) => ({ 
        headerShown: true, 
        title: 'The Tiki Hut',
        headerStyle: components.header,
        headerTintColor: colors.headerText,
        headerTitleStyle: components.headerText,
        headerShadowVisible: false,
        headerLeft: () => null,
      })} />
      <Stack.Screen name="TheWineCellar" component={TheWineCellarScreen} options={({ navigation }) => ({ 
        headerShown: true, 
        title: 'The Wine Cellar',
        headerStyle: components.header,
        headerTintColor: colors.headerText,
        headerTitleStyle: components.headerText,
        headerShadowVisible: false,
        headerLeft: () => null,
      })} />
      <Stack.Screen name="TheHiddenFlask" component={TheHiddenFlaskScreen} options={({ navigation }) => ({ 
        headerShown: true, 
        title: 'The Hidden Flask',
        headerStyle: components.header,
        headerTintColor: colors.headerText,
        headerTitleStyle: components.headerText,
        headerShadowVisible: false,
        headerLeft: () => null,
      })} />
      <Stack.Screen name="KingsCup" component={KingsCupScreen} options={({ navigation }) => ({ 
        headerShown: true, 
        title: "King's Cup",
        headerStyle: components.header,
        headerTintColor: colors.headerText,
        headerTitleStyle: components.headerText,
        headerShadowVisible: false,
        headerLeft: () => null,
        headerRight: () => (
          <Pressable hitSlop={12} onPress={() => { /* Save game */ }}>
            <Ionicons name="bookmark-outline" size={24} color={colors.headerText} />
          </Pressable>
        ),
      })} />
      <Stack.Screen name="GameDetails" component={GameDetailsScreen} options={({ route, navigation }) => ({ 
        headerShown: true, 
        title: 'Game Details',
        headerStyle: components.header,
        headerTintColor: colors.headerText,
        headerTitleStyle: components.headerText,
        headerShadowVisible: false,
        headerLeft: () => null,
        headerRight: () => (
          <Pressable hitSlop={12} onPress={() => { /* Save game */ }}>
            <Ionicons name="bookmark-outline" size={24} color={colors.headerText} />
          </Pressable>
        ),
      })} />
      <Stack.Screen name="AccountSetup" component={AccountSetupScreen} options={{ headerShown:false }} />
      <Stack.Screen name="XPReminder" component={XPReminderScreen} options={{ headerShown: false }} />
      <Stack.Screen name="GarnishCompetition" component={GarnishCompetitionScreen} options={{ headerShown: false }} />
      <Stack.Screen name="CocktailSubmission" component={CocktailSubmissionScreen} options={{ headerShown: false }} />
      <Stack.Screen name="MixologyMasterClass" component={MixologyMasterClassScreen} options={{ headerShown: false }} />
      <Stack.Screen 
        name="BrandDetail" 
        component={BrandDetailScreen} 
        options={{
          headerShown: true,
          headerTransparent: true,
          headerTitle: '',
          headerTintColor: '#FFFFFF',
          headerStyle: {
            backgroundColor: 'transparent',
          },
        }}
      />
      <Stack.Screen 
        name="FeaturedSpirit" 
        component={FeaturedSpiritScreen} 
        options={{
          headerShown: true,
          headerTransparent: true,
          headerTitle: '',
          headerTintColor: '#FFFFFF',
          headerStyle: {
            backgroundColor: 'transparent',
          },
        }}
      />
      <Stack.Screen name="XPTransaction" component={XPTransactionScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Settings" component={SettingsScreen} options={{ headerShown: true, title: 'Settings' }} />
      <Stack.Screen name="HelpSupport" component={HelpSupportScreen} options={{ headerShown: true, title: 'Help & Support' }} />
      <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} options={{ headerShown: true, title: 'Privacy Policy' }} />
      <Stack.Screen name="TermsOfService" component={TermsOfServiceScreen} options={{ headerShown: true, title: 'Terms of Service' }} />
      <Stack.Screen name="Feedback" component={FeedbackScreen} options={{ headerShown: true, title: 'Feedback' }} />
      <Stack.Screen name="CocktailDetail" component={CocktailDetailScreen} options={{ headerShown: true, title: 'Cocktail' }} />
      <Stack.Screen name="SavedItems" component={SavedItemsScreen} options={{ headerShown: true, title: 'Saved Items' }} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} options={{ headerShown: true, title: 'Edit Profile' }} />
      <Stack.Screen name="NonAlcoholic" component={NonAlcoholicScreen} options={{ headerShown: true, title: 'Non-Alcoholic' }} />
    <Stack.Screen name="Vault" component={VaultScreen} options={{ headerShown: true, title: 'Vault' }} />
    {/* Vault Economy Screens */}
    <Stack.Screen name="VaultStore" component={VaultStoreScreen} options={{ headerShown: true, title: 'Keys & Boosters' }} />
    <Stack.Screen name="VaultCart" component={VaultCartScreen} options={{ headerShown: true, title: 'Cart' }} />
    <Stack.Screen name="VaultCheckout" component={VaultCheckoutScreen} options={{ headerShown: true, title: 'Checkout' }} />
    <Stack.Screen name="VaultPaymentMethods" component={VaultPaymentMethodsScreen} options={{ headerShown: true, title: 'Payment Methods' }} />
    <Stack.Screen name="VaultOrderConfirmation" component={VaultOrderConfirmationScreen} options={{ headerShown: true, title: 'Order Confirmed' }} />
    <Stack.Screen name="VaultOrderDetails" component={VaultOrderDetailsScreen} options={{ headerShown: true, title: 'Order Details' }} />
    <Stack.Screen name="VaultOrderHistory" component={VaultOrderHistoryScreen} options={{ headerShown: true, title: 'Order History' }} />
    <Stack.Screen name="VaultBilling" component={VaultBillingScreen} options={{ headerShown: true, title: 'Billing' }} />
    <Stack.Screen name="VaultEarnXP" component={VaultEarnXPScreen} options={{ headerShown: true, title: 'Earn XP' }} />
    <Stack.Screen name="Leaderboard" component={LeaderboardScreen} options={{ headerShown: true, title: 'Leaderboard' }} />
    <Stack.Screen name="Notifications" component={NotificationsScreen} options={{ headerShown: true, title: 'Notifications' }} />
    <Stack.Screen name="CategoriesList" component={CategoriesListScreen} options={{ headerShown: true, title: 'Categories' }} />
    <Stack.Screen name="CategoryDetail" component={CategoryDetailScreen} options={{ headerShown: true, title: 'Category' }} />
    <Stack.Screen name="UserProfile" component={UserProfileScreen} options={{ headerShown: true, title: 'Profile' }} />
    <Stack.Screen name="FollowersList" component={FollowersListScreen} options={{ headerShown: true, title: 'Followers' }} />
    <Stack.Screen name="GroupDiscovery" component={GroupDiscoveryScreen} options={{ headerShown: true, title: 'Discover Groups' }} />
    <Stack.Screen name="GroupProfile" component={GroupProfileScreen} options={{ headerShown: true, title: 'Group' }} />
    <Stack.Screen name="FeaturedBar" component={FeaturedBarsScreen} options={{ headerShown: true, title: 'Featured Bar' }} />
    <Stack.Screen name="MapsDemo" component={MapsDemo} options={{ headerShown: true, title: 'Maps Demo' }} />
    {/* Onboarding screens */}
    <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ headerShown: false }} />
    <Stack.Screen name="Consent" component={ConsentScreen} options={{ headerShown: false }} />
    <Stack.Screen name="Survey" component={SurveyScreen} options={{ headerShown: false }} />
    <Stack.Screen name="SurveyResults" component={SurveyResultsScreen} options={{ headerShown: false }} />
    {/* Lesson screens */}
    <Stack.Screen name="LessonEngine" component={LessonEngineScreen} options={{ headerShown: false }} />
    <Stack.Screen name="LessonSummary" component={LessonSummaryScreen} options={{ headerShown: false }} />
    {/* Commerce screens */}
    <Stack.Screen name="Pricing" component={PricingScreen} options={{ headerShown: true, title: 'Premium' }} />
    <Stack.Screen name="Cart" component={CartScreen} options={{ headerShown: true, title: 'Cart' }} />
    <Stack.Screen name="Checkout" component={CheckoutScreen} options={{ headerShown: true, title: 'Checkout' }} />
    <Stack.Screen name="OrderConfirmation" component={OrderConfirmationScreen} options={{ headerShown: true, title: 'Order Confirmed' }} />
    <Stack.Screen name="OrderHistory" component={OrderHistoryScreen} options={{ headerShown: true, title: 'Order History' }} />
</Stack.Navigator>
  );
}