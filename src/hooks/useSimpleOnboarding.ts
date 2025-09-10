import { useState, useEffect } from 'react';

type AppState = 'loading' | 'splash' | 'bartending_welcome' | 'welcome' | 'onboarding' | 'xp_reminder' | 'main';

export function useSimpleOnboarding() {
  const [appState, setAppState] = useState<AppState>('loading');
  
  useEffect(() => {
    // For now, always show onboarding after splash
    // You can add AsyncStorage later once we confirm this works
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
    // After account setup, go to main app
    setAppState('main');
  };

  const skipToXPReminder = () => {
    // When user skips account setup, show XP reminder
    console.log('skipToXPReminder called');
    setAppState('xp_reminder');
  };

  const completeXPReminder = () => {
    // After XP reminder, go to main app
    setAppState('main');
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
    skipToXPReminder,
    completeXPReminder,
    goBackToOnboarding,
    resetOnboarding,
  };
}