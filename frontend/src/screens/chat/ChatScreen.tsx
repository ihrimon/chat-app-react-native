import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Image,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useAuthStore } from '../../store/auth.store';
import { useChatStore } from '../../store/chat.store';
import { chatAPI } from '../../api/chat.api';

interface Message {
  _id: string;
  text: string;
  senderId: string;
  createdAt: string;
}

export default function ChatScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { user } = useAuthStore();
  const { updateLastMessage } = useChatStore();

  const { chatId, user: otherUser } = route.params || {};

  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  // Load previous messages when screen opens
  useEffect(() => {
    if (!chatId) return;

    const loadMessages = async () => {
      setLoading(true);
      try {
        const response = await chatAPI.getMessages(chatId);
        const fetchedMessages = response.data || response || [];
        setMessages(fetchedMessages);
        setTimeout(
          () => flatListRef.current?.scrollToEnd({ animated: true }),
          100,
        );
      } catch (error) {
        console.error('Failed to load messages:', error);
      } finally {
        setLoading(false);
      }
    };

    loadMessages();
  }, [chatId]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !chatId || !user) return;

    const messageText = newMessage.trim();
    setNewMessage('');

    // Optimistic UI Update
    const optimisticMsg: Message = {
      _id: `temp_${Date.now()}`,
      text: messageText,
      senderId: user.id,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, optimisticMsg]);
    flatListRef.current?.scrollToEnd({ animated: true });

    try {
      const response = await chatAPI.sendMessage(chatId, messageText);

      // Update last message in chat list
      updateLastMessage(chatId, {
        text: messageText,
        senderId: user.id,
        createdAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Failed to send message:', error);
      // Remove optimistic message if failed
      setMessages((prev) => prev.filter((m) => m._id !== optimisticMsg._id));
    }
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isMyMessage = item.senderId === user?.id;

    return (
      <View
        className={`flex-row ${isMyMessage ? 'justify-end' : 'justify-start'} mb-3 px-4`}
      >
        <View
          className={`max-w-[78%] px-4 py-3 rounded-2xl ${
            isMyMessage ? 'bg-[#24786D]' : 'bg-[#2A2A2A]'
          }`}
        >
          <Text
            className={`text-[16px] ${isMyMessage ? 'text-white' : 'text-white'}`}
          >
            {item.text}
          </Text>
          <Text
            className={`text-[10px] mt-1 text-right ${isMyMessage ? 'text-white/70' : 'text-gray-400'}`}
          >
            {new Date(item.createdAt).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className='flex-1 bg-[#0F0F0F]'
    >
      <View className='flex-1'>
        {/* Header */}
        <View className='flex-row items-center px-4 pt-12 pb-4 bg-[#1A1A1A]'>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className='mr-3'
          >
            <Ionicons name='arrow-back' size={28} color='white' />
          </TouchableOpacity>

          <Image
            source={{
              uri: otherUser?.avatar || 'https://via.placeholder.com/150',
            }}
            className='w-10 h-10 rounded-full'
          />

          <View className='ml-3 flex-1'>
            <Text className='text-white font-semibold text-lg'>
              {otherUser?.name || 'Chat'}
            </Text>
            <Text className='text-green-500 text-xs'>● Online</Text>
          </View>

          <TouchableOpacity>
            <Ionicons name='call' size={24} color='#24786D' />
          </TouchableOpacity>
        </View>

        {/* Messages Area */}
        {loading ? (
          <View className='flex-1 justify-center items-center'>
            <ActivityIndicator size='large' color='#24786D' />
          </View>
        ) : (
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => item._id}
            renderItem={renderMessage}
            contentContainerStyle={{ paddingVertical: 16, paddingBottom: 100 }}
            showsVerticalScrollIndicator={false}
          />
        )}

        {/* Message Input Bar */}
        <View className='flex-row items-center px-4 py-3 bg-[#1A1A1A] border-t border-gray-800'>
          <View className='flex-1 flex-row items-center bg-[#2A2A2A] rounded-full px-4'>
            <TextInput
              value={newMessage}
              onChangeText={setNewMessage}
              placeholder='Type a message...'
              placeholderTextColor='#888'
              className='flex-1 text-white py-3 text-base'
              multiline
              maxLength={500}
            />
          </View>

          <TouchableOpacity
            onPress={sendMessage}
            disabled={!newMessage.trim()}
            className={`ml-3 w-11 h-11 rounded-full items-center justify-center ${
              newMessage.trim() ? 'bg-[#24786D]' : 'bg-gray-600'
            }`}
          >
            <Ionicons name='send' size={22} color='white' />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
