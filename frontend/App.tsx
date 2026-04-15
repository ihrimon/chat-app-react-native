import { NavigationContainer } from '@react-navigation/native';
import 'react-native-reanimated';
import './global.css';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
}
