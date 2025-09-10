import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSession } from '../src/stores/useSession';
import { Pressable } from 'react-native';

export default function HomePage() {
  const resetOnboarding = useSession((state) => state.resetOnboarding);

  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      <View className="flex-1 justify-center items-center px-4">
        <Text className="text-white text-3xl font-bold mb-4">
          Welcome to MixMind! 🍸
        </Text>
        <Text className="text-gray-400 text-lg text-center mb-8">
          Your ultimate bar & spirits companion is ready to go.
        </Text>
        
        {/* Debug button to reset onboarding */}
        <Pressable
          onPress={resetOnboarding}
          className="bg-amber-600 px-6 py-3 rounded-xl"
        >
          <Text className="text-gray-900 font-bold">
            Reset Onboarding (Debug)
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}