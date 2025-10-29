import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import LessonsStack from './LessonsStack';
import FeaturedStack from './FeaturedStack';
import VaultStack from './VaultStack';
import RecipesStack from './RecipesStack';
import ProfileStack from './ProfileStack';
import AuthScreen from '../screens/AuthScreen';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/tokens';

type TabsParamList = { Lessons: undefined; Recipes: undefined; Featured: undefined; Vault: undefined; Profile: undefined; };
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
            Recipes: 'restaurant-outline',
            Featured: 'star-outline',
            Vault: 'lock-closed-outline',
            Profile: 'person-outline',
          };
          return <Ionicons name={map[route.name]} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Lessons" component={LessonsStack} />
      <Tab.Screen name="Recipes" component={RecipesStack} />
      <Tab.Screen name="Featured" component={FeaturedStack} />
      <Tab.Screen name="Vault" component={VaultStack} />
      <Tab.Screen name="Profile" component={ProfileStack} />
    </Tab.Navigator>
  );
}
