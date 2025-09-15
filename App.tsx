import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import RootNavigator from './src/navigation/RootNavigator';
import SplashScreen from './src/screens/SplashScreen';
import BartendingWelcomeScreen from './src/screens/BartendingWelcomeScreen';
import AccountSetupScreen from './src/screens/AccountSetupScreen';
import XPReminderScreen from './src/screens/XPReminderScreen';
import WelcomeCarouselScreen from './src/screens/WelcomeCarouselScreen';
import { useSimpleOnboarding as useOnboarding } from './src/hooks/useSimpleOnboarding';
import { UserProvider } from './src/contexts/UserContext';
import { VaultProvider } from './src/contexts/VaultContext';

export default function App() {
  const { appState, handleSplashFinish, completeBartendingWelcome, completeWelcome, completeOnboarding, skipToXPReminder, completeXPReminder, goBackToOnboarding } = useOnboarding();
  
  console.log('App state:', appState);

  // Show splash screen
  if (appState === 'loading' || appState === 'splash') {
    return <SplashScreen onFinish={handleSplashFinish} />;
  }

  // Show bartending welcome (first step)
  if (appState === 'bartending_welcome') {
    return <BartendingWelcomeScreen onComplete={completeBartendingWelcome} />;
  }

  // Show welcome carousel
  if (appState === 'welcome') {
    return <WelcomeCarouselScreen onComplete={completeWelcome} />;
  }

  // Show account setup after welcome carousel
  if (appState === 'onboarding') {
    return <AccountSetupScreen onComplete={completeOnboarding} onSkip={skipToXPReminder} />;
  }

  // Show XP reminder after skipping account setup
  if (appState === 'xp_reminder') {
    return <XPReminderScreen onComplete={completeXPReminder} onGoBack={goBackToOnboarding} />;
  }

  // Show main app
  return (
    <UserProvider>
      <VaultProvider>
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
      </VaultProvider>
    </UserProvider>
  );
}