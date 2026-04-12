// Client → Server events
export const SOCKET_EVENTS = {
  // Connection
  SETUP: 'setup',
  DISCONNECT: 'disconnect',

  // Chat
  JOIN_CHAT: 'join_chat',
  LEAVE_CHAT: 'leave_chat',

  // Message
  SEND_MESSAGE: 'send_message',
  RECEIVE_MESSAGE: 'receive_message',
  MESSAGE_DELIVERED: 'message_delivered',

  // Typing
  TYPING: 'typing',
  STOP_TYPING: 'stop_typing',

  // Presence
  USER_ONLINE: 'user_online',
  USER_OFFLINE: 'user_offline',
} as const;
