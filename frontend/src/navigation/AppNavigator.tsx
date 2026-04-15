import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useAuthStore } from '../store/auth.store';
import * as SplashScreen from 'expo-splash-screen'; // ← যোগ করো
import SplashScreenComponent from '../screens/auth/SplashScreen';
import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';
import OnboardingScreen from '../screens/chat/OnboardingScreen';

export default function AppNavigator() {
  const { isLoading, isAuthenticated, hasSeenOnboarding, loadUser } =
    useAuthStore();

  useEffect(() => {
    const initializeApp = async () => {
      await loadUser(); 

      if (!isLoading) {
        await SplashScreen.hideAsync().catch(console.error);
      }
    };

    initializeApp();
  }, [loadUser, isLoading]); 

  if (isLoading) {
    return <SplashScreenComponent />;
  }

  return (
    <NavigationContainer>
      {!hasSeenOnboarding ? (
        <OnboardingScreen />
      ) : isAuthenticated ? (
        <MainNavigator />
      ) : (
        <AuthNavigator />
      )}
    </NavigationContainer>
  );
}
