export const ENV = {
  APP_NAME: 'Talkify',
  API_URL: process.env.EXPO_PUBLIC_API_URL,
  SOCKET_URL: process.env.EXPO_PUBLIC_SOCKET_URL,
  NODE_ENV: process.env.NODE_ENV !== 'production',
  API_TIMEOUT: 15000, // 15 seconds
};

