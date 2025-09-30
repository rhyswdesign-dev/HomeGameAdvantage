import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import LessonsStack from './LessonsStack';
import FeaturedStack from './FeaturedStack';
import GamesStack from './GamesStack';
import VaultStack from './VaultStack';
import RecipesStack from './RecipesStack';
import AuthScreen from '../screens/AuthScreen';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/tokens';

type TabsParamList = { Lessons: undefined; Featured: undefined; Games: undefined; Vault: undefined; Recipes: undefined; };
const Tab = createBottomTabNavigator<TabsParamList>();

export default function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: { backgroundColor: colors.card, borderTopColor: 'transparent' },
        tabBarActiveTintColor: colors.gold,
        tabBarInactiveTintColor: colors.muted,
        tabBarIcon: ({ color, size }) => {
          const map: Record<string, keyof typeof Ionicons.glyphMap> = {
            Lessons: 'school-outline',
            Featured: 'star-outline',
            Games: 'game-controller-outline',
            Vault: 'lock-closed-outline',
            Recipes: 'restaurant-outline',
          };
          return <Ionicons name={map[route.name]} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Lessons" component={LessonsStack} />
      <Tab.Screen name="Featured" component={FeaturedStack} />
      <Tab.Screen name="Games" component={GamesStack} />
      <Tab.Screen name="Vault" component={VaultStack} />
      <Tab.Screen name="Recipes" component={RecipesStack} />
    </Tab.Navigator>
  );
}
