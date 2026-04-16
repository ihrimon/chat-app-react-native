import { AntDesign, FontAwesome, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Text, TouchableOpacity, View } from 'react-native';
import { useAuthStore } from '../../store/auth.store';
import { useNavigation } from '@react-navigation/native';

export default function OnboardingScreen() {
  const navigation = useNavigation<any>();
  const { setHasSeenOnboarding } = useAuthStore();

  const handleGetStarted = () => {
    setHasSeenOnboarding(true); 
    navigation.navigate('Register');
  };

  const handleLogin = () => {
    setHasSeenOnboarding(true);
    navigation.navigate('Login');
  };

  return (
    <LinearGradient
      colors={['#3A1C71', '#1F1C2C', '#000000']}
      className='flex-1 px-6 justify-between py-12'
    >
      {/* Top Logo */}
      <View className='items-center'>
        <Text className='text-white text-lg font-semibold'>Talkify</Text>
      </View>

      {/* Main Content */}
      <View>
        <Text className='text-white text-5xl font-bold leading-tight'>
          Connect friends easily & quickly
        </Text>

        <Text className='text-gray-300 mt-4 text-base'>
          Our chat app is the perfect way to stay connected with friends and
          family.
        </Text>

        {/* Social Icons */}
        <View className='flex-row justify-center mt-8 space-x-6'>
          <TouchableOpacity className='w-14 h-14 rounded-full border border-gray-500 items-center justify-center'>
            <FontAwesome name='facebook' size={22} color='#1877F2' />
          </TouchableOpacity>

          <TouchableOpacity className='w-14 h-14 rounded-full border border-gray-500 items-center justify-center'>
            <AntDesign name='google' size={22} color='#EA4335' />
          </TouchableOpacity>

          <TouchableOpacity className='w-14 h-14 rounded-full border border-gray-500 items-center justify-center'>
            <Ionicons name='logo-apple' size={22} color='#fff' />
          </TouchableOpacity>
        </View>

        {/* Divider */}
        <View className='flex-row items-center mt-8'>
          <View className='flex-1 h-[1px] bg-gray-600' />
          <Text className='mx-3 text-gray-400'>OR</Text>
          <View className='flex-1 h-[1px] bg-gray-600' />
        </View>

        {/* Signup Button */}
        <TouchableOpacity
          onPress={handleGetStarted}
          className='bg-white py-4 rounded-full mt-8'
        >
          <Text className='text-center text-black font-semibold text-base'>
            Sign up with mail
          </Text>
        </TouchableOpacity>
      </View>

      {/* Bottom Login */}
      <View className='items-center'>
        <Text className='text-gray-400'>
          Existing account?{' '}
          <Text onPress={handleLogin} className='text-white font-semibold'>
            Log in
          </Text>
        </Text>
      </View>
    </LinearGradient>
  );
}
