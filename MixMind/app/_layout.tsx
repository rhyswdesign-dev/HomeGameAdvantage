import '../global.css';
import { useEffect } from 'react';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useSession } from '../src/stores/useSession';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      cacheTime: 1000 * 60 * 30, // 30 minutes
    },
  },
});

function RootLayoutNav() {
  const router = useRouter();
  const onboardingCompleted = useSession((state) => state.onboardingCompleted);

  useEffect(() => {
    // Gate the main app based on onboarding completion
    if (onboardingCompleted === false) {
      router.replace('/onboarding');
    }
  }, [onboardingCompleted, router]);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
        animation: 'slide_from_right',
      }}
    />
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <StatusBar style="light" backgroundColor="#111827" />
        <RootLayoutNav />
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}