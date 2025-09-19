import { useState, useEffect } from 'react';

type AppState = 'loading' | 'splash' | 'bartending_welcome' | 'welcome' | 'onboarding' | 'survey' | 'xp_reminder' | 'main';

export function useSimpleOnboarding() {
  const [appState, setAppState] = useState<AppState>('loading');
  
  useEffect(() => {
    // Reset to splash for fresh testing
    setAppState('splash');
  }, []);

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