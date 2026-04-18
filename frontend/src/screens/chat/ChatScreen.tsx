// src/screens/chat/ChatScreen.tsx
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

  // Load messages
  useEffect(() => {
    if (!chatId) return;

    const loadMessages = async () => {
      setLoading(true);
      try {
        const res = await chatAPI.getMessages(chatId);
        const loadedMessages = res.data?.data || res.data || [];
        setMessages(loadedMessages);
        flatListRef.current?.scrollToEnd({ animated: false });
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

    // Optimistic Update
    const optimisticMessage: Message = {
      _id: `temp_${Date.now()}`,
      text: messageText,
      senderId: user.id,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, optimisticMessage]);
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
      console.error('Send message failed:', error);
      // Remove optimistic message if failed
      setMessages((prev) =>
        prev.filter((m) => m._id !== optimisticMessage._id),
      );
    }
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isMyMessage = item.senderId === user?.id;

    return (
      <View
        className={`flex-row mb-3 px-4 ${isMyMessage ? 'justify-end' : 'justify-start'}`}
      >
        <View
          className={`max-w-[78%] px-4 py-3 rounded-2xl ${
            isMyMessage
              ? 'bg-[#24786D] rounded-br-none'
              : 'bg-[#2A2A2A] rounded-bl-none'
          }`}
        >
          <Text className='text-white text-[16px] leading-5'>{item.text}</Text>
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
      {/* Header */}
      <View className='flex-row items-center px-4 pt-12 pb-4 bg-[#1A1A1A]'>
        <TouchableOpacity onPress={() => navigation.goBack()} className='mr-3'>
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
            {otherUser?.name}
          </Text>
          <Text className='text-green-400 text-xs'>● Online</Text>
        </View>
      </View>

      {/* Messages */}
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
          contentContainerStyle={{ paddingVertical: 16, paddingBottom: 80 }}
        />
      )}

      {/* Input Area */}
      <View className='flex-row items-center px-4 py-3 bg-[#1A1A1A] border-t border-gray-800'>
        <View className='flex-1 bg-[#2A2A2A] rounded-full px-4 flex-row items-center'>
          <TextInput
            value={newMessage}
            onChangeText={setNewMessage}
            placeholder='Type a message...'
            placeholderTextColor='#888'
            className='flex-1 text-white py-3 text-base'
            multiline
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
    </KeyboardAvoidingView>
  );
}
