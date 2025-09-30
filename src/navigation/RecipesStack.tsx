import { createNativeStackNavigator } from '@react-navigation/native-stack';
import RecipesScreen from '../screens/RecipesScreen';

export type RecipesStackParamList = {
  RecipesMain: undefined;
};

const Stack = createNativeStackNavigator<RecipesStackParamList>();

export default function RecipesStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: '#1A0F0B' },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: { color: '#FFFFFF', fontWeight: '900' },
        animation: 'slide_from_right',
        animationDuration: 200,
      }}
    >
      <Stack.Screen name="RecipesMain" component={RecipesScreen} options={{ title: 'Recipes' }} />
    </Stack.Navigator>
  );
}