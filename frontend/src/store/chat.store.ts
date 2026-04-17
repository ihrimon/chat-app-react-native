// src/store/chat.store.ts
import { create } from 'zustand';
import { chatAPI } from '../api/chat.api';

interface Chat {
  _id: string;
  members: string[];
  lastMessage?: {
    text: string;
    senderId: string;
    createdAt: string;
  };
  unreadCount?: number;
  updatedAt: string;
  otherUser?: {
    _id: string;
    name: string;
    avatar?: string;
    isOnline?: boolean;
  };
}

interface ChatStore {
  chats: Chat[];
  isLoading: boolean;
  error: string | null;

  fetchChats: () => Promise<void>;
  setChats: (chats: Chat[]) => void;
  addNewChat: (chat: Chat) => void;
  updateLastMessage: (chatId: string, message: any) => void;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  chats: [],
  isLoading: false,
  error: null,

  fetchChats: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await chatAPI.getChats();
      
      set({
        chats: data.data || data || [],
        isLoading: false,
      });
    } catch (error: any) {
      console.error('Failed to fetch chats:', error);
      set({
        error: error.response?.data?.message || 'Failed to load chats',
        isLoading: false,
      });
    }
  },

  setChats: (chats) => set({ chats }),

  addNewChat: (chat) => {
    set((state) => ({
      chats: [chat, ...state.chats.filter((c) => c._id !== chat._id)],
    }));
  },

  updateLastMessage: (chatId, message) => {
    set((state) => ({
      chats: state.chats.map((chat) =>
        chat._id === chatId
          ? {
              ...chat,
              lastMessage: message,
              updatedAt: new Date().toISOString(),
            }
          : chat,
      ),
    }));
  },
}));
