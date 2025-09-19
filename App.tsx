import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import RootNavigator from './src/navigation/RootNavigator';
import SplashScreen from './src/screens/SplashScreen';
import BartendingWelcomeScreen from './src/screens/BartendingWelcomeScreen';
import AccountSetupScreen from './src/screens/AccountSetupScreen';
import XPReminderScreen from './src/screens/XPReminderScreen';
import WelcomeCarouselScreen from './src/screens/WelcomeCarouselScreen';
import SurveyScreen from './src/screens/onboarding/SurveyScreen';
import { useSimpleOnboarding as useOnboarding } from './src/hooks/useSimpleOnboarding';
import { UserProvider } from './src/contexts/UserContext';
import { VaultProvider } from './src/contexts/VaultContext';
import { FirebaseProvider } from './src/context/FirebaseContext';
import { AnalyticsProvider } from './src/context/AnalyticsContext';
import { MonetizationProvider } from './src/context/MonetizationContext';
import { isNetworkError } from './src/config/firebase';

// Override console.error to filter out Firebase offline errors
const originalConsoleError = console.error;
console.error = (...args: any[]) => {
  const message = args[0];
  
  // Filter out Firebase offline/network related errors
  if (
    typeof message === 'string' && (
      message.includes('Failed to get document because the client is offline') ||
      message.includes('Firebase connection failed') ||
      message.includes('FirebaseError: Failed to get document because the client is offline')
    )
  ) {
    // Silently ignore offline errors
    return;
  }
  
  // Check if it's a Firebase error object
  if (args.length > 0 && isNetworkError(args[0])) {
    return;
  }
  
  // Log all other errors normally
  originalConsoleError.apply(console, args);
};

export default function App() {
  const { appState, handleSplashFinish, completeBartendingWelcome, completeWelcome, completeOnboarding, completeSurvey, skipToXPReminder, completeXPReminder, goBackToOnboarding } = useOnboarding();
  
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

  // Show survey before main app
  if (appState === 'survey') {
    return <SurveyScreen onComplete={completeSurvey} />;
  }

  // Show main app
  return (
    <AnalyticsProvider>
      <FirebaseProvider>
        <MonetizationProvider>
          <UserProvider>
            <VaultProvider>
              <NavigationContainer>
                <RootNavigator />
              </NavigationContainer>
            </VaultProvider>
          </UserProvider>
        </MonetizationProvider>
      </FirebaseProvider>
    </AnalyticsProvider>
  );
}