// src/screens/chat/HomeScreen.tsx
import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const statusData = [
  {
    id: '1',
    name: 'My status',
    image: 'https://randomuser.me/api/portraits/men/1.jpg',
    isOwn: true,
  },
  {
    id: '2',
    name: 'Adil',
    image: 'https://randomuser.me/api/portraits/men/32.jpg',
  },
  {
    id: '3',
    name: 'Marina',
    image: 'https://randomuser.me/api/portraits/women/44.jpg',
  },
  {
    id: '4',
    name: 'Dean',
    image: 'https://randomuser.me/api/portraits/men/45.jpg',
  },
  {
    id: '5',
    name: 'Max',
    image: 'https://randomuser.me/api/portraits/men/67.jpg',
  },
];

const chatData = [
  {
    id: '1',
    name: 'Alex Linderson',
    message: 'How are you today?',
    time: '2 min ago',
    unread: 3,
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
  },
  {
    id: '2',
    name: 'Team Align',
    message: "Don't miss to attend the meeting.",
    time: '2 min ago',
    unread: 4,
    avatar: 'https://randomuser.me/api/portraits/men/86.jpg',
    isGroup: true,
  },
  {
    id: '3',
    name: 'John Abraham',
    message: 'Hey! Can you join the meeting?',
    time: '2 min ago',
    unread: 0,
    avatar: 'https://randomuser.me/api/portraits/men/33.jpg',
  },
  {
    id: '4',
    name: 'Sabila Sayma',
    message: 'How are you today?',
    time: '2 min ago',
    unread: 0,
    avatar: 'https://randomuser.me/api/portraits/women/22.jpg',
  },
  {
    id: '5',
    name: 'John Borino',
    message: 'Have a good day 🌸',
    time: '2 min ago',
    unread: 0,
    avatar: 'https://randomuser.me/api/portraits/men/41.jpg',
  },
];

export default function HomeScreen() {
  const renderStatus = ({ item }: any) => (
    <TouchableOpacity className='items-center mr-4'>
      <View className='relative'>
        <Image
          source={{ uri: item.image }}
          className='w-16 h-16 rounded-full border-2 border-[#24786D]'
        />
        {item.isOwn && (
          <View className='absolute bottom-0 right-0 bg-[#24786D] rounded-full p-1'>
            <Ionicons name='add' size={14} color='white' />
          </View>
        )}
      </View>
      <Text className='text-white text-xs mt-1'>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderChat = ({ item }: any) => (
    <TouchableOpacity className='flex-row items-center px-4 py-3 border-b border-gray-800'>
      <Image source={{ uri: item.avatar }} className='w-12 h-12 rounded-full' />

      <View className='flex-1 ml-3'>
        <View className='flex-row justify-between'>
          <Text className='text-white font-semibold text-base'>
            {item.name}
          </Text>
          <Text className='text-gray-400 text-xs'>{item.time}</Text>
        </View>
        <Text className='text-gray-400 text-sm mt-0.5' numberOfLines={1}>
          {item.message}
        </Text>
      </View>

      {item.unread > 0 && (
        <View className='bg-[#24786D] w-6 h-6 rounded-full items-center justify-center'>
          <Text className='text-white text-xs font-bold'>{item.unread}</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <View className='flex-1 bg-[#0F0F0F]'>
      <StatusBar barStyle='light-content' backgroundColor='#0F0F0F' />

      {/* Header */}
      <View className='flex-row items-center justify-between px-4 pt-12 pb-4 bg-[#0F0F0F]'>
        <Text className='text-white text-2xl font-bold'>Home</Text>
        <View className='flex-row items-center gap-4'>
          <TouchableOpacity>
            <Ionicons name='search' size={24} color='white' />
          </TouchableOpacity>
          <TouchableOpacity>
            <Image
              source={{ uri: 'https://randomuser.me/api/portraits/men/1.jpg' }}
              className='w-9 h-9 rounded-full'
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Status / Stories Row */}
      <View className='bg-[#1A1A1A] py-4'>
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
      <FlatList
        data={chatData}
        keyExtractor={(item) => item.id}
        renderItem={renderChat}
        className='flex-1'
        contentContainerStyle={{ paddingBottom: 80 }}
      />

      {/* Bottom Navigation */}
      <View className='flex-row justify-around items-center bg-[#1A1A1A] py-3 border-t border-gray-800 absolute bottom-0 left-0 right-0'>
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
  );
}
