import { View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface FooterNavProps {
  onSkip?: () => void;
  onBack?: () => void;
  onNext?: () => void;
  onDone?: () => void;
  showSkip?: boolean;
  showBack?: boolean;
  showNext?: boolean;
  showDone?: boolean;
}

export function FooterNav({
  onSkip,
  onBack,
  onNext,
  onDone,
  showSkip = false,
  showBack = false,
  showNext = false,
  showDone = false,
}: FooterNavProps) {
  return (
    <>
      {/* Skip Button (Top Right) */}
      {showSkip && onSkip && (
        <View className="absolute top-12 right-6 z-10">
          <Pressable
            onPress={onSkip}
            className="px-4 py-2 rounded-full bg-gray-800/50"
            style={({ pressed }) => [
              { opacity: pressed ? 0.7 : 1 }
            ]}
          >
            <Text className="text-gray-400 font-medium">Skip</Text>
          </Pressable>
        </View>
      )}

      {/* Footer Navigation */}
      <SafeAreaView className="absolute bottom-0 left-0 right-0" edges={['bottom']}>
        <View className="flex-row justify-between items-center px-6 py-4">
          {/* Back Button */}
          {showBack && onBack ? (
            <Pressable
              onPress={onBack}
              className="flex-row items-center px-4 py-2"
              style={({ pressed }) => [
                { opacity: pressed ? 0.7 : 1 }
              ]}
            >
              <Text className="text-gray-400 font-medium">← Back</Text>
            </Pressable>
          ) : (
            <View />
          )}

          {/* Next/Done Button */}
          {showNext && onNext ? (
            <Pressable
              onPress={onNext}
              className="bg-amber-600 px-6 py-3 rounded-xl"
              style={({ pressed }) => [
                { 
                  opacity: pressed ? 0.9 : 1,
                  transform: [{ scale: pressed ? 0.98 : 1 }]
                }
              ]}
            >
              <Text className="text-gray-900 font-bold">Next →</Text>
            </Pressable>
          ) : showDone && onDone ? (
            <Pressable
              onPress={onDone}
              className="bg-amber-600 px-8 py-3 rounded-xl"
              style={({ pressed }) => [
                { 
                  opacity: pressed ? 0.9 : 1,
                  transform: [{ scale: pressed ? 0.98 : 1 }]
                }
              ]}
            >
              <Text className="text-gray-900 font-bold">Done</Text>
            </Pressable>
          ) : (
            <View />
          )}
        </View>
      </SafeAreaView>
    </>
  );
}