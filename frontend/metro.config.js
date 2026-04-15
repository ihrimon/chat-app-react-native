const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

// NativeWind Configuration
const nativeWindConfig = withNativeWind(config, {
  input: './global.css',
});

// Zustand and React Native Web support
nativeWindConfig.resolver.unstable_conditionNames = [
  'browser',
  'require',
  'react-native',
];

module.exports = nativeWindConfig;
