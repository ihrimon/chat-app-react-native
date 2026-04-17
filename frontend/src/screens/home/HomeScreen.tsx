// src/screens/chat/HomeScreen.tsx
import React, { useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAuthStore } from '../../store/auth.store';
import { useChatStore } from '../../store/chat.store';
import avatar from '../../assets/avatar.png';

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const { user } = useAuthStore();
  const { chats, isLoading, fetchChats } = useChatStore();

  useEffect(() => {
    fetchChats();
  }, []);

  // Status / Stories Row Data
  const statusData = [
    {
      id: 'my',
      name: 'My status',
      image: avatar,
      isOwn: true,
    },
    ...chats.slice(0, 6).map((chat: any) => ({
      id: chat._id,
      name: chat.otherUser?.name?.split(' ')[0] || 'User',
      image: chat.otherUser?.avatar || {avatar},
    })),
  ];

  const renderStatus = ({ item }: any) => (
    <TouchableOpacity className='items-center mr-4'>
      <View className='relative'>
        <Image
          source={{ uri: item.image }}
          className='w-16 h-16 rounded-full border-2 border-[#24786D]'
        />
        {item.isOwn && (
          <View className='absolute bottom-0 right-0 bg-[#24786D] rounded-full p-0.5'>
            <Ionicons name='add' size={16} color='white' />
          </View>
        )}
      </View>
      <Text className='text-white text-xs mt-1.5 font-medium'>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderChatItem = ({ item }: any) => {
    const otherUser = item.otherUser || {};
    const lastMsg = item.lastMessage?.text || 'No messages yet';

    return (
      <TouchableOpacity
        className='flex-row items-center px-4 py-4 border-b border-gray-800 active:bg-gray-900'
        onPress={() =>
          navigation.navigate('Chat', {
            chatId: item._id,
            user: otherUser,
          })
        }
      >
        <Image
          source={{
            uri: otherUser.avatar || avatar,
          }}
          className='w-14 h-14 rounded-full'
        />

        <View className='flex-1 ml-3'>
          <View className='flex-row justify-between items-center'>
            <Text className='text-white font-semibold text-[17px]'>
              {otherUser.name || 'Unknown User'}
            </Text>
            <Text className='text-gray-400 text-xs'>
              {item.updatedAt
                ? new Date(item.updatedAt).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                : ''}
            </Text>
          </View>

          <Text className='text-gray-400 text-sm mt-0.5' numberOfLines={1}>
            {lastMsg}
          </Text>
        </View>

        {item.unreadCount && item.unreadCount > 0 && (
          <View className='bg-[#24786D] min-w-[20px] h-5 rounded-full items-center justify-center px-1.5'>
            <Text className='text-white text-xs font-bold'>
              {item.unreadCount}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View className='flex-1 bg-[#0F0F0F]'>
      <StatusBar barStyle='light-content' backgroundColor='#0F0F0F' />

      {/* Header */}
      <View className='flex-row items-center justify-between px-4 pt-12 pb-4 bg-[#0F0F0F]'>
        <Text className='text-white text-2xl font-bold tracking-tight'>
          Talkify
        </Text>
        <View className='flex-row items-center gap-5'>
          <TouchableOpacity>
            <Ionicons name='search' size={24} color='#fff' />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
            <Image
              source={{
                uri: avatar,
              }}
              className='w-9 h-9 rounded-full border border-gray-700'
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Status / Stories Row */}
      <View className='bg-[#1A1A1A] py-4 border-b border-gray-800'>
        <FlatList
          data={statusData}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          renderItem={renderStatus}
          contentContainerStyle={{ paddingHorizontal: 16 }}
        />
      </View>

      {/* Chat List */}
      {isLoading ? (
        <View className='flex-1 justify-center items-center'>
          <ActivityIndicator size='large' color='#24786D' />
          <Text className='text-gray-400 mt-4'>Loading chats...</Text>
        </View>
      ) : (
        <FlatList
          data={chats}
          keyExtractor={(item) => item._id}
          renderItem={renderChatItem}
          ListEmptyComponent={
            <View className='flex-1 justify-center items-center mt-20'>
              <Ionicons
                name='chatbubble-ellipses-outline'
                size={60}
                color='#555'
              />
              <Text className='text-gray-400 text-lg mt-6'>
                No conversations yet
              </Text>
              <Text className='text-gray-500 text-sm mt-2 text-center px-10'>
                Start a new chat by tapping the + button
              </Text>
            </View>
          }
        />
      )}

      {/* Floating Action Button (New Chat) */}
      <TouchableOpacity
        className='absolute bottom-20 right-6 bg-[#24786D] w-14 h-14 rounded-2xl items-center justify-center shadow-2xl'
        onPress={() => navigation.navigate('NewChat')} // পরবর্তীতে তৈরি করব
      >
        <Ionicons name='add' size={32} color='white' />
      </TouchableOpacity>

      {/* Bottom Navigation Bar */}
      <View className='absolute bottom-0 left-0 right-0 bg-[#1A1A1A] border-t border-gray-800'>
        <View className='flex-row justify-around items-center py-3'>
          <TouchableOpacity className='items-center'>
            <Ionicons name='chatbubble-ellipses' size={28} color='#24786D' />
            <Text className='text-[#24786D] text-xs mt-1 font-medium'>
              Message
            </Text>
          </TouchableOpacity>

          <TouchableOpacity className='items-center'>
            <Ionicons name='call' size={28} color='#888' />
            <Text className='text-gray-400 text-xs mt-1'>Calls</Text>
          </TouchableOpacity>

          <TouchableOpacity className='items-center'>
            <Ionicons name='people' size={28} color='#888' />
            <Text className='text-gray-400 text-xs mt-1'>Contacts</Text>
          </TouchableOpacity>

          <TouchableOpacity className='items-center'>
            <Ionicons name='settings' size={28} color='#888' />
            <Text className='text-gray-400 text-xs mt-1'>Settings</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
