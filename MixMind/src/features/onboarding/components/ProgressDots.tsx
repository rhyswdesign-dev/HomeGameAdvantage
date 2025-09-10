import { View, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolateColor,
} from 'react-native-reanimated';
import { useEffect } from 'react';

interface ProgressDotsProps {
  total: number;
  current: number;
  onPress: (index: number) => void;
}

function ProgressDot({ 
  isActive, 
  onPress 
}: { 
  isActive: boolean; 
  onPress: () => void; 
}) {
  const animationProgress = useSharedValue(isActive ? 1 : 0);
  
  useEffect(() => {
    animationProgress.value = withSpring(isActive ? 1 : 0, {
      damping: 15,
      stiffness: 200,
    });
  }, [isActive, animationProgress]);

  const animatedStyle = useAnimatedStyle(() => {
    const scale = 1 + animationProgress.value * 0.2;
    const backgroundColor = interpolateColor(
      animationProgress.value,
      [0, 1],
      ['rgba(156, 163, 175, 0.4)', '#f59e0b'] // gray-400 to amber-500
    );

    return {
      transform: [{ scale }],
      backgroundColor,
    };
  });

  return (
    <Pressable onPress={onPress} className="p-2">
      <Animated.View 
        className="w-3 h-3 rounded-full"
        style={animatedStyle}
      />
    </Pressable>
  );
}

export function ProgressDots({ total, current, onPress }: ProgressDotsProps) {
  return (
    <View className="flex-row justify-center items-center py-6 gap-2">
      {Array.from({ length: total }, (_, index) => (
        <ProgressDot
          key={index}
          isActive={index === current}
          onPress={() => onPress(index)}
        />
      ))}
    </View>
  );
}