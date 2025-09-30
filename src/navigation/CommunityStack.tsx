import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CommunityScreen from '../screens/CommunityScreen';

export type CommunityStackParamList = {
  CommunityMain: undefined;
};

const Stack = createNativeStackNavigator<CommunityStackParamList>();

export default function CommunityStack() {
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
      <Stack.Screen name="CommunityMain" component={CommunityScreen} options={{ title: 'Community' }} />
    </Stack.Navigator>
  );
}