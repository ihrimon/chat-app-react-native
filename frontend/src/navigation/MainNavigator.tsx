import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/auth/LoginScreen';

// import HomeScreen from '../screens/chat/HomeScreen';
// import ChatScreen from '../screens/chat/ChatScreen';
// import ProfileScreen from '../screens/chat/ProfileScreen';

const Stack = createNativeStackNavigator();

export default function MainNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name='Home' component={LoginScreen} />
      {/* <Stack.Screen name='Chat' component={ChatScreen} />
      <Stack.Screen name='Profile' component={ProfileScreen} /> */}
    </Stack.Navigator>
  );
}
