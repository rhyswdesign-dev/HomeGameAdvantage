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
import KingsCupScreen from '../screens/KingsCupScreen';
import GameDetailsScreen from '../screens/GameDetailsScreen';
import GarnishCompetitionScreen from '../screens/GarnishCompetitionScreen';
import CocktailSubmissionScreen from '../screens/CocktailSubmissionScreen';
import MixologyMasterClassScreen from '../screens/MixologyMasterClassScreen';
import BrandDetailScreen from '../screens/BrandDetailScreen';
import FeaturedBarScreen from '../screens/FeaturedBarScreen';
import FeaturedSpiritScreen from '../screens/FeaturedSpiritScreen';
import ExploreScreen from '../screens/ExploreScreen';
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
import VaultScreen from '../screens/VaultScreen';
import LeaderboardScreen from '../screens/LeaderboardScreen';
import NotificationsScreen from '../screens/NotificationsScreen';

export type RootStackParamList = {
  Main: undefined;
  Explore: undefined;
  Bars: undefined;
  Spirits: undefined;
  Events: undefined;
  Games: undefined;
  GamesScreen: undefined;
  Brand: { brand: string };
  BarTheme: { theme: string };
  BarDetails: { name: string; subtitle: string; image: string; city?: string; address?: string };
  UntitledLounge: undefined;
  KingsCup: undefined;
  GameDetails: { id: string };
  AccountSetup: undefined;
  XPReminder: undefined;
  GarnishCompetition: undefined;
  CocktailSubmission: undefined;
  MixologyMasterClass: undefined;
  BrandDetail: { brandId: string };
  FeaturedBar: { barId: string; tier?: 'bronze' | 'silver' | 'gold' };
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
  Vault: undefined;
  Leaderboard: undefined;
  Notifications: undefined;
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
        animation: 'slide_from_right',
        animationDuration: 300,
      }}
    >
      <Stack.Screen name="Main" component={Tabs} />
      <Stack.Screen name="Explore" component={ExploreScreen} options={{ headerShown: true, title: 'Explore' }} />
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
        headerLeft: () => (
          <Pressable hitSlop={12} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={colors.headerText} />
          </Pressable>
        ),
        headerRight: () => (
          <Pressable hitSlop={12} onPress={() => { /* Save bar functionality will be handled in screen */ }}>
            <Ionicons name="bookmark-outline" size={24} color={colors.headerText} />
          </Pressable>
        ),
      })} />
      <Stack.Screen name="KingsCup" component={KingsCupScreen} options={({ navigation }) => ({ 
        headerShown: true, 
        title: "King's Cup",
        headerStyle: components.header,
        headerTintColor: colors.headerText,
        headerTitleStyle: components.headerText,
        headerShadowVisible: false,
        headerLeft: () => (
          <Pressable hitSlop={12} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={colors.headerText} />
          </Pressable>
        ),
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
        headerLeft: () => (
          <Pressable hitSlop={12} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={colors.headerText} />
          </Pressable>
        ),
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
        name="FeaturedBar" 
        component={FeaturedBarScreen} 
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
    <Stack.Screen name="Vault" component={VaultScreen} options={{ headerShown: true, title: 'Vault' }} />
    <Stack.Screen name="Leaderboard" component={LeaderboardScreen} options={{ headerShown: true, title: 'Leaderboard' }} />
    <Stack.Screen name="Notifications" component={NotificationsScreen} options={{ headerShown: true, title: 'Notifications' }} />
</Stack.Navigator>
  );
}