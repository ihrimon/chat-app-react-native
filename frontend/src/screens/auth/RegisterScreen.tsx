import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { useAuthStore } from '../../store/auth.store';
import { useNavigation } from '@react-navigation/native';

export default function RegisterScreen() {
  const navigation = useNavigation<any>();
  const { register, isLoading } = useAuthStore();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  
  const handleRegister = async () => {
    console.log('RegisterScreen rendered', name, email, password, confirmPassword);
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    try {
      await register({ name, email, password, confirmPassword });
      Alert.alert('Success', 'Account created successfully!');

      navigation.replace('MainNavigator');
    } catch (error: any) {
      Alert.alert('Registration Failed', error);
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
          Sign up with <Text className='text-[#24786D] underline'>Email</Text>
        </Text>
        <Text className='text-gray-500 mt-2'>
          Get chatting with friends and family today by signing up for our chat
          app!
        </Text>
      </View>

      {/* Inputs */}
      <View className='mt-8 space-y-6'>
        <View>
          <Text className='text-[#24786D] mb-1'>Your name</Text>
          <TextInput
            className='border-b border-gray-300 py-2 text-black'
            value={name}
            onChangeText={setName}
            placeholder='John Doe'
          />
        </View>

        <View>
          <Text className='text-[#24786D] mb-1'>Your email</Text>
          <TextInput
            className='border-b border-gray-300 py-2 text-black'
            value={email}
            onChangeText={setEmail}
            keyboardType='email-address'
            autoCapitalize='none'
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

        <View>
          <Text className='text-[#24786D] mb-1'>Confirm Password</Text>
          <TextInput
            secureTextEntry
            className='border-b border-gray-300 py-2 text-black'
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
        </View>
      </View>

      <TouchableOpacity
        className={`py-4 rounded-full mt-12 ${isLoading ? 'bg-gray-400' : 'bg-[#24786D]'}`}
        onPress={handleRegister}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color='white' />
        ) : (
          <Text className='text-center text-white font-semibold text-lg'>
            Create an account
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
}
