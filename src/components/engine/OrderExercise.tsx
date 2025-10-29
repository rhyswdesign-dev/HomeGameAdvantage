/**
 * Order Exercise Component
 * Drag-to-reorder interface with clean design
 */

import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, Animated as RNAnimated } from 'react-native';
import { GestureHandlerRootView, PanGestureHandler, PanGestureHandlerGestureEvent } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { Item } from '../../types/domain';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radii } from '../../theme/tokens';
import { LinearGradient } from 'expo-linear-gradient';

export type ExerciseCommonProps = {
  item: Item;
  onResult: (res: { correct: boolean; msToAnswer: number }) => void;
  disabled?: boolean;
};

const ITEM_HEIGHT = 70;

type DraggableItemProps = {
  item: string;
  index: number;
  currentOrder: string[];
  onReorder: (fromIndex: number, toIndex: number) => void;
  submitted: boolean;
  disabled: boolean;
  animValue: RNAnimated.Value;
};

function DraggableItem({ item: itemText, index, currentOrder, onReorder, submitted, disabled, animValue }: DraggableItemProps) {
  const translateY = useSharedValue(0);
  const isDragging = useSharedValue(false);
  const startY = useSharedValue(0);

  const onGestureEvent = (event: PanGestureHandlerGestureEvent) => {
    'worklet';
    if (submitted || disabled) return;

    const { translationY, state } = event.nativeEvent;

    // BEGAN
    if (state === 2) {
      isDragging.value = true;
      startY.value = translateY.value;
    }

    // ACTIVE
    if (state === 4) {
      translateY.value = startY.value + translationY;
    }

    // END
    if (state === 5) {
      const dragDistance = translationY;
      const itemsMoved = Math.round(dragDistance / ITEM_HEIGHT);
      const newIndex = Math.max(0, Math.min(currentOrder.length - 1, index + itemsMoved));

      if (newIndex !== index) {
        runOnJS(onReorder)(index, newIndex);
      }

      translateY.value = withSpring(0);
      isDragging.value = false;
    }
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
      zIndex: isDragging.value ? 100 : 0,
      opacity: isDragging.value ? 0.9 : 1,
      elevation: isDragging.value ? 8 : 0,
    };
  });

  return (
    <PanGestureHandler onGestureEvent={onGestureEvent} enabled={!submitted && !disabled}>
      <Animated.View style={[styles.itemContainer, animatedStyle]}>
        <RNAnimated.View
          style={{
            opacity: animValue,
            transform: [{
              scale: animValue,
            }],
          }}
        >
          <View style={styles.orderItem}>
            <LinearGradient
              colors={['rgba(255, 255, 255, 0.08)', 'rgba(255, 255, 255, 0.02)']}
              style={styles.itemGradient}
            >
              <View style={styles.itemContent}>
                <View style={styles.dragHandle}>
                  <Ionicons
                    name="reorder-three"
                    size={24}
                    color={submitted || disabled ? colors.subtext : colors.gold}
                  />
                </View>
                <Text style={styles.itemText}>{itemText}</Text>
              </View>
            </LinearGradient>
          </View>
        </RNAnimated.View>
      </Animated.View>
    </PanGestureHandler>
  );
}

export default function OrderExercise({ item, onResult, disabled = false }: ExerciseCommonProps): React.JSX.Element {
  const [currentOrder, setCurrentOrder] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [startTime] = useState(Date.now());

  const fadeAnim = useRef(new RNAnimated.Value(1)).current;
  const itemAnims = useRef((item.orderTarget || []).map(() => new RNAnimated.Value(1))).current;

  // Reset state when item changes
  useEffect(() => {
    setSubmitted(false);

    if (item.orderTarget) {
      const shuffled = [...item.orderTarget].sort(() => Math.random() - 0.5);
      setCurrentOrder(shuffled);
    }

    // Reset and start animations
    fadeAnim.setValue(0);
    itemAnims.forEach(anim => anim.setValue(0));

    RNAnimated.parallel([
      RNAnimated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      RNAnimated.stagger(60,
        itemAnims.map(anim =>
          RNAnimated.spring(anim, {
            toValue: 1,
            tension: 80,
            friction: 8,
            useNativeDriver: true,
          })
        )
      ),
    ]).start();
  }, [item.id]);

  const handleSubmit = () => {
    if (submitted || disabled) return;

    const isCorrect = arraysEqual(currentOrder, item.orderTarget || []);
    const timeToAnswer = Date.now() - startTime;

    setSubmitted(true);

    setTimeout(() => {
      onResult({ correct: isCorrect, msToAnswer: timeToAnswer });
    }, 800);
  };

  const handleReorder = (fromIndex: number, toIndex: number) => {
    if (submitted || disabled) return;

    const newOrder = [...currentOrder];
    const [movedItem] = newOrder.splice(fromIndex, 1);
    newOrder.splice(toIndex, 0, movedItem);
    setCurrentOrder(newOrder);
  };

  const arraysEqual = (a: string[], b: string[]): boolean => {
    return a.length === b.length && a.every((val, index) => val === b[index]);
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <RNAnimated.View
        style={[
          styles.container,
          {
            opacity: fadeAnim,
          },
        ]}
      >
        <Text style={styles.prompt}>{item.prompt}</Text>

        <View style={styles.orderContainer}>
          {currentOrder.map((step, index) => (
            <DraggableItem
              key={`${step}-${index}`}
              item={step}
              index={index}
              currentOrder={currentOrder}
              onReorder={handleReorder}
              submitted={submitted}
              disabled={disabled}
              animValue={itemAnims[index]}
            />
          ))}
        </View>

        {!submitted && (
          <Pressable
            style={[styles.submitButton, disabled && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={disabled}
          >
            <LinearGradient
              colors={!disabled
                ? [colors.gold, colors.accent]
                : ['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)']
              }
              style={styles.submitGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={[
                styles.submitText,
                disabled && styles.submitTextDisabled
              ]}>
                Check My Order
              </Text>
            </LinearGradient>
          </Pressable>
        )}
      </RNAnimated.View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  prompt: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: spacing(4),
    lineHeight: 30,
    textAlign: 'left',
    color: colors.text,
    letterSpacing: -0.3,
  },
  orderContainer: {
    gap: spacing(1.5),
    marginBottom: spacing(4),
  },
  itemContainer: {
    marginBottom: spacing(0.5),
  },
  orderItem: {
    borderRadius: radii.lg,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  itemGradient: {
    paddingVertical: spacing(2.5),
    paddingHorizontal: spacing(3),
  },
  itemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing(2),
  },
  dragHandle: {
    marginRight: spacing(1),
  },
  itemText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22,
    color: colors.text,
  },
  submitButton: {
    borderRadius: radii.lg,
    overflow: 'hidden',
    shadowColor: colors.gold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  submitButtonDisabled: {
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  submitGradient: {
    paddingVertical: spacing(4),
    paddingHorizontal: spacing(4),
    alignItems: 'center',
  },
  submitText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.goldText,
    letterSpacing: 0.3,
  },
  submitTextDisabled: {
    color: colors.subtext,
  },
});
