import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons, FontAwesome, AntDesign } from '@expo/vector-icons';
import { useState } from 'react';
import { useAuthStore } from '../../store/auth.store';
import { useNavigation } from '@react-navigation/native';

export default function LoginScreen() {
  const navigation = useNavigation<any>();
  const { login, isLoading } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }

    try {
      await login(email.trim().toLowerCase(), password);
      Alert.alert('Success', 'Welcome back!');
      navigation.replace('Home'); 
    } catch (error: any) {
      Alert.alert('Login Failed', error || 'Invalid email or password');
    }
  }; 

  return (
    <View className='flex-1 bg-white px-6 pt-14'>
      {/* Back Button */}
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Ionicons name='arrow-back' size={24} color='black' />
      </TouchableOpacity>

      {/* Title */}
      <View className='mt-6'>
        <Text className='text-2xl font-bold text-black'>
          <Text className='text-[#24786D] underline'>Log in</Text> to Talkify
        </Text>
        <Text className='text-gray-500 mt-2'>
          Welcome back! Sign in using your social account or email to continue
        </Text>
      </View>

      {/* Social Buttons */}
      <View className='flex-row justify-center mt-8 space-x-6'>
        <TouchableOpacity className='w-14 h-14 rounded-full border border-gray-300 items-center justify-center'>
          <FontAwesome name='facebook' size={22} color='#1877F2' />
        </TouchableOpacity>

        <TouchableOpacity className='w-14 h-14 rounded-full border border-gray-300 items-center justify-center'>
          <AntDesign name='google' size={22} color='#EA4335' />
        </TouchableOpacity>

        <TouchableOpacity className='w-14 h-14 rounded-full border border-gray-300 items-center justify-center'>
          <Ionicons name='logo-apple' size={22} color='black' />
        </TouchableOpacity>
      </View>

      {/* Divider */}
      <View className='flex-row items-center mt-8'>
        <View className='flex-1 h-[1px] bg-gray-300' />
        <Text className='mx-3 text-gray-400'>OR</Text>
        <View className='flex-1 h-[1px] bg-gray-300' />
      </View>

      {/* Inputs */}
      <View className='mt-6 space-y-6'>
        <View>
          <Text className='text-[#24786D] mb-1'>Your email</Text>
          <TextInput
            className='border-b border-gray-300 py-2 text-black'
            value={email}
            onChangeText={setEmail}
            keyboardType='email-address'
            autoCapitalize='none'
            placeholder='example@email.com'
          />
        </View>

        <View>
          <Text className='text-[#24786D] mb-1'>Password</Text>
          <TextInput
            secureTextEntry
            className='border-b border-gray-300 py-2 text-black'
            value={password}
            onChangeText={setPassword}
          />
        </View>
      </View>

      {/* Login Button */}
      <TouchableOpacity
        className={`py-4 rounded-full mt-12 ${isLoading ? 'bg-gray-400' : 'bg-[#24786D]'}`}
        onPress={handleLogin}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color='white' />
        ) : (
          <Text className='text-center text-white font-semibold text-lg'>
            Log in
          </Text>
        )}
      </TouchableOpacity>

      {/* Forgot Password */}
      <Text className='text-center text-[#24786D] mt-4 text-base'>
        Forgot password?
      </Text>
    </View>
  );
}
