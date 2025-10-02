import { createNativeStackNavigator } from '@react-navigation/native-stack';
import VaultStoreScreen from '../screens/vault/VaultStoreScreen';

export type VaultStackParamList = {
  VaultMain: undefined;
};

const Stack = createNativeStackNavigator<VaultStackParamList>();

export default function VaultStack() {
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
      <Stack.Screen name="VaultMain" component={VaultStoreScreen} options={{ title: 'Vault' }} />
    </Stack.Navigator>
  );
}