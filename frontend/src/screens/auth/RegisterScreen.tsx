import { View, Text, TextInput, TouchableOpacity } from 'react-native';

export default function RegisterScreen({ navigation }: any) {
  return (
    <View className='flex-1 bg-white px-6 justify-center'>
      <Text className='text-3xl font-bold mb-8 text-center'>Register</Text>

      <TextInput
        placeholder='Name'
        className='border border-gray-300 rounded-xl px-4 py-3 mb-4'
      />

      <TextInput
        placeholder='Email'
        className='border border-gray-300 rounded-xl px-4 py-3 mb-4'
      />

      <TextInput
        placeholder='Password'
        secureTextEntry
        className='border border-gray-300 rounded-xl px-4 py-3 mb-6'
      />

      <TouchableOpacity className='bg-blue-600 rounded-xl py-4 mb-4'>
        <Text className='text-white text-center font-semibold'>Register</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text className='text-center text-blue-600'>
          Already have an account? Login
        </Text>
      </TouchableOpacity>
    </View>
  );
}
