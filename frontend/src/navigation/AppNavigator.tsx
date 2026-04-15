import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useAuthStore } from '../store/auth.store';

import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';
import { ActivityIndicator, View } from 'react-native';

export default function AppNavigator() {
  const { isAuthenticated, isLoading, loadUser } = useAuthStore();

  // App শুরু হওয়ার সাথে সাথে user load করবে
  useEffect(() => {
    loadUser();
  }, []);

  // Loading screen while checking auth
  if (isLoading) {
    return (
      <View className='flex-1 bg-white items-center justify-center'>
        <ActivityIndicator size='large' color='#24786D' />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? <MainNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}
