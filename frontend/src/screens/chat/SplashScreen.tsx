import { View, Text } from 'react-native';
import { useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';

export default function SplashScreen({ navigation }: any) {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.6);

  useEffect(() => {
    // animation start
    opacity.value = withTiming(1, {
      duration: 800,
      easing: Easing.out(Easing.ease),
    });

    scale.value = withTiming(1, {
      duration: 800,
      easing: Easing.out(Easing.back(1.5)),
    });

    // navigate after 3 sec
    const timer = setTimeout(() => {
      navigation.replace('Onboarding');
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ scale: scale.value }],
    };
  });

  return (
    <View className='flex-1 items-center justify-center bg-white'>
      <Animated.View
        style={animatedStyle}
        className='items-center justify-center'
      >
        <Ionicons name='chatbubbles-outline' size={80} color='#24786D'/>

        <Text className='text-5xl font-bold mt-3 text-[#24786D]'>Talkify</Text>
      </Animated.View>
    </View>
  );
}
