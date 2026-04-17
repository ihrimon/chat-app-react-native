import api from './axios';

export const chatAPI = {
  // Get all chats of current user
  getChats: async () => {
    const response = await api.get('/chats');
    return response.data;
  },

  // Create or get 1-to-1 chat with another user
  createOrGetChat: async (receiverId: string) => {
    const response = await api.post('/chats', { receiverId });
    return response.data;
  },

  // Get messages of a specific chat
  getMessages: async (chatId: string) => {
    const response = await api.get(`/messages/${chatId}`);
    return response.data;
  },

  // Send a message
  sendMessage: async (chatId: string, text: string) => {
    const response = await api.post('/messages', { chatId, text });
    return response.data;
  },
};
