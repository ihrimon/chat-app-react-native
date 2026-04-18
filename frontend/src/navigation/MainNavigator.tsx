import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ChatScreen from '../screens/chat/ChatScreen';
import HomeScreen from '@/screens/home/HomeScreen';
import NewChatScreen from '@/screens/chat/NewChatScreen';

const Stack = createNativeStackNavigator();

export default function MainNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName='Home'
    >
      <Stack.Screen name='Home' component={HomeScreen} />
      <Stack.Screen name='Chat' component={ChatScreen} />
      <Stack.Screen name='NewChat' component={NewChatScreen} />
    </Stack.Navigator>
  );
}
