import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import LessonsScreen from '../screens/LessonsScreen';
import FeaturedScreen from '../screens/FeaturedScreen';
import CommunityScreen from '../screens/CommunityScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/tokens';

type TabsParamList = { Lessons: undefined; Featured: undefined; Community: undefined; Profile: undefined; };
const Tab = createBottomTabNavigator<TabsParamList>();

export default function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerTitleAlign: 'center',
        headerStyle: { backgroundColor: colors.bg },
        headerTintColor: colors.text,
        tabBarStyle: { backgroundColor: colors.card, borderTopColor: 'transparent' },
        tabBarActiveTintColor: colors.gold,
        tabBarInactiveTintColor: colors.muted,
        tabBarIcon: ({ color, size }) => {
          const map: Record<string, keyof typeof Ionicons.glyphMap> = {
            Lessons: 'school-outline',
            Featured: 'star-outline',
            Community: 'people-outline',
            Profile: 'person-circle-outline',
          };
          return <Ionicons name={map[route.name]} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Lessons" component={LessonsScreen} />
      <Tab.Screen name="Featured" component={FeaturedScreen} />
      <Tab.Screen name="Community" component={CommunityScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
