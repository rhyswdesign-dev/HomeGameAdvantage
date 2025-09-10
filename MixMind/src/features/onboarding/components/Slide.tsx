import { View, Text, Pressable } from 'react-native';
import Animated, {
  FadeInDown,
  FadeInUp,
  SlideInRight,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { useEffect } from 'react';

interface SlideProps {
  illustration?: React.ReactNode;
  title: string;
  subtitle: string;
  bullets: string[];
  ctaLabel: string;
  onPress: () => void;
}

export function Slide({
  illustration,
  title,
  subtitle,
  bullets,
  ctaLabel,
  onPress,
}: SlideProps) {
  const scaleValue = useSharedValue(0.95);
  
  useEffect(() => {
    scaleValue.value = withSpring(1, {
      damping: 15,
      stiffness: 150,
    });
  }, [scaleValue]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scaleValue.value }],
    };
  });

  return (
    <View className="flex-1 justify-center px-6">
      {/* Illustration */}
      {illustration && (
        <Animated.View 
          entering={SlideInRight.delay(100).springify()}
          className="items-center mb-8"
        >
          <Animated.View style={animatedStyle}>
            {illustration}
          </Animated.View>
        </Animated.View>
      )}

      {/* Content */}
      <View className="items-center">
        <Animated.Text 
          entering={FadeInUp.delay(200).springify()}
          className="text-white text-3xl font-bold text-center mb-3"
        >
          {title}
        </Animated.Text>
        
        <Animated.Text 
          entering={FadeInUp.delay(300).springify()}
          className="text-amber-400 text-lg font-medium text-center mb-8"
        >
          {subtitle}
        </Animated.Text>

        {/* Bullets */}
        <Animated.View 
          entering={FadeInDown.delay(400).springify()}
          className="w-full max-w-sm mb-12"
        >
          {bullets.map((bullet, index) => (
            <Animated.View
              key={index}
              entering={FadeInDown.delay(500 + index * 100).springify()}
              className="flex-row items-start mb-3"
            >
              <View className="w-2 h-2 rounded-full bg-amber-500 mt-2 mr-3 flex-shrink-0" />
              <Text className="text-gray-300 text-base flex-1">
                {bullet}
              </Text>
            </Animated.View>
          ))}
        </Animated.View>

        {/* CTA Button */}
        <Animated.View entering={FadeInUp.delay(800).springify()}>
          <Pressable
            onPress={onPress}
            className="bg-amber-600 px-8 py-4 rounded-2xl min-w-[200px]"
            style={({ pressed }) => [
              {
                opacity: pressed ? 0.9 : 1,
                transform: [{ scale: pressed ? 0.98 : 1 }],
              },
            ]}
          >
            <Text className="text-gray-900 text-lg font-bold text-center">
              {ctaLabel}
            </Text>
          </Pressable>
        </Animated.View>
      </View>
    </View>
  );
}