import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type AppState = 'loading' | 'splash' | 'bartending_welcome' | 'welcome' | 'onboarding' | 'survey' | 'xp_reminder' | 'main';

export function useSimpleOnboarding() {
  const [appState, setAppState] = useState<AppState>('loading');

  useEffect(() => {
    // Clear saved items and reset to splash for fresh session
    clearSavedItems();
    setAppState('splash');
  }, []);

  const clearSavedItems = async () => {
    try {
      await AsyncStorage.removeItem('savedItems');
      console.log('Cleared saved items for new session');
    } catch (error) {
      console.log('Error clearing saved items:', error);
    }
  };

  const handleSplashFinish = () => {
    // Start with bartending welcome as first step
    setAppState('bartending_welcome');
  };

  const completeBartendingWelcome = () => {
    // After bartending welcome, show welcome carousel
    setAppState('welcome');
  };

  const completeWelcome = () => {
    // After welcome carousel, show account setup
    setAppState('onboarding');
  };

  const completeOnboarding = () => {
    // After account setup, show survey
    setAppState('survey');
  };

  const completeSurvey = () => {
    // After survey, go to main app
    setAppState('main');
  };

  const skipToXPReminder = () => {
    // When user skips account setup, show XP reminder
    console.log('skipToXPReminder called');
    setAppState('xp_reminder');
  };

  const completeXPReminder = () => {
    // After XP reminder, show survey
    setAppState('survey');
  };

  const goBackToOnboarding = () => {
    // Go back from XP reminder to account setup
    setAppState('onboarding');
  };

  const resetOnboarding = () => {
    setAppState('bartending_welcome');
  };

  return {
    appState,
    handleSplashFinish,
    completeBartendingWelcome,
    completeWelcome,
    completeOnboarding,
    completeSurvey,
    skipToXPReminder,
    completeXPReminder,
    goBackToOnboarding,
    resetOnboarding,
  };
}