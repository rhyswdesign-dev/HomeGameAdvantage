import { createNativeStackNavigator } from '@react-navigation/native-stack';
import FeaturedScreen from '../screens/FeaturedScreen';
import BarsScreen from '../screens/BarsScreen';
import SpiritsScreen from '../screens/SpiritsScreen';
import EventsScreen from '../screens/EventsScreen';
import GamesScreen from '../screens/GamesScreen';
import BrandScreen from '../screens/BrandScreen';
import BarThemeScreen from '../screens/BarThemeScreen';
import BarDetailsScreen from '../screens/BarDetailsScreen';
import UntitledLoungeScreen from '../screens/bars/UntitledLoungeScreen';

export type RootStackParamList = {
  Featured: undefined;
  Bars: undefined;
  Spirits: undefined;
  Events: undefined;
  Games: undefined;
  Brand: { brand: string };
  BarTheme: { theme: string };
  BarDetails: { name: string; subtitle: string; image: string };
  UntitledLounge: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <Stack.Navigator 
      screenOptions={{ 
        headerShown: false,
        headerStyle: { backgroundColor: '#2a211c' },
        headerTintColor: '#f4e6d0',
        headerTitleStyle: { color: '#f4e6d0', fontWeight: '800' },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen name="Featured" component={FeaturedScreen} />
      <Stack.Screen name="Bars" component={BarsScreen} options={{ headerShown: true, title: 'Featured Bars' }} />
      <Stack.Screen name="Spirits" component={SpiritsScreen} options={{ headerShown: true, title: 'Featured Spirits' }} />
      <Stack.Screen name="Events" component={EventsScreen} options={{ headerShown: true, title: 'Events' }} />
      <Stack.Screen name="Games" component={GamesScreen} options={{ headerShown: true, title: 'Games' }} />
      <Stack.Screen name="Brand" component={BrandScreen} options={({ route }) => ({ headerShown: true, title: route.params.brand })} />
      <Stack.Screen name="BarTheme" component={BarThemeScreen} options={({ route }) => ({ headerShown: true, title: route.params.theme })} />
      <Stack.Screen name="BarDetails" component={BarDetailsScreen} options={({ route }) => ({ headerShown: true, title: route.params.name })} />
      <Stack.Screen name="UntitledLounge" component={UntitledLoungeScreen} options={{ headerShown: true, title: 'Untitled Champagne Lounge' }} />
    </Stack.Navigator>
  );
}