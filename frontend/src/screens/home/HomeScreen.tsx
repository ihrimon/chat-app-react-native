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
import { useAuthStore } from '../../store/auth.store';
import { useChatStore } from '../../store/chat.store';
import { useNavigation } from '@react-navigation/native';
import avatar from '../../assets/avatar.png';

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const { user } = useAuthStore();
  const { chats, isLoading, fetchChats } = useChatStore();

  useEffect(() => {
    fetchChats();
  }, []);

  const renderChatItem = ({ item }: any) => {
    const otherUser =
      item.otherUser || item.members?.find((m: any) => m._id !== user?.id);

    return (
      <TouchableOpacity
        className='flex-row items-center px-4 py-4 border-b border-gray-800'
        onPress={() =>
          navigation.navigate('Chat', { chatId: item._id, user: otherUser })
        }
      >
        <Image
          source={{
            uri: otherUser?.avatar || {avatar},
          }}
          className='w-14 h-14 rounded-full'
        />

        <View className='flex-1 ml-3'>
          <View className='flex-row justify-between'>
            <Text className='text-white font-semibold text-[17px]'>
              {otherUser?.name || 'Unknown User'}
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
            {item.lastMessage?.text || 'No messages yet'}
          </Text>
        </View>

        {item.unreadCount && item.unreadCount > 0 && (
          <View className='bg-[#24786D] w-6 h-6 rounded-full items-center justify-center'>
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
      <StatusBar barStyle='light-content' />

      {/* Header */}
      <View className='px-4 pt-12 pb-4 bg-[#0F0F0F] flex-row justify-between items-center'>
        <Text className='text-white text-2xl font-bold'>Talkify</Text>
        <View className='flex-row items-center gap-4'>
          <TouchableOpacity>
            <Ionicons name='search' size={24} color='white' />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
            <Image
              source={avatar}
              className='w-9 h-9 rounded-full'
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Status Row (Stories) */}
      <View className='bg-[#1A1A1A] py-4'>
        <FlatList
          horizontal
          data={[
            { id: 'my', name: 'My status', isOwn: true },
            ...chats.slice(0, 5),
          ]}
          keyExtractor={(item) => item.id || item._id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16 }}
          renderItem={({ item }) => (
            <TouchableOpacity className='items-center mr-4'>
              <Image
                source={{ uri: 'https://via.placeholder.com/150' }}
                className='w-16 h-16 rounded-full border-2 border-[#24786D]'
              />
              <Text className='text-white text-xs mt-1'>
                {item.name || 'User'}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Chat List */}
      {isLoading ? (
        <View className='flex-1 justify-center items-center'>
          <ActivityIndicator size='large' color='#24786D' />
        </View>
      ) : (
        <FlatList
          data={chats}
          keyExtractor={(item) => item._id}
          renderItem={renderChatItem}
          ListEmptyComponent={
            <View className='flex-1 justify-center items-center mt-20'>
              <Text className='text-gray-400 text-lg'>No chats yet</Text>
              <Text className='text-gray-500 text-sm mt-2'>
                Start a conversation!
              </Text>
            </View>
          }
        />
      )}

      {/* Floating Action Button */}
      <TouchableOpacity
        className='absolute bottom-20 right-6 bg-[#24786D] w-14 h-14 rounded-full items-center justify-center shadow-lg'
        onPress={() => navigation.navigate('NewChat')} // পরে তৈরি করব
      >
        <Ionicons name='chatbubble-ellipses' size={28} color='white' />
      </TouchableOpacity>

      {/* Bottom Navigation */}
      <View className='flex-row justify-around bg-[#1A1A1A] py-3 border-t border-gray-800 absolute bottom-0 left-0 right-0'>
        <TouchableOpacity className='items-center'>
          <Ionicons name='chatbubble-ellipses' size={28} color='#24786D' />
          <Text className='text-[#24786D] text-xs mt-1'>Message</Text>
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
