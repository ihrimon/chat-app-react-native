import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/auth/LoginScreen';
import HomeScreen from '../screens/chat/HomeScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const isLoggedIn = false;

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isLoggedIn ? (
        <Stack.Screen name='Login' component={LoginScreen} />
      ) : (
        <Stack.Screen name='Home' component={HomeScreen} />
      )}
    </Stack.Navigator>
  );
}
