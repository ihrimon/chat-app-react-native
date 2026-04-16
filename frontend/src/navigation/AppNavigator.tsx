import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useAuthStore } from '../store/auth.store';
import * as SplashScreen from 'expo-splash-screen';

import SplashScreenComponent from '../screens/auth/SplashScreen';
import AuthNavigator from './AuthNavigator'; 
import MainNavigator from './MainNavigator';

export default function AppNavigator() {
  const { isLoading, isAuthenticated, hasSeenOnboarding, loadUser } =
    useAuthStore();

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  useEffect(() => {
    if (!isLoading) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [isLoading]);

  if (isLoading) {
    return <SplashScreenComponent />;
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? <MainNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}
