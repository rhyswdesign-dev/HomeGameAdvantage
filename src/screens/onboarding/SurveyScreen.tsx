/**
 * Survey Screen - 15-question placement survey
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/RootNavigator';
import { Survey } from '../../components/onboarding/Survey';
import { SurveyAnswers } from '../../services/placement';

type SurveyScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Survey'>;
};

export default function SurveyScreen({ navigation }: SurveyScreenProps) {
  const handleSurveyComplete = (answers: SurveyAnswers) => {
    // Navigate to results screen with answers
    navigation.navigate('SurveyResults', { answers });
  };

  return (
    <View style={styles.container}>
      <Survey onComplete={handleSurveyComplete} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});