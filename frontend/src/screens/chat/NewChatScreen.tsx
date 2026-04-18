import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAuthStore } from '../../store/auth.store';
import { userAPI } from '../../api/user.api';
import { chatAPI } from '../../api/chat.api';
import { useChatStore } from '../../store/chat.store';

interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
}

export default function NewChatScreen() {
  const navigation = useNavigation<any>();
  const { user: currentUser } = useAuthStore();
  const { addNewChat } = useChatStore();

  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const response = await userAPI.getAllUsers();
      const allUsers = response.data || response || [];

      // Remove current user from list
      const others = allUsers.filter((u: User) => u._id !== currentUser?.id);

      setUsers(others);
      setFilteredUsers(others);
    } catch (error) {
      console.error('Failed to load users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    if (!text.trim()) {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter((u) =>
        u.name.toLowerCase().includes(text.toLowerCase()),
      );
      setFilteredUsers(filtered);
    }
  };

  const startChat = async (selectedUser: User) => {
    try {
      const response = await chatAPI.createOrGetChat(selectedUser._id);
      const newChat = response.data || response;

      // Add to chat store
      addNewChat(newChat);

      // Navigate to Chat Screen
      navigation.replace('Chat', {
        chatId: newChat._id,
        user: selectedUser,
      });
    } catch (error) {
      console.error('Failed to create chat:', error);
      alert('Failed to start chat. Please try again.');
    }
  };

  const renderUser = ({ item }: { item: User }) => (
    <TouchableOpacity
      className='flex-row items-center px-4 py-4 border-b border-gray-800'
      onPress={() => startChat(item)}
    >
      <Image
        source={{ uri: item.avatar || 'https://via.placeholder.com/150' }}
        className='w-14 h-14 rounded-full'
      />
      <View className='ml-3 flex-1'>
        <Text className='text-white font-semibold text-[17px]'>
          {item.name}
        </Text>
        <Text className='text-gray-400 text-sm'>{item.email}</Text>
      </View>
      <Ionicons name='chevron-forward' size={20} color='#666' />
    </TouchableOpacity>
  );

  return (
    <View className='flex-1 bg-[#0F0F0F]'>
      {/* Header */}
      <View className='pt-12 pb-4 px-4 bg-[#1A1A1A] flex-row items-center'>
        <TouchableOpacity onPress={() => navigation.goBack()} className='mr-4'>
          <Ionicons name='arrow-back' size={28} color='white' />
        </TouchableOpacity>
        <Text className='text-white text-2xl font-bold'>New Chat</Text>
      </View>

      {/* Search Bar */}
      <View className='px-4 py-3 bg-[#1A1A1A]'>
        <View className='flex-row items-center bg-[#2A2A2A] rounded-full px-4'>
          <Ionicons name='search' size={20} color='#888' />
          <TextInput
            value={searchQuery}
            onChangeText={handleSearch}
            placeholder='Search users...'
            placeholderTextColor='#888'
            className='flex-1 ml-3 text-white py-3'
          />
        </View>
      </View>

      {/* User List */}
      {loading ? (
        <View className='flex-1 justify-center items-center'>
          <ActivityIndicator size='large' color='#24786D' />
        </View>
      ) : (
        <FlatList
          data={filteredUsers}
          keyExtractor={(item) => item._id}
          renderItem={renderUser}
          ListEmptyComponent={
            <View className='flex-1 justify-center items-center mt-20'>
              <Text className='text-gray-400 text-lg'>No users found</Text>
            </View>
          }
        />
      )}
    </View>
  );
}
