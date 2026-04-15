import { Ionicons } from '@expo/vector-icons';
import { useEffect } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

export default function SplashScreenComponent() {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.6);

  useEffect(() => {
    opacity.value = withTiming(1, {
      duration: 800,
      easing: Easing.out(Easing.ease),
    });
    scale.value = withTiming(1, {
      duration: 1000,
      easing: Easing.out(Easing.back(1.5)),
    });
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return (
    <View className='flex-1 items-center justify-center bg-[#24786D]'>
      <Animated.View style={animatedStyle} className='items-center'>
        <Ionicons name='chatbubbles-outline' size={90} color='white' />
        <Text className='text-white text-5xl font-bold mt-4 tracking-widest'>
          Talkify
        </Text>
        <ActivityIndicator color='white' size='large' className='mt-10' />
      </Animated.View>
    </View>
  );
}
