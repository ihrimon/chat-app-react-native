import { View, Text, TextInput, TouchableOpacity } from 'react-native';

export default function LoginScreen() {
  return (
    <View className='flex-1 bg-white px-6 justify-center'>
      <Text className='text-3xl font-bold mb-8 text-center'>Welcome Back</Text>

      <TextInput
        placeholder='Email'
        className='border border-gray-300 rounded-xl px-4 py-3 mb-4'
      />

      <TextInput
        placeholder='Password'
        secureTextEntry
        className='border border-gray-300 rounded-xl px-4 py-3 mb-6'
      />

      <TouchableOpacity className='bg-blue-600 rounded-xl py-4'>
        <Text className='text-white text-center font-semibold'>Login</Text>
      </TouchableOpacity>
    </View>
  );
}
