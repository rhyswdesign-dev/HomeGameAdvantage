/**
 * Lesson Engine Screen - Main lesson learning interface
 */

import React, { useLayoutEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/RootNavigator';
import { LessonEngine } from '../../components/engine/LessonEngine';
import { useUser } from '../../store/useUser';

type LessonEngineScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'LessonEngine'>;
  route: RouteProp<RootStackParamList, 'LessonEngine'>;
};

export default function LessonEngineScreen({ navigation, route }: LessonEngineScreenProps) {
  const { lessonId, isFirstLesson, moduleId } = route.params;
  const { lives } = useUser();

  useLayoutEffect(() => {
    // Disable swipe back gesture for lessons to prevent bypassing hearts system
    navigation.setOptions({
      gestureEnabled: false,
      headerShown: false
    });
  }, [navigation]);

  const handleLessonComplete = (results: {
    xpAwarded: number;
    correctCount: number;
    totalCount: number;
    masteryDelta: number;
  }) => {
    // Navigate to lesson summary
    navigation.navigate('LessonSummary', {
      ...results,
      moduleId,
      lessonId,
      isFirstLesson
    });
  };

  const handleExit = () => {
    // Return to main app or module overview
    navigation.navigate('Main');
  };

  return (
    <View style={styles.container}>
      <LessonEngine
        lessonId={lessonId}
        onComplete={handleLessonComplete}
        onExit={handleExit}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});